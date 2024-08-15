import React, { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useNavigate } from 'react-router-dom';
import { auth, storage } from '../firebase';
import { addPodcast, deletePodcast, getPodcasts, makeUserAdmin } from '../services';
import { checkAdminStatus } from '../utils';
import { PodcastCategory, Podcast } from '../types';
import { CATEGORIES } from '../types';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const AdminDashboard: React.FC = () => {
  const [user, loading] = useAuthState(auth); // סטייט עבור המשתמש המחובר וסטטוס הטעינה
  const [isAdminUser, setIsAdminUser] = useState(false); // סטייט לבדיקה אם המשתמש הוא אדמין
  const [podcasts, setPodcasts] = useState<Podcast[]>([]); // סטייט לאחסון רשימת הפודקאסטים
  const [newPodcastTitle, setNewPodcastTitle] = useState(''); // סטייט לכותרת הפודקאסט החדש
  const [newPodcastDescription, setNewPodcastDescription] = useState(''); // סטייט לתיאור הפודקאסט החדש
  const [newPodcastCategory, setNewPodcastCategory] = useState<PodcastCategory | ''>(''); // סטייט לקטגוריית הפודקאסט החדש
  const [newPodcastFile, setNewPodcastFile] = useState<File | null>(null); // סטייט עבור קובץ השמע של הפודקאסט החדש
  const [newPodcastImage, setNewPodcastImage] = useState<File | null>(null); // סטייט עבור תמונת הפודקאסט החדש
  const [newAdminUid, setNewAdminUid] = useState(''); // סטייט לאחסון UID של המשתמש החדש שיהפוך לאדמין
  const [message, setMessage] = useState(''); // סטייט לאחסון הודעות למשתמש
  const [isLoading, setIsLoading] = useState(false); // סטייט לניהול מצב הטעינה
  const navigate = useNavigate(); // כלי לניווט בין דפים

  // שימוש ב-useEffect כדי לבדוק האם המשתמש הנוכחי הוא אדמין
  useEffect(() => {
    const checkAdmin = async () => {
      if (user) {
        const adminStatus = await checkAdminStatus(user);
        setIsAdminUser(adminStatus);
        if (!adminStatus) {
          setMessage('Access denied. You must be an admin to view this page.');
          navigate('/');
        }
      }
    };
    checkAdmin();
  }, [user, navigate]);

  // שימוש ב-useEffect כדי להביא את הפודקאסטים במידה והמשתמש הוא אדמין
  useEffect(() => {
    if (isAdminUser) {
      fetchPodcasts();
    }
  }, [isAdminUser]);

  // פונקציה להבאת רשימת הפודקאסטים
  const fetchPodcasts = async () => {
    setIsLoading(true);
    try {
      const podcastsList = await getPodcasts();
      setPodcasts(podcastsList);
    } catch (error) {
      console.error('Error fetching podcasts:', error);
      setMessage('Error fetching podcasts. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // פונקציה להוספת פודקאסט חדש
  const handleAddPodcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdminUser) {
      setMessage('You do not have permission to add podcasts.');
      return;
    }
    if (!newPodcastTitle || !newPodcastDescription || !newPodcastCategory) {
      setMessage('Please fill in all required fields.');
      return;
    }
    setIsLoading(true);

    try {
      let audioUrl = '';
      let imageUrl = '';

      // העלאת קובץ השמע אם קיים
      if (newPodcastFile) {
        const audioRef = ref(storage, `podcasts/audio/${newPodcastFile.name}`);
        const audioSnapshot = await uploadBytes(audioRef, newPodcastFile);
        audioUrl = await getDownloadURL(audioSnapshot.ref);
      }

      // העלאת תמונת הפודקאסט אם קיימת
      if (newPodcastImage) {
        const imageRef = ref(storage, `podcasts/images/${newPodcastImage.name}`);
        const imageSnapshot = await uploadBytes(imageRef, newPodcastImage);
        imageUrl = await getDownloadURL(imageSnapshot.ref);
      }

      const newPodcast: Omit<Podcast, 'id' | 'createdAt'> = {
        title: newPodcastTitle,
        description: newPodcastDescription,
        category: newPodcastCategory,
        audioUrl,
        imageUrl,
        createdBy: user!.uid,
      };

      await addPodcast(newPodcast); // הוספת הפודקאסט החדש לבסיס הנתונים
      setNewPodcastTitle(''); // איפוס שדות הטופס
      setNewPodcastDescription('');
      setNewPodcastCategory('');
      setNewPodcastFile(null);
      setNewPodcastImage(null);
      fetchPodcasts(); // רענון רשימת הפודקאסטים
      setMessage('Podcast added successfully.');
    } catch (error) {
      console.error('Error adding podcast:', error);
      setMessage('Error adding podcast. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // פונקציה למחיקת פודקאסט
  const handleDeletePodcast = async (id: string) => {
    if (!isAdminUser) {
      setMessage('You do not have permission to delete podcasts.');
      return;
    }
    setIsLoading(true);
    try {
      await deletePodcast(id);
      fetchPodcasts(); // רענון רשימת הפודקאסטים לאחר מחיקה
      setMessage('Podcast deleted successfully.');
    } catch (error) {
      console.error('Error deleting podcast:', error);
      setMessage('Error deleting podcast. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // פונקציה להפיכת משתמש לאדמין
  const handleMakeAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdminUser) {
      setMessage('You do not have permission to make users admin.');
      return;
    }
    setIsLoading(true);
    try {
      await makeUserAdmin(newAdminUid);
      setNewAdminUid(''); // איפוס שדה ה-UID לאחר ההפיכה לאדמין
      setMessage(`User ${newAdminUid} has been made an admin.`);
    } catch (error) {
      console.error('Error making user admin:', error);
      setMessage('Error making user admin. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>; // הצגת הודעת טעינה בזמן שהנתונים נטענים
  if (!user || !isAdminUser) return <div>{message}</div>; // אם המשתמש לא מחובר או לא אדמין, הצגת הודעת שגיאה

  return (
    <div className="py-8">
      <h2 className="text-2xl font-bold mb-4">Admin Dashboard</h2>
      {isLoading && <div>Loading...</div>}
      {message && <div className="mb-4 text-red-500">{message}</div>}
      
      <form onSubmit={handleAddPodcast} className="mb-8">
        <h3 className="text-xl font-semibold mb-2">Add New Podcast</h3>
        <input
          type="text"
          value={newPodcastTitle}
          onChange={(e) => setNewPodcastTitle(e.target.value)}
          placeholder="Podcast Title"
          className="w-full p-2 mb-2 border rounded"
          required
        />
        <textarea
          value={newPodcastDescription}
          onChange={(e) => setNewPodcastDescription(e.target.value)}
          placeholder="Podcast Description"
          className="w-full p-2 mb-2 border rounded"
          required
        />
        <select
          value={newPodcastCategory}
          onChange={(e) => setNewPodcastCategory(e.target.value as PodcastCategory)}
          className="w-full p-2 mb-2 border rounded"
          required
        >
          <option value="">Select Category</option>
          {CATEGORIES.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
        <label className="block mb-2 text-sm font-medium text-gray-700">Upload Audio File</label>
        <input
          type="file"
          onChange={(e) => setNewPodcastFile(e.target.files ? e.target.files[0] : null)}
          accept="audio/mp3,video/mp4"
          className="w-full p-2 mb-2 border rounded"
        />
        <label className="block mb-2 text-sm font-medium text-gray-700">Upload Image File</label>
        <input
          type="file"
          onChange={(e) => setNewPodcastImage(e.target.files ? e.target.files[0] : null)}
          accept="image/*"
          className="w-full p-2 mb-2 border rounded"
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Add Podcast</button>
      </form>

      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-2">Podcast List</h3>
        {podcasts.map(podcast => (
          <div key={podcast.id} className="mb-2 p-2 border rounded flex justify-between items-center">
            <span>{podcast.title}</span>
            <button onClick={() => handleDeletePodcast(podcast.id)} className="bg-red-500 text-white px-2 py-1 rounded">Delete</button>
          </div>
        ))}
      </div>

      <form onSubmit={handleMakeAdmin}>
        <h3 className="text-xl font-semibold mb-2">Make User Admin</h3>
        <input
          type="text"
          value={newAdminUid}
          onChange={(e) => setNewAdminUid(e.target.value)}
          placeholder="User UID"
          className="w-full p-2 mb-2 border rounded"
        />
        <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">Make Admin</button>
      </form>
    </div>
  );
};

export default AdminDashboard;
