// Método: the research behind each feature, and its limits.
import { h, mount, card } from '../core/ui.js';

export const strand = null;

const P = [
  {
    title: 'Spaced retrieval beats re-reading',
    claim: 'Of ten common study techniques reviewed by Dunlosky and colleagues (2013), only two earned a “high utility” rating: practice testing (retrieving from memory) and distributed practice (spacing sessions out). Rereading and highlighting rated low.',
    app: 'Repaso is a single FSRS-scheduled queue (the open-source algorithm now used by Anki). Every card makes you produce the answer — type the word in a sentence, fix your own past error, write a sentence you hear — and comes back just before you would forget it. Grammar topics also return for review at expanding intervals.',
    refs: [['Dunlosky et al. (2013), Psychological Science in the Public Interest', 'https://www.psychologicalscience.org/observer/which-study-strategies-make-the-grade-2'], ['Cepeda et al. (2006), Psychological Bulletin — spacing meta-analysis', null], ['FSRS algorithm (open-spaced-repetition)', 'https://github.com/open-spaced-repetition']],
  },
  {
    title: 'Balance the four strands',
    claim: 'Paul Nation argues a well-designed course gives roughly equal time to four strands: meaning-focused input (listening, reading), meaning-focused output (speaking, writing), language-focused learning (deliberate study of grammar, vocabulary, pronunciation) and fluency development (using what you know, faster). Self-taught learners typically overdo the third.',
    app: 'Every activity is tagged with a strand and timed. Today’s plan always contains all four, gives extra time to whichever strand is behind this week, and Progress shows your 30-day balance.',
    refs: [['Nation (2007), “The four strands”, Innovation in Language Learning and Teaching', null]],
  },
  {
    title: 'Interpret before you produce (processing instruction)',
    claim: 'Learners tend to process meaning through vocabulary and ignore grammatical endings. VanPatten & Cadierno (1993) found that “structured input” activities — where you must attend to the form to understand who did what or when — improved both comprehension and production of Spanish object pronouns, while traditional output drills improved production only.',
    app: 'Every grammar topic has an “Interpret” step between the explanation and the practice: decide what a sentence means using only the grammatical cue (ending, pronoun, mood). Some are audio-only to train hearing the form (hablo vs. habló).',
    refs: [['VanPatten & Cadierno (1993), Studies in Second Language Acquisition', 'https://faculty.weber.edu/tmathews/SLI/Readings/VanPatten%20&%20Cadierno%201993.pdf']],
  },
  {
    title: 'Mix confusable structures (interleaving)',
    claim: 'Blocked practice (20 items of one rule) feels easier but is forgotten faster. Mixing grammar exercises improved long-term retention in Nakata & Suzuki (2019), and Pan et al. (2019) found interleaving benefits specifically for Spanish verb conjugation. The benefit comes from having to choose which rule applies — exactly the problem in real use.',
    app: 'After a topic is introduced (blocked practice), Mixed practice and the Contrast drills (ser/estar/hay, past tenses, indicative vs. subjunctive, pronouns, por/para) interleave topics. The conjugation trainer mixes tenses by default.',
    refs: [['Nakata & Suzuki (2019), The Modern Language Journal 103(3)', null], ['Pan, Tajran, Lovelett, Osuna & Rickard (2019), Journal of Educational Psychology 111(7)', null]],
  },
  {
    title: 'Learn to listen, not just test listening',
    claim: 'Vandergrift and Goh’s metacognitive pedagogical sequence — plan/predict, first listen, verify, second listen, check with the text, reflect — teaches the process of listening. Studies report gains in comprehension, especially for less skilled listeners.',
    app: 'The Listening cycle follows that sequence step by step, ending with a transcript you can follow line by line, a noticing focus on one structure, sentence mining into review, and a reflection on what made it hard (with targeted advice).',
    refs: [['Vandergrift & Goh (2012), Teaching and Learning Second Language Listening', null]],
  },
  {
    title: 'Many voices train robust perception',
    claim: 'High-variability phonetic training — hearing contrasts from multiple talkers with immediate feedback — improves L2 speech perception with medium-to-large effects that are retained and partly generalise (meta-analysis of 79 studies). Production gains are smaller.',
    app: 'Minimal-pair ear training plays each item with a randomly chosen voice; dialogues give each speaker a different voice; the “Rotate voices” setting varies voices across dictation and reviews. Pronunciation units train perception first, then production.',
    refs: [['Uchihara, Karas & Thomson — HVPT meta-analysis, Studies in Second Language Acquisition (2025)', 'https://www.cambridge.org/core/product/DE00A78365CD8CEB60A1FDB5D808195D'], ['Uchihara, Karas & Thomson (2024), Applied Psycholinguistics — production', 'https://www.cambridge.org/core/product/E38D8F5CE65DC708137B0E95F97C6BC7']],
  },
  {
    title: 'Fluency is its own skill',
    claim: 'In Nation’s 4/3/2 technique the same talk is repeated with less time each round; with content held constant, attention goes to speed. De Jong & Perfetti (2011) found fewer hesitations in later rounds, and combining it with corrective feedback (Tran et al., 2021) improved accuracy as well. Shadowing studies (Hamada; Kadota) show listening gains, strongest for lower-level learners.',
    app: '4/3/2 with live words-per-minute and filler counts per round, optional AI feedback afterwards; shadowing with simultaneous recording, echo mode with recognition and build-up (back-chaining) for long sentences; 10-minute quick-writes and 1.25× replays of texts you already understand.',
    refs: [['Nation (1989), System 17', null], ['de Jong & Perfetti (2011), Language Learning', 'https://www.lrdc.pitt.edu/perfettilab/pubpdfs/de%20Jong%20Language%20Learning.pdf'], ['Hamada (2016), Language Teaching Research; Kadota (2019)', null]],
  },
  {
    title: 'Output makes you notice — feedback makes it stick',
    claim: 'Swain’s output hypothesis: producing language pushes you to notice what you can’t yet say. Meta-analyses find that corrective feedback works: oral feedback has significant, durable effects (Lyster & Saito, 2010), and in classroom settings prompts that push self-repair outperformed recasts; written corrective feedback improves accuracy (Kang & Han, 2015).',
    app: 'Writing and conversation feedback is hint-first: you see where and what kind of problem, try to fix it, and only then reveal the correction. Every draft is kept; recurring errors feed the error log, review cards and grammar practice. Dictogloss makes you reconstruct a text and compare, to notice forms you missed.',
    refs: [['Swain (1985, 1995); Schmidt (1990) — noticing', null], ['Lyster & Saito (2010), Studies in Second Language Acquisition 32', 'https://escholarship.mcgill.ca/downloads/6w924g64b'], ['Kang & Han (2015), The Modern Language Journal 99(1)', 'https://doi.org/10.1111/j.1540-4781.2015.12187.x'], ['Kowal & Swain (1997) — dictogloss', null]],
  },
  {
    title: 'Input slightly above your level',
    claim: 'Comprehension drives acquisition when input is understandable but a little beyond current competence (Krashen’s “i+1”). Large amounts of such input — extensive listening and reading — build vocabulary and intuition that explicit study cannot.',
    app: 'The level test sets your starting point; listening texts, dictation sentences and writing tasks are recommended at your level and one above. Noticias brings a daily digest of real Mexican news, with a readability estimate, tap-a-word support and a retelling task. The Listening hub links to graded real-world input (e.g. Dreaming Spanish, Radio Ambulante) for the hours outside the app.',
    refs: [['Krashen (1985), The Input Hypothesis', null]],
  },
  {
    title: 'Measure where you start',
    claim: 'Good placement tests combine a quick vocabulary-size estimate with adaptive questioning. Yes/no vocabulary tests include invented words to correct for overclaiming (Meara & Buxton, 1987); adaptive tests use item response theory to pick the most informative next question.',
    app: 'The level test: a 70-item yes/no test with pseudowords (guessing-corrected per frequency band) sets the prior for a computer-adaptive test (Rasch/3-parameter model, Bayesian EAP estimate) across grammar, vocabulary, reading and listening, plus CEFR can-do self-assessment for speaking and writing.',
    refs: [['Meara & Buxton (1987), Language Testing; Meara (1992)', 'https://lognostics.co.uk/vlibrary/meara1991.doc'], ['Council of Europe — CEFR self-assessment grid', 'https://www.coe.int/en/web/common-european-framework-reference-languages']],
  },
  {
    title: 'Plan, monitor, reflect',
    claim: 'Autonomous learners succeed when they regulate their own learning: setting goals, monitoring progress and reflecting on strategies (Zimmerman’s cyclical model of self-regulated learning).',
    app: 'Goals and daily time in Settings; daily plan; streak and strand balance; error profile; weekly reflection prompts on the Today page; a learning journal in Progress.',
    refs: [['Zimmerman (2002), Theory Into Practice 41(2)', null]],
  },
];

