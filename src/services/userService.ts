// src/services/userService.ts

import { auth, db } from '../config/firebase.config';
import { 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword, 
    signOut,
    User 
} from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";

// ממשק למשתמש שמאחד את כל המידע שאנחנו צריכים על משתמש
interface UserData {
    uid: string;
    email: string;
    name: string;
    age?: number;
    isAdmin: boolean;
    createdAt: Date;
}

// פונקציות אימות בסיסיות
export const login = async (email: string, password: string) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
};

export const register = async (email: string, password: string, name: string, age?: number) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // יצירת פרופיל משתמש בסיסי
    await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        name,
        age,
        isAdmin: false,
        createdAt: new Date()
    });

    return user;
};

export const logout = async () => {
    await signOut(auth);
};

// פונקציות ניהול פרופיל והרשאות
export const getUserProfile = async (userId: string): Promise<UserData | null> => {
    const userDoc = await getDoc(doc(db, "users", userId));
    return userDoc.exists() ? userDoc.data() as UserData : null;
};

export const updateUserProfile = async (userId: string, data: Partial<UserData>) => {
    await updateDoc(doc(db, "users", userId), data);
};

export const isAdmin = async (user: User | null): Promise<boolean> => {
    if (!user) return false;
    const userDoc = await getDoc(doc(db, "users", user.uid));
    return userDoc.exists() && userDoc.data()?.isAdmin === true;
};

export const makeUserAdmin = async (userId: string) => {
    await updateDoc(doc(db, "users", userId), { isAdmin: true });
};