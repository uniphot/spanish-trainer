// Grammar topics A1. Item mini-language (parsed in views/exercise.js):
//   fill:   "Yo {soy:ser} de Madrid."         {answer|alternative:hint}
//   choice: "Busco a alguien que [sepa*|sabe] inglés."   * marks the correct option
//   fix:    "! Ayer yo [fue>fui] al cine."      learner finds the wrong word and corrects it
//   "~ text" at the end = explanation shown after answering.
// input = structured-input activity (processing instruction): interpret meaning from form first.
export default [
{
  id: 'articulos', level: 'A1', title: 'Género y artículos', en: 'Gender & articles',
  summary: 'el/la/los/las, un/una, the tricky nouns (el problema, la mano, el agua) and al/del.',
  explain: `
<p>Every noun is <b>masculine</b> or <b>feminine</b>. The article agrees with it.</p>
<table><tr><th></th><th>masc.</th><th>fem.</th></tr>
<tr><td>the (sg.)</td><td>el libro</td><td>la mesa</td></tr><tr><td>the (pl.)</td><td>los libros</td><td>las mesas</td></tr>
<tr><td>a / some</td><td>un libro · unos libros</td><td>una mesa · unas mesas</td></tr></table>
<h4>Clues from the ending</h4>
<ul><li><b>-o, -or, -aje, -ma</b> (Greek origin) → usually masculine: <em>el amor, el viaje, el problema, el tema, el sistema, el idioma, el clima, el programa</em>; also <em>el día, el mapa, el planeta</em>.</li>
<li><b>-a, -ción, -sión, -dad, -tad, -tud, -umbre</b> → feminine: <em>la canción, la ciudad, la libertad, la costumbre</em>.</li>
<li>Exceptions to memorise: <em>la mano, la foto, la moto, la radio, la flor</em>.</li></ul>
<h4>Two contractions</h4><p><b>a + el = al</b> (voy al cine) · <b>de + el = del</b> (vengo del trabajo). Never with <em>la</em>: <em>a la playa</em>.</p>
<h4>El agua</h4><p>Feminine nouns starting with a <b>stressed</b> a- use <em>el/un</em> in the singular to avoid "la agua": <em>el agua fría, un águila, el aula</em> — but <em>las aguas, las aulas</em>.</p>
<h4>Where English differs</h4><ul><li>General statements and likes take the article: <em>Me gusta <b>el</b> café. <b>La</b> vida es bella.</em></li>
<li>Professions after <em>ser</em> have no article: <em>Soy profesora</em> (but <em>Es una profesora excelente</em>).</li>
<li>Days: <em>el lunes</em> = on Monday; <em>los lunes</em> = on Mondays.</li></ul>`,
  input: { q: 'Use the article/adjective endings to work out what the sentence refers to.', items: [
    'Compré una camisa y un jersey. La camisa es azul y el otro es negro. Which one is blue? ? the shirt*|the sweater ~ "La camisa" — feminine article.',
    'Tengo un perro y una gata. La pequeña se llama Luna. Who is Luna? ? the dog|the cat* ~ "La pequeña" is feminine → la gata.',
    'Hay un libro y una revista en la mesa. Dámela, por favor. What do they want? ? the book|the magazine* ~ "-la" = feminine → la revista.',
    'El lunes voy al gimnasio. When? ? this coming Monday*|every Monday ~ "el lunes" = on (this) Monday; "los lunes" = on Mondays.',
    'Los martes como con mi abuela. When? ? next Tuesday|every Tuesday* ~ Plural "los martes" = habitual.',
  ] },
  items: [
    '{El} problema es más complicado de lo que parece. ~ Words in -ma of Greek origin are masculine: el problema, el tema, el sistema.',
    'Necesito [un*|una] mapa de la ciudad. ~ El mapa is masculine despite the -a.',
    '{La} canción que más me gusta es de Rosalía. ~ -ción nouns are feminine.',
    '{El} día que nos conocimos llovía muchísimo. ~ El día — masculine exception.',
    'Siempre tengo frío en {las} manos. ~ La mano is feminine despite the -o.',
    '{El} agua del mar está fría en junio. ~ Stressed a- feminine nouns take "el" in the singular: el agua.',
    'Esta noche vamos {al} cine. ~ a + el = al.',
    'Vuelvo {del} trabajo a las seis. ~ de + el = del.',
    '! Me encanta [la>el] clima de Valencia. ~ El clima is masculine (-ma).',
    'Estudio en {una} universidad muy antigua. ~ -dad nouns are feminine.',
    'Le compré {unas} flores a mi madre. ~ La flor is feminine → unas flores.',
    '[El*|La] coche de mi padre tiene veinte años. ~ Coche is masculine.',
    '! Estas son las fotos de [los>las] vacaciones. ~ Las vacaciones is feminine plural.',
    '[El*|La] idioma más difícil para mí es el alemán. ~ El idioma — masculine (-ma).',
    '{La} moto de Carlos es nueva. ~ La moto (short for la motocicleta).',
    '[El*|En el] lunes tengo un examen. ~ "El lunes" already means "on Monday" — no preposition.',
    'Me gusta mucho {el} fútbol. ~ Likes and general statements take the article: me gusta el fútbol.',
    '[El*|La] sistema educativo ha cambiado mucho. ~ El sistema — masculine.',
    '! Mi madre es [un>una] buena profesora. ~ Article agrees with the feminine noun: una profesora.',
    'Mi padre es [médico*|un médico]. ~ No article with professions after ser (unless there is an adjective).',
    '{La} ciudad está llena de turistas en verano.',
    'Voy {a la} playa todos los domingos. ~ No contraction with la: a la playa.',
    'Abre {la} ventana, por favor, hace calor.',
    '{Los} jueves tengo clase de baile. ~ Los + day = every Thursday.',
    'Los niños están en {el} aula 3. ~ El aula (stressed a-), but las aulas.',
  ],
},
{
  id: 'plurales', level: 'A1', title: 'Plural y concordancia', en: 'Plurals & adjective agreement',
  summary: 'How to make plurals (-s, -es, -z → -ces) and make adjectives agree.',
  explain: `
<h4>Plural of nouns</h4>
<ul><li>Vowel → <b>-s</b>: casa → casas, café → cafés.</li><li>Consonant → <b>-es</b>: ciudad → ciudades, árbol → árboles.</li>
<li><b>-z → -ces</b>: lápiz → lápices, vez → veces, luz → luces.</li>
<li>Accent changes: canción → canciones, inglés → ingleses (the stress stays put, so the tilde disappears); joven → <b>jóvenes</b>, examen → <b>exámenes</b> (tilde appears).</li>
<li>Unstressed -s words don't change: el lunes → los lunes, la crisis → las crisis.</li></ul>
<h4>Adjectives agree in gender and number</h4>
<table><tr><th>ending</th><th>m sg</th><th>f sg</th><th>m pl</th><th>f pl</th></tr>
<tr><td>-o</td><td>alto</td><td>alta</td><td>altos</td><td>altas</td></tr>
<tr><td>-e / consonant</td><td>grande / fácil</td><td>grande / fácil</td><td>grandes / fáciles</td><td>grandes / fáciles</td></tr>
<tr><td>nationality / -or</td><td>español · trabajador</td><td>española · trabajadora</td><td>españoles</td><td>españolas</td></tr></table>
<p>A mixed group takes the <b>masculine plural</b>: <em>Juan y María son simpáticos.</em></p>
<p>Adjectives usually go <b>after</b> the noun: <em>un coche rojo</em>. <em>Bueno/malo</em> shorten before masculine singular nouns: <em>un buen día, un mal momento</em>; <em>grande → gran</em> before any singular noun: <em>una gran ciudad</em> (= great).</p>`,
  input: { q: 'Which noun does the adjective describe?', items: [
    'Tengo un hermano y dos hermanas, todas muy altas. Who is tall? ? only the sisters*|everyone ~ "todas altas" is feminine plural → only the sisters.',
    'Compramos pan y fruta fresca. What is fresh? ? the bread and fruit|only the fruit* ~ "fresca" is feminine singular → la fruta.',
    'Juan y Marta son muy simpáticos. Who is nice? ? only Juan|both* ~ Mixed groups take the masculine plural.',
    'Hay un sofá y unas sillas nuevas. What is new? ? the sofa|the chairs* ~ "nuevas" — feminine plural → las sillas.',
  ] },
  items: [
    'Tengo dos {lápices:lápiz} en la mochila. ~ -z → -ces.',
    'Las {ciudades:ciudad} españolas son muy diferentes. ~ Consonant → -es.',
    'Hoy tenemos tres {exámenes:examen}. ~ examen → exámenes: the plural becomes esdrújula, so it needs a tilde.',
    'Me encantan las {canciones:canción} de los años 80. ~ canción → canciones: no tilde needed in the plural.',
    'Mis amigos son muy {simpáticos:simpático}.',
    'Ana y Lucía son {altas:alto}. ~ Feminine plural.',
    'Pedro y Elena son {trabajadores:trabajador}. ~ Mixed group → masculine plural.',
    'Las chicas {inglesas:inglés} viven en el tercero. ~ Nationalities in consonant add -a in the feminine.',
    'Tengo una camisa azul y dos pantalones {grises:gris}. ~ gris doesn\'t change for gender; plural -es.',
    'Es una {gran:grande} ciudad. ~ grande → gran before a singular noun (meaning "great").',
    'Hoy hace un {buen:bueno} día. ~ bueno → buen before a masculine singular noun.',
    '! Las montañas son muy [alto>altas]. ~ Adjective must agree: las montañas altas.',
    '! Tengo dos [ojo>ojos] azules. ~ Plural noun: ojos.',
    'Los {jóvenes:joven} de hoy usan mucho el móvil. ~ joven → jóvenes (now esdrújula → tilde).',
    'Las {luces:luz} de la casa están apagadas.',
    'Mis padres son muy [simpático|simpáticos*|simpáticas].',
    'La comida está [rico|rica*|ricos] ~ La comida → feminine singular.',
    'Tengo clase todos los {lunes}. ~ Unstressed -s: el lunes → los lunes.',
    '! Es una chica muy [inteligenta>inteligente]. ~ Adjectives in -e don\'t change for gender.',
    'Unos zapatos {caros:caro} no siempre son buenos.',
    'Compré unas naranjas muy {dulces:dulce}.',
    'Esta es una {mala:malo} noticia. ~ Feminine: mala (malo → mal only before masculine singular nouns).',
  ],
},
{
  id: 'ser-estar-1', level: 'A1', title: 'Ser y estar (1)', en: 'Ser vs. estar — basics',
  summary: 'Identity, origin, profession, time → ser. Location, condition, feelings → estar.',
  explain: `
<p>Both mean "to be", but they answer different questions.</p>
<table><tr><th>SER — what something <i>is</i></th><th>ESTAR — how / where something <i>is</i></th></tr>
<tr><td>Identity, name: <em>Soy Laura.</em></td><td>Location: <em>Estoy en casa. Madrid está en el centro.</em></td></tr>
<tr><td>Origin, nationality: <em>Es de Chile.</em></td><td>Temporary state, mood: <em>Estoy cansado. Está enfadada.</em></td></tr>
<tr><td>Profession: <em>Somos médicos.</em></td><td>Result of a change: <em>La puerta está abierta.</em></td></tr>
<tr><td>Characteristics: <em>Es alto, es simpática.</em></td><td>With <b>bien / mal</b>: <em>Está bien.</em></td></tr>
<tr><td>Time, date, price total: <em>Son las tres. Hoy es lunes.</em></td><td>With gerund: <em>Estoy comiendo.</em></td></tr>
<tr><td>Material, possession: <em>Es de madera. Es mío.</em></td><td>Weather states: <em>Está nublado.</em></td></tr></table>
<p><b>Trap:</b> location of <i>events</i> uses ser: <em>La fiesta <b>es</b> en mi casa</em> (= takes place).</p>
<table><tr><th></th><th>ser</th><th>estar</th></tr>
<tr><td>yo</td><td>soy</td><td>estoy</td></tr><tr><td>tú</td><td>eres</td><td>estás</td></tr><tr><td>él/ella/usted</td><td>es</td><td>está</td></tr>
<tr><td>nosotros</td><td>somos</td><td>estamos</td></tr><tr><td>vosotros</td><td>sois</td><td>estáis</td></tr><tr><td>ellos/ustedes</td><td>son</td><td>están</td></tr></table>`,
  input: { q: 'What is the speaker telling us?', items: [
    'Carlos está muy nervioso. ? Carlos is a nervous person|Carlos is nervous right now* ~ estar = current state.',
    'Carlos es muy nervioso. ? Carlos is a nervous person*|Carlos is nervous right now ~ ser = characteristic.',
    'La sopa está fría. ? The soup has gone cold*|It\'s a cold soup (gazpacho-type) ~ estar = state at this moment.',
    'El concierto es en el parque. ? The concert takes place in the park*|The concert tickets are in the park ~ Events use ser for location.',
    'Mi hermana está guapa hoy. ? She is a beautiful person|She looks beautiful today* ~ estar + adjective = how someone looks/seems now.',
  ] },
  items: [
    'Yo {soy:ser} de Buenos Aires, pero vivo en Madrid. ~ Origin → ser.',
    'Mis padres {están:estar} en Italia de vacaciones. ~ Location of people → estar.',
    'Mi hermana {es:ser} enfermera. ~ Profession → ser.',
    'Hoy {estoy:estar} muy cansado; trabajé diez horas. ~ Temporary state → estar.',
    '¿Qué hora {es:ser}? — {Son:ser} las cuatro y media. ~ Time → ser (plural "son" for hours except la una).',
    'La biblioteca {está:estar} al lado del banco. ~ Location of a place/thing → estar.',
    'Nosotros {somos:ser} estudiantes de español.',
    'La mesa {es:ser} de madera. ~ Material → ser de.',
    '¿Cómo {estás:estar}? — Bien, gracias. ~ How are you → estar.',
    'La fiesta {es:ser} en casa de Marta. ~ Events take place → ser.',
    'Este coche {es:ser} de mi padre. ~ Possession → ser de.',
    'La puerta {está:estar} cerrada. ~ Result of an action → estar + participle.',
    '! Madrid [es>está] en el centro de España. ~ Location of a city → estar.',
    '! Yo [estoy>soy] profesor de matemáticas. ~ Profession → ser.',
    'Ellos [son*|están] muy simpáticos. ~ Personality → ser.',
    'El café [es|está*] frío, ¿me pones otro? ~ The coffee has gone cold → state → estar.',
    'Hoy [es*|está] martes. ~ Days and dates → ser.',
    'Mis abuelos [son|están*] de vacaciones en Cancún. ~ estar de vacaciones (temporary situation).',
    '¿Dónde {están:estar} mis llaves?',
    'Mi novia {es:ser} alta y morena. ~ Physical description → ser.',
    'Ana {está:estar} triste porque su gato está enfermo.',
    'Vosotros {sois:ser} de Sevilla, ¿no? ~ Origin → ser (vosotros: sois).',
    '! El examen [está>es] a las nueve. ~ Time of an event → ser.',
    '¿{Es:ser} usted el señor García? ~ Identity → ser.',
  ],
},
{
  id: 'hay-estar', level: 'A1', title: 'Hay y está(n)', en: 'Hay vs. está/están',
  summary: 'hay = there is/are (new info, indefinite); está = where a specific thing is.',
  explain: `
<p><b>Hay</b> (from <i>haber</i>) introduces the <b>existence</b> of something new. It never changes for plural.</p>
<p class="ex">Hay <b>un</b> banco cerca. · Hay <b>dos</b> farmacias. · Hay <b>mucha</b> gente. · ¿Hay pan?</p>
<p><b>Está / están</b> locates something <b>specific</b> that we already know about.</p>
<p class="ex"><b>El</b> banco está en la plaza. · <b>Mis</b> llaves están en la mesa. · <b>María</b> está en clase.</p>
<table><tr><th>hay + …</th><th>… + está(n)</th></tr><tr><td>un, una, unos, unas, números, mucho, poco, algún, nada, nouns without article</td><td>el, la, los, las, mi, tu, este, names</td></tr></table>
<p>Never <s>hay el…</s> · Past: <em>había</em> (description) / <em>hubo</em> (event) · Future: <em>habrá</em>.</p>`,
  input: { q: 'Is the speaker introducing something new or locating something known?', items: [
    'Hay un restaurante muy bueno en esta calle. ? introducing something new*|locating a known place ~ hay + un = new information.',
    'El restaurante está en esta calle. ? introducing something new|locating a known place* ~ el restaurante = specific, known.',
    'Hay mucha gente en la plaza. ? there are many people*|the people are in the square ~ hay + mucha = existence/quantity.',
  ] },
  items: [
    'En mi barrio {hay} tres supermercados. ~ Existence + number → hay.',
    'El supermercado {está} enfrente del parque. ~ Specific place → está.',
    '¿{Hay} una farmacia por aquí? ~ Asking whether one exists → hay.',
    'Tus gafas {están} encima de la mesa. ~ Specific things → están.',
    '! En la nevera [están>hay] dos botellas de agua. ~ Number + noun → hay.',
    '! [Hay>Está] el Museo del Prado en Madrid. ~ A specific, named place → está: El Museo del Prado está en Madrid.',
    'No {hay} leche; tenemos que comprar. ~ Negative existence → no hay.',
    'Juan no {está}; ha salido. ~ People → estar.',
    'En la clase [hay*|están] veinte estudiantes.',
    'Los estudiantes [hay|están*] en la clase.',
    '¿Dónde {está} la estación, por favor?',
    'En esta ciudad {hay} muchos museos interesantes.',
    'Ayer en la fiesta {había|hubo:haber} mucha gente. ~ Past description → había.',
    '[Hay*|Está] algo raro en este mensaje.',
    'Mañana {habrá:haber} tormentas en el norte. ~ Future of hay → habrá.',
    'Perdone, ¿{hay} un cajero automático cerca?',
    'Mi casa {está} a diez minutos de la playa.',
    '! [Están>Hay] muchas personas esperando el autobús. ~ Quantity (muchas) + noun → hay.',
  ],
},
{
  id: 'presente-reg', level: 'A1', title: 'Presente regular', en: 'Present tense — regular verbs',
  summary: '-ar, -er, -ir endings; uses of the present (habits, now, near future).',
  explain: `
<table><tr><th></th><th>hablar</th><th>comer</th><th>vivir</th></tr>
<tr><td>yo</td><td>habl<b>o</b></td><td>com<b>o</b></td><td>viv<b>o</b></td></tr>
<tr><td>tú</td><td>habl<b>as</b></td><td>com<b>es</b></td><td>viv<b>es</b></td></tr>
<tr><td>él/ella/usted</td><td>habl<b>a</b></td><td>com<b>e</b></td><td>viv<b>e</b></td></tr>
<tr><td>nosotros</td><td>habl<b>amos</b></td><td>com<b>emos</b></td><td>viv<b>imos</b></td></tr>
<tr><td>vosotros</td><td>habl<b>áis</b></td><td>com<b>éis</b></td><td>viv<b>ís</b></td></tr>
<tr><td>ellos/ustedes</td><td>habl<b>an</b></td><td>com<b>en</b></td><td>viv<b>en</b></td></tr></table>
<p>The ending tells you the person, so subject pronouns are usually dropped: <em>Hablo inglés</em> (not <s>Yo hablo</s> unless contrasting).</p>
<h4>Uses</h4><ul><li>Habits & facts: <em>Trabajo en un banco.</em></li><li>Right now (also <i>estar + gerundio</i>): <em>¿Qué haces?</em></li>
<li>Planned near future: <em>Mañana ceno con Ana.</em></li><li>Duration up to now: <em>Vivo aquí <b>desde hace</b> dos años</em> (= I have lived).</li></ul>
<p><b>Usted/ustedes</b> (formal "you") use the 3rd-person forms: <em>¿Usted habla inglés?</em> In Latin America <i>ustedes</i> replaces <i>vosotros</i>.</p>`,
  input: { q: 'Who is doing the action? Listen/read the verb ending.', items: [
    'Trabajamos en el centro. ? I|we*|they ~ -amos = nosotros.',
    'Comen a las tres. ? he|they*|you (tú) ~ -en = ellos/ellas/ustedes.',
    'Vives cerca de aquí. ? you (tú)*|he|I ~ -es (for -ir verbs) = tú.',
    'Habla tres idiomas. ? I|he/she*|you all ~ -a = él/ella/usted.',
    'Escribo muchos correos. ? I*|he|we ~ -o = yo.',
  ] },
  drill: { verbs: ['hablar', 'trabajar', 'estudiar', 'comer', 'beber', 'aprender', 'vivir', 'escribir', 'abrir', 'leer', 'comprar', 'vender', 'recibir', 'escuchar', 'correr'], tenses: ['pres'] },
  items: [
    'Yo {hablo:hablar} inglés y un poco de francés.',
    'Mis padres {viven:vivir} en un pueblo pequeño.',
    '¿Tú {trabajas:trabajar} los fines de semana?',
    'Nosotros {comemos:comer} a las dos normalmente.',
    'Mi hermano {estudia:estudiar} medicina en Salamanca.',
    'Los niños {beben:beber} mucha leche.',
    '¿Usted {escribe:escribir} con ordenador o a mano? ~ usted → 3rd person singular.',
    'Ana y yo {aprendemos:aprender} español juntos. ~ Ana y yo = nosotros.',
    'Vosotros {leéis:leer} mucho, ¿verdad? ~ vosotros: -éis.',
    'El banco {abre:abrir} a las ocho y media.',
    'Mi madre {cocina:cocinar} muy bien.',
    '¿Ustedes {necesitan:necesitar} ayuda? ~ ustedes → 3rd person plural.',
    '! Mis amigos [vive>viven] en Barcelona. ~ Plural subject → -en.',
    '! Nosotros [comprar>compramos] el pan en la panadería. ~ Conjugate: -amos.',
    'Yo [vivo*|vive|vivimos] en Valencia desde hace tres años.',
    'Siempre {desayuno:desayunar} café con tostadas.',
    '¿Qué {bebes:beber} tú?',
    'Ellos {reciben:recibir} muchos regalos en Navidad.',
    'Mi perro {corre:correr} muy rápido.',
    'Los domingos {descansamos:descansar} en casa. ~ Habit.',
    'Estudio español {desde hace} seis meses. ~ Present + desde hace = "have been doing for".',
    '¿Qué {haces:hacer}? — {Escucho:escuchar} música.',
  ],
},
{
  id: 'presente-irr', level: 'A1', title: 'Presente: cambios de raíz', en: 'Present — stem-changing verbs',
  summary: 'e→ie (quiero), o→ue (puedo), e→i (pido), u→ue (juego). Nosotros/vosotros don’t change.',
  explain: `
<p>In these verbs the stressed stem vowel splits. The change happens in all persons <b>except nosotros and vosotros</b> (the "boot").</p>
<table><tr><th></th><th>e → ie<br>querer</th><th>o → ue<br>poder</th><th>e → i<br>pedir</th><th>u → ue<br>jugar</th></tr>
<tr><td>yo</td><td>qu<b>ie</b>ro</td><td>p<b>ue</b>do</td><td>p<b>i</b>do</td><td>j<b>ue</b>go</td></tr>
<tr><td>tú</td><td>qu<b>ie</b>res</td><td>p<b>ue</b>des</td><td>p<b>i</b>des</td><td>j<b>ue</b>gas</td></tr>
<tr><td>él</td><td>qu<b>ie</b>re</td><td>p<b>ue</b>de</td><td>p<b>i</b>de</td><td>j<b>ue</b>ga</td></tr>
<tr><td>nosotros</td><td>queremos</td><td>podemos</td><td>pedimos</td><td>jugamos</td></tr>
<tr><td>vosotros</td><td>queréis</td><td>podéis</td><td>pedís</td><td>jugáis</td></tr>
<tr><td>ellos</td><td>qu<b>ie</b>ren</td><td>p<b>ue</b>den</td><td>p<b>i</b>den</td><td>j<b>ue</b>gan</td></tr></table>
<ul><li><b>e→ie:</b> pensar, empezar, cerrar, entender, preferir, sentir, perder, despertar(se), recomendar</li>
<li><b>o→ue:</b> poder, volver, dormir, contar, encontrar, recordar, costar, almorzar, acostarse, llover</li>
<li><b>e→i</b> (only -ir): pedir, servir, repetir, seguir (sigo), vestirse, elegir (elijo)</li></ul>
<p>Tip: dictionaries often mark them as <i>pensar (ie)</i>, <i>dormir (ue, u)</i>.</p>`,
  input: { q: 'Who is the subject?', items: [
    'Podemos ir mañana. ? I|we*|they ~ No stem change in nosotros: podemos.',
    'Duermen poco. ? we|they*|you (tú) ~ -en + ue in the stem = ellos.',
    'Quieres un café? ? you (tú)*|I|we ~ -es = tú.',
    'Pido la cuenta. ? I*|he|we ~ -o = yo.',
  ] },
  drill: { verbs: ['querer', 'poder', 'pensar', 'empezar', 'entender', 'preferir', 'dormir', 'volver', 'encontrar', 'recordar', 'jugar', 'pedir', 'repetir', 'servir', 'cerrar', 'costar'], tenses: ['pres'] },
  items: [
    'Yo {quiero:querer} aprender a tocar la guitarra.',
    '¿{Puedes:poder} ayudarme con esto?',
    'La película {empieza:empezar} a las nueve.',
    'Nosotros {preferimos:preferir} el tren al avión. ~ nosotros: no stem change.',
    'Los niños {duermen:dormir} diez horas cada noche.',
    'Mi hermano siempre {pide:pedir} pizza.',
    '¿A qué hora {vuelves:volver} a casa?',
    'No {entiendo:entender} lo que dices.',
    '¿Cuánto {cuesta:costar} esta camiseta?',
    'Los sábados {jugamos:jugar} al fútbol. ~ jugar: u→ue, but not in nosotros.',
    'Mis abuelos {juegan:jugar} a las cartas cada tarde.',
    '¿Me {repites:repetir} la pregunta, por favor?',
    '! Nosotros [quieremos>queremos] ir a la playa. ~ No change in nosotros.',
    '! Yo no [recordo>recuerdo] su nombre. ~ recordar: o→ue.',
    'Yo [sigo*|sigue|seguo] estudiando. ~ seguir: e→i, and gu→g before o.',
    '¿Qué {piensas:pensar} de la nueva profesora?',
    'Mi padre {cierra:cerrar} la tienda a las ocho.',
    'Nunca {encuentro:encontrar} las llaves.',
    'En este restaurante {sirven:servir} un menú del día muy bueno.',
    'Vosotros {podéis:poder} venir también. ~ vosotros: no change.',
    'En invierno {llueve:llover} mucho en Galicia.',
    'Yo {almuerzo:almorzar} a la una.',
    '¿Tú {prefieres:preferir} té o café?',
  ],
},
{
  id: 'presente-yo', level: 'A1', title: 'Presente: irregulares', en: 'Present — irregular yo forms & key verbs',
  summary: 'tengo, hago, pongo, salgo, conozco, sé, doy, voy, oigo, digo, vengo…',
  explain: `
<h4>Irregular only in "yo"</h4>
<table><tr><th>-go</th><th>-zco</th><th>others</th></tr>
<tr><td>hacer → ha<b>go</b><br>poner → pon<b>go</b><br>salir → sal<b>go</b><br>traer → trai<b>go</b><br>caer → cai<b>go</b></td>
<td>conocer → cono<b>zco</b><br>conducir → condu<b>zco</b><br>traducir → tradu<b>zco</b><br>parecer → pare<b>zco</b><br>ofrecer → ofre<b>zco</b></td>
<td>saber → <b>sé</b><br>dar → <b>doy</b><br>ver → <b>veo</b><br>caber → <b>quepo</b><br>estar → <b>estoy</b></td></tr></table>
<h4>-go + stem change</h4>
<p><b>tener:</b> tengo, tienes, tiene, tenemos, tenéis, tienen · <b>venir:</b> vengo, vienes, viene, venimos, venís, vienen · <b>decir:</b> digo, dices, dice, decimos, decís, dicen · <b>oír:</b> oigo, oyes, oye, oímos, oís, oyen</p>
<h4>Completely irregular</h4>
<p><b>ir:</b> voy, vas, va, vamos, vais, van · <b>ser:</b> soy, eres, es, somos, sois, son</p>
<h4>saber vs. conocer</h4><p><em>Sé</em> facts and skills (<em>sé nadar, sé dónde vive</em>); <em>conozco</em> people, places, works (<em>conozco a Marta, conozco Lisboa</em>).</p>`,
  input: { q: 'Which verb is this form of?', items: [
    'Hago la cena. ? hacer*|haber ~ hago = yo form of hacer.',
    'Salgo a las ocho. ? salir*|saltar ~ salgo = yo form of salir.',
    'Sé la respuesta. ? ser|saber* ~ sé (with tilde) = I know.',
    'Voy al médico. ? ver|ir* ~ voy = I go.',
    'Veo la tele. ? ver*|venir ~ veo = I see.',
  ] },
  drill: { verbs: ['tener', 'hacer', 'poner', 'salir', 'venir', 'decir', 'conocer', 'saber', 'dar', 'ir', 'ser', 'oír', 'traer', 'conducir', 'ver'], tenses: ['pres'] },
  items: [
    'Yo {hago:hacer} los deberes después de cenar.',
    'Yo {tengo:tener} dos hermanos y una hermana.',
    'Los viernes {salgo:salir} con mis amigos.',
    'No {conozco:conocer} a tu novio.',
    '¿Dónde {pongo:poner} las maletas?',
    'Yo no {sé:saber} nadar muy bien. ~ saber + infinitive = know how to.',
    '{Vengo:venir} de la oficina ahora mismo.',
    'Siempre {digo:decir} la verdad.',
    'Cada mañana {voy:ir} al trabajo en bici.',
    '¿{Tienes:tener} tiempo esta tarde?',
    'Yo te {doy:dar} mi número de teléfono.',
    'Perdona, no te {oigo:oír} bien.',
    'Yo {conduzco:conducir} todos los días.',
    'Mis amigos {vienen:venir} a cenar el sábado.',
    '¿Qué {dice:decir} el profesor?',
    '! Yo [saber>sé] dónde está la estación.',
    '! Yo [conozo>conozco] un restaurante muy bueno. ~ -cer → -zco in yo.',
    '[Conozco*|Sé] muy bien Barcelona. ~ Places → conocer.',
    '[Conoces|Sabes*] cuándo empieza la clase? ~ Information → saber.',
    'Yo {traigo:traer} el postre, ¿vale?',
    'Nosotros {vamos:ir} al cine esta noche.',
    'Yo {traduzco:traducir} documentos del inglés.',
    'Tú {eres:ser} muy paciente.',
  ],
},
{
  id: 'reflexivos', level: 'A1', title: 'Verbos reflexivos', en: 'Reflexive verbs',
  summary: 'me levanto, te duchas, se acuesta… and where the pronoun goes.',
  explain: `
<p>Reflexive verbs carry a pronoun that refers back to the subject: <em>levantarse</em> = to get (oneself) up.</p>
<table><tr><td>yo</td><td><b>me</b> levanto</td><td>nosotros</td><td><b>nos</b> levantamos</td></tr>
<tr><td>tú</td><td><b>te</b> levantas</td><td>vosotros</td><td><b>os</b> levantáis</td></tr>
<tr><td>él/ella/usted</td><td><b>se</b> levanta</td><td>ellos/ustedes</td><td><b>se</b> levantan</td></tr></table>
<h4>Position</h4><ul><li>Before a conjugated verb: <em><b>Me</b> ducho</em>.</li>
<li>Attached to an infinitive or gerund — or before the whole group: <em>Voy a duchar<b>me</b> = <b>Me</b> voy a duchar</em>; <em>Estoy duchándo<b>me</b> = <b>Me</b> estoy duchando</em>.</li>
<li>Attached to affirmative commands: <em>¡Levánta<b>te</b>!</em> (but <em>No <b>te</b> levantes</em>).</li></ul>
<h4>Routine verbs</h4><p>despertarse (ie), levantarse, ducharse, lavarse, vestirse (i), peinarse, acostarse (ue), dormirse (ue), irse, llamarse, sentarse (ie)</p>
<p>With body parts and clothes Spanish uses the article, not a possessive: <em>Me lavo <b>las</b> manos. Se pone <b>el</b> abrigo.</em></p>
<p>Some verbs change meaning: <em>ir</em> (go) / <em>irse</em> (leave); <em>dormir</em> (sleep) / <em>dormirse</em> (fall asleep); <em>llamar</em> (call) / <em>llamarse</em> (be called).</p>`,
  input: { q: 'Who receives the action?', items: [
    'Lava el coche. ? himself|the car* ~ No reflexive pronoun → he washes the car.',
    'Se lava. ? himself*|the car ~ se = himself.',
    'Me llamo Pablo. ? My name is Pablo*|I call Pablo ~ llamarse = to be called.',
    'Me voy. ? I\'m going (somewhere)|I\'m leaving* ~ irse = to leave.',
  ] },
  drill: { verbs: ['levantarse', 'ducharse', 'acostarse', 'despertarse', 'vestirse', 'llamarse', 'sentarse', 'irse', 'dormirse', 'lavarse'], tenses: ['pres'] },
  items: [
    'Yo {me levanto:levantarse} a las siete todos los días.',
    '¿A qué hora {te acuestas:acostarse} normalmente? ~ acostarse: o→ue.',
    'Mi hermana {se ducha:ducharse} por la noche.',
    'Nosotros {nos vestimos:vestirse} muy rápido. ~ vestirse: e→i, but not in nosotros.',
    '¿Cómo {te llamas:llamarse}?',
    'Los niños {se despiertan:despertarse} muy temprano.',
    'Voy a {ducharme:ducharse} antes de salir. ~ Pronoun attached to the infinitive.',
    '{Me|me} voy a acostar temprano hoy. ~ Pronoun before the conjugated verb.',
    '! Yo [levanto>me levanto] a las ocho. ~ levantarse needs the pronoun: me levanto.',
    '! Ella se lava [sus>las] manos. ~ Body parts take the article.',
    'Ya es tarde, {me voy:irse}. ~ irse = to leave.',
    'Siempre {me duermo:dormirse} viendo la tele. ~ dormirse = fall asleep.',
    'Mis padres {se llaman:llamarse} Luis y Carmen.',
    '¿Por qué no {te sientas:sentarse}?',
    '[Me pongo*|Pongo] el abrigo porque hace frío.',
    'Ellos [se*|me|nos] quedan en casa los domingos.',
    'Estoy {peinándome:peinarse} ahora mismo. ~ Gerund + attached pronoun: peinándome (tilde to keep the stress).',
    '¿{Os|os} levantáis temprano en vacaciones? ~ vosotros → os.',
    'Mi abuelo {se afeita:afeitarse} cada mañana.',
  ],
},
{
  id: 'gustar', level: 'A1', title: 'Gustar y verbos similares', en: 'Gustar & similar verbs',
  summary: 'me gusta / me gustan, a mí también / tampoco, encantar, interesar, doler…',
  explain: `
<p><em>Gustar</em> works like "to please": the thing liked is the <b>subject</b>, the person is an indirect object.</p>
<table><tr><th>(a mí)</th><td><b>me</b></td><td rowspan="6">gusta + singular noun / infinitive<br>gustan + plural noun</td></tr>
<tr><th>(a ti)</th><td><b>te</b></td></tr><tr><th>(a él/ella/usted)</th><td><b>le</b></td></tr><tr><th>(a nosotros)</th><td><b>nos</b></td></tr><tr><th>(a vosotros)</th><td><b>os</b></td></tr><tr><th>(a ellos/ustedes)</th><td><b>les</b></td></tr></table>
<p class="ex">Me gusta <b>el</b> chocolate. · Me gusta<b>n</b> los perros. · Nos gusta bailar y cantar (infinitives → singular).</p>
<p><b>A + person</b> adds emphasis or clarifies: <em>A Juan le gusta el jazz.</em> <em>A mí me encanta.</em></p>
<p>Agreeing: <em>—Me gusta. —A mí también / A mí no.</em> · <em>—No me gusta. —A mí tampoco / A mí sí.</em></p>
<p>Same pattern: <b>encantar</b> (love — no <i>mucho</i>), <b>interesar, importar, molestar, doler</b> (me duele la cabeza), <b>parecer</b> (me parece bien), <b>quedar</b> (te queda bien), <b>faltar</b>, <b>apetecer</b>.</p>`,
  input: { q: 'Who likes what?', items: [
    'Le gustan los gatos. ? He/she likes cats*|Cats like him ~ The person is le (indirect object).',
    'A Ana le gusta Pedro. ? Ana likes Pedro*|Pedro likes Ana ~ A Ana = the person who likes.',
    'Nos encanta este bar. ? We love this bar*|This bar loves us ~ nos = to us.',
    'Me duelen los pies. ? My feet hurt*|I hurt my feet ~ doler works like gustar.',
  ] },
  items: [
    'Me {gusta} mucho el cine español. ~ Singular subject → gusta.',
    'Me {gustan} las películas de terror. ~ Plural subject → gustan.',
    '¿Te {gusta} bailar? ~ Infinitive → singular.',
    'A mi madre {le} gustan las flores.',
    'A nosotros {nos} encanta viajar.',
    'A mis amigos {les} interesa la política.',
    '! A mí [gusto>me gusta] el café. ~ The thing liked is the subject: me gusta.',
    '! Me [gusta>gustan] los perros. ~ Plural subject → gustan.',
    '—No me gusta el pescado. —A mí [también|tampoco*]. ~ Agreeing with a negative → tampoco.',
    '—Me encanta este libro. —A mí [también*|tampoco].',
    'Me {duele:doler} la cabeza.',
    'Me {duelen:doler} los ojos de leer tanto.',
    '¿Qué te {parece:parecer} la idea? — Me parece genial.',
    'A Pedro no le {gustan:gustar} nada las verduras.',
    '! Me encanta [mucho>-] la paella. ~ Encantar already means "love a lot": no mucho.',
    '¿A ustedes {les} molesta el ruido?',
    '¿Os {apetece:apetecer} tomar algo?',
    'A ella [le*|la|se] gusta correr por la mañana. ~ Indirect object → le.',
    'Me {faltan:faltar} dos euros para el billete.',
    'Esa camisa te {queda:quedar} muy bien.',
  ],
},
{
  id: 'posesivos', level: 'A1', title: 'Posesivos y demostrativos', en: 'Possessives & demonstratives',
  summary: 'mi/tu/su, nuestro, el mío; este/ese/aquel.',
  explain: `
<h4>Possessive adjectives (before the noun)</h4>
<table><tr><td>mi(s)</td><td>my</td><td>nuestro/a/os/as</td><td>our</td></tr><tr><td>tu(s)</td><td>your</td><td>vuestro/a/os/as</td><td>your (pl.)</td></tr><tr><td>su(s)</td><td>his/her/its/your (usted)</td><td>su(s)</td><td>their/your (ustedes)</td></tr></table>
<p>They agree with the <b>thing possessed</b>, not the owner: <em>Ana y sus hermanos</em>; <em>nuestra casa</em>.</p>
<h4>Possessive pronouns (after the noun / alone)</h4>
<p>mío, tuyo, suyo, nuestro, vuestro, suyo (+ -a, -os, -as): <em>Este libro es <b>mío</b>. — ¿Es tu coche? — No, el mío es rojo.</em></p>
<p>To clarify <i>su</i>: <em>el coche <b>de él / de ella / de usted</b></em>.</p>
<h4>Demonstratives</h4>
<table><tr><th></th><th>near me</th><th>near you</th><th>far from both</th></tr>
<tr><td>m sg / pl</td><td>este / estos</td><td>ese / esos</td><td>aquel / aquellos</td></tr>
<tr><td>f sg / pl</td><td>esta / estas</td><td>esa / esas</td><td>aquella / aquellas</td></tr>
<tr><td>neuter</td><td>esto</td><td>eso</td><td>aquello</td></tr></table>
<p>Neuter <em>esto/eso/aquello</em> refers to unknown things or ideas: <em>¿Qué es esto? Eso es mentira.</em> (No tilde needed on these words today.)</p>`,
  input: { q: 'What does the possessive refer to?', items: [
    'Marta vive con sus padres. ? Marta\'s parents*|their parents (someone else) ~ Most natural reading: her own parents.',
    'Nuestros vecinos son muy amables. ? one neighbour|several neighbours* ~ nuestros = plural possessed thing.',
    'Esta silla está rota, siéntate en aquella. ? a chair far away*|the same chair ~ aquella = far from both speakers.',
  ] },
  items: [
    'Te presento a {mi} novia, Laura.',
    '¿Dónde están {tus} llaves? ~ Plural noun → tus.',
    'Ana vive con {sus} abuelos. ~ su(s) agrees with abuelos.',
    '{Nuestra} casa tiene un jardín pequeño. ~ Agrees with casa (feminine).',
    '¿Es este tu paraguas? — No, el {mío} es negro.',
    'Estos libros no son míos, son {tuyos}.',
    '! [Nuestro>Nuestra] profesora es de Perú. ~ Agrees with profesora.',
    '! Mis hermanos y [mi>mis] padres viven en Lima. ~ Plural → mis.',
    '[Este*|Esta|Esto] ordenador es nuevo.',
    '¿Qué es [este|esto*|esta]? — Es un regalo para ti. ~ Unknown thing → neuter esto.',
    'Mira {aquella} montaña al fondo. ~ Far away → aquella.',
    '¿Me pasas {ese} vaso, por favor? (near you)',
    '{Estas} gafas son de mi madre.',
    '¿Es suya esta maleta, señora? — Sí, es {mía}.',
    'Vosotros y {vuestros} amigos sois bienvenidos.',
    '[Eso*|Ese] que dices no es verdad. ~ Idea → neuter eso.',
    'Un amigo {mío} trabaja en Google. ~ "a friend of mine" → un amigo mío.',
    'En {aquellos} años no había móviles.',
  ],
},
{
  id: 'preguntas', level: 'A1', title: 'Preguntas', en: 'Question words',
  summary: 'qué, cuál, quién, dónde, adónde, de dónde, cuándo, cómo, cuánto, por qué.',
  explain: `
<p>Question words always carry a written accent, and questions open with <b>¿</b>.</p>
<table><tr><td>¿Qué?</td><td>what (+ noun = which)</td><td>¿Qué quieres? ¿Qué libro lees?</td></tr>
<tr><td>¿Cuál / cuáles?</td><td>which one(s) — choosing; with <i>ser</i> = what</td><td>¿Cuál prefieres? ¿Cuál es tu número?</td></tr>
<tr><td>¿Quién / quiénes?</td><td>who</td><td>¿Quiénes son ellos?</td></tr>
<tr><td>¿Dónde? ¿Adónde? ¿De dónde?</td><td>where / where to / where from</td><td>¿Adónde vas? ¿De dónde eres?</td></tr>
<tr><td>¿Cuándo?</td><td>when</td><td>¿Cuándo llegas?</td></tr><tr><td>¿Cómo?</td><td>how / what … like</td><td>¿Cómo es tu ciudad?</td></tr>
<tr><td>¿Cuánto/a/os/as?</td><td>how much / many (agrees)</td><td>¿Cuántas personas?</td></tr><tr><td>¿Por qué?</td><td>why (answer: <i>porque</i>)</td><td>¿Por qué no vienes?</td></tr></table>
<p><b>Qué vs. cuál + ser:</b> <em>¿Qué es un "chiringuito"?</em> (definition) vs. <em>¿Cuál es tu dirección?</em> (one specific item). English "What is your name?" = <em>¿Cuál es tu nombre? / ¿Cómo te llamas?</em></p>
<p>Prepositions go first: <em>¿<b>Con</b> quién vives? ¿<b>De</b> qué hablas? ¿<b>Para</b> qué sirve?</em></p>`,
  input: { q: 'Which answer fits the question?', items: [
    '¿Adónde vas? ? Al supermercado.*|En el supermercado.|Del supermercado. ~ adónde = destination.',
    '¿Cómo es tu hermana? ? Es alta y simpática.*|Está bien, gracias. ~ ser + cómo = description.',
    '¿Cuál es tu correo? ? ana@mail.com*|Un correo es un mensaje. ~ cuál + ser = specific item.',
  ] },
  items: [
    '¿{De dónde} eres? — Soy de Colombia.',
    '¿{Cuántos} años tienes? ~ años is masculine plural → cuántos.',
    '¿{Cuántas} hermanas tienes?',
    '¿{Cuál} es tu número de teléfono? ~ ser + specific item → cuál.',
    '¿{Qué} es una "tapa"? — Una pequeña porción de comida. ~ Definition → qué.',
    '¿{Por qué} estudias español? — {Porque} quiero vivir en México.',
    '¿{Adónde} vais este verano? — A Portugal.',
    '¿{Quién} es ese chico? — Es mi primo.',
    '¿{Cómo} te llamas?',
    '¿{Cuándo} es tu cumpleaños?',
    '¿Con {quién} vives? — Con dos amigas.',
    '! ¿[Que>Qué] hora es? ~ Question words carry a tilde.',
    '! ¿[Cuánto>Cuántas] personas vienen a la cena? ~ Agrees with personas.',
    '¿[Qué*|Cuál] película quieres ver? ~ qué + noun.',
    '¿[Qué|Cuál*] de estas camisetas te gusta más? ~ choosing from a set → cuál.',
    '¿{Dónde} está el baño, por favor?',
    '¿{Cuánto} cuesta el billete?',
    '¿{Quiénes} son tus mejores amigos? ~ plural → quiénes.',
    '¿De {qué} trabajas? — Soy camarero.',
    '¿{Cómo} es tu casa? — Es pequeña pero muy luminosa.',
  ],
},
{
  id: 'ir-a', level: 'A1', title: 'Ir a, tener que, hay que', en: 'Future plans & obligation',
  summary: 'voy a + infinitive; tener que / hay que / deber; querer/poder + infinitive.',
  explain: `
<h4>Ir a + infinitive (near future, plans)</h4><p class="ex">Voy a estudiar. · ¿Qué vas a hacer el sábado? · Va a llover.</p>
<h4>Obligation</h4><table>
<tr><td><b>tener que</b> + inf.</td><td>personal obligation</td><td>Tengo que trabajar mañana.</td></tr>
<tr><td><b>hay que</b> + inf.</td><td>impersonal, general</td><td>Hay que reservar mesa.</td></tr>
<tr><td><b>deber</b> + inf.</td><td>should / must (advice, duty)</td><td>Debes descansar más.</td></tr>
<tr><td><b>no tener que</b></td><td>don't have to</td><td>No tienes que venir.</td></tr></table>
<p>Careful: <em>tener que</em> needs <b>que</b>; <em>deber</em> takes no preposition (<s>debo de ir</s> = I must be going, probability).</p>
<h4>Other verb + infinitive combos</h4><p>querer, poder, saber, necesitar, preferir, pensar (= intend), esperar + infinitive: <em>Pienso viajar en julio.</em></p>`,
  input: { q: 'What does the speaker mean?', items: [
    'Voy a comprar pan. ? I\'m going to the bakery right now|I plan to buy bread* ~ ir a + inf. = plan/near future.',
    'Hay que llevar pasaporte. ? Someone has a passport|Everyone must bring a passport* ~ hay que = general obligation.',
    'No tienes que pagar. ? You must not pay|You don\'t have to pay* ~ no tener que = no obligation.',
  ] },
  items: [
    'Esta noche {voy a ver:ir a ver} una película. (yo)',
    '¿Qué {vas a hacer:ir a hacer} este fin de semana? (tú)',
    'Mira esas nubes: {va a llover:ir a llover}.',
    'Mañana {tengo que:tener que} levantarme a las seis. (yo)',
    'Para entrar en el museo {hay que} hacer cola.',
    'Nosotros {vamos a:ir a} cenar en un restaurante italiano.',
    '! Yo [tengo>tengo que] estudiar para el examen. ~ tener que + infinitive.',
    '! Mañana voy [-> a] trabajar en casa. ~ ir a + infinitive needs "a".',
    '[Hay que*|Tiene que] tener paciencia para aprender un idioma. ~ General statement → hay que.',
    'Estás muy cansado; [debes*|debes de] dormir más. ~ deber + infinitive = should.',
    'Mis amigos {tienen que:tener que} terminar el proyecto hoy.',
    'No {tienes que:tener que} traer nada; ya tenemos de todo.',
    '¿{Puedes:poder} cerrar la ventana?',
    '{Pienso:pensar} estudiar en el extranjero el año que viene. ~ pensar + infinitive = intend.',
    'Usted {debe:deber} tomar esta pastilla dos veces al día.',
    'Cuidado, ¡te {vas a caer:ir a caer}! ~ ir a for something about to happen.',
    'En España {hay que} pagar el IVA en las compras.',
  ],
},
];
