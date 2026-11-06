// Escucha real: real Mexican audio and video inside the app. A hub of fresh episodes pitched at
// the learner's level, and a player built for listening practice: slowing down, repeating the last
// few seconds, Spanish subtitles, line-by-line transcripts and dictation on real speech. Audio
// streams from each show's own host; video plays in YouTube's embedded player.
import { h, mount, btn, card, icon, toast, timeAgo, fmtClock, tabs, smartAccents, accentBar } from '../core/ui.js';
import { store, logDone, logMinutes, today } from '../core/store.js';
import { fetchFeed, HEAVY } from '../core/feed.js';
import { parseVTT, toSentences } from '../core/transcript.js';
import { alignWords } from '../core/text.js';
import { mexicanVoice } from '../core/speech.js';
import { addCard } from '../core/srs.js';
import { levelIndex } from '../core/learner.js';
import { SHOWS, TIERS, SCREEN, ELSEWHERE, showById } from '../data/shows.js';
import { attachWordPopup, wordSpans } from './wordpop.js';
import { accentNote, diffLine } from './exercise.js';
import { retellWidget } from './retell.js';

const TIER_ORDER = ['learner', 'bridge', 'native'];
const GRIM = /\bmuert[oae]s?\b|\bmuere\b|criminal|accidente|choque|explosi[oó]n|tragedia/i;
const RATINGS = [
  [40, 'Less than half', 'That’s a lot above your level today. Try an easier show, or this one at a slower speed with Spanish subtitles.'],
  [70, 'About 70 %', 'Good for studying a short bit, tiring for a whole episode. Replay the part you lost, then move on.'],
  [90, 'About 90 %', 'The sweet spot: enough to enjoy it, with something new to pick up. Stay here for most of your hours.'],
  [98, 'Nearly all', 'Great. Keep some of these for pleasure, and try something from the next level up.'],
];

let memory = null;
async function loadFeed(force = false) {
  if (memory && !force) return memory;
  memory = await fetchFeed('listen', force);
  return memory;
}

export async function renderReal(root, params, ctx) {
  ctx.setStrand(null); // the player logs the minutes actually played
  return params[1] ? player(root, params[1]) : hub(root, ctx);
}

const fmtTime = (min) => (min < 60 ? `${Math.round(min)} min` : `${Math.floor(min / 60)} h ${Math.round(min % 60)} min`);
function listenedMinutes(days) {
  const m = store.state.real.minutes;
  if (!days) return Object.values(m).reduce((a, b) => a + b, 0);
  const now = Date.now();
  let total = 0;
  for (let i = 0; i < days; i++) total += m[today(new Date(now - i * 86400000))] || 0;
  return total;
}

// Which tier suits the learner now: their level, nudged by how much they said they understood.
function currentTier() {
  const R = store.state.real;
  const li = levelIndex(store.state.profile.level || 'A2');
  let t = li <= 1 ? 0 : li === 2 ? 1 : 2;
  const recent = R.rated.slice(-3).map((r) => r.v);
  if (recent.length === 3) {
    const avg = recent.reduce((a, b) => a + b, 0) / 3;
    if (avg < 60) t -= 1; else if (avg >= 95) t += 1;
  }
  return Math.max(0, Math.min(2, t));
}

// Skip heavy stories if the learner asked for a lighter digest, and audio that's also a video here
// (the video has subtitles).
function visible(items) {
  const gentle = store.state.news.prefs.gentle;
  const videos = new Set(items.filter((it) => it.kind === 'video').map((it) => it.title));
  return items.filter((it) => showById(it.show) && !(gentle && (HEAVY.test(it.title) || GRIM.test(it.title))) && !(it.kind === 'audio' && videos.has(it.title)));
}

// Newest first, but taking turns between shows and starting near the learner's tier, so one busy
// news channel can't fill the page.
function freshOrder(items) {
  const R = store.state.real;
  const t = currentTier();
  const seen = {};
  const rank = new Map();
  for (const it of [...items].sort((a, b) => b.date - a.date)) {
    seen[it.show] = (seen[it.show] || 0) + 1;
    rank.set(it, seen[it.show] + Math.abs(TIER_ORDER.indexOf(showById(it.show).tier) - t) - (R.follow.includes(it.show) ? 2 : 0));
  }
  return [...items].sort((a, b) => rank.get(a) - rank.get(b) || b.date - a.date);
}

