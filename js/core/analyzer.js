// Text analysis for writing: tokens with offsets, verb tense/mood profile (via the
// conjugator's reverse index), connectors, lexical diversity, repetition, task requirements.
import { reverseIndex, TENSES } from './conjugator.js';
import { CONNECTORS, SYNONYMS } from '../data/writing.js';
import { mattr, sentences, wordCount, stripAccents } from './text.js';

export function tokens(text) {
  const out = [];
  const re = /[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]+/g;
  let m;
  while ((m = re.exec(text))) out.push({ w: m[0], lw: m[0].toLowerCase(), start: m.index, end: m.index + m[0].length });
  return out;
}

// Frequent nouns/function words that are also verb forms — don't count them as verbs.
const NOT_VERBS = new Set(['como', 'para', 'sobre', 'entre', 'bajo', 'casa', 'cara', 'río', 'solo', 'trabajo', 'cambio', 'cuenta', 'vino', 'paso', 'peso',
  'juego', 'sueño', 'beso', 'viaje', 'cocina', 'compra', 'ayuda', 'pregunta', 'nada', 'libro', 'canto', 'baile', 'abrazo', 'estudio', 'uso', 'gusto',
  'aviso', 'centro', 'vuelta', 'fuera', 'cerca', 'medio', 'claro', 'llama', 'mira', 'cena', 'comida', 'salida', 'llegada', 'vida', 'dicho', 'hecho',
  'mesa', 'vale', 'entonces', 'sobre', 'cuento', 'regalo', 'pago', 'plato', 'gasto', 'deseo', 'miedo', 'lado', 'cuesta', 'recuerdo', 'resto', 'paseo', 'visita']);

export function verbReadings(lw) {
  if (NOT_VERBS.has(lw)) return [];
  return reverseIndex().get(lw) || [];
}

const IND = new Set(['pres', 'pret', 'impf', 'fut', 'cond']);
const SUBJ = new Set(['psubj', 'isubj']);

const PAST_MARKERS = /\b(ayer|anoche|anteayer|pasad[oa]|hace (dos|tres|unos|unas|un|una|mucho|poco)|en (19|20)\d\d|el otro día|aquel|aquella|de repente|una vez)\b/i;

export function tenseProfile(text) {
  const toks = tokens(text);
  const pastContext = PAST_MARKERS.test(text);
  const counts = { pres: 0, pret: 0, impf: 0, fut: 0, cond: 0, psubj: 0, isubj: 0, compound: 0, imp: 0 };
  const verbs = new Set();
  toks.forEach((t, i) => {
    const rs = verbReadings(t.lw);
    if (!rs.length) return;
    const prev = toks[i - 1]?.lw;
    // compound tenses: haber + participle
    if (rs.some((r) => r.tense === 'pp') && prev && /^(he|has|ha|hemos|habéis|han|había|habías|habíamos|habían|habré|habría|haya|hubiera|hubiese)$/.test(prev)) {
      counts.compound++; verbs.add(rs[0].inf); return;
    }
    const tenses = new Set(rs.map((r) => r.tense).filter((x) => x !== 'pp' && x !== 'ger'));
    if (!tenses.size) return;
    if ([...tenses].every((x) => SUBJ.has(x))) { counts[[...tenses][0]]++; verbs.add(rs[0].inf); return; }
    const ind = [...tenses].filter((x) => IND.has(x));
    if (ind.length === 1) counts[ind[0]]++;
    else if (ind.length > 1) { // ambiguous (e.g. hablamos = pres/pret)
      if (pastContext && ind.includes('pret')) counts.pret++;
      else ind.forEach((x) => { counts[x] += 1 / ind.length; });
    }
    // affirmative commands with enclitics: ayúdame, dímelo, cuéntamelo
    verbs.add(rs[0].inf);
  });
  // enclitic commands (accented form + pronoun ending) and negative commands
  for (const t of toks) if (/[áéíóú]/.test(t.lw) && /(me|te|nos|lo|la|le|les|los|las|se)$/.test(t.lw) && t.lw.length > 4 && !reverseIndex().has(t.lw)) counts.imp++;
  for (const m of text.matchAll(/(^|[.!¡?¿,;:]\s*)(di|haz|ve|pon|sal|ten|ven|mira|escucha|perdona|perdone|oye|oiga|dime|dame|toma|sigue|siga|llama|espera|ayúdame)\b/gi)) { counts.imp++; void m; }
  return { counts, verbs: verbs.size };
}

export function connectorsUsed(text) {
  const low = ` ${text.toLowerCase().replace(/[.,;:!?¿¡()"«»]/g, ' ').replace(/\s+/g, ' ')} `;
  const found = [];
  for (const [lvl, list] of Object.entries(CONNECTORS)) {
    for (const c of list) if (low.includes(` ${c} `)) found.push({ c, lvl });
  }
  return found;
}

const FUNCTION_WORDS = new Set('el la los las un una unos unas de del a al en y o que se me te nos os le les lo mi mis tu tus su sus es son por para con no si sí muy más ya yo tú él ella nosotros ellos ellas usted ustedes este esta esto ese esa eso como pero porque cuando donde hay ha he han había fue era'.split(' '));

export function repeatedWords(text) {
  const counts = new Map();
  for (const t of tokens(text)) {
    if (t.lw.length < 3 && !SYNONYMS[t.lw]) continue;
    if (FUNCTION_WORDS.has(t.lw) && !SYNONYMS[t.lw]) continue;
    counts.set(t.lw, (counts.get(t.lw) || 0) + 1);
  }
  const total = wordCount(text);
  const threshold = total > 200 ? 4 : 3;
  return [...counts.entries()].filter(([w, n]) => n >= threshold || (SYNONYMS[w] && n >= 3))
    .sort((a, b) => b[1] - a[1]).slice(0, 6).map(([w, n]) => ({ w, n, alt: SYNONYMS[w] || null }));
}

export function analyze(text, task) {
  const wc = wordCount(text);
  const sents = sentences(text);
  const prof = tenseProfile(text);
  const conns = connectorsUsed(text);
  const res = {
    words: wc,
    sentences: sents.length,
    avgLen: sents.length ? wc / sents.length : 0,
    mattr: mattr(text),
    tenses: prof.counts,
    distinctVerbs: prof.verbs,
    connectors: conns,
    repeated: repeatedWords(text),
    reqs: [],
  };
  if (task) {
    const low = text.toLowerCase();
    const plainLow = stripAccents(low);
    if (task.min) res.reqs.push({ label: `${task.min}–${task.max} words`, met: wc >= task.min && wc <= (task.max || 1e9) * 1.15, detail: `${wc} words` });
    for (const r of task.reqs || []) {
      let met = false, detail = '';
      if (r.t === 'any') { met = r.words.some((w) => low.includes(w) || plainLow.includes(stripAccents(w))); }
      else if (r.t === 'tense') { const n = Math.floor(prof.counts[r.tense] || 0); met = n >= r.min; detail = `${n} found`; }
      else if (r.t === 'mood') {
        const n = r.mood === 'subj' ? Math.floor(prof.counts.psubj + prof.counts.isubj) : prof.counts.imp;
        met = n >= r.min; detail = `${n} found`;
      } else if (r.t === 'connectors') { met = conns.length >= r.min; detail = `${conns.length}: ${conns.map((c) => c.c).join(', ') || '—'}`; }
      res.reqs.push({ label: r.label, met, detail });
    }
  }
  return res;
}

export const TENSE_LABEL = (k) => (k === 'compound' ? 'Compound tenses' : k === 'imp' ? 'Commands' : TENSES[k]?.es || k);
