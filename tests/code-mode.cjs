// Browser assertions run by typing-rendering.cjs against the shared typing engine.
module.exports = async function () {
    const passed = [];
    const check = (condition, message) => { if (!condition) throw new Error(message); };
    const originalNow = Date.now;
    const originalRandom = Math.random;
    let now = originalNow();
    Date.now = () => now;
    Math.random = () => 0;
    let navigations = 0;
    const preventNavigation = event => {
        if (event.target.closest('a[href="stats.html"]')) {
            event.preventDefault();
            navigations++;
        }
    };
    document.addEventListener('click', preventNavigation, true);
    const settle = () => new Promise(resolve => setTimeout(resolve, 260));
    const key = (value, options = {}) => document.body.dispatchEvent(new KeyboardEvent('keydown', {
        key: value, bubbles: true, cancelable: true, ...options
    }));
    const type = text => {
        for (const character of text) {
            now += 10;
            key(character);
        }
    };
    function start(size = 'short', seconds = 0) {
        m.constraintMode = seconds ? 'time' : 'word';
        m.timeBtn = seconds > 0;
        m.selectedTime = seconds;
        m.selectedWordMode = size;
        m.buttonClick('code');
        navigations = 0;
    }
    function caretAligned() {
        const rect = (m.characterElements[m.userIndex] || m.characterElements[m.userIndex - 1]).getBoundingClientRect();
        const caret = m.caret.getBoundingClientRect();
        const viewport = document.getElementById('displayer-container').getBoundingClientRect();
        const x = m.userIndex === m.fullText.length ? rect.right : rect.left;
        check(Math.abs(caret.left - x) < 1, 'Code caret follows typable character horizontally');
        check(Math.abs((caret.top + caret.height / 2) - (rect.top + rect.height / 2)) < 5, 'Code caret follows visual row vertically');
        check(caret.top >= viewport.top && caret.bottom <= viewport.bottom, 'Code caret stays in typing viewport');
    }
    try {
        m.buttonClick('relax');
        const proseFont = getComputedStyle(m.displayer).fontFamily;
        const legacyDataset = JSON.stringify(m.ultimate_lines);
        check(Object.keys(CODE_SNIPPETS).join() === 'cpp', 'Only C++ is implemented');
        const snippets = CODE_SNIPPETS.cpp.flatMap(collection => collection.snippets);
        const codeLineCount = snippets.flatMap(snippet => snippet.lines).filter(line => line.text).length;
        check(codeLineCount >= 1000, 'Dataset contains at least 1,000 actual, nonblank C++ lines');
        check(new Set(CODE_SNIPPETS.cpp.map(collection => collection.id)).size === CODE_SNIPPETS.cpp.length, 'Collection IDs are unique');
        check(new Set(snippets.map(snippet => JSON.stringify(snippet.lines))).size === snippets.length, 'Exercises are not duplicated to inflate the dataset');
        for (const collection of CODE_SNIPPETS.cpp) {
            let previousLength = 0;
            for (const snippet of collection.snippets) {
                const logicalLines = snippet.lines.filter(line => line.text.length);
                const length = logicalLines.reduce((sum, line) => sum + line.text.length, 0);
                const [minimum, maximum] = { short: [2, 4], medium: [5, 8], large: [9, 15] }[snippet.size];
                check(logicalLines.length >= minimum && logicalLines.length <= maximum, collection.id + ' logical line count: ' + snippet.size);
                check(length > previousLength, collection.id + ' sizes increase in typable length');
                previousLength = length;
                check(snippet.lines.every(line => line.indent >= 0 && Number.isInteger(line.indent)
                    && line.text.trim() === line.text && !/[\n\r\t]/.test(line.text)
                    && line.text.length + line.indent * 4 <= 46), 'Structured data has clean, short logical lines');
            }
        }
        passed.push(`${snippets.length} structured C++ snippets, ${codeLineCount} nonblank code lines, unique content and meaningful sizes`);

        start();
        await settle();
        check(getComputedStyle(m.displayer).fontFamily !== proseFont, 'Code-only monospace font');
        check(m.fullText === m.codeLines.map(line => line.text).join(''), 'Typable text excludes line breaks and indentation');
        const rows = [...m.displayer.querySelectorAll('.code-line')];
        check(rows.length === 4 && rows[2].firstChild.getBoundingClientRect().left > rows[1].firstChild.getBoundingClientRect().left, 'Logical lines and visual indentation render');
        check(rows[1].getBoundingClientRect().top - rows[0].getBoundingClientRect().top === 48, 'Code line height matches typing viewport');
        const firstLineEnd = m.codeLines[0].text.length;
        type(m.fullText.slice(0, firstLineEnd));
        await settle();
        check(m.userIndex === firstLineEnd && m.characterElements[m.userIndex].parentElement === rows[1], 'Line end automatically advances without Enter');
        caretAligned();
        type(m.codeLines[1].text);
        await settle();
        check(m.characterElements[m.userIndex].parentElement === rows[2], 'Caret skips leading indentation');
        caretAligned();
        key('Backspace');
        await settle();
        check(m.characterElements[m.userIndex].textContent === '{' && m.characterElements[m.userIndex].parentElement === rows[1], 'Backspace crosses lines to previous typable character');
        caretAligned();
        check(document.getElementById('word-counter').innerText === `${m.userIndex} / ${m.fullText.length} chars`, 'Code counter reports actual character progress');
        passed.push('indentation, automatic line transitions, Backspace across lines and character progress');

        start('medium');
        await settle();
        const blank = m.displayer.querySelectorAll('.code-line')[1];
        check(!blank.textContent && blank.getBoundingClientRect().height === 48, 'Blank line has visual height and no typable content');
        type(m.codeLines[0].text);
        await settle();
        caretAligned();
        check(m.fullText[m.userIndex] === 'i', 'Blank lines require no input');
        key('Tab');
        check(m.fullText[m.userIndex] === 'i', 'Tab never types indentation');
        key('i');
        key('p', { ctrlKey: true, shiftKey: true });
        const beforePalette = m.userIndex;
        key('ArrowDown'); key('Escape');
        check(m.userIndex === beforePalette && !commandPalette.isOpen(), 'Palette shortcuts stay independent of Code layout');
        key('Enter', { ctrlKey: true });
        check(navigations === 1 && m.testCompleted, 'Ctrl+Enter submits Code normally');
        passed.push('blank lines, Tab, command palette and Ctrl+Enter');

        start();
        m.codeLines = [
            { indent: 0, text: 'int value = 10;' },
            { indent: 0, text: 'if (a < b && a != c || a >= limit) {' },
            { indent: 1, text: 'nums[i] = (x + y - z) * 2 / 3 % 5;' },
            { indent: 1, text: 'mask = (flags | bit) ^ (flags & bit);' },
            { indent: 1, text: '++value; --value; value <= limit;' },
            { indent: 1, text: 'std::cout << ptr->x << "<>&" << \'\\n\';' },
            { indent: 0, text: '}' }
        ];
        m.fullText = m.codeLines.map(line => line.text).join('');
        m.renderTypingText();
        type('int');
        await settle();
        const space = m.characterElements[3];
        const width = space.getBoundingClientRect().width;
        key('x');
        check(space.textContent === ' ' && space.classList.contains('wrong') && m.wrongChar[' '] === 1, 'Wrong inline space counted against actual space');
        check(getComputedStyle(space, '::after').content.includes('␣') && space.getBoundingClientRect().width === width, 'Wrong space marker is visible without changing layout');
        key('Backspace');
        check(!space.classList.contains('wrong'), 'Wrong space resets on Backspace');
        type(m.fullText.slice(m.userIndex));
        const statistics = JSON.parse(localStorage.getItem('dataPass'));
        const length = m.fullText.length;
        check(navigations === 1 && m.phraselength === length && m.charTyped === length + 2, 'Only real characters count toward completion and typing');
        check(m.correctCount === length + 1 && m.wrongCount === 1 && m.backspaceCount === 1, 'Shared error/Backspace accounting is unchanged');
        check(statistics.accuracy === Math.round((length + 1) / (length + 2) * 100), 'Accuracy excludes visual formatting');
        check(statistics.wpm === Math.round(m.charTyped * 12000 / statistics.totalElapsedTime), 'WPM uses shared elapsed-time formula');
        check(m.displayer.textContent === m.fullText && m.characterElements.every(node => node.classList.contains('correct')), 'All operators, quotes and HTML characters survive typing');
        passed.push('wrong-space marker, special characters/operators, accurate statistics and final-character completion');

        for (let index = 0; index < CODE_SNIPPETS.cpp.length; index++) {
            Math.random = () => (index + 0.1) / CODE_SNIPPETS.cpp.length;
            for (const size of ['short', 'medium', 'large', 'xlarge']) {
                start(size);
                const expected = CODE_SNIPPETS.cpp[index].snippets.filter(snippet => size === 'xlarge' || snippet.size === size)
                    .flatMap(snippet => snippet.lines).map(line => line.text).join('');
                check(m.fullText === expected, 'Sizing selects coherent ' + CODE_SNIPPETS.cpp[index].id + ' content');
                const nodes = [...m.characterElements];
                type(m.fullText);
                check(navigations === 1 && m.testCompleted && m.charTyped === expected.length && m.correctCount === expected.length && !m.wrongCount,
                    CODE_SNIPPETS.cpp[index].id + ' ' + size + ' completes from typable text only');
                check(m.displayer.textContent === expected && nodes.every((node, i) => m.characterElements[i] === node), 'Whole-line chunks append with persistent character nodes');
                check(m.renderedCodeLine === m.codeLines.length, 'All selected code lines render');
            }
        }
        check(JSON.stringify(m.ultimate_lines) === legacyDataset, 'Legacy mixed dataset is retained intact');
        passed.push(`all ${CODE_SNIPPETS.cpp.length * 4} collection/size combinations, chunk loading, snippet transitions and retained legacy data`);

        Math.random = () => 0;
        for (const seconds of [15, 30, 60, 120]) {
            start('short', seconds);
            check(m.fullText.length >= Math.max(2000, seconds * 80) && m.currentTextIndex < m.fullText.length, 'Timed Code queues enough content and renders incrementally');
        }
        start('short', 15);
        type(m.fullText.slice(0, 350));
        const pausedIndex = m.userIndex;
        now += 8000;
        m.timeupdater();
        check(m.isPaused && m.userIndex === pausedIndex, 'Code AFK keeps the exact typable index');
        key(m.fullText[m.userIndex]);
        check(!m.isPaused && m.userIndex === pausedIndex + 1 && m.afkTime === 5000, 'Code resumes with the same key');
        while (!m.testCompleted) {
            now += 100;
            key(m.fullText[m.userIndex]);
        }
        const timed = JSON.parse(localStorage.getItem('dataPass'));
        check(timed.activeTypingTime === 15000 && timed.afkTime === 5000 && navigations === 1, 'Timed Code uses shared paused clock and completion');
        check(m.userIndex < m.fullText.length, 'Timed Code does not run out of snippets');
        passed.push('all timed lengths, continuous snippet typing, Code AFK and timed completion');

        for (const mode of ['relax', 'punctuation', 'number', 'arrow']) {
            m.constraintMode = 'word';
            m.selectedWordMode = 'short';
            m.timeBtn = false;
            m.buttonClick(mode);
            check(!m.codeLines && !m.displayer.querySelector('.code-line') && !m.displayer.classList.contains('code-mode'), mode + ' clears code metadata/layout');
            check(getComputedStyle(m.displayer).fontFamily === proseFont, mode + ' restores prose typography');
            check(!document.getElementById('word-counter').innerText.includes('chars'), mode + ' retains word counter');
            for (const character of m.fullText) {
                now += 10;
                key(Object.keys(m.specialKey).find(name => m.specialKey[name] === character) || character);
            }
            check(m.correctCount === m.fullText.length && m.testCompleted, mode + ' still types normally after Code');
        }
        passed.push('Code-to-prose switching preserves all other modes, fonts and counters');

        // Leave a representative, partially typed multiline exercise for resize/screenshot QA.
        start('large');
        type(m.fullText.slice(0, m.codeLines[0].text.length + m.codeLines[1].text.length));
        await settle();
        caretAligned();
        return passed;
    } finally {
        m.resetTestTiming();
        Date.now = originalNow;
        Math.random = originalRandom;
        document.removeEventListener('click', preventNavigation, true);
    }
};
