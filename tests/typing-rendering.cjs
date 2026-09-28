// Run with Node 22+: node tests/typing-rendering.cjs
// Uses an isolated headless Chrome/Edge profile; set CHROME_PATH if needed.
const assert = require('node:assert/strict');
const { spawn } = require('node:child_process');
const { existsSync, mkdtempSync, readFileSync, writeFileSync } = require('node:fs');
const http = require('node:http');
const os = require('node:os');
const path = require('node:path');
const { once } = require('node:events');

const root = path.resolve(__dirname, '..');
const browserPath = [process.env.CHROME_PATH,
    'C:/Program Files/Google/Chrome/Application/chrome.exe',
    'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
    '/usr/bin/google-chrome', '/usr/bin/chromium',
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
].find(candidate => candidate && existsSync(candidate));
assert.ok(browserPath, 'Install Chrome/Edge or set CHROME_PATH');
const artifacts = mkdtempSync(path.join(os.tmpdir(), 'typefast-rendering-'));
const server = http.createServer((req, res) => {
    const filename = path.resolve(root, '.' + new URL(req.url, 'http://localhost').pathname);
    if (!filename.startsWith(root + path.sep)) { res.writeHead(403).end(); return; }
    try {
        const content = readFileSync(filename);
        const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css' };
        res.setHeader('Content-Type', (types[path.extname(filename)] || 'application/octet-stream') + '; charset=utf-8');
        res.end(content);
    } catch { res.writeHead(404).end(); }
});

