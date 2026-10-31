// Progreso: activity, strand balance, memory forecast, grammar mastery, error log, skills, journal.
import { h, mount, btn, card, ring, levelBadge, sparkline, tabs, toast, timeAgo } from '../core/ui.js';
import { store, STRANDS, today, streak, minutesByStrand } from '../core/store.js';
import { stats, forecast } from '../core/srs.js';
import { TOPICS, LEVELS, topic as getTopic } from '../data/grammar.js';
import { mastery, errorProfile } from '../core/learner.js';

export const strand = null;

export async function render(root, params) {
  const tab = params[0] || 'overview';
  const body = h('div');
  mount(root, h('div', { class: 'page-head' }, h('h1', 'Progreso'), h('p', { class: 'lead' }, 'Monitoring your own learning is half of learning well. Look here once a week, then adjust your plan.')),
    tabs([['overview', 'Overview'], ['errors', 'Error log'], ['skills', 'Skills'], ['journal', 'Journal']], tab, (id) => { location.hash = `#/progress/${id}`; }), body);
  if (tab === 'errors') return errorsTab(body);
  if (tab === 'skills') return skillsTab(body);
  if (tab === 'journal') return journalTab(body);
  return overview(body);
}

function dayKey(offset) { return today(new Date(Date.now() - offset * 864e5)); }

function overview(body) {
  const s = stats();
  const fc = forecast(14);
  const days = 84;
  const heat = [];
  let totalMin = 0;
  for (let i = days - 1; i >= 0; i--) {
    const d = store.state.log[dayKey(i)];
    const m = d ? Object.values(d.min).reduce((a, b) => a + b, 0) : 0;
    totalMin += m;
    heat.push(m);
  }
  const allMin = Object.values(store.state.log).reduce((a, d) => a + Object.values(d.min).reduce((x, y) => x + y, 0), 0);
  const month = minutesByStrand(30);
  const monthTotal = Object.values(month).reduce((a, b) => a + b, 0) || 1;
  const placements = store.state.placement;
  const started = TOPICS.filter((t) => mastery(t.id).n > 0);
  body.append(
    h('div', { class: 'grid grid-3' },
      card(h('div', { class: 'stat' }, h('span', { class: 'v' }, `${Math.round(allMin / 60 * 10) / 10} h`), h('span', { class: 'l' }, 'total study time')),
        h('div', { class: 'stat', style: { marginTop: '12px' } }, h('span', { class: 'v' }, streak()), h('span', { class: 'l' }, 'day streak (≥ 5 min)'))),
      card(h('div', { class: 'stat' }, h('span', { class: 'v' }, s.total), h('span', { class: 'l' }, `cards · ${s.mature} mature · ${s.due} due`)),
        h('div', { class: 'stat', style: { marginTop: '12px' } }, h('span', { class: 'v' }, `${started.length}/${TOPICS.length}`), h('span', { class: 'l' }, 'grammar topics started'))),
      card(h('div', { class: 'stat' }, h('span', { class: 'v' }, store.state.profile.level || '—'), h('span', { class: 'l' }, 'current level')),
        placements.length > 1 ? h('div', { style: { marginTop: '12px' } }, sparkline(placements.map((p) => p.theta), { w: 160, hgt: 36 }), h('div', { class: 'small muted' }, placements.map((p) => p.level).join(' → '))) :
          h('p', { class: 'small muted', style: { marginTop: '12px' } }, 'Retake the level test every 2–3 months to see your trajectory.'))),
    card(h('h3', 'Last 12 weeks'),
      h('div', { class: 'heat' }, heat.map((m, i) => h('div', { title: `${dayKey(days - 1 - i)}: ${Math.round(m)} min`, style: { background: m < 1 ? '' : `color-mix(in srgb, var(--accent) ${Math.min(100, 25 + m * 2)}%, var(--surface-2))` } }))),
      h('p', { class: 'small muted', style: { marginTop: '8px' } }, `${Math.round(totalMin)} minutes in the last 12 weeks. Consistency matters more than volume: short daily sessions beat long weekly ones for retention.`)),
    card(h('h3', 'Balance over 30 days (four strands)'),
      h('div', { class: 'strands' }, Object.entries(month).map(([k, v]) => h('div', { style: { width: `${(v / monthTotal) * 100}%`, background: STRANDS[k].color } }))),
      h('div', { class: 'legend' }, Object.entries(STRANDS).map(([k, v]) => h('span', null, h('i', { style: { background: v.color } }), `${v.en}: ${Math.round(month[k])} min (${Math.round((month[k] / monthTotal) * 100)}%)`))),
      h('p', { class: 'small muted', style: { marginTop: '8px' } }, 'Target ≈ 25 % each. Too much study and too little input/output is the most common imbalance for self-taught learners.')),
    card(h('h3', 'Reviews due in the next 14 days'),
      h('div', { class: 'bars-v' }, fc.map((n, i) => h('div', { style: { height: `${(n / Math.max(1, ...fc)) * 100}%` }, title: `${i === 0 ? 'today' : `in ${i} d`}: ${n}` }, h('span', null, n || '')))),
      h('p', { class: 'small muted', style: { marginTop: '8px' } }, 'Forecast from the FSRS scheduler. If a day looks heavy, reduce new cards per day for a while.')),
    card(h('h3', 'Grammar mastery'), LEVELS.filter((L) => TOPICS.some((t) => t.level === L)).map((L) => h('div', { class: 'row', style: { margin: '8px 0', alignItems: 'flex-start' } }, levelBadge(L),
      h('div', { class: 'row', style: { flex: 1, gap: '6px' } }, TOPICS.filter((t) => t.level === L).map((t) => { const ms = mastery(t.id); return h('a', { href: `#/grammar/${t.id}`, title: `${t.title}: ${ms.n ? Math.round(ms.m * 100) + '%' : 'not started'}` }, ring(ms.m, { size: 34, stroke: 4, label: ms.n ? Math.round(ms.m * 100) : '·' })); }))))));
}

