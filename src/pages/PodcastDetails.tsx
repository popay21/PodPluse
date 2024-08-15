import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc, setDoc, deleteDoc } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Podcast } from '../types';
import Comments from '../components/Comments';
import { FaHeart, FaRegHeart } from 'react-icons/fa';

const PodcastDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // קבלת ה-ID של הפודקאסט מה-URL
  const [user] = useAuthState(auth); // סטייט למשתמש המחובר
  const [podcast, setPodcast] = useState<Podcast | null>(null); // סטייט לאחסון נתוני הפודקאסט
  const [isLoading, setIsLoading] = useState(true); // סטייט לניהול מצב הטעינה
  const [error, setError] = useState<string | null>(null); // סטייט לאחסון הודעות שגיאה
  const [isFavorite, setIsFavorite] = useState(false); // סטייט לבדיקה אם הפודקאסט במועדפים

  // שימוש ב-useEffect כדי להביא את נתוני הפודקאסט מהמסד נתונים
  useEffect(() => {
    const fetchPodcast = async () => {
      if (!id) {
        setError('No podcast ID provided');
        setIsLoading(false);
        return;
      }

      try {
        const podcastDoc = doc(db, 'podcasts', id); // הפניה למסמך הפודקאסט בבסיס הנתונים
        const podcastSnapshot = await getDoc(podcastDoc);
        if (podcastSnapshot.exists()) {
          setPodcast({ id: podcastSnapshot.id, ...podcastSnapshot.data() } as Podcast);
        } else {
          setError('Podcast not found');
        }
      } catch (err) {
        console.error('Error fetching podcast:', err);
        setError('Error fetching podcast');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPodcast();
  }, [id]);

  // שימוש ב-useEffect כדי לבדוק אם הפודקאסט נמצא במועדפים של המשתמש המחובר
  useEffect(() => {
    const checkFavoriteStatus = async () => {
      if (user && id) {
        const favoriteRef = doc(db, 'users', user.uid, 'favorites', id);
        const favoriteDoc = await getDoc(favoriteRef);
        setIsFavorite(favoriteDoc.exists());
      }
    };

    checkFavoriteStatus();
  }, [user, id]);

  // פונקציה להוספה או הסרה של הפודקאסט מהמועדפים
  const toggleFavorite = async () => {
    if (!user || !id) return;

    const favoriteRef = doc(db, 'users', user.uid, 'favorites', id);
    
    try {
      if (isFavorite) {
        await deleteDoc(favoriteRef); // הסרת הפודקאסט מהמועדפים
      } else {
        await setDoc(favoriteRef, { podcastId: id }); // הוספת הפודקאסט למועדפים
      }
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  // טיפול במצב טעינה
  if (isLoading) {
    return <div className="text-center py-20 text-2xl text-indigo-600">Loading podcast...</div>;
  }

  // טיפול במצב שגיאה
  if (error) {
    return <div className="text-red-500 text-center py-20 text-2xl">{error}</div>;
  }

  // טיפול במצב שבו אין פודקאסט מתאים
  if (!podcast || !id) {
    return <div className="text-center py-20 text-2xl text-gray-600">Podcast not found</div>;
  }

  return (
    <div className="bg-gray-100 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* תצוגה ראשית של פרטי הפודקאסט */}
        <div className="bg-white/70 backdrop-blur-md border border-white/20 rounded-xl overflow-hidden shadow-2xl">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 flex justify-between items-center">
            <h1 className="text-3xl font-bold">{podcast.title}</h1>
            {user && (
              <button 
                onClick={toggleFavorite}
                className="text-white hover:text-pink-200 transition-colors duration-200"
              >
                {isFavorite ? <FaHeart size={24} /> : <FaRegHeart size={24} />}
              </button>
            )}
          </div>
          {podcast.imageUrl && (
            <img src={podcast.imageUrl} alt={podcast.title} className="w-full h-72 object-cover" />
          )}
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <p className="text-gray-800 text-lg">{podcast.description}</p>
              {podcast.category && (
                <span className="inline-block bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm">
                  {podcast.category}
                </span>
              )}
            </div>
            {podcast.audioUrl && (
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-4 text-indigo-700">Listen to the Podcast</h3>
                <div className="bg-white/50 p-4 rounded-lg shadow-inner">
                  <audio 
                    controls 
                    className="w-full"
                  >
                    <source src={podcast.audioUrl} type="audio/mpeg" />
                    Your browser does not support the audio element.
                  </audio>
                </div>
              </div>
            )}
            {podcast.videoUrl && (
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-4 text-indigo-700">Watch the Video</h3>
                <div className="bg-white/50 p-4 rounded-lg shadow-inner">
                  <video controls className="w-full rounded">
                    <source src={podcast.videoUrl} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* סקשן התגובות */}
        <div className="mt-12 bg-white/70 backdrop-blur-md border border-white/20 rounded-xl overflow-hidden shadow-2xl">
          <div className="bg-indigo-700 text-white py-4 px-6">
            <h2 className="text-2xl font-bold">Comments</h2>
          </div>
          <div className="p-6">
            <Comments podcastId={id} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PodcastDetails;

