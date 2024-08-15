import React, { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Link } from 'react-router-dom';
import { auth, db } from '../firebase';
import { collection, query, getDocs, doc, getDoc } from 'firebase/firestore';
import { Podcast } from '../types';
import { isAdmin } from '../services/authService';
import { FaUser, FaEnvelope, FaBirthdayCake, FaHeadphones, FaCrown } from 'react-icons/fa';

const UserProfile: React.FC = () => {
  const [user, loading] = useAuthState(auth); // סטייט למשתמש המחובר ולסטטוס הטעינה
  const [favorites, setFavorites] = useState<Podcast[]>([]); // סטייט לאחסון רשימת הפודקאסטים המועדפים
  const [isAdminUser, setIsAdminUser] = useState(false); // סטייט לבדיקה אם המשתמש הוא אדמין
  const [userName, setUserName] = useState<string | null>(null); // סטייט לאחסון שם המשתמש
  const [userAge, setUserAge] = useState<number | null>(null); // סטייט לאחסון גיל המשתמש
  const [error, setError] = useState<string | null>(null); // סטייט לאחסון הודעות שגיאה
  const [isLoading, setIsLoading] = useState(true); // סטייט לניהול מצב הטעינה

  // שימוש ב-useEffect כדי להביא את נתוני המשתמש מהממסד נתונים כאשר הקומפוננטה נטענת
  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return;

      setIsLoading(true); // הצגת מצב טעינה
      setError(null); // איפוס הודעות שגיאה

      try {
        console.log("Fetching user data for:", user.uid);

        // בדיקת סטטוס מנהל
        const adminStatus = await isAdmin(user);
        setIsAdminUser(adminStatus);
        console.log("Admin status:", adminStatus);

        // שליפת נתוני משתמש (שם וגיל)
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        console.log("User document exists:", userDoc.exists());
        if (userDoc.exists()) {
          const userData = userDoc.data();
          console.log("User data:", userData);
          setUserName(userData?.name || 'No Name Provided');
          setUserAge(userData?.age || null);
        } else {
          console.log("User document does not exist");
        }

        // שליפת מועדפים
        const favoritesQuery = query(collection(db, 'users', user.uid, 'favorites'));
        const favoritesSnapshot = await getDocs(favoritesQuery);
        console.log("Favorites count:", favoritesSnapshot.docs.length);
        
        const favoritesData = await Promise.all(
          favoritesSnapshot.docs.map(async (favDoc) => {
            const podcastDoc = await getDoc(doc(db, 'podcasts', favDoc.id));
            if (podcastDoc.exists()) {
              return { id: podcastDoc.id, ...podcastDoc.data() } as Podcast;
            } else {
              console.log("Podcast not found:", favDoc.id);
              return null;
            }
          })
        );
        setFavorites(favoritesData.filter(podcast => podcast !== null) as Podcast[]);
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError('Failed to load user data. Please try again later.');
      } finally {
        setIsLoading(false); // סיום מצב הטעינה
      }
    };

    if (!loading) {
      fetchUserData();
    }
  }, [user, loading]);

  if (loading || isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mt-4" role="alert">
        <p className="font-bold">Alert</p>
        <p>Please log in to view your profile.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mt-4" role="alert">
        <strong className="font-bold">Error!</strong>
        <span className="block sm:inline"> {error}</span>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-3xl font-bold mb-8 text-indigo-700">User Profile</h2>
      
      <div className="bg-white shadow-lg rounded-lg overflow-hidden mb-8">
        <div className="bg-indigo-600 text-white p-4">
          <h3 className="text-xl font-semibold">Personal Information</h3>
        </div>
        <div className="p-4 space-y-3">
          <p className="flex items-center"><FaUser className="mr-2 text-indigo-600" /> <span className="font-semibold mr-2">Name:</span> {userName}</p>
          <p className="flex items-center"><FaEnvelope className="mr-2 text-indigo-600" /> <span className="font-semibold mr-2">Email:</span> {user.email}</p>
          {userAge !== null && <p className="flex items-center"><FaBirthdayCake className="mr-2 text-indigo-600" /> <span className="font-semibold mr-2">Age:</span> {userAge}</p>}
          {isAdminUser && <p className="flex items-center"><FaCrown className="mr-2 text-yellow-500" /> <span className="font-semibold mr-2">Status:</span> <span className="text-green-600 font-semibold">Administrator</span></p>}
        </div>
      </div>

      <div className="bg-white shadow-lg rounded-lg overflow-hidden mb-8">
        <div className="bg-indigo-600 text-white p-4">
          <h3 className="text-xl font-semibold flex items-center"><FaHeadphones className="mr-2" /> Favorite Podcasts</h3>
        </div>
        <div className="p-4">
          {favorites.length === 0 ? (
            <p className="text-gray-600">You haven't added any podcasts to your favorites yet.</p>
          ) : (
            <ul className="space-y-2">
              {favorites.map((podcast) => (
                <li key={podcast.id} className="flex items-center">
                  <span className="w-2 h-2 bg-indigo-600 rounded-full mr-2"></span>
                  <Link to={`/podcast/${podcast.id}`} className="text-indigo-600 hover:text-indigo-800 transition-colors">
                    {podcast.title}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {isAdminUser && (
        <div className="mt-8">
          <Link 
            to="/admin" 
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors inline-flex items-center"
          >
            <FaCrown className="mr-2" /> Go to Admin Dashboard
          </Link>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
