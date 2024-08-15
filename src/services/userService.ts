import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import { User } from "firebase/auth";

// פונקציה להענקת הרשאות מנהל למשתמש על ידי עדכון מסמך המשתמש ב-Firestore
export const makeUserAdmin = async (uid: string) => {
  try {
    const userRef = doc(db, "users", uid); // יצירת רפרנס למסמך המשתמש ב-Firestore
    await updateDoc(userRef, {
      isAdmin: true // עדכון השדה isAdmin ל-true
    });
    console.log(`User ${uid} has been successfully made an admin.`); // הודעת הצלחה בלוג
  } catch (error) {
    console.error("Error making user admin: ", error);
    // כאן אפשר להוסיף ניהול שגיאה נוסף אם צריך, כמו להודיע למשתמש
    throw error; // זריקת שגיאה כדי לטפל בה בחוץ
  }
};

// פונקציה לבדיקת האם משתמש הוא מנהל על סמך הנתונים ב-Firestore
export const isAdmin = async (user: User): Promise<boolean> => {
  if (!user) {
    console.log("No user provided to isAdmin check"); // הודעה במקרה שאין משתמש
    return false; // אם אין משתמש, החזרה של false
  }

  try {
    const userDoc = await getDoc(doc(db, "users", user.uid)); // שליפת מסמך המשתמש מ-Firestore
    const isAdminUser = userDoc.exists() && userDoc.data()?.isAdmin === true;
    console.log(`Admin status for user ${user.uid}: ${isAdminUser ? 'true' : 'false'}`); // הודעת סטטוס בלוג
    return isAdminUser; // החזרת סטטוס המנהל
  } catch (error) {
    console.error("Error checking admin status: ", error);
    // כאן אפשר להוסיף ניהול שגיאה נוסף אם צריך, כמו להודיע למשתמש
    return false; // במקרה של שגיאה, החזרה של false
  }
};
