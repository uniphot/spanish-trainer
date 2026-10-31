// Escribir: graded tasks with live requirements, a three-layer checker (built-in rules,
// LanguageTool, optional AI) with hint-first feedback and drafts, journal, quick-writes and dictogloss.
import { h, mount, btn, card, icon, levelBadge, toast, smartAccents, accentBar, sayBtn, fmtClock, pick, timeAgo, tabs, modal } from '../core/ui.js';
import { store, logDone, logError, logMinutes } from '../core/store.js';
import { TASKS, JOURNAL_PROMPTS, QUICKWRITE_TOPICS, CONNECTORS } from '../data/writing.js';
import { TEXTS } from '../data/listening.js';
import { LEVELS } from '../data/grammar.js';
import { topic as getTopic } from '../data/grammar.js';
import { analyze, TENSE_LABEL } from '../core/analyzer.js';
import { localCheck, languageToolCheck, mergeIssues, CAT_TOPIC } from '../core/checker.js';
import { aiAvailable, writingFeedback, friendlyError } from '../core/ai.js';
import { addCard } from '../core/srs.js';
import { alignWords, escapeHtml, wordCount, sentences } from '../core/text.js';
import { speak, speakLines, stopSpeaking, nextVoice } from '../core/speech.js';
import { levelIndex } from '../core/learner.js';

export const strand = 'output';

export async function render(root, params, ctx) {
  const [sub, id] = params;
  if (sub === 'task') { const t = TASKS.find((x) => x.id === id); if (t) return editor(root, { task: t }); }
  if (sub === 'free') return editor(root, { task: { id: 'free', title: 'Free writing', level: store.state.profile.level || 'A2', prompt: 'Write about anything you like.', min: 0, reqs: [] } });
  if (sub === 'journal') {
    const prompt = JOURNAL_PROMPTS[new Date().getDate() % JOURNAL_PROMPTS.length];
    return editor(root, { task: { id: `journal-${new Date().toISOString().slice(0, 10)}`, kind: 'journal', title: 'Diario', level: store.state.profile.level || 'A2', prompt, min: 50, max: 250, reqs: [] } });
  }
  if (sub === 'news' && id) {
    const art = store.state.news.digest.find((x) => x.id === id) || store.state.news.headlines.find((x) => x.id === id);
    if (art) return editor(root, { task: { id: `news-${id}`, kind: 'news', title: `Resumen: ${art.title}`, genre: 'Summary + opinion', level: store.state.profile.level || 'B1',
      prompt: `Retell this news story in 3–6 sentences in your own words (don’t copy phrases), then say what you think. “${art.title}” (${art.outlet})`, min: 40, max: 160,
      reqs: [{ t: 'any', words: ['creo que', 'pienso que', 'me parece', 'en mi opinión', 'opino que', 'me sorprende', 'me gusta'], label: 'Give your opinion (creo que…, me parece…)' }, { t: 'connectors', min: 2, label: '2+ connectors' }] } });
  }
  if (sub === 'open' && id) { const entry = store.state.writing.find((w) => w.id === id); if (entry) return editor(root, { task: entry.task, entry }); }
  if (sub === 'quickwrite') { ctx.setStrand('fluency'); return quickwrite(root); }
  if (sub === 'dictogloss') return dictogloss(root, id);
  return hub(root);
}

