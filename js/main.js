console.log("Kotoba Web Quiz loading...");

// Stub wanakana (Japanese-specific) functions to safely remove dependency
const wanakana = { isKanji: () => false, toKana: (str) => str };

document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const questionEl = document.getElementById('question');
    const answerInputEl = document.getElementById('answer-input');
    const feedbackEl = document.getElementById('feedback');
    const deckSelectorEl = document.getElementById('deck-selector');
    const importCustomDeckBtnEl = document.getElementById('import-custom-deck-btn');
    const importCustomDeckInputEl = document.getElementById('import-custom-deck-input');
    const removeCustomDeckBtnEl = document.getElementById('remove-custom-deck-btn');
    const customDeckStatusEl = document.getElementById('custom-deck-status');
    const quizContainerEl = document.getElementById('quiz-container');
    const modeSwitch = document.getElementById('mode-switch');
    const menuToggleBtn = document.getElementById('menu-toggle-btn');
    const sidePanel = document.getElementById('side-panel');
    const studyTabEls = Array.from(document.querySelectorAll('[data-study-tab]'));
    const paretoDeckTabsEl = document.getElementById('pareto-deck-tabs');
    const paretoDeckTabEls = Array.from(document.querySelectorAll('[data-pareto-deck]'));
    const paretoPatternFrameControlEl = document.getElementById('pareto-pattern-frame-control');
    const paretoPatternFrameSelectorEl = document.getElementById('pareto-pattern-frame-selector');
    const sentenceDeckTabsEl = document.getElementById('sentence-deck-tabs');
    const sentenceDeckTabEls = Array.from(document.querySelectorAll('[data-sentence-deck]'));
    const connectorModeTabsEl = document.getElementById('connector-mode-tabs');
    const connectorModeTabEls = Array.from(document.querySelectorAll('[data-connector-direction]'));
    const darkDeckTabsEl = document.getElementById('dark-deck-tabs');
    const darkDeckTabEls = Array.from(document.querySelectorAll('[data-dark-deck]'));
    const settingsFolderToggleEls = Array.from(document.querySelectorAll('.settings-folder-toggle'));
    const auxiliaryToggleEls = Array.from(document.querySelectorAll('[data-auxiliary]'));
    const irregularVerbModeToggleEls = Array.from(document.querySelectorAll('[data-irregular-verb-mode]'));
    const speechA2DeckBtnEl = document.getElementById('speech-a2-deck-btn');
    const modalVerbTableToggleEl = document.getElementById('modalverb-table-toggle');
    const modalVerbTenseToggleEls = Array.from(document.querySelectorAll('[data-modalverb-tense]'));
    const modalVerbPracticeEl = document.getElementById('modalverb-practice');
    const modalVerbPracticeTitleEl = document.getElementById('modalverb-practice-title');
    const modalVerbShowAnswersToggleEl = document.getElementById('modalverb-show-answers-toggle');
    const modalVerbTableRegionEl = document.getElementById('modalverb-table-region');
    const modalVerbFeedbackEl = document.getElementById('modalverb-feedback');
    const statsBtn = document.getElementById('stats-btn');
    const statsModal = document.getElementById('stats-modal');
    const statsDisplay = document.getElementById('stats-display');
    const closeModalBtn = document.querySelector('.close-btn');
    const decompositionDisplay = document.getElementById('decomposition-display');
    const statsContainer = document.getElementById('stats-container');
    const germanExampleEl = document.getElementById('german-example');
    const sceneMediaEl = document.getElementById('scene-media');
    const sceneImageEl = document.getElementById('scene-image');
    const scenePositionEl = document.getElementById('scene-position');
    const sceneContextBeforeEl = document.getElementById('scene-context-before');
    const sceneContextAfterEl = document.getElementById('scene-context-after');
    const playWordAudioBtn = document.getElementById('play-word-audio-btn');
    const playSentenceAudioBtn = document.getElementById('play-sentence-audio-btn');
    const autoplayAudioToggleEl = document.getElementById('autoplay-audio-toggle');
    const reverseInputToggleEl = document.getElementById('reverse-input-toggle');
    const reverseSentenceSettingEl = document.getElementById('reverse-sentence-setting');
    const showGermanSentenceToggleEl = document.getElementById('show-german-sentence-toggle');
    const sentenceTranslationToggleEl = document.getElementById('sentence-translation-toggle');
    const casePracticeToggleEl = document.getElementById('case-practice-toggle');
    
    // --- Pokemon Mode Elements ---
    const pokemonModeToggleEl = document.getElementById('pokemon-mode-toggle');
    const pokemonModeContainerEl = document.getElementById('pokemon-mode');
    const pokemonCatcherEl = document.getElementById('pokemon-catcher');
    const pokemonImageEl = document.getElementById('pokemon-image');
    const pokemonNameEl = document.getElementById('pokemon-name');
    const pokedexContainerEl = document.getElementById('pokedex-container');
    const pokedexBtn = document.getElementById('pokedex-btn');
    const pokedexModal = document.getElementById('pokedex-modal');
    const pokedexCloseBtn = document.getElementById('pokedex-close-btn');
    const pokedexGrid = document.getElementById('pokedex-grid');
    const pokedexStatsEl = document.getElementById('pokedex-stats');
    const savePokedexBtn = document.getElementById('save-pokedex-btn');
    const loadPokedexBtn = document.getElementById('load-pokedex-btn');
    const loadPokedexInput = document.getElementById('load-pokedex-input');
    const pokedexSearchEl = document.getElementById('pokedex-search');
    const pokedexFiltersEl = document.getElementById('pokedex-filters');
    const pokedexModalContent = document.getElementById('pokedex-modal-content');
    const pokedexHeaderEl = document.getElementById('pokedex-header');
    const pokedexResizerEl = document.getElementById('pokedex-resizer');

    // --- Stats & Storage ---
    const STATS_KEY = 'kotobaStats';
    const POKEDEX_KEY = 'kotobaPokedex';
    const POKEMON_RARITY_CACHE_KEY = 'kotobaPokemonRarityCache';
    const CUSTOM_DECK_LIBRARY_KEY = 'kotobaCustomDeckLibrary';
    const AUTOPLAY_AUDIO_KEY = 'kotobaAutoplayAudio';
    const REVERSE_INPUT_MODE_KEY = 'kotobaReverseInputMode';
    const SHOW_GERMAN_SENTENCE_KEY = 'kotobaShowGermanSentence';
    const SENTENCE_TRANSLATION_MODE_KEY = 'kotobaSentenceTranslationMode';
    const CASE_PRACTICE_MODE_KEY = 'kotobaCasePracticeMode';
    const CONNECTOR_REVERSE_MODE_KEY = 'kotobaConnectorReverseMode';
    const AUXILIARY_SELECTIONS_KEY = 'kotobaAuxiliarySelections';
    const MODALVERB_TENSE_KEY = 'kotobaModalverbTense';
    const MODALVERB_TABLE_ENABLED_KEY = 'kotobaModalverbTableEnabled';
    const SAVE_FILE_VERSION = 4;
    const getStats = () => JSON.parse(localStorage.getItem(STATS_KEY)) || {};
    const saveStats = (stats) => localStorage.setItem(STATS_KEY, JSON.stringify(stats));
    const getPokedex = () => JSON.parse(localStorage.getItem(POKEDEX_KEY)) || [];
    const savePokedexToStorage = (pokedex) => localStorage.setItem(POKEDEX_KEY, JSON.stringify(pokedex));
    const getPokemonRarityCache = () => JSON.parse(localStorage.getItem(POKEMON_RARITY_CACHE_KEY)) || {};
    const savePokemonRarityCache = (rarityCache) => localStorage.setItem(POKEMON_RARITY_CACHE_KEY, JSON.stringify(rarityCache));
    const getCustomDeckLibrary = () => JSON.parse(localStorage.getItem(CUSTOM_DECK_LIBRARY_KEY)) || {};
    const saveCustomDeckLibrary = (library) => localStorage.setItem(CUSTOM_DECK_LIBRARY_KEY, JSON.stringify(library));
    const getAutoplayAudioEnabled = () => localStorage.getItem(AUTOPLAY_AUDIO_KEY) === 'true';
    const saveAutoplayAudioEnabled = (enabled) => localStorage.setItem(AUTOPLAY_AUDIO_KEY, enabled ? 'true' : 'false');
    const getReverseInputModeEnabled = () => localStorage.getItem(REVERSE_INPUT_MODE_KEY) === 'true';
    const saveReverseInputModeEnabled = (enabled) => localStorage.setItem(REVERSE_INPUT_MODE_KEY, enabled ? 'true' : 'false');
    const getShowGermanSentenceEnabled = () => localStorage.getItem(SHOW_GERMAN_SENTENCE_KEY) === 'true';
    const saveShowGermanSentenceEnabled = (enabled) => localStorage.setItem(SHOW_GERMAN_SENTENCE_KEY, enabled ? 'true' : 'false');
    const getSentenceTranslationModeEnabled = () => localStorage.getItem(SENTENCE_TRANSLATION_MODE_KEY) === 'true';
    const saveSentenceTranslationModeEnabled = (enabled) => localStorage.setItem(SENTENCE_TRANSLATION_MODE_KEY, enabled ? 'true' : 'false');
    const getCasePracticeModeEnabled = () => localStorage.getItem(CASE_PRACTICE_MODE_KEY) === 'true';
    const saveCasePracticeModeEnabled = (enabled) => localStorage.setItem(CASE_PRACTICE_MODE_KEY, enabled ? 'true' : 'false');
    const getConnectorReverseModeEnabled = () => localStorage.getItem(CONNECTOR_REVERSE_MODE_KEY) === 'true';
    const saveConnectorReverseModeEnabled = (enabled) => localStorage.setItem(CONNECTOR_REVERSE_MODE_KEY, enabled ? 'true' : 'false');
    const getAuxiliarySelections = () => {
        try {
            return { sein: false, haben: false, werden: false, ...JSON.parse(localStorage.getItem(AUXILIARY_SELECTIONS_KEY) || '{}') };
        } catch (error) {
            return { sein: false, haben: false, werden: false };
        }
    };
    const saveAuxiliarySelections = (selections) => localStorage.setItem(AUXILIARY_SELECTIONS_KEY, JSON.stringify(selections));
    const getModalVerbTense = () => localStorage.getItem(MODALVERB_TENSE_KEY) || null;
    const saveModalVerbTense = (tense) => {
        if (tense) {
            localStorage.setItem(MODALVERB_TENSE_KEY, tense);
        } else {
            localStorage.removeItem(MODALVERB_TENSE_KEY);
        }
    };
    const getModalVerbTableEnabled = () => {
        const savedValue = localStorage.getItem(MODALVERB_TABLE_ENABLED_KEY);
        return savedValue === null ? Boolean(getModalVerbTense()) : savedValue === 'true';
    };
    const saveModalVerbTableEnabled = (enabled) => localStorage.setItem(MODALVERB_TABLE_ENABLED_KEY, enabled ? 'true' : 'false');

    // --- Quiz State ---
    const quizState = {
        deck: [],
        upcomingCards: [],
        currentCard: null,
        mode: 'conquest',
        score: 0,
        learnedCount: 0,
        questionsAnswered: 0,
        deckName: null,
        deckCardCount: 0,
        isShowingAnswer: false,
        decompositionCache: {},
        hidePopupTimeout: null,
        kanjiToIdMap: null,
        currentCardHasBeenGivenUp: false,
        decks: [],
        sessionStatsRecorded: false,
        conquestModePercentCorrectThreshold: 0.76,
        conquestModeSpacingModifier: 1.0,
        // --- Pokemon Mode State ---
        pokemonModeActive: false,
        allPokemon: [],
        pokemonById: new Map(),
        pokemonPools: {
            common: [],
            uncommon: [],
            rare: [],
            legendary: [],
        },
        pokedex: getPokedex(), // Array of caught pokemon IDs
        wildPokemon: null, // The currently spawned pokemon
        pokedexLoaded: false,
        pokedexFilter: 'all', // 'all', 'caught', 'missing'
        pokedexSearchTerm: '',
        pokemonRarityById: getPokemonRarityCache(),
        pokemonRarityWarmupPromise: null,
        typingAnimationInterval: null,
        audio: new Audio(),
        lastReplayKeyAt: 0,
        autoplayAudioEnabled: getAutoplayAudioEnabled(),
        reverseInputModeEnabled: getReverseInputModeEnabled(),
        showGermanSentenceEnabled: getShowGermanSentenceEnabled(),
        sentenceTranslationModeEnabled: getSentenceTranslationModeEnabled(),
        casePracticeModeEnabled: getCasePracticeModeEnabled(),
        connectorReverseModeEnabled: getConnectorReverseModeEnabled(),
        auxiliarySelections: getAuxiliarySelections(),
        irregularVerbMode: null,
        irregularVerbReturnTab: 'vocabulary',
        irregularVerbSessions: { meaning: null, praesens: null, praeteritum: null, perfekt: null },
        modalVerbTableEnabled: getModalVerbTableEnabled(),
        modalVerbTense: getModalVerbTense() || 'praesens',
        modalVerbPractice: {
            praesens: { values: {}, completedCells: [], activeCellKey: 'koennen:0' },
            praeteritum: { values: {}, completedCells: [], activeCellKey: 'koennen:0' },
            'konjunktiv-ii': { values: {}, completedCells: [], activeCellKey: 'koennen:0' },
        },
        modalVerbShowAnswers: { praesens: false, praeteritum: false, 'konjunktiv-ii': false },
        activeStudyTab: 'vocabulary',
        paretoDeckName: 'pareto_core',
        paretoPatternFrame: 'all',
        sentenceDeckName: 'sentences_read',
        darkDeckName: 'dark_s01e01_understand',
        studyTabSessions: { vocabulary: null, connectors: null, pareto: null, sentences: null, dark: null, irregular: null, speech: null },
        paretoDeckSessions: { pareto_core: null, pareto_patterns: null, pareto_extension: null },
        paretoPatternFrameSessions: {},
        sentenceDeckSessions: { sentences_read: null, sentences_speak: null },
        darkDeckSessions: { dark_s01e01_understand: null, dark_s01e01_recall: null },
        correctDingAudioContext: null,
        excludedCardIds: new Set(),
        builtInWordAudioIndexPromise: null,
    };

    const WK_RADICALS_BASE_URL = 'https://raw.githubusercontent.com/jmle/wkradicals/1e84bab91424aebf67862a77a58e6a111900be8f/data';
    const POKE_API_BASE_URL = 'https://pokeapi.co/api/v2';
    const TOTAL_POKEMON = 1025; // As of Gen 9
    const CUSTOM_DECK_PREFIX = 'custom:';
    const CUSTOM_DECK_SCHEMA_VERSION = 1;
    const BUILT_IN_AUDIO_SOURCE_FILE = 'vocabeo_all';
    const SAVE_KEY = 'k0t0b@_p0k3d3x_s@v3_d@t@'; // For "encryption"
    const DOUBLE_SPACE_THRESHOLD_MS = 325;
    const MOBILE_ADVANCE_DELAY_MS = 1000;
    let mobileAdvanceTimeout = null;
    let questionTransitionTimeout = null;
    const PARETO_DECKS = [
        { fileName: 'pareto_core', displayName: 'German Pareto Core', cardCount: 1313 },
        { fileName: 'pareto_patterns', displayName: 'German Pareto Patterns', cardCount: 562 },
        { fileName: 'pareto_extension', displayName: 'German Pareto Extension', cardCount: 1247 },
    ];
    const PARETO_DECK_NAMES = new Set(PARETO_DECKS.map(deck => deck.fileName));
    const PARETO_PATTERN_FRAMES = new Set([
        'all',
        'routine',
        'perfekt_frame',
        'modal_frame',
        'separable_frame',
        'funkverbgefüge',
        'particle_frame',
        'connector_bundle',
        'lexical_bundle',
    ]);
    const SENTENCE_DECKS = [
        { fileName: 'sentences_read', displayName: 'German Sentences - Read', cardCount: 1500 },
        { fileName: 'sentences_speak', displayName: 'German Sentences - Speak', cardCount: 1500 },
    ];
    const SENTENCE_DECK_NAMES = new Set(SENTENCE_DECKS.map(deck => deck.fileName));
    const DARK_DECKS = [
        { fileName: 'dark_s01e01_understand', displayName: 'Dark S01E01 - Understand', cardCount: 311 },
        { fileName: 'dark_s01e01_recall', displayName: 'Dark S01E01 - Recall', cardCount: 311 },
    ];
    const DARK_DECK_NAMES = new Set(DARK_DECKS.map(deck => deck.fileName));
    const CONNECTOR_DECKS = [
        { fileName: 'conversation_connectors', displayName: 'German Conversation Connectors', cardCount: 87 },
    ];
    const CONNECTOR_DECK_NAMES = new Set(CONNECTOR_DECKS.map(deck => deck.fileName));
    const IRREGULAR_VERB_MODES = new Set(['meaning', 'praesens', 'praeteritum', 'perfekt']);
    const IRREGULAR_VERB_DECKS = [
        { fileName: 'irregular_verbs_meaning', displayName: 'Irregular Verbs - Meaning', cardCount: 70, mode: 'meaning' },
        { fileName: 'irregular_verbs_praesens', displayName: 'Irregular Verbs - Präsens', cardCount: 70, mode: 'praesens' },
        { fileName: 'irregular_verbs_praeteritum', displayName: 'Irregular Verbs - Präteritum', cardCount: 70, mode: 'praeteritum' },
        { fileName: 'irregular_verbs_perfekt', displayName: 'Irregular Verbs - Perfekt', cardCount: 70, mode: 'perfekt' },
    ];
    const IRREGULAR_VERB_DECK_NAMES = new Set(IRREGULAR_VERB_DECKS.map(deck => deck.fileName));
    const IRREGULAR_VERB_DECK_BY_MODE = Object.fromEntries(IRREGULAR_VERB_DECKS.map(deck => [deck.mode, deck.fileName]));
    const SPEECH_A2_DECK = { fileName: 'speech_a2', displayName: 'Speech - A2', cardCount: 155 };
    const MODALVERB_COLUMNS = [
        { key: 'koennen', label: 'können' },
        { key: 'muessen', label: 'müssen' },
        { key: 'wollen', label: 'wollen' },
        { key: 'sollen', label: 'sollen' },
        { key: 'duerfen', label: 'dürfen' },
        { key: 'moegen', label: 'mögen' },
    ];
    const MODALVERB_TABLES = {
        praesens: {
            title: 'Präsens',
            columns: [...MODALVERB_COLUMNS, { key: 'moechten', label: 'möchten' }],
            rows: [
                { pov: '1st', pronouns: 'ich', forms: ['kann', 'muss', 'will', 'soll', 'darf', 'mag', 'möchte'] },
                { pov: '1st', pronouns: 'wir', forms: ['können', 'müssen', 'wollen', 'sollen', 'dürfen', 'mögen', 'möchten'] },
                { pov: '2nd', pronouns: 'du', forms: ['kannst', 'musst', 'willst', 'sollst', 'darfst', 'magst', 'möchtest'] },
                { pov: '2nd', pronouns: 'ihr', forms: ['könnt', 'müsst', 'wollt', 'sollt', 'dürft', 'mögt', 'möchtet'] },
                { pov: '3rd', pronouns: 'er/sie/es', forms: ['kann', 'muss', 'will', 'soll', 'darf', 'mag', 'möchte'] },
                { pov: '3rd', pronouns: 'sie/Sie', forms: ['können', 'müssen', 'wollen', 'sollen', 'dürfen', 'mögen', 'möchten'] },
            ],
        },
        praeteritum: {
            title: 'Präteritum',
            columns: MODALVERB_COLUMNS,
            rows: [
                { pov: '1st', pronouns: 'ich', forms: ['konnte', 'musste', 'wollte', 'sollte', 'durfte', 'mochte'] },
                { pov: '1st', pronouns: 'wir', forms: ['konnten', 'mussten', 'wollten', 'sollten', 'durften', 'mochten'] },
                { pov: '2nd', pronouns: 'du', forms: ['konntest', 'musstest', 'wolltest', 'solltest', 'durftest', 'mochtest'] },
                { pov: '2nd', pronouns: 'ihr', forms: ['konntet', 'musstet', 'wolltet', 'solltet', 'durftet', 'mochtet'] },
                { pov: '3rd', pronouns: 'er/sie/es', forms: ['konnte', 'musste', 'wollte', 'sollte', 'durfte', 'mochte'] },
                { pov: '3rd', pronouns: 'sie/Sie', forms: ['konnten', 'mussten', 'wollten', 'sollten', 'durften', 'mochten'] },
            ],
        },
        'konjunktiv-ii': {
            title: 'Konjunktiv II',
            columns: MODALVERB_COLUMNS,
            rows: [
                { pov: '1st', pronouns: 'ich', forms: ['könnte', 'müsste', 'wollte', 'sollte', 'dürfte', 'möchte'] },
                { pov: '1st', pronouns: 'wir', forms: ['könnten', 'müssten', 'wollten', 'sollten', 'dürften', 'möchten'] },
                { pov: '2nd', pronouns: 'du', forms: ['könntest', 'müsstest', 'wolltest', 'solltest', 'dürftest', 'möchtest'] },
                { pov: '2nd', pronouns: 'ihr', forms: ['könntet', 'müsstet', 'wolltet', 'solltet', 'dürftet', 'möchtet'] },
                { pov: '3rd', pronouns: 'er/sie/es', forms: ['könnte', 'müsste', 'wollte', 'sollte', 'dürfte', 'möchte'] },
                { pov: '3rd', pronouns: 'sie/Sie', forms: ['könnten', 'müssten', 'wollten', 'sollten', 'dürften', 'möchten'] },
            ],
        },
    };
    const CASE_PRACTICE_FORMS = [
        'dem', 'einem', 'einer', 'keinem', 'keiner', 'diesem', 'dieser', 'zum', 'zur', 'im', 'am', 'beim', 'vom',
        'den', 'einen', 'keinen', 'diesen', 'ans', 'ins',
        'der', 'die', 'das', 'ein', 'eine', 'kein', 'keine', 'dieser', 'diese', 'dieses'
    ];
    const CASE_PRACTICE_FORM_SET = new Set(CASE_PRACTICE_FORMS);
    const CASE_PRACTICE_PRIORITY = {
        dem: 5, einem: 5, einer: 5, keinem: 5, keiner: 5, diesem: 5, dieser: 5, zum: 5, zur: 5, im: 5, am: 5, beim: 5, vom: 5,
        den: 4, einen: 4, keinen: 4, diesen: 4, ans: 4, ins: 4,
        der: 2, die: 2, das: 2, ein: 2, eine: 2, kein: 2, keine: 2, diese: 2, dieses: 2
    };
    const LEGENDARY_POKEMON_IDS = new Set([
        144, 145, 146, 150, 151, 243, 244, 245, 249, 250, 251, 377, 378, 379, 380, 381, 382, 383, 384, 385, 386,
        480, 481, 482, 483, 484, 485, 486, 487, 488, 489, 490, 491, 492, 493, 494, 638, 639, 640, 641, 642, 643,
        644, 645, 646, 647, 648, 649, 716, 717, 718, 719, 720, 721, 785, 786, 787, 788, 789, 790, 791, 792, 793,
        794, 795, 796, 797, 798, 799, 800, 801, 802, 803, 804, 805, 806, 807, 808, 809, 888, 889, 890, 891, 892,
        893, 894, 895, 896, 897, 898, 905, 1001, 1002, 1003, 1004, 1007, 1008, 1009, 1010, 1014, 1015, 1016, 1017,
        1020, 1021, 1022, 1023, 1024, 1025
    ]);

    // --- Conquest Mode SRS Logic ---
    const indexTopForStreakLength = { 0: 16, 1: 35, 2: 80, 3: 140, 4: 200, 5: 300, 6: 400, length: 7 };
    function calculateStreakLength(card) {
      let streakLength = 0;
      for (let i = card.answerHistory.length - 1; i >= 0; i -= 1) {
        if (card.answerHistory[i]) {
          ++streakLength;
        } else {
          break;
        }
      }
      return streakLength;
    }
    const calculateIndexTop = (streak) => indexTopForStreakLength[streak] || indexTopForStreakLength[indexTopForStreakLength.length - 1] * (streak - indexTopForStreakLength.length + 2);

    function calculatePercentCorrect(card) {
      if (!card.answerHistory || card.answerHistory.length === 0) {
        return 0;
      }
      let numberCorrect = card.answerHistory.reduce((a, b) => b ? a + 1 : a , 0);
      let percentCorrect = numberCorrect / card.answerHistory.length;
      return percentCorrect;
    }

    function recycleCard(card) {
        if (calculatePercentCorrect(card) >= quizState.conquestModePercentCorrectThreshold) {
            // Card is retired, do not recycle.
            return false;
        }

        const streakLength = calculateStreakLength(card);
        const indexTop = calculateIndexTop(streakLength);
        
        const randomFactor = Math.random() * 0.40 + 0.60;
        const newDistanceFromFront = Math.floor(indexTop * quizState.conquestModeSpacingModifier * randomFactor);
        
        let index = quizState.upcomingCards.length - 1 - newDistanceFromFront;

        if (index < 0) {
          index = quizState.upcomingCards.length - 1 - Math.floor(newDistanceFromFront / 2);
          if (index < 0) {
            if (card.answerHistory[card.answerHistory.length - 1]) {
              // If correct and can't be placed, it graduates.
              return false;
            } else {
              // If incorrect and can't be placed, put it back at the front.
              index = 0;
            }
          }
        }
        
        quizState.upcomingCards.splice(index, 0, card);
        return true;
    }

    function removeCurrentCardFromUpcomingCards() {
        if (quizState.mode !== 'conquest' || !quizState.currentCard) {
            return;
        }

        const lastIndex = quizState.upcomingCards.length - 1;
        if (lastIndex >= 0 && quizState.upcomingCards[lastIndex] === quizState.currentCard) {
            quizState.upcomingCards.pop();
            return;
        }

        const currentCardIndex = quizState.upcomingCards.indexOf(quizState.currentCard);
        if (currentCardIndex !== -1) {
            quizState.upcomingCards.splice(currentCardIndex, 1);
        }
    }

    function getCardSessionId(card) {
        return card?.sessionCardId || '';
    }

    function isCardExcluded(card) {
        return quizState.excludedCardIds.has(getCardSessionId(card));
    }

    function syncDeckCardCount() {
        quizState.deckCardCount = quizState.deck.length;
    }

    function isCustomDeckFileName(name) {
        return String(name || '').startsWith(CUSTOM_DECK_PREFIX);
    }

    function isParetoDeckName(name) {
        return PARETO_DECK_NAMES.has(String(name || ''));
    }

    function isParetoCard(card) {
        return Boolean(card?.paretoType);
    }

    function filterParetoPatternCards(cards) {
        if (quizState.paretoPatternFrame === 'all') {
            return cards;
        }

        return cards.filter(card => card.paretoPatternClass === quizState.paretoPatternFrame);
    }

    function isSentenceDeckName(name) {
        return SENTENCE_DECK_NAMES.has(String(name || ''));
    }

    function isSentenceDeckCard(card) {
        return card?.sentenceDeckType === 'read' || card?.sentenceDeckType === 'speak';
    }

    function isDarkDeckName(name) {
        return DARK_DECK_NAMES.has(String(name || ''));
    }

    function isDarkDeckCard(card) {
        return card?.darkDeckType === 'understand' || card?.darkDeckType === 'recall';
    }

    function isConnectorDeckName(name) {
        return CONNECTOR_DECK_NAMES.has(String(name || ''));
    }

    function isConnectorDeckCard(card) {
        return card?.connectorDeckType === 'conversation-connector';
    }

    function isIrregularVerbDeckName(name) {
        return IRREGULAR_VERB_DECK_NAMES.has(String(name || ''));
    }

    function isIrregularVerbCard(card) {
        return IRREGULAR_VERB_MODES.has(card?.irregularVerbMode);
    }

    function isSpeechCard(card) {
        return card?.speechDeckType === 'a2';
    }

    function normalizeOptionalString(value) {
        return String(value || '').trim();
    }

    function normalizeDelimitedValues(value, separators = /[;,/]/) {
        if (Array.isArray(value)) {
            return value
                .map((entry) => normalizeOptionalString(entry))
                .filter(Boolean);
        }

        const normalizedValue = normalizeOptionalString(value);
        if (!normalizedValue) {
            return [];
        }

        return normalizedValue
            .split(separators)
            .map((entry) => entry.trim())
            .filter(Boolean);
    }

    function normalizeLookupTerm(value) {
        return normalizeOptionalString(value)
            .toLowerCase()
            .replace(/\s+/g, ' ');
    }

    function stripLeadingArticle(value) {
        const normalizedValue = normalizeLookupTerm(value);
        const parts = normalizedValue.split(' ');
        if (parts.length <= 1) {
            return normalizedValue;
        }

        const leadingToken = parts[0];
        if (!CASE_PRACTICE_FORM_SET.has(leadingToken)) {
            return normalizedValue;
        }

        return parts.slice(1).join(' ');
    }

    function slugifyCustomDeckId(value) {
        const normalizedValue = normalizeOptionalString(value)
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');

        return normalizedValue || `custom-deck-${Date.now()}`;
    }

    function setCustomDeckStatus(message, tone = 'info') {
        if (!customDeckStatusEl) {
            return;
        }

        customDeckStatusEl.textContent = message;
        customDeckStatusEl.className = `settings-help${tone ? ` ${tone}` : ''}`;
    }

    function updateCustomDeckControls() {
        if (!removeCustomDeckBtnEl) {
            return;
        }

        removeCustomDeckBtnEl.disabled = !isCustomDeckFileName(deckSelectorEl.value);
    }

    async function getBuiltInWordAudioIndex() {
        if (!quizState.builtInWordAudioIndexPromise) {
            quizState.builtInWordAudioIndexPromise = (async () => {
                const res = await fetch(`data/${BUILT_IN_AUDIO_SOURCE_FILE}.json`);
                if (!res.ok) {
                    throw new Error(`Failed to load built-in audio source deck: ${res.status}`);
                }

                const data = await res.json();
                const cards = Array.isArray(data?.cards) ? data.cards : [];
                const exactMatches = new Map();
                const articlelessMatches = new Map();

                cards.forEach((card) => {
                    const question = normalizeOptionalString(card?.question);
                    const wordAudioUrl = normalizeOptionalString(card?.wordAudioUrl ?? card?.word_audio_url);
                    if (!question || !wordAudioUrl) {
                        return;
                    }

                    const exactKey = normalizeLookupTerm(question);
                    if (!exactMatches.has(exactKey)) {
                        exactMatches.set(exactKey, wordAudioUrl);
                    }

                    const articlelessKey = stripLeadingArticle(question);
                    if (!articlelessKey || articlelessKey === exactKey) {
                        return;
                    }

                    const entry = articlelessMatches.get(articlelessKey) || { count: 0, wordAudioUrl };
                    entry.count += 1;
                    if (entry.count === 1) {
                        entry.wordAudioUrl = wordAudioUrl;
                    }
                    articlelessMatches.set(articlelessKey, entry);
                });

                return { exactMatches, articlelessMatches };
            })().catch((error) => {
                quizState.builtInWordAudioIndexPromise = null;
                throw error;
            });
        }

        return quizState.builtInWordAudioIndexPromise;
    }

    async function enrichCustomDeckCardsWithBuiltInAudio(cards) {
        if (!Array.isArray(cards) || cards.length === 0) {
            return cards;
        }

        try {
            const { exactMatches, articlelessMatches } = await getBuiltInWordAudioIndex();
            return cards.map((card) => {
                if (!card || card.wordAudioUrl || card.word_audio_url) {
                    return card;
                }

                const exactKey = normalizeLookupTerm(card.german_term || card.question || '');
                let matchedWordAudioUrl = exactMatches.get(exactKey) || '';

                if (!matchedWordAudioUrl) {
                    const articlelessKey = stripLeadingArticle(card.german_term || card.question || '');
                    const articlelessMatch = articlelessMatches.get(articlelessKey);
                    if (articlelessMatch?.count === 1) {
                        matchedWordAudioUrl = articlelessMatch.wordAudioUrl;
                    }
                }

                if (!matchedWordAudioUrl) {
                    return card;
                }

                return {
                    ...card,
                    wordAudioUrl: matchedWordAudioUrl,
                };
            });
        } catch (error) {
            console.error('Unable to enrich custom deck audio from built-in decks:', error);
            return cards;
        }
    }

    function clearAdvanceTimers() {
        clearTimeout(mobileAdvanceTimeout);
        clearTimeout(questionTransitionTimeout);
        mobileAdvanceTimeout = null;
        questionTransitionTimeout = null;
    }

    function scheduleMobileAdvance() {
        if (
            mobileAdvanceTimeout !== null
            || questionTransitionTimeout !== null
            || !window.matchMedia('(max-width: 700px), (pointer: coarse)').matches
            || !quizState.isShowingAnswer
            || !quizState.currentCard
            || quizState.modalVerbTableEnabled
        ) {
            return;
        }

        const answeredCard = quizState.currentCard;
        const speechAudioStartedAt = performance.now();
        const advanceWhenReady = () => {
            mobileAdvanceTimeout = null;
            if (!quizState.isShowingAnswer || quizState.currentCard !== answeredCard) {
                return;
            }
            const speechAudioPlaying = isSpeechCard(answeredCard)
                && quizState.autoplayAudioEnabled
                && ((!quizState.audio.paused && !quizState.audio.ended) || window.speechSynthesis?.speaking);
            if (speechAudioPlaying && performance.now() - speechAudioStartedAt < 15000) {
                mobileAdvanceTimeout = setTimeout(advanceWhenReady, 250);
                return;
            }
            nextQuestion();
        };
        mobileAdvanceTimeout = setTimeout(advanceWhenReady, MOBILE_ADVANCE_DELAY_MS);
    }

    function resetQuizSelection() {
        clearAdvanceTimers();
        stopAudioPlayback();
        quizState.deck = [];
        quizState.upcomingCards = [];
        quizState.currentCard = null;
        quizState.mode = 'conquest';
        quizState.score = 0;
        quizState.learnedCount = 0;
        quizState.questionsAnswered = 0;
        quizState.deckName = null;
        quizState.deckCardCount = 0;
        quizState.isShowingAnswer = false;
        quizState.currentCardHasBeenGivenUp = false;
        quizState.sessionStatsRecorded = false;
        quizState.excludedCardIds = new Set();

        deckSelectorEl.value = '';
        quizContainerEl.style.opacity = '';
        statsContainer.style.display = 'none';
        answerInputEl.style.display = 'block';
        answerInputEl.disabled = false;
        answerInputEl.value = '';
        renderNoActiveQuestion();
        updateStatsDisplay();
        updateCustomDeckControls();
    }

    // --- Core Quiz Logic ---
    function normalizeAnswer(value) {
        return String(value || '')
            .toLowerCase()
            .replace(/\s+/g, ' ')
            .replace(/\s*,\s*/g, ', ')
            .trim();
    }

    function stripSentenceClarifications(value) {
        return String(value || '')
            .replace(/\s*\([^)]*\)\s*/g, ' ')
            .replace(/\s+([,.;!?])/g, '$1')
            .replace(/\s+/g, ' ')
            .trim();
    }

    function normalizeSentenceAnswer(value) {
        return stripSentenceClarifications(value)
            .toLowerCase()
            .replace(/[.,!?;:]/g, '')
            .replace(/\s+/g, ' ')
            .trim();
    }

    function extractEnglishSentencePrompt(value) {
        const rawValue = String(value || '').trim();
        if (!rawValue) {
            return '';
        }

        const phoneticPrefixMatch = rawValue.match(/^Phonetic:\s*\[[^\]]*]\s*\|\s*(.+)$/i);
        if (phoneticPrefixMatch) {
            return phoneticPrefixMatch[1].trim();
        }

        return rawValue;
    }

    function isLikelyCasePracticeSentence(sentence) {
        const normalizedSentence = String(sentence || '').trim();
        if (!normalizedSentence) {
            return false;
        }

        if (/[↔]|<->|->/.test(normalizedSentence)) {
            return false;
        }

        const words = normalizedSentence.split(/\s+/).filter(Boolean);
        if (words.length < 3) {
            return false;
        }

        return /[.!?]/.test(normalizedSentence) || /^[A-ZÄÖÜ]/.test(normalizedSentence);
    }

    function createCasePracticeCard(baseCard) {
        const sentence = String(baseCard?.germanExample || '').trim();
        if (!isLikelyCasePracticeSentence(sentence)) {
            return null;
        }

        const words = sentence.split(/\s+/);
        let bestMatch = null;

        words.forEach((word, wordIndex) => {
            const tokenMatches = Array.from(word.matchAll(/[A-Za-zÄÖÜäöüß]+/g));
            tokenMatches.forEach((tokenMatch) => {
                const [rawToken] = tokenMatch;
                const normalizedToken = rawToken.toLowerCase();
                if (!CASE_PRACTICE_FORM_SET.has(normalizedToken)) {
                    return;
                }

                const priority = CASE_PRACTICE_PRIORITY[normalizedToken] || 1;
                if (
                    !bestMatch
                    || priority > bestMatch.priority
                    || (priority === bestMatch.priority && wordIndex < bestMatch.wordIndex)
                ) {
                    bestMatch = {
                        wordIndex,
                        priority,
                        startIndex: tokenMatch.index,
                        endIndex: tokenMatch.index + rawToken.length,
                        answer: rawToken,
                    };
                }
            });
        });

        if (!bestMatch) {
            return null;
        }

        const blankedWords = [...words];
        const targetWord = blankedWords[bestMatch.wordIndex];
        blankedWords[bestMatch.wordIndex] = `${targetWord.slice(0, bestMatch.startIndex)}_____${targetWord.slice(bestMatch.endIndex)}`;

        return {
            ...baseCard,
            sessionCardId: `${getCardSessionId(baseCard)}::case::${bestMatch.wordIndex}::${bestMatch.startIndex}`,
            casePracticePrompt: blankedWords.join(' '),
            casePracticeAnswers: [bestMatch.answer],
            casePracticeTarget: bestMatch.answer.toLowerCase(),
        };
    }

    function buildCasePracticeDeck(cards) {
        return cards
            .map((card) => createCasePracticeCard(card))
            .filter(Boolean);
    }

    function isSentenceTranslationModeActive() {
        return quizState.sentenceTranslationModeEnabled && quizState.activeStudyTab === 'vocabulary';
    }

    function isCasePracticeModeActive() {
        return quizState.casePracticeModeEnabled && quizState.activeStudyTab === 'vocabulary';
    }

    function isReverseWordModeActive() {
        if (quizState.activeStudyTab === 'connectors') {
            return quizState.connectorReverseModeEnabled;
        }

        if (quizState.activeStudyTab !== 'vocabulary') {
            return false;
        }

        const reverseModeEnabled = quizState.reverseInputModeEnabled;
        return reverseModeEnabled
            && !isSentenceTranslationModeActive()
            && !isCasePracticeModeActive();
    }

    function normalizeInputForCurrentMode(value) {
        if (isParetoCard(quizState.currentCard) || isSentenceDeckCard(quizState.currentCard) || isDarkDeckCard(quizState.currentCard) || isConnectorDeckCard(quizState.currentCard) || isSpeechCard(quizState.currentCard)) {
            return normalizeSentenceAnswer(value);
        }

        return isSentenceTranslationModeActive()
            ? normalizeSentenceAnswer(value)
            : normalizeAnswer(value);
    }

    function getQuestionPrompt(card) {
        if (!card) {
            return '';
        }

        if (card.paretoType === 'pattern-recognition') {
            const germanChunk = (card.germanAnswers || []).find(Boolean) || '';
            const blankedChunk = germanChunk
                .split(/\s+/)
                .filter(Boolean)
                .map(() => '_____')
                .join(' ');
            const blankedSentence = germanChunk && card.germanExample
                ? card.germanExample.replace(new RegExp(escapeRegExp(germanChunk), 'i'), blankedChunk)
                : card.germanExample || '';
            return [card.englishSentencePrompt || card.meaning, blankedSentence]
                .filter(Boolean)
                .join('\n\n');
        }

        if (isParetoCard(card)) {
            return card.question || '';
        }

        if (isSentenceDeckCard(card)) {
            return card.question || '';
        }

        if (isDarkDeckCard(card)) {
            return card.question || '';
        }

        if (isIrregularVerbCard(card)) {
            return card.question || '';
        }

        if (isCasePracticeModeActive()) {
            return card.casePracticePrompt || card.germanExample || '';
        }

        if (isSentenceTranslationModeActive()) {
            return card.englishSentencePrompt || (card.answer || []).join(' / ') || '';
        }

        if (!isReverseWordModeActive()) {
            return card.question || '';
        }

        const promptAnswers = (card.answer || []).filter(Boolean);
        if (promptAnswers.length === 0) {
            return card.meaning || '';
        }

        return promptAnswers.slice(0, 4).join(' / ');
    }

    function getAcceptedAnswers(card) {
        if (!card) {
            return [];
        }

        if (card.paretoType === 'pattern-recognition') {
            return (card.germanAnswers || []).filter(Boolean);
        }

        if (isParetoCard(card)) {
            return (card.answer || []).filter(Boolean);
        }

        if (isSentenceDeckCard(card)) {
            return (card.answer || []).filter(Boolean);
        }

        if (isDarkDeckCard(card)) {
            return (card.answer || []).filter(Boolean);
        }

        if (isCasePracticeModeActive()) {
            return (card.casePracticeAnswers || []).filter(Boolean);
        }

        if (isSentenceTranslationModeActive()) {
            const sentenceAnswers = (card.germanSentenceAnswers || []).filter(Boolean);
            if (sentenceAnswers.length > 0) {
                return sentenceAnswers;
            }

            const fallbackSentence = stripSentenceClarifications(card.germanExample || card.question || '');
            return fallbackSentence ? [fallbackSentence] : [];
        }

        return isReverseWordModeActive()
            ? (card.germanAnswers || [card.question]).filter(Boolean)
            : (card.answer || []).filter(Boolean);
    }

    function getPrimaryAnswer(card) {
        if (['pattern-cloze', 'pattern-recognition'].includes(card?.paretoType) && card.germanExample) {
            return card.germanExample;
        }

        if (card?.darkDeckType === 'recall' && card.germanExample) {
            return card.germanExample;
        }

        const acceptedAnswers = getAcceptedAnswers(card);
        return acceptedAnswers[0] || '';
    }

    function shouldShowGermanExample(card) {
        if (!card || !card.germanExample) {
            return false;
        }

        if (isParetoCard(card) || isSentenceDeckCard(card) || isDarkDeckCard(card)) {
            return false;
        }

        if (isCasePracticeModeActive()) {
            return false;
        }

        if (isSentenceTranslationModeActive()) {
            return false;
        }

        if (!isReverseWordModeActive()) {
            return true;
        }

        return quizState.showGermanSentenceEnabled;
    }

    function updateAnswerInputPlaceholder() {
        if (isSpeechCard(quizState.currentCard)) {
            answerInputEl.placeholder = 'Type the German phrase...';
            return;
        }

        if (quizState.currentCard?.sentenceDeckType === 'read') {
            answerInputEl.placeholder = 'Type the English meaning...';
            return;
        }

        if (quizState.currentCard?.sentenceDeckType === 'speak') {
            answerInputEl.placeholder = 'Type the German sentence...';
            return;
        }

        if (quizState.currentCard?.darkDeckType === 'understand') {
            answerInputEl.placeholder = 'Type the English subtitle...';
            return;
        }

        if (quizState.currentCard?.darkDeckType === 'recall') {
            answerInputEl.placeholder = 'Type the German dialogue...';
            return;
        }

        if (isIrregularVerbCard(quizState.currentCard)) {
            answerInputEl.placeholder = quizState.currentCard.irregularVerbMode === 'meaning'
                ? 'Type the English meaning...'
                : `Type the ${quizState.currentCard.irregularVerbLabel} form...`;
            return;
        }

        if (isConnectorDeckCard(quizState.currentCard)) {
            answerInputEl.placeholder = isReverseWordModeActive()
                ? 'Type the German connector...'
                : 'Type the English meaning...';
            return;
        }

        if (quizState.currentCard?.paretoType === 'word-production') {
            answerInputEl.placeholder = 'Type the German word...';
            return;
        }

        if (quizState.currentCard?.paretoType === 'pattern-cloze') {
            answerInputEl.placeholder = 'Type the missing German...';
            return;
        }

        if (quizState.currentCard?.paretoType === 'pattern-recognition') {
            answerInputEl.placeholder = 'Type the missing German...';
            return;
        }

        if (isCasePracticeModeActive()) {
            answerInputEl.placeholder = 'Type the missing article...';
            return;
        }

        if (isSentenceTranslationModeActive()) {
            answerInputEl.placeholder = 'Type the German sentence...';
            return;
        }

        answerInputEl.placeholder = isReverseWordModeActive()
            ? 'Type the German word...'
            : 'Type the meaning...';
    }

    function updateReverseModeControls() {
        reverseSentenceSettingEl.classList.toggle('hidden', !isReverseWordModeActive());
    }

    function renderGermanExample(card) {
        if (!shouldShowGermanExample(card)) {
            germanExampleEl.innerHTML = '';
            germanExampleEl.style.display = 'none';
            return;
        }

        const rawKeywords = (card.question || '').split(/[,;()]/)[0].trim().split(/\s+/);
        const articles = ['der', 'die', 'das', 'ein', 'eine', 'einen', 'einem', 'einer', 'dem', 'den', 'des'];
        const keywords = rawKeywords.filter(w => !articles.includes(w.toLowerCase()));

        const highlightedSentence = highlightSentence(card.germanExample, keywords);
        germanExampleEl.innerHTML = highlightedSentence;
        germanExampleEl.style.display = 'block';
    }

    function renderSceneMedia(card) {
        if (!isDarkDeckCard(card) || !card.sceneImageUrl) {
            sceneMediaEl.hidden = true;
            sceneImageEl.removeAttribute('src');
            scenePositionEl.textContent = '';
            sceneContextBeforeEl.textContent = '';
            sceneContextAfterEl.textContent = '';
            return;
        }

        const useGermanContext = card.darkDeckType === 'understand';
        sceneImageEl.src = card.sceneImageUrl;
        scenePositionEl.textContent = `${Number(card.sourceOrder || 0) + 1} / ${card.episodeCardCount || quizState.deckCardCount || 311}`;
        sceneContextBeforeEl.textContent = useGermanContext
            ? card.contextGermanBefore || ''
            : card.contextEnglishBefore || '';
        sceneContextAfterEl.textContent = useGermanContext
            ? card.contextGermanAfter || ''
            : card.contextEnglishAfter || '';
        sceneMediaEl.hidden = false;
    }

    function renderCurrentCard(card, { autoplayOnDisplay = false } = {}) {
        if (!card) {
            return;
        }

        updateAnswerInputPlaceholder();
        questionEl.classList.toggle('pareto-prompt', isParetoCard(card));
        questionEl.classList.toggle('sentence-deck-prompt', isSentenceDeckCard(card));
        questionEl.classList.toggle('dark-deck-prompt', isDarkDeckCard(card));
        questionEl.classList.toggle('connector-prompt', isConnectorDeckCard(card));
        questionEl.classList.toggle('irregular-verb-prompt', isIrregularVerbCard(card));
        questionEl.classList.toggle('speech-prompt', isSpeechCard(card));
        questionEl.classList.toggle('reverse-prompt', !isParetoCard(card) && !isSentenceDeckCard(card) && !isDarkDeckCard(card) && (isReverseWordModeActive() || isSentenceTranslationModeActive() || isCasePracticeModeActive()));
        if (isIrregularVerbCard(card)) {
            questionEl.innerHTML = `
                <span class="irregular-verb-infinitive">${escapeHtml(card.infinitive)}</span>
                ${card.irregularVerbMeaning ? `<span class="irregular-verb-meaning">${escapeHtml(card.irregularVerbMeaning)}</span>` : ''}
                ${card.irregularVerbCue ? `<span class="irregular-verb-cue">${escapeHtml(card.irregularVerbCue)}</span>` : ''}`;
        } else {
            questionEl.textContent = getQuestionPrompt(card);
        }
        updateAudioButtons(card);
        renderGermanExample(card);
        renderSceneMedia(card);

        if (autoplayOnDisplay && quizState.autoplayAudioEnabled && (card.sentenceDeckType === 'read' || card.darkDeckType === 'understand')) {
            playCurrentSentenceAudio();
            return;
        }

        if (autoplayOnDisplay && quizState.autoplayAudioEnabled && !isParetoCard(card) && !isSentenceDeckCard(card) && !isDarkDeckCard(card) && !isSpeechCard(card)) {
            if (isSentenceTranslationModeActive() || isCasePracticeModeActive()) {
                playCurrentSentenceAudio();
                return;
            }

            if (!isReverseWordModeActive()) {
                playCurrentWordAudio();
            }
        }
    }

    function renderNoActiveQuestion() {
        updateAudioButtons(null);
        updateAnswerInputPlaceholder();
        questionEl.classList.remove('reverse-prompt');
        questionEl.classList.remove('pareto-prompt');
        questionEl.classList.remove('sentence-deck-prompt');
        questionEl.classList.remove('dark-deck-prompt');
        questionEl.classList.remove('connector-prompt');
        questionEl.classList.remove('irregular-verb-prompt');
        questionEl.classList.remove('speech-prompt');
        renderSceneMedia(null);

        if (quizState.deckName) {
            questionEl.textContent = 'Quiz Finished!';
            germanExampleEl.innerHTML = '';
            germanExampleEl.style.display = 'none';
            answerInputEl.style.display = 'none';
            const percentage = quizState.questionsAnswered > 0 ? Math.round((quizState.score / quizState.questionsAnswered) * 100) : 0;
            feedbackEl.textContent = `Final score: ${quizState.score}/${quizState.questionsAnswered} (${percentage}%)`;
            feedbackEl.className = 'visible';
            return;
        }

        questionEl.textContent = 'Select a deck';
        germanExampleEl.innerHTML = '';
        germanExampleEl.style.display = 'none';
        answerInputEl.style.display = 'block';
        answerInputEl.disabled = false;
        answerInputEl.value = '';
        feedbackEl.innerHTML = '';
        feedbackEl.className = '';
        feedbackEl.classList.remove('visible');
    }

    function applyPokemonFilterUI() {
        pokedexFiltersEl.querySelectorAll('.filter-btn').forEach((button) => {
            button.classList.toggle('active', button.dataset.filter === quizState.pokedexFilter);
        });
    }

    async function syncPokemonModeUI({ fetchPokedex = false } = {}) {
        pokemonModeToggleEl.checked = quizState.pokemonModeActive;

        if (fetchPokedex && !quizState.pokedexLoaded) {
            await fetchAllPokemon();
        }

        if (quizState.pokemonModeActive) {
            pokemonCatcherEl.style.display = 'flex';
            pokedexContainerEl.style.display = 'flex';
        } else {
            pokemonCatcherEl.style.display = 'none';
            pokedexContainerEl.style.display = 'none';
        }
    }

    function restorePokemonDisplay(snapshot = {}) {
        if (quizState.typingAnimationInterval) {
            clearInterval(quizState.typingAnimationInterval);
            quizState.typingAnimationInterval = null;
        }

        pokemonImageEl.src = snapshot.imageSrc || quizState.wildPokemon?.sprite || '';
        pokemonImageEl.classList.toggle('visible', Boolean(snapshot.imageVisible));
        pokemonNameEl.textContent = snapshot.nameText || '';
        pokemonNameEl.classList.toggle('caught-text', Boolean(snapshot.nameCaught));
    }

    function cloneSavedCard(card) {
        return {
            ...card,
            answer: Array.isArray(card.answer) ? [...card.answer] : [],
            germanAnswers: Array.isArray(card.germanAnswers) ? [...card.germanAnswers] : [],
            germanSentenceAnswers: Array.isArray(card.germanSentenceAnswers) ? [...card.germanSentenceAnswers] : [],
            casePracticeAnswers: Array.isArray(card.casePracticeAnswers) ? [...card.casePracticeAnswers] : [],
            answerHistory: Array.isArray(card.answerHistory) ? [...card.answerHistory] : [],
        };
    }

    function snapshotQuizUiState() {
        return {
            questionText: questionEl.textContent,
            questionHasReversePrompt: questionEl.classList.contains('reverse-prompt'),
            questionHasParetoPrompt: questionEl.classList.contains('pareto-prompt'),
            questionHasSentenceDeckPrompt: questionEl.classList.contains('sentence-deck-prompt'),
            questionHasIrregularVerbPrompt: questionEl.classList.contains('irregular-verb-prompt'),
            germanExampleHtml: germanExampleEl.innerHTML,
            germanExampleDisplay: germanExampleEl.style.display,
            feedbackHtml: feedbackEl.innerHTML,
            feedbackClassName: feedbackEl.className,
            feedbackVisible: feedbackEl.classList.contains('visible'),
            answerInputValue: answerInputEl.value,
            answerInputDisabled: answerInputEl.disabled,
            answerInputDisplay: answerInputEl.style.display,
            statsDisplay: statsContainer.style.display,
        };
    }

    function restoreQuizUiState(savedUi = {}) {
        questionEl.classList.remove('faded');
        germanExampleEl.classList.remove('faded');
        questionEl.classList.toggle('reverse-prompt', Boolean(savedUi.questionHasReversePrompt));
        questionEl.classList.toggle('pareto-prompt', Boolean(savedUi.questionHasParetoPrompt));
        questionEl.classList.toggle('sentence-deck-prompt', Boolean(savedUi.questionHasSentenceDeckPrompt));
        questionEl.classList.toggle('irregular-verb-prompt', Boolean(savedUi.questionHasIrregularVerbPrompt));

        if (quizState.currentCard) {
            renderCurrentCard(quizState.currentCard);
        } else {
            questionEl.textContent = savedUi.questionText || '';
            germanExampleEl.innerHTML = savedUi.germanExampleHtml || '';
            germanExampleEl.style.display = savedUi.germanExampleDisplay || 'none';
        }

        feedbackEl.innerHTML = savedUi.feedbackHtml || '';
        feedbackEl.className = savedUi.feedbackClassName || '';
        feedbackEl.classList.toggle('visible', Boolean(savedUi.feedbackVisible));
        answerInputEl.value = savedUi.answerInputValue || '';
        answerInputEl.disabled = Boolean(savedUi.answerInputDisabled);
        answerInputEl.style.display = savedUi.answerInputDisplay || (quizState.deckName ? 'block' : '');
        statsContainer.style.display = savedUi.statsDisplay || (quizState.deckName ? 'block' : 'none');

        if (!quizState.isShowingAnswer && answerInputEl.style.display !== 'none') {
            answerInputEl.focus();
        }
    }

    function captureQuizRuntimeState() {
        return {
            deck: quizState.deck.map(cloneSavedCard),
            upcomingCardIds: quizState.upcomingCards.map(getCardSessionId),
            currentCardId: getCardSessionId(quizState.currentCard),
            mode: quizState.mode,
            score: quizState.score,
            learnedCount: quizState.learnedCount,
            questionsAnswered: quizState.questionsAnswered,
            deckName: quizState.deckName,
            deckCardCount: quizState.deckCardCount,
            isShowingAnswer: quizState.isShowingAnswer,
            currentCardHasBeenGivenUp: quizState.currentCardHasBeenGivenUp,
            sessionStatsRecorded: quizState.sessionStatsRecorded,
            excludedCardIds: Array.from(quizState.excludedCardIds),
            selectedDeck: deckSelectorEl.value,
            wildPokemon: quizState.wildPokemon,
            pokemonUi: {
                nameText: pokemonNameEl.textContent,
                nameCaught: pokemonNameEl.classList.contains('caught-text'),
                imageSrc: pokemonImageEl.src,
                imageVisible: pokemonImageEl.classList.contains('visible'),
            },
            ui: snapshotQuizUiState(),
        };
    }

    function restoreQuizRuntimeState(savedState) {
        clearAdvanceTimers();
        if (!savedState || !Array.isArray(savedState.deck) || savedState.deck.length === 0) {
            resetQuizSelection();
            return;
        }

        const restoredDeck = savedState.deck.map(cloneSavedCard);
        const cardLookup = new Map(restoredDeck.map(card => [getCardSessionId(card), card]));
        quizState.deck = restoredDeck;
        quizState.upcomingCards = (savedState.upcomingCardIds || []).map(id => cardLookup.get(id)).filter(Boolean);
        quizState.currentCard = cardLookup.get(savedState.currentCardId) || null;
        quizState.mode = savedState.mode || 'conquest';
        quizState.score = savedState.score || 0;
        quizState.learnedCount = savedState.learnedCount || 0;
        quizState.questionsAnswered = savedState.questionsAnswered || 0;
        quizState.deckName = savedState.deckName || null;
        quizState.deckCardCount = savedState.deckCardCount ?? restoredDeck.length;
        quizState.isShowingAnswer = Boolean(savedState.isShowingAnswer);
        quizState.currentCardHasBeenGivenUp = Boolean(savedState.currentCardHasBeenGivenUp);
        quizState.sessionStatsRecorded = Boolean(savedState.sessionStatsRecorded);
        quizState.excludedCardIds = new Set(savedState.excludedCardIds || []);
        quizState.wildPokemon = savedState.wildPokemon || null;

        if (quizState.activeStudyTab === 'vocabulary') {
            deckSelectorEl.value = savedState.selectedDeck || quizState.deckName || '';
        }
        quizContainerEl.style.opacity = 1;
        restorePokemonDisplay(savedState.pokemonUi);
        restoreQuizUiState(savedState.ui);
        updateStatsDisplay();
        updateCustomDeckControls();
        scheduleMobileAdvance();
    }

    function updateStudyTabUI() {
        studyTabEls.forEach(tabEl => {
            const isActive = tabEl.dataset.studyTab === quizState.activeStudyTab;
            tabEl.classList.toggle('active', isActive);
            tabEl.setAttribute('aria-selected', String(isActive));
        });
        paretoDeckTabsEl.hidden = quizState.activeStudyTab !== 'pareto';
        connectorModeTabsEl.hidden = quizState.activeStudyTab !== 'connectors';
        connectorModeTabEls.forEach(tabEl => {
            const isReverse = tabEl.dataset.connectorDirection === 'english-to-german';
            const isActive = isReverse === quizState.connectorReverseModeEnabled;
            tabEl.classList.toggle('active', isActive);
            tabEl.setAttribute('aria-selected', String(isActive));
        });
        paretoDeckTabEls.forEach(tabEl => {
            const isActive = tabEl.dataset.paretoDeck === quizState.paretoDeckName;
            tabEl.classList.toggle('active', isActive);
            tabEl.setAttribute('aria-selected', String(isActive));
        });
        const patternFrameVisible = quizState.activeStudyTab === 'pareto'
            && quizState.paretoDeckName === 'pareto_patterns';
        paretoPatternFrameControlEl.hidden = !patternFrameVisible;
        paretoPatternFrameSelectorEl.value = quizState.paretoPatternFrame;
        document.body.classList.toggle('pareto-patterns-active', patternFrameVisible);
        sentenceDeckTabsEl.hidden = quizState.activeStudyTab !== 'sentences';
        sentenceDeckTabEls.forEach(tabEl => {
            const isActive = tabEl.dataset.sentenceDeck === quizState.sentenceDeckName;
            tabEl.classList.toggle('active', isActive);
            tabEl.setAttribute('aria-selected', String(isActive));
        });
        darkDeckTabsEl.hidden = quizState.activeStudyTab !== 'dark';
        darkDeckTabEls.forEach(tabEl => {
            const isActive = tabEl.dataset.darkDeck === quizState.darkDeckName;
            tabEl.classList.toggle('active', isActive);
            tabEl.setAttribute('aria-selected', String(isActive));
        });
        irregularVerbModeToggleEls.forEach(toggleEl => {
            toggleEl.checked = quizState.activeStudyTab === 'irregular'
                && toggleEl.dataset.irregularVerbMode === quizState.irregularVerbMode;
        });
        const speechActive = quizState.activeStudyTab === 'speech';
        speechA2DeckBtnEl.classList.toggle('active', speechActive);
        speechA2DeckBtnEl.setAttribute('aria-pressed', String(speechActive));
        document.body.classList.toggle('pareto-tab-active', quizState.activeStudyTab === 'pareto');
        document.body.classList.toggle('sentence-tab-active', quizState.activeStudyTab === 'sentences');
        document.body.classList.toggle('dark-tab-active', quizState.activeStudyTab === 'dark');
        document.body.classList.toggle('connectors-tab-active', quizState.activeStudyTab === 'connectors');
        document.body.classList.toggle('irregular-verbs-active', quizState.activeStudyTab === 'irregular');
    }

    function switchConnectorDirection(direction) {
        if (quizState.activeStudyTab !== 'connectors') {
            return;
        }

        const reverseEnabled = direction === 'english-to-german';
        if (reverseEnabled === quizState.connectorReverseModeEnabled) {
            return;
        }

        quizState.connectorReverseModeEnabled = reverseEnabled;
        saveConnectorReverseModeEnabled(reverseEnabled);
        updateStudyTabUI();

        if (quizState.isShowingAnswer) {
            nextQuestion();
            return;
        }

        answerInputEl.value = '';
        feedbackEl.innerHTML = '';
        feedbackEl.className = '';
        feedbackEl.classList.remove('visible');
        if (quizState.currentCard) {
            renderCurrentCard(quizState.currentCard);
            answerInputEl.focus();
        }
    }

    async function switchStudyTab(targetTab) {
        if (!['vocabulary', 'pareto', 'speech'].includes(targetTab) || targetTab === quizState.activeStudyTab) {
            return;
        }

        stopAudioPlayback();
        const currentSession = captureQuizRuntimeState();
        quizState.studyTabSessions[quizState.activeStudyTab] = currentSession;
        if (quizState.activeStudyTab === 'pareto') {
            quizState.paretoDeckSessions[quizState.paretoDeckName] = currentSession;
            if (quizState.paretoDeckName === 'pareto_patterns') {
                quizState.paretoPatternFrameSessions[quizState.paretoPatternFrame] = currentSession;
            }
        } else if (quizState.activeStudyTab === 'sentences') {
            quizState.sentenceDeckSessions[quizState.sentenceDeckName] = currentSession;
        } else if (quizState.activeStudyTab === 'dark') {
            quizState.darkDeckSessions[quizState.darkDeckName] = currentSession;
        } else if (quizState.activeStudyTab === 'irregular' && quizState.irregularVerbMode) {
            quizState.irregularVerbSessions[quizState.irregularVerbMode] = currentSession;
        }
        quizState.activeStudyTab = targetTab;
        updateStudyTabUI();

        const savedSession = quizState.studyTabSessions[targetTab];
        if (savedSession) {
            restoreQuizRuntimeState(savedSession);
            return;
        }

        if (targetTab === 'pareto') {
            await startQuiz(quizState.paretoDeckName, 'conquest');
        } else if (targetTab === 'sentences') {
            await startQuiz(quizState.sentenceDeckName, 'conquest');
        } else if (targetTab === 'dark') {
            await startQuiz(quizState.darkDeckName, 'conquest');
        } else if (targetTab === 'connectors') {
            await startQuiz('conversation_connectors', 'conquest');
        } else if (targetTab === 'speech') {
            await startQuiz(SPEECH_A2_DECK.fileName, 'conquest');
        } else {
            resetQuizSelection();
        }
    }

    async function switchIrregularVerbMode(mode) {
        if (!IRREGULAR_VERB_MODES.has(mode)) {
            return;
        }

        if (quizState.activeStudyTab === 'irregular' && quizState.irregularVerbMode === mode) {
            updateStudyTabUI();
            return;
        }

        stopAudioPlayback();
        const currentSession = captureQuizRuntimeState();
        quizState.studyTabSessions[quizState.activeStudyTab] = currentSession;

        if (quizState.activeStudyTab === 'irregular' && quizState.irregularVerbMode) {
            quizState.irregularVerbSessions[quizState.irregularVerbMode] = currentSession;
        } else {
            quizState.irregularVerbReturnTab = ['vocabulary', 'pareto', 'speech']
                .includes(quizState.activeStudyTab)
                ? quizState.activeStudyTab
                : 'vocabulary';
        }

        if (quizState.modalVerbTableEnabled) {
            quizState.modalVerbTableEnabled = false;
            modalVerbTableToggleEl.checked = false;
            saveModalVerbTableEnabled(false);
            renderModalVerbPractice();
        }

        quizState.activeStudyTab = 'irregular';
        quizState.irregularVerbMode = mode;
        updateStudyTabUI();

        const savedSession = quizState.irregularVerbSessions[mode];
        if (savedSession) {
            restoreQuizRuntimeState(savedSession);
            return;
        }

        await startQuiz(IRREGULAR_VERB_DECK_BY_MODE[mode], 'conquest');
    }

    async function switchParetoDeck(deckName) {
        if (quizState.activeStudyTab !== 'pareto' || !PARETO_DECK_NAMES.has(deckName)) {
            return;
        }

        if (deckName === quizState.paretoDeckName && quizState.deckName === deckName) {
            return;
        }

        if (isParetoDeckName(quizState.deckName)) {
            const currentSession = captureQuizRuntimeState();
            quizState.paretoDeckSessions[quizState.paretoDeckName] = currentSession;
            if (quizState.paretoDeckName === 'pareto_patterns') {
                quizState.paretoPatternFrameSessions[quizState.paretoPatternFrame] = currentSession;
            }
        }
        quizState.paretoDeckName = deckName;
        updateStudyTabUI();

        const savedSession = deckName === 'pareto_patterns'
            ? quizState.paretoPatternFrameSessions[quizState.paretoPatternFrame]
                || quizState.paretoDeckSessions[deckName]
            : quizState.paretoDeckSessions[deckName];
        if (savedSession) {
            restoreQuizRuntimeState(savedSession);
        } else {
            await startQuiz(deckName, 'conquest');
        }
    }

    async function switchParetoPatternFrame(frameName) {
        if (
            quizState.activeStudyTab !== 'pareto'
            || quizState.paretoDeckName !== 'pareto_patterns'
            || !PARETO_PATTERN_FRAMES.has(frameName)
            || frameName === quizState.paretoPatternFrame
        ) {
            return;
        }

        stopAudioPlayback();
        quizState.paretoPatternFrameSessions[quizState.paretoPatternFrame] = captureQuizRuntimeState();
        quizState.paretoPatternFrame = frameName;
        updateStudyTabUI();

        const savedSession = quizState.paretoPatternFrameSessions[frameName];
        if (savedSession) {
            restoreQuizRuntimeState(savedSession);
        } else {
            await startQuiz('pareto_patterns', 'conquest');
        }
    }

    async function switchSentenceDeck(deckName) {
        if (quizState.activeStudyTab !== 'sentences' || !SENTENCE_DECK_NAMES.has(deckName)) {
            return;
        }

        if (deckName === quizState.sentenceDeckName && quizState.deckName === deckName) {
            return;
        }

        if (isSentenceDeckName(quizState.deckName)) {
            quizState.sentenceDeckSessions[quizState.sentenceDeckName] = captureQuizRuntimeState();
        }
        quizState.sentenceDeckName = deckName;
        updateStudyTabUI();

        const savedSession = quizState.sentenceDeckSessions[deckName];
        if (savedSession) {
            restoreQuizRuntimeState(savedSession);
        } else {
            await startQuiz(deckName, 'conquest');
        }
    }

    async function switchDarkDeck(deckName) {
        if (quizState.activeStudyTab !== 'dark' || !DARK_DECK_NAMES.has(deckName)) {
            return;
        }

        if (deckName === quizState.darkDeckName && quizState.deckName === deckName) {
            return;
        }

        if (isDarkDeckName(quizState.deckName)) {
            quizState.darkDeckSessions[quizState.darkDeckName] = captureQuizRuntimeState();
        }
        quizState.darkDeckName = deckName;
        updateStudyTabUI();

        const savedSession = quizState.darkDeckSessions[deckName];
        if (savedSession) {
            restoreQuizRuntimeState(savedSession);
        } else {
            await startQuiz(deckName, 'conquest');
        }
    }

    function captureSessionSnapshot() {
        return {
            version: SAVE_FILE_VERSION,
            savedAt: new Date().toISOString(),
            stats: getStats(),
            settings: {
                autoplayAudioEnabled: quizState.autoplayAudioEnabled,
                reverseInputModeEnabled: quizState.reverseInputModeEnabled,
                showGermanSentenceEnabled: quizState.showGermanSentenceEnabled,
                sentenceTranslationModeEnabled: quizState.sentenceTranslationModeEnabled,
                casePracticeModeEnabled: quizState.casePracticeModeEnabled,
                connectorReverseModeEnabled: quizState.connectorReverseModeEnabled,
                auxiliarySelections: { ...quizState.auxiliarySelections },
                modalVerbTableEnabled: quizState.modalVerbTableEnabled,
                modalVerbTense: quizState.modalVerbTense,
                modalVerbShowAnswers: { ...quizState.modalVerbShowAnswers },
                activeStudyTab: quizState.activeStudyTab,
                irregularVerbMode: quizState.irregularVerbMode,
                irregularVerbReturnTab: quizState.irregularVerbReturnTab,
                paretoDeckName: quizState.paretoDeckName,
                paretoPatternFrame: quizState.paretoPatternFrame,
                sentenceDeckName: quizState.sentenceDeckName,
                darkDeckName: quizState.darkDeckName,
                pokemonModeActive: quizState.pokemonModeActive,
                selectedDeck: deckSelectorEl.value,
                sidePanelOpen: sidePanel.classList.contains('open'),
            },
            quiz: {
                deck: quizState.deck.map(cloneSavedCard),
                upcomingCardIds: quizState.upcomingCards.map(getCardSessionId),
                currentCardId: getCardSessionId(quizState.currentCard),
                mode: quizState.mode,
                score: quizState.score,
                learnedCount: quizState.learnedCount,
                questionsAnswered: quizState.questionsAnswered,
                deckName: quizState.deckName,
                deckCardCount: quizState.deckCardCount,
                isShowingAnswer: quizState.isShowingAnswer,
                decompositionCache: quizState.decompositionCache,
                currentCardHasBeenGivenUp: quizState.currentCardHasBeenGivenUp,
                sessionStatsRecorded: quizState.sessionStatsRecorded,
                conquestModePercentCorrectThreshold: quizState.conquestModePercentCorrectThreshold,
                conquestModeSpacingModifier: quizState.conquestModeSpacingModifier,
                excludedCardIds: Array.from(quizState.excludedCardIds),
                modalVerbPractice: Object.fromEntries(
                    Object.entries(quizState.modalVerbPractice).map(([tense, practiceState]) => [tense, {
                        values: { ...practiceState.values },
                        completedCells: [...practiceState.completedCells],
                        activeCellKey: practiceState.activeCellKey,
                    }])
                ),
                ui: snapshotQuizUiState(),
            },
            pokemon: {
                pokedex: [...quizState.pokedex],
                wildPokemon: quizState.wildPokemon,
                pokedexFilter: quizState.pokedexFilter,
                pokedexSearchTerm: quizState.pokedexSearchTerm,
                pokedexLoaded: quizState.pokedexLoaded,
                pokemonRarityById: quizState.pokemonRarityById,
                ui: {
                    nameText: pokemonNameEl.textContent,
                    nameCaught: pokemonNameEl.classList.contains('caught-text'),
                    imageSrc: pokemonImageEl.src,
                    imageVisible: pokemonImageEl.classList.contains('visible'),
                }
            },
            studyTabs: {
                vocabulary: quizState.activeStudyTab === 'vocabulary' ? null : quizState.studyTabSessions.vocabulary,
                connectors: quizState.activeStudyTab === 'connectors' ? null : quizState.studyTabSessions.connectors,
                pareto: quizState.activeStudyTab === 'pareto' ? null : quizState.studyTabSessions.pareto,
                sentences: quizState.activeStudyTab === 'sentences' ? null : quizState.studyTabSessions.sentences,
                dark: quizState.activeStudyTab === 'dark' ? null : quizState.studyTabSessions.dark,
                irregular: quizState.activeStudyTab === 'irregular' ? null : quizState.studyTabSessions.irregular,
                speech: quizState.activeStudyTab === 'speech' ? null : quizState.studyTabSessions.speech,
                paretoDeckSessions: Object.fromEntries(
                    Object.entries(quizState.paretoDeckSessions).map(([deckName, session]) => [
                        deckName,
                        quizState.activeStudyTab === 'pareto' && deckName === quizState.paretoDeckName ? null : session,
                    ])
                ),
                paretoPatternFrameSessions: Object.fromEntries(
                    Object.entries(quizState.paretoPatternFrameSessions).map(([frameName, session]) => [
                        frameName,
                        quizState.activeStudyTab === 'pareto'
                            && quizState.paretoDeckName === 'pareto_patterns'
                            && frameName === quizState.paretoPatternFrame
                            ? null
                            : session,
                    ])
                ),
                sentenceDeckSessions: Object.fromEntries(
                    Object.entries(quizState.sentenceDeckSessions).map(([deckName, session]) => [
                        deckName,
                        quizState.activeStudyTab === 'sentences' && deckName === quizState.sentenceDeckName ? null : session,
                    ])
                ),
                darkDeckSessions: Object.fromEntries(
                    Object.entries(quizState.darkDeckSessions).map(([deckName, session]) => [
                        deckName,
                        quizState.activeStudyTab === 'dark' && deckName === quizState.darkDeckName ? null : session,
                    ])
                ),
                irregularVerbSessions: Object.fromEntries(
                    Object.entries(quizState.irregularVerbSessions).map(([mode, session]) => [
                        mode,
                        quizState.activeStudyTab === 'irregular' && mode === quizState.irregularVerbMode ? null : session,
                    ])
                ),
            },
        };
    }

    async function restoreSessionSnapshot(snapshot) {
        clearAdvanceTimers();
        stopAudioPlayback();

        if (quizState.typingAnimationInterval) {
            clearInterval(quizState.typingAnimationInterval);
            quizState.typingAnimationInterval = null;
        }

        const settings = snapshot.settings || {};
        const savedQuiz = snapshot.quiz || {};
        const savedPokemon = snapshot.pokemon || {};

        saveStats(snapshot.stats || {});
        quizState.autoplayAudioEnabled = Boolean(settings.autoplayAudioEnabled);
        quizState.reverseInputModeEnabled = Boolean(settings.reverseInputModeEnabled);
        quizState.showGermanSentenceEnabled = Boolean(settings.showGermanSentenceEnabled);
        quizState.sentenceTranslationModeEnabled = Boolean(settings.sentenceTranslationModeEnabled);
        quizState.casePracticeModeEnabled = Boolean(settings.casePracticeModeEnabled);
        quizState.connectorReverseModeEnabled = Boolean(settings.connectorReverseModeEnabled);
        quizState.auxiliarySelections = {
            sein: false,
            haben: false,
            werden: false,
            ...(settings.auxiliarySelections || {}),
        };
        quizState.modalVerbTableEnabled = typeof settings.modalVerbTableEnabled === 'boolean'
            ? settings.modalVerbTableEnabled
            : Boolean(settings.modalVerbTense);
        quizState.modalVerbTense = ['praesens', 'praeteritum', 'konjunktiv-ii'].includes(settings.modalVerbTense)
            ? settings.modalVerbTense
            : 'praesens';
        quizState.modalVerbShowAnswers = {
            praesens: false,
            praeteritum: false,
            'konjunktiv-ii': false,
            ...(settings.modalVerbShowAnswers || {}),
        };
        quizState.irregularVerbMode = IRREGULAR_VERB_MODES.has(settings.irregularVerbMode)
            ? settings.irregularVerbMode
            : null;
        quizState.irregularVerbReturnTab = ['vocabulary', 'pareto', 'speech']
            .includes(settings.irregularVerbReturnTab)
            ? settings.irregularVerbReturnTab
            : 'vocabulary';
        quizState.activeStudyTab = ['vocabulary', 'pareto', 'irregular', 'speech'].includes(settings.activeStudyTab)
            && (settings.activeStudyTab !== 'irregular' || quizState.irregularVerbMode)
            ? settings.activeStudyTab
            : 'vocabulary';
        quizState.paretoDeckName = PARETO_DECK_NAMES.has(settings.paretoDeckName)
            ? settings.paretoDeckName
            : 'pareto_core';
        quizState.paretoPatternFrame = PARETO_PATTERN_FRAMES.has(settings.paretoPatternFrame)
            ? settings.paretoPatternFrame
            : 'all';
        quizState.sentenceDeckName = SENTENCE_DECK_NAMES.has(settings.sentenceDeckName)
            ? settings.sentenceDeckName
            : 'sentences_read';
        quizState.darkDeckName = DARK_DECK_NAMES.has(settings.darkDeckName)
            ? settings.darkDeckName
            : 'dark_s01e01_understand';
        quizState.studyTabSessions = {
            vocabulary: snapshot.studyTabs?.vocabulary || null,
            connectors: snapshot.studyTabs?.connectors || null,
            pareto: snapshot.studyTabs?.pareto || null,
            sentences: snapshot.studyTabs?.sentences || null,
            dark: snapshot.studyTabs?.dark || null,
            irregular: snapshot.studyTabs?.irregular || null,
            speech: snapshot.studyTabs?.speech || null,
        };
        quizState.paretoDeckSessions = {
            pareto_core: snapshot.studyTabs?.paretoDeckSessions?.pareto_core || null,
            pareto_patterns: snapshot.studyTabs?.paretoDeckSessions?.pareto_patterns || null,
            pareto_extension: snapshot.studyTabs?.paretoDeckSessions?.pareto_extension || null,
        };
        quizState.paretoPatternFrameSessions = Object.fromEntries(
            Object.entries(snapshot.studyTabs?.paretoPatternFrameSessions || {})
                .filter(([frameName]) => PARETO_PATTERN_FRAMES.has(frameName))
        );
        quizState.sentenceDeckSessions = {
            sentences_read: snapshot.studyTabs?.sentenceDeckSessions?.sentences_read || null,
            sentences_speak: snapshot.studyTabs?.sentenceDeckSessions?.sentences_speak || null,
        };
        quizState.darkDeckSessions = {
            dark_s01e01_understand: snapshot.studyTabs?.darkDeckSessions?.dark_s01e01_understand || null,
            dark_s01e01_recall: snapshot.studyTabs?.darkDeckSessions?.dark_s01e01_recall || null,
        };
        quizState.irregularVerbSessions = {
            meaning: snapshot.studyTabs?.irregularVerbSessions?.meaning || null,
            praesens: snapshot.studyTabs?.irregularVerbSessions?.praesens || null,
            praeteritum: snapshot.studyTabs?.irregularVerbSessions?.praeteritum || null,
            perfekt: snapshot.studyTabs?.irregularVerbSessions?.perfekt || null,
        };
        quizState.pokemonModeActive = Boolean(settings.pokemonModeActive);

        saveAutoplayAudioEnabled(quizState.autoplayAudioEnabled);
        saveReverseInputModeEnabled(quizState.reverseInputModeEnabled);
        saveShowGermanSentenceEnabled(quizState.showGermanSentenceEnabled);
        saveSentenceTranslationModeEnabled(quizState.sentenceTranslationModeEnabled);
        saveCasePracticeModeEnabled(quizState.casePracticeModeEnabled);
        saveConnectorReverseModeEnabled(quizState.connectorReverseModeEnabled);
        saveAuxiliarySelections(quizState.auxiliarySelections);
        saveModalVerbTableEnabled(quizState.modalVerbTableEnabled);
        saveModalVerbTense(quizState.modalVerbTense);

        autoplayAudioToggleEl.checked = quizState.autoplayAudioEnabled;
        reverseInputToggleEl.checked = quizState.reverseInputModeEnabled;
        showGermanSentenceToggleEl.checked = quizState.showGermanSentenceEnabled;
        sentenceTranslationToggleEl.checked = quizState.sentenceTranslationModeEnabled;
        casePracticeToggleEl.checked = quizState.casePracticeModeEnabled;
        auxiliaryToggleEls.forEach(toggleEl => {
            toggleEl.checked = Boolean(quizState.auxiliarySelections[toggleEl.dataset.auxiliary]);
        });
        modalVerbTableToggleEl.checked = quizState.modalVerbTableEnabled;
        modalVerbTenseToggleEls.forEach(toggleEl => {
            toggleEl.checked = toggleEl.dataset.modalverbTense === quizState.modalVerbTense;
        });
        updateReverseModeControls();
        updateAnswerInputPlaceholder();

        const restoredDeck = Array.isArray(savedQuiz.deck) ? savedQuiz.deck.map(cloneSavedCard) : [];
        const cardLookup = new Map(restoredDeck.map(card => [getCardSessionId(card), card]));

        quizState.deck = restoredDeck;
        quizState.upcomingCards = (savedQuiz.upcomingCardIds || [])
            .map(id => cardLookup.get(id))
            .filter(Boolean);
        quizState.currentCard = cardLookup.get(savedQuiz.currentCardId) || null;
        quizState.mode = savedQuiz.mode || 'conquest';
        quizState.score = savedQuiz.score || 0;
        quizState.learnedCount = savedQuiz.learnedCount || 0;
        quizState.questionsAnswered = savedQuiz.questionsAnswered || 0;
        quizState.deckName = savedQuiz.deckName || null;
        quizState.deckCardCount = typeof savedQuiz.deckCardCount === 'number' ? savedQuiz.deckCardCount : restoredDeck.length;
        quizState.isShowingAnswer = Boolean(savedQuiz.isShowingAnswer);
        quizState.decompositionCache = savedQuiz.decompositionCache || {};
        quizState.currentCardHasBeenGivenUp = Boolean(savedQuiz.currentCardHasBeenGivenUp);
        quizState.sessionStatsRecorded = Boolean(savedQuiz.sessionStatsRecorded);
        quizState.conquestModePercentCorrectThreshold = savedQuiz.conquestModePercentCorrectThreshold || 0.76;
        quizState.conquestModeSpacingModifier = savedQuiz.conquestModeSpacingModifier || 1.0;
        quizState.excludedCardIds = new Set(savedQuiz.excludedCardIds || []);
        quizState.modalVerbPractice = normalizeModalVerbPracticeCollection(savedQuiz.modalVerbPractice);

        quizState.pokedex = Array.isArray(savedPokemon.pokedex) ? [...savedPokemon.pokedex] : [];
        quizState.wildPokemon = savedPokemon.wildPokemon || null;
        quizState.pokedexFilter = savedPokemon.pokedexFilter || 'all';
        quizState.pokedexSearchTerm = savedPokemon.pokedexSearchTerm || '';
        quizState.pokemonRarityById = savedPokemon.pokemonRarityById || quizState.pokemonRarityById || {};
        quizState.pokedexLoaded = false;
        quizState.allPokemon = [];
        quizState.pokemonById = new Map();
        resetPokemonPools();
        quizState.pokemonRarityWarmupPromise = null;

        savePokedexToStorage(quizState.pokedex);
        savePokemonRarityCache(quizState.pokemonRarityById);
        deckSelectorEl.value = settings.selectedDeck || '';
        sidePanel.classList.toggle('open', Boolean(settings.sidePanelOpen));
        pokedexSearchEl.value = quizState.pokedexSearchTerm;
        applyPokemonFilterUI();
        updateCustomDeckControls();

        quizContainerEl.style.opacity = quizState.deckName ? 1 : '';

        await syncPokemonModeUI({ fetchPokedex: Boolean(savedPokemon.pokedexLoaded || quizState.pokemonModeActive || quizState.pokedex.length > 0) });
        restorePokemonDisplay(savedPokemon.ui);

        if (quizState.currentCard || quizState.deckName) {
            restoreQuizUiState(savedQuiz.ui);
        } else {
            renderNoActiveQuestion();
            answerInputEl.style.display = 'block';
        }

        updateStatsDisplay();
        if (quizState.pokedexLoaded) {
            updatePokedexDisplay();
        }
        updateStudyTabUI();
        renderModalVerbPractice();
    }

    function excludeCurrentCard() {
        if (!quizState.currentCard) {
            return;
        }

        clearAdvanceTimers();

        const currentCardId = getCardSessionId(quizState.currentCard);
        if (!currentCardId) {
            return;
        }

        quizState.excludedCardIds.add(currentCardId);
        quizState.deck = quizState.deck.filter(card => getCardSessionId(card) !== currentCardId);
        quizState.upcomingCards = quizState.upcomingCards.filter(card => getCardSessionId(card) !== currentCardId);
        syncDeckCardCount();

        quizState.currentCard = null;
        quizState.isShowingAnswer = false;
        quizState.currentCardHasBeenGivenUp = false;

        stopAudioPlayback();
        feedbackEl.innerHTML = '';
        feedbackEl.className = '';
        feedbackEl.classList.remove('visible');
        answerInputEl.value = '';
        answerInputEl.disabled = false;
        answerInputEl.style.display = 'block';

        if (quizState.deck.length === 0) {
            renderNoActiveQuestion();
        } else {
            displayQuestion();
        }

        updateStatsDisplay();
    }

    function displayQuestion() {
        quizState.isShowingAnswer = false;
        answerInputEl.disabled = false;
        answerInputEl.value = '';
        answerInputEl.focus();

        let card;
        if (quizState.mode === 'normal') {
            card = quizState.upcomingCards[quizState.questionsAnswered];
        } else { // conquest
            card = quizState.upcomingCards[quizState.upcomingCards.length - 1];
        }

        questionEl.innerHTML = ''; // Clear previous question
        
        if (card) {
            quizState.currentCard = card;
            if (quizState.mode === 'conquest') {
                quizState.currentCard.answerHistory.push(false);
            }
            questionEl.classList.remove('faded');
            germanExampleEl.classList.remove('faded');
            renderCurrentCard(quizState.currentCard, { autoplayOnDisplay: true });
        } else {
            renderNoActiveQuestion();
        }
    }

    function getFeedbackMeaning(card, isCorrect) {
        if (isConnectorDeckCard(card)) {
            return isCorrect || isReverseWordModeActive() ? card.meaning || '' : '';
        }

        if (card?.darkDeckType === 'understand') {
            return isCorrect ? card.meaning || '' : '';
        }

        if (['pattern-cloze', 'pattern-recognition'].includes(card?.paretoType)) {
            const englishMeaning = card.englishSentencePrompt
                || (card.paretoType === 'pattern-recognition' ? card.meaning : '');
            return isCorrect
                ? [card.germanExample, englishMeaning].filter(Boolean).join(' — ')
                : englishMeaning;
        }

        return card?.meaning || '';
    }
    
    function showAndAdvance(isCorrect, givenUp = false) {
        clearAdvanceTimers();
        quizState.isShowingAnswer = true;
        answerInputEl.disabled = true;

        let meaning = getFeedbackMeaning(quizState.currentCard, isCorrect);
        const meaningParts = meaning.split(';').map(s => s.trim());
        if (meaningParts.length > 3) {
            meaning = meaningParts.slice(0, 3).join('; ') + '...';
        } else {
            meaning = meaningParts.join('; ');
        }
        const meaningHTML = meaning
            ? `<br><span style="font-size: 1.5rem; color: var(--subtle-text);">${meaning}</span>`
            : '';

        if (isCorrect) {
            if (!quizState.currentCardHasBeenGivenUp) {
                quizState.score++;
            }
            const speechAnswer = isSpeechCard(quizState.currentCard)
                ? `<br><span class="speech-answer">${escapeHtml(getPrimaryAnswer(quizState.currentCard))}</span>`
                : '';
            feedbackEl.innerHTML = `Correct!${speechAnswer}${meaningHTML}`;
            feedbackEl.className = 'correct';
            answerInputEl.value = '';
        } else {
            const primaryAnswer = getPrimaryAnswer(quizState.currentCard);
            feedbackEl.innerHTML = `${primaryAnswer}${meaningHTML}`;
            feedbackEl.className = 'incorrect';
        }
        
        feedbackEl.classList.add('visible');
        updateLearnedProgress(quizState.currentCard, isCorrect);
        quizState.questionsAnswered++;
        updateStats(isCorrect && !quizState.currentCardHasBeenGivenUp);

        if (quizState.autoplayAudioEnabled) {
            if (isSentenceDeckCard(quizState.currentCard) || isDarkDeckCard(quizState.currentCard) || isSpeechCard(quizState.currentCard) || isSentenceTranslationModeActive() || isCasePracticeModeActive()) {
                playCurrentSentenceAudio();
            } else {
                playCurrentWordAudio();
            }
        }

        updateAudioButtons(quizState.currentCard);

        // --- Pokemon Mode Logic ---
        if (quizState.pokemonModeActive && isCorrect) {
            // A pokemon was already there, so this correct answer catches it
            if (quizState.wildPokemon) {
                catchPokemon(quizState.wildPokemon);
            } else {
                 // If no pokemon was there, spawn a new one
                spawnPokemon();
            }
        } else if (quizState.pokemonModeActive && !isCorrect) {
            // You failed to catch it
            if (quizState.wildPokemon) {
                const fledPokemonName = quizState.wildPokemon.name;
                pokemonNameEl.classList.remove('caught-text');
                typeAnimation(pokemonNameEl, `The wild ${fledPokemonName} fled...`);
                pokemonImageEl.classList.remove('visible');
                quizState.wildPokemon = null;
            }
        }

        if (quizState.mode === 'conquest') {
            if (isCorrect) {
                quizState.currentCard.answerHistory.pop();
                quizState.currentCard.answerHistory.push(true);
            }
            removeCurrentCardFromUpcomingCards();
            recycleCard(quizState.currentCard);
        }
        
        scheduleMobileAdvance();
    }

    function checkAnswer() {
        if (quizState.isShowingAnswer) return;

        const userAnswer = answerInputEl.value.trim();
        if (!userAnswer || !quizState.currentCard) return;

        if (userAnswer === '.') {
            quizState.currentCardHasBeenGivenUp = true;
            showAndAdvance(false, true); // give up
            return;
        }

        const normalizedUserAnswer = normalizeInputForCurrentMode(userAnswer);
        const isCorrect = getAcceptedAnswers(quizState.currentCard)
            .some(answer => normalizeInputForCurrentMode(answer) === normalizedUserAnswer);
        
        if (isCorrect) {
            showAndAdvance(true);
        }
    }

    function nextQuestion() {
        if (questionTransitionTimeout !== null) {
            return;
        }
        clearTimeout(mobileAdvanceTimeout);
        mobileAdvanceTimeout = null;
        stopAudioPlayback();
        // Start fading out both elements simultaneously
        questionEl.classList.add('faded');
        germanExampleEl.classList.add('faded');
        feedbackEl.classList.remove('visible');
        quizState.currentCardHasBeenGivenUp = false;

        // Wait for the animation to finish before showing the next question
        questionTransitionTimeout = setTimeout(() => {
            questionTransitionTimeout = null;
            // Clear feedback content AFTER it has faded out
            feedbackEl.innerHTML = '';
            feedbackEl.className = '';

            if (quizState.mode === 'conquest' && quizState.upcomingCards.length === 0) {
                quizState.currentCard = null;
            }
            displayQuestion();
        }, 300); // This timeout should match the CSS transition duration
    }

    async function startQuiz(deckName, mode) {
        clearAdvanceTimers();
        stopAudioPlayback();
        const loadedDeck = await loadDeck(deckName);
        if (loadedDeck.length === 0) {
            questionEl.textContent = 'Select a deck';
            return;
        };

        const selectedDeck = deckName === 'pareto_patterns'
            ? filterParetoPatternCards(loadedDeck)
            : loadedDeck;
        const preparedDeck = !isParetoDeckName(deckName) && !isSentenceDeckName(deckName) && !isDarkDeckName(deckName) && isCasePracticeModeActive()
            ? buildCasePracticeDeck(selectedDeck)
            : selectedDeck;
        if (preparedDeck.length === 0) {
            stopAudioPlayback();
            quizState.deck = [];
            quizState.upcomingCards = [];
            quizState.currentCard = null;
            quizState.deckName = null;
            quizState.deckCardCount = 0;
            quizState.score = 0;
            quizState.learnedCount = 0;
            quizState.questionsAnswered = 0;
            quizState.isShowingAnswer = false;
            quizState.sessionStatsRecorded = false;

            questionEl.classList.add('reverse-prompt');
            questionEl.textContent = 'No usable case-practice sentences found in this deck.';
            germanExampleEl.innerHTML = '';
            germanExampleEl.style.display = 'none';
            feedbackEl.innerHTML = '';
            feedbackEl.className = '';
            feedbackEl.classList.remove('visible');
            answerInputEl.value = '';
            answerInputEl.disabled = true;
            answerInputEl.style.display = 'none';
            statsContainer.style.display = 'none';
            updateStatsDisplay();
            return;
        }

        quizContainerEl.style.opacity = 1;
        answerInputEl.style.display = 'block';
        answerInputEl.disabled = false;
        answerInputEl.value = '';
        feedbackEl.innerHTML = '';
        feedbackEl.className = '';
        feedbackEl.classList.remove('visible');
        statsContainer.style.display = 'block';
        if (quizState.pokemonModeActive) {
            pokemonCatcherEl.style.display = 'flex';
        }

        quizState.deck = preparedDeck;
        quizState.deckName = deckName;
        quizState.deckCardCount = preparedDeck.length;
        quizState.mode = mode;
        quizState.score = 0;
        quizState.learnedCount = 0;
        quizState.questionsAnswered = 0;
        const preserveSourceOrder = isSentenceDeckName(deckName) || isDarkDeckName(deckName);
        quizState.upcomingCards = preserveSourceOrder
            ? [...quizState.deck].reverse()
            : [...quizState.deck];
        quizState.sessionStatsRecorded = false;
        quizState.excludedCardIds = new Set();
        if (!preserveSourceOrder) {
            shuffleArray(quizState.upcomingCards);
        }
        
        quizState.deck.forEach((card) => {
            card.learnedCorrectStreak = 0;
            card.learnedQualified = false;
            if (mode === 'conquest') {
                card.answerHistory = [];
            }
        });

        // Reset pokemon state on new quiz start
        quizState.wildPokemon = null;
        pokemonCatcherEl.classList.remove('visible');

        updateStatsDisplay();
        displayQuestion();
    }
    
    // --- Kanji Decomposition ---
    async function getDecomposition(character) {
        if (quizState.decompositionCache[character]) {
            if (!quizState.decompositionCache[character].error) {
                 return quizState.decompositionCache[character];
            }
        }
    
        if (!quizState.kanjiToIdMap) {
            console.error("Kanji to ID map not loaded yet.");
            return { error: true, message: "Map not loaded." };
        }
    
        const kanjiId = quizState.kanjiToIdMap[character];
        if (!kanjiId) {
            console.warn(`No ID found for kanji: ${character}`);
            return { error: true, message: "Kanji not in decomposition dictionary." };
        }
    
        try {
            const kanjiRes = await fetchWithRetries(`${WK_RADICALS_BASE_URL}/kanji/${kanjiId}.json`);
            if (!kanjiRes.ok) throw new Error(`Failed to fetch kanji data for ${character}`);
            const kanjiData = await kanjiRes.json();
    
            const { primaryMeaning, meaningMnemonic, related } = kanjiData;
            const radicalIds = related?.radicals || [];
    
            const radicalPromises = radicalIds.map(id => 
                fetchWithRetries(`${WK_RADICALS_BASE_URL}/subjects/${id}.json`).then(res => res.json())
            );
            const radicalDataArray = await Promise.all(radicalPromises);
    
            const radicals = radicalDataArray.map(radData => ({
                character: radData.characters?.value || '?',
                meaning: radData.primaryMeaning,
            }));
    
            const result = {
                kanjiMeaning: primaryMeaning,
                meaningMnemonic,
                radicals,
            };
            
            quizState.decompositionCache[character] = result;
            return result;
    
        } catch (e) {
            console.error(`Error fetching decomposition for ${character}:`, e);
            quizState.decompositionCache[character] = { error: true, message: e.message };
            return quizState.decompositionCache[character];
        }
    }

    async function updateDecompositionPopup(character) {
        const data = await getDecomposition(character);
    
        if (!data || data.error) {
            const message = data?.message || 'Decomposition not available.';
            decompositionDisplay.innerHTML = `<div class="radical-container"><span class="radical-meaning">${message}</span></div>`;
            if (data?.error) {
                delete quizState.decompositionCache[character];
            }
            return;
        }
    
        decompositionDisplay.innerHTML = '';
    
        const radicalsContainer = document.createElement('div');
        radicalsContainer.className = 'radicals-list';
        data.radicals.forEach(rad => {
            const radicalContainer = document.createElement('div');
            radicalContainer.className = 'radical-container';
    
            const radicalCharSpan = document.createElement('span');
            radicalCharSpan.className = 'radical-char';
            radicalCharSpan.textContent = rad.character;
    
            const radicalMeaningSpan = document.createElement('span');
            radicalMeaningSpan.className = 'radical-meaning';
            radicalMeaningSpan.textContent = rad.meaning;
    
            radicalContainer.appendChild(radicalCharSpan);
            radicalContainer.appendChild(radicalMeaningSpan);
            radicalsContainer.appendChild(radicalContainer);
        });
        decompositionDisplay.appendChild(radicalsContainer);
    
        if (data.meaningMnemonic) {
            const mnemonicP = document.createElement('p');
            mnemonicP.className = 'mnemonic';
            const formattedMnemonic = data.meaningMnemonic
                .replace(/<radical>(.*?)<\/radical>/g, '<span class="mnemonic-radical">$1</span>')
                .replace(/<kanji>(.*?)<\/kanji>/g, '<span class="mnemonic-kanji-meaning">$1</span>');
            mnemonicP.innerHTML = formattedMnemonic;
            decompositionDisplay.appendChild(mnemonicP);
        }
    }

    async function showDecomposition(character, targetElement) {
        clearTimeout(quizState.hidePopupTimeout);
        
        decompositionDisplay.classList.remove('hidden');

        // Show loading indicator ONLY if data is not already cached
        if (!quizState.decompositionCache[character]) {
            decompositionDisplay.innerHTML = '<div class="radical-container"><span class="radical-meaning">Loading...</span></div>';
        }

        // Now update with actual data. This will be instant if preloaded.
        await updateDecompositionPopup(character);
    }

    function hideDecomposition() {
        quizState.hidePopupTimeout = setTimeout(() => {
            decompositionDisplay.classList.add('hidden');
        }, 300);
    }
    
    // --- Data & UI ---

    // Helper function for retrying fetch
    async function fetchWithRetries(url, options, retries = 3, delay = 500) {
        for (let i = 0; i < retries; i++) {
            try {
                const response = await fetch(url, options);
                // Retry on 5xx server errors
                if (response.status >= 500 && response.status < 600) {
                    throw new Error(`Server error: ${response.status}`);
                }
                return response; // Success
            } catch (error) {
                if (i < retries - 1) {
                    console.warn(`Fetch attempt ${i + 1} failed. Retrying in ${delay}ms...`, error.message);
                    await new Promise(res => setTimeout(res, delay));
                } else {
                    throw error; // Rethrow last error
                }
            }
        }
    }

    async function getDecompositionFromApi(character) {
        if (quizState.decompositionCache[character]) {
            // Don't return error objects from the cache, re-fetch them.
            if (!quizState.decompositionCache[character].error) {
                 return quizState.decompositionCache[character];
            }
        }
        try {
            const encodedChar = encodeURIComponent(character);
            const targetUrl = `https://www.kanjijump.com/api/dict/${encodedChar}`;
            const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(targetUrl)}`;

            const res = await fetchWithRetries(proxyUrl);

            if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

            const parsedData = await res.json();
            
            quizState.decompositionCache[character] = parsedData;
            return parsedData;
        } catch (e) {
            console.error("Error fetching decomposition data after retries:", e);
            // Store an error state in the cache so we can show a message in the UI.
            quizState.decompositionCache[character] = { error: true };
            return { error: true };
        }
    }

    function normalizeImportedCustomCard(card, index) {
        if (!card || typeof card !== 'object') {
            throw new Error(`Card ${index + 1} is not a valid object.`);
        }

        const germanTerm = normalizeOptionalString(
            card.german_term ?? card.germanTerm ?? card.term ?? card.word ?? card.question
        );
        const englishTerms = normalizeDelimitedValues(
            card.english_term ?? card.englishTerm ?? card.translation ?? card.answer ?? card.meaning ?? card.gloss
        );

        if (!germanTerm) {
            throw new Error(`Card ${index + 1} is missing "german_term".`);
        }

        if (englishTerms.length === 0) {
            throw new Error(`Card ${index + 1} is missing "english_term".`);
        }

        return {
            id: normalizeOptionalString(card.id ?? `card-${index + 1}`),
            german_term: germanTerm,
            english_term: englishTerms.join('; '),
            german_example: normalizeOptionalString(card.german_example ?? card.germanExample ?? card.example ?? card.sentence),
            english_example: normalizeOptionalString(
                card.english_example
                ?? card.englishExample
                ?? card.example_translation
                ?? card.exampleTranslation
                ?? card.sentence_translation
                ?? card.sentenceTranslation
            ),
            wordAudioUrl: normalizeOptionalString(card.wordAudioUrl ?? card.word_audio_url),
            sentenceAudioUrl: normalizeOptionalString(card.sentenceAudioUrl ?? card.sentence_audio_url),
            tags: Array.isArray(card.tags) ? card.tags.map((tag) => normalizeOptionalString(tag)).filter(Boolean) : [],
            notes: normalizeOptionalString(card.notes),
            sourcePage: card.sourcePage ?? card.source_page ?? null,
        };
    }

    function parseImportedCustomDeck(payload) {
        const container = Array.isArray(payload)
            ? { cards: payload }
            : (payload?.deck && typeof payload.deck === 'object' ? payload.deck : payload);
        const rawCards = container?.cards ?? container?.entries ?? container?.words;

        if (!Array.isArray(rawCards)) {
            throw new Error('Imported JSON must contain a "cards" array.');
        }

        const displayName = normalizeOptionalString(
            container.displayName ?? container.name ?? container.title ?? container.deckName
        ) || `Custom Deck ${new Date().toISOString().slice(0, 10)}`;
        const deckId = slugifyCustomDeckId(
            container.deckId ?? container.id ?? container.slug ?? displayName
        );
        const cards = rawCards.map((card, index) => normalizeImportedCustomCard(card, index));

        if (cards.length === 0) {
            throw new Error('Imported deck has no cards.');
        }

        return {
            type: 'kotoba-custom-deck',
            schemaVersion: CUSTOM_DECK_SCHEMA_VERSION,
            fileName: `${CUSTOM_DECK_PREFIX}${deckId}`,
            displayName,
            sourceTitle: normalizeOptionalString(container.sourceTitle ?? container.source_title),
            chapter: normalizeOptionalString(container.chapter),
            notes: normalizeOptionalString(container.notes),
            importedAt: new Date().toISOString(),
            cardCount: cards.length,
            cards,
        };
    }

    async function loadDeck(name) {
        try {
            let data;
            let isCustomDeck = false;
            if (isCustomDeckFileName(name)) {
                const customDeck = getCustomDeckLibrary()[name];
                if (!customDeck) {
                    throw new Error(`Custom deck not found: ${name}`);
                }
                data = customDeck;
                isCustomDeck = true;
            } else {
                const dataFileName = isIrregularVerbDeckName(name) ? 'irregular_verbs' : name;
                const res = await fetch(`data/${dataFileName}.json`);
                if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
                data = await res.json();
            }
            let cards;
            if (isIrregularVerbDeckName(name)) {
                const deckDefinition = IRREGULAR_VERB_DECKS.find(deck => deck.fileName === name);
                const practiceMode = deckDefinition?.mode || 'meaning';
                const modeLabels = {
                    meaning: 'meaning',
                    praesens: 'Präsens',
                    praeteritum: 'Präteritum',
                    perfekt: 'Perfekt',
                };
                cards = (data.verbs || []).map((verb) => {
                    const meanings = Array.isArray(verb.meaning) ? verb.meaning.filter(Boolean) : [];
                    const meaningText = meanings.join(' / ');
                    const englishAnswers = Array.from(new Set([
                        ...meanings,
                        ...meanings
                            .filter(meaning => !['can', 'may', 'must'].includes(meaning))
                            .map(meaning => `to ${meaning}`),
                    ]));
                    const answer = practiceMode === 'meaning'
                        ? englishAnswers
                        : (Array.isArray(verb[practiceMode]) ? verb[practiceMode].filter(Boolean) : []);
                    const promptLines = practiceMode === 'meaning'
                        ? [verb.infinitive]
                        : [
                            verb.infinitive,
                            meaningText,
                            practiceMode === 'praesens' ? 'er/sie/es · Präsens' : modeLabels[practiceMode],
                        ];

                    return {
                        id: `irregular-${practiceMode}-${verb.id}`,
                        question: promptLines.filter(Boolean).join('\n'),
                        answer,
                        meaning: practiceMode === 'meaning' ? '' : meaningText,
                        infinitive: verb.infinitive,
                        irregularVerbMode: practiceMode,
                        irregularVerbLabel: modeLabels[practiceMode],
                        irregularVerbMeaning: practiceMode === 'meaning' ? '' : meaningText,
                        irregularVerbCue: practiceMode === 'meaning'
                            ? ''
                            : (practiceMode === 'praesens' ? 'er/sie/es · Präsens' : modeLabels[practiceMode]),
                    };
                });
            } else {
                cards = data.cards || data;
            }
            if (isCustomDeck && Array.isArray(cards)) {
                cards = await enrichCustomDeckCardsWithBuiltInAudio(cards);
            }
            const createSessionCardId = (rawId, question, answers, index) =>
                [name, rawId || 'card', question || 'question', Array.isArray(answers) ? answers.join('|') : '', index].join('::');

            const buildGermanAnswers = (value) => {
                const variants = new Set();
                const rawValue = String(value || '').trim();
                if (!rawValue) {
                    return [];
                }

                variants.add(rawValue);
                rawValue
                    .split(/[;/]/)
                    .map(part => part.trim())
                    .filter(Boolean)
                    .forEach(part => variants.add(part));

                return Array.from(variants);
            };

            const buildGermanSentenceAnswers = (value) => {
                const sanitizedSentence = stripSentenceClarifications(value);
                return sanitizedSentence ? [sanitizedSentence] : [];
            };

            const buildEnglishSentencePrompt = (value) => extractEnglishSentencePrompt(value);

            // Detect German deck format (e.g., A1_safe.json) and transform
            if (Array.isArray(cards) && cards.length > 0 && !cards[0].question && cards[0].german_term) {
                cards = cards.map((entry, index) => {
                    const question = (entry.german_term || '').split(',')[0].trim();
                    const answer = (entry.english_term ? entry.english_term.split(/[;,\/]/).map(s => s.trim()) : []).filter(Boolean);
                    return {
                        sessionCardId: createSessionCardId(entry.id || entry.wordId, question, answer, index),
                        id: entry.id || entry.wordId || null,
                        question,
                        answer,
                        germanExample: entry.german_example || '',
                        meaning: entry.english_example || '',
                        wordAudioUrl: entry.wordAudioUrl || entry.word_audio_url || '',
                        sentenceAudioUrl: entry.sentenceAudioUrl || entry.sentence_audio_url || '',
                        tags: Array.isArray(entry.tags) ? entry.tags : [],
                        notes: entry.notes || '',
                        sourcePage: entry.sourcePage ?? entry.source_page ?? null,
                        englishSentencePrompt: buildEnglishSentencePrompt(entry.english_example || ''),
                        germanAnswers: buildGermanAnswers(entry.german_term || ''),
                        germanSentenceAnswers: buildGermanSentenceAnswers(entry.german_example || '')
                    };
                });
            }

            return cards
                .map((card, index) => ({
                    ...card,
                    sessionCardId: card.sessionCardId || createSessionCardId(card.id, card.question, card.answer, index),
                    germanAnswers: Array.isArray(card.germanAnswers) && card.germanAnswers.length > 0
                        ? card.germanAnswers
                        : buildGermanAnswers(card.question || ''),
                    englishSentencePrompt: card.englishSentencePrompt || buildEnglishSentencePrompt(card.meaning || ''),
                    germanSentenceAnswers: Array.isArray(card.germanSentenceAnswers) && card.germanSentenceAnswers.length > 0
                        ? card.germanSentenceAnswers
                        : buildGermanSentenceAnswers(card.germanExample || '')
                }))
                .filter(c => c && c.question && Array.isArray(c.answer) && c.answer.length > 0);
        } catch (e) { console.error("Error loading deck:", e); return []; }
    }

    async function loadDeckCardCount(name) {
        if (isCustomDeckFileName(name)) {
            const customDeck = getCustomDeckLibrary()[name];
            if (!customDeck) {
                return 0;
            }

            if (typeof customDeck.cardCount === 'number') {
                return customDeck.cardCount;
            }

            return Array.isArray(customDeck.cards) ? customDeck.cards.length : 0;
        }

        if (isIrregularVerbDeckName(name)) {
            return 70;
        }

        try {
            const res = await fetch(`data/${name}.json`);
            if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
            const data = await res.json();

            if (typeof data.cardCount === 'number') {
                return data.cardCount;
            }
            if (Array.isArray(data.cards)) {
                return data.cards.length;
            }
            if (Array.isArray(data)) {
                return data.length;
            }
        } catch (e) {
            console.error("Error loading deck count:", e);
        }

        return 0;
    }

    function updateAudioButtons(card) {
        const wordAudioVisible = Boolean(card && card.wordAudioUrl);
        const sentenceAudioVisible = Boolean(card && (card.sentenceAudioUrl || card.speechFallbackText)
            && (!isSpeechCard(card) || quizState.isShowingAnswer));

        playWordAudioBtn.textContent = 'Play Word';
        playSentenceAudioBtn.textContent = isSentenceDeckCard(card) || isDarkDeckCard(card) || isSpeechCard(card) ? 'Play Audio' : 'Play Sentence';
        playWordAudioBtn.classList.toggle('hidden', !wordAudioVisible);
        playSentenceAudioBtn.classList.toggle('hidden', !sentenceAudioVisible);
        playWordAudioBtn.disabled = !wordAudioVisible;
        playSentenceAudioBtn.disabled = !sentenceAudioVisible;
    }

    function stopAudioPlayback() {
        quizState.audio.pause();
        quizState.audio.currentTime = 0;
        window.speechSynthesis?.cancel();
    }

    function playAudio(url) {
        if (!url) {
            return;
        }

        stopAudioPlayback();
        quizState.audio.src = url;
        quizState.audio.play().catch((error) => {
            if (error?.name === 'AbortError') {
                return;
            }
            console.error('Error playing audio:', error);
        });
    }

    function playCurrentWordAudio() {
        playAudio(quizState.currentCard?.wordAudioUrl);
    }

    function playCurrentSentenceAudio() {
        if (isSpeechCard(quizState.currentCard) && quizState.currentCard.speechFallbackText) {
            if (!window.speechSynthesis || typeof SpeechSynthesisUtterance === 'undefined') {
                return;
            }
            stopAudioPlayback();
            const utterance = new SpeechSynthesisUtterance(quizState.currentCard.speechFallbackText);
            utterance.lang = 'de-DE';
            window.speechSynthesis?.speak(utterance);
            return;
        }
        playAudio(quizState.currentCard?.sentenceAudioUrl);
    }

    function autoplayCurrentCardAudio() {
        if (!quizState.autoplayAudioEnabled) {
            return;
        }

        if (isSentenceDeckCard(quizState.currentCard) || isDarkDeckCard(quizState.currentCard) || isSpeechCard(quizState.currentCard) || isSentenceTranslationModeActive() || isCasePracticeModeActive()) {
            playCurrentSentenceAudio();
            return;
        }

        if (!isReverseWordModeActive()) {
            playCurrentWordAudio();
        }
    }

    function escapeHtml(value) {
        return String(value ?? '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    function getModalVerbCellOrder(tense = quizState.modalVerbTense) {
        const tableDefinition = MODALVERB_TABLES[tense];
        if (!tableDefinition) {
            return [];
        }

        return tableDefinition.columns.flatMap((column, columnIndex) => (
            tableDefinition.rows.map((row, rowIndex) => ({
                key: `${column.key}:${rowIndex}`,
                answer: row.forms[columnIndex],
            }))
        ));
    }

    function normalizeModalVerbPracticeState(savedState = {}, tense = quizState.modalVerbTense) {
        const cellOrder = getModalVerbCellOrder(tense);
        const validKeys = new Set(cellOrder.map(cell => cell.key));
        const values = Object.fromEntries(
            Object.entries(savedState.values || {}).filter(([key]) => validKeys.has(key))
        );
        const completedCells = Array.from(new Set(savedState.completedCells || []))
            .filter(key => validKeys.has(key));
        const firstIncomplete = cellOrder.find(cell => !completedCells.includes(cell.key));
        const activeCellKey = validKeys.has(savedState.activeCellKey)
            ? savedState.activeCellKey
            : (firstIncomplete?.key || '');

        return { values, completedCells, activeCellKey };
    }

    function normalizeModalVerbPracticeCollection(savedPractice = {}) {
        const legacyPraesensState = savedPractice.values ? savedPractice : null;
        return Object.fromEntries(Object.keys(MODALVERB_TABLES).map(tense => [
            tense,
            normalizeModalVerbPracticeState(
                legacyPraesensState && tense === 'praesens'
                    ? legacyPraesensState
                    : savedPractice[tense],
                tense
            ),
        ]));
    }

    function playCorrectDing() {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (!AudioContextClass) {
            return;
        }

        const audioContext = quizState.correctDingAudioContext || new AudioContextClass();
        quizState.correctDingAudioContext = audioContext;
        if (audioContext.state === 'suspended') {
            audioContext.resume();
        }

        const startAt = audioContext.currentTime;
        [740, 988].forEach((frequency, index) => {
            const oscillator = audioContext.createOscillator();
            const gain = audioContext.createGain();
            const noteStart = startAt + (index * 0.075);
            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(frequency, noteStart);
            gain.gain.setValueAtTime(0.0001, noteStart);
            gain.gain.exponentialRampToValueAtTime(0.16, noteStart + 0.012);
            gain.gain.exponentialRampToValueAtTime(0.0001, noteStart + 0.18);
            oscillator.connect(gain);
            gain.connect(audioContext.destination);
            oscillator.start(noteStart);
            oscillator.stop(noteStart + 0.2);
        });
    }

    function renderModalVerbPractice({ focusActiveCell = true, feedbackPrefix = '' } = {}) {
        const tense = quizState.modalVerbTense;
        const tableDefinition = MODALVERB_TABLES[tense];
        const isActive = quizState.modalVerbTableEnabled && Boolean(tableDefinition);
        document.body.classList.toggle('modalverb-mode-active', isActive);
        quizContainerEl.hidden = isActive;
        modalVerbPracticeEl.hidden = !isActive;

        if (!isActive) {
            if (quizState.currentCard && !quizState.isShowingAnswer) {
                answerInputEl.focus();
            }
            scheduleMobileAdvance();
            return;
        }

        clearAdvanceTimers();

        modalVerbPracticeTitleEl.textContent = tableDefinition.title;
        const showAnswers = Boolean(quizState.modalVerbShowAnswers[tense]);
        modalVerbShowAnswersToggleEl.checked = showAnswers;

        quizState.modalVerbPractice[tense] = normalizeModalVerbPracticeState(quizState.modalVerbPractice[tense], tense);
        const practiceState = quizState.modalVerbPractice[tense];
        const completedSet = new Set(practiceState.completedCells);
        const cellOrder = getModalVerbCellOrder(tense);
        const firstIncomplete = cellOrder.find(cell => !completedSet.has(cell.key));
        if (!firstIncomplete) {
            practiceState.activeCellKey = '';
        } else if (!practiceState.activeCellKey || completedSet.has(practiceState.activeCellKey)) {
            practiceState.activeCellKey = firstIncomplete.key;
        }

        const headerCells = tableDefinition.columns
            .map(column => `<th scope="col">${column.label}</th>`)
            .join('');
        const bodyRows = tableDefinition.rows.map((row, rowIndex) => {
            const answerCells = tableDefinition.columns.map((column, columnIndex) => {
                const cellKey = `${column.key}:${rowIndex}`;
                const answer = row.forms[columnIndex];
                const isCompleted = completedSet.has(cellKey);
                const isActiveCell = !showAnswers && practiceState.activeCellKey === cellKey;
                const value = (isCompleted || showAnswers) ? answer : (practiceState.values[cellKey] || '');
                const cellClasses = [
                    'modalverb-answer-cell',
                    isCompleted ? 'correct' : '',
                    isActiveCell ? 'active' : '',
                    showAnswers && !isCompleted ? 'answer-revealed' : '',
                ].filter(Boolean).join(' ');

                return `
                    <td class="${cellClasses}" data-cell-key="${cellKey}">
                        <input
                            class="modalverb-answer-input"
                            type="text"
                            value="${escapeHtml(value)}"
                            data-cell-key="${cellKey}"
                            data-answer="${escapeHtml(answer)}"
                            aria-label="${escapeHtml(`${row.pronouns} ${column.label}`)}"
                            autocomplete="off"
                            autocorrect="off"
                            autocapitalize="off"
                            spellcheck="false"
                            ${(isCompleted || showAnswers) ? 'readonly' : ''}
                        >
                    </td>`;
            }).join('');

            return `
                <tr>
                    <td class="row-label pov-label">${row.pov}</td>
                    <th class="row-label" scope="row">${row.pronouns}</th>
                    ${answerCells}
                </tr>`;
        }).join('');

        modalVerbTableRegionEl.innerHTML = `
            <table class="modalverb-table">
                <thead>
                    <tr><th scope="col">POV</th><th scope="col">Pronouns</th>${headerCells}</tr>
                </thead>
                <tbody>${bodyRows}</tbody>
            </table>`;

        const completedCount = completedSet.size;
        modalVerbFeedbackEl.className = `modalverb-feedback${completedCount === cellOrder.length ? ' complete' : ''}`;
        modalVerbFeedbackEl.textContent = completedCount === cellOrder.length
            ? 'Table complete.'
            : `${feedbackPrefix}${completedCount} / ${cellOrder.length} correct`;

        if (focusActiveCell && !showAnswers && practiceState.activeCellKey) {
            requestAnimationFrame(() => {
                const activeInput = modalVerbTableRegionEl.querySelector(
                    `.modalverb-answer-input[data-cell-key="${practiceState.activeCellKey}"]`
                );
                activeInput?.focus();
                activeInput?.select();
            });
        }
    }

    function setModalVerbTense(tense) {
        quizState.modalVerbTense = MODALVERB_TABLES[tense] ? tense : (quizState.modalVerbTense || 'praesens');
        modalVerbTenseToggleEls.forEach(toggleEl => {
            toggleEl.checked = toggleEl.dataset.modalverbTense === quizState.modalVerbTense;
        });
        saveModalVerbTense(quizState.modalVerbTense);
        renderModalVerbPractice();
    }

    function submitModalVerbAnswer(inputEl) {
        const tense = quizState.modalVerbTense;
        if (!MODALVERB_TABLES[tense] || quizState.modalVerbShowAnswers[tense] || inputEl.readOnly) {
            return;
        }

        const practiceState = quizState.modalVerbPractice[tense];
        const cellKey = inputEl.dataset.cellKey;
        const expectedAnswer = inputEl.dataset.answer || '';
        practiceState.values[cellKey] = inputEl.value;
        practiceState.activeCellKey = cellKey;

        if (normalizeAnswer(inputEl.value) !== normalizeAnswer(expectedAnswer)) {
            const cellEl = inputEl.closest('.modalverb-answer-cell');
            cellEl?.classList.remove('incorrect');
            void cellEl?.offsetWidth;
            cellEl?.classList.add('incorrect');
            modalVerbFeedbackEl.className = 'modalverb-feedback';
            modalVerbFeedbackEl.textContent = 'Try again.';
            inputEl.focus();
            inputEl.select();
            return;
        }

        practiceState.values[cellKey] = expectedAnswer;
        practiceState.completedCells = Array.from(new Set([
            ...practiceState.completedCells,
            cellKey,
        ]));

        const cellOrder = getModalVerbCellOrder(tense);
        const currentIndex = cellOrder.findIndex(cell => cell.key === cellKey);
        const completedSet = new Set(practiceState.completedCells);
        const nextCell = [
            ...cellOrder.slice(currentIndex + 1),
            ...cellOrder.slice(0, currentIndex),
        ].find(cell => !completedSet.has(cell.key));
        practiceState.activeCellKey = nextCell?.key || '';
        playCorrectDing();
        renderModalVerbPractice({ feedbackPrefix: 'Correct · ' });
    }
    
    async function populateDeckSelector(selectedDeckValue = deckSelectorEl.value) {
        try {
            const res = await fetch('data/decks.json');
            if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
            const builtInDecks = await res.json();
            const builtInDecksWithCounts = await Promise.all(builtInDecks.map(async (deck) => ({
                ...deck,
                cardCount: await loadDeckCardCount(deck.fileName),
            })));

            const customDeckEntries = Object.values(getCustomDeckLibrary())
                .map((deck) => ({
                    fileName: deck.fileName,
                    displayName: deck.displayName,
                    cardCount: typeof deck.cardCount === 'number' ? deck.cardCount : (deck.cards || []).length,
                    isCustom: true,
                    importedAt: deck.importedAt,
                }))
                .sort((a, b) => String(b.importedAt || '').localeCompare(String(a.importedAt || '')));

            quizState.decks = [...builtInDecksWithCounts, ...IRREGULAR_VERB_DECKS, SPEECH_A2_DECK, ...PARETO_DECKS, ...customDeckEntries];
            deckSelectorEl.innerHTML = '<option value="">-- Select Deck --</option>';

            const appendDeckOptions = (decks, groupLabel) => {
                if (decks.length === 0) {
                    return;
                }

                const groupEl = document.createElement('optgroup');
                groupEl.label = groupLabel;
                decks.forEach((deck) => {
                    const option = document.createElement('option');
                    option.value = deck.fileName;
                    option.textContent = `${deck.displayName} (${deck.cardCount})`;
                    groupEl.appendChild(option);
                });
                deckSelectorEl.appendChild(groupEl);
            };

            appendDeckOptions(builtInDecksWithCounts, 'Built-in');
            appendDeckOptions(customDeckEntries, 'Custom');

            if (quizState.decks.some((deck) => deck.fileName === selectedDeckValue)) {
                deckSelectorEl.value = selectedDeckValue;
            } else {
                deckSelectorEl.value = '';
            }

            updateCustomDeckControls();
        } catch (e) {
            console.error("Error loading deck list:", e);
            setCustomDeckStatus('Could not load the deck list.', 'error');
        }
    }

    async function importCustomDeckFile(file) {
        if (!file) {
            return;
        }

        try {
            const rawText = await file.text();
            const payload = JSON.parse(rawText);
            const normalizedDeck = parseImportedCustomDeck(payload);
            const customDeckLibrary = getCustomDeckLibrary();
            const replacedExistingDeck = Boolean(customDeckLibrary[normalizedDeck.fileName]);

            customDeckLibrary[normalizedDeck.fileName] = normalizedDeck;
            saveCustomDeckLibrary(customDeckLibrary);
            await populateDeckSelector(normalizedDeck.fileName);
            setCustomDeckStatus(
                `${replacedExistingDeck ? 'Updated' : 'Imported'} "${normalizedDeck.displayName}" (${normalizedDeck.cardCount} cards).`,
                'success'
            );
        } catch (error) {
            console.error('Error importing custom deck:', error);
            setCustomDeckStatus(`Import failed: ${error.message}`, 'error');
        } finally {
            importCustomDeckInputEl.value = '';
        }
    }

    async function removeSelectedCustomDeck() {
        const selectedDeckName = deckSelectorEl.value;
        if (!isCustomDeckFileName(selectedDeckName)) {
            return;
        }

        const selectedDeckInfo = quizState.decks.find((deck) => deck.fileName === selectedDeckName);
        const selectedDeckLabel = selectedDeckInfo?.displayName || selectedDeckName;
        if (!confirm(`Remove "${selectedDeckLabel}" from custom decks?`)) {
            return;
        }

        const customDeckLibrary = getCustomDeckLibrary();
        delete customDeckLibrary[selectedDeckName];
        saveCustomDeckLibrary(customDeckLibrary);

        if (quizState.deckName === selectedDeckName) {
            resetQuizSelection();
        }

        await populateDeckSelector('');
        setCustomDeckStatus(`Removed "${selectedDeckLabel}".`, 'info');
    }
    
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    // --- Stats ---
    function updateLearnedProgress(card, isCorrect) {
        if (!card) {
            return;
        }

        card.learnedCorrectStreak = card.learnedCorrectStreak || 0;
        card.learnedQualified = Boolean(card.learnedQualified);

        if (isCorrect) {
            card.learnedCorrectStreak += 1;
            if (!card.learnedQualified && card.learnedCorrectStreak >= 2) {
                card.learnedQualified = true;
                quizState.learnedCount += 1;
            }
            return;
        }

        if (card.learnedQualified) {
            card.learnedQualified = false;
            quizState.learnedCount = Math.max(0, quizState.learnedCount - 1);
        }
        card.learnedCorrectStreak = 0;
    }

    function updateStats(isCorrect) {
        const { deckName, learnedCount } = quizState;
        if (!deckName) return;
    
        const stats = getStats();
        if (!stats[deckName]) {
            stats[deckName] = { timesPlayed: 0, bestLearned: 0, totalCorrect: 0, totalAnswered: 0 };
        }
    
        const deckStats = stats[deckName];
    
        if (!quizState.sessionStatsRecorded) {
            deckStats.timesPlayed++;
            quizState.sessionStatsRecorded = true;
        }
    
        deckStats.totalAnswered++;
        if (isCorrect) {
            deckStats.totalCorrect++;
        }
        deckStats.bestLearned = Math.max(deckStats.bestLearned || 0, learnedCount);
    
        saveStats(stats);
        updateStatsDisplay();
    }

    function updateStatsDisplay() {
        const stats = getStats();
        const deckEntries = Object.entries(stats);
        const resetButtonHTML = '<button id="reset-stats-btn">Reset</button>';

        if (quizState.deckName) { // A quiz is active, show live stats
            const deckStats = stats[quizState.deckName] || { bestLearned: 0, totalCorrect: 0, totalAnswered: 0 };
            const deckInfo = quizState.decks.find(d => d.fileName === quizState.deckName);
            const displayName = deckInfo ? deckInfo.displayName : quizState.deckName;
            const cardCount = quizState.deckCardCount || deckInfo?.cardCount || quizState.deck.length;
            
            const totalCorrect = deckStats.totalCorrect;
            const totalAnswered = deckStats.totalAnswered;
            const accuracy = totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0;
    
            const statsHTML = `
                <h2>Stats ${resetButtonHTML}</h2>
                <div class="stats-grid">
                    <div class="stat-item">
                        <span class="stat-label">Deck</span>
                        <span class="stat-value">${displayName}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Words</span>
                        <span class="stat-value">${cardCount}</span>
                    </div>
                     <div class="stat-item">
                        <span class="stat-label">Score</span>
                        <span class="stat-value">${quizState.score} / ${quizState.questionsAnswered}</span>
                    </div>
                     <div class="stat-item">
                        <span class="stat-label">Accuracy</span>
                        <span class="stat-value">${accuracy}%</span>
                    </div>
                     <div class="stat-item">
                        <span class="stat-label">Learned</span>
                        <span class="stat-value">${quizState.learnedCount}</span>
                    </div>
                </div>
            `;
            statsContainer.innerHTML = statsHTML;
    
        } else { // No quiz active, show summary
            if (deckEntries.length === 0) {
                statsContainer.innerHTML = '<h2>Stats</h2><p>Play a quiz to see your stats!</p>';
                return;
            }
    
            const statsTable = `
                <h2>All-Time Stats ${resetButtonHTML}</h2>
                <table>
                    <tr><th>Deck</th><th>Words</th><th>Learned</th><th>Accuracy</th><th>Played</th></tr>
                    ${deckEntries.map(([fileName, data]) => {
                        const deckInfo = quizState.decks.find(d => d.fileName === fileName);
                        const displayName = deckInfo ? deckInfo.displayName : fileName;
                        const cardCount = deckInfo?.cardCount ?? '-';
                        const accuracy = data.totalAnswered > 0 ? Math.round((data.totalCorrect / data.totalAnswered) * 100) : 0;
                        return `<tr><td>${displayName}</td><td>${cardCount}</td><td>${data.bestLearned || 0}</td><td>${accuracy}%</td><td>${data.timesPlayed}</td></tr>`;
                    }).join('')}
                </table>
            `;
            statsContainer.innerHTML = statsTable;
        }
    }

    // --- Event Listeners ---
    function setupEventListeners() {
        answerInputEl.addEventListener('input', checkAnswer);

        const rerenderOrRestartForPromptModeChange = (previousCasePracticeModeEnabled) => {
            updateReverseModeControls();
            updateAnswerInputPlaceholder();
            questionEl.classList.toggle(
                'reverse-prompt',
                !isParetoCard(quizState.currentCard)
                    && !isSentenceDeckCard(quizState.currentCard)
                    && !isDarkDeckCard(quizState.currentCard)
                    && (isReverseWordModeActive() || isSentenceTranslationModeActive() || isCasePracticeModeActive())
                    && Boolean(quizState.currentCard)
            );

            if (quizState.deckName && !isParetoDeckName(quizState.deckName) && !isSentenceDeckName(quizState.deckName) && !isDarkDeckName(quizState.deckName) && previousCasePracticeModeEnabled !== quizState.casePracticeModeEnabled) {
                startQuiz(quizState.deckName, quizState.mode);
                return;
            }

            if (quizState.currentCard) {
                renderCurrentCard(quizState.currentCard);
            }
        };

        studyTabEls.forEach(tabEl => {
            tabEl.addEventListener('click', () => switchStudyTab(tabEl.dataset.studyTab));
        });

        connectorModeTabEls.forEach(tabEl => {
            tabEl.addEventListener('click', () => switchConnectorDirection(tabEl.dataset.connectorDirection));
        });

        paretoDeckTabEls.forEach(tabEl => {
            tabEl.addEventListener('click', () => switchParetoDeck(tabEl.dataset.paretoDeck));
        });
        paretoPatternFrameSelectorEl.addEventListener('change', (event) => {
            switchParetoPatternFrame(event.target.value);
        });

        sentenceDeckTabEls.forEach(tabEl => {
            tabEl.addEventListener('click', () => switchSentenceDeck(tabEl.dataset.sentenceDeck));
        });

        darkDeckTabEls.forEach(tabEl => {
            tabEl.addEventListener('click', () => switchDarkDeck(tabEl.dataset.darkDeck));
        });
        
        window.addEventListener('keydown', (e) => {
            if (quizState.modalVerbTableEnabled) {
                return;
            }

            if (
                (e.code === 'Digit9' || e.code === 'Numpad9') &&
                quizState.currentCard &&
                !e.repeat &&
                pokedexModal.style.display !== 'flex' &&
                document.activeElement !== pokedexSearchEl
            ) {
                e.preventDefault();
                excludeCurrentCard();
                return;
            }

            if (
                e.code === 'Slash' &&
                quizState.currentCard &&
                answerInputEl.value.trim().length === 0
            ) {
                e.preventDefault();

                const now = Date.now();
                if (now - quizState.lastReplayKeyAt <= DOUBLE_SPACE_THRESHOLD_MS) {
                    playCurrentSentenceAudio();
                    quizState.lastReplayKeyAt = 0;
                } else {
                    if (isSentenceDeckCard(quizState.currentCard) || isDarkDeckCard(quizState.currentCard) || isSentenceTranslationModeActive() || isCasePracticeModeActive() || !quizState.currentCard?.wordAudioUrl) {
                        playCurrentSentenceAudio();
                    } else {
                        playCurrentWordAudio();
                    }
                    quizState.lastReplayKeyAt = now;
                }
                return;
            }

            if (e.key === 'Enter') {
                e.preventDefault();
                if (quizState.isShowingAnswer) {
                    nextQuestion();
                } else if (answerInputEl.value.trim().length > 0) {
                    // This handles submitting an answer that might be incorrect.
                    // The 'input' event listener will have already handled the correct case.
                    const userAnswer = answerInputEl.value.trim();
                    const normalizedUserAnswer = normalizeInputForCurrentMode(userAnswer);
                    const isCorrect = getAcceptedAnswers(quizState.currentCard)
                        .some(answer => normalizeInputForCurrentMode(answer) === normalizedUserAnswer);

                    if (!isCorrect) {
                        showAndAdvance(false);
                    }
                }
            }
        });
        
        async function handleQuizStart() {
            const selectedDeck = deckSelectorEl.value;
            if (quizState.activeStudyTab !== 'vocabulary') {
                const currentSession = captureQuizRuntimeState();
                quizState.studyTabSessions[quizState.activeStudyTab] = currentSession;
                if (quizState.activeStudyTab === 'pareto') {
                    quizState.paretoDeckSessions[quizState.paretoDeckName] = currentSession;
                    if (quizState.paretoDeckName === 'pareto_patterns') {
                        quizState.paretoPatternFrameSessions[quizState.paretoPatternFrame] = currentSession;
                    }
                } else if (quizState.activeStudyTab === 'sentences') {
                    quizState.sentenceDeckSessions[quizState.sentenceDeckName] = currentSession;
                } else if (quizState.activeStudyTab === 'dark') {
                    quizState.darkDeckSessions[quizState.darkDeckName] = currentSession;
                }
                quizState.activeStudyTab = 'vocabulary';
                updateStudyTabUI();
            }
            updateCustomDeckControls();
            if (selectedDeck) {
                await startQuiz(selectedDeck, 'conquest');
            } else {
                resetQuizSelection();
            }
        }
        
        deckSelectorEl.addEventListener('change', handleQuizStart);
        importCustomDeckBtnEl.addEventListener('click', () => importCustomDeckInputEl.click());
        importCustomDeckInputEl.addEventListener('change', (e) => {
            const file = e.target.files?.[0];
            if (file) {
                importCustomDeckFile(file);
            }
        });
        removeCustomDeckBtnEl.addEventListener('click', removeSelectedCustomDeck);
        playWordAudioBtn.addEventListener('click', playCurrentWordAudio);
        playSentenceAudioBtn.addEventListener('click', playCurrentSentenceAudio);
        autoplayAudioToggleEl.addEventListener('change', (e) => {
            quizState.autoplayAudioEnabled = e.target.checked;
            saveAutoplayAudioEnabled(quizState.autoplayAudioEnabled);
        });
        reverseInputToggleEl.addEventListener('change', (e) => {
            const previousCasePracticeModeEnabled = quizState.casePracticeModeEnabled;
            quizState.reverseInputModeEnabled = e.target.checked;
            if (quizState.reverseInputModeEnabled) {
                quizState.sentenceTranslationModeEnabled = false;
                quizState.casePracticeModeEnabled = false;
                sentenceTranslationToggleEl.checked = false;
                casePracticeToggleEl.checked = false;
                saveSentenceTranslationModeEnabled(false);
                saveCasePracticeModeEnabled(false);
            }
            saveReverseInputModeEnabled(quizState.reverseInputModeEnabled);
            rerenderOrRestartForPromptModeChange(previousCasePracticeModeEnabled);
        });
        showGermanSentenceToggleEl.addEventListener('change', (e) => {
            quizState.showGermanSentenceEnabled = e.target.checked;
            saveShowGermanSentenceEnabled(quizState.showGermanSentenceEnabled);

            if (quizState.currentCard) {
                renderGermanExample(quizState.currentCard);
            }
        });
        sentenceTranslationToggleEl.addEventListener('change', (e) => {
            const previousCasePracticeModeEnabled = quizState.casePracticeModeEnabled;
            quizState.sentenceTranslationModeEnabled = e.target.checked;
            if (quizState.sentenceTranslationModeEnabled) {
                quizState.reverseInputModeEnabled = false;
                quizState.casePracticeModeEnabled = false;
                reverseInputToggleEl.checked = false;
                casePracticeToggleEl.checked = false;
                saveReverseInputModeEnabled(false);
                saveCasePracticeModeEnabled(false);
            }
            saveSentenceTranslationModeEnabled(quizState.sentenceTranslationModeEnabled);
            rerenderOrRestartForPromptModeChange(previousCasePracticeModeEnabled);
        });
        casePracticeToggleEl.addEventListener('change', (e) => {
            const previousCasePracticeModeEnabled = quizState.casePracticeModeEnabled;
            quizState.casePracticeModeEnabled = e.target.checked;
            if (quizState.casePracticeModeEnabled) {
                quizState.reverseInputModeEnabled = false;
                quizState.sentenceTranslationModeEnabled = false;
                reverseInputToggleEl.checked = false;
                sentenceTranslationToggleEl.checked = false;
                saveReverseInputModeEnabled(false);
                saveSentenceTranslationModeEnabled(false);
            }
            saveCasePracticeModeEnabled(quizState.casePracticeModeEnabled);
            rerenderOrRestartForPromptModeChange(previousCasePracticeModeEnabled);
        });

        auxiliaryToggleEls.forEach(toggleEl => {
            toggleEl.addEventListener('change', () => {
                quizState.auxiliarySelections[toggleEl.dataset.auxiliary] = toggleEl.checked;
                saveAuxiliarySelections(quizState.auxiliarySelections);
            });
        });

        irregularVerbModeToggleEls.forEach(toggleEl => {
            toggleEl.addEventListener('change', async () => {
                const mode = toggleEl.dataset.irregularVerbMode;
                if (toggleEl.checked) {
                    irregularVerbModeToggleEls.forEach(otherToggleEl => {
                        otherToggleEl.checked = otherToggleEl === toggleEl;
                    });
                    await switchIrregularVerbMode(mode);
                    return;
                }

                if (quizState.activeStudyTab === 'irregular' && quizState.irregularVerbMode === mode) {
                    await switchStudyTab(quizState.irregularVerbReturnTab || 'vocabulary');
                }
            });
        });

        speechA2DeckBtnEl.addEventListener('click', () => switchStudyTab('speech'));

        modalVerbTenseToggleEls.forEach(toggleEl => {
            toggleEl.addEventListener('change', () => {
                if (!toggleEl.checked) {
                    toggleEl.checked = true;
                    return;
                }

                setModalVerbTense(toggleEl.dataset.modalverbTense);
            });
        });

        modalVerbTableToggleEl.addEventListener('change', async () => {
            if (modalVerbTableToggleEl.checked && quizState.activeStudyTab === 'irregular') {
                await switchStudyTab(quizState.irregularVerbReturnTab || 'vocabulary');
            }
            quizState.modalVerbTableEnabled = modalVerbTableToggleEl.checked;
            saveModalVerbTableEnabled(quizState.modalVerbTableEnabled);
            renderModalVerbPractice();
        });

        modalVerbShowAnswersToggleEl.addEventListener('change', () => {
            if (!quizState.modalVerbTense) {
                return;
            }

            quizState.modalVerbShowAnswers[quizState.modalVerbTense] = modalVerbShowAnswersToggleEl.checked;
            renderModalVerbPractice({ focusActiveCell: !modalVerbShowAnswersToggleEl.checked });
        });

        modalVerbTableRegionEl.addEventListener('focusin', (e) => {
            const inputEl = e.target.closest('.modalverb-answer-input');
            if (!inputEl || inputEl.readOnly) {
                return;
            }

            const practiceState = quizState.modalVerbPractice[quizState.modalVerbTense];
            if (!practiceState) {
                return;
            }

            practiceState.activeCellKey = inputEl.dataset.cellKey;
            modalVerbTableRegionEl.querySelectorAll('.modalverb-answer-cell.active')
                .forEach(cellEl => cellEl.classList.remove('active'));
            inputEl.closest('.modalverb-answer-cell')?.classList.add('active');
        });

        modalVerbTableRegionEl.addEventListener('input', (e) => {
            const inputEl = e.target.closest('.modalverb-answer-input');
            const practiceState = quizState.modalVerbPractice[quizState.modalVerbTense];
            if (inputEl && practiceState) {
                practiceState.values[inputEl.dataset.cellKey] = inputEl.value;
            }
        });

        modalVerbTableRegionEl.addEventListener('keydown', (e) => {
            const inputEl = e.target.closest('.modalverb-answer-input');
            if (e.key !== 'Enter' || !inputEl) {
                return;
            }

            e.preventDefault();
            e.stopPropagation();
            submitModalVerbAnswer(inputEl);
        });
        
        settingsFolderToggleEls.forEach((toggleEl) => {
            toggleEl.addEventListener('click', () => {
                const shouldOpen = toggleEl.getAttribute('aria-expanded') !== 'true';

                settingsFolderToggleEls.forEach((otherToggleEl) => {
                    const contentEl = document.getElementById(otherToggleEl.getAttribute('aria-controls'));
                    const isTarget = otherToggleEl === toggleEl;
                    otherToggleEl.setAttribute('aria-expanded', String(isTarget && shouldOpen));
                    if (contentEl) {
                        contentEl.hidden = !(isTarget && shouldOpen);
                    }
                });
            });
        });

        menuToggleBtn.addEventListener('click', () => sidePanel.classList.toggle('open'));
        document.addEventListener('click', (e) => {
             if (!sidePanel.contains(e.target) && e.target !== menuToggleBtn) {
                sidePanel.classList.remove('open');
            }
        });

        statsContainer.addEventListener('click', (e) => {
            if (e.target.id === 'reset-stats-btn') {
                if (confirm('Are you sure you want to reset all quiz stats and conquest progress? This will not affect your Pokédex. This action cannot be undone.')) {
                    localStorage.removeItem(STATS_KEY);
                    
                    if (quizState.deckName) {
                        quizState.score = 0;
                        quizState.questionsAnswered = 0;
                        quizState.sessionStatsRecorded = false; 
                    }
                    
                    updateStatsDisplay();
                }
            }
        });

        decompositionDisplay.addEventListener('mouseenter', () => clearTimeout(quizState.hidePopupTimeout));
        decompositionDisplay.addEventListener('mouseleave', hideDecomposition);

        // --- Pokemon Event Listeners ---
        pokemonModeToggleEl.addEventListener('change', (e) => {
            quizState.pokemonModeActive = e.target.checked;
            if (quizState.pokemonModeActive) {
                pokemonCatcherEl.style.display = 'flex';
                pokedexContainerEl.style.display = 'flex';
                if (!quizState.pokedexLoaded) {
                    fetchAllPokemon();
                }
            } else {
                pokemonCatcherEl.style.display = 'none';
                pokedexContainerEl.style.display = 'none';
            }
        });

        pokedexBtn.addEventListener('click', () => {
            updatePokedexDisplay();
            pokedexModal.style.display = 'flex';
            pokedexModalContent.style.left = '';
            pokedexModalContent.style.top = '';
            pokedexModalContent.style.width = '';
            pokedexModalContent.style.height = '';
        });

        pokedexCloseBtn.addEventListener('click', () => {
            pokedexModal.style.display = 'none';
        });

        savePokedexBtn.addEventListener('click', savePokedex);

        loadPokedexBtn.addEventListener('click', () => {
            loadPokedexInput.click();
        });

        loadPokedexInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                loadPokedex(file);
            }
        });

        pokedexSearchEl.addEventListener('input', (e) => {
            quizState.pokedexSearchTerm = e.target.value;
            updatePokedexDisplay();
        });

        pokedexFiltersEl.addEventListener('click', (e) => {
            if (e.target.classList.contains('filter-btn')) {
                pokedexFiltersEl.querySelector('.active').classList.remove('active');
                e.target.classList.add('active');
                quizState.pokedexFilter = e.target.dataset.filter;
                updatePokedexDisplay();
            }
        });

        window.addEventListener('click', (e) => {
            if (e.target == pokedexModal) {
                pokedexModal.style.display = "none";
            }
        });

        // --- Movable & Resizable Modal Logic ---
        let isDragging = false;
        let offsetX, offsetY;

        const dragHandle = document.getElementById('pokedex-header');
        dragHandle.addEventListener('mousedown', (e) => {
            // Prevent drag from starting on right-click or middle-click
            if (e.button !== 0) return;
            isDragging = true;

            // Switch to manual positioning
            const rect = pokedexModalContent.getBoundingClientRect();
            pokedexModalContent.style.left = `${rect.left}px`;
            pokedexModalContent.style.top = `${rect.top}px`;
            pokedexModal.style.justifyContent = 'flex-start';
            pokedexModal.style.alignItems = 'flex-start';

            offsetX = e.clientX - rect.left;
            offsetY = e.clientY - rect.top;
            pokedexModalContent.style.cursor = 'grabbing';
            e.preventDefault();
        });

        document.addEventListener('mousemove', (e) => {
            if (isDragging) {
                let newLeft = e.clientX - offsetX;
                let newTop = e.clientY - offsetY;
                
                // Constrain movement within the viewport
                const rect = pokedexModalContent.getBoundingClientRect();
                newLeft = Math.max(0, Math.min(newLeft, window.innerWidth - rect.width));
                newTop = Math.max(0, Math.min(newTop, window.innerHeight - rect.height));

                pokedexModalContent.style.left = `${newLeft}px`;
                pokedexModalContent.style.top = `${newTop}px`;
            }
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
            pokedexModalContent.style.cursor = 'default';
        });
    }

    // --- Pokemon Mode Functions ---

    function typeAnimation(element, text, onComplete = () => {}) {
        if (quizState.typingAnimationInterval) {
            clearInterval(quizState.typingAnimationInterval);
        }
        element.textContent = '';
        let i = 0;
        const speed = 25; // milliseconds per character

        quizState.typingAnimationInterval = setInterval(() => {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
            } else {
                clearInterval(quizState.typingAnimationInterval);
                quizState.typingAnimationInterval = null;
                onComplete();
            }
        }, speed);
    }

    // Fetch all pokemon for Pokedex creation
    async function fetchAllPokemon() {
        if (quizState.pokedexLoaded) return;
        try {
            const res = await fetch(`${POKE_API_BASE_URL}/pokemon?limit=${TOTAL_POKEMON}`);
            const data = await res.json();
            quizState.allPokemon = data.results.map((p, i) => ({
                id: i + 1,
                name: p.name,
                sprite: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${i + 1}.png`
            }));
            quizState.pokemonById = new Map(quizState.allPokemon.map((pokemon) => [pokemon.id, pokemon]));
            rebuildPokemonPoolsFromCache();
            quizState.pokedexLoaded = true;
            console.log('Pokedex data loaded!');
            updatePokedexDisplay(); // Initial display
            warmPokemonRarityPools();
        } catch (e) {
            console.error('Failed to load Pokemon list', e);
        }
    }

    function determineRarityTier() {
        const rand = Math.random() * 100;
        if (rand < 50) return 'common'; // 50% chance
        if (rand < 85) return 'uncommon'; // 35% chance
        if (rand < 99) return 'rare'; // 14% chance
        return 'legendary'; // 1% chance
    }

    function resetPokemonPools() {
        quizState.pokemonPools = {
            common: [],
            uncommon: [],
            rare: [],
            legendary: [],
        };
    }

    function addPokemonToPool(pokemon, rarity) {
        const pool = quizState.pokemonPools[rarity];
        if (!pool || !pokemon) {
            return;
        }

        if (!pool.some((entry) => entry.id === pokemon.id)) {
            pool.push(pokemon);
        }
    }

    function rebuildPokemonPoolsFromCache() {
        resetPokemonPools();

        for (const pokemon of quizState.allPokemon) {
            const cachedRarity = quizState.pokemonRarityById[pokemon.id];
            if (cachedRarity) {
                addPokemonToPool(pokemon, cachedRarity);
                continue;
            }

            if (LEGENDARY_POKEMON_IDS.has(pokemon.id)) {
                quizState.pokemonRarityById[pokemon.id] = 'legendary';
                addPokemonToPool(pokemon, 'legendary');
            }
        }

        savePokemonRarityCache(quizState.pokemonRarityById);
    }

    function pickRandomFromPool(rarity) {
        const pool = quizState.pokemonPools[rarity] || [];
        if (pool.length === 0) {
            return null;
        }

        return pool[Math.floor(Math.random() * pool.length)];
    }

    function classifyPokemonRarity(speciesData, fallbackId) {
        if (speciesData?.is_legendary || speciesData?.is_mythical || LEGENDARY_POKEMON_IDS.has(fallbackId)) {
            return 'legendary';
        }

        const captureRate = typeof speciesData?.capture_rate === 'number' ? speciesData.capture_rate : 255;
        if (captureRate <= 45) {
            return 'rare';
        }
        if (captureRate <= 120) {
            return 'uncommon';
        }
        return 'common';
    }

    async function getPokemonRarityById(id) {
        if (quizState.pokemonRarityById[id]) {
            return quizState.pokemonRarityById[id];
        }

        if (LEGENDARY_POKEMON_IDS.has(id)) {
            quizState.pokemonRarityById[id] = 'legendary';
            savePokemonRarityCache(quizState.pokemonRarityById);
            return 'legendary';
        }

        try {
            const res = await fetch(`${POKE_API_BASE_URL}/pokemon-species/${id}`);
            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }

            const speciesData = await res.json();
            const rarity = classifyPokemonRarity(speciesData, id);
            quizState.pokemonRarityById[id] = rarity;
            savePokemonRarityCache(quizState.pokemonRarityById);
            return rarity;
        } catch (error) {
            console.error(`Failed to classify Pokemon #${id}:`, error);
            return 'common';
        }
    }

    function createPokemonSpawn(pokemonInfo, tier) {
        return {
            id: pokemonInfo.id,
            name: pokemonInfo.name.charAt(0).toUpperCase() + pokemonInfo.name.slice(1),
            sprite: pokemonInfo.sprite,
            rarityTier: tier,
        };
    }

    async function classifyPokemonBatch(pokemonBatch) {
        const uncachedPokemon = pokemonBatch.filter((pokemon) => pokemon && !quizState.pokemonRarityById[pokemon.id]);
        if (uncachedPokemon.length === 0) {
            return;
        }

        await Promise.all(uncachedPokemon.map(async (pokemon) => {
            const rarity = await getPokemonRarityById(pokemon.id);
            addPokemonToPool(pokemon, rarity);
        }));
    }

    function getUnknownPokemonCandidates(limit = 24) {
        const unknown = quizState.allPokemon.filter((pokemon) => !quizState.pokemonRarityById[pokemon.id]);
        if (unknown.length <= limit) {
            return unknown;
        }

        const candidates = [...unknown];
        for (let i = candidates.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [candidates[i], candidates[j]] = [candidates[j], candidates[i]];
        }

        return candidates.slice(0, limit);
    }

    function warmPokemonRarityPools() {
        if (quizState.pokemonRarityWarmupPromise) {
            return quizState.pokemonRarityWarmupPromise;
        }

        const warmupLoop = async () => {
            const targetPoolSizes = {
                common: 120,
                uncommon: 80,
                rare: 40,
            };

            while (true) {
                const needsWarmup = ['common', 'uncommon', 'rare'].some(
                    (tier) => quizState.pokemonPools[tier].length < targetPoolSizes[tier]
                );
                if (!needsWarmup) {
                    break;
                }

                const batch = getUnknownPokemonCandidates(24);
                if (batch.length === 0) {
                    break;
                }

                await classifyPokemonBatch(batch);
            }
        };

        quizState.pokemonRarityWarmupPromise = warmupLoop().finally(() => {
            quizState.pokemonRarityWarmupPromise = null;
        });

        return quizState.pokemonRarityWarmupPromise;
    }

    async function ensurePokemonPoolHasEntries(tier) {
        if (pickRandomFromPool(tier)) {
            return;
        }

        for (let round = 0; round < 4; round++) {
            const batch = getUnknownPokemonCandidates(24);
            if (batch.length === 0) {
                break;
            }

            await classifyPokemonBatch(batch);
            if (pickRandomFromPool(tier)) {
                return;
            }
        }
    }

    async function getPokemonByRarity() {
        const tier = determineRarityTier();

        const pooledPokemon = pickRandomFromPool(tier);
        if (pooledPokemon) {
            warmPokemonRarityPools();
            return createPokemonSpawn(pooledPokemon, tier);
        }

        await ensurePokemonPoolHasEntries(tier);

        const warmedPokemon = pickRandomFromPool(tier);
        if (warmedPokemon) {
            warmPokemonRarityPools();
            return createPokemonSpawn(warmedPokemon, tier);
        }

        if (tier === 'legendary') {
            const legendaryPool = quizState.allPokemon.filter((pokemon) => LEGENDARY_POKEMON_IDS.has(pokemon.id));
            if (legendaryPool.length > 0) {
                const pokemonInfo = legendaryPool[Math.floor(Math.random() * legendaryPool.length)];
                quizState.pokemonRarityById[pokemonInfo.id] = 'legendary';
                addPokemonToPool(pokemonInfo, 'legendary');
                savePokemonRarityCache(quizState.pokemonRarityById);
                return createPokemonSpawn(pokemonInfo, tier);
            }
        }

        const fallbackPokemon = quizState.allPokemon[Math.floor(Math.random() * quizState.allPokemon.length)];
        const fallbackTier = await getPokemonRarityById(fallbackPokemon.id);
        addPokemonToPool(fallbackPokemon, fallbackTier);
        warmPokemonRarityPools();
        return createPokemonSpawn(fallbackPokemon, fallbackTier);
    }

    async function spawnPokemon() {
        if (!quizState.pokedexLoaded) await fetchAllPokemon();
        
        const pokemon = await getPokemonByRarity();
        quizState.wildPokemon = pokemon;

        pokemonImageEl.src = pokemon.sprite;
        pokemonNameEl.classList.remove('caught-text');
        pokemonImageEl.classList.add('visible');
        typeAnimation(pokemonNameEl, `A wild ${pokemon.name} appeared!`);
    }

    function catchPokemon(pokemon) {
        if (!quizState.pokedex.includes(pokemon.id)) {
            quizState.pokedex.push(pokemon.id);
            savePokedexToStorage(quizState.pokedex);
            console.log(`Caught ${pokemon.name}!`);
            updatePokedexDisplay();
        }
        
        pokemonNameEl.classList.add('caught-text');
        typeAnimation(pokemonNameEl, `Gotcha! ${pokemon.name} was caught!`, () => {
             // Hide the image and clear state after the "caught" message has finished typing
            setTimeout(() => {
                pokemonImageEl.classList.remove('visible');
                pokemonNameEl.textContent = '';
                quizState.wildPokemon = null; 
            }, 1500); // Wait 1.5 seconds after typing
        });
    }

    function updatePokedexDisplay() {
        const searchTerm = quizState.pokedexSearchTerm.toLowerCase();
        
        const filteredPokemon = quizState.allPokemon.filter(p => {
            // Filter logic
            const isCaught = quizState.pokedex.includes(p.id);
            let matchesFilter = true;
            if (quizState.pokedexFilter === 'caught') {
                matchesFilter = isCaught;
            } else if (quizState.pokedexFilter === 'missing') {
                matchesFilter = !isCaught;
            }

            // Search logic
            const matchesSearch = p.name.toLowerCase().includes(searchTerm) || String(p.id).includes(searchTerm);

            return matchesFilter && matchesSearch;
        });

        pokedexGrid.innerHTML = ''; // Clear previous results
        
        if (document.getElementById('clear-pokedex-btn') === null) {
            const clearPokedexBtn = document.createElement('button');
            clearPokedexBtn.id = 'clear-pokedex-btn';
            clearPokedexBtn.textContent = 'Clear Pokédex';
            pokedexFiltersEl.appendChild(clearPokedexBtn);

            clearPokedexBtn.addEventListener('click', () => {
                if (confirm('Are you sure you want to clear your entire Pokédex? This action cannot be undone.')) {
                    quizState.pokedex = [];
                    savePokedexToStorage(quizState.pokedex);
                    updatePokedexDisplay();
                }
            });
        }
        
        filteredPokemon.forEach(p => {
            const isCaught = quizState.pokedex.includes(p.id);
            const entryDiv = document.createElement('div');
            entryDiv.className = 'pokedex-entry';
            if (!isCaught) {
                entryDiv.classList.add('missing');
            }

            const idSpan = document.createElement('span');
            idSpan.className = 'pokemon-id';
            idSpan.textContent = `#${String(p.id).padStart(3, '0')}`;
            
            const img = document.createElement('img');
            img.src = p.sprite;
            img.alt = p.name;

            const nameSpan = document.createElement('span');
            nameSpan.className = 'pokemon-name';
            nameSpan.textContent = isCaught ? (p.name.charAt(0).toUpperCase() + p.name.slice(1)) : '???';

            entryDiv.appendChild(idSpan);
            entryDiv.appendChild(img);
            entryDiv.appendChild(nameSpan);
            pokedexGrid.appendChild(entryDiv);
        });

        pokedexStatsEl.textContent = `Caught: ${quizState.pokedex.length} / ${quizState.allPokemon.length}`;
    }

    // --- Save/Load Session ---
    function xorBytes(dataBytes, keyBytes) {
        const result = new Uint8Array(dataBytes.length);

        for (let i = 0; i < dataBytes.length; i++) {
            result[i] = dataBytes[i] ^ keyBytes[i % keyBytes.length];
        }

        return result;
    }

    function bytesToBase64(bytes) {
        let binary = '';
        for (const byte of bytes) {
            binary += String.fromCharCode(byte);
        }
        return btoa(binary);
    }

    function base64ToBytes(base64) {
        const binary = atob(base64);
        const bytes = new Uint8Array(binary.length);

        for (let i = 0; i < binary.length; i++) {
            bytes[i] = binary.charCodeAt(i);
        }

        return bytes;
    }

    function encryptSaveData(plainText) {
        const encoder = new TextEncoder();
        const plainBytes = encoder.encode(plainText);
        const keyBytes = encoder.encode(SAVE_KEY);
        return bytesToBase64(xorBytes(plainBytes, keyBytes));
    }

    function decryptSaveData(base64) {
        const decoder = new TextDecoder();
        const keyBytes = new TextEncoder().encode(SAVE_KEY);
        return decoder.decode(xorBytes(base64ToBytes(base64), keyBytes));
    }

    function cipher(str, key) {
        let result = '';
        for (let i = 0; i < str.length; i++) {
            result += String.fromCharCode(str.charCodeAt(i) ^ key.charCodeAt(i % key.length));
        }
        return result;
    }

    function savePokedex() {
        const data = JSON.stringify(captureSessionSnapshot());
        const encrypted = encryptSaveData(data);
        
        const blob = new Blob([encrypted], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'kotoba_session.kotodex';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    function loadPokedex(file) {
        const reader = new FileReader();
        reader.onload = async (e) => {
            try {
                const encrypted = String(e.target.result || '').trim();
                let decrypted;

                try {
                    decrypted = decryptSaveData(encrypted);
                } catch (error) {
                    // Backward compatibility for older Latin-1 based Pokedex saves.
                    decrypted = cipher(atob(encrypted), SAVE_KEY);
                }

                const loadedData = JSON.parse(decrypted);

                if (Array.isArray(loadedData) && loadedData.every(id => typeof id === 'number')) {
                    quizState.pokedex = loadedData;
                    savePokedexToStorage(quizState.pokedex);
                    if (!quizState.pokedexLoaded) {
                        await fetchAllPokemon();
                    }
                    updatePokedexDisplay();
                    alert('Legacy Pokédex save loaded successfully.');
                } else if (loadedData && typeof loadedData === 'object' && loadedData.version >= 2) {
                    await restoreSessionSnapshot(loadedData);
                    alert('Session loaded successfully.');
                } else {
                    throw new Error('Invalid save file format.');
                }
            } catch (err) {
                console.error('Failed to load or parse Pokedex file:', err);
                alert('Could not load the save file. It might be corrupted or in the wrong format.');
            }
        };
        reader.readAsText(file);
    }

    function escapeRegExp(str) {
        return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    }

    function highlightSentence(sentence, keywords) {
        for (const word of keywords) {
            if (!word) continue;
            const regex = new RegExp(`\\b${escapeRegExp(word)}\\b`, 'i');
            if (regex.test(sentence)) {
                return sentence.replace(regex, '<span class="highlight-word">$&</span>');
            }
        }
        return sentence;
    }

    autoplayAudioToggleEl.checked = quizState.autoplayAudioEnabled;
    reverseInputToggleEl.checked = quizState.reverseInputModeEnabled;
    showGermanSentenceToggleEl.checked = quizState.showGermanSentenceEnabled;
    sentenceTranslationToggleEl.checked = quizState.sentenceTranslationModeEnabled;
    casePracticeToggleEl.checked = quizState.casePracticeModeEnabled;
    auxiliaryToggleEls.forEach(toggleEl => {
        toggleEl.checked = Boolean(quizState.auxiliarySelections[toggleEl.dataset.auxiliary]);
    });
    modalVerbTableToggleEl.checked = quizState.modalVerbTableEnabled;
    modalVerbTenseToggleEls.forEach(toggleEl => {
        toggleEl.checked = toggleEl.dataset.modalverbTense === quizState.modalVerbTense;
    });
    if (Object.keys(getCustomDeckLibrary()).length > 0) {
        setCustomDeckStatus(`Loaded ${Object.keys(getCustomDeckLibrary()).length} custom deck(s).`, 'info');
    }
    updateReverseModeControls();
    updateAnswerInputPlaceholder();
    updateStudyTabUI();
    populateDeckSelector();
    setupEventListeners();
    renderModalVerbPractice();
    updateStatsDisplay();
});
