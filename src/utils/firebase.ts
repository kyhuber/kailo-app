// src/lib/firebase.ts
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyBhNwgBBarfdIY4fosscl_7zininp5IbMU",
  authDomain: "kailo-3214.firebaseapp.com",
  projectId: "kailo-3214",
  storageBucket: "kailo-3214.firebasestorage.app",
  messagingSenderId: "694309248803",
  appId: "1:694309248803:web:dfd526696485f358cb3696",
  measurementId: "G-EHNCRL1ZDY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);