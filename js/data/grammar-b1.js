// Grammar topics B1 (see grammar-a1.js for the item mini-language).
export default [
{
  id: 'indef-imperf', level: 'B1', title: 'Indefinido vs. imperfecto', en: 'Preterite vs. imperfect',
  summary: 'Events that move the story (indefinido) vs. the scene behind them (imperfecto).',
  explain: `
<p>Think of a film: the <b>imperfecto</b> sets the scene and describes what <i>was going on</i>; the <b>indefinido</b> reports the events that <i>happened</i> and moved the story forward.</p>
<table><tr><th>INDEFINIDO — completed events</th><th>IMPERFECTO — background</th></tr>
<tr><td>Single completed actions: <em>Llamé a Ana.</em></td><td>Descriptions: <em>La casa era vieja.</em></td></tr>
<tr><td>Sequence of events: <em>Me levanté, me duché y salí.</em></td><td>Habits: <em>Siempre llamaba a Ana.</em></td></tr>
<tr><td>Limited duration: <em>Viví en Roma <b>dos años</b>.</em></td><td>Ongoing actions (interrupted): <em><b>Dormía</b> cuando sonó el teléfono.</em></td></tr>
<tr><td>Interrupting action: <em>…cuando <b>sonó</b> el teléfono.</em></td><td>Time, age, weather, feelings: <em>Eran las 3. Tenía 8 años. Estaba nervioso.</em></td></tr></table>
<h4>Meaning changes</h4><table>
<tr><td>conocía (knew) / <b>conocí</b> (met)</td><td>sabía (knew) / <b>supe</b> (found out)</td></tr>
<tr><td>quería (wanted) / <b>no quise</b> (refused)</td><td>podía (was able) / <b>pude</b> (managed)</td></tr>
<tr><td>tenía (had) / <b>tuve</b> (got, received)</td><td>había (there was) / <b>hubo</b> (there occurred)</td></tr></table>
<p>The same sentence can be both: <em>Ayer <b>estuve</b> enfermo</em> (I was ill yesterday — the whole day, closed) vs. <em>Ayer <b>estaba</b> enfermo, por eso no fui</em> (background for another event).</p>`,
  input: { q: 'Event in the story, or background?', items: [
    'Llovía mucho. ? event|background* ~ Imperfect sets the scene.',
    'De repente, se fue la luz. ? event*|background ~ "de repente" + preterite = an event.',
    'Mientras cenábamos, alguien llamó a la puerta. Which action interrupted the other? ? cenábamos|llamó* ~ The preterite interrupts the ongoing imperfect.',
    'Conocí a mi mujer en 2010. ? I knew her|I met her* ~ conocer in the preterite = to meet.',
    'Viví en Londres cinco años. ? a closed period (now finished)*|background description ~ A limited, closed duration → preterite.',
  ] },
  items: [
    'Cuando {era:ser} pequeño, {vivía:vivir} en un pueblo de la costa. (yo)',
    'Ayer, mientras {cocinaba:cocinar}, me {corté:cortar} un dedo. (yo)',
    '{Hacía:hacer} sol, así que {decidimos:decidir} ir a la playa.',
    'El sábado pasado {fuimos:ir} al teatro y después {cenamos:cenar} fuera.',
    'Mi abuelo {trabajó:trabajar} en esa fábrica durante cuarenta años. ~ Closed duration → preterite.',
    'Cuando {llegué:llegar} a casa, mis hijos ya {dormían|estaban durmiendo:dormir}.',
    'Antes {fumaba:fumar} mucho, pero lo {dejé:dejar} hace cinco años. (yo)',
    '{Conocí:conocer} a mi novia en una fiesta. (yo)',
    'Ya {sabía:saber} la noticia cuando me lo dijiste. (yo)',
    'Ayer {supe:saber} que estabas embarazada. ~ supe = I found out.',
    'Intenté abrir la puerta, pero no {pude:poder}. ~ pude/no pude = managed / failed.',
    '! Cuando era niño, [fui>iba] al colegio en autobús. ~ Habit → imperfect.',
    '! Ayer [estaba>estuve] en el médico dos horas. ~ Closed duration (dos horas) → preterite.',
    '! De repente [empezaba>empezó] a llover. ~ Sudden event → preterite.',
    'La casa [tuvo|tenía*] tres habitaciones y un jardín. ~ Description → imperfect.',
    'Anoche [hubo*|había] un accidente en la autopista. ~ An event occurred → hubo.',
    'Ella [estaba*|estuvo] muy cansada, por eso se acostó pronto. ~ Background state explaining an event.',
    '{Eran:ser} las tres de la mañana cuando {sonó:sonar} el teléfono.',
    'Todos los veranos {íbamos:ir} al pueblo, pero aquel año {fuimos:ir} a Francia.',
    'No {quise:querer} ir a la fiesta, así que me quedé en casa. ~ No quise = I refused.',
    'Mientras tú {estudiabas:estudiar}, yo {limpiaba:limpiar} la casa. ~ Two simultaneous ongoing actions → both imperfect.',
    'El ladrón {entró:entrar} por la ventana que {estaba:estar} abierta.',
  ],
},
{
  id: 'perfecto-indef', level: 'B1', title: 'Perfecto vs. indefinido', en: 'He hablado vs. hablé',
  summary: 'Time frame still open (hoy, este año, ya, nunca) vs. closed (ayer, en 2019, hace un mes).',
  explain: `
<p>In <b>Spain</b> the choice depends on whether the time frame includes the present.</p>
<table><tr><th>PERFECTO (he hablado)</th><th>INDEFINIDO (hablé)</th></tr>
<tr><td>hoy, esta mañana, esta semana, este año, últimamente</td><td>ayer, anoche, la semana pasada, el año pasado, en 2019</td></tr>
<tr><td>ya, todavía no, nunca, alguna vez (life experience)</td><td>hace dos días, el otro día, aquel verano</td></tr>
<tr><td><em>Este año he viajado mucho.</em></td><td><em>El año pasado viajé mucho.</em></td></tr></table>
<p>Very recent past is also expressed with perfecto in Spain: <em>¿Qué <b>ha dicho</b>? (just now)</em>.</p>
<p>In most of <b>Latin America</b> (and the Canaries, Galicia, Asturias) the indefinido is used in both columns: <em>Hoy trabajé mucho. ¿Ya comiste?</em> The perfecto there stresses continuing relevance: <em>Siempre he vivido aquí.</em> Both are correct — be consistent.</p>`,
  input: { q: 'Is the time frame open (includes now) or closed?', items: [
    'Esta semana he ido dos veces al gimnasio. ? open*|closed ~ "esta semana" isn\'t over → perfecto.',
    'La semana pasada fui dos veces al gimnasio. ? open|closed* ~ "la semana pasada" is finished → indefinido.',
    '¿Alguna vez has comido pulpo? ? open*|closed ~ Life experience up to now → perfecto.',
  ] },
  items: [
    'Esta mañana {he desayunado:desayunar} muy poco. (yo)',
    'Ayer {desayuné:desayunar} churros con chocolate. (yo)',
    'Este año {hemos tenido:tener} mucho trabajo. (nosotros)',
    'En 2018 mi hermana {tuvo:tener} un bebé.',
    'Nunca {he estado:estar} en Argentina. (yo)',
    'Hace tres años {estuve:estar} en Buenos Aires. (yo)',
    '¿Ya {has terminado:terminar} el informe? (tú)',
    'El otro día {vi:ver} a tu hermano en el metro. (yo)',
    'Últimamente {he dormido:dormir} fatal. (yo)',
    '! Ayer [he ido>fui] al dentista. ~ ayer = closed → indefinido.',
    '! En 2015 [hemos vivido>vivimos] en Chile. ~ A specific past year → indefinido.',
    '! Ayer por la tarde [hemos visto>vimos] una película. ~ ayer is a closed time frame → indefinido.',
    'Hoy [he comido*|comía] con mis compañeros. ~ Spain: hoy → perfecto.',
    'Todavía no {ha llegado:llegar} el paquete.',
    '¿Qué {hiciste:hacer} anoche? (tú)',
    'Esta semana {ha hecho:hacer} un tiempo horrible.',
    'Mi abuelo {murió:morir} en 1999.',
  ],
},
{
  id: 'pluscuamperfecto', level: 'B1', title: 'Pluscuamperfecto', en: 'Pluperfect (había hecho)',
  summary: 'había + participle: an action before another past action.',
  explain: `
<p><b>había, habías, había, habíamos, habíais, habían + participle</b></p>
<p>It expresses a past action that happened <b>before</b> another past moment — "had done".</p>
<p class="ex">Cuando llegué a la estación, el tren ya <b>había salido</b>. · Nunca <b>había visto</b> algo así. · Me dijo que <b>había perdido</b> las llaves.</p>
<p>Signals: <em>ya, todavía no, nunca antes, antes de que</em>. Very common in reported speech (see Estilo indirecto) and to explain causes: <em>Estaba cansado porque <b>había trabajado</b> doce horas.</em></p>`,
  input: { q: 'Which happened first?', items: [
    'Cuando llegué, la película ya había empezado. ? I arrived first|The film started first* ~ Pluperfect = earlier past.',
    'Me dijo que había estado en Cuba. ? The trip to Cuba was first*|Telling me was first ~ había estado precedes "me dijo".',
  ] },
  drill: { verbs: ['salir', 'empezar', 'ver', 'hacer', 'decir', 'volver', 'romper', 'escribir', 'terminar', 'comer', 'ir'], tenses: ['plusc'] },
  items: [
    'Cuando llegamos, la fiesta ya {había terminado:terminar}.',
    'Nunca {había visto:ver} un paisaje tan bonito. (yo)',
    'Estaba agotada porque {había dormido:dormir} muy poco.',
    'Me dijo que ya {había hecho:hacer} los deberes. (él)',
    'Cuando llamé, mis padres ya {habían salido:salir}.',
    'No pude entrar porque {había perdido:perder} las llaves. (yo)',
    'Antes de este viaje, nunca {habíamos volado:volar} en avión.',
    '! Cuando llegué al cine, la película ya [empezó>había empezado]. ~ Earlier past → pluperfect.',
    '! Me dijo que [ha roto>había roto] el jarrón. ~ Reported past → pluperfect.',
    'Yo ya {había leído:leer} el libro cuando vi la película.',
    '¿Ya {habías estado:estar} aquí antes? (tú)',
    'El profesor nos preguntó si {habíamos entendido:entender} la lección.',
    'Al día siguiente descubrí que alguien {había abierto:abrir} mi correo.',
    'Ellos ya {habían vuelto:volver} cuando empezó la tormenta.',
  ],
},
{
  id: 'condicional', level: 'B1', title: 'Condicional simple', en: 'Conditional',
  summary: 'hablaría, tendría, haría: politeness, advice, hypotheses, future in the past.',
  explain: `
<p>Infinitive (or the irregular future stem) + <b>-ía, -ías, -ía, -íamos, -íais, -ían</b>.</p>
<p class="ex">hablaría · comería · <b>tendr</b>ía · <b>har</b>ía · <b>dir</b>ía · <b>podr</b>ía · <b>sabr</b>ía · <b>saldr</b>ía · <b>vendr</b>ía · <b>pondr</b>ía · <b>querr</b>ía · <b>habr</b>ía</p>
<h4>Uses</h4><ul>
<li>Polite requests: <em>¿<b>Podrías</b> ayudarme? Me <b>gustaría</b> un café.</em></li>
<li>Advice: <em>Yo que tú, <b>hablaría</b> con ella. <b>Deberías</b> descansar.</em></li>
<li>Hypothetical situations: <em>Con más dinero, <b>viajaría</b> más.</em> / <em>Si tuviera tiempo, <b>leería</b> más</em> (B2).</li>
<li>Future in the past: <em>Dijo que <b>vendría</b>.</em></li>
<li>Probability in the past: <em>—¿A qué hora llegó? —<b>Serían</b> las diez</em> (it must have been about 10).</li></ul>`,
  input: { q: 'What function does the conditional have?', items: [
    '¿Podrías cerrar la puerta? ? polite request*|past probability ~ Politeness.',
    'Yo que tú, no iría. ? advice*|future in the past ~ "Yo que tú" = If I were you.',
    'Me dijo que llegaría tarde. ? advice|future seen from the past* ~ Reported future.',
    'Tendría unos veinte años cuando se casó. ? She was probably about 20*|She would have 20 years ~ Past probability.',
  ] },
  drill: { verbs: ['hablar', 'comer', 'vivir', 'tener', 'hacer', 'decir', 'poder', 'salir', 'venir', 'poner', 'saber', 'querer', 'haber', 'gustar', 'deber'], tenses: ['cond'] },
  items: [
    'Me {gustaría:gustar} ir a Japón algún día.',
    '¿{Podrías:poder} pasarme la sal? (tú)',
    'Yo que tú, {hablaría:hablar} con el jefe.',
    'Con más tiempo, {haría:hacer} más deporte. (yo)',
    'Juan dijo que {vendría:venir} a las ocho.',
    'Tú {deberías:deber} dormir más.',
    '¿Qué {harías:hacer} tú en mi lugar?',
    'Nosotros nunca {diríamos:decir} eso.',
    '—¿Cuántos años tenía? —No sé, {tendría:tener} unos cuarenta. ~ Past probability.',
    '! ¿[Puedrías>Podrías] ayudarme? ~ poder → podr-.',
    '! Yo en tu lugar no [diciría>diría] nada. ~ decir → dir-.',
    'Me prometiste que [llamarías*|llamarás] y no llamaste. ~ Future in the past → conditional.',
    'En una isla desierta, no {sabría:saber} qué hacer. (yo)',
    '¿Les {importaría:importar} esperar un momento?',
    'Sin ti, no {podría:poder} vivir. (yo)',
    'Ellos {saldrían:salir} antes, pero había mucho tráfico.',
  ],
},
{
  id: 'subj-presente', level: 'B1', title: 'Presente de subjuntivo: formas', en: 'Present subjunctive — forms',
  summary: 'yo form − o + opposite vowel: hable, coma, tenga, haga; irregulars sea, vaya, esté, dé, sepa, haya.',
  explain: `
<p><b>Recipe:</b> take the <i>yo</i> present, remove <b>-o</b>, add the "opposite" endings: -ar → <b>-e</b>; -er/-ir → <b>-a</b>.</p>
<table><tr><th></th><th>hablar</th><th>comer</th><th>tener (tengo)</th></tr>
<tr><td>yo</td><td>hable</td><td>coma</td><td>tenga</td></tr><tr><td>tú</td><td>hables</td><td>comas</td><td>tengas</td></tr>
<tr><td>él</td><td>hable</td><td>coma</td><td>tenga</td></tr><tr><td>nosotros</td><td>hablemos</td><td>comamos</td><td>tengamos</td></tr>
<tr><td>vosotros</td><td>habléis</td><td>comáis</td><td>tengáis</td></tr><tr><td>ellos</td><td>hablen</td><td>coman</td><td>tengan</td></tr></table>
<p>Yo-irregulars carry through: hago → <b>haga</b>, digo → <b>diga</b>, conozco → <b>conozca</b>, salgo → <b>salga</b>, pongo → <b>ponga</b>, vengo → <b>venga</b>.</p>
<p><b>Six irregulars:</b> ser → <b>sea</b> · ir → <b>vaya</b> · estar → <b>esté</b> · dar → <b>dé</b> · saber → <b>sepa</b> · haber → <b>haya</b></p>
<p>Stem changers keep the boot (piense, vuelva); <b>-ir</b> stem changers also change in nosotros/vosotros: <b>durmamos, pidamos, sintamos</b>.</p>
<p>Spelling: busque, llegue, empiece, escoja, siga.</p>`,
  input: { q: 'Indicative or subjunctive form?', items: [
    'que hable ? indicative|subjunctive* ~ -ar verb with -e ending = subjunctive.',
    'que come ? indicative*|subjunctive ~ -er verb with -e ending = indicative (subjunctive: coma).',
    'que vivan ? indicative|subjunctive* ~ -ir verb with -a = subjunctive.',
    'que estudia ? indicative*|subjunctive ~ -ar verb with -a = indicative (subjunctive: estudie).',
  ] },
  drill: { verbs: ['hablar', 'comer', 'vivir', 'tener', 'hacer', 'decir', 'ser', 'ir', 'estar', 'dar', 'saber', 'haber', 'poder', 'pedir', 'dormir', 'conocer', 'salir', 'buscar', 'llegar', 'empezar'], tenses: ['psubj'] },
  items: [
    'Quiero que tú {hables:hablar} con ella.',
    'Espero que {comáis:comer} bien en el viaje. (vosotros)',
    'Es necesario que {tengamos:tener} paciencia.',
    'Ojalá {haga:hacer} buen tiempo mañana.',
    'Te pido que me {digas:decir} la verdad.',
    'Espero que {sea:ser} una buena película.',
    'No creo que {vayan:ir} a venir.',
    'Me alegro de que {estés:estar} mejor.',
    'Quiero que me {des:dar} tu opinión.',
    'Ojalá {sepa:saber} la respuesta.',
    'Espero que no {haya:haber} problemas.',
    'Es importante que {durmamos:dormir} ocho horas. ~ -ir stem changer: o → u in nosotros.',
    'Prefiero que {pidamos:pedir} una pizza.',
    'Quiero que {conozcas:conocer} a mis padres.',
    'Cuando {llegues:llegar}, llámame. ~ -gar → -gue.',
    '! Espero que [tenes>tengas] suerte.',
    '! Ojalá [vas>vayas] a la fiesta.',
    '! Quiero que [empezas>empieces] ya. ~ empezar → empiece (stem + z→c).',
    'Busco a alguien que {pueda:poder} ayudarme.',
    'No es necesario que {vengas:venir} mañana.',
    'Es mejor que {salgamos:salir} temprano.',
    'Ojalá {encuentres:encontrar} trabajo pronto.',
  ],
},
{
  id: 'subj-deseo', level: 'B1', title: 'Subjuntivo: deseos, influencia, emoción', en: 'Subjunctive: wishes, influence, emotions',
  summary: 'quiero que, te pido que, me alegra que, ojalá, es importante que… Same subject → infinitive.',
  explain: `
<p>The subjunctive appears in the <b>que</b>-clause when the main verb expresses influence on, or a reaction to, <i>another person's</i> action — something not presented as plain fact.</p>
<table><tr><th>Main clause</th><th>Examples</th></tr>
<tr><td><b>Wish / influence</b></td><td>querer, desear, preferir, pedir, recomendar, aconsejar, exigir, prohibir, permitir, necesitar que…</td></tr>
<tr><td><b>Emotion</b></td><td>me alegra, me molesta, me sorprende, me encanta, siento, tengo miedo de, odio que…</td></tr>
<tr><td><b>Value judgement</b></td><td>es importante / necesario / mejor / normal / increíble / una pena que…</td></tr>
<tr><td><b>Ojalá</b> (I hope)</td><td>Ojalá (que) llueva.</td></tr></table>
<h4>Same subject → infinitive</h4>
<p class="ex">Quiero <b>ir</b> (I want to go) · Quiero que <b>vayas</b> (I want you to go)<br>Me alegro de <b>estar</b> aquí · Me alegro de que <b>estés</b> aquí</p>
<p>Impersonal expressions take the infinitive when no specific person: <em>Es importante <b>dormir</b> bien</em> vs. <em>Es importante que <b>duermas</b> bien.</em></p>
<p>Facts with <i>es verdad / es cierto / es obvio que</i> → indicative: <em>Es verdad que <b>es</b> caro.</em></p>`,
  input: { q: 'Is the speaker stating a fact or expressing a wish/reaction?', items: [
    'Sé que vienes. ? fact*|wish ~ saber que + indicative = fact.',
    'Quiero que vengas. ? fact|wish* ~ querer que + subjunctive.',
    'Me alegra que estés aquí. ? reaction to a situation*|uncertain fact ~ Emotion → subjunctive (even if it\'s true!).',
    'Es verdad que es difícil. ? fact*|value judgement ~ es verdad que → indicative.',
  ] },
  items: [
    'Mis padres quieren que {estudie:estudiar} medicina. (yo)',
    'Te recomiendo que {pruebes:probar} el gazpacho.',
    'Me alegra mucho que {hayas venido|vengas:venir}. ~ Emotion → subjunctive.',
    'Es importante que {hagáis:hacer} ejercicio. (vosotros)',
    'El médico me ha pedido que {deje:dejar} de fumar.',
    'Ojalá no {llueva:llover} el día de la boda.',
    'Siento que no {puedas:poder} venir.',
    'Odio que la gente {hable:hablar} por el móvil en el cine.',
    'Es normal que {estés:estar} nervioso antes de un examen.',
    'Quiero {ir:ir} al concierto. ~ Same subject → infinitive.',
    'Prefiero que {vayamos:ir} en tren.',
    '! Quiero que tú [vienes>vengas] conmigo.',
    '! Espero que [tienes>tengas] un buen viaje.',
    '! Quiero que [ir>vaya] al médico. (yo quiero, él va) ~ Different subjects → que + subjunctive.',
    'Es verdad que el español [es*|sea] fácil de pronunciar. ~ Statement of fact → indicative.',
    'Me sorprende que no [sabes|sepas*] nadar.',
    'Mi jefe no permite que {usemos:usar} el móvil en el trabajo.',
    'Es una pena que {te vayas:irse} tan pronto.',
    'Necesito que me {ayudes:ayudar} con la mudanza.',
    'Te aconsejo que no {digas:decir} nada.',
    'Me molesta que mis vecinos {pongan:poner} la música tan alta.',
  ],
},
{
  id: 'subj-duda', level: 'B1', title: 'Subjuntivo: duda y opinión negada', en: 'Subjunctive: doubt & negated opinion',
  summary: 'creo que + indicative but no creo que + subjunctive; quizás, dudo que, es posible que.',
  explain: `
<table><tr><th>INDICATIVE — affirming</th><th>SUBJUNCTIVE — doubting / denying</th></tr>
<tr><td>Creo que <b>tiene</b> razón.</td><td>No creo que <b>tenga</b> razón.</td></tr>
<tr><td>Pienso que <b>es</b> buena idea.</td><td>No pienso que <b>sea</b> buena idea.</td></tr>
<tr><td>Estoy seguro de que <b>viene</b>.</td><td>Dudo que <b>venga</b>.</td></tr>
<tr><td>Es evidente que <b>está</b> cansado.</td><td>Es posible / probable que <b>esté</b> cansado.</td></tr>
<tr><td>Me parece que <b>llueve</b>.</td><td>No me parece que <b>llueva</b>.</td></tr></table>
<p>Opinion verbs (creer, pensar, parecer, opinar, suponer, estar seguro) take <b>indicative when affirmative</b> and <b>subjunctive when negative</b>.</p>
<p><b>Quizás / tal vez / posiblemente</b> + either mood: subjunctive = more doubt. <b>A lo mejor</b> always takes indicative: <em>A lo mejor viene.</em></p>
<p>Negated questions about opinion can take indicative: <em>¿No crees que es tarde?</em> (you're suggesting it is).</p>`,
  input: { q: 'Does the speaker believe it or doubt it?', items: [
    'Creo que Ana está en casa. ? believes it*|doubts it ~ Affirmative opinion → indicative.',
    'No creo que Ana esté en casa. ? believes it|doubts it* ~ Negated opinion → subjunctive.',
    'Dudo que lo sepa. ? believes it|doubts it* ~ dudar que + subjunctive.',
  ] },
  items: [
    'Creo que {es:ser} una buena idea.',
    'No creo que {sea:ser} una buena idea.',
    'Pienso que Juan {tiene:tener} razón.',
    'No pienso que Juan {tenga:tener} razón.',
    'Dudo que {lleguen:llegar} a tiempo.',
    'Es posible que mañana {nieve:nevar}.',
    'Estoy seguro de que lo {vas:ir} a conseguir.',
    'No estoy seguro de que lo {consiga:conseguir}. (él)',
    'Me parece que {va:ir} a llover.',
    'No me parece que {haga:hacer} tanto frío.',
    'A lo mejor {vamos:ir} al cine esta noche. ~ a lo mejor + indicative.',
    'Quizás {tengas:tener} razón. ~ quizás + subjunctive = doubt.',
    '! No creo que [es>sea] verdad.',
    '! Creo que [sea>es] demasiado tarde.',
    '! Es probable que [viene>venga] mañana.',
    'Es evidente que [está*|esté] enfadado. ~ es evidente que → indicative (certainty).',
    'No es cierto que los españoles [duermen|duerman*] la siesta todos los días.',
    'Puede que {tenga:tener} que trabajar el sábado. (yo) ~ puede que + subjunctive.',
    'Es imposible que {sepan:saber} la verdad.',
    '¿No crees que {es:ser} un poco caro? ~ Rhetorical negative question → indicative.',
  ],
},
{
  id: 'ser-estar-2', level: 'B1', title: 'Ser y estar (2)', en: 'Ser vs. estar — advanced',
  summary: 'Adjectives that change meaning (ser listo / estar listo), estar + participle vs. ser + participle.',
  explain: `
<h4>Adjectives that change meaning</h4>
<table><tr><th></th><th>ser</th><th>estar</th></tr>
<tr><td>listo</td><td>clever</td><td>ready</td></tr><tr><td>aburrido</td><td>boring</td><td>bored</td></tr>
<tr><td>malo</td><td>bad (person/thing)</td><td>ill / tastes bad</td></tr><tr><td>bueno</td><td>good</td><td>tasty / attractive (colloq.) / well</td></tr>
<tr><td>rico</td><td>rich</td><td>delicious</td></tr><tr><td>vivo</td><td>lively, sharp</td><td>alive</td></tr>
<tr><td>verde</td><td>green</td><td>unripe / inexperienced</td></tr><tr><td>orgulloso</td><td>arrogant</td><td>proud (of)</td></tr>
<tr><td>atento</td><td>considerate</td><td>paying attention</td></tr><tr><td>despierto</td><td>sharp, alert</td><td>awake</td></tr></table>
<h4>Ser vs. estar + participle</h4>
<p><b>ser</b> + participle = passive action: <em>La casa <b>fue construida</b> en 1900.</em><br>
<b>estar</b> + participle = resulting state: <em>La casa <b>está construida</b> en piedra.</em> · <em>La tienda está cerrada.</em></p>
<h4>Subjective impression</h4><p><em>¡Qué alto <b>estás</b>!</em> (you've grown) · <em>La paella <b>está</b> buenísima</em> (this one tastes) vs. <em>La paella <b>es</b> un plato valenciano.</em></p>
<p><b>Muerto</b> always takes estar: <em>Está muerto.</em> <b>Estar de</b> + temporary role: <em>Está de camarero este verano.</em></p>`,
  input: { q: 'Choose the meaning.', items: [
    'Mi hijo es muy listo. ? clever*|ready ~ ser listo = clever.',
    '¿Estás listo? ? clever|ready* ~ estar listo = ready.',
    'La clase es aburrida. ? The class is boring*|The class is bored ~ ser aburrido = boring.',
    'Los alumnos están aburridos. ? boring|bored* ~ estar aburrido = bored.',
    'Mi abuelo está muy bien para su edad. ? He is a good person|He is in good shape* ~ estar bien = healthy/fine.',
  ] },
  items: [
    'Date prisa, ¿todavía no {estás:estar} listo? ~ ready → estar listo.',
    'Esta novela {es:ser} aburridísima; no la termines.',
    'Los niños {están:estar} aburridos porque llueve.',
    'Mi abuela {está:estar} mala, tiene gripe. ~ estar malo = ill.',
    'Este gazpacho {está:estar} riquísimo. ~ estar rico = tasty.',
    'Ese empresario {es:ser} muy rico. ~ ser rico = wealthy.',
    'Los plátanos todavía {están:estar} verdes. ~ unripe.',
    'El Quijote {fue:ser} escrito por Cervantes. ~ Passive → ser + participle.',
    'Cuando llegamos, el museo ya {estaba:estar} cerrado. ~ Resulting state → estar.',
    'Ese chico {es:ser} muy listo; siempre saca buenas notas.',
    '! La sopa [es>está] fría; caliéntala. ~ Temporary state → estar.',
    '! Mi gato [es>está] muerto. ~ muerto → always estar.',
    '! La conferencia [está>es] en el aula magna. ~ Event location → ser.',
    'Mis padres [son|están*] muy orgullosos de mí. ~ estar orgulloso de = proud of (ser orgulloso = arrogant).',
    'Este verano Pablo {está:estar} de camarero en Ibiza. ~ estar de + temporary job.',
    '¡Qué guapa {estás:estar} con ese vestido! ~ Impression right now.',
    'Ya {son:ser} las doce; vámonos.',
    'La puerta {está:estar} rota desde ayer.',
    'Mi hermana {es:ser} muy atenta: siempre se acuerda de mi cumpleaños. ~ ser atento = considerate.',
  ],
},
{
  id: 'relativos', level: 'B1', title: 'Pronombres relativos', en: 'Relative pronouns',
  summary: 'que, quien, donde, lo que; preposition + el/la que.',
  explain: `
<table><tr><td><b>que</b></td><td>who/which/that — the default, for people and things</td><td>El chico <b>que</b> vive aquí. El libro <b>que</b> leo.</td></tr>
<tr><td><b>quien(es)</b></td><td>people, mainly after a preposition or between commas</td><td>La chica <b>con quien</b> hablé. Mi tío, <b>quien</b> vive en Lima, …</td></tr>
<tr><td><b>prep. + el/la/los/las que</b></td><td>after prepositions</td><td>La casa <b>en la que</b> nací. El tema <b>del que</b> te hablé.</td></tr>
<tr><td><b>donde</b></td><td>place (= en el que)</td><td>El pueblo <b>donde</b> veraneo.</td></tr>
<tr><td><b>lo que</b></td><td>what (= the thing that), or refers to a whole clause</td><td><b>Lo que</b> quiero es dormir. Llegó tarde, <b>lo que</b> me molestó.</td></tr></table>
<p>English can drop "that"; Spanish cannot: <em>La película <b>que</b> vimos</em> (the film we saw).</p>
<p>English prepositions at the end move to the front: "the person I talked to" → <em>la persona <b>con la que</b> hablé</em>.</p>
<p><i>Que</i> without a tilde here! (¿Qué? is the question word.)</p>`,
  input: { q: 'What does the relative refer to?', items: [
    'El hombre que saludó a María es mi tío. ? the man greeted María*|María greeted the man ~ que = subject of saludó.',
    'El hombre al que saludó María es mi tío. ? the man greeted María|María greeted the man* ~ al que = object.',
    'Me regaló un libro, lo que me sorprendió mucho. ? The book surprised me|The fact that he gave me a book surprised me* ~ lo que refers to the whole clause.',
  ] },
  items: [
    'La chica {que} te presenté ayer es mi prima.',
    'Este es el restaurante {donde} nos conocimos.',
    'No entiendo {lo que} dices.',
    'El amigo con {quien|el que} viajé a Perú vive en Bilbao.',
    'La empresa en {la que} trabajo es alemana.',
    'Los libros {que} me prestaste son muy buenos.',
    '{Lo que} más me gusta de Madrid es la gente.',
    'El tema del {que} hablamos es muy delicado.',
    '! El libro [lo que>que] compré es muy interesante. ~ With a noun → que.',
    '! La persona [quien>que] llamó no dejó su nombre. ~ Restrictive clause without preposition → que.',
    '! Esta es la casa [que>en la que|donde] vivía de niño. ~ vivir en → preposition needed.',
    'Hizo [que|lo que*] le pedí. ~ "what" = lo que.',
    'Mi hermana, {quien|que} vive en Londres, viene mañana. ~ Between commas, both work.',
    'Las personas para {las que|quienes} trabajo son muy exigentes.',
    'Esa es la razón por {la que} no vine.',
    'Perdimos el tren, {lo que} nos obligó a esperar dos horas.',
    'El hotel {en el que|donde} nos alojamos tenía piscina.',
    'No me gusta la gente {que} miente.',
  ],
},
{
  id: 'imperativo-pron', level: 'B1', title: 'Imperativo con pronombres', en: 'Commands with pronouns',
  summary: 'dímelo / no me lo digas, siéntate / no te sientes, vámonos, sentaos.',
  explain: `
<p><b>Affirmative</b>: pronouns attach to the end (indirect before direct). Add a tilde if the stress would otherwise move:</p>
<p class="ex">compra + lo → <b>cómpralo</b> · di + me + lo → <b>dímelo</b> · siéntese · tráigamelas</p>
<p><b>Negative</b>: pronouns go before the verb, separately: <em>No lo compres. No me lo digas. No se siente.</em></p>
<h4>Reflexive commands</h4>
<table><tr><td>tú</td><td>levántate / no te levantes</td></tr><tr><td>usted</td><td>levántese / no se levante</td></tr>
<tr><td>nosotros</td><td>levantémonos (drop -s) / no nos levantemos</td></tr>
<tr><td>vosotros</td><td>levantaos (drop -d) / no os levantéis — except <b>idos</b></td></tr>
<tr><td>ustedes</td><td>levántense / no se levanten</td></tr></table>
<p>With <i>se</i> + nosotros, drop the -s too: <em>digámoselo</em>. One-syllable commands + one pronoun need no tilde: <em>dime, hazlo, ponte, dame</em>.</p>`,
  input: { q: 'Affirmative or negative order?', items: [
    'Dímelo. ? Tell me (it)*|Don\'t tell me ~ attached pronouns = affirmative.',
    'No me lo digas. ? Tell me|Don\'t tell me* ~ pronouns before the verb = negative.',
    'Sentaos. ? to vosotros*|to ustedes ~ -aos = vosotros reflexive.',
  ] },
  drill: { verbs: ['levantarse', 'sentarse', 'ponerse', 'irse', 'vestirse', 'acostarse', 'ducharse', 'callarse'], tenses: ['imp', 'impneg'] },
  items: [
    'Este pastel está buenísimo, {pruébalo:probar + lo}. (tú)',
    'Si ves a Ana, {dile:decir + le} que la llamaré. (tú)',
    'Son las ocho: ¡{levántate:levantarse}! (tú)',
    'No {te preocupes:preocuparse}, todo saldrá bien. (tú)',
    'Señor, {siéntese:sentarse}, por favor. (usted)',
    'Ese libro es mío, {devuélvemelo:devolver + me + lo}. (tú)',
    'Si no te gusta, no {te lo pongas:ponerse + lo}. (tú)',
    'Ya es tarde. ¡{Vámonos:irse}! (nosotros)',
    'Niños, {lavaos:lavarse} las manos antes de comer. (vosotros)',
    'Señores, {pónganse:ponerse} el cinturón. (ustedes)',
    'No {me lo digas:decir + me + lo}, quiero que sea una sorpresa. (tú)',
    '! [Te sienta>Siéntate] aquí, a mi lado. ~ Affirmative command → pronoun attached: siéntate.',
    '! No [dígaselo>se lo diga] a nadie, por favor. (usted) ~ Negative → pronouns before.',
    '! [Pónete>Ponte] el abrigo. (tú) ~ pon + te = ponte: a llana ending in a vowel → no tilde.',
    '[Dámelo*|Dame lo|Me lo da] ahora mismo. (tú)',
    '{Hazlo:hacer + lo} como quieras. (tú)',
    'La carta para mamá: {escríbesela:escribir + se + la} hoy. (tú)',
    'No {os levantéis:levantarse} todavía. (vosotros)',
    '{Sentémonos:sentarse} aquí. (nosotros)',
  ],
},
];
