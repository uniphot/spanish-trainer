// Spanish syllabification, stress and written-accent rules.
// Used by the tilde trainer, the conjugator (enclitic pronouns, prefixed verbs) and the writing checker.

const ACCENTED = { á: 'a', é: 'e', í: 'i', ó: 'o', ú: 'u' };
const ADD_ACCENT = { a: 'á', e: 'é', i: 'í', o: 'ó', u: 'ú' };
const STRONG = new Set(['a', 'e', 'o', 'á', 'é', 'ó', 'í', 'ú']); // stressed í/ú break diphthongs
const VOWELS = new Set(['a', 'e', 'i', 'o', 'u', 'á', 'é', 'í', 'ó', 'ú', 'ü']);
const INSEPARABLE = new Set(['pl', 'pr', 'bl', 'br', 'fl', 'fr', 'cl', 'cr', 'gl', 'gr', 'tr', 'dr', 'kr', 'kl']);

export const stripAccent = (ch) => ACCENTED[ch] || ch;
export const hasAccent = (w) => /[áéíóú]/.test(w);
export const removeAccents = (w) => w.replace(/[áéíóú]/g, (c) => ACCENTED[c]);

// Split a word into units: each unit is {t: text, v: isVowel}. Digraphs ch/ll/rr and
// qu/gu (before e/i) count as a single consonant. Word-final y after a vowel is a vowel.
function units(word) {
  const w = word.toLowerCase();
  const out = [];
  for (let i = 0; i < w.length; i++) {
    const c = w[i], n = w[i + 1], nn = w[i + 2];
    if ((c === 'c' && n === 'h') || (c === 'l' && n === 'l') || (c === 'r' && n === 'r')) {
      out.push({ t: c + n, v: false }); i++; continue;
    }
    if ((c === 'q' || c === 'g') && n === 'u' && nn && 'eiéí'.includes(nn)) {
      out.push({ t: c + n, v: false }); i++; continue;
    }
    if (c === 'y') {
      const prevVowel = out.length && out[out.length - 1].v;
      const atEnd = i === w.length - 1;
      const nextIsCons = n && !VOWELS.has(n);
      out.push({ t: c, v: prevVowel && (atEnd || nextIsCons) });
      continue;
    }
    out.push({ t: c, v: VOWELS.has(c) });
  }
  return out;
}

const isStrongUnit = (u) => STRONG.has(u.t);

// Returns array of syllables (strings). Works for ordinary lowercase Spanish words.
export function syllabify(word) {
  const us = units(word);
  if (!us.length) return [];
  // 1. find nuclei as [start, end] index ranges over units
  const nuclei = [];
  let i = 0;
  while (i < us.length) {
    if (!us[i].v) { i++; continue; }
    let start = i, end = i;
    while (end + 1 < us.length && us[end + 1].v) {
      const a = us[end], b = us[end + 1];
      const hiatus = (isStrongUnit(a) && isStrongUnit(b)) || 'íú'.includes(a.t) || 'íú'.includes(b.t);
      if (hiatus) break;
      end++;
    }
    nuclei.push([start, end]);
    i = end + 1;
  }
  if (!nuclei.length) return [word];
  // 2. distribute consonants between nuclei
  const bounds = []; // index where each syllable starts
  bounds.push(0);
  for (let k = 1; k < nuclei.length; k++) {
    const prevEnd = nuclei[k - 1][1], nextStart = nuclei[k][0];
    const cons = us.slice(prevEnd + 1, nextStart).map((u) => u.t);
    let split; // number of consonants staying with previous syllable
    if (cons.length === 0) split = 0;
    else if (cons.length === 1) split = 0;
    else if (cons.length === 2) split = INSEPARABLE.has(cons.join('')) ? 0 : 1;
    else if (cons.length === 3) split = INSEPARABLE.has(cons[1] + cons[2]) ? 1 : 2;
    else split = 2;
    bounds.push(prevEnd + 1 + split);
  }
  const syl = [];
  for (let k = 0; k < bounds.length; k++) {
    const from = bounds[k], to = k + 1 < bounds.length ? bounds[k + 1] : us.length;
    syl.push(us.slice(from, to).map((u) => u.t).join(''));
  }
  return syl;
}

// Default stress (no written accent): ends in vowel/n/s → penultimate, else last.
function defaultStressSyl(syl, word) {
  if (syl.length === 1) return 0;
  const last = removeAccents(word.toLowerCase()).slice(-1);
  return /[aeiouns]/.test(last) ? syl.length - 2 : syl.length - 1;
}

// Index (in syllables, from the start) of the stressed syllable of a correctly spelled word.
export function stressSyllable(word) {
  const syl = syllabify(word);
  const idx = syl.findIndex((s) => /[áéíóú]/.test(s));
  return idx >= 0 ? idx : defaultStressSyl(syl, word);
}

// Within a syllable, which character carries the accent mark if one is needed.
function accentTargetInSyllable(s) {
  const chars = [...s];
  const vIdx = chars.map((c, i) => (VOWELS.has(c) && c !== 'ü' ? i : -1)).filter((i) => i >= 0);
  if (!vIdx.length) return -1;
  if (vIdx.length === 1) return vIdx[0];
  const strong = vIdx.filter((i) => 'aeoáéó'.includes(chars[i]));
  if (strong.length) return strong[0];
  return vIdx[vIdx.length - 1]; // ui / iu → second vowel
}

