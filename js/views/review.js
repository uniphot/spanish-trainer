// Repaso: the single spaced-repetition queue fed by every module.
import { h, mount, btn, icon, sayBtn, accentBar, smartAccents, card, tabs, toast, levelBadge, emptyState } from '../core/ui.js';
import { store, logDone, logError } from '../core/store.js';
import { buildQueue, gradeCard, previewIntervals, stats, addCard, removeCard, newRemainingToday, forecast } from '../core/srs.js';
import { DECK_ITEMS } from '../data/deck.js';
import { topic as getTopic, LEVELS } from '../data/grammar.js';
import { parseItem, renderExercise, solution, accentNote } from './exercise.js';
import { conjugate, acceptedForms, PERSONS, TENSES, verbInfo } from '../core/conjugator.js';
import { checkAnswer, alignWords } from '../core/text.js';
import { speak, nextVoice, playClip, stopClip } from '../core/speech.js';
import { levelIndex } from '../core/learner.js';

export const strand = 'language';

// Keep enough new vocabulary cards in the pipeline for today's allowance.
export function topUpDeck() {
  const want = newRemainingToday();
  const fresh = Object.values(store.state.cards).filter((c) => c.type === 'vocab' && (!c.state || c.state === 'new')).length;
  let need = Math.max(0, want - fresh);
  if (!store.state.deckCursor) {
    const li = levelIndex(store.state.profile.level || 'A1');
    const start = DECK_ITEMS.findIndex((d) => levelIndex(d.level) >= Math.max(0, li - 1));
    store.state.deckCursor = Math.max(0, start);
  }
  while (need > 0 && store.state.deckCursor < DECK_ITEMS.length) {
    const d = DECK_ITEMS[store.state.deckCursor++];
    if (addCard(`v:${d.i}`, 'vocab', { i: d.i }, { source: 'deck' })) { store.state.cards[`v:${d.i}`].order = d.i; need--; }
  }
  store.save();
}

export async function render(root, params) {
  if (params[0] === 'deck') return renderDeck(root);
  topUpDeck();
  const s = stats();
  const queue = buildQueue();
  const head = h('div', { class: 'page-head' }, h('h1', 'Repaso'),
    h('p', { class: 'lead' }, 'One queue for everything you need to remember: vocabulary, grammar items you missed, conjugation slips, dictation sentences and corrections from your own writing. Each card comes back just before you would forget it (FSRS algorithm).'),
    tabs([['session', `Review (${queue.length})`], ['deck', 'Cards & deck']], 'session', (id) => { location.hash = id === 'deck' ? '#/review/deck' : '#/review'; }));
  const body = h('div');
  mount(root, head, body);
  if (!queue.length) {
    const fc = forecast(7);
    body.append(card(emptyState('All done for now 🎉', `${s.total} cards in your collection, ${s.mature} mature. Next days: ${fc.slice(1).join(' · ')} cards due.`,
      h('div', { class: 'row', style: { justifyContent: 'center' } }, btn('Add more new words today', () => {
        store.state.profile.newPerDay = (store.state.profile.newPerDay || 10) + 5; store.save(); render(root, params);
      }), btn('Practise grammar', () => { location.hash = '#/grammar/mix'; }, 'primary')))));
    return;
  }
  return runReview(body, queue);
}

