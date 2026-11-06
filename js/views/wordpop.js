// Tap-a-word help, shared by the news reader and the transcript player: verb analysis, Mexican
// usage, dictionary links, real people saying the word, and saving it for review.
import { h, btn, icon, toast, sayBtn } from '../core/ui.js';
import { escapeHtml } from '../core/text.js';
import { reverseIndex, verbInfo, TENSES, PERSONS } from '../core/conjugator.js';
import { addCard } from '../core/srs.js';
import { mxLookup } from '../data/mexico.js';

const NO_HIGHLIGHT = new Set(['padre', 'lana', 'joven', 'sale', 'fresa', 'foco', 'agarrar', 'pluma', 'picar', 'pesos', 'colonia', 'cuadra', 'boleto', 'carro', 'propina', 'credencial']);

// Text as HTML with each word in a tappable span; Mexicanisms get the green underline.
export const wordSpans = (text) => text.split(/([A-Za-zÁÉÍÓÚÜÑáéíóúüñ]+)/).map((part, i) => {
  if (i % 2 === 0) return escapeHtml(part);
  return `<span class="w${mxLookup(part) && !NO_HIGHLIGHT.has(part.toLowerCase()) ? ' mx' : ''}">${part}</span>`;
}).join('');

function wordInfo(word) {
  const lw = word.toLowerCase();
  const rs = (reverseIndex().get(lw) || []).slice(0, 3);
  return rs.map((r) => {
    const info = verbInfo(r.inf) || verbInfo(r.inf + 'se') || {};
    const tense = r.tense === 'pp' ? 'participio' : r.tense === 'ger' ? 'gerundio' : TENSES[r.tense]?.es || r.tense;
    return `${r.inf}${info.en ? ` (${info.en})` : ''} · ${tense}${r.person >= 0 ? ` · ${PERSONS[r.person]}` : ''}`;
  });
}

// Listens for taps on .w spans inside container. sentenceOf(span) gives the word's sentence;
// sentenceCard(sentence, span) can add to the card that "Save sentence" creates.
export function attachWordPopup(container, { voice, idPrefix, sentenceOf, sentenceCard = () => ({}) }) {
  const el = h('div', { class: 'word-pop', style: { display: 'none' } });
  const close = () => { el.style.display = 'none'; };
  container.addEventListener('click', (e) => {
    const w = e.target.closest('.w');
    if (!w) return;
    const word = w.textContent;
    const sentence = sentenceOf(w, word);
    const mx = mxLookup(word);
    const verb = wordInfo(word);
    const meaning = h('input', { type: 'text', placeholder: 'Meaning (your own words)…' });
    const q = encodeURIComponent(word.toLowerCase());
    el.replaceChildren(
      h('div', { class: 'row between' }, h('b', { class: 'es', style: { fontSize: '1.2rem' } }, word), h('button', { class: 'icon-btn', onclick: close, 'aria-label': 'Close' }, icon('x', 16))),
      mx ? h('div', { class: 'small', style: { margin: '4px 0' } }, h('span', { class: 'tag' }, '🇲🇽 Mexico'), ' ', mx[1], mx[3] ? h('div', { class: 'muted' }, mx[3]) : null) : null,
      verb.length ? h('div', { class: 'small muted', style: { margin: '4px 0' } }, verb.map((v) => h('div', null, v))) : null,
      h('div', { class: 'row', style: { margin: '8px 0' } }, sayBtn(word, { voice }),
        h('a', { class: 'btn small', href: `https://www.spanishdict.com/translate/${q}`, target: '_blank', rel: 'noopener' }, 'SpanishDict'),
        h('a', { class: 'btn small', href: `https://www.wordreference.com/es/en/translation.asp?spen=${q}`, target: '_blank', rel: 'noopener' }, 'WordReference'),
        h('a', { class: 'btn small', href: `https://youglish.com/pronounce/${q}/spanish/la`, target: '_blank', rel: 'noopener', title: 'Real Latin American speakers saying this word in videos' }, 'Hear it in videos')),
      meaning,
      h('div', { class: 'row', style: { marginTop: '8px' } },
        btn('Save word', () => {
          addCard(`${idPrefix}:${word.toLowerCase()}`, 'custom', { front: `¿Qué significa «${word}»?\n${sentence}`, back: meaning.value.trim() || (mx ? mx[1] : '(look it up and say it in Spanish)') }, { source: 'manual', priority: true });
          toast(`“${word}” added to review`, 'ok'); close();
        }, 'small primary'),
        btn('Save sentence', () => {
          addCard(`s:${sentence.slice(0, 50)}`, 'sentence', { text: sentence, ...sentenceCard(sentence, w) }, { source: 'dictation', priority: true });
          toast('Sentence added as a dictation card', 'ok'); close();
        }, 'small')));
    const rect = w.getBoundingClientRect();
    el.style.display = 'block';
    el.style.top = `${window.scrollY + rect.bottom + 6}px`;
    el.style.left = `${Math.max(8, Math.min(window.innerWidth - 320, rect.left))}px`;
  });
  const onDocClick = (e) => { if (!el.contains(e.target) && !e.target.closest?.('.w')) close(); };
  document.addEventListener('click', onDocClick);
  return { el, close, destroy: () => document.removeEventListener('click', onDocClick) };
}
