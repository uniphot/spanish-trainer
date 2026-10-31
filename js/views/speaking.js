// Hablar: pronunciation (perception → production), shadowing, 4/3/2 fluency, guided role-plays,
// and the AI conversation partner.
import { h, mount, btn, card, icon, shuffle, pick, sample, levelBadge, toast, fmtClock, sayBtn, smartAccents, accentBar, sparkline, modal } from '../core/ui.js';
import { store, logDone, logError, today } from '../core/store.js';
import { PRON, FLUENCY_TOPICS, ROLEPLAYS, AI_SCENARIOS } from '../data/speaking.js';
import { DICTATION, TEXTS } from '../data/listening.js';
import { speak, speakLines, stopSpeaking, voicePool, nextVoice, listen, sttSupported, Recorder, playUrl } from '../core/speech.js';
import { alignWords, loose, words as tokenize, norm, wordCount } from '../core/text.js';
import { addCard } from '../core/srs.js';
import { levelIndex } from '../core/learner.js';
import { aiAvailable, conversationTurn, speakingFeedback, friendlyError } from '../core/ai.js';

export const strand = 'output';

export async function render(root, params, ctx) {
  const [sub, id] = params;
  if (sub === 'pronunciation') { ctx.setStrand('language'); return id ? pronUnit(root, PRON.find((p) => p.id === id) || PRON[0]) : pronList(root); }
  if (sub === 'shadowing') { ctx.setStrand('fluency'); return shadowing(root, ctx.params); }
  if (sub === 'fluency') { ctx.setStrand('fluency'); return fluency(root); }
  if (sub === 'roleplay') return id ? roleplay(root, ROLEPLAYS.find((r) => r.id === id)) : roleplayList(root);
  if (sub === 'conversation') return conversation(root, id);
  return hub(root);
}

const sttNote = () => (sttSupported() ? null : h('div', { class: 'note warn' }, 'Speech recognition isn’t available in this browser, so you can record and replay yourself but not get automatic transcripts. Open the app in Chrome, Edge or Safari for the full experience.'));

function hub(root) {
  mount(root,
    h('div', { class: 'page-head' }, h('h1', 'Hablar'), h('p', { class: 'lead' }, 'Speaking improves through four different kinds of practice: accurate sounds, fluent delivery of language you already know, and real-time interaction where you must find the words yourself.')),
    sttNote(),
    h('div', { class: 'grid grid-2' },
      h('a', { class: 'tile', href: '#/speaking/pronunciation' }, h('div', { class: 'tile-tag' }, 'Sounds'), h('h3', 'Pronunciation'),
        h('p', null, `${PRON.length} units. Train your ear first with minimal pairs from several voices, then your mouth with speech recognition.`)),
      h('a', { class: 'tile', href: '#/speaking/shadowing' }, h('div', { class: 'tile-tag' }, 'Fluency'), h('h3', 'Shadowing'),
        h('p', null, 'Speak along with a native model, then compare with your own recording. Build-up mode for long sentences.')),
      h('a', { class: 'tile', href: '#/speaking/fluency' }, h('div', { class: 'tile-tag' }, 'Fluency'), h('h3', '4 / 3 / 2'),
        h('p', null, 'Give the same talk three times in 4, 3 and 2 minutes. Your words-per-minute is measured each round.')),
      h('a', { class: 'tile', href: '#/speaking/roleplay' }, h('div', { class: 'tile-tag' }, 'Interaction'), h('h3', 'Guided role-plays'),
        h('p', null, `${ROLEPLAYS.length} situations. Hear a line, get a cue in English, answer out loud in real time.`)),
      h('a', { class: 'tile', href: '#/speaking/conversation' }, h('div', { class: 'tile-tag' }, aiAvailable() ? 'Interaction · AI' : 'Interaction · needs API key'), h('h3', '✦ Conversation partner'),
        h('p', null, 'Free conversation with an AI partner who adapts to your level, and gives you a hint to self-correct before showing the correction.'))));
}

// ---- Mic widget -----------------------------------------------------------------------------
// Records audio (for playback) and runs speech recognition at the same time.
export function micWidget({ continuous = false, onDone, label = 'Speak', autoStopMs = 0, onStart, stopLabel = 'Stop' } = {}) {
  const live = h('div', { class: 'live-text', 'data-placeholder': sttSupported() ? 'Your words will appear here…' : 'Recording (no transcript in this browser)…' });
  const meterFill = h('div');
  const meter = h('div', { class: 'meter' }, meterFill);
  let rec = null, ctl = null, active = false, timer = null;
  const mine = h('span');
  const b = btn([icon('mic', 18), ` ${label}`], () => (active ? stop() : start()), 'rec');
  const start = async () => {
    active = true; window.__recording = true;
    b.classList.add('live'); b.lastChild.textContent = ` ${stopLabel}`;
    live.textContent = '';
    stopSpeaking();
    if (Recorder.supported()) {
      rec = new Recorder();
      try { await rec.start((lvl) => { meterFill.style.width = `${Math.min(100, lvl * 220)}%`; }); } catch { rec = null; toast('Microphone permission denied.', 'bad'); }
    }
    if (sttSupported()) {
      ctl = listen({ continuous, onInterim: (t) => { live.textContent = t; } });
      ctl.done.then((res) => { if (!continuous && active) stop(res); }).catch((e) => { toast(e.message, 'bad'); });
    }
    if (autoStopMs) timer = setTimeout(stop, autoStopMs);
    onStart?.();
  };
  const stop = async (res) => {
    if (!active) return;
    active = false; window.__recording = false; clearTimeout(timer);
    b.classList.remove('live'); b.lastChild.textContent = ` ${label}`;
    ctl?.stop();
    let result = res;
    if (!result && ctl) { try { result = await ctl.done; } catch { result = { transcript: live.textContent, alternatives: [] }; } }
    const url = rec ? await rec.stop() : null;
    meterFill.style.width = '0%';
    mine.replaceChildren(url ? btn([icon('play', 14), ' Me'], () => playUrl(url), 'small') : '');
    onDone?.({ transcript: (result?.transcript || live.textContent || '').trim(), alternatives: result?.alternatives || [], url, duration: rec?.duration });
  };
  const el = h('div', { class: 'stack' }, h('div', { class: 'row' }, b, meter, mine), live);
  el._start = start; el._stop = () => stop(); el._isActive = () => active;
  return el;
}

