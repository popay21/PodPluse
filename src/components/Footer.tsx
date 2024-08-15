import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaPhone } from 'react-icons/fa';

const Footer: React.FC = () => {
  return (
    // סקשן הפוטר עם רקע גרדיאנט
    <footer className="bg-gradient-to-r from-purple-600 to-indigo-800 text-white">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* סקשן טקסט עם תיאור קצר של האתר */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold">PodPulse</h3>
            <p className="text-gray-300">Discover, listen, and engage with your favorite podcasts.</p>
          </div>

          {/* סקשן עם קישורים מהירים */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-300 hover:text-white transition">Home</Link></li>
              <li><Link to="/podcasts" className="text-gray-300 hover:text-white transition">Podcasts</Link></li>
              <li><Link to="/favorites" className="text-gray-300 hover:text-white transition">Favorites</Link></li>
            </ul>
          </div>

          {/* סקשן עם קטגוריות */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Categories</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/podcasts?category=Technology" className="text-gray-300 hover:text-white transition">
                  Technology
                </Link>
              </li>
              <li>
                <Link to="/podcasts?category=Science" className="text-gray-300 hover:text-white transition">
                  Science
                </Link>
              </li>
              <li>
                <Link to="/podcasts?category=Business" className="text-gray-300 hover:text-white transition">
                  Business
                </Link>
              </li>
              <li>
                <Link to="/podcasts?category=Entertainment" className="text-gray-300 hover:text-white transition">
                  Entertainment
                </Link>
              </li>
            </ul>
          </div>

          {/* סקשן עם קישורים לרשתות חברתיות וטלפון */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Connect</h4>
            <ul className="space-y-2">
              <li>
                <a href="https://www.facebook.com/profile.php?id=100001076307477&locale=he_IL" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition flex items-center">
                  <FaFacebook className="mr-2" /> Facebook
                </a>
              </li>
              <li>
                <a href="https://x.com/shraga87" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition flex items-center">
                  <FaTwitter className="mr-2" /> Twitter
                </a>
              </li>
              <li>
                <a href="https://www.instagram.com/shraganatan/" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition flex items-center">
                  <FaInstagram className="mr-2" /> Instagram
                </a>
              </li>
              <li>
                <a href="tel:0525074008" className="text-gray-300 hover:text-white transition flex items-center">
                  <FaPhone className="mr-2" /> 052-5074008
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* שורת זכויות יוצרים בתחתית הפוטר */}
        <div className="mt-8 pt-8 border-t border-gray-700">
          <p className="text-center text-gray-300">&copy; 2024 PodPulse. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
