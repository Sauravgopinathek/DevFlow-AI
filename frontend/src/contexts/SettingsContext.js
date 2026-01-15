import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const SettingsContext = createContext();

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

// Always use dark theme
const initializeTheme = () => {
  try {
    // Always apply dark theme
    document.documentElement.classList.add('dark');
    return 'dark';
  } catch (error) {
    console.error('Theme initialization error:', error);
    return 'dark';
  }
};

export const SettingsProvider = ({ children }) => {
  // Initialize theme immediately
  initializeTheme();
  
  const getInitialSettings = () => {
    try {
      const localSettings = localStorage.getItem('devflow-settings');
      if (localSettings) {
        const parsed = JSON.parse(localSettings);
        // Ensure theme is always dark
        return {
          notifications: parsed.notifications || {
            email: true,
            push: false
          },
          integrations: parsed.integrations || {
            github: false
          }
        };
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
    
    return {
      notifications: {
        email: true,
        push: false
      },
      integrations: {
        github: false
      }
    };
  };

  const [settings, setSettings] = useState(getInitialSettings());
  const [loading, setLoading] = useState(false);

  // Always ensure dark theme is applied
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  // Load server settings without affecting theme
  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      try {
        const response = await axios.get('/api/user/settings');
        if (response.data.settings) {
          const serverSettings = {
            notifications: response.data.settings.notifications || {
              email: true,
              push: false
            },
            integrations: response.data.settings.integrations || {
              github: false
            }
          };
          
          setSettings(serverSettings);
          localStorage.setItem('devflow-settings', JSON.stringify(serverSettings));
        }
      } catch (serverError) {
        // User not authenticated - keep local settings
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateSettings = async (newSettings) => {
    try {
      setSettings(newSettings);
      localStorage.setItem('devflow-settings', JSON.stringify(newSettings));
      
      try {
        await axios.put('/api/user/settings', { settings: newSettings });
        return { success: true };
      } catch (serverError) {
        return { success: true, local: true };
      }
    } catch (error) {
      console.error('Failed to update settings:', error);
      return { success: false, error: error.message };
    }
  };

  const showNotification = (message, type = 'info') => {
    // Show in-app notification
    if (settings.notifications.push) {
      window.dispatchEvent(new CustomEvent('showNotification', {
        detail: { message, type }
      }));
    }

    // Also show browser notification if available and enabled
    if (settings.notifications.push && 'Notification' in window) {
      if (Notification.permission === 'granted') {
        new Notification('DevFlow AI', {
          body: message,
          icon: '/favicon.ico'
        });
      } else if (Notification.permission !== 'denied') {
        Notification.requestPermission().then(permission => {
          if (permission === 'granted') {
            new Notification('DevFlow AI', {
              body: message,
              icon: '/favicon.ico'
            });
          }
        });
      }
    }
  };

  const value = {
    settings,
    loading,
    updateSettings,
    showNotification,
    // Helper functions
    emailNotifications: settings.notifications.email,
    pushNotifications: settings.notifications.push
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};