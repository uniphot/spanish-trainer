// Text-to-speech (multiple voices / accents), speech recognition and microphone recording.
import { store } from './store.js';

const REGION = {
  ES: 'España', MX: 'México', US: 'EE. UU.', AR: 'Argentina', CO: 'Colombia', CL: 'Chile', PE: 'Perú',
  VE: 'Venezuela', CU: 'Cuba', UY: 'Uruguay', PR: 'Puerto Rico', EC: 'Ecuador', GT: 'Guatemala', CR: 'Costa Rica',
  DO: 'Rep. Dominicana', BO: 'Bolivia', PY: 'Paraguay', SV: 'El Salvador', HN: 'Honduras', NI: 'Nicaragua', PA: 'Panamá', '419': 'Latinoamérica',
};
const QUALITY = /(premium|enhanced|neural|natural|google|siri|online)/i;
const NOVELTY = /(eddy|flo|grandma|grandpa|reed|rocko|sandy|shelley|bad news|bells|boing|bubbles|cellos|jester|organ|superstar|trinoids|whisper|wobble|zarvox|albert|bahh|fred|junior|kathy|ralph)/i;

let voicesCache = [];
function refreshVoices() {
  if (!('speechSynthesis' in window)) return [];
  voicesCache = speechSynthesis.getVoices().filter((v) => /^es([-_]|$)/i.test(v.lang) && !NOVELTY.test(v.name));
  voicesCache.sort((a, b) => (QUALITY.test(b.name) - QUALITY.test(a.name)) || a.lang.localeCompare(b.lang));
  return voicesCache;
}
if ('speechSynthesis' in window) {
  refreshVoices();
  speechSynthesis.addEventListener?.('voiceschanged', refreshVoices);
}
export const ttsSupported = () => 'speechSynthesis' in window;
export function spanishVoices() { return voicesCache.length ? voicesCache : refreshVoices(); }
export function voiceLabel(v) {
  if (!v) return 'Default';
  const region = (v.lang.split(/[-_]/)[1] || '').toUpperCase();
  return `${v.name.replace(/\s*\(.*\)$/, '')} · ${REGION[region] || v.lang}`;
}
export function waitForVoices(timeout = 1500) {
  return new Promise((resolve) => {
    if (spanishVoices().length) return resolve(voicesCache);
    const t = setTimeout(() => resolve(refreshVoices()), timeout);
    speechSynthesis?.addEventListener?.('voiceschanged', () => { clearTimeout(t); resolve(refreshVoices()); }, { once: true });
  });
}

function preferredVoice() {
  const vs = spanishVoices();
  const chosen = vs.find((v) => v.voiceURI === store.state.settings.voice);
  if (chosen) return chosen;
  const want = store.state.profile.variety === 'latam' ? /es[-_](MX|US|419|CO|AR)/i : /es[-_]ES/i;
  return vs.find((v) => want.test(v.lang)) || vs[0] || null;
}

// A Mexican voice where the device has one, for news and everything about Mexico.
export function mexicanVoice() {
  const vs = spanishVoices();
  return vs.find((v) => /es[-_]MX/i.test(v.lang)) || vs.find((v) => /es[-_](US|419)/i.test(v.lang)) || undefined;
}

// Distinct voices for multi-talker input (dialogues, perception training).
export function voicePool() {
  const vs = spanishVoices();
  const seen = new Set();
  const pool = [];
  const first = preferredVoice();
  if (first) { pool.push(first); seen.add(first.name); }
  for (const v of vs) if (!seen.has(v.name)) { pool.push(v); seen.add(v.name); }
  return pool;
}
let rotate = 0;
export function nextVoice() {
  const pool = voicePool();
  if (!store.state.settings.multiVoice || pool.length < 2) return pool[0] || null;
  rotate = (rotate + 1) % Math.min(pool.length, 6);
  return pool[rotate];
}