// ---- Hub ------------------------------------------------------------------------------------
function hub(root) {
  const li = levelIndex(store.state.profile.level || 'A2');
  const mine = store.state.writing.slice().reverse();
  const doneIds = new Set(store.state.writing.map((w) => w.task?.id));
  mount(root,
    h('div', { class: 'page-head' }, h('h1', 'Escribir'),
      h('p', { class: 'lead' }, 'Writing is where you notice the gap between what you want to say and what you can say. The checker gives you hints first so you correct yourself, keeps every draft, and turns your recurring errors into review cards and grammar practice.')),
    h('div', { class: 'grid grid-3' },
      h('a', { class: 'tile', href: '#/writing/journal' }, h('div', { class: 'tile-tag' }, 'Daily'), h('h3', 'Diario'), h('p', null, 'A short personal entry on today’s prompt. Real things you want to say → vocabulary you actually need.')),
      h('a', { class: 'tile', href: '#/writing/quickwrite' }, h('div', { class: 'tile-tag' }, 'Fluency'), h('h3', 'Quick-write · 10 min'), h('p', null, 'Write non-stop on an easy topic. No checking, no dictionary: speed with what you know.')),
      h('a', { class: 'tile', href: '#/writing/dictogloss' }, h('div', { class: 'tile-tag' }, 'Listening → writing'), h('h3', 'Dictogloss'), h('p', null, 'Hear a text twice, note key words, rebuild it, compare. You discover exactly which structures you don’t control yet.'))),
    h('div', { class: 'row', style: { margin: '18px 0 0' } }, h('a', { class: 'btn', href: '#/writing/free' }, 'Free writing with the checker')),
    LEVELS.filter((L) => TASKS.some((t) => t.level === L)).map((L) => h('div', null,
      h('div', { class: 'level-head' }, levelBadge(L), Math.abs(levelIndex(L) - li) <= 1 ? h('span', { class: 'tag' }, 'recommended') : null),
      h('div', { class: 'grid grid-2' }, TASKS.filter((t) => t.level === L).map((t) => h('a', { class: 'topic', href: `#/writing/task/${t.id}` },
        h('div', { style: { flex: 1 } }, h('div', { class: 't-title' }, t.title), h('div', { class: 't-en' }, `${t.genre} · ${t.min}–${t.max} words`)),
        doneIds.has(t.id) ? h('span', { class: 'tag' }, '✓ written') : null))))),
    mine.length ? card(h('h3', 'My texts'), mine.slice(0, 15).map((w) => h('div', { class: 'err-row' },
      h('div', { style: { flex: 1 } }, h('a', { href: `#/writing/open/${w.id}` }, w.task?.title || 'Text'), h('div', { class: 'small muted' }, `${timeAgo(w.ts)} · ${w.drafts.length} draft${w.drafts.length === 1 ? '' : 's'} · ${wordCount(w.drafts[w.drafts.length - 1]?.text || '')} words${w.ai ? ` · AI estimate ${w.ai.cefr}` : ''}`))))) : null);
}

