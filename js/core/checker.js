// Writing checker. Three layers:
//  1. Built-in learner-error rules (offline, instant, with explanations and grammar-topic links),
//     including verb-aware checks driven by the conjugator: missing accents on verb forms,
//     indicative after subjunctive triggers, future after "cuando", conditional after "si".
//  2. LanguageTool (online, optional) for general spelling and grammar.
//  3. AI feedback (optional, see core/ai.js) for a full teacher-style review.
import { reverseIndex, conjugate } from './conjugator.js';
import { tokens, verbReadings } from './analyzer.js';
import { stripAccents } from './text.js';
import { VERB_LIST } from '../data/verbs.js';
import { TILDE_WORDS } from '../data/words.js';

const INFINITIVES = new Set(VERB_LIST.map((r) => r.split('|')[0]).flatMap((v) => (v.endsWith('se') ? [v, v.slice(0, -2)] : [v])));
// infinitive, possibly with enclitic pronouns: ayudarte, decírselo
const isInfinitive = (w) => INFINITIVES.has(w) || INFINITIVES.has(stripAccents(w).replace(/(me|te|se|nos|os|lo|la|le|les|los|las)+$/, ''));

// Unaccented words that are correct as they are (so not flagged as "missing accent").
const KNOWN_PLAIN = new Set(['esta', 'estas', 'este', 'esto', 'solo', 'mas', 'tu', 'el', 'mi', 'si', 'se', 'te', 'de', 'que', 'como', 'donde', 'cuando', 'cuanto',
  'quien', 'cual', 'aun', 'hacia', 'seria', 'continuo', 'varia', 'secretaria', 'sabana', 'papa', 'practico', 'publico', 'termino', 'numero', 'animo', 'critico',
  'deposito', 'liquido', 'limite', 'cortes', 'ingles', 'sabia', 'perdida', 'pago', 'llego', 'hablo', 'canto', 'baile', 'esta', 'entre', 'ultimo', 'domino']);
['ingles'].forEach((w) => KNOWN_PLAIN.delete(w)); // "ingles" (groins) is almost always meant as "inglés"

let accentMap = null;
function getAccentMap() {
  if (accentMap) return accentMap;
  accentMap = new Map();
  const add = (form) => {
    if (!/[áéíóú]/.test(form)) return;
    const k = stripAccents(form);
    const s = accentMap.get(k) || new Set(); s.add(form); accentMap.set(k, s);
  };
  for (const form of reverseIndex().keys()) add(form);
  for (const w of TILDE_WORDS) add(w.toLowerCase());
  ['también', 'después', 'además', 'aquí', 'allí', 'allá', 'así', 'quizás', 'jamás', 'detrás', 'atrás', 'adiós', 'según', 'próximo', 'próxima', 'último', 'última',
    'música', 'teléfono', 'rápido', 'rápida', 'fácil', 'difícil', 'inglés', 'francés', 'alemán', 'japonés', 'portugués', 'irlandés', 'escocés', 'galés', 'holandés',
    'médico', 'médica', 'sábado', 'miércoles', 'número', 'página', 'película', 'público', 'práctica', 'económico', 'político', 'política', 'básico', 'típico',
    'único', 'única', 'café', 'menú', 'sofá', 'bebé', 'mamá', 'papá', 'país', 'día', 'días', 'compañía', 'policía', 'energía', 'tecnología', 'economía',
    'geografía', 'fotografía', 'biología', 'química', 'física', 'matemáticas', 'teléfono', 'móvil', 'cómodo', 'cómoda', 'lámpara', 'árbol', 'lápiz', 'débil',
    'útil', 'inútil', 'fútbol', 'césped', 'azúcar', 'carácter', 'exámenes', 'jóvenes', 'imágenes', 'ciudad', 'vehículo', 'artículo', 'capítulo', 'título',
    'espectáculo', 'océano', 'pájaro', 'plátano', 'sílaba', 'brújula', 'gramática', 'fantástico', 'romántico', 'histórico', 'científico', 'pacífico', 'tráfico',
    'éxito', 'época', 'métodos', 'método', 'periódico', 'término', 'kilómetro', 'cámara', 'América', 'África', 'Europa', 'México', 'Perú', 'Panamá', 'Canadá',
    'Bogotá', 'Málaga', 'Córdoba', 'Cádiz', 'León', 'Mónica', 'José', 'María', 'Jesús', 'Andrés', 'Tomás', 'Martín', 'Ramón', 'Ángel', 'Óscar', 'Raúl'].forEach((w) => add(w.toLowerCase()));
  return accentMap;
}