let speaking = null;
export function stopSpeaking() {
  if (ttsSupported()) speechSynthesis.cancel();
  if (speaking) { speaking.resolve(); speaking = null; }
}

// speak(text, {rate, voice}) → Promise resolved when finished (or cancelled).
// Long texts are split into sentences to avoid the Chrome ~15 s cut-off.
export function speak(text, opts = {}) {
  if (!ttsSupported()) return Promise.resolve();
  stopSpeaking();
  const voice = opts.voice === undefined ? preferredVoice() : opts.voice;
  const rate = (opts.rate ?? 1) * (store.state.settings.rate || 1);
  const chunks = String(text).match(/[^.!?…;]+[.!?…;]*\s*/g) || [String(text)];
  return new Promise((resolve) => {
    speaking = { resolve };
    let i = 0;
    const next = () => {
      if (!speaking || i >= chunks.length) { speaking = null; return resolve(); }
      const u = new SpeechSynthesisUtterance(chunks[i++].trim());
      u.lang = voice?.lang || (store.state.profile.variety === 'latam' ? 'es-MX' : 'es-ES');
      if (voice) u.voice = voice;
      u.rate = Math.max(0.5, Math.min(1.6, rate));
      if (opts.pitch) u.pitch = opts.pitch;
      if (opts.onboundary) u.onboundary = opts.onboundary;
      u.onend = next;
      u.onerror = next;
      speechSynthesis.speak(u);
    };
    next();
  });
}

// Play a sequence of {text, voice} lines (dialogues).
export async function speakLines(lines, opts = {}) {
  for (const [i, line] of lines.entries()) {
    if (opts.signal?.aborted) return;
    opts.onLine?.(i);
    await speak(line.text, { ...opts, voice: line.voice, pitch: line.pitch });
    if (opts.signal?.aborted) return;
    await new Promise((r) => setTimeout(r, opts.gap ?? 350));
  }
  opts.onLine?.(-1);
}

// ---- Speech recognition -------------------------------------------------------------
const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
export const sttSupported = () => !!SR;
export const sttLang = () => (store.state.profile.variety === 'latam' ? 'es-MX' : 'es-ES');

// On iPhone/iPad, apps opened from a Home Screen icon in web-app mode get no speech recognition.
const iosHomeScreenApp = () => navigator.standalone === true;
function sttErrorText(code) {
  if (code === 'service-not-allowed' && iosHomeScreenApp()) return 'On iPhone, speech recognition only works in Safari, not in apps added to the Home Screen. Open this site in Safari for speaking exercises (or re-add it with “Open as Web App” turned off).';
  if (code === 'not-allowed' || code === 'service-not-allowed') return 'Microphone or speech recognition is blocked. Allow the microphone for this site in your browser settings (on iPhone, Siri & Dictation must also be on).';
  if (code === 'network') return 'Speech recognition needs an internet connection.';
  if (code === 'audio-capture') return 'No microphone was found.';
  if (code === 'language-not-supported') return 'This browser can’t recognise Spanish. Try Chrome or Safari.';
  return `Speech recognition error: ${code}`;
}

