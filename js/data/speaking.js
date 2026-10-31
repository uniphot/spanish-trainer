// Speaking content: pronunciation units (perception → production), 4/3/2 fluency topics,
// and guided role-plays (respond to a cue in real time; checked by keywords).

export const PRON = [
  {
    id: 'vocales', title: 'Vocales puras', en: 'Pure vowels',
    explain: `<p>Spanish has only <b>five vowels</b>, always short, tense and pure — they never glide like English "no" [noʊ] or "day" [deɪ]. Unstressed vowels keep their full quality: <em>chocolate</em> is cho-co-la-te, not "chocl’t".</p><p>Tip: keep your jaw and lips still while the vowel sounds. Say <em>no</em> with a single, clipped o.</p>`,
    pairs: [['pasa', 'pesa'], ['peso', 'piso'], ['mesa', 'misa'], ['mano', 'mono'], ['puso', 'poso']],
    words: ['casa', 'mesa', 'piso', 'todo', 'uno', 'poco', 'menú', 'chocolate'],
    sentence: 'Ana usa una mesa de pino en su piso.',
  },
  {
    id: 'r-rr', title: 'R y RR', en: 'Tap and trill',
    explain: `<p><b>r</b> between vowels is a single quick <b>tap</b> of the tongue tip behind the teeth — like the "tt" in American <i>butter</i>: <em>pero, caro, para</em>.</p><p><b>rr</b>, and <b>r</b> at the start of a word or after n, l, s, is a <b>trill</b> (several taps): <em>perro, Roma, Enrique, alrededor, Israel</em>.</p><p>Practice: say "edda, edda" fast → "era". For the trill, relax the tongue and let air make it vibrate; start from "tr" (<em>tres</em>).</p>`,
    pairs: [['pero', 'perro'], ['caro', 'carro'], ['cero', 'cerro'], ['para', 'parra'], ['coro', 'corro'], ['foro', 'forro'], ['ahora', 'ahorra']],
    words: ['perro', 'rojo', 'Roma', 'carro', 'alrededor', 'Enrique', 'tres', 'arriba'],
    sentence: 'Erre con erre, cigarro; erre con erre, barril; rápido ruedan los carros cargados de azúcar del ferrocarril.',
  },
  {
    id: 'b-v', title: 'B y V', en: 'b = v',
    explain: `<p><b>b and v are the same sound</b> in Spanish: <em>tubo</em> and <em>tuvo</em> sound identical. Never use an English "v" with your teeth on your lip.</p><p>After a pause or m/n it is a hard [b] (<em>vino, un vaso, ambos</em>); between vowels it softens to [β], lips almost touching (<em>la vaca, uva, beber</em>).</p>`,
    pairs: [],
    words: ['vino', 'beber', 'uva', 'Bilbao', 'un vaso', 'la vaca', 'Barcelona', 'nuevo'],
    sentence: 'Bebo vino blanco en Valencia, y Bárbara vive en Bilbao.',
  },
  {
    id: 'd', title: 'La D suave', en: 'Soft d',
    explain: `<p>At the start and after n/l, <b>d</b> is like English d but with the tongue touching the <i>back of the teeth</i> (<em>dos, donde</em>). Between vowels and at the end of words it softens to [ð] — the "th" of <i>this</i>, very light: <em>nada, cada, todo, Madrid, usted</em>.</p><p>In -ado endings many speakers in Spain weaken it further: <em>cansado</em> ≈ cansao (informal).</p>`,
    pairs: [],
    words: ['dedo', 'nada', 'cada', 'todo', 'Madrid', 'ciudad', 'usted', 'verdad'],
    sentence: '¿Dónde está el dedo de David? Todo está nublado en Madrid.',
  },
  {
    id: 'g-j', title: 'G, J y GU', en: 'g vs j',
    explain: `<p><b>j</b> (and <b>g</b> before e, i) is a rasping sound from the back of the mouth [x], like Scottish <i>loch</i>; in the Caribbean and much of Latin America it is softer, like an English h.</p><p><b>g</b> before a, o, u (and in gue, gui) is a hard [g] after a pause or n (<em>gato, tengo</em>); between vowels it softens [ɣ] (<em>agua, lago</em>). In <em>gue, gui</em> the u is silent; with ü it is pronounced: <em>pingüino</em>.</p>`,
    pairs: [['gota', 'jota'], ['higo', 'hijo'], ['paga', 'paja'], ['mago', 'majo']],
    words: ['gato', 'guerra', 'guitarra', 'jamón', 'gente', 'girar', 'ajo', 'agua'],
    sentence: 'El general Jiménez juega al golf en Gijón con su guitarra.',
  },
  {
    id: 'ny', title: 'La Ñ', en: 'ñ',
    explain: `<p><b>ñ</b> is like the "ny" in <i>canyon</i>, but as a single sound: the middle of the tongue presses the palate. It is a different letter from n — <em>cana</em> (grey hair) vs <em>caña</em> (cane, small beer).</p>`,
    pairs: [['cana', 'caña'], ['pena', 'peña'], ['mono', 'moño'], ['una', 'uña'], ['sueno', 'sueño']],
    words: ['España', 'mañana', 'niño', 'pequeño', 'señora', 'compañero', 'montaña', 'año'],
    sentence: 'El niño español sueña con una montaña en España.',
  },
  {
    id: 'll-y-h', title: 'LL, Y y H', en: 'll, y and silent h',
    explain: `<p>For most speakers <b>ll</b> and <b>y</b> sound the same (<i>yeísmo</i>): like a firm English y, sometimes closer to "j" in <i>jam</i>: <em>llamar, calle, yo, playa</em>. In Argentina and Uruguay they sound like "sh" or "zh": <em>yo, calle</em>.</p><p><b>h</b> is always silent: <em>hola, hacer, ahora, hielo</em>.</p>`,
    pairs: [],
    words: ['llamar', 'calle', 'yo', 'playa', 'llave', 'ayer', 'hola', 'ahora'],
    sentence: 'Ayer llovió en la playa y Yolanda llamó desde la calle Hortaleza.',
  },
  {
    id: 'c-z-s', title: 'C, Z y S', en: 'Distinción vs. seseo',
    explain: `<p>In most of <b>Spain</b>, <b>z</b> and <b>c</b> before e/i are pronounced like English "th" in <i>think</i> [θ], different from s: <em>casa</em> (house) ≠ <em>caza</em> (hunt). This is <i>distinción</i>.</p><p>In <b>Latin America</b>, the Canaries and parts of Andalusia they sound like s (<i>seseo</i>): casa = caza. Both are fully correct — choose one and be consistent. The minimal pairs below are distinct only in distinción.</p>`,
    pairs: [['casa', 'caza'], ['cien', 'sien'], ['coser', 'cocer'], ['sumo', 'zumo'], ['masa', 'maza']],
    spainOnly: true,
    words: ['cinco', 'cerveza', 'zapato', 'gracias', 'Zaragoza', 'ciudad', 'cielo', 'azúcar'],
    sentence: 'Cecilia cocina cerezas con azúcar en Zaragoza.',
  },
  {
    id: 'acento', title: 'El acento', en: 'Word stress',
    explain: `<p>Stress changes meaning: <em>papa</em> (potato/pope) vs <em>papá</em> (dad); <em>hablo</em> (I speak) vs <em>habló</em> (he spoke); <em>término / termino / terminó</em>. Spanish stressed syllables are louder and slightly longer, but unstressed vowels are <b>not</b> reduced.</p><p>The written accent tells you where the stress goes — see the accent trainer in Grammar for the rules.</p>`,
    pairs: [['papa', 'papá'], ['ingles', 'inglés'], ['hablo', 'habló'], ['termino', 'terminó'], ['público', 'publicó'], ['esta', 'está'], ['sábana', 'sabana']],
    words: ['teléfono', 'música', 'ciudad', 'árbol', 'examen', 'canción', 'médico', 'difícil'],
    sentence: 'Yo hablo, él habló; yo canto, ella cantó; yo termino, tú terminaste.',
  },
  {
    id: 'diptongos', title: 'Diptongos e hiatos', en: 'Diphthongs & hiatus',
    explain: `<p>Two vowels can share one syllable (diphthong: <em>bue-no, ciu-dad, cau-sa</em>) or be split into two (hiatus: <em>dí-a, pa-ís, re-ír</em>). A written accent on i/u breaks the diphthong: <em>continuo</em> (continuous, -nuo) vs <em>continúo</em> (I continue, -nú-o).</p>`,
    pairs: [['continuo', 'continúo'], ['seria', 'sería'], ['hacia', 'hacía'], ['varia', 'varía'], ['secretaria', 'secretaría']],
    words: ['tía', 'día', 'ciudad', 'bueno', 'país', 'reír', 'aula', 'Europa'],
    sentence: 'La tía María vivía en un país con un río, cerca de la ciudad.',
  },
  {
    id: 'enlace', title: 'Enlace entre palabras', en: 'Linking',
    explain: `<p>Spanish is spoken as a continuous chain of syllables, not word by word. A final consonant links to the next vowel (<em>los‿otros</em> → lo-so-tros), and vowels merge across words (<em>mi‿amigo</em> → mia-mi-go; <em>va‿a‿ir</em> → vai-r). This is why speech sounds "fast" — and why dictation of small words is hard.</p><p>Practise saying these phrases as a single word.</p>`,
    pairs: [],
    words: ['los otros', 'mi amigo', 'va a ir', 'de España', '¿qué es esto?', 'en el aula', 'tus hijos', 'está en casa'],
    sentence: 'Mis amigos están en el aula esperando a la otra alumna.',
  },
  {
    id: 'entonacion', title: 'Entonación', en: 'Intonation',
    explain: `<p>Yes/no questions often have <b>the same words</b> as statements; only the melody changes — rising at the end for the question: <em>Viene mañana.</em> ↘ vs <em>¿Viene mañana?</em> ↗. Wh-questions (<em>¿Dónde vives?</em>) usually fall.</p>`,
    pairs: [['Viene mañana.', '¿Viene mañana?'], ['Tienes hambre.', '¿Tienes hambre?'], ['Es tu hermano.', '¿Es tu hermano?'], ['Hablas inglés.', '¿Hablas inglés?']],
    pairLabels: ['statement', 'question'],
    words: ['¿Vienes?', 'Vienes.', '¿Está aquí?', 'Está aquí.', '¿Dónde vives?'],
    sentence: '¿Te gusta el café? Me gusta mucho el café.',
  },
  {
    id: 'ptk', title: 'P, T, K sin aspiración', en: 'Unaspirated p, t, k',
    explain: `<p>English p, t, k at the start of a word come with a puff of air (hold your hand in front of your mouth: "pan"). Spanish <b>p, t, k</b> have <b>no puff</b> — to an English ear they sound almost like b, d, g. Spanish t is also dental (tongue on the back of the teeth).</p><p>Test: hold a sheet of paper in front of your mouth and say <em>papá, tomate, casa</em> — it should barely move.</p>`,
    pairs: [],
    words: ['papá', 'tomate', 'casa', 'Pepe', 'taco', 'Carlos', 'pato', 'tío'],
    sentence: 'Pepe pica papas y Tomás come tacos con tomate.',
  },
];

