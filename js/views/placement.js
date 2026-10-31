// Nivel: three-part placement test.
//  1. Yes/no vocabulary-size test with pseudowords (guessing-corrected).
//  2. Computer-adaptive test (Rasch/3PL, EAP ability estimate) across grammar, vocabulary,
//     reading and listening — the vocabulary score sets the starting point, like DIALANG.
//  3. CEFR can-do self-assessment for speaking and writing.
import { h, mount, btn, card, icon, shuffle, levelBadge, toast } from '../core/ui.js';
import { store, logDone } from '../core/store.js';
import { VOCAB_BANDS, PSEUDOWORDS, ITEMS, LEVEL_B, CAN_DO, CEFR_DESC } from '../data/placement.js';
import { LEVELS } from '../data/grammar.js';
import { speak, nextVoice, voicePool } from '../core/speech.js';
import { topicsByLevel } from '../data/grammar.js';

export const strand = 'language';

const GRID = Array.from({ length: 161 }, (_, i) => -4 + i * 0.05);
const A = 1.1; // common discrimination
const prob = (theta, b, c) => c + (1 - c) / (1 + Math.exp(-A * (theta - b)));
function eap(responses, mu = 0, sd = 1.2) {
  const post = GRID.map((t) => {
    let lp = -((t - mu) ** 2) / (2 * sd * sd);
    for (const r of responses) { const p = prob(t, r.b, r.c); lp += Math.log(r.x ? p : 1 - p); }
    return lp;
  });
  const max = Math.max(...post);
  const w = post.map((v) => Math.exp(v - max));
  const z = w.reduce((a, b) => a + b, 0);
  const mean = GRID.reduce((a, t, i) => a + t * w[i], 0) / z;
  const varr = GRID.reduce((a, t, i) => a + (t - mean) ** 2 * w[i], 0) / z;
  return { theta: mean, se: Math.sqrt(varr) };
}
function info(theta, b, c) {
  const p = prob(theta, b, c);
  return (A * A * (p - c) ** 2 * (1 - p)) / ((1 - c) ** 2 * p);
}
export function thetaToLevel(t) {
  const L = t < -2 ? 'A1' : t < -1 ? 'A2' : t < 0 ? 'B1' : t < 1 ? 'B2' : t < 2 ? 'C1' : 'C2';
  const base = { A1: -3, A2: -2, B1: -1, B2: 0, C1: 1, C2: 2 }[L];
  const frac = Math.max(0, Math.min(0.999, t - base));
  return { level: L, sub: frac < 0.34 ? 'low' : frac < 0.67 ? 'mid' : 'high', frac };
}
const vocabLevel = (size) => (size < 1000 ? 'A1' : size < 2000 ? 'A2' : size < 3500 ? 'B1' : size < 5000 ? 'B2' : size < 8000 ? 'C1' : 'C2');

export async function render(root) {
  const last = store.state.placement.slice(-1)[0];
  mount(root,
    h('div', { class: 'page-head' }, h('h1', 'Prueba de nivel'),
      h('p', { class: 'lead' }, 'About 15 minutes. Three parts, each based on how serious placement tests work. Don’t guess: “I don’t know” gives a more accurate result than a lucky click.')),
    h('div', { class: 'grid grid-3' },
      card(h('div', { class: 'tile-tag' }, 'Part 1 · 3 min'), h('h3', 'Vocabulary size'), h('p', { class: 'small muted' }, '70 words: do you know them? Some are invented — saying “yes” to those lowers your score, which corrects for guessing.')),
      card(h('div', { class: 'tile-tag' }, 'Part 2 · 10 min'), h('h3', 'Adaptive test'), h('p', { class: 'small muted' }, 'Grammar, vocabulary, reading and listening. Each answer updates an estimate of your level and picks the most informative next question.')),
      card(h('div', { class: 'tile-tag' }, 'Part 3 · 2 min'), h('h3', 'Can-do statements'), h('p', { class: 'small muted' }, 'Speaking and writing are hard to test automatically, so you rate yourself against official CEFR descriptors.'))),
    h('div', { class: 'row' }, btn(['Start the test ', icon('arrow', 16)], () => vocabPart(root), 'primary big'),
      last ? btn('See my last result', () => showResult(root, last), 'ghost') : null),
    last ? h('p', { class: 'small muted', style: { marginTop: '12px' } }, `Last result: ${last.level} (${new Date(last.ts).toLocaleDateString()}). Retake every 2–3 months to track progress.`) : null);
}

