class CommandPalette {
    constructor() {
        this.commands = [
            // Themes
            { name: "Theme: Light", action: () => this.setTheme("light") },
            { name: "Theme: Dark", action: () => this.setTheme("dark") },
            { name: "Theme: System Default", action: () => this.setTheme("") },
            
            // Navigation
            { name: "Navigate: Home", action: () => { window.location.href = "home.html"; } },
            { name: "Navigate: Stats & History", action: () => { window.location.href = "stats.html"; } },
            { name: "Navigate: Help & Privacy", action: () => { window.location.href = "help-and-support.html"; } },
            { name: "Action: Restart Test", action: () => { window.location.href = "index.html"; } },

            // Modes
            { name: "Mode: Punctuation", action: () => this.setTestMode("punctuation") },
            { name: "Mode: Arrow", action: () => this.setTestMode("arrow") },
            { name: "Mode: Relax", action: () => this.setTestMode("relax") },
            { name: "Mode: Number", action: () => this.setTestMode("number") },
            { name: "Mode: Code", action: () => this.setTestMode("code") },

            // Time Constraints
            { name: "Time: 15s", action: () => this.setConstraint("time", 15) },
            { name: "Time: 30s", action: () => this.setConstraint("time", 30) },
            { name: "Time: 60s", action: () => this.setConstraint("time", 60) },
            { name: "Time: 120s", action: () => this.setConstraint("time", 120) },
            { name: "Time: Off", action: () => this.setConstraint("time", 0) },

            // Word Constraints
            { name: "Word: Short", action: () => this.setConstraint("word", "short") },
            { name: "Word: Medium", action: () => this.setConstraint("word", "medium") },
            { name: "Word: Large", action: () => this.setConstraint("word", "large") },
            { name: "Word: X-Large", action: () => this.setConstraint("word", "xlarge") }
        ];
        
        this.filteredCommands = [...this.commands];
        this.selectedIndex = 0;
        this.tabPressed = sessionStorage.getItem("tabPressed") === "true";
        
        this.buildUI();
        this.bindEvents();
        this.applyTheme();
    }

    buildUI() {
        if (document.getElementById("command-palette-overlay")) return;

        const overlay = document.createElement("div");
        overlay.id = "command-palette-overlay";
        
        const palette = document.createElement("div");
        palette.id = "command-palette";
        
        const input = document.createElement("input");
        input.id = "command-palette-input";
        input.type = "text";
        input.placeholder = "Type a command...";
        input.autocomplete = "off";
        input.setAttribute("autocorrect", "off");
        input.setAttribute("autocapitalize", "off");
        input.setAttribute("spellcheck", "false");
        
        const results = document.createElement("ul");
        results.id = "command-palette-results";
        
        palette.appendChild(input);
        palette.appendChild(results);
        overlay.appendChild(palette);
        document.body.appendChild(overlay);

        this.overlay = overlay;
        this.input = input;
        this.results = results;
    }

