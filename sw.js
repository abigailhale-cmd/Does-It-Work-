// Minimal service worker to make PWA installable
self.addEventListener('install', event => {
  console.log('Service Worker installed');
});

self.addEventListener('fetch', event => {
  // Can be expanded for offline caching later
});
