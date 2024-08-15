import { getFirestore } from "firebase/firestore";
import app from "./firebase"; // ייבוא של אפליקציית Firebase המוגדרת


const db = getFirestore(app);

export default db;
