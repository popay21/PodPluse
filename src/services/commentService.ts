import db from "../firebase/firestore";
import { collection, addDoc, deleteDoc, doc, getDocs, query, where, orderBy } from "firebase/firestore";

// פונקציה להוספת תגובה חדשה לפודקאסט
export const addComment = async (podcastId: string, userId: string, userName: string, text: string, rating: number) => {
  try {
    await addDoc(collection(db, "comments"), {
      podcastId, // מזהה הפודקאסט
      userId, // מזהה המשתמש שהגיב
      userName, // שם המשתמש שהגיב
      text, // טקסט התגובה
      rating, // דירוג שניתן על ידי המשתמש
      createdAt: new Date(), // תאריך ושעת יצירת התגובה
    });
  } catch (error) {
    console.error("Error adding comment: ", error);
    throw error; // זריקת שגיאה כדי לטפל בה בחוץ
  }
};

// פונקציה לקבלת כל התגובות עבור פודקאסט מסוים
export const getCommentsForPodcast = async (podcastId: string) => {
  try {
    const q = query(
      collection(db, "comments"), // אוסף התגובות ב-Firestore
      where("podcastId", "==", podcastId), // סינון התגובות לפי מזהה הפודקאסט
      orderBy("createdAt", "desc") // מיון התגובות לפי תאריך יצירה בסדר יורד
    );
    const querySnapshot = await getDocs(q); // שליפת התגובות מבסיס הנתונים
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })); // החזרת רשימת התגובות
  } catch (error) {
    console.error("Error fetching comments: ", error);
    throw error; // זריקת שגיאה כדי לטפל בה בחוץ
  }
};

// פונקציה למחיקת תגובה על פי מזהה התגובה
export const deleteComment = async (commentId: string) => {
  try {
    await deleteDoc(doc(db, "comments", commentId)); // מחיקת מסמך התגובה מ-Firestore
  } catch (error) {
    console.error("Error deleting comment: ", error);
    throw error; // זריקת שגיאה כדי לטפל בה בחוץ
  }
};
