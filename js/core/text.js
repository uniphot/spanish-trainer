// Text utilities: normalisation, accent-aware comparison, word alignment for dictation
// and speech feedback, simple tokenisation.

export const PUNCT = /[¿?¡!.,;:"“”«»()\[\]…—–\-]/g;

export function stripAccents(s) {
  return s.normalize('NFD').replace(/[̀-ͯ]/g, '').normalize('NFC');
}
export function norm(s) {
  return (s || '').toLowerCase().replace(/[’']/g, "'").replace(PUNCT, ' ').replace(/\s+/g, ' ').trim();
}
export const loose = (s) => stripAccents(norm(s));

export function levenshtein(a, b) {
  if (a === b) return 0;
  const m = a.length, n = b.length;
  if (!m) return n; if (!n) return m;
  let prev = Array.from({ length: n + 1 }, (_, j) => j);
  for (let i = 1; i <= m; i++) {
    const cur = [i];
    for (let j = 1; j <= n; j++) {
      cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    }
    prev = cur;
  }
  return prev[n];
}

// Compare a typed answer with one or more accepted answers.
// Returns { verdict: 'exact' | 'accent' | 'wrong', match }
export function checkAnswer(given, accepted) {
  const g = norm(given);
  const list = Array.isArray(accepted) ? accepted : [accepted];
  for (const a of list) if (norm(a) === g) return { verdict: 'exact', match: a };
  for (const a of list) if (loose(a) === stripAccents(g)) return { verdict: 'accent', match: a };
  return { verdict: 'wrong', match: list[0] };
}

export const words = (s) => norm(s).split(' ').filter(Boolean);
export const wordCount = (s) => (s.match(/[A-Za-zÀ-ÿñÑüÜ]+/g) || []).length;
export function sentences(s) {
  return (s.match(/[^.!?…]+[.!?…]*/g) || []).map((x) => x.trim()).filter((x) => /[A-Za-zÀ-ÿ]/.test(x));
}

// Classify how a typed word differs from the reference word.
export function wordDiff(ref, hyp) {
  if (ref === hyp) return 'ok';
  if (stripAccents(ref) === stripAccents(hyp)) return 'accent';
  const d = levenshtein(stripAccents(ref), stripAccents(hyp));
  if (d <= Math.max(1, Math.floor(ref.length / 4))) return 'spelling';
  return 'wrong';
}

// Word-level alignment (edit distance with partial-credit substitutions).
// Returns ops: {type: 'ok'|'accent'|'spelling'|'wrong'|'missing'|'extra', ref, hyp}
// Accent-only differences count as correct (they are shown as notes) unless strict.
export function alignWords(refText, hypText, { strict = false } = {}) {
  const R = words(refText), H = words(hypText);
  const m = R.length, n = H.length;
  const cost = (a, b) => {
    const k = wordDiff(a, b);
    return k === 'ok' ? 0 : k === 'accent' ? 0.2 : k === 'spelling' ? 0.6 : 1.4;
  };
  const D = Array.from({ length: m + 1 }, () => new Float64Array(n + 1));
  for (let i = 1; i <= m; i++) D[i][0] = i;
  for (let j = 1; j <= n; j++) D[0][j] = j;
  for (let i = 1; i <= m; i++) for (let j = 1; j <= n; j++) {
    D[i][j] = Math.min(D[i - 1][j] + 1, D[i][j - 1] + 1, D[i - 1][j - 1] + cost(R[i - 1], H[j - 1]));
  }
  const ops = [];
  let i = m, j = n;
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && Math.abs(D[i][j] - (D[i - 1][j - 1] + cost(R[i - 1], H[j - 1]))) < 1e-9) {
      ops.push({ type: wordDiff(R[i - 1], H[j - 1]), ref: R[i - 1], hyp: H[j - 1] }); i--; j--;
    } else if (i > 0 && Math.abs(D[i][j] - (D[i - 1][j] + 1)) < 1e-9) {
      ops.push({ type: 'missing', ref: R[i - 1] }); i--;
    } else {
      ops.push({ type: 'extra', hyp: H[j - 1] }); j--;
    }
  }
  ops.reverse();
  const okCount = ops.filter((o) => o.type === 'ok').length;
  const accent = ops.filter((o) => o.type === 'accent').length;
  const score = m ? (okCount + accent * (strict ? 0.75 : 1) + ops.filter((o) => o.type === 'spelling').length * 0.4) / Math.max(m, n) : 0;
  return { ops, score: Math.max(0, Math.min(1, score)), refCount: m };
}

export function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

// Moving-average type-token ratio (window 50) — a length-robust lexical diversity index.
export function mattr(text, win = 50) {
  const w = words(text);
  if (w.length < 10) return null;
  if (w.length <= win) return new Set(w).size / w.length;
  let sum = 0, count = 0;
  for (let i = 0; i + win <= w.length; i++) { sum += new Set(w.slice(i, i + win)).size / win; count++; }
  return sum / count;
}
