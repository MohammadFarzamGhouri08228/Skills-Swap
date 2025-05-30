// firebase/firebase.ts
// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getFirestore, Firestore } from "firebase/firestore";
import { getAnalytics, isSupported, Analytics } from "firebase/analytics"; // Added isSupported
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDK547wdEyC5rDDSO87MPORrEHWNC8ECSw",
  authDomain: "skillswap-cf57c.firebaseapp.com",
  projectId: "skillswap-cf57c",
  storageBucket: "skillswap-cf57c.appspot.com", // Corrected storage bucket domain
  messagingSenderId: "747945090512",
  appId: "1:747945090512:web:acb0385ed6bfe0b09fedd5",
  measurementId: "G-F4GZ68HD6G"
};

// Initialize Firebase
let app: FirebaseApp;
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp(); // If already initialized, use that instance
}

const db: Firestore = getFirestore(app); // Kept Firestore initialization

let analytics: Analytics | undefined;
// Initialize Analytics only if supported (i.e., in a browser environment)
isSupported().then((supported) => {
  if (supported) {
    analytics = getAnalytics(app);
  }
});

export { db, app, analytics }; // db is still exported for createCollections.js and app is exported for other modules. Export analytics as well.
// You might want to export 'analytics' as well if you plan to use it elsewhere
// export { db, analytics }; 