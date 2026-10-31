import { conjugate, participle, gerund, reverseIndex, verbs } from '../js/core/conjugator.js';
import { syllabify, attachClitics, classifyWord, stressSyllable } from '../js/core/phonology.js';

let fail = 0, pass = 0;
const eq = (label, got, want) => {
  const g = JSON.stringify(got), w = JSON.stringify(want);
  if (g === w) pass++; else { fail++; console.log(`✗ ${label}\n   got  ${g}\n   want ${w}`); }
};
const C = (v, t, want) => eq(`${v} ${t}`, conjugate(v, t), want.split(' ').map((x) => (x === '-' ? null : x.replace(/_/g, ' '))));

C('hablar', 'pres', 'hablo hablas habla hablamos habláis hablan');
C('comer', 'pret', 'comí comiste comió comimos comisteis comieron');
C('vivir', 'impf', 'vivía vivías vivía vivíamos vivíais vivían');
C('pensar', 'pres', 'pienso piensas piensa pensamos pensáis piensan');
C('pensar', 'psubj', 'piense pienses piense pensemos penséis piensen');
C('volver', 'pres', 'vuelvo vuelves vuelve volvemos volvéis vuelven');
C('jugar', 'pres', 'juego juegas juega jugamos jugáis juegan');
C('jugar', 'pret', 'jugué jugaste jugó jugamos jugasteis jugaron');
C('jugar', 'psubj', 'juegue juegues juegue juguemos juguéis jueguen');
C('pedir', 'pres', 'pido pides pide pedimos pedís piden');
C('pedir', 'pret', 'pedí pediste pidió pedimos pedisteis pidieron');
C('dormir', 'psubj', 'duerma duermas duerma durmamos durmáis duerman');
C('sentir', 'pret', 'sentí sentiste sintió sentimos sentisteis sintieron');
C('seguir', 'pres', 'sigo sigues sigue seguimos seguís siguen');
C('seguir', 'psubj', 'siga sigas siga sigamos sigáis sigan');
C('elegir', 'pres', 'elijo eliges elige elegimos elegís eligen');
C('conocer', 'pres', 'conozco conoces conoce conocemos conocéis conocen');
C('conducir', 'pret', 'conduje condujiste condujo condujimos condujisteis condujeron');
C('traducir', 'psubj', 'traduzca traduzcas traduzca traduzcamos traduzcáis traduzcan');
C('vencer', 'pres', 'venzo vences vence vencemos vencéis vencen');
C('escoger', 'psubj', 'escoja escojas escoja escojamos escojáis escojan');
C('construir', 'pres', 'construyo construyes construye construimos construís construyen');
C('construir', 'pret', 'construí construiste construyó construimos construisteis construyeron');
C('leer', 'pret', 'leí leíste leyó leímos leísteis leyeron');
C('oír', 'pres', 'oigo oyes oye oímos oís oyen');
C('oír', 'pret', 'oí oíste oyó oímos oísteis oyeron');
C('oír', 'fut', 'oiré oirás oirá oiremos oiréis oirán');
C('caer', 'pret', 'caí caíste cayó caímos caísteis cayeron');
C('traer', 'pret', 'traje trajiste trajo trajimos trajisteis trajeron');
C('tener', 'pres', 'tengo tienes tiene tenemos tenéis tienen');
C('tener', 'pret', 'tuve tuviste tuvo tuvimos tuvisteis tuvieron');
C('tener', 'fut', 'tendré tendrás tendrá tendremos tendréis tendrán');
C('tener', 'psubj', 'tenga tengas tenga tengamos tengáis tengan');
C('venir', 'pret', 'vine viniste vino vinimos vinisteis vinieron');
C('hacer', 'pret', 'hice hiciste hizo hicimos hicisteis hicieron');
C('decir', 'pres', 'digo dices dice decimos decís dicen');
C('decir', 'pret', 'dije dijiste dijo dijimos dijisteis dijeron');
C('decir', 'imp', '- di diga digamos decid digan');
C('poner', 'cond', 'pondría pondrías pondría pondríamos pondríais pondrían');
C('salir', 'imp', '- sal salga salgamos salid salgan');
C('ser', 'pres', 'soy eres es somos sois son');
C('ser', 'imp', '- sé sea seamos sed sean');
C('ir', 'imp', '- ve vaya vamos id vayan');
C('ir', 'impneg', '- no_vayas no_vaya no_vayamos no_vayáis no_vayan');
C('estar', 'psubj', 'esté estés esté estemos estéis estén');
C('dar', 'pret', 'di diste dio dimos disteis dieron');
C('ver', 'impf', 'veía veías veía veíamos veíais veían');
C('ver', 'psubj', 'vea veas vea veamos veáis vean');
C('saber', 'psubj', 'sepa sepas sepa sepamos sepáis sepan');
C('caber', 'pres', 'quepo cabes cabe cabemos cabéis caben');
C('haber', 'isubj', 'hubiera hubieras hubiera hubiéramos hubierais hubieran');
C('hablar', 'isubj', 'hablara hablaras hablara habláramos hablarais hablaran');
C('ser', 'isubj', 'fuera fueras fuera fuéramos fuerais fueran');
C('pedir', 'isubj', 'pidiera pidieras pidiera pidiéramos pidierais pidieran');
C('enviar', 'pres', 'envío envías envía enviamos enviáis envían');
C('enviar', 'psubj', 'envíe envíes envíe enviemos enviéis envíen');
C('continuar', 'pres', 'continúo continúas continúa continuamos continuáis continúan');
C('reunir', 'pres', 'reúno reúnes reúne reunimos reunís reúnen');
C('prohibir', 'pres', 'prohíbo prohíbes prohíbe prohibimos prohibís prohíben');
C('empezar', 'pret', 'empecé empezaste empezó empezamos empezasteis empezaron');
C('empezar', 'psubj', 'empiece empieces empiece empecemos empecéis empiecen');
C('buscar', 'pret', 'busqué buscaste buscó buscamos buscasteis buscaron');
C('averiguar', 'pret', 'averigüé averiguaste averiguó averiguamos averiguasteis averiguaron');
C('mantener', 'pres', 'mantengo mantienes mantiene mantenemos mantenéis mantienen');
C('mantener', 'imp', '- mantén mantenga mantengamos mantened mantengan');
C('componer', 'pret', 'compuse compusiste compuso compusimos compusisteis compusieron');
C('prevenir', 'imp', '- prevén prevenga prevengamos prevenid prevengan');
C('deshacer', 'pret', 'deshice deshiciste deshizo deshicimos deshicisteis deshicieron');
C('sonreír', 'pres', 'sonrío sonríes sonríe sonreímos sonreís sonríen');
C('sonreír', 'pret', 'sonreí sonreíste sonrió sonreímos sonreísteis sonrieron');
C('reír', 'fut', 'reiré reirás reirá reiremos reiréis reirán');
C('oler', 'pres', 'huelo hueles huele olemos oléis huelen');
C('adquirir', 'pres', 'adquiero adquieres adquiere adquirimos adquirís adquieren');
C('poder', 'pret', 'pude pudiste pudo pudimos pudisteis pudieron');
C('querer', 'fut', 'querré querrás querrá querremos querréis querrán');
C('levantarse', 'pres', 'me_levanto te_levantas se_levanta nos_levantamos os_levantáis se_levantan');
C('levantarse', 'imp', '- levántate levántese levantémonos levantaos levántense');
C('levantarse', 'impneg', '- no_te_levantes no_se_levante no_nos_levantemos no_os_levantéis no_se_levanten');
C('irse', 'imp', '- vete váyase vámonos idos váyanse');
C('vestirse', 'imp', '- vístete vístase vistámonos vestíos vístanse');
C('ponerse', 'imp', '- ponte póngase pongámonos poneos pónganse');
C('sentarse', 'imp', '- siéntate siéntese sentémonos sentaos siéntense');
C('hablar', 'pperf', 'he_hablado has_hablado ha_hablado hemos_hablado habéis_hablado han_hablado');
C('volver', 'plusc', 'había_vuelto habías_vuelto había_vuelto habíamos_vuelto habíais_vuelto habían_vuelto');
C('decir', 'plsubj', 'hubiera_dicho hubieras_dicho hubiera_dicho hubiéramos_dicho hubierais_dicho hubieran_dicho');
C('aislar', 'pres', 'aíslo aíslas aísla aislamos aisláis aíslan');
C('esparcir', 'pres', 'esparzo esparces esparce esparcimos esparcís esparcen');
C('almorzar', 'psubj', 'almuerce almuerces almuerce almorcemos almorcéis almuercen');
C('colgar', 'pret', 'colgué colgaste colgó colgamos colgasteis colgaron');
C('seguir', 'pret', 'seguí seguiste siguió seguimos seguisteis siguieron');
C('morir', 'pret', 'morí moriste murió morimos moristeis murieron');
eq('pp', ['abrir','escribir','describir','hacer','deshacer','poner','volver','devolver','romper','leer','oír','traer','construir','ir','ser','morir','descubrir','freír','satisfacer','ver','prever','decir','imprimir','resolver'].map(participle),
  ['abierto','escrito','descrito','hecho','deshecho','puesto','vuelto','devuelto','roto','leído','oído','traído','construido','ido','sido','muerto','descubierto','frito','satisfecho','visto','previsto','dicho','impreso','resuelto']);
