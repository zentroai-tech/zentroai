// Service Worker básico para PWA
const CACHE_NAME = 'zentro-ai-v1';
// Flag de desarrollo: cambiar a false en producción
const DEBUG = false;
// Detectar la base URL para compatibilidad con GitHub Pages (raíz o subdirectorio)
const getBaseUrl = () => {
  const path = self.location.pathname;
  const swIndex = path.lastIndexOf('/sw.js');
  if (swIndex === -1) return '/';
  const base = path.substring(0, swIndex);
  return base === '' ? '/' : base + '/';
};
const BASE_URL = getBaseUrl();
const urlsToCache = [
  BASE_URL === '/' ? 'index.html' : BASE_URL + 'index.html',
  BASE_URL === '/' ? 'assets/css/styles.css' : BASE_URL + 'assets/css/styles.css',
  BASE_URL === '/' ? 'assets/img/logo.png' : BASE_URL + 'assets/img/logo.png',
  BASE_URL === '/' ? 'assets/img/icono.png' : BASE_URL + 'assets/img/icono.png',
  BASE_URL === '/' ? 'assets/img/logo_wall.png' : BASE_URL + 'assets/img/logo_wall.png',
  BASE_URL === '/' ? 'assets/js/content_loader.js' : BASE_URL + 'assets/js/content_loader.js',
  BASE_URL === '/' ? 'assets/js/main.js' : BASE_URL + 'assets/js/main.js',
  BASE_URL === '/' ? 'assets/js/mobile-menu.js' : BASE_URL + 'assets/js/mobile-menu.js',
  BASE_URL === '/' ? 'assets/data/content.json' : BASE_URL + 'assets/data/content.json',
  BASE_URL === '/' ? 'manifest.json' : BASE_URL + 'manifest.json'
];

// Instalación del Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(urlsToCache);
      })
      .catch((err) => {
        if (DEBUG) {
          console.log('Error al cachear recursos:', err);
        }
      })
  );
});

// Activación del Service Worker
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
});

// Estrategia: Network First, luego Cache
self.addEventListener('fetch', (event) => {
  // Solo cachear requests GET (no POST, PUT, DELETE, etc.)
  if (event.request.method !== 'GET') {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Solo cachear respuestas exitosas
        if (response && response.status === 200) {
          // Clonar la respuesta
          const responseToCache = response.clone();
          
          caches.open(CACHE_NAME)
            .then((cache) => {
              cache.put(event.request, responseToCache);
            });
        }
        
        return response;
      })
      .catch(() => {
        return caches.match(event.request);
      })
  );
});

