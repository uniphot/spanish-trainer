// Grammar topics C1 (see grammar-a1.js for the item mini-language).
export default [
{
  id: 'subj-concesivo', level: 'C1', title: 'Concesivas', en: 'Concessive clauses (aunque…)',
  summary: 'aunque + indicative (fact) vs. subjunctive (hypothesis or conceded point); por mucho que, a pesar de que, si bien.',
  explain: `
<table><tr><th></th><th>Indicative</th><th>Subjunctive</th></tr>
<tr><td><b>aunque</b></td><td>New information, presented as fact: <em>Aunque <b>llueve</b>, saldré</em> (it is raining).</td><td>Hypothesis, or a fact the speaker treats as irrelevant/known: <em>Aunque <b>llueva</b>, saldré</em> (even if it rains / even though it's raining — doesn't matter).</td></tr>
<tr><td></td><td></td><td>Unlikely/contrary to fact: <em>Aunque <b>tuviera</b> dinero, no lo compraría.</em></td></tr>
<tr><td><b>a pesar de que</b></td><td>fact: <em>A pesar de que <b>estaba</b> cansado, terminó.</em></td><td>concession: <em>A pesar de que <b>sea</b> caro, merece la pena.</em></td></tr>
<tr><td><b>si bien</b></td><td>always indicative (formal): <em>Si bien <b>es</b> cierto…</em></td><td></td></tr>
<tr><td><b>por mucho/más que</b></td><td>(habit/fact) <em>Por más que <b>estudio</b>, no aprendo.</em></td><td>usually: <em>Por mucho que <b>insistas</b>, no iré.</em></td></tr></table>
<p>Also: <b>a pesar de</b> + noun/infinitive (<em>a pesar del frío / de estar cansado</em>), <b>pese a (que)</b>, <b>aun así</b>, <b>y eso que</b> + indicative (colloquial: <em>Suspendió, y eso que estudió</em>).</p>
<p>Reduplicated: <em><b>Digas lo que digas</b>, no cambiaré de opinión. <b>Pase lo que pase</b>, estaré contigo.</em></p>`,
  input: { q: 'Is the speaker stating a fact or allowing a possibility?', items: [
    'Aunque es tarde, vamos a terminar. ? It is late (fact)*|It might be late ~ Indicative = asserted fact.',
    'Aunque sea tarde, vamos a terminar. ? new information|whether or not it\'s late, it doesn\'t matter* ~ Subjunctive = conceded/irrelevant or hypothetical.',
    'Aunque me lo pidieras, no lo haría. ? You asked me|You haven\'t asked (and probably won\'t)* ~ Imperfect subjunctive = unlikely hypothesis.',
  ] },
  items: [
    'Aunque {llueva:llover} mañana, iremos de excursión. ~ Hypothesis about the future → subjunctive.',
    'Aunque {estaba:estar} agotada, fue a la fiesta. ~ Past fact → indicative.',
    'Por mucho que {insistas:insistir}, no voy a cambiar de opinión.',
    'Aunque {tuviera|tuviese:tener} millones, seguiría trabajando. (yo)',
    'A pesar de que {hacía:hacer} frío, nos bañamos en el mar.',
    'Si bien {es:ser} cierto que hay problemas, la situación mejora.',
    '{Digas:decir} lo que {digas:decir}, no te creo.',
    '{Pase:pasar} lo que {pase:pasar}, no te rindas.',
    'A pesar {del} mal tiempo, el concierto se celebró.',
    'Suspendió el examen, y eso que {estudió:estudiar} muchísimo.',
    '! Aunque [tendría>tuviera] tiempo, no iría.',
    '! Por más que lo [intentará>intente], no lo conseguirá.',
    '! A pesar [que>de que] estaba enfermo, fue a trabajar.',
    'Aunque [es*|sea] mi hermano, no siempre estoy de acuerdo con él. ~ Fact presented as information.',
    'Aunque no lo [creas*|crees], es verdad. ~ Set phrase: aunque no lo creas = believe it or not (the point is conceded).',
    'Aun así, {merece:merecer} la pena intentarlo.',
    'Pese a que lo {sabía:saber}, no dijo nada. (él)',
  ],
},
{
  id: 'subj-avanzado', level: 'C1', title: 'Subjuntivo avanzado', en: 'Advanced subjunctive',
  summary: 'el hecho de que, como si, ojalá + plusc., quien + subj., lo que sea, no es que…',
  explain: `
<ul>
<li><b>El hecho de que</b> / <b>que</b> at the start of a sentence → usually subjunctive (the fact is commented on): <em>El hecho de que no <b>llamara</b> me preocupa. Que <b>llegues</b> tarde no es normal.</em></li>
<li><b>Como si</b> + imperfect / pluperfect subjunctive: <em>Me mira como si me <b>conociera</b>. Habla como si no <b>hubiera pasado</b> nada.</em></li>
<li><b>Ojalá</b> + pluperfect subj. = regret: <em>Ojalá lo <b>hubiera sabido</b> antes.</em></li>
<li><b>No es que</b> + subj. … <b>sino que</b> + ind.: <em>No es que no <b>quiera</b>, es que no <b>puedo</b>.</em></li>
<li><b>Lo que sea, donde sea, quien sea, cuando sea, como sea</b> (whatever/wherever…): <em>Lo haré como sea.</em></li>
<li><b>Quien</b> + subj. = whoever (generic): <em>Quien <b>quiera</b> venir, que venga.</em></li>
<li><b>Que</b> + subj. as a wish or indirect command: <em>¡Que <b>te mejores</b>! Que <b>pase</b> el siguiente.</em></li>
<li>Verbs of communication/perception change meaning: <em>Te digo que <b>vienes</b></em> (I inform you) vs. <em>Te digo que <b>vengas</b></em> (I order you). <em>Siento que <b>hace</b> frío</em> (I feel) vs. <em>Siento que <b>tengas</b> frío</em> (I'm sorry).</li>
<li><b>Decir/comprender/entender/explicar que</b> + subj. when commenting on a known fact: <em>Entiendo que <b>estés</b> enfadado.</em></li></ul>`,
  input: { q: 'Choose the meaning.', items: [
    'Le dije que viniera. ? I told him to come*|I told him that he was coming ~ decir + subjunctive = command.',
    'Le dije que venía. ? I told him to come|I told him that he/I was coming* ~ decir + indicative = information.',
    'Siento que estés triste. ? I feel that you are sad|I\'m sorry you are sad* ~ sentir + subjunctive = regret.',
    'Entiendo que estés enfadado. ? I realise you are angry (new info)|I understand why you are angry (empathy)* ~ Commenting on a known fact.',
  ] },
  items: [
    'El hecho de que no {conteste:contestar} me preocupa.',
    'Me trata como si {fuera|fuese:ser} un niño. (yo)',
    'Ojalá {hubiera|hubiese:haber} aceptado aquel trabajo. ~ Regret → pluperfect subjunctive.',
    'No es que no {quiera:querer} ayudarte, es que no tengo tiempo.',
    '¡Que {te mejores:mejorarse}! ~ Wish → que + subjunctive.',
    'Quien {quiera:querer} participar, que levante la mano.',
    'Iré a verte, cueste lo que {cueste:costar}.',
    'Siento mucho que no {hayas podido:poder} venir.',
    'Habla como si {hubiera vivido|hubiese vivido:vivir} allí toda la vida.',
    'Mi madre me dijo que {comprara|comprase:comprar} pan. ~ Order → subjunctive.',
    'Mi madre me dijo que ya {había comprado:comprar} pan. ~ Information → indicative.',
    '! Me mira como si me [conoce>conociera].',
    '! Que [llegas>llegues] siempre tarde no es aceptable.',
    '! Ojalá no te [habría>hubiera] dicho nada.',
    'Entiendo que [estás|estés*] molesto; yo también lo estaría. ~ Empathy with a known fact.',
    'Te repito que no [es*|sea] verdad. ~ Insisting on information → indicative.',
    'Lo haré cuando {sea:ser}, pero lo haré.',
    '{Que} pase el siguiente, por favor.',
  ],
},
{
  id: 'relativos-avanzado', level: 'C1', title: 'Relativos avanzados', en: 'Advanced relatives',
  summary: 'el cual / la cual, cuyo/a, lo cual, preposition + quien / el cual.',
  explain: `
<ul><li><b>el cual, la cual, los cuales, las cuales</b>: formal alternative to <i>el que</i>, especially after long or compound prepositions and between commas: <em>La empresa <b>para la cual</b> trabajo… El edificio, <b>delante del cual</b> hay una fuente…</em></li>
<li><b>lo cual</b> = lo que, referring to a whole clause (only after a comma): <em>No vino, <b>lo cual</b> me sorprendió.</em></li>
<li><b>cuyo, cuya, cuyos, cuyas</b> = whose; agrees with the <b>thing possessed</b>, not the owner: <em>El autor <b>cuya novela</b> leímos… La mujer <b>cuyos hijos</b> conoces…</em> (never <s>que su</s>).</li>
<li><b>quien</b> after prepositions for people: <em>la persona <b>a quien</b> me dirigí</em>; in sayings = whoever: <em>Quien mucho abarca, poco aprieta.</em></li>
<li><b>Preposition placement:</b> the preposition always precedes the relative: <em>el chico <b>con el que</b> salgo</em> (not <s>el chico que salgo con</s>).</li></ul>`,
  input: { q: 'What does cuyo/cuya agree with?', items: [
    'La escritora cuyos libros leí… ? la escritora|libros* ~ cuyo agrees with the possessed noun.',
    'El pueblo cuya iglesia visitamos… ? el pueblo|iglesia* ~ cuya → iglesia (feminine).',
  ] },
  items: [
    'El escritor {cuya} novela ganó el premio es mexicano.',
    'Es una ciudad {cuyos} habitantes son muy hospitalarios.',
    'Llegó tarde, lo {cual} provocó una discusión.',
    'La empresa para {la cual} trabajo exporta a 30 países.',
    'El árbol debajo {del cual} nos sentamos tiene cien años.',
    'Los vecinos {cuyo} perro ladra toda la noche se han mudado.',
    'La persona a {quien|la que} me dirigí no sabía nada.',
    '! El chico [que su>cuyo] padre es médico estudia conmigo.',
    '! Es una novela [cuyo>cuya] trama es muy compleja. ~ Agrees with trama.',
    '! Perdimos el vuelo, [el cual>lo cual] nos obligó a dormir en el aeropuerto. ~ Whole clause → lo cual.',
    'Las razones por {las cuales|las que} dimitió no están claras.',
    'Es un tema sobre {el cual|el que} se ha escrito mucho.',
    '{Quien} mal anda, mal acaba. ~ Proverbial "whoever".',
    'Ese es el profesor de {quien|el que|el cual} te hablé. ~ Preposition + quien / el que / el cual for people.',
  ],
},
{
  id: 'conectores', level: 'C1', title: 'Conectores del discurso', en: 'Discourse connectors',
  summary: 'sin embargo, no obstante, por lo tanto, en cambio, es decir, además, de hecho, por consiguiente…',
  explain: `
<p>Connectors make texts cohesive and are a key marker of B2–C1 writing.</p>
<table><tr><th>Function</th><th>Connectors</th></tr>
<tr><td>Adding</td><td>además, asimismo, también, incluso, por otra parte, es más</td></tr>
<tr><td>Contrast</td><td>pero, sin embargo, no obstante, en cambio, por el contrario, ahora bien, aun así</td></tr>
<tr><td>Cause</td><td>porque, ya que, puesto que, dado que, como (at the start), debido a (que)</td></tr>
<tr><td>Consequence</td><td>así que, por eso, por lo tanto, por consiguiente, de modo que, en consecuencia</td></tr>
<tr><td>Reformulation / example</td><td>es decir, o sea, en otras palabras, por ejemplo, en concreto</td></tr>
<tr><td>Ordering</td><td>en primer lugar, por un lado… por otro, por último, finalmente, para terminar</td></tr>
<tr><td>Conclusion</td><td>en resumen, en conclusión, en definitiva, en suma</td></tr>
<tr><td>Emphasis / evidence</td><td>de hecho, en realidad, sobre todo, cabe destacar que</td></tr></table>
<p><b>Como</b> (cause) goes at the start: <em><b>Como</b> llovía, nos quedamos.</em> <b>Porque</b> follows the main clause. <b>Sin embargo / no obstante</b> are separated by commas (or follow a semicolon): <em>Es caro; sin embargo, lo compraré.</em> <b>Sino</b> corrects a negative: <em>No es rojo, sino naranja.</em></p>`,
  input: { q: 'What relationship does the connector express?', items: [
    'Estudió mucho; sin embargo, suspendió. ? contrast*|consequence ~ sin embargo = however.',
    'Llovía, por lo tanto cancelaron el partido. ? contrast|consequence* ~ por lo tanto = therefore.',
    'Es bilingüe, es decir, habla dos idiomas como nativo. ? reformulation*|addition ~ es decir = that is.',
  ] },
  items: [
    'El hotel era caro; {sin embargo|no obstante}, la habitación era pequeña. ~ Unexpected contrast.',
    'No tengo coche, {así que|por eso|por lo tanto} voy en bici.',
    '{Como} no había nadie, me fui. ~ Cause at the beginning → como.',
    'No es español, {sino} argentino. ~ Correcting a negative → sino.',
    'Mi hermano es muy ordenado; yo, {en cambio}, soy un desastre.',
    'El proyecto es viable. {Además}, es barato.',
    'Habla cuatro idiomas; {de hecho}, trabaja como intérprete.',
    'Es políglota, {es decir}, habla muchos idiomas.',
    '{En primer lugar}, quiero agradecerles su presencia.',
    '{En resumen}, fue una experiencia inolvidable.',
    '! No es rojo, [pero>sino] naranja.',
    '! [Porque>Como] estaba cansado, me acosté pronto. ~ Cause at the start → como.',
    '! Me gusta el campo; [sin embargo,>además,] es más barato vivir allí. ~ Adding an argument, not a contrast.',
    'No hemos recibido el pago; [por consiguiente*|no obstante], el pedido queda cancelado.',
    'Me gusta el cine; {sobre todo}, el cine negro.',
    '{Dado que} no hay quórum, se suspende la reunión.',
    'Por un lado, es interesante; por {otro}, es arriesgado.',
  ],
},
{
  id: 'tildes', level: 'B1', title: 'Acentuación (tildes)', en: 'Written accents',
  summary: 'agudas, llanas, esdrújulas; hiatus (día, país); diacritics (tú/tu, sí/si, más/mas).',
  explain: `
<p>Every Spanish word has one stressed syllable. The <b>tilde</b> marks it only when the stress breaks the default rule.</p>
<table><tr><th>Type</th><th>Stress on</th><th>Takes a tilde when…</th><th>Examples</th></tr>
<tr><td><b>Aguda</b></td><td>last syllable</td><td>it ends in a <b>vowel, -n or -s</b></td><td>café, canción, compás · <i>but</i> reloj, pared, feliz</td></tr>
<tr><td><b>Llana</b></td><td>second-to-last</td><td>it does <b>not</b> end in vowel, -n, -s</td><td>árbol, lápiz, fácil, móvil · <i>but</i> casa, examen, lunes</td></tr>
<tr><td><b>Esdrújula</b></td><td>third-to-last</td><td><b>always</b></td><td>médico, rápido, teléfono, dígamelo</td></tr></table>
<h4>Hiatus</h4><p>A stressed <b>i/u</b> next to <b>a/e/o</b> always takes a tilde, whatever the rule says: <em>día, país, río, oído, reúne, Raúl, frío</em>.</p>
<h4>Diacritic tilde (one-syllable pairs)</h4>
<table><tr><td>tú (you) / tu (your)</td><td>él (he) / el (the)</td><td>mí (me) / mi (my)</td></tr><tr><td>sí (yes, itself) / si (if)</td><td>té (tea) / te (you, obj.)</td><td>sé (I know, be!) / se</td></tr>
<tr><td>dé (give) / de (of)</td><td>más (more) / mas (but)</td><td>aún (still) / aun (even)</td></tr></table>
<p>Question and exclamation words: <em>qué, cómo, dónde, cuándo, cuánto, quién, cuál</em> — also in indirect questions: <em>No sé <b>dónde</b> vive.</em></p>
<p>Since 2010: <em>solo, este, ese, aquel, guion, truhan</em> need no tilde. Monosyllables never take one except diacritics: <em>fue, dio, vio, fui, pie, bien</em>.</p>
<p>Use the <b>Tildes</b> drill for unlimited practice — words are syllabified and explained automatically.</p>`,
  input: { q: 'Listen and decide which word you hear.', audio: true, items: [
    'Término el trabajo. ? término (noun)*|termino (I finish)|terminó (he finished) ~ TÉR-mi-no = esdrújula (noun "end").',
    'Termino el trabajo. ? término|termino (I finish)*|terminó ~ ter-MI-no = llana.',
    'Terminó el trabajo. ? término|termino|terminó (he finished)* ~ ter-mi-NÓ = aguda ending in vowel.',
    'Mi papá es alto. ? papa (potato / pope)|papá (dad)* ~ pa-PÁ = aguda ending in vowel.',
  ] },
  items: [
    '[cancion|canción*] ~ Aguda ending in -n → tilde.',
    '[arbol|árbol*] ~ Llana ending in -l → tilde.',
    '[examen*|exámen] ~ Llana ending in -n → no tilde.',
    '[examenes|exámenes*] ~ Esdrújula → always a tilde.',
    '[reloj*|relój] ~ Aguda ending in -j → no tilde.',
    '[medico|médico*] ~ Esdrújula.',
    '[dia|día*] ~ Hiatus: stressed i next to a → tilde.',
    '[pais|país*] ~ Hiatus: pa-ís.',
    '[fue*|fué] ~ Monosyllable → no tilde.',
    '[cesped|césped*] ~ Llana ending in -d → tilde.',
    '¿{Tú} quieres {té}? ~ tú = you; té = tea.',
    '{Él} es el hermano de Ana. ~ él = he.',
    'Este regalo es para {mí}. ~ mí = me (after preposition).',
    '{Sí}, claro, si quieres te ayudo. ~ sí = yes; si = if.',
    'No sé {dónde} vive. ~ Indirect question → tilde.',
    '! Necesito [mas>más] tiempo. ~ más = more.',
    '! Mi hermano [esta>está] en casa. ~ está (verb) vs. esta (this).',
    '! ¿[Como>Cómo] te llamas?',
    '! Ayer [hablo>habló] con su jefe. ~ habló (he spoke) vs. hablo (I speak).',
    'Quiero que me {dé} una respuesta. ~ dé (give) vs. de (of).',
    '[Solo*|Sólo] quiero un café. ~ Since 2010, solo has no tilde.',
    '[jovenes|jóvenes*] ~ Esdrújula.',
    '[facil|fácil*] ~ Llana ending in -l.',
    '[ademas|además*] ~ Aguda ending in -s.',
    '[raiz|raíz*] ~ Hiatus ra-íz.',
  ],
},
];
