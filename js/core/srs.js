// FSRS-5 spaced-repetition scheduler (default parameters, desired retention 0.9).
// Cards come from every module: vocabulary, missed grammar items, dictation sentences,
// corrected sentences from the learner's own writing, conjugation slips.
import { store, today } from './store.js';

const W = [0.40255, 1.18385, 3.173, 15.69105, 7.1949, 0.5345, 1.4604, 0.0046, 1.54575, 0.1192, 1.01925,
  1.9395, 0.11, 0.29605, 2.2698, 0.2315, 2.9898, 0.51655, 0.6621];
const F = 19 / 81, C = -0.5;
const DAY = 86400000, MIN = 60000;
const MAX_INTERVAL = 365;
export const GRADES = { again: 1, hard: 2, good: 3, easy: 4 };

const clampD = (d) => Math.min(10, Math.max(1, d));
export const retrievability = (t, s) => Math.pow(1 + (F * t) / s, C);
const intervalFor = (s, r) => (s / F) * (Math.pow(r, 1 / C) - 1);
const initS = (g) => W[g - 1];
const initD = (g) => clampD(W[4] - Math.exp(W[5] * (g - 1)) + 1);
function nextD(d, g) {
  const delta = -W[6] * (g - 3);
  const d1 = d + (delta * (10 - d)) / 9;
  return clampD(W[7] * initD(4) + (1 - W[7]) * d1);
}
function successS(d, s, r, g) {
  const hard = g === 2 ? W[15] : 1, easy = g === 4 ? W[16] : 1;
  return s * (1 + Math.exp(W[8]) * (11 - d) * Math.pow(s, -W[9]) * (Math.exp(W[10] * (1 - r)) - 1) * hard * easy);
}
function failS(d, s, r) {
  return Math.min(s, W[11] * Math.pow(d, -W[12]) * (Math.pow(s + 1, W[13]) - 1) * Math.exp(W[14] * (1 - r)));
}
const shortTermS = (s, g) => s * Math.exp(W[17] * (g - 3 + W[18]));

function scheduleDays(s) {
  const r = store.state.settings.retention || 0.9;
  let days = Math.max(1, Math.round(intervalFor(s, r)));
  if (days > 3) days = Math.round(days * (0.95 + Math.random() * 0.1)); // fuzz to avoid clumping
  return Math.min(MAX_INTERVAL, days);
}

// Pure scheduling step: returns the updated card.
export function review(card, grade, now = Date.now()) {
  const c = { ...card };
  c.reps = (c.reps || 0) + 1;
  if (!c.state || c.state === 'new') {
    c.s = initS(grade); c.d = initD(grade);
    if (grade === 1) { c.state = 'learning'; c.due = now + MIN; }
    else if (grade === 2) { c.state = 'learning'; c.due = now + 6 * MIN; }
    else { c.state = 'review'; c.due = now + scheduleDays(c.s) * DAY; }
  } else {
    const elapsedDays = c.last ? (now - c.last) / DAY : 0;
    if (elapsedDays < 1 || c.state === 'learning' || c.state === 'relearning') {
      c.s = Math.max(0.1, shortTermS(c.s, grade));
      c.d = nextD(c.d, grade);
      if (grade === 1) { c.due = now + MIN; c.state = c.state === 'review' ? 'relearning' : c.state; }
      else if (grade === 2 && c.state !== 'review') c.due = now + 10 * MIN;
      else { c.state = 'review'; c.due = now + scheduleDays(c.s) * DAY; }
    } else {
      const r = retrievability(elapsedDays, c.s);
      c.d = nextD(c.d, grade);
      if (grade === 1) {
        c.s = failS(c.d, c.s, r); c.lapses = (c.lapses || 0) + 1;
        c.state = 'relearning'; c.due = now + 10 * MIN;
      } else {
        c.s = successS(c.d, c.s, r, grade);
        c.state = 'review'; c.due = now + scheduleDays(c.s) * DAY;
      }
    }
  }
  c.last = now;
  return c;
}

// Preview the next interval for each grade (shown on the rating buttons).
export function previewIntervals(card, now = Date.now()) {
  const out = {};
  for (const [k, g] of Object.entries(GRADES)) {
    const saved = Math.random; Math.random = () => 0.5;
    const n = review(card, g, now);
    Math.random = saved;
    out[k] = formatInterval(n.due - now);
  }
  return out;
}
export function formatInterval(ms) {
  if (ms < 60 * MIN) return `${Math.max(1, Math.round(ms / MIN))} min`;
  if (ms < DAY) return `${Math.round(ms / (60 * MIN))} h`;
  const d = Math.round(ms / DAY);
  if (d < 31) return `${d} d`;
  if (d < 365) return `${Math.round(d / 30)} mo`;
  return `${(d / 365).toFixed(1)} y`;
}

// ---- Card collection helpers --------------------------------------------------------
export function addCard(id, type, data, { source = 'manual', priority = false } = {}) {
  const cards = store.state.cards;
  if (cards[id]) return false;
  cards[id] = { id, type, data, source, state: 'new', added: Date.now(), priority };
  store.save();
  return true;
}
export function removeCard(id) { delete store.state.cards[id]; store.save(); }
export function gradeCard(id, grade) {
  const card = store.state.cards[id];
  if (!card) return null;
  const wasNew = !card.state || card.state === 'new';
  const updated = review(card, grade);
  store.state.cards[id] = updated;
  if (wasNew) {
    const n = store.state.newToday;
    if (n.date !== today()) { n.date = today(); n.count = 0; }
    n.count++;
  }
  store.save();
  return updated;
}

export function stats(now = Date.now()) {
  const all = Object.values(store.state.cards);
  const due = all.filter((c) => c.state && c.state !== 'new' && c.due <= now);
  const fresh = all.filter((c) => !c.state || c.state === 'new');
  const mature = all.filter((c) => c.state === 'review' && c.s >= 21);
  return { total: all.length, due: due.length, new: fresh.length, mature: mature.length, all };
}

export function newRemainingToday() {
  const n = store.state.newToday;
  const used = n.date === today() ? n.count : 0;
  return Math.max(0, (store.state.profile.newPerDay ?? 10) - used);
}

// Build a review queue: due cards first (most overdue relative to stability first),
// then priority new cards (the learner's own errors), then new cards up to the daily limit.
export function buildQueue({ limit = 60, now = Date.now() } = {}) {
  const all = Object.values(store.state.cards);
  const due = all.filter((c) => c.state && c.state !== 'new' && c.due <= now)
    .sort((a, b) => retrievability((now - a.last) / DAY, a.s) - retrievability((now - b.last) / DAY, b.s));
  const fresh = all.filter((c) => !c.state || c.state === 'new');
  const priority = fresh.filter((c) => c.priority).sort((a, b) => a.added - b.added).slice(0, 20);
  const normal = fresh.filter((c) => !c.priority).sort((a, b) => (a.order ?? a.added) - (b.order ?? b.added))
    .slice(0, newRemainingToday());
  return [...due, ...priority, ...normal].slice(0, limit);
}

// Forecast of due cards for the next n days (for the progress chart).
export function forecast(days = 14, now = Date.now()) {
  const out = Array(days).fill(0);
  for (const c of Object.values(store.state.cards)) {
    if (!c.state || c.state === 'new') continue;
    const d = Math.floor((c.due - now) / DAY);
    out[Math.max(0, Math.min(days - 1, d))]++;
  }
  return out;
}