// ---- Pronunciation --------------------------------------------------------------------------
function pronList(root) {
  const scores = store.state.speaking.filter((s) => s.kind === 'pairs');
  mount(root, h('div', { class: 'page-head' }, h('div', { class: 'crumbs' }, h('a', { href: '#/speaking' }, '← Hablar')), h('h1', 'Pronunciación'),
    h('p', { class: 'lead' }, 'Perception before production: you can’t reliably make a difference you can’t hear. Each unit trains your ear with minimal pairs spoken by different voices (high-variability phonetic training), then checks your production.')),
  h('div', { class: 'grid grid-2' }, PRON.map((p) => {
    const best = scores.filter((s) => s.unit === p.id).reduce((m, s) => Math.max(m, s.score), -1);
    return h('a', { class: 'topic', href: `#/speaking/pronunciation/${p.id}` }, h('div', { style: { flex: 1 } }, h('div', { class: 't-title' }, p.title), h('div', { class: 't-en' }, p.en + (p.pairs.length ? ` · ${p.pairs.length} minimal pairs` : ''))),
      best >= 0 ? h('span', { class: 'tag' }, `ear ${Math.round(best * 100)}%`) : null);
  })));
}

function pronUnit(root, u) {
  const latam = store.state.profile.variety === 'latam';
  const body = h('div');
  mount(root, h('div', { class: 'page-head' }, h('div', { class: 'crumbs' }, h('a', { href: '#/speaking/pronunciation' }, '← Pronunciación')), h('h1', u.title), h('p', { class: 'lead' }, u.en)),
    card(h('div', { class: 'explain', html: u.explain })), body);
  const sections = [];
  if (u.pairs.length && !(u.spainOnly && latam && false)) sections.push(card(h('h3', '1 · Train your ear'),
    u.spainOnly ? h('p', { class: 'small muted' }, 'These pairs differ only in Spain’s distinción; the app plays them with Spain voices where available.') : null,
    h('p', { class: 'small muted' }, 'You’ll hear one word of a pair, from a different voice each time. Choose what you heard. 12 trials.'),
    btn('Start listening test', (e) => { const holder = e.currentTarget.parentNode; perception(holder, u); }, 'primary')));
  sections.push(card(h('h3', `${u.pairs.length ? '2' : '1'} · Say it`),
    sttNote(),
    h('p', { class: 'small muted' }, 'Listen, then record yourself. The speech recogniser shows what it understood — a rough test of intelligibility, not of a perfect accent. Compare your recording with the model.'),
    h('div', { class: 'stack' }, [...u.words.map((w) => ({ w, kind: 'word' })), ...(u.pairs.length && u.id !== 'entonacion' ? sample(u.pairs, 3).map(([a, b]) => ({ w: `${a} · ${b}`, kind: 'pair', a, b })) : []), { w: u.sentence, kind: 'sentence' }]
      .map((x) => productionRow(x, u)))));
  body.append(...sections);
}

