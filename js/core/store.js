// Local persistence of the learner model. Everything lives in this browser's localStorage;
// Settings → Data lets the learner export/import a JSON backup.
const KEY = 'ele-trainer.v1';

export const today = (d = new Date()) => {
  const z = new Date(d.getTime() - d.getTimezoneOffset() * 60000);
  return z.toISOString().slice(0, 10);
};

function defaults() {
  return {
    version: 1,
    created: Date.now(),
    profile: {
      level: null,          // A1…C2 – from the placement test or self-selected
      levelSource: null,
      skills: {},           // per-skill estimates from the placement test
      variety: 'spain',     // 'spain' (vosotros, distinción) or 'latam'
      dailyMinutes: 30,
      newPerDay: 10,
      goalLevel: 'B2',
      why: '',
    },
    settings: {
      voice: '',            // preferred voiceURI
      rate: 1,
      multiVoice: true,     // rotate voices (high-variability input)
      strictAccents: false,
      retention: 0.9,
      languageTool: true,
      aiKey: '',
      aiModel: 'claude-opus-5-5',
      theme: 'auto',
    },
    placement: [],          // history of placement results
    topics: {},             // grammarTopicId → { hist: [[ts, score]], intro: bool }
    cards: {},              // SRS cards
    newToday: { date: '', count: 0 },
    deckCursor: 0,          // next core-vocabulary item to introduce
    errors: [],             // { ts, source, cat, topic, text, fix }
    log: {},                // date → { min: {input, output, language, fluency}, done: [] }
    writing: [],            // essays with drafts and feedback
    fluency: [],            // 4/3/2 sessions
    listening: {},          // itemId → { score, ts, steps }
    dictation: [],          // { ts, level, acc }
    speaking: [],           // shadowing / pronunciation attempts { ts, kind, score }
    journal: [],            // reflections { ts, text, prompts }
    convo: [],              // AI conversation transcripts
    news: {                 // daily Mexico digest
      date: '', fetched: 0, digest: [], headlines: [], read: {}, ai: {},
      prefs: { groups: ['mexico', 'cdmx', 'viajes', 'cultura', 'comida', 'sociedad', 'ciencia', 'economia'], gentle: true },
    },
  };
}

function merge(base, saved) {
  if (!saved || typeof saved !== 'object') return base;
  for (const k of Object.keys(base)) {
    if (saved[k] === undefined) continue;
    if (base[k] && typeof base[k] === 'object' && !Array.isArray(base[k]) && Object.keys(base[k]).length && !['topics', 'cards', 'log', 'listening'].includes(k)) {
      base[k] = { ...base[k], ...saved[k] };
    } else base[k] = saved[k];
  }
  return base;
}

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    return merge(defaults(), raw ? JSON.parse(raw) : null);
  } catch {
    return defaults();
  }
}

const listeners = new Set();
let saveTimer = null;

export const store = {
  state: load(),
  save() {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => {
      try { localStorage.setItem(KEY, JSON.stringify(this.state)); } catch (e) { console.warn('Save failed', e); }
      listeners.forEach((fn) => fn(this.state));
    }, 150);
  },
  flush() {
    clearTimeout(saveTimer);
    try { localStorage.setItem(KEY, JSON.stringify(this.state)); } catch { /* storage full or blocked */ }
  },
  subscribe(fn) { listeners.add(fn); return () => listeners.delete(fn); },
  export() { return JSON.stringify(this.state, null, 1); },
  import(json) {
    const parsed = JSON.parse(json);
    this.state = merge(defaults(), parsed);
    this.flush();
    listeners.forEach((fn) => fn(this.state));
  },
  reset() { this.state = defaults(); this.flush(); listeners.forEach((fn) => fn(this.state)); },
};
window.addEventListener('beforeunload', () => store.flush());

// ---- Activity log (minutes per strand per day) ----------------------------------------
export const STRANDS = {
  input: { es: 'Input', en: 'Meaning-focused input', color: 'var(--c-input)' },
  output: { es: 'Output', en: 'Meaning-focused output', color: 'var(--c-output)' },
  language: { es: 'Estudio', en: 'Language-focused learning', color: 'var(--c-language)' },
  fluency: { es: 'Fluidez', en: 'Fluency development', color: 'var(--c-fluency)' },
};

export function logMinutes(strand, minutes) {
  if (!STRANDS[strand] || minutes <= 0) return;
  const d = today();
  const day = (store.state.log[d] ||= { min: {}, done: [] });
  day.min[strand] = (day.min[strand] || 0) + minutes;
  store.save();
}
export function logDone(activity) {
  const d = today();
  const day = (store.state.log[d] ||= { min: {}, done: [] });
  if (!day.done.includes(activity)) day.done.push(activity);
  store.save();
}
export function logError(entry) {
  store.state.errors.push({ ts: Date.now(), ...entry });
  if (store.state.errors.length > 800) store.state.errors.splice(0, store.state.errors.length - 800);
  store.save();
}
export function minutesByStrand(days = 7) {
  const out = { input: 0, output: 0, language: 0, fluency: 0 };
  const now = new Date();
  for (let i = 0; i < days; i++) {
    const d = today(new Date(now.getTime() - i * 86400000));
    const day = store.state.log[d];
    if (day) for (const k of Object.keys(out)) out[k] += day.min[k] || 0;
  }
  return out;
}
export function streak() {
  let n = 0;
  const now = new Date();
  for (let i = 0; i < 3650; i++) {
    const d = today(new Date(now.getTime() - i * 86400000));
    const day = store.state.log[d];
    const total = day ? Object.values(day.min).reduce((a, b) => a + b, 0) : 0;
    if (total >= 5) n++;
    else if (i === 0) continue; // today not finished yet
    else break;
  }
  return n;
}
