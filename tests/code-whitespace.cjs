// Browser regressions invoked by typing-rendering.cjs.
module.exports = async function () {
    const passed = [];
    const check = (condition, message) => { if (!condition) throw new Error(message); };
    const originalNow = Date.now;
    const originalRandom = Math.random;
    const originalSound = m.playSound;
    let now = originalNow();
    Date.now = () => now;
    let navigations = 0;
    let sounds = [];
    m.playSound = sound => sounds.push(sound);
    const preventNavigation = event => {
        if (event.target.closest('a[href="stats.html"]')) { event.preventDefault(); navigations++; }
    };
    document.addEventListener('click', preventNavigation, true);
    const key = (value, elapsed = 10) => {
        now += elapsed;
        document.body.dispatchEvent(new KeyboardEvent('keydown', { key: value, bubbles: true, cancelable: true }));
    };
    const type = text => { for (const character of text) key(character); };
    const settle = () => new Promise(resolve => setTimeout(resolve, 260));
    const stats = () => JSON.parse(localStorage.getItem('dataPass'));
    function reset(source, code = true) {
        m.resetTestTiming();
        Object.assign(m, { userIndex: 0, charTyped: 0, correctCount: 0, wrongCount: 0,
            backspaceCount: 0, wrongChar: {}, timeBtn: false, selectedTime: 0,
            codeLines: code ? source.split('\n').map((text, i) => ({ indent: i % 2, text })) : null });
        m.fullText = code ? m.codeLines.map(line => line.text).join('') : source;
        m.totalWords = m.fullText.split(/\s+/).filter(Boolean).length;
        m.renderTypingText();
        m.updateWordCounter();
        navigations = 0;
        sounds = [];
    }
    const compact = () => [...m.fullText].filter((_, i) => !m.codeTyping.optionalSpaces[i]).join('');
    function cleanCompletion(input) {
        const text = m.fullText;
        const nodes = [...m.characterElements];
        type(input);
        check(navigations === 1 && m.testCompleted && m.userIndex === text.length, 'Compact input completes exactly once');
        check(m.charTyped === input.length && m.correctCount === input.length && !m.wrongCount, 'Only physical keys affect typing totals');
        check(sounds.length === input.length && sounds.every(sound => sound === m.correctSound), 'No extra or wrong feedback for skips');
        check(m.displayer.textContent === text && nodes.every((node, i) => node === m.characterElements[i]), 'Canonical text and character nodes are immutable');
        const result = stats();
        check(result.accuracy === 100 && result.extra === 0 && result.wrong_list === '{}', 'Skipped formatting has no accuracy/error/extra penalty');
        check(result.correct === input.length && result.wpm === Math.round(input.length * 12000 / result.totalElapsedTime), 'Stored statistics use actual input');
        check(document.getElementById('word-counter').innerText === `${text.length} / ${text.length} chars`, 'Display progress still reaches its full length');
    }
    function caretAligned() {
        const character = m.characterElements[m.userIndex].getBoundingClientRect();
        const caret = m.caret.getBoundingClientRect();
        const viewport = document.getElementById('displayer-container').getBoundingClientRect();
        check(Math.abs(character.left - caret.left) < 1, 'Caret aligns with actual rendered target');
        check(Math.abs((character.top + character.height / 2) - (caret.top + caret.height / 2)) < 5, 'Caret aligns vertically');
        check(caret.top >= viewport.top && caret.bottom <= viewport.bottom, 'Caret stays visible');
    }
    function start(size, seconds = 0) {
        m.constraintMode = seconds ? 'time' : 'word';
        m.selectedWordMode = size;
        m.selectedTime = seconds;
        m.timeBtn = seconds > 0;
        m.buttonClick('code');
        navigations = 0;
        sounds = [];
    }
    try {
        for (const input of ['cout << "Hello World";', 'cout<<"Hello World";', 'cout <<"Hello World";']) {
            reset('cout << "Hello World";');
            cleanCompletion(input);
        }
        reset('for (int i = 0; i < n; i++) {\ncout << nums[i];\n}');
        cleanCompletion('for(int i=0;i<n;i++){cout<<nums[i];}');
        reset('cout  <<   value;');
        cleanCompletion('cout <<value;');
        passed.push('canonical, compact and mixed spacing; neutral skips, physical-key WPM/accuracy and completion');

        for (const source of ['int value;', 'long long value;', 'return value;', '"Hello World"',
            '"hello  world"', "' '", '// hello world', '/* hello world */', 'R"(hello world)"']) {
            reset(source);
            const space = source.indexOf(' ');
            type(source.slice(0, space));
            key(source.slice(space).trimStart()[0]);
            check(m.userIndex === space + 1 && m.characterElements[space].classList.contains('wrong') &&
                m.wrongChar[' '] === 1, 'Required content space remains exact: ' + source);
        }
        reset('a + +b;');
        type('a+');
        key('+');
        check(m.userIndex === 4 && m.wrongCount === 1 && m.wrongChar[' '] === 1, 'Unsafe operator merge is rejected');
        reset('x = 10;');
        type('xz');
        check(m.userIndex === 2 && m.characterElements[1].classList.contains('wrong') && m.wrongChar[' '] === 1,
            'Unmatched key at optional space keeps existing error attribution');
        key('Backspace'); key('=');
        check(m.userIndex === 3 && !m.characterElements[1].classList.contains('wrong') && m.wrongCount === 1,
            'Correction can skip the space without erasing the recorded mistake');
        reset('x=10;');
        type('x ');
        check(m.wrongCount === 1 && m.wrongChar['='] === 1, 'Additional undisplayed spaces are still wrong');
        passed.push('required spaces, exact strings/chars/comments, unsafe merges, wrong-space corrections and extra-space rejection');

        reset('cout << value;');
        await settle();
        const space = m.characterElements[4];
        const bounds = space.getBoundingClientRect();
        const nodes = [...m.characterElements];
        type('cout<');
        await settle();
        caretAligned();
        check(m.userIndex === 6 && m.charTyped === 5 && m.correctCount === 5 && space.className === 'char space',
            'Skipped space stays visually neutral and is not counted as typed');
        check(space.getBoundingClientRect().left === bounds.left && space.getBoundingClientRect().width === bounds.width,
            'Skipping does not reflow displayed text');
        key('Backspace');
        await settle();
        caretAligned();
        check(m.userIndex === 5 && !m.characterElements[5].classList.contains('correct'), 'Backspace returns directly before accepted <');
        key('<'); key('Backspace'); key('Backspace');
        check(m.userIndex === 3 && space.className === 'char space', 'Repeated Backspace bypasses an untyped space');
        type('t <'); key('Backspace'); key('Backspace');
        check(m.userIndex === 4 && !space.classList.contains('correct'), 'Explicitly typed space can be undone');
        type('<<v'); key('Backspace');
        check(m.userIndex === 8, 'Multiple skip/undo cycles retain the right character history');
        check(nodes.every((node, i) => node === m.characterElements[i]), 'Backspace preserves persistent DOM nodes');
        while (m.userIndex > 0) key('Backspace');
        key('Backspace');
        check(m.userIndex === 0, 'History exhaustion and empty Backspace stay safe');
        passed.push('smooth caret and immutable spacing, repeated Backspace, retyping and explicitly typed spaces');

        reset(Array(80).fill('cout << value;').join('\n\n'));
        const firstNodes = [...m.characterElements];
        const input = compact();
        type(input.slice(0, 350));
        await settle();
        caretAligned();
        check(m.userIndex > 350 && m.charTyped === 350 && m.currentTextIndex > 250 &&
            firstNodes.every((node, i) => node === m.characterElements[i]), 'Skips work through whole-line chunk loading and blank lines');
        for (let i = 0; i < 30; i++) key('Backspace');
        await settle();
        caretAligned();
        passed.push('optional spacing across visual lines, blank separators, lazy chunks and backward scrolling');

        for (let index = 0; index < CODE_SNIPPETS.cpp.length; index++) {
            Math.random = () => (index + 0.1) / CODE_SNIPPETS.cpp.length;
            for (const size of ['short', 'medium', 'large', 'xlarge']) {
                start(size);
                cleanCompletion(compact());
            }
        }
        m.constraintMode = 'time'; m.selectedTime = 0; m.timeBtn = false; m.buttonClick('code');
        navigations = 0; sounds = [];
        cleanCompletion(compact());
        passed.push('all 176 collection/size combinations and Time Off complete with optional spaces omitted');

        Math.random = () => 0;
        for (const seconds of [15, 30, 60, 120]) {
            start('short', seconds);
            const count = 350;
            type(compact().slice(0, count));
            check(m.charTyped === count && m.correctCount === count && !m.wrongCount && !m.testCompleted,
                'Timed ' + seconds + 's Code accepts compact input across snippets');
        }
        start('short', 15);
        while (!m.codeTyping.optionalSpaces[m.userIndex]) key(m.fullText[m.userIndex]);
        const pausedIndex = m.userIndex;
        const typed = m.charTyped;
        now += 8000;
        m.timeupdater();
        check(m.isPaused && m.userIndex === pausedIndex, 'AFK keeps optional-space display position');
        let next = pausedIndex;
        while (m.codeTyping.optionalSpaces[next]) next++;
        key(m.fullText[next], 0);
        check(!m.isPaused && m.userIndex === next + 1 && m.charTyped === typed + 1 && m.afkTime === 5000,
            'Same resume key skips optional space once without affecting AFK accounting');
        while (!m.testCompleted) {
            next = m.userIndex;
            while (m.codeTyping.optionalSpaces[next]) next++;
            key(m.fullText[next], 200);
        }
        check(navigations === 1 && stats().activeTypingTime === 15000 && stats().afkTime === 5000 &&
            stats().accuracy === 100 && stats().correct === m.charTyped && m.userIndex < m.fullText.length,
            'Timed completion retains countdown, actual-input accuracy and AFK statistics');
        passed.push('all timed lengths, continuous snippets, same-key AFK resume and timed completion with skips');

        for (const mode of ['relax', 'punctuation', 'number', 'arrow']) {
            m.buttonClick(mode);
            reset('a b', false);
            type('ab');
            check(m.codeTyping === null && m.userIndex === 2 && m.wrongCount === 1 && m.wrongChar[' '] === 1,
                mode + ' retains exact matching after leaving Code');
        }
        passed.push('Relax, Punctuation, Number and Arrow still require their displayed spaces');
        return passed;
    } finally {
        m.resetTestTiming();
        m.playSound = originalSound;
        Date.now = originalNow;
        Math.random = originalRandom;
        document.removeEventListener('click', preventNavigation, true);
    }
};
