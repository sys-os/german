const assert = require('node:assert/strict');
const { chromium } = require('playwright');

const BASE_URL = process.env.SPEECH_TEST_URL || 'http://127.0.0.1:8017/';
const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function openConnectors(page) {
    await page.locator('#menu-toggle-btn').click();
    await page.locator('[aria-controls="speech-settings"]').click();
    await page.locator('#speech-connectors-deck-btn').click();
    await page.waitForFunction(() => document.querySelector('#question').textContent.trim().length > 0);
}

(async () => {
    const browser = await chromium.launch({ executablePath: CHROME, headless: true });
    const errors = [];
    try {
        const page = await browser.newPage({ acceptDownloads: true });
        page.on('pageerror', error => errors.push(error.message));
        const audioRequests = [];
        page.on('request', request => {
            if (/\.(mp3|ogg|wav)(\?|$)/i.test(request.url())) audioRequests.push(request.url());
        });
        await page.goto(BASE_URL);
        await page.evaluate(() => {
            localStorage.clear();
            localStorage.setItem('kotobaAutoplayAudio', 'true');
        });
        await page.reload();
        await openConnectors(page);

        const cards = await page.evaluate(async () => (await (await fetch('data/speech_connectors.json')).json()).cards);
        assert.equal(cards.length, 92);
        assert.ok(cards.every(card => !card.speechFallbackText && !card.sentenceAudioUrl));
        assert.equal(await page.locator('#speech-connectors-deck-btn').getAttribute('aria-pressed'), 'true');
        assert.equal(await page.locator('#speech-a2-deck-btn').getAttribute('aria-pressed'), 'false');
        const firstPrompt = (await page.locator('#question').textContent()).trim();
        const firstCard = cards.find(card => card.question === firstPrompt);
        assert.ok(firstCard, `Unknown Speech Connectors prompt: ${firstPrompt}`);
        assert.equal(await page.locator('#play-sentence-audio-btn').isVisible(), false);
        await page.locator('#answer-input').fill(firstCard.answer[0]);
        await page.waitForFunction(() => document.querySelector('#feedback').classList.contains('correct'));
        assert.equal(await page.locator('#play-sentence-audio-btn').isVisible(), false);
        assert.deepEqual(audioRequests, []);

        await page.locator('#speech-a2-deck-btn').click();
        assert.equal(await page.locator('#speech-a2-deck-btn').getAttribute('aria-pressed'), 'true');
        await page.waitForFunction(() => document.querySelector('#stats-container').textContent.includes('Speech - A2'));
        assert.match(await page.locator('#stats-container').textContent(), /155/);
        await page.locator('#speech-connectors-deck-btn').click();
        await page.waitForFunction(() => document.querySelector('#stats-container').textContent.includes('Speech - Connectors'));
        assert.equal((await page.locator('#question').textContent()).trim(), firstPrompt);
        assert.match(await page.locator('#feedback').textContent(), /Correct!/);

        await page.locator('#pokedex-container').evaluate(element => { element.style.display = 'flex'; });
        const downloadPromise = page.waitForEvent('download');
        await page.locator('#save-pokedex-btn').click();
        const savedFile = await (await downloadPromise).path();
        await page.locator('[data-study-tab="vocabulary"]').click();
        page.once('dialog', dialog => dialog.accept());
        await page.locator('#load-pokedex-input').setInputFiles(savedFile);
        await page.waitForFunction(() => document.querySelector('#speech-connectors-deck-btn').getAttribute('aria-pressed') === 'true');
        assert.equal((await page.locator('#question').textContent()).trim(), firstPrompt);

        const mobile = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
        mobile.on('pageerror', error => errors.push(error.message));
        await mobile.goto(BASE_URL);
        await mobile.evaluate(() => localStorage.clear());
        await mobile.reload();
        await openConnectors(mobile);
        const mobilePrompt = (await mobile.locator('#question').textContent()).trim();
        await mobile.locator('#answer-input').fill('definitely wrong');
        await mobile.locator('#answer-input').press('Enter');
        await mobile.waitForFunction(prompt => document.querySelector('#question').textContent.trim() !== prompt, mobilePrompt, { timeout: 4000 });

        assert.deepEqual(errors, []);
        console.log('Speech Connectors browser flow passed.');
    } finally {
        await browser.close();
    }
})().catch(error => {
    console.error(error);
    process.exitCode = 1;
});
