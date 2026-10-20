Convert the attached German manga pages into a single valid JSON object for my flashcard app.

Return JSON only. Do not wrap it in markdown. Do not add commentary.

Output schema:

{
  "type": "kotoba-custom-deck",
  "schemaVersion": 1,
  "deckId": "[stable-lowercase-id-like-manga-title-ch01]",
  "displayName": "[human-friendly deck name]",
  "sourceTitle": "[manga title / volume if known]",
  "chapter": "[chapter label if known]",
  "notes": "[short extraction note]",
  "cards": [
    {
      "id": "[unique-card-id]",
      "german_term": "[target word or phrase]",
      "english_term": "[english meaning, use ; between synonyms only if needed]",
      "german_example": "[full natural German sentence from the page containing the target term]",
      "english_example": "[natural English translation of the full sentence]",
      "tags": ["[optional tag 1]", "[optional tag 2]"],
      "sourcePage": 1
    }
  ]
}

Hard rules:

1. Return strict valid JSON only.
2. Preserve German umlauts and ß correctly.
3. Extract only vocabulary that is clearly readable and genuinely present on the page.
4. Skip names, broken OCR, pure sound effects, isolated labels, and decorative text unless they are useful vocabulary.
5. Every card must have `german_term`, `english_term`, `german_example`, and `english_example`.
6. `german_example` must be a real complete grammatical sentence, not a fragment, not an opposite pair, not a heading.
7. The target term must appear in the German example sentence.
8. For nouns, include the article in `german_term`, for example `der Hund`, `die Frage`, `das Zimmer`.
9. For verbs, use the infinitive in `german_term`. If reflexive, include `sich`.
10. Keep English concise and natural, not literal unless literal is necessary.
11. If a sentence or word is too unclear to trust, omit it.
12. Prefer useful, reusable vocabulary over one-off obscure items.
13. Do not invent audio URLs.

Quality bar:

- Aim for cards that can be used in normal mode, reverse mode, sentence mode, and case-practice mode.
- That means the German sentence must be natural and the English sentence must translate the whole sentence.
- If the page only gives a fragment and not a real sentence, skip it.

Selection guidance:

- Prefer verbs, nouns, adjectives, adverbs, common set phrases, and short dialogue chunks.
- Avoid duplicate cards unless the meaning is genuinely different.
- If multiple cards come from one sentence, keep only the strongest 1-3 items instead of over-splitting.

Before finalizing, self-check:

- Is the JSON valid?
- Does every card have all four required fields?
- Does every `german_example` sound like a real sentence?
- Does every target term appear in the German example?
- Are the translations plausible and readable?
