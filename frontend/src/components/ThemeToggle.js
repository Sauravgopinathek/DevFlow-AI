import React from 'react';
import { useSettings } from '../contexts/SettingsContext';

const ThemeToggle = () => {
  const { settings, updateSettings, isDarkMode } = useSettings();

  const toggleTheme = async () => {
    const newTheme = settings.preferences.theme === 'light' ? 'dark' : 'light';
    console.log(`🎨 Theme toggle: ${settings.preferences.theme} → ${newTheme}`);
    
    const newSettings = {
      ...settings,
      preferences: {
        ...settings.preferences,
        theme: newTheme
      }
    };
    
    await updateSettings(newSettings);
  };

  return (
    <button
      onClick={toggleTheme}
      className="fixed bottom-4 right-4 z-50 p-3 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110 bg-gray-800 text-white hover:bg-gray-700 dark:bg-yellow-400 dark:text-gray-900 dark:hover:bg-yellow-300"
      title={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
    >
      {isDarkMode ? (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ) : (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
      )}
    </button>
  );
};

export default ThemeToggle;