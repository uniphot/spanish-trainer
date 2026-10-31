// Rule-based Spanish conjugation engine. Generates every simple and compound form for
// regular verbs, stem-changers, orthographic changers, -uir/-eer verbs, accent verbs (enviar,
// continuar), yo-irregulars, strong preterites and prefixed families (mantener, componer…).
import { attachClitics, prefixForm, removeAccents } from './phonology.js';
import { VERB_LIST } from '../data/verbs.js';

export const PERSONS = ['yo', 'tú', 'él / ella / usted', 'nosotros', 'vosotros', 'ellos / ustedes'];
export const SUBJECTS = ['yo', 'tú', 'él', 'nosotros', 'vosotros', 'ellos'];
const REFL = ['me', 'te', 'se', 'nos', 'os', 'se'];

export const TENSES = {
  pres: { es: 'Presente', en: 'Present', level: 'A1', mood: 'ind' },
  pret: { es: 'Pretérito indefinido', en: 'Preterite (simple past)', level: 'A2', mood: 'ind' },
  impf: { es: 'Pretérito imperfecto', en: 'Imperfect', level: 'A2', mood: 'ind' },
  fut: { es: 'Futuro simple', en: 'Future', level: 'A2', mood: 'ind' },
  cond: { es: 'Condicional simple', en: 'Conditional', level: 'B1', mood: 'ind' },
  pperf: { es: 'Pretérito perfecto', en: 'Present perfect', level: 'A2', mood: 'ind', compound: 'pres' },
  plusc: { es: 'Pluscuamperfecto', en: 'Pluperfect', level: 'B1', mood: 'ind', compound: 'impf' },
  futperf: { es: 'Futuro perfecto', en: 'Future perfect', level: 'B2', mood: 'ind', compound: 'fut' },
  condperf: { es: 'Condicional compuesto', en: 'Conditional perfect', level: 'B2', mood: 'ind', compound: 'cond' },
  psubj: { es: 'Presente de subjuntivo', en: 'Present subjunctive', level: 'B1', mood: 'subj' },
  isubj: { es: 'Imperfecto de subjuntivo', en: 'Imperfect subjunctive', level: 'B2', mood: 'subj' },
  psubjperf: { es: 'Pretérito perfecto de subjuntivo', en: 'Perfect subjunctive', level: 'B2', mood: 'subj', compound: 'psubj' },
  plsubj: { es: 'Pluscuamperfecto de subjuntivo', en: 'Pluperfect subjunctive', level: 'C1', mood: 'subj', compound: 'isubj' },
  imp: { es: 'Imperativo afirmativo', en: 'Affirmative command', level: 'A2', mood: 'imp' },
  impneg: { es: 'Imperativo negativo', en: 'Negative command', level: 'B1', mood: 'imp' },
};

const END = {
  pres: { ar: ['o', 'as', 'a', 'amos', 'áis', 'an'], er: ['o', 'es', 'e', 'emos', 'éis', 'en'], ir: ['o', 'es', 'e', 'imos', 'ís', 'en'] },
  pret: { ar: ['é', 'aste', 'ó', 'amos', 'asteis', 'aron'], er: ['í', 'iste', 'ió', 'imos', 'isteis', 'ieron'] },
  impf: { ar: ['aba', 'abas', 'aba', 'ábamos', 'abais', 'aban'], er: ['ía', 'ías', 'ía', 'íamos', 'íais', 'ían'] },
  fut: ['é', 'ás', 'á', 'emos', 'éis', 'án'],
  cond: ['ía', 'ías', 'ía', 'íamos', 'íais', 'ían'],
  psubj: { ar: ['e', 'es', 'e', 'emos', 'éis', 'en'], er: ['a', 'as', 'a', 'amos', 'áis', 'an'] },
  strong: ['e', 'iste', 'o', 'imos', 'isteis', 'ieron'],
};
const BOOT = [0, 1, 2, 5];

