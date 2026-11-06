// Transcript parsing: run with `node tests/transcript.js`.
import assert from 'node:assert/strict';
import { parseVTT, toSentences } from '../js/core/transcript.js';

// Radio Ambulante style: single-digit hours, cues cut mid-sentence, one speaker.
const omny = `WEBVTT - El Contagio

0:00:00.520 --> 0:00:03.750
<v Speaker 1>Hola Ambulante, antes de comenzar quiero hablarte de algo. En

0:00:03.850 --> 0:00:07.150
<v Speaker 1>Radio Ambulante Studios decidimos apostar contra la inmediatez que domina el

0:00:07.190 --> 0:00:11.149
<v Speaker 1>internet actualmente. Hacemos historias.
`;
const cues = parseVTT(omny);
assert.equal(cues.length, 3);
assert.equal(cues[0].speaker, 'Speaker 1');
assert.ok(Math.abs(cues[0].start - 0.52) < 1e-9);
assert.ok(!cues[0].text.includes('<'));
const s = toSentences(cues);
assert.equal(s.length, 3, 'three sentences across three cues');
assert.equal(s[0].text, 'Hola Ambulante, antes de comenzar quiero hablarte de algo.');
assert.ok(s[1].text.startsWith('En Radio Ambulante Studios') && s[1].text.endsWith('actualmente.'));
assert.ok(s[1].start > 3 && s[1].start < 3.85, 'a sentence starts where its first word sits in the cue');
assert.ok(s[1].end > 7.19 && s[1].end < 11.149);
assert.ok(s[0].end <= s[1].start + 0.01 && s[1].end <= s[2].start + 0.01, 'sentences stay in order');

// Dreaming Spanish style: two-digit hours, a cue per sentence, named speakers, CRLF line ends.
const buzz = 'WEBVTT\r\n\r\n00:00:00.066 --> 00:00:12.900\r\n<v Agustina>Hola a todos, ¿cómo están?\r\n\r\n00:00:12.900 --> 00:00:24.734\r\n<v Pablo>Muy bien. ¿Y tú?\r\n';
const b = toSentences(parseVTT(buzz));
assert.deepEqual(b.map((x) => x.speaker), ['Agustina', 'Pablo', 'Pablo']);
assert.equal(b[1].text, 'Muy bien.');
assert.equal(b[2].text, '¿Y tú?');

// A change of speaker ends a sentence even without punctuation; abbreviations don't.
const c = toSentences(parseVTT('WEBVTT\n\n00:00:01.000 --> 00:00:02.000\n<v A>Pues mira\n\n00:00:02.000 --> 00:00:03.000\n<v B>El Sr. Ruiz vino.\n'));
assert.deepEqual(c.map((x) => x.text), ['Pues mira', 'El Sr. Ruiz vino.']);

// Text with no punctuation at all still gets split.
const long = Array.from({ length: 90 }, (_, i) => `palabra${i}`).join(' ');
const d = toSentences(parseVTT(`WEBVTT\n\n00:00:00.000 --> 00:00:30.000\n${long}\n`));
assert.ok(d.length >= 3 && d.every((x) => x.text.split(' ').length <= 40));

assert.deepEqual(parseVTT('WEBVTT\n\nnot a cue\n'), []);
assert.deepEqual(toSentences([]), []);
console.log('transcript: all checks passed');