const R = (re, msg, fix, extra = {}) => ({ re, msg, fix, ...extra });
const PERSON_ESTAR = { soy: 'estoy', eres: 'estás', es: 'está', somos: 'estamos', sois: 'estáis', son: 'están', era: 'estaba', fue: 'estuvo' };
const PERSON_SER = { estoy: 'soy', estás: 'eres', está: 'es', estamos: 'somos', estáis: 'sois', están: 'son' };
const PERSON_TENER = { soy: 'tengo', eres: 'tienes', es: 'tiene', somos: 'tenemos', sois: 'tenéis', son: 'tienen' };
const keepCase = (orig, rep) => (orig[0] === orig[0].toUpperCase() && orig[0] !== orig[0].toLowerCase() ? rep[0].toUpperCase() + rep.slice(1) : rep);

// Pattern rules: { re (global), msg, hint, fix(match…) → replacement for the whole match, topic, cat, sev }
const RULES = [
  R(/\b([Aa]) el\b/g, '“a + el” contracts to “al”.', (m, a) => (a === 'A' ? 'Al' : 'al'), { topic: 'articulos', cat: 'article', hint: 'Two little words here merge into one.' }),
  R(/\b([Dd])e el\b/g, '“de + el” contracts to “del”.', (m, d) => (d === 'D' ? 'Del' : 'del'), { topic: 'articulos', cat: 'article', hint: 'Two little words here merge into one.' }),
  R(/\b(la|una|esta|esa|aquella|La|Una|Esta|Esa) (problema|tema|sistema|idioma|programa|clima|mapa|día|planeta|drama|poema|dilema|esquema|sofá)\b/g,
    'This noun is masculine (Greek -ma words, el día, el mapa…).', (m, art, n) => `${keepCase(art, { la: 'el', una: 'un', esta: 'este', esa: 'ese', aquella: 'aquel' }[art.toLowerCase()])} ${n}`, { topic: 'articulos', cat: 'agreement', hint: 'Check the gender of the noun.' }),
  R(/\b(el|un|este|ese|El|Un|Este|Ese) (mano|foto|moto|radio|gente|ciudad|canción|libertad|costumbre|nariz|clase|leche|carne|noche|calle|parte|tarde)\b/g,
    'This noun is feminine.', (m, art, n) => `${keepCase(art, { el: 'la', un: 'una', este: 'esta', ese: 'esa' }[art.toLowerCase()])} ${n}`, { topic: 'articulos', cat: 'agreement', hint: 'Check the gender of the noun.' }),
  R(/\b(la|una|La|Una) (agua|águila|aula|hambre|área|arma|alma|hacha)\b/g, 'Feminine nouns starting with stressed a- take el/un in the singular: el agua, un aula.', (m, art, n) => `${keepCase(art, art.toLowerCase() === 'la' ? 'el' : 'un')} ${n}`, { topic: 'articulos', cat: 'article', hint: 'Stressed a- at the start of this feminine noun changes the article.' }),
  R(/\bla gente (son|están|tienen|hacen|dicen|piensan|creen|van|quieren|pueden|viven)\b/gi, '“La gente” is singular in Spanish: la gente es, la gente dice.', (m, v) => `la gente ${{ son: 'es', están: 'está', tienen: 'tiene', hacen: 'hace', dicen: 'dice', piensan: 'piensa', creen: 'cree', van: 'va', quieren: 'quiere', pueden: 'puede', viven: 'vive' }[v.toLowerCase()]}`, { topic: 'plurales', cat: 'agreement', hint: 'Is “gente” singular or plural in Spanish?' }),
  R(/\b[Yy]o gust(o|a)\b/g, 'Gustar works backwards: “me gusta” (it pleases me), not “yo gusto”.', () => 'me gusta', { topic: 'gustar', cat: 'verb-form', hint: 'Who is the subject of gustar?' }),
  R(/\b(me|te|le|nos|os|les) gusta (los|las|mis|tus|sus|estos|estas|esos|esas|muchos|muchas)\b/gi, 'Plural subject → gustan.', (m, p, d) => `${p} gustan ${d}`, { topic: 'gustar', cat: 'agreement', hint: 'The thing liked is plural.' }),
  R(/\b(soy|eres|es|somos|sois|son|era|fue) (cansad[oa]s?|enferm[oa]s?|enfadad[oa]s?|preocupad[oa]s?|ocupad[oa]s?|sentad[oa]s?|content[oa]s?|muert[oa]s?|rot[oa]s?|embarazadas?|resfriad[oa]s?|mojad[oa]s?)\b/gi,
    'Temporary states and results take estar.', (m, v, adj) => `${keepCase(v, PERSON_ESTAR[v.toLowerCase()])} ${adj}`, { topic: 'ser-estar-1', cat: 'ser-estar', hint: 'Is this a characteristic or a state?' }),
  R(/\b(estoy|estás|está|estamos|estáis|están) (profesor|profesora|estudiante|médico|médica|ingeniero|ingeniera|abogado|abogada|enfermero|enfermera|camarero|camarera|español|española|inglés|inglesa|americano|americana|alemán|alemana|francés|francesa)(?![\wáéíóúñ])/gi,
    'Profession, nationality and origin take ser.', (m, v, x) => `${keepCase(v, PERSON_SER[v.toLowerCase()])} ${x}`, { topic: 'ser-estar-1', cat: 'ser-estar', hint: 'Identity/origin or a state?' }),
  R(/\b(soy|eres|es|somos|sois|son) de acuerdo\b/gi, '“To agree” is estar de acuerdo.', (m, v) => `${keepCase(v, PERSON_ESTAR[v.toLowerCase()])} de acuerdo`, { topic: 'ser-estar-1', cat: 'ser-estar', hint: 'Which “to be” is used in this fixed expression?' }),
  R(/\b(soy|eres|es|somos|sois|son) (\d+|dos|tres|cuatro|cinco|seis|siete|ocho|nueve|diez|once|doce|trece|catorce|quince|dieciséis|diecisiete|dieciocho|diecinueve|veinte|veinti\w+|treinta|cuarenta|cincuenta|sesenta|setenta|ochenta|noventa)( y \w+)? años\b/gi,
    'Age uses tener: tengo 20 años.', (m, v, n, y = '') => `${keepCase(v, PERSON_TENER[v.toLowerCase()])} ${n}${y} años`, { topic: 'presente-yo', cat: 'word-choice', hint: 'Spanish doesn’t “be” an age.' }),
  R(/\bhay (el|la|los|las)\b/gi, '“Hay” doesn’t combine with el/la: use hay + un/una/number, or está(n) + el/la.', null, { topic: 'hay-estar', cat: 'article', hint: 'hay introduces something new; está locates something known.' }),
  R(/\b(le|les) (lo|la|los|las)\b/gi, 'Before lo/la/los/las, le/les becomes se: se lo di.', (m, p, d) => `${keepCase(p, 'se')} ${d}`, { topic: 'oi-pronombres', cat: 'pronoun', hint: 'Two pronouns starting with l- can’t go together.' }),
  R(/\b(mas) (mejor|peor|grande|pequeño|mayor|menor)\b/gi, null, null, { skip: true }),
  R(/\bmás (mejor|peor|mayor|menor)\b/gi, '“Mejor/peor/mayor/menor” are already comparatives: don’t add más.', (m, w) => w, { topic: 'comparativos', cat: 'word-choice', hint: 'This comparative is irregular.' }),
  R(/\bmuy mucho\b/gi, 'Say “muchísimo” (or just “mucho”).', () => 'muchísimo', { topic: 'comparativos', cat: 'word-choice', hint: 'muy can’t modify mucho.' }),
  R(/\b(un|una) (otro|otra|otros|otras)\b/gi, 'No article before “otro”: otro libro, otra vez.', (m, a, o) => o, { topic: 'articulos', cat: 'article', hint: 'English “another” = one word in Spanish.' }),
  R(/\b(depende|depender|dependen|dependía) en\b/gi, 'depender de.', (m, v) => `${v} de`, { topic: 'preposiciones', cat: 'preposition', hint: 'Which preposition goes with depender?' }),
  R(/\b(soñ\w*|sueñ\w*) de\b/gi, 'soñar con.', (m, v) => `${v} con`, { topic: 'preposiciones', cat: 'preposition', hint: 'Which preposition goes with soñar?' }),
  R(/\b(cas[aéoó]\w*|casad[oa]s?) a\b/gi, 'casarse con.', (m, v) => `${v} con`, { topic: 'preposiciones', cat: 'preposition', hint: 'Which preposition goes with casarse?' }),
  R(/\b(enamorad[oa]s?|enamor\w+) con\b/gi, 'enamorarse de.', (m, v) => `${v} de`, { topic: 'preposiciones', cat: 'preposition', hint: 'Which preposition goes with enamorarse?' }),
  R(/\bconsiste de\b/gi, 'consistir en.', () => 'consiste en', { topic: 'preposiciones', cat: 'preposition', hint: 'Which preposition goes with consistir?' }),
  R(/\binteresad[oa]s? de\b/gi, 'interesado en.', (m) => m.replace(/ de$/i, ' en'), { topic: 'preposiciones', cat: 'preposition', hint: 'Which preposition goes with interesado?' }),
  R(/\ba pesar que\b/gi, 'a pesar de que.', () => 'a pesar de que', { topic: 'subj-concesivo', cat: 'preposition', hint: 'A small word is missing.' }),
  R(/\b(tomar|toma|tomó|tomará|tomaba|tomaron|tomará) lugar\b/gi, 'Calque of “take place”: use tener lugar.', (m) => m.replace(/^\S+/, (t) => keepCase(t, { tomar: 'tener', toma: 'tiene', tomó: 'tuvo', tomará: 'tendrá', tomaba: 'tenía', tomaron: 'tuvieron' }[t.toLowerCase()] || 'tener')), { cat: 'word-choice', hint: 'English calque.' }),
  R(/\b(hace|hacer|hacía|hizo) sentido\b/gi, 'Calque of “make sense”: use tener sentido.', (m, v) => `${{ hace: 'tiene', hacer: 'tener', hacía: 'tenía', hizo: 'tuvo' }[v.toLowerCase()]} sentido`, { cat: 'word-choice', hint: 'English calque.' }),
  R(/\baplic\w* (para|a) (un |el |este |ese )?(trabajo|puesto|empleo|beca)\b/gi, '“Apply for a job” = solicitar un trabajo / presentarse a un puesto.', null, { cat: 'word-choice', hint: 'False friend.' }),
  R(/\b(realic[eé]|realizó|realizaste|realizamos|realizar|realizo) que\b/gi, '“Realizar” means to carry out. “Realise” = darse cuenta de que.', null, { cat: 'word-choice', hint: 'False friend.' }),
  R(/\b(atend\w+|atiend\w+) (a )?(la |una |las )?(clase|clases|reunión|reuniones|universidad|escuela|conferencia|boda|fiesta)\b/gi, '“Attend” an event = asistir a. “Atender” = to serve, look after.', null, { cat: 'word-choice', hint: 'False friend.' }),
  R(/\b(tener|tengo|tuve|tuvimos|tuvieron|tenemos|tuviste) un (buen|gran) tiempo\b/gi, 'Calque of “have a good time”: pasarlo bien.', null, { cat: 'word-choice', hint: 'English calque.' }),
  R(/\b(estoy|estaba|estoy muy|estaba muy|me siento) excitad[oa]\b/gi, '“Excitado” has a sexual meaning. For excited use emocionado/a or ilusionado/a.', null, { cat: 'word-choice', hint: 'False friend!' }),
  R(/\b(estoy|estaba|me sentí|me siento|estuve) (muy )?embarazado\b/gi, '“Embarazado/a” means pregnant. “Embarrassed” = avergonzado/a, me dio vergüenza.', null, { cat: 'word-choice', hint: 'False friend!' }),
  R(/\bintroduc\w* a (mi|tu|su|mis|tus|sus|nuestro|nuestra)\b/gi, 'To introduce a person = presentar (introducir = to insert, bring in).', null, { cat: 'word-choice', hint: 'False friend.' }),
  R(/\bme llamo es\b/gi, 'Either “me llamo…” or “mi nombre es…”.', () => 'me llamo', { cat: 'word-choice', hint: 'Two structures got mixed.' }),
  R(/\b[Yy] (?=h?i[^aeiouáéíóú])/g, 'Before a word starting with the sound i, “y” becomes “e”: padres e hijos.', (m) => (m[0] === 'Y' ? 'E ' : 'e '), { cat: 'spelling-accent', hint: 'The conjunction changes before this sound.' }),
  R(/\b[Oo] (?=h?o)/g, 'Before a word starting with o-, “o” becomes “u”: siete u ocho.', (m) => (m[0] === 'O' ? 'U ' : 'u '), { cat: 'spelling-accent', hint: 'The conjunction changes before this sound.' }),
  R(/¿\s*(Que|que|Como|como|Donde|donde|Cuando|cuando|Cuanto|cuanto|Cuanta|cuanta|Cuantos|cuantos|Cuantas|cuantas|Quien|quien|Quienes|quienes|Cual|cual|Cuales|cuales|Adonde|adonde)\b/g,
    'Question words carry a written accent: ¿qué?, ¿cómo?, ¿dónde?…', (m, w) => m.replace(w, ({ que: 'qué', como: 'cómo', donde: 'dónde', cuando: 'cuándo', cuanto: 'cuánto', cuanta: 'cuánta', cuantos: 'cuántos', cuantas: 'cuántas', quien: 'quién', quienes: 'quiénes', cual: 'cuál', cuales: 'cuáles', adonde: 'adónde' }[w.toLowerCase()]).replace(/^./, (c) => (w[0] === w[0].toUpperCase() ? c.toUpperCase() : c))), { topic: 'tildes', cat: 'spelling-accent', hint: 'Question words have a special mark.' }),
  R(/¿\s*[Pp]orque\b/g, 'In questions “why” is two words with an accent: ¿por qué?', (m) => m.replace(/[Pp]orque/, (w) => (w[0] === 'P' ? 'Por qué' : 'por qué')), { topic: 'preguntas', cat: 'spelling-accent', hint: 'why ≠ because.' }),
  R(/\b(\w+)([cs])ion\b/g, 'Words ending in -ción / -sión carry a tilde.', (m, a, b) => `${a}${b}ión`, { topic: 'tildes', cat: 'spelling-accent', hint: 'Aguda ending in -n…' }),
  R(/(?<=[a-záéíóúñ,;:]\s)(Lunes|Martes|Miércoles|Jueves|Viernes|Sábado|Domingo|Enero|Febrero|Marzo|Abril|Junio|Julio|Agosto|Septiembre|Setiembre|Octubre|Noviembre|Diciembre|Inglés|Español|Francés|Alemán|Italiano|Chino|Japonés|Portugués|Ruso|Inglesa|Española|Francesa|Alemana|Italiana|Americano|Americana|Mexicano|Mexicana|Argentino|Argentina|Colombiano|Colombiana)\b/g,
    'Days, months, languages and nationalities are written in lower case in Spanish.', (m) => m.toLowerCase(), { cat: 'punctuation', sev: 'style', hint: 'Capital letters work differently in Spanish.' }),
  R(/ {2,}/g, 'Double space.', () => ' ', { cat: 'punctuation', sev: 'style', hint: 'Spacing.' }),
  R(/ +([,.;:!?])/g, 'No space before punctuation.', (m, p) => p, { cat: 'punctuation', sev: 'style', hint: 'Spacing.' }),
];

