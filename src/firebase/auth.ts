import { getAuth } from "firebase/auth";
import app from "./firebase"; // ייבוא של אפליקציית Firebase המוגדרת

const auth = getAuth(app);

export default auth;
