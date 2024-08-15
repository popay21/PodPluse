import { getStorage } from "firebase/storage";
import app from "./firebase"; // ייבוא של אפליקציית Firebase המוגדרת

const storage = getStorage(app);

export default storage;
