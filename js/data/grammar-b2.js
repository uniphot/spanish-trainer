// Grammar topics B2 (see grammar-a1.js for the item mini-language).
export default [
{
  id: 'subj-relativo', level: 'B2', title: 'Subjuntivo en oraciones de relativo', en: 'Subjunctive in relative clauses',
  summary: 'Busco un piso que tenga terraza (unknown) vs. Tengo un piso que tiene terraza (known).',
  explain: `
<p>A relative clause takes the <b>subjunctive</b> when the noun it describes is <b>unknown, hypothetical or non-existent</b> for the speaker, and the <b>indicative</b> when it is known to exist.</p>
<table><tr><th>Indicative — identified</th><th>Subjunctive — not identified</th></tr>
<tr><td>Tengo un amigo que <b>habla</b> ruso.</td><td>Busco a alguien que <b>hable</b> ruso.</td></tr>
<tr><td>Hay un bar que <b>abre</b> los lunes.</td><td>¿Hay algún bar que <b>abra</b> los lunes?</td></tr>
<tr><td>Conozco a alguien que lo <b>sabe</b>.</td><td>No conozco a nadie que lo <b>sepa</b>.</td></tr>
<tr><td>Haz lo que <b>quieres</b> (I know what you want).</td><td>Haz lo que <b>quieras</b> (whatever you want).</td></tr></table>
<p>Typical triggers: <i>buscar, necesitar, querer</i> + indefinite noun; questions with <i>¿hay…?</i>; negatives <i>no hay nadie / nada / ningún … que</i>; <i>el/la/lo que</i> + future reference (<em>el que llegue primero</em>), <i>cualquier… que</i>, <i>donde/como/cuando quieras</i>.</p>
<p>Note the personal <b>a</b> disappears when the person is unknown: <em>Busco <b>un</b> profesor que…</em> (but <em>Busco <b>a</b> alguien que…</em>).</p>`,
  input: { q: 'Does the speaker know that such a thing/person exists?', items: [
    'Busco un piso que tenga balcón. ? yes, a specific flat|no, any flat with a balcony* ~ Subjunctive → not identified.',
    'Vivo en un piso que tiene balcón. ? yes, a specific flat*|no ~ Indicative → known.',
    'No hay nadie que entienda esto. ? Someone understands|No one understands* ~ Non-existent → subjunctive.',
    'Haz lo que quieras. ? I know what you want|Whatever you want* ~ Subjunctive = open choice.',
  ] },
  items: [
    'Busco un trabajo que {sea:ser} más interesante.',
    'Tengo un trabajo que {es:ser} muy interesante.',
    'Necesitamos a alguien que {sepa:saber} programar.',
    '¿Conoces algún restaurante que {esté:estar} abierto ahora?',
    'No hay nada que {puedas:poder} hacer.',
    'Quiero un coche que no {gaste:gastar} mucha gasolina.',
    'Mi hermana tiene un perro que {come:comer} de todo.',
    'El que {termine:terminar} primero, que avise. ~ Future/unknown person → subjunctive.',
    'Puedes sentarte donde {quieras:querer}.',
    'No conozco a nadie que {viva:vivir} en Islandia.',
    '! Busco una casa que [tiene>tenga] jardín. ~ Not identified → subjunctive.',
    '! Tengo una vecina que [sepa>sabe] cinco idiomas. ~ Known person → indicative.',
    '! No hay ningún alumno que [ha>haya] aprobado. ~ Non-existent → subjunctive.',
    'Haz [lo que*|que] te parezca mejor.',
    'Los estudiantes que [quieren|quieran*] participar pueden apuntarse aquí. ~ Whoever wants (open group) → subjunctive.',
    'Dame un libro que me {haga:hacer} reír.',
    'Hay una farmacia que {abre:abrir} las 24 horas.',
    'Cualquier persona que {necesite:necesitar} ayuda puede llamarnos.',
  ],
},
{
  id: 'subj-temporal', level: 'B2', title: 'Subjuntivo: oraciones temporales y finales', en: 'Subjunctive: time & purpose clauses',
  summary: 'cuando llegues (future) vs. cuando llego (habit); para que, antes de que (always subjunctive).',
  explain: `
<h4>Time conjunctions — cuando, en cuanto, hasta que, mientras, tan pronto como, después de que</h4>
<table><tr><th>Future (not yet happened) → SUBJUNCTIVE</th><th>Habit or past → INDICATIVE</th></tr>
<tr><td>Cuando <b>llegues</b>, llámame.</td><td>Cuando <b>llego</b> a casa, ceno. / Cuando <b>llegué</b>, cené.</td></tr>
<tr><td>Esperaré hasta que <b>vuelvas</b>.</td><td>Esperé hasta que <b>volviste</b>.</td></tr>
<tr><td>En cuanto <b>sepa</b> algo, te aviso.</td><td>En cuanto <b>supe</b> algo, te avisé.</td></tr></table>
<p><b>Never the future after cuando:</b> <s>cuando llegarás</s> → <em>cuando llegues</em>. (In questions, ¿cuándo? takes indicative: <em>¿Cuándo vendrás?</em>)</p>
<h4>Always subjunctive</h4><p><b>para que, a fin de que, antes de que, sin que, a no ser que, con tal de que, en caso de que</b></p>
<p class="ex">Te lo explico <b>para que</b> lo entiendas. · Vete <b>antes de que</b> llueva. · Salió <b>sin que</b> nadie lo viera.</p>
<h4>Same subject → infinitive</h4><p><em>Estudio <b>para aprobar</b>.</em> vs. <em>Te ayudo <b>para que apruebes</b>.</em> · <em>Antes de <b>salir</b>, cierro.</em></p>`,
  input: { q: 'Has the action happened / does it happen regularly, or is it still in the future?', items: [
    'Cuando llego a casa, me ducho. ? habit*|future ~ Indicative = habit.',
    'Cuando llegue a casa, me ducharé. ? habit|future* ~ Subjunctive = not yet happened.',
    'Me llamó en cuanto llegó. ? past*|future ~ Indicative = completed past.',
  ] },
  items: [
    'Cuando {termines:terminar}, avísame. (tú)',
    'Cuando {era:ser} niño, jugaba en la calle. ~ Past → indicative.',
    'Te llamaré en cuanto {llegue:llegar} al hotel. (yo)',
    'Siempre leo un rato antes de {dormir:dormir}. ~ Same subject → infinitive.',
    'Habla más alto para que todos te {oigan:oír}.',
    'Vamos a salir antes de que {empiece:empezar} a llover.',
    'No me iré hasta que me {digas:decir} la verdad.',
    'Salió de casa sin que nadie lo {viera|viese:ver}. ~ Past context → imperfect subjunctive.',
    'Te presto el coche con tal de que lo {cuides:cuidar}.',
    'Llévate el paraguas por si {llueve:llover}. ~ por si + indicative.',
    'En caso de que {haya:haber} problemas, llama a este número.',
    '! Cuando [tendré>tenga] dinero, me compraré una casa.',
    '! Te lo digo para que lo [sabes>sepas].',
    '! Mientras [estarás>estés] aquí, puedes usar mi habitación.',
    'Cuando [vengas*|vienes] a Madrid, te enseñaré la ciudad.',
    'Cuando [vengo|vine*] a Madrid por primera vez, no conocía a nadie. ~ Past → indicative.',
    'Ahorra para {poder:poder} viajar el año que viene. ~ Same subject.',
    'Después de que {se vayan:irse} los invitados, recogeremos.',
    'Tan pronto como {sepa:saber} los resultados, te los mando. (yo)',
    'No saldremos a no ser que {deje:dejar} de llover.',
  ],
},
{
  id: 'subj-imperfecto', level: 'B2', title: 'Imperfecto de subjuntivo', en: 'Imperfect subjunctive',
  summary: 'From the preterite ellos form: hablaron → hablara/hablase; quería que vinieras.',
  explain: `
<p><b>Recipe:</b> 3rd-person plural preterite, remove <b>-ron</b>, add <b>-ra, -ras, -ra, -ramos, -rais, -ran</b> (or the equivalent <b>-se</b> forms). Nosotros gets a tilde.</p>
<table><tr><th>preterite</th><th>imperfect subjunctive</th></tr>
<tr><td>habla<b>ron</b></td><td>hablara, hablaras, hablara, <b>habláramos</b>, hablarais, hablaran</td></tr>
<tr><td>tuvie<b>ron</b></td><td>tuviera … tuviéramos</td></tr><tr><td>fue<b>ron</b> (ser/ir)</td><td>fuera … fuéramos</td></tr>
<tr><td>dije<b>ron</b></td><td>dijera</td></tr><tr><td>pidie<b>ron</b></td><td>pidiera</td></tr><tr><td>durmie<b>ron</b></td><td>durmiera</td></tr><tr><td>leye<b>ron</b></td><td>leyera</td></tr></table>
<p>Every preterite irregularity carries through — so learn the preterite well!</p>
<h4>Uses</h4><ul>
<li>Same triggers as the present subjunctive when the main verb is in a past tense or conditional (sequence of tenses): <em>Quería que <b>vinieras</b>. Me pidió que lo <b>ayudara</b>. Sería mejor que <b>llamaras</b>.</em></li>
<li>Hypothetical <i>si</i>-clauses: <em>Si <b>tuviera</b> tiempo, viajaría.</em></li>
<li><em>Ojalá</em> + imp. subj. = unlikely wish: <em>Ojalá <b>fuera</b> verano.</em> · <em>como si</em> + imp. subj.: <em>Habla como si lo <b>supiera</b> todo.</em></li>
<li>Very polite: <em><b>Quisiera</b> hablar con el director.</em></li></ul>`,
  input: { q: 'Real or hypothetical?', items: [
    'Si tengo tiempo, te llamo. ? realistic possibility*|hypothetical / unlikely ~ si + present = real possibility.',
    'Si tuviera tiempo, te llamaría. ? realistic possibility|hypothetical / unlikely* ~ si + imperfect subjunctive = hypothetical.',
    'Ojalá fuera rico. ? It may well happen|Unlikely / contrary to fact* ~ ojalá + imp. subj. = unlikely wish.',
  ] },
  drill: { verbs: ['hablar', 'comer', 'vivir', 'ser', 'ir', 'tener', 'estar', 'hacer', 'decir', 'poder', 'poner', 'saber', 'querer', 'venir', 'pedir', 'dormir', 'leer', 'dar', 'haber'], tenses: ['isubj'] },
  items: [
    'Mi madre quería que {estudiara|estudiase:estudiar} derecho. (yo)',
    'Te pedí que me {llamaras|llamases:llamar}.',
    'Si {tuviera|tuviese:tener} dinero, me compraría una casa en la playa. (yo)',
    'Ojalá {fuera|fuese:ser} viernes.',
    'Habla como si lo {supiera|supiese:saber} todo.',
    'Sería mejor que {fuéramos|fuésemos:ir} en tren.',
    'No creía que {pudieras|pudieses:poder} hacerlo. (tú)',
    'El profesor nos dijo que {hiciéramos|hiciésemos:hacer} los ejercicios.',
    '{Quisiera:querer} hablar con el encargado, por favor. ~ Very polite.',
    'Me sorprendió que no {vinieras|vinieses:venir} a la fiesta.',
    'Si {estuvieras|estuvieses:estar} en mi lugar, ¿qué harías?',
    '! Quería que tú me [ayudes>ayudaras] ayer. ~ Past main verb → imperfect subjunctive.',
    '! Si [tendría>tuviera] más tiempo, aprendería japonés. ~ Never conditional after si.',
    '! Me pidió que [dijiera>dijera] la verdad. ~ dijeron → dijera.',
    'Le aconsejé que [descansara*|descanse|descansaba] más.',
    'Si yo {fuera|fuese:ser} tú, no lo haría.',
    'Buscaban a alguien que {hablara|hablase:hablar} chino.',
    'Era necesario que todos {durmiéramos|durmiésemos:dormir} un poco.',
    'Me alegré de que {tuvierais|tuvieseis:tener} suerte. (vosotros)',
  ],
},
{
  id: 'si-condicional', level: 'B2', title: 'Oraciones condicionales', en: 'Conditional sentences',
  summary: 'si + present (real), si + imp. subj. → conditional (hypothetical), si + plusc. subj. → cond. perfect (past).',
  explain: `
<table><tr><th>Type</th><th>si-clause</th><th>main clause</th><th>example</th></tr>
<tr><td>Real / likely</td><td>presente</td><td>presente / futuro / imperativo</td><td>Si llueve, <b>me quedo / me quedaré</b> en casa.</td></tr>
<tr><td>Hypothetical (present/future)</td><td>imperfecto de subjuntivo</td><td>condicional</td><td>Si <b>tuviera</b> coche, <b>iría</b> a la sierra.</td></tr>
<tr><td>Impossible (past)</td><td>pluscuamperfecto de subj.</td><td>condicional compuesto (or plusc. subj.)</td><td>Si <b>hubiera estudiado</b>, <b>habría aprobado</b>.</td></tr>
<tr><td>Mixed: past cause → present result</td><td>plusc. subj.</td><td>condicional</td><td>Si <b>hubiera nacido</b> en Perú, ahora <b>hablaría</b> quechua.</td></tr></table>
<p><b>Golden rule:</b> after <i>si</i> (= if) never use the future, the conditional or the present subjunctive: <s>si tendría</s>, <s>si tendré</s>, <s>si tenga</s>.</p>
<p>Other conditional links: <b>como</b> + subjunctive (threat/warning: <em>Como no estudies, suspenderás</em>), <b>en caso de que</b>, <b>siempre que</b>, <b>a no ser que</b> + subjunctive; <b>de</b> + infinitive (<em>De haberlo sabido, no habría venido</em>).</p>`,
  input: { q: 'How likely / real is the condition?', items: [
    'Si me toca la lotería, me compro un barco. ? treated as realistic*|hypothetical|impossible (past) ~ si + present.',
    'Si me tocara la lotería, me compraría un barco. ? realistic|hypothetical*|impossible (past) ~ si + imp. subj.',
    'Si me hubiera tocado la lotería, me habría comprado un barco. ? realistic|hypothetical|impossible (past)* ~ It didn\'t happen.',
  ] },
  items: [
    'Si {tienes:tener} tiempo mañana, llámame.',
    'Si {tuviera|tuviese:tener} más tiempo, haría más deporte. (yo)',
    'Si me {hubieras|hubieses:haber} avisado, habría venido. (tú)',
    'Si yo fuera tú, {aceptaría:aceptar} la oferta.',
    'Si no {hubiéramos|hubiésemos:haber} perdido el tren, ahora estaríamos en París.',
    'Si {llueve:llover}, el partido se suspenderá.',
    'Si {supiera|supiese:saber} su número, la llamaría. (yo)',
    'Si hubiera estudiado más, {habría|hubiera:haber} aprobado. (yo)',
    'Como no te {des:dar} prisa, perderemos el avión. ~ como + subjunctive = warning.',
    'De {haberlo:haber + lo} sabido, no habría venido. ~ de + infinitive = si…',
    '! Si [tendría>tuviera] dinero, viajaría por el mundo.',
    '! Si [llegarás>llegas] pronto, cenamos juntos.',
    '! Si me [hubiera dicho>hubieras dicho] la verdad, te habría perdonado. (tú)',
    'Si [vienes*|vengas] a la fiesta, te presentaré a mis amigos.',
    'Si hubiera nacido en Italia, ahora [hablaría*|habría hablado] italiano. ~ Present result → conditional.',
    'Si no {fuera|fuese:ser} por ti, no lo habría conseguido.',
    'Te ayudo siempre que me lo {pidas:pedir}.',
    'Si {estás:estar} cansado, vete a dormir.',
    'Si mis padres {vivieran|viviesen:vivir} más cerca, los vería más a menudo.',
  ],
},
{
  id: 'se-pasiva', level: 'B2', title: 'Se impersonal, se pasiva y voz pasiva', en: 'Impersonal se, passive se & passive voice',
  summary: 'Se habla español. Se venden pisos. Fue construido por… Se busca a los culpables.',
  explain: `
<h4>Passive se — the verb agrees with the thing</h4><p class="ex">Se vend<b>e</b> piso. · Se vend<b>en</b> pisos. · Aquí se habla<b>n</b> tres idiomas.</p>
<h4>Impersonal se — 3rd singular, no subject</h4><p>With intransitive verbs or with people introduced by <b>a</b>: <em>Se vive bien aquí. Se trabaja mucho. Se busca <b>a</b> los ladrones.</em></p>
<h4>Ser + participle (passive voice)</h4><p>More formal/written; the participle agrees; agent with <b>por</b>: <em>Las pirámides <b>fueron construidas</b> por los egipcios.</em> In speech, Spanish prefers the active or <i>se</i>.</p>
<h4>Other impersonal options</h4><ul><li>3rd plural: <em><b>Dicen</b> que va a nevar. Me <b>han robado</b> la cartera.</em></li><li><em>uno/una</em> + verb: <em>Uno nunca sabe.</em></li><li><em>tú</em> generic in speech: <em>Si estudias, aprendes.</em></li></ul>`,
  input: { q: 'Who performs the action?', items: [
    'Se venden coches usados. ? someone unspecified sells them*|the cars sell themselves ~ Passive se: agent irrelevant.',
    'Dicen que el alcalde dimitirá. ? people in general*|the mayor ~ 3rd plural impersonal.',
    'El puente fue diseñado por Calatrava. ? Calatrava designed it*|someone else ~ por introduces the agent.',
  ] },
  items: [
    'En este restaurante se {come:comer} muy bien. ~ Impersonal → singular.',
    'Se {venden:vender} pisos en el centro. ~ Passive se → agrees with pisos.',
    'Se {alquila:alquilar} habitación. ~ Singular noun → singular verb.',
    'En Suiza se {hablan:hablar} cuatro idiomas.',
    'Se {busca:buscar} a los responsables del robo. ~ a + people → singular impersonal.',
    'La catedral {fue construida:construir} en el siglo XIII. ~ ser + participle agreeing with catedral.',
    'Los ladrones {fueron detenidos:detener} por la policía.',
    '{Dicen:decir} que este invierno será muy frío. ~ Impersonal 3rd plural.',
    '! Se [necesita>necesitan] camareros con experiencia.',
    '! Se [buscan>busca] a dos niños perdidos. ~ a + people → singular.',
    '! La novela fue [escrita de>escrita por] una joven autora.',
    'Aquí no se [puede*|pueden] fumar. ~ se + modal + infinitive → singular.',
    '¿Cómo se {dice:decir} "window" en español?',
    'El ganador {será anunciado:anunciar} mañana.',
    'Me {han robado:robar} la bici. ~ 3rd plural = someone.',
    'En verano se {duerme:dormir} poco.',
    'Se {publicaron:publicar} tres artículos sobre el tema.',
  ],
},
{
  id: 'estilo-indirecto', level: 'B2', title: 'Estilo indirecto', en: 'Reported speech',
  summary: 'Dijo que vendría / que había llegado / que fuera; pronoun & time shifts.',
  explain: `
<p>When the reporting verb is in the past (<i>dijo, explicó, preguntó</i>), tenses usually shift back:</p>
<table><tr><th>Direct</th><th>Reported (dijo que…)</th></tr>
<tr><td>presente: "Estoy cansado"</td><td>imperfecto: que <b>estaba</b> cansado</td></tr>
<tr><td>indefinido / perfecto: "Lo vi / Lo he visto"</td><td>pluscuamperfecto: que lo <b>había visto</b></td></tr>
<tr><td>futuro: "Iré"</td><td>condicional: que <b>iría</b></td></tr>
<tr><td>imperativo: "Ven"</td><td>imp. subjuntivo: que <b>fuera</b> (pidió/dijo que viniera)</td></tr>
<tr><td>presente subj.: "Quiero que vengas"</td><td>imp. subj.: que quería que <b>fuera</b></td></tr>
<tr><td>imperfecto / plusc. / condicional</td><td>no change</td></tr></table>
<p>If the reporting verb is present (<i>dice que</i>), no shift: <em>Dice que <b>está</b> cansado.</em> If the content is still true, the shift is optional: <em>Dijo que <b>es</b> de Chile.</em></p>
<h4>Other changes</h4><p>hoy → aquel día · mañana → al día siguiente · ayer → el día anterior · aquí → allí · este → ese/aquel · venir → ir · traer → llevar · pronouns and possessives shift person.</p>
<h4>Questions</h4><p>Yes/no → <b>si</b>: <em>Me preguntó <b>si</b> tenía hambre.</em> Wh- questions keep the question word with its tilde: <em>Me preguntó <b>dónde</b> vivía.</em></p>`,
  input: { q: 'What did the person originally say?', items: [
    'Dijo que vendría. ? "Vendré."*|"Vine." ~ conditional ← future.',
    'Dijo que había llamado. ? "Llamo."|"He llamado / Llamé."* ~ pluperfect ← past.',
    'Me dijo que me sentara. ? "Siéntate."*|"Me siento." ~ imp. subj. ← command.',
  ] },
  items: [
    '"Estoy cansada." → Dijo que {estaba:estar} cansada.',
    '"He perdido las llaves." → Me contó que {había perdido:perder} las llaves.',
    '"Iré a la fiesta." → Prometió que {iría:ir} a la fiesta.',
    '"Llámame mañana." → Me pidió que lo {llamara|llamase:llamar} al día siguiente.',
    '"¿Tienes hambre?" → Me preguntó {si} tenía hambre.',
    '"¿Dónde vives?" → Me preguntó {dónde} vivía.',
    '"Lo compré ayer." → Dijo que lo {había comprado:comprar} el día anterior.',
    '"No lo sé." → Dice que no lo {sabe:saber}. ~ Present reporting verb → no shift.',
    '"Quiero que vengas." → Me dijo que quería que {fuera|fuese:ir}. ~ venir → ir from the reporter\'s viewpoint.',
    '"Haced los deberes." → El profesor nos dijo que {hiciéramos|hiciésemos:hacer} los deberes.',
    '! "Volveré pronto." → Dijo que [volverá>volvería] pronto. (reported much later)',
    '! "¿Vienes?" → Me preguntó [que>si] iba.',
    '! "Siéntese." → Me dijo que me [siento>sentara]. ~ Command → imperfect subjunctive.',
    '"Mañana empezamos." → Dijeron que empezaban {al día siguiente}.',
    '"Este es mi coche." → Dijo que {aquel|ese} era su coche.',
    '"¿Cuándo llega el tren?" → Le preguntó cuándo {llegaba:llegar} el tren.',
  ],
},
{
  id: 'se-involuntario', level: 'B2', title: 'Se accidental', en: 'Accidental se (se me olvidó)',
  summary: 'se + me/te/le + verb: things "happen to" you — se me cayó, se nos olvidó, se le rompió.',
  explain: `
<p>To present an accident as something that happened <i>to</i> someone, Spanish uses <b>se + indirect pronoun + verb</b>. The verb agrees with the <b>thing</b>.</p>
<p class="ex">Se <b>me</b> cayó el vaso. (I dropped the glass — it fell on me)<br>Se <b>nos</b> olvidaron las entradas.<br>Se <b>le</b> rompió el móvil a Juan.</p>
<table><tr><td>caerse</td><td>se me cae, se me cayó</td></tr><tr><td>olvidarse</td><td>se te olvidó</td></tr><tr><td>romperse</td><td>se le rompió</td></tr>
<tr><td>perderse</td><td>se nos perdió</td></tr><tr><td>acabarse / terminarse</td><td>se os acabó</td></tr><tr><td>quemarse, estropearse, escaparse, ocurrirse</td><td>se les quemó la cena · se me ocurre una idea</td></tr></table>
<p>Compare: <em>Rompí el vaso</em> (I broke it — responsibility) vs. <em>Se me rompió el vaso</em> (it broke on me).</p>`,
  input: { q: 'Who is affected, and what is the subject?', items: [
    'Se le olvidaron las llaves. ? He forgot the keys*|The keys forgot him ~ le = affected person; las llaves = grammatical subject.',
    'Se nos acabó la leche. ? We ran out of milk*|We finished the milk on purpose ~ Accidental.',
  ] },
  items: [
    'Se {me} cayó el móvil al agua. (yo)',
    'Se {nos} olvidó comprar pan. (nosotros)',
    'A Pedro se {le} rompieron las gafas.',
    'Se me {olvidaron:olvidar} las llaves en casa. ~ Plural thing → plural verb.',
    'Se te {ha caído:caer} un pendiente.',
    'A los niños se {les} perdió el perro.',
    'Se nos {acabó:acabar} la gasolina en mitad de la autopista.',
    '¡Se me {ocurre:ocurrir} una idea genial!',
    '! Se me [olvidó>olvidaron] los deberes. ~ deberes is plural → olvidaron.',
    '! A María se [la>le] rompió el coche. ~ Indirect pronoun → le.',
    '! [Me se>Se me] cayó el café. ~ Order: se always first.',
    'Se le [quemó*|quemé] la comida mientras hablaba por teléfono.',
    'Se {os} va a hacer tarde si no salís ya. (vosotros)',
    'Se me {perdió:perder} la cartera en el metro.',
  ],
},
{
  id: 'concordancia', level: 'B2', title: 'Concordancia de tiempos', en: 'Sequence of tenses',
  summary: 'Quiero que vengas / Quería que vinieras; Me alegra que hayas venido.',
  explain: `
<table><tr><th>Main verb</th><th>Subordinate subjunctive</th><th>Example</th></tr>
<tr><td>presente, futuro, perfecto, imperativo</td><td><b>presente</b> or <b>perfecto</b> de subjuntivo</td><td>Quiero que <b>vengas</b>. Me alegra que <b>hayas venido</b>.</td></tr>
<tr><td>indefinido, imperfecto, pluscuamperfecto, condicional</td><td><b>imperfecto</b> or <b>pluscuamperfecto</b> de subjuntivo</td><td>Quería que <b>vinieras</b>. Me alegró que <b>hubieras venido</b>.</td></tr></table>
<p><b>Perfecto de subjuntivo</b> (haya hecho) = a completed action seen from now: <em>Espero que <b>hayas dormido</b> bien.</em> <b>Pluscuamperfecto de subj.</b> (hubiera hecho) = completed before a past moment: <em>No creí que lo <b>hubiera hecho</b> él.</em></p>
<p>Exception: a past main verb can take present subjunctive when the action is still future or valid now: <em>Me pidió ayer que lo <b>llame</b> mañana.</em></p>`,
  input: { q: 'When does the subordinate action happen?', items: [
    'Espero que hayas aprobado. ? already happened (probably)*|in the future ~ Perfect subjunctive = completed.',
    'Espero que apruebes. ? already happened|in the future* ~ Present subjunctive = future.',
  ] },
  drill: { verbs: ['hacer', 'decir', 'llegar', 'terminar', 'ver', 'poder', 'ser', 'estar', 'tener'], tenses: ['psubjperf', 'plsubj'] },
  items: [
    'Me alegro de que {hayas venido:venir}. (tú, already here)',
    'Me alegré mucho de que {vinieras|vinieses:venir}.',
    'Espero que {hayáis dormido:dormir} bien. (vosotros)',
    'No creo que {haya terminado:terminar} todavía. (él)',
    'No creía que lo {hubiera hecho|hubiese hecho:hacer} él.',
    'Te pedí que me {ayudaras|ayudases:ayudar}.',
    'Les diré que {vengan:venir} pronto.',
    'Sería genial que {pudieras|pudieses:poder} venir. (tú)',
    'Me extrañó que no me {hubieras llamado|hubieses llamado:llamar}. (tú)',
    '! Quería que [vengas>vinieras] a mi boda.',
    '! Es posible que ya [ha llegado>haya llegado]. ~ Possibility about a completed action → perfect subjunctive.',
    '! Le aconsejaría que [descanse>descansara] más. ~ Conditional main verb → imperfect subjunctive.',
    'Dudo que [haya dicho*|ha dicho] eso. ~ Doubt about a past action.',
    'Ojalá {hubiera|hubiese:haber} estudiado más. ~ Regret about the past.',
    'No es verdad que el examen {haya sido:ser} difícil.',
  ],
},
{
  id: 'perifrasis', level: 'B2', title: 'Perífrasis verbales', en: 'Verbal periphrases',
  summary: 'acabar de, volver a, dejar de, ponerse a, llevar + gerundio, seguir + gerundio, estar a punto de, soler.',
  explain: `
<table><tr><td><b>acabar de</b> + inf.</td><td>have just</td><td>Acabo de llegar.</td></tr>
<tr><td><b>volver a</b> + inf.</td><td>again</td><td>No vuelvas a hacerlo.</td></tr>
<tr><td><b>dejar de</b> + inf.</td><td>stop</td><td>Ha dejado de llover.</td></tr>
<tr><td><b>ponerse a</b> + inf.</td><td>start suddenly</td><td>Se puso a llorar.</td></tr>
<tr><td><b>empezar / comenzar a</b> + inf.</td><td>begin</td><td>Empecé a trabajar en 2020.</td></tr>
<tr><td><b>estar a punto de</b> + inf.</td><td>be about to</td><td>El tren está a punto de salir.</td></tr>
<tr><td><b>soler</b> (ue) + inf.</td><td>usually / used to</td><td>Suelo cenar a las nueve. Solía ir.</td></tr>
<tr><td><b>tener que / deber / hay que</b></td><td>obligation</td><td>Tienes que verlo.</td></tr>
<tr><td><b>llevar</b> + time + gerund</td><td>have been doing for</td><td>Llevo dos horas esperando.</td></tr>
<tr><td><b>seguir / continuar</b> + gerund</td><td>still / keep on</td><td>Sigue lloviendo.</td></tr>
<tr><td><b>ir</b> + gerund</td><td>gradually</td><td>Voy entendiendo poco a poco.</td></tr>
<tr><td><b>llevar sin</b> + inf.</td><td>haven't … for</td><td>Llevo un año sin fumar.</td></tr>
<tr><td><b>deber de</b> + inf.</td><td>must (probability)</td><td>Debe de tener 40 años.</td></tr></table>`,
  input: { q: 'What does the periphrasis mean?', items: [
    'Acabo de comer. ? I have just eaten*|I\'m finishing eating ~ acabar de = have just.',
    'Volvió a llamar. ? He called again*|He called back home ~ volver a = again.',
    'Llevo un año sin fumar. ? I haven\'t smoked for a year*|I\'ve smoked for a year ~ llevar sin = not … for.',
    'Debe de estar en casa. ? He must be at home (probably)*|He has to stay home ~ deber de = probability.',
  ] },
  items: [
    '{Acabo de:acabar de} terminar el informe; te lo envío ya. (yo)',
    'Mi abuelo {dejó de:dejar de} fumar a los 60.',
    'Cuando le di la noticia, {se puso a:ponerse a} llorar.',
    'No {vuelvas a:volver a} llegar tarde, por favor. (tú)',
    '{Llevo:llevar} tres horas estudiando y estoy agotado.',
    '{Sigue:seguir} lloviendo; no podemos salir.',
    'Los domingos {suelo:soler} levantarme tarde.',
    'Corre, el tren está {a punto de} salir.',
    'De niño {solía:soler} pasar los veranos en el pueblo.',
    '{Llevamos:llevar} dos años sin ver a nuestros primos.',
    'Poco a poco {voy:ir} entendiendo cómo funciona.',
    '! Acabo [-> de] llegar a casa.',
    '! Ayer [volví de>volví a] ver esa película.',
    '! Llevo dos años [estudiar>estudiando] español. ~ llevar + time + gerund.',
    'No está el coche; [debe de*|tiene que] haber salido. ~ Probability → deber de.',
    'Hay que {empezar a:empezar a} ahorrar ya.',
    'Ha {dejado de:dejar de} nevar.',
  ],
},
];