// Fully or partly irregular verbs. Anything not listed is derived by rule.
const IRR = {
  ser: { pres: ['soy', 'eres', 'es', 'somos', 'sois', 'son'], pret: ['fui', 'fuiste', 'fue', 'fuimos', 'fuisteis', 'fueron'], impf: ['era', 'eras', 'era', 'éramos', 'erais', 'eran'], psubj: ['sea', 'seas', 'sea', 'seamos', 'seáis', 'sean'], impTu: 'sé' },
  estar: { pres: ['estoy', 'estás', 'está', 'estamos', 'estáis', 'están'], pret: 'estuv', psubj: ['esté', 'estés', 'esté', 'estemos', 'estéis', 'estén'] },
  ir: { pres: ['voy', 'vas', 'va', 'vamos', 'vais', 'van'], pret: ['fui', 'fuiste', 'fue', 'fuimos', 'fuisteis', 'fueron'], impf: ['iba', 'ibas', 'iba', 'íbamos', 'ibais', 'iban'], psubj: ['vaya', 'vayas', 'vaya', 'vayamos', 'vayáis', 'vayan'], impTu: 've', impNos: 'vamos', ger: 'yendo' },
  haber: { pres: ['he', 'has', 'ha', 'hemos', 'habéis', 'han'], pret: 'hub', fut: 'habr', psubj: ['haya', 'hayas', 'haya', 'hayamos', 'hayáis', 'hayan'] },
  dar: { pres: ['doy', 'das', 'da', 'damos', 'dais', 'dan'], pret: ['di', 'diste', 'dio', 'dimos', 'disteis', 'dieron'], psubj: ['dé', 'des', 'dé', 'demos', 'deis', 'den'] },
  ver: { yo: 'veo', pres: ['veo', 'ves', 've', 'vemos', 'veis', 'ven'], pret: ['vi', 'viste', 'vio', 'vimos', 'visteis', 'vieron'], impf: ['veía', 'veías', 'veía', 'veíamos', 'veíais', 'veían'], pp: 'visto' },
  saber: { pres: ['sé', 'sabes', 'sabe', 'sabemos', 'sabéis', 'saben'], pret: 'sup', fut: 'sabr', psubj: ['sepa', 'sepas', 'sepa', 'sepamos', 'sepáis', 'sepan'] },
  caber: { yo: 'quepo', pret: 'cup', fut: 'cabr' },
  poder: { stem: 'ue', pret: 'pud', fut: 'podr', ger: 'pudiendo' },
  querer: { stem: 'ie', pret: 'quis', fut: 'querr' },
  tener: { stem: 'ie', yo: 'tengo', pret: 'tuv', fut: 'tendr', impTu: 'ten' },
  venir: { stem: 'ie', yo: 'vengo', pret: 'vin', fut: 'vendr', impTu: 'ven' },
  poner: { yo: 'pongo', pret: 'pus', fut: 'pondr', impTu: 'pon', pp: 'puesto' },
  salir: { yo: 'salgo', fut: 'saldr', impTu: 'sal' },
  valer: { yo: 'valgo', fut: 'valdr' },
  hacer: { yo: 'hago', pret: 'hic', pret3: 'hizo', fut: 'har', impTu: 'haz', pp: 'hecho' },
  satisfacer: { yo: 'satisfago', pret: 'satisfic', pret3: 'satisfizo', fut: 'satisfar', impTu: 'satisfaz', pp: 'satisfecho' },
  decir: { stem: 'i', yo: 'digo', pret: 'dij', fut: 'dir', impTu: 'di', pp: 'dicho' },
  traer: { yo: 'traigo', pret: 'traj' },
  caer: { yo: 'caigo' },
  oír: { pres: ['oigo', 'oyes', 'oye', 'oímos', 'oís', 'oyen'], yo: 'oigo' },
  oler: { pres: ['huelo', 'hueles', 'huele', 'olemos', 'oléis', 'huelen'], psubj: ['huela', 'huelas', 'huela', 'olamos', 'oláis', 'huelan'] },
  andar: { pret: 'anduv' },
  reír: { pres: ['río', 'ríes', 'ríe', 'reímos', 'reís', 'ríen'], pret: ['reí', 'reíste', 'rio', 'reímos', 'reísteis', 'rieron'], psubj: ['ría', 'rías', 'ría', 'riamos', 'riais', 'rían'], ger: 'riendo', pp: 'reído', impTu: 'ríe' },
  freír: { pres: ['frío', 'fríes', 'fríe', 'freímos', 'freís', 'fríen'], pret: ['freí', 'freíste', 'frio', 'freímos', 'freísteis', 'frieron'], psubj: ['fría', 'frías', 'fría', 'friamos', 'friais', 'frían'], ger: 'friendo', pp: 'frito', impTu: 'fríe' },
  morir: { stem: 'ue', pp: 'muerto' },
  abrir: { pp: 'abierto' },
  cubrir: { pp: 'cubierto' },
  escribir: { pp: 'escrito' },
  romper: { pp: 'roto' },
  volver: { stem: 'ue', pp: 'vuelto' },
  resolver: { stem: 'ue', pp: 'resuelto' },
  disolver: { stem: 'ue', pp: 'disuelto' },
  imprimir: { pp: 'impreso' },
  prever: { yo: 'preveo', psubj: ['prevea', 'preveas', 'prevea', 'preveamos', 'preveáis', 'prevean'], pres: ['preveo', 'prevés', 'prevé', 'prevemos', 'prevéis', 'prevén'], pret: ['preví', 'previste', 'previó', 'previmos', 'previsteis', 'previeron'], impf: ['preveía', 'preveías', 'preveía', 'preveíamos', 'preveíais', 'preveían'], pp: 'previsto' },
  conducir: {}, // handled by the -ducir rule; listed so it is never treated as a prefix family
};
const PREFIX_BASES = ['tener', 'venir', 'poner', 'hacer', 'traer', 'volver', 'cubrir', 'reír', 'caer', 'valer', 'salir'];

