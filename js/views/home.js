// Hoy: the daily plan (four strands), weekly balance, weak spots and reflection.
import { h, mount, btn, card, icon, levelBadge, toast } from '../core/ui.js';
import { store, STRANDS, minutesByStrand, streak, today } from '../core/store.js';
import { dailyPlan, errorProfile, mastery, startedTopics } from '../core/learner.js';
import { stats } from '../core/srs.js';
import { TOPICS } from '../data/grammar.js';
import { topUpDeck } from './review.js';

export const strand = null;

const REFLECT = [
  'What did you do in Spanish this week that went well?',
  'What was hardest, and what will you do differently next week?',
  'Where did you use (or could you have used) Spanish outside this app?',
];

export async function render(root) {
  topUpDeck();
  const p = store.state.profile;
  const plan = dailyPlan();
  const s = stats();
  const todayMin = Object.values(store.state.log[today()]?.min || {}).reduce((a, b) => a + b, 0);
  const week = minutesByStrand(7);
  const weekTotal = Object.values(week).reduce((a, b) => a + b, 0);
  const mastered = TOPICS.filter((t) => mastery(t.id).status === 'mastered').length;
  const errs = errorProfile(30).slice(0, 4);
  const lastReflection = store.state.journal.filter((j) => j.kind === 'weekly').slice(-1)[0];
  const needsReflection = weekTotal >= 20 && (!lastReflection || Date.now() - lastReflection.ts > 6 * 864e5);
  const hour = new Date().getHours();
  const greet = hour < 13 ? 'Buenos días' : hour < 20 ? 'Buenas tardes' : 'Buenas noches';

  mount(root,
    h('div', { class: 'page-head' },
      h('h1', `${greet}.`),
      h('p', { class: 'lead' }, p.level ? ['Your level: ', levelBadge(p.level), p.goalLevel ? [' · goal ', levelBadge(p.goalLevel)] : null, '. Here is a balanced session for today.'] :
        'Start with the level test so the trainer can pitch everything just above your current level.')),

    !p.level ? card(h('div', { class: 'row between' },
      h('div', null, h('h2', 'Find your level (≈ 15 min)'), h('p', { class: 'muted', style: { maxWidth: '520px' } }, 'An adaptive test (vocabulary size, grammar, reading and listening) gives you a CEFR estimate per skill and sets your starting point.')),
      btn(['Start the level test ', icon('arrow', 16)], () => { location.hash = '#/placement'; }, 'primary big'))) : null,

    h('div', { class: 'grid home-grid', style: { alignItems: 'start' } },
      card(
        h('div', { class: 'row between' }, h('h2', { style: { margin: 0 } }, 'Today’s plan'),
          h('span', { class: 'muted small' }, `${Math.round(todayMin)} / ${p.dailyMinutes} min today`)),
        h('div', { class: 'bar ok', style: { margin: '10px 0 6px' } }, h('div', { class: 'bar-fill', style: { width: `${Math.min(100, (todayMin / (p.dailyMinutes || 30)) * 100)}%` } })),
        plan.steps.map((st) => h('div', { class: `plan-step ${st.done ? 'done' : ''}` },
          h('span', { class: 'dot', style: { background: STRANDS[st.strand]?.color } }),
          h('div', { class: 'ps-body' }, h('div', { class: 'ps-title' }, st.title), h('div', { class: 'ps-why' }, st.why)),
          h('span', { class: 'small muted' }, `~${st.min}′`),
          st.done ? h('span', { class: 'tag' }, '✓ done') : h('a', { class: 'btn small', href: st.href }, 'Go'))),
        h('p', { class: 'small muted', style: { marginTop: '10px' } }, 'Order matters: retrieval first while you are fresh, then focused study, then using Spanish for meaning, then fluency.')),
      h('div', null,
        card(h('div', { class: 'row', style: { gap: '22px' } },
          h('div', { class: 'stat' }, h('span', { class: 'v' }, streak()), h('span', { class: 'l' }, 'day streak')),
          h('div', { class: 'stat' }, h('span', { class: 'v' }, s.due), h('span', { class: 'l' }, 'cards due')),
          h('div', { class: 'stat' }, h('span', { class: 'v' }, `${startedTopics().length}`), h('span', { class: 'l' }, `topics started · ${mastered} mastered`)))),
        card(h('h3', 'This week’s balance'),
          weekTotal < 1 ? h('p', { class: 'small muted' }, 'No activity yet this week.') : [
            h('div', { class: 'strands' }, Object.entries(week).map(([k, v]) => h('div', { style: { width: `${(v / weekTotal) * 100}%`, background: STRANDS[k].color }, title: `${STRANDS[k].en}: ${Math.round(v)} min` }))),
            h('div', { class: 'legend' }, Object.entries(STRANDS).map(([k, v]) => h('span', null, h('i', { style: { background: v.color } }), `${v.en} ${Math.round(week[k])}′`))),
            h('p', { class: 'small', style: { marginTop: '10px' } }, h('b', 'Most behind: '), STRANDS[plan.behind].en.toLowerCase(), ' — today’s plan gives it more time.')],
          h('p', { class: 'small muted', style: { marginTop: '8px' } }, 'Nation’s “four strands”: a balanced learner spends roughly equal time on each.')),
        errs.length ? card(h('h3', 'Your recurring errors (30 days)'),
          errs.map((e) => h('div', { class: 'err-row' }, h('span', { class: 'badge soft' }, e.n),
            h('div', { style: { flex: 1 } }, h('div', null, e.topic ? e.topic.title : e.key), h('div', { class: 'small muted' }, e.sources.join(', '))),
            e.topic ? h('a', { class: 'btn small', href: `#/grammar/${e.topic.id}?mode=practice` }, 'Practise') : null)),
          h('a', { href: '#/progress', class: 'small' }, 'Full error log →')) : null)),

    newsCard(),
    needsReflection ? reflectionCard() : null,
  );
  // simple responsive fallback for the two-column grid
  const grid = root.querySelector('.home-grid');
  const fit = () => { grid.style.gridTemplateColumns = innerWidth < 900 ? '1fr' : 'minmax(0, 1.5fr) minmax(0, 1fr)'; };
  fit(); addEventListener('resize', fit);
  return () => removeEventListener('resize', fit);
}

