// src/components/Header.tsx

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase';
import { checkAdminStatus } from '../utils';

const Header: React.FC = () => {
  const [user, loading] = useAuthState(auth); // חיבור למשתמש המחובר וסטטוס הטעינה
  const [isAdmin, setIsAdmin] = useState(false); // סטייט לבדיקה אם המשתמש הוא אדמין
  const navigate = useNavigate(); // כלי לניווט בין דפים

  // שימוש ב-useEffect לבדוק את הסטטוס של המשתמש אם הוא אדמין כאשר המשתמש מחובר
  useEffect(() => {
    if (user) {
      checkAdminStatus(user).then(setIsAdmin);
    }
  }, [user]);

  // פונקציה ליציאה מהחשבון ולניווט לדף הבית לאחר היציאה
  const handleSignOut = async () => {
    await auth.signOut();
    navigate('/');
  };

  // אם הטעינה נמשכת, הצג הודעת טעינה
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    // כותרת עם רקע גרדיאנט וצללית
    <header className="bg-gradient-to-r from-purple-600 to-indigo-800 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* קישור לדף הבית עם שם האתר */}
        <Link to="/" className="text-2xl font-bold">PodPulse</Link>
        <nav>
          <ul className="flex space-x-4">
            {!user ? (
              // תפריט למשתמשים שאינם מחוברים
              <>
                <li><Link to="/podcasts" className="hover:text-indigo-200">Podcasts</Link></li>
                <li><Link to="/login" className="hover:text-indigo-200">Login</Link></li>
                <li><Link to="/register" className="hover:text-indigo-200">Register</Link></li>
              </>
            ) : (
              // תפריט למשתמשים מחוברים
              <>
                <li><Link to="/podcasts" className="hover:text-indigo-200">Explore</Link></li>
                <li><Link to="/favorites" className="hover:text-indigo-200">Favorites</Link></li>
                {isAdmin && (
                  <li><Link to="/admin" className="hover:text-indigo-200">AdminDashboard</Link></li>
                )}
                <li><Link to="/profile" className="hover:text-indigo-200">Profile</Link></li>
                <li><button onClick={handleSignOut} className="hover:text-indigo-200">Sign out</button></li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;

