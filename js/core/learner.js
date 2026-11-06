// Learner model: grammar-topic mastery with spaced topic review, error profile, and the
// daily plan built on Nation's four strands.
import { store, today, minutesByStrand, logError } from './store.js';
import { TOPICS, topic as getTopic, LEVELS } from '../data/grammar.js';
import { addCard, stats, newRemainingToday } from './srs.js';

const DAY = 86400000;

export function hashStr(s) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
  return (h >>> 0).toString(36);
}
export const itemKey = (topicId, src) => `${topicId}:${hashStr(src)}`;

export function topicState(id) {
  const t = (store.state.topics[id] ||= { hist: [], items: {}, intro: false });
  t.items ||= {};
  t.hist ||= [];
  return t;
}

// Record one answered item (score 0..1). Missed items become SRS cards.
export function recordItem(topicId, src, score, { source = 'grammar', card = true } = {}) {
  const t = topicState(topicId);
  const now = Date.now();
  t.hist.push([now, score]);
  if (t.hist.length > 80) t.hist.splice(0, t.hist.length - 80);
  const key = hashStr(src);
  const it = (t.items[key] ||= { n: 0, c: 0, last: 0 });
  it.n++; it.c += score; it.last = now; it.lastScore = score;
  if (score < 1 && card) {
    addCard(`g:${topicId}:${key}`, 'grammar', { topic: topicId, src }, { source, priority: true });
    if (score === 0) logError({ source, cat: 'grammar', topic: topicId, text: src.replace(/\s*~.*$/, '') });
  }
  store.save();
}

// Mastery: recency-weighted accuracy of the last 24 answers.
export function mastery(id) {
  const t = store.state.topics[id];
  if (!t || !t.hist?.length) return { m: 0, n: 0, last: null, status: 'new', due: false, days: null };
  const hist = t.hist.slice(-24);
  let num = 0, den = 0;
  hist.forEach(([, s], i) => { const w = Math.pow(0.92, hist.length - 1 - i); num += w * s; den += w; });
  const m = num / den;
  const last = t.hist[t.hist.length - 1][0];
  const days = (Date.now() - last) / DAY;
  const n = t.hist.length;
  const status = n < 6 ? 'learning' : m >= 0.9 && n >= 15 ? 'mastered' : m >= 0.75 ? 'good' : 'learning';
  // expanding review intervals for topics (1, 3, 7, 16, 35 days)
  const interval = status === 'mastered' ? 35 : m >= 0.85 ? 16 : m >= 0.75 ? 7 : m >= 0.5 ? 3 : 1;
  return { m, n, last, status, days, due: days >= interval, interval };
}

export const levelIndex = (lvl) => Math.max(0, LEVELS.indexOf(lvl || 'A1'));

// Topics recommended for "learn next": first unstarted topic at or below the learner's level+1.
// Order: topics at your level first, then one level up, then gaps below your level.
export function nextNewTopics(n = 3) {
  const li = levelIndex(store.state.profile.level || 'A1');
  const fresh = TOPICS.filter((t) => !store.state.topics[t.id]?.hist?.length);
  const rank = (t) => { const d = levelIndex(t.level) - li; return d === 0 ? 0 : d === 1 ? 1 : d < 0 ? 2 - d * 0.1 : 9; };
  return fresh.filter((t) => levelIndex(t.level) <= li + 1).sort((a, b) => rank(a) - rank(b)).slice(0, n);
}
export function startedTopics() { return TOPICS.filter((t) => store.state.topics[t.id]?.hist?.length); }
export function dueTopics() {
  return startedTopics().map((t) => ({ t, ms: mastery(t.id) })).filter((x) => x.ms.due)
    .sort((a, b) => a.ms.m - b.ms.m);
}
export function weakTopics(n = 5) {
  return startedTopics().map((t) => ({ t, ms: mastery(t.id) })).filter((x) => x.ms.n >= 4)
    .sort((a, b) => a.ms.m - b.ms.m).slice(0, n);
}

// Error profile: which grammar areas cause most mistakes across modules (last 60 days).
export function errorProfile(days = 60) {
  const since = Date.now() - days * DAY;
  const by = new Map();
  for (const e of store.state.errors) {
    if (e.ts < since) continue;
    const key = e.topic || e.cat || 'other';
    const row = by.get(key) || { key, n: 0, sources: new Set(), examples: [] };
    row.n++; row.sources.add(e.source);
    if (row.examples.length < 3 && e.text) row.examples.push(e);
    by.set(key, row);
  }
  return [...by.values()].sort((a, b) => b.n - a.n).map((r) => ({ ...r, topic: getTopic(r.key) || null, sources: [...r.sources] }));
}

