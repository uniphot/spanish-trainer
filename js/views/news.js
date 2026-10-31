// Noticias: a daily digest of Mexican news for reading practice. Articles come from a fixed
// list of RSS feeds (see fetchNews). The reader lets you tap any word (verb
// analysis, Mexican usage, dictionary links, save as a card), listen with a Mexican voice, then
// retell the article in writing or out loud.
import { h, mount, btn, card, icon, levelBadge, toast, timeAgo, sayBtn, modal } from '../core/ui.js';
import { store, logDone, today } from '../core/store.js';
import { speak, stopSpeaking, spanishVoices } from '../core/speech.js';
import { syllabify } from '../core/phonology.js';
import { sentences, wordCount, escapeHtml } from '../core/text.js';
import { reverseIndex, verbInfo, TENSES, PERSONS } from '../core/conjugator.js';
import { addCard } from '../core/srs.js';
import { MEXICANISMS, mxLookup } from '../data/mexico.js';
import { aiAvailable, newsStudy, speakingFeedback, friendlyError } from '../core/ai.js';
import { micWidget } from './speaking.js';

export const strand = 'input';

export const GROUPS = { mexico: 'México', cdmx: 'CDMX', viajes: 'Viajes', cultura: 'Cultura', comida: 'Comida', sociedad: 'Sociedad', ciencia: 'Ciencia y tecnología', economia: 'Economía', mundo: 'Mundo', deportes: 'Deportes', espectaculos: 'Espectáculos' };
const JUNK = /cup[oó]n|cupones|descuento|resultados? del|sorteo|hor[oó]scopo|chispazo|melate|loter[ií]a|en vivo|minuto a minuto|quiniela|\btris\b|progol|d[oó]nde ver|a qu[eé] hora (es|juega|ver)|precio del d[oó]lar|tipo de cambio hoy|clima (hoy|cdmx)|pensi[oó]n del bienestar|calendario de pagos/i;
const HEAVY = /asesin|homicid|narco|cad[aá]ver|balacera|ejecutad|fosa|secuestr|feminicid|masacre|enfrentamiento|c[aá]rtel|violaci[oó]n|desmembr|tirote|ataque armado|a balazos|sicari|extorsi[oó]n|osamenta|linchad/i;
const NO_HIGHLIGHT = new Set(['padre', 'lana', 'joven', 'sale', 'fresa', 'foco', 'agarrar', 'pluma', 'picar', 'pesos', 'colonia', 'cuadra', 'boleto', 'carro', 'propina', 'credencial']);

let memory = null; // last /api/news response (full article list) for this page load

// The local server (serve.py) fetches the feeds live at api/news; the published static site has
// no server, so it reads news.json, which a scheduled GitHub Action regenerates every few hours.
async function fetchNews(force = false) {
  if (memory && !force) return memory;
  let res;
  try {
    res = await fetch(`api/news${force ? '?refresh=1' : ''}`);
    if (res.status === 404 || res.status === 405) res = await fetch('news.json', { cache: force ? 'no-cache' : 'default' });
  } catch { throw new Error('offline'); }
  if (res.status === 404) throw new Error('no-server');
  const data = await res.json();
  if (!data.items?.length) throw new Error(data.error || 'empty');
  memory = data;
  return data;
}

// Szigriszt-Pazos perspicuity index (the Spanish adaptation of Flesch reading ease).
export function readability(text) {
  const ws = (text.match(/[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]+/g) || []);
  if (ws.length < 20) return null;
  const syl = ws.reduce((a, w) => a + Math.max(1, syllabify(w.toLowerCase()).length), 0);
  const sents = Math.max(1, sentences(text).length);
  const p = 206.835 - 62.3 * (syl / ws.length) - ws.length / sents;
  const [label, lvl] = p >= 65 ? ['fácil', 'B1'] : p >= 55 ? ['normal', 'B1–B2'] : p >= 40 ? ['algo difícil', 'B2'] : ['difícil', 'C1'];
  return { score: Math.round(p), label, lvl };
}
const articleText = (it) => (it.paragraphs?.length ? it.paragraphs.join('\n') : it.summary || '');

