import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

const Profile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [editForm, setEditForm] = useState({
    displayName: '',
    email: '',
    bio: '',
    location: '',
    website: ''
  });

  useEffect(() => {
    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchProfile = async () => {
    try {
      setError(null);
      const response = await axios.get('/api/user/profile');
      setProfile(response.data);
      setEditForm({
        displayName: response.data.displayName || '',
        email: response.data.email || '',
        bio: response.data.bio || '',
        location: response.data.location || '',
        website: response.data.website || ''
      });
    } catch (error) {
      console.error('Failed to fetch profile:', error);
      setError('Failed to load profile. Using cached data from login.');
      
      // Fallback to user data from AuthContext if API fails
      if (user) {
        setProfile({
          ...user,
          bio: user.bio || '',
          location: user.location || '',
          website: user.website || ''
        });
        setEditForm({
          displayName: user.displayName || '',
          email: user.email || '',
          bio: user.bio || '',
          location: user.location || '',
          website: user.website || ''
        });
      } else {
        setMessage({ 
          type: 'error', 
          text: 'Failed to load profile. Please refresh the page.' 
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);
    
    try {
      const response = await axios.put('/api/user/profile', editForm);
      setProfile(response.data);
      setEditing(false);
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (error) {
      console.error('Failed to update profile:', error);
      setMessage({ type: 'error', text: 'Failed to update profile. Please try again.' });
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handleCancel = () => {
    setEditForm({
      displayName: profile?.displayName || '',
      email: profile?.email || '',
      bio: profile?.bio || '',
      location: profile?.location || '',
      website: profile?.website || ''
    });
    setEditing(false);
  };

  const handleDeleteProfile = async () => {
    setSaving(true);
    setMessage(null);
    
    try {
      const response = await axios.delete('/api/user/profile');
      setProfile(response.data.profile);
      setEditForm({
        displayName: response.data.profile.displayName || '',
        email: response.data.profile.email || '',
        bio: '',
        location: '',
        website: ''
      });
      setShowDeleteConfirm(false);
      setMessage({ type: 'success', text: 'Profile data cleared successfully!' });
    } catch (error) {
      console.error('Failed to delete profile:', error);
      setMessage({ type: 'error', text: 'Failed to clear profile data. Please try again.' });
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-themed-primary py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="card-themed animate-slide-up">
            <div className="flex flex-col items-center justify-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
              <span className="text-themed-secondary text-lg">Loading profile...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show error state with retry button if profile failed to load and no fallback data
  if (!profile && error) {
    return (
      <div className="min-h-screen bg-themed-primary py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="card-themed animate-slide-up">
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="text-6xl mb-4">⚠️</div>
              <h2 className="text-2xl font-bold text-themed-primary mb-2">
                Failed to Load Profile
              </h2>
              <p className="text-themed-secondary mb-6">
                {error || 'Unable to fetch your profile data. Please try again.'}
              </p>
              <button
                onClick={fetchProfile}
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold px-6 py-3 rounded-lg transition-all duration-300 transform hover:scale-105"
              >
                🔄 Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-themed-primary py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Error Banner */}
        {error && (
          <div className="mb-6 bg-yellow-500 bg-opacity-10 border border-yellow-500 rounded-lg px-4 py-3 animate-slide-up">
            <div className="flex items-start">
              <svg className="w-5 h-5 text-yellow-500 mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div className="flex-1">
                <p className="text-yellow-500 font-medium text-sm">
                  ⚠️ {error}
                </p>
                <button
                  onClick={fetchProfile}
                  className="text-yellow-400 hover:text-yellow-300 underline text-sm mt-1"
                >
                  Try reloading profile data
                </button>
              </div>
            </div>
          </div>
        )}
        
        <div className="card-themed animate-slide-up">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-themed-primary flex items-center">
              👤 My Profile
            </h1>
            {!editing ? (
              <div className="flex space-x-3">
                <button
                  onClick={() => setEditing(true)}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-bold px-6 py-3 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative flex items-center justify-center space-x-2">
                    <span>✏️ Edit Profile</span>
                  </div>
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="bg-red-500 hover:bg-red-600 text-white font-bold px-6 py-3 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative flex items-center justify-center space-x-2">
                    <span>🗑️ Clear Profile</span>
                  </div>
                </button>
              </div>
            ) : (
              <div className="flex space-x-3">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="bg-green-500 hover:bg-green-600 text-white font-bold px-6 py-3 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative flex items-center justify-center space-x-2">
                    <span>{saving ? 'Saving...' : '💾 Save'}</span>
                  </div>
                </button>
                <button
                  onClick={handleCancel}
                  className="bg-gradient-to-r from-gray-500 via-slate-500 to-gray-600 hover:from-gray-600 hover:via-slate-600 hover:to-gray-700 text-white font-bold px-6 py-3 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl relative overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative flex items-center justify-center space-x-2">
                    <span>❌ Cancel</span>
                  </div>
                </button>
              </div>
            )}
          </div>

          {message && (
            <div className={`mb-6 px-4 py-3 rounded-lg border-themed ${
              message.type === 'success' 
                ? 'bg-themed-primary text-green-600 border-green-500' 
                : 'bg-themed-primary text-red-600 border-red-500'
            }`}>
              {message.text}
            </div>
          )}

          <div className="grid md:grid-cols-3 gap-8">
            {/* Profile Picture & Basic Info */}
            <div className="md:col-span-1">
              <div className="text-center">
                <div className="relative inline-block">
                  <img 
                    src={user?.avatarUrl || profile?.avatarUrl} 
                    alt={user?.displayName || profile?.displayName}
                    className="w-32 h-32 rounded-full ring-8 ring-purple-300 shadow-2xl mx-auto"
                  />
                  <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-green-400 to-emerald-500 text-white rounded-full p-2 shadow-lg">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                
                <h2 className="text-2xl font-bold text-themed-primary mt-4">
                  {editing ? (
                    <input
                      type="text"
                      value={editForm.displayName}
                      onChange={(e) => setEditForm({...editForm, displayName: e.target.value})}
                      className="text-center bg-themed-primary text-themed-primary border-b-2 border-themed focus:border-accent-primary outline-none"
                      placeholder="Display Name"
                    />
                  ) : (
                    profile?.displayName || user?.displayName
                  )}
                </h2>
                
                <p className="text-themed-secondary mt-1">@{user?.username || profile?.username}</p>
                
                <div className="mt-4 space-y-2">
                  <div className="flex items-center justify-center text-themed-secondary">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    {editing ? (
                      <input
                        type="email"
                        value={editForm.email}
                        onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                        className="bg-themed-primary text-themed-primary border-b border-themed focus:border-accent-primary outline-none text-sm"
                        placeholder="Email"
                      />
                    ) : (
                      <span className="text-sm">{profile?.email || user?.email}</span>
                    )}
                  </div>
                  
                  {(editing || profile?.location) && (
                    <div className="flex items-center justify-center text-themed-secondary">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {editing ? (
                        <input
                          type="text"
                          value={editForm.location}
                          onChange={(e) => setEditForm({...editForm, location: e.target.value})}
                          className="bg-themed-primary text-themed-primary border-b border-themed focus:border-accent-primary outline-none text-sm"
                          placeholder="Location"
                        />
                      ) : (
                        <span className="text-sm">{profile?.location}</span>
                      )}
                    </div>
                  )}
                  
                  {(editing || profile?.website) && (
                    <div className="flex items-center justify-center text-themed-secondary">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                      </svg>
                      {editing ? (
                        <input
                          type="url"
                          value={editForm.website}
                          onChange={(e) => setEditForm({...editForm, website: e.target.value})}
                          className="bg-themed-primary text-themed-primary border-b border-themed focus:border-accent-primary outline-none text-sm"
                          placeholder="Website"
                        />
                      ) : (
                        <a href={profile?.website} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:text-blue-800">
                          {profile?.website}
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Profile Details */}
            <div className="md:col-span-2">
              <div className="space-y-6">
                {/* Bio Section */}
                <div className="bg-themed-primary rounded-xl p-6 border border-themed shadow-themed">
                  <h3 className="text-lg font-semibold text-themed-primary mb-3 flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    About Me
                  </h3>
                  {editing ? (
                    <textarea
                      value={editForm.bio}
                      onChange={(e) => setEditForm({...editForm, bio: e.target.value})}
                      className="w-full p-3 bg-themed-primary text-themed-primary border border-themed rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      rows="4"
                      placeholder="Tell us about yourself..."
                    />
                  ) : (
                    <p className="text-themed-secondary leading-relaxed">
                      {profile?.bio || "No bio added yet. Click 'Edit Profile' to add one!"}
                    </p>
                  )}
                </div>

                {/* Account Info */}
                <div className="bg-themed-primary rounded-xl p-6 border border-themed shadow-themed">
                  <h3 className="text-lg font-semibold text-themed-primary mb-4 flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Account Information
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-themed-secondary mb-1">Member Since</label>
                      <p className="text-themed-primary">
                        {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString() : 'N/A'}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-themed-secondary mb-1">Account Type</label>
                      <p className="text-themed-primary">Standard User</p>
                    </div>
                  </div>
                </div>

                {/* Connected Services */}
                {profile?.githubConnected && (
                  <div className="bg-themed-primary rounded-xl p-6 border border-themed shadow-themed">
                    <h3 className="text-lg font-semibold text-themed-primary mb-4 flex items-center">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                      </svg>
                      Connected Services
                    </h3>
                    <div className="grid gap-4">
                      <button
                        onClick={() => window.open(`https://github.com/${user?.username || profile?.username}`, '_blank')}
                        className="flex items-center space-x-3 p-4 rounded-lg bg-themed-primary border border-green-500 text-green-600 hover:bg-green-600 hover:text-white transition-all duration-200 cursor-pointer"
                      >
                        <div className="w-8 h-8 bg-gray-900 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-bold">GH</span>
                        </div>
                        <div className="flex-1 text-left">
                          <span className="text-sm font-medium block">GitHub Connected</span>
                          <span className="text-xs opacity-75">Click to view your GitHub profile</span>
                        </div>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-themed-primary rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl border border-themed">
              <h3 className="text-lg font-bold text-red-600 mb-4">🗑️ Clear Profile Data</h3>
              <p className="text-themed-primary mb-4">
                Are you sure you want to clear your profile data? This will remove your bio, location, and website information.
              </p>
              <p className="text-sm text-themed-secondary mb-6">
                Your account and basic information will remain intact.
              </p>
              <div className="flex space-x-4">
                <button
                  onClick={handleDeleteProfile}
                  disabled={saving}
                  className="bg-red-500 text-white font-bold px-6 py-3 rounded-xl hover:bg-red-600 transition-all duration-300 disabled:opacity-50"
                >
                  {saving ? 'Clearing...' : 'Yes, Clear Profile'}
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="bg-gray-500 text-white font-bold px-6 py-3 rounded-xl hover:bg-gray-600 transition-all duration-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;