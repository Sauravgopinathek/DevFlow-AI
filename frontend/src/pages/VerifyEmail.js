import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import axios from 'axios';
import GlowBackground from '../components/backgrounds/GlowBackground';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('verifying'); // verifying, success, error
  const [message, setMessage] = useState('');
  const [userInfo, setUserInfo] = useState(null);
  const token = searchParams.get('token');

  useEffect(() => {
    if (token) {
      verifyEmail(token);
    } else {
      setStatus('error');
      setMessage('Invalid verification link. No token provided.');
    }
  }, [token]);

  const verifyEmail = async (verificationToken) => {
    try {
      const response = await axios.get(`/api/registration/verify-email/${verificationToken}`);
      setStatus('success');
      setMessage(response.data.message);
      setUserInfo(response.data.user);
    } catch (error) {
      setStatus('error');
      setMessage(error.response?.data?.error || 'Email verification failed. Please try again.');
    }
  };

  return (
    <GlowBackground variant="aurora" intensity="medium">
      <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="relative max-w-lg w-full space-y-10">
          
          {/* Verifying State */}
          {status === 'verifying' && (
            <div className="text-center animate-fade-in">
              <div className="mb-8">
                <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600 mx-auto"></div>
              </div>
              <h2 className="text-center text-4xl font-bold gradient-text-rainbow">
                🔍 Verifying Your Email...
              </h2>
              <p className="mt-6 text-center text-xl text-purple-700 font-semibold">
                Please wait while we verify your account
              </p>
            </div>
          )}

          {/* Success State */}
          {status === 'success' && (
            <>
              <div className="text-center animate-fade-in">
                <h2 className="text-center text-5xl font-bold gradient-text-rainbow animate-wiggle">
                  ✅ Email Verified!
                </h2>
                <p className="mt-6 text-center text-xl text-purple-700 font-semibold">
                  🎉 Your account has been successfully verified!
                </p>
              </div>

              <div className="bg-gradient-to-r from-green-100 to-emerald-100 border-2 border-green-300 rounded-2xl p-6 animate-slide-up shadow-xl">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-8 w-8 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-bold text-green-800">
                      🎊 Welcome to DevFlow AI!
                    </h3>
                    <div className="mt-2 text-green-700 font-medium">
                      <p>{message}</p>
                      {userInfo && (
                        <p className="mt-2">
                          Welcome, <strong>{userInfo.displayName}</strong>! Your account is now active.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4 animate-slide-up" style={{animationDelay: '0.2s'}}>
                <Link
                  to="/login"
                  className="group relative w-full flex justify-center py-4 px-8 border-2 border-transparent text-xl font-bold rounded-2xl text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-4 focus:ring-purple-300 transition-all duration-500 transform hover:scale-105 shadow-2xl hover:shadow-3xl"
                >
                  🚀 Sign In to Your Account
                </Link>
              </div>

              <div className="bg-gradient-to-r from-blue-100 to-cyan-100 border-2 border-blue-300 rounded-2xl p-6 shadow-xl animate-slide-up" style={{animationDelay: '0.4s'}}>
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-8 w-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-bold text-blue-800">
                      🌟 What's Next?
                    </h3>
                    <div className="mt-3 text-blue-700 font-medium">
                      <ol className="list-decimal list-inside space-y-1">
                        <li>Sign in with your verified account</li>
                        <li>Explore your personalized dashboard</li>
                        <li>Connect your GitHub account (optional)</li>
                        <li>Start automating your workflow! 🎯</li>
                      </ol>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Error State */}
          {status === 'error' && (
            <>
              <div className="text-center animate-fade-in">
                <h2 className="text-center text-5xl font-bold text-red-600">
                  ❌ Verification Failed
                </h2>
                <p className="mt-6 text-center text-xl text-red-700 font-semibold">
                  We couldn't verify your email address
                </p>
              </div>

              <div className="bg-gradient-to-r from-red-100 to-pink-100 border-2 border-red-300 rounded-2xl p-6 animate-slide-up shadow-xl">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-8 w-8 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-bold text-red-800">
                      🚫 Verification Error
                    </h3>
                    <div className="mt-2 text-red-700 font-medium">
                      <p>{message}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4 animate-slide-up" style={{animationDelay: '0.2s'}}>
                <Link
                  to="/register"
                  className="group relative w-full flex justify-center py-4 px-8 border-2 border-transparent text-xl font-bold rounded-2xl text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-4 focus:ring-indigo-300 transition-all duration-500 transform hover:scale-105 shadow-2xl hover:shadow-3xl"
                >
                  🔄 Try Registering Again
                </Link>
                
                <Link
                  to="/login"
                  className="group relative w-full flex justify-center py-4 px-8 border-2 border-gray-300 text-xl font-bold rounded-2xl text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-4 focus:ring-gray-300 transition-all duration-500 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  🏠 Back to Login
                </Link>
              </div>

              <div className="bg-gradient-to-r from-yellow-100 to-orange-100 border-2 border-yellow-300 rounded-2xl p-6 shadow-xl animate-slide-up" style={{animationDelay: '0.4s'}}>
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-8 w-8 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-bold text-yellow-800">
                      💡 Common Issues
                    </h3>
                    <div className="mt-3 text-yellow-700 font-medium">
                      <ul className="list-disc list-inside space-y-1">
                        <li>Verification link may have expired (24 hours)</li>
                        <li>Link may have been used already</li>
                        <li>Check if you clicked the complete link</li>
                        <li>Try registering with a different email</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </GlowBackground>
  );
};

export default VerifyEmail;