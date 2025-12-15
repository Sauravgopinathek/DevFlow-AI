import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Configure axios defaults
  axios.defaults.withCredentials = true;
  axios.defaults.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const response = await axios.get('/auth/status');
      if (response.data.authenticated) {
        setUser(response.data.user);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = () => {
    window.location.href = `${axios.defaults.baseURL}/auth/github`;
  };

  const logout = async () => {
    try {
      // Preserve theme settings before logout
      const currentSettings = localStorage.getItem('devflow-settings');
      console.log('💾 Preserving settings during logout:', currentSettings);
      
      await axios.post('/auth/logout');
      setUser(null);
      
      // Ensure settings are still in localStorage after logout
      if (currentSettings) {
        localStorage.setItem('devflow-settings', currentSettings);
        console.log('✅ Settings preserved after logout');
      }
      
      // Redirect to home page after logout
      window.location.href = '/';
    } catch (error) {
      console.error('Logout failed:', error);
      // Still redirect even if logout request fails
      window.location.href = '/';
    }
  };

  const completeLogout = () => {
    // Preserve theme settings before complete logout
    const currentSettings = localStorage.getItem('devflow-settings');
    console.log('💾 Preserving settings during complete logout:', currentSettings);
    
    // Store in sessionStorage as backup since localStorage might be cleared
    if (currentSettings) {
      sessionStorage.setItem('devflow-settings-backup', currentSettings);
    }
    
    // This will logout from both DevFlow and GitHub
    window.location.href = `${axios.defaults.baseURL}/auth/logout/complete`;
  };

  const value = {
    user,
    login,
    logout,
    completeLogout,
    loading,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};