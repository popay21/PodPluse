import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAGPgdPqBSnAq4whOfKfMnAW2lQb6p9ycI",
  authDomain: "podpulse-30c82.firebaseapp.com",
  projectId: "podpulse-30c82",
  storageBucket: "podpulse-30c82.appspot.com",
  messagingSenderId: "813054320309",
  appId: "1:813054320309:web:fcbc2b6630fa39c0f168fc",
  measurementId: "G-PDC9Z2T2ZL"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const analytics = getAnalytics(app);
const storage = getStorage(app);

export { auth, db, analytics, storage };
export default app;