const VERB_INFO = new Map();
for (const row of VERB_LIST) {
  const [inf, en, level, flags = ''] = row.split('|');
  if (!VERB_INFO.has(inf)) VERB_INFO.set(inf, { inf, en, level, flags: flags.split(',').filter(Boolean) });
}
export const verbs = () => [...VERB_INFO.values()];
export const verbInfo = (inf) => VERB_INFO.get(inf);

const isVowel = (c) => !!c && 'aeiouáéíóú'.includes(c);

// Index of the stem vowel that undergoes a change: last vowel, ignoring the silent u of gu/qu.
function lastStemVowel(stem) {
  for (let i = stem.length - 1; i >= 0; i--) {
    const c = stem[i];
    if (!'aeiou'.includes(c)) continue;
    if (c === 'u' && (stem[i - 1] === 'g' || stem[i - 1] === 'q') && i === stem.length - 1) continue;
    if (c === 'u' && (stem[i - 1] === 'g' || stem[i - 1] === 'q') && isVowel(stem[i + 1])) continue;
    return i;
  }
  return -1;
}
function strongChange(stem, type) {
  if (!type) return stem;
  const i = lastStemVowel(stem);
  if (i < 0) return stem;
  const c = stem[i];
  let rep = c;
  if (type === 'ie' && (c === 'e' || c === 'i')) rep = 'ie';
  else if (type === 'ue' && (c === 'o' || c === 'u')) rep = 'ue';
  else if (type === 'i' && c === 'e') rep = 'i';
  return stem.slice(0, i) + rep + stem.slice(i + 1);
}
function weakChange(stem, type) {
  if (!type) return stem;
  const i = lastStemVowel(stem);
  if (i < 0) return stem;
  const c = stem[i];
  let rep = c;
  if ((type === 'ie' || type === 'i') && c === 'e') rep = 'i';
  else if (type === 'ue' && c === 'o') rep = 'u';
  return stem.slice(0, i) + rep + stem.slice(i + 1);
}
function accentize(stem) {
  for (let i = stem.length - 1; i >= 0; i--) {
    if (stem[i] === 'i') return stem.slice(0, i) + 'í' + stem.slice(i + 1);
    if (stem[i] === 'u' && stem[i - 1] !== 'q' && stem[i - 1] !== 'g') return stem.slice(0, i) + 'ú' + stem.slice(i + 1);
  }
  return stem;
}
// -ar verbs: spelling changes before e (busqué, llegue, empecé, averigüé)
function joinAr(stem, ending) {
  if ('eé'.includes(ending[0])) {
    if (stem.endsWith('gu')) return stem.slice(0, -2) + 'gü' + ending;
    if (stem.endsWith('c')) return stem.slice(0, -1) + 'qu' + ending;
    if (stem.endsWith('g')) return stem + 'u' + ending;
    if (stem.endsWith('z')) return stem.slice(0, -1) + 'c' + ending;
  }
  return stem + ending;
}

