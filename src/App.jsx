import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './App.css';

// Pages
import Home from './pages/Home';
import Cart from './pages/Cart';
import Profile from './pages/Profile';
import SellNow from './pages/SellNow';
import SellUsedAppliances from './pages/SellUsedAppliances';
import SellCategory from './pages/SellCategory';
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

  useEffect(() => {
    const onOpenLogin = () => setShowLoginModal(true);
    window.addEventListener('open-login-modal', onOpenLogin);
    return () => window.removeEventListener('open-login-modal', onOpenLogin);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('phone');
    localStorage.removeItem('profile_display_name');
    setIsLoggedIn(false);
    setIsMobileMenuOpen(false);
    window.location.href = '/';
  };

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setProfileDisplayName(localStorage.getItem('profile_display_name') || '');
    setIsMobileMenuOpen(false);
  };

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  const profileInitial = (profileDisplayName || 'U').trim().charAt(0).toUpperCase();

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        {/* Navbar */}
        <nav className="bg-white shadow-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 md:flex md:justify-between md:items-center md:gap-6">
            <div className="flex justify-between items-center">
            <Link to="/" className="flex items-center gap-3 text-2xl font-bold text-blue-600">
              <img
                src="/logo.png"
                alt="Chennai Scraps logo"
                className="w-10 h-10 object-contain"
              />
              <span className="text-lg sm:text-2xl">Chennai Scraps</span>
            </Link>

            <button
              type="button"
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
              className="md:hidden w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center text-gray-700"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              ) : (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 7H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M4 12H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M4 17H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              )}
            </button>
            </div>

            <div className={`${isMobileMenuOpen ? 'flex' : 'hidden'} md:flex flex-col md:flex-row gap-3 lg:gap-4 items-start md:items-center mt-4 md:mt-0`}>
              <Link to="/" onClick={closeMobileMenu} className="text-gray-700 hover:text-blue-600 font-semibold">
                Home
              </Link>
              <Link to="/sell-now" onClick={closeMobileMenu} className="text-gray-700 hover:text-blue-600 font-semibold">
                Sell Now
              </Link>
              <Link to="/resources" onClick={closeMobileMenu} className="text-gray-700 hover:text-blue-600 font-semibold">
                Resources
              </Link>
              <Link to="/faqs" onClick={closeMobileMenu} className="text-gray-700 hover:text-blue-600 font-semibold">
                FAQs
              </Link>
              <Link to="/about-us" onClick={closeMobileMenu} className="text-gray-700 hover:text-blue-600 font-semibold">
                About Us
              </Link>
              <Link to="/services" onClick={closeMobileMenu} className="text-gray-700 hover:text-blue-600 font-semibold">
                Services
              </Link>

              <Link
                to="/cart"
                onClick={closeMobileMenu}
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
                    onClick={closeMobileMenu}
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
                  onClick={() => {
                    setShowLoginModal(true);
                    setIsMobileMenuOpen(false);
                  }}
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
          <Route path="/sell-used-appliances" element={<SellUsedAppliances />} />
          <Route path="/sell-used-appliances/:slug" element={<SellCategory />} />
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