export async function render(root) {
  mount(root,
    h('div', { class: 'page-head' }, h('h1', 'Why it works'), h('p', { class: 'lead' }, 'Each part of this trainer is built on a finding from second-language acquisition or cognitive-psychology research. Here is the claim, what the app does with it, and where to read more.')),
    P.map((p) => card(h('h3', p.title), h('p', null, p.claim), h('p', null, h('b', 'In the app: '), p.app),
      h('p', { class: 'small muted' }, p.refs.map(([t, url], i) => [i ? ' · ' : '', url ? h('a', { href: url, target: '_blank', rel: 'noopener' }, t) : t])))),
    card(h('h3', 'Honest limits'),
      h('ul', null,
        h('li', null, 'Speech recognition checks whether a machine understood you — a proxy for intelligibility, not a pronunciation score. It can also “autocorrect” what you said.'),
        h('li', null, 'The built-in checker targets frequent learner errors and is tuned to avoid false alarms, so it misses many things. LanguageTool and the AI tutor catch more but can be wrong too — treat feedback as hints to think about.'),
        h('li', null, 'Synthetic voices are clear but not natural speech. Use the real-world listening resources for genuine accents, speed and overlap.'),
        h('li', null, 'No app replaces talking to people. Use the role-plays and the AI partner to prepare, then find language exchanges, tutors or communities to use your Spanish for real.'))));
}
