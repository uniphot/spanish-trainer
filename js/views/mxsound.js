// Así suena México: decoding practice for the sounds, reductions and fillers of Mexican speech,
// and the phrases you hear in everyday scenes. Audio comes first: you see the words only after
// you've answered. Lines you miss go into review as dictation cards.
import { h, mount, btn, card, icon, shuffle, sample, toast } from '../core/ui.js';
import { store, logDone } from '../core/store.js';
import { speak, stopSpeaking, mexicanVoice, ttsSupported } from '../core/speech.js';
import { addCard } from '../core/srs.js';
import { MX_UNITS, REAL_FEATURES } from '../data/mx-sound.js';

const ROUND = 10;
const unitItems = (u) => u.items || u.lines.map(([say, en, reply, note]) => ({ say, en, reply, note }));

export function renderMx(root, params, ctx) {
  ctx.setStrand('language');
  const u = MX_UNITS.find((x) => x.id === params[1]);
  return u ? unitPage(root, u) : hub(root);
}

function unitTile(u) {
  const best = store.state.mxSound[u.id]?.best;
  return h('a', { class: 'topic', href: `#/listening/mexico/${u.id}` },
    h('div', { style: { flex: 1 } }, h('div', { class: 't-title' }, u.es), h('div', { class: 't-en' }, u.en)),
    best != null ? h('span', { class: 'tag' }, `${Math.round(best * 100)}%`) : null);
}

function hub(root) {
  const voice = mexicanVoice();
  mount(root,
    h('div', { class: 'page-head' }, h('div', { class: 'crumbs' }, h('a', { href: '#/listening' }, '← Escuchar')), h('h1', 'Así suena México'),
      h('p', { class: 'lead' }, 'Why you can read Spanish but lose it when a Mexican speaks, and how to fix that. First the sounds, then the phrases you’ll hear in the situations you’ll actually be in.')),
    !voice && ttsSupported() ? h('div', { class: 'note' }, 'This device has no Mexican voice, so another Spanish voice will read these. Add a Mexican voice in your system settings for a closer match (on Apple devices, Paulina).') : null,
    h('h3', 'Cómo suena'), h('p', { class: 'small muted' }, 'What real speech does to the words you know.'),
    h('div', { class: 'grid grid-2' }, MX_UNITS.filter((u) => u.group === 'sounds').map(unitTile)),
    h('h3', { style: { marginTop: '22px' } }, 'Escenas'), h('p', { class: 'small muted' }, 'If you know what someone is likely to say, you’ll catch it even when you miss half the sounds. Hear each line first, then choose what it means.'),
    h('div', { class: 'grid grid-2' }, MX_UNITS.filter((u) => u.group === 'scenes').map(unitTile)),
    card(h('h3', 'What a synthetic voice can’t show you'),
      h('p', { class: 'small muted' }, 'These lessons use a synthetic voice, which pronounces every word carefully. Real people don’t. Listen for these in real shows:'),
      REAL_FEATURES.map((f) => h('div', { style: { marginBottom: '10px' } }, h('b', f.title), h('div', { class: 'small' }, f.text))),
      h('a', { class: 'btn primary', href: '#/listening/real' }, 'Go to real recordings')));
}

function unitPage(root, u) {
  const crumbs = h('div', { class: 'crumbs' }, h('a', { href: '#/listening/mexico' }, '← Así suena México'));
  const start = () => drill(root, u, crumbs);
  mount(root,
    h('div', { class: 'page-head' }, crumbs, h('h1', u.es), h('p', { class: 'lead' }, u.en)),
    u.intro ? card(u.intro.map((p) => h('p', null, p))) : null,
    card(h('h3', u.items ? 'Listen first' : 'En esta escena'),
      u.items ? h('p', { class: 'small muted' }, 'You’ll hear each one and pick the answer. The words appear after you’ve chosen.')
        : h('p', { class: 'small muted' }, 'You’ll hear what people say to you and choose what it means. No text until you’ve answered, as in real life.'),
      h('div', { class: 'ex-actions' }, btn('Start', start, 'primary'))),
    h('details', { class: 'guide' }, h('summary', 'See the whole list'),
      h('div', { class: 'stack' }, unitItems(u).map((it) => h('div', { class: 'err-row small' },
        h('button', { class: 'say', onclick: () => speak(it.tts || it.say, { voice: mexicanVoice() }), 'aria-label': 'Listen' }, icon('play', 13)),
        h('div', { style: { flex: 1 } }, h('b', { class: 'es' }, it.say), it.sounds ? h('span', { class: 'muted' }, ` · ${it.sounds}`) : null, h('div', { class: 'muted' }, it.en)))))));
  return () => stopSpeaking();
}

