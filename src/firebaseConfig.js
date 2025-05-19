// src/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
   apiKey: "AIzaSyDK547wdEyC5rDDSO87MPORrEHWNC8ECSw",
  authDomain: "skillswap-cf57c.firebaseapp.com",
  projectId: "skillswap-cf57c",
  storageBucket: "skillswap-cf57c.firebasestorage.app",
  messagingSenderId: "747945090512",
  appId: "1:747945090512:web:acb0385ed6bfe0b09fedd5",
  measurementId: "G-F4GZ68HD6G"
  // ...other config values from your Firebase project
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider };