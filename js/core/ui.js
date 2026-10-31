// Tiny DOM toolkit: h() element builder plus shared components.
import { speak } from './speech.js';

export function h(tag, props, ...children) {
  const el = tag === 'frag' ? document.createDocumentFragment() : document.createElement(tag);
  if (props && (typeof props !== 'object' || props instanceof Node || Array.isArray(props))) {
    children.unshift(props); props = null;
  }
  if (props) {
    for (const [k, v] of Object.entries(props)) {
      if (v == null || v === false) continue;
      if (k === 'class') el.className = v;
      else if (k === 'style' && typeof v === 'object') Object.assign(el.style, v);
      else if (k.startsWith('on') && typeof v === 'function') el.addEventListener(k.slice(2).toLowerCase(), v);
      else if (k === 'html') el.innerHTML = v;
      else if (k === 'ref') v(el);
      else if (k in el && typeof v !== 'string') el[k] = v;
      else el.setAttribute(k, v === true ? '' : v);
    }
  }
  append(el, children);
  return el;
}
function append(el, children) {
  for (const c of children.flat(Infinity)) {
    if (c == null || c === false || c === true) continue;
    el.appendChild(c instanceof Node ? c : document.createTextNode(String(c)));
  }
}
export function mount(root, ...nodes) { root.replaceChildren(); append(root, nodes); return root; }
// Element.replaceChildren() turns null into the text "null"; skip empty values like h() does.
const nativeReplace = Element.prototype.replaceChildren;
Element.prototype.replaceChildren = function (...nodes) {
  return nativeReplace.apply(this, nodes.flat(Infinity).filter((n) => n != null && n !== false && n !== true));
};
export const $ = (sel, root = document) => root.querySelector(sel);

export function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}
export const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
export const sample = (arr, n) => shuffle(arr).slice(0, n);
export const pct = (x) => `${Math.round(x * 100)}%`;
export function fmtClock(sec) {
  sec = Math.max(0, Math.round(sec));
  return `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, '0')}`;
}
export function timeAgo(ts) {
  const d = (Date.now() - ts) / 1000;
  if (d < 60) return 'just now';
  if (d < 3600) return `${Math.round(d / 60)} min ago`;
  if (d < 86400) return `${Math.round(d / 3600)} h ago`;
  return `${Math.round(d / 86400)} d ago`;
}

// ---- Components ------------------------------------------------------------------
export function icon(name, size = 18) {
  const P = {
    play: '<path d="M8 5v14l11-7z"/>',
    slow: '<path d="M13 5v14l8-7zM3 5v14l8-7z" opacity=".55"/>',
    mic: '<path d="M12 14a3 3 0 0 0 3-3V5a3 3 0 0 0-6 0v6a3 3 0 0 0 3 3zm5-3a5 5 0 0 1-10 0H5a7 7 0 0 0 6 6.9V21h2v-3.1A7 7 0 0 0 19 11z"/>',
    stop: '<path d="M7 7h10v10H7z"/>',
    check: '<path d="M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4z"/>',
    x: '<path d="M19 6.4 17.6 5 12 10.6 6.4 5 5 6.4 10.6 12 5 17.6 6.4 19 12 13.4 17.6 19 19 17.6 13.4 12z"/>',
    arrow: '<path d="M12 4l-1.4 1.4 5.6 5.6H4v2h12.2l-5.6 5.6L12 20l8-8z"/>',
    back: '<path d="M20 11H7.8l5.6-5.6L12 4l-8 8 8 8 1.4-1.4L7.8 13H20z"/>',
    replay: '<path d="M12 5V1L7 6l5 5V7a6 6 0 1 1-6 6H4a8 8 0 1 0 8-8z"/>',
    eye: '<path d="M12 5C7 5 2.7 8.1 1 12.5 2.7 16.9 7 20 12 20s9.3-3.1 11-7.5C21.3 8.1 17 5 12 5zm0 12.5a5 5 0 1 1 0-10 5 5 0 0 1 0 10zm0-8a3 3 0 1 0 0 6 3 3 0 0 0 0-6z"/>',
    spark: '<path d="M12 2l2.4 6.6L21 11l-6.6 2.4L12 20l-2.4-6.6L3 11l6.6-2.4z"/>',
    rec: '<circle cx="12" cy="12" r="7"/>',
  };
  return h('span', { class: 'ico', 'aria-hidden': 'true', html: `<svg viewBox="0 0 24 24" width="${size}" height="${size}" fill="currentColor">${P[name] || ''}</svg>` });
}

export function btn(label, onclick, cls = '', attrs = {}) {
  return h('button', { class: `btn ${cls}`, type: 'button', onclick, ...attrs }, label);
}

// Speaker button: plays text with TTS. Shift-click or the slow button plays at 70 %.
export function sayBtn(text, opts = {}) {
  const b = h('button', {
    class: `say ${opts.cls || ''}`, type: 'button', title: 'Listen', 'aria-label': `Listen: ${text}`,
    onclick: async (e) => {
      e.stopPropagation();
      b.classList.add('playing');
      await speak(typeof text === 'function' ? text() : text, { rate: e.shiftKey ? 0.7 : opts.rate ?? 1, voice: opts.voice });
      b.classList.remove('playing');
    },
  }, icon('play', opts.size || 16), opts.label || null);
  return b;
}

export function toast(msg, type = 'info', ms = 2600) {
  let wrap = $('#toasts');
  if (!wrap) { wrap = h('div', { id: 'toasts', 'aria-live': 'polite' }); document.body.append(wrap); }
  const t = h('div', { class: `toast ${type}` }, msg);
  wrap.append(t);
  setTimeout(() => { t.classList.add('out'); setTimeout(() => t.remove(), 300); }, ms);
}

export function modal(title, body, { actions = [], wide = false } = {}) {
  const close = () => { overlay.remove(); document.removeEventListener('keydown', onKey); };
  const onKey = (e) => e.key === 'Escape' && close();
  const overlay = h('div', { class: 'modal-overlay', onclick: (e) => e.target === overlay && close() },
    h('div', { class: `modal ${wide ? 'wide' : ''}`, role: 'dialog', 'aria-modal': 'true' },
      h('div', { class: 'modal-head' }, h('h3', title), h('button', { class: 'icon-btn', onclick: close, 'aria-label': 'Close' }, icon('x'))),
      h('div', { class: 'modal-body' }, body),
      actions.length ? h('div', { class: 'modal-actions' }, actions.map((a) => btn(a.label, () => { if (a.onClick?.() !== false) close(); }, a.cls || ''))) : null));
  document.addEventListener('keydown', onKey);
  document.body.append(overlay);
  return close;
}

export function ring(value, { size = 44, stroke = 5, label } = {}) {
  const r = (size - stroke) / 2, c = 2 * Math.PI * r;
  const v = Math.max(0, Math.min(1, value || 0));
  return h('span', {
    class: 'ring', style: { width: size + 'px', height: size + 'px' },
    html: `<svg viewBox="0 0 ${size} ${size}" width="${size}" height="${size}"><circle cx="${size / 2}" cy="${size / 2}" r="${r}" fill="none" stroke="var(--line)" stroke-width="${stroke}"/><circle cx="${size / 2}" cy="${size / 2}" r="${r}" fill="none" stroke="var(--accent)" stroke-width="${stroke}" stroke-linecap="round" stroke-dasharray="${c}" stroke-dashoffset="${c * (1 - v)}" transform="rotate(-90 ${size / 2} ${size / 2})"/></svg><span class="ring-label">${label ?? Math.round(v * 100)}</span>`,
  });
}

export function bar(value, cls = '') {
  return h('div', { class: `bar ${cls}` }, h('div', { class: 'bar-fill', style: { width: `${Math.round(Math.max(0, Math.min(1, value)) * 100)}%` } }));
}

// On-screen Spanish characters for any text input/textarea.
const CHARS = ['á', 'é', 'í', 'ó', 'ú', 'ñ', 'ü', '¿', '¡'];
export function accentBar(getInput) {
  return h('div', { class: 'accent-bar', role: 'toolbar', 'aria-label': 'Spanish characters' },
    CHARS.map((ch) => h('button', {
      type: 'button', tabindex: -1,
      onmousedown: (e) => e.preventDefault(),
      onclick: () => {
        const el = typeof getInput === 'function' ? getInput() : getInput;
        if (!el) return;
        const s = el.selectionStart ?? el.value.length, e = el.selectionEnd ?? el.value.length;
        el.value = el.value.slice(0, s) + ch + el.value.slice(e);
        el.selectionStart = el.selectionEnd = s + 1;
        el.dispatchEvent(new Event('input', { bubbles: true }));
        el.focus();
      },
    }, ch)));
}

// Keyboard helper: typing a vowel followed by an apostrophe/backtick gives the accented vowel
// (a' → á, n~ → ñ, u: → ü) for people without a Spanish keyboard.
export function smartAccents(el) {
  const map = { "a'": 'á', "e'": 'é', "i'": 'í', "o'": 'ó', "u'": 'ú', 'n~': 'ñ', 'u:': 'ü', "A'": 'Á', "E'": 'É', "I'": 'Í', "O'": 'Ó', "U'": 'Ú', 'N~': 'Ñ', '?¿': '¿', '!¡': '¡' };
  el.addEventListener('input', () => {
    const pos = el.selectionStart;
    const two = el.value.slice(pos - 2, pos);
    if (map[two]) {
      el.value = el.value.slice(0, pos - 2) + map[two] + el.value.slice(pos);
      el.selectionStart = el.selectionEnd = pos - 1;
    }
  });
  return el;
}

export function tabs(items, active, onChange) {
  return h('div', { class: 'tabs', role: 'tablist' }, items.map(([id, label]) =>
    h('button', { class: `tab ${id === active ? 'active' : ''}`, role: 'tab', 'aria-selected': id === active ? 'true' : 'false', onclick: () => onChange(id) }, label)));
}

export function levelBadge(level) { return h('span', { class: `lvl lvl-${(level || '').toLowerCase()}` }, level || '—'); }

export function card(...children) { return h('section', { class: 'card' }, ...children); }

export function emptyState(title, text, action) {
  return h('div', { class: 'empty' }, h('h3', title), h('p', text), action || null);
}

export function sparkline(values, { w = 160, hgt = 40 } = {}) {
  if (!values.length) return h('span');
  const max = Math.max(...values, 1), min = Math.min(...values, 0);
  const step = values.length > 1 ? w / (values.length - 1) : w;
  const pts = values.map((v, i) => `${(i * step).toFixed(1)},${(hgt - 4 - ((v - min) / (max - min || 1)) * (hgt - 8)).toFixed(1)}`).join(' ');
  return h('span', { class: 'spark', html: `<svg viewBox="0 0 ${w} ${hgt}" width="${w}" height="${hgt}"><polyline points="${pts}" fill="none" stroke="var(--accent)" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/></svg>` });
}
