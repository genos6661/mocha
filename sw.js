/**
 * SERVICE WORKER BERES Mocha (PWA)
 * ------------------------------------------------------------------
 * Tujuannya membuat aplikasi bisa di-install (Chrome mensyaratkan service worker + manifest).
 * Sengaja TIDAK menyimpan halaman / CSS / JS aplikasi: data bisnis selalu diambil langsung dari
 * server, dan pembaruan tampilan tidak tertahan cache. Satu-satunya yang disimpan hanyalah
 * halaman offline, yang tampil bila perangkat sedang tidak terhubung ke internet.
 *
 * Naikkan VERSION bila isi offline.html berubah.
 */
const VERSION = 'beres-mocha-v2';
const OFFLINE_URL = '/offline.html';

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(VERSION)
      .then(cache => cache.addAll([OFFLINE_URL, '/assets/img/pwa/icon-192.png']))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(key => key !== VERSION).map(key => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

// Hanya perpindahan halaman yang dicegat: bila jaringan gagal, tampilkan halaman offline.
// Permintaan lain (CSS, JS, API) tidak disentuh dan langsung ke jaringan.
self.addEventListener('fetch', event => {
  if (event.request.mode !== 'navigate') return;

  // Form booking pelanggan (/order-form) tidak termasuk aplikasi: biarkan browser menanganinya sendiri.
  if (new URL(event.request.url).pathname.startsWith('/order-form')) return;

  event.respondWith(
    fetch(event.request).catch(() => caches.match(OFFLINE_URL))
  );
});