// 4/3/2 fluency topics: familiar content you can talk about at length.
export const FLUENCY_TOPICS = [
  { level: 'A1', topic: 'Mi familia', prompt: 'Describe your family: who they are, what they are like, what they do.', chunks: ['Tengo…', 'Se llama…', 'Es muy…', 'Trabaja en…', 'Le gusta…', 'Vive en…'] },
  { level: 'A1', topic: 'Un día normal', prompt: 'Describe your typical day from morning to night.', chunks: ['Me levanto a las…', 'Después…', 'Por la tarde…', 'Normalmente…', 'Antes de dormir…', 'Los fines de semana…'] },
  { level: 'A1', topic: 'Mi ciudad', prompt: 'Describe the town or city where you live.', chunks: ['Vivo en…', 'Hay…', 'Está cerca de…', 'Lo que más me gusta es…', 'No hay…', 'Es una ciudad…'] },
  { level: 'A2', topic: 'Mis últimas vacaciones', prompt: 'Tell the story of your last holiday: where, with whom, what happened.', chunks: ['El verano pasado fui a…', 'Estuvimos…', 'Lo mejor fue…', 'Un día…', 'Hacía…', 'Volvimos…'] },
  { level: 'A2', topic: 'Cuando era niño/a', prompt: 'Describe your childhood: where you lived, what you used to do, your friends.', chunks: ['Cuando era pequeño/a…', 'Vivía en…', 'Siempre…', 'Mi mejor amigo/a…', 'Me encantaba…', 'Recuerdo que…'] },
  { level: 'A2', topic: 'Comida y costumbres', prompt: 'Talk about what you eat in a typical week and the food culture where you live.', chunks: ['Para desayunar…', 'Me encanta…', 'No soporto…', 'En mi país…', 'Los domingos…', 'Mi plato favorito es…'] },
  { level: 'B1', topic: 'Una persona que admiro', prompt: 'Describe someone you admire and explain why.', chunks: ['Admiro mucho a…', 'Lo que más me impresiona es…', 'Una vez…', 'Me ha enseñado que…', 'Aunque…', 'Por eso…'] },
  { level: 'B1', topic: 'Mi trabajo o estudios', prompt: 'Explain what you do, what you like and dislike about it, and your plans.', chunks: ['Me dedico a…', 'Lo que más me gusta es…', 'Lo peor es que…', 'En el futuro me gustaría…', 'Espero que…', 'Si pudiera…'] },
  { level: 'B1', topic: 'Una experiencia difícil', prompt: 'Tell about a difficult moment and what you learned from it.', chunks: ['Hace unos años…', 'Al principio…', 'De repente…', 'Me di cuenta de que…', 'Al final…', 'Desde entonces…'] },
  { level: 'B1', topic: 'Aprender idiomas', prompt: 'How do you learn languages? What works and what doesn’t for you?', chunks: ['Lo que mejor me funciona es…', 'Me cuesta…', 'Creo que es importante que…', 'Cuando empecé…', 'Recomendaría…', 'Lo más difícil…'] },
  { level: 'B2', topic: 'La tecnología en nuestras vidas', prompt: 'Has technology made our lives better? Give your opinion with examples.', chunks: ['Por un lado…', 'Por otro lado…', 'No cabe duda de que…', 'Sin embargo…', 'Un ejemplo claro es…', 'En definitiva…'] },
  { level: 'B2', topic: 'Vivir en la ciudad o en el campo', prompt: 'Compare city and countryside life and say where you would choose to live.', chunks: ['Mientras que…', 'A diferencia de…', 'Si tuviera que elegir…', 'Lo que me echa para atrás es…', 'Depende de…', 'A la larga…'] },
  { level: 'B2', topic: 'Un libro, serie o película', prompt: 'Recommend (or criticise) a book, series or film: plot, characters, why.', chunks: ['Trata de…', 'El protagonista…', 'Lo que me enganchó fue…', 'Sin destripar el final…', 'Me pareció…', 'Te la recomiendo si…'] },
  { level: 'C1', topic: 'Turismo masivo', prompt: 'Discuss the effects of mass tourism on cities and what should be done.', chunks: ['Habría que…', 'Cabe plantearse si…', 'No se trata de…, sino de…', 'Las consecuencias…', 'A mi juicio…', 'Siempre y cuando…'] },
  { level: 'C1', topic: 'El trabajo del futuro', prompt: 'How will work change in the next 20 years? What worries or excites you?', chunks: ['Todo apunta a que…', 'Es previsible que…', 'Lo que me inquieta es…', 'Por mucho que…', 'Ahora bien…', 'En última instancia…'] },
];

