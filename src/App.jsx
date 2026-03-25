import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './App.css';

// Pages
import Home from './pages/Home';
import Cart from './pages/Cart';
import Orders from './pages/Orders';
import Profile from './pages/Profile';

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
            <div className="flex gap-4 items-center">
              {isLoggedIn && (
                <>
                  <Link to="/cart" className="text-gray-700 hover:text-blue-600 font-semibold">
                    Cart
                  </Link>
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
