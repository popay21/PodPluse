import React, { useState, useEffect, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import { Podcast, CATEGORIES, PodcastCategory } from '../types';
import { FaSearch, FaSort } from 'react-icons/fa';

const PodcastList: React.FC = () => {
  const [podcasts, setPodcasts] = useState<Podcast[]>([]); // סטייט לאחסון רשימת הפודקאסטים
  const [searchTerm, setSearchTerm] = useState(''); // סטייט למחרוזת החיפוש
  const [selectedCategory, setSelectedCategory] = useState<PodcastCategory | ''>(''); // סטייט לקטגוריה שנבחרה
  const [sortBy, setSortBy] = useState<'date' | 'title'>('date'); // סטייט לסידור הפודקאסטים
  const [isLoading, setIsLoading] = useState(true); // סטייט לניהול מצב הטעינה
  const [error, setError] = useState<string | null>(null); // סטייט לאחסון הודעות שגיאה
  const location = useLocation(); // קבלת מיקום ה-URL הנוכחי

  // שימוש ב-useEffect כדי להביא את הפודקאסטים מהמסד נתונים כאשר הקומפוננטה נטענת
  useEffect(() => {
    const fetchPodcasts = async () => {
      try {
        setIsLoading(true);
        const podcastsCollection = collection(db, 'podcasts'); // הפניה לאוסף הפודקאסטים בבסיס הנתונים
        const podcastsQuery = query(podcastsCollection, orderBy(sortBy === 'date' ? 'createdAt' : 'title')); // שאילתה לסידור הפודקאסטים לפי תאריך או כותרת
        const podcastsSnapshot = await getDocs(podcastsQuery);
        const podcastsList = podcastsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Podcast));
        setPodcasts(podcastsList); // שמירת הפודקאסטים בסטייט
      } catch (error) {
        console.error("Error fetching podcasts:", error);
        setError("Failed to load podcasts. Please try again later."); // שמירת הודעת שגיאה בסטייט
      } finally {
        setIsLoading(false); // שינוי מצב הטעינה לסיום
      }
    };

    fetchPodcasts();
  }, [sortBy]);

  // שימוש ב-useEffect כדי לבדוק אם יש קטגוריה שנבחרה ב-URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const category = params.get('category') as PodcastCategory | null;
    if (category && CATEGORIES.includes(category)) {
      setSelectedCategory(category);
    }
  }, [location]);

  // שימוש ב-useMemo כדי לסנן את הפודקאסטים לפי חיפוש וקטגוריה שנבחרה
  const filteredPodcasts = useMemo(() => {
    return podcasts.filter(podcast =>
      (podcast.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      podcast.description.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (!selectedCategory || podcast.category === selectedCategory)
    );
  }, [searchTerm, selectedCategory, podcasts]);

  // פונקציה לעדכון החיפוש לפי מה שהמשתמש מקליד
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // פונקציה לעדכון הקטגוריה שנבחרה
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(e.target.value as PodcastCategory | '');
  };

  // פונקציה לשינוי סדר הפודקאסטים לפי תאריך או כותרת
  const handleSortChange = () => {
    setSortBy(prev => prev === 'date' ? 'title' : 'date');
  };

  // אם מצב הטעינה פעיל, הצגת מסך טעינה
  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-indigo-500"></div>
    </div>;
  }

  // אם יש שגיאה, הצגת הודעת שגיאה
  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>;
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-gradient-to-r from-purple-600 to-indigo-800 text-white py-12 px-6 rounded-xl shadow-lg">
        <h2 className="text-4xl font-bold mb-4 text-center">Discover Amazing Podcasts</h2>
        <p className="text-xl text-center mb-8">Find your next favorite show from our curated collection</p>
        <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Search podcasts..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="pl-10 pr-4 py-2 rounded-full text-gray-800 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
              aria-label="Search podcasts"
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          <select
            value={selectedCategory}
            onChange={handleCategoryChange}
            className="px-4 py-2 rounded-full text-gray-800 w-full sm:w-1/4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            aria-label="Select podcast category"
          >
            <option value="">All Categories</option>
            {CATEGORIES.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          <button
            onClick={handleSortChange}
            className="px-4 py-2 bg-white text-indigo-800 rounded-full flex items-center justify-center hover:bg-indigo-100 transition-colors duration-200"
            aria-label={`Sort by ${sortBy === 'date' ? 'title' : 'date'}`}
          >
            <FaSort className="mr-2" />
            Sort by {sortBy === 'date' ? 'Title' : 'Date'}
          </button>
        </div>
      </div>

      {/* תצוגת הפודקאסטים הממויינים והמסוננים */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredPodcasts.map((podcast) => (
          <Link key={podcast.id} to={`/podcast/${podcast.id}`} className="block group">
            <div className="bg-white shadow-lg rounded-xl overflow-hidden transition-all duration-300 group-hover:shadow-2xl group-hover:scale-105">
              {podcast.imageUrl ? (
                <img src={podcast.imageUrl} alt={podcast.title} className="h-48 w-full object-cover" />
              ) : (
                <div className="h-48 bg-gray-200 flex items-center justify-center text-gray-500">No Image</div>
              )}
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2 text-indigo-600 group-hover:text-indigo-800 transition-colors duration-200">{podcast.title}</h3>
                <p className="text-gray-600 mb-4 line-clamp-3">{podcast.description}</p>
                {podcast.category && (
                  <span className="inline-block bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm">
                    {podcast.category}
                  </span>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {filteredPodcasts.length === 0 && (
        <p className="text-center text-gray-500 mt-8 text-xl">No podcasts found. Try adjusting your search or category.</p>
      )}
    </div>
  );
};

export default PodcastList;

