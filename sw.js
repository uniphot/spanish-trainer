// Offline support for the published site. Network first, so a new version shows up at once;
// when the phone is offline the last cached copy is used. The whole app is cached on install
// (precache.txt is written by the publish workflow), news.json whenever it is fetched.
const CACHE = 'a-fondo';

self.addEventListener('install', (e) => {
  self.skipWaiting();
  e.waitUntil((async () => {
    const res = await fetch('precache.txt', { cache: 'no-cache' }).catch(() => null);
    if (!res?.ok) return;
    const files = (await res.text()).split('\n').filter(Boolean);
    await caches.open(CACHE).then((c) => c.addAll(['./', ...files])).catch(() => {});
  })());
});

self.addEventListener('activate', (e) => e.waitUntil(self.clients.claim()));

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  const fonts = /^fonts\.(googleapis|gstatic)\.com$/.test(url.hostname);
  if (url.origin !== location.origin && !fonts) return; // AI tutor, LanguageTool, CDN: always live
  // GitHub Pages lets browsers reuse files for 10 minutes; revalidating (a cheap 304) keeps a
  // fresh deploy from mixing old and new modules.
  const net = url.origin === location.origin ? fetch(url.href, { cache: 'no-cache' }) : fetch(req);
  e.respondWith(net.then((res) => {
    if (res.ok) { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(req, copy)); }
    return res;
  }).catch(async () => (await caches.match(req, { ignoreSearch: true })) || Response.error()));
});