function runReview(root, queue) {
  const q = queue.slice();
  let done = 0, again = 0;
  const startedAt = Date.now();
  let keyHandler = null;
  const next = () => {
    if (keyHandler) { document.removeEventListener('keydown', keyHandler); keyHandler = null; }
    while (q.length && !store.state.cards[q[0].id]) q.shift();
    if (!q.length) return finish();
    showCard(store.state.cards[q[0].id]);
  };
  const finish = () => {
    logDone('review');
    const mins = Math.max(1, Math.round((Date.now() - startedAt) / 60000));
    root.replaceChildren(card(h('div', { class: 'summary-big' }, done), h('p', { class: 'muted' }, `cards reviewed in ~${mins} min · ${again} to relearn`),
      h('p', null, 'Spacing works because each retrieval is a little effortful. Come back tomorrow for the next batch.'),
      h('div', { class: 'ex-actions' }, btn('Back to today', () => { location.hash = '#/'; }, 'primary'), btn('Grammar practice', () => { location.hash = '#/grammar/mix'; }))));
  };
  const grade = (cardObj, g) => {
    const updated = gradeCard(cardObj.id, g);
    done++;
    if (g === 1) again++;
    q.shift();
    if (updated && updated.due - Date.now() < 15 * 60000) q.push({ id: updated.id }); // learning step: see again this session
    next();
  };

  const showCard = (c) => {
    const counts = h('div', { class: 'progress-top' }, h('span', { class: 'small muted' }, `${done} done · ${q.length} left`),
      h('div', { class: 'bar' }, h('div', { class: 'bar-fill', style: { width: `${(done / (done + q.length)) * 100}%` } })));
    const gradeRow = h('div');
    const showGrades = (suggested) => {
      const iv = previewIntervals(c);
      const labels = [['again', 1, 'Again'], ['hard', 2, 'Hard'], ['good', 3, 'Good'], ['easy', 4, 'Easy']];
      gradeRow.replaceChildren(h('div', { class: 'grades' }, labels.map(([k, g, l]) => h('button', {
        class: `grade g${g} ${g === suggested ? 'suggested' : ''}`, onclick: () => grade(c, g),
      }, h('b', l), h('small', iv[k]), h('small', `key ${g}`)))),
      h('p', { class: 'small muted kbd-hint', style: { textAlign: 'center', marginTop: '8px' } }, 'Enter accepts the highlighted rating.'));
      keyHandler = (e) => {
        if (['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName) && !document.activeElement.disabled) return;
        if (e.key >= '1' && e.key <= '4') { e.preventDefault(); grade(c, +e.key); }
        if (e.key === 'Enter') { e.preventDefault(); grade(c, suggested); }
      };
      setTimeout(() => document.addEventListener('keydown', keyHandler), 50);
    };
    const suggest = (score) => (score >= 1 ? 3 : score > 0 ? 2 : 1);
    let view;
    try { view = renderCardBody(c, (score) => showGrades(suggest(score))); }
    catch (e) { console.warn('Bad card', c, e); removeCard(c.id); q.shift(); return next(); }
    root.replaceChildren(counts, view, gradeRow);
    setTimeout(() => view.querySelector('input, textarea')?.focus(), 30);
  };
  next();
  return () => keyHandler && document.removeEventListener('keydown', keyHandler);
}

// Each card type renders a question; onAnswered(score 0..1) reveals rating buttons.
function renderCardBody(c, onAnswered) {
  const src = h('span', { class: 'tag' }, { deck: 'vocabulary', grammar: 'grammar', conjugation: 'conjugation', dictation: 'dictation', writing: 'your writing', speaking: 'speaking', manual: 'your card', 'grammar-ai': 'grammar' }[c.source] || c.source || c.type);
  const isNew = !c.state || c.state === 'new';
  const meta = h('div', { class: 'ex-meta' }, src, isNew ? h('span', { class: 'tag' }, 'new') : null);

  if (c.type === 'vocab') {
    const d = DECK_ITEMS[c.data.i];
    if (!d) throw new Error('missing deck item');
    return typedCard(meta, [h('div', { class: 'cue' }, d.en, ' ', levelBadge(d.level)), h('div', { class: 'front' }, d.cloze), h('div', { class: 'gloss' }, d.exEn)],
      [d.answer], d.ex, onAnswered, isNew ? h('p', { class: 'small muted' }, 'New word — if you don’t know it, press “Show” and read the sentence aloud; you’ll meet it again in a minute.') : null);
  }
  if (c.type === 'conj') {
    const { verb, tense, person } = c.data;
    const info = verbInfo(verb) || {};
    return typedCard(meta, [h('div', { class: 'cue' }, TENSES[tense]?.es || tense), h('div', { class: 'front' }, verb, info.en ? h('span', { class: 'gloss', style: { fontSize: '1rem' } }, ` (${info.en})`) : null), h('div', { class: 'gloss' }, PERSONS[person])],
      acceptedForms(verb, tense, person), null, onAnswered);
  }
  if (c.type === 'grammar') {
    const t = getTopic(c.data.topic);
    const item = parseItem(c.data.src);
    const wrap = h('div');
    const ex = renderExercise(item, { meta: [src, t ? h('a', { href: `#/grammar/${t.id}` }, t.title) : null], onAnswer: (r) => onAnswered(r.score), onNext: () => {}, strictAccents: c.data.topic === 'tildes' ? true : undefined });
    ex.querySelector('#next-btn')?.remove();
    const obs = new MutationObserver(() => { ex.querySelector('#next-btn')?.remove(); });
    obs.observe(ex, { childList: true, subtree: true });
    wrap.append(ex);
    return wrap;
  }
  if (c.type === 'sentence') {
    const text = c.data.text;
    const voice = nextVoice();
    // Lines saved from a podcast play the real speaker; the synthetic voice is the fallback.
    const say = (rate) => {
      if (c.data.clip) return playClip(c.data.clip, rate ?? 1).catch(() => speak(text, { voice, rate }));
      return speak(text, { voice, rate });
    };
    const inp = h('textarea', { rows: 2, class: 'fix-area', placeholder: 'Type what you hear…', spellcheck: false });
    smartAccents(inp);
    const fb = h('div');
    let answered = false;
    const check = () => {
      if (answered || !inp.value.trim()) return; answered = true;
      const { ops, score } = alignWords(text, inp.value, { strict: store.state.settings.strictAccents });
      inp.disabled = true;
      fb.replaceChildren(h('div', { class: 'feedback ' + (score > 0.95 ? 'ok' : score > 0.7 ? 'almost' : 'bad') }, h('div', { class: 'fb-body' },
        h('div', { class: 'diff' }, ops.map((o) => h('span', { class: `d-${o.type}` }, o.ref ?? o.hyp, ' '))),
        h('div', { class: 'full' }, text), ops.some((o) => o.type === 'accent') ? accentNote(ops.filter((o) => o.type === 'accent').map((o) => o.ref)) : null,
        c.data.en ? h('div', { class: 'small muted' }, c.data.en) : null), h('button', { class: 'say', onclick: () => say() }, icon('play', 16))));
      stopClip();
      onAnswered(score > 0.95 ? 1 : score > 0.7 ? 0.5 : 0);
    };
    inp.addEventListener('keydown', (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); check(); } });
    setTimeout(() => say(), 250);
    return h('div', { class: 'ex-card' }, meta, h('div', { class: 'row', style: { marginBottom: '12px' } },
      h('button', { class: 'say big', onclick: () => say() }, icon('play', 24)),
      h('button', { class: 'btn small', onclick: () => say(0.7) }, 'Slower'), h('span', { class: 'muted small' }, c.data.clip ? 'Real speech — write exactly what you hear.' : 'Dictation card — write exactly what you hear.')),
    inp, accentBar(inp), h('div', { class: 'ex-actions' }, btn('Check', check, 'primary')), fb);
  }
  if (c.type === 'fix') {
    const item = { type: 'fix', wrong: c.data.wrong, rights: [c.data.right], explain: c.data.note || '', src: c.data.wrong };
    const ex = renderExercise(item, { meta: [src], onAnswer: (r) => onAnswered(r.score), onNext: () => {} });
    const obs = new MutationObserver(() => { ex.querySelector('#next-btn')?.remove(); });
    obs.observe(ex, { childList: true, subtree: true });
    return ex;
  }
  // custom flip card
  const back = h('div', { style: { display: 'none' } }, h('hr'), h('div', { class: 'front' }, c.data.back), c.data.back ? sayBtn(c.data.back) : null);
  const reveal = btn('Show answer', () => { back.style.display = ''; reveal.remove(); onAnswered(1); }, 'primary');
  return h('div', { class: 'ex-card flash' }, meta, h('div', { class: 'front' }, c.data.front), back, h('div', { class: 'ex-actions', style: { justifyContent: 'center' } }, reveal));
}