function perception(holder, u) {
  const pool = voicePool().filter((v) => !u.spainOnly || /es[-_]ES/i.test(v.lang));
  const voices = pool.length ? pool : voicePool();
  const trials = Array.from({ length: 12 }, () => { const pair = pick(u.pairs); const k = Math.random() < 0.5 ? 0 : 1; return { pair, k, voice: voices[Math.floor(Math.random() * Math.min(voices.length, 6))] }; });
  let i = 0, right = 0;
  const box = h('div');
  holder.replaceChildren(h('h3', '1 · Train your ear'), box);
  const show = () => {
    if (i >= trials.length) {
      const score = right / trials.length;
      store.state.speaking.push({ ts: Date.now(), kind: 'pairs', unit: u.id, score }); store.save();
      box.replaceChildren(h('div', { class: 'summary-big' }, `${right} / ${trials.length}`),
        h('p', { class: 'muted' }, score >= 0.9 ? 'Your ear distinguishes these well. Move on to production.' : 'Keep training — perception improves quickly with varied voices. Repeat the test tomorrow.'),
        btn('Again', () => perception(holder, u), 'primary'));
      return;
    }
    const t = trials[i];
    const target = t.pair[t.k];
    const labels = u.pairLabels || t.pair;
    let done = false;
    const opts = h('div', { class: 'yesno' }, t.pair.map((w, k) => btn(u.pairLabels ? labels[k] : w, (e) => {
      if (done) return; done = true;
      const ok = k === t.k; if (ok) right++;
      e.currentTarget.classList.add(ok ? 'ok' : 'danger');
      fb.replaceChildren(h('div', { class: `feedback ${ok ? 'ok' : 'bad'}` }, h('div', { class: 'fb-body' }, h('div', { class: 'fb-title' }, ok ? 'Correct' : `It was: ${target}`),
        h('div', { class: 'row' }, t.pair.map((w2) => btn([icon('play', 14), ' ', w2], () => speak(w2, { voice: t.voice }), 'small'))))),
        btn(['Next ', icon('arrow', 16)], () => { i++; show(); }, 'primary'));
    }, 'big')));
    const fb = h('div', { class: 'stack' });
    box.replaceChildren(h('div', { class: 'progress-top' }, h('span', { class: 'small muted' }, `${i + 1} / ${trials.length}`), h('div', { class: 'bar' }, h('div', { class: 'bar-fill', style: { width: `${(i / trials.length) * 100}%` } }))),
      h('div', { class: 'row', style: { justifyContent: 'center', margin: '10px 0' } }, h('button', { class: 'say big', onclick: () => speak(target, { voice: t.voice }) }, icon('play', 24))), opts, fb);
    setTimeout(() => speak(target, { voice: t.voice }), 250);
  };
  show();
}

function productionRow(x, u) {
  const out = h('div', { class: 'small' });
  const say = x.kind === 'pair' ? `${x.a}. ${x.b}.` : x.w;
  const mic = micWidget({ label: 'Record', onDone: ({ transcript, alternatives, url }) => {
    if (!sttSupported()) { out.replaceChildren(url ? 'Listen to yourself and compare with the model.' : ''); return; }
    if (!transcript) { out.replaceChildren(h('span', { class: 'muted' }, 'Nothing recognised — try again a bit louder.')); return; }
    if (x.kind === 'pair') {
      const heard = norm([transcript, ...alternatives].join(' '));
      const gotA = heard.split(' ').includes(norm(x.a)), gotB = heard.split(' ').includes(norm(x.b));
      out.replaceChildren(h('span', null, `Recognised: “${transcript}”. `), gotA && gotB ? h('b', { style: { color: 'var(--ok)' } }, 'Both words came through distinctly. ') : h('b', { style: { color: 'var(--bad)' } }, `Only ${gotA ? x.a : gotB ? x.b : 'neither word'} was recognised — the contrast may not be clear yet.`));
      store.state.speaking.push({ ts: Date.now(), kind: 'pron', unit: u.id, score: gotA && gotB ? 1 : 0 }); store.save();
      return;
    }
    const best = [transcript, ...alternatives].map((t) => alignWords(x.w, t)).sort((a, b) => b.score - a.score)[0];
    out.replaceChildren(h('div', { class: 'diff', style: { fontSize: '1rem' } }, best.ops.map((o) => h('span', { class: `d-${o.type === 'accent' ? 'ok' : o.type}` }, o.ref ?? o.hyp, ' '))),
      h('span', { class: 'muted' }, `${Math.round(best.score * 100)}% recognised`));
    store.state.speaking.push({ ts: Date.now(), kind: 'pron', unit: u.id, score: best.score }); store.save();
  } });
  return h('div', { style: { borderTop: '1px solid var(--line)', paddingTop: '10px' } },
    h('div', { class: 'row' }, sayBtn(say), btn('Slow', () => speak(say, { rate: 0.7 }), 'small ghost'), h('b', { class: 'es', style: { fontSize: x.kind === 'sentence' ? '1.1rem' : '1.25rem' } }, x.w)),
    h('div', { style: { marginTop: '8px' } }, mic), out);
}

