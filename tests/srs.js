// FSRS sanity checks (runs in Node with a tiny localStorage shim).
globalThis.window = globalThis;
globalThis.addEventListener = () => {};
const mem = {};
globalThis.localStorage = { getItem: (k) => mem[k] ?? null, setItem: (k, v) => { mem[k] = v; } };
const { review, retrievability } = await import('../js/core/srs.js');
const DAY = 864e5;
let fail = 0;
const ok = (cond, msg) => { if (!cond) { fail++; console.log('✗', msg); } };

// A card answered "good" every time it falls due: intervals should grow steadily.
let c = { id: 'x', state: 'new' }, t = Date.now();
const intervals = [];
for (let i = 0; i < 6; i++) { c = review(c, 3, t); intervals.push(Math.round((c.due - t) / DAY)); t = c.due; }
console.log('good-good-good… intervals (days):', intervals.join(', '));
ok(intervals.every((d, i) => i === 0 || d > intervals[i - 1]), 'intervals grow');
ok(intervals[0] >= 2 && intervals[0] <= 4, 'first interval ≈ 3 days');

// A lapse shrinks stability and puts the card back in (re)learning.
const before = c.s;
c = review(c, 1, t);
ok(c.state === 'relearning' && c.s < before, 'lapse lowers stability');
ok(c.due - t <= 15 * 60000, 'lapse re-shown within minutes');

// Easy > good > hard for a mature card
const base = { ...c, state: 'review', s: 10, d: 5, last: t - 10 * DAY };
const iv = (g) => review(base, g, t).due - t;
ok(iv(4) > iv(3) && iv(3) > iv(2), 'easy > good > hard');
ok(Math.abs(retrievability(10, 10) - 0.9) < 1e-9, 'R(S, S) = 0.9');
console.log(fail ? `${fail} failed` : 'all FSRS checks passed');
process.exit(fail ? 1 : 0);
