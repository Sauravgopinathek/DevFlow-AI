import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import DevFlowLogo from './DevFlowLogo';
import axios from 'axios';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [profileStats, setProfileStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(false);
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

  // Fetch profile stats when dropdown opens
  const handleDropdownToggle = async () => {
    const newState = !isProfileDropdownOpen;
    setIsProfileDropdownOpen(newState);
    
    if (newState && !profileStats && !statsLoading) {
      setStatsLoading(true);
      try {
        const response = await axios.get('/api/github/profile-stats');
        setProfileStats(response.data);
      } catch (error) {
        console.error('Failed to fetch profile stats:', error);
      } finally {
        setStatsLoading(false);
      }
    }
  };

  // Format time ago
  const timeAgo = (date) => {
    if (!date) return 'recently';
    
    const now = new Date();
    const past = new Date(date);
    
    // Check if date is valid
    if (isNaN(past.getTime())) return 'recently';
    
    const seconds = Math.floor((now - past) / 1000);
    
    // Ensure seconds is positive
    if (seconds < 0) return 'just now';
    
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + 'y ago';
    
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + 'mo ago';
    
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + 'd ago';
    
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + 'h ago';
    
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + 'm ago';
    
    return seconds < 10 ? 'just now' : Math.floor(seconds) + 's ago';
  };

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
                      onClick={handleDropdownToggle}
                      className="flex items-center space-x-3 bg-gray-700 rounded-full px-6 py-3 shadow-lg border-2 border-gray-600 hover:bg-gray-600 transition-all duration-300 transform hover:scale-105"
                    >
                      <img
                        src={user?.avatarUrl || 'https://via.placeholder.com/40'}
                        alt={user?.username || 'User'}
                        className="w-10 h-10 rounded-full ring-4 ring-gray-500 shadow-lg"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://via.placeholder.com/40?text=User';
                        }}
                      />
                      <span className="text-white font-bold">{user?.displayName || user?.username || 'User'}</span>
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
                      <div className="absolute right-0 mt-2 w-80 bg-gradient-to-br from-purple-600 via-pink-500 to-blue-600 rounded-2xl shadow-2xl border border-gray-700 z-50 animate-slide-up overflow-hidden">
                        {/* Profile Header */}
                        <div className="p-5 text-center bg-white bg-opacity-10 backdrop-blur-md">
                          <img
                            src={user?.avatarUrl || 'https://via.placeholder.com/80'}
                            alt={user?.username || 'User'}
                            className="w-20 h-20 rounded-full mx-auto mb-3 ring-4 ring-white shadow-lg"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = 'https://via.placeholder.com/80?text=User';
                            }}
                          />
                          <h3 className="text-white font-bold text-lg">{user?.displayName || user?.username || 'User'}</h3>
                          <p className="text-white text-opacity-90 text-sm">@{user?.username || 'user'}</p>
                          {user?.email && (
                            <p className="text-white text-opacity-80 text-xs mt-1">{user.email}</p>
                          )}
                        </div>

                        {/* Quick Stats */}
                        {statsLoading ? (
                          <div className="p-4 bg-white bg-opacity-5">
                            <div className="flex justify-center items-center py-4">
                              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                              <span className="ml-2 text-white text-sm">Loading stats...</span>
                            </div>
                          </div>
                        ) : profileStats ? (
                          <div className="p-4 bg-white bg-opacity-5 border-t border-b border-white border-opacity-10">
                            <div className="grid grid-cols-3 gap-3">
                              <div className="text-center">
                                <div className="text-2xl font-bold text-white">{profileStats.repos}</div>
                                <div className="text-xs text-white text-opacity-70">Repositories</div>
                              </div>
                              <div className="text-center">
                                <div className="text-2xl font-bold text-white">{profileStats.stars}</div>
                                <div className="text-xs text-white text-opacity-70">Stars</div>
                              </div>
                              <div className="text-center">
                                <div className="text-2xl font-bold text-white">{profileStats.followers}</div>
                                <div className="text-xs text-white text-opacity-70">Followers</div>
                              </div>
                            </div>
                          </div>
                        ) : null}

                        {/* Recent Activity */}
                        {profileStats && profileStats.recentActivity && profileStats.recentActivity.length > 0 && (
                          <div className="p-4 bg-white bg-opacity-5 border-b border-white border-opacity-10">
                            <h4 className="text-white text-sm font-semibold mb-2">Recent Activity</h4>
                            <div className="space-y-2">
                              {profileStats.recentActivity.map((activity, index) => (
                                <div key={index} className="flex items-start space-x-2 text-xs">
                                  <span className="text-base">{activity.icon}</span>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-white text-opacity-90 truncate">{activity.description}</p>
                                    <p className="text-white text-opacity-60">{timeAgo(activity.created_at)}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Navigation Links */}
                        <div className="py-2">
                          <Link
                            to="/profile"
                            onClick={() => setIsProfileDropdownOpen(false)}
                            className="flex items-center px-4 py-3 text-white hover:bg-white hover:bg-opacity-10 transition-all duration-200"
                          >
                            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            👤 View Full Profile
                          </Link>
                          <Link
                            to="/dashboard"
                            onClick={() => setIsProfileDropdownOpen(false)}
                            className="flex items-center px-4 py-3 text-white hover:bg-white hover:bg-opacity-10 transition-all duration-200"
                          >
                            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                            </svg>
                            🚀 Dashboard
                          </Link>
                          <Link
                            to="/settings"
                            onClick={() => setIsProfileDropdownOpen(false)}
                            className="flex items-center px-4 py-3 text-white hover:bg-white hover:bg-opacity-10 transition-all duration-200"
                          >
                            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            ⚙️ Settings
                          </Link>
                          <Link
                            to="/analytics"
                            onClick={() => setIsProfileDropdownOpen(false)}
                            className="flex items-center px-4 py-3 text-white hover:bg-white hover:bg-opacity-10 transition-all duration-200"
                          >
                            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                            📊 Analytics
                          </Link>
                        </div>

                        {/* Logout Button */}
                        <div className="p-2 bg-white bg-opacity-5 border-t border-white border-opacity-10">
                          <button
                            onClick={() => {
                              logout();
                              setIsProfileDropdownOpen(false);
                            }}
                            className="flex items-center w-full px-4 py-3 text-white hover:bg-white hover:bg-opacity-10 transition-all duration-200 rounded-lg"
                          >
                            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            🚪 Logout
                          </button>
                        </div>
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
                    src={user?.avatarUrl || 'https://via.placeholder.com/40'}
                    alt={user?.username || 'User'}
                    className="w-10 h-10 rounded-full ring-4 ring-gray-500"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://via.placeholder.com/40?text=User';
                    }}
                  />
                  <span className="text-white font-bold">{user?.displayName || user?.username || 'User'}</span>
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