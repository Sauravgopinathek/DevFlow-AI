import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import GlowBackground from '../components/backgrounds/GlowBackground';

const Admin = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [pendingUsers, setPendingUsers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [accessDenied, setAccessDenied] = useState(false);
  const [activeTab, setActiveTab] = useState('pending');
  const [newUsername, setNewUsername] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchPendingUsers();
  }, [isAuthenticated, navigate]);

  const fetchPendingUsers = async () => {
    try {
      const response = await axios.get('/api/admin/pending');
      setPendingUsers(response.data.pendingUsers);
    } catch (error) {
      console.error('Error fetching pending users:', error);
      if (error.response?.status === 403) {
        setAccessDenied(true);
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchAllUsers = async () => {
    try {
      const response = await axios.get('/api/admin/users');
      setAllUsers(response.data.users);
    } catch (error) {
      console.error('Error fetching all users:', error);
    }
  };

  const handleApprove = async (userId) => {
    try {
      await axios.post(`/api/admin/approve/${userId}`);
      setMessage('User approved successfully! ✅');
      fetchPendingUsers();
      fetchAllUsers();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Error approving user ❌');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleReject = async (userId) => {
    try {
      await axios.post(`/api/admin/reject/${userId}`);
      setMessage('User rejected ❌');
      fetchPendingUsers();
      fetchAllUsers();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Error rejecting user ❌');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleAddToWhitelist = async (e) => {
    e.preventDefault();
    if (!newUsername.trim()) return;

    try {
      await axios.post('/api/admin/whitelist', { username: newUsername });
      setMessage(`Username ${newUsername} noted for whitelist! Add manually to passport.js ⚠️`);
      setNewUsername('');
      setTimeout(() => setMessage(''), 5000);
    } catch (error) {
      setMessage('Error adding to whitelist ❌');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleDeleteUser = async (userId, username) => {
    if (!window.confirm(`Are you sure you want to permanently delete the account for "${username}"? This action cannot be undone!`)) {
      return;
    }

    try {
      await axios.delete(`/api/admin/users/${userId}`);
      setMessage(`User ${username} deleted successfully ✅`);
      fetchPendingUsers();
      fetchAllUsers();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Error deleting user ❌');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleFollowUser = async (userId, username) => {
    try {
      await axios.post(`/api/admin/follow/${userId}`);
      setMessage(`Now following ${username} 👥`);
      fetchAllUsers();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Error following user ❌');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  if (loading) {
    return (
      <GlowBackground variant="aurora" intensity="low">
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-500"></div>
        </div>
      </GlowBackground>
    );
  }

  if (accessDenied) {
    return (
      <GlowBackground variant="aurora" intensity="low">
        <div className="min-h-screen flex items-center justify-center py-12 px-4">
          <div className="max-w-lg w-full text-center">
            <div className="bg-gradient-to-r from-red-100 to-pink-100 border-2 border-red-300 rounded-2xl p-8 shadow-xl">
              <div className="text-6xl mb-4">🚫</div>
              <h1 className="text-2xl font-bold text-red-800 mb-4">Access Denied</h1>
              <p className="text-red-700 mb-6">
                You don't have admin privileges to access this page.
              </p>
              <button
                onClick={() => navigate('/dashboard')}
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300"
              >
                Go to Dashboard
              </button>
            </div>
          </div>
        </div>
      </GlowBackground>
    );
  }

  return (
    <GlowBackground variant="aurora" intensity="low">
      <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold gradient-text-rainbow">
              🛡️ Admin Panel
            </h1>
            <p className="mt-4 text-xl text-purple-700 font-semibold">
              Manage user registrations for DevFlow
            </p>
          </div>

          {message && (
            <div className="mb-6 bg-gradient-to-r from-blue-100 to-cyan-100 border-2 border-blue-300 rounded-2xl p-4 text-center">
              <p className="text-blue-800 font-semibold">{message}</p>
            </div>
          )}

          {/* Tab Navigation */}
          <div className="mb-8">
            <div className="flex space-x-4 justify-center">
              <button
                onClick={() => {setActiveTab('pending'); fetchPendingUsers();}}
                className={`px-6 py-3 rounded-xl font-bold transition-all duration-300 ${
                  activeTab === 'pending'
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                📋 Pending ({pendingUsers.length})
              </button>
              <button
                onClick={() => {setActiveTab('all'); fetchAllUsers();}}
                className={`px-6 py-3 rounded-xl font-bold transition-all duration-300 ${
                  activeTab === 'all'
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                👥 All Users
              </button>
            </div>
          </div>



          {/* All Users Tab */}
          {activeTab === 'all' && (
            <div className="bg-white rounded-3xl shadow-2xl p-8 border-2 border-purple-200">
              <h2 className="text-2xl font-bold text-purple-800 mb-6 text-center">
                👥 All Users ({allUsers.length})
              </h2>
              {allUsers.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-6xl mb-4">👤</div>
                  <p className="text-gray-600 text-lg">No users found</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {allUsers.map((user) => (
                    <div key={user._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
                      <div className="flex items-center space-x-4">
                        <img 
                          src={user.avatarUrl} 
                          alt={user.username}
                          className="w-12 h-12 rounded-full"
                        />
                        <div>
                          <div className="font-bold text-gray-800">{user.displayName}</div>
                          <div className="text-sm text-gray-600">@{user.username}</div>
                          <div className="text-xs text-gray-500">{user.email}</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                          user.registrationStatus === 'approved' 
                            ? 'bg-green-100 text-green-800'
                            : user.registrationStatus === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {user.registrationStatus}
                        </div>
                        <button
                          onClick={() => handleFollowUser(user._id, user.username)}
                          className="bg-blue-500 text-white text-xs px-3 py-1 rounded-lg hover:bg-blue-600 transition-all duration-300"
                          title={`Follow ${user.username}`}
                        >
                          👥 Follow
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user._id, user.username)}
                          className="bg-red-500 text-white text-xs px-3 py-1 rounded-lg hover:bg-red-600 transition-all duration-300"
                          title={`Delete ${user.username}'s account`}
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Pending Users Tab */}
          {activeTab === 'pending' && (
            <div className="bg-white rounded-3xl shadow-2xl p-8 border-2 border-purple-200">
              <h2 className="text-2xl font-bold text-purple-800 mb-6 text-center">
                📋 Pending Registrations ({pendingUsers.length})
              </h2>

              {pendingUsers.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🎉</div>
                  <p className="text-xl text-gray-600">No pending registrations!</p>
                  <p className="text-gray-500 mt-2">All caught up! 👍</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pendingUsers.map((user) => (
                    <div key={user._id} className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200">
                      <div className="flex items-center space-x-4">
                        <img 
                          src={user.avatarUrl} 
                          alt={user.username}
                          className="w-12 h-12 rounded-full"
                        />
                        <div>
                          <div className="font-bold text-purple-800">{user.displayName}</div>
                          <div className="text-sm text-purple-600">@{user.username}</div>
                          <div className="text-xs text-gray-500">{new Date(user.registeredAt).toLocaleDateString()}</div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleApprove(user._id)}
                          className="px-4 py-2 bg-green-500 text-white font-bold rounded-lg hover:bg-green-600 transition-all duration-300"
                        >
                          ✅ Approve
                        </button>
                        <button
                          onClick={() => handleReject(user._id)}
                          className="px-4 py-2 bg-red-500 text-white font-bold rounded-lg hover:bg-red-600 transition-all duration-300"
                        >
                          ❌ Reject
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}


        </div>
      </div>
    </GlowBackground>
  );
};

export default Admin;