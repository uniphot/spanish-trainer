// Podcast transcripts: WebVTT → cues → whole sentences. Machine-made cues are cut every few
// seconds regardless of grammar, so the words are re-joined and split at sentence ends, with each
// word's time estimated from its position inside its cue.
const toSeconds = (s) => {
  const m = s.trim().match(/(?:(\d+):)?(\d{1,2}):(\d{2})[.,](\d{1,3})/);
  return m ? (+m[1] || 0) * 3600 + +m[2] * 60 + +m[3] + +m[4].padEnd(3, '0') / 1000 : NaN;
};

export function parseVTT(text) {
  const cues = [];
  for (const block of String(text).replace(/\r/g, '').split(/\n{2,}/)) {
    const lines = block.split('\n');
    const i = lines.findIndex((l) => l.includes('-->'));
    if (i < 0) continue;
    const [a, b] = lines[i].split('-->');
    const start = toSeconds(a), end = toSeconds(b);
    const raw = lines.slice(i + 1).join(' ');
    const body = raw.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    if (body && end > start) cues.push({ start, end, speaker: raw.match(/<v\s+([^>]+)>/)?.[1].trim() || '', text: body });
  }
  return cues;
}

const ENDS = /[.?!…]["”»)]*$/;
const ABBREVIATION = /^(Sr|Sra|Srta|Dr|Dra|Lic|Ing|Prof|Av|Col|Núm|No|EE|UU)\.$/;
const MAX_WORDS = 40;

export function toSentences(cues) {
  const out = [];
  let words = [], speaker = '', start = 0, end = 0;
  const flush = () => {
    if (words.length) out.push({ start, end, speaker, text: words.join(' ') });
    words = [];
  };
  for (const cue of cues) {
    if (cue.speaker !== speaker) flush();
    speaker = cue.speaker;
    const parts = cue.text.split(' ');
    const total = cue.text.length || 1;
    let offset = 0;
    for (const w of parts) {
      const at = (o) => cue.start + (cue.end - cue.start) * (o / total);
      if (!words.length) start = at(offset);
      words.push(w);
      offset += w.length + 1;
      end = at(Math.min(offset, total));
      if ((ENDS.test(w) && !ABBREVIATION.test(w)) || words.length >= MAX_WORDS) flush();
    }
  }
  flush();
  return out;
}
