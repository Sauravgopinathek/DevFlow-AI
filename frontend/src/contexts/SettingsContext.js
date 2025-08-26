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

export const SettingsProvider = ({ children }) => {
  // Initialize with localStorage if available - ALWAYS preserve theme
  const getInitialSettings = () => {
    try {
      // First try localStorage
      let localSettings = localStorage.getItem('devflow-settings');
      
      // If localStorage is empty, try sessionStorage backup
      if (!localSettings) {
        const backupSettings = sessionStorage.getItem('devflow-settings-backup');
        if (backupSettings) {
          console.log('🔄 Recovered settings from sessionStorage backup');
          localStorage.setItem('devflow-settings', backupSettings);
          localSettings = backupSettings;
        }
      }
      
      if (localSettings) {
        const parsed = JSON.parse(localSettings);
        console.log('🔄 Loaded settings from localStorage:', parsed.preferences?.theme);
        return parsed;
      }
    } catch (error) {
      console.error('Error loading settings from localStorage:', error);
    }
    
    // Default settings
    const defaultSettings = {
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
    };
    
    console.log('🆕 Using default settings with theme:', defaultSettings.preferences.theme);
    return defaultSettings;
  };

  const [settings, setSettings] = useState(getInitialSettings());
  const [loading, setLoading] = useState(false);

  // CRITICAL: Apply theme IMMEDIATELY on component mount
  useEffect(() => {
    const currentTheme = settings.preferences.theme;
    console.log('🚀 SettingsProvider mounted - applying theme:', currentTheme);
    applyTheme(currentTheme);
    
    // Also ensure localStorage is updated
    localStorage.setItem('devflow-settings', JSON.stringify(settings));
  }, []); // Only run once on mount

  // Apply theme changes when theme setting changes
  useEffect(() => {
    console.log('🎨 Theme changed to:', settings.preferences.theme);
    applyTheme(settings.preferences.theme);
    // Always save to localStorage when theme changes
    localStorage.setItem('devflow-settings', JSON.stringify(settings));
  }, [settings.preferences.theme]);

  // Load settings from server (but preserve local theme)
  useEffect(() => {
    loadSettings();
  }, []);

  // Apply language changes
  useEffect(() => {
    applyLanguage(settings.preferences.language);
  }, [settings.preferences.language]);

  const loadSettings = async () => {
    try {
      // ALWAYS preserve the current theme from localStorage
      const localSettings = localStorage.getItem('devflow-settings');
      let preservedTheme = 'light'; // Default fallback
      
      if (localSettings) {
        try {
          const parsed = JSON.parse(localSettings);
          preservedTheme = parsed.preferences?.theme || 'light';
          console.log('💾 Preserved theme from localStorage:', preservedTheme);
        } catch (parseError) {
          console.error('Error parsing localStorage settings:', parseError);
        }
      }

      // Try to load from server for authenticated users
      try {
        const response = await axios.get('/api/user/settings');
        if (response.data.settings) {
          console.log('🌐 Loaded settings from server, preserving theme:', preservedTheme);
          
          // CRITICAL: Always preserve the local theme, never override it
          const mergedSettings = {
            ...response.data.settings,
            preferences: {
              ...response.data.settings.preferences,
              theme: preservedTheme // ALWAYS keep the user's current theme
            }
          };
          
          setSettings(mergedSettings);
          localStorage.setItem('devflow-settings', JSON.stringify(mergedSettings));
          
          console.log('✅ Settings merged with preserved theme:', preservedTheme);
        }
      } catch (serverError) {
        console.log('⚠️ Server settings not available (user not authenticated)');
        // This is fine - user might not be authenticated
        // Keep using localStorage settings
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateSettings = async (newSettings) => {
    try {
      // Always update local state and localStorage first
      setSettings(newSettings);
      localStorage.setItem('devflow-settings', JSON.stringify(newSettings));
      
      // Try to sync to server for authenticated users
      try {
        const response = await axios.put('/api/user/settings', { settings: newSettings });
        console.log('✅ Settings synced to server');
        return { success: true, data: response.data };
      } catch (serverError) {
        console.log('⚠️ Settings saved locally (user not authenticated)');
        return { success: true, local: true };
      }
    } catch (error) {
      console.error('Failed to update settings:', error);
      return { success: false, error: error.message };
    }
  };

  const applyTheme = (theme) => {
    const html = document.documentElement;
    
    console.log(`🎨 Applying theme: ${theme}`);
    
    if (theme === 'auto') {
      // Use system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      
      if (prefersDark) {
        html.classList.add('dark');
      } else {
        html.classList.remove('dark');
      }
      
      console.log(`🎨 Auto theme applied: ${prefersDark ? 'dark' : 'light'}`);
      
      // Listen for system theme changes
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = (e) => {
        if (e.matches) {
          html.classList.add('dark');
        } else {
          html.classList.remove('dark');
        }
        console.log(`🎨 Auto theme changed: ${e.matches ? 'dark' : 'light'}`);
      };
      mediaQuery.addEventListener('change', handleChange);
      
      return () => mediaQuery.removeEventListener('change', handleChange);
    } else {
      // Apply specific theme using Tailwind's dark class on HTML element
      if (theme === 'dark') {
        html.classList.add('dark');
      } else {
        html.classList.remove('dark');
      }
      
      console.log(`🎨 Theme applied: ${theme}`);
      console.log('📋 HTML classes:', html.classList.toString());
      
      // Ensure theme persists in localStorage
      const currentSettings = JSON.parse(localStorage.getItem('devflow-settings') || '{}');
      const updatedSettings = {
        ...currentSettings,
        preferences: {
          ...currentSettings.preferences,
          theme: theme
        }
      };
      localStorage.setItem('devflow-settings', JSON.stringify(updatedSettings));
      
      console.log(`✅ Theme ${theme} applied and persisted to localStorage`);
    }
  };

  const applyLanguage = (language) => {
    document.documentElement.lang = language;
    // You can add more language-specific logic here
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

  const formatTime = (date) => {
    return new Intl.DateTimeFormat('en-US', {
      timeZone: settings.preferences.timezone,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }).format(date);
  };

  const formatDate = (date) => {
    return new Intl.DateTimeFormat(settings.preferences.language, {
      timeZone: settings.preferences.timezone,
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  const value = {
    settings,
    loading,
    updateSettings,
    showNotification,
    formatTime,
    formatDate,
    // Helper functions
    isDarkMode: settings?.preferences?.theme === 'dark' || 
                (settings?.preferences?.theme === 'auto' && 
                 window.matchMedia('(prefers-color-scheme: dark)').matches) || false,
    isAutoSync: settings.preferences.autoSync,
    emailNotifications: settings.notifications.email,
    pushNotifications: settings.notifications.push
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};