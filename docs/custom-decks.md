# Custom Deck Import Pipeline

Custom decks are imported from JSON through the `Import JSON Deck` button in the settings panel. Imported decks are stored in browser `localStorage`, appear in the deck selector under `Custom`, and work with the same quiz modes as the built-in decks.

## Recommended File Format

Use this JSON shape:

```json
{
  "type": "kotoba-custom-deck",
  "schemaVersion": 1,
  "deckId": "my-manga-ch01",
  "displayName": "My Manga Chapter 1",
  "sourceTitle": "My Manga Volume 1",
  "chapter": "Chapter 1",
  "notes": "Vocabulary extracted from pages 1-18.",
  "cards": [
    {
      "id": "p003-01",
      "german_term": "der Bahnhof",
      "english_term": "train station",
      "german_example": "Wir warten am Bahnhof auf den Zug.",
      "english_example": "We are waiting at the train station for the train.",
      "tags": ["chapter-1", "noun"],
      "sourcePage": 3
    }
  ]
}
```

## Required Card Fields

- `german_term`: the quiz prompt term. For nouns, include the article, for example `der Bahnhof`.
- `english_term`: the English meaning. Use `;` between accepted synonyms if needed.
- `german_example`: a real full German sentence containing the target term.
- `english_example`: a natural English translation of the full sentence.

## Optional Card Fields

- `id`
- `tags`
- `notes`
- `sourcePage`
- `wordAudioUrl`
- `sentenceAudioUrl`

If `wordAudioUrl` is omitted, the app will try to reuse built-in word audio automatically when `german_term` matches a term in the built-in Vocabeo decks.

## Rules For Manga Extraction

- Only include vocabulary that actually appears on the page.
- Skip names, sound effects, broken OCR, page furniture, and decorative text unless they are genuinely useful study items.
- `german_example` must be a complete grammatical sentence, not a fragment, opposite pair, label, or dictionary stub.
- The target term should appear inside `german_example`.
- Use dictionary form where possible:
  - Nouns with article: `der Hund`, `die Tasche`, `das Fenster`
  - Verbs in infinitive: `gehen`, `mitkommen`, `sich erinnern`
  - Adjectives/adverbs in base form
- If a page does not provide enough context for a reliable sentence translation, skip that card instead of guessing.

## Mode Compatibility

To work well in every mode:

- Keep `german_term` and `english_term` accurate for normal and reverse mode.
- Always provide `german_example` and `english_example` for sentence mode and case practice mode.
- Keep the sentence natural enough that article/case blanks still make sense when the case-practice mode removes a word.

## Import Workflow

1. Generate a JSON file in the format above.
2. Open `german-main` in the browser.
3. Click `Import JSON Deck`.
4. Select the generated file.
5. Choose the imported deck from the selector under `Custom`.

## AI Prompt

Use the prompt in [manga-deck-prompt.md](C:/Users/Z/Downloads/kotoba-master/kotoba-master/german-main/docs/manga-deck-prompt.md).