// The same picks all day: order by a hash of the date and the episode.
function dayHash(s) {
  let x = 2166136261;
  for (const c of `${today()}${s}`) x = Math.imul(x ^ c.charCodeAt(0), 16777619);
  return x >>> 0;
}
function todaysPicks(items) {
  const R = store.state.real;
  const t = currentTier();
  const used = new Set();
  const slots = [[Math.max(0, t - 1), 'To enjoy'], [t, 'At your level'], [Math.min(2, t + 1), 'A stretch']];
  return slots.map(([tier, label]) => {
    const pool = items.filter((it) => showById(it.show).tier === TIER_ORDER[tier] && !R.plays[it.id]?.done && !used.has(it.show));
    pool.sort((a, b) => (R.follow.includes(b.show) - R.follow.includes(a.show)) || dayHash(a.id) - dayHash(b.id));
    if (pool[0]) used.add(pool[0].show);
    return pool[0] ? { it: pool[0], label } : null;
  }).filter(Boolean);
}

function itemCard(it, label) {
  const s = showById(it.show);
  const p = store.state.real.plays[it.id];
  return h('a', { class: 'tile news-tile', href: `#/listening/real/${it.id}` },
    it.yt ? h('img', { class: 'news-img', src: `https://i.ytimg.com/vi/${it.yt}/mqdefault.jpg`, alt: '', loading: 'lazy', onerror: (e) => e.target.remove() }) : null,
    h('div', { class: 'tile-tag' }, label ? `${label} · ` : '', it.kind === 'video' ? 'Video' : 'Audio', ' · ', s.level),
    h('h3', null, it.title),
    h('p', null, s.name),
    h('div', { class: 'row small muted', style: { marginTop: '8px' } }, h('span', null, [it.dur ? `${Math.round(it.dur / 60)} min` : '', it.date ? timeAgo(it.date) : ''].filter(Boolean).join(' · ')),
      it.vtt ? h('span', { class: 'tag' }, 'transcript') : null,
      it.explicit ? h('span', { class: 'tag' }, 'strong language') : null,
      p?.done ? h('span', { class: 'tag', style: { color: 'var(--ok)' } }, '✓ done') : null));
}

