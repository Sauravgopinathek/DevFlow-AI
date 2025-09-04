import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useSettings } from '../contexts/SettingsContext';

const Login = () => {
  const { login, isAuthenticated } = useAuth();
  const { isDarkMode } = useSettings();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);

  const error = searchParams.get('error');
  const errorMessage = searchParams.get('message');
  const registered = searchParams.get('registered');

  const getErrorMessage = () => {
    switch (error) {
      case 'auth_failed':
        return 'GitHub authentication failed. Please try again.';
      case 'login_failed':
        return 'Login failed. Please try again.';
      case 'pending_approval':
        return 'Authentication successful! Redirecting to dashboard...';
      default:
        return errorMessage || 'Authentication failed. Please try again.';
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleGitHubLogin = () => {
    setIsLoading(true);
    login();
  };

  return (
    <div className={`min-h-screen ${
      isDarkMode 
        ? 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900' 
        : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'
    }`}>
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -inset-10 opacity-50">
          <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
          <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>
      </div>
      
      <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="relative max-w-lg w-full space-y-10">
          <div className="text-center animate-fade-in">
            <div className="mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mb-6 shadow-2xl">
                <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            <h1 className={`text-6xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
                DevFlow AI
              </span>
            </h1>
            <h2 className={`text-3xl font-bold mb-6 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
              ✨ Welcome Back! ✨
            </h2>
            <p className={`text-xl font-semibold ${isDarkMode ? 'text-purple-300' : 'text-purple-700'}`}>
              🚀 Sign in with ANY GitHub account to get started instantly! 🎨
            </p>
          </div>

          {registered && (
            <div className={`border-2 rounded-2xl p-6 animate-slide-up shadow-xl backdrop-blur-sm ${
              isDarkMode 
                ? 'bg-gradient-to-r from-green-900/80 to-emerald-900/80 border-green-400' 
                : 'bg-gradient-to-r from-green-100/80 to-emerald-100/80 border-green-300'
            }`}>
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className={`h-6 w-6 ${isDarkMode ? 'text-green-400' : 'text-green-500'}`} viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className={`text-lg font-bold ${isDarkMode ? 'text-green-300' : 'text-green-800'}`}>
                    ✅ Account Created Successfully!
                  </h3>
                  <div className={`mt-2 font-medium ${isDarkMode ? 'text-green-200' : 'text-green-700'}`}>
                    <p>You can now sign in immediately! 🚀</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {error && (
          <div className={`border-2 rounded-2xl p-6 animate-slide-up shadow-xl backdrop-blur-sm ${
            isDarkMode 
              ? 'bg-gradient-to-r from-red-900/80 to-pink-900/80 border-red-400' 
              : 'bg-gradient-to-r from-red-100/80 to-pink-100/80 border-red-300'
          }`}>
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className={`h-6 w-6 ${isDarkMode ? 'text-red-400' : 'text-red-500'}`} viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className={`text-lg font-bold ${isDarkMode ? 'text-red-300' : 'text-red-800'}`}>
                  ❌ Authentication failed
                </h3>
                <div className={`mt-2 font-medium ${isDarkMode ? 'text-red-200' : 'text-red-700'}`}>
                  <p>{getErrorMessage()}</p>
                </div>
              </div>
            </div>
          </div>
        )}

          <div className="space-y-6 animate-slide-up" style={{animationDelay: '0.2s'}}>
            <button
              onClick={handleGitHubLogin}
              disabled={isLoading}
              className="group relative w-full flex justify-center py-6 px-8 border-2 border-transparent text-xl font-bold rounded-2xl text-white bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 hover:from-purple-700 hover:via-pink-700 hover:to-blue-700 focus:outline-none focus:ring-4 focus:ring-purple-300 transition-all duration-500 transform hover:scale-105 shadow-2xl hover:shadow-3xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none overflow-hidden backdrop-blur-sm"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <span className="absolute left-0 inset-y-0 flex items-center pl-6 z-10">
                {isLoading ? (
                  <div className="animate-spin rounded-full h-8 w-8 border-b-4 border-white"></div>
                ) : (
                  <svg className="h-8 w-8 text-gray-300 group-hover:text-gray-200 transition-colors duration-300" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
                  </svg>
                )}
              </span>
              {isLoading ? '🔄 Connecting...' : '🐙 Continue with GitHub'}
            </button>



          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className={`w-full border-t-2 ${isDarkMode ? 'border-purple-400' : 'border-purple-300'}`}></div>
            </div>
            <div className="relative flex justify-center text-lg">
              <span className={`px-6 py-2 font-bold rounded-full border-2 backdrop-blur-sm ${
                isDarkMode 
                  ? 'bg-gradient-to-r from-slate-800/80 to-gray-800/80 text-purple-300 border-purple-400' 
                  : 'bg-gradient-to-r from-white/80 to-gray-50/80 text-purple-700 border-purple-300'
              }`}>
                🔒 Secure GitHub Authentication
              </span>
            </div>
          </div>

          <div className={`border-2 rounded-2xl p-6 shadow-xl backdrop-blur-sm ${
            isDarkMode 
              ? 'bg-gradient-to-r from-slate-800/80 to-gray-800/80 border-blue-400' 
              : 'bg-gradient-to-r from-white/80 to-blue-50/80 border-blue-300'
          }`}>
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className={`h-8 w-8 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className={`text-lg font-bold ${isDarkMode ? 'text-blue-300' : 'text-blue-700'}`}>
                  🔍 What we access
                </h3>
                <div className={`mt-3 font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                  <ul className="list-none space-y-2">
                    <li>👤 Your GitHub profile information</li>
                    <li>📁 Repository access for workflow automation</li>
                    <li>🐛 Issue and pull request data</li>
                    <li>🔗 Integration with your development tools</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className={`border-2 rounded-2xl p-6 shadow-xl backdrop-blur-sm ${
            isDarkMode 
              ? 'bg-gradient-to-r from-slate-800/80 to-gray-800/80 border-emerald-400' 
              : 'bg-gradient-to-r from-white/80 to-emerald-50/80 border-emerald-300'
          }`}>
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className={`h-8 w-8 ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className={`text-lg font-bold ${isDarkMode ? 'text-emerald-300' : 'text-emerald-700'}`}>
                  👥 Multiple Users Welcome!
                </h3>
                <div className={`mt-3 font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                  <ul className="list-none space-y-2">
                    <li>🎯 Any GitHub user can sign in</li>
                    <li>🔒 Each user gets their own isolated workspace</li>
                    <li>🔄 Use "Switch Account" to test different users</li>
                    <li>⚡ Accounts created automatically - no registration!</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          </div>

          <div className="text-center animate-fade-in" style={{animationDelay: '0.4s'}}>
            <p className={`text-lg font-semibold ${isDarkMode ? 'text-purple-300' : 'text-purple-700'}`}>
              🎯 Perfect for hackathons and quick demos! 
            </p>
            <p className={`mt-3 font-medium ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`}>
              🚀 Your account will be created automatically when you sign in.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;