function buildDigest(items, prefs) {
  const now = Date.now();
  const pool = items.filter((it) => !JUNK.test(it.title) && !(prefs.gentle && HEAVY.test(`${it.title} ${it.summary}`)) && it.paragraphs?.length);
  const fresh = pool.filter((it) => (now - (it.date || now)) / 864e5 <= (['viajes', 'cultura', 'comida'].includes(it.group) ? 10 : 3));
  const used = {};
  const score = (it) => {
    const hours = (now - (it.date || now)) / 36e5;
    const n = it.paragraphs.length;
    return 10 - Math.min(10, hours / 8) + (n >= 4 ? 4 : n >= 2 ? 2 : 0) - (n > 25 ? 1 : 0) + (it.image ? 0.5 : 0) - (used[it.outlet] || 0) * 1.5;
  };
  const slots = [['mexico'], ['cdmx'], ['viajes'], ['cultura', 'comida'], ['mexico', 'sociedad'], ['viajes', 'comida', 'cultura', 'cdmx'], ['ciencia', 'economia'], ['mundo', 'espectaculos', 'deportes', 'sociedad']];
  const chosen = [];
  const take = (groups) => {
    const cands = fresh.filter((it) => groups.includes(it.group) && !chosen.includes(it)).sort((a, b) => score(b) - score(a));
    if (cands[0]) { chosen.push(cands[0]); used[cands[0].outlet] = (used[cands[0].outlet] || 0) + 1; }
  };
  for (const slot of slots) { const g = slot.filter((x) => prefs.groups.includes(x)); if (g.length) take(g); }
  while (chosen.length < 8) { const before = chosen.length; take(prefs.groups); if (chosen.length === before) break; }
  return chosen.slice(0, 8);
}

function saveDigest(data, force) {
  const N = store.state.news;
  if (!force && N.date === today() && N.digest.length) return;
  const digest = buildDigest(data.items, N.prefs);
  const keepRead = N.digest.filter((d) => N.read[d.id] && !digest.some((x) => x.id === d.id));
  N.date = today();
  N.fetched = data.fetched;
  N.digest = [...digest, ...keepRead].map((it) => ({ ...it, paragraphs: it.paragraphs.slice(0, 30) }));
  N.headlines = data.items.slice(0, 120).map(({ id, title, outlet, section, group, date, summary, link }) => ({ id, title, outlet, section, group, date, link, summary: summary.slice(0, 200) }));
  store.save();
}

export async function render(root, params) {
  const [id] = params;
  if (id === 'mexicanismos') return glossary(root);
  if (id) return reader(root, id);
  return digestPage(root);
}

function variety() {
  if (store.state.profile.variety === 'latam') return null;
  return h('div', { class: 'note' }, h('b', 'Going to Mexico? '), 'Switch your Spanish variety to Latin America: Mexican voices by default, and ustedes instead of vosotros in drills. ',
    btn('Switch now', () => { store.state.profile.variety = 'latam'; store.save(); toast('Variety set to Latin America'); location.reload(); }, 'small'));
}

function digestCard(it) {
  const read = store.state.news.read[it.id];
  const r = readability(articleText(it));
  return h('a', { class: 'tile news-tile', href: `#/news/${it.id}` },
    it.image ? h('img', { class: 'news-img', src: it.image, alt: '', loading: 'lazy', referrerpolicy: 'no-referrer', onerror: (e) => e.target.remove() }) : null,
    h('div', { class: 'tile-tag' }, GROUPS[it.group] || it.section, ' · ', it.outlet),
    h('h3', null, it.title),
    h('p', null, (it.summary || it.paragraphs[0] || '').slice(0, 170), (it.summary || '').length > 170 ? '…' : ''),
    h('div', { class: 'row small muted', style: { marginTop: '8px' } }, it.date ? timeAgo(it.date) : '', r ? h('span', { class: 'tag' }, `lectura ${r.label}`) : null,
      `${wordCount(articleText(it))} palabras`, read ? h('span', { class: 'tag', style: { color: 'var(--ok)' } }, '✓ leído') : null));
}