// ---- Editor + checker ------------------------------------------------------------------------
function editor(root, { task, entry }) {
  entry = entry || store.state.writing.find((w) => w.task?.id === task.id && !w.done) || null;
  const area = h('textarea', { class: 'editor', spellcheck: false, placeholder: 'Escribe aquí…' });
  smartAccents(area);
  area.value = entry?.drafts?.[entry.drafts.length - 1]?.text || '';
  let issues = [];
  let lastChecked = '';
  const metrics = h('div');
  const reqBox = h('div');
  const results = h('div');
  const aiBox = h('div');
  const status = h('span', { class: 'small muted' });

  const ensureEntry = () => {
    if (!entry) {
      entry = { id: `w${Date.now()}`, task: { id: task.id, title: task.title, level: task.level, prompt: task.prompt, min: task.min, max: task.max, reqs: task.reqs, kind: task.kind }, ts: Date.now(), drafts: [], done: false };
      store.state.writing.push(entry);
    }
    return entry;
  };
  const autosave = () => {
    if (!area.value.trim()) return;
    ensureEntry();
    const last = entry.drafts[entry.drafts.length - 1];
    if (last && !last.checked) { last.text = area.value; last.ts = Date.now(); } else entry.drafts.push({ text: area.value, ts: Date.now(), checked: false });
    store.save();
    status.textContent = 'Saved';
  };
  let saveTimer = null;

  const drawMetrics = () => {
    const a = analyze(area.value, task);
    reqBox.replaceChildren(...a.reqs.map((r) => h('div', { class: `req ${r.met ? 'met' : ''}` }, h('span', { class: 'tick' }, r.met ? '✓' : ''), h('span', null, r.label, r.detail ? h('span', { class: 'small muted' }, ` · ${r.detail}`) : null))));
    const tenseRows = Object.entries(a.tenses).filter(([, v]) => v >= 1).sort((x, y) => y[1] - x[1]);
    metrics.replaceChildren(
      h('div', { class: 'metrics' },
        [['Words', a.words], ['Sentences', a.sentences], ['Words/sentence', a.avgLen ? a.avgLen.toFixed(1) : '—'], ['Lexical variety', a.mattr ? `${Math.round(a.mattr * 100)}%` : '—'], ['Connectors', a.connectors.length], ['Different verbs', a.distinctVerbs]]
          .map(([l, v]) => h('div', { class: 'metric' }, h('b', v), h('span', l)))),
      tenseRows.length ? h('p', { class: 'small', style: { marginTop: '10px' } }, h('b', 'Verb forms: '), tenseRows.map(([k, v]) => `${TENSE_LABEL(k)} ${Math.floor(v)}`).join(' · ')) : null,
      a.connectors.length ? h('p', { class: 'small' }, h('b', 'Connectors: '), a.connectors.map((c) => `${c.c} (${c.lvl})`).join(', ')) : null,
      a.repeated.length ? h('p', { class: 'small' }, h('b', 'Repeated: '), a.repeated.map((r) => [h('span', { class: 'es' }, `${r.w} ×${r.n}`), r.alt ? h('span', { class: 'muted' }, ` → try ${r.alt.slice(0, 3).join(', ')}`) : null, '; '])) : null,
      a.words > 40 && a.connectors.length < 2 ? h('p', { class: 'small muted' }, `Tip: link your ideas — e.g. ${CONNECTORS[levelIndex(task.level) >= 2 ? 'B1' : 'A2'].slice(0, 5).join(', ')}.`) : null);
  };
  area.addEventListener('input', () => {
    status.textContent = '…';
    clearTimeout(saveTimer); saveTimer = setTimeout(() => { autosave(); drawMetrics(); }, 700);
  });

  const renderMarked = () => {
    const text = lastChecked;
    const marks = [];
    let pos = 0;
    const sorted = issues.filter((i) => i.end > i.start).sort((a, b) => a.start - b.start);
    sorted.forEach((is, k) => {
      if (is.start < pos) return; // overlapping; listed but not highlighted
      marks.push(escapeHtml(text.slice(pos, is.start)));
      marks.push(`<span class="mark ${is.sev === 'style' ? 'style' : is.sev === 'typo' ? 'typo' : is.sev === 'note' ? 'note' : ''}" data-k="${issues.indexOf(is)}">${escapeHtml(text.slice(is.start, is.end))}</span>`);
      pos = is.end;
    });
    marks.push(escapeHtml(text.slice(pos)));
    const div = h('div', { class: 'marked', html: marks.join('') });
    div.addEventListener('click', (e) => {
      const k = e.target.dataset?.k;
      if (k == null) return;
      const el = results.querySelector(`[data-issue="${k}"]`);
      el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      el?.animate([{ background: 'var(--accent-soft)' }, { background: 'var(--surface)' }], { duration: 1200 });
    });
    return div;
  };

  const issueCard = (is, k) => {
    const topic = getTopic(is.topic || CAT_TOPIC[is.cat]);
    const reveal = h('div');
    const showFix = () => {
      reveal.replaceChildren(
        h('div', null, h('span', { class: 'orig' }, is.text), ' → ', is.fix != null ? h('span', { class: 'fixd' }, is.fix || '(remove)') : is.insert ? h('span', { class: 'fixd' }, `add ${is.insert} at the start`) : h('span', { class: 'muted' }, 'rephrase'),
          is.alts?.length > 1 ? h('span', { class: 'small muted' }, ` (or: ${is.alts.slice(1).join(', ')})`) : null),
        h('div', { class: 'small', style: { marginTop: '4px' } }, is.msg),
        h('div', { class: 'row', style: { marginTop: '6px' } },
          is.fix != null || is.insert ? btn('Apply', () => applyFix(is), 'small') : null,
          topic ? h('a', { class: 'btn small ghost', href: `#/grammar/${topic.id}?mode=practice` }, `Practise: ${topic.title}`) : null));
    };
    return h('div', { class: 'issue', 'data-issue': k },
      h('div', { class: 'row between' }, h('span', { class: 'src' }, `${is.source === 'local' ? 'Learner-error rules' : is.source} · ${is.sev === 'style' ? 'style' : is.sev === 'typo' ? 'spelling' : is.cat || 'grammar'}`)),
      h('div', { style: { margin: '4px 0' } }, h('b', { class: 'es' }, `“${is.text}”`), ' — ', h('span', null, is.hint || 'Look at this again.')),
      h('div', null, btn('Show suggestion', (e) => { e.currentTarget.remove(); showFix(); }, 'small ghost'), reveal));
  };

  const applyFix = (is) => {
    const cur = area.value;
    if (cur.slice(is.start, is.end) !== is.text) return toast('The text has changed since the check — edit it by hand or check again.');
    area.value = is.insert ? cur.slice(0, is.start) + is.insert + cur.slice(is.start) : cur.slice(0, is.start) + is.fix + cur.slice(is.end);
    autosave(); drawMetrics();
    toast('Applied — check again when you’re done.');
  };

  const check = async () => {
    const text = area.value;
    if (wordCount(text) < 3) return toast('Write a bit more first.');
    ensureEntry();
    const prevIssues = entry.drafts.filter((d) => d.checked).slice(-1)[0]?.issues;
    lastChecked = text;
    let local = localCheck(text), remote = [];
    results.replaceChildren(h('p', { class: 'muted' }, 'Checking…'));
    let ltNote = null;
    if (store.state.settings.languageTool) {
      try { remote = await languageToolCheck(text); }
      catch (e) { ltNote = h('div', { class: 'note warn' }, `LanguageTool unavailable: ${e.message} Built-in rules still ran.`); }
    }
    issues = mergeIssues(local, remote);
    // log errors & draft
    const last = entry.drafts[entry.drafts.length - 1];
    if (last && !last.checked) { last.text = text; last.checked = true; last.issues = issues.length; }
    else entry.drafts.push({ text, ts: Date.now(), checked: true, issues: issues.length });
    for (const is of issues.filter((i) => i.sev === 'error' && i.source === 'local')) logError({ source: 'writing', cat: is.cat, topic: is.topic || CAT_TOPIC[is.cat], text: is.text, fix: is.fix });
    const errs = issues.filter((i) => i.sev === 'error' || i.sev === 'typo').length;
    const styles = issues.filter((i) => i.sev === 'style').length;
    const notes = issues.filter((i) => i.sev === 'note');
    entry.drafts[entry.drafts.length - 1].issues = errs;
    store.save();
    const heading = [errs ? `${errs} possible error${errs === 1 ? '' : 's'}` : 'No errors found ✓', styles ? `${styles} style note${styles === 1 ? '' : 's'}` : null, notes.length ? `${notes.length} accent note${notes.length === 1 ? '' : 's'}` : null].filter(Boolean).join(' · ');
    results.replaceChildren(
      ltNote || '',
      h('div', { class: 'row between', style: { margin: '6px 0 10px' } }, h('h3', { style: { margin: 0 } }, heading),
        prevIssues != null ? h('span', { class: 'small muted' }, `Draft ${entry.drafts.filter((d) => d.checked).length} · previous check: ${prevIssues} error${prevIssues === 1 ? '' : 's'}`) : null),
      errs + styles ? h('p', { class: 'small muted' }, 'Try to correct each one yourself first (the hint tells you where to look); reveal the suggestion only if you’re stuck. Self-correction is what makes feedback stick. Automatic checkers miss things and sometimes flag correct text — use your judgement.') : null,
      renderMarked(),
      h('div', { style: { marginTop: '12px' } }, issues.map((is, k) => (is.sev === 'note' ? null : issueCard(is, k)))),
      notes.length ? h('div', { class: 'issue', style: { borderColor: 'var(--almost)' } },
        h('div', { class: 'src' }, 'Accent notes — not counted as mistakes'),
        h('p', { class: 'small', style: { margin: '4px 0 8px' } }, 'These words are right, but Spanish spelling puts a tilde on them:'),
        h('div', { class: 'chips' }, notes.map((is) => h('span', { class: 'chip', 'data-issue': issues.indexOf(is) }, h('span', { class: 'muted' }, is.text), ' → ', h('b', { class: 'es' }, is.fix)))),
        h('div', { class: 'row', style: { marginTop: '8px' } }, btn('Add all accents', () => {
          let text = area.value;
          if (text !== lastChecked) return toast('The text has changed since the check — check again first.');
          for (const is of notes.slice().sort((a, b) => b.start - a.start)) text = text.slice(0, is.start) + is.fix + text.slice(is.end);
          area.value = text; autosave(); drawMetrics(); toast('Accents added');
        }, 'small'))) : null);
  };

  const deepFeedback = async (e) => {
    const text = area.value;
    if (wordCount(text) < 20) return toast('Write at least 20 words for AI feedback.');
    const b = e.currentTarget; b.disabled = true;
    aiBox.replaceChildren(card(h('p', { class: 'muted' }, 'Your tutor is reading your text… (this can take 20–40 seconds)')));
    try {
      const r = await writingFeedback({ text, level: store.state.profile.level, task: `${task.title}: ${task.prompt}` });
      ensureEntry(); entry.ai = { cefr: r.cefr_estimate, summary: r.summary, ts: Date.now() };
      for (const er of r.errors) {
        addCard(`f:${er.original.slice(0, 40)}`, 'fix', { wrong: er.original, right: er.correction, note: er.explanation }, { source: 'writing', priority: true });
        logError({ source: 'writing-ai', cat: er.category, topic: CAT_TOPIC[er.category], text: er.original, fix: er.correction });
      }
      store.save();
      const diff = alignWords(text, r.reformulation);
      aiBox.replaceChildren(card(
        h('div', { class: 'row between' }, h('h3', { style: { margin: 0 } }, '✦ Tutor feedback'), h('span', null, 'Estimated level ', levelBadge(r.cefr_estimate))),
        h('p', { style: { marginTop: '10px' } }, r.summary),
        h('p', { class: 'small' }, h('b', 'Task: '), r.task_fulfilment),
        h('h4', 'What you did well'), h('ul', null, r.strengths.map((s) => h('li', null, s))),
        h('h4', `Errors (${r.errors.length}) — try to fix each before revealing`),
        r.errors.map((er) => {
          const rv = h('div');
          return h('div', { class: 'issue' }, h('div', null, h('b', { class: 'es' }, `“${er.original}”`), ' — ', er.hint, h('span', { class: 'tag', style: { marginLeft: '6px' } }, er.category)),
            h('div', null, btn('Reveal', (ev) => { ev.currentTarget.remove(); rv.replaceChildren(h('span', { class: 'fixd' }, er.correction), ' ', sayBtn(er.correction), h('div', { class: 'small muted' }, er.explanation)); }, 'small ghost'), rv));
        }),
        h('h4', 'Reformulation — compare and notice'),
        h('p', { class: 'small muted' }, `A native-like version of your text (${Math.round(diff.score * 100)}% of your words kept). Read it next to yours and pick 3 expressions you’d like to use next time.`),
        h('div', { class: 'grid grid-2' }, h('div', { class: 'marked' }, text), h('div', { class: 'marked', style: { borderColor: 'var(--ok)' } }, r.reformulation, ' ', sayBtn(r.reformulation))),
        h('h4', 'Next steps'), h('ul', null, r.next_steps.map((s) => h('li', null, s))),
        h('p', { class: 'small muted' }, 'All corrections were added to your review queue as “fix the sentence” cards.')));
    } catch (err) { aiBox.replaceChildren(h('div', { class: 'note warn' }, friendlyError(err))); }
    b.disabled = false;
  };

  const finish = () => {
    if (!area.value.trim()) return;
    autosave();
    ensureEntry().done = true; store.save();
    logDone(task.kind === 'journal' ? 'journal' : task.kind === 'news' ? 'news-retell' : 'write');
    toast('Saved to My texts', 'ok');
    location.hash = '#/writing';
  };

  mount(root,
    h('div', { class: 'page-head' }, h('div', { class: 'crumbs' }, h('a', { href: '#/writing' }, '← Escribir')),
      h('div', { class: 'row' }, levelBadge(task.level), task.genre ? h('span', { class: 'muted small' }, task.genre) : null), h('h1', task.title), h('p', { class: 'lead' }, task.prompt)),
    task.reqs?.length || task.min ? card(h('h3', 'Task checklist'), reqBox) : null,
    card(area, accentBar(area), h('div', { class: 'row', style: { marginTop: '10px' } },
      btn('Check my text', check, 'primary'),
      aiAvailable() ? btn('✦ Tutor feedback (AI)', deepFeedback) : h('a', { class: 'btn ghost small', href: '#/settings', title: 'Add an API key for AI feedback' }, '✦ AI feedback: add key'),
      h('span', { class: 'spacer' }), status, btn('Finish & save', finish, 'ghost')),
      h('p', { class: 'small muted', style: { marginTop: '8px' } }, 'Tip: type a\' → á, n~ → ñ, ?? → ¿. Write first, check after — don’t interrupt your flow.')),
    card(h('h3', 'Live analysis'), metrics),
    results, aiBox);
  drawMetrics();
  setTimeout(() => area.focus(), 50);
  return () => { clearTimeout(saveTimer); if (area.value.trim()) autosave(); };
}

