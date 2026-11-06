// Real listening sources. Ids match SHOWS in listen.py, which fetches the newest episodes.
export const TIERS = {
  learner: { es: 'Para estudiantes', en: 'Made for learners', note: 'Real Mexicans, speaking clearly and a little slower, on purpose.' },
  bridge: { es: 'Puente', en: 'Bridge', note: 'Natural speech, but clear, or with pictures that carry the meaning.' },
  native: { es: 'Nativo', en: 'Native', note: 'What you’ll really hear: full speed, slang, people talking over each other.' },
};

// accent: what you will hear. help: what the show gives you to lean on.
export const SHOWS = [
  { id: 'slow-mx', name: 'Slow Mexican Spanish', kind: 'audio', tier: 'learner', level: 'A1–A2', accent: 'Mexico', help: 'Very slow, short episodes labelled by level', why: 'The gentlest start: five-to-ten-minute everyday stories, clearly pronounced.' },
  { id: 'cafecito', name: 'Cafecito con Mextalki', kind: 'audio', tier: 'learner', level: 'A2', accent: 'Mexico', help: 'Slow and clear', why: 'Stories, legends and curious facts about Mexico told for beginners.' },
  { id: 'tell-me', name: 'Tell Me Your Story', kind: 'audio', tier: 'learner', level: 'A2–B1', accent: 'Mexico', help: 'Slow, 8-minute stories', why: 'Andrea la Mexicana retells a real story each week. Short enough to replay.' },
  { id: 'dreaming', name: 'Dreaming Spanish Podcast', kind: 'audio', tier: 'learner', level: 'A2–B1', accent: 'Mixed Latin America and Spain', help: 'Line-by-line transcript', why: 'Not only Mexican, but the easiest show with a full timed transcript, so it’s the best place to start line-by-line practice.' },
  { id: 'yt-andrea', name: 'Andrea la Mexicana', kind: 'video', tier: 'learner', level: 'A2–B1', accent: 'Mexico', help: 'Spanish subtitles', handle: 'Andrealamexicana', why: 'Comprehensible input about Mexican life and culture, including travelling in Mexico.' },
  { id: 'spanish-go', name: 'Learn Spanish and Go', kind: 'audio', tier: 'learner', level: 'A2–B1', accent: 'Mexico, with some English', help: 'Partly in English', why: 'Jim and May talk about travelling and living in Mexico. A soft landing, since part of it is in English.' },

  { id: 'yt-rancho', name: 'De mi Rancho a Tu Cocina', kind: 'video', tier: 'bridge', level: 'B1', accent: 'Rural Mexico', help: 'You can see what’s happening', handle: 'DeMiRanchoATuCocina', why: 'Doña Ángela cooks and talks at an unhurried pace. The food on screen tells you what the words mean.' },
  { id: 'yt-jauja', name: 'Jauja Cocina Mexicana', kind: 'video', tier: 'bridge', level: 'B1–B2', accent: 'Mexico', help: 'You can see what’s happening', handle: 'JaujaCocinaMexicana', why: 'Home cooking, chatty and warm. Cooking is ideal input: the same verbs come back in every episode.' },
  { id: 'andrea', name: 'Andrea La Mexicana (podcast)', kind: 'audio', tier: 'bridge', level: 'B1', accent: 'Mexico', help: 'Clear, around 20 minutes', why: 'Longer talks on Mexican culture and everyday topics, at a comfortable speed.' },
  { id: 'how-to', name: 'How to Spanish Podcast', kind: 'audio', tier: 'bridge', level: 'B1–B2', accent: 'Mexico', help: 'Natural pace, made for students', why: 'Culture and language in Mexican Spanish at a natural pace. A long archive of weekly episodes.' },
  { id: 'yt-curiosamente', name: 'CuriosaMente', kind: 'video', tier: 'bridge', level: 'B1–B2', accent: 'Mexico', help: 'Scripted, with animation', handle: 'curiosamente', why: 'Animated science explainers from Mexico: clear scripted narration and pictures to support it.' },
  { id: 'yt-mextalki', name: 'Mextalki', kind: 'video', tier: 'bridge', level: 'B1–B2', accent: 'Mexico', help: 'Made for students', handle: 'mextalki', why: 'Two Mexican friends explain how Mexicans really talk. Their podcast is Cheleando con Mextalki.' },
  { id: 'no-hay-tos', name: 'No Hay Tos', kind: 'audio', tier: 'bridge', level: 'B2', accent: 'Mexico', help: 'Real conversation, normal speed', why: 'Mexican hosts dissect one word or expression per episode. Made for learners, but nobody slows down.' },

  { id: 'cheleando', name: 'Cheleando con Mextalki', kind: 'audio', tier: 'native', level: 'B2', accent: 'Mexico', help: 'Strong language', why: 'Two friends chatting over a beer: the most natural speech you’ll get from a show aimed at learners.' },
  { id: 'yt-luisito', name: 'Luisito Comunica', kind: 'video', tier: 'native', level: 'B2+', accent: 'Mexico', help: 'Spanish subtitles', handle: 'LuisitoComunica', why: 'Mexico’s biggest travel vlogger. Fast but clear, and full of everyday Mexican expressions.' },
  { id: 'yt-tienda', name: 'Alex Tienda', kind: 'video', tier: 'native', level: 'B2+', accent: 'Mexico', help: 'Spanish subtitles', handle: 'alextienda', why: 'Travel documentaries that often stay in Mexico, with a lot of people talking in the street.' },
  { id: 'yt-nmas', name: 'N+', kind: 'video', tier: 'native', level: 'B2+', accent: 'Mexico', help: 'Short clips, news voice', handle: 'nmas', why: 'Short TV news clips. Newsreaders are clear; the people they interview are not. Good for both.' },
  { id: 'ambulante', name: 'Radio Ambulante', kind: 'audio', tier: 'native', level: 'B2–C1', accent: 'All of Latin America', help: 'Line-by-line transcript', why: 'Award-winning long-form stories. Not only Mexican, but its timed transcript lets you study real voices line by line.' },
  { id: 'dudas', name: 'Se Regalan Dudas', kind: 'audio', tier: 'native', level: 'C1', accent: 'Mexico', help: 'Two friends, full speed', why: 'One of the most popular Spanish-language podcasts. Lety and Ashley talk about life and mental health.' },
  { id: 'botepronto', name: 'Botepronto', kind: 'audio', tier: 'native', level: 'C1', accent: 'Mexico', help: 'Panel, full speed', why: 'A weekly panel on Mexican politics and current affairs. It pairs well with the Noticias tab.' },
  { id: 'cotorrisa', name: 'La Cotorrisa', kind: 'audio', tier: 'native', level: 'C1+', accent: 'Mexico', help: 'Strong language', why: 'Two comedians riffing. The final boss: the slang and jokes are as Mexican as it gets.' },
];