// ---- Shadowing -------------------------------------------------------------------------------
function shadowing(root, query) {
  const lvl = query.get('level') || (DICTATION[store.state.profile.level] ? store.state.profile.level : store.state.profile.level === 'C2' ? 'C1' : 'A2');
  const src = query.get('src') || 'sentences';
  const items = src === 'texts'
    ? TEXTS.filter((t) => t.level === lvl).flatMap((t) => t.lines.map((l) => l[1])).filter((s) => s.length < 220)
    : DICTATION[lvl];
  const list = items.length ? items : DICTATION.A2;
  let i = 0, reps = 0, sentencesDone = 0;
  const voice = nextVoice();
  const wrap = h('div');
  mount(root, h('div', { class: 'page-head' }, h('div', { class: 'crumbs' }, h('a', { href: '#/speaking' }, '← Hablar')), h('h1', 'Shadowing'),
    h('p', { class: 'lead' }, 'Listen, then speak along with the model at the same time, copying rhythm, linking and melody. Studies with Japanese learners of English found clear listening gains, especially for lower-intermediate learners.'),
    h('div', { class: 'row' }, h('div', { class: 'chips' }, Object.keys(DICTATION).map((L) => h('a', { class: `chip ${L === lvl ? 'on' : ''}`, href: `#/speaking/shadowing?level=${L}&src=${src}` }, L))),
      h('div', { class: 'chips' }, [['sentences', 'Sentences'], ['texts', 'Listening texts']].map(([k, l]) => h('a', { class: `chip ${k === src ? 'on' : ''}`, href: `#/speaking/shadowing?level=${lvl}&src=${k}` }, l))))),
  sttNote(), wrap);
  const show = () => {
    const text = list[i % list.length];
    let hidden = false;
    const textEl = h('div', { class: 'ex-prompt es', style: { marginBottom: '6px' } }, text);
    const out = h('div');
    const myRec = { url: null };
    const recorder = new Recorder();
    const shadowBtn = btn([icon('mic', 16), ' Shadow (speak along)'], async () => {
      if (!Recorder.supported()) return toast('Recording not supported in this browser.');
      try { await recorder.start(); } catch { return toast('Microphone permission denied.', 'bad'); }
      window.__recording = true; shadowBtn.disabled = true;
      await speak(text, { voice });
      await new Promise((r) => setTimeout(r, 600));
      myRec.url = await recorder.stop(); window.__recording = false; shadowBtn.disabled = false;
      reps++; repsEl.textContent = `${reps} repetition${reps === 1 ? '' : 's'}`;
      out.replaceChildren(h('div', { class: 'row' }, btn([icon('replay', 14), ' Compare: model, then me'], async () => { await speak(text, { voice }); await playUrl(myRec.url); }, 'small'), btn([icon('play', 14), ' Me'], () => playUrl(myRec.url), 'small')));
    }, 'rec');
    const echo = micWidget({ label: 'Echo (repeat after)', onDone: ({ transcript }) => {
      if (!transcript) return;
      reps++; repsEl.textContent = `${reps} repetition${reps === 1 ? '' : 's'}`;
      const { ops, score } = alignWords(text, transcript);
      store.state.speaking.push({ ts: Date.now(), kind: 'shadow', score }); store.save();
      out.replaceChildren(h('div', { class: 'diff', style: { fontSize: '1.05rem' } }, ops.map((o) => h('span', { class: `d-${o.type === 'accent' ? 'ok' : o.type}` }, o.ref ?? o.hyp, ' '))),
        h('span', { class: 'small muted' }, `${Math.round(score * 100)}% recognised`));
    } });
    const buildUp = async () => {
      const w = text.split(' ');
      const n = Math.ceil(w.length / 4);
      for (let k = 1; k <= n; k++) {
        const part = w.slice(Math.max(0, w.length - k * 4)).join(' ');
        await speak(part, { voice, rate: 0.9 });
        await new Promise((r) => setTimeout(r, 600 + part.length * 70)); // your turn to repeat
      }
    };
    const repsEl = h('span', { class: 'small muted' }, '0 repetitions');
    wrap.replaceChildren(h('div', { class: 'ex-card' },
      h('div', { class: 'ex-meta' }, h('span', { class: 'tag' }, `${(i % list.length) + 1} / ${list.length}`), repsEl, h('span', { class: 'spacer' }),
        h('label', { class: 'check small' }, h('input', { type: 'checkbox', onchange: (e) => { hidden = e.target.checked; textEl.style.filter = hidden ? 'blur(7px)' : ''; } }), 'Hide text')),
      textEl,
      h('div', { class: 'row', style: { margin: '10px 0' } },
        btn([icon('play', 16), ' Listen'], () => speak(text, { voice }), 'primary'), btn('Slow', () => speak(text, { voice, rate: 0.75 }), 'small'),
        btn('Build-up from the end', buildUp, 'small'), h('span', { class: 'small muted' }, 'Long sentence? Build-up plays it in growing chunks from the end; repeat each one.')),
      h('hr'),
      h('div', { class: 'row' }, shadowBtn, h('span', { class: 'small muted' }, 'The model plays while you speak; then compare.')),
      h('div', { style: { marginTop: '14px' } }, echo),
      out,
      h('div', { class: 'ex-actions' }, btn(['Next sentence ', icon('arrow', 16)], () => {
        if (reps) sentencesDone++;
        if (sentencesDone >= 5) logDone('shadow');
        i++; reps = 0; show();
      }, 'primary'), h('span', { class: 'small muted' }, 'Aim for 3–5 repetitions until it feels effortless.'))));
    setTimeout(() => speak(text, { voice }), 300);
  };
  show();
  return () => stopSpeaking();
}