async function run() {
    server.listen(0, '127.0.0.1');
    await once(server, 'listening');
    const origin = `http://127.0.0.1:${server.address().port}`;
    const browser = spawn(browserPath, ['--headless', '--disable-gpu', '--no-first-run',
        '--no-default-browser-check', '--remote-debugging-port=0',
        `--user-data-dir=${path.join(artifacts, 'profile')}`, 'about:blank'], { windowsHide: true });
    let socket;
    try {
        const debugUrl = await new Promise((resolve, reject) => {
            let output = '';
            const timeout = setTimeout(() => reject(new Error('Browser startup timed out: ' + output)), 15000);
            browser.on('error', reject);
            browser.stderr.on('data', chunk => {
                output += chunk;
                const match = output.match(/DevTools listening on (ws:\/\/\S+)/);
                if (match) { clearTimeout(timeout); resolve(match[1]); }
            });
        });
        socket = new WebSocket(debugUrl);
        await once(socket, 'open');
        const pending = new Map();
        const errors = [];
        let sequence = 0;
        let sessionId;
        let loaded;
        socket.addEventListener('message', event => {
            const message = JSON.parse(event.data);
            if (message.id && pending.has(message.id)) {
                const { resolve, reject, timeout } = pending.get(message.id);
                pending.delete(message.id);
                clearTimeout(timeout);
                if (message.error) reject(new Error(JSON.stringify(message.error)));
                else resolve(message.result);
            }
            if (message.method === 'Page.loadEventFired' && loaded) loaded();
            if (message.method === 'Runtime.exceptionThrown') errors.push(message.params.exceptionDetails);
        });
        function command(method, params = {}, session = sessionId) {
            return new Promise((resolve, reject) => {
                const id = ++sequence;
                const timeout = setTimeout(() => reject(new Error('CDP timeout: ' + method)), 30000);
                pending.set(id, { resolve, reject, timeout });
                socket.send(JSON.stringify({ id, method, params, sessionId: session }));
            });
        }
        const { targetId } = await command('Target.createTarget', { url: 'about:blank' });
        ({ sessionId } = await command('Target.attachToTarget', { targetId, flatten: true }));
        await command('Page.enable');
        await command('Runtime.enable');
        async function evaluate(fn, ...args) {
            const response = await command('Runtime.evaluate', {
                expression: `(${fn.toString()})(...${JSON.stringify(args)})`, awaitPromise: true, returnByValue: true
            });
            if (response.exceptionDetails) throw new Error(response.exceptionDetails.exception?.description || response.exceptionDetails.text);
            return response.result.value;
        }
        async function navigate(url) {
            const done = new Promise(resolve => { loaded = resolve; });
            await command('Page.navigate', { url });
            await done;
            loaded = null;
        }
        await command('Emulation.setDeviceMetricsOverride', { width: 1280, height: 800, deviceScaleFactor: 1, mobile: false });
        await navigate(origin + '/index.html');
        await evaluate(() => {
            localStorage.setItem('constraintMode', 'word');
            localStorage.setItem('selectedWordMode', 'short');
        });
        await navigate(origin + '/index.html');

        const results = await evaluate(async () => {
            const passed = [];
            const check = (condition, message) => { if (!condition) throw new Error(message); };
            const settle = () => new Promise(resolve => setTimeout(resolve, 260));
            const key = (value, options = {}) => document.body.dispatchEvent(new KeyboardEvent('keydown', { key: value, bubbles: true, cancelable: true, ...options }));
            const originalCompleted = m.completed;
            const originalSound = m.playSound;
            let completions = [];
            let sounds = [];
            m.completed = value => completions.push(value);
            m.playSound = value => sounds.push(value);
            function reset(text) {
                m.resetTestTiming();
                Object.assign(m, { fullText: text, userIndex: 0, charTyped: 0, correctCount: 0,
                    wrongCount: 0, backspaceCount: 0, wrongChar: {}, startTime: 0, endTime: 0,
                    timeBtn: false, totalWords: text.split(/\s+/).filter(Boolean).length });
                completions = [];
                sounds = [];
                m.renderTypingText();
            }
            function type(text) {
                for (const character of text) {
                    key(Object.keys(m.specialKey).find(name => m.specialKey[name] === character) || character);
                }
            }
            function caretAligned() {
                const caret = m.caret.getBoundingClientRect();
                const character = m.characterElements[m.userIndex] || m.characterElements[m.userIndex - 1];
                const rect = character.getBoundingClientRect();
                const x = m.userIndex < m.fullText.length ? rect.left : rect.right;
                check(Math.abs(caret.left - x) < 1, 'Caret x follows current character');
                check(Math.abs((caret.top + caret.height / 2) - (rect.top + rect.height / 2)) < 5, 'Caret y follows current line');
                const viewport = document.getElementById('displayer-container').getBoundingClientRect();
                check(caret.top >= viewport.top && caret.bottom <= viewport.bottom, 'Caret stays inside three-line viewport');
            }

            reset('hello world');
            await settle();
            const nodes = [...m.characterElements];
            const caret = m.caret;
            const positions = nodes.map(node => [node.getBoundingClientRect().left, node.getBoundingClientRect().top]);
            const mutations = new MutationObserver(() => {});
            mutations.observe(m.displayer, { childList: true, subtree: true });
            key('h'); key('x'); key('Backspace'); key('e');
            check(m.userIndex === 2 && m.charTyped === 4 && m.correctCount === 3, 'Typing/backspace counters');
            check(m.wrongCount === 1 && m.backspaceCount === 1 && m.wrongChar.e === 1, 'Wrong character statistics persist after correction');
            check(nodes[1].className === 'char correct' && nodes[2].className === 'char', 'Backspace restores character state');
            check(sounds.join() === [m.correctSound, m.wrongSound, m.correctSound].join(), 'Sound hooks unchanged');
            check(mutations.takeRecords().length === 0, 'Ordinary typing never replaces text nodes');
            mutations.disconnect();
            await settle();
            check(caret === m.caret && nodes.every((node, index) => node === m.characterElements[index]), 'Persistent caret and character nodes');
            check(nodes.every((node, index) => {
                const rect = node.getBoundingClientRect();
                return rect.left === positions[index][0] && rect.top === positions[index][1];
            }), 'Caret and feedback do not move text');
            caretAligned();
            key('Backspace'); key('Backspace'); key('Backspace');
            check(m.userIndex === 0 && m.charTyped === 6 && m.correctCount === 6 && m.backspaceCount === 4, 'Backspace at index zero preserves existing counting rules');
            passed.push('typing, errors, Backspace, persistent DOM, sounds, stable layout');

            reset('the elevator dinged softly at each floor a notebook lay open, its pages half filled');
            await settle();
            const reference = document.createElement('p');
            const textStyle = getComputedStyle(m.displayer);
            Object.assign(reference.style, { position: 'absolute', left: '0', top: '0', margin: '0',
                width: textStyle.width, font: textStyle.font, lineHeight: textStyle.lineHeight,
                visibility: 'hidden' });
            reference.textContent = m.fullText;
            m.textLayer.appendChild(reference);
            const range = document.createRange();
            for (let index = 0; index < m.fullText.length; index++) {
                if (m.fullText[index] === ' ') continue;
                range.setStart(reference.firstChild, index);
                range.setEnd(reference.firstChild, index + 1);
                const plainRect = range.getBoundingClientRect();
                const charRect = m.characterElements[index].getBoundingClientRect();
                check(Math.abs(plainRect.left - charRect.left) < 0.1 && Math.abs(plainRect.top - charRect.top) < 0.1, 'Word/character spans preserve natural sentence spacing');
            }
            reference.remove();
            passed.push('sentence spacing matches plain text');

            reset('a b');
            type('ax');
            check(m.wrongChar[' '] === 1 && m.characterElements[1].classList.contains('wrong'), 'Wrong spaces retain their feedback and statistics');
            key('Backspace');
            check(m.characterElements[1].className === 'char', 'Wrong space resets on Backspace');
            type(' b');
            check(completions.join() === '1', 'Completion fires exactly on final character');
            key('Enter');
            check(completions.join() === '1,Enter', 'Enter after text completion');
            await settle();
            caretAligned();
            reset('abc');
            key('Enter');
            check(m.userIndex === 1 && m.wrongChar.a === 1, 'Enter during text retains wrong-key behavior');
            passed.push('spaces, final caret, Enter, test completion');

            reset('hello, world. don\'t it\'s "example" <vector<int>> a&&b &lt; ←→↑↓');
            check(m.displayer.textContent === m.fullText, 'Punctuation and HTML-like text render literally');
            type(m.fullText);
            check(m.correctCount === m.fullText.length && m.wrongCount === 0, 'Special characters and arrow key mappings');
            check(m.displayer.textContent === m.fullText, 'Special characters stay intact after typing');
            passed.push('punctuation, literal < > &, entity-like text, arrow keys');

            const phrase = 'the elevator dinged softly at each floor a notebook lay open, its pages half-filled ';
            reset(phrase.repeat(14).trim());
            await settle();
            const initialCount = m.characterElements.length;
            const firstNodes = [...m.characterElements];
            check(initialCount >= 250 && /\s/.test(m.fullText[initialCount]), 'Initial chunk ends at a whole word');
            const beforeFast = performance.now();
            type(m.fullText.slice(0, 720));
            const typingMs = performance.now() - beforeFast;
            check(m.characterElements.length > initialCount && firstNodes.every((node, index) => node === m.characterElements[index]), 'Chunks append without replacing existing characters');
            check(m.displayer.textContent === m.fullText.slice(0, m.currentTextIndex), 'No skipped/duplicated characters across chunks');
            check(m.userIndex === 720 && m.correctCount === 720 && !completions.length, 'Fast typing and chunk loading stay synchronized');
            await settle();
            caretAligned();
            const scroll = new DOMMatrix(getComputedStyle(m.textLayer).transform).m42;
            check(scroll < -48 && scroll % 48 === 0, 'Scroll moves by whole lines beyond viewport');
            for (const word of m.displayer.querySelectorAll('.word')) {
                check([...word.children].every(node => node.getBoundingClientRect().top === word.firstChild.getBoundingClientRect().top), 'No word splits across lines');
            }
            for (let index = 0; index < 80; index++) key('Backspace');
            await settle();
            caretAligned();
            check(new DOMMatrix(getComputedStyle(m.textLayer).transform).m42 > scroll, 'Backspace scrolls to previous lines');
            const counter = document.getElementById('word-counter').innerText;
            check(counter === `${m.fullText.slice(0, m.userIndex).split(/\s+/).filter(Boolean).length} / ${m.totalWords}`, 'Word counter preserved');
            passed.push(`fast typing (${Math.round(typingMs)} ms for 720 keys), wrapping, chunks, forward/backward scrolling, word counter`);

            const viewport = document.getElementById('displayer-container');
            for (const width of [340, 610, 900]) {
                viewport.style.maxWidth = width + 'px';
                await settle();
                caretAligned();
            }
            m.displayer.style.fontSize = '28px';
            m.displayer.style.lineHeight = '42px';
            await settle();
            caretAligned();
            check(new DOMMatrix(getComputedStyle(m.textLayer).transform).m42 % 42 === 0, 'Scroll uses measured line height');
            m.displayer.style.fontSize = '';
            m.displayer.style.lineHeight = '';
            viewport.style.maxWidth = '';
            passed.push('container resizing and changed font/line metrics');

            for (const mode of ['relax', 'punctuation', 'number', 'arrow', 'code']) {
                reset('');
                m.buttonClick(mode);
                const text = m.fullText;
                type(text);
                check(m.correctCount === text.length && m.wrongCount === 0 && completions.length === 1, mode + ' mode completes correctly');
                check(m.displayer.textContent === text, mode + ' dataset survives rendering');
            }
            for (const size of ['short', 'medium', 'large', 'xlarge']) {
                reset('');
                m.selectedWordMode = size;
                m.mode = 'relax';
                m.modeSelecter();
                type(m.fullText);
                check(completions.length === 1 && m.userIndex === m.fullText.length, size + ' word test completion');
            }
            passed.push('all five modes and all four word lengths complete');

            reset('abcde');
            type('ax'); key('Backspace'); type('bcde');
            m.startTime = Date.now() - 60000;
            m.endTime = Date.now();
            m.phraselength = 5;
            m.saveStatistic();
            const stats = JSON.parse(localStorage.getItem('dataPass'));
            check(stats.correct === 6 && stats.wrong === 1 && stats.extra === 2 && stats.accuracy === 86, 'Existing statistics and Backspace formula');
            check(stats.wpm === 1 && stats.wpm_net === 1 && stats.time === 60 && JSON.parse(stats.wrong_list).b === 1, 'WPM, time, wrong-character storage');
            reset('abcdef');
            key('a'); key('Enter', { ctrlKey: true });
            check(completions.join() === '1' && m.charTyped === 1, 'Ctrl+Enter submission');
            key('p', { ctrlKey: true, shiftKey: true });
            check(commandPalette.isOpen() && m.charTyped === 1, 'Palette shortcut does not type');
            key('Escape');
            check(!commandPalette.isOpen(), 'Palette closes normally');
            passed.push('statistics, WPM/accuracy, Ctrl+Enter, command palette');

            m.completed = originalCompleted;
            m.playSound = originalSound;
            reset(phrase.repeat(14).trim());
            type(m.fullText.slice(0, 320));
            await settle();
            return passed;
        });
        for (const result of results) console.log('PASS ' + result);

        for (const width of [390, 768, 1440]) {
            await command('Emulation.setDeviceMetricsOverride', { width, height: 800, deviceScaleFactor: 1, mobile: false });
            await evaluate(() => new Promise(resolve => setTimeout(resolve, 300)));
            const layout = await evaluate(() => {
                const rect = m.characterElements[m.userIndex].getBoundingClientRect();
                const caret = m.caret.getBoundingClientRect();
                return { delta: Math.abs(rect.left - caret.left), height: document.getElementById('displayer-container').offsetHeight };
            });
            assert.ok(layout.delta < 1, 'Caret follows browser resize at ' + width);
            assert.equal(layout.height, 144, 'Viewport dimensions preserved');
        }
        console.log('PASS browser resize at 390, 768, 1440 pixels');
        const screenshot = await command('Page.captureScreenshot');
        writeFileSync(path.join(artifacts, 'typing.png'), Buffer.from(screenshot.data, 'base64'));

        await evaluate(() => {
            localStorage.setItem('mode', 'relax');
            localStorage.setItem('constraintMode', 'word');
            localStorage.setItem('selectedWordMode', 'short');
        });
        await navigate(origin + '/index.html');
        await evaluate(() => {
            for (const key of m.fullText) document.body.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }));
        });
        await new Promise(resolve => setTimeout(resolve, 350));
        assert.ok((await evaluate(() => location.pathname)).endsWith('/stats.html'), 'Word completion navigates to stats');
        assert.equal(await evaluate(() => JSON.parse(localStorage.getItem('dataPass')).accuracy), 100);
        console.log('PASS actual word completion navigation and stored stats');

        await navigate(origin + '/index.html');
        await evaluate(() => {
            document.body.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', bubbles: true }));
            document.body.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
        });
        await new Promise(resolve => setTimeout(resolve, 350));
        assert.equal(await evaluate(() => m.charTyped), 0);
        assert.ok((await evaluate(() => location.pathname)).endsWith('/index.html'));
        console.log('PASS Tab + Enter restart');

        const afkResults = await evaluate(require('./afk.cjs'));
        for (const result of afkResults) console.log('PASS ' + result);

        await evaluate(() => {
            localStorage.setItem('constraintMode', 'time');
            localStorage.setItem('selectedTime', '15');
        });
        await navigate(origin + '/index.html');
        await evaluate(() => document.body.dispatchEvent(new KeyboardEvent('keydown', { key: m.fullText[0], bubbles: true })));
        await new Promise(resolve => setTimeout(resolve, 1200));
        assert.equal(await evaluate(() => document.getElementById('clock').innerText), '14s');
        await new Promise(resolve => setTimeout(resolve, 2100));
        const paused = await evaluate(() => ({ paused: m.isPaused, index: m.userIndex,
            clock: document.getElementById('clock').innerText, label: !document.getElementById('afk-status').hidden,
            blink: getComputedStyle(m.caret).animationPlayState }));
        assert.deepEqual(paused, { paused: true, index: 1, clock: '12s', label: true, blink: 'paused' });
        await new Promise(resolve => setTimeout(resolve, 1100));
        assert.equal(await evaluate(() => document.getElementById('clock').innerText), '12s');
        const pausedScreenshot = await command('Page.captureScreenshot');
        writeFileSync(path.join(artifacts, 'paused.png'), Buffer.from(pausedScreenshot.data, 'base64'));
        const resumed = await evaluate(() => {
            const type = () => document.body.dispatchEvent(new KeyboardEvent('keydown', { key: m.fullText[m.userIndex], bubbles: true }));
            type();
            // Keep typing so this real timed run can finish without another AFK pause.
            window.testTypingInterval = setInterval(type, 1800);
            return { paused: m.isPaused, index: m.userIndex, afk: m.afkTime };
        });
        assert.equal(resumed.paused, false);
        assert.equal(resumed.index, 2, 'Resume character is counted exactly once');
        assert.ok(resumed.afk >= 1300, 'Real AFK duration recorded separately');
        console.log('PASS real 3-second AFK detection, frozen countdown/caret, same-key resume');
        await new Promise(resolve => setTimeout(resolve, 12500));
        assert.ok((await evaluate(() => location.pathname)).endsWith('/stats.html'), 'Timer completes on stats page');
        const timed = await evaluate(() => JSON.parse(localStorage.getItem('dataPass')));
        assert.equal(timed.activeTypingTime, 15000);
        assert.ok(timed.afkTime >= 1300);
        assert.equal(timed.totalElapsedTime, timed.activeTypingTime + timed.afkTime);
        assert.equal(timed.time, Math.round(timed.totalElapsedTime / 1000));
        assert.ok(timed.correct >= 8);
        console.log('PASS real timed completion excludes AFK from countdown, includes it in WPM time');
        assert.deepEqual(errors, [], 'No browser runtime errors');
        console.log('PASS no browser runtime errors');
        console.log('Screenshot: ' + path.join(artifacts, 'typing.png'));
        console.log('Paused screenshot: ' + path.join(artifacts, 'paused.png'));
    } finally {
        if (socket) socket.close();
        browser.kill();
        server.close();
    }
}
run().catch(error => { console.error(error); server.close(); process.exitCode = 1; });
