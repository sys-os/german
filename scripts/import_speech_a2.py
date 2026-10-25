#!/usr/bin/env python3
"""Import the user-supplied conversational phrases APKG into Speech A2."""

import argparse
import html
import json
import re
import sqlite3
import zipfile
from pathlib import Path


FIELD_SEPARATOR = "\x1f"
SOUND_RE = re.compile(r"\[sound:([^\]]+)\]")
TAG_RE = re.compile(r"<[^>]+>")
WHITESPACE_RE = re.compile(r"\s+")
REVERSED_FRONTS = {"Wo", "Wie lange?", "Guten morgen", "Ich verstehe"}
GERMAN_CORRECTIONS = {
    "Wo Wohnst du?": "Wo wohnst du?",
    "Sprechen sie Englisch?": "Sprechen Sie Englisch?",
    "Hast du zeit?": "Hast du Zeit?",
    "Guten morgen": "Guten Morgen",
    "Gute nacht": "Gute Nacht",
    "Guten abend": "Guten Abend",
    "Kein problem": "Kein Problem",
    "Was bedautet ...": "Was bedeutet ...",
    "Wenn sie wollen": "Wenn Sie wollen",
    "Ich treffe mich mit meinen freunden und gehe dann etwas trinken": "Ich treffe mich mit meinen Freunden und gehe dann etwas trinken",
    "ich vermisse dich auch sehr": "Ich vermisse dich auch sehr",
    "ich rufe dich später an": "Ich rufe dich später an",
}


def clean_field(value):
    value = re.sub(r"<br\s*/?>", " ", value, flags=re.IGNORECASE)
    value = TAG_RE.sub("", value)
    return WHITESPACE_RE.sub(" ", html.unescape(value).replace("\xa0", " ")).strip()


def read_cards(archive, media_by_name):
    connection = sqlite3.connect(":memory:")
    try:
        connection.deserialize(archive.read("collection.anki21"))
        rows = connection.execute("SELECT id, flds FROM notes ORDER BY id").fetchall()
    finally:
        connection.close()

    cards = []
    by_german = {}
    used_media = set()
    for note_id, fields in rows:
        front, back = fields.split(FIELD_SEPARATOR)[:2]
        front_audio = SOUND_RE.findall(front)
        back_audio = SOUND_RE.findall(back)
        front = clean_field(SOUND_RE.sub("", front))
        back = clean_field(SOUND_RE.sub("", back))
        if not front or not back:
            continue

        if front in REVERSED_FRONTS:
            german, english = front, back
        else:
            german, english = back, front
        german = GERMAN_CORRECTIONS.get(german, german)
        sound = (back_audio or front_audio or [None])[0]
        if sound and sound not in media_by_name:
            raise ValueError(f"Missing packaged audio: {sound}")
        if german == "Sonntag" and sound == "Samstag.mp3":
            sound = None

        key = german.casefold()
        if key in by_german:
            existing = by_german[key]
            if sound and not existing.get("sentenceAudioUrl"):
                existing["sentenceAudioUrl"] = f"audio/speech_a2/{media_by_name[sound]}.mp3"
                existing.pop("speechFallbackText", None)
                used_media.add(sound)
            continue

        card = {
            "id": f"speech-a2-{note_id}",
            "question": english,
            "answer": [german],
            "speechDeckType": "a2",
        }
        if sound:
            card["sentenceAudioUrl"] = f"audio/speech_a2/{media_by_name[sound]}.mp3"
            used_media.add(sound)
        else:
            card["speechFallbackText"] = german
        cards.append(card)
        by_german[key] = card

    return cards, used_media


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("apkg", type=Path)
    parser.add_argument("--output", type=Path, default=Path("data/speech_a2.json"))
    parser.add_argument("--audio-dir", type=Path, default=Path("audio/speech_a2"))
    args = parser.parse_args()

    with zipfile.ZipFile(args.apkg) as archive:
        media_map = json.loads(archive.read("media"))
        media_by_name = {name: key for key, name in media_map.items()}
        cards, used_media = read_cards(archive, media_by_name)
        if len(cards) != 155:
            raise ValueError(f"Expected 155 unique phrases, found {len(cards)}")

        args.audio_dir.mkdir(parents=True, exist_ok=True)
        for sound in used_media:
            media_key = media_by_name[sound]
            (args.audio_dir / f"{media_key}.mp3").write_bytes(archive.read(media_key))

    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(
        json.dumps({"name": "Speech A2", "cards": cards}, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
    print(f"Imported {len(cards)} phrases and {len(used_media)} recordings.")


if __name__ == "__main__":
    main()
