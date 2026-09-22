import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Environment variables or fallback defaults
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyMockKeyForDevelopmentMode12345",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "letterboxd-podcast.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "letterboxd-podcast",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "letterboxd-podcast.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:123456789:web:abcdef123456"
};

let app;
let auth;
let db;

try {
  if (!getApps().length) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApps()[0];
  }
  auth = getAuth(app);
  db = getFirestore(app);
} catch (e) {
  console.warn("[Firebase] Initialized with fallback mock support:", e.message);
}

export { app, auth, db };
