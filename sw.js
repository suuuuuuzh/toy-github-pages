const CACHE_NAME = 'su-blog-v1';
const ASSETS = [
  '/toy-github-pages/',
  '/toy-github-pages/index.html',
  '/toy-github-pages/manifest.json'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cached => cached || fetch(event.request))
  );
});
