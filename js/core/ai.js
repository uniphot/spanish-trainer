// Optional AI tutor (Claude). Only used when the learner pastes their own Anthropic API key in
// Settings; the key stays in this browser and requests go straight to the Anthropic API.
import { store } from './store.js';

const SDK_URL = 'https://cdn.jsdelivr.net/npm/@anthropic-ai/sdk@0.132.0/+esm';
export const AI_MODELS = [
  ['claude-opus-5-5', 'Claude Opus 5.5 — best feedback (default)'],
  ['claude-sonnet-5-5', 'Claude Sonnet 5.5 — faster, cheaper'],
  ['claude-haiku-5-5', 'Claude Haiku 5.5 — fastest, cheapest'],
];

export const aiAvailable = () => !!store.state.settings.aiKey;

let clientPromise = null, clientKey = null;
async function client() {
  const key = store.state.settings.aiKey;
  if (!key) throw new Error('Add your Anthropic API key in Settings to use the AI tutor.');
  if (!clientPromise || clientKey !== key) {
    clientKey = key;
    clientPromise = import(SDK_URL).then((m) => new m.default({ apiKey: key, dangerouslyAllowBrowser: true, maxRetries: 2 }));
  }
  return clientPromise;
}

const LEVEL_NOTE = (level) => `The learner's estimated CEFR level is ${level || 'unknown (assume B1)'}.`;

// One request with structured JSON output. Refusals fall back server-side where supported.
// Returns the parsed JSON plus the raw content blocks (replayed unchanged in multi-turn chats,
// so the history stays append-only and earlier thinking blocks remain valid).
async function ask({ system, messages, schema, effort = 'medium', maxTokens = 6000 }) {
  const c = await client();
  const model = store.state.settings.aiModel || 'claude-opus-5-5';
  const params = {
    model,
    max_tokens: maxTokens,
    system,
    messages,
    output_config: { effort, format: { type: 'json_schema', schema } },
  };
  let res;
  if (model === 'claude-haiku-5-5') {
    res = await c.messages.create(params);
  } else {
    res = await c.beta.messages.create({ ...params, betas: ['server-side-fallback-2026-07-01'], fallbacks: 'default' });
  }
  if (res.stop_reason === 'refusal') throw new Error('The AI declined this request. Try rephrasing your text.');
  if (res.stop_reason === 'max_tokens') throw new Error('The AI response was cut off. Try a shorter text.');
  const text = res.content.filter((b) => b.type === 'text').map((b) => b.text).join('');
  try { return { data: JSON.parse(text), content: res.content }; } catch { throw new Error('Could not read the AI response. Please try again.'); }
}
const askJSON = async (opts) => (await ask(opts)).data;

export function friendlyError(e) {
  const status = e?.status;
  if (status === 401) return 'Your API key was rejected. Check it in Settings.';
  if (status === 429) return 'Rate limit reached — wait a moment and try again.';
  if (status === 529 || status >= 500) return 'The AI service is busy. Try again shortly.';
  if (e?.message?.includes('Failed to fetch')) return 'Network error — check your connection.';
  return e?.message || String(e);
}

const str = { type: 'string' };
const obj = (properties) => ({ type: 'object', properties, required: Object.keys(properties), additionalProperties: false });
const arr = (items) => ({ type: 'array', items });