async function hub(root, ctx) {
  const R = store.state.real;
  const filter = { kind: 'all', tier: 'all', transcript: false, show: ctx.params.get('show') };
  const body = h('div', null, h('p', { class: 'muted' }, 'Loading the newest episodes…'));
  const pane = h('div');
  let data = null;

  const toggleFollow = (id, redraw) => {
    R.follow = R.follow.includes(id) ? R.follow.filter((x) => x !== id) : [...R.follow, id];
    store.save(); redraw();
  };

  const browse = () => {
    const items = visible(data.items);
    const continuing = Object.entries(R.plays).filter(([, p]) => p.item && p.pos > 30 && !p.done).sort((a, b) => b[1].ts - a[1].ts).slice(0, 2);
    const chip = (on, label, fn) => h('button', { class: `chip ${on ? 'on' : ''}`, onclick: () => { fn(); browseDraw(); } }, label);
    const list = items.filter((it) => (filter.kind === 'all' || it.kind === filter.kind)
      && (filter.tier === 'all' || showById(it.show).tier === filter.tier)
      && (!filter.transcript || it.vtt) && (!filter.show || it.show === filter.show));
    const ordered = filter.show ? list.sort((a, b) => b.date - a.date) : freshOrder(list);
    return [
      continuing.length ? [h('h3', 'Sigue escuchando'), h('div', { class: 'grid grid-2' }, continuing.map(([, p]) => itemCard(p.item, 'Continue')))] : null,
      filter.show ? null : [h('h3', 'Para ti hoy'), h('div', { class: 'grid grid-2' }, todaysPicks(items).map(({ it, label }) => itemCard(it, label)))],
      h('h3', { style: { marginTop: '22px' } }, filter.show ? showById(filter.show)?.name : 'Lo más nuevo'),
      filter.show ? h('p', null, h('a', { href: '#/listening/real', onclick: () => { filter.show = null; browseDraw(); } }, '← All shows')) : null,
      h('div', { class: 'chips', style: { marginBottom: '12px' } },
        chip(filter.kind === 'video', 'Video', () => { filter.kind = filter.kind === 'video' ? 'all' : 'video'; }),
        chip(filter.kind === 'audio', 'Audio', () => { filter.kind = filter.kind === 'audio' ? 'all' : 'audio'; }),
        chip(filter.transcript, 'With transcript', () => { filter.transcript = !filter.transcript; }),
        TIER_ORDER.map((t) => chip(filter.tier === t, TIERS[t].en, () => { filter.tier = filter.tier === t ? 'all' : t; }))),
      ordered.length ? h('div', { class: 'grid grid-2' }, ordered.slice(0, 24).map((it) => itemCard(it))) : h('p', { class: 'muted' }, 'Nothing matches those filters.'),
      h('p', { class: 'small muted', style: { marginTop: '14px' } }, `Updated ${timeAgo(data.fetched)}. New episodes appear here by themselves.`),
    ];
  };
  const browseDraw = () => pane.replaceChildren(...[browse()].flat(Infinity).filter(Boolean));

  const showsPane = () => {
    const redraw = () => pane.replaceChildren(...[showsPane()].flat(Infinity).filter(Boolean));
    return [
      h('p', { class: 'small muted' }, 'Pick one or two shows and follow them. The same voices, topics and words keep coming back, which makes each new episode easier than a random video would be. Followed shows come first in your picks.'),
      TIER_ORDER.map((t) => [
        h('h3', { style: { marginTop: '18px' } }, `${TIERS[t].es} · ${TIERS[t].en}`), h('p', { class: 'small muted' }, TIERS[t].note),
        SHOWS.filter((s) => s.tier === t).map((s) => h('div', { class: 'err-row' },
          h('span', { class: 'tag' }, s.level),
          h('div', { style: { flex: 1 } },
            h('a', { href: `#/listening/real?show=${s.id}`, onclick: (e) => { e.preventDefault(); filter.show = s.id; active = 'browse'; drawTabs(); } }, s.name),
            h('span', { class: 'small muted' }, ` · ${s.kind === 'video' ? 'video' : 'podcast'} · ${s.accent}`),
            h('div', { class: 'small muted' }, s.why, ' ', h('i', null, s.help, '.'))),
          btn(R.follow.includes(s.id) ? '✓ Following' : 'Follow', () => toggleFollow(s.id, redraw), 'small ghost'))),
      ]),
    ];
  };

  const screenPane = () => [
    h('p', { class: 'small muted' }, 'A whole series is the best input there is: the same characters and vocabulary, hour after hour. Choose one and stay with it rather than sampling. Turn on Spanish subtitles, not English.'),
    SCREEN.map((s) => h('div', { class: 'err-row' }, h('span', { class: 'tag' }, s.level),
      h('div', { style: { flex: 1 } }, h('b', s.name), h('span', { class: 'small muted' }, ` · ${s.where}`), h('div', { class: 'small muted' }, s.note)))),
    h('h3', { style: { marginTop: '22px' } }, 'Elsewhere on the web'),
    ELSEWHERE.map((r) => h('div', { class: 'err-row' }, h('span', { class: 'tag' }, r.level),
      h('div', { style: { flex: 1 } }, h('a', { href: r.url, target: '_blank', rel: 'noopener' }, r.name), h('div', { class: 'small muted' }, r.note)))),
    h('p', { class: 'small muted', style: { marginTop: '14px' } }, 'What’s on each streaming service depends on your country.'),
  ];

  let active = 'browse';
  const drawTabs = () => {
    body.replaceChildren(tabs([['browse', 'Hoy'], ['shows', `Programas (${SHOWS.length})`], ['screen', 'Series y más']], active, (id) => { active = id; drawTabs(); }), pane);
    if (active === 'browse') {
      if (data) browseDraw(); else pane.replaceChildren(card(h('h3', 'New episodes couldn’t be loaded'), h('p', null, 'Check your internet connection and try again. Everything in the other tabs still works.'), btn('Try again', start, 'primary')));
    } else pane.replaceChildren(...[active === 'shows' ? showsPane() : screenPane()].flat(Infinity).filter(Boolean));
  };
  const start = async () => {
    try { data = await loadFeed(); } catch { data = null; }
    drawTabs();
  };

  const week = listenedMinutes(7);
  mount(root,
    h('div', { class: 'page-head' }, h('div', { class: 'crumbs' }, h('a', { href: '#/listening' }, '← Escuchar')), h('h1', 'Escucha real'),
      h('p', { class: 'lead' }, 'Real Mexicans on video and audio, inside the app. Aim for things where you follow about 90 %: enough to enjoy, with a little to stretch you. Understanding real speech comes from hours of it, so the hours are counted here.')),
    card(h('div', { class: 'row between' },
      h('div', null, h('div', { class: 'tile-tag' }, 'Your listening'), h('h3', { style: { margin: '4px 0' } }, fmtTime(listenedMinutes())), h('div', { class: 'small muted' }, `${fmtTime(week)} in the last 7 days`)),
      h('a', { class: 'btn', href: '#/listening/mexico' }, 'Así suena México'))),
    body);
  start();
}

