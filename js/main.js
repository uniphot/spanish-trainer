// App shell: navigation, hash router, theme, and the activity timer that feeds the
// "four strands" balance (minutes of input / output / language study / fluency per day).
import { store, logMinutes } from './core/store.js';
import { h, mount, $ } from './core/ui.js';
import { stats } from './core/srs.js';
import { stopSpeaking } from './core/speech.js';

const NAV = [
  { sec: 'Practice' },
  { href: '#/', es: 'Hoy', en: 'Today', id: 'home' },
  { href: '#/review', es: 'Repaso', en: 'Review', id: 'review', badge: () => stats().due || null },
  { href: '#/placement', es: 'Nivel', en: 'Level test', id: 'placement' },
  { sec: 'Skills' },
  { href: '#/grammar', es: 'Gramática', en: 'Grammar', id: 'grammar' },
  { href: '#/listening', es: 'Escuchar', en: 'Listening', id: 'listening' },
  { href: '#/news', es: 'Noticias', en: 'Mexico news', id: 'news' },
  { href: '#/speaking', es: 'Hablar', en: 'Speaking', id: 'speaking' },
  { href: '#/writing', es: 'Escribir', en: 'Writing', id: 'writing' },
  { sec: 'You' },
  { href: '#/progress', es: 'Progreso', en: 'Progress', id: 'progress' },
  { href: '#/method', es: 'Método', en: 'Why it works', id: 'method' },
  { href: '#/settings', es: 'Ajustes', en: 'Settings', id: 'settings' },
];

const VIEWS = {
  home: () => import('./views/home.js'),
  review: () => import('./views/review.js'),
  placement: () => import('./views/placement.js'),
  grammar: () => import('./views/grammar.js'),
  listening: () => import('./views/listening.js'),
  news: () => import('./views/news.js'),
  speaking: () => import('./views/speaking.js'),
  writing: () => import('./views/writing.js'),
  progress: () => import('./views/progress.js'),
  method: () => import('./views/method.js'),
  settings: () => import('./views/settings.js'),
};

function renderNav(active) {
  const side = $('#sidebar');
  mount(side,
    h('a', { href: '#/', class: 'brand' },
      h('span', { class: 'brand-logo' }, 'ñ'),
      h('span', null, h('div', { class: 'brand-name' }, 'A fondo'), h('div', { class: 'brand-sub' }, 'Spanish in depth'))),
    NAV.map((n) => n.sec
      ? h('div', { class: 'nav-sec' }, n.sec)
      : h('a', { href: n.href, class: `nav-link ${active === n.id ? 'active' : ''}`, onclick: () => $('#app').classList.remove('nav-open') },
        h('span', null, n.es),
        n.badge && n.badge() ? h('span', { class: 'badge' }, n.badge()) : h('span', { class: 'nav-en' }, n.en))),
    h('div', { class: 'nav-foot' }, store.state.profile.level ? `Level ${store.state.profile.level} · ` : '', 'Data stays in this browser.'));
}

// ---- Activity timer -----------------------------------------------------------------
let strand = null;
let lastActivity = Date.now();
export function setStrand(s) { strand = s; }
for (const ev of ['pointerdown', 'keydown', 'input', 'wheel', 'touchstart']) {
  addEventListener(ev, () => { lastActivity = Date.now(); }, { passive: true, capture: true });
}
setInterval(() => {
  if (!strand || document.hidden) return;
  const audio = 'speechSynthesis' in window && speechSynthesis.speaking;
  if (Date.now() - lastActivity > 90000 && !audio && !window.__recording) return;
  logMinutes(strand, 0.25);
}, 15000);

// ---- Router -------------------------------------------------------------------------
let cleanup = null;
let renderToken = 0;
async function route() {
  const hash = location.hash.replace(/^#/, '') || '/';
  const [path, query] = hash.split('?');
  const parts = path.split('/').filter(Boolean);
  const id = parts[0] || 'home';
  const loader = VIEWS[id] || VIEWS.home;
  const token = ++renderToken;
  stopSpeaking();
  if (typeof cleanup === 'function') { try { cleanup(); } catch (e) { console.warn(e); } }
  cleanup = null;
  renderNav(id);
  const root = $('#view');
  let mod;
  try { mod = await loader(); } catch (e) {
    console.error(e);
    mount(root, h('div', { class: 'card' }, h('h2', 'Could not load this page'), h('pre', { class: 'small' }, String(e.stack || e))));
    return;
  }
  if (token !== renderToken) return;
  root.replaceChildren();
  strand = mod.strand ?? null;
  const params = new URLSearchParams(query || '');
  try {
    cleanup = await mod.render(root, parts.slice(1), { params, setStrand });
  } catch (e) {
    console.error(e);
    mount(root, h('div', { class: 'card' }, h('h2', 'Something went wrong'), h('pre', { class: 'small', style: { whiteSpace: 'pre-wrap' } }, String(e.stack || e))));
  }
  $('#main').scrollTo?.(0, 0);
  window.scrollTo(0, 0);
}

export function applyTheme() {
  const t = store.state.settings.theme;
  if (t === 'light' || t === 'dark') document.documentElement.dataset.theme = t;
  else delete document.documentElement.dataset.theme;
}

applyTheme();
$('#menu-btn').addEventListener('click', () => $('#app').classList.toggle('nav-open'));
$('#scrim').addEventListener('click', () => $('#app').classList.remove('nav-open'));
addEventListener('hashchange', route);
// Published site only (not the local dev server): offline copy, and ask the browser not to evict
// the learner's progress when the phone runs low on space.
if (location.protocol === 'https:' && 'serviceWorker' in navigator) navigator.serviceWorker.register('sw.js').catch(() => {});
navigator.storage?.persist?.().catch(() => {});
store.subscribe(() => {
  const id = (location.hash.replace(/^#\/?/, '').split(/[/?]/)[0]) || 'home';
  renderNav(id);
  const s = stats();
  const tb = $('#topbar-status');
  if (tb) tb.textContent = s.due ? `${s.due} to review` : '';
});
route();
