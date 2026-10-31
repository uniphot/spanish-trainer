// Writing tasks. Requirements are checked live by core/analyzer.js:
//   { t: 'tense', tense: 'pret', min: 3 }   { t: 'mood', mood: 'subj', min: 2 }
//   { t: 'connectors', min: 3 }             { t: 'any', words: ['querida', 'querido'], label: '…' }
export const TASKS = [
  { id: 'presentate', level: 'A1', genre: 'Email', title: 'Preséntate', min: 50, max: 100,
    prompt: 'Write an email to a new language-exchange partner. Say your name, age, where you are from, where you live, what you do and what you like.',
    reqs: [{ t: 'any', words: ['hola', 'querido', 'querida'], label: 'Greeting (Hola… / Querido/a…)' }, { t: 'any', words: ['me llamo', 'soy'], label: 'Say who you are' }, { t: 'any', words: ['me gusta', 'me encanta', 'me gustan'], label: 'Say what you like (me gusta…)' }, { t: 'any', words: ['un abrazo', 'saludos', 'besos', 'hasta pronto', 'un saludo'], label: 'Closing (Un abrazo, Saludos…)' }] },
  { id: 'rutina', level: 'A1', genre: 'Description', title: 'Mi rutina', min: 60, max: 120,
    prompt: 'Describe a typical weekday from morning to night.',
    reqs: [{ t: 'any', words: ['me levanto', 'me despierto', 'me ducho', 'me acuesto'], label: 'At least one reflexive verb (me levanto…)' }, { t: 'any', words: ['después', 'luego', 'más tarde'], label: 'Sequence words (después, luego…)' }, { t: 'tense', tense: 'pres', min: 6, label: '6+ verbs in the present' }] },
  { id: 'ciudad', level: 'A1', genre: 'Description', title: 'Mi barrio', min: 60, max: 120,
    prompt: 'Describe your neighbourhood: what there is, where things are, what you like and don’t like.',
    reqs: [{ t: 'any', words: ['hay'], label: 'Use “hay”' }, { t: 'any', words: ['está', 'están'], label: 'Locate something with “está/están”' }, { t: 'any', words: ['pero'], label: 'Contrast with “pero”' }] },
  { id: 'fin-de-semana', level: 'A2', genre: 'Narrative', title: 'El fin de semana pasado', min: 80, max: 150,
    prompt: 'Tell a friend what you did last weekend: where you went, with whom, what happened and how it was.',
    reqs: [{ t: 'tense', tense: 'pret', min: 5, label: '5+ verbs in the pretérito indefinido' }, { t: 'any', words: ['el sábado', 'el domingo', 'el viernes'], label: 'Time expressions (el sábado…)' }, { t: 'connectors', min: 2, label: '2+ connectors' }] },
  { id: 'nino', level: 'A2', genre: 'Narrative', title: 'Cuando era niño/a', min: 80, max: 150,
    prompt: 'Describe your childhood: where you lived, what you were like, what you used to do.',
    reqs: [{ t: 'tense', tense: 'impf', min: 5, label: '5+ verbs in the imperfecto' }, { t: 'any', words: ['siempre', 'todos los días', 'a menudo', 'normalmente', 'cada'], label: 'Frequency expressions' }] },
  { id: 'invitacion', level: 'A2', genre: 'Message', title: 'Una invitación', min: 60, max: 120,
    prompt: 'Invite a friend to your birthday party: say when and where, what you will do, and ask them to confirm.',
    reqs: [{ t: 'any', words: ['vas a', 'vamos a', 'voy a', 'va a'], label: 'Plans with “ir a + infinitive”' }, { t: 'any', words: ['¿'], label: 'At least one question (¿…?)' }, { t: 'any', words: ['a las'], label: 'A time (a las…)' }] },
  { id: 'queja-hotel', level: 'A2', genre: 'Formal email', title: 'Una queja al hotel', min: 80, max: 150,
    prompt: 'You stayed at a hotel and several things went wrong. Write to the manager explaining the problems and what you would like.',
    reqs: [{ t: 'any', words: ['estimado', 'estimada', 'estimados'], label: 'Formal greeting (Estimado/a…)' }, { t: 'any', words: ['usted', 'ustedes', 'le ', 'les '], label: 'Formal address (usted)' }, { t: 'tense', tense: 'pret', min: 3, label: '3+ verbs in the past' }, { t: 'any', words: ['atentamente', 'un cordial saludo', 'saludos cordiales'], label: 'Formal closing (Atentamente…)' }] },
  { id: 'viaje-recuerdo', level: 'B1', genre: 'Narrative', title: 'Un viaje inolvidable', min: 120, max: 200,
    prompt: 'Tell the story of an unforgettable trip: set the scene, narrate what happened, and say how you felt.',
    reqs: [{ t: 'tense', tense: 'pret', min: 4, label: '4+ indefinido (events)' }, { t: 'tense', tense: 'impf', min: 3, label: '3+ imperfecto (background)' }, { t: 'connectors', min: 3, label: '3+ connectors' }] },
  { id: 'consejos', level: 'B1', genre: 'Email', title: 'Consejos para un amigo', min: 100, max: 180,
    prompt: 'A friend is moving to your city and is worried. Write giving advice about housing, work and making friends.',
    reqs: [{ t: 'mood', mood: 'subj', min: 2, label: '2+ subjunctives (te recomiendo que…, es importante que…)' }, { t: 'tense', tense: 'cond', min: 1, label: 'Conditional for advice (yo que tú, deberías…)' }, { t: 'mood', mood: 'imp', min: 1, label: 'At least one command' }] },
  { id: 'opinion-redes', level: 'B1', genre: 'Opinion', title: 'Las redes sociales', min: 120, max: 200,
    prompt: 'Do social networks bring people together or push them apart? Give your opinion with examples.',
    reqs: [{ t: 'any', words: ['creo que', 'pienso que', 'en mi opinión', 'me parece que', 'desde mi punto de vista'], label: 'Express opinion' }, { t: 'any', words: ['no creo que', 'no pienso que', 'dudo que'], label: 'A negated opinion + subjunctive' }, { t: 'connectors', min: 4, label: '4+ connectors' }] },
  { id: 'carta-futuro', level: 'B1', genre: 'Letter', title: 'Carta a tu yo del futuro', min: 100, max: 180,
    prompt: 'Write to yourself in ten years: what you hope you will have done, what you expect, what you hope will have changed.',
    reqs: [{ t: 'tense', tense: 'fut', min: 3, label: '3+ verbs in the future' }, { t: 'any', words: ['espero que', 'ojalá', 'deseo que'], label: 'Wishes with espero que / ojalá' }] },
  { id: 'resena', level: 'B2', genre: 'Review', title: 'Reseña de una película o serie', min: 150, max: 250,
    prompt: 'Write a review of a film or series: plot (without spoilers), characters, strengths and weaknesses, and who you would recommend it to.',
    reqs: [{ t: 'connectors', min: 5, label: '5+ connectors' }, { t: 'any', words: ['aunque', 'a pesar de', 'si bien', 'sin embargo', 'no obstante'], label: 'A concession or contrast' }, { t: 'mood', mood: 'subj', min: 1, label: 'At least one subjunctive' }] },
  { id: 'carta-formal', level: 'B2', genre: 'Formal letter', title: 'Carta al ayuntamiento', min: 150, max: 250,
    prompt: 'Write to the town council about a problem in your area (noise, transport, green spaces). Describe it, explain its effects and propose solutions.',
    reqs: [{ t: 'any', words: ['me dirijo a usted', 'me dirijo a ustedes', 'por medio de la presente', 'les escribo'], label: 'Formal opening' }, { t: 'mood', mood: 'subj', min: 2, label: '2+ subjunctives (sería conveniente que…)' }, { t: 'connectors', min: 5, label: '5+ connectors' }] },
  { id: 'si-pudiera', level: 'B2', genre: 'Hypothesis', title: 'Si pudiera cambiar algo…', min: 120, max: 220,
    prompt: 'If you could change one thing about the world (or your country, or your city), what would it be and how would things be different?',
    reqs: [{ t: 'tense', tense: 'isubj', min: 2, label: '2+ imperfect subjunctives (si pudiera…)' }, { t: 'tense', tense: 'cond', min: 3, label: '3+ conditionals' }] },
  { id: 'ensayo-trabajo', level: 'B2', genre: 'Essay', title: 'El teletrabajo', min: 180, max: 280,
    prompt: 'Essay: advantages and disadvantages of working from home. Conclude with your own position.',
    reqs: [{ t: 'any', words: ['por un lado', 'por otro lado', 'en primer lugar'], label: 'Organise (por un lado… por otro…)' }, { t: 'any', words: ['en conclusión', 'en definitiva', 'en resumen', 'para concluir'], label: 'Conclusion marker' }, { t: 'connectors', min: 6, label: '6+ connectors' }] },
  { id: 'ensayo-turismo', level: 'C1', genre: 'Essay', title: 'Turismo y ciudades', min: 220, max: 350,
    prompt: 'Essay: mass tourism brings money but transforms cities. Discuss the dilemma and propose measures.',
    reqs: [{ t: 'connectors', min: 8, label: '8+ connectors' }, { t: 'mood', mood: 'subj', min: 3, label: '3+ subjunctives' }, { t: 'any', words: ['cabe', 'no obstante', 'ahora bien', 'si bien', 'en cambio'], label: 'Advanced connector (no obstante, ahora bien…)' }] },
  { id: 'articulo-opinion', level: 'C1', genre: 'Opinion column', title: 'Columna de opinión', min: 220, max: 350,
    prompt: 'Write an opinion column on a topic you care about. Use a hook, argue with nuance, anticipate a counter-argument and close memorably.',
    reqs: [{ t: 'connectors', min: 8, label: '8+ connectors' }, { t: 'any', words: ['se dirá que', 'cabría objetar', 'podría pensarse', 'hay quien', 'algunos dirán'], label: 'Anticipate a counter-argument' }, { t: 'mood', mood: 'subj', min: 3, label: '3+ subjunctives' }] },
];

