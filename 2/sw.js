// Service Worker for offline support and PWA capabilities
const CACHE_NAME = 'music-player-v1';
const ASSETS_TO_CACHE = [
    './',
    './music-player.html',
    './manifest.json'
];

// Install event - cache assets
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS_TO_CACHE).catch(() => {
                // Fail gracefully if some assets can't be cached
                console.log('Some assets could not be cached');
            });
        })
    );
    self.skipWaiting(); // Activate immediately
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    self.clients.claim(); // Take control immediately
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
    // Skip non-GET requests
    if (event.request.method !== 'GET') {
        return;
    }

    // For HTML and other assets, try cache first, then network
    if (event.request.destination === 'document' ||
        event.request.destination === '' ||
        event.request.destination === 'script' ||
        event.request.destination === 'style') {
        event.respondWith(
            caches.match(event.request).then((response) => {
                return response || fetch(event.request).catch(() => {
                    return caches.match('./');
                });
            })
        );
    } else {
        // For other requests (like audio files from local API),
        // let them pass through normally
        event.respondWith(fetch(event.request));
    }
});

// Background sync for future features
self.addEventListener('sync', (event) => {
    if (event.tag === 'sync-library') {
        event.waitUntil(syncLibrary());
    }
});

async function syncLibrary() {
    // Placeholder for future sync functionality
    console.log('Library sync triggered');
}