// ---- Media --------------------------------------------------------------------------------
function audioMedia(src, startAt) {
  const a = new Audio();
  a.preload = 'metadata';
  a.src = src;
  if (startAt) a.addEventListener('loadedmetadata', () => { a.currentTime = startAt; }, { once: true });
  return {
    audio: a,
    play: () => a.play(),
    pause: () => a.pause(),
    seek: (t) => { a.currentTime = Math.max(0, t); },
    time: () => a.currentTime,
    duration: () => (Number.isFinite(a.duration) ? a.duration : 0),
    rate: (r) => { a.playbackRate = r; },
    playing: () => !a.paused && !a.ended,
    destroy: () => { a.pause(); a.removeAttribute('src'); a.load(); },
  };
}

let ytReady = null;
function loadYouTube() {
  ytReady ||= new Promise((resolve, reject) => {
    if (window.YT?.Player) return resolve();
    window.onYouTubeIframeAPIReady = resolve;
    document.head.append(h('script', { src: 'https://www.youtube.com/iframe_api', onerror: () => { ytReady = null; reject(new Error('YouTube could not be reached.')); } }));
  });
  return ytReady;
}

async function videoMedia(host, id, startAt, onError) {
  await loadYouTube();
  return new Promise((resolve) => {
    const p = new window.YT.Player(host, {
      host: 'https://www.youtube-nocookie.com', videoId: id, width: '100%', height: '100%',
      playerVars: { playsinline: 1, rel: 0, cc_load_policy: 1, cc_lang_pref: 'es', hl: 'es', start: Math.floor(startAt || 0), origin: location.origin },
      events: {
        onError: (e) => onError(e.data),
        onReady: () => resolve({
          play: () => p.playVideo(),
          pause: () => p.pauseVideo(),
          seek: (t) => p.seekTo(Math.max(0, t), true),
          time: () => p.getCurrentTime() || 0,
          duration: () => p.getDuration() || 0,
          rate: (r) => p.setPlaybackRate(r),
          playing: () => p.getPlayerState() === 1,
          captions: (on) => { p.loadModule('captions'); p.setOption('captions', 'track', on ? { languageCode: 'es' } : {}); },
          destroy: () => p.destroy(),
        }),
      },
    });
  });
}

// ---- Player -------------------------------------------------------------------------------
const GUIDE = {
  video: ['Watch once with Spanish subtitles on, for the story. Avoid English ones: they let you stop listening.', 'Pick a bit you half-followed. Turn subtitles off and watch it again.', 'When you lose a phrase, press “Last 6 s”, at 0.75× if you need to, then again at normal speed.', 'Say in a sentence or two what happened. Then move on: quantity counts more than perfection.'],
  audio: ['First listen for the gist. Don’t stop for single words.', 'When you lose a phrase, press “Last 6 s”, at 0.75× if you need to, then again at normal speed.', 'Write down one or two phrases you caught and want to keep.', 'Say in a sentence or two what it was about. Then move on: quantity counts more than perfection.'],
  transcript: ['Listen first with the text hidden. Tap a line only when you’re lost.', 'Then listen with the text showing: you’ll hear words that were a blur before.', 'Try dictation on a few lines. This is the part that trains your ear to find word boundaries.', 'The transcript is made by a machine, so expect the odd mistake.'],
};