export const JOURNAL_PROMPTS = [
  '¿Qué has hecho hoy? Cuenta tu día.', '¿Qué te ha hecho sonreír esta semana?', 'Describe el lugar donde estás ahora mismo.',
  '¿Qué planes tienes para el fin de semana?', 'Habla de una comida que te encanta y por qué.', '¿Qué has aprendido esta semana (de cualquier cosa)?',
  'Describe a una persona que has visto hoy.', '¿Qué harías si tuvieras un día libre mañana?', 'Cuenta un recuerdo de tu infancia.',
  '¿Qué te preocupa últimamente? ¿Qué puedes hacer al respecto?', 'Escribe sobre una canción, libro o serie que te guste.', '¿Cómo sería tu día perfecto?',
];

export const QUICKWRITE_TOPICS = ['Mi casa', 'Mi mejor amigo/a', 'La comida de mi país', 'Mis vacaciones ideales', 'Mi trabajo o mis estudios', 'Un día de lluvia',
  'Lo que hice ayer', 'Mi ciudad favorita', 'El deporte', 'Los animales', 'La música en mi vida', 'Mis planes para este año'];

// Connectors by level (used in analysis and requirements).
export const CONNECTORS = {
  A1: ['y', 'pero', 'porque', 'también', 'o'],
  A2: ['después', 'luego', 'entonces', 'cuando', 'por eso', 'además', 'primero', 'al final', 'mientras', 'así que', 'por ejemplo'],
  B1: ['sin embargo', 'aunque', 'por lo tanto', 'en cambio', 'por un lado', 'por otro lado', 'en primer lugar', 'finalmente', 'ya que', 'es decir', 'de hecho', 'a pesar de', 'en resumen', 'como consecuencia', 'mientras que', 'sobre todo', 'por último'],
  B2: ['no obstante', 'por consiguiente', 'puesto que', 'dado que', 'en definitiva', 'en conclusión', 'asimismo', 'en cuanto a', 'de modo que', 'a no ser que', 'siempre que', 'por el contrario', 'en realidad', 'en otras palabras', 'debido a'],
  C1: ['ahora bien', 'si bien', 'con todo', 'aun así', 'en suma', 'cabe destacar', 'dicho esto', 'a fin de cuentas', 'en lo que respecta a', 'habida cuenta de', 'es más', 'por ende', 'de ahí que'],
};

