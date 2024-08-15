// src/App.tsx

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import PodcastList from './pages/PodcastList';
import PodcastDetails from './pages/PodcastDetails';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import FavoritePodcasts from './pages/FavoritePodcasts';
import UserProfile from './pages/UserProfile';

const App: React.FC = () => {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-gray-100">
        <Header />
        <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="max-w-7xl mx-auto">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/podcasts" element={<PodcastList />} />
              <Route path="/podcast/:id" element={<PodcastDetails />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/favorites" element={<FavoritePodcasts />} />
              <Route path="/profile" element={<UserProfile />} />
            </Routes>
          </div>
        </main>
        <Footer />
      </div>
    </Router>
  );
};
export default App;
