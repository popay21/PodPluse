// src/utils/index.ts

import { User } from 'firebase/auth';
import { isAdmin } from '../services/authService';

// ייצוא מודולים קיימים
export * from './adminCheck';
export * from './helpers';

// ייצוא פונקציות נוספות שהיו קיימות קודם
export { filterPodcastsByCategory, searchPodcasts } from './helpers';

// ייצוא פונקציית checkAdminStatus
export const checkAdminStatus = async (user: User | null): Promise<boolean> => {
  return isAdmin(user);
};