// Guided role-plays. Each learner turn: an English cue, keyword groups (every group must match one
// alternative), and a model answer. Checking is deliberately lenient: the goal is to get meaning
// across in real time, then compare with the model.
export const ROLEPLAYS = [
  {
    id: 'restaurante', level: 'A1', title: 'En el restaurante', setting: 'You are having dinner with a friend in Madrid.',
    them: 'Camarero', turns: [
      { them: 'Buenas noches. ¿Tienen reserva?', cue: 'Say no, and ask for a table for two.', expect: [['no'], ['mesa'], ['dos', '2']], model: 'No, no tenemos reserva. ¿Tiene una mesa para dos?' },
      { them: 'Sí, claro. Pasen por aquí. ¿Qué quieren beber?', cue: 'Order a bottle of water and a glass of red wine.', expect: [['agua'], ['vino']], model: 'Una botella de agua y una copa de vino tinto, por favor.' },
      { them: '¿Y de primero?', cue: 'Ask what the menu of the day includes.', expect: [['menú', 'menu'], ['día', 'dia']], model: '¿Qué hay en el menú del día?' },
      { them: 'Hoy tenemos gazpacho o ensalada mixta, y de segundo, pollo asado o merluza.', cue: 'Order the gazpacho and the hake (merluza).', expect: [['gazpacho'], ['merluza']], model: 'Para mí, el gazpacho y luego la merluza.' },
      { them: '¿Algo más? ¿Postre, café?', cue: 'Say no thanks, and ask for the bill.', expect: [['no'], ['cuenta']], model: 'No, gracias. ¿Nos trae la cuenta, por favor?' },
      { them: 'Aquí tiene. Son treinta y dos euros.', cue: 'Ask if you can pay by card.', expect: [['tarjeta']], model: '¿Puedo pagar con tarjeta?' },
    ],
  },
  {
    id: 'hotel', level: 'A1', title: 'Llegada al hotel', setting: 'You arrive at a hotel in Buenos Aires.',
    them: 'Recepcionista', turns: [
      { them: 'Buenas tardes, bienvenido. ¿En qué puedo ayudarle?', cue: 'Say you have a reservation in your name.', expect: [['reserva'], ['nombre', 'a nombre']], model: 'Buenas tardes, tengo una reserva a nombre de…' },
      { them: 'Perfecto. Una habitación doble para tres noches, ¿verdad?', cue: 'Confirm, and ask if breakfast is included.', expect: [['sí', 'si', 'correcto', 'eso es'], ['desayuno']], model: 'Sí, eso es. ¿El desayuno está incluido?' },
      { them: 'Sí, el desayuno es de siete a diez en el primer piso.', cue: 'Ask if there is wifi and what the password is.', expect: [['wifi', 'internet'], ['contraseña', 'clave']], model: '¿Hay wifi? ¿Cuál es la contraseña?' },
      { them: 'Sí, la contraseña está en la tarjeta de la habitación. ¿Necesita algo más?', cue: 'Ask what time you have to leave the room on the last day.', expect: [['hora'], ['dejar', 'salir', 'habitación', 'habitacion', 'check']], model: '¿A qué hora tengo que dejar la habitación el último día?' },
      { them: 'Antes de las doce del mediodía. Aquí tiene su llave: habitación 304.', cue: 'Thank them.', expect: [['gracias']], model: 'Muchas gracias, muy amable.' },
    ],
  },
  {
    id: 'direcciones', level: 'A2', title: 'Perdido en la ciudad', setting: 'You are lost in Seville and stop someone in the street.',
    them: 'Señora', turns: [
      { them: '¿Sí? Dígame.', cue: 'Politely ask how to get to the cathedral.', expect: [['perdone', 'disculpe', 'por favor'], ['catedral']], model: 'Perdone, ¿cómo puedo llegar a la catedral?' },
      { them: 'Uy, está un poco lejos. ¿Va andando?', cue: 'Say yes, you are walking, and ask if it is far.', expect: [['sí', 'si'], ['lejos']], model: 'Sí, voy andando. ¿Está muy lejos?' },
      { them: 'Unos veinte minutos. Siga recto por esta calle y, en la segunda, gire a la derecha.', cue: 'Repeat the instructions to check: straight on, second street on the right.', expect: [['recto'], ['segunda'], ['derecha']], model: 'Entonces, sigo recto y en la segunda giro a la derecha, ¿no?' },
      { them: 'Eso es. Luego verá una plaza grande, y la catedral está justo enfrente.', cue: 'Ask if there is a bus that goes there.', expect: [['autobús', 'autobus', 'bus']], model: '¿Hay algún autobús que vaya allí?' },
      { them: 'Sí, el número 5, pero andando se llega antes.', cue: 'Thank her and say you will walk then.', expect: [['gracias'], ['andando', 'caminando', 'a pie']], model: 'Muchas gracias. Entonces voy andando.' },
    ],
  },
  {
    id: 'medico', level: 'A2', title: 'En el médico', setting: 'You are at the doctor’s because you feel unwell.',
    them: 'Médica', turns: [
      { them: 'Buenos días. ¿Qué le pasa?', cue: 'Say your head and throat hurt.', expect: [['duele', 'duelen'], ['cabeza'], ['garganta']], model: 'Me duele la cabeza y me duele la garganta.' },
      { them: '¿Desde cuándo?', cue: 'Say since Monday.', expect: [['desde'], ['lunes']], model: 'Desde el lunes.' },
      { them: '¿Tiene fiebre?', cue: 'Say yes, last night you had 38 degrees.', expect: [['sí', 'si'], ['38', 'treinta y ocho']], model: 'Sí, anoche tenía treinta y ocho de fiebre.' },
      { them: 'Vale. ¿Es alérgico a algún medicamento?', cue: 'Say you are allergic to penicillin.', expect: [['alérgico', 'alérgica', 'alergico', 'alergica', 'alergia'], ['penicilina']], model: 'Sí, soy alérgico a la penicilina.' },
      { them: 'De acuerdo. Le voy a recetar un antiinflamatorio. Descanse y beba mucha agua.', cue: 'Ask how many times a day you have to take it.', expect: [['veces'], ['día', 'dia']], model: '¿Cuántas veces al día tengo que tomarlo?' },
    ],
  },
  {
    id: 'quedar', level: 'A2', title: 'Quedar con una amiga', setting: 'You phone a friend to make plans for the weekend.',
    them: 'Lucía', turns: [
      { them: '¡Hola! ¿Qué tal? ¿Qué haces este fin de semana?', cue: 'Say nothing special, and ask if she wants to go to the cinema on Saturday.', expect: [['cine'], ['sábado', 'sabado']], model: 'Nada especial. ¿Quieres ir al cine el sábado?' },
      { them: 'El sábado no puedo, tengo una boda. ¿Y el domingo?', cue: 'Say Sunday is perfect, and suggest the 7 pm session.', expect: [['domingo'], ['siete', '7']], model: 'El domingo me va perfecto. ¿Qué tal la sesión de las siete?' },
      { them: 'Genial. ¿Dónde quedamos?', cue: 'Suggest meeting at the café in front of the cinema at 6:30.', expect: [['café', 'cafetería', 'cafeteria', 'cafe'], ['seis', '6'], ['media', '30']], model: 'Podemos quedar en la cafetería de enfrente a las seis y media.' },
      { them: 'Perfecto. Oye, ¿sacas tú las entradas?', cue: 'Agree, and say you will buy them online tonight.', expect: [['sí', 'si', 'vale', 'claro'], ['internet', 'online', 'en línea', 'en linea']], model: 'Vale, las saco yo esta noche por internet.' },
    ],
  },
  {
    id: 'devolucion', level: 'B1', title: 'Devolver un producto', setting: 'You bought headphones that don’t work and go back to the shop.',
    them: 'Dependiente', turns: [
      { them: 'Hola, buenas. ¿En qué puedo ayudarle?', cue: 'Explain that you bought these headphones last week and they don’t work.', expect: [['compré', 'compre'], ['semana'], ['no funcionan', 'no funciona', 'no van']], model: 'Compré estos auriculares la semana pasada y no funcionan.' },
      { them: 'Vaya, lo siento. ¿Qué les pasa exactamente?', cue: 'Say the left one doesn’t sound and the battery doesn’t charge.', expect: [['izquierdo'], ['batería', 'bateria'], ['carga']], model: 'El izquierdo no suena y la batería no carga.' },
      { them: '¿Trae el ticket de compra?', cue: 'Say yes, here it is, and that you would like your money back.', expect: [['sí', 'si', 'aquí', 'aqui'], ['dinero', 'devolución', 'devolucion', 'reembolso']], model: 'Sí, aquí lo tiene. Me gustaría que me devolvieran el dinero.' },
      { them: 'Lo siento, pero solo podemos cambiarlos por otros iguales o darle un vale.', cue: 'Insist politely: the product is faulty, so you are entitled to a refund.', expect: [['defectuoso', 'defectuosos', 'no funcionan', 'roto', 'rotos'], ['derecho']], model: 'Entiendo, pero el producto es defectuoso y tengo derecho a que me devuelvan el dinero.' },
      { them: 'Bueno, déjeme que hable con la encargada.', cue: 'Thank them and say you will wait.', expect: [['gracias'], ['espero', 'esperar', 'espera']], model: 'De acuerdo, muchas gracias. Espero aquí.' },
    ],
  },
  {
    id: 'piso-tlf', level: 'B1', title: 'Llamar por un piso', setting: 'You call about a flat advertised online.',
    them: 'Propietario', turns: [
      { them: '¿Diga?', cue: 'Say you are calling about the flat advertised, and ask if it is still available.', expect: [['piso'], ['anuncio'], ['disponible', 'libre']], model: 'Hola, llamo por el anuncio del piso. ¿Sigue disponible?' },
      { them: 'Sí, todavía está libre.', cue: 'Ask whether the bills (gastos) are included in the rent.', expect: [['gastos', 'facturas'], ['incluidos', 'incluido', 'incluye', 'incluyen']], model: '¿Los gastos están incluidos en el alquiler?' },
      { them: 'El agua sí, pero la luz y el gas no. Y piden un mes de fianza.', cue: 'Ask if pets are allowed — you have a small dog.', expect: [['mascotas', 'perro', 'animales'], ['pequeño', 'pequeña']], model: '¿Se admiten mascotas? Es que tengo un perro pequeño.' },
      { them: 'Mmm, en principio no, pero si es pequeño se puede hablar.', cue: 'Ask if you could see the flat tomorrow afternoon.', expect: [['ver'], ['mañana', 'manana'], ['tarde']], model: '¿Podría verlo mañana por la tarde?' },
    ],
  },
  {
    id: 'entrevista', level: 'B2', title: 'Entrevista de trabajo', setting: 'Job interview for a position in a marketing team.',
    them: 'Entrevistadora', turns: [
      { them: 'Para empezar, háblenos un poco de usted y de su experiencia.', cue: 'Say you have worked for five years in marketing, mainly in digital campaigns.', expect: [['cinco', '5'], ['años'], ['marketing'], ['digital', 'digitales']], model: 'Llevo cinco años trabajando en marketing, sobre todo en campañas digitales.' },
      { them: '¿Por qué le interesa este puesto?', cue: 'Say you are looking for a bigger challenge and you like the company’s projects.', expect: [['reto', 'desafío', 'desafio'], ['proyectos', 'empresa']], model: 'Busco un reto mayor y me encantan los proyectos que desarrolla la empresa.' },
      { them: '¿Cuál diría que es su principal debilidad?', cue: 'Say that sometimes you find it hard to delegate, but you are working on it.', expect: [['cuesta', 'difícil', 'dificil'], ['delegar'], ['trabajando', 'mejorar', 'mejorando']], model: 'A veces me cuesta delegar, aunque estoy trabajando en ello.' },
      { them: 'Si le ofreciéramos el puesto, ¿cuándo podría incorporarse?', cue: 'Say you could start in a month, after giving notice at your current job.', expect: [['mes'], ['empezar', 'incorporarme', 'incorporar']], model: 'Podría incorporarme en un mes, después de avisar en mi trabajo actual.' },
      { them: '¿Tiene alguna pregunta para nosotros?', cue: 'Ask what a typical day in the team would be like.', expect: [['día', 'dia'], ['equipo']], model: '¿Cómo sería un día normal en el equipo?' },
    ],
  },
];

