# TypeFast ⌨️

TypeFast is a modern, feature-rich typing practice web application designed to help you improve your typing speed and accuracy through customizable constraints, specialized typing modes, and detailed statistics tracking.

## 🚀 Features

- **Standardized Themes**: Clean and distraction-free UI with built-in Light and Dark themes.
- **Global Command Palette**: Press `Ctrl + Shift + P` from any page to instantly switch modes, themes, navigate pages, or change test constraints.
- **Decoupled Settings**: Freely mix and match any typing mode with any length constraint.
- **Detailed Statistics & History**: Tracks your WPM, accuracy, time taken, and provides actionable feedback on the exact characters you missed.
- **"Improve" Mode**: Intelligently generates practice strings specifically targeting the characters you frequently mistyped in past sessions.
- **Audio Feedback**: Optional auditory feedback on correct and incorrect keystrokes.

## ⚙️ Typing Modes
TypeFast isn't just about standard words. Train your fingers for real-world scenarios:
- **🍃 Relax**: Standard lowercase words.
- **@ Punctuation**: Words heavily mixed with assorted punctuation marks.
- **# Number**: Words intertwined with numeric digits.
- **&larr; Arrow**: Practice navigating with arrow keys.
- **&lt;/&gt; Code**: Snippets of actual programming code (C++, logic, etc.).

## ⏱️ Constraints
Set the boundaries of your typing test:
- **Time Limits**: `15s`, `30s`, `60s`, `120s`, or `Off`
- **Word Limits**: `Short`, `Medium`, `Large`, `X-Large`

## ⌨️ Keyboard Shortcuts
- `Ctrl + Shift + P`: Open Command Palette
- `Tab + Enter`: Instantly restart the current test
- `Ctrl + Enter`: Forcefully submit the test early and view your current stats (Dev shortcut)
- `Shift + Enter` (on Stats page): Instantly jump into 'Improve' mode based on your recent mistakes

## 🛠️ Tech Stack
- Vanilla HTML / CSS / JavaScript
- `localStorage` & `sessionStorage` for lightweight, persistent data tracking