// Overused words → richer alternatives.
export const SYNONYMS = {
  muy: ['realmente', 'sumamente', 'bastante', 'extremadamente'], cosa: ['asunto', 'aspecto', 'tema', 'cuestión'], cosas: ['asuntos', 'aspectos', 'temas'],
  bueno: ['estupendo', 'excelente', 'agradable', 'positivo'], buena: ['estupenda', 'excelente', 'agradable', 'positiva'], malo: ['terrible', 'desagradable', 'perjudicial'],
  hacer: ['realizar', 'llevar a cabo', 'preparar', 'elaborar'], decir: ['comentar', 'afirmar', 'explicar', 'contar'], dice: ['comenta', 'afirma', 'explica', 'cuenta'],
  tener: ['contar con', 'disponer de', 'poseer'], tiene: ['cuenta con', 'dispone de', 'posee'], grande: ['enorme', 'amplio', 'considerable'],
  importante: ['fundamental', 'esencial', 'clave', 'crucial'], interesante: ['fascinante', 'atractivo', 'curioso', 'apasionante'],
  bonito: ['precioso', 'encantador', 'hermoso'], bonita: ['preciosa', 'encantadora', 'hermosa'], pero: ['sin embargo', 'no obstante', 'aunque'],
  también: ['además', 'asimismo', 'igualmente'], mucho: ['bastante', 'enormemente', 'considerablemente'], mucha: ['bastante', 'gran'], muchos: ['numerosos', 'gran cantidad de'], muchas: ['numerosas', 'gran cantidad de'],
  gente: ['personas', 'ciudadanos', 'población'], después: ['luego', 'más tarde', 'a continuación'], problema: ['dificultad', 'inconveniente', 'obstáculo'],
};
