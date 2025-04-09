// src/services/commentService.ts

import { db } from '../config/firebase.config';
import { 
  collection, 
  addDoc, 
  deleteDoc, 
  doc, 
  getDocs, 
  query, 
  where, 
  orderBy,
  Timestamp,
  updateDoc,
  increment // הוספנו את זה
} from "firebase/firestore";

// ממשק שמגדיר את המבנה של תגובה
interface Comment {
    id: string;
    text: string;
    userId: string;
    userName: string;
    podcastId: string;
    rating: number;
    likes: number;
    createdAt: Timestamp;
}

// ממשק לנתונים הנדרשים ליצירת תגובה חדשה
interface CreateCommentData {
    text: string;
    userId: string;
    userName: string;
    podcastId: string;
    rating: number;
}

// מחלקה מרכזית לניהול תגובות
export class CommentService {
    // יצירת תגובה חדשה
    static async addComment(commentData: CreateCommentData): Promise<string> {
        try {
            const docRef = await addDoc(collection(db, "comments"), {
                ...commentData,
                likes: 0,
                createdAt: Timestamp.now()
            });

            return docRef.id;
        } catch (error) {
            console.error("Error adding comment: ", error);
            throw new Error("Failed to add comment");
        }
    }

    // קבלת כל התגובות לפודקאסט מסוים
    static async getCommentsForPodcast(podcastId: string): Promise<Comment[]> {
        try {
            const commentsQuery = query(
                collection(db, "comments"),
                where("podcastId", "==", podcastId),
                orderBy("createdAt", "desc")
            );

            const querySnapshot = await getDocs(commentsQuery);
            return querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            } as Comment));
        } catch (error) {
            console.error("Error fetching comments: ", error);
            throw new Error("Failed to fetch comments");
        }
    }

    // עדכון תגובה (למשל, הוספת לייק)
    static async updateComment(commentId: string, updates: Partial<Comment>): Promise<void> {
        try {
            const commentRef = doc(db, "comments", commentId);
            await updateDoc(commentRef, updates);
        } catch (error) {
            console.error("Error updating comment: ", error);
            throw new Error("Failed to update comment");
        }
    }

    // הוספת לייק לתגובה
    static async addLike(commentId: string): Promise<void> {
      try {
          const commentRef = doc(db, "comments", commentId);
          await updateDoc(commentRef, {
              likes: increment(1) // עכשיו זה יעבוד
          });
      } catch (error) {
          console.error("Error adding like: ", error);
          throw new Error("Failed to add like");
      }
  }

    // מחיקת תגובה
    static async deleteComment(commentId: string): Promise<void> {
        try {
            await deleteDoc(doc(db, "comments", commentId));
        } catch (error) {
            console.error("Error deleting comment: ", error);
            throw new Error("Failed to delete comment");
        }
    }

    // קבלת ממוצע הדירוגים לפודקאסט
    static async getAverageRating(podcastId: string): Promise<number> {
        try {
            const comments = await this.getCommentsForPodcast(podcastId);
            if (comments.length === 0) return 0;

            const totalRating = comments.reduce((sum, comment) => sum + comment.rating, 0);
            return totalRating / comments.length;
        } catch (error) {
            console.error("Error calculating average rating: ", error);
            throw new Error("Failed to calculate average rating");
        }
    }
}

// ייצוא הפונקציות בצורה נוחה לשימוש
export const { 
    addComment, 
    getCommentsForPodcast, 
    updateComment, 
    addLike, 
    deleteComment, 
    getAverageRating 
} = CommentService;