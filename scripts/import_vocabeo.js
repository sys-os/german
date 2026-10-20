const fs = require('fs');
const path = require('path');
const https = require('https');
const zlib = require('zlib');

const ASSETS_HOST = 'https://assets.vocabeo.com';
const OUTPUT_DIR = path.resolve(__dirname, '..', 'data');

const LEVEL_ORDER = ['A1', 'A2', 'B1', 'NOLEVEL'];
const LEVEL_TO_FILE = {
  A1: 'vocabeo_a1',
  A2: 'vocabeo_a2',
  B1: 'vocabeo_b1',
  NOLEVEL: 'vocabeo_nolevel',
};

function fetchBuffer(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      if (
        response.statusCode &&
        response.statusCode >= 300 &&
        response.statusCode < 400 &&
        response.headers.location
      ) {
        response.resume();
        resolve(fetchBuffer(response.headers.location));
        return;
      }

      if (response.statusCode !== 200) {
        reject(new Error(`HTTP ${response.statusCode} for ${url}`));
        response.resume();
        return;
      }

      const chunks = [];
      response.on('data', (chunk) => chunks.push(chunk));
      response.on('end', () => resolve(Buffer.concat(chunks)));
      response.on('error', reject);
    }).on('error', reject);
  });
}

function getWordText(base) {
  return (base.syllables || []).map((syllable) => syllable.syllable || '').join('');
}

function getWordId(entry) {
  const word = getWordText(entry.base);
  switch (entry['@type']) {
    case 'Adjective':
      return `adj/${word}`;
    case 'Adverb':
      return `adv/${word}`;
    case 'Article':
      return `art/${word}`;
    case 'Conjunction':
      return `conj/${word}`;
    case 'Interjection':
      return `inter/${word}`;
    case 'Noun':
      return `noun/${getArticle(entry.genus)}-${word}`;
    case 'Num':
      return `num/${word}`;
    case 'Preposition':
      return `prep/${word}`;
    case 'Pronoun':
      return `pron/${word}`;
    case 'Verb':
      return entry.base.displayWord
        ? `verb/${entry.base.displayWord.replace(/\s/g, '-')}`
        : `verb/${word}`;
    default:
      throw new Error(`Unsupported word type: ${entry['@type']}`);
  }
}

function getArticle(genus) {
  switch (genus) {
    case 'MASKULINUM':
      return 'der';
    case 'FEMININUM':
      return 'die';
    case 'NEUTRUM':
      return 'das';
    default:
      throw new Error(`Unsupported noun genus: ${genus}`);
  }
}

function getQuestion(entry) {
  const word = getWordText(entry.base);
  switch (entry['@type']) {
    case 'Noun':
      return `${getArticle(entry.genus)} ${word}`;
    default:
      return entry.base.displayWord || word;
  }
}

function normalizeAudioId(wordId) {
  let normalized = wordId;
  switch (normalized) {
    case 'pron/Ihr':
      normalized = 'pron/ihr';
      break;
    case 'pron/Sie':
      normalized = 'pron/sie';
      break;
    case 'pron/Ihnen':
      normalized = 'pron/ihnen';
      break;
    default:
      break;
  }

  return normalized
    .replaceAll('/', '_')
    .replaceAll('\u00E4', 'ae')
    .replaceAll('\u00F6', 'oe')
    .replaceAll('\u00FC', 'ue')
    .replaceAll('\u00C4', 'Ae')
    .replaceAll('\u00D6', 'Oe')
    .replaceAll('\u00DC', 'Ue')
    .replaceAll('\u00DF', 'ss');
}

function createWordAudioUrl(wordId) {
  return `${ASSETS_HOST}/audio/words/${normalizeAudioId(wordId)}.mp3`;
}

function createSentenceText(sentence) {
  return sentence.parts
    .map((part) => (part['@type'] === 'WordLink' ? part.word : part.pmark))
    .join('');
}

function collectSentenceEntries(sentencesRaw) {
  return sentencesRaw.map((sentence) => ({
    id: sentence.id,
    translation: sentence.t || '',
    sentence: createSentenceText(sentence),
    imgNr: sentence.imgNr ?? null,
    wordLinks: sentence.parts.filter((part) => part['@type'] === 'WordLink'),
  }));
}

