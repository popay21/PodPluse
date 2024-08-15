import { auth, db } from "../firebase";
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut,
  User
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";

// פונקציה לכניסה של משתמש קיים
export const login = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log("User logged in successfully:", userCredential.user.uid);
    return userCredential.user;
  } catch (error) {
    console.error("Error logging in:", error);
    // כאן אפשר להוסיף ניהול שגיאה נוסף אם צריך, למשל לשלוח הודעה למשתמש
    throw error; // זריקת שגיאה כדי לטפל בה בחוץ
  }
};

// פונקציה לרישום משתמש חדש ויצירת מסמך משתמש ב-Firestore
export const register = async (email: string, password: string, name: string, age: number, isAdmin: boolean = false) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    console.log("User created successfully:", user.uid);

    // יצירת מסמך משתמש ב-Firestore עם פרטי המשתמש
    await setDoc(doc(db, "users", user.uid), {
      email: user.email,
      name: name,
      age: age,
      isAdmin: isAdmin, // שמירת סטטוס מנהל אם נדרש
      createdAt: new Date()
    });

    console.log("User document created in Firestore");

    return user;
  } catch (error) {
    console.error("Error registering new user:", error);
    // כאן אפשר להוסיף ניהול שגיאה נוסף אם צריך, כמו למשל לשלוח הודעה למשתמש
    throw error; // זריקת שגיאה כדי לטפל בה בחוץ
  }
};

// פונקציה לניתוק משתמש מהמערכת
export const logout = async () => {
  try {
    await signOut(auth);
    console.log("User signed out successfully");
  } catch (error) {
    console.error("Error signing out:", error);
    // כאן אפשר להוסיף ניהול שגיאה נוסף אם צריך, למשל לשלוח הודעה למשתמש
    throw error; // זריקת שגיאה כדי לטפל בה בחוץ
  }
};

// פונקציה לבדיקה אם המשתמש הוא מנהל
export const isAdmin = async (user: User | null): Promise<boolean> => {
  if (!user) {
    console.log("No user provided to isAdmin check");
    return false;
  }

  try {
    const userDoc = await getDoc(doc(db, "users", user.uid));
    const isAdminUser = userDoc.exists() && userDoc.data()?.isAdmin === true;
    console.log(`Admin status for user ${user.uid}: ${isAdminUser ? 'true' : 'false'}`);
    return isAdminUser; // החזרת סטטוס המנהל
  } catch (error) {
    console.error("Error checking admin status:", error);
    return false; // במקרה של שגיאה, החזרת false
  }
};
