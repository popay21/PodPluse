import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../services/authService';
import ReusableForm from '../components/ReusableForm';
import { FaFacebook, FaTwitter, FaGithub } from 'react-icons/fa';

const Login: React.FC = () => {
  const [error, setError] = useState<string | null>(null); // סטייט לניהול הודעות שגיאה
  const navigate = useNavigate(); // כלי לניווט בין דפים

  // פונקציה לטיפול בהגשת הטופס
  const handleSubmit = async (formData: Record<string, string>) => {
    try {
      await login(formData.email, formData.password); // ניסיון כניסה עם המידע מהטופס
      navigate('/'); // ניווט לדף הבית לאחר הצלחה
    } catch (error) {
      setError('Failed to log in. Please check your credentials.'); // הודעת שגיאה במקרה של כישלון
    }
  };

  // הגדרת השדות עבור הטופס
  const fields = [
    { name: 'email', type: 'email', label: 'Email' },
    { name: 'password', type: 'password', label: 'Password' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-600/90 to-indigo-800/90 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white/25 backdrop-blur-md border border-white/20 p-10 rounded-xl shadow-2xl glass-card">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-white">Log in to your account</h2>
        </div>
        {error && (
          // הודעת שגיאה במידה ויש
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">
            <p>{error}</p>
          </div>
        )}
        {/* קומפוננטת הטופס המותאם לשימוש חוזר */}
        <ReusableForm
          fields={fields}
          onSubmit={handleSubmit}
          submitButtonText="Sign In"
          buttonClasses="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out transform active:scale-98"
          inputClasses="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm transition-all duration-300 ease-in-out"
        />
        <div className="flex items-center justify-between mt-4">
          <div className="text-sm">
            {/* קישור לדף שכחת סיסמה */}
            <Link to="/forgot-password" className="font-medium text-indigo-200 hover:text-white transition duration-150 ease-in-out">
              Forgot your password?
            </Link>
          </div>
          <div className="text-sm">
            {/* קישור לדף הרשמה */}
            <Link to="/register" className="font-medium text-indigo-200 hover:text-white transition duration-150 ease-in-out">
              Don't have an account? Sign up
            </Link>
          </div>
        </div>
        <div className="relative mt-8 flex items-center justify-center">
          <div className="absolute inset-0 flex items-center" aria-hidden="true">
            <div className="w-full border-t border-gray-300/30"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white/30 text-white rounded-full backdrop-blur-sm z-10">
              Or continue with
            </span>
          </div>
        </div>
        {/* כפתורי כניסה דרך פלטפורמות צד שלישי */}
        <div className="mt-6 grid grid-cols-3 gap-3">
          {[
            { name: 'Facebook', icon: FaFacebook, color: 'hover:bg-blue-600' },
            { name: 'Twitter', icon: FaTwitter, color: 'hover:bg-blue-400' },
            { name: 'GitHub', icon: FaGithub, color: 'hover:bg-gray-800' }
          ].map((provider) => (
            <button
              key={provider.name}
              className={`w-full inline-flex justify-center py-2 px-4 border border-white/20 rounded-md shadow-sm bg-white/20 text-sm font-medium text-white ${provider.color} transition duration-150 ease-in-out transform hover:scale-105`}
            >
              <span className="sr-only">Sign in with {provider.name}</span>
              <provider.icon className="w-5 h-5" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Login;
