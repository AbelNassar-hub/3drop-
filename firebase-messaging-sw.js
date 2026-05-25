// ============================================================
// FIREBASE MESSAGING SERVICE WORKER — 3DROP
// ============================================================

importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyBu_LNuKgghacuD_wEYpOCWKdcY-bOjzzU",
  authDomain: "drop-ddd07.firebaseapp.com",
  projectId: "drop-ddd07",
  storageBucket: "drop-ddd07.firebasestorage.app",
  messagingSenderId: "633888453733",
  appId: "1:633888453733:web:197c2e8a436cfb2f68c28c"
});

const messaging = firebase.messaging();

// Notification en arrière-plan
messaging.onBackgroundMessage((payload) => {
  console.log('[SW] Notification arrière-plan :', payload);
  const { title, body, icon } = payload.notification || {};
  self.registration.showNotification(title || '3DROP', {
    body: body || 'Vous avez un nouveau message.',
    icon: icon || '/3drop_img/forme-de-lemurien.png',
    badge: '/3drop_img/forme-de-lemurien.png',
    vibrate: [200, 100, 200],
    data: payload.data || {},
    actions: [
      { action: 'open', title: 'Voir' },
      { action: 'close', title: 'Fermer' }
    ]
  });
});

// Clic sur notification → ouvrir le site
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = event.notification.data?.url || 'https://www.3drop.store';
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url === url && 'focus' in client) return client.focus();
      }
      if (clients.openWindow) return clients.openWindow(url);
    })
  );
});

// PWA — Cache des ressources essentielles
const CACHE_NAME = '3drop-v1';
const ASSETS = ['/', '/index.html', '/firebase.js', '/push-notifications.js', '/wbstyle.css'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS).catch(() => {}))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});