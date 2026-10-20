#!/usr/bin/env python3
"""Convert the user-supplied Dark S01E01 Anki package into Kotoba decks."""

import argparse
import html
import json
import re
import sqlite3
import tempfile
import zipfile
from pathlib import Path


FIELD_SEPARATOR = "\x1f"
SOUND_RE = re.compile(r"\[sound:([^\]]+)]", re.IGNORECASE)
IMAGE_RE = re.compile(r"<img[^>]+src=[\"']([^\"']+)[\"']", re.IGNORECASE)
BREAK_RE = re.compile(r"<br\s*/?>", re.IGNORECASE)
TAG_RE = re.compile(r"<[^>]+>")
LEADING_SPEAKER_RE = re.compile(r"^\s*\[[^\]]+]\s*")
WHITESPACE_RE = re.compile(r"[ \t]+")


def clean_field(value):
    value = BREAK_RE.sub("\n", str(value or ""))
    value = TAG_RE.sub("", value)
    value = html.unescape(value).replace("\xa0", " ")
    lines = [WHITESPACE_RE.sub(" ", line).strip() for line in value.splitlines()]
    return "\n".join(line for line in lines if line)


def clean_required_dialogue(value):
    return LEADING_SPEAKER_RE.sub("", clean_field(value)).strip()


def context_edge(value, take_last=False):
    parts = [clean_field(part) for part in re.split(r"\s+---\s+", value or "")]
    parts = [part for part in parts if part and part != "---"]
    if not parts:
        return ""
    return parts[-1] if take_last else parts[0]


def locate_collection(archive):
    for candidate in ("collection.anki21", "collection.anki2"):
        if candidate in archive.namelist():
            return candidate
    raise ValueError("The package does not contain an Anki collection database.")


def read_notes(database_path):
    connection = sqlite3.connect(database_path)
    try:
        models_json = connection.execute("SELECT models FROM col").fetchone()[0]
        models = json.loads(models_json)
        rows = connection.execute(
            """
            SELECT n.id, n.guid, n.mid, n.flds, n.tags, c.due
            FROM notes n
            JOIN cards c ON c.nid = n.id
            ORDER BY c.due, n.id
            """
        ).fetchall()
    finally:
        connection.close()

    notes = []
    for note_id, guid, model_id, raw_fields, raw_tags, due in rows:
        model = models[str(model_id)]
        if model["name"] != "SubtitleMemorize":
            continue
        field_names = [field["name"] for field in model["flds"]]
        fields = dict(zip(field_names, raw_fields.split(FIELD_SEPARATOR)))
        notes.append({
            "id": note_id,
            "guid": guid,
            "fields": fields,
            "tags": raw_tags.split(),
            "due": due,
        })
    return notes


def referenced_media(fields):
    audio_match = SOUND_RE.search(fields.get("Audio", ""))
    image_match = IMAGE_RE.search(fields.get("Snapshot", ""))
    return (
        audio_match.group(1) if audio_match else "",
        image_match.group(1) if image_match else "",
    )


def build_decks(notes):
    decks = {"understand": [], "recall": []}
    referenced_files = set()
    episode_card_count = len(notes)

    for source_order, note in enumerate(notes):
        fields = note["fields"]
        german_display = clean_field(fields.get("Expression"))
        german_answer = clean_required_dialogue(fields.get("Expression"))
        english = clean_field(fields.get("Meaning"))
        if not german_answer or not english:
            continue

        audio_name, image_name = referenced_media(fields)
        referenced_files.update(name for name in (audio_name, image_name) if name)
        common = {
            "sequenceMarker": clean_field(fields.get("SequenceMarker")),
            "sourceOrder": source_order,
            "episodeCardCount": episode_card_count,
            "sceneImageUrl": f"media/dark_s01e01/{Path(image_name).name}" if image_name else "",
            "sentenceAudioUrl": f"media/dark_s01e01/{Path(audio_name).name}" if audio_name else "",
            "germanExample": german_display,
            "englishSentencePrompt": english,
            "contextGermanBefore": context_edge(fields.get("ContextTargetPreceding", ""), take_last=True),
            "contextGermanAfter": context_edge(fields.get("ContextTargetFollowing", "")),
            "contextEnglishBefore": context_edge(fields.get("ContextNativePreceding", ""), take_last=True),
            "contextEnglishAfter": context_edge(fields.get("ContextNativeFollowing", "")),
            "notes": clean_field(fields.get("Notes")),
            "tags": note["tags"],
        }
        key = note["guid"] or note["id"]
        decks["understand"].append({
            **common,
            "id": f"dark-understand-{key}",
            "question": german_answer,
            "answer": [english],
            "meaning": english,
            "germanAnswers": [german_answer],
            "darkDeckType": "understand",
        })
        decks["recall"].append({
            **common,
            "id": f"dark-recall-{key}",
            "question": english,
            "answer": [german_answer],
            "meaning": english,
            "germanAnswers": [german_answer],
            "darkDeckType": "recall",
        })

    return decks, referenced_files


def extract_media(archive, media_map, referenced_files, output_directory):
    output_directory.mkdir(parents=True, exist_ok=True)
    archive_name_by_media_name = {name: archive_name for archive_name, name in media_map.items()}
    missing = sorted(referenced_files - archive_name_by_media_name.keys())
    if missing:
        raise ValueError(f"Missing {len(missing)} referenced media files from the package.")

    for media_name in sorted(referenced_files):
        archive_name = archive_name_by_media_name[media_name]
        (output_directory / Path(media_name).name).write_bytes(archive.read(archive_name))


def source_metadata(name, card_count):
    return {
        "name": name,
        "cardCount": card_count,
        "source": {
            "title": "Dark TV series English-German S01E01",
            "format": "User-supplied Anki package",
            "rights": "Contains copyrighted television dialogue, audio, and still images. Do not redistribute.",
        },
    }


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("apkg", type=Path, help="Path to Dark_TV_series_english-german_S01E01.apkg")
    parser.add_argument("--output", type=Path, default=Path("data"), help="JSON output directory")
    parser.add_argument(
        "--media-output",
        type=Path,
        default=Path("media/dark_s01e01"),
        help="Extracted scene image and audio directory",
    )
    args = parser.parse_args()

    args.output.mkdir(parents=True, exist_ok=True)
    with zipfile.ZipFile(args.apkg) as archive, tempfile.TemporaryDirectory(ignore_cleanup_errors=True) as temp_dir:
        collection_name = locate_collection(archive)
        archive.extract(collection_name, temp_dir)
        notes = read_notes(Path(temp_dir) / collection_name)
        decks, referenced_files = build_decks(notes)
        media_map = json.loads(archive.read("media"))
        extract_media(archive, media_map, referenced_files, args.media_output)

    outputs = (
        ("dark_s01e01_understand.json", "Dark S01E01 - Understand", decks["understand"]),
        ("dark_s01e01_recall.json", "Dark S01E01 - Recall", decks["recall"]),
    )
    for file_name, display_name, cards in outputs:
        payload = {**source_metadata(display_name, len(cards)), "cards": cards}
        (args.output / file_name).write_text(
            json.dumps(payload, ensure_ascii=False, indent=2) + "\n",
            encoding="utf-8",
        )
        audio_count = sum(bool(card["sentenceAudioUrl"]) for card in cards)
        image_count = sum(bool(card["sceneImageUrl"]) for card in cards)
        print(f"{file_name}: {len(cards)} cards, {audio_count} audio, {image_count} images")


if __name__ == "__main__":
    main()
