import { isAdmin } from './authService';
import * as userService from './userService';
import * as authService from './authService';
import * as podcastService from './podcastService';
import * as storageService from './storageService';

// ייצוא ישיר של פונקציות ספציפיות
export { isAdmin };

// ייצוא כל התוכן של השירותים
export * from './authService';
export * from './podcastService';
export * from './storageService';

// ייצוא פונקציות מ-userService
export const {
  makeUserAdmin: userServiceMakeUserAdmin,
  // הוסף כאן פונקציות נוספות אם יש
} = userService;

// הגדרת makeUserAdmin כפונקציה ברירת מחדל אם היא לא קיימת ב-userService
const defaultMakeUserAdmin = async (uid: string) => {
  console.log(`Making user ${uid} an admin`);
  // יש להחליף את זה עם הלוגיקה האמיתית אם נדרש
};

// ייצוא makeUserAdmin, משתמש בגרסה מ-userService אם קיימת, אחרת בגרסת ברירת המחדל
export const makeUserAdmin = userServiceMakeUserAdmin || defaultMakeUserAdmin;

// ייצוא אובייקטים מלאים של השירותים (אופציונלי, אם נדרש)
export const services = {
  auth: authService,
  podcast: podcastService,
  storage: storageService,
  user: userService
};