// listen({continuous, onInterim, onFinal}) → controller {stop(), done: Promise<{transcript, alternatives}>}
export function listen({ continuous = false, onInterim, maxAlternatives = 5 } = {}) {
  if (!SR) return { stop() {}, done: Promise.reject(new Error('Speech recognition is not supported in this browser. Use Chrome, Edge or Safari.')) };
  let finalText = '';
  let alternatives = [];
  let stopped = false;
  let rec;
  let resolveDone, rejectDone;
  const done = new Promise((res, rej) => { resolveDone = res; rejectDone = rej; });
  const start = () => {
    rec = new SR();
    rec.lang = sttLang();
    rec.interimResults = true;
    rec.continuous = continuous;
    rec.maxAlternatives = maxAlternatives;
    rec.onresult = (e) => {
      let interim = '';
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const r = e.results[i];
        if (r.isFinal) {
          finalText += (finalText ? ' ' : '') + r[0].transcript.trim();
          alternatives = Array.from(r).map((a) => a.transcript.trim());
        } else interim += r[0].transcript;
      }
      onInterim?.(finalText + (interim ? ' ' + interim : ''));
    };
    rec.onerror = (e) => {
      if (e.error === 'no-speech' && continuous && !stopped) return;
      if (e.error === 'aborted') return;
      stopped = true;
      rejectDone(new Error(sttErrorText(e.error)));
    };
    rec.onend = () => {
      if (continuous && !stopped) { try { start(); } catch { resolveDone({ transcript: finalText, alternatives }); } return; }
      resolveDone({ transcript: finalText, alternatives });
    };
    rec.start();
  };
  try { start(); } catch (e) { rejectDone(e); }
  return {
    stop() { stopped = true; try { rec?.stop(); } catch { /* already stopped */ } },
    done,
  };
}

// ---- Microphone recording (for comparing yourself with the model) --------------------
export class Recorder {
  constructor() { this.chunks = []; this.url = null; }
  static supported() { return !!(navigator.mediaDevices?.getUserMedia && window.MediaRecorder); }
  async start(onLevel) {
    this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    this.chunks = [];
    this.rec = new MediaRecorder(this.stream);
    this.rec.ondataavailable = (e) => e.data.size && this.chunks.push(e.data);
    this.rec.start();
    this.startedAt = Date.now();
    if (onLevel) {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      ctx.resume?.(); // iOS starts it suspended after the await above, which leaves the meter flat
      const src = ctx.createMediaStreamSource(this.stream);
      const an = ctx.createAnalyser(); an.fftSize = 512;
      src.connect(an);
      const buf = new Uint8Array(an.fftSize);
      const tick = () => {
        if (!this.rec || this.rec.state !== 'recording') { ctx.close(); return; }
        an.getByteTimeDomainData(buf);
        let peak = 0; for (const v of buf) peak = Math.max(peak, Math.abs(v - 128));
        onLevel(peak / 128);
        requestAnimationFrame(tick);
      };
      tick();
    }
  }
  stop() {
    return new Promise((resolve) => {
      if (!this.rec) return resolve(null);
      this.rec.onstop = () => {
        this.stream.getTracks().forEach((t) => t.stop());
        if (this.url) URL.revokeObjectURL(this.url);
        const blob = new Blob(this.chunks, { type: this.rec.mimeType || 'audio/webm' });
        this.url = URL.createObjectURL(blob);
        this.duration = (Date.now() - this.startedAt) / 1000;
        resolve(this.url);
      };
      this.rec.stop();
    });
  }
}
// Play one stretch of a real recording (a line of a podcast) from its own host.
const clipPlayer = typeof Audio === 'undefined' ? null : new Audio();
export function stopClip() { clipPlayer?.pause(); }
export function playClip({ src, start, end }, rate = 1) {
  return new Promise((resolve, reject) => {
    const a = clipPlayer;
    const finish = () => { a.pause(); a.removeEventListener('timeupdate', onTime); resolve(); };
    const onTime = () => { if (a.currentTime >= end) finish(); };
    const go = () => {
      a.currentTime = Math.max(0, start);
      a.playbackRate = rate;
      a.addEventListener('timeupdate', onTime);
      a.play().catch((e) => { a.removeEventListener('timeupdate', onTime); reject(e); });
    };
    if (a.src === src && a.readyState >= 1) return go();
    a.addEventListener('loadedmetadata', go, { once: true });
    a.addEventListener('error', () => reject(new Error('This recording is no longer available.')), { once: true });
    a.src = src;
    a.load();
  });
}

export function playUrl(url) {
  return new Promise((resolve) => { const a = new Audio(url); a.onended = resolve; a.onerror = resolve; a.play().catch(resolve); });
}
