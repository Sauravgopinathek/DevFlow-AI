import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import GlowBackground from '../components/backgrounds/GlowBackground';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    displayName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setMessage('');

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    // Validate password strength
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      setIsLoading(false);
      return;
    }

    try {
      const { confirmPassword, ...registrationData } = formData;
      const response = await axios.post('/api/registration/register', registrationData);
      setMessage(response.data.message);
      
      // Show success message and don't auto-redirect
      // User needs to verify email first
    } catch (error) {
      setError(error.response?.data?.error || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <GlowBackground variant="aurora" intensity="medium">
      <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="relative max-w-lg w-full space-y-10">
          <div className="text-center animate-fade-in">
            <h2 className="text-center text-5xl font-bold gradient-text-rainbow animate-wiggle">
              ✨ Join DevFlow! ✨
            </h2>
            <p className="mt-6 text-center text-xl text-purple-700 font-semibold">
              🚀 Register to get access to workflow automation! 🎨
            </p>
          </div>

          {message && (
            <div className="bg-gradient-to-r from-green-100 to-emerald-100 border-2 border-green-300 rounded-2xl p-6 animate-slide-up shadow-xl">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-6 w-6 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-bold text-green-800">
                    ✅ Registration Successful!
                  </h3>
                  <div className="mt-2 text-green-700 font-medium">
                    <p>{message}</p>
                    <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-blue-800 font-semibold">📧 Check Your Email!</p>
                      <p className="text-blue-700 text-sm mt-1">
                        We've sent a verification link to your email address. Click the link to activate your account and then you can sign in.
                      </p>
                    </div>
                    <div className="mt-4 text-center">
                      <Link 
                        to="/login" 
                        className="text-purple-600 hover:text-purple-500 font-bold underline"
                      >
                        Go to Login Page
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-gradient-to-r from-red-100 to-pink-100 border-2 border-red-300 rounded-2xl p-6 animate-slide-up shadow-xl">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-6 w-6 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-bold text-red-800">
                    ❌ Registration Failed
                  </h3>
                  <div className="mt-2 text-red-700 font-medium">
                    <p>{error}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6 animate-slide-up" style={{animationDelay: '0.2s'}}>
            <div>
              <label htmlFor="username" className="block text-lg font-bold text-purple-700 mb-2">
                👤 Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                value={formData.username}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-purple-300 rounded-xl text-lg focus:outline-none focus:ring-4 focus:ring-purple-300 focus:border-purple-500 transition-all duration-300"
                placeholder="Enter your username"
              />
            </div>

            <div>
              <label htmlFor="displayName" className="block text-lg font-bold text-purple-700 mb-2">
                ✨ Display Name
              </label>
              <input
                id="displayName"
                name="displayName"
                type="text"
                required
                value={formData.displayName}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-purple-300 rounded-xl text-lg focus:outline-none focus:ring-4 focus:ring-purple-300 focus:border-purple-500 transition-all duration-300"
                placeholder="Enter your display name"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-lg font-bold text-purple-700 mb-2">
                📧 Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-purple-300 rounded-xl text-lg focus:outline-none focus:ring-4 focus:ring-purple-300 focus:border-purple-500 transition-all duration-300"
                placeholder="Enter your email address"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-lg font-bold text-purple-700 mb-2">
                🔒 Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-purple-300 rounded-xl text-lg focus:outline-none focus:ring-4 focus:ring-purple-300 focus:border-purple-500 transition-all duration-300"
                placeholder="Enter your password (min 6 characters)"
                minLength="6"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-lg font-bold text-purple-700 mb-2">
                🔒 Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-purple-300 rounded-xl text-lg focus:outline-none focus:ring-4 focus:ring-purple-300 focus:border-purple-500 transition-all duration-300"
                placeholder="Confirm your password"
                minLength="6"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-4 px-8 border-2 border-transparent text-xl font-bold rounded-2xl text-white bg-gradient-to-r from-indigo-500 via-blue-500 to-cyan-500 hover:from-indigo-600 hover:via-blue-600 hover:to-cyan-600 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all duration-500 transform hover:scale-105 shadow-2xl hover:shadow-3xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none overflow-hidden"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                  🔄 Registering...
                </>
              ) : (
                '🚀 Register for DevFlow'
              )}
            </button>
          </form>

          <div className="bg-gradient-to-r from-blue-100 to-cyan-100 border-2 border-blue-300 rounded-2xl p-6 shadow-xl animate-slide-up" style={{animationDelay: '0.4s'}}>
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-8 w-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-bold text-blue-800">
                  📋 Registration Process
                </h3>
                <div className="mt-3 text-blue-700 font-medium">
                  <ol className="list-decimal list-inside space-y-1">
                    <li>Fill out the registration form with your details</li>
                    <li>Create a secure password (minimum 6 characters)</li>
                    <li>Account is created instantly - no approval needed!</li>
                    <li>Login and start using DevFlow immediately! 🎉</li>
                  </ol>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center animate-fade-in" style={{animationDelay: '0.6s'}}>
            <p className="text-lg text-purple-700 font-semibold">
              Already registered?{' '}
              <Link 
                to="/login" 
                className="text-pink-600 hover:text-pink-500 font-bold underline decoration-wavy"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </GlowBackground>
  );
};

export default Register;