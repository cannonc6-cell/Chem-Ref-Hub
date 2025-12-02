import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD3ooSt0FqjobCiMDhYHJP_sz8OkdpXRyQ",
  authDomain: "chem-ref-hub.firebaseapp.com",
  projectId: "chem-ref-hub",
  storageBucket: "chem-ref-hub.firebasestorage.app",
  messagingSenderId: "850295909882",
  appId: "1:850295909882:web:a02b4e0bee84930c098843",
  measurementId: "G-74TP21ZDDV"
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
