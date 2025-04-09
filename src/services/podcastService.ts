// src/services/podcastService.ts

import { db, storage } from '../config/firebase.config';
import { 
    collection, 
    addDoc, 
    getDocs, 
    deleteDoc, 
    doc, 
    getDoc, 
    setDoc 
} from "firebase/firestore";
import { 
    ref, 
    uploadBytes, 
    getDownloadURL,
    deleteObject 
} from "firebase/storage";
import { Podcast } from '../types';

// נגדיר ממשק לנתונים שנדרשים ליצירת פודקאסט חדש
interface CreatePodcastData {
    title: string;
    description: string;
    category?: string;
    createdBy: string;
    audioFile?: File;
    imageFile?: File;
}

// פונקציה מסייעת להעלאת קבצים לאחסון
const uploadFile = async (file: File, path: string) => {
    const storageRef = ref(storage, path);
    const snapshot = await uploadBytes(storageRef, file);
    return getDownloadURL(snapshot.ref);
};

// פונקציות עיקריות לניהול פודקאסטים
export const addPodcast = async (podcastData: CreatePodcastData): Promise<string> => {
    try {
        // מעלים קודם את הקבצים אם יש
        let audioUrl = '';
        let imageUrl = '';

        if (podcastData.audioFile) {
            audioUrl = await uploadFile(
                podcastData.audioFile,
                `podcasts/audio/${podcastData.audioFile.name}`
            );
        }

        if (podcastData.imageFile) {
            imageUrl = await uploadFile(
                podcastData.imageFile,
                `podcasts/images/${podcastData.imageFile.name}`
            );
        }

        // מוסיפים את הפודקאסט למסד הנתונים
        const docRef = await addDoc(collection(db, "podcasts"), {
            title: podcastData.title,
            description: podcastData.description,
            category: podcastData.category,
            audioUrl,
            imageUrl,
            createdBy: podcastData.createdBy,
            createdAt: new Date(),
        });

        return docRef.id;
    } catch (error) {
        console.error("Error adding podcast: ", error);
        throw error;
    }
};

export const getPodcasts = async (): Promise<Podcast[]> => {
    const querySnapshot = await getDocs(collection(db, "podcasts"));
    return querySnapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
    } as Podcast));
};

export const deletePodcast = async (podcastId: string): Promise<void> => {
    try {
        // מקבלים את פרטי הפודקאסט כדי למחוק גם את הקבצים המשויכים
        const podcastDoc = await getDoc(doc(db, "podcasts", podcastId));
        const podcastData = podcastDoc.data();

        // מוחקים קבצים מהאחסון אם קיימים
        if (podcastData?.audioUrl) {
            const audioRef = ref(storage, podcastData.audioUrl);
            await deleteObject(audioRef);
        }
        if (podcastData?.imageUrl) {
            const imageRef = ref(storage, podcastData.imageUrl);
            await deleteObject(imageRef);
        }

        // מוחקים את הפודקאסט עצמו
        await deleteDoc(doc(db, "podcasts", podcastId));
    } catch (error) {
        console.error("Error deleting podcast: ", error);
        throw error;
    }
};

// פונקציות לניהול מועדפים
export const addToFavorites = async (userId: string, podcastId: string): Promise<void> => {
    const userFavoritesRef = doc(db, 'users', userId, 'favorites', podcastId);
    await setDoc(userFavoritesRef, { addedAt: new Date() });
};

export const removeFromFavorites = async (userId: string, podcastId: string): Promise<void> => {
    const userFavoritesRef = doc(db, 'users', userId, 'favorites', podcastId);
    await deleteDoc(userFavoritesRef);
};

export const getFavoritePodcasts = async (userId: string): Promise<Podcast[]> => {
    const userFavoritesRef = collection(db, 'users', userId, 'favorites');
    const favoritesSnapshot = await getDocs(userFavoritesRef);
    
    const podcasts: Podcast[] = [];
    for (const favoriteDoc of favoritesSnapshot.docs) {
        const podcastDoc = await getDoc(doc(db, 'podcasts', favoriteDoc.id));
        if (podcastDoc.exists()) {
            podcasts.push({ id: podcastDoc.id, ...podcastDoc.data() } as Podcast);
        }
    }
    
    return podcasts;
};