const SKIP_TOKENS = new Set(['no', 'me', 'te', 'se', 'nos', 'os', 'lo', 'la', 'le', 'les', 'los', 'las', 'tú', 'él', 'ella', 'usted', 'ustedes', 'nosotros', 'nosotras', 'ellos', 'ellas', 'yo', 'vosotros', 'ya', 'nunca', 'siempre', 'también', 'todos', 'todo', 'mi', 'tu', 'su', 'mis', 'tus', 'sus', 'el', 'los', 'mucho', 'bien', 'más']);
const PRESENT_TRIGGERS = ['quiero que', 'quieres que', 'quiere que', 'queremos que', 'quieren que', 'espero que', 'esperamos que', 'ojalá', 'ojalá que', 'para que', 'antes de que', 'sin que', 'a menos que', 'a no ser que', 'con tal de que', 'en caso de que',
  'es importante que', 'es necesario que', 'es mejor que', 'es posible que', 'es probable que', 'es imposible que', 'es normal que', 'es una pena que', 'es increíble que', 'es raro que', 'me alegra que', 'me alegro de que', 'me molesta que',
  'me encanta que', 'no creo que', 'no pienso que', 'no me parece que', 'dudo que', 'te pido que', 'le pido que', 'te recomiendo que', 'te aconsejo que', 'les recomiendo que', 'prefiero que', 'necesito que', 'hace falta que', 'puede que', 'aunque no',
  'tal vez', 'quizás', 'deseo que', 'sugiero que', 'exijo que', 'permite que', 'prohíbe que', 'no es que', 'el hecho de que'];
