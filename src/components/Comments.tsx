import React, { useState, useEffect } from 'react';
import { collection, addDoc, query, where, onSnapshot, Timestamp, orderBy, updateDoc, doc } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { FaStar, FaThumbsUp, FaSort } from 'react-icons/fa';

// Define the Comment interface to represent the structure of a comment object
interface Comment {
  id: string;
  text: string;
  userId: string;
  userName: string;
  createdAt: Timestamp;
  rating: number;
  likes: number;
}

// Define the CommentsProps interface to specify the expected props
interface CommentsProps {
  podcastId: string;
}

const Comments: React.FC<CommentsProps> = ({ podcastId }) => {
  const [user] = useAuthState(auth); // Connect to the authenticated user via Firebase
  const [comments, setComments] = useState<Comment[]>([]); // Manage the state of comments
  const [newComment, setNewComment] = useState(''); // State for the new comment
  const [rating, setRating] = useState(0); // State for the comment rating
  const [hoveredRating, setHoveredRating] = useState(0); // State for hovered rating (when hovering)
  const [sortBy, setSortBy] = useState<'date' | 'rating'>('date'); // State for the comments sorting method

  // Use useEffect to listen for changes in the database and fetch the comments
  useEffect(() => {
    const q = query(
      collection(db, 'comments'), // Query to collect comments from the database
      where('podcastId', '==', podcastId), // Filter comments by podcast ID
      orderBy(sortBy === 'date' ? 'createdAt' : 'rating', 'desc') // Sort comments by date or rating
    );
    const unsubscribe = onSnapshot(q, (querySnapshot) => { // Listen for real-time changes
      const fetchedComments: Comment[] = [];
      querySnapshot.forEach((doc) => {
        fetchedComments.push({ id: doc.id, ...doc.data() } as Comment);
      });
      setComments(fetchedComments); // Update the state of comments
    });

    return () => unsubscribe(); // Unsubscribe from the listener when the component is unmounted
  }, [podcastId, sortBy]);

  // Function to handle the submission of a new comment
  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert('You must be logged in to add a comment');
      return;
    }
    if (newComment.trim() === '') return;

    try {
      await addDoc(collection(db, 'comments'), {
        text: newComment,
        userId: user.uid,
        userName: user.displayName || 'Anonymous',
        podcastId,
        createdAt: Timestamp.now(),
        rating,
        likes: 0
      });
      setNewComment(''); // Reset the comment text field
      setRating(0); // Reset the rating
    } catch (error) {
      console.error('Error adding comment: ', error);
    }
  };

  // Function to handle the like button click
  const handleLike = async (commentId: string) => {
    if (!user) {
      alert('You must be logged in to like a comment');
      return;
    }
    const commentRef = doc(db, 'comments', commentId);
    await updateDoc(commentRef, {
      likes: (comments.find(c => c.id === commentId)?.likes || 0) + 1
    });
  };

  // Calculate the average rating based on the comments
  const averageRating = comments.length > 0
    ? comments.reduce((acc, comment) => acc + comment.rating, 0) / comments.length
    : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-2xl font-bold">{averageRating.toFixed(1)}</span>
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <FaStar
                key={star}
                className={`${averageRating >= star ? 'text-yellow-400' : 'text-gray-300'}`}
                size={20}
              />
            ))}
          </div>
          <span className="text-sm text-gray-500">({comments.length} reviews)</span>
        </div>
        <button
          onClick={() => setSortBy(sortBy === 'date' ? 'rating' : 'date')}
          className="flex items-center space-x-1 text-indigo-600 hover:text-indigo-800"
        >
          <FaSort />
          <span>Sort by {sortBy === 'date' ? 'Rating' : 'Date'}</span>
        </button>
      </div>

      <form onSubmit={handleSubmitComment} className="space-y-4">
        <div className="flex items-center space-x-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <FaStar
              key={star}
              className={`cursor-pointer transition-colors duration-200 ${
                (hoveredRating || rating) >= star ? 'text-yellow-400' : 'text-gray-300'
              }`}
              size={24}
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoveredRating(star)}
              onMouseLeave={() => setHoveredRating(0)}
            />
          ))}
        </div>
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Write your review..."
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          rows={4}
        />
        <button
          type="submit"
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition duration-200"
        >
          Submit Review
        </button>
      </form>

      <div className="space-y-4">
        {comments.map((comment) => (
          <div key={comment.id} className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold">{comment.userName}</span>
              <div className="flex items-center space-x-2">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <FaStar
                      key={star}
                      className={`${comment.rating >= star ? 'text-yellow-400' : 'text-gray-300'}`}
                      size={16}
                    />
                  ))}
                </div>
                <button
                  onClick={() => handleLike(comment.id)}
                  className="flex items-center space-x-1 text-gray-500 hover:text-indigo-600"
                >
                  <FaThumbsUp size={14} />
                  <span>{comment.likes}</span>
                </button>
              </div>
            </div>
            <p className="text-gray-700">{comment.text}</p>
            <span className="text-sm text-gray-500">
              {comment.createdAt.toDate().toLocaleDateString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Comments;

