import storage from "../firebase/storage";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

// פונקציה להעלאת קובץ ל-Firebase Storage והחזרת URL של הקובץ
export const uploadFile = async (file: File, path: string): Promise<string> => {
  try {
    const storageRef = ref(storage, path); // יצירת רפרנס למסלול הקובץ ב-Firebase Storage
    const snapshot = await uploadBytes(storageRef, file); // העלאת הקובץ ל-Firebase Storage
    const downloadURL = await getDownloadURL(snapshot.ref); // קבלת ה-URL של הקובץ שהועלה
    console.log(`File uploaded successfully to ${path}`); // הודעת הצלחה בלוג
    return downloadURL; // החזרת ה-URL
  } catch (error) {
    console.error("Error uploading file: ", error);
    throw error; // זריקת שגיאה כדי לטפל בה בחוץ
  }
};
