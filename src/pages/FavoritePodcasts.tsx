import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase';
import { Podcast } from '../types';
import { getFavoritePodcasts } from '../services/podcastService';

// קומפוננטה להצגת כרטיס פודקאסט
const PodcastCard: React.FC<{ podcast: Podcast }> = ({ podcast }) => (
  <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
    <div className="md:flex">
      <div className="md:flex-shrink-0">
        {podcast.imageUrl ? (
          <img className="h-48 w-full md:w-48 object-cover" src={podcast.imageUrl} alt={podcast.title} />
        ) : (
          <div className="h-48 w-full md:w-48 bg-indigo-500 flex items-center justify-center">
            <span className="text-4xl font-bold text-white">P</span>
          </div>
        )}
      </div>
      <div className="p-8">
        <Link to={`/podcast/${podcast.id}`} className="block mt-1 text-lg leading-tight font-medium text-black hover:underline">
          {podcast.title}
        </Link>
        <p className="mt-2 text-gray-500">{podcast.description}</p>
        {podcast.category && (
          <div className="mt-4 flex items-center">
            <span className="text-sm text-gray-600 bg-gray-200 px-2 py-1 rounded-full">
              {podcast.category}
            </span>
          </div>
        )}
      </div>
    </div>
  </div>
);

// קומפוננטה להצגת הפודקאסטים המועדפים של המשתמש
const FavoritePodcasts: React.FC = () => {
  const [user] = useAuthState(auth); // סטייט עבור המשתמש המחובר
  const [favorites, setFavorites] = useState<Podcast[]>([]); // סטייט לאחסון הפודקאסטים המועדפים
  const [isLoading, setIsLoading] = useState(true); // סטייט לניהול מצב הטעינה
  const [error, setError] = useState<string | null>(null); // סטייט לאחסון הודעות שגיאה

  // שימוש ב-useEffect כדי להביא את הפודקאסטים המועדפים כאשר המשתמש מחובר
  useEffect(() => {
    const fetchFavorites = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }
  
      try {
        setIsLoading(true);
        const favoritePodcasts = await getFavoritePodcasts(user.uid);
        setFavorites(favoritePodcasts);
        setError(null);
      } catch (err) {
        console.error('Error fetching favorite podcasts:', err);
        setError('Failed to load favorite podcasts. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchFavorites();
  }, [user]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error!</strong>
        <span className="block sm:inline"> {error}</span>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4" role="alert">
        <p className="font-bold">Alert</p>
        <p>Please log in to view your favorite podcasts.</p>
      </div>
    );
  }

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8">
      <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl mb-6">
        Your favorite podcasts
      </h2>
      {favorites.length === 0 ? (
        <p className="text-xl text-gray-500">You have not added any podcasts to your favorites yet.</p>
      ) : (
        <div className="grid gap-6 lg:grid-cols-1 xl:grid-cols-2">
          {favorites.map((podcast) => (
            <PodcastCard key={podcast.id} podcast={podcast} />
          ))}
        </div>
      )}
    </div>
  );
};

export default FavoritePodcasts;
