import { useEffect } from 'react';

export const useTheme = () => {
  // Always apply dark theme
  useEffect(() => {
    const html = document.documentElement;
    html.classList.add('dark');
  }, []);

  return {
    theme: 'dark',
    isDark: true,
    toggleTheme: () => {}, // No-op function
    setTheme: () => {} // No-op function
  };
};