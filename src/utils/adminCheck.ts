// src/utils/adminCheck.ts

import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

// פונקציה לבדיקת האם משתמש הוא מנהל על סמך מזהה המשתמש
export const isAdmin = async (userId: string): Promise<boolean> => {
  try {
    const userDoc = await getDoc(doc(db, "users", userId)); // שליפת מסמך המשתמש מ-Firestore
    return userDoc.exists() && userDoc.data()?.isAdmin === true; // בדיקה אם המסמך קיים ואם השדה isAdmin הוא true
  } catch (error) {
    console.error("Error checking admin status:", error);
    return false; // במקרה של שגיאה, החזרה של false
  }
};
