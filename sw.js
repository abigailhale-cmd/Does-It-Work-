// Minimal service worker to make PWA installable

// Install event
self.addEventListener('install', event => {
  console.log('Service Worker installed');
  // Activate immediately without waiting
  self.skipWaiting();
});

// Activate event
self.addEventListener('activate', event => {
  console.log('Service Worker activated');
  // Take control of all pages immediately
  event.waitUntil(self.clients.claim());
});

// Fetch event (optional, needed for install prompt)
self.addEventListener('fetch', event => {
  // You can add offline caching later
  event.respondWith(fetch(event.request));
});