// ---- Writing feedback -----------------------------------------------------------------
const ERROR_ITEM = obj({
  original: str, correction: str,
  category: { type: 'string', enum: ['agreement', 'verb-form', 'tense-aspect', 'mood', 'ser-estar', 'por-para', 'preposition', 'pronoun', 'article', 'word-choice', 'spelling-accent', 'word-order', 'register', 'punctuation', 'other'] },
  hint: str, explanation: str,
});
const WRITING_SCHEMA = obj({
  cefr_estimate: { type: 'string', enum: ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'] },
  summary: str,
  strengths: arr(str),
  errors: arr(ERROR_ITEM),
  task_fulfilment: str,
  reformulation: str,
  next_steps: arr(str),
});

export async function writingFeedback({ text, level, task }) {
  return askJSON({
    effort: 'medium',
    system: `You are an expert teacher of Spanish as a foreign language giving written corrective feedback. ${LEVEL_NOTE(level)}
Feedback principles (from written corrective feedback research):
- Be comprehensive but focus explanations on patterns: list every genuine error once, quoting the exact original fragment (copy it verbatim from the text so it can be highlighted) and its correction.
- For each error give a short "hint" that helps the learner self-correct WITHOUT giving the answer (metalinguistic clue, e.g. "Check the verb: is this a completed action?"), then a one-sentence English "explanation" of the rule.
- Do not flag acceptable regional variants or stylistic preferences as errors.
- "reformulation": rewrite the whole text as a proficient native writer would, keeping the learner's ideas and roughly one CEFR level above theirs, so they can notice the gap.
- "strengths": 2–3 specific things done well. "next_steps": 2–3 concrete priorities. Write summary, hints and explanations in English; corrections and reformulation in Spanish.`,
    messages: [{ role: 'user', content: `Task given to the learner: ${task || 'free writing'}\n\nLearner's text:\n"""\n${text}\n"""` }],
    schema: WRITING_SCHEMA,
  });
}

// ---- Conversation partner -------------------------------------------------------------
const CONVO_SCHEMA = obj({
  reply: str,
  reply_en: str,
  feedback: obj({ has_error: { type: 'boolean' }, hint: str, correction: str, explanation: str }),
  suggestions: arr(str),
});

// history: [{role:'user', content: text}, {role:'assistant', content: <raw blocks>}, …]
// Returns { data, content } — append `content` unchanged as the next assistant turn.
export async function conversationTurn({ scenario, level, history }) {
  return ask({
    effort: 'low',
    maxTokens: 2500,
    system: `You are a friendly native Spanish speaker acting as a conversation partner in this role-play: ${scenario}. ${LEVEL_NOTE(level)}
- Stay in character and keep the conversation going: reply in natural Spanish, 1–3 short sentences, with a question or hook that invites the learner to speak more. Grade your language to be just above the learner's level (comprehensible input).
- Interaction research shows learners benefit from negotiating meaning: if the learner's message is unclear, ask a clarification question in character.
- Separately, in "feedback", evaluate ONLY the learner's last message. If it has a grammar/vocabulary error that matters, set has_error=true, give a "hint" (a prompt that pushes self-repair without the answer, in English), the "correction" (the learner's sentence reformulated correctly, in Spanish) and a one-sentence English "explanation". Ignore missing accents/punctuation from speech transcription. If there is no real error, has_error=false and the other fields are empty strings.
- "reply_en": an English translation of your reply. "suggestions": 2 short things the learner could say next (in Spanish, at their level).`,
    messages: history,
    schema: CONVO_SCHEMA,
  });
}

// ---- Monologue / speaking feedback ------------------------------------------------------
const SPEAKING_SCHEMA = obj({
  summary: str,
  errors: arr(obj({ original: str, correction: str, explanation: str })),
  better_version: str,
  useful_phrases: arr(obj({ es: str, en: str })),
});
export async function speakingFeedback({ transcript, task, level }) {
  return askJSON({
    effort: 'medium',
    system: `You are a Spanish speaking coach. The text is an automatic speech-recognition transcript of a learner's spoken monologue (so ignore punctuation, capitalisation and accent marks). ${LEVEL_NOTE(level)}
Give: a 2-sentence English "summary" (content, fluency, range); up to 8 most important "errors" (original fragment verbatim, correction, short English explanation); a "better_version" of the monologue (natural spoken Spanish, one level above the learner, same ideas, similar length); and 4–6 "useful_phrases" (chunks the learner could have used for this topic).`,
    messages: [{ role: 'user', content: `Topic: ${task}\n\nTranscript:\n"""\n${transcript}\n"""` }],
    schema: SPEAKING_SCHEMA,
  });
}

// ---- Extra grammar exercises ------------------------------------------------------------
const EXERCISE_SCHEMA = obj({
  items: arr(obj({ before: str, answer: str, alternatives: arr(str), after: str, hint: str, explanation: str })),
});
export async function generateExercises({ topicTitle, explanation, level, n = 8, avoid = [] }) {
  return askJSON({
    effort: 'medium',
    system: `You write gap-fill grammar exercises for learners of Spanish. Each item is one natural, meaningful sentence with exactly one gap: "before" + GAP + "after". "answer" is the single best answer; "alternatives" lists other fully correct answers (may be empty). "hint" goes in brackets next to the gap (e.g. the infinitive, or "por/para"). "explanation" is one English sentence explaining why. Vary contexts, persons and vocabulary. Never make the answer ambiguous.`,
    messages: [{ role: 'user', content: `Topic: ${topicTitle} (level ${level}).\nRule summary: ${explanation.slice(0, 1500)}\nWrite ${n} new items. Avoid these sentences: ${avoid.slice(0, 20).join(' | ')}` }],
    schema: EXERCISE_SCHEMA,
  });
}

// ---- Ask a question about an item ---------------------------------------------------------
const EXPLAIN_SCHEMA = obj({ answer: str });
export async function explainItem({ question, context, level }) {
  const r = await askJSON({
    effort: 'low',
    maxTokens: 2000,
    system: `You are a concise, accurate Spanish grammar tutor. ${LEVEL_NOTE(level)} Answer in English in at most 120 words, with 1–2 Spanish examples. Plain text only, no markdown headings.`,
    messages: [{ role: 'user', content: `${context}\n\nMy question: ${question}` }],
    schema: EXPLAIN_SCHEMA,
  });
  return r.answer;
}

// ---- Reading support for news articles ------------------------------------------------------
const NEWS_SCHEMA = obj({
  easy_version: str,
  glossary: arr(obj({ es: str, en: str, note: str })),
  questions: arr(obj({ q: str, options: arr(str), answer: { type: 'integer' }, explanation: str })),
  discussion: str,
});
export async function newsStudy({ title, text, level }) {
  return askJSON({
    effort: 'low',
    maxTokens: 5000,
    system: `You help a learner of Spanish who is preparing a trip to Mexico read authentic Mexican news. ${LEVEL_NOTE(level)}
Return: "easy_version" — a faithful retelling of the article in clear Mexican Spanish at the learner's level (80–150 words, no new facts);
"glossary" — the 8 words or phrases most worth learning from the ORIGINAL text (es exactly as in the text, short English meaning, and "note" for Mexican usage, register or a false friend, otherwise empty);
"questions" — 3 multiple-choice comprehension questions in Spanish about the original (4 options each, "answer" = index of the correct option, short English explanation);
"discussion" — one open question in Spanish inviting the learner's opinion or comparison with their own country.`,
    messages: [{ role: 'user', content: `Title: ${title}\n\nArticle:\n${text.slice(0, 9000)}` }],
    schema: NEWS_SCHEMA,
  });
}