function typedCard(meta, frontNodes, answers, fullSentence, onAnswered, extra) {
  const inp = h('input', { type: 'text', class: 'blank', style: { width: `${Math.max(10, answers[0].length + 4)}ch`, fontSize: '1.3rem' }, autocomplete: 'off', autocapitalize: 'off', spellcheck: false, 'aria-label': 'Answer' });
  smartAccents(inp);
  const fb = h('div');
  let answered = false;
  const check = (giveUp) => {
    if (answered) return;
    if (!giveUp && !inp.value.trim()) return;
    answered = true; inp.disabled = true;
    const r = giveUp ? { verdict: 'wrong' } : checkAnswer(inp.value, answers);
    const accentOnly = r.verdict === 'accent' && !store.state.settings.strictAccents;
    const score = r.verdict === 'exact' || accentOnly ? 1 : 0;
    inp.classList.add(score ? 'ok' : 'bad');
    fb.replaceChildren(h('div', { class: `feedback ${score ? 'ok' : 'bad'}` }, h('div', { class: 'fb-body' },
      h('div', { class: 'fb-title' }, score ? '¡Bien!' : `Answer: ${answers[0]}`),
      fullSentence ? h('div', { class: 'full' }, fullSentence) : null,
      accentOnly ? accentNote([r.match]) : null), sayBtn(fullSentence || answers[0])));
    if (fullSentence) speak(fullSentence);
    onAnswered(score);
  };
  inp.addEventListener('keydown', (e) => { if (e.key === 'Enter' && !answered) { e.preventDefault(); e.stopPropagation(); check(false); } });
  return h('div', { class: 'ex-card flash' }, meta, frontNodes, h('div', { style: { margin: '14px 0 4px' } }, inp), h('div', { style: { display: 'flex', justifyContent: 'center' } }, accentBar(inp)), extra || null,
    h('div', { class: 'ex-actions', style: { justifyContent: 'center' } }, btn('Check', () => check(false), 'primary'), btn('Show', () => check(true), 'ghost')), fb);
}

