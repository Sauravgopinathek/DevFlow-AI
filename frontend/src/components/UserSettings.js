import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useSettings } from '../contexts/SettingsContext';
import axios from 'axios';

const UserSettings = () => {
  const { user, logout } = useAuth();
  const { settings: globalSettings, updateSettings: updateGlobalSettings, showNotification } = useSettings();
  const navigate = useNavigate();
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      push: false
    },
    preferences: {
      theme: 'light',
      timezone: 'UTC',
      language: 'en',
      autoSync: true
    },
    integrations: {
      github: false
    }
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const [activeTab, setActiveTab] = useState('integrations');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [originalSettings, setOriginalSettings] = useState(null);

  useEffect(() => {
    fetchSettings();
    checkIntegrations();
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
        setOriginalSettings(JSON.parse(JSON.stringify(newSettings))); // Deep copy
        setHasUnsavedChanges(false);
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

  const checkIntegrations = async () => {
    try {
      const githubStatus = await axios.get('/api/user/profile').catch(() => ({ data: { githubConnected: false } }));

      setSettings(prev => ({
        ...prev,
        integrations: {
          github: githubStatus.data.githubConnected || false
        }
      }));
    } catch (error) {
      console.error('Failed to check integrations:', error);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== user.username) {
      setMessage({ type: 'error', text: 'Please type your username correctly to confirm deletion' });
      setTimeout(() => setMessage(null), 3000);
      return;
    }

    setSaving(true);
    try {
      await axios.delete('/api/user/account');
      setMessage({ type: 'success', text: 'Account deleted successfully. Redirecting...' });
      
      // Logout and redirect after a short delay
      setTimeout(() => {
        logout();
        navigate('/');
      }, 2000);
    } catch (error) {
      setMessage({ type: 'error', text: 'Error deleting account' });
      setTimeout(() => setMessage(null), 3000);
      setSaving(false);
    }
  };

  const saveSettings = async () => {
    setSaving(true);
    setMessage(null);
    
    try {
      console.log('💾 Saving settings:', settings);
      
      // Update both local state and global settings context
      const result = await updateGlobalSettings(settings);
      
      if (result.success) {
        console.log('✅ Save response:', result.data);
        setMessage({ type: 'success', text: 'Settings saved successfully!' });
        setOriginalSettings(JSON.parse(JSON.stringify(settings))); // Deep copy
        setHasUnsavedChanges(false);
        
        // Show notification if enabled
        showNotification('Settings saved successfully!', 'success');
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('❌ Failed to save settings:', error);
      setMessage({ type: 'error', text: 'Failed to save settings. Please try again.' });
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handleSettingChange = (category, key, value) => {
    console.log(`🔧 Setting change: ${category}.${key} = ${value}`);
    setSettings(prev => {
      const newSettings = {
        ...prev,
        [category]: {
          ...prev[category],
          [key]: value
        }
      };
      console.log('📝 New settings state:', newSettings);
      
      // Check if settings have changed
      if (originalSettings) {
        const hasChanges = JSON.stringify(newSettings) !== JSON.stringify(originalSettings);
        setHasUnsavedChanges(hasChanges);
      }
      
      return newSettings;
    });
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
    <div className="card-themed rounded-2xl shadow-2xl p-8 animate-slide-up">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-themed-primary flex items-center">
          ⚙️ Settings
        </h3>

      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-4 justify-center mb-8">
        <button
          onClick={() => setActiveTab('integrations')}
          className={`px-6 py-3 rounded-xl font-bold transition-all duration-300 ${
            activeTab === 'integrations'
              ? 'bg-blue-600 dark:bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Integrations
        </button>
        <button
          onClick={() => setActiveTab('danger')}
          className={`px-6 py-3 rounded-xl font-bold transition-all duration-300 ${
            activeTab === 'danger'
              ? 'bg-red-600 dark:bg-red-500 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          🚨 Danger Zone
        </button>
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



      {/* Integrations Tab */}
      {activeTab === 'integrations' && (
        <div className="space-y-6">
          <h4 className="text-lg font-semibold text-gray-800 mb-4">Connected Integrations</h4>
          
          <div className="grid gap-4">
            {settings.integrations.github && (
              <button
                onClick={() => window.open(`https://github.com/${user?.username}`, '_blank')}
                className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900 rounded-lg border border-green-200 dark:border-green-700 hover:bg-green-100 dark:hover:bg-green-800 transition-all duration-200 cursor-pointer"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gray-900 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">GH</span>
                  </div>
                  <div>
                    <h5 className="font-medium text-gray-900">GitHub</h5>
                    <p className="text-sm text-gray-600">Code repository integration</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="px-3 py-1 rounded-full text-sm font-bold bg-green-100 text-green-800">
                    Connected
                  </div>
                  <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </div>
              </button>
            )}
          </div>

          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
            </div>
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Integration Status</h4>
            <p className="text-gray-600">Manage your connected services and integrations.</p>
          </div>
        </div>
      )}

      {/* Danger Zone Tab */}
      {activeTab === 'danger' && (
        <div className="space-y-6">
          <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6">
            <h3 className="text-lg font-bold text-red-800 mb-4">🚨 Delete Account</h3>
            <p className="text-red-700 mb-4">
              ⚠️ <strong>Warning:</strong> This action cannot be undone. This will permanently delete your account and remove all your data from our servers.
            </p>
            <p className="text-red-600 text-sm mb-4">
              This will delete:
            </p>
            <ul className="text-red-600 text-sm mb-6 list-disc list-inside space-y-1">
              <li>Your profile and account information</li>
              <li>All connected integrations (GitHub)</li>
              <li>Your settings and preferences</li>
              <li>All stored tokens and credentials</li>
            </ul>
            
            {!showDeleteConfirm ? (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="bg-red-500 text-white font-bold px-6 py-3 rounded-xl hover:bg-red-600 transition-all duration-300"
              >
                Delete My Account
              </button>
            ) : (
              <div className="space-y-4">
                <p className="text-red-800 font-bold">
                  Type your username <code className="bg-red-200 px-2 py-1 rounded">{user.username}</code> to confirm:
                </p>
                <input
                  type="text"
                  value={deleteConfirmText}
                  onChange={(e) => setDeleteConfirmText(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-red-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder={`Type "${user.username}" to confirm`}
                />
                <div className="flex space-x-4">
                  <button
                    onClick={handleDeleteAccount}
                    disabled={saving || deleteConfirmText !== user.username}
                    className="bg-red-500 text-white font-bold px-6 py-3 rounded-xl hover:bg-red-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {saving ? 'Deleting...' : 'Yes, Delete My Account'}
                  </button>
                  <button
                    onClick={() => {
                      setShowDeleteConfirm(false);
                      setDeleteConfirmText('');
                    }}
                    className="bg-gray-500 text-white font-bold px-6 py-3 rounded-xl hover:bg-gray-600 transition-all duration-300"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="text-center py-8">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h4 className="text-lg font-semibold text-red-800 mb-2">Danger Zone</h4>
            <p className="text-red-600">Irreversible actions that affect your account.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserSettings;