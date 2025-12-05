import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Firebase configuration - use environment variables for security
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyD3ooSt0FqjobCiMDhYHJP_sz8OkdpXRyQ",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "chem-ref-hub.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "chem-ref-hub",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "chem-ref-hub.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "850295909882",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:850295909882:web:a02b4e0bee84930c098843",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-74TP21ZDDV"
};

const app = initializeApp(firebaseConfig);

// Auth
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = () => signInWithPopup(auth, googleProvider);
export const signOutUser = () => signOut(auth);
export const listenToAuth = (callback) => onAuthStateChanged(auth, callback);

// Firestore (for per-user data later)
export const db = getFirestore(app);