function analyze(input) {
  let inf = input.trim().toLowerCase();
  let reflexive = false;
  if (/(ar|er|ir|ír)se$/.test(inf)) { reflexive = true; inf = inf.slice(0, -2); }
  const cls = inf.endsWith('ar') ? 'ar' : inf.endsWith('er') ? 'er' : 'ir';
  const stem = inf.slice(0, -2);
  const info = VERB_INFO.get(inf) || VERB_INFO.get(inf + 'se') || { flags: [] };
  let irr = IRR[inf] ? { ...IRR[inf] } : null;
  let prefix = '';
  if (!irr) {
    const base = PREFIX_BASES.find((b) => inf.endsWith(b) && inf.length > b.length);
    if (base) {
      prefix = inf.slice(0, -base.length);
      irr = {};
      for (const [k, v] of Object.entries(IRR[base])) {
        if (k === 'stem') irr.stem = v;
        else if (Array.isArray(v)) irr[k] = v.map((f) => prefixForm(prefix, f));
        else if (k === 'impTu') irr[k] = prefixForm(prefix, v);
        else irr[k] = prefix + v;
      }
    }
  }
  irr = irr || {};
  const flags = info.flags || [];
  const stemType = irr.stem || flags.find((f) => f === 'ie' || f === 'ue' || f === 'i') || null;
  const accentVerb = flags.includes('í') || flags.includes('ú');
  // consonant pattern affecting yo / subjunctive
  let yoRule = null;
  if (/ducir$/.test(inf)) yoRule = 'zc';
  else if (/[aeiou]c(er|ir)$/.test(inf) && !['hacer', 'cocer', 'mecer', 'decir'].includes(inf)) yoRule = 'zc';
  else if (/[^aeiou]c(er|ir)$/.test(inf)) yoRule = 'z';
  else if (/g(er|ir)$/.test(inf)) yoRule = 'j';
  else if (/guir$/.test(inf)) yoRule = 'g';
  else if (/[^gq]uir$/.test(inf)) yoRule = 'y';
  const vowelStem = cls !== 'ar' && /[aeo]$/.test(stem);
  return { inf, input, reflexive, cls, stem, irr, stemType, accentVerb, yoRule, vowelStem, prefix, info };
}

function applyYoConsonant(s, v) {
  switch (v.yoRule) {
    case 'zc': return s.slice(0, -1) + 'zc';
    case 'z': return s.slice(0, -1) + 'z';
    case 'j': return s.slice(0, -1) + 'j';
    case 'g': return s.slice(0, -2) + 'g';
    case 'y': return s + 'y';
    default: return s;
  }
}

function present(v) {
  if (v.irr.pres) return v.irr.pres.slice();
  const e = END.pres[v.cls];
  return e.map((end, p) => {
    let s = v.stem;
    if (BOOT.includes(p)) s = strongChange(s, v.stemType);
    if (p === 0) {
      if (v.irr.yo) return v.irr.yo;
      s = applyYoConsonant(s, v);
    } else if (v.yoRule === 'y' && BOOT.includes(p)) s += 'y';
    if (v.accentVerb && BOOT.includes(p)) s = accentize(s);
    return s + end;
  });
}