async function digestPage(root) {
  const N = store.state.news;
  const body = h('div');
  const status = h('span', { class: 'small muted' });
  const refresh = btn([icon('replay', 14), ' Refresh'], () => load(true), 'small');
  mount(root,
    h('div', { class: 'page-head' }, h('h1', 'Noticias de México'),
      h('p', { class: 'lead' }, 'A daily digest of real Mexican news to read for practice. Read for meaning first; tap a word only when it blocks understanding. Then retell the story in writing or out loud.')),
    variety(),
    h('div', { class: 'row between', style: { marginBottom: '12px' } }, h('div', { class: 'row' }, h('b', new Date().toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long' })), status), h('div', { class: 'row' }, h('a', { class: 'btn small ghost', href: '#/news/mexicanismos' }, 'Español de México'), refresh)),
    body);

  const draw = (data) => {
    const prefsCard = card(h('h3', 'Your interests'),
      h('div', { class: 'chips' }, Object.entries(GROUPS).map(([g, label]) => h('button', { class: `chip ${N.prefs.groups.includes(g) ? 'on' : ''}`, onclick: (e) => {
        const set = new Set(N.prefs.groups); set.has(g) ? set.delete(g) : set.add(g);
        if (!set.size) return toast('Keep at least one.');
        N.prefs.groups = [...set]; store.save(); e.currentTarget.classList.toggle('on');
      } }, label))),
      h('label', { class: 'check', style: { marginTop: '10px' } }, h('input', { type: 'checkbox', checked: N.prefs.gentle, onchange: (e) => { N.prefs.gentle = e.target.checked; store.save(); } }), 'Lighter digest: skip crime and violence stories'),
      h('div', { class: 'ex-actions' }, btn('Rebuild today’s digest', () => { if (memory) { saveDigest(memory, true); draw(memory); } else load(true); }, 'small')),
      data?.sources ? h('details', { class: 'small muted' }, h('summary', `Sources (${data.sources.filter((s) => s.ok && s.count).length}/${data.sources.length} available)`),
        h('ul', null, data.sources.map((s) => h('li', null, `${s.outlet} · ${s.section}: `, s.ok ? `${s.count} articles` : h('span', { style: { color: 'var(--bad)' } }, 'unavailable'))))) : null);
    const others = (N.headlines || []).filter((x) => !N.digest.some((d) => d.id === x.id) && !JUNK.test(x.title) && !(N.prefs.gentle && HEAVY.test(`${x.title} ${x.summary}`)));
    const byGroup = {};
    for (const x of others) (byGroup[x.group] ||= []).push(x);
    body.replaceChildren(
      N.digest.length ? h('div', { class: 'grid grid-2' }, N.digest.map(digestCard)) : h('p', { class: 'muted' }, 'No articles matched your interests today.'),
      h('h3', { style: { marginTop: '26px' } }, 'Más titulares'),
      h('div', { class: 'grid grid-2' }, Object.keys(GROUPS).filter((g) => byGroup[g]?.length).map((g) => card(h('h4', { style: { marginTop: 0 } }, GROUPS[g]),
        byGroup[g].slice(0, 6).map((x) => h('div', { class: 'err-row small' }, h('a', { href: `#/news/${x.id}`, style: { flex: 1 } }, x.title), h('span', { class: 'muted' }, x.outlet)))))),
      prefsCard);
  };

  const load = async (force) => {
    status.textContent = force ? 'Refreshing…' : N.date === today() ? '' : 'Loading today’s news…';
    if (N.date === today() && N.digest.length && !force) { draw(memory); status.textContent = `updated ${timeAgo(N.fetched)}`; }
    try {
      const data = await fetchNews(force);
      saveDigest(data, force);
      draw(data);
      status.textContent = `updated ${timeAgo(N.fetched)}`;
    } catch (e) {
      status.textContent = '';
      if (N.digest.length) { draw(null); toast('Couldn’t refresh — showing your last digest.'); return; }
      body.replaceChildren(card(h('h3', 'News couldn’t be loaded'),
        e.message === 'no-server' ? h('p', null, 'The news digest needs the app’s own server. Stop the current one and start it with ', h('code', null, 'python3 serve.py'), ' in the project folder.')
          : h('p', null, 'Check your internet connection and try again. (Details: ', e.message, ')'),
        btn('Try again', () => load(true), 'primary')));
    }
  };
  load(false);
}

// ---- Reader -------------------------------------------------------------------------------
function mexicanVoice() {
  const vs = spanishVoices();
  return vs.find((v) => /es[-_]MX/i.test(v.lang)) || vs.find((v) => /es[-_](US|419)/i.test(v.lang)) || undefined;
}

function wordInfo(word) {
  const lw = word.toLowerCase();
  const rs = (reverseIndex().get(lw) || []).slice(0, 3);
  return rs.map((r) => {
    const info = verbInfo(r.inf) || verbInfo(r.inf + 'se') || {};
    const tense = r.tense === 'pp' ? 'participio' : r.tense === 'ger' ? 'gerundio' : TENSES[r.tense]?.es || r.tense;
    return `${r.inf}${info.en ? ` (${info.en})` : ''} · ${tense}${r.person >= 0 ? ` · ${PERSONS[r.person]}` : ''}`;
  });
}

async function reader(root, id) {
  const N = store.state.news;
  let it = N.digest.find((x) => x.id === id) || memory?.items.find((x) => x.id === id);
  mount(root, h('p', { class: 'muted' }, 'Loading…'));
  if (!it) {
    try { it = (await fetchNews()).items.find((x) => x.id === id); } catch { /* handled below */ }
  }
  if (!it) {
    mount(root, card(h('p', null, 'This article is no longer in the feed.'), h('a', { class: 'btn', href: '#/news' }, '← Noticias')));
    return;
  }
  const voice = mexicanVoice();
  const text = articleText(it);
  const r = readability(text);
  const popover = h('div', { class: 'word-pop', style: { display: 'none' } });
  const closePop = () => { popover.style.display = 'none'; };
  const paraEls = it.paragraphs.map((p, pi) => {
    const html = escapeHtml(p).replace(/[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]+/g, (w) => {
      const mx = mxLookup(w);
      return `<span class="w${mx && !NO_HIGHLIGHT.has(w.toLowerCase()) ? ' mx' : ''}">${w}</span>`;
    });
    return h('p', { 'data-i': pi }, h('span', { html }), ' ', h('button', { class: 'say', title: 'Listen to this paragraph', onclick: () => speak(p, { voice, rate: 0.95 }) }, icon('play', 13)));
  });
  const article = h('div', { class: 'transcript news-body' }, paraEls);
  article.addEventListener('click', (e) => {
    const w = e.target.closest('.w');
    if (!w) return;
    const word = w.textContent;
    const pText = it.paragraphs[+w.closest('p').dataset.i];
    const sentence = sentences(pText).find((s) => new RegExp(`(^|[^A-Za-zÁÉÍÓÚÜÑáéíóúüñ])${word}([^A-Za-zÁÉÍÓÚÜÑáéíóúüñ]|$)`).test(s)) || pText;
    const mx = mxLookup(word);
    const verb = wordInfo(word);
    const meaning = h('input', { type: 'text', placeholder: 'Meaning (your own words)…' });
    popover.replaceChildren(
      h('div', { class: 'row between' }, h('b', { class: 'es', style: { fontSize: '1.2rem' } }, word), h('button', { class: 'icon-btn', onclick: closePop, 'aria-label': 'Close' }, icon('x', 16))),
      mx ? h('div', { class: 'small', style: { margin: '4px 0' } }, h('span', { class: 'tag' }, '🇲🇽 Mexico'), ' ', mx[1], mx[3] ? h('div', { class: 'muted' }, mx[3]) : null) : null,
      verb.length ? h('div', { class: 'small muted', style: { margin: '4px 0' } }, verb.map((v) => h('div', null, v))) : null,
      h('div', { class: 'row', style: { margin: '8px 0' } }, sayBtn(word, { voice }),
        h('a', { class: 'btn small', href: `https://www.spanishdict.com/translate/${encodeURIComponent(word.toLowerCase())}`, target: '_blank', rel: 'noopener' }, 'SpanishDict'),
        h('a', { class: 'btn small', href: `https://www.wordreference.com/es/en/translation.asp?spen=${encodeURIComponent(word.toLowerCase())}`, target: '_blank', rel: 'noopener' }, 'WordReference')),
      meaning,
      h('div', { class: 'row', style: { marginTop: '8px' } },
        btn('Save word', () => {
          addCard(`n:${it.id}:${word.toLowerCase()}`, 'custom', { front: `¿Qué significa «${word}»?\n${sentence}`, back: meaning.value.trim() || (mx ? mx[1] : '(look it up and say it in Spanish)') }, { source: 'manual', priority: true });
          toast(`“${word}” added to review`, 'ok'); closePop();
        }, 'small primary'),
        btn('Save sentence', () => {
          addCard(`s:${sentence.slice(0, 50)}`, 'sentence', { text: sentence }, { source: 'dictation', priority: true });
          toast('Sentence added as a dictation card', 'ok'); closePop();
        }, 'small')));
    const rect = w.getBoundingClientRect();
    popover.style.display = 'block';
    popover.style.top = `${window.scrollY + rect.bottom + 6}px`;
    popover.style.left = `${Math.max(8, Math.min(window.innerWidth - 320, rect.left))}px`;
  });
  const onDocClick = (e) => { if (!popover.contains(e.target) && !e.target.closest?.('.w')) closePop(); };
  document.addEventListener('click', onDocClick);

  let readingAll = false;
  const listenAll = btn([icon('play', 15), ' Listen to the article'], async () => {
    if (readingAll) { stopSpeaking(); readingAll = false; listenAll.lastChild.textContent = ' Listen to the article'; return; }
    readingAll = true; listenAll.lastChild.textContent = ' Stop';
    for (const [i, p] of it.paragraphs.entries()) {
      if (!readingAll) break;
      paraEls.forEach((el, k) => el.classList.toggle('now', k === i));
      await speak(p, { voice, rate: 0.95 });
    }
    paraEls.forEach((el) => el.classList.remove('now'));
    readingAll = false; listenAll.lastChild.textContent = ' Listen to the article';
  }, 'small');

  const ai = h('div');
  const after = card(h('h3', 'After reading'),
    h('p', { class: 'small muted' }, 'Turning input into output is where the learning sticks: retell the story in your own words.'),
    h('div', { class: 'row' },
      h('a', { class: 'btn primary', href: `#/writing/news/${it.id}` }, '✍︎ Retell it in writing'),
      btn([icon('mic', 15), ' Say it out loud'], (e) => { e.currentTarget.replaceWith(sayIt(it)); }),
      aiAvailable() ? btn('✦ Easier version, key words & quiz', () => studyAI(it, ai)) : null,
      btn('✓ Mark as read', () => {
        N.read[it.id] = Date.now(); store.save(); logDone('news'); toast('Nice — marked as read', 'ok');
      }, 'ghost')),
    ai);
  if (N.ai[it.id]) renderStudy(N.ai[it.id], ai);

  mount(root,
    h('div', { class: 'crumbs' }, h('a', { href: '#/news' }, '← Noticias')),
    h('div', { class: 'row small muted' }, h('span', { class: 'tag' }, GROUPS[it.group] || it.section), `${it.outlet} · ${it.section}`, it.date ? ` · ${new Date(it.date).toLocaleString('es-MX', { dateStyle: 'medium', timeStyle: 'short' })}` : '',
      r ? h('span', { class: 'tag', title: `Szigriszt-Pazos readability ${r.score}` }, `lectura ${r.label} · ≈`, levelBadge(r.lvl)) : null),
    h('h1', { style: { marginTop: '8px' } }, it.title),
    it.image ? h('img', { src: it.image, alt: '', class: 'news-hero', loading: 'lazy', referrerpolicy: 'no-referrer', onerror: (e) => e.target.remove() }) : null,
    h('div', { class: 'note' }, h('b', 'How to read: '), 'skim the first paragraph for the gist · read on and guess from context · tap a word only when it blocks the meaning. Words underlined in green are Mexican Spanish.'),
    h('div', { class: 'row', style: { marginBottom: '10px' } }, listenAll, voice ? h('span', { class: 'small muted' }, `voice: ${voice.name}`) : null),
    article,
    h('p', { class: 'small' }, h('a', { href: it.link, target: '_blank', rel: 'noopener' }, `Read the full article on ${it.outlet} →`)),
    after, popover);
  return () => { document.removeEventListener('click', onDocClick); stopSpeaking(); };
}

function sayIt(it) {
  const out = h('div');
  const mic = micWidget({ continuous: true, label: 'Start retelling', stopLabel: 'Done', onDone: async ({ transcript, duration }) => {
    if (!transcript) { out.replaceChildren(h('p', { class: 'small muted' }, 'Listen to your recording and compare it with the article.')); return; }
    const wpm = duration ? Math.round(wordCount(transcript) / (duration / 60)) : null;
    out.replaceChildren(h('p', { class: 'es' }, transcript), h('p', { class: 'small muted' }, `${wordCount(transcript)} words${wpm ? ` · ${wpm} words/min` : ''}`));
    logDone('speak');
    if (aiAvailable()) out.append(btn('✦ Feedback on my retelling', async (e) => {
      e.currentTarget.disabled = true;
      try {
        const r = await speakingFeedback({ transcript, task: `Retell this news article: ${it.title}`, level: store.state.profile.level });
        out.append(h('p', null, r.summary), ...r.errors.map((er) => h('div', { class: 'issue' }, h('span', { class: 'orig' }, er.original), ' → ', h('span', { class: 'fixd' }, er.correction), h('div', { class: 'small muted' }, er.explanation))),
          h('p', { class: 'es' }, h('b', 'Better version: '), r.better_version));
      } catch (err) { out.append(h('p', { class: 'note warn' }, friendlyError(err))); }
    }, 'small'));
  } });
  return h('div', { class: 'stack', style: { width: '100%', marginTop: '10px' } }, h('p', { class: 'small muted' }, 'Tell the story in 1–2 minutes: what happened, where, who, and what you think.'), mic, out);
}

async function studyAI(it, box) {
  box.replaceChildren(h('p', { class: 'muted' }, 'Preparing an easier version, key words and questions…'));
  try {
    const r = await newsStudy({ title: it.title, text: articleText(it), level: store.state.profile.level });
    store.state.news.ai[it.id] = r; store.save();
    renderStudy(r, box);
  } catch (e) { box.replaceChildren(h('p', { class: 'note warn' }, friendlyError(e))); }
}

function renderStudy(r, box) {
  const answered = new Set();
  box.replaceChildren(
    h('h4', 'Easier version'), h('p', { class: 'es' }, r.easy_version, ' ', sayBtn(r.easy_version, { voice: mexicanVoice() })),
    h('h4', 'Key words'),
    h('div', null, r.glossary.map((g) => h('div', { class: 'err-row small' }, sayBtn(g.es), h('b', { class: 'es' }, g.es), h('span', { style: { flex: 1 } }, g.en, g.note ? h('span', { class: 'muted' }, ` — ${g.note}`) : null),
      btn('+', () => { addCard(`n:g:${g.es}`, 'custom', { front: g.es, back: `${g.en}${g.note ? ` (${g.note})` : ''}` }, { source: 'manual', priority: true }); toast('Added', 'ok'); }, 'small ghost', { title: 'Add to review' })))),
    h('h4', 'Comprehension'),
    r.questions.map((q, qi) => h('div', { style: { marginBottom: '12px' } }, h('p', { style: { fontWeight: 600, marginBottom: '6px' } }, q.q),
      h('div', { class: 'options' }, q.options.map((o, oi) => h('button', { class: 'opt', onclick: (e) => {
        if (answered.has(qi)) return; answered.add(qi);
        const btns = e.currentTarget.parentNode.querySelectorAll('.opt');
        btns.forEach((b, k) => { b.disabled = true; if (k === q.answer) b.classList.add('ok'); else if (k === oi) b.classList.add('bad'); });
        e.currentTarget.parentNode.after(h('div', { class: 'small muted', style: { marginTop: '6px' } }, q.explanation));
      } }, o))))),
    h('h4', 'Para comentar'), h('p', { class: 'es' }, r.discussion));
}

// ---- Español de México ----------------------------------------------------------------------
function glossary(root) {
  const q = h('input', { type: 'text', placeholder: 'Search…' });
  const list = h('div');
  const draw = () => {
    const term = q.value.trim().toLowerCase();
    list.replaceChildren(...MEXICANISMS.filter((m) => !term || m.join(' ').toLowerCase().includes(term)).map((m) => h('div', { class: 'err-row' },
      sayBtn(m[2], { voice: mexicanVoice() }),
      h('div', { style: { flex: 1 } }, h('b', { class: 'es' }, m[0]), h('span', { class: 'muted' }, ` — ${m[1]}`), h('div', { class: 'small es' }, m[2]), m[3] ? h('div', { class: 'small muted' }, m[3]) : null),
      btn('+', () => { addCard(`mx:${m[0]}`, 'custom', { front: `🇲🇽 ${m[0]}\n${m[2]}`, back: `${m[1]}${m[3] ? ` — ${m[3]}` : ''}` }, { source: 'manual', priority: true }); toast('Added', 'ok'); }, 'small ghost', { title: 'Add to review' }))));
  };
  q.addEventListener('input', draw);
  mount(root, h('div', { class: 'crumbs' }, h('a', { href: '#/news' }, '← Noticias')), h('h1', 'Español de México'),
    h('p', { class: 'lead' }, `${MEXICANISMS.length} everyday words and expressions you’ll hear in Mexico — many differ from Spain. Tap ▶ to hear the example with a Mexican voice.`),
    h('div', { class: 'row', style: { marginBottom: '12px' } }, h('div', { style: { flex: 1 } }, q),
      btn('Add all to review', () => {
        let n = 0;
        for (const m of MEXICANISMS) if (addCard(`mx:${m[0]}`, 'custom', { front: `🇲🇽 ${m[0]}\n${m[2]}`, back: `${m[1]}${m[3] ? ` — ${m[3]}` : ''}` }, { source: 'manual' })) n++;
        toast(`${n} cards added`, 'ok');
      })), card(list));
  draw();
}

// Short teaser for the Today page (only from the cached digest; never triggers a fetch).
export function newsTeaser() {
  const N = store.state.news;
  if (N.date !== today() || !N.digest.length) return null;
  return N.digest.slice(0, 3);
}