// Character position (in the word) of the stressed vowel.
export function stressedVowelPos(word) {
  const w = word.toLowerCase();
  const acc = w.search(/[áéíóú]/);
  if (acc >= 0) return acc;
  const syl = syllabify(w);
  const si = defaultStressSyl(syl, w);
  let offset = 0;
  for (let k = 0; k < si; k++) offset += syl[k].length;
  return offset + accentTargetInSyllable(syl[si]);
}

// Rebuild a word so the stressed vowel sits at char position `pos`, adding or removing the tilde.
export function withStressAt(word, pos) {
  const plain = removeAccents(word);
  const natural = stressedVowelPos(plain);
  const ch = plain[pos];
  const isWeak = ch === 'i' || ch === 'u';
  // a silent h between vowels does not block a hiatus (bú-ho, pro-hí-be)
  const prev = plain[pos - 1] === 'h' ? plain[pos - 2] : plain[pos - 1];
  const next = plain[pos + 1] === 'h' ? plain[pos + 2] : plain[pos + 1];
  const touchesStrong = isWeak && ((prev && 'aeo'.includes(prev)) || (next && 'aeo'.includes(next)));
  if (natural === pos && !touchesStrong) return plain;
  if (syllabify(plain).length === 1 && !touchesStrong) return plain;
  return plain.slice(0, pos) + ADD_ACCENT[ch] + plain.slice(pos + 1);
}

// Attach enclitic pronouns to a verb form, fixing the written accent: compra+lo → cómpralo,
// di+me+lo → dímelo, sentemos+nos → sentémonos, sentad+os → sentaos, vestid+os → vestíos.
export function attachClitics(form, clitics) {
  if (!clitics) return form;
  let base = form;
  const pos = stressedVowelPos(form);
  if (/^nos/.test(clitics) && /mos$/.test(base)) base = base.slice(0, -1);
  if (/^os/.test(clitics) && /d$/.test(base) && base !== 'id') base = base.slice(0, -1);
  if (/^se(l|$)/.test(clitics) && /mos$/.test(base)) base = base.slice(0, -1); // digámoselo
  return withStressAt(base + clitics, pos);
}

// Prefixing a verb form (man+tén, pre+vió): keep the stress where the base had it.
export function prefixForm(prefix, form) {
  const pos = stressedVowelPos(form) + prefix.length;
  return withStressAt(prefix + form, pos);
}

// For the accent trainer: classify a correctly spelled word.
const DIACRITICS = {
  tú: 'pronoun "you" (tu = your)', él: 'pronoun "he" (el = the)', mí: 'pronoun "me" (mi = my)',
  sí: '"yes" / reflexive pronoun (si = if)', té: '"tea" (te = pronoun)', sé: '"I know" / "be!" (se = pronoun)',
  dé: 'verb dar (de = of/from)', más: '"more" (mas = but, literary)', aún: '"still/yet" (aun = even)',
  qué: 'interrogative/exclamative', quién: 'interrogative', cuál: 'interrogative', cómo: 'interrogative',
  dónde: 'interrogative', cuándo: 'interrogative', cuánto: 'interrogative', cuánta: 'interrogative',
};

export function classifyWord(word) {
  const w = word.toLowerCase();
  const syl = syllabify(w);
  const si = stressSyllable(w);
  const fromEnd = syl.length - 1 - si;
  const type = syl.length === 1 ? 'monosílaba' : fromEnd === 0 ? 'aguda' : fromEnd === 1 ? 'llana' : fromEnd === 2 ? 'esdrújula' : 'sobresdrújula';
  const accented = hasAccent(w);
  let reason;
  if (syl.length === 1) {
    reason = accented ? `Diacritic tilde: ${DIACRITICS[w] || 'distinguishes it from an unstressed homonym'}.` : 'Monosyllables never take a tilde (except diacritic ones like tú, él, sí, más).';
  } else {
    const plain = removeAccents(w);
    const pos = stressedVowelPos(w);
    const ch = plain[pos];
    const prev = plain[pos - 1] === 'h' ? plain[pos - 2] : plain[pos - 1];
    const next = plain[pos + 1] === 'h' ? plain[pos + 2] : plain[pos + 1];
    const hiatus = (ch === 'i' || ch === 'u') && ((prev && 'aeo'.includes(prev)) || (next && 'aeo'.includes(next)));
    if (hiatus && accented) reason = 'Stressed i/u next to a/e/o (hiatus) always takes a tilde: dí-a, pa-ís, re-ú-ne.';
    else if (DIACRITICS[w]) reason = `Diacritic tilde: ${DIACRITICS[w]}.`;
    else if (type === 'aguda') reason = accented ? 'Aguda (stress on the last syllable) ending in a vowel, -n or -s → tilde.' : 'Aguda NOT ending in vowel/-n/-s → no tilde.';
    else if (type === 'llana') reason = accented ? 'Llana (stress on the second-to-last syllable) NOT ending in vowel/-n/-s → tilde.' : 'Llana ending in a vowel, -n or -s → no tilde.';
    else reason = 'Esdrújulas and sobresdrújulas ALWAYS take a tilde.';
  }
  return { syllables: syl, stressed: si, type, accented, reason };
}
