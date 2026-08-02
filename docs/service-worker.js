const CACHE_NAME = 'salesdesk-static-v3';
const APP_SHELL = ['index.html', 'auth/login.html', 'auth/register.html', 'manifest.webmanifest', 'offline.html'];

function getAppShellUrls() {
  return APP_SHELL.map((entry) => new URL(entry, self.registration.scope).toString());
}

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(getAppShellUrls())));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))))
  );
});

self.addEventListener('fetch', (event) => {
  const offlineUrl = new URL('offline.html', self.registration.scope).toString();

  if (event.request.mode === 'navigate') {
    event.respondWith(fetch(event.request).catch(() => caches.match(offlineUrl)));
    return;
  }

  event.respondWith(caches.match(event.request).then((cached) => cached || fetch(event.request)));
});