// ---- 4/3/2 fluency ------------------------------------------------------------------------------
const FILLERS = ['eh', 'em', 'ehm', 'mmm', 'este', 'pues', 'bueno', 'o sea', 'mm'];
function fluency(root) {
  const li = levelIndex(store.state.profile.level || 'A2');
  const topics = FLUENCY_TOPICS.filter((t) => Math.abs(levelIndex(t.level) - li) <= 1);
  const history = store.state.fluency.slice(-8);
  mount(root, h('div', { class: 'page-head' }, h('div', { class: 'crumbs' }, h('a', { href: '#/speaking' }, '← Hablar')), h('h1', '4 / 3 / 2'),
    h('p', { class: 'lead' }, 'Paul Nation’s fluency technique: give the same talk three times — in 4, then 3, then 2 minutes. Because the content stays the same, all your attention goes to saying it faster and more smoothly. Studies (e.g. de Jong & Perfetti, 2011) found fewer hesitations in later rounds.')),
  sttNote(),
  history.length ? card(h('h3', 'Your recent sessions'), h('div', { class: 'row' }, sparkline(history.map((f) => f.rounds[f.rounds.length - 1]?.wpm || 0), { w: 220, hgt: 50 }),
    h('span', { class: 'small muted' }, `Final-round speed: ${history.map((f) => Math.round(f.rounds[f.rounds.length - 1]?.wpm || 0)).join(' → ')} words/min`))) : null,
  h('h3', 'Choose a topic you know well'),
  h('div', { class: 'grid grid-2' }, (topics.length ? topics : FLUENCY_TOPICS).map((t) => h('button', { class: 'topic', style: { textAlign: 'left', cursor: 'pointer' }, onclick: () => fluencyPrep(root, t) },
    levelBadge(t.level), h('div', { style: { flex: 1 } }, h('div', { class: 't-title' }, t.topic), h('div', { class: 't-en' }, t.prompt))))));
}
function fluencyPrep(root, t) {
  let short = levelIndex(store.state.profile.level || 'A2') <= 1;
  const notes = h('textarea', { rows: 4, placeholder: 'Optional: 3–6 key words or ideas (not full sentences).' });
  smartAccents(notes);
  const durLabel = () => (short ? '2 / 1½ / 1 minutes' : '4 / 3 / 2 minutes');
  const lbl = h('span', null, durLabel());
  mount(root, h('div', { class: 'page-head' }, h('div', { class: 'crumbs' }, h('a', { href: '#/speaking/fluency' }, '← 4/3/2')), h('h1', t.topic), h('p', { class: 'lead' }, t.prompt)),
    card(h('h3', 'Prepare (about 1 minute)'),
      h('p', { class: 'small muted' }, 'Plan what you’ll say. Useful chunks:'),
      h('div', { class: 'chips' }, t.chunks.map((c) => h('span', { class: 'chip', onclick: () => speak(c) }, c))),
      h('div', { style: { marginTop: '12px' } }, notes),
      h('label', { class: 'check', style: { marginTop: '12px' } }, h('input', { type: 'checkbox', checked: short, onchange: (e) => { short = e.target.checked; lbl.textContent = durLabel(); } }), 'Short version for beginners (2 / 1½ / 1 min)'),
      h('p', { class: 'small muted' }, 'Each round, imagine you are telling it to a different person who hasn’t heard it yet.'),
      h('div', { class: 'ex-actions' }, btn(['Start round 1 · ', lbl], () => fluencyRounds(root, t, short ? [120, 90, 60] : [240, 180, 120], notes.value), 'primary big'))));
}
function fluencyRounds(root, t, durations, notes) {
  const rounds = [];
  const wrap = h('div');
  mount(root, h('div', { class: 'page-head' }, h('h1', t.topic), h('p', { class: 'lead' }, t.prompt)), wrap);
  const run = (k) => {
    const secs = durations[k];
    let left = secs, startedAt = null, tick = null;
    const timer = h('div', { class: 'timer' }, fmtClock(left));
    const chips = h('div', { class: 'row' }, durations.map((d, j) => h('div', { class: `round-chip ${j === k ? 'on' : ''}` }, h('span', { class: 'small muted' }, `Round ${j + 1}`), h('b', fmtClock(d)),
      rounds[j] ? h('span', { class: 'small' }, `${Math.round(rounds[j].wpm)} wpm`) : null)));
    const mic = micWidget({ continuous: true, label: `Start round ${k + 1}`, stopLabel: 'Finish early', onStart: () => {
      startedAt = Date.now();
      tick = setInterval(() => {
        left = secs - Math.floor((Date.now() - startedAt) / 1000);
        timer.textContent = fmtClock(Math.max(0, left));
        if (left <= 10) timer.style.color = 'var(--accent)';
        if (left <= 0) { clearInterval(tick); mic._stop(); }
      }, 250);
    }, onDone: ({ transcript, url }) => {
      clearInterval(tick);
      const elapsed = Math.max(5, (Date.now() - startedAt) / 1000);
      const wc = wordCount(transcript);
      const low = ` ${norm(transcript)} `;
      const fillers = FILLERS.reduce((a, f) => a + (low.split(` ${f} `).length - 1), 0);
      rounds[k] = { secs: Math.round(elapsed), words: wc, wpm: sttSupported() ? wc / (elapsed / 60) : 0, fillers, transcript, url };
      if (k + 1 < durations.length) between(k);
      else finish();
    } });
    wrap.replaceChildren(card(chips, h('div', { class: 'row between', style: { margin: '16px 0' } }, timer, notes ? h('div', { class: 'small muted', style: { maxWidth: '50%' } }, h('b', 'Notes: '), notes) : null), mic));
  };
  const between = (k) => {
    const r = rounds[k];
    wrap.replaceChildren(card(h('h3', `Round ${k + 1} done`),
      h('div', { class: 'metrics' }, [['Words', r.words], ['Words/min', Math.round(r.wpm) || '—'], ['Fillers', r.fillers], ['Time', fmtClock(r.secs)]].map(([l, v]) => h('div', { class: 'metric' }, h('b', v), h('span', l)))),
      h('p', { style: { marginTop: '12px' } }, `Next: the same content in ${fmtClock(durations[k + 1])}. Don’t drop ideas — say them more efficiently. Imagine a new listener.`),
      r.url ? btn([icon('play', 14), ' Listen to this round'], () => playUrl(r.url), 'small') : null,
      h('div', { class: 'ex-actions' }, btn([`Go to round ${k + 2} `, icon('arrow', 16)], () => run(k + 1), 'primary'))));
  };
  const finish = () => {
    const entry = { ts: Date.now(), topic: t.topic, rounds: rounds.map(({ url, ...rest }) => rest) };
    store.state.fluency.push(entry); store.save();
    logDone('fluency');
    const last = rounds[rounds.length - 1];
    const fb = h('div');
    const gain = rounds[0].wpm ? Math.round(((last.wpm - rounds[0].wpm) / rounds[0].wpm) * 100) : null;
    wrap.replaceChildren(card(h('h3', 'Session complete'),
      h('table', { class: 'conj-table' }, h('tr', null, h('td', ''), ...rounds.map((_, j) => h('td', null, h('b', `Round ${j + 1}`)))),
        [['Time', (r) => fmtClock(r.secs)], ['Words', (r) => r.words], ['Words/min', (r) => Math.round(r.wpm) || '—'], ['Fillers', (r) => r.fillers]].map(([l, f]) => h('tr', null, h('td', l), ...rounds.map((r) => h('td', null, f(r)))))),
      gain != null ? h('p', { style: { marginTop: '12px' } }, gain > 0 ? `Your speed went up ${gain}% from round 1 to round 3.` : 'Speed didn’t rise this time — try saying the same ideas with fewer words next round.') : null,
      last.transcript ? h('details', null, h('summary', 'Transcript of the last round'), h('p', { class: 'es', style: { marginTop: '8px' } }, last.transcript)) : null,
      h('h4', 'Now focus on accuracy'),
      h('p', { class: 'small muted' }, 'Fluency practice works best combined with feedback on accuracy (Tran et al., 2021). Write down 2–3 things you wanted to say but couldn’t, and look them up — or ask the AI coach.'),
      aiAvailable() && last.transcript ? btn('✦ Get feedback on my last round', async (e) => {
        e.currentTarget.disabled = true; fb.replaceChildren(h('p', { class: 'muted' }, 'Analysing…'));
        try {
          const r = await speakingFeedback({ transcript: last.transcript, task: `${t.topic}: ${t.prompt}`, level: store.state.profile.level });
          fb.replaceChildren(h('p', null, r.summary),
            r.errors.map((er) => {
              addCard(`f:${er.original.slice(0, 40)}`, 'fix', { wrong: er.original, right: er.correction, note: er.explanation }, { source: 'speaking', priority: true });
              logError({ source: 'speaking', cat: 'grammar', text: er.original, fix: er.correction });
              return h('div', { class: 'issue' }, h('span', { class: 'orig' }, er.original), ' → ', h('span', { class: 'fixd' }, er.correction), h('div', { class: 'small muted' }, er.explanation));
            }),
            h('h4', 'A more natural version'), h('p', { class: 'es' }, r.better_version, ' ', sayBtn(r.better_version)),
            h('h4', 'Useful phrases'), h('div', null, r.useful_phrases.map((p) => h('div', { class: 'row' }, sayBtn(p.es), h('b', { class: 'es' }, p.es), h('span', { class: 'muted small' }, p.en)))),
            h('p', { class: 'small muted' }, 'The corrections were added to your review queue.'));
        } catch (err) { fb.replaceChildren(h('p', { class: 'note warn' }, friendlyError(err))); }
      }, 'primary') : null,
      fb,
      h('div', { class: 'ex-actions' }, btn('New topic', () => fluency(root)), btn('Back to Hablar', () => { location.hash = '#/speaking'; }, 'ghost'))));
  };
  run(0);
}