function buildSentenceMap(sentenceEntries) {
  const sentenceMap = new Map();

  for (const sentence of sentenceEntries) {
    const occurrences = new Map();
    for (const wordLink of sentence.wordLinks) {
      occurrences.set(wordLink.id, (occurrences.get(wordLink.id) || 0) + 1);
    }

    for (const wordLink of sentence.wordLinks) {
      if (!wordLink.id || wordLink.t === '-' || wordLink.i === -1) {
        continue;
      }

      if ((occurrences.get(wordLink.id) || 0) !== 1) {
        continue;
      }

      const matches = sentenceMap.get(wordLink.id) || [];
      matches.push({
        id: sentence.id,
        index: wordLink.i,
        sentence: sentence.sentence,
        translation: sentence.translation,
      });
      sentenceMap.set(wordLink.id, matches);
    }
  }

  for (const matches of sentenceMap.values()) {
    matches.sort((left, right) => left.index - right.index);
  }

  return sentenceMap;
}

function uniqueStrings(values) {
  return [...new Set(values.map((value) => value.trim()).filter(Boolean))];
}

function extractAnswers(translations) {
  return uniqueStrings(
    (translations || []).flatMap((translation) => translation.split(/[;,/]/))
  );
}

function createCard(entry, sentenceMap) {
  const wordId = getWordId(entry);
  const example = (sentenceMap.get(wordId) || [])[0];
  const translations = extractAnswers(entry.base.translations || []);
  const phonetic = entry.base.phonetic ? `Phonetic: ${entry.base.phonetic}` : '';
  const exampleMeaning = example && example.translation ? example.translation : '';
  const extraMeaning = uniqueStrings([phonetic, exampleMeaning]).join(' | ');

  return {
    id: wordId,
    question: getQuestion(entry),
    answer: translations,
    germanExample: example ? example.sentence : '',
    meaning: extraMeaning,
    wordId,
    level: entry.base.level,
    partOfSpeech: entry['@type'],
    rank: entry.base.rank,
    frequency: entry.base.frequency,
    phonetic: entry.base.phonetic || '',
    translations,
    wordAudioUrl: createWordAudioUrl(wordId),
    sentenceAudioUrl: example ? `${ASSETS_HOST}/audio/sentences/${example.id}.mp3` : '',
  };
}

function writeDeck(fileName, displayName, cards) {
  const outputPath = path.join(OUTPUT_DIR, `${fileName}.json`);
  const payload = {
    source: 'vocabeo',
    displayName,
    generatedAt: new Date().toISOString(),
    cardCount: cards.length,
    cards,
  };

  fs.writeFileSync(outputPath, `${JSON.stringify(payload, null, 2)}\n`);
  console.log(`Wrote ${cards.length} cards to ${outputPath}`);
}

async function main() {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  const [gzipBuffer] = await Promise.all([
    fetchBuffer(`${ASSETS_HOST}/ws-1.gzip`),
    fetchBuffer(`${ASSETS_HOST}/wids.json`),
  ]);

  const [wordsJson, sentencesJson] = zlib
    .gunzipSync(gzipBuffer)
    .toString('utf8')
    .split('$$$');

  const wordsRaw = JSON.parse(wordsJson);
  const sentencesRaw = JSON.parse(sentencesJson);
  const sentenceEntries = collectSentenceEntries(sentencesRaw);
  const sentenceMap = buildSentenceMap(sentenceEntries);

  const cardsByLevel = new Map();
  for (const level of LEVEL_ORDER) {
    cardsByLevel.set(level, []);
  }

  for (const entry of wordsRaw) {
    const level = entry.base.level || 'NOLEVEL';
    if (!cardsByLevel.has(level)) {
      cardsByLevel.set(level, []);
    }

    const card = createCard(entry, sentenceMap);
    if (card.question && card.answer.length > 0) {
      cardsByLevel.get(level).push(card);
    }
  }

  const decks = [];
  for (const level of LEVEL_ORDER) {
    const cards = cardsByLevel.get(level) || [];
    const fileName = LEVEL_TO_FILE[level];
    const displayName = level === 'NOLEVEL' ? 'vocabeo No Level' : `vocabeo ${level}`;

    writeDeck(fileName, displayName, cards);
    decks.push({ fileName, displayName });
  }

  const allCards = LEVEL_ORDER.flatMap((level) => cardsByLevel.get(level) || []);
  writeDeck('vocabeo_all', 'vocabeo All Levels', allCards);
  decks.unshift({ fileName: 'vocabeo_all', displayName: 'vocabeo All Levels' });

  fs.writeFileSync(
    path.join(OUTPUT_DIR, 'decks.json'),
    `${JSON.stringify(decks, null, 2)}\n`
  );
  console.log(`Updated ${path.join(OUTPUT_DIR, 'decks.json')}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