// ---- Quick-write (fluency) ---------------------------------------------------------------------
function quickwrite(root) {
  const topic = pick(QUICKWRITE_TOPICS);
  const area = h('textarea', { class: 'editor', spellcheck: false, placeholder: 'Start writing and don’t stop…', disabled: true });
  smartAccents(area);
  const timer = h('div', { class: 'timer' }, '10:00');
  const counter = h('span', { class: 'muted' }, '0 words');
  let t0 = null, iv = null;
  const DURATION = 600;
  const stop = () => {
    clearInterval(iv); area.disabled = true;
    const mins = Math.max(0.5, (Date.now() - t0) / 60000);
    const wc = wordCount(area.value);
    const prev = store.state.writing.filter((w) => w.task?.kind === 'quickwrite').map((w) => w.wpm).filter(Boolean);
    store.state.writing.push({ id: `q${Date.now()}`, task: { id: 'quickwrite', kind: 'quickwrite', title: `Quick-write: ${topic}`, level: store.state.profile.level || 'A2', prompt: topic, min: 0, reqs: [] }, ts: Date.now(), drafts: [{ text: area.value, ts: Date.now() }], wpm: wc / mins, done: true });
    logDone('quickwrite'); store.save();
    res.replaceChildren(card(h('div', { class: 'summary-big' }, `${Math.round(wc / mins)} words/min`), h('p', { class: 'muted' }, `${wc} words in ${fmtClock(mins * 60)}.${prev.length ? ` Previous: ${prev.slice(-5).map((x) => Math.round(x)).join(', ')} wpm.` : ''}`),
      h('p', null, 'Fluency grows when you do this regularly with easy topics. Want to polish it? Open it in the checker.'),
      h('div', { class: 'row' }, btn('Open in checker', () => { location.hash = `#/writing/open/${store.state.writing[store.state.writing.length - 1].id}`; }, 'primary'), btn('Another', () => quickwrite(root)))));
  };
  const startBtn = btn(['Start 10 minutes ', icon('arrow', 16)], () => {
    startBtn.remove(); area.disabled = false; area.focus(); t0 = Date.now();
    iv = setInterval(() => {
      const left = DURATION - (Date.now() - t0) / 1000;
      timer.textContent = fmtClock(left);
      if (left <= 0) stop();
    }, 500);
  }, 'primary big');
  area.addEventListener('input', () => { counter.textContent = `${wordCount(area.value)} words`; });
  const res = h('div');
  mount(root, h('div', { class: 'page-head' }, h('div', { class: 'crumbs' }, h('a', { href: '#/writing' }, '← Escribir')), h('h1', `Quick-write: ${topic}`),
    h('p', { class: 'lead' }, 'Ten minutes of non-stop writing on an easy topic. Don’t correct, don’t look anything up — if you don’t know a word, write around it. This is fluency practice: speed with language you already have.')),
  card(h('div', { class: 'row between' }, timer, counter, startBtn, btn('Finish now', () => t0 && stop(), 'ghost')), h('div', { style: { marginTop: '12px' } }, area)), res);
  return () => clearInterval(iv);
}