// ---- Guided role-plays ---------------------------------------------------------------------------
function roleplayList(root) {
  mount(root, h('div', { class: 'page-head' }, h('div', { class: 'crumbs' }, h('a', { href: '#/speaking' }, '← Hablar')), h('h1', 'Role-plays'),
    h('p', { class: 'lead' }, 'Hear the other person, read a cue in English, and answer out loud — the pressure of responding in real time is what turns knowledge into usable speech. Afterwards, compare with a natural model answer.')),
  sttNote(),
  h('div', { class: 'grid grid-2' }, ROLEPLAYS.map((r) => h('a', { class: 'topic', href: `#/speaking/roleplay/${r.id}` }, levelBadge(r.level),
    h('div', { style: { flex: 1 } }, h('div', { class: 't-title' }, r.title), h('div', { class: 't-en' }, r.setting))))));
}
function roleplay(root, rp) {
  if (!rp) { location.hash = '#/speaking/roleplay'; return; }
  const themVoice = voicePool()[1] || voicePool()[0];
  let i = 0, firstTry = 0, showText = true;
  const log = h('div', { class: 'chat' });
  const turnBox = h('div');
  mount(root, h('div', { class: 'page-head' }, h('div', { class: 'crumbs' }, h('a', { href: '#/speaking/roleplay' }, '← Role-plays')), h('h1', rp.title), h('p', { class: 'lead' }, rp.setting)),
    h('label', { class: 'check small', style: { marginBottom: '10px' } }, h('input', { type: 'checkbox', onchange: (e) => { showText = !e.target.checked; } }), 'Harder: hide the other person’s text (listen only)'),
    card(log), turnBox);
  const matches = (text, turn) => {
    const t = ` ${loose(text)} `;
    return turn.expect.every((group) => group.some((kw) => t.includes(` ${loose(kw)} `) || t.includes(loose(kw))));
  };
  const show = () => {
    if (i >= rp.turns.length) {
      logDone('speak');
      store.state.speaking.push({ ts: Date.now(), kind: 'roleplay', id: rp.id, score: firstTry / rp.turns.length }); store.save();
      turnBox.replaceChildren(card(h('h3', '¡Muy bien!'), h('p', null, `${firstTry} of ${rp.turns.length} turns understood on the first try.`),
        h('p', { class: 'small muted' }, 'Do it again tomorrow without looking at the cues: repeating a task makes you more fluent and frees attention for accuracy.'),
        h('div', { class: 'ex-actions' }, btn('Again', () => roleplay(root, rp), 'primary'), btn('Other role-plays', () => { location.hash = '#/speaking/roleplay'; }, 'ghost'))));
      return;
    }
    const turn = rp.turns[i];
    let tries = 0;
    const themBubble = h('div', { class: 'bubble them' }, h('b', { class: 'small' }, rp.them, ': '), showText ? turn.them : h('span', { class: 'muted' }, '(listen)'), ' ', sayBtn(turn.them, { voice: themVoice }));
    log.append(themBubble); log.scrollTop = log.scrollHeight;
    speak(turn.them, { voice: themVoice });
    const typed = h('input', { type: 'text', placeholder: 'Or type your answer and press Enter' });
    smartAccents(typed);
    const fb = h('div');
    const handle = (text) => {
      if (!text.trim()) return;
      tries++;
      const ok = matches(text, turn);
      if (ok && tries === 1) firstTry++;
      if (ok || tries >= 2) {
        if (!showText) themBubble.firstChild.nextSibling.replaceWith(document.createTextNode(turn.them));
        log.append(h('div', { class: 'bubble me' }, text, h('span', { class: 'fbk' }, ok ? '✓ ' : '', 'Model: ', h('i', null, turn.model), ' ', sayBtn(turn.model))));
        log.scrollTop = log.scrollHeight;
        if (!ok) addCard(`rp:${rp.id}:${i}`, 'custom', { front: `${turn.them}\n→ ${turn.cue}`, back: turn.model }, { source: 'speaking', priority: true });
        i++; show();
      } else {
        fb.replaceChildren(h('div', { class: 'feedback almost' }, h('div', { class: 'fb-body' }, h('div', { class: 'fb-title' }, 'Not quite — try once more.'),
          h('div', { class: 'small' }, `I heard: “${text}”. Make sure you include: ${turn.expect.map((g) => g[0]).join(', ')}.`))));
      }
    };
    typed.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); handle(typed.value); typed.value = ''; } });
    const mic = micWidget({ label: 'Answer', onDone: ({ transcript }) => handle(transcript) });
    turnBox.replaceChildren(card(h('div', { class: 'cue-en' }, '🗨 ', turn.cue), h('div', { style: { margin: '12px 0' } }, mic), typed, fb));
  };
  show();
  return () => stopSpeaking();
}

