// src/config/firebase.config.ts

import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";

// הגדרות החיבור לפרויקט Firebase שלך
// אלה הן אותן הגדרות שהיו בקובץ המקורי
const firebaseConfig = {
  apiKey: "AIzaSyAGPgdPqBSnAq4whOfKfMnAW2lQb6p9ycI",
  authDomain: "podpulse-30c82.firebaseapp.com",
  projectId: "podpulse-30c82",
  storageBucket: "podpulse-30c82.appspot.com",
  messagingSenderId: "813054320309",
  appId: "1:813054320309:web:fcbc2b6630fa39c0f168fc",
  measurementId: "G-PDC9Z2T2ZL"
};

// אתחול האפליקציה הראשית של Firebase
// זהו הבסיס לכל השירותים האחרים
const app = initializeApp(firebaseConfig);

// יצירת כל השירותים שאנחנו צריכים
// במקום ליצור אותם במקומות שונים, נרכז אותם כאן
const auth = getAuth(app);        // שירות האימות
const db = getFirestore(app);     // בסיס הנתונים
const storage = getStorage(app);  // אחסון קבצים
const analytics = getAnalytics(app); // אנליטיקס

// ייצוא מרוכז של כל השירותים
// כך נוכל לייבא אותם בקלות בכל מקום בו נצטרך אותם
export { app as default, auth, db, storage, analytics };