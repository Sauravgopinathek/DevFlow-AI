import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

const UserSettings = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      push: false
    }
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [deleteChecks, setDeleteChecks] = useState({
    permanent: false,
    dataDeleted: false,
    repoAccess: false,
    dataDownloaded: false,
    proceed: false
  });
  const [showFinalModal, setShowFinalModal] = useState(false);

  useEffect(() => {
    fetchSettings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchSettings = async () => {
    try {
      console.log('🔄 Fetching settings...');
      const response = await axios.get('/api/user/settings');
      console.log('✅ Settings response:', response.data);
      
      if (response.data.settings) {
        console.log('📝 Updating settings state:', response.data.settings);
        const newSettings = {
          ...settings,
          ...response.data.settings
        };
        setSettings(newSettings);
      }
    } catch (error) {
      console.error('❌ Failed to fetch settings:', error);
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    // Check if user exists
    if (!user || !user.username) {
      setMessage({ type: 'error', text: 'User information not available' });
      setTimeout(() => setMessage(null), 3000);
      return;
    }
    
    // Check if username matches
    if (deleteConfirmText !== user.username) {
      setMessage({ type: 'error', text: 'Please type your username correctly to confirm deletion' });
      setTimeout(() => setMessage(null), 3000);
      return;
    }

    // Check if all checkboxes are checked
    const allChecked = Object.values(deleteChecks).every(val => val === true);
    if (!allChecked) {
      setMessage({ type: 'error', text: 'Please confirm all checkboxes before proceeding' });
      setTimeout(() => setMessage(null), 3000);
      return;
    }

    // Show final confirmation modal
    setShowFinalModal(true);
  };

  const confirmFinalDeletion = async () => {
    setSaving(true);
    try {
      await axios.delete('/api/user/account');
      setMessage({ type: 'success', text: 'Account deleted successfully. Redirecting...' });
      
      // Clear local storage
      localStorage.clear();
      sessionStorage.clear();
      
      // Logout and redirect after a short delay
      setTimeout(() => {
        logout();
        navigate('/');
      }, 2000);
    } catch (error) {
      setMessage({ type: 'error', text: 'Error deleting account' });
      setTimeout(() => setMessage(null), 3000);
      setSaving(false);
      setShowFinalModal(false);
    }
  };

  const downloadUserData = () => {
    if (!user) {
      setMessage({ type: 'error', text: 'User data not available' });
      setTimeout(() => setMessage(null), 3000);
      return;
    }
    
    const userData = {
      profile: {
        username: user.username,
        displayName: user.displayName,
        email: user.email,
        avatarUrl: user.avatarUrl
      },
      settings: settings,
      exportedAt: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(userData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `devflow-data-${user.username}-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    setMessage({ type: 'success', text: 'Your data has been downloaded!' });
    setTimeout(() => setMessage(null), 3000);
  };

  if (loading) {
    return (
      <div className="card-colorful animate-slide-up">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          <span className="ml-3 text-gray-600">Loading settings...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="card-themed rounded-2xl shadow-2xl p-8 animate-slide-up">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-themed-primary flex items-center">
            ⚙️ Settings
          </h3>

        </div>

        {message && (
          <div className={`mb-4 px-4 py-3 rounded-lg ${
            message.type === 'success' 
              ? 'bg-green-100 border border-green-400 text-green-700' 
              : 'bg-red-100 border border-red-400 text-red-700'
          }`}>
            {message.text}
          </div>
        )}

        {/* Danger Zone - Account Deletion */}
        <div className="space-y-6">
          <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6">
            <h3 className="text-xl font-bold text-red-800 mb-4 flex items-center">
              <span className="text-3xl mr-2">⚠️</span> Delete Account
            </h3>
            
            <div className="mb-6">
              <p className="text-red-700 mb-4 font-semibold">
                <strong>Warning:</strong> This action is PERMANENT and IRREVERSIBLE!
              </p>
              <p className="text-red-600 text-sm mb-3">
                The following data will be permanently deleted:
              </p>
              <ul className="text-red-600 text-sm mb-6 list-none space-y-2">
                <li className="flex items-start">
                  <span className="mr-2">🔗</span>
                  <span>Your GitHub account connection</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">📦</span>
                  <span>All repository data and access</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">👤</span>
                  <span>Profile information and settings</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">📊</span>
                  <span>All activity history</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">📈</span>
                  <span>Analytics data (if any)</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">⚙️</span>
                  <span>Saved preferences</span>
                </li>
              </ul>

              {/* Download Data Button */}
              <button
                onClick={downloadUserData}
                className="w-full bg-blue-600 text-white font-bold px-6 py-3 rounded-xl hover:bg-blue-700 transition-all duration-300 mb-4"
              >
                📥 Download My Data (Optional)
              </button>
            </div>
            
            {!showDeleteConfirm ? (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="bg-red-500 text-white font-bold px-6 py-3 rounded-xl hover:bg-red-600 transition-all duration-300"
              >
                I understand, show me how to delete
              </button>
            ) : (
              <div className="space-y-4">
                {/* Confirmation Checklist */}
                <div className="bg-white p-4 rounded-lg space-y-3">
                  <h4 className="font-bold text-red-800 mb-3">Please confirm the following:</h4>
                  
                  <label className="flex items-start space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={deleteChecks.permanent}
                      onChange={(e) => setDeleteChecks({...deleteChecks, permanent: e.target.checked})}
                      className="w-5 h-5 mt-1"
                    />
                    <span className="text-sm text-gray-700">
                      I understand this action is PERMANENT and IRREVERSIBLE
                    </span>
                  </label>

                  <label className="flex items-start space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={deleteChecks.dataDeleted}
                      onChange={(e) => setDeleteChecks({...deleteChecks, dataDeleted: e.target.checked})}
                      className="w-5 h-5 mt-1"
                    />
                    <span className="text-sm text-gray-700">
                      I understand all my data will be permanently deleted
                    </span>
                  </label>

                  <label className="flex items-start space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={deleteChecks.repoAccess}
                      onChange={(e) => setDeleteChecks({...deleteChecks, repoAccess: e.target.checked})}
                      className="w-5 h-5 mt-1"
                    />
                    <span className="text-sm text-gray-700">
                      I understand I will lose access to all connected repositories
                    </span>
                  </label>

                  <label className="flex items-start space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={deleteChecks.dataDownloaded}
                      onChange={(e) => setDeleteChecks({...deleteChecks, dataDownloaded: e.target.checked})}
                      className="w-5 h-5 mt-1"
                    />
                    <span className="text-sm text-gray-700">
                      I have downloaded my data (if needed)
                    </span>
                  </label>

                  <label className="flex items-start space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={deleteChecks.proceed}
                      onChange={(e) => setDeleteChecks({...deleteChecks, proceed: e.target.checked})}
                      className="w-5 h-5 mt-1"
                    />
                    <span className="text-sm text-gray-700 font-bold">
                      I want to proceed with account deletion
                    </span>
                  </label>
                </div>

                {/* Username Confirmation */}
                <div>
                  <p className="text-red-800 font-bold mb-2">
                    Type your username <code className="bg-red-200 px-2 py-1 rounded">{user?.username || ''}</code> to confirm:
                  </p>
                  <input
                    type="text"
                    value={deleteConfirmText}
                    onChange={(e) => setDeleteConfirmText(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-red-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder={`Type "${user?.username || 'username'}" to confirm`}
                  />
                  <p className="text-sm text-gray-600 mt-1">
                    Characters: {deleteConfirmText.length}/{user?.username?.length || 0}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-4">
                  <button
                    onClick={() => {
                      setShowDeleteConfirm(false);
                      setDeleteConfirmText('');
                      setDeleteChecks({
                        permanent: false,
                        dataDeleted: false,
                        repoAccess: false,
                        dataDownloaded: false,
                        proceed: false
                      });
                    }}
                    className="flex-1 bg-gray-500 text-white font-bold px-6 py-3 rounded-xl hover:bg-gray-600 transition-all duration-300"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeleteAccount}
                    disabled={saving || deleteConfirmText !== user?.username || !Object.values(deleteChecks).every(v => v)}
                    className="flex-1 bg-red-500 text-white font-bold px-6 py-3 rounded-xl hover:bg-red-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {saving ? 'Processing...' : 'Continue to Final Confirmation'}
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="text-center py-4">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h4 className="text-lg font-semibold text-red-800 mb-2">Danger Zone</h4>
            <p className="text-red-600">Irreversible actions that affect your account.</p>
          </div>
        </div>
      </div>

      {/* Final Confirmation Modal */}
      {showFinalModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-12 h-12 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-red-800 mb-2">Are you absolutely sure?</h3>
              <p className="text-gray-600 mb-4">
                You are about to permanently delete the account:
              </p>
              <p className="text-xl font-bold text-themed-primary mb-4">
                {user?.username || 'Unknown'}
              </p>
              <p className="text-sm text-red-600">
                This action cannot be undone!
              </p>
            </div>
            
            <div className="flex space-x-4">
              <button
                onClick={() => setShowFinalModal(false)}
                className="flex-1 bg-gray-500 text-white font-bold px-6 py-3 rounded-xl hover:bg-gray-600 transition-all duration-300"
              >
                Cancel
              </button>
              <button
                onClick={confirmFinalDeletion}
                disabled={saving}
                className="flex-1 bg-red-600 text-white font-bold px-6 py-3 rounded-xl hover:bg-red-700 transition-all duration-300 disabled:opacity-50"
              >
                {saving ? 'Deleting...' : 'Yes, Delete My Account Forever'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UserSettings;