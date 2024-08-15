// src/components/MakeAdmin.tsx
import React, { useState } from 'react';
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const MakeAdmin: React.FC = () => {
  const [uid, setUid] = useState(''); // סטייט לאחסון ה-UID של המשתמש
  const [message, setMessage] = useState(''); // סטייט לאחסון הודעות למשתמש

  // פונקציה להפיכת משתמש לאדמין
  const makeUserAdmin = async () => {
    const auth = getAuth(); // קבלת אובייקט האימות של Firebase
    const db = getFirestore(); // קבלת אובייקט בסיס הנתונים של Firebase

    if (!auth.currentUser) {
      setMessage('You must be logged in to perform this action.');
      return;
    }

    try {
      // בדיקת האם המשתמש הנוכחי הוא אדמין
      const currentUserDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
      const isCurrentUserAdmin = currentUserDoc.data()?.isAdmin;

      if (!isCurrentUserAdmin) {
        setMessage('You do not have permission to make users admin.');
        return;
      }

      // עדכון סטטוס האדמין של המשתמש המיועד
      const userRef = doc(db, 'users', uid);
      await updateDoc(userRef, {
        isAdmin: true
      });

      setMessage(`User ${uid} has been made an admin.`);
    } catch (error) {
      setMessage('An error occurred. Please try again.');
      console.error('Error making user admin:', error);
    }
  };

  return (
    <div>
      {/* שדה קלט לקבלת UID של המשתמש */}
      <input 
        type="text" 
        value={uid} 
        onChange={(e) => setUid(e.target.value)} 
        placeholder="Enter user UID"
      />
      {/* כפתור להפיכת המשתמש לאדמין */}
      <button onClick={makeUserAdmin}>Make Admin</button>
      {/* הצגת הודעה למשתמש */}
      {message && <p>{message}</p>}
    </div>
  );
};

export default MakeAdmin;
