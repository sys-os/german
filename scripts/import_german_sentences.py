#!/usr/bin/env python3
"""Convert the German Sentences Anki deck into Kotoba sentence decks."""

import argparse
import html
import json
import re
import sqlite3
import tempfile
import zipfile
from pathlib import Path


FIELD_SEPARATOR = "\x1f"
READ_MODEL_NAME = "0 Neri's Sentences (Read)"
SPEAK_MODEL_NAME = "0 Neri's Sentences (Speak)"
SOUND_RE = re.compile(r"\[sound:([^\]]+)\]", re.IGNORECASE)
BREAK_RE = re.compile(r"<br\s*/?>", re.IGNORECASE)
TAG_RE = re.compile(r"<[^>]+>")
WHITESPACE_RE = re.compile(r"[ \t]+")


def clean_field(value):
    value = BREAK_RE.sub("\n", str(value or ""))
    value = TAG_RE.sub("", value)
    value = html.unescape(value).replace("\xa0", " ")
    lines = [WHITESPACE_RE.sub(" ", line).strip() for line in value.splitlines()]
    return "\n".join(line for line in lines if line)


def answer_variants(value):
    cleaned = clean_field(value)
    return list(dict.fromkeys(line for line in cleaned.splitlines() if line))


def matching_key(value):
    return re.sub(r"[^\wäöüß]+", " ", value.casefold()).strip()


def word_count_from_deck(deck_name):
    match = re.search(r"::([234])$", deck_name)
    return int(match.group(1)) if match else None


def source_metadata(name, card_count):
    return {
        "name": name,
        "cardCount": card_count,
        "source": {
            "title": "German Sentences",
            "url": "https://ankiweb.net/shared/info/785874566",
            "sharedId": 785874566,
            "updated": "2024-03-08",
            "rights": "Neri, 2021. All rights reserved.",
        },
    }


def locate_collection(archive):
    for candidate in ("collection.anki21", "collection.anki2"):
        if candidate in archive.namelist():
            return candidate
    raise ValueError("The package does not contain an Anki collection database.")


def read_notes(database_path):
    connection = sqlite3.connect(database_path)
    try:
        models_json, decks_json = connection.execute("SELECT models, decks FROM col").fetchone()
        models = json.loads(models_json)
        decks = json.loads(decks_json)
        rows = connection.execute(
            """
            SELECT n.id, n.guid, n.mid, n.flds, n.tags, c.did, c.due
            FROM notes n
            JOIN cards c ON c.nid = n.id
            ORDER BY c.due, n.id
            """
        ).fetchall()
    finally:
        connection.close()

    notes = []
    for note_id, guid, model_id, raw_fields, raw_tags, deck_id, due in rows:
        model_name = models[str(model_id)]["name"]
        if model_name not in (READ_MODEL_NAME, SPEAK_MODEL_NAME):
            continue

        fields = raw_fields.split(FIELD_SEPARATOR)
        if len(fields) < 7:
            continue

        notes.append({
            "id": note_id,
            "guid": guid,
            "model": model_name,
            "fields": fields,
            "tags": raw_tags.split(),
            "deck": decks[str(deck_id)]["name"],
            "due": due,
        })
    return notes


def build_decks(notes):
    read_audio_by_variant = {}
    for note in notes:
        if note["model"] != READ_MODEL_NAME:
            continue
        sound_match = SOUND_RE.search(note["fields"][5])
        if not sound_match:
            continue
        for variant in answer_variants(note["fields"][0]):
            read_audio_by_variant[matching_key(variant)] = sound_match.group(1)

    decks = {"read": [], "speak": []}
    for source_order, note in enumerate(notes):
        german_variants = answer_variants(note["fields"][0])
        english_variants = answer_variants(note["fields"][1])
        if not german_variants or not english_variants:
            continue

        sound_match = SOUND_RE.search(note["fields"][5])
        audio_name = sound_match.group(1) if sound_match else ""
        if note["model"] == SPEAK_MODEL_NAME and not audio_name:
            audio_name = next(
                (read_audio_by_variant[key] for key in map(matching_key, german_variants) if key in read_audio_by_variant),
                "",
            )

        is_read = note["model"] == READ_MODEL_NAME
        deck_key = "read" if is_read else "speak"
        question_variants = german_variants if is_read else english_variants
        accepted_answers = english_variants if is_read else german_variants
        card = {
            "id": f"anki-sentence-{deck_key}-{note['guid'] or note['id']}",
            "question": " / ".join(question_variants),
            "answer": accepted_answers,
            "meaning": " / ".join(accepted_answers),
            "germanAnswers": german_variants,
            "germanExample": " / ".join(german_variants),
            "englishSentencePrompt": " / ".join(english_variants),
            "sentenceAudioUrl": f"audio/german_sentences/{audio_name}" if audio_name else "",
            "sentenceDeckType": deck_key,
            "sentenceWordCount": word_count_from_deck(note["deck"]),
            "sourceOrder": source_order,
            "tags": note["tags"],
        }
        decks[deck_key].append(card)
    return decks


def extract_audio(archive, media_map, referenced_audio, output_directory):
    output_directory.mkdir(parents=True, exist_ok=True)
    archive_name_by_media_name = {media_name: archive_name for archive_name, media_name in media_map.items()}
    missing = sorted(referenced_audio - archive_name_by_media_name.keys())
    if missing:
        raise ValueError(f"Missing {len(missing)} referenced audio files from the package.")

    for media_name in sorted(referenced_audio):
        archive_name = archive_name_by_media_name[media_name]
        target = output_directory / Path(media_name).name
        target.write_bytes(archive.read(archive_name))


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("apkg", type=Path, help="Path to German_Sentences.apkg")
    parser.add_argument("--output", type=Path, default=Path("data"), help="JSON output directory")
    parser.add_argument(
        "--audio-output",
        type=Path,
        default=Path("audio/german_sentences"),
        help="Extracted audio output directory",
    )
    args = parser.parse_args()

    args.output.mkdir(parents=True, exist_ok=True)
    with zipfile.ZipFile(args.apkg) as archive, tempfile.TemporaryDirectory(ignore_cleanup_errors=True) as temp_dir:
        collection_name = locate_collection(archive)
        archive.extract(collection_name, temp_dir)
        notes = read_notes(Path(temp_dir) / collection_name)
        decks = build_decks(notes)

        referenced_audio = {
            Path(card["sentenceAudioUrl"]).name
            for cards in decks.values()
            for card in cards
            if card["sentenceAudioUrl"]
        }
        media_map = json.loads(archive.read("media"))
        extract_audio(archive, media_map, referenced_audio, args.audio_output)

    outputs = (
        ("sentences_read.json", "German Sentences - Read", decks["read"]),
        ("sentences_speak.json", "German Sentences - Speak", decks["speak"]),
    )
    for file_name, display_name, cards in outputs:
        payload = {**source_metadata(display_name, len(cards)), "cards": cards}
        (args.output / file_name).write_text(
            json.dumps(payload, ensure_ascii=False, indent=2) + "\n",
            encoding="utf-8",
        )
        audio_count = sum(bool(card["sentenceAudioUrl"]) for card in cards)
        print(f"{file_name}: {len(cards)} cards, {audio_count} with audio")


if __name__ == "__main__":
    main()