function errorsTab(body) {
  const prof = errorProfile(90);
  const recent = store.state.errors.slice(-30).reverse();
  body.append(
    card(h('h3', 'Your error profile (90 days)'),
      h('p', { class: 'small muted' }, 'Every mistake from grammar practice, conjugation, dictation, writing and conversation lands here. Recurring errors are your personal syllabus: fix the top two and your Spanish improves visibly.'),
      prof.length ? prof.slice(0, 12).map((e) => h('div', { class: 'err-row' }, h('span', { class: 'badge soft' }, e.n),
        h('div', { style: { flex: 1 } }, h('div', null, e.topic ? h('b', e.topic.title) : h('b', e.key)), h('div', { class: 'small muted' }, `${e.sources.join(', ')} · e.g. ${e.examples.map((x) => `“${(x.text || '').slice(0, 50)}”${x.fix ? ` → ${x.fix}` : ''}`).join('; ')}`)),
        e.topic ? h('a', { class: 'btn small', href: `#/grammar/${e.topic.id}?mode=practice` }, 'Practise') : null))
        : h('p', { class: 'muted' }, 'No errors logged yet — go make some mistakes! They are the raw material of learning.')),
    recent.length ? card(h('h3', 'Recent'), recent.map((e) => h('div', { class: 'err-row small' }, h('span', { class: 'tag' }, e.source), h('span', { style: { flex: 1 } }, h('span', { class: 'es' }, (e.text || '').slice(0, 90)), e.fix ? h('span', { class: 'muted' }, ` → ${e.fix}`) : null), h('span', { class: 'muted' }, timeAgo(e.ts))))) : null);
}

