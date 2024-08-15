import { Podcast } from "../types";
import db from "../firebase/firestore"; // ייבוא של Firestore כברירת מחדל
import { collection, query, where, getDocs } from "firebase/firestore";

// פונקציה לחיפוש פודקאסטים לפי מונח חיפוש או קטגוריה
export const searchPodcasts = async (searchTerm: string, category: string = "") => {
  try {
    let q = query(collection(db, "podcasts")); // יצירת שאילתה לאוסף הפודקאסטים

    // אם יש קטגוריה שנבחרה, נוסיף תנאי לשאילתה
    if (category) {
      q = query(q, where("category", "==", category));
    }

    const querySnapshot = await getDocs(q); // שליפת התוצאות מהמסד נתונים
    const podcasts = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Podcast)); // המרת התוצאות למבנה Podcast

    // סינון הפודקאסטים לפי מונח החיפוש בכותרת או בתיאור
    return podcasts.filter(podcast => 
      podcast.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      podcast.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  } catch (error) {
    console.error("Error searching podcasts: ", error);
    throw error; // זריקת שגיאה כדי לטפל בה בחוץ
  }
};

// פונקציה לסינון פודקאסטים לפי קטגוריה
export const filterPodcastsByCategory = (podcasts: Podcast[], category: string) => {
  // החזרת הפודקאסטים בקטגוריה הנבחרת או כל הפודקאסטים אם לא נבחרה קטגוריה
  return category ? podcasts.filter(podcast => podcast.category === category) : podcasts;
};