// ---- Part 1 ----------------------------------------------------------------------------
function vocabPart(root) {
  const items = shuffle([
    ...VOCAB_BANDS.flatMap((b, bi) => b.words.map((w) => ({ w, band: bi }))),
    ...PSEUDOWORDS.map((w) => ({ w, band: -1 })),
  ]);
  const answers = [];
  let i = 0;
  const wrap = h('div');
  mount(root, h('div', { class: 'page-head' }, h('h2', 'Part 1 · Vocabulary'), h('p', { class: 'lead' }, 'Do you know what this word means? Answer quickly and honestly. Keys: ← no, → yes.')), wrap);
  const answer = (yes) => {
    answers.push({ ...items[i], yes });
    i++;
    if (i >= items.length) { document.removeEventListener('keydown', onKey); return finishVocab(root, answers); }
    show();
  };
  const onKey = (e) => { if (e.key === 'ArrowRight' || e.key.toLowerCase() === 's' || e.key.toLowerCase() === 'y') answer(true); else if (e.key === 'ArrowLeft' || e.key.toLowerCase() === 'n') answer(false); };
  document.addEventListener('keydown', onKey);
  const show = () => wrap.replaceChildren(
    h('div', { class: 'progress-top' }, h('span', { class: 'small muted' }, `${i + 1} / ${items.length}`), h('div', { class: 'bar' }, h('div', { class: 'bar-fill', style: { width: `${(i / items.length) * 100}%` } }))),
    h('div', { class: 'ex-card' }, h('div', { class: 'word-big' }, items[i].w),
      h('div', { class: 'yesno' }, btn('✗ No', () => answer(false), 'big'), btn('✓ Sí, la conozco', () => answer(true), 'big primary'))));
  show();
}

function finishVocab(root, answers) {
  const pseudo = answers.filter((a) => a.band === -1);
  const f = pseudo.filter((a) => a.yes).length / pseudo.length;
  let size = 0;
  const bands = VOCAB_BANDS.map((b, bi) => {
    const real = answers.filter((a) => a.band === bi);
    const hRate = real.filter((a) => a.yes).length / real.length;
    const corrected = f >= 1 ? 0 : Math.max(0, (hRate - f) / (1 - f));
    size += corrected * b.size;
    return { label: b.label, hit: hRate, corrected };
  });
  const vocab = { size: Math.round(size / 50) * 50, falseAlarm: f, bands, level: vocabLevel(size) };
  adaptivePart(root, vocab);
}