// ---- Dictogloss -----------------------------------------------------------------------------------
function dictogloss(root, id) {
  const li = levelIndex(store.state.profile.level || 'A2');
  const pool = TEXTS.filter((t) => t.type !== 'dialogue' && Math.abs(levelIndex(t.level) - li) <= 1);
  const t = TEXTS.find((x) => x.id === id) || pick(pool.length ? pool : TEXTS.filter((x) => x.type !== 'dialogue'));
  const original = t.lines.map((l) => l[1]).join(' ');
  const voice = nextVoice();
  let step = 0;
  const notes = h('textarea', { rows: 4, placeholder: 'Key words only — nouns, verbs, numbers…', spellcheck: false });
  const recon = h('textarea', { class: 'editor', spellcheck: false, placeholder: 'Rebuild the text as closely as you can — same meaning, correct Spanish.' });
  smartAccents(notes); smartAccents(recon);
  const body = h('div');
  const play = (rate = 1) => speakLines(sentences(original).map((s) => ({ text: s, voice })), { rate, gap: 250 });
  const draw = () => {
    stopSpeaking();
    if (step === 0) {
      body.replaceChildren(card(h('h3', '1 · Listen for meaning'), h('p', { class: 'muted' }, `${t.context} Just listen — don’t write yet.`),
        btn([icon('play', 16), ' Play'], () => play(), 'primary'), h('div', { class: 'ex-actions' }, btn(['Next ', icon('arrow', 16)], () => { step = 1; draw(); }, 'primary'))));
    } else if (step === 1) {
      body.replaceChildren(card(h('h3', '2 · Listen again and take notes'), h('p', { class: 'muted' }, 'Write down key content words as you hear them. You won’t be able to write everything — that’s the point.'),
        btn([icon('play', 16), ' Play'], () => play(), 'primary'), h('div', { style: { marginTop: '12px' } }, notes), accentBar(notes),
        h('div', { class: 'ex-actions' }, btn(['Reconstruct ', icon('arrow', 16)], () => { step = 2; draw(); }, 'primary'))));
    } else if (step === 2) {
      body.replaceChildren(card(h('h3', '3 · Reconstruct the text'), h('p', { class: 'muted' }, 'Using your notes and your grammar, write the text. Pay attention to verb tenses, agreement and the little words that link everything.'),
        h('div', { class: 'grid grid-2' }, h('div', null, h('div', { class: 'small muted' }, 'Your notes'), h('div', { class: 'marked', style: { minHeight: '120px' } }, notes.value || '—')), h('div', null, recon, accentBar(recon))),
        h('div', { class: 'ex-actions' }, btn(['Compare with the original ', icon('arrow', 16)], () => { if (wordCount(recon.value) < 5) return toast('Write your version first.'); step = 3; draw(); }, 'primary'))));
    } else {
      const { ops, score } = alignWords(original, recon.value);
      store.state.writing.push({ id: `d${Date.now()}`, task: { id: `dictogloss-${t.id}`, kind: 'dictogloss', title: `Dictogloss: ${t.title}`, level: t.level, prompt: t.context, min: 0, reqs: [] }, ts: Date.now(), drafts: [{ text: recon.value, ts: Date.now() }], score, done: true });
      logDone('dictogloss'); store.save();
      const mined = new Set();
      body.replaceChildren(card(h('h3', `4 · Compare · ${Math.round(score * 100)}% word match`),
        h('p', { class: 'small muted' }, 'You don’t need the same words — but compare the grammar. Underlined words are where your version differs from the original.'),
        h('div', { class: 'diff' }, ops.map((o) => h('span', { class: `d-${o.type}`, title: o.type }, o.ref ?? o.hyp, (o.type === 'wrong' || o.type === 'spelling') ? h('span', { class: 'd-you' }, ` (${o.hyp})`) : null, ' '))),
        h('h4', 'Original'), h('div', { class: 'transcript' }, sentences(original).map((s) => h('p', null, s, ' ', sayBtn(s, { voice }), ' ',
          h('label', { class: 'small muted' }, h('input', { type: 'checkbox', onchange: (e) => (e.target.checked ? mined.add(s) : mined.delete(s)) }), ' review')))),
        h('div', { class: 'note' }, h('b', 'Notice: '), t.focus.note),
        h('p', { class: 'small' }, 'Ask yourself: which forms did the original use that you didn’t (tenses, prepositions, connectors)? Those are your next learning targets.'),
        h('div', { class: 'ex-actions' }, btn('Save chosen sentences to review', () => {
          mined.forEach((s) => addCard(`s:${s.slice(0, 50)}`, 'sentence', { text: s }, { source: 'dictation', priority: true }));
          toast(mined.size ? `${mined.size} added` : 'Tick sentences first');
        }), btn('Another text', () => { const others = TEXTS.filter((x) => x.type !== 'dialogue' && x.id !== t.id); location.hash = `#/writing/dictogloss/${pick(others).id}`; }, 'primary'))));
    }
  };
  mount(root, h('div', { class: 'page-head' }, h('div', { class: 'crumbs' }, h('a', { href: '#/writing' }, '← Escribir')), h('div', { class: 'row' }, levelBadge(t.level)), h('h1', `Dictogloss: ${t.title}`),
    h('p', { class: 'lead' }, 'A task where listening, grammar and writing meet (Wajnryb). Reconstructing a text forces you to notice the forms you can’t produce yet — research with this task (Kowal & Swain) found learners noticing and testing grammar hypotheses as they rebuilt the text.')), body);
  draw();
  return () => stopSpeaking();
}
