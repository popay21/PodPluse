import { collection, addDoc, getDocs, deleteDoc, doc, query, where, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import { Podcast } from "../types";

const podcastCollection = collection(db, "podcasts"); // הפניה לאוסף הפודקאסטים ב-Firestore

// פונקציה להוספת פודקאסט חדש למסד הנתונים
export const addPodcast = async (podcastData: Partial<Podcast>): Promise<string> => {
  try {
    const docRef = await addDoc(podcastCollection, {
      ...podcastData,
      createdAt: new Date() // הוספת תאריך יצירה
    });
    return docRef.id; // החזרת מזהה הפודקאסט שנוסף
  } catch (error) {
    console.error("Error adding podcast: ", error);
    throw error; // זריקת שגיאה כדי לטפל בה בחוץ
  }
};

// פונקציה לקבלת כל הפודקאסטים מהמסד נתונים
export const getPodcasts = async (): Promise<Podcast[]> => {
  try {
    const querySnapshot = await getDocs(podcastCollection);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Podcast)); // המרת המסמכים לפורמט הפודקאסט והחזרתם
  } catch (error) {
    console.error("Error getting podcasts: ", error);
    throw error; // זריקת שגיאה כדי לטפל בה בחוץ
  }
};

// פונקציה למחיקת פודקאסט לפי מזהה
export const deletePodcast = async (id: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, "podcasts", id)); // מחיקת מסמך הפודקאסט מה-Firestore
  } catch (error) {
    console.error("Error deleting podcast: ", error);
    throw error; // זריקת שגיאה כדי לטפל בה בחוץ
  }
};

// פונקציה לקבלת כל הפודקאסטים המועדפים של משתמש
export const getFavoritePodcasts = async (userId: string): Promise<Podcast[]> => {
  try {
    console.log('Fetching favorites for user:', userId);
    const userFavoritesRef = collection(db, 'users', userId, 'favorites');
    const favoritesSnapshot = await getDocs(userFavoritesRef);
    
    console.log('Number of favorites found:', favoritesSnapshot.docs.length);
    
    const favoritePodcasts: Podcast[] = [];
    
    for (const favoriteDoc of favoritesSnapshot.docs) {
      const podcastId = favoriteDoc.id;
      const podcastDoc = await getDoc(doc(db, 'podcasts', podcastId));
      
      if (podcastDoc.exists()) {
        favoritePodcasts.push({ id: podcastDoc.id, ...podcastDoc.data() } as Podcast);
      }
    }

    console.log('Fetched favorite podcasts:', favoritePodcasts);
    return favoritePodcasts; // החזרת רשימת הפודקאסטים המועדפים
  } catch (error) {
    console.error('Error fetching favorite podcasts:', error);
    throw error; // זריקת שגיאה כדי לטפל בה בחוץ
  }
};

// פונקציה להוספת פודקאסט למועדפים של משתמש
export const addToFavorites = async (userId: string, podcastId: string): Promise<void> => {
  try {
    const userFavoritesRef = doc(db, 'users', userId, 'favorites', podcastId);
    await setDoc(userFavoritesRef, { addedAt: new Date() }); // הוספת הפודקאסט למועדפים עם תאריך הוספה
    console.log(`Added podcast ${podcastId} to favorites for user ${userId}`);
  } catch (error) {
    console.error('Error adding to favorites:', error);
    throw error; // זריקת שגיאה כדי לטפל בה בחוץ
  }
};

// פונקציה להסרת פודקאסט מהמועדפים של משתמש
export const removeFromFavorites = async (userId: string, podcastId: string): Promise<void> => {
  try {
    const userFavoritesRef = doc(db, 'users', userId, 'favorites', podcastId);
    await deleteDoc(userFavoritesRef); // מחיקת הפודקאסט מהמועדפים
    console.log(`Removed podcast ${podcastId} from favorites for user ${userId}`);
  } catch (error) {
    console.error('Error removing from favorites:', error);
    throw error; // זריקת שגיאה כדי לטפל בה בחוץ
  }
};

// פונקציה לבדיקה אם פודקאסט נמצא במועדפים של משתמש
export const isFavorite = async (userId: string, podcastId: string): Promise<boolean> => {
  try {
    const userFavoriteRef = doc(db, 'users', userId, 'favorites', podcastId);
    const favoriteDoc = await getDoc(userFavoriteRef);
    return favoriteDoc.exists(); // בדיקת קיום המסמך שמסמן שהפודקאסט הוא מועדף
  } catch (error) {
    console.error('Error checking if podcast is favorite:', error);
    throw error; // זריקת שגיאה כדי לטפל בה בחוץ
  }
};
