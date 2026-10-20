#!/usr/bin/env python3
"""Convert the German Pareto Anki release into Kotoba JSON decks."""

import argparse
import html
import json
import re
import sqlite3
import tempfile
import zipfile
from pathlib import Path


WORD_MODEL_ID = 1607392319
PATTERN_CLOZE_MODEL_ID = 1607392398
PATTERN_RECOGNITION_MODEL_ID = 1607392399
CORE_DECK_ID = 1704000001
EXTENSION_DECK_ID = 1704000002
PATTERNS_DECK_ID = 1704000003
FIELD_SEPARATOR = "\x1f"
CLOZE_RE = re.compile(r"\{\{c1::(.*?)(?:::[^}]*)?\}\}")
TAG_RE = re.compile(r"\s+")
ENGLISH_OVERRIDES_PATH = Path(__file__).with_name("pareto_pattern_english_overrides.json")


def clean_text(value):
    return html.unescape(str(value or "")).strip()


def split_fields(value):
    return [clean_text(part) for part in value.split(FIELD_SEPARATOR)]


def split_tags(value):
    return [tag for tag in TAG_RE.split(value.strip()) if tag]


def source_metadata(name, card_count):
    return {
        "name": name,
        "cardCount": card_count,
        "source": {
            "title": "German Pareto Deck v0.3",
            "url": "https://github.com/gbrlpzz/german-pareto-deck",
            "release": "v0.3",
            "licenses": ["MIT (code)", "CC BY 2.0 FR (Tatoeba sentences)", "CC BY-SA 3.0 (Wiktionary/Kaikki glosses)"],
        },
    }


def word_card(note_id, guid, fields, tags):
    form, gloss, example_blanked, example_de, example_en, tier = fields
    prompt = "\n\n".join(part for part in (gloss, example_blanked) if part)
    meaning = " — ".join(part for part in (example_de, example_en) if part)
    return {
        "id": f"gp-word-{guid or note_id}",
        "question": prompt,
        "answer": [form],
        "meaning": meaning,
        "germanAnswers": [form],
        "germanExample": example_de,
        "englishSentencePrompt": example_en,
        "paretoType": "word-production",
        "paretoTier": tier,
        "tags": tags,
    }


def pattern_cloze_card(note_id, guid, fields, tags):
    sentence, translation, pattern_class = fields
    answers = [clean_text(match) for match in CLOZE_RE.findall(sentence)]
    full_sentence = CLOZE_RE.sub(lambda match: clean_text(match.group(1)), sentence)
    blanked_sentence = CLOZE_RE.sub("_____", sentence)
    prompt = "\n\n".join(part for part in (translation, blanked_sentence) if part)
    answer = " ".join(answers)
    meaning = " — ".join(part for part in (full_sentence, translation) if part)
    return {
        "id": f"gp-pattern-{guid or note_id}",
        "question": prompt,
        "answer": [answer],
        "meaning": meaning,
        "germanAnswers": [answer],
        "germanExample": full_sentence,
        "englishSentencePrompt": translation,
        "paretoType": "pattern-cloze",
        "paretoPatternClass": pattern_class,
        "tags": tags,
    }


def pattern_recognition_card(note_id, guid, fields, tags):
    chunk, sentence, translation, pattern_class = fields
    if not translation:
        blanked_sentence = re.sub(re.escape(chunk), "_____", sentence, count=1, flags=re.IGNORECASE)
        if blanked_sentence == sentence:
            blanked_sentence = f"{sentence}\n_____"
        return {
            "id": f"gp-recognition-{guid or note_id}",
            "question": blanked_sentence,
            "answer": [chunk],
            "meaning": sentence,
            "germanAnswers": [chunk],
            "germanExample": sentence,
            "englishSentencePrompt": "",
            "paretoType": "pattern-cloze",
            "paretoPatternClass": pattern_class,
            "tags": [*tags, "fallback-production"],
        }

    prompt = "\n".join(part for part in (chunk, sentence) if part)
    return {
        "id": f"gp-recognition-{guid or note_id}",
        "question": prompt,
        "answer": [translation],
        "meaning": translation,
        "germanAnswers": [chunk],
        "germanExample": sentence,
        "englishSentencePrompt": translation,
        "paretoType": "pattern-recognition",
        "paretoPatternClass": pattern_class,
        "tags": tags,
    }


def read_cards(database_path):
    decks = {CORE_DECK_ID: [], EXTENSION_DECK_ID: [], PATTERNS_DECK_ID: []}
    connection = sqlite3.connect(database_path)
    try:
        rows = connection.execute(
            """
            SELECT n.id, n.guid, n.mid, n.flds, n.tags, c.did
            FROM notes n
            JOIN cards c ON c.nid = n.id
            ORDER BY c.did, c.ord, n.id
            """
        )
        for note_id, guid, model_id, raw_fields, raw_tags, deck_id in rows:
            fields = split_fields(raw_fields)
            tags = split_tags(raw_tags)
            if model_id == WORD_MODEL_ID and deck_id in (CORE_DECK_ID, EXTENSION_DECK_ID):
                card = word_card(note_id, guid, fields, tags)
            elif model_id == PATTERN_CLOZE_MODEL_ID and deck_id == PATTERNS_DECK_ID:
                card = pattern_cloze_card(note_id, guid, fields, tags)
            elif model_id == PATTERN_RECOGNITION_MODEL_ID and deck_id == PATTERNS_DECK_ID:
                card = pattern_recognition_card(note_id, guid, fields, tags)
            else:
                continue
            decks[deck_id].append(card)
    finally:
        connection.close()
    return decks


def apply_pattern_english_overrides(cards):
    if not ENGLISH_OVERRIDES_PATH.exists():
        return

    overrides = json.loads(ENGLISH_OVERRIDES_PATH.read_text(encoding="utf-8"))
    for card in cards:
        translation = clean_text(overrides.get(card["id"]))
        if not translation or card.get("englishSentencePrompt"):
            continue

        card["question"] = f"{translation}\n\n{card['question']}"
        card["englishSentencePrompt"] = translation
        card["meaning"] = " — ".join(part for part in (card.get("germanExample"), translation) if part)
        card["englishTranslationSource"] = "machine-generated fallback"


def write_deck(output_path, name, cards):
    payload = source_metadata(name, len(cards))
    payload["cards"] = cards
    output_path.write_text(
        json.dumps(payload, ensure_ascii=False, separators=(",", ":")),
        encoding="utf-8",
    )


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("apkg", type=Path, help="Path to german-pareto-deck.apkg")
    parser.add_argument("--output", type=Path, default=Path("data"))
    args = parser.parse_args()

    args.output.mkdir(parents=True, exist_ok=True)
    with tempfile.TemporaryDirectory() as temporary_directory:
        with zipfile.ZipFile(args.apkg) as archive:
            database_name = "collection.anki21" if "collection.anki21" in archive.namelist() else "collection.anki2"
            archive.extract(database_name, temporary_directory)
        decks = read_cards(Path(temporary_directory) / database_name)

    apply_pattern_english_overrides(decks[PATTERNS_DECK_ID])

    outputs = [
        ("pareto_core.json", "German Pareto Core", decks[CORE_DECK_ID]),
        ("pareto_patterns.json", "German Pareto Patterns", decks[PATTERNS_DECK_ID]),
        ("pareto_extension.json", "German Pareto Extension", decks[EXTENSION_DECK_ID]),
    ]
    for file_name, name, cards in outputs:
        write_deck(args.output / file_name, name, cards)
        print(f"{file_name}: {len(cards)} cards")


if __name__ == "__main__":
    main()