function drill(root, u, crumbs) {
  const voice = mexicanVoice();
  const all = unitItems(u);
  const items = sample(all, Math.min(ROUND, all.length));
  const wrap = h('div');
  let i = 0, right = 0;
  const missed = [];
  mount(root, h('div', { class: 'page-head' }, crumbs, h('h1', u.es)), wrap);

  const options = (it) => {
    if (u.drill === 'role') return { list: u.roles, answer: u.roles[it.role] };
    const field = { text: 'say', full: 'full', meaning: 'en' }[u.drill];
    const others = sample(all.filter((x) => x !== it && x[field] !== it[field]).map((x) => x[field]), 3);
    return { list: shuffle([it[field], ...others]), answer: it[field] };
  };

  const summary = () => {
    const score = right / items.length;
    const prev = store.state.mxSound[u.id];
    store.state.mxSound[u.id] = { best: Math.max(score, prev?.best || 0), ts: Date.now() };
    store.save(); logDone('mx-sound');
    wrap.replaceChildren(card(h('h3', `${right} of ${items.length}`),
      missed.length ? h('p', null, `The ${missed.length === 1 ? 'one you missed is' : `${missed.length} you missed are`} now in Repaso as dictation cards.`) : h('p', null, '¡Órale! All of them. Now try real speech.'),
      h('div', { class: 'ex-actions' }, btn('Again', () => drill(root, u, crumbs), 'primary'), h('a', { class: 'btn', href: '#/listening/mexico' }, 'More units'), h('a', { class: 'btn ghost', href: '#/listening/real' }, 'Real recordings'))));
  };

  const show = () => {
    if (i >= items.length) return summary();
    const it = items[i];
    const say = (rate) => speak(it.tts || it.say, { voice, rate: rate ?? 1.05 });
    const { list, answer } = options(it);
    const fb = h('div');
    let answered = false;
    const opts = list.map((o) => h('button', { class: 'opt', onclick: (e) => {
      if (answered) return;
      answered = true;
      const ok = o === answer;
      if (ok) right++;
      else { missed.push(it); addCard(`s:${it.say.slice(0, 50)}`, 'sentence', { text: it.tts ? it.full || it.say : it.say, en: it.en }, { source: 'dictation', priority: true }); }
      opts.forEach((b) => { b.disabled = true; if (b.textContent === answer) b.classList.add('ok'); });
      if (!ok) e.currentTarget.classList.add('bad');
      fb.replaceChildren(h('div', { class: `feedback ${ok ? 'ok' : 'bad'}` }, h('div', { class: 'fb-body' },
        h('div', { class: 'fb-title' }, ok ? '¡Eso!' : 'Not this time'),
        h('div', { class: 'full' }, it.say),
        it.sounds ? h('div', { class: 'small muted' }, `Sounds like: ${it.sounds}`) : null,
        it.full && it.full !== answer ? h('div', { class: 'small' }, it.full) : null,
        h('div', { class: 'small' }, it.en),
        it.note ? h('div', { class: 'small muted' }, it.note) : null,
        it.reply ? h('div', { class: 'small' }, h('b', 'You could say: '), it.reply) : null), h('button', { class: 'say', onclick: () => say(), 'aria-label': 'Listen again' }, icon('play', 16))),
      h('div', { class: 'ex-actions' }, btn([i + 1 < items.length ? 'Next ' : 'Finish ', icon('arrow', 16)], () => { i++; show(); }, 'primary')));
    } }, o));
    wrap.replaceChildren(h('div', { class: 'small muted', style: { marginBottom: '8px' } }, `${i + 1} / ${items.length}`),
      h('div', { class: 'ex-card' },
        h('div', { class: 'row', style: { marginBottom: '14px' } },
          h('button', { class: 'say big', onclick: () => say(), 'aria-label': 'Listen' }, icon('play', 24)),
          btn('Slower', () => say(0.7), 'small'),
          h('span', { class: 'small muted' }, u.drill === 'role' ? 'What is the speaker doing?' : u.drill === 'meaning' ? 'What does it mean?' : u.drill === 'full' ? 'What’s the full form?' : 'What did you hear?')),
        h('div', { class: 'stack' }, opts), fb));
    say();
  };
  show();
  return undefined;
}