// ---- Daily plan (four strands) ---------------------------------------------------------
// Returns ordered steps: retrieval first (SRS), then language-focused study, then
// meaning-focused input and output, then fluency. The strand that is most behind this week
// gets the longer slot.
export function dailyPlan() {
  const p = store.state.profile;
  const total = p.dailyMinutes || 30;
  const week = minutesByStrand(7);
  const sum = Object.values(week).reduce((a, b) => a + b, 0) || 1;
  const share = Object.fromEntries(Object.entries(week).map(([k, v]) => [k, v / sum]));
  const behind = Object.entries(share).sort((a, b) => a[1] - b[1])[0][0];
  const doneToday = new Set(store.state.log[today()]?.done || []);
  const s = stats();
  const steps = [];

  if (!p.level) {
    steps.push({ id: 'placement', strand: 'language', title: 'Take the level test', min: 15, href: '#/placement',
      why: 'Calibrates everything else: texts, topics and tasks are chosen just above your level (i+1).' });
  }
  const dueN = s.due + Math.min(newRemainingToday(), 5);
  if (dueN > 0 || s.total === 0) {
    steps.push({ id: 'review', strand: 'language', title: s.due ? `Review ${s.due} due card${s.due === 1 ? '' : 's'}` : 'Start your vocabulary deck', min: Math.min(10, Math.max(4, Math.round(s.due * 0.25) + 3)), href: '#/review',
      why: 'Retrieval practice at expanding intervals is the most reliable way to make knowledge stick (spacing + testing effect).' });
  }
  const due = dueTopics()[0];
  const fresh = nextNewTopics(1)[0];
  if (due) steps.push({ id: `g-${due.t.id}`, strand: 'language', title: `Grammar review: ${due.t.title}`, min: 6, href: `#/grammar/${due.t.id}?mode=practice`,
    why: `Last practised ${Math.round(due.ms.days)} days ago — revisiting just as it fades strengthens it most.` });
  else if (fresh) steps.push({ id: `g-${fresh.id}`, strand: 'language', title: `New grammar: ${fresh.title}`, min: 8, href: `#/grammar/${fresh.id}`,
    why: 'Explanation → interpret-first activities → practice: you notice the form in meaning before producing it.' });
  if (startedTopics().length >= 3) steps.push({ id: 'mix', strand: 'language', title: 'Mixed grammar practice', min: 5, href: '#/grammar/mix',
    why: 'Interleaving topics forces you to choose the right structure — that discrimination is what real use demands.' });

  steps.push({ id: 'news', strand: 'input', title: 'Read one article from today’s Mexico news', min: 8, href: '#/news',
    why: 'Authentic texts about the country you’re going to. Read for meaning, then retell it — input followed by output.' });
  const inputMin = behind === 'input' ? 10 : 7;
  // Alternate graded texts with real speech: most days should include real Mexican voices.
  if (new Date().getDay() % 3 === 0) steps.push({ id: 'listen', strand: 'input', title: 'Listening: one text through the full cycle', min: inputMin, href: '#/listening/comprehension',
    why: 'Meaning-focused input slightly above your level, with prediction, verification and reflection.' });
  else steps.push({ id: 'real-listen', strand: 'input', title: 'Real listening: a show from Escucha real', min: inputMin + 3, href: '#/listening/real',
    why: 'Understanding real speech comes from hours of it, from many speakers. Aim to follow about 90 %.' });
  const outMin = behind === 'output' ? 10 : 7;
  const dow = new Date().getDay();
  if (dow % 2 === 0) steps.push({ id: 'write', strand: 'output', title: 'Writing task + feedback', min: outMin, href: '#/writing',
    why: 'Output makes you notice gaps; feedback you act on (revise) is what improves accuracy.' });
  else steps.push({ id: 'speak', strand: 'output', title: 'Speaking: role-play or conversation', min: outMin, href: '#/speaking',
    why: 'Pushed output and interaction: you have to retrieve and assemble language under real-time pressure.' });
  const fluMin = behind === 'fluency' ? 8 : 5;
  steps.push(dow % 2 === 0
    ? { id: 'fluency', strand: 'fluency', title: '4/3/2 fluency talk', min: fluMin, href: '#/speaking/fluency', why: 'Repeating a talk with less time each round builds speed with language you already know.' }
    : { id: 'shadow', strand: 'fluency', title: 'Shadowing', min: fluMin, href: '#/speaking/shadowing', why: 'Speaking along with a model trains rhythm, linking and real-time processing.' });

  return { steps: steps.map((st) => ({ ...st, done: doneToday.has(st.id) })), week, behind, total };
}

export function levelFromProfile() { return store.state.profile.level || 'A2'; }
