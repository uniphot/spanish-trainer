// Retell something out loud, with word count, speed and optional AI feedback. Used after reading
// a news article and after listening to a real show.
import { h, btn } from '../core/ui.js';
import { store, logDone } from '../core/store.js';
import { wordCount } from '../core/text.js';
import { aiAvailable, speakingFeedback, friendlyError } from '../core/ai.js';
import { micWidget } from './speaking.js';

export function retellWidget({ task, hint, compare = 'Listen to your recording.' }) {
  const out = h('div');
  const mic = micWidget({ continuous: true, label: 'Start retelling', stopLabel: 'Done', onDone: async ({ transcript, duration }) => {
    if (!transcript) { out.replaceChildren(h('p', { class: 'small muted' }, compare)); return; }
    const wpm = duration ? Math.round(wordCount(transcript) / (duration / 60)) : null;
    out.replaceChildren(h('p', { class: 'es' }, transcript), h('p', { class: 'small muted' }, `${wordCount(transcript)} words${wpm ? ` · ${wpm} words/min` : ''}`));
    logDone('speak');
    if (aiAvailable()) out.append(btn('✦ Feedback on my retelling', async (e) => {
      e.currentTarget.disabled = true;
      try {
        const r = await speakingFeedback({ transcript, task, level: store.state.profile.level });
        out.append(h('p', null, r.summary), ...r.errors.map((er) => h('div', { class: 'issue' }, h('span', { class: 'orig' }, er.original), ' → ', h('span', { class: 'fixd' }, er.correction), h('div', { class: 'small muted' }, er.explanation))),
          h('p', { class: 'es' }, h('b', 'Better version: '), r.better_version));
      } catch (err) { out.append(h('p', { class: 'note warn' }, friendlyError(err))); }
    }, 'small'));
  } });
  return h('div', { class: 'stack', style: { width: '100%', marginTop: '10px' } }, h('p', { class: 'small muted' }, hint), mic, out);
}