const PAST_TRIGGERS = ['quería que', 'quise que', 'quisiera que', 'esperaba que', 'me pidió que', 'te pedí que', 'le pedí que', 'era importante que', 'era necesario que', 'fue una pena que', 'como si', 'me alegró que', 'no creía que', 'dudaba que', 'prefería que', 'sería mejor que', 'me gustaría que', 'te recomendé que'];
const OPTIONAL = new Set(['tal vez', 'quizás', 'aunque no', 'el hecho de que']);

function nextVerb(toks, i) {
  for (let k = i; k < Math.min(toks.length, i + 4); k++) {
    const t = toks[k];
    if (SKIP_TOKENS.has(t.lw)) continue;
    const rs = verbReadings(t.lw);
    return rs.length ? { tok: t, rs } : null;
  }
  return null;
}

function verbRules(text) {
  const issues = [];
  const toks = tokens(text);
  const low = text.toLowerCase();
  // subjunctive triggers
  const check = (triggers, want) => {
    for (const trig of triggers) {
      let idx = -1;
      while ((idx = low.indexOf(trig, idx + 1)) >= 0) {
        if (idx > 0 && /[a-záéíóúñ]/.test(low[idx - 1])) continue;
        const endPos = idx + trig.length;
        const ti = toks.findIndex((t) => t.start >= endPos);
        if (ti < 0) continue;
        const v = nextVerb(toks, ti);
        if (!v) continue;
        const tenses = new Set(v.rs.map((r) => r.tense));
        if (tenses.has('psubj') || tenses.has('isubj') || tenses.has('pp') || tenses.has('ger')) continue;
        const ind = v.rs.find((r) => ['pres', 'fut', 'pret', 'impf', 'cond'].includes(r.tense));
        if (!ind) continue;
        let fix = null;
        try { fix = conjugate(ind.inf, want)[ind.person]; } catch { /* ignore */ }
        if (!fix || fix === v.tok.lw) continue;
        issues.push({ start: v.tok.start, end: v.tok.end, text: v.tok.w, fix: keepCase(v.tok.w, fix.replace(/^(me|te|se|nos|os) /, '')), source: 'local',
          msg: OPTIONAL.has(trig) ? `After “${trig}” the subjunctive is normal when you express doubt (${fix}).` : `“${trig}” requires the ${want === 'psubj' ? 'present' : 'imperfect'} subjunctive.`,
          hint: `What mood follows “${trig}”?`, topic: want === 'isubj' ? 'subj-imperfecto' : /creo|pienso|dudo|parece|posible|probable|puede|tal vez|quizás/.test(trig) ? 'subj-duda' : /para que|antes de que|sin que|menos que|no ser que|tal de que|caso de que/.test(trig) ? 'subj-temporal' : 'subj-deseo',
          cat: 'mood', sev: OPTIONAL.has(trig) ? 'style' : 'error' });
      }
    }
  };
  check(PRESENT_TRIGGERS, 'psubj');
  check(PAST_TRIGGERS, 'isubj');
  toks.forEach((t, i) => {
    // cuando + future → present subjunctive
    if (t.lw === 'cuando' && text[t.start - 1] !== '¿' && !/¿[^?]*$/.test(text.slice(Math.max(0, t.start - 40), t.start))) {
      const v = nextVerb(toks, i + 1);
      const fut = v?.rs.find((r) => r.tense === 'fut');
      if (v && fut && !v.rs.some((r) => r.tense !== 'fut')) {
        const fix = conjugate(fut.inf, 'psubj')[fut.person];
        issues.push({ start: v.tok.start, end: v.tok.end, text: v.tok.w, fix, source: 'local', msg: 'After “cuando” referring to the future, use the present subjunctive (cuando llegues), never the future.', hint: 'Which mood after cuando for a future event?', topic: 'subj-temporal', cat: 'mood' });
      }
    }
    // si + future / conditional / present subjunctive
    if (t.lw === 'si' && text[t.start + 2] !== '?') {
      const v = nextVerb(toks, i + 1);
      if (!v) return;
      const only = (k) => v.rs.every((r) => r.tense === k);
      const r0 = v.rs[0];
      if (only('fut')) issues.push({ start: v.tok.start, end: v.tok.end, text: v.tok.w, fix: conjugate(r0.inf, 'pres')[r0.person], source: 'local', msg: 'Never the future after “si” (if): si tienes tiempo, … ', hint: 'Which tense after si for a real condition?', topic: 'si-condicional', cat: 'tense-aspect' });
      else if (only('cond')) issues.push({ start: v.tok.start, end: v.tok.end, text: v.tok.w, fix: conjugate(r0.inf, 'isubj')[r0.person], source: 'local', msg: 'Never the conditional after “si”: use the imperfect subjunctive (si tuviera…).', hint: 'Which form after si for a hypothesis?', topic: 'si-condicional', cat: 'mood' });
      else if (only('psubj')) issues.push({ start: v.tok.start, end: v.tok.end, text: v.tok.w, fix: `${conjugate(r0.inf, 'pres')[r0.person]} / ${conjugate(r0.inf, 'isubj')[r0.person]}`, source: 'local', msg: '“Si” (if) is never followed by the present subjunctive: present indicative (real) or imperfect subjunctive (hypothetical).', hint: 'Which forms can follow si?', topic: 'si-condicional', cat: 'mood' });
    }
    // preposition + gerund → infinitive
    if (['para', 'sin'].includes(t.lw) || (t.lw === 'de' && ['antes', 'después', 'vez', 'pesar'].includes(toks[i - 1]?.lw))) {
      const n = toks[i + 1];
      const ger = n && verbReadings(n.lw).find((r) => r.tense === 'ger');
      if (ger) issues.push({ start: n.start, end: n.end, text: n.w, fix: ger.inf, source: 'local', msg: 'After a preposition Spanish uses the infinitive, not the gerund: antes de salir, para aprender.', hint: 'Which verb form follows a preposition?', topic: 'preposiciones', cat: 'verb-form' });
    }
    // ir + infinitive without a
    if (/^(voy|vas|va|vamos|vais|van|iba|ibas|íbamos|iban)$/.test(t.lw) && toks[i + 1] && isInfinitive(toks[i + 1].lw) && text.slice(t.end, toks[i + 1].start).trim() === '') {
      issues.push({ start: t.start, end: toks[i + 1].end, text: text.slice(t.start, toks[i + 1].end), fix: `${t.w} a ${toks[i + 1].w}`, source: 'local', msg: 'ir + a + infinitive: voy a comer.', hint: 'A small word is missing.', topic: 'ir-a', cat: 'preposition' });
    }
    // tener + infinitive without que
    if (/^(tengo|tienes|tiene|tenemos|tenéis|tienen|tenía|tenías|teníamos|tenían|tuve|tuvo|tuvimos|tuvieron)$/.test(t.lw) && toks[i + 1] && isInfinitive(toks[i + 1].lw) && text.slice(t.end, toks[i + 1].start).trim() === '') {
      issues.push({ start: t.start, end: toks[i + 1].end, text: text.slice(t.start, toks[i + 1].end), fix: `${t.w} que ${toks[i + 1].w}`, source: 'local', msg: 'Obligation: tener que + infinitive.', hint: 'A small word is missing.', topic: 'ir-a', cat: 'verb-form' });
    }
    // modal + a + infinitive
    if (/^(puedo|puedes|puede|podemos|pueden|quiero|quieres|quiere|queremos|quieren|debo|debes|debe|debemos|deben|necesito|necesitas|necesita|sé|sabes|sabe)$/.test(t.lw) && toks[i + 1]?.lw === 'a' && toks[i + 2] && isInfinitive(toks[i + 2].lw)) {
      issues.push({ start: t.start, end: toks[i + 2].end, text: text.slice(t.start, toks[i + 2].end), fix: `${t.w} ${toks[i + 2].w}`, source: 'local', msg: `“${t.lw}” is followed directly by the infinitive (no “a”).`, hint: 'There is an extra word.', topic: 'ir-a', cat: 'preposition' });
    }
    // missing accents (verb forms and common words)
    if (!/[áéíóú]/.test(t.lw) && !KNOWN_PLAIN.has(t.lw) && !reverseIndex().has(t.lw) && t.lw.length > 1) {
      const cands = getAccentMap().get(t.lw);
      if (cands && cands.size === 1) {
        const fix = keepCase(t.w, [...cands][0]);
        issues.push({ start: t.start, end: t.end, text: t.w, fix, source: 'local', msg: 'Missing written accent.', hint: 'Check the tilde.', topic: 'tildes', cat: 'spelling-accent' });
      }
    }
    if (t.lw === 'mas' && toks[i + 1] && !/^[,;]/.test(text.slice(t.end).trim())) {
      issues.push({ start: t.start, end: t.end, text: t.w, fix: keepCase(t.w, 'más'), source: 'local', msg: '“más” (more) has a tilde; “mas” without one is a literary word for “but”.', hint: 'more or but?', topic: 'tildes', cat: 'spelling-accent', sev: 'style' });
    }
  });
  // opening question/exclamation marks
  const sentRe = /[^.!?…\n]*[?!]/g;
  let m;
  while ((m = sentRe.exec(text))) {
    const s = m[0];
    const trimmedStart = m.index + (s.length - s.trimStart().length);
    if (s.trim().length < 2) continue;
    const firstWord = (s.trim().match(/^\S+/) || [''])[0];
    if (s.endsWith('?') && !s.includes('¿')) issues.push({ start: trimmedStart, end: trimmedStart + firstWord.length, text: firstWord, fix: null, source: 'local', msg: 'Spanish questions open with ¿ as well as closing with ?.', hint: 'Something is missing at the start of the question.', cat: 'punctuation', sev: 'style', insert: '¿' });
    if (s.endsWith('!') && !s.includes('¡')) issues.push({ start: trimmedStart, end: trimmedStart + firstWord.length, text: firstWord, fix: null, source: 'local', msg: 'Exclamations open with ¡ as well as closing with !.', hint: 'Something is missing at the start of the exclamation.', cat: 'punctuation', sev: 'style', insert: '¡' });
  }
  return issues;
}

