import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { SettingsProvider } from './contexts/SettingsContext';
import ErrorBoundary from './components/ErrorBoundary';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import VerifyEmail from './pages/VerifyEmail';
import Admin from './pages/Admin';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import Analytics from './pages/Analytics';
import UserSettings from './components/UserSettings';
import NotificationManager from './components/NotificationManager';
import ProtectedRoute from './components/ProtectedRoute';
import BackgroundDemo from './components/BackgroundDemo';
import useAnalytics from './hooks/useAnalytics';

function AppContent() {
  // Track page views automatically
  // Note: Hook is already wrapped with error handling internally
  useAnalytics(true);

  return (
    <ErrorBoundary fallbackMessage="The application encountered an error. Please refresh the page or contact support if the problem persists.">
      <div className="min-h-screen bg-gray-900 text-white">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/demo/backgrounds" element={<BackgroundDemo />} />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/analytics" 
            element={
              <ProtectedRoute>
                <Analytics />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/settings" 
            element={
              <ProtectedRoute>
                <div className="min-h-screen bg-gray-900 py-8">
                  <div className="max-w-4xl mx-auto px-4 space-y-8">
                    <UserSettings />
                  </div>
                </div>
              </ProtectedRoute>
            } 
          />
        </Routes>
        <NotificationManager />
      </div>
    </ErrorBoundary>
  );
}

function App() {
  return (
    <ErrorBoundary fallbackMessage="Failed to load the application. Please check your connection and refresh the page.">
      <AuthProvider>
        <SettingsProvider>
          <Router>
            <AppContent />
          </Router>
        </SettingsProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;