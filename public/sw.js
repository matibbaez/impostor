const CACHE_NAME = 'impostor-league-v1';
const urlsToCache = [
  '/',
  '/game',
  '/how-to-play',
  '/manifest.json',
  '/favicon.svg'
];

// 1. INSTALACIÓN: Guardamos los archivos clave
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Cache abierto');
        return cache.addAll(urlsToCache);
      })
  );
});

// 2. PETICIONES: Primero buscamos en caché, si no hay, vamos a internet
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Si está en caché, lo devolvemos (velocidad luz)
        if (response) {
          return response;
        }
        // Si no, lo buscamos en la red
        return fetch(event.request);
      })
  );
});

// 3. ACTIVACIÓN: Limpiamos cachés viejas si actualizas la versión
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});