export function localCheck(text) {
  const issues = [];
  for (const rule of RULES) {
    if (rule.skip) continue;
    rule.re.lastIndex = 0;
    let m;
    while ((m = rule.re.exec(text))) {
      if (!m[0]) { rule.re.lastIndex++; continue; }
      const fix = rule.fix ? rule.fix(...m) : null;
      if (fix != null && fix === m[0]) continue;
      issues.push({ start: m.index, end: m.index + m[0].length, text: m[0], fix, msg: rule.msg, hint: rule.hint, topic: rule.topic, cat: rule.cat, sev: rule.sev || 'error', source: 'local' });
    }
  }
  issues.push(...verbRules(text));
  return dedupe(issues);
}

// A fix that only adds/changes written accents is a note, not a mistake.
export const isAccentOnly = (is) => is.fix != null && is.fix !== is.text && stripAccents(is.fix.toLowerCase()) === stripAccents(is.text.toLowerCase());
function markAccentNotes(issues) {
  for (const is of issues) if (isAccentOnly(is)) { is.sev = 'note'; is.hint = `Accent note: write “${is.fix}”.`; }
  return issues;
}

function dedupe(issues) {
  issues.sort((a, b) => a.start - b.start || (b.end - b.start) - (a.end - a.start));
  const out = [];
  for (const is of markAccentNotes(issues)) {
    is.sev ||= 'error';
    if (out.some((o) => o.start === is.start && o.end === is.end && (o.msg === is.msg || (o.fix && o.fix === is.fix)))) continue;
    out.push(is);
  }
  return out;
}

