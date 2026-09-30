// Browser assertions run by typing-rendering.cjs using a controlled clock.
module.exports = function () {
    const passed = [];
    const check = (condition, message) => { if (!condition) throw new Error(message); };
    const originalNow = Date.now;
    let now = originalNow();
    Date.now = () => now;
    let navigations = 0;
    const preventNavigation = event => {
        if (event.target.closest('a[href="stats.html"]')) {
            event.preventDefault();
            navigations++;
        }
    };
    document.addEventListener('click', preventNavigation, true);
    const key = (value, options = {}) => document.body.dispatchEvent(new KeyboardEvent('keydown', {
        key: value, bubbles: true, cancelable: true, ...options
    }));
    function reset(text = 'hello world this is a typing test with enough characters to continue', timed = true) {
        m.resetTestTiming();
        Object.assign(m, { fullText: text, codeLines: null, userIndex: 0, charTyped: 0, correctCount: 0,
            wrongCount: 0, backspaceCount: 0, wrongChar: {}, selectedTime: 15,
            timeBtn: timed, totalWords: text.split(/\s+/).filter(Boolean).length });
        m.renderTypingText();
        navigations = 0;
    }
    function advance(milliseconds) {
        now += milliseconds;
        m.timeupdater();
    }
    function snapshot() {
        return JSON.stringify({ index: m.userIndex, text: m.displayer.innerHTML,
            correct: m.correctCount, wrong: m.wrongCount, wrongChar: m.wrongChar,
            typed: m.charTyped, backspace: m.backspaceCount,
            counter: document.getElementById('word-counter').innerText,
            caret: m.caret.style.transform, scroll: m.textLayer.style.transform });
    }
    try {
        reset();
        advance(6000);
        check(!m.testStarted && !m.isPaused, 'No AFK before first typing key');
        key('Shift'); key('Control'); key('Backspace');
        check(!m.testStarted, 'Modifiers and empty Backspace do not start clock');
        key('h'); key('x');
        const state = snapshot();
        const nodes = [...m.characterElements];
        advance(2999);
        check(!m.isPaused, 'No pause for ordinary gaps under 3 seconds');
        advance(1);
        check(m.isPaused && !document.getElementById('afk-status').hidden, 'Pause exactly at threshold');
        check(m.activeTypingTime === 3000, 'Three-second grace period counts as active time');
        check(document.getElementById('clock').innerText === '12s', 'Countdown freezes at threshold');
        advance(12000);
        check(snapshot() === state && nodes.every((node, index) => node === m.characterElements[index]), 'AFK preserves all text, state, counters, caret and node identities');
        check(document.getElementById('clock').innerText === '12s', 'Long AFK never ends the countdown');
        key('Shift'); key('Control'); key('c', { ctrlKey: true }); key('a', { metaKey: true }); key('Tab');
        check(m.isPaused && m.userIndex === 2, 'Non-typing keys and shortcuts do not resume');
        key('p', { ctrlKey: true, shiftKey: true });
        key('ArrowDown'); key('Escape');
        check(m.isPaused && !commandPalette.isOpen(), 'Command palette keeps test paused');
        key('l');
        check(!m.isPaused && m.userIndex === 3 && m.characterElements[2].classList.contains('correct'), 'Correct resume key is processed once');
        check(m.afkTime === 12000 && m.activeTypingTime === 3000, 'AFK duration is separate from active time');
        check(document.getElementById('afk-status').hidden, 'Pause indication clears on resume');
        passed.push('AFK threshold, grace period, preserved state, ignored shortcuts, correct resume input');

        // Simulate timer callbacks being delayed for an entire background-tab pause.
        now += 7000;
        key('#');
        check(m.afkTime === 16000 && m.userIndex === 4 && m.wrongChar.l === 1, 'Delayed AFK callback and wrong resume key');
        now += 6000;
        key('Backspace');
        check(m.afkTime === 19000 && m.userIndex === 3 && m.characterElements[3].className === 'char', 'Backspace resumes and restores previous character');
        check(m.wrongChar.l === 1, 'Backspace keeps historical errors');
        passed.push('repeated pauses, delayed callbacks, wrong-key and Backspace resume');

        advance(3000);
        advance(8000);
        const total = now - m.startTime;
        const active = m.activeTypingTime;
        const typed = m.charTyped;
        key('Enter', { ctrlKey: true });
        const stats = JSON.parse(localStorage.getItem('dataPass'));
        check(m.testCompleted && navigations === 1 && !m.isPaused, 'Submission while paused completes once');
        check(stats.afkTime === 27000 && stats.totalElapsedTime === total && stats.activeTypingTime === active, 'Stored timing includes unfinished AFK period');
        check(stats.activeTypingTime + stats.afkTime === stats.totalElapsedTime, 'Timing values reconcile');
        check(stats.wpm === Math.round(typed * 12000 / total), 'WPM uses total elapsed time, including AFK');
        const saved = localStorage.getItem('dataPass');
        advance(60000);
        key('x'); key('Enter', { ctrlKey: true });
        check(navigations === 1 && saved === localStorage.getItem('dataPass'), 'Completed tests ignore stale timers/keys');
        passed.push('paused submission, AFK statistics, total-time WPM, completion cleanup');

        reset('←→↑↓ ending', false);
        key('ArrowLeft');
        advance(7000);
        key('ArrowRight');
        check(!m.isPaused && m.userIndex === 2 && m.correctCount === 2 && m.afkTime === 4000, 'Arrow keys resume word mode');
        m.selectedTime = 0;
        advance(7000);
        key('ArrowUp');
        check(m.userIndex === 3 && !m.testCompleted && m.afkTime === 8000, 'Time Off supports AFK and resume');
        advance(4000);
        key('Enter');
        check(!m.isPaused && m.userIndex === 4 && m.wrongChar['↓'] === 1, 'Enter retains its typing behavior on resume');
        passed.push('word mode, Time Off, arrow keys, Enter resume');

        advance(6000);
        m.buttonClick('number');
        check(!m.isPaused && !m.testStarted && !m.testCompleted && m.afkTime === 0 && m.userIndex === 0 && m.charTyped === 0, 'Mode switch starts a clean test');
        advance(20000);
        check(!m.isPaused && !m.testCompleted, 'Old mode timers cannot pause/finish a new test');
        passed.push('mode changes clear paused state and timers');

        reset();
        key('h');
        for (let index = 0; index < 7; index++) {
            now += 2000;
            key(m.fullText[m.userIndex]);
        }
        const beforeExpiry = m.charTyped;
        // Expiry at 15s precedes the AFK deadline at 17s, even if both callbacks are late.
        now += 26000;
        key(m.fullText[m.userIndex]);
        const expired = JSON.parse(localStorage.getItem('dataPass'));
        check(m.testCompleted && navigations === 1 && m.charTyped === beforeExpiry, 'Late input cannot extend expired tests');
        check(expired.afkTime === 0 && expired.activeTypingTime === 15000 && expired.totalElapsedTime === 15000, 'Timer expiry wins when due before AFK');
        passed.push('continuous typing, exact expiry, delayed expiry/AFK ordering');
        return passed;
    } finally {
        m.resetTestTiming();
        Date.now = originalNow;
        document.removeEventListener('click', preventNavigation, true);
    }
};