eq('ger', ['hablar','comer','dormir','pedir','decir','venir','poder','ir','leer','oír','construir','reír','sentir','seguir','caer','ser'].map(gerund),
  ['hablando','comiendo','durmiendo','pidiendo','diciendo','viniendo','pudiendo','yendo','leyendo','oyendo','construyendo','riendo','sintiendo','siguiendo','cayendo','siendo']);

eq('syll', ['casa','perro','guitarra','pingüino','instante','construir','país','ciudad','hablaré','obstáculo','muy','oigo','caer','averiguáis','chocolate','queso','transporte','estoy','leyendo'].map((w) => syllabify(w).join('-')),
  ['ca-sa','pe-rro','gui-ta-rra','pin-güi-no','ins-tan-te','cons-truir','pa-ís','ciu-dad','ha-bla-ré','obs-tá-cu-lo','muy','oi-go','ca-er','a-ve-ri-guáis','cho-co-la-te','que-so','trans-por-te','es-toy','le-yen-do']);
eq('clitics', [['compra','lo'],['di','melo'],['haz','lo'],['dé','me'],['está','te'],['da','me'],['dando','me'],['comer','lo'],['diciendo','selo'],['digamos','selo']].map(([a,b]) => attachClitics(a,b)),
  ['cómpralo','dímelo','hazlo','deme','estate','dame','dándome','comerlo','diciéndoselo','digámoselo']);
eq('class', ['canción','árbol','lápiz','médico','reloj','examen','día','tú','mesa','fácil','pared'].map((w) => classifyWord(w).type),
  ['aguda','llana','llana','esdrújula','aguda','llana','llana','monosílaba','llana','llana','aguda']);

const t0 = Date.now(); const idx = reverseIndex();
console.log(`reverse index: ${idx.size} forms from ${verbs().length} verbs in ${Date.now() - t0} ms`);
eq('rev', (idx.get('dijeron') || []).map((x) => x.inf + ':' + x.tense), ['decir:pret']);
console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