// ---- Deck & card management --------------------------------------------------------------
function renderDeck(root) {
  const s = stats();
  const byType = {};
  for (const c of Object.values(store.state.cards)) byType[c.type] = (byType[c.type] || 0) + 1;
  const front = h('input', { type: 'text', placeholder: 'Front (e.g. English, a question, a cue)' });
  const back = h('input', { type: 'text', placeholder: 'Back (Spanish)' });
  smartAccents(back);
  const sentence = h('input', { type: 'text', placeholder: 'A Spanish sentence you want to be able to hear and write' });
  smartAccents(sentence);
  const perDay = h('input', { type: 'number', min: 0, max: 50, value: store.state.profile.newPerDay ?? 10, style: { width: '90px' } });
  perDay.addEventListener('change', () => { store.state.profile.newPerDay = Math.max(0, Math.min(50, +perDay.value || 0)); store.save(); toast('Saved'); });
  const cursor = store.state.deckCursor || 0;
  const nextWords = DECK_ITEMS.slice(cursor, cursor + 12);
  mount(root,
    h('div', { class: 'page-head' }, h('div', { class: 'crumbs' }, h('a', { href: '#/review' }, '← Repaso')), h('h1', 'Cards & deck'),
      tabs([['session', 'Review'], ['deck', 'Cards & deck']], 'deck', (id) => { location.hash = id === 'deck' ? '#/review/deck' : '#/review'; })),
    h('div', { class: 'grid grid-2' },
      card(h('h3', 'Collection'), h('div', { class: 'metrics' },
        [['Total', s.total], ['Due now', s.due], ['New', s.new], ['Mature (21 d+)', s.mature]].map(([l, v]) => h('div', { class: 'metric' }, h('b', v), h('span', l)))),
        h('p', { class: 'small muted', style: { marginTop: '12px' } }, Object.entries(byType).map(([k, v]) => `${v} ${k}`).join(' · ') || 'No cards yet.'),
        h('label', { class: 'field', style: { marginTop: '12px' } }, h('span', 'New vocabulary cards per day'), perDay,
          h('span', { class: 'small muted' }, ' 10 ≈ 10–15 min/day of reviews after a month. Your own mistakes are added on top (they’re the highest-value cards).'))),
      card(h('h3', 'Coming up in the core deck'), h('p', { class: 'small muted' }, `${DECK_ITEMS.length} high-frequency words, A1–B2, each in a sentence. You are at word ${cursor + 1}.`),
        h('div', null, nextWords.map((d) => h('div', { class: 'row', style: { padding: '4px 0', borderTop: '1px solid var(--line)' } }, levelBadge(d.level), h('b', { class: 'es' }, d.lemma), h('span', { class: 'muted small' }, d.en),
          h('span', { class: 'spacer' }), h('button', { class: 'btn small ghost', title: 'Skip — I already know it', onclick: (e) => {
            if (addCard(`v:${d.i}`, 'vocab', { i: d.i }, { source: 'deck' })) {
              const cardObj = store.state.cards[`v:${d.i}`];
              Object.assign(cardObj, { state: 'review', s: 30, d: 3, reps: 1, last: Date.now(), due: Date.now() + 30 * 864e5 });
              if (store.state.deckCursor === d.i) store.state.deckCursor++;
              store.save();
            }
            e.target.closest('.row').remove(); toast(`“${d.lemma}” marked as known (check in 30 days)`);
          } }, 'I know it')))),
        h('div', { class: 'row', style: { marginTop: '10px' } }, h('span', { class: 'small muted' }, 'Start the deck at level:'), LEVELS.slice(0, 4).map((L) => h('button', { class: 'chip', onclick: () => {
          store.state.deckCursor = Math.max(0, DECK_ITEMS.findIndex((d) => d.level === L)); store.save(); renderDeck(root); toast(`Deck now starts at ${L}`);
        } }, L))))),
    card(h('h3', 'Add your own cards'), h('p', { class: 'small muted' }, 'Sentence mining: when you meet a useful sentence in a text, a film or a conversation, add it. Personal, meaningful sentences are remembered better.'),
      h('div', { class: 'grid grid-2' },
        h('div', null, h('label', { class: 'field' }, h('span', 'Flip card'), front), back, accentBar(back), h('div', { class: 'ex-actions' }, btn('Add flip card', () => {
          if (!front.value.trim() || !back.value.trim()) return toast('Fill both sides');
          addCard(`m:${Date.now()}`, 'custom', { front: front.value.trim(), back: back.value.trim() }, { source: 'manual', priority: true });
          front.value = back.value = ''; toast('Card added', 'ok');
        }, 'primary'))),
        h('div', null, h('label', { class: 'field' }, h('span', 'Dictation card (listen & write)'), sentence), accentBar(sentence), h('div', { class: 'ex-actions' }, btn('Add dictation card', () => {
          if (!sentence.value.trim()) return;
          addCard(`s:${Date.now()}`, 'sentence', { text: sentence.value.trim() }, { source: 'manual', priority: true });
          sentence.value = ''; toast('Card added', 'ok');
        }, 'primary'))))));
}
