import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './App.css';

// Pages
import Home from './pages/Home';
import Cart from './pages/Cart';
import Orders from './pages/Orders';
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

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('access_token');
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('phone');
    setIsLoggedIn(false);
    window.location.href = '/';
  };

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

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
              <Link to="/cart" className="text-gray-700 hover:text-blue-600 font-semibold">
                Cart
              </Link>
              {isLoggedIn && (
                <>
                  <Link to="/orders" className="text-gray-700 hover:text-blue-600 font-semibold">
                    Orders
                  </Link>
                  <Link to="/profile" className="text-gray-700 hover:text-blue-600 font-semibold">
                    Profile
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
          <Route path="/orders" element={<Orders />} />
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
