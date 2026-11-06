// Topics skipped when the learner wants lighter content, in both the news and the listening feeds.
export const HEAVY = /asesin|homicid|narco|cad[aá]ver|balacera|ejecutad|fosa|secuestr|feminicid|masacre|enfrentamiento|c[aá]rtel|violaci[oó]n|desmembr|tirote|ataque armado|a balazos|sicari|extorsi[oó]n|osamenta|linchad/i;

// JSON feeds. The local server builds them live at api/<name>; the published static site has no
// server, so it reads <name>.json, which a scheduled GitHub Action regenerates every few hours.
export async function fetchFeed(name, force = false) {
  let res;
  try {
    res = await fetch(`api/${name}${force ? '?refresh=1' : ''}`);
    if (res.status === 404 || res.status === 405) res = await fetch(`${name}.json`, { cache: force ? 'no-cache' : 'default' });
  } catch { throw new Error('offline'); }
  if (res.status === 404) throw new Error('no-server');
  const data = await res.json();
  if (!data.items?.length) throw new Error(data.error || 'empty');
  return data;
}
