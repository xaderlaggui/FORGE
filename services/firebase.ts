import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// 🔧 Replace these values with your Firebase project config
// Firebase Console → Project Settings → Your apps → SDK setup
const firebaseConfig = {
  apiKey: "AIzaSyB6n6NvTj-bQ-MCEM4Gz1ii_mG1X-QN2Yg",
  authDomain: "fitness-app-3f79e.firebaseapp.com",
  projectId: "fitness-app-3f79e",
  storageBucket: "fitness-app-3f79e.firebasestorage.app",
  messagingSenderId: "424926447189",
  appId: "1:424926447189:web:036dba4c97a289f0be76dc",
  measurementId: "G-PSE5BS252F"
};

// Prevent re-initialization during hot reload
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