function skillsTab(body) {
  const S = store.state;
  const dict = S.dictation.slice(-30);
  const flu = S.fluency.slice(-10);
  const listen = Object.entries(S.listening);
  const pairs = S.speaking.filter((x) => x.kind === 'pairs');
  const writing = S.writing.filter((w) => w.ai);
  const qw = S.writing.filter((w) => w.task?.kind === 'quickwrite');
  const skills = S.profile.skills || {};
  body.append(
    Object.keys(skills).length ? card(h('h3', 'Placement profile'), h('div', { class: 'row' }, Object.entries(skills).map(([k, v]) => h('span', { class: 'tag' }, `${k}: `, levelBadge(v))))) : null,
    h('div', { class: 'grid grid-2' },
      card(h('h3', 'Listening'),
        h('p', { class: 'small' }, `${listen.length} texts completed through the full cycle${listen.length ? `, average ${Math.round((listen.reduce((a, [, r]) => a + (r.score || 0), 0) / listen.length) * 100)}%` : ''}.`),
        dict.length ? [h('p', { class: 'small' }, `Dictation accuracy (last ${dict.length} sentences):`), sparkline(dict.map((d) => d.score), { w: 260, hgt: 46 })] : h('p', { class: 'small muted' }, 'No dictations yet.'),
        (() => { const diffs = listen.flatMap(([, r]) => r.difficulties || []); const c = {}; diffs.forEach((d) => { c[d] = (c[d] || 0) + 1; }); const top = Object.entries(c).sort((a, b) => b[1] - a[1])[0]; return top ? h('p', { class: 'small muted' }, `Most reported difficulty: ${top[0]}.`) : null; })()),
      card(h('h3', 'Speaking'),
        flu.length ? [h('p', { class: 'small' }, '4/3/2 final-round speed (words/min):'), sparkline(flu.map((f) => f.rounds[f.rounds.length - 1]?.wpm || 0), { w: 260, hgt: 46 }), h('p', { class: 'small muted' }, flu.map((f) => Math.round(f.rounds[f.rounds.length - 1]?.wpm || 0)).join(' → '))] : h('p', { class: 'small muted' }, 'No fluency sessions yet.'),
        pairs.length ? h('p', { class: 'small' }, `Ear training: ${pairs.length} tests, last ${Math.round(pairs[pairs.length - 1].score * 100)}%.`) : null,
        h('p', { class: 'small' }, `${S.convo.length} AI conversations · ${S.speaking.filter((x) => x.kind === 'roleplay').length} role-plays.`)),
      card(h('h3', 'Writing'),
        h('p', { class: 'small' }, `${S.writing.filter((w) => !['quickwrite', 'dictogloss'].includes(w.task?.kind)).length} texts written, ${S.writing.reduce((a, w) => a + (w.drafts?.length || 0), 0)} drafts.`),
        writing.length ? h('p', { class: 'small' }, 'AI level estimates: ', writing.slice(-8).map((w) => w.ai.cefr).join(' → ')) : null,
        qw.length ? [h('p', { class: 'small' }, 'Quick-write speed (words/min):'), sparkline(qw.map((w) => w.wpm || 0), { w: 260, hgt: 46 })] : null),
      card(h('h3', 'Grammar & vocabulary'),
        h('p', { class: 'small' }, `${TOPICS.filter((t) => mastery(t.id).status === 'mastered').length} topics mastered, ${TOPICS.filter((t) => mastery(t.id).status === 'good').length} good, ${TOPICS.filter((t) => mastery(t.id).status === 'learning').length} learning.`),
        h('p', { class: 'small' }, `Vocabulary deck: ${Object.values(S.cards).filter((c) => c.type === 'vocab' && c.state && c.state !== 'new').length} words in review, ${Object.values(S.cards).filter((c) => c.type === 'vocab' && c.s >= 21).length} well established.`))));
}

function journalTab(body) {
  const area = h('textarea', { rows: 5, placeholder: 'How is your learning going? What will you change? (English or Spanish)' });
  const list = store.state.journal.slice().reverse();
  const entries = store.state.writing.filter((w) => w.task?.kind === 'journal').slice().reverse();
  body.append(
    card(h('h3', 'Learning journal'), h('p', { class: 'small muted' }, 'Plan → do → reflect. A few sentences after a week of study help you notice what works for you.'), area,
      h('div', { class: 'ex-actions' }, btn('Save entry', () => {
        if (!area.value.trim()) return;
        store.state.journal.push({ ts: Date.now(), kind: 'note', text: area.value.trim() }); store.save(); toast('Saved', 'ok'); location.reload();
      }, 'primary'), h('a', { class: 'btn ghost', href: '#/writing/journal' }, 'Write today’s diario in Spanish'))),
    list.map((j) => card(h('div', { class: 'small muted' }, new Date(j.ts).toLocaleDateString(), ' · ', j.kind === 'weekly' ? 'weekly reflection' : 'note'), h('p', { style: { whiteSpace: 'pre-wrap', marginTop: '6px' } }, j.text))),
    entries.length ? card(h('h3', 'Diario entries (Spanish)'), entries.map((w) => h('div', { class: 'err-row' }, h('a', { href: `#/writing/open/${w.id}` }, w.task.prompt), h('span', { class: 'small muted' }, timeAgo(w.ts))))) : null);
}
