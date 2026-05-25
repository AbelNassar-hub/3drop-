// ============================================================
// FIREBASE CONFIG — 3DROP
// ============================================================
const FIREBASE_CONFIG = {
  apiKey: "AIzaSyBu_LNuKgghacuD_wEYpOCWKdcY-bOjzzU",
  authDomain: "drop-ddd07.firebaseapp.com",
  projectId: "drop-ddd07",
  storageBucket: "drop-ddd07.firebasestorage.app",
  messagingSenderId: "633888453733",
  appId: "1:633888453733:web:197c2e8a436cfb2f68c28c"
};

// URL de la base Firestore REST API
const DB_URL = `https://firestore.googleapis.com/v1/projects/${FIREBASE_CONFIG.projectId}/databases/(default)/documents`;
const API_KEY = FIREBASE_CONFIG.apiKey;

// ============================================================
// HELPERS FIRESTORE REST
// ============================================================

// Lire tous les documents d'une collection
async function fbGetAll(collection) {
  try {
    const res = await fetch(`${DB_URL}/${collection}?key=${API_KEY}`);
    const data = await res.json();
    if (!data.documents) return [];
    return data.documents.map(doc => ({
      id: doc.name.split('/').pop(),
      ...parseFirestoreDoc(doc.fields)
    }));
  } catch(e) { console.error('fbGetAll error:', e); return []; }
}

// Lire un document par ID
async function fbGet(collection, id) {
  try {
    const res = await fetch(`${DB_URL}/${collection}/${id}?key=${API_KEY}`);
    if (!res.ok) return null;
    const doc = await res.json();
    if (doc.error || !doc.fields) return null;
    return { id: doc.name.split('/').pop(), ...parseFirestoreDoc(doc.fields) };
  } catch(e) { console.error('fbGet error:', e); return null; }
}

// Créer un document avec ID auto
async function fbAdd(collection, data) {
  try {
    const res = await fetch(`${DB_URL}/${collection}?key=${API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fields: toFirestoreFields(data) })
    });
    const doc = await res.json();
    return doc.name ? doc.name.split('/').pop() : null;
  } catch(e) { console.error('fbAdd error:', e); return null; }
}

// Créer/Remplacer un document avec ID précis
async function fbSet(collection, id, data) {
  try {
    const res = await fetch(`${DB_URL}/${collection}/${id}?key=${API_KEY}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fields: toFirestoreFields(data) })
    });
    return await res.json();
  } catch(e) { console.error('fbSet error:', e); return null; }
}

// Mettre à jour des champs spécifiques
async function fbUpdate(collection, id, data) {
  const fields = Object.keys(data).map(k => `updateMask.fieldPaths=${k}`).join('&');
  try {
    const res = await fetch(`${DB_URL}/${collection}/${id}?${fields}&key=${API_KEY}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fields: toFirestoreFields(data) })
    });
    return await res.json();
  } catch(e) { console.error('fbUpdate error:', e); return null; }
}

// Supprimer un document
async function fbDelete(collection, id) {
  try {
    await fetch(`${DB_URL}/${collection}/${id}?key=${API_KEY}`, { method: 'DELETE' });
    return true;
  } catch(e) { console.error('fbDelete error:', e); return false; }
}

// ============================================================
// CONVERTISSEURS FIRESTORE ↔ JS
// ============================================================
function toFirestoreFields(obj) {
  const fields = {};
  for (const [k, v] of Object.entries(obj)) {
    if (v === null || v === undefined) fields[k] = { nullValue: null };
    else if (typeof v === 'boolean') fields[k] = { booleanValue: v };
    else if (typeof v === 'number') fields[k] = { integerValue: v };
    else if (typeof v === 'string') fields[k] = { stringValue: v };
    else if (Array.isArray(v)) fields[k] = { arrayValue: { values: v.map(item => ({ stringValue: String(item) })) } };
    else fields[k] = { stringValue: String(v) };
  }
  return fields;
}

function parseFirestoreDoc(fields) {
  if (!fields) return {};
  const obj = {};
  for (const [k, v] of Object.entries(fields)) {
    if ('stringValue' in v) obj[k] = v.stringValue;
    else if ('integerValue' in v) obj[k] = parseInt(v.integerValue);
    else if ('doubleValue' in v) obj[k] = parseFloat(v.doubleValue);
    else if ('booleanValue' in v) obj[k] = v.booleanValue;
    else if ('nullValue' in v) obj[k] = null;
    else if ('arrayValue' in v) obj[k] = (v.arrayValue.values || []).map(i => i.stringValue || '');
    else obj[k] = null;
  }
  return obj;
}

// ============================================================
// GENERATEUR DE CODE BAT UNIQUE
// ============================================================
function generateBATCode() {
  const num = Math.floor(Math.random() * 900) + 100;
  const year = new Date().getFullYear();
  return `3D-${year}-${num}`;
}

// ============================================================
// FORMATER LA DATE
// ============================================================
function formatDate(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  return d.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

// ============================================================
// BADGE HTML SELON STATUT
// ============================================================
function statusBadge(statut) {
  const map = {
    'en_attente':  ['badge-orange', 'En attente'],
    'envoye':      ['badge-blue',   'Envoyé'],
    'valide':      ['badge-green',  'Validé ✓'],
    'modification':['badge-red',    'Modif. demandée'],
    'en_production':['badge-gray',  'En production'],
    'livre':       ['badge-green',  'Livré'],
    'publie':      ['badge-green',  'Publié'],
    'refuse':      ['badge-red',    'Refusé'],
  };
  const [cls, label] = map[statut] || ['badge-gray', statut];
  return `<span class="badge ${cls}">${label}</span>`;
}