// Listening content: run with `node tests/listening.js`.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { MX_UNITS } from '../js/data/mx-sound.js';
import { SHOWS, TIERS } from '../js/data/shows.js';

// Every show the feed builder fetches has display details, and the other way round.
const py = readFileSync(new URL('../listen.py', import.meta.url), 'utf8');
const fetched = [...py.matchAll(/^\s+\("([a-z-]+)", "(audio|video)",/gm)].map((m) => [m[1], m[2]]);
assert.equal(fetched.length, SHOWS.length, 'listen.py and shows.js list the same number of shows');
for (const [id, kind] of fetched) {
  const s = SHOWS.find((x) => x.id === id);
  assert.ok(s, `${id} is in shows.js`);
  assert.equal(s.kind, kind, `${id} kind`);
  assert.ok(TIERS[s.tier], `${id} tier`);
  assert.ok(s.level && s.accent && s.help && s.why, `${id} is described`);
}

// Every drill can build a question: the answer exists and options can't collide with it.
const ids = new Set();
for (const u of MX_UNITS) {
  assert.ok(!ids.has(u.id), `${u.id} is unique`);
  ids.add(u.id);
  assert.ok(['sounds', 'scenes'].includes(u.group), `${u.id} group`);
  const items = u.items || u.lines.map(([say, en, reply, note]) => ({ say, en, reply, note }));
  assert.ok(items.length >= 8, `${u.id} has enough items`);
  const field = { text: 'say', full: 'full', meaning: 'en' }[u.drill];
  assert.ok(field || u.drill === 'role', `${u.id} drill type`);
  for (const it of items) {
    assert.ok(it.say && it.en, `${u.id}: “${it.say}” has text and meaning`);
    if (field) assert.ok(it[field], `${u.id}: “${it.say}” has ${field}`);
    if (u.drill === 'role') assert.ok(u.roles[it.role], `${u.id}: “${it.say}” has a valid role`);
  }
  if (field) {
    const values = items.map((it) => it[field]);
    assert.equal(new Set(values).size, values.length, `${u.id}: answers are all different`);
  }
}
console.log(`listening: ${SHOWS.length} shows and ${MX_UNITS.length} units check out`);
