const CACHE_NAME = 'felka-cargas-v4';
const APP_SHELL = [
    './',
    './index.html',
    './app.js',
    './style.css',
    './manifest.webmanifest',
    './icons/app-icon-192.png',
    './icons/app-icon-512.png',
    './icons/app-icon-maskable-512.png',
    './icons/apple-touch-icon.png'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(APP_SHELL))
            .then(() => self.skipWaiting())
    );
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys()
            .then(keys => Promise.all(keys
                .filter(key => key.startsWith('felka-cargas-') && key !== CACHE_NAME)
                .map(key => caches.delete(key))))
            .then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', event => {
    const request = event.request;
    if (request.method !== 'GET') return;

    const url = new URL(request.url);
    const sameOrigin = url.origin === self.location.origin;
    const isLargeModel = /\.(glb|gltf|obj|mtl)(\.gz)?$/i.test(url.pathname);
    const isLargeTexture = /\.(png|jpe?g)$/i.test(url.pathname) && !url.pathname.includes('/icons/');

    if (sameOrigin && (isLargeModel || isLargeTexture)) return;

    if (!sameOrigin && !['script', 'style', 'font'].includes(request.destination)) return;

    event.respondWith((async () => {
        const cache = await caches.open(CACHE_NAME);

        if (!sameOrigin) {
            const cached = await cache.match(request);
            if (cached) return cached;
            const response = await fetch(request);
            if (response.ok || response.type === 'opaque') {
                await cache.put(request, response.clone());
            }
            return response;
        }

        try {
            const response = await fetch(request, { cache: 'no-cache' });
            if (response.ok) await cache.put(request, response.clone());
            return response;
        } catch (error) {
            const cached = await cache.match(request);
            if (cached) return cached;
            if (request.mode === 'navigate') {
                const offlinePage = await cache.match('./index.html');
                if (offlinePage) return offlinePage;
            }
            throw error;
        }
    })());
});