// ---- Part 2 ----------------------------------------------------------------------------
function adaptivePart(root, vocab) {
  const pool = ITEMS.map((it, idx) => ({ ...it, idx, b: LEVEL_B[it.l] + (Math.random() - 0.5) * 0.3, c: 1 / (it.o.length + 1) }));
  const mu = LEVEL_B[vocab.level] + 0.3;
  const responses = [];
  const used = new Set();
  const order = ['g', 'v', 'r', 'g', 'l', 'g', 'v', 'r', 'l'];
  let est = { theta: mu, se: 1.2 };
  const wrap = h('div');
  mount(root, h('div', { class: 'page-head' }, h('h2', 'Part 2 · Adaptive test'), h('p', { class: 'lead' }, 'Questions get harder or easier depending on your answers. Listening items can be played twice.')), wrap);
  const voices = voicePool();

  const nextItem = () => {
    const n = responses.length;
    if (n >= 30 || (n >= 16 && est.se < 0.33)) return finish();
    const want = order[n % order.length];
    let cands = pool.filter((p) => !used.has(p.idx) && p.s === want);
    if (!cands.length) cands = pool.filter((p) => !used.has(p.idx));
    if (!cands.length) return finish();
    cands.sort((a, b) => info(est.theta, b.b, b.c) - info(est.theta, a.b, a.c));
    const it = cands[Math.floor(Math.random() * Math.min(3, cands.length))];
    used.add(it.idx);
    show(it);
  };
  const record = (it, x) => {
    responses.push({ b: it.b, c: it.c, x, s: it.s, l: it.l });
    est = eap(responses, mu, 1.2);
    nextItem();
  };
  const show = (it) => {
    const opts = shuffle(it.o.map((o, k) => ({ o, ok: k === 0 })));
    let plays = 0;
    const lines = it.s === 'l' ? it.p.split(' / ') : [];
    const play = async (bt) => {
      if (plays >= 2) return toast('Two plays maximum in the test.');
      plays++; bt.disabled = true;
      for (const [k, line] of lines.entries()) await speak(line, { voice: voices.length > 1 ? voices[k % Math.min(voices.length, 2)] : undefined });
      bt.disabled = plays >= 2;
    };
    const n = responses.length;
    const playBtn = it.s === 'l' ? btn([icon('play', 18), ' Play'], (e) => play(e.currentTarget), 'primary') : null;
    wrap.replaceChildren(
      h('div', { class: 'progress-top' }, h('span', { class: 'small muted' }, `Question ${n + 1}`), h('div', { class: 'bar' }, h('div', { class: 'bar-fill', style: { width: `${Math.min(100, (n / 22) * 100)}%` } }))),
      h('div', { class: 'ex-card' },
        h('div', { class: 'ex-meta' }, h('span', { class: 'tag' }, { g: 'Grammar', v: 'Vocabulary', r: 'Reading', l: 'Listening' }[it.s])),
        it.s === 'r' ? h('div', { class: 'fix-wrong', style: { fontSize: '1.08rem' } }, it.p) : null,
        it.s === 'l' ? h('div', { class: 'player', style: { marginBottom: '14px' } }, playBtn, h('span', { class: 'small muted' }, 'Listen first, then answer.')) : null,
        h('div', { class: 'ex-prompt es', style: { fontSize: it.s === 'g' ? '1.35rem' : '1.1rem' } }, it.q),
        h('div', { class: 'options' }, opts.map(({ o, ok }) => h('button', { class: 'opt', onclick: () => record(it, ok ? 1 : 0) }, o))),
        h('div', { class: 'ex-actions' }, btn('I don’t know', () => record(it, 0), 'ghost'))));
    if (it.s === 'l') setTimeout(() => play(playBtn), 400);
  };
  const finish = () => {
    const skills = {};
    for (const s of ['g', 'v', 'r', 'l']) {
      const rs = responses.filter((r) => r.s === s);
      if (rs.length) skills[s] = { ...eap(rs, est.theta, 1.0), n: rs.length };
    }
    selfPart(root, { vocab, theta: est.theta, se: est.se, n: responses.length, skills });
  };
  nextItem();
}

// ---- Part 3 ----------------------------------------------------------------------------
function selfPart(root, partial) {
  const checks = { speaking: new Set(), writing: new Set() };
  const list = (skill) => CAN_DO[skill].map(([lvl, text], i) => {
    const inp = h('input', { type: 'checkbox', onchange: () => (inp.checked ? checks[skill].add(i) : checks[skill].delete(i)) });
    return h('label', { class: 'check', style: { padding: '6px 0', alignItems: 'flex-start' } }, inp, h('span', null, text));
  });
  mount(root, h('div', { class: 'page-head' }, h('h2', 'Part 3 · What can you do?'), h('p', { class: 'lead' }, 'Tick every statement that is true for you today — without a dictionary and without much preparation.')),
    h('div', { class: 'grid grid-2' }, card(h('h3', 'Speaking'), list('speaking')), card(h('h3', 'Writing'), list('writing'))),
    h('div', { class: 'row' }, btn(['See my results ', icon('arrow', 16)], () => {
      const self = {};
      for (const skill of ['speaking', 'writing']) {
        let lvl = 'A1';
        for (const L of ['A1', 'A2', 'B1', 'B2', 'C1']) {
          const got = CAN_DO[skill].filter(([l], i) => l === L && checks[skill].has(i)).length;
          if (got === 0) break;
          lvl = L;
          if (got < 2) break; // only partly true at this level → stop here
        }
        self[skill] = lvl;
      }
      const result = { ts: Date.now(), ...partial, self, ...thetaToLevel(partial.theta) };
      saveResult(result);
      showResult(root, result);
    }, 'primary big')));
}