// Today's Mexico headlines (from the cached digest; the Noticias page fetches them).
function newsCard() {
  const N = store.state.news;
  const fresh = N.date === today() && N.digest.length;
  return card(h('div', { class: 'row between' }, h('h3', { style: { margin: 0 } }, 'Hoy en México'), h('a', { class: 'btn small', href: '#/news' }, fresh ? 'All of today’s digest' : 'Load today’s news')),
    fresh ? N.digest.slice(0, 3).map((it) => h('div', { class: 'err-row' }, h('a', { href: `#/news/${it.id}`, style: { flex: 1 } }, it.title), h('span', { class: 'small muted' }, it.outlet), N.read[it.id] ? h('span', { class: 'tag' }, '✓') : null))
      : h('p', { class: 'small muted', style: { marginTop: '8px' } }, 'A daily digest of Mexican news — CDMX, travel, culture, food and the main stories — to read and retell for practice.'));
}

function reflectionCard() {
  const areas = REFLECT.map((q) => ({ q, el: h('textarea', { rows: 2, style: { minHeight: '60px' } }) }));
  return card(h('h3', 'Weekly reflection'),
    h('p', { class: 'small muted' }, 'Self-regulated learners plan, monitor and reflect. Two minutes of honest reflection helps you steer the next week. (English or Spanish — Spanish counts as writing practice!)'),
    areas.map(({ q, el }) => h('label', { class: 'field' }, h('span', q), el)),
    h('div', { class: 'ex-actions' }, btn('Save reflection', () => {
      const text = areas.map(({ q, el }) => `${q}\n${el.value.trim()}`).join('\n\n');
      if (areas.every(({ el }) => !el.value.trim())) return toast('Write at least one answer.');
      store.state.journal.push({ ts: Date.now(), kind: 'weekly', text });
      store.save(); toast('Saved — see Progress → Journal', 'ok');
      location.reload();
    }, 'primary')));
}
