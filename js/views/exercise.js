// Exercise engine shared by grammar practice, mixed practice and the review queue.
// Parses the item mini-language (see data/grammar-a1.js) and renders fill-in, choice
// and error-correction items with immediate, elaborated feedback.
import { h, btn, icon, sayBtn, accentBar, smartAccents, shuffle, toast, modal } from '../core/ui.js';
import { checkAnswer, norm, loose, words, stripAccents } from '../core/text.js';
import { store } from '../core/store.js';
import { aiAvailable, explainItem, friendlyError } from '../core/ai.js';

export function parseItem(src) {
  let body = src, explain = '';
  const ti = src.indexOf(' ~ ');
  if (ti >= 0) { body = src.slice(0, ti); explain = src.slice(ti + 3).trim(); }
  body = body.trim();

  if (body.startsWith('! ')) {
    const text = body.slice(2);
    const m = text.match(/\[([^\]>]*)>([^\]]*)\]/);
    const clean = (s) => s.replace(/\s+([,.;:!?])/g, '$1').replace(/\s{2,}/g, ' ').trim();
    const sub = (rep) => clean(text.replace(m[0], rep === '-' ? '' : rep));
    const wrongWord = m[1].trim();
    const rights = m[2].split('|').map((s) => s.trim());
    return { type: 'fix', wrong: sub(wrongWord), rights: rights.map(sub), wrongWord, rightWord: rights[0], explain, src };
  }
  const choice = body.match(/\[([^\]]+\|[^\]]+)\]/);
  if (choice && choice[1].includes('*')) {
    const opts = choice[1].split('|').map((o) => o.trim());
    const correct = opts.find((o) => o.endsWith('*')).replace(/\*$/, '');
    const options = opts.map((o) => o.replace(/\*$/, ''));
    const [before, after] = body.split(choice[0]);
    const whole = !before.trim() && !after.trim();
    return { type: 'choice', before, after, options, correct, whole, explain, src };
  }
  const parts = [];
  const re = /\{([^}]+)\}/g;
  let last = 0, mm;
  while ((mm = re.exec(body))) {
    parts.push({ text: body.slice(last, mm.index) });
    const [ans, hint] = mm[1].split(':');
    parts.push({ blank: true, answers: ans.split('|').map((s) => s.trim()), hint: hint?.trim() });
    last = mm.index + mm[0].length;
  }
  parts.push({ text: body.slice(last) });
  return { type: 'fill', parts, explain, src };
}

// Words that were right except for their written accent.
export function accentDiff(given, correct) {
  const g = new Set(words(given).map(stripAccents));
  const gExact = new Set(words(given));
  return words(correct).filter((w) => !gExact.has(w) && g.has(stripAccents(w)));
}
// Word-by-word comparison of what was said with what the learner typed (see alignWords).
export const diffLine = (ops) => h('div', { class: 'diff' }, ops.map((o) => h('span', { class: `d-${o.type}`, title: o.type }, o.ref ?? o.hyp, (o.type === 'wrong' || o.type === 'spelling' || o.type === 'accent') ? h('span', { class: 'd-you' }, ` (${o.hyp})`) : null, ' ')));

export function accentNote(list = []) {
  return h('div', { class: 'accent-note' }, '✎ Accent note: ', list.length ? h('b', { class: 'es' }, list.join(', ')) : 'check the tildes',
    ' — write it with the tilde next time. Not counted as a mistake.');
}

// Full correct sentence (for audio and display).
export function solution(item) {
  if (item.type === 'fill') return item.parts.map((p) => (p.blank ? p.answers[0] : p.text)).join('').replace(/\s*\([^)]*\)\s*$/, '').trim();
  if (item.type === 'choice') return item.whole ? item.correct : (item.before + item.correct + item.after).replace(/\s*\([^)]*\)\s*$/, '').trim();
  return item.rights[0];
}
const speakable = (s) => s.replace(/^"[^"]*"\s*→\s*/, '').replace(/\([^)]*\)/g, '').replace(/[→]/g, '').trim();

