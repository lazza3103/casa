// Copia di riserva della dashboard: se manca internet si apre l'ultima versione salvata
const CACHE = 'casa-v1';
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));
self.addEventListener('fetch', e => {
  if (e.request.mode !== 'navigate') return; // meteo e il resto passano normalmente
  e.respondWith((async () => {
    const cache = await caches.open(CACHE);
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 6000);
    try {
      const res = await fetch(e.request.url, { signal: ctrl.signal, cache: 'no-cache' });
      clearTimeout(t);
      if (res.ok) await cache.put('./', res.clone());
      return res;
    } catch {
      clearTimeout(t);
      return (await cache.match('./')) || Response.error();
    }
  })());
});
