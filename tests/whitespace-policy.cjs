// Run with: node tests/whitespace-policy.cjs
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const context = vm.createContext({});
vm.runInContext(fs.readFileSync(path.join(__dirname, '../whitespace-policy.js'), 'utf8') +
    '\nglobalThis.policy = WhitespacePolicy; globalThis.InputState = CodeTypingState;', context);
vm.runInContext(fs.readFileSync(path.join(__dirname, '../code-snippets.js'), 'utf8') +
    '\nglobalThis.snippets = CODE_SNIPPETS.cpp;', context);
const { policy, InputState, snippets } = context;
const linesOf = source => source.split('\n').map(text => ({ indent: 0, text }));
function compact(source) {
    const lines = linesOf(source);
    const mask = policy.classify(lines);
    let offset = 0;
    return lines.map(line => [...line.text].filter(() => !mask[offset++]).join('')).join('\n');
}

const cases = [
    ['cout << x;', 'cout<<x;'], ['cout<<x;', 'cout<<x;'],
    ['x = 10;', 'x=10;'], ['x=10;', 'x=10;'], ['i < n', 'i<n'], ['i<n', 'i<n'],
    ['for (int i = 0; i < n; i++)', 'for(int i=0;i<n;i++)'],
    ['for (int i=0;i<n;i++)', 'for(int i=0;i<n;i++)'],
    ...['int value', 'long long value', 'unsigned int value', 'return value', 'const auto value', 'struct Node']
        .map(text => [text, text]),
    ['a + b', 'a+b'], ['a+b', 'a+b'], ['a + +b', 'a+ +b'], ['a - -b', 'a- -b'],
    ['x++ + y', 'x+++y'], ['x-- - y', 'x---y'], ['a / / b', 'a/ /b'],
    ['// hello world', '// hello world'], ['"Hello World"', '"Hello World"'], ["' '", "' '"],
    ['vector<int> nums', 'vector<int>nums'], ['vector <int> nums', 'vector<int>nums'],
    ['if (x)', 'if(x)'], ['if(x)', 'if(x)'], ['func (x)', 'func(x)'], ['func(x)', 'func(x)'],
    ['a && b', 'a&&b'], ['a&&b', 'a&&b'], ['a || b', 'a||b'], ['a||b', 'a||b'],
    ['x != y', 'x!=y'], ['x!=y', 'x!=y'], ['x <= y', 'x<=y'], ['x<=y', 'x<=y'],
    ['ptr -> value', 'ptr->value'], ['ptr->value', 'ptr->value'],
    ['std :: vector<int>', 'std::vector<int>'], ['std::vector<int>', 'std::vector<int>'],
    ['value += 10', 'value+=10'], ['cout << "Hello World";', 'cout<<"Hello World";'],
    ['x  =   10;', 'x=10;'], ['int  value', 'int  value'],
    ['cout << "hello  world";', 'cout<<"hello  world";'],
    ['cout << "say \\"hello world\\"";', 'cout<<"say \\"hello world\\"";'],
    ['char c = \' \';', 'char c=\' \';'], ['char c = \'\\\'\';', 'char c=\'\\\'\';'],
    ['x = 1; // hello world\nx = 2;', 'x=1;// hello world\nx=2;'],
    ['a /* hello  world */ + b', 'a/* hello  world */+b'],
    ['x = 1; /* hello\nworld goes here */ x = 2;', 'x=1;/* hello\nworld goes here */x=2;'],
    ['cout << R"tag(hello " world)tag";', 'cout<<R"tag(hello " world)tag";'],
    ['auto s = u8R"(hello\n  world)";', 'auto s=u8R"(hello\n  world)";'],
    ['auto s = L"hello world";', 'auto s=L"hello world";'],
    ['L "hello world"', 'L "hello world"'], ['u8 "hello"', 'u8 "hello"'],
    ['"x" _suffix', '"x" _suffix'], ["'x' _suffix", "'x' _suffix"],
    ['1 e3', '1 e3'], ['1 .0', '1 .0'], ['. 5', '. 5'], ['0xE + foo', '0xE +foo'],
    ['1e + 2', '1e +2'], ['12 ULL', '12 ULL'], ["1 '0'", "1 '0'"],
    ["int x = 1'000;", "int x=1'000;"], ['x = 1.5e+2;', 'x=1.5e+2;'],
    ['. . .', '. . .'], ['. ..', '. ..'], ['.. .', '.. .'],
    ['  x = 1;  ', '  x=1;  '], ['x\t=\t1;', 'x=1;']
];
for (const [source, expected] of cases) assert.equal(compact(source), expected, source);
console.log(`PASS ${cases.length} spacing, exact-content, numeric and literal cases`);

const mergingPairs = [
    ['+', '+'], ['-', '-'], ['/', '/'], ['/', '*'], ['*', '/'], ['<', '<'], ['>', '>'],
    ['<', '='], ['>', '='], ['=', '='], ['!', '='], ['&', '&'], ['|', '|'], ['+', '='],
    ['-', '='], ['*', '='], ['/', '='], ['%', '='], ['&', '='], ['|', '='], ['^', '='],
    ['-', '>'], [':', ':'], ['.', '*'], ['->', '*'], ['<', ':'], [':', '>'],
    ['<', '%'], ['%', '>'], ['%', ':'], ['#', '#'], ['<<', '='], ['>>', '='],
    ['<', '=>'], ['<=', '>'], ['[', ':'], [':', ']']
];
for (const [left, right] of mergingPairs) {
    const text = `${left} ${right}`;
    assert.equal(policy.classify(linesOf(text))[left.length], 0, `Keep boundary in ${text}`);
}
console.log(`PASS ${mergingPairs.length} operator/comment/digraph token-merging boundaries`);

for (const source of [
    '#define F (x) x + 1', '#include <a b>', '%:define F (x) x',
    'import <a b>;\nx = 1;', 'export module foo;\nx = 1;',
    'int café = 1;', 'x = @ y;', '"unterminated string', '/* unterminated comment',
    'R"bad(unterminated raw string', '// continued \\\nx = 1;',
    'x = \\\n1;', 'x = \\u1234;'
]) {
    assert.equal(compact(source), source, 'Uncertain source stays exact: ' + source);
}
assert.equal(policy.classify(linesOf('x = 1'), 'unimplemented').some(Boolean), false);
console.log('PASS conservative fallback for preprocessing, splices, unknown and incomplete syntax');

const signature = source => JSON.stringify(policy.languages.cpp.tokenize(source)
    .filter(token => !['space', 'newline'].includes(token.kind)).map(token => [token.kind, token.text]));
let seed = 42;
function random() { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed / 2 ** 32; }
for (const snippet of snippets.flatMap(collection => collection.snippets)) {
    const source = snippet.lines.map(line => line.text).join('\n');
    const mask = policy.classify(snippet.lines);
    assert.equal(mask.length, snippet.lines.reduce((n, line) => n + line.text.length, 0));
    for (let sample = 0; sample < 8; sample++) {
        let index = 0;
        const input = snippet.lines.map(line => [...line.text].filter(character => {
            const optional = mask[index++];
            if (optional) assert.equal(character, ' ');
            return !optional || (sample > 0 && random() < 0.5);
        }).join('')).join('\n');
        assert.equal(signature(input), signature(source), 'Optional subsets preserve dataset tokenization');
    }
}
console.log('PASS all 132 snippets preserve tokens with all/sampled subsets of optional spaces removed');

const text = 'cout << x;';
const state = new InputState(policy.classify(linesOf(text)));
let index = 0;
const type = key => { index = state.forwardIndex(text, index, key) + 1; };
for (const key of 'cout<') type(key);
assert.equal(index, 6);
assert.equal(state.skippedCount(index), 1);
index = state.backspaceIndex();
assert.equal(index, 5, 'Undo accepted character, leaving skipped space untouched');
type('<');
index = state.backspaceIndex();
index = state.backspaceIndex();
assert.equal(index, 3, 'Repeated Backspace bypasses the untyped space');
assert.equal(state.skippedCount(index), 0);
type('t'); type(' '); type('<');
index = state.backspaceIndex();
index = state.backspaceIndex();
assert.equal(index, 4, 'Explicitly typed space remains editable');
const mismatch = new InputState(policy.classify(linesOf(text)));
assert.equal(mismatch.forwardIndex(text, 4, 'z'), 4, 'Wrong key never silently skips a space');
assert.equal(mismatch.forwardIndex(text, 4, 'Enter'), 4, 'Enter is not a whitespace shortcut');
assert.equal(mismatch.forwardIndex(text, 4, ' '), 4, 'Matching space is typed normally');
console.log('PASS physical-input history, retyping, wrong-key handling and Backspace');
