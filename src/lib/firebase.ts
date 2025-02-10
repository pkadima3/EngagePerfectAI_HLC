// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBOyhXNmNsb8eULbU_bZJUR2a9fzHJraS0",
  authDomain: "engperfectaiproj.firebaseapp.com",
  projectId: "engperfectaiproj",
  storageBucket: "engperfectaiproj.firebasestorage.app",
  messagingSenderId: "145194076455",
  appId: "1:145194076455:web:ee8be162ede182c8640102",
  measurementId: "G-5XML9SZY5J"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
console.log('Firebase initialized with config:', firebaseConfig);

// -- 3) Optional: Safely initialize Analytics (client-side only)
let analytics;
if (typeof window !== "undefined") {
const analytics = getAnalytics(app);
}

// Initialize services
export const auth = getAuth(app);
export const storage = getStorage(app);
export const db = getFirestore(app);
export const analyticsService = analytics;