function subjStem(v, p) {
  if (v.irr.yo) return v.irr.yo.slice(0, -1);
  let s = v.stem;
  if (BOOT.includes(p)) s = strongChange(s, v.stemType);
  else if (v.cls === 'ir') s = weakChange(s, v.stemType);
  s = applyYoConsonant(s, v);
  if (v.accentVerb && BOOT.includes(p)) s = accentize(s);
  return s;
}
function presSubj(v) {
  if (v.irr.psubj) return v.irr.psubj.slice();
  const e = END.psubj[v.cls === 'ar' ? 'ar' : 'er'];
  return e.map((end, p) => (v.cls === 'ar' ? joinAr(subjStem(v, p), end) : subjStem(v, p) + end));
}

function preterite(v) {
  const r = v.irr.pret;
  if (Array.isArray(r)) return r.slice();
  if (typeof r === 'string' || /ducir$/.test(v.inf)) {
    const st = typeof r === 'string' ? r : v.stem.slice(0, -1) + 'j';
    return END.strong.map((end, p) => {
      if (p === 2 && v.irr.pret3) return v.irr.pret3;
      if (p === 5 && st.endsWith('j')) return st + 'eron';
      return st + end;
    });
  }
  if (v.cls === 'ar') return END.pret.ar.map((end, p) => (p === 0 ? joinAr(v.stem, end) : v.stem + end));
  return END.pret.er.map((end, p) => {
    let s = v.stem;
    if ((p === 2 || p === 5) && v.cls === 'ir') s = weakChange(s, v.stemType);
    if (v.vowelStem || v.yoRule === 'y') {
      if (p === 2) return s + 'yó';
      if (p === 5) return s + 'yeron';
      if (v.yoRule === 'y') return s + end; // construiste, construimos
      return s + end.replace(/^i/, 'í'); // leíste, leímos
    }
    return s + end;
  });
}

function imperfect(v) {
  if (v.irr.impf) return v.irr.impf.slice();
  return END.impf[v.cls === 'ar' ? 'ar' : 'er'].map((end) => v.stem + end);
}
function futureStem(v) { return v.irr.fut || removeAccents(v.inf); }
const future = (v) => END.fut.map((e) => futureStem(v) + e);
const conditional = (v) => END.cond.map((e) => futureStem(v) + e);

function imperfSubj(v, alt = false) {
  const third = preterite(v)[5];
  const base = third.slice(0, -3); // drop -ron
  const ends = alt ? ['se', 'ses', 'se', 'semos', 'seis', 'sen'] : ['ra', 'ras', 'ra', 'ramos', 'rais', 'ran'];
  return ends.map((e, p) => {
    if (p === 3) {
      const last = base.slice(-1);
      const acc = { a: 'á', e: 'é' }[last] || last;
      return base.slice(0, -1) + acc + e;
    }
    return base + e;
  });
}

export function gerund(input) {
  const v = typeof input === 'string' ? analyze(input) : input;
  if (v.irr.ger) return v.irr.ger;
  if (v.cls === 'ar') return v.stem + 'ando';
  let s = v.cls === 'ir' ? weakChange(v.stem, v.stemType) : v.stem;
  if (v.vowelStem || v.yoRule === 'y') return s + 'yendo';
  return s + 'iendo';
}

export function participle(input) {
  const v = typeof input === 'string' ? analyze(input) : input;
  if (v.irr.pp) return v.irr.pp;
  const inf = v.inf;
  if (/scribir$/.test(inf)) return inf.replace(/scribir$/, 'scrito');
  if (v.cls === 'ar') return v.stem + 'ado';
  if (/[aeo]$/.test(v.stem)) return v.stem + 'ído';
  return v.stem + 'ido';
}

function imperative(v) {
  const ps = presSubj(v);
  const tu = v.irr.impTu || present(v)[2];
  const vos = removeAccents(v.inf).slice(0, -1) + 'd';
  const vosFixed = v.inf === 'oír' ? 'oíd' : v.inf === 'reír' ? 'reíd' : v.inf === 'freír' ? 'freíd' : vos;
  return [null, tu, ps[2], v.irr.impNos || ps[3], vosFixed, ps[5]];
}

function reflexivize(v, forms, tense) {
  if (!v.reflexive) return forms;
  if (tense === 'imp') {
    const cl = [null, 'te', 'se', 'nos', 'os', 'se'];
    return forms.map((f, p) => {
      if (!f) return f;
      if (v.inf === 'ir' && p === 4) return 'idos';
      if (v.inf === 'ir' && p === 3) return 'vámonos';
      return attachClitics(f, cl[p]);
    });
  }
  if (tense === 'impneg') return forms.map((f, p) => (f ? f.replace(/^no /, `no ${REFL[p]} `) : f));
  return forms.map((f, p) => `${REFL[p]} ${f}`);
}

const cache = new Map();
// conjugate('hablar', 'pret') → ['hablé', 'hablaste', ...]; imperatives have null for yo.
export function conjugate(input, tense) {
  const key = input + '|' + tense;
  if (cache.has(key)) return cache.get(key);
  const v = analyze(input);
  let forms;
  const t = TENSES[tense];
  if (t && t.compound) {
    const aux = conjugate('haber', t.compound);
    const pp = participle(v);
    forms = aux.map((a) => `${a} ${pp}`);
    if (v.reflexive) forms = forms.map((f, p) => `${REFL[p]} ${f}`);
    cache.set(key, forms);
    return forms;
  }
  switch (tense) {
    case 'pres': forms = present(v); break;
    case 'pret': forms = preterite(v); break;
    case 'impf': forms = imperfect(v); break;
    case 'fut': forms = future(v); break;
    case 'cond': forms = conditional(v); break;
    case 'psubj': forms = presSubj(v); break;
    case 'isubj': forms = imperfSubj(v); break;
    case 'isubjse': forms = imperfSubj(v, true); break;
    case 'imp': forms = imperative(v); break;
    case 'impneg': forms = [null, ...presSubj(v).slice(1)].map((f) => (f ? 'no ' + f : f)); break;
    default: throw new Error('Unknown tense ' + tense);
  }
  forms = reflexivize(v, forms, tense === 'isubjse' ? 'x' : tense);
  cache.set(key, forms);
  return forms;
}

// Accepted alternatives for a given cell (e.g. -ra / -se imperfect subjunctive).
export function acceptedForms(inf, tense, person) {
  const main = conjugate(inf, tense)[person];
  const alts = [main];
  if (tense === 'isubj') alts.push(conjugate(inf, 'isubjse')[person]);
  if (tense === 'plsubj') alts.push(conjugate('haber', 'isubjse')[person] + ' ' + participle(inf));
  return alts.filter(Boolean);
}

// Reverse index: surface form → [{inf, tense, person}] for the writing analyzer.
let reverse = null;
export function reverseIndex() {
  if (reverse) return reverse;
  reverse = new Map();
  const simple = ['pres', 'pret', 'impf', 'fut', 'cond', 'psubj', 'isubj', 'isubjse'];
  for (const { inf } of VERB_INFO.values()) {
    const bare = inf.replace(/se$/, '');
    if (bare !== inf && VERB_INFO.has(bare)) continue;
    for (const t of simple) {
      let forms;
      try { forms = conjugate(bare, t); } catch { continue; }
      forms.forEach((f, p) => {
        if (!f) return;
        const list = reverse.get(f) || [];
        list.push({ inf: bare, tense: t === 'isubjse' ? 'isubj' : t, person: p });
        reverse.set(f, list);
      });
    }
    try {
      const pp = participle(bare);
      const l = reverse.get(pp) || []; l.push({ inf: bare, tense: 'pp', person: -1 }); reverse.set(pp, l);
      const g = gerund(bare);
      const l2 = reverse.get(g) || []; l2.push({ inf: bare, tense: 'ger', person: -1 }); reverse.set(g, l2);
    } catch { /* ignore */ }
  }
  return reverse;
}
