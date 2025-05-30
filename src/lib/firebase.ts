import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Check if we have the required Firebase config
const hasValidConfig = process.env.NEXT_PUBLIC_FIREBASE_API_KEY && 
                      process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN &&
                      process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

// Use placeholder values if config is missing
const firebaseConfig = hasValidConfig ? {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
} : {
  // Placeholder config for development
  apiKey: "demo-api-key",
  authDomain: "demo-app.firebaseapp.com",
  projectId: "demo-app",
  storageBucket: "demo-app.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef",
  measurementId: "G-ABCDEF"
};

// Initialize Firebase - only if valid config or in development mode
let app: ReturnType<typeof initializeApp> | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;
let storage: ReturnType<typeof getStorage> | null = null;
let provider: GoogleAuthProvider | null = null;

try {
  app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
  
  // Initialize Firebase services
  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);
  provider = new GoogleAuthProvider();
} catch (error) {
  console.error("Firebase initialization error:", error);
  // Create mock objects if Firebase init fails
  app = null;
  auth = null;
  db = null;
  storage = null;
  provider = null;
}

export { app, auth, db, storage, provider };