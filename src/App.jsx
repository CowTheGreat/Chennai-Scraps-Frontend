import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './App.css';

// Pages
import Home from './pages/Home';
import Cart from './pages/Cart';
import Profile from './pages/Profile';
import SellNow from './pages/SellNow';
import Resources from './pages/Resources';
import Faqs from './pages/Faqs';
import AboutUs from './pages/AboutUs';
import Services from './pages/Services';

// Components
import LoginModal from './components/LoginModal';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [profileDisplayName, setProfileDisplayName] = useState('');

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('access_token');
    setIsLoggedIn(!!token);
    setProfileDisplayName(localStorage.getItem('profile_display_name') || '');

    const onStorage = () => {
      setProfileDisplayName(localStorage.getItem('profile_display_name') || '');
    };

    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('phone');
    localStorage.removeItem('profile_display_name');
    setIsLoggedIn(false);
    window.location.href = '/';
  };

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setProfileDisplayName(localStorage.getItem('profile_display_name') || '');
  };

  const profileInitial = (profileDisplayName || 'U').trim().charAt(0).toUpperCase();

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        {/* Navbar */}
        <nav className="bg-white shadow-md">
          <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
            <Link to="/" className="text-2xl font-bold text-blue-600">
              Chennai-Scraps
            </Link>
            <div className="flex flex-wrap gap-4 items-center">
              <Link to="/" className="text-gray-700 hover:text-blue-600 font-semibold">
                Home
              </Link>
              <Link to="/sell-now" className="text-gray-700 hover:text-blue-600 font-semibold">
                Sell Now
              </Link>
              <Link to="/resources" className="text-gray-700 hover:text-blue-600 font-semibold">
                Resources
              </Link>
              <Link to="/faqs" className="text-gray-700 hover:text-blue-600 font-semibold">
                FAQs
              </Link>
              <Link to="/about-us" className="text-gray-700 hover:text-blue-600 font-semibold">
                About Us
              </Link>
              <Link to="/services" className="text-gray-700 hover:text-blue-600 font-semibold">
                Services
              </Link>

              <Link
                to="/cart"
                className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center text-gray-700 hover:text-blue-600 hover:border-blue-400"
                title="Cart"
                aria-label="Cart"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 4H5L7.5 15H18.5L21 7H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="9" cy="19" r="1.5" fill="currentColor"/>
                  <circle cx="18" cy="19" r="1.5" fill="currentColor"/>
                </svg>
              </Link>

              {isLoggedIn && (
                <>
                  <Link
                    to="/profile"
                    className="w-10 h-10 rounded-full bg-blue-600 text-white font-semibold flex items-center justify-center hover:bg-blue-700"
                    title="Profile"
                    aria-label="Profile"
                  >
                    {profileInitial}
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                  >
                    Logout
                  </button>
                </>
              )}
              {!isLoggedIn && (
                <button
                  onClick={() => setShowLoginModal(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  Login
                </button>
              )}
            </div>
          </div>
        </nav>

        {/* Routes */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/sell-now" element={<SellNow />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/faqs" element={<Faqs />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/services" element={<Services />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>

        {/* Login Modal */}
        <LoginModal
          isOpen={showLoginModal}
          onClose={() => setShowLoginModal(false)}
          onLoginSuccess={handleLoginSuccess}
        />
      </div>
    </Router>
  );
}

export default App;
