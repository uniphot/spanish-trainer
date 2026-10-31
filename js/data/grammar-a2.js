// Grammar topics A2 (see grammar-a1.js for the item mini-language).
export default [
{
  id: 'estar-gerundio', level: 'A2', title: 'Estar + gerundio', en: 'Present progressive',
  summary: 'estoy hablando, está comiendo; irregular gerunds (leyendo, durmiendo, diciendo).',
  explain: `
<p><b>estar + gerundio</b> = an action in progress <i>right now</i> or around now.</p>
<p class="ex">¿Qué estás haciendo? — Estoy cocinando. · Este mes estoy trabajando mucho.</p>
<h4>Gerund</h4><table><tr><td>-ar → <b>-ando</b></td><td>hablando</td></tr><tr><td>-er/-ir → <b>-iendo</b></td><td>comiendo, viviendo</td></tr>
<tr><td>vowel + -er/-ir → <b>-yendo</b></td><td>leyendo, oyendo, cayendo, trayendo, construyendo; ir → yendo</td></tr>
<tr><td>-ir stem changers e→i, o→u</td><td>diciendo, pidiendo, sintiendo, viniendo, durmiendo, muriendo; poder → pudiendo</td></tr></table>
<p><b>Not used like English:</b> Spanish uses the simple present for the near future (<s>Estoy saliendo mañana</s> → <em>Salgo mañana</em>), and rarely uses the progressive with <i>ir, venir, tener, ser</i>: <em>Voy al centro</em> = I'm going downtown.</p>
<p>Pronouns: <em>Lo estoy leyendo = Estoy leyéndolo</em> (add a tilde to keep the stress).</p>
<p>Related: <b>seguir</b> + gerund (still): <em>Sigo viviendo en Lima</em>; <b>llevar</b> + time + gerund: <em>Llevo dos años estudiando español</em>.</p>`,
  input: { q: 'Is it happening right now, or is it a habit?', items: [
    'Estoy leyendo un libro de Cortázar. ? in progress now*|a general habit ~ estar + gerundio = in progress.',
    'Leo un libro cada mes. ? in progress now|a general habit* ~ Simple present = habit.',
    'Los niños están durmiendo. ? asleep right now*|they usually sleep well ~ Progressive = now.',
  ] },
  drill: { verbs: ['hablar', 'comer', 'escribir', 'leer', 'dormir', 'pedir', 'decir', 'oír', 'traer', 'servir', 'construir', 'venir'], tenses: ['ger'] },
  items: [
    'Ahora mismo {estoy trabajando:trabajar}, te llamo luego. (yo)',
    '¿Qué {estás haciendo:hacer}? (tú)',
    'Los niños {están durmiendo:dormir}, no hagas ruido.',
    'Mi padre {está leyendo:leer} el periódico.',
    'Mira, {está lloviendo:llover}.',
    'Silencio, el profesor {está diciendo:decir} algo importante.',
    '¿Me {estás oyendo:oír}? (tú)',
    'Estamos {construyendo:construir} una casa en el campo.',
    'Ana está {pidiendo:pedir} la cuenta.',
    '! Estoy [leiendo>leyendo] una novela. ~ Vowel + -er → -yendo.',
    '! Mi abuelo está [dormiendo>durmiendo] la siesta. ~ dormir → durmiendo (o→u).',
    '! Mañana [estoy saliendo>salgo] para Roma. ~ Future plans use the simple present (or ir a), not the progressive.',
    'Llevo tres años {estudiando:estudiar} alemán. ~ llevar + time + gerund.',
    '¿Sigues {viviendo:vivir} en el mismo piso? ~ seguir + gerund = still.',
    'Estoy {escribiéndole:escribir + le} un mensaje a Laura. ~ Pronoun attached → tilde: escribiéndole.',
    'Este semestre [estoy estudiando*|estoy estudiar] mucho.',
    'El camarero nos está {sirviendo:servir} la comida.',
  ],
},
{
  id: 'od-pronombres', level: 'A2', title: 'Pronombres de objeto directo', en: 'Direct object pronouns',
  summary: 'lo, la, los, las (me, te, nos, os) and their position; the personal a.',
  explain: `
<p>The direct object receives the action: <em>Compro <b>el pan</b> → <b>Lo</b> compro.</em></p>
<table><tr><td>me</td><td>me</td><td>nos</td><td>us</td></tr><tr><td>te</td><td>you</td><td>os</td><td>you (pl.)</td></tr>
<tr><td><b>lo</b> / <b>la</b></td><td>him, it (m) / her, it (f), you (usted)</td><td><b>los</b> / <b>las</b></td><td>them / you (ustedes)</td></tr></table>
<h4>Position</h4><ul><li>Before the conjugated verb: <em>La veo. No lo sé.</em></li>
<li>Attached to infinitive / gerund / affirmative command — or before the group: <em>Voy a comprarlo = Lo voy a comprar · Estoy leyéndola = La estoy leyendo · ¡Cómpralo! · No lo compres.</em></li></ul>
<h4>Neuter lo</h4><p>Refers to a whole idea: <em>—¿Sabes que Ana se casa? —Sí, ya <b>lo</b> sé.</em></p>
<h4>Personal a</h4><p>Specific people (and pets) as direct objects take <b>a</b>: <em>Veo <b>a</b> María. Busco <b>a</b> mi hermano.</em> But <em>Busco un médico</em> (not a specific person) and <em>Tengo dos hermanos</em>.</p>
<p>In parts of Spain you will hear <i>le</i> for male persons (<i>leísmo</i>): <em>Le vi ayer</em> — accepted by the RAE for masculine singular persons.</p>
<p><b>Processing trap:</b> in <em>La invita Juan</em> the first word is the object! Juan invites her.</p>`,
  input: { q: 'Who does what to whom? (Spanish word order is flexible — read the pronouns.)', items: [
    'La llama Pedro todos los días. ? She calls Pedro|Pedro calls her* ~ "La" is the object; Pedro is the subject.',
    'A María la ve Juan en clase. ? Juan sees María*|María sees Juan ~ "A María la" = object.',
    'Lo saludan los vecinos. ? He greets the neighbours|The neighbours greet him* ~ "Lo" = object; los vecinos = subject (verb plural).',
    'Te espero en la puerta. ? I\'ll wait for you*|You wait for me ~ te = object; verb espero = yo.',
  ] },
  items: [
    '—¿Dónde compras el pan? —{Lo} compro en la esquina.',
    '—¿Conoces a Marta? —Sí, {la} conozco desde hace años.',
    '—¿Tienes los billetes? —Sí, {los} tengo aquí.',
    '—¿Has visto mis gafas? —No, no {las} he visto.',
    'Este libro es muy bueno; tienes que {leerlo:leer + lo}. ~ Pronoun attached to the infinitive.',
    'Las fotos están listas. ¿{Las} quieres ver? ~ Before the conjugated verb.',
    '¡Qué camisa tan bonita! ¡{Cómprala:comprar + la}! ~ Affirmative command → attached + tilde.',
    'No {lo} toques, está caliente. ~ Negative command → pronoun before.',
    '—¿Sabes dónde vive Luis? —No, no {lo} sé. ~ Neuter lo = that information.',
    'Veo {a} mi abuela todos los domingos. ~ Personal a with specific people.',
    '! Busco [-> a] mi perro, ¿lo has visto? ~ Pets that are like people take the personal a.',
    '! —¿Llamas a tus padres? —Sí, [les>los] llamo cada día. ~ Direct object → los.',
    '! La pizza, [lo>la] pedimos para las nueve. ~ La pizza → la.',
    'Señora, ¿[la*|le|lo] ayudo con la maleta? ~ usted (female) as direct object → la.',
    '—¿Me quieres? —Claro que {te} quiero.',
    'Estoy {esperándote:esperar + te} desde hace media hora.',
    'Mis amigos {nos} invitaron a su boda.',
    'Necesito [un fontanero*|a un fontanero] urgentemente. ~ Any plumber (non-specific) → no personal a.',
    '—¿Y las llaves? —Creo que {las} dejé en el coche.',
  ],
},
{
  id: 'oi-pronombres', level: 'A2', title: 'Objeto indirecto y doble pronombre', en: 'Indirect objects & se lo',
  summary: 'le/les, the redundant le, and combining pronouns: me lo, se lo.',
  explain: `
<p>The indirect object is the person who <i>receives</i> or benefits: <em>Doy el libro <b>a Ana</b> → <b>Le</b> doy el libro.</em></p>
<table><tr><td>me</td><td>(to) me</td><td>nos</td><td>(to) us</td></tr><tr><td>te</td><td>(to) you</td><td>os</td><td>(to) you pl.</td></tr><tr><td><b>le</b></td><td>(to) him/her/you(usted)</td><td><b>les</b></td><td>(to) them/you pl.</td></tr></table>
<h4>The "redundant" le</h4><p>Spanish normally keeps <i>le/les</i> even when the person is named: <em><b>Le</b> escribí <b>a mi madre</b>. <b>Les</b> regalé flores <b>a mis tías</b>.</em></p>
<h4>Two pronouns together</h4><p>Order: <b>indirect + direct</b> (people before things): <em>Me lo das. Te la compro.</em></p>
<p><b>le/les + lo/la/los/las → se</b>: <em><s>le lo</s> → <b>se lo</b> doy</em>. Clarify with a + person: <em>Se lo di <b>a ella</b>.</em></p>
<p>With infinitives, gerunds and commands, both attach (count the tilde!): <em>Voy a dártelo · Estoy explicándoselo · ¡Dímelo! · No me lo digas.</em></p>`,
  input: { q: 'Who receives the thing?', items: [
    'Se lo di a Marta. ? I gave it to Marta*|Marta gave it to me ~ se = to her (Marta).',
    'Me lo explicó el profesor. ? The teacher explained it to me*|I explained it to the teacher ~ me = to me; el profesor = subject.',
    'Te lo compro. ? I buy it for you*|You buy it for me ~ te = for you; verb compro = yo.',
  ] },
  items: [
    '{Le} he escrito un correo a mi jefe. ~ Redundant le with a + person.',
    'A mis padres {les} encanta viajar.',
    '¿{Me} pasas la sal, por favor?',
    '—¿Le diste el regalo a Ana? —Sí, {se lo} di ayer. ~ le + lo → se lo.',
    '—¿Me prestas tu bici? —Sí, {te la} presto. ~ indirect (te) + direct (la).',
    '—¿Nos traes la cuenta? —Ahora mismo {se la} traigo. ~ To ustedes/ellos (les) + la → se la.',
    '¿Quieres el libro? Voy a {dártelo:dar + te + lo} mañana. ~ Two pronouns attached → tilde.',
    'No {me lo} digas, ¡no quiero saberlo!',
    '¡{Dímelo:decir + me + lo}! ~ Affirmative command + two pronouns: dímelo.',
    '! [Le lo>Se lo] expliqué a Carlos. ~ le + lo → se lo.',
    '! A mi hermano [lo>le] gusta el rock. ~ gustar takes an indirect object: le.',
    '! Les mandé [-> a] mis primos una postal. ~ The receiving person needs "a": Les mandé a mis primos una postal.',
    'Estoy {explicándoselo:explicar + se + lo} a los estudiantes.',
    '[Les*|Los] pregunté a los vecinos por el ruido. ~ preguntar a alguien → indirect → les.',
    '—¿Le has devuelto las llaves a tu casero? —No, todavía no {se las} he devuelto.',
    'A ti {te} toca fregar hoy.',
    'Cuéntame qué pasó. — Te {lo} cuento luego.',
  ],
},
{
  id: 'perfecto', level: 'A2', title: 'Pretérito perfecto', en: 'Present perfect (he hablado)',
  summary: 'haber + participle for experiences and "today / this week" (especially in Spain).',
  explain: `
<table><tr><td>he</td><td rowspan="6">hablado · comido · vivido</td></tr><tr><td>has</td></tr><tr><td>ha</td></tr><tr><td>hemos</td></tr><tr><td>habéis</td></tr><tr><td>han</td></tr></table>
<p>Participle: -ar → <b>-ado</b>; -er/-ir → <b>-ido</b> (leído, oído, caído with tilde). It never changes for gender/number after <i>haber</i>, and nothing goes between <i>haber</i> and the participle: <em>No lo he visto nunca.</em></p>
<h4>Irregular participles</h4><p>abrir → <b>abierto</b> · decir → <b>dicho</b> · escribir → <b>escrito</b> · hacer → <b>hecho</b> · morir → <b>muerto</b> · poner → <b>puesto</b> · romper → <b>roto</b> · ver → <b>visto</b> · volver → <b>vuelto</b> · descubrir → <b>descubierto</b> · resolver → <b>resuelto</b></p>
<h4>Uses</h4><ul><li>Time periods that include now: <em>hoy, esta semana, este año, últimamente</em>: <em>Hoy he trabajado mucho.</em></li>
<li>Experiences (ever/never): <em>¿Has estado en México? Nunca he probado el pulpo.</em></li>
<li>With <b>ya / todavía no</b>: <em>Ya he terminado. Todavía no ha llegado.</em></li></ul>
<p>In most of Latin America the preterite is used much more: <em>Hoy trabajé mucho</em> is normal there.</p>`,
  input: { q: 'Is the time period finished, or does it include now?', items: [
    'Esta mañana he desayunado fruta. ? The period includes now (today)*|A finished period (yesterday) ~ "esta mañana" is still today → perfecto (in Spain).',
    '¿Has estado alguna vez en Japón? ? Asking about life experience*|Asking about last year ~ Experience → perfecto.',
    'Todavía no han llegado. ? They arrived|They haven\'t arrived yet* ~ todavía no + perfecto.',
  ] },
  drill: { verbs: ['hablar', 'comer', 'vivir', 'hacer', 'decir', 'escribir', 'ver', 'poner', 'volver', 'abrir', 'romper', 'leer', 'ir', 'ser'], tenses: ['pperf'] },
  items: [
    'Hoy {he trabajado:trabajar} diez horas. (yo)',
    '¿{Has estado:estar} alguna vez en Perú? (tú)',
    'Este año mis padres {han viajado:viajar} mucho.',
    'Todavía no {hemos visto:ver} esa película. (nosotros)',
    '¿Quién {ha abierto:abrir} la ventana?',
    'Ya {he hecho:hacer} los deberes. (yo)',
    'Nunca {he escrito:escribir} un poema. (yo)',
    'Esta semana {ha llovido:llover} todos los días.',
    '¿Dónde {has puesto:poner} mis llaves? (tú)',
    'Mis amigos ya {han vuelto:volver} de vacaciones.',
    '¿Qué te {ha dicho:decir} el médico?',
    '! Esta mañana he [rompido>roto] un vaso. ~ romper → roto.',
    '! No [he lo>lo he] visto. ~ Pronoun goes before haber.',
    '! Mis padres [ha>han] llegado esta mañana. ~ Plural subject → han.',
    'Últimamente {he leído:leer} muchas novelas. ~ leer → leído (tilde).',
    '¿{Habéis probado:probar} el gazpacho? (vosotros)',
    'Mi hermana nunca {ha montado:montar} en avión.',
    '[He estado*|Estuve] en Roma tres veces en mi vida. ~ Life experience without a specific time → perfecto.',
    'Hoy no {he oído:oír} el despertador. ~ oír → oído.',
  ],
},
{
  id: 'indefinido-reg', level: 'A2', title: 'Pretérito indefinido regular', en: 'Preterite — regular verbs',
  summary: 'hablé, comí, viví; spelling changes (busqué, llegué, empecé, leyó).',
  explain: `
<table><tr><th></th><th>hablar</th><th>comer</th><th>vivir</th></tr>
<tr><td>yo</td><td>habl<b>é</b></td><td>com<b>í</b></td><td>viv<b>í</b></td></tr>
<tr><td>tú</td><td>habl<b>aste</b></td><td>com<b>iste</b></td><td>viv<b>iste</b></td></tr>
<tr><td>él/ella/usted</td><td>habl<b>ó</b></td><td>com<b>ió</b></td><td>viv<b>ió</b></td></tr>
<tr><td>nosotros</td><td>habl<b>amos</b></td><td>com<b>imos</b></td><td>viv<b>imos</b></td></tr>
<tr><td>vosotros</td><td>habl<b>asteis</b></td><td>com<b>isteis</b></td><td>viv<b>isteis</b></td></tr>
<tr><td>ellos/ustedes</td><td>habl<b>aron</b></td><td>com<b>ieron</b></td><td>viv<b>ieron</b></td></tr></table>
<p>The tilde matters: <em>hablo</em> (I speak) ≠ <em>habló</em> (he spoke).</p>
<h4>Spelling changes in "yo"</h4><p>-car → <b>-qué</b> (buscar → busqué) · -gar → <b>-gué</b> (llegar → llegué) · -zar → <b>-cé</b> (empezar → empecé)</p>
<h4>i → y</h4><p>leer → le<b>yó</b>, le<b>yeron</b> · creer → creyó · oír → oyó · construir → construyó</p>
<h4>Use</h4><p>Completed actions at a <b>finished</b> time: <em>ayer, anoche, el año pasado, en 2010, hace dos días</em>: <em>Ayer cené con Ana.</em></p>`,
  input: { q: 'Listen to the stress: present or past?', audio: true, items: [
    'Hablo con mi madre. ? present*|past ~ HAblo — stress on the first syllable = present (yo).',
    'Habló con su madre. ? present|past* ~ haBLÓ — stress on the last syllable = preterite (él).',
    'Trabajo en casa. ? present*|past ~ traBAjo = present.',
    'Trabajó en casa. ? present|past* ~ trabaJÓ = preterite.',
    'Estudió en Madrid. ? present|past* ~ estuDIÓ = preterite.',
  ] },
  drill: { verbs: ['hablar', 'trabajar', 'comer', 'vivir', 'escribir', 'buscar', 'llegar', 'empezar', 'leer', 'oír', 'abrir', 'salir', 'jugar', 'pagar', 'tocar', 'cruzar', 'creer'], tenses: ['pret'] },
  items: [
    'Ayer {cené:cenar} con unos amigos. (yo)',
    'El año pasado mis padres {viajaron:viajar} a Cuba.',
    '¿A qué hora {llegaste:llegar} anoche? (tú)',
    'Yo {llegué:llegar} a las once. ~ -gar → -gué.',
    'Yo {busqué:buscar} el libro por todas partes. ~ -car → -qué.',
    'Yo {empecé:empezar} a trabajar en 2019. ~ -zar → -cé.',
    'Mi abuela {vivió:vivir} cincuenta años en París.',
    'Nosotros {comimos:comer} paella en la playa.',
    'Mi hermano {leyó:leer} el libro en dos días. ~ leer → leyó.',
    '¿{Oíste:oír} el ruido anoche? (tú)',
    'Ellos {escribieron:escribir} una carta al alcalde.',
    'El concierto {empezó:empezar} con retraso.',
    '! Ayer yo [jugé>jugué] al tenis. ~ -gar → -gué in yo.',
    '! La semana pasada Juan [hablo>habló] con el director. ~ Without the tilde, hablo = I speak.',
    '! Anoche mis amigos [salió>salieron] hasta tarde. ~ Plural subject → salieron.',
    'Anoche [vimos*|vemos] una película muy buena.',
    'Hace dos años {aprendí:aprender} a conducir. (yo)',
    'Los vecinos {construyeron:construir} una piscina.',
    'Yo {toqué:tocar} el piano en el concierto.',
    'En 1492 Colón {llegó:llegar} a América.',
    '¿Cuánto te {costó:costar} el móvil? ~ costar: no stem change in the preterite.',
  ],
},
{
  id: 'indefinido-irr', level: 'A2', title: 'Pretérito indefinido irregular', en: 'Preterite — irregular verbs',
  summary: 'fui, tuve, estuve, hice, dije, pude, puse, vine, quise, supe; pidió, durmió.',
  explain: `
<h4>Strong stems (no tildes!) — endings -e, -iste, -o, -imos, -isteis, -ieron</h4>
<table><tr><td>tener → <b>tuv</b>-</td><td>estar → <b>estuv</b>-</td><td>andar → <b>anduv</b>-</td></tr>
<tr><td>poder → <b>pud</b>-</td><td>poner → <b>pus</b>-</td><td>saber → <b>sup</b>-</td></tr>
<tr><td>hacer → <b>hic</b>- (hizo)</td><td>querer → <b>quis</b>-</td><td>venir → <b>vin</b>-</td></tr>
<tr><td>decir → <b>dij</b>- (dijeron)</td><td>traer → <b>traj</b>- (trajeron)</td><td>conducir → <b>conduj</b>- (condujeron)</td></tr></table>
<p class="ex">tuve, tuviste, tuvo, tuvimos, tuvisteis, tuvieron</p>
<h4>ser = ir</h4><p>fui, fuiste, fue, fuimos, fuisteis, fueron — context tells you which.</p>
<h4>dar / ver</h4><p>di, diste, dio, dimos, disteis, dieron · vi, viste, vio, vimos, visteis, vieron</p>
<h4>-ir stem changers (only 3rd persons)</h4><p>pedir → p<b>i</b>dió, p<b>i</b>dieron · dormir → d<b>u</b>rmió, d<b>u</b>rmieron · sentir → sintió · preferir → prefirió · morir → murió · repetir → repitió</p>
<h4>Meaning shifts</h4><p><em>conocí</em> = I met · <em>supe</em> = I found out · <em>no quise</em> = I refused · <em>pude</em> = I managed to</p>`,
  input: { q: 'ser or ir? Use the context.', items: [
    'Fue un día increíble. ? ser*|ir ~ "It was an amazing day" → ser.',
    'Fuimos a la playa. ? ser|ir* ~ "a la playa" (destination) → ir.',
    'Fue mi profesor en la universidad. ? ser*|ir ~ "He was my teacher" → ser.',
    'Fueron al médico ayer. ? ser|ir* ~ destination → ir.',
  ] },
  drill: { verbs: ['ser', 'ir', 'tener', 'estar', 'hacer', 'decir', 'poder', 'poner', 'venir', 'querer', 'saber', 'traer', 'dar', 'ver', 'pedir', 'dormir', 'conducir', 'andar'], tenses: ['pret'] },
  items: [
    'Ayer {tuve:tener} un examen muy difícil. (yo)',
    'El verano pasado {estuvimos:estar} en Galicia. (nosotros)',
    '¿Qué {hiciste:hacer} el fin de semana? (tú)',
    'Mi jefe {hizo:hacer} una presentación excelente. ~ hacer → hizo (c→z).',
    'Ellos no {pudieron:poder} venir a la fiesta.',
    'Mis padres me {dijeron:decir} que estaban orgullosos. ~ dijeron (not dijieron).',
    'La película {fue:ser} muy aburrida.',
    'Anoche {fuimos:ir} a un concierto de jazz. (nosotros)',
    'Cuando {supe:saber} la noticia, llamé a mi madre. ~ supe = found out.',
    '¿Dónde {pusiste:poner} el mando de la tele? (tú)',
    'Mi novio {vino:venir} a verme en tren.',
    'Le {di:dar} un abrazo muy fuerte. (yo)',
    'El camarero {trajo:traer} la cuenta.',
    'Anoche Pablo {durmió:dormir} solo cuatro horas. ~ dormir → durmió.',
    'Mi hermana {pidió:pedir} pescado y yo carne. ~ pedir → pidió.',
    '! Ayer [estuví>estuve] en casa todo el día. ~ Strong preterites have no tilde.',
    '! Ellos [dijieron>dijeron] la verdad. ~ After j: -eron.',
    '! Ella [hació>hizo] la cena. ~ hacer → hizo.',
    'Te llamé pero no [quisiste*|querías] contestar. ~ no quisiste = you refused.',
    '! ¿[Vistes>Viste] la final ayer? ~ tú → viste (the extra -s is a common non-standard form).',
    'Ayer {conduje:conducir} cuatro horas sin parar. (yo)',
    'Mis abuelos {murieron:morir} hace años.',
    '¿{Viste:ver} el partido anoche? ~ tú → viste (never "vistes").',
  ],
},
{
  id: 'imperfecto', level: 'A2', title: 'Pretérito imperfecto', en: 'Imperfect',
  summary: 'hablaba, comía, vivía; era, iba, veía — descriptions and habits in the past.',
  explain: `
<table><tr><th></th><th>-ar</th><th>-er / -ir</th></tr>
<tr><td>yo</td><td>habl<b>aba</b></td><td>com<b>ía</b> / viv<b>ía</b></td></tr>
<tr><td>tú</td><td>habl<b>abas</b></td><td>com<b>ías</b></td></tr><tr><td>él</td><td>habl<b>aba</b></td><td>com<b>ía</b></td></tr>
<tr><td>nosotros</td><td>habl<b>ábamos</b></td><td>com<b>íamos</b></td></tr><tr><td>vosotros</td><td>habl<b>abais</b></td><td>com<b>íais</b></td></tr><tr><td>ellos</td><td>habl<b>aban</b></td><td>com<b>ían</b></td></tr></table>
<p>Only three irregulars: <b>ser</b> (era, eras, era, éramos, erais, eran) · <b>ir</b> (iba, ibas, iba, íbamos, ibais, iban) · <b>ver</b> (veía, veías…)</p>
<h4>Uses</h4><ul><li>Habits in the past ("used to"): <em>De niño jugaba en la calle.</em> — signals: <i>siempre, todos los días, de pequeño, antes, normalmente</i></li>
<li>Descriptions, background, age, time: <em>Era tarde, hacía frío y yo tenía sueño.</em></li>
<li>Actions in progress when something happened: <em>Leía cuando sonó el teléfono.</em></li>
<li>Polite requests: <em>Quería un café, por favor.</em></li></ul>`,
  input: { q: 'Single event or repeated habit?', items: [
    'De niño iba a la playa cada verano. ? one occasion|a repeated habit* ~ Imperfect = habit.',
    'Fui a la playa el verano pasado. ? one occasion*|a repeated habit ~ Preterite = completed event.',
    'Mi abuelo era muy alto. ? description*|event ~ Imperfect = description.',
  ] },
  drill: { verbs: ['hablar', 'trabajar', 'jugar', 'comer', 'tener', 'vivir', 'ser', 'ir', 'ver', 'estar', 'hacer', 'querer', 'poder', 'saber'], tenses: ['impf'] },
  items: [
    'Cuando era pequeño, {vivía:vivir} en un pueblo. (yo)',
    'Mi abuela siempre {cocinaba:cocinar} los domingos.',
    'Antes nosotros {íbamos:ir} al colegio andando.',
    'De niña Ana {era:ser} muy tímida.',
    '{Hacía:hacer} mucho calor y no {había:haber} nadie en la calle.',
    'Mis padres {trabajaban:trabajar} en una fábrica.',
    'Todos los veranos {veíamos:ver} a nuestros primos.',
    'Yo {tenía:tener} diez años cuando aprendí a nadar.',
    '{Eran:ser} las nueve de la noche cuando llegamos.',
    'Mientras yo {leía:leer}, mi hermano escuchaba música.',
    '! Cuando era joven, [jugé>jugaba] al fútbol cada día. ~ Repeated habit → imperfect.',
    '! De pequeños [íbanos>íbamos] mucho al cine.',
    'Perdone, {quería:querer} preguntarle una cosa. ~ Polite imperfect.',
    'Antes no [había*|hubo] tantos coches en la ciudad. ~ Description of the past → había.',
    'Mi casa {estaba:estar} cerca del río.',
    'Mis amigos y yo {jugábamos:jugar} en el parque después del colegio.',
    '¿Qué {hacías:hacer} cuando te llamé? (tú)',
    'La casa {tenía:tener} un jardín enorme.',
  ],
},
{
  id: 'comparativos', level: 'A2', title: 'Comparativos y superlativos', en: 'Comparisons & superlatives',
  summary: 'más/menos… que, tan… como, tanto… como, mejor/peor, el más…, -ísimo.',
  explain: `
<table><tr><td>superiority</td><td><b>más</b> + adj./noun/adv. + <b>que</b></td><td>Madrid es más grande que Toledo.</td></tr>
<tr><td>inferiority</td><td><b>menos</b> … <b>que</b></td><td>Tengo menos tiempo que tú.</td></tr>
<tr><td>equality (adj./adv.)</td><td><b>tan</b> … <b>como</b></td><td>Es tan alto como su padre.</td></tr>
<tr><td>equality (nouns)</td><td><b>tanto/a/os/as</b> + noun + <b>como</b></td><td>Tengo tantos libros como tú.</td></tr>
<tr><td>equality (verbs)</td><td>verb + <b>tanto como</b></td><td>Trabajo tanto como él.</td></tr></table>
<h4>Irregular</h4><p>bueno/bien → <b>mejor</b> · malo/mal → <b>peor</b> · grande (age) → <b>mayor</b> · pequeño (age) → <b>menor</b>. Never <s>más bueno</s> for quality or <s>más mejor</s>.</p>
<h4>Superlative</h4><p><b>el/la/los/las (+ noun) + más + adj. + de</b>: <em>Es el edificio más alto <b>de</b> la ciudad.</em> (not <s>en</s>)</p>
<p>Absolute: <b>-ísimo</b>: <em>guapísima, rapidísimo, riquísimo (c→qu), felicísimo (z→c), larguísimo (g→gu)</em>.</p>
<p>With numbers: <b>más de</b>: <em>Hay más de cien personas.</em></p>`,
  input: { q: 'Who/what is bigger, better, etc.?', items: [
    'Luis es menos alto que Pedro. ? Luis is taller|Pedro is taller* ~ menos … que = less.',
    'Mi coche es tan rápido como el tuyo. ? Same speed*|Mine is faster ~ tan … como = equality.',
    'Es el peor restaurante de la zona. ? the worst*|the best ~ peor = worse/worst.',
  ] },
  items: [
    'Barcelona es {más} grande {que} Valencia.',
    'Mi hermano es {tan} alto {como} mi padre.',
    'Tengo {tantos} amigos {como} tú. ~ amigos → tantos.',
    'Hoy hay {tanta} gente {como} ayer. ~ gente → tanta.',
    'Este vino es {mejor} que el otro. ~ bueno → mejor.',
    'Mi hermana es {mayor} que yo; tiene 30 años.',
    'Es el río más largo {de} Europa. ~ Superlative + de.',
    'La comida estaba {riquísima:rico + ísimo}. ~ rico → riquísimo (c → qu).',
    'En la fiesta había {más de} cien personas. ~ With numbers → más de.',
    '! Este examen es [más fácil como>más fácil que] el anterior.',
    '! Mi ordenador es [más mejor>mejor] que el tuyo.',
    '! Es la ciudad más bonita [en>de] España. ~ Superlative → de.',
    'Yo no trabajo [tan|tanto*] como tú. ~ Verb comparison → tanto como.',
    'Ella es [tan*|tanto] inteligente como su madre. ~ Adjective → tan.',
    'Este hotel es {peor} que el del año pasado. ~ malo → peor.',
    'El examen fue {facilísimo:fácil + ísimo}.',
    'Ana es la {menor} de cuatro hermanos. ~ youngest → la menor.',
    'Mi casa es {menos} moderna {que} la tuya.',
  ],
},
{
  id: 'por-para', level: 'A2', title: 'Por y para', en: 'Por vs. para',
  summary: 'para = goal, destination, deadline, recipient. por = cause, through, exchange, duration.',
  explain: `
<table><tr><th>PARA → towards a goal</th><th>POR → cause, means, route</th></tr>
<tr><td>Purpose: <em>Estudio <b>para</b> aprender.</em></td><td>Cause/reason: <em>Lo hago <b>por</b> ti. Cerrado <b>por</b> vacaciones.</em></td></tr>
<tr><td>Recipient: <em>Un regalo <b>para</b> ti.</em></td><td>Exchange/price: <em>Lo compré <b>por</b> 20 €. Gracias <b>por</b> todo.</em></td></tr>
<tr><td>Destination: <em>Salgo <b>para</b> Madrid.</em></td><td>Movement through/around: <em>Paseo <b>por</b> el parque.</em></td></tr>
<tr><td>Deadline: <em>Es <b>para</b> el lunes.</em></td><td>Approximate time / part of day: <em><b>por</b> la mañana, <b>por</b> Navidad</em></td></tr>
<tr><td>Opinion: <em><b>Para</b> mí, es un error.</em></td><td>Means: <em><b>por</b> teléfono, <b>por</b> correo</em></td></tr>
<tr><td>Comparison: <em><b>Para</b> ser niño, habla muy bien.</em></td><td>Agent of passive: <em>escrito <b>por</b> Cervantes</em></td></tr>
<tr><td>Use: <em>una taza <b>para</b> café</em></td><td>Frequency/rate: <em>dos veces <b>por</b> semana, 100 km <b>por</b> hora</em></td></tr></table>
<p>Fixed: <em>por favor, por fin, por ejemplo, por eso, por supuesto, por cierto</em>. <b>Por + infinitive</b> can also mean "still to be done": <em>la casa está por limpiar</em>.</p>
<p>Contrast: <em>Trabajo <b>para</b> una empresa</em> (employer) vs. <em>Trabajo <b>por</b> mi compañero</em> (in his place).</p>`,
  input: { q: 'What does the preposition tell us?', items: [
    'Compré flores para mi madre. ? She is the recipient*|She is the reason ~ para = recipient.',
    'Lo hice por mi madre. ? She receives it|She is the reason / on her behalf* ~ por = cause/on behalf of.',
    'Salimos para Sevilla. ? Sevilla is the destination*|We pass through Sevilla ~ para = destination.',
    'Pasamos por Sevilla. ? Sevilla is the destination|We pass through Sevilla* ~ por = through.',
  ] },
  items: [
    'Este regalo es {para} ti.',
    'Gracias {por} tu ayuda. ~ Gracias por = cause/exchange.',
    'Estudio español {para} trabajar en México. ~ Purpose.',
    'Me gusta pasear {por} el centro. ~ Through/around.',
    'El trabajo es {para} el viernes. ~ Deadline.',
    'Compré la bici {por} cien euros. ~ Price/exchange.',
    'Hablamos {por} teléfono cada día. ~ Means.',
    '{Para} mí, el mejor actor es Bardem. ~ Opinion.',
    'El museo está cerrado {por} obras. ~ Cause.',
    'Voy al gimnasio tres veces {por} semana. ~ Frequency.',
    'Mañana salgo {para} Lima. ~ Destination.',
    '! Fui a la farmacia [por>para] comprar aspirinas. ~ Purpose → para.',
    '! Muchas gracias [para>por] el regalo.',
    '"Cien años de soledad" fue escrito [para|por*] García Márquez. ~ Agent of passive → por.',
    '[Para*|Por] ser extranjero, hablas muy bien. ~ Comparison with expectations → para.',
    'Te llamo {por} la tarde. ~ Part of the day → por.',
    'Lo hago {por} mis hijos, para que tengan un futuro mejor. ~ Motivation → por.',
    'Necesito un vaso {para} el agua. ~ Use/purpose.',
    '{Por} fin han terminado las obras. ~ Fixed expression.',
    'Mi primo trabaja {para} una empresa alemana. ~ Employer → para.',
  ],
},
{
  id: 'imperativo', level: 'A2', title: 'Imperativo', en: 'Commands (tú, usted, ustedes)',
  summary: 'habla / no hables, hable usted, di, haz, ve, pon, sal, sé, ten, ven.',
  explain: `
<table><tr><th></th><th>affirmative</th><th>negative</th></tr>
<tr><td>tú</td><td>= él form of present: <b>habla, come, escribe</b></td><td><b>no hables, no comas, no escribas</b></td></tr>
<tr><td>usted</td><td><b>hable, coma, escriba</b></td><td>no hable, no coma</td></tr>
<tr><td>vosotros</td><td><b>hablad, comed, escribid</b></td><td>no habléis, no comáis</td></tr>
<tr><td>ustedes</td><td><b>hablen, coman, escriban</b></td><td>no hablen, no coman</td></tr></table>
<p>The negative and the usted/ustedes forms come from the present subjunctive: take the <i>yo</i> form, drop -o, add the "opposite" vowel: tengo → teng<b>a</b>, hago → hag<b>a</b>, pido → pid<b>a</b>.</p>
<h4>Irregular tú commands</h4><p><b>di</b> (decir) · <b>haz</b> (hacer) · <b>ve</b> (ir) · <b>pon</b> (poner) · <b>sal</b> (salir) · <b>sé</b> (ser) · <b>ten</b> (tener) · <b>ven</b> (venir)</p>
<p>Spelling: busca → no bus<b>qu</b>es; paga → no pa<b>gu</b>es; empieza → no empie<b>c</b>es.</p>`,
  input: { q: 'Is it an order or a prohibition, and to whom?', items: [
    'No toques eso. ? Do it|Don\'t do it* ~ no + subjunctive = negative command.',
    'Siéntese, por favor. ? to a friend|to someone formal (usted)* ~ -ese = usted.',
    'Ven aquí. ? to tú*|to usted ~ ven = tú form of venir.',
  ] },
  drill: { verbs: ['hablar', 'comer', 'escribir', 'decir', 'hacer', 'ir', 'poner', 'salir', 'ser', 'tener', 'venir', 'buscar', 'pagar', 'empezar', 'pedir', 'cerrar', 'volver'], tenses: ['imp', 'impneg'] },
  items: [
    '{Habla:hablar} más despacio, por favor. (tú)',
    'No {hables:hablar} tan alto. (tú)',
    '{Come:comer} más fruta. (tú)',
    '{Haz:hacer} los deberes antes de jugar. (tú)',
    '{Ven:venir} a mi fiesta el sábado. (tú)',
    '{Di:decir} la verdad. (tú)',
    '{Pon:poner} la mesa, por favor. (tú)',
    'No {salgas:salir} sin abrigo. (tú)',
    '{Abra:abrir} la boca, por favor. (usted)',
    'No {fumen:fumar} aquí, por favor. (ustedes)',
    '{Tenga:tener} cuidado con el escalón. (usted)',
    '{Sé:ser} bueno con tu hermana. (tú)',
    '! No [toca>toques] eso. ~ Negative tú → subjunctive: no toques.',
    '! [Hace>Haz] lo que quieras. ~ hacer → haz.',
    '! No [buscas>busques] excusas. ~ Negative tú command → subjunctive: no busques.',
    'No [paga|pagues*] con tarjeta aquí. ~ -gar → -gues.',
    '{Vuelve:volver} pronto. (tú)',
    'Señor, {siga:seguir} todo recto y {gire:girar} a la derecha. (usted)',
    '{Id:ir} con cuidado, chicos. (vosotros)',
    'No {empieces:empezar} sin mí. (tú)',
    '{Ve:ir} a la tienda y compra pan. (tú)',
  ],
},
{
  id: 'futuro', level: 'A2', title: 'Futuro simple', en: 'Simple future',
  summary: 'hablaré, comeré; tendré, haré, podré, diré; future of probability.',
  explain: `
<p>Infinitive + endings (the same for all verbs): <b>-é, -ás, -á, -emos, -éis, -án</b>.</p>
<p class="ex">hablaré, hablarás, hablará, hablaremos, hablaréis, hablarán</p>
<h4>Irregular stems</h4><table>
<tr><td>tener → <b>tendr</b>-</td><td>poner → <b>pondr</b>-</td><td>salir → <b>saldr</b>-</td><td>venir → <b>vendr</b>-</td></tr>
<tr><td>poder → <b>podr</b>-</td><td>saber → <b>sabr</b>-</td><td>haber → <b>habr</b>-</td><td>querer → <b>querr</b>-</td></tr>
<tr><td>hacer → <b>har</b>-</td><td>decir → <b>dir</b>-</td><td>caber → <b>cabr</b>-</td><td>valer → <b>valdr</b>-</td></tr></table>
<h4>Uses</h4><ul><li>Predictions & promises: <em>Mañana lloverá. Te llamaré.</em></li>
<li><b>Probability in the present</b> (I wonder / must be): <em>¿Qué hora será? — Serán las diez. Tendrá unos 40 años.</em></li>
<li>Conditions: <em>Si estudias, aprobarás.</em></li></ul>
<p><i>Ir a + infinitive</i> is more common in speech for plans; the simple future sounds more formal or more distant.</p>`,
  input: { q: 'Future fact, or a guess about now?', items: [
    '¿Dónde estará Juan? ? I wonder where Juan is (now)*|Where will Juan be next week? ~ Future of probability.',
    'Mañana estaré en Roma. ? a future fact*|a guess about now ~ mañana → future.',
    'Tendrá unos treinta años. ? He\'s probably about 30*|He will be 30 ~ Probability.',
  ] },
  drill: { verbs: ['hablar', 'comer', 'vivir', 'tener', 'hacer', 'decir', 'poder', 'salir', 'venir', 'poner', 'saber', 'querer', 'haber', 'ir', 'ser'], tenses: ['fut'] },
  items: [
    'Mañana {lloverá:llover} en todo el país.',
    'Te {llamaré:llamar} cuando llegue. (yo)',
    'El año que viene {tendré:tener} más tiempo. (yo)',
    '¿Qué {harás:hacer} después de la universidad? (tú)',
    'No te preocupes, {podremos:poder} hacerlo. (nosotros)',
    'Mis padres {vendrán:venir} en Navidad.',
    'El tren {saldrá:salir} a las 8:15.',
    '¿Qué hora es? — No sé, {serán:ser} las cinco. ~ Probability.',
    '¿Dónde {estará:estar} mi móvil? ~ I wonder…',
    'Te lo {diré:decir} mañana. (yo)',
    '! Mañana [haceré>haré] la compra. ~ hacer → har-.',
    '! Ellos [tenerán>tendrán] que esperar.',
    'Si sigues así, [aprobarás*|aprobarías] el examen. ~ Si + present → future.',
    'En el futuro los coches {serán:ser} eléctricos.',
    '¿Cuánto {costará:costar} ese coche? Parece carísimo. ~ Probability.',
    'Nosotros {pondremos:poner} la música en la fiesta.',
    '¿{Habrá:haber} sitio para todos?',
    'No sé si {sabré:saber} hacerlo. (yo)',
  ],
},
{
  id: 'indefinidos', level: 'A2', title: 'Indefinidos y negación', en: 'Indefinites & negation',
  summary: 'algo/nada, alguien/nadie, algún/ningún, siempre/nunca, también/tampoco; double negation.',
  explain: `
<table><tr><th>positive</th><th>negative</th></tr>
<tr><td>algo (something)</td><td>nada (nothing)</td></tr><tr><td>alguien (someone)</td><td>nadie (no one)</td></tr>
<tr><td>algún, alguna, algunos, algunas</td><td>ningún, ninguna (singular!)</td></tr>
<tr><td>siempre / alguna vez</td><td>nunca, jamás</td></tr><tr><td>también</td><td>tampoco</td></tr><tr><td>o … o</td><td>ni … ni</td></tr></table>
<h4>Double negation is required</h4><p>If the negative word comes <b>after</b> the verb, put <b>no</b> before the verb: <em><b>No</b> veo <b>nada</b>. <b>No</b> viene <b>nadie</b>. <b>No</b> tengo <b>ningún</b> problema.</em></p>
<p>If it comes first, no <i>no</i>: <em>Nadie viene. Nunca bebo café.</em></p>
<p><b>alguno/ninguno</b> drop -o before a masculine singular noun: <em>algún día, ningún libro</em>. <i>Ninguno</i> is almost always singular: <em>No tengo ningún amigo allí.</em></p>
<p>Personal a: <em>¿Conoces <b>a</b> alguien? No veo <b>a</b> nadie.</em></p>`,
  input: { q: 'Positive or negative meaning?', items: [
    'No conozco a nadie aquí. ? I know someone|I know no one* ~ Double negation = a single negative meaning.',
    'Nunca como carne. ? I never eat meat*|I always eat meat ~ nunca before the verb → no "no".',
    'No quiero nada. ? I want something|I don\'t want anything* ~ no … nada.',
  ] },
  items: [
    '¿Quieres {algo} de beber? — No, gracias, no quiero {nada}.',
    '¿Hay {alguien} en casa? — No, no hay {nadie}.',
    'No tengo {ningún} problema contigo. ~ ninguno → ningún before a masculine noun.',
    '{Nadie} sabe la respuesta. ~ Negative word first → no "no".',
    'No he estado {nunca} en Asia.',
    '—No me gusta el café. —A mí {tampoco}.',
    'No tengo {ni} tiempo {ni} dinero.',
    '¿Tienes {alguna} pregunta? — No, {ninguna}.',
    '{Algún} día viajaré a Argentina.',
    '! No veo [algo>nada] desde aquí. ~ Negative sentence → nada.',
    '! [Ninguno>Ningún] estudiante aprobó el examen. ~ Before a noun → ningún.',
    '! [Nadie no>Nadie] quiere trabajar el domingo. ~ Nadie first → no extra "no".',
    'No conozco [a*|-] nadie en esta ciudad. ~ Personal a with nadie/alguien.',
    'No he comprado [ningunos|ningún*] regalo todavía.',
    '¿Has estado {alguna vez} en Cuba?',
    'Mi hermano {nunca} llega a tiempo.',
    'No vino {nadie} a la reunión.',
  ],
},
{
  id: 'preposiciones', level: 'A2', title: 'Preposiciones y verbos con preposición', en: 'Prepositions & verbs with prepositions',
  summary: 'a / en / de with places and times; verbs like pensar en, soñar con, depender de.',
  explain: `
<table><tr><td><b>a</b></td><td>direction, time on the clock, personal a, indirect object</td><td>Voy a Lima. A las tres. Veo a Ana.</td></tr>
<tr><td><b>en</b></td><td>location (in/on/at), means of transport, months/years/seasons</td><td>Estoy en casa. En tren. En mayo. En 2020.</td></tr>
<tr><td><b>de</b></td><td>origin, possession, material, "from … to"</td><td>Soy de Quito. De 9 a 5. Una mesa de madera.</td></tr>
<tr><td><b>desde/hasta</b></td><td>from / until</td><td>Desde el lunes hasta el viernes.</td></tr>
<tr><td><b>con/sin</b></td><td>with / without</td><td>Café con leche. Sin azúcar.</td></tr></table>
<p>Transport: <em>en coche, en avión</em> but <em><b>a</b> pie, <b>a</b> caballo</em>. Days take no preposition: <em>el lunes</em>. Parts of the day: <em>por la mañana</em> (but <em>a las 8 <b>de</b> la mañana</em>).</p>
<h4>Verbs with fixed prepositions</h4>
<table><tr><td>pensar <b>en</b> (think about) · confiar <b>en</b> · consistir <b>en</b> · insistir <b>en</b> · tardar … <b>en</b></td></tr>
<tr><td>soñar <b>con</b> · casarse <b>con</b> · contar <b>con</b> (rely on) · quedar <b>con</b> (meet)</td></tr>
<tr><td>depender <b>de</b> · acordarse <b>de</b> · enamorarse <b>de</b> · tratar <b>de</b> (try to) · dejar <b>de</b> (stop) · olvidarse <b>de</b></td></tr>
<tr><td>empezar <b>a</b> · aprender <b>a</b> · ayudar <b>a</b> · volver <b>a</b> (do again) · ir <b>a</b></td></tr></table>`,
  input: { q: 'What does the preposition mean here?', items: [
    'Voy a pensar en tu propuesta. ? think about*|think that ~ pensar en = think about.',
    'Volví a llamar. ? I came back to call|I called again* ~ volver a + inf. = again.',
    'Dejé de fumar. ? I stopped smoking*|I let him smoke ~ dejar de = stop.',
  ] },
  items: [
    'Siempre pienso {en} ti.',
    'Anoche soñé {con} mi abuela.',
    'Todo depende {de} ti.',
    'Mi hermana se casó {con} un chico argentino.',
    'No me acuerdo {de} su nombre.',
    'Empecé {a} estudiar español hace un año.',
    'Mi padre dejó {de} fumar en 2015.',
    'Voy al trabajo {en} metro.',
    'Prefiero ir {a} pie.',
    'Nací {en} marzo {de} 1995.',
    'La clase es {a} las diez {de} la mañana.',
    '! Ayer soñé [en>con] un examen horrible.',
    '! Me enamoré [con>de] ella en París.',
    '! Estoy pensando [de>en] cambiar de trabajo.',
    'La tienda abre [en|de*] lunes a viernes. ~ de … a = from … to.',
    'He quedado {con} Marta para tomar un café.',
    'Puedes contar {con} nosotros.',
    'El examen consiste {en} tres partes.',
    'El avión tardó dos horas {en} despegar.',
    'Esta tarde voy a ayudar {a} mi vecino.',
  ],
},
];
