// Arian Digital PWA Service Worker
const CACHE_NAME = 'arian-digital-cache-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/src/main.tsx',
  '/src/App.tsx',
  '/src/index.css'
];

// Install Event - Pre-cache assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Pre-caching offline assets...');
      return cache.addAll(ASSETS_TO_CACHE).catch(err => {
        console.warn('[Service Worker] Active cache pre-fetch skipped due to environment limits: ', err);
      });
    }).then(() => self.skipWaiting())
  );
});

// Activate Event - Clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('[Service Worker] Clearing old cache...', key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Event - Serve with Cache-First or Network-Fallback
self.addEventListener('fetch', (event) => {
  // Only intercept HTTP/HTTPS protocol requests to prevent chrome-extension or data failures
  if (event.request.url.startsWith('http')) {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }
        return fetch(event.request).then((networkResponse) => {
          // Cache newly requested safe assets dynamically
          if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
            const cacheToCopy = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, cacheToCopy);
            });
          }
          return networkResponse;
        }).catch(() => {
          // Offline fallback
          return new Response(
            `<div style="text-align:center;padding:50px;font-family:sans-serif;background:#0B0F1A;color:#fff;">
              <h2>شما در حالت آفلاین هستید</h2>
              <p>آرین دیجیتال در حال حاضر به اتصال اینترنت نیاز دارد.</p>
             </div>`, 
            { headers: { 'Content-Type': 'text/html; charset=utf-8' } }
          );
        });
      })
    );
  }
});