async function player(root, id) {
  const R = store.state.real;
  mount(root, h('p', { class: 'muted' }, 'Loading…'));
  let it = R.plays[id]?.item;
  const here = location.hash;
  try { it = (await loadFeed()).items.find((x) => x.id === id) || it; } catch { /* a saved episode can still play */ }
  if (location.hash !== here) return undefined;
  if (!it) {
    mount(root, card(h('p', null, 'This episode is no longer in the feed.'), h('a', { class: 'btn', href: '#/listening/real' }, '← Escucha real')));
    return;
  }
  const show = showById(it.show) || { name: it.show, level: '', tier: 'bridge' };
  const rec = (R.plays[id] ||= { pos: 0, min: 0 });
  rec.item = it; rec.ts = Date.now();
  const nearEnd = it.dur && rec.pos > it.dur - 30;
  const startAt = nearEnd ? 0 : rec.pos;

  let media = null, rate = 1, loop = null, stopAt = null, resumeRate = null, captions = true;
  let acc = 0, last = Date.now(), lines = [], rows = [], current = -1, openIdx = -1, lastScroll = 0, mode = 'follow';

  const stage = h('div');
  const timeEl = h('span', { class: 'small muted' }, '0:00');
  const scrub = h('input', { type: 'range', min: 0, max: 100, value: 0, step: 1, 'aria-label': 'Position', oninput: (e) => media?.seek(+e.target.value) });
  const playBtn = btn([icon('play', 16), ' Play'], () => {
    if (media?.playing()) return media.pause();
    stopAt = null;
    if (resumeRate) { media?.rate(resumeRate); resumeRate = null; }
    return media?.play();
  }, 'primary');
  let shownPlaying = false;
  const loopBtn = btn('Last 6 s', () => toggleLoop(), 'small');
  const ccBtn = btn('Subtitles: on', () => {
    captions = !captions; media?.captions?.(captions);
    ccBtn.textContent = `Subtitles: ${captions ? 'on' : 'off'}`;
  }, 'small');
  const rates = it.kind === 'video' ? [0.75, 1, 1.25] : [0.75, 0.9, 1, 1.25];
  const rateChips = h('div', { class: 'chips' }, rates.map((r) => h('button', { class: `chip ${r === 1 ? 'on' : ''}`, onclick: (e) => {
    rate = r; media?.rate(r);
    rateChips.querySelectorAll('.chip').forEach((c) => c.classList.toggle('on', c === e.currentTarget));
  } }, `${r}×`)));
  const bar = h('div', { class: 'player-bar' },
    it.kind === 'audio' ? scrub : null,
    btn('−5 s', () => media?.seek(media.time() - 5), 'small'), playBtn, loopBtn,
    it.kind === 'video' ? ccBtn : null, rateChips, timeEl);

  const toggleLoop = () => {
    if (loop) { loop = null; loopBtn.classList.remove('primary'); loopBtn.textContent = 'Last 6 s'; return; }
    const t = media?.time() || 0;
    loop = { start: Math.max(0, t - 6), end: t };
    loopBtn.classList.add('primary'); loopBtn.textContent = 'Stop repeating';
    media?.seek(loop.start); media?.play();
  };

  // A stretch of audio once, optionally slower: one line of the transcript.
  const playLine = (i, r = rate) => {
    if (!media || !lines[i]) return;
    loop = null; loopBtn.classList.remove('primary'); loopBtn.textContent = 'Last 6 s';
    resumeRate = rate; media.rate(r);
    media.seek(lines[i].start); stopAt = lines[i].end + 0.15; media.play();
  };

  const flush = () => {
    if (acc < 1) return;
    const min = acc / 60;
    acc = 0;
    const d = today();
    R.minutes[d] = (R.minutes[d] || 0) + min;
    rec.min += min;
    if (media) rec.pos = media.time();
    logMinutes('input', min);
    store.save();
  };

  const tick = () => {
    if (!media) return;
    const now = Date.now();
    const dt = Math.min(70, (now - last) / 1000); // a locked phone throttles timers to about one a minute
    last = now;
    const on = media.playing();
    if (on !== shownPlaying) { shownPlaying = on; playBtn.replaceChildren(icon(on ? 'stop' : 'play', 16), on ? ' Pause' : ' Play'); }
    const t = media.time();
    const d = media.duration();
    timeEl.textContent = `${fmtClock(t)}${d ? ` / ${fmtClock(d)}` : ''}`;
    if (it.kind === 'audio' && d) { scrub.max = Math.floor(d); if (document.activeElement !== scrub) scrub.value = Math.floor(t); }
    if (on) { acc += dt; if (acc >= 15) flush(); }
    if (loop && t >= loop.end) media.seek(loop.start);
    if (stopAt && t >= stopAt) { stopAt = null; media.pause(); if (resumeRate) { media.rate(resumeRate); resumeRate = null; } }
    if (lines.length) follow(t);
  };

  // ---- Transcript
  const box = h('div', { class: 'tr-box transcript' });
  const trPanel = h('div');
  const popup = attachWordPopup(box, {
    voice: mexicanVoice(), idPrefix: `r:${id}`,
    sentenceOf: (w) => lines[+w.closest('.line').dataset.i].text,
    sentenceCard: (_, w) => { const l = lines[+w.closest('.line').dataset.i]; return { clip: { src: it.audio, start: l.start, end: l.end + 0.15 }, en: show.name }; },
  });
  box.addEventListener('scroll', () => { lastScroll = Date.now(); }, { passive: true });

  const follow = (t) => {
    let i = current >= 0 && lines[current]?.start <= t ? current : 0;
    while (i < lines.length - 1 && lines[i + 1].start <= t) i++;
    if (i === current) return;
    rows[current]?.classList.remove('now');
    current = i;
    const row = rows[i];
    if (!row) return;
    row.classList.add('now');
    if (mode !== 'dictation' && Date.now() - lastScroll > 4000) { box.scrollTo({ top: row.offsetTop - box.clientHeight / 3, behavior: 'smooth' }); lastScroll = Date.now() - 3900; }
  };

  const closeRow = () => {
    const r = rows[openIdx];
    if (r) { r.querySelector('.t').textContent = lines[openIdx].text; r.querySelector('.line-tools')?.remove(); }
    openIdx = -1;
  };
  const openRow = (i) => {
    if (i === openIdx) return;
    closeRow();
    openIdx = i;
    const r = rows[i];
    r.classList.add('shown');
    r.querySelector('.t').innerHTML = wordSpans(lines[i].text);
    r.append(h('div', { class: 'row line-tools' },
      btn([icon('play', 13), ' Again'], () => playLine(i), 'small'),
      btn('Slower', () => playLine(i, 0.75), 'small'),
      btn('+ Review', () => {
        const l = lines[i];
        addCard(`clip:${id}:${i}`, 'sentence', { text: l.text, clip: { src: it.audio, start: l.start, end: l.end + 0.15 }, en: show.name }, { source: 'dictation', priority: true });
        toast('Line added: you’ll hear the real speaker in review', 'ok');
      }, 'small')));
  };
  box.addEventListener('click', (e) => {
    if (e.target.closest('.w, .line-tools')) return;
    const row = e.target.closest('.line');
    if (!row) return;
    const i = +row.dataset.i;
    openRow(i);
    playLine(i);
  });

  const dictationPanel = () => {
    const wc = (l) => l.text.split(' ').length;
    const usable = (from) => { for (let k = Math.max(0, from); k < lines.length; k++) if (wc(lines[k]) >= 4 && wc(lines[k]) <= 18) return k; return -1; };
    let i = usable(current);
    const panel = h('div');
    const draw = () => {
      if (i < 0) { panel.replaceChildren(h('p', { class: 'muted' }, 'No more short lines in this episode.')); return; }
      const inp = h('textarea', { rows: 2, class: 'fix-area', placeholder: 'Type what you hear…', spellcheck: false, autocapitalize: 'off' });
      smartAccents(inp);
      const fb = h('div');
      let answered = false;
      const check = () => {
        if (answered || !inp.value.trim()) return;
        answered = true; inp.disabled = true;
        const { ops, score } = alignWords(lines[i].text, inp.value, { strict: store.state.settings.strictAccents });
        if (score < 0.999) addCard(`clip:${id}:${i}`, 'sentence', { text: lines[i].text, clip: { src: it.audio, start: lines[i].start, end: lines[i].end + 0.15 }, en: show.name }, { source: 'dictation', priority: true });
        fb.replaceChildren(h('div', { class: `feedback ${score > 0.98 ? 'ok' : score > 0.75 ? 'almost' : 'bad'}` }, h('div', { class: 'fb-body' },
          h('div', { class: 'fb-title' }, `${Math.round(score * 100)}%`), diffLine(ops),
          ops.some((o) => o.type === 'accent') ? accentNote(ops.filter((o) => o.type === 'accent').map((o) => o.ref)) : null,
          score < 0.999 ? h('div', { class: 'small muted' }, 'Added to review with the real speaker’s voice.') : null)),
        h('div', { class: 'ex-actions' }, btn(['Next line ', icon('arrow', 16)], () => { i = usable(i + 1); draw(); }, 'primary')));
      };
      inp.addEventListener('keydown', (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); check(); } });
      panel.replaceChildren(
        h('div', { class: 'row', style: { marginBottom: '10px' } },
          h('button', { class: 'say big', onclick: () => playLine(i), 'aria-label': 'Play the line' }, icon('play', 22)),
          btn('Slower', () => playLine(i, 0.75), 'small'),
          h('span', { class: 'small muted' }, `Line ${i + 1} of ${lines.length}`)),
        inp, accentBar(inp),
        h('div', { class: 'ex-actions' }, btn('Check', check, 'primary'), btn('Skip', () => { i = usable(i + 1); draw(); }, 'ghost')), fb);
    };
    draw();
    return panel;
  };

  const drawTranscript = () => {
    box.classList.toggle('blind', mode === 'hidden');
    trPanel.replaceChildren(
      h('h3', 'Line by line'),
      tabs([['follow', 'Read along'], ['hidden', 'Hidden'], ['dictation', 'Dictation']], mode, (m) => { mode = m; drawTranscript(); }),
      h('p', { class: 'small muted' }, mode === 'dictation' ? 'Real speech, one line at a time. Punctuation doesn’t matter. Lines you miss come back in review with the real speaker’s voice.'
        : mode === 'hidden' ? 'Listen first. Tap a line to reveal it and hear it again.' : 'Tap a line to hear it again and to look up its words.'),
      mode === 'dictation' ? dictationPanel() : box);
  };

  const loadTranscript = async () => {
    try {
      const res = await fetch(it.vtt);
      if (!res.ok) throw new Error(String(res.status));
      lines = toSentences(parseVTT(await res.text()));
    } catch { lines = []; }
    if (!lines.length) { trPanel.replaceChildren(h('p', { class: 'small muted' }, 'The transcript couldn’t be loaded this time.')); return; }
    let prev = '';
    rows = lines.map((l, i) => {
      const spk = l.speaker && l.speaker !== prev ? l.speaker : '';
      prev = l.speaker || prev;
      return h('p', { class: 'line', 'data-i': i }, spk ? h('span', { class: 'spk' }, spk) : null, h('span', { class: 't' }, l.text));
    });
    box.replaceChildren(...rows);
    drawTranscript();
  };

  // ---- After listening
  const phrase = h('input', { type: 'text', placeholder: 'A phrase you caught, in Spanish' });
  const meaning = h('input', { type: 'text', placeholder: 'What it means (optional)', style: { marginTop: '8px' } });
  smartAccents(phrase);
  const verdict = h('div');
  const after = card(h('h3', 'After listening'),
    h('p', { class: 'small muted' }, 'How much did you understand?'),
    h('div', { class: 'chips' }, RATINGS.map(([v, label, advice]) => h('button', { class: `chip ${rec.rating === v ? 'on' : ''}`, onclick: (e) => {
      rec.rating = v; rec.done = true; flush();
      R.rated = [...R.rated, { v, ts: Date.now() }].slice(-12);
      store.save(); logDone('real-listen');
      e.currentTarget.parentElement.querySelectorAll('.chip').forEach((c) => c.classList.toggle('on', c === e.currentTarget));
      verdict.replaceChildren(h('p', { class: 'note', style: { marginTop: '10px' } }, advice));
    } }, label))),
    verdict,
    h('h4', { style: { marginTop: '18px' } }, 'Keep a phrase'),
    phrase, meaning,
    h('div', { class: 'ex-actions' },
      btn('Add to review', () => {
        const text = phrase.value.trim();
        if (!text) return;
        addCard(`s:${text.slice(0, 50)}`, 'sentence', { text, en: meaning.value.trim() || show.name }, { source: 'dictation', priority: true });
        phrase.value = ''; meaning.value = ''; toast('Added to review', 'ok');
      }),
      btn([icon('mic', 15), ' Retell it'], (e) => {
        e.currentTarget.replaceWith(retellWidget({ task: `Retell what you heard in “${it.title}” from ${show.name}`, hint: 'Say in a minute or so what it was about and what you thought.' }));
      })),
    it.link ? h('p', { class: 'small', style: { marginTop: '12px' } }, h('a', { href: it.link, target: '_blank', rel: 'noopener' }, it.kind === 'video' ? 'Open on YouTube →' : 'Show’s page →')) : null);

  const guide = GUIDE[it.vtt ? 'transcript' : it.kind];
  mount(root,
    h('div', { class: 'crumbs' }, h('a', { href: '#/listening/real' }, '← Escucha real')),
    h('div', { class: 'row small muted' }, h('span', { class: 'tag' }, show.level), show.name, it.date ? ` · ${timeAgo(it.date)}` : '', it.dur ? ` · ${Math.round(it.dur / 60)} min` : '', it.explicit ? h('span', { class: 'tag' }, 'strong language') : null),
    h('h1', { style: { marginTop: '8px' } }, it.title),
    stage, bar,
    h('details', { class: 'guide', open: !R.seenGuide }, h('summary', 'How to get the most from this'), h('ol', { class: 'small' }, guide.map((g) => h('li', null, g)))),
    it.vtt ? card(trPanel) : it.desc ? h('p', { class: 'small muted' }, it.desc) : null,
    after, popup.el);
  R.seenGuide = true;

  let left = false;
  const unavailable = (why) => {
    media = null;
    stage.replaceChildren(card(h('p', null, why), h('a', { class: 'btn primary', href: it.link, target: '_blank', rel: 'noopener' }, 'Watch on YouTube')));
  };
  if (it.kind === 'video') {
    const host = h('div');
    stage.append(h('div', { class: 'video-frame' }, host));
    videoMedia(host, it.yt, startAt, () => unavailable('This video can’t be played inside the app.'))
      .then((m) => { if (left) m.destroy(); else media = m; })
      .catch(() => unavailable('YouTube couldn’t be reached from here.'));
  } else {
    media = audioMedia(it.audio, startAt);
    media.audio.addEventListener('error', () => stage.replaceChildren(h('p', { class: 'note warn' }, 'This episode couldn’t be played. It may have been moved by the show.')));
    if ('mediaSession' in navigator) {
      navigator.mediaSession.metadata = new window.MediaMetadata({ title: it.title, artist: show.name });
      navigator.mediaSession.setActionHandler('seekbackward', () => media?.seek(media.time() - 5));
    }
    if (it.vtt) { trPanel.append(h('p', { class: 'muted' }, 'Loading the transcript…')); loadTranscript(); }
  }
  const timer = setInterval(tick, 250);
  return () => {
    left = true;
    clearInterval(timer);
    flush();
    media?.destroy();
    popup.destroy();
    if ('mediaSession' in navigator) navigator.mediaSession.metadata = null;
  };
}