export const showById = (id) => SHOWS.find((s) => s.id === id);

// Not in the feed: long-form things to watch elsewhere. Streaming catalogues differ by country.
export const SCREEN = [
  { name: 'La Casa de las Flores', where: 'Netflix', level: 'B1–B2', note: 'A family comedy-drama set in Mexico City. A good first series: stick with it and the same people and vocabulary keep coming back.' },
  { name: 'Club de Cuervos', where: 'Netflix', level: 'B2+', note: 'A comedy about a football club. Fast and full of slang (güey, neta, chido), so save it for when La Casa de las Flores feels comfortable.' },
  { name: 'A film you know by heart', where: 'Any streaming service', level: 'A2+', note: 'Pick the “Español (Latinoamérica)” audio. Much of this dubbing is done in Mexico in a mild, Mexico City-based “neutral” accent, and you already know the story, so your attention is free for the sounds.' },
];

export const ELSEWHERE = [
  { name: 'Dreaming Spanish', url: 'https://www.dreamingspanish.com', level: 'A1–C1', note: 'A huge library of videos sorted by difficulty, from speakers of many countries.' },
  { name: 'Easy Spanish', url: 'https://www.youtube.com/@EasySpanish', level: 'A2–C1', note: 'Street interviews with subtitles in Spanish and English, some filmed in Mexico.' },
  { name: 'Butterfly Spanish', url: 'https://www.youtube.com/@ButterflySpanish', level: 'A1–B1', note: 'Lessons from a Mexican teacher, mostly in English. Good for explanations, less so for listening.' },
  { name: 'Lupa', url: 'https://lupa.app', level: 'B1–C1', note: 'An app built on Radio Ambulante episodes, with learner support.' },
  { name: 'Language Reactor', url: 'https://www.languagereactor.com', level: 'Tool', note: 'A browser extension for Netflix and YouTube on a computer: tap a subtitle word to look it up.' },
];
