const assert = require('node:assert/strict');
const { chromium } = require('playwright');

const BASE_URL = process.env.SPEECH_TEST_URL || 'http://127.0.0.1:8017/';
const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function openSpeech(page) {
    await page.locator('#menu-toggle-btn').click();
    await page.locator('[aria-controls="speech-settings"]').click();
    await page.locator('#speech-a2-deck-btn').click();
    await page.waitForFunction(() => document.querySelector('#question').textContent.trim().length > 0);
}

(async () => {
    const browser = await chromium.launch({ executablePath: CHROME, headless: true });
    const errors = [];
    try {
        const page = await browser.newPage({ acceptDownloads: true });
        page.on('pageerror', error => errors.push(error.message));
        const speechAudioRequests = [];
        page.on('request', request => {
            if (request.url().includes('/audio/speech_a2/')) {
                speechAudioRequests.push(request.url());
            }
        });
        await page.goto(BASE_URL);
        await page.evaluate(() => {
            localStorage.clear();
            localStorage.setItem('kotobaAutoplayAudio', 'true');
        });
        await page.reload();
        await openSpeech(page);

        const cards = await page.evaluate(async () => (await (await fetch('data/speech_a2.json')).json()).cards);
        assert.equal(cards.length, 155);
        const firstPrompt = (await page.locator('#question').textContent()).trim();
        const firstCard = cards.find(card => card.question === firstPrompt);
        assert.ok(firstCard, `Unknown Speech prompt: ${firstPrompt}`);
        assert.equal(await page.locator('#play-sentence-audio-btn').isVisible(), false);
        assert.equal(speechAudioRequests.length, 0);
        await page.locator('#answer-input').fill(firstCard.answer[0]);
        await page.waitForFunction(() => document.querySelector('#feedback').classList.contains('correct'));
        assert.ok((await page.locator('#feedback').textContent()).includes(firstCard.answer[0]));
        assert.equal(await page.locator('#play-sentence-audio-btn').isVisible(), true);
        if (firstCard.sentenceAudioUrl) {
            await page.waitForFunction(url => performance.getEntriesByType('resource').some(entry => entry.name.endsWith(url)), firstCard.sentenceAudioUrl);
            assert.ok(speechAudioRequests.some(url => url.endsWith(firstCard.sentenceAudioUrl)));
        }
        const audioRequest = firstCard.sentenceAudioUrl
            ? page.waitForRequest(request => request.url().endsWith(firstCard.sentenceAudioUrl))
            : null;
        await page.locator('#play-sentence-audio-btn').click();
        if (firstCard.sentenceAudioUrl) {
            const request = await audioRequest;
            assert.equal((await page.request.get(request.url())).status(), 200);
        }

        await page.locator('[data-study-tab="vocabulary"]').click();
        assert.equal(await page.locator('#speech-a2-deck-btn').getAttribute('aria-pressed'), 'false');
        await page.locator('#menu-toggle-btn').click();
        await page.locator('#speech-a2-deck-btn').click();
        assert.equal(await page.locator('#speech-a2-deck-btn').getAttribute('aria-pressed'), 'true');
        assert.equal((await page.locator('#question').textContent()).trim(), firstPrompt);
        assert.match(await page.locator('#feedback').textContent(), /Correct!/);

        await page.locator('#pokedex-container').evaluate(element => { element.style.display = 'flex'; });
        const downloadPromise = page.waitForEvent('download');
        await page.locator('#save-pokedex-btn').click();
        const download = await downloadPromise;
        assert.equal(download.suggestedFilename(), 'kotoba_session.kotodex');
        const savedFile = await download.path();
        await page.locator('[data-study-tab="vocabulary"]').click();
        page.once('dialog', dialog => dialog.accept());
        await page.locator('#load-pokedex-input').setInputFiles(savedFile);
        await page.waitForFunction(() => document.querySelector('#speech-a2-deck-btn').getAttribute('aria-pressed') === 'true');
        assert.equal((await page.locator('#question').textContent()).trim(), firstPrompt);

        const mobile = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
        mobile.on('pageerror', error => errors.push(error.message));
        await mobile.goto(BASE_URL);
        await mobile.evaluate(() => localStorage.clear());
        await mobile.reload();
        await openSpeech(mobile);
        const mobilePrompt = (await mobile.locator('#question').textContent()).trim();
        await mobile.locator('#answer-input').fill('definitely wrong');
        await mobile.locator('#answer-input').press('Enter');
        await mobile.waitForFunction(prompt => document.querySelector('#question').textContent.trim() !== prompt, mobilePrompt, { timeout: 4000 });

        assert.deepEqual(errors, []);
        console.log('Speech A2 browser flow passed.');
    } finally {
        await browser.close();
    }
})().catch(error => {
    console.error(error);
    process.exitCode = 1;
});
