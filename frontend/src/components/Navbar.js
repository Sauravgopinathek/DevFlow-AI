import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import DevFlowLogo from './DevFlowLogo';

const Navbar = () => {
  const { user, login, logout, isAuthenticated } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const profileDropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setIsProfileDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <nav className="bg-gray-900 sticky top-0 z-50 shadow-2xl border-b-2 border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-18">
          <div className="flex items-center">
            <Link to="/" className="flex items-center group">
              <div className="mr-4 transform group-hover:scale-110 transition-all duration-300">
                <DevFlowLogo size="lg" animated={true} variant="navbar" />
              </div>
              <span className="text-2xl font-bold text-white">DevFlow AI</span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className="text-white hover:text-gray-400 font-bold text-lg transition-all duration-300 relative group transform hover:scale-110"
                >
                  🚀 Dashboard
                  <span className="absolute -bottom-1 left-0 w-0 h-1 bg-gradient-to-r from-gray-600 to-gray-400 group-hover:w-full transition-all duration-300 rounded-full"></span>
                </Link>
                <div className="flex items-center space-x-4">
                  {/* Profile Dropdown */}
                  <div className="relative" ref={profileDropdownRef}>
                    <button
                      onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                      className="flex items-center space-x-3 bg-gray-700 rounded-full px-6 py-3 shadow-lg border-2 border-gray-600 hover:bg-gray-600 transition-all duration-300 transform hover:scale-105"
                    >
                      <img
                        src={user.avatarUrl}
                        alt={user.username}
                        className="w-10 h-10 rounded-full ring-4 ring-gray-500 shadow-lg"
                      />
                      <span className="text-white font-bold">{user.displayName}</span>
                      <svg
                        className={`w-4 h-4 text-gray-300 transition-transform duration-200 ${isProfileDropdownOpen ? 'rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {/* Dropdown Menu */}
                    {isProfileDropdownOpen && (
                      <div className="absolute right-0 mt-2 w-56 bg-gray-800 rounded-xl shadow-2xl border border-gray-700 py-2 z-50 animate-slide-up">
                        <Link
                          to="/profile"
                          onClick={() => setIsProfileDropdownOpen(false)}
                          className="flex items-center px-4 py-3 text-white hover:bg-gray-700 transition-all duration-200"
                        >
                          <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          👤 My Profile
                        </Link>
                        <Link
                          to="/settings"
                          onClick={() => setIsProfileDropdownOpen(false)}
                          className="flex items-center px-4 py-3 text-white hover:bg-gray-700 transition-all duration-200"
                        >
                          <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          ⚙️ Settings
                        </Link>
                        <hr className="my-2 border-gray-700" />
                        <button
                          onClick={() => {
                            window.location.href = `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/auth/switch-account`;
                            setIsProfileDropdownOpen(false);
                          }}
                          className="flex items-center w-full px-4 py-3 text-white hover:bg-gray-700 transition-all duration-200"
                        >
                          <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                          </svg>
                          🔄 Switch Account
                        </button>
                        <button
                          onClick={() => {
                            logout();
                            setIsProfileDropdownOpen(false);
                          }}
                          className="flex items-center w-full px-4 py-3 text-white hover:bg-gray-700 transition-all duration-200"
                        >
                          <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                          </svg>
                          🚪 Logout
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </>
            ) : null}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-300 hover:text-white focus:outline-none transform hover:scale-110 transition-all duration-300"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden py-6 animate-slide-up bg-gray-800 rounded-b-2xl border-t-2 border-gray-700">
            {isAuthenticated ? (
              <div className="space-y-6">
                <Link
                  to="/dashboard"
                  className="block text-white font-bold text-lg"
                  onClick={() => setIsMenuOpen(false)}
                >
                  🚀 Dashboard
                </Link>
                <div className="flex items-center space-x-3 py-3">
                  <img
                    src={user.avatarUrl}
                    alt={user.username}
                    className="w-10 h-10 rounded-full ring-4 ring-gray-500"
                  />
                  <span className="text-white font-bold">{user.displayName}</span>
                </div>
                <div className="space-y-2">
                  <Link
                    to="/profile"
                    onClick={() => setIsMenuOpen(false)}
                    className="block w-full bg-gray-600 hover:bg-gray-500 text-white font-bold px-4 py-2 rounded-xl text-center"
                  >
                    👤 My Profile
                  </Link>
                  <Link
                    to="/settings"
                    onClick={() => setIsMenuOpen(false)}
                    className="block w-full bg-gray-600 hover:bg-gray-500 text-white font-bold px-4 py-2 rounded-xl text-center"
                  >
                    ⚙️ Settings
                  </Link>
                  <button
                    onClick={() => {
                      window.location.href = `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/auth/switch-account`;
                      setIsMenuOpen(false);
                    }}
                    className="block w-full bg-gray-600 hover:bg-gray-500 text-white font-bold px-4 py-2 rounded-xl"
                  >
                    🔄 Switch Account
                  </button>
                  <button
                    onClick={() => {
                      logout();
                      setIsMenuOpen(false);
                    }}
                    className="block w-full bg-gray-600 hover:bg-gray-500 text-white font-bold px-4 py-2 rounded-xl"
                  >
                    🚪 Logout
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;