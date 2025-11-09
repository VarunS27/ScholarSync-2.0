import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiSearch, FiSun, FiMoon, FiMenu, FiX, FiUpload, 
  FiUser, FiLogOut, FiSettings, FiFileText, FiShield, FiHome, FiBook 
} from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [scrolled, setScrolled] = useState(false);

  // Check if we're on the landing page
  const isLandingPage = location.pathname === '/';

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setIsMenuOpen(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    setIsProfileOpen(false);
    navigate('/');
  };

  // Floating navbar for landing page
  if (isLandingPage && !user) {
    return (
      <nav className="fixed top-4 sm:top-6 left-4 right-4 sm:left-1/2 sm:-translate-x-1/2 sm:w-auto z-50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border border-gray-200 dark:border-gray-700 rounded-full px-4 sm:px-8 py-3 sm:py-4 shadow-xl">
        <div className="flex items-center justify-between sm:justify-start sm:space-x-8">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-blue-600 dark:bg-blue-500 rounded-lg flex items-center justify-center">
              <FiBook className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <span className="font-bold text-base sm:text-lg text-gray-900 dark:text-white">ScholarSync</span>
          </Link>
          <div className="hidden lg:flex items-center space-x-6 text-sm text-gray-700 dark:text-gray-300">
            <a href="#features" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Features</a>
            <a href="#how" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">How it Works</a>
            <a href="#community" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Community</a>
          </div>
          <Link
            to="/register"
            className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 px-4 sm:px-6 py-2 rounded-full text-xs sm:text-sm font-semibold transition-colors text-white"
          >
            Get Started
          </Link>
        </div>
      </nav>
    );
  }

  // Pill Bar navbar for other pages
  return (
    <nav className="fixed top-4 left-4 right-4 z-50">
      <div className={`max-w-6xl mx-auto transition-all duration-300 ${
        scrolled 
          ? 'bg-white dark:bg-gray-900 shadow-xl' 
          : 'bg-white/95 dark:bg-gray-900/95 shadow-lg'
      } backdrop-blur-xl rounded-full border border-gray-200 dark:border-gray-700`}>
        <div className="flex justify-between items-center h-14 sm:h-16 px-4 sm:px-6">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 sm:space-x-3 group shrink-0">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-600 dark:bg-blue-500 text-white rounded-xl flex items-center justify-center transform group-hover:scale-110 transition-transform">
              <FiBook className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <span className="hidden sm:block text-lg sm:text-xl font-black text-gray-900 dark:text-white">
              ScholarSync
            </span>
          </Link>

          {/* Search Bar - Desktop */}
          {user && location.pathname !== '/' && (
            <form onSubmit={handleSearch} className="hidden lg:flex flex-1 max-w-md mx-6">
              <div className="relative w-full">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search notes..."
                  className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder:text-gray-400"
                />
                <FiSearch className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
              </div>
            </form>
          )}

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-1 sm:space-x-2">
            {user ? (
              <>
                <Link
                  to="/notes"
                  className="px-3 sm:px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  Browse
                </Link>

                <Link
                  to="/upload"
                  className="px-3 sm:px-5 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white text-sm font-semibold rounded-full transition-colors flex items-center space-x-1 sm:space-x-2"
                >
                  <FiUpload className="w-4 h-4" />
                  <span>Upload</span>
                </Link>

                {isAdmin && (
                  <Link
                    to="/admin"
                    className="flex items-center space-x-2 px-3 sm:px-4 py-2 text-sm text-yellow-600 dark:text-yellow-400 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 font-semibold transition-colors rounded-full"
                  >
                    <FiShield className="w-4 h-4" />
                    <span className="hidden lg:inline">Admin</span>
                  </Link>
                )}

                <button
                  onClick={toggleTheme}
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  {theme === 'light' ? (
                    <FiMoon className="w-5 h-5 text-gray-700" />
                  ) : (
                    <FiSun className="w-5 h-5 text-gray-300" />
                  )}
                </button>

                {/* Profile Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    <div className="w-8 h-8 sm:w-9 sm:h-9 bg-blue-600 dark:bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                  </button>

                  <AnimatePresence>
                    {isProfileOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl py-2 border border-gray-200 dark:border-gray-700"
                      >
                        <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                          <p className="font-bold text-gray-900 dark:text-white truncate text-sm">{user.name}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
                        </div>
                        <Link
                          to="/profile"
                          onClick={() => setIsProfileOpen(false)}
                          className="flex items-center space-x-3 px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors text-sm"
                        >
                          <FiUser className="w-4 h-4" />
                          <span>Profile</span>
                        </Link>
                        <Link
                          to="/my-notes"
                          onClick={() => setIsProfileOpen(false)}
                          className="flex items-center space-x-3 px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors text-sm"
                        >
                          <FiFileText className="w-4 h-4" />
                          <span>My Notes</span>
                        </Link>
                        <Link
                          to="/settings"
                          onClick={() => setIsProfileOpen(false)}
                          className="flex items-center space-x-3 px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors text-sm"
                        >
                          <FiSettings className="w-4 h-4" />
                          <span>Settings</span>
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="flex items-center space-x-3 w-full px-4 py-2.5 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 transition-colors rounded-b-2xl text-sm"
                        >
                          <FiLogOut className="w-4 h-4" />
                          <span>Logout</span>
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/notes"
                  className="px-3 sm:px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  Browse
                </Link>
                <button
                  onClick={toggleTheme}
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  {theme === 'light' ? (
                    <FiMoon className="w-5 h-5 text-gray-700" />
                  ) : (
                    <FiSun className="w-5 h-5 text-gray-300" />
                  )}
                </button>
                <Link
                  to="/login"
                  className="px-3 sm:px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-semibold transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-3 sm:px-5 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white text-sm font-semibold rounded-full transition-colors"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            {isMenuOpen ? <FiX className="w-5 h-5" /> : <FiMenu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-gray-200 dark:border-gray-700"
            >
              <div className="px-4 py-4 space-y-2">
                {user && (
                  <form onSubmit={handleSearch} className="mb-3">
                    <div className="relative">
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search notes..."
                        className="w-full pl-10 pr-4 py-2.5 rounded-full border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <FiSearch className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
                    </div>
                  </form>
                )}

                {user ? (
                  <>
                    <Link
                      to="/notes"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center space-x-3 px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors text-sm"
                    >
                      <FiHome className="w-5 h-5" />
                      <span className="font-medium">Browse Notes</span>
                    </Link>
                    <Link
                      to="/upload"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center space-x-3 px-4 py-3 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-full font-semibold text-sm"
                    >
                      <FiUpload className="w-5 h-5" />
                      <span>Upload Note</span>
                    </Link>
                    <Link
                      to="/profile"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center space-x-3 px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors text-sm"
                    >
                      <FiUser className="w-5 h-5" />
                      <span className="font-medium">Profile</span>
                    </Link>
                    <Link
                      to="/my-notes"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center space-x-3 px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors text-sm"
                    >
                      <FiFileText className="w-5 h-5" />
                      <span className="font-medium">My Notes</span>
                    </Link>
                    <Link
                      to="/settings"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center space-x-3 px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors text-sm"
                    >
                      <FiSettings className="w-5 h-5" />
                      <span className="font-medium">Settings</span>
                    </Link>
                    {isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setIsMenuOpen(false)}
                        className="flex items-center space-x-3 px-4 py-3 text-yellow-600 dark:text-yellow-400 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 rounded-full font-semibold text-sm"
                      >
                        <FiShield className="w-5 h-5" />
                        <span>Admin Dashboard</span>
                      </Link>
                    )}
                    <button
                      onClick={() => { toggleTheme(); setIsMenuOpen(false); }}
                      className="flex items-center space-x-3 w-full px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors text-sm"
                    >
                      {theme === 'light' ? <FiMoon className="w-5 h-5" /> : <FiSun className="w-5 h-5" />}
                      <span className="font-medium">Toggle Theme</span>
                    </button>
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-3 w-full px-4 py-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full font-medium text-sm"
                    >
                      <FiLogOut className="w-5 h-5" />
                      <span>Logout</span>
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/notes"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center space-x-3 px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors text-sm"
                    >
                      <FiHome className="w-5 h-5" />
                      <span className="font-medium">Browse Notes</span>
                    </Link>
                    <button
                      onClick={() => { toggleTheme(); setIsMenuOpen(false); }}
                      className="flex items-center space-x-3 w-full px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors text-sm"
                    >
                      {theme === 'light' ? <FiMoon className="w-5 h-5" /> : <FiSun className="w-5 h-5" />}
                      <span className="font-medium">Toggle Theme</span>
                    </button>
                    <Link
                      to="/login"
                      onClick={() => setIsMenuOpen(false)}
                      className="block px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full text-center font-semibold text-sm"
                    >
                      Login
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setIsMenuOpen(false)}
                      className="block px-4 py-3 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-full text-center font-semibold text-sm"
                    >
                      Sign Up Free
                    </Link>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Navbar;