function saveResult(r) {
  const P = store.state.profile;
  const reviewedVocab = Object.values(store.state.cards).some((c) => c.type === 'vocab' && c.state && c.state !== 'new');
  store.state.placement.push(r);
  P.level = r.level; P.levelSource = 'placement';
  P.skills = {
    grammar: r.skills.g ? thetaToLevel(r.skills.g.theta).level : r.level,
    vocabulary: r.vocab.level,
    reading: r.skills.r ? thetaToLevel(r.skills.r.theta).level : r.level,
    listening: r.skills.l ? thetaToLevel(r.skills.l.theta).level : r.level,
    speaking: r.self.speaking, writing: r.self.writing,
  };
  if (LEVELS.indexOf(P.goalLevel) <= LEVELS.indexOf(r.level)) P.goalLevel = LEVELS[Math.min(5, LEVELS.indexOf(r.level) + 1)];
  if (!reviewedVocab) {
    for (const [id, c] of Object.entries(store.state.cards)) if (c.type === 'vocab' && (!c.state || c.state === 'new')) delete store.state.cards[id];
    store.state.deckCursor = 0;
  }
  logDone('placement');
  store.save();
}

function showResult(root, r) {
  const skillRows = [
    ['Grammar', r.skills?.g ? thetaToLevel(r.skills.g.theta) : null, 'measured'],
    ['Vocabulary', { level: r.vocab.level }, `≈ ${r.vocab.size.toLocaleString()} words`],
    ['Reading', r.skills?.r ? thetaToLevel(r.skills.r.theta) : null, 'measured'],
    ['Listening', r.skills?.l ? thetaToLevel(r.skills.l.theta) : null, 'measured'],
    ['Speaking', { level: r.self.speaking }, 'self-assessed'],
    ['Writing', { level: r.self.writing }, 'self-assessed'],
  ];
  const li = LEVELS.indexOf(r.level);
  const startTopics = topicsByLevel(r.level === 'C2' ? 'C1' : r.level).slice(0, 4);
  const gaps = skillRows.filter(([, v]) => v && LEVELS.indexOf(v.level) < li).map(([k]) => k.toLowerCase());
  mount(root,
    h('div', { class: 'page-head' }, h('h1', 'Your result'), h('p', { class: 'lead' }, CEFR_DESC[r.level])),
    card(h('div', { class: 'row between' },
      h('div', null, h('div', { class: 'summary-big' }, r.level, h('span', { style: { fontSize: '1.1rem', color: 'var(--muted)', marginLeft: '10px' } }, `${{ low: 'lower', mid: 'mid', high: 'upper' }[r.sub] || ''} ${r.level}`)),
        h('p', { class: 'small muted' }, `Based on ${r.n} adaptive questions (±${(r.se * 1).toFixed(2)} logits) and a guessing-corrected vocabulary estimate.`)),
      h('div', { style: { minWidth: '280px', flex: 1, maxWidth: '420px' } }, h('div', { class: 'cefr-scale' }, LEVELS.map((L) => h('div', { class: L === r.level ? 'on' : '' }, L))))),
      h('table', { class: 'conj-table', style: { marginTop: '10px' } }, skillRows.map(([name, v, note]) => h('tr', null,
        h('td', name), h('td', null, v ? levelBadge(v.level) : h('span', { class: 'muted' }, '—'), ' ', h('span', { class: 'small muted' }, note)))))),
    card(h('h3', 'What this means for your training'),
      h('ul', null,
        h('li', null, 'Listening texts, dictations and writing tasks are recommended at ', levelBadge(r.level), r.level === 'C2' ? ' — at this level, authentic material (podcasts, novels, films) should be your main input.' : ' and one step above — comprehensible but stretching (i+1).'),
        h('li', null, 'Grammar: start with ', startTopics.map((t, i) => [i ? ', ' : '', h('a', { href: `#/grammar/${t.id}` }, t.title)]), ' — but quickly check the topics below your level; gaps there cause the most errors.'),
        gaps.length ? h('li', null, `Your ${gaps.join(' and ')} ${gaps.length > 1 ? 'are' : 'is'} behind your overall level — the daily plan will push those strands.`) : null,
        h('li', null, `Vocabulary: the core deck starts at the right place for you. ${r.vocab.falseAlarm > 0.25 ? 'You said yes to several invented words — be stricter with yourself in reviews.' : ''}`)),
      h('div', { class: 'ex-actions' }, btn(['Go to today’s plan ', icon('arrow', 16)], () => { location.hash = '#/'; }, 'primary'), btn('Retake later', () => { location.hash = '#/placement'; }, 'ghost'))));
}