    bindEvents() {
        document.addEventListener("keydown", (e) => {
            if (this.isOpen()) {
                e.stopImmediatePropagation();
                if (e.key === "Escape") {
                    e.preventDefault();
                    this.close();
                } else if (e.key === "ArrowDown") {
                    e.preventDefault();
                    this.selectedIndex = Math.min(this.selectedIndex + 1, this.filteredCommands.length - 1);
                    this.updateSelection();
                } else if (e.key === "ArrowUp") {
                    e.preventDefault();
                    this.selectedIndex = Math.max(this.selectedIndex - 1, 0);
                    this.updateSelection();
                } else if (e.key === "Enter") {
                    e.preventDefault();
                    this.ignoreNextKeyup = "Enter";
                    this.executeCommand();
                }
                return; // Stop any further palette shortcuts when open
            }

            // Open on Ctrl+Shift+P
            if (e.ctrlKey && e.shiftKey && (e.key.toLowerCase() === "p")) {
                e.preventDefault();
                e.stopImmediatePropagation();
                this.ignoreNextKeyup = "p";
                this.toggle();
                return;
            }
            
            // Tab + Enter to restart
            if (e.key === "Tab") {
                this.tabPressed = true;
                sessionStorage.setItem("tabPressed", "true");
                e.preventDefault(); // Stop focus jumping
                return;
            } else if (e.key === "Enter" && this.tabPressed) {
                e.preventDefault();
                e.stopImmediatePropagation();
                this.ignoreNextKeyup = "Enter";
                window.location.href = "index.html"; 
                return;
            } else if (e.key !== "Shift" && e.key !== "Control" && e.key !== "Alt") {
                // If they press a normal typing key, reset the Tab sequence.
                this.tabPressed = false;
                sessionStorage.removeItem("tabPressed");
            }
        }, { capture: true });

        document.addEventListener("keyup", (e) => {
            if (this.isOpen()) {
                e.stopImmediatePropagation();
            } else if (this.ignoreNextKeyup === e.key || (this.ignoreNextKeyup === "p" && e.key.toLowerCase() === "p")) {
                e.stopImmediatePropagation();
                this.ignoreNextKeyup = null;
            }
        }, { capture: true });

        this.input.addEventListener("input", () => {
            const val = this.input.value.toLowerCase();
            this.filteredCommands = this.commands.filter(c => c.name.toLowerCase().includes(val));
            this.selectedIndex = 0;
            this.renderResults();
        });

        this.overlay.addEventListener("click", (e) => {
            if (e.target === this.overlay) this.close();
        });
    }

    toggle() {
        if (this.isOpen()) this.close();
        else this.open();
    }

    isOpen() {
        return this.overlay.style.display === "flex";
    }

    open() {
        this.overlay.style.display = "flex";
        this.input.value = "";
        this.filteredCommands = [...this.commands];
        this.selectedIndex = 0;
        this.renderResults();
        this.input.focus();
    }

    close() {
        this.overlay.style.display = "none";
    }

    renderResults() {
        this.results.innerHTML = "";
        this.filteredCommands.forEach((cmd, idx) => {
            const li = document.createElement("li");
            li.innerText = cmd.name;
            if (idx === this.selectedIndex) {
                li.classList.add("active");
            }
            li.addEventListener("mouseenter", () => {
                if (this.selectedIndex !== idx) {
                    this.selectedIndex = idx;
                    this.updateSelection();
                }
            });
            li.addEventListener("click", (e) => {
                e.preventDefault();
                e.stopImmediatePropagation();
                this.executeCommand();
            });
            this.results.appendChild(li);
        });
        this.updateSelection();
    }

    updateSelection() {
        const items = this.results.querySelectorAll("li");
        items.forEach((li, idx) => {
            if (idx === this.selectedIndex) {
                li.classList.add("active");
                li.scrollIntoView({ block: "nearest" });
            } else {
                li.classList.remove("active");
            }
        });
    }

    executeCommand() {
        if (this.filteredCommands.length > 0 && this.filteredCommands[this.selectedIndex]) {
            this.filteredCommands[this.selectedIndex].action();
            this.close();
        }
    }

    setTestMode(mode) {
        localStorage.setItem("mode", mode);
        window.location.href = "index.html";
    }

    setConstraint(type, val) {
        localStorage.setItem("constraintMode", type);
        if (type === "time") {
            localStorage.setItem("selectedTime", val);
        } else if (type === "word") {
            localStorage.setItem("selectedWordMode", val);
        }
        window.location.href = "index.html";
    }

    setTheme(theme) {
        localStorage.setItem("selectedTheme", theme);
        this.applyTheme();
    }

    applyTheme() {
        let theme = localStorage.getItem("selectedTheme") || "";
        document.documentElement.classList.remove("theme-light", "theme-dark");
        if (theme === "light") {
            document.documentElement.classList.add("theme-light");
        } else if (theme === "dark") {
            document.documentElement.classList.add("theme-dark");
        }
    }
}

// Initialize palette
function initPalette() {
    if (!window.commandPalette) {
        window.commandPalette = new CommandPalette();
    }
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initPalette);
} else {
    initPalette();
}

