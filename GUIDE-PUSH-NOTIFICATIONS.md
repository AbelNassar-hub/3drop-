# 🔔 Guide Notifications Push — 3DROP
## En 4 étapes simples

---

## ÉTAPE 1 — Activer FCM dans Firebase Console

1. Aller sur https://console.firebase.google.com
2. Sélectionner le projet **drop-ddd07**
3. ⚙️ Paramètres du projet → onglet **Cloud Messaging**
4. Sous "Certificats Web Push" → cliquer **Générer une paire de clés**
5. Copier la **clé publique VAPID** (longue chaîne commençant par "BA...")

---

## ÉTAPE 2 — Mettre à jour push-notifications.js

Ouvrir `push-notifications.js` et remplacer :
```
const VAPID_KEY = "VOTRE_VAPID_KEY_ICI";
```
par votre vraie clé :
```
const VAPID_KEY = "BAxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";
```

---

## ÉTAPE 3 — Placer les fichiers

Copier ces 2 fichiers à la RACINE de votre site :
```
www.3drop.ci/
  ├── firebase-messaging-sw.js   ← OBLIGATOIRE à la racine
  ├── push-notifications.js
  ├── firebase.js
  ├── index.html
  └── ...
```

⚠️ Le Service Worker DOIT être à la racine (pas dans un sous-dossier).

---

## ÉTAPE 4 — Intégrer dans index.html

### A) Ajouter les scripts (dans le <head> ou avant </body>) :
```html
<script src="firebase.js"></script>
<script src="push-notifications.js"></script>
```

### B) Ajouter le bouton d'activation où vous voulez :
```html
<button id="btn-notif" onclick="activerNotifications()"
  style="background:#D85A30;color:#fff;border:none;
         padding:12px 24px;border-radius:10px;
         font-size:14px;cursor:pointer;">
  🔔 Activer les notifications
</button>
```

---

## ENVOYER UNE NOTIFICATION (depuis Firebase Console)

1. Console Firebase → **Engage → Messaging**
2. Cliquer **"Créer votre première campagne"**
3. Choisir **"Notification Firebase"**
4. Remplir : Titre, Message, Image (optionnel)
5. Cibler : **"Toutes les applications"** ou par segment
6. Envoyer !

---

## ENVOYER DEPUIS VOTRE PANNEAU ADMIN

Ajoutez ce code dans `admin.html` pour envoyer depuis l'interface :

```javascript
// Envoyer une notification à tous les abonnés via l'API FCM
// ⚠️ Nécessite une Cloud Function ou un backend pour la sécurité
// Contact : https://firebase.google.com/docs/cloud-messaging

async function envoyerNotification(titre, message, url) {
  // Récupérer tous les tokens depuis Firestore
  const tokens = await fbGetAll('push_tokens');
  console.log(`Envoi à ${tokens.length} abonnés...`);
  // → Implémenter via Firebase Admin SDK (Node.js backend recommandé)
}
```

---

## RÉSULTAT FINAL

✅ Les visiteurs de 3DROP peuvent activer les notifications
✅ Ils reçoivent une notification sur leur téléphone même si le site est fermé
✅ Les tokens sont stockés dans Firestore (collection "push_tokens")
✅ Vous gérez les envois depuis Firebase Console gratuitement

---

## QUESTIONS ?

- Documentation FCM : https://firebase.google.com/docs/cloud-messaging/js/client
- Support Firebase : https://firebase.google.com/support
