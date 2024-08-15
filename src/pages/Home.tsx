import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs, query, limit } from 'firebase/firestore';
import { db } from '../firebase';
import { Podcast } from '../types';

const Home: React.FC = () => {
  const [popularPodcasts, setPopularPodcasts] = useState<Podcast[]>([]); // סטייט לאחסון הפודקאסטים הפופולריים

  // שימוש ב-useEffect כדי להביא את הפודקאסטים כאשר הקומפוננטה נטענת
  useEffect(() => {
    const fetchPodcasts = async () => {
      try {
        const podcastsRef = collection(db, 'podcasts'); // הפניה לאוסף הפודקאסטים בבסיס הנתונים
        const q = query(podcastsRef, limit(10)); // שאילתה להבאת 10 פודקאסטים
        const querySnapshot = await getDocs(q);
        const fetchedPodcasts = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Podcast));
        
        // ערבול רשימת הפודקאסטים כדי לקבל פודקאסטים אקראיים
        const shuffled = fetchedPodcasts.sort(() => 0.5 - Math.random());
        setPopularPodcasts(shuffled.slice(0, 3)); // בחירת 3 הפודקאסטים הראשונים לאחר ערבול
      } catch (error) {
        console.error("Error fetching podcasts:", error);
      }
    };

    fetchPodcasts();
  }, []);

  return (
    <div className="space-y-12">
      {/* סקשן ראשי עם רקע גרדיאנט לקבלת פנים לאתר */}
      <div className="relative bg-indigo-800 text-white py-24 px-6 rounded-xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-800 opacity-75"></div>
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <h1 className="text-5xl font-extrabold mb-4">Welcome to PodPulse</h1>
          <p className="text-xl mb-8">Discover, listen, and engage with your favorite podcasts.</p>
          <Link to="/podcasts" className="bg-white text-indigo-800 px-6 py-3 rounded-full font-semibold hover:bg-indigo-100 transition duration-300">
            Explore Podcasts
          </Link>
        </div>
      </div>

      {/* סקשן להצגת הפודקאסטים הפופולריים */}
      <div>
        <h2 className="text-3xl font-bold mb-6 text-center">Popular Podcasts</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {popularPodcasts.map((podcast) => (
            <Link key={podcast.id} to={`/podcast/${podcast.id}`} className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-xl transition duration-300">
              {podcast.imageUrl ? (
                <img src={podcast.imageUrl} alt={podcast.title} className="h-48 w-full object-cover" />
              ) : (
                <div className="h-48 bg-gray-200 flex items-center justify-center text-gray-500">No Image</div>
              )}
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-2">{podcast.title}</h3>
                <p className="text-gray-600 line-clamp-2">{podcast.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* סקשן המפרט למה לבחור ב-PodPulse */}
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-6">Why Choose PodPulse?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="text-4xl mb-4">🎧</div>
            <h3 className="text-xl font-semibold mb-2">Wide Selection</h3>
            <p>Access thousands of podcasts across various genres.</p>
          </div>
          <div>
            <div className="text-4xl mb-4">💬</div>
            <h3 className="text-xl font-semibold mb-2">Engage</h3>
            <p>Comment, rate, and discuss your favorite episodes.</p>
          </div>
          <div>
            <div className="text-4xl mb-4">🚀</div>
            <h3 className="text-xl font-semibold mb-2">Discover</h3>
            <p>Find new podcasts tailored to your interests.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
