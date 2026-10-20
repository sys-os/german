#!/usr/bin/env python3
"""Convert the user-supplied German Conversation Connectors Anki deck."""

import argparse
import html
import json
import re
import sqlite3
import tempfile
import zipfile
from pathlib import Path


FIELD_SEPARATOR = "\x1f"
BREAK_RE = re.compile(r"<br\s*/?>", re.IGNORECASE)
TAG_RE = re.compile(r"<[^>]+>")
WHITESPACE_RE = re.compile(r"\s+")

GERMAN_CORRECTIONS = {
    "Hundert prozentig": "Hundertprozentig",
    "Ich hoffe es ist nur eine Frage der Zeit": "Ich hoffe, es ist nur eine Frage der Zeit",
    "das wird sich noch raus stellen": "das wird sich noch herausstellen",
    "Um es zusammen zu fassen": "Um es zusammenzufassen",
    "Ich möchte dass du weisst, dass": "Ich möchte, dass du weißt, dass",
    "und ausserdem": "und außerdem",
    "Soll ich es genauer erklären": "Soll ich es genauer erklären?",
    "Das klingt als": "Das klingt, als ob",
    "Meiner Meinung nach": "Meiner Meinung nach",
    "Ich weiss nicht genau": "Ich weiß nicht genau",
    "wie du vielleicht weisst": "wie du vielleicht weißt",
    "Wie du bereits weisst": "Wie du bereits weißt",
    "Das ist meinungssache": "Das ist Meinungssache",
    "soweit ich weiss": "soweit ich weiß",
    "Es stimmt meistens that": "Es stimmt meistens, dass",
    "Man weiss nie, aber": "Man weiß nie, aber",
}

ENGLISH_CORRECTIONS = {
    "in my opinon": "in my opinion",
}


def clean_field(value):
    value = BREAK_RE.sub(" ", str(value or ""))
    value = TAG_RE.sub("", value)
    return WHITESPACE_RE.sub(" ", html.unescape(value).replace("\xa0", " ")).strip()


def answer_variants(value):
    variants = [value]
    if "/" in value:
        variants.extend(part.strip() for part in value.split("/") if part.strip())
    return list(dict.fromkeys(variant for variant in variants if variant))


def locate_collection(archive):
    for candidate in ("collection.anki21", "collection.anki2"):
        if candidate in archive.namelist():
            return candidate
    raise ValueError("The package does not contain an Anki collection database.")


def read_cards(database_path):
    connection = sqlite3.connect(database_path)
    try:
        models = json.loads(connection.execute("SELECT models FROM col").fetchone()[0])
        rows = connection.execute(
            """
            SELECT n.id, n.guid, n.mid, n.flds, n.tags
            FROM notes n
            ORDER BY n.id
            """
        ).fetchall()
    finally:
        connection.close()

    cards = []
    card_by_german = {}
    for source_order, (note_id, guid, model_id, raw_fields, raw_tags) in enumerate(rows):
        model = models[str(model_id)]
        field_names = [field["name"] for field in model["flds"]]
        fields = dict(zip(field_names, raw_fields.split(FIELD_SEPARATOR)))
        original_german = clean_field(fields.get("Front"))
        original_english = clean_field(fields.get("Back"))
        if not original_german or not original_english:
            continue

        german = GERMAN_CORRECTIONS.get(original_german, original_german)
        english = ENGLISH_CORRECTIONS.get(original_english, original_english)
        existing_card = card_by_german.get(german.casefold())
        if existing_card:
            existing_card["answer"] = list(dict.fromkeys([
                *existing_card["answer"],
                *answer_variants(english),
            ]))
            existing_card["meaning"] = " / ".join(existing_card["answer"])
            existing_card["sourceEnglish"] = " / ".join(filter(None, [existing_card["sourceEnglish"], original_english]))
            continue

        card = {
            "id": f"conversation-connector-{guid or note_id}",
            "question": german,
            "answer": answer_variants(english),
            "meaning": english,
            "germanAnswers": [german],
            "connectorDeckType": "conversation-connector",
            "sourceOrder": source_order,
            "sourceGerman": original_german,
            "sourceEnglish": original_english,
            "tags": raw_tags.split(),
        }
        cards.append(card)
        card_by_german[german.casefold()] = card
    return cards


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("apkg", type=Path, help="Path to German_Conversation_Connectors.apkg")
    parser.add_argument("--output", type=Path, default=Path("data/conversation_connectors.json"))
    args = parser.parse_args()

    with zipfile.ZipFile(args.apkg) as archive, tempfile.TemporaryDirectory(ignore_cleanup_errors=True) as temp_dir:
        collection_name = locate_collection(archive)
        archive.extract(collection_name, temp_dir)
        cards = read_cards(Path(temp_dir) / collection_name)

    payload = {
        "name": "German Conversation Connectors",
        "cardCount": len(cards),
        "source": {
            "title": "Conversation connectors - Benny Lewis",
            "format": "User-supplied Anki package",
            "rights": "No redistribution license was included with the package.",
        },
        "cards": cards,
    }
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"{args.output.name}: {len(cards)} cards")


if __name__ == "__main__":
    main()
