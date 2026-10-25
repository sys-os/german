const assert = require('node:assert/strict');
const { chromium } = require('playwright');

const BASE_URL = process.env.GERMAN_INPUT_TEST_URL || 'http://127.0.0.1:8017/';
const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function openSingleSpeechCard(browser, answer) {
    const page = await browser.newPage();
    await page.route('**/data/speech_a2.json', route => route.fulfill({
        contentType: 'application/json',
        body: JSON.stringify({ cards: [{ id: 'input-test', question: 'Translate this', answer: [answer], speechDeckType: 'a2' }] }),
    }));
    await page.goto(BASE_URL);
    await page.locator('#menu-toggle-btn').click();
    await page.locator('[aria-controls="speech-settings"]').click();
    await page.locator('#speech-a2-deck-btn').click();
    await page.waitForFunction(() => document.querySelector('#question').textContent === 'Translate this');
    return page;
}

(async () => {
    const browser = await chromium.launch({ executablePath: CHROME, headless: true });
    try {
        const cases = [
            ['Mädchen', 'Madchen', true],
            ['möchte', 'mochte', true],
            ['weiß', 'weiSS', true],
            ['weiß', 'weiss', false],
            ['Masse', 'MASSE', true],
            ['schon', 'schön', false],
            ['müde', 'mude', false],
            ['Mädchen möchte weiß', 'Madchen mochte weiSS', true],
            ['Masse weiß', 'MASSE weiSS', true],
        ];
        for (const [answer, input, shouldPass] of cases) {
            const page = await openSingleSpeechCard(browser, answer);
            await page.locator('#answer-input').fill(input);
            if (!shouldPass) {
                assert.equal(await page.locator('#feedback').textContent(), '', `${input} must not match ${answer}`);
                await page.locator('#answer-input').press('Enter');
            }
            await page.waitForFunction(() => document.querySelector('#feedback').classList.contains('visible'));
            assert.equal(await page.locator('#feedback').evaluate(element => element.classList.contains('correct')), shouldPass, `${input} versus ${answer}`);
            await page.close();
        }

        const page = await browser.newPage();
        await page.goto(BASE_URL);
        await page.locator('#menu-toggle-btn').click();
        await page.locator('[aria-controls="modalverb-settings"]').click();
        await page.locator('label[for="modalverb-table-toggle"]').click();
        assert.equal(await page.locator('#modalverb-table-toggle').isChecked(), true);
        for (const [key, input] of [['koennen:1', 'konnen'], ['moegen:1', 'mogen'], ['moechten:0', 'mochte']]) {
            const cell = page.locator(`.modalverb-answer-cell[data-cell-key="${key}"]`);
            await cell.locator('input').fill(input);
            await cell.locator('input').press('Enter');
            assert.equal(await cell.evaluate(element => element.classList.contains('correct')), true, `${input} in ${key}`);
        }
        await page.close();
        console.log('German input alternatives passed.');
    } finally {
        await browser.close();
    }
})().catch(error => {
    console.error(error);
    process.exitCode = 1;
});
