// ============================================================
// FIREBASE MESSAGING SERVICE WORKER — 3DROP
// ============================================================

importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

// ⚠️ Même config que firebase.js
firebase.initializeApp({
  apiKey: "YHf4sF1AkyJH-i5-eHERCjeQFuu0dKxPnVC9jVgKI-A",
  authDomain: "drop-ddd07.firebaseapp.com",
  projectId: "drop-ddd07",
  storageBucket: "drop-ddd07.firebasestorage.app",
  messagingSenderId: "633888453733",
  appId: "1:633888453733:web:197c2e8a436cfb2f68c28c"
});

const messaging = firebase.messaging();

// Notification reçue quand l'app est en ARRIÈRE-PLAN (téléphone verrouillé, etc.)
messaging.onBackgroundMessage((payload) => {
  console.log('[SW] Notification reçue en arrière-plan :', payload);

  const { title, body, icon, image } = payload.notification || {};

  self.registration.showNotification(title || '3DROP', {
    body: body || 'Vous avez un nouveau message.',
    icon: icon || '/3drop_img/forme-de-lemurien.png',
    image: image || null,
    badge: '/3drop_img/forme-de-lemurien.png',
    vibrate: [200, 100, 200],
    data: payload.data || {},
    actions: [
      { action: 'open', title: 'Voir' },
      { action: 'close', title: 'Fermer' }
    ]
  });
});

// Clic sur la notification → ouvrir le site
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
