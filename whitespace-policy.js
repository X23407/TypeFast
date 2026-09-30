// Horizontal spacing only. Line breaks are used for lexing, never for typing.
const WhitespacePolicy = (() => {
    const cppOperators = [
        "%:%:", ">>=", "<<=", "->*", "...", "<=>", "++", "--", "->", ".*",
        "<<", ">>", "<=", ">=", "==", "!=", "&&", "||", "+=", "-=", "*=", "/=",
        "%=", "&=", "|=", "^=", "::", "##", "<:", ":>", "<%", "%>", "%:", "[:", ":]",
        ..."{}[]();:?~!+-*/%^&|=<>.,#"
    ].sort((a, b) => b.length - a.length);

    // Small conservative lexer, not a C++ parser. Literal/comment tokens include
    // their contents so the shared policy can never make those spaces optional.
    function tokenizeCpp(source) {
        const tokens = [];
        let index = 0;
        const add = (kind, end) => {
            tokens.push({ kind, start: index, end, text: source.slice(index, end) });
            index = end;
        };
        while (index < source.length) {
            const rest = source.slice(index);
            const space = /^[ \t]+/.exec(rest);
            if (space) { add("space", index + space[0].length); continue; }
            if (rest[0] === "\n") { add("newline", index + 1); continue; }
            if (rest.startsWith("//")) {
                const end = source.indexOf("\n", index);
                add("comment", end < 0 ? source.length : end);
                continue;
            }
            if (rest.startsWith("/*")) {
                const end = source.indexOf("*/", index + 2);
                add(end < 0 ? "unknown" : "comment", end < 0 ? source.length : end + 2);
                continue;
            }

            const raw = /^(?:u8|[uUL])?R"/.exec(rest);
            const quoted = /^(?:u8|[uUL])?(["'])/.exec(rest);
            if (raw || quoted) {
                let end;
                if (raw) {
                    const opening = /^(?:u8|[uUL])?R"([^\s()\\]{0,16})\(/.exec(rest);
                    if (opening) {
                        const closing = ")" + opening[1] + '"';
                        const close = source.indexOf(closing, index + opening[0].length);
                        if (close >= 0) end = close + closing.length;
                    }
                } else {
                    for (let cursor = index + quoted[0].length; cursor < source.length; cursor++) {
                        if (source[cursor] === "\n") break;
                        if (source[cursor] === "\\") { cursor++; continue; }
                        if (source[cursor] === quoted[1]) { end = cursor + 1; break; }
                    }
                }
                if (end === undefined) { add("unknown", source.length); continue; }
                // Removing a space before a literal suffix would merge tokens.
                const suffix = /^[A-Za-z_][A-Za-z_0-9]*/.exec(source.slice(end));
                add("literal", end + (suffix ? suffix[0].length : 0));
                continue;
            }
            const identifier = /^[A-Za-z_][A-Za-z_0-9]*/.exec(rest);
            if (identifier) { add("identifier", index + identifier[0].length); continue; }
            // Preprocessing numbers include exponent signs and digit separators.
            const number = /^(?:\.[0-9]|[0-9])(?:[eEpP][+-]|[A-Za-z_0-9.]|'[A-Za-z_0-9])*/.exec(rest);
            if (number) { add("number", index + number[0].length); continue; }
            const operator = cppOperators.find(value => rest.startsWith(value));
            add(operator ? "operator" : "unknown", index + (operator ? operator.length : 1));
        }
        return tokens;
    }

    const languages = {
        cpp: {
            tokenize: tokenizeCpp,
            canClassify(source, tokens) {
                // Directives, contextual headers, line splicing and unfamiliar
                // syntax stay exact rather than guessing at preprocessing rules.
                return !/\\[ \t]*\n/.test(source) && !tokens.some(token =>
                    token.kind === "unknown" ||
                    (token.kind === "operator" && ["#", "##", "%:", "%:%:"].includes(token.text)) ||
                    (token.kind === "identifier" && ["import", "module", "__has_include", "__has_embed"].includes(token.text)));
            },
            canJoin(left, right) {
                // Two dots alone do not form a token, but three skipped gaps
                // could create an ellipsis. Also keep comment terminators apart.
                return !(left.text.endsWith(".") && right.text.startsWith(".")) &&
                    !(left.text.endsWith("*") && right.text.startsWith("/"));
            }
        }
    };

    function classify(lines, language = "cpp") {
        const source = lines.map(line => line.text).join("\n");
        const optional = new Uint8Array(source.length);
        const policy = languages[language];
        const tokens = policy ? policy.tokenize(source) : [];
        if (policy && policy.canClassify(source, tokens)) {
            for (let index = 1; index < tokens.length - 1; index++) {
                const gap = tokens[index];
                const left = tokens[index - 1];
                const right = tokens[index + 1];
                // Leading/trailing whitespace is not inline formatting. Never
                // join across a visual line or examine the inside of a literal.
                if (gap.kind !== "space" || left.kind === "newline" || right.kind === "newline") continue;
                if (policy.canJoin && !policy.canJoin(left, right)) continue;
                const joined = policy.tokenize(left.text + right.text);
                if (joined.length === 2 && joined[0].kind === left.kind && joined[0].text === left.text &&
                    joined[1].kind === right.kind && joined[1].text === right.text) {
                    optional.fill(1, gap.start, gap.end);
                }
            }
        }
        // Map source offsets back to the existing flattened display indices.
        const result = new Uint8Array(lines.reduce((sum, line) => sum + line.text.length, 0));
        let sourceOffset = 0;
        let displayOffset = 0;
        for (const line of lines) {
            result.set(optional.subarray(sourceOffset, sourceOffset + line.text.length), displayOffset);
            sourceOffset += line.text.length + 1;
            displayOffset += line.text.length;
        }
        return result;
    }

    return { classify, languages };
})();

// Tracks actual input positions, independently of immutable displayed formatting.
// This contains no language rules and can reuse any horizontal-whitespace mask.
class CodeTypingState {
    constructor(optionalSpaces) {
        this.optionalSpaces = optionalSpaces;
        this.history = [];
    }

    forwardIndex(text, index, key) {
        if (index >= text.length) return index;
        if (key.length === 1 && key !== text[index]) {
            let next = index;
            while (this.optionalSpaces[next]) next++;
            // A mismatch still belongs to the original expected character.
            if (text[next] === key) index = next;
        }
        this.history.push(index);
        return index;
    }

    backspaceIndex() {
        return this.history.pop();
    }

    skippedCount(index) {
        return index - this.history.length;
    }
}