// ---- AI conversation ------------------------------------------------------------------------------
function conversation(root, scenarioId) {
  if (!aiAvailable()) {
    mount(root, h('div', { class: 'page-head' }, h('div', { class: 'crumbs' }, h('a', { href: '#/speaking' }, '← Hablar')), h('h1', 'Conversation partner')),
      card(h('p', null, 'The free conversation partner needs your own Anthropic API key (Settings → AI tutor). Without it, the guided role-plays give you structured speaking practice.'),
        h('div', { class: 'row' }, h('a', { class: 'btn primary', href: '#/settings' }, 'Add API key'), h('a', { class: 'btn', href: '#/speaking/roleplay' }, 'Role-plays'))));
    return;
  }
  if (!scenarioId) {
    const custom = h('input', { type: 'text', placeholder: 'e.g. Talking with a neighbour about the noise from a party' });
    mount(root, h('div', { class: 'page-head' }, h('div', { class: 'crumbs' }, h('a', { href: '#/speaking' }, '← Hablar')), h('h1', 'Conversation partner'),
      h('p', { class: 'lead' }, 'Talk freely. Your partner keeps the conversation going at your level. When you make an important mistake you first get a hint so you can correct yourself — research on corrective feedback finds that prompting self-repair tends to beat simply being given the right form.')),
    sttNote(),
    h('div', { class: 'grid grid-2' }, AI_SCENARIOS.map((s) => h('a', { class: 'topic', href: `#/speaking/conversation/${s.id}` }, levelBadge(s.level), h('div', { style: { flex: 1 } }, h('div', { class: 't-title' }, s.title))))),
    card(h('h3', 'Or your own situation'), custom, h('div', { class: 'ex-actions' }, btn('Start', () => {
      if (!custom.value.trim()) return;
      sessionStorage.setItem('custom-scenario', custom.value.trim());
      location.hash = '#/speaking/conversation/custom';
    }, 'primary'))));
    return;
  }
  const sc = scenarioId === 'custom' ? { title: 'Your situation', prompt: sessionStorage.getItem('custom-scenario') || 'A friendly chat.' } : AI_SCENARIOS.find((s) => s.id === scenarioId);
  if (!sc) { location.hash = '#/speaking/conversation'; return; }
  const history = [];
  const transcript = [];
  const chat = h('div', { class: 'chat' });
  const input = h('input', { type: 'text', placeholder: 'Escribe o usa el micrófono…' });
  smartAccents(input);
  const sugg = h('div', { class: 'chips', style: { marginTop: '8px' } });
  const voice = voicePool()[1] || voicePool()[0];
  let busy = false;
  const addThem = (d) => {
    const en = h('span', { class: 'en', style: { display: 'none' } }, d.reply_en);
    chat.append(h('div', { class: 'bubble them' }, d.reply, ' ', sayBtn(d.reply, { voice }), ' ', h('button', { class: 'btn small ghost', onclick: () => { en.style.display = en.style.display ? '' : 'none'; } }, 'EN'), en));
    chat.scrollTop = chat.scrollHeight;
    speak(d.reply, { voice });
    sugg.replaceChildren(...d.suggestions.map((s) => h('button', { class: 'chip', onclick: () => { input.value = s; input.focus(); } }, s)));
  };
  const send = async (text) => {
    if (busy || !text.trim()) return;
    busy = true; input.value = ''; sugg.replaceChildren();
    const mine = h('div', { class: 'bubble me' }, text);
    chat.append(mine, h('div', { class: 'bubble them muted small', id: 'typing' }, '…'));
    chat.scrollTop = chat.scrollHeight;
    history.push({ role: 'user', content: text });
    transcript.push({ who: 'me', text });
    try {
      const { data, content } = await conversationTurn({ scenario: sc.prompt, level: store.state.profile.level, history });
      history.push({ role: 'assistant', content });
      transcript.push({ who: 'them', text: data.reply });
      chat.querySelector('#typing')?.remove();
      if (data.feedback?.has_error) {
        const fbk = h('span', { class: 'fbk' });
        const reveal = () => {
          fbk.replaceChildren('✎ ', h('b', data.feedback.correction), ' ', sayBtn(data.feedback.correction), h('br'), h('span', { class: 'muted' }, data.feedback.explanation));
          addCard(`f:${text.slice(0, 40)}`, 'fix', { wrong: text, right: data.feedback.correction, note: data.feedback.explanation }, { source: 'speaking', priority: true });
          logError({ source: 'conversation', cat: 'grammar', text, fix: data.feedback.correction });
        };
        fbk.append('💡 ', data.feedback.hint, ' ', h('button', { class: 'btn small ghost', onclick: reveal }, 'Show correction'));
        mine.append(fbk);
      }
      addThem(data);
    } catch (e) {
      chat.querySelector('#typing')?.remove();
      history.pop(); transcript.pop();
      toast(friendlyError(e), 'bad', 5000);
    }
    busy = false;
  };
  input.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); send(input.value); } });
  const mic = micWidget({ label: 'Hablar', onDone: ({ transcript: t }) => send(t) });
  mount(root, h('div', { class: 'page-head' }, h('div', { class: 'crumbs' }, h('a', { href: '#/speaking/conversation' }, '← Scenarios')), h('h1', sc.title), h('p', { class: 'lead' }, sc.prompt)),
    card(chat), card(mic, h('div', { class: 'row', style: { marginTop: '10px' } }, h('div', { style: { flex: 1 } }, input), btn('Send', () => send(input.value), 'primary')), accentBar(input), sugg,
      h('div', { class: 'ex-actions' }, btn('End conversation', () => {
        if (transcript.length) { store.state.convo.push({ ts: Date.now(), scenario: sc.title, transcript }); logDone('speak'); store.save(); }
        location.hash = '#/speaking';
      }, 'ghost'))));
  // opening line from the partner
  (async () => {
    busy = true;
    chat.append(h('div', { class: 'bubble them muted small', id: 'typing' }, '…'));
    try {
      history.push({ role: 'user', content: '(The learner has just joined. Start the conversation with a short greeting and an opening question. There is nothing to correct yet.)' });
      const { data, content } = await conversationTurn({ scenario: sc.prompt, level: store.state.profile.level, history });
      history.push({ role: 'assistant', content });
      transcript.push({ who: 'them', text: data.reply });
      chat.querySelector('#typing')?.remove();
      addThem(data);
    } catch (e) { chat.querySelector('#typing')?.remove(); toast(friendlyError(e), 'bad', 6000); }
    busy = false;
  })();
  return () => stopSpeaking();
}
