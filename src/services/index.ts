// src/services/index.ts

// ייבוא השירותים העיקריים שלנו לאחר הארגון מחדש
import * as userService from './userService';
import * as podcastService from './podcastService';
import { CommentService } from './commentService';

// ייצוא כל הפונקציות הקשורות למשתמשים
export const {
    login,
    register,
    logout,
    getUserProfile,
    updateUserProfile,
    isAdmin,
    makeUserAdmin
} = userService;

// ייצוא כל הפונקציות הקשורות לפודקאסטים
export const {
    addPodcast,
    getPodcasts,
    deletePodcast,
    addToFavorites,
    removeFromFavorites,
    getFavoritePodcasts
} = podcastService;

// ייצוא כל הפונקציות הקשורות לתגובות
export const {
    addComment,
    getCommentsForPodcast,
    updateComment,
    addLike,
    deleteComment,
    getAverageRating
} = CommentService;

// ממשק לתשובות מהשירותים שלנו - מסייע בטיפול בשגיאות ומצבי הצלחה
export interface ServiceResponse<T = void> {
    success: boolean;
    data?: T;
    error?: string;
}

// פונקציית עזר לטיפול באסינכרוניות ושגיאות באופן אחיד
export async function handleServiceCall<T>(
    serviceFunction: () => Promise<T>
): Promise<ServiceResponse<T>> {
    try {
        const data = await serviceFunction();
        return { success: true, data };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'An unknown error occurred'
        };
    }
}

// ייצוא אובייקט שירותים מרוכז - שימושי כשצריך גישה לכל הפונקציות של שירות ספציפי
export const services = {
    user: userService,
    podcast: podcastService,
    comments: CommentService
};

// שמירה על תאימות לאחור - במידה וקוד קיים משתמש בפונקציות הישנות
export const makeUserAdminLegacy = async (uid: string) => {
    console.warn('makeUserAdminLegacy is deprecated, please use makeUserAdmin from userService');
    return await userService.makeUserAdmin(uid);
};