// Scenarios for the free AI conversation partner.
export const AI_SCENARIOS = [
  { id: 'charla', level: 'A1', title: 'Getting to know someone', prompt: 'You are Marta, a friendly 30-year-old from Valencia meeting the learner at a language exchange. Ask about their life, work, hobbies and plans.' },
  { id: 'bar', level: 'A2', title: 'Ordering tapas in a bar', prompt: 'You are a busy but friendly waiter in a tapas bar in Granada. Take the learner’s order, recommend dishes, answer questions about ingredients.' },
  { id: 'viaje', level: 'A2', title: 'Planning a trip together', prompt: 'You are the learner’s friend Diego from Mexico City. You are planning a week-long trip together in Mexico; discuss destinations, dates, budget and transport.' },
  { id: 'casero', level: 'B1', title: 'Problem with the landlord', prompt: 'You are the learner’s landlord, slightly defensive. The learner calls about a broken boiler; negotiate when and how it will be fixed.' },
  { id: 'debate', level: 'B2', title: 'Friendly debate', prompt: 'You are a well-informed friend who enjoys debating. Pick a current but non-polarising topic (e.g. remote work, tourism, social media) and politely challenge the learner’s opinions with counter-arguments.' },
  { id: 'entrevista-ia', level: 'B2', title: 'Job interview', prompt: 'You are an HR interviewer at a Spanish company. Interview the learner for a job in their field; ask follow-up questions and competency questions.' },
  { id: 'cultura', level: 'C1', title: 'Culture & society chat', prompt: 'You are a curious Argentine journalist. Discuss culture, literature, cities and society with the learner, using rich idiomatic language and asking for their views.' },
];