// Render one exercise. onDone({score, verdict}) fires when the learner moves on.
// A missing/wrong tilde is accepted and shown as a note (unless strict: the accent topics,
// or the "Strict accents" setting).
export function renderExercise(item, { onAnswer, onNext, meta, topicTitle, nextLabel = 'Next', strictAccents } = {}) {
  const strict = strictAccents ?? store.state.settings.strictAccents;
  const card = h('div', { class: 'ex-card' });
  const metaRow = meta ? h('div', { class: 'ex-meta' }, meta) : null;
  let answered = false, result = null;
  const feedbackSlot = h('div');
  const actions = h('div', { class: 'ex-actions' });
  let firstInput = null;

  const finish = (score, verdict, extra = {}) => {
    if (answered) return;
    answered = true;
    result = { score, verdict, ...extra };
    onAnswer?.(result);
    const full = solution(item);
    const cls = verdict === 'wrong' ? 'bad' : 'ok';
    const title = verdict === 'wrong' ? 'Not quite' : '¡Correcto!';
    feedbackSlot.replaceChildren(h('div', { class: `feedback ${cls}` },
      h('span', null, icon(verdict === 'wrong' ? 'x' : 'check', 22)),
      h('div', { class: 'fb-body' },
        h('div', { class: 'fb-title' }, title),
        h('div', { class: 'full' }, full),
        verdict === 'accent' ? accentNote(extra.accentWords) : null,
        item.explain ? h('div', { class: 'small', style: { marginTop: '6px' } }, item.explain) : null),
      sayBtn(speakable(full))));
    actions.replaceChildren(
      btn([nextLabel, ' ', icon('arrow', 16)], () => onNext?.(result), 'primary', { id: 'next-btn' }),
      aiAvailable() ? btn([icon('spark', 15), ' Ask why'], () => askWhy(item), 'ghost') : '',
      h('span', { class: 'muted small kbd-hint' }, 'Press Enter'));
    setTimeout(() => card.querySelector('#next-btn')?.focus(), 30);
  };

  let body;
  if (item.type === 'fill') {
    const inputs = [];
    body = h('div', { class: 'ex-prompt es' }, item.parts.map((p) => {
      if (!p.blank) return p.text;
      const inp = h('input', { class: 'blank', type: 'text', autocomplete: 'off', autocapitalize: 'off', spellcheck: false, 'aria-label': p.hint ? `Answer (${p.hint})` : 'Answer' });
      inp.style.width = `${Math.max(5, Math.max(...p.answers.map((a) => a.length)) + 2)}ch`;
      smartAccents(inp);
      inp.addEventListener('focus', () => { lastFocus = inp; });
      inputs.push({ inp, p });
      return h('span', null, inp, p.hint ? h('span', { class: 'hint' }, `(${p.hint})`) : null);
    }));
    let lastFocus = null;
    firstInput = inputs[0]?.inp;
    const check = () => {
      if (answered) return;
      if (inputs.some(({ inp }) => !inp.value.trim())) { (inputs.find(({ inp }) => !inp.value.trim()).inp).focus(); return; }
      let total = 0; let worst = 'exact';
      const accentWords = [];
      for (const { inp, p } of inputs) {
        const r = checkAnswer(inp.value, p.answers);
        inp.disabled = true;
        if (r.verdict === 'exact') { inp.classList.add('ok'); total += 1; }
        else if (r.verdict === 'accent' && !strict) {
          inp.classList.add('ok'); total += 1; accentWords.push(r.match);
          if (worst === 'exact') worst = 'accent';
          inp.after(h('span', { class: 'accent-fix' }, r.match));
        } else { inp.classList.add('bad'); worst = 'wrong'; inp.after(h('span', { class: 'correction' }, p.answers[0])); }
      }
      const score = total / inputs.length;
      finish(score, worst, { given: inputs.map(({ inp }) => inp.value).join(' / '), accentWords });
    };
    inputs.forEach(({ inp }, i) => inp.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') { e.preventDefault(); e.stopPropagation(); if (answered) return; if (i < inputs.length - 1 && !inputs[i + 1].inp.value) inputs[i + 1].inp.focus(); else check(); }
    }));
    actions.append(btn('Check', check, 'primary'), btn('I don’t know', () => {
      inputs.forEach(({ inp, p }) => { inp.disabled = true; inp.classList.add('bad'); inp.after(h('span', { class: 'correction' }, p.answers[0])); });
      finish(0, 'wrong', { given: '' });
    }, 'ghost'));
    body = h('div', null, body, accentBar(() => lastFocus || firstInput));
  } else if (item.type === 'choice') {
    const opts = shuffle(item.options);
    const buttons = opts.map((o, i) => h('button', {
      class: 'opt', type: 'button',
      onclick: () => choose(o),
    }, h('span', { class: 'key' }, String(i + 1)), o));
    const choose = (o) => {
      if (answered) return;
      const ok = o === item.correct;
      buttons.forEach((b, i) => {
        b.disabled = true;
        if (opts[i] === item.correct) b.classList.add('ok');
        else if (opts[i] === o) b.classList.add('bad');
      });
      finish(ok ? 1 : 0, ok ? 'exact' : 'wrong', { given: o });
    };
    card._keys = (e) => {
      const n = parseInt(e.key, 10);
      if (!answered && n >= 1 && n <= opts.length) { choose(opts[n - 1]); return true; }
      return false;
    };
    const prompt = item.whole
      ? h('div', { class: 'ex-prompt' }, h('span', { class: 'muted', style: { fontSize: '1rem' } }, 'Which is spelled correctly?'))
      : h('div', { class: 'ex-prompt es' }, item.before, h('span', { class: 'blank', style: { width: '6ch', display: 'inline-block' } }, ' '), item.after);
    body = h('div', null, prompt, h('div', { class: 'options' }, buttons));
  } else {
    const area = h('textarea', { class: 'fix-area', rows: 2, spellcheck: false, 'aria-label': 'Corrected sentence' });
    area.value = item.wrong;
    smartAccents(area);
    firstInput = area;
    const check = () => {
      if (answered) return;
      const given = area.value;
      if (norm(given) === norm(item.wrong)) { toast('Change the sentence to fix the mistake first.'); return; }
      const r = checkAnswer(given, item.rights);
      area.disabled = true;
      const verdict = r.verdict === 'accent' && strict ? 'wrong' : r.verdict;
      finish(verdict === 'wrong' ? 0 : 1, verdict, { given, accentWords: verdict === 'accent' ? accentDiff(given, r.match) : [] });
    };
    area.addEventListener('keydown', (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); e.stopPropagation(); check(); } });
    body = h('div', null,
      h('div', { class: 'muted small', style: { marginBottom: '6px' } }, 'There is one mistake. Edit the sentence to correct it:'),
      h('div', { class: 'fix-wrong' }, item.wrong),
      area, accentBar(area));
    actions.append(btn('Check', check, 'primary'), btn('Show answer', () => { area.disabled = true; finish(0, 'wrong', { given: '' }); }, 'ghost'));
  }

  card.append(metaRow || '', body, feedbackSlot, actions);
  card._focus = () => firstInput?.focus();
  card._isAnswered = () => answered;
  card._result = () => result;
  return card;
}

