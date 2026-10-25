"""Convert the supplied Common German Conversation Connectors Anki deck."""

import argparse
import html
import json
import re
import sqlite3
import zipfile
from pathlib import Path


SOURCE_URL = "https://ankiweb.net/shared/info/2297788233"

# The 2012 Anki package already contains U+FFFD in several notes. These
# replacements also fix a few plainly malformed translations in the source.
CORRECTIONS = {
    "I don't know exactly": "Ich wei\u00df nicht genau",
    "the way I see it is that": "So wie ich das sehe, ...",
    "I don't have a big interest in that": "Ich habe kein gro\u00dfes Interesse daran",
    "that isn't such a big problem": "Das ist kein gro\u00dfes Problem",
    "that is a matter of opinion": "Das ist eine Frage der Meinung",
    "as far as I know": "Soweit ich wei\u00df",
    "I haven't thought about it before, but": "Dar\u00fcber habe ich noch nicht nachgedacht, aber",
    "I have my own opinion on it, but": "Ich habe meine eigene Meinung dazu, aber",
    "understandably": "Verst\u00e4ndlicherweise",
    "anyway": "Na ja",
    "well, as a matter of fact": "Nun, tats\u00e4chlich",
    "I would like you to know that": "Ich m\u00f6chte, dass du wei\u00dft, dass",
    "I am afraid that": "Ich f\u00fcrchte, dass",
    "actually": "Tats\u00e4chlich",
    "all joking aside": "Spa\u00df beiseite",
    "one hundred percent": "Hundertprozentig",
    "that isn't true at all": "Das ist \u00fcberhaupt nicht wahr",
    "that is an exaggeration": "Das ist eine \u00dcbertreibung",
    "that's one way to say it": "Das kann man so sagen",
    "and what's more": "Und au\u00dferdem",
    "while I am already talking about it": "Da wir gerade dar\u00fcber sprechen",
    "I would like to emphasise that": "Ich m\u00f6chte betonen, dass",
    "should I explain in greater detail?": "Soll ich das n\u00e4her erl\u00e4utern?",
    "allow me to say it another way": "Lass es mich anders ausdr\u00fccken",
    "that is to say": "Das hei\u00dft",
    "to say it another way": "Anders ausgedr\u00fcckt",
    "my wife pointed out that": "Meine Frau wies darauf hin, dass",
    "recently, I heard that": "K\u00fcrzlich h\u00f6rte ich, dass",
    "my better half said": "Meine bessere H\u00e4lfte sagte",
    "now it occurs to me that": "Jetzt f\u00e4llt mir ein, dass",
    "by the way": "\u00dcbrigens",
    "I have an interesting story about it": "Ich habe eine interessante Geschichte dazu",
    "and besides that": "Und au\u00dferdem",
    "that is all for now": "Das war's f\u00fcrs Erste",
    "to sum up": "Zusammenfassend",
    "would you be interested in us talking about something else?": "M\u00f6chtest du, dass wir \u00fcber etwas anderes sprechen?",
}


def clean_field(value):
    value = html.unescape(re.sub(r"<[^>]+>", "", value))
    return re.sub(r"\s+", " ", value.replace("\u00a0", " ")).strip()


def convert(source):
    with zipfile.ZipFile(source) as package:
        if json.loads(package.read("media")):
            raise ValueError("Unexpected media in source deck")
        connection = sqlite3.connect(":memory:")
        connection.deserialize(package.read("collection.anki2"))

    rows = connection.execute("SELECT id, flds FROM notes ORDER BY id").fetchall()
    cards = []
    for index, (note_id, fields) in enumerate(rows):
        english, german = map(clean_field, fields.split("\x1f"))
        german = CORRECTIONS.get(english, german)
        if not english or not german or "\ufffd" in german:
            raise ValueError(f"Unusable note {note_id}: {english!r} / {german!r}")
        cards.append({
            "id": f"speech-connectors-{note_id}",
            "question": english,
            "answer": [german],
            "speechDeckType": "connectors",
            "sourceOrder": index,
        })

    if len(cards) != 92 or len({card["id"] for card in cards}) != len(cards):
        raise ValueError(f"Expected 92 unique cards, got {len(cards)}")
    return {"name": "Speech - Connectors", "source": SOURCE_URL, "cards": cards}


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("apkg", type=Path)
    parser.add_argument("--output", type=Path, default=Path(__file__).resolve().parents[1] / "data" / "speech_connectors.json")
    args = parser.parse_args()
    args.output.write_text(json.dumps(convert(args.apkg), ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Wrote {args.output}")
