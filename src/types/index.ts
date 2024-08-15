// הגדרת קבוצה של קטגוריות אפשריות לפודקאסטים
export const CATEGORIES = [
  "Comedy",
  "News",
  "Technology",
  "Science",
  "History",
  "Business",
  "Politics",
  "Entertainment",
  "Sports",
  "Education",
  "Health & Fitness",
  "Society & Culture",
  "Arts",
  "Music",
  "TV & Film"
] as const; // השימוש ב-"as const" הופך את המערך הזה ל-immutable

// יצירת סוג (Type) שנקרא PodcastCategory, שהוא אחד מהערכים שבקבוצה CATEGORIES
export type PodcastCategory = typeof CATEGORIES[number];

// הגדרת הממשק (interface) של פודקאסט
export interface Podcast {
  id: string; // מזהה הפודקאסט
  title: string; // כותרת הפודקאסט
  description: string; // תיאור הפודקאסט
  category?: PodcastCategory; // קטגוריה של הפודקאסט (אופציונלי)
  audioUrl?: string; // קישור לקובץ האודיו של הפודקאסט (אופציונלי)
  videoUrl?: string; // קישור לקובץ הווידאו של הפודקאסט (אופציונלי)
  imageUrl?: string; // קישור לתמונת הפודקאסט (אופציונלי)
  createdAt: Date; // תאריך יצירת הפודקאסט
  createdBy: string; // מזהה המשתמש שיצר את הפודקאסט
}

// הגדרת הממשק (interface) של משתמש
export interface User {
  uid: string; // מזהה המשתמש
  email: string; // כתובת האימייל של המשתמש
  displayName: string; // שם התצוגה של המשתמש
  isAdmin: boolean; // האם המשתמש הוא מנהל מערכת
}
