// Each tuple is [visual indent level, typable text]. No tabs/newlines enter typing data.
// A collection's snippets can be practiced separately or in order as a longer exercise.
const CODE_SNIPPETS = (() => {
    const snippet = (size, lines) => ({
        size,
        lines: lines.map(([indent, text]) => ({ indent, text }))
    });
    return {
        cpp: [
            {
                id: "vectors",
                snippets: [
                    snippet("short", [
                        [0, "vector<int> nums(5);"],
                        [0, "for (int &value : nums) {"],
                        [1, "cin >> value;"],
                        [0, "}"]
                    ]),
                    snippet("medium", [
                        [0, "sort(nums.begin(), nums.end());"],
                        [0, ""],
                        [0, "int total = 0;"],
                        [0, "for (int value : nums) {"],
                        [1, "total += value;"],
                        [0, "}"],
                        [0, ""],
                        [0, "cout << total << '\\n';"]
                    ]),
                    snippet("large", [
                        [0, "vector<int> prefix(nums.size() + 1, 0);"],
                        [0, "for (size_t i = 0; i < nums.size(); ++i) {"],
                        [1, "prefix[i + 1] = prefix[i] + nums[i];"],
                        [0, "}"],
                        [0, ""],
                        [0, "int left = 1;"],
                        [0, "int right = 3;"],
                        [0, "if (left <= right) {"],
                        [1, "int sum = prefix[right + 1];"],
                        [1, "sum -= prefix[left];"],
                        [1, "cout << sum << '\\n';"],
                        [0, "}"]
                    ])
                ]
            },
            {
                id: "strings",
                snippets: [
                    snippet("short", [
                        [0, "string text;"],
                        [0, "getline(cin, text);"],
                        [0, "cout << text.size() << '\\n';"]
                    ]),
                    snippet("medium", [
                        [0, "string cleaned = text;"],
                        [0, "for (char &ch : cleaned) {"],
                        [1, "if (ch == ' ' || ch == '\\t') {"],
                        [2, "ch = '_';"],
                        [1, "}"],
                        [0, "}"],
                        [0, "cout << cleaned << '\\n';"]
                    ]),
                    snippet("large", [
                        [0, "map<char, int> frequency;"],
                        [0, "for (char ch : cleaned) {"],
                        [1, "if (ch >= 'a' && ch <= 'z') {"],
                        [2, "++frequency[ch];"],
                        [1, "}"],
                        [0, "}"],
                        [0, ""],
                        [0, "for (const auto &entry : frequency) {"],
                        [1, "cout << entry.first << \": \";"],
                        [1, "cout << entry.second << '\\n';"],
                        [0, "}"]
                    ])
                ]
            },
            {
                id: "maps",
                snippets: [
                    snippet("short", [
                        [0, "map<string, int> counts;"],
                        [0, "for (const string &name : names) {"],
                        [1, "++counts[name];"],
                        [0, "}"]
                    ]),
                    snippet("medium", [
                        [0, "auto it = counts.find(\"Ada\");"],
                        [0, "if (it != counts.end()) {"],
                        [1, "cout << it->second << '\\n';"],
                        [0, "} else {"],
                        [1, "cout << 0 << '\\n';"],
                        [0, "}"],
                        [0, "cout << counts.size() << '\\n';"]
                    ]),
                    snippet("large", [
                        [0, "vector<string> repeated;"],
                        [0, "for (const auto &entry : counts) {"],
                        [1, "if (entry.second > 1) {"],
                        [2, "repeated.push_back(entry.first);"],
                        [1, "}"],
                        [0, "}"],
                        [0, ""],
                        [0, "sort(repeated.begin(), repeated.end());"],
                        [0, "for (const string &name : repeated) {"],
                        [1, "cout << name << '\\n';"],
                        [0, "}"]
                    ])
                ]
            },
            {
                id: "points",
                snippets: [
                    snippet("short", [
                        [0, "int squared(int value) {"],
                        [1, "return value * value;"],
                        [0, "}"]
                    ]),
                    snippet("medium", [
                        [0, "struct Point {"],
                        [1, "int x = 0;"],
                        [1, "int y = 0;"],
                        [0, ""],
                        [1, "void move(int dx, int dy) {"],
                        [2, "x += dx;"],
                        [2, "y += dy;"],
                        [1, "}"],
                        [0, "};"]
                    ]),
                    snippet("large", [
                        [0, "Point point{3, 4};"],
                        [0, "Point *ptr = &point;"],
                        [0, "ptr->move(1, -1);"],
                        [0, "int radius = squared(ptr->x);"],
                        [0, "radius += squared(ptr->y);"],
                        [0, ""],
                        [0, "vector<Point> points = {point, {1, 2}};"],
                        [0, "sort("],
                        [1, "points.begin(), points.end(),"],
                        [1, "[](const Point &a, const Point &b) {"],
                        [2, "return a.x < b.x;"],
                        [1, "}"],
                        [0, ");"]
                    ])
                ]
            },
            {
                id: "search",
                snippets: [
                    snippet("short", [
                        [0, "sort(nums.begin(), nums.end());"],
                        [0, "auto first = lower_bound("],
                        [1, "nums.begin(), nums.end(), target"],
                        [0, ");"]
                    ]),
                    snippet("medium", [
                        [0, "if (first != nums.end()) {"],
                        [1, "int index = first - nums.begin();"],
                        [1, "cout << index << '\\n';"],
                        [1, "cout << *first << '\\n';"],
                        [0, "} else {"],
                        [1, "cout << \"not found\\n\";"],
                        [0, "}"]
                    ]),
                    snippet("large", [
                        [0, "int low = 0;"],
                        [0, "int high = static_cast<int>(nums.size());"],
                        [0, ""],
                        [0, "while (low < high) {"],
                        [1, "int mid = low + (high - low) / 2;"],
                        [1, "if (nums[mid] < target) {"],
                        [2, "low = mid + 1;"],
                        [1, "} else {"],
                        [2, "high = mid;"],
                        [1, "}"],
                        [0, "}"],
                        [0, "cout << low << '\\n';"]
                    ])
                ]
            },
            {
                id: "sets",
                snippets: [
                    snippet("short", [
                        [0, "set<int> unique;"],
                        [0, "for (int value : nums) {"],
                        [1, "unique.insert(value);"],
                        [0, "}"]
                    ]),
                    snippet("medium", [
                        [0, "vector<int> ordered("],
                        [1, "unique.begin(), unique.end()"],
                        [0, ");"],
                        [0, ""],
                        [0, "for (auto it = ordered.rbegin();"],
                        [1, "it != ordered.rend(); ++it) {"],
                        [1, "cout << *it << ' ';"],
                        [0, "}"]
                    ]),
                    snippet("large", [
                        [0, "stack<int> pending;"],
                        [0, "for (int value : ordered) {"],
                        [1, "if (value % 2 == 0) {"],
                        [2, "pending.push(value);"],
                        [1, "}"],
                        [0, "}"],
                        [0, ""],
                        [0, "while (!pending.empty()) {"],
                        [1, "int value = pending.top();"],
                        [1, "pending.pop();"],
                        [1, "cout << value << '\\n';"],
                        [0, "}"]
                    ])
                ]
            },
            {
                id: "bits",
                snippets: [
                    snippet("short", [
                        [0, "unsigned int mask = 0;"],
                        [0, "unsigned int bit = 1u << 3;"],
                        [0, "mask |= bit;"]
                    ]),
                    snippet("medium", [
                        [0, "bool enabled = (mask & bit) != 0;"],
                        [0, "if (enabled) {"],
                        [1, "mask &= ~bit;"],
                        [0, "} else {"],
                        [1, "mask |= bit;"],
                        [0, "}"],
                        [0, "cout << (enabled ? \"on\" : \"off\");"]
                    ]),
                    snippet("large", [
                        [0, "unsigned int changed = mask ^ bit;"],
                        [0, "int count = 0;"],
                        [0, "while (changed != 0) {"],
                        [1, "count += changed & 1u;"],
                        [1, "changed >>= 1;"],
                        [0, "}"],
                        [0, ""],
                        [0, "for (int i = 7; i >= 0; --i) {"],
                        [1, "cout << ((mask >> i) & 1u);"],
                        [0, "}"],
                        [0, "cout << '\\n' << count << '\\n';"]
                    ])
                ]
            },
            {
                id: "queues",
                snippets: [
                    snippet("short", [
                        [0, "queue<int> jobs;"],
                        [0, "jobs.push(10);"],
                        [0, "jobs.push(21);"],
                        [0, "jobs.push(32);"]
                    ]),
                    snippet("medium", [
                        [0, "vector<int> order;"],
                        [0, "while (!jobs.empty()) {"],
                        [1, "int job = jobs.front();"],
                        [1, "jobs.pop();"],
                        [1, "order.push_back(job);"],
                        [0, "}"],
                        [0, ""],
                        [0, "cout << order.size() << '\\n';"]
                    ]),
                    snippet("large", [
                        [0, "queue<int> retry;"],
                        [0, ""],
                        [0, "for (int job : order) {"],
                        [1, "if (job % 2 == 0) {"],
                        [2, "retry.push(job);"],
                        [1, "}"],
                        [0, "}"],
                        [0, ""],
                        [0, "while (!retry.empty()) {"],
                        [1, "int job = retry.front();"],
                        [1, "retry.pop();"],
                        [0, ""],
                        [1, "cout << \"retry \" << job << '\\n';"],
                        [0, "}"]
                    ])
                ]
            },
            {
                id: "deques",
                snippets: [
                    snippet("short", [
                        [0, "deque<int> samples = {4, 7, 2};"],
                        [0, "samples.push_front(9);"],
                        [0, "samples.push_back(5);"],
                        [0, "samples.pop_front();"]
                    ]),
                    snippet("medium", [
                        [0, "int total = 0;"],
                        [0, "for (int value : samples) {"],
                        [1, "total += value;"],
                        [0, "}"],
                        [0, ""],
                        [0, "double average = static_cast<double>(total)"],
                        [1, "/ samples.size();"],
                        [0, "cout << average << '\\n';"]
                    ]),
                    snippet("large", [
                        [0, "deque<int> window;"],
                        [0, "int sum = 0;"],
                        [0, "const size_t width = 3;"],
                        [0, ""],
                        [0, "for (int value : samples) {"],
                        [1, "window.push_back(value);"],
                        [1, "sum += value;"],
                        [0, ""],
                        [1, "if (window.size() > width) {"],
                        [2, "sum -= window.front();"],
                        [2, "window.pop_front();"],
                        [1, "}"],
                        [0, ""],
                        [1, "if (window.size() == width) {"],
                        [2, "cout << sum << '\\n';"],
                        [1, "}"],
                        [0, "}"]
                    ])
                ]
            },
            {
                id: "heaps",
                snippets: [
                    snippet("short", [
                        [0, "priority_queue<int> scores;"],
                        [0, "scores.push(42);"],
                        [0, "scores.push(17);"],
                        [0, "scores.push(30);"]
                    ]),
                    snippet("medium", [
                        [0, "vector<int> ranked;"],
                        [0, "while (!scores.empty()) {"],
                        [1, "ranked.push_back(scores.top());"],
                        [1, "scores.pop();"],
                        [0, "}"],
                        [0, ""],
                        [0, "cout << ranked.front() << '\\n';"],
                        [0, "cout << ranked.back() << '\\n';"]
                    ]),
                    snippet("large", [
                        [0, "priority_queue<"],
                        [1, "int, vector<int>, greater<int>"],
                        [0, "> smallest;"],
                        [0, ""],
                        [0, "for (int score : ranked) {"],
                        [1, "smallest.push(score);"],
                        [1, "if (smallest.size() > 2) {"],
                        [2, "smallest.pop();"],
                        [1, "}"],
                        [0, "}"],
                        [0, ""],
                        [0, "while (!smallest.empty()) {"],
                        [1, "cout << smallest.top() << '\\n';"],
                        [1, "smallest.pop();"],
                        [0, "}"]
                    ])
                ]
            },
            {
                id: "arrays",
                snippets: [
                    snippet("short", [
                        [0, "vector<int> values = {3, 1, 4, 1, 5};"],
                        [0, "sort(values.begin(), values.end());"],
                        [0, "int first = values.front();"],
                        [0, "int last = values.back();"]
                    ]),
                    snippet("medium", [
                        [0, "int total = 0;"],
                        [0, "for (int value : values) {"],
                        [1, "total += value;"],
                        [0, "}"],
                        [0, ""],
                        [0, "double mean = static_cast<double>(total)"],
                        [1, "/ values.size();"],
                        [0, "cout << first << ' ' << last << '\\n';"],
                        [0, "cout << mean << '\\n';"]
                    ]),
                    snippet("large", [
                        [0, "vector<int> squares(5);"],
                        [0, "for (size_t i = 0; i < values.size(); ++i) {"],
                        [1, "squares[i] = values[i] * values[i];"],
                        [0, "}"],
                        [0, ""],
                        [0, "auto largest = max_element("],
                        [1, "squares.begin(), squares.end()"],
                        [0, ");"],
                        [0, ""],
                        [0, "if (largest != squares.end()) {"],
                        [1, "cout << *largest << '\\n';"],
                        [0, "}"],
                        [0, ""],
                        [0, "for (int value : squares) {"],
                        [1, "cout << value << ' ';"],
                        [0, "}"]
                    ])
                ]
            },
            {
                id: "intervals",
                snippets: [
                    snippet("short", [
                        [0, "vector<pair<int, int>> ranges;"],
                        [0, "ranges.push_back({2, 5});"],
                        [0, "ranges.push_back({1, 3});"],
                        [0, "sort(ranges.begin(), ranges.end());"]
                    ]),
                    snippet("medium", [
                        [0, "for (const auto &range : ranges) {"],
                        [1, "int start = range.first;"],
                        [1, "int end = range.second;"],
                        [1, "int length = end - start;"],
                        [0, ""],
                        [1, "cout << start << ' ';"],
                        [1, "cout << end << ' ';"],
                        [1, "cout << length << '\\n';"],
                        [0, "}"]
                    ]),
                    snippet("large", [
                        [0, "vector<pair<int, int>> merged;"],
                        [0, ""],
                        [0, "for (const auto &range : ranges) {"],
                        [1, "if (merged.empty() ||"],
                        [2, "range.first > merged.back().second) {"],
                        [2, "merged.push_back(range);"],
                        [1, "} else {"],
                        [2, "merged.back().second = max("],
                        [3, "merged.back().second, range.second"],
                        [2, ");"],
                        [1, "}"],
                        [0, "}"],
                        [0, ""],
                        [0, "for (const auto &range : merged) {"],
                        [1, "cout << range.first << ':';"],
                        [1, "cout << range.second << '\\n';"],
                        [0, "}"]
                    ])
                ]
            },
            {
                id: "tuples",
                snippets: [
                    snippet("short", [
                        [0, "tuple<string, int, bool> record;"],
                        [0, "record = {\"Mira\", 21, true};"],
                        [0, "auto [name, age, active] = record;"]
                    ]),
                    snippet("medium", [
                        [0, "bool adult = age >= 18;"],
                        [0, "if (adult && active) {"],
                        [1, "cout << name << \" can join\\n\";"],
                        [0, "} else {"],
                        [1, "cout << name << \" is waiting\\n\";"],
                        [0, "}"],
                        [0, ""],
                        [0, "get<1>(record) = age + 1;"]
                    ]),
                    snippet("large", [
                        [0, "vector<tuple<string, int, bool>> entries;"],
                        [0, "entries.push_back(record);"],
                        [0, "entries.push_back({\"Noah\", 16, true});"],
                        [0, "vector<string> accepted;"],
                        [0, ""],
                        [0, "for (const auto &entry : entries) {"],
                        [1, "const auto &[label, years, on] = entry;"],
                        [1, "if (years >= 18 && on) {"],
                        [2, "accepted.push_back(label);"],
                        [1, "}"],
                        [0, "}"],
                        [0, ""],
                        [0, "for (const string &label : accepted) {"],
                        [1, "cout << label << '\\n';"],
                        [0, "}"]
                    ])
                ]
            },
            {
                id: "string-streams",
                snippets: [
                    snippet("short", [
                        [0, "string row = \"Ada 42 3.5\";"],
                        [0, "istringstream input(row);"],
                        [0, "string name;"],
                        [0, "input >> name;"]
                    ]),
                    snippet("medium", [
                        [0, "int count = 0;"],
                        [0, "double weight = 0.0;"],
                        [0, ""],
                        [0, "if (input >> count >> weight) {"],
                        [1, "cout << name << ' ';"],
                        [1, "cout << count << ' ';"],
                        [1, "cout << weight << '\\n';"],
                        [0, "}"]
                    ]),
                    snippet("large", [
                        [0, "ostringstream summary;"],
                        [0, "summary << fixed << setprecision(2);"],
                        [0, "summary << name << \": \";"],
                        [0, "summary << count * weight;"],
                        [0, "string report = summary.str();"],
                        [0, ""],
                        [0, "istringstream words(report);"],
                        [0, "vector<string> tokens;"],
                        [0, "string token;"],
                        [0, "while (words >> token) {"],
                        [1, "tokens.push_back(token);"],
                        [0, "}"],
                        [0, ""],
                        [0, "for (const string &value : tokens) {"],
                        [1, "cout << value << '\\n';"],
                        [0, "}"]
                    ])
                ]
            },
            {
                id: "string-search",
                snippets: [
                    snippet("short", [
                        [0, "string text = \"red blue red green\";"],
                        [0, "string needle = \"red\";"],
                        [0, "size_t first = text.find(needle);"],
                        [0, "cout << first << '\\n';"]
                    ]),
                    snippet("medium", [
                        [0, "int matches = 0;"],
                        [0, "size_t pos = 0;"],
                        [0, ""],
                        [0, "while ((pos = text.find(needle, pos))"],
                        [1, "!= string::npos) {"],
                        [1, "++matches;"],
                        [1, "pos += needle.size();"],
                        [0, "}"],
                        [0, "cout << matches << '\\n';"]
                    ]),
                    snippet("large", [
                        [0, "string replaced = text;"],
                        [0, "size_t start = 0;"],
                        [0, "const string replacement = \"gold\";"],
                        [0, ""],
                        [0, "while ((start = replaced.find(needle, start))"],
                        [1, "!= string::npos) {"],
                        [1, "replaced.replace("],
                        [2, "start, needle.size(), replacement"],
                        [1, ");"],
                        [1, "start += replacement.size();"],
                        [0, "}"],
                        [0, ""],
                        [0, "cout << replaced << '\\n';"],
                        [0, "size_t split = replaced.find(' ');"],
                        [0, "string head = replaced.substr(0, split);"],
                        [0, "cout << head << '\\n';"]
                    ])
                ]
            },
            {
                id: "palindromes",
                snippets: [
                    snippet("short", [
                        [0, "string word = \"level\";"],
                        [0, "string reversed = word;"],
                        [0, "reverse(reversed.begin(), reversed.end());"],
                        [0, "bool same = word == reversed;"]
                    ]),
                    snippet("medium", [
                        [0, "string clean;"],
                        [0, "for (char ch : word) {"],
                        [1, "if (ch >= 'a' && ch <= 'z') {"],
                        [2, "clean += ch;"],
                        [1, "}"],
                        [0, "}"],
                        [0, ""],
                        [0, "cout << (same ? \"yes\" : \"no\") << '\\n';"],
                        [0, "cout << clean.size() << '\\n';"]
                    ]),
                    snippet("large", [
                        [0, "int left = 0;"],
                        [0, "int right = static_cast<int>(clean.size());"],
                        [0, "--right;"],
                        [0, "bool palindrome = true;"],
                        [0, ""],
                        [0, "while (left < right) {"],
                        [1, "if (clean[left] != clean[right]) {"],
                        [2, "palindrome = false;"],
                        [2, "break;"],
                        [1, "}"],
                        [1, "++left;"],
                        [1, "--right;"],
                        [0, "}"],
                        [0, ""],
                        [0, "cout << (palindrome ? \"yes\" : \"no\") << '\\n';"]
                    ])
                ]
            },
            {
                id: "digit-math",
                snippets: [
                    snippet("short", [
                        [0, "int value = 12345;"],
                        [0, "int lastDigit = value % 10;"],
                        [0, "int shortened = value / 10;"],
                        [0, "cout << lastDigit << '\\n';"]
                    ]),
                    snippet("medium", [
                        [0, "int reversed = 0;"],
                        [0, "int remaining = value;"],
                        [0, "while (remaining > 0) {"],
                        [1, "int digit = remaining % 10;"],
                        [1, "reversed = reversed * 10 + digit;"],
                        [1, "remaining /= 10;"],
                        [0, "}"],
                        [0, "cout << reversed << '\\n';"]
                    ]),
                    snippet("large", [
                        [0, "vector<int> frequency(10);"],
                        [0, "int copy = value;"],
                        [0, ""],
                        [0, "do {"],
                        [1, "++frequency[copy % 10];"],
                        [1, "copy /= 10;"],
                        [0, "} while (copy > 0);"],
                        [0, ""],
                        [0, "int distinct = 0;"],
                        [0, "for (int count : frequency) {"],
                        [1, "if (count > 0) {"],
                        [2, "++distinct;"],
                        [1, "}"],
                        [0, "}"],
                        [0, ""],
                        [0, "cout << distinct << '\\n';"]
                    ])
                ]
            },
            {
                id: "euclid",
                snippets: [
                    snippet("short", [
                        [0, "int a = 84;"],
                        [0, "int b = 30;"],
                        [0, "int divisor = gcd(a, b);"],
                        [0, "cout << divisor << '\\n';"]
                    ]),
                    snippet("medium", [
                        [0, "int x = a;"],
                        [0, "int y = b;"],
                        [0, ""],
                        [0, "while (y != 0) {"],
                        [1, "int remainder = x % y;"],
                        [1, "x = y;"],
                        [1, "y = remainder;"],
                        [0, "}"],
                        [0, "cout << x << '\\n';"]
                    ]),
                    snippet("large", [
                        [0, "int numerator = a;"],
                        [0, "int denominator = b;"],
                        [0, "int factor = gcd(numerator, denominator);"],
                        [0, "numerator /= factor;"],
                        [0, "denominator /= factor;"],
                        [0, ""],
                        [0, "if (denominator < 0) {"],
                        [1, "numerator = -numerator;"],
                        [1, "denominator = -denominator;"],
                        [0, "}"],
                        [0, ""],
                        [0, "cout << numerator << '/' << denominator;"],
                        [0, "long long multiple = 1LL * a / divisor * b;"],
                        [0, "cout << '\\n' << multiple << '\\n';"]
                    ])
                ]
            },
            {
                id: "powers",
                snippets: [
                    snippet("short", [
                        [0, "long long base = 3;"],
                        [0, "int exponent = 5;"],
                        [0, "long long result = 1;"],
                        [0, "const long long mod = 1000000007;"]
                    ]),
                    snippet("medium", [
                        [0, "int remaining = exponent;"],
                        [0, "while (remaining > 0) {"],
                        [1, "if (remaining & 1) {"],
                        [2, "result *= base;"],
                        [1, "}"],
                        [1, "base *= base;"],
                        [1, "remaining >>= 1;"],
                        [0, "}"]
                    ]),
                    snippet("large", [
                        [0, "long long modular = 1;"],
                        [0, "long long factor = 3;"],
                        [0, "int power = exponent;"],
                        [0, ""],
                        [0, "while (power > 0) {"],
                        [1, "if ((power & 1) != 0) {"],
                        [2, "modular = modular * factor % mod;"],
                        [1, "}"],
                        [1, "factor = factor * factor % mod;"],
                        [1, "power >>= 1;"],
                        [0, "}"],
                        [0, ""],
                        [0, "cout << result << '\\n';"],
                        [0, "cout << modular << '\\n';"]
                    ])
                ]
            },
            {
                id: "sliding-window",
                snippets: [
                    snippet("short", [
                        [0, "vector<int> nums = {2, 1, 5, 1, 3, 2};"],
                        [0, "int width = 3;"],
                        [0, "int sum = 0;"],
                        [0, "int best = 0;"]
                    ]),
                    snippet("medium", [
                        [0, "for (int i = 0; i < width; ++i) {"],
                        [1, "sum += nums[i];"],
                        [0, "}"],
                        [0, ""],
                        [0, "best = sum;"],
                        [0, "cout << \"first: \" << sum << '\\n';"]
                    ]),
                    snippet("large", [
                        [0, "for (size_t i = width; i < nums.size(); ++i) {"],
                        [1, "sum += nums[i];"],
                        [1, "sum -= nums[i - width];"],
                        [1, "best = max(best, sum);"],
                        [0, "}"],
                        [0, ""],
                        [0, "cout << best << '\\n';"],
                        [0, "vector<int> prefix(nums.size() + 1);"],
                        [0, ""],
                        [0, "for (size_t i = 0; i < nums.size(); ++i) {"],
                        [1, "prefix[i + 1] = prefix[i] + nums[i];"],
                        [0, "}"],
                        [0, ""],
                        [0, "cout << prefix.back() << '\\n';"]
                    ])
                ]
            },
            {
                id: "two-pointers",
                snippets: [
                    snippet("short", [
                        [0, "vector<int> nums = {1, 3, 4, 6, 8};"],
                        [0, "int left = 0;"],
                        [0, "int right = static_cast<int>(nums.size()) - 1;"],
                        [0, "int target = 10;"]
                    ]),
                    snippet("medium", [
                        [0, "while (left < right) {"],
                        [1, "int sum = nums[left] + nums[right];"],
                        [1, "if (sum >= target) {"],
                        [2, "break;"],
                        [1, "}"],
                        [1, "++left;"],
                        [0, "}"],
                        [0, "cout << left << '\\n';"]
                    ]),
                    snippet("large", [
                        [0, "left = 0;"],
                        [0, "right = static_cast<int>(nums.size()) - 1;"],
                        [0, "bool found = false;"],
                        [0, ""],
                        [0, "while (left < right && !found) {"],
                        [1, "int sum = nums[left] + nums[right];"],
                        [1, "if (sum == target) {"],
                        [2, "found = true;"],
                        [1, "} else if (sum < target) {"],
                        [2, "++left;"],
                        [1, "} else {"],
                        [2, "--right;"],
                        [1, "}"],
                        [0, "}"],
                        [0, ""],
                        [0, "cout << (found ? \"found\" : \"missing\") << '\\n';"]
                    ])
                ]
            },
            {
                id: "prefix-counts",
                snippets: [
                    snippet("short", [
                        [0, "vector<int> values = {1, 2, 2, 3, 1};"],
                        [0, "vector<int> frequency(4);"],
                        [0, "int total = 0;"],
                        [0, "int distinct = 0;"]
                    ]),
                    snippet("medium", [
                        [0, "for (int value : values) {"],
                        [1, "if (frequency[value] == 0) {"],
                        [2, "++distinct;"],
                        [1, "}"],
                        [1, "++frequency[value];"],
                        [1, "++total;"],
                        [0, "}"],
                        [0, "cout << total << ' ' << distinct << '\\n';"]
                    ]),
                    snippet("large", [
                        [0, "vector<int> prefix(4);"],
                        [0, "prefix[0] = frequency[0];"],
                        [0, ""],
                        [0, "for (size_t i = 1;"],
                        [1, "i < frequency.size(); ++i) {"],
                        [1, "prefix[i] = prefix[i - 1] + frequency[i];"],
                        [0, "}"],
                        [0, ""],
                        [0, "int atMostTwo = prefix[2];"],
                        [0, "int onesAndTwos = prefix[2] - prefix[0];"],
                        [0, "cout << atMostTwo << '\\n';"],
                        [0, "cout << onesAndTwos << '\\n';"],
                        [0, ""],
                        [0, "for (int limit = 0; limit < 4; ++limit) {"],
                        [1, "cout << limit << \": \";"],
                        [1, "cout << prefix[limit] << '\\n';"],
                        [0, "}"]
                    ])
                ]
            },
            {
                id: "matrix-rows",
                snippets: [
                    snippet("short", [
                        [0, "vector<vector<int>> grid = {"],
                        [1, "{1, 2, 3}, {4, 5, 6}, {7, 8, 9}"],
                        [0, "};"],
                        [0, "int total = 0;"]
                    ]),
                    snippet("medium", [
                        [0, "for (const auto &row : grid) {"],
                        [1, "int rowSum = 0;"],
                        [1, "for (int value : row) {"],
                        [2, "rowSum += value;"],
                        [1, "}"],
                        [1, "total += rowSum;"],
                        [1, "cout << rowSum << '\\n';"],
                        [0, "}"]
                    ]),
                    snippet("large", [
                        [0, "size_t rows = grid.size();"],
                        [0, "size_t cols = grid[0].size();"],
                        [0, "vector<int> columns(cols, 0);"],
                        [0, ""],
                        [0, "for (const auto &row : grid) {"],
                        [1, "for (size_t col = 0; col < cols; ++col) {"],
                        [2, "columns[col] += row[col];"],
                        [1, "}"],
                        [0, "}"],
                        [0, ""],
                        [0, "for (int sum : columns) {"],
                        [1, "cout << sum << ' ';"],
                        [0, "}"],
                        [0, ""],
                        [0, "cout << '\\n' << rows << \" rows\\n\";"],
                        [0, "cout << total << '\\n';"]
                    ])
                ]
            },
            {
                id: "adjacency",
                snippets: [
                    snippet("short", [
                        [0, "int n = 5;"],
                        [0, "vector<vector<int>> graph(n);"],
                        [0, "graph[0].push_back(1);"],
                        [0, "graph[1].push_back(2);"]
                    ]),
                    snippet("medium", [
                        [0, "vector<int> degree(n);"],
                        [0, "for (int node = 0; node < n; ++node) {"],
                        [1, "degree[node] = graph[node].size();"],
                        [1, "for (int next : graph[node]) {"],
                        [2, "cout << node << \" -> \";"],
                        [2, "cout << next << '\\n';"],
                        [1, "}"],
                        [0, "}"]
                    ]),
                    snippet("large", [
                        [0, "vector<int> dist(n, -1);"],
                        [0, "queue<int> pending;"],
                        [0, "dist[0] = 0;"],
                        [0, "pending.push(0);"],
                        [0, ""],
                        [0, "while (!pending.empty()) {"],
                        [1, "int node = pending.front();"],
                        [1, "pending.pop();"],
                        [0, ""],
                        [1, "for (int next : graph[node]) {"],
                        [2, "if (dist[next] == -1) {"],
                        [3, "dist[next] = dist[node] + 1;"],
                        [3, "pending.push(next);"],
                        [2, "}"],
                        [1, "}"],
                        [0, "}"],
                        [0, ""],
                        [0, "cout << dist[2] << '\\n';"]
                    ])
                ]
            },
            {
                id: "forward-lists",
                snippets: [
                    snippet("short", [
                        [0, "forward_list<int> values = {3, 1, 4};"],
                        [0, "values.push_front(2);"],
                        [0, "values.insert_after(values.begin(), 9);"],
                        [0, "values.sort();"]
                    ]),
                    snippet("medium", [
                        [0, "vector<int> copied;"],
                        [0, "int total = 0;"],
                        [0, "for (int value : values) {"],
                        [1, "copied.push_back(value);"],
                        [1, "total += value;"],
                        [0, "}"],
                        [0, ""],
                        [0, "cout << copied.size() << '\\n';"],
                        [0, "cout << total << '\\n';"]
                    ]),
                    snippet("large", [
                        [0, "values.unique();"],
                        [0, "values.remove_if([](int value) {"],
                        [1, "return value % 2 == 0;"],
                        [0, "});"],
                        [0, ""],
                        [0, "int oddTotal = 0;"],
                        [0, "for (int value : values) {"],
                        [1, "oddTotal += value;"],
                        [1, "cout << value << ' ';"],
                        [0, "}"],
                        [0, ""],
                        [0, "if (!values.empty()) {"],
                        [1, "cout << '\\n' << values.front();"],
                        [0, "}"],
                        [0, "cout << '\\n' << oddTotal << '\\n';"]
                    ])
                ]
            },
            {
                id: "lists",
                snippets: [
                    snippet("short", [
                        [0, "list<string> tasks = {\"read\", \"write\"};"],
                        [0, "tasks.push_back(\"test\");"],
                        [0, "tasks.push_front(\"plan\");"],
                        [0, "auto it = tasks.begin();"]
                    ]),
                    snippet("medium", [
                        [0, "advance(it, 2);"],
                        [0, "it = tasks.insert(it, \"review\");"],
                        [0, "if (it != tasks.end()) {"],
                        [1, "cout << *it << '\\n';"],
                        [1, "tasks.erase(it);"],
                        [0, "}"],
                        [0, ""],
                        [0, "cout << tasks.size() << '\\n';"]
                    ]),
                    snippet("large", [
                        [0, "list<string> done;"],
                        [0, ""],
                        [0, "while (!tasks.empty()) {"],
                        [1, "auto cur = tasks.begin();"],
                        [1, "if (cur->size() > 4) {"],
                        [2, "done.splice(done.end(), tasks, cur);"],
                        [1, "} else {"],
                        [2, "tasks.pop_front();"],
                        [1, "}"],
                        [0, "}"],
                        [0, ""],
                        [0, "done.sort();"],
                        [0, "for (const string &task : done) {"],
                        [1, "cout << task << '\\n';"],
                        [0, "}"]
                    ])
                ]
            },
            {
                id: "unordered-lookup",
                snippets: [
                    snippet("short", [
                        [0, "unordered_map<string, int> visits;"],
                        [0, "visits[\"home\"] = 3;"],
                        [0, "visits[\"docs\"] = 7;"],
                        [0, "visits[\"api\"] = 2;"]
                    ]),
                    snippet("medium", [
                        [0, "for (const auto &entry : visits) {"],
                        [1, "if (entry.second > 2) {"],
                        [2, "cout << entry.first << \": \";"],
                        [2, "cout << entry.second << '\\n';"],
                        [1, "}"],
                        [0, "}"],
                        [0, "const string path = \"docs\";"],
                        [0, "cout << visits.count(path) << '\\n';"]
                    ]),
                    snippet("large", [
                        [0, "vector<pair<int, string>> ranked;"],
                        [0, "for (const auto &entry : visits) {"],
                        [1, "ranked.emplace_back("],
                        [2, "entry.second, entry.first"],
                        [1, ");"],
                        [0, "}"],
                        [0, ""],
                        [0, "sort(ranked.rbegin(), ranked.rend());"],
                        [0, "for (const auto &entry : ranked) {"],
                        [1, "cout << entry.second << \": \";"],
                        [1, "cout << entry.first << '\\n';"],
                        [0, "}"],
                        [0, ""],
                        [0, "auto cached = visits.find(path);"],
                        [0, "if (cached != visits.end()) {"],
                        [1, "++cached->second;"],
                        [0, "}"]
                    ])
                ]
            },
            {
                id: "unordered-membership",
                snippets: [
                    snippet("short", [
                        [0, "unordered_set<int> seen = {2, 5, 8};"],
                        [0, "bool known = seen.count(5) != 0;"],
                        [0, "seen.insert(13);"],
                        [0, "seen.erase(2);"]
                    ]),
                    snippet("medium", [
                        [0, "vector<int> incoming = {5, 3, 8, 3, 9};"],
                        [0, "vector<int> fresh;"],
                        [0, "for (int value : incoming) {"],
                        [1, "if (seen.insert(value).second) {"],
                        [2, "fresh.push_back(value);"],
                        [1, "}"],
                        [0, "}"],
                        [0, "cout << fresh.size() << '\\n';"]
                    ]),
                    snippet("large", [
                        [0, "unordered_set<int> batch = {3, 6, 9, 12};"],
                        [0, "vector<int> common;"],
                        [0, ""],
                        [0, "for (int value : fresh) {"],
                        [1, "if (batch.count(value) != 0) {"],
                        [2, "common.push_back(value);"],
                        [1, "}"],
                        [0, "}"],
                        [0, ""],
                        [0, "sort(common.begin(), common.end());"],
                        [0, "for (int value : common) {"],
                        [1, "cout << value << '\\n';"],
                        [0, "}"],
                        [0, "cout << common.size() << \" shared\\n\";"]
                    ])
                ]
            },
            {
                id: "multisets",
                snippets: [
                    snippet("short", [
                        [0, "multiset<int> scores = {5, 2, 5, 9};"],
                        [0, "size_t copies = scores.count(5);"],
                        [0, "auto first = scores.find(5);"],
                        [0, "cout << copies << '\\n';"]
                    ]),
                    snippet("medium", [
                        [0, "if (first != scores.end()) {"],
                        [1, "scores.erase(first);"],
                        [0, "}"],
                        [0, ""],
                        [0, "first = scores.lower_bound(5);"],
                        [0, "if (first != scores.end()) {"],
                        [1, "cout << *first << '\\n';"],
                        [0, "}"]
                    ]),
                    snippet("large", [
                        [0, "vector<int> top;"],
                        [0, "for (auto it = scores.rbegin();"],
                        [1, "it != scores.rend(); ++it) {"],
                        [1, "top.push_back(*it);"],
                        [0, "}"],
                        [0, ""],
                        [0, "int sum = 0;"],
                        [0, "for (int score : top) {"],
                        [1, "sum += score;"],
                        [0, "}"],
                        [0, ""],
                        [0, "if (!top.empty()) {"],
                        [1, "double mean = static_cast<double>(sum)"],
                        [2, "/ top.size();"],
                        [1, "cout << mean << '\\n';"],
                        [0, "}"]
                    ])
                ]
            },
            {
                id: "rotations",
                snippets: [
                    snippet("short", [
                        [0, "vector<int> values = {1, 2, 3, 4, 5};"],
                        [0, "auto pivot = values.begin() + 2;"],
                        [0, "rotate(values.begin(), pivot, values.end());"],
                        [0, "cout << values.front() << '\\n';"]
                    ]),
                    snippet("medium", [
                        [0, "reverse(values.begin(), values.end());"],
                        [0, "for (int value : values) {"],
                        [1, "cout << value << ' ';"],
                        [0, "}"],
                        [0, ""],
                        [0, "cout << '\\n';"],
                        [0, "int first = values.front();"],
                        [0, "cout << first << '\\n';"]
                    ]),
                    snippet("large", [
                        [0, "int shift = 2;"],
                        [0, "int count = static_cast<int>(values.size());"],
                        [0, "vector<int> rotated(count);"],
                        [0, ""],
                        [0, "for (int i = 0; i < count; ++i) {"],
                        [1, "int next = (i + shift) % count;"],
                        [1, "rotated[next] = values[i];"],
                        [0, "}"],
                        [0, ""],
                        [0, "values.swap(rotated);"],
                        [0, "for (int value : values) {"],
                        [1, "cout << value << ' ';"],
                        [0, "}"],
                        [0, "cout << '\\n';"]
                    ])
                ]
            },
            {
                id: "erase-remove",
                snippets: [
                    snippet("short", [
                        [0, "vector<int> values = {0, 3, 0, 2, 5};"],
                        [0, "auto last = remove("],
                        [1, "values.begin(), values.end(), 0"],
                        [0, ");"]
                    ]),
                    snippet("medium", [
                        [0, "values.erase(last, values.end());"],
                        [0, "int total = 0;"],
                        [0, "for (int value : values) {"],
                        [1, "total += value;"],
                        [0, "}"],
                        [0, ""],
                        [0, "cout << values.size() << '\\n';"],
                        [0, "cout << total << '\\n';"]
                    ]),
                    snippet("large", [
                        [0, "values.erase("],
                        [1, "remove_if("],
                        [2, "values.begin(), values.end(),"],
                        [2, "[](int value) {"],
                        [3, "return value < 3;"],
                        [2, "}"],
                        [1, "),"],
                        [1, "values.end()"],
                        [0, ");"],
                        [0, ""],
                        [0, "sort(values.begin(), values.end());"],
                        [0, "auto it = unique(begin(values), end(values));"],
                        [0, "values.erase(it, values.end());"],
                        [0, ""],
                        [0, "for (int value : values) {"],
                        [1, "cout << value << ' ';"],
                        [0, "}"]
                    ])
                ]
            },
            {
                id: "transforms",
                snippets: [
                    snippet("short", [
                        [0, "vector<int> input = {1, 2, 3, 4};"],
                        [0, "vector<int> output(input.size());"],
                        [0, "int scale = 3;"],
                        [0, "int offset = 1;"]
                    ]),
                    snippet("medium", [
                        [0, "transform("],
                        [1, "input.begin(), input.end(),"],
                        [1, "output.begin(),"],
                        [1, "[scale, offset](int value) {"],
                        [2, "return value * scale + offset;"],
                        [1, "}"],
                        [0, ");"]
                    ]),
                    snippet("large", [
                        [0, "vector<int> odd;"],
                        [0, "copy_if("],
                        [1, "output.begin(), output.end(),"],
                        [1, "back_inserter(odd),"],
                        [1, "[](int value) {"],
                        [2, "return value % 2 != 0;"],
                        [1, "}"],
                        [0, ");"],
                        [0, ""],
                        [0, "int sum = accumulate("],
                        [1, "odd.begin(), odd.end(), 0"],
                        [0, ");"],
                        [0, ""],
                        [0, "for (int value : odd) {"],
                        [1, "cout << value << ' ';"],
                        [0, "}"],
                        [0, "cout << '\\n' << sum << '\\n';"]
                    ])
                ]
            },
            {
                id: "partitions",
                snippets: [
                    snippet("short", [
                        [0, "vector<int> nums = {3, 2, 5, 4, 1};"],
                        [0, "auto even = [](int value) {"],
                        [1, "return value % 2 == 0;"],
                        [0, "};"]
                    ]),
                    snippet("medium", [
                        [0, "auto middle = stable_partition("],
                        [1, "nums.begin(), nums.end(), even"],
                        [0, ");"],
                        [0, ""],
                        [0, "for (auto it = nums.begin();"],
                        [1, "it != middle; ++it) {"],
                        [1, "cout << *it << ' ';"],
                        [0, "}"],
                        [0, "cout << '\\n';"]
                    ]),
                    snippet("large", [
                        [0, "vector<int> evens(nums.begin(), middle);"],
                        [0, "vector<int> odds(middle, nums.end());"],
                        [0, "sort(evens.begin(), evens.end());"],
                        [0, "sort(odds.begin(), odds.end());"],
                        [0, ""],
                        [0, "for (int value : evens) {"],
                        [1, "cout << value << ' ';"],
                        [0, "}"],
                        [0, "cout << '\\n';"],
                        [0, ""],
                        [0, "for (int value : odds) {"],
                        [1, "cout << value << ' ';"],
                        [0, "}"],
                        [0, "cout << '\\n' << evens.size() << \" even\\n\";"]
                    ])
                ]
            },
            {
                id: "min-max",
                snippets: [
                    snippet("short", [
                        [0, "vector<int> temps = {7, -2, 4, 9};"],
                        [0, "auto bounds = minmax_element("],
                        [1, "temps.begin(), temps.end()"],
                        [0, ");"]
                    ]),
                    snippet("medium", [
                        [0, "int low = *bounds.first;"],
                        [0, "int high = *bounds.second;"],
                        [0, "int span = high - low;"],
                        [0, ""],
                        [0, "for (int value : temps) {"],
                        [1, "cout << value - low << ' ';"],
                        [0, "}"],
                        [0, "cout << '\\n' << span << '\\n';"]
                    ]),
                    snippet("large", [
                        [0, "vector<double> scaled;"],
                        [0, "for (int value : temps) {"],
                        [1, "double unit = 0.0;"],
                        [1, "if (span != 0) {"],
                        [2, "unit = value - low;"],
                        [2, "unit /= span;"],
                        [1, "}"],
                        [1, "scaled.push_back(unit);"],
                        [0, "}"],
                        [0, ""],
                        [0, "for (double value : scaled) {"],
                        [1, "cout << fixed << setprecision(2);"],
                        [1, "cout << value << ' ';"],
                        [0, "}"],
                        [0, "cout << '\\n';"]
                    ])
                ]
            },
            {
                id: "anagrams",
                snippets: [
                    snippet("short", [
                        [0, "string first = \"listen\";"],
                        [0, "string second = \"silent\";"],
                        [0, "sort(first.begin(), first.end());"],
                        [0, "sort(second.begin(), second.end());"]
                    ]),
                    snippet("medium", [
                        [0, "bool same = first == second;"],
                        [0, "if (same) {"],
                        [1, "cout << \"anagrams\\n\";"],
                        [0, "} else {"],
                        [1, "cout << \"different\\n\";"],
                        [0, "}"],
                        [0, "cout << first.size() << '\\n';"],
                        [0, "cout << second.size() << '\\n';"]
                    ]),
                    snippet("large", [
                        [0, "vector<int> balance(26);"],
                        [0, "for (char ch : first) {"],
                        [1, "++balance[ch - 'a'];"],
                        [0, "}"],
                        [0, "for (char ch : second) {"],
                        [1, "--balance[ch - 'a'];"],
                        [0, "}"],
                        [0, ""],
                        [0, "bool balanced = true;"],
                        [0, "for (int count : balance) {"],
                        [1, "if (count != 0) {"],
                        [2, "balanced = false;"],
                        [1, "}"],
                        [0, "}"],
                        [0, "cout << (balanced ? \"same\" : \"different\");"]
                    ])
                ]
            },
            {
                id: "stack-reversal",
                snippets: [
                    snippet("short", [
                        [0, "string text = \"typing\";"],
                        [0, "stack<char> letters;"],
                        [0, "string reversed;"],
                        [0, "int count = 0;"]
                    ]),
                    snippet("medium", [
                        [0, "for (char ch : text) {"],
                        [1, "letters.push(ch);"],
                        [1, "++count;"],
                        [0, "}"],
                        [0, ""],
                        [0, "cout << count << \" letters\\n\";"]
                    ]),
                    snippet("large", [
                        [0, "while (!letters.empty()) {"],
                        [1, "char letter = letters.top();"],
                        [1, "letters.pop();"],
                        [1, "reversed += letter;"],
                        [0, "}"],
                        [0, "cout << reversed << '\\n';"],
                        [0, ""],
                        [0, "reverse(reversed.begin(), reversed.end());"],
                        [0, "bool same = reversed == text;"],
                        [0, "if (same) {"],
                        [1, "cout << \"restored\\n\";"],
                        [0, "} else {"],
                        [1, "cout << \"mismatch\\n\";"],
                        [0, "}"]
                    ])
                ]
            },
            {
                id: "fibonacci",
                snippets: [
                    snippet("short", [
                        [0, "vector<long long> fib(12, 0);"],
                        [0, "fib[0] = 0;"],
                        [0, "fib[1] = 1;"],
                        [0, "int limit = static_cast<int>(fib.size());"]
                    ]),
                    snippet("medium", [
                        [0, "for (int i = 2; i < limit; ++i) {"],
                        [1, "fib[i] = fib[i - 1] + fib[i - 2];"],
                        [0, "}"],
                        [0, ""],
                        [0, "for (long long value : fib) {"],
                        [1, "cout << value << ' ';"],
                        [0, "}"],
                        [0, "cout << '\\n';"]
                    ]),
                    snippet("large", [
                        [0, "long long previous = 0;"],
                        [0, "long long current = 1;"],
                        [0, "vector<long long> generated = {0, 1};"],
                        [0, ""],
                        [0, "for (int i = 2; i < limit; ++i) {"],
                        [1, "long long next = previous + current;"],
                        [1, "generated.push_back(next);"],
                        [1, "previous = current;"],
                        [1, "current = next;"],
                        [0, "}"],
                        [0, ""],
                        [0, "if (generated == fib) {"],
                        [1, "cout << \"sequences match\\n\";"],
                        [0, "}"],
                        [0, "cout << fib.back() << '\\n';"]
                    ])
                ]
            },
            {
                id: "coin-change",
                snippets: [
                    snippet("short", [
                        [0, "vector<int> coins = {1, 3, 4};"],
                        [0, "int amount = 6;"],
                        [0, "vector<int> ways(amount + 1, 0);"],
                        [0, "ways[0] = 1;"]
                    ]),
                    snippet("medium", [
                        [0, "for (int coin : coins) {"],
                        [1, "for (int sum = coin;"],
                        [2, "sum <= amount; ++sum) {"],
                        [2, "ways[sum] += ways[sum - coin];"],
                        [1, "}"],
                        [0, "}"],
                        [0, ""],
                        [0, "cout << ways[amount] << \" ways\\n\";"]
                    ]),
                    snippet("large", [
                        [0, "const int inf = amount + 1;"],
                        [0, "vector<int> best(amount + 1, inf);"],
                        [0, "best[0] = 0;"],
                        [0, ""],
                        [0, "for (int s = 1; s <= amount; ++s) {"],
                        [1, "for (int coin : coins) {"],
                        [2, "if (coin <= s) {"],
                        [3, "best[s] = min("],
                        [4, "best[s], best[s - coin] + 1"],
                        [3, ");"],
                        [2, "}"],
                        [1, "}"],
                        [0, "}"],
                        [0, ""],
                        [0, "if (best[amount] <= amount) {"],
                        [1, "cout << best[amount] << '\\n';"],
                        [0, "}"]
                    ])
                ]
            },
            {
                id: "grid-paths",
                snippets: [
                    snippet("short", [
                        [0, "int rows = 3;"],
                        [0, "int cols = 4;"],
                        [0, "vector<vector<int>> paths("],
                        [1, "rows, vector<int>(cols, 1));"]
                    ]),
                    snippet("medium", [
                        [0, "for (int row = 1; row < rows; ++row) {"],
                        [1, "for (int col = 1; col < cols; ++col) {"],
                        [2, "paths[row][col] ="],
                        [3, "paths[row - 1][col]"],
                        [3, "+ paths[row][col - 1];"],
                        [1, "}"],
                        [0, "}"],
                        [0, "cout << paths[rows - 1][cols - 1] << '\\n';"]
                    ]),
                    snippet("large", [
                        [0, "vector<int> rowCount(cols, 1);"],
                        [0, ""],
                        [0, "for (int row = 1; row < rows; ++row) {"],
                        [1, "for (int col = 1; col < cols; ++col) {"],
                        [2, "rowCount[col] += rowCount[col - 1];"],
                        [1, "}"],
                        [0, "}"],
                        [0, ""],
                        [0, "int answer = rowCount.back();"],
                        [0, "int expected = paths[rows - 1][cols - 1];"],
                        [0, "if (answer == expected) {"],
                        [1, "cout << \"consistent\\n\";"],
                        [0, "}"],
                        [0, ""],
                        [0, "for (int count : rowCount) {"],
                        [1, "cout << count << ' ';"],
                        [0, "}"]
                    ])
                ]
            },
            {
                id: "sieve",
                snippets: [
                    snippet("short", [
                        [0, "int limit = 30;"],
                        [0, "vector<bool> prime(limit + 1, true);"],
                        [0, "prime[0] = false;"],
                        [0, "prime[1] = false;"]
                    ]),
                    snippet("medium", [
                        [0, "for (int p = 2; p * p <= limit; ++p) {"],
                        [1, "if (!prime[p]) {"],
                        [2, "continue;"],
                        [1, "}"],
                        [1, "for (int n = p * p; n <= limit; n += p) {"],
                        [2, "prime[n] = false;"],
                        [1, "}"],
                        [0, "}"]
                    ]),
                    snippet("large", [
                        [0, "vector<int> primes;"],
                        [0, "int total = 0;"],
                        [0, "for (int n = 2; n <= limit; ++n) {"],
                        [1, "if (prime[n]) {"],
                        [2, "primes.push_back(n);"],
                        [2, "total += n;"],
                        [1, "}"],
                        [0, "}"],
                        [0, ""],
                        [0, "auto next = lower_bound("],
                        [1, "primes.begin(), primes.end(), 20"],
                        [0, ");"],
                        [0, "if (next != primes.end()) {"],
                        [1, "cout << *next << '\\n';"],
                        [0, "}"],
                        [0, "cout << total << '\\n';"]
                    ])
                ]
            },
            {
                id: "divisors",
                snippets: [
                    snippet("short", [
                        [0, "int value = 36;"],
                        [0, "vector<int> factors;"],
                        [0, "int root = static_cast<int>(sqrt(value));"],
                        [0, "bool square = root * root == value;"]
                    ]),
                    snippet("medium", [
                        [0, "for (int d = 1; d * d <= value; ++d) {"],
                        [1, "if (value % d == 0) {"],
                        [2, "factors.push_back(d);"],
                        [1, "}"],
                        [0, "}"],
                        [0, ""],
                        [0, "sort(factors.begin(), factors.end());"],
                        [0, "cout << square << '\\n';"]
                    ]),
                    snippet("large", [
                        [0, "vector<int> all = factors;"],
                        [0, "for (int divisor : factors) {"],
                        [1, "int partner = value / divisor;"],
                        [1, "if (partner != divisor) {"],
                        [2, "all.push_back(partner);"],
                        [1, "}"],
                        [0, "}"],
                        [0, ""],
                        [0, "sort(all.begin(), all.end());"],
                        [0, "int sum = accumulate("],
                        [1, "all.begin(), all.end(), 0"],
                        [0, ");"],
                        [0, ""],
                        [0, "for (int divisor : all) {"],
                        [1, "cout << divisor << ' ';"],
                        [0, "}"],
                        [0, "cout << '\\n' << sum << '\\n';"]
                    ])
                ]
            },
            {
                id: "run-length",
                snippets: [
                    snippet("short", [
                        [0, "string text = \"aaabbcccc\";"],
                        [0, "vector<pair<char, int>> runs;"],
                        [0, "char current = text.front();"],
                        [0, "int count = 0;"]
                    ]),
                    snippet("medium", [
                        [0, "for (char ch : text) {"],
                        [1, "if (ch != current) {"],
                        [2, "runs.push_back({current, count});"],
                        [2, "current = ch;"],
                        [2, "count = 0;"],
                        [1, "}"],
                        [1, "++count;"],
                        [0, "}"]
                    ]),
                    snippet("large", [
                        [0, "runs.push_back({current, count});"],
                        [0, "string encoded;"],
                        [0, "for (const auto &run : runs) {"],
                        [1, "encoded += run.first;"],
                        [1, "encoded += to_string(run.second);"],
                        [0, "}"],
                        [0, "cout << encoded << '\\n';"],
                        [0, ""],
                        [0, "string decoded;"],
                        [0, "for (const auto &run : runs) {"],
                        [1, "decoded.append(run.second, run.first);"],
                        [0, "}"],
                        [0, "cout << (decoded == text ? \"ok\" : \"error\");"]
                    ])
                ]
            },
            {
                id: "custom-sort",
                snippets: [
                    snippet("short", [
                        [0, "struct Task {"],
                        [1, "string name;"],
                        [1, "int priority;"],
                        [0, "};"]
                    ]),
                    snippet("medium", [
                        [0, "vector<Task> tasks = {"],
                        [1, "{\"build\", 2},"],
                        [1, "{\"test\", 1}"],
                        [0, "};"],
                        [0, "tasks.push_back({\"lint\", 3});"],
                        [0, "for (const Task &task : tasks) {"],
                        [1, "cout << task.name << '\\n';"],
                        [0, "}"]
                    ]),
                    snippet("large", [
                        [0, "stable_sort("],
                        [1, "tasks.begin(), tasks.end(),"],
                        [1, "[](const Task &a, const Task &b) {"],
                        [2, "if (a.priority != b.priority) {"],
                        [3, "return a.priority > b.priority;"],
                        [2, "}"],
                        [2, "return a.name < b.name;"],
                        [1, "}"],
                        [0, ");"],
                        [0, ""],
                        [0, "for (const Task &task : tasks) {"],
                        [1, "cout << task.priority << \": \";"],
                        [1, "cout << task.name << '\\n';"],
                        [0, "}"]
                    ])
                ]
            },
            {
                id: "permutations",
                snippets: [
                    snippet("short", [
                        [0, "vector<int> digits = {1, 2, 3};"],
                        [0, "sort(digits.begin(), digits.end());"],
                        [0, "int count = 0;"],
                        [0, "vector<vector<int>> orders;"]
                    ]),
                    snippet("medium", [
                        [0, "do {"],
                        [1, "orders.push_back(digits);"],
                        [1, "++count;"],
                        [0, "} while (next_permutation("],
                        [1, "digits.begin(), digits.end()));"],
                        [0, ""],
                        [0, "cout << count << \" permutations\\n\";"],
                        [0, "cout << orders.size() << \" stored\\n\";"]
                    ]),
                    snippet("large", [
                        [0, "int total = 0;"],
                        [0, "for (const auto &order : orders) {"],
                        [1, "int number = 0;"],
                        [1, "for (int digit : order) {"],
                        [2, "number = number * 10 + digit;"],
                        [1, "}"],
                        [1, "total += number;"],
                        [1, "cout << number << '\\n';"],
                        [0, "}"],
                        [0, ""],
                        [0, "int average = total / count;"],
                        [0, "cout << average << '\\n';"],
                        [0, "bool restored = is_sorted("],
                        [1, "digits.begin(), digits.end()"],
                        [0, ");"],
                        [0, "cout << restored << '\\n';"]
                    ])
                ]
            }
        ]
    };
})();