async function askWhy(item) {
  const q = h('input', { type: 'text', placeholder: 'e.g. Why not the imperfect here?' });
  const out = h('div', { class: 'small', style: { marginTop: '12px', whiteSpace: 'pre-wrap' } });
  const ask = async () => {
    out.textContent = 'Thinking…';
    try {
      out.textContent = await explainItem({
        question: q.value || 'Explain why this is the correct answer.',
        context: `Exercise: ${item.src.replace(/\s*~.*$/, '')}\nCorrect answer: ${solution(item)}\nExplanation given: ${item.explain || '—'}`,
        level: store.state.profile.level,
      });
    } catch (e) { out.textContent = friendlyError(e); }
  };
  q.addEventListener('keydown', (e) => e.key === 'Enter' && ask());
  modal('Ask the tutor', h('div', null, h('p', { class: 'es' }, solution(item)), q, h('div', { class: 'row', style: { marginTop: '10px' } }, btn('Ask', ask, 'primary')), out));
  q.focus();
}

// Run a sequence of exercises with progress, keyboard handling and a summary screen.
export function runSession(root, entries, { title, onItem, onFinish, metaFor } = {}) {
  let i = 0;
  const results = [];
  const wrap = h('div');
  root.replaceChildren(wrap);
  let current = null;

  const keyHandler = (e) => {
    if (!current) return;
    if (e.key === 'Enter' && current._isAnswered?.()) {
      const tag = document.activeElement?.tagName;
      if (tag === 'TEXTAREA' || tag === 'BUTTON' || tag === 'A') return; // focused controls handle Enter themselves
      e.preventDefault();
      next();
      return;
    }
    if (current._keys && !['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) current._keys(e);
  };
  document.addEventListener('keydown', keyHandler);

  const next = () => { i++; show(); };
  const show = () => {
    if (i >= entries.length) return summary();
    const entry = entries[i];
    const item = entry.item || parseItem(entry.src);
    const prog = h('div', { class: 'progress-top' },
      h('span', { class: 'small muted' }, `${i + 1} / ${entries.length}`),
      h('div', { class: 'bar' }, h('div', { class: 'bar-fill', style: { width: `${(i / entries.length) * 100}%` } })));
    current = renderExercise(item, {
      meta: metaFor ? metaFor(entry) : null,
      strictAccents: entry.topic === 'tildes' ? true : undefined, // the accent topic itself checks tildes
      onAnswer: (r) => { results.push({ entry, ...r }); onItem?.(entry, r); },
      onNext: next,
    });
    wrap.replaceChildren(title ? h('h3', { class: 'muted', style: { fontFamily: 'var(--font)', fontSize: '.9rem', fontWeight: 500 } }, title) : '', prog, current);
    setTimeout(() => current._focus?.(), 30);
  };
  const summary = () => {
    document.removeEventListener('keydown', keyHandler);
    current = null;
    const score = results.reduce((a, r) => a + r.score, 0) / Math.max(1, results.length);
    const missed = results.filter((r) => r.score < 1);
    wrap.replaceChildren(h('div', { class: 'ex-card' },
      h('div', { class: 'row between' },
        h('div', null, h('div', { class: 'summary-big' }, `${Math.round(score * 100)}%`), h('div', { class: 'muted' }, `${results.length - missed.length} of ${results.length} correct`),
          results.some((r) => r.verdict === 'accent') ? h('div', { class: 'accent-note' }, `✎ ${results.filter((r) => r.verdict === 'accent').length} accent note${results.filter((r) => r.verdict === 'accent').length > 1 ? 's' : ''} (not counted)`) : null),
        h('div', { style: { maxWidth: '420px' }, class: 'small muted' },
          missed.length ? `The ${missed.length} item${missed.length > 1 ? 's' : ''} you missed ${missed.length > 1 ? 'have' : 'has'} been added to your review queue — you’ll see ${missed.length > 1 ? 'them' : 'it'} again just as you start to forget.` : 'Perfect round. Come back in a few days — spacing practice out beats repeating it now.')),
      missed.length ? h('div', { style: { marginTop: '16px' } }, h('h4', 'To review'), missed.map((r) => {
        const it = r.entry.item || parseItem(r.entry.src);
        return h('div', { class: 'row', style: { padding: '6px 0', borderTop: '1px solid var(--line)' } }, sayBtn(speakable(solution(it))), h('span', { class: 'es' }, solution(it)));
      })) : null,
      h('div', { class: 'ex-actions' }, onFinish ? onFinish(score, results) : null)));
  };
  show();
  return () => document.removeEventListener('keydown', keyHandler);
}

export { loose };