// ---- LanguageTool -------------------------------------------------------------------------
const LT_CAT = { TYPOS: 'spelling-accent', GRAMMAR: 'other', AGREEMENT_NOUNS: 'agreement', AGREEMENT_VERBS: 'agreement', CONFUSED_WORDS: 'word-choice', TYPOGRAPHY: 'punctuation', PUNCTUATION: 'punctuation', STYLE: 'word-choice', REDUNDANCY: 'word-choice', DIACRITICS: 'spelling-accent', CASING: 'punctuation' };
export async function languageToolCheck(text) {
  const body = new URLSearchParams({ text, language: 'es', motherTongue: 'en' });
  const res = await fetch('https://api.languagetool.org/v2/check', { method: 'POST', body });
  if (res.status === 429) throw new Error('LanguageTool rate limit reached (20 checks/minute). Wait a moment.');
  if (!res.ok) throw new Error(`LanguageTool error ${res.status}`);
  const data = await res.json();
  return markAccentNotes(data.matches.map((m) => ({
    start: m.offset, end: m.offset + m.length, text: text.slice(m.offset, m.offset + m.length),
    fix: m.replacements?.[0]?.value ?? null, alts: (m.replacements || []).slice(0, 3).map((r) => r.value),
    msg: m.message, hint: m.shortMessage || m.rule?.category?.name || 'Check this.', cat: LT_CAT[m.rule?.category?.id] || 'other',
    sev: m.rule?.issueType === 'misspelling' ? 'typo' : ['style', 'typographical', 'whitespace', 'locale-violation'].includes(m.rule?.issueType) ? 'style' : 'error',
    source: 'LanguageTool', rule: m.rule?.id,
  })));
}

export function mergeIssues(local, remote) {
  const out = [...local];
  for (const r of remote) {
    const dup = local.some((l) => l.start < r.end && r.start < l.end && (l.fix === r.fix || l.cat === r.cat || (l.start === r.start && l.end === r.end)));
    if (!dup) out.push(r);
  }
  return out.sort((a, b) => a.start - b.start);
}

export const CAT_TOPIC = { 'ser-estar': 'ser-estar-1', 'por-para': 'por-para', mood: 'subj-deseo', 'tense-aspect': 'indef-imperf', agreement: 'plurales', article: 'articulos', preposition: 'preposiciones', pronoun: 'oi-pronombres', 'spelling-accent': 'tildes', 'verb-form': 'presente-irr', 'word-order': 'od-pronombres' };
