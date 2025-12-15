import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useSettings } from '../contexts/SettingsContext';

import { useScrollAnimation, useStaggeredAnimation } from '../hooks/useScrollAnimation';

const Home = () => {
  const { isAuthenticated } = useAuth();
  const { settings } = useSettings();
  
  // Scroll animation refs
  const [statsRef, statsVisible] = useScrollAnimation();
  const [dashboardRef, dashboardVisible] = useScrollAnimation();
  const [featuresRef, featuresVisible] = useScrollAnimation();
  const [featureCardsRef, featureCardsVisible] = useStaggeredAnimation(4, 150);
  const [whatYouGetRef, whatYouGetVisible] = useScrollAnimation();
  const [ctaRef, ctaVisible] = useScrollAnimation();

  const scrollToFeatures = () => {
    const featuresSection = document.getElementById('features');
    if (featuresSection) {
      featuresSection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">

      
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="relative overflow-hidden">
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
            <div className="text-center animate-fade-in">
              <div className="mb-12">
                <div className="inline-flex items-center px-6 py-3 bg-gray-600 rounded-full text-white text-lg font-bold mb-8 shadow-lg">
                  🚀 Now with GitHub Integration ✨
                </div>
              </div>
              <h1 className="text-6xl md:text-8xl font-bold mb-8 leading-tight">
                <span className="text-white">Your GitHub</span>
                <span className="text-white block"> Command Center</span>
              </h1>
              <p className="mt-8 text-2xl leading-10 text-white max-w-4xl mx-auto font-semibold">
                🚀 Manage repositories, generate AI-powered READMEs, analyze repo health, and access GitHub tools - all in one powerful dashboard. 
                Connect your GitHub account and supercharge your development workflow! ⚡
              </p>
              <div className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-8">
                {isAuthenticated ? (
                  <Link to="/dashboard" className="btn-cyber-primary text-xl px-12 py-5 rounded-xl font-bold">
                    <span className="flex items-center space-x-3">
                      <span>🚀 Go to Dashboard</span>
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </span>
                  </Link>
                ) : (
                  <Link to="/login" className="btn-cyber-primary text-xl px-12 py-5 rounded-xl font-bold">
                    <span className="flex items-center space-x-3">
                      <span>🚀 Get Started with GitHub</span>
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </span>
                  </Link>
                )}
                <button 
                  onClick={scrollToFeatures}
                  className="btn-cyber-secondary text-xl px-10 py-5 rounded-xl font-bold hover:scale-105 transform transition-all duration-300"
                >
                  <span className="flex items-center space-x-3">
                    <span>🎨 Learn More</span>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                  </span>
                </button>
              </div>
            </div>


          </div>
        </div>
      </div>



      {/* Stats Section */}
      <div 
        ref={statsRef} 
        className="py-24 relative overflow-hidden bg-gray-900"
      >
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <div className={`transform hover:scale-105 transition-all duration-300 ${
              statsVisible ? 'scroll-scale visible stagger-1' : 'scroll-scale'
            }`}>
              <div className="text-6xl font-bold mb-4 text-gray-400">100+</div>
              <div className="text-2xl font-semibold text-gray-300">📊 Repos Analyzed</div>
            </div>
            <div className={`transform hover:scale-105 transition-all duration-300 ${
              statsVisible ? 'scroll-scale visible stagger-2' : 'scroll-scale'
            }`}>
              <div className="text-6xl font-bold mb-4 text-gray-400">AI</div>
              <div className="text-2xl font-semibold text-gray-300">🤖 README Generation</div>
            </div>
            <div className={`transform hover:scale-105 transition-all duration-300 ${
              statsVisible ? 'scroll-scale visible stagger-3' : 'scroll-scale'
            }`}>
              <div className="text-6xl font-bold mb-4 text-gray-400">1-Click</div>
              <div className="text-2xl font-semibold text-gray-300">🚀 GitHub Tools Access</div>
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard Preview Section */}
      <div 
        ref={dashboardRef} 
        className="py-20 bg-gray-900"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`text-center mb-16 ${
            dashboardVisible ? 'scroll-fade visible' : 'scroll-fade'
          }`}>
            <h2 className="text-5xl font-bold mb-8 text-white">
              🎮 Your GitHub Command Center
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              See how DevFlow AI transforms your GitHub experience with powerful tools and insights
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className={`space-y-6 ${
              dashboardVisible ? 'scroll-slide-left visible' : 'scroll-slide-left'
            }`}>
              <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700 shadow-lg">
                <h3 className="text-2xl font-bold text-green-400 mb-4">📊 Repository Analytics</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Health Score</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-20 h-2 rounded-full bg-gray-700">
                        <div className="w-16 h-2 bg-green-500 rounded-full"></div>
                      </div>
                      <span className="text-green-400 font-bold">85%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Stars</span>
                    <span className="text-yellow-400 font-bold">⭐ 127</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Issues</span>
                    <span className="text-gray-400 font-bold">🐛 3 open</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700 shadow-lg">
                <h3 className="text-2xl font-bold text-purple-400 mb-4">🤖 AI README</h3>
                <div className="bg-gray-700 rounded-lg p-4 font-mono text-sm">
                  <div className="text-green-400"># MyProject</div>
                  <div className="text-gray-300 mt-2">A modern web application built with...</div>
                  <div className="text-gray-400 mt-2">## 🚀 Features</div>
                  <div className="text-gray-300">- Clean architecture</div>
                  <div className="text-gray-300">- Modern UI/UX</div>
                </div>
              </div>
            </div>
            
            <div className={`space-y-6 ${
              dashboardVisible ? 'scroll-slide-right visible' : 'scroll-slide-right'
            }`}>
              <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700 shadow-lg">
                <h3 className="text-2xl font-bold text-gray-400 mb-4">🛠️ Quick Actions</h3>
                <div className="grid grid-cols-2 gap-3">
                  <button className="bg-gray-700 hover:bg-gray-600 p-3 rounded-lg text-sm font-medium transition-colors text-white">
                    💻 GitHub Chat
                  </button>
                  <button className="bg-gray-700 hover:bg-gray-600 p-3 rounded-lg text-sm font-medium transition-colors text-white">
                    🎒 Student Pack
                  </button>
                  <button className="bg-gray-700 hover:bg-gray-600 p-3 rounded-lg text-sm font-medium transition-colors text-white">
                    ☁️ Codespaces
                  </button>
                  <button className="bg-gray-700 hover:bg-gray-600 p-3 rounded-lg text-sm font-medium transition-colors text-white">
                    🛒 Marketplace
                  </button>
                </div>
              </div>
              
              <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700 shadow-lg">
                <h3 className="text-2xl font-bold text-orange-400 mb-4">📈 Live Stats</h3>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-gray-400">24</div>
                    <div className="text-xs text-gray-400">Repositories</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-400">156</div>
                    <div className="text-xs text-gray-400">Total Stars</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-purple-400">42</div>
                    <div className="text-xs text-gray-400">Pull Requests</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div 
        id="features" 
        ref={featuresRef} 
        className="py-20 bg-gray-900"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`text-center mb-16 ${
            featuresVisible ? 'scroll-fade visible' : 'scroll-fade'
          }`}>
            <h2 className="text-5xl font-bold text-white mb-8">
              🎯 Core Features
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Everything you need to manage your GitHub repositories and enhance your development workflow
            </p>
          </div>
          
          <div ref={featureCardsRef} className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {/* Repository Management */}
            <div className={`bg-gray-800 rounded-3xl shadow-lg p-8 border-2 border-gray-700 transform hover:scale-105 transition-all duration-300 ${
              featureCardsVisible.has(0) ? 'scroll-pop visible' : 'scroll-pop'
            }`}>
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-white">Repository Hub</h3>
                <p className="text-gray-300 mb-4">View, manage, and organize all your GitHub repositories</p>
                <div className="text-sm text-green-400 font-semibold">📁 Centralized</div>
              </div>
            </div>

            {/* AI README Generator */}
            <div className={`bg-gray-800 rounded-3xl shadow-2xl p-8 border-2 border-gray-700 transform hover:scale-105 transition-all duration-300 ${
              featureCardsVisible.has(1) ? 'scroll-pop visible stagger-2' : 'scroll-pop'
            }`}>
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-white">AI README</h3>
                <p className="text-gray-300 mb-4">Generate professional READMEs with AI analysis</p>
                <div className="text-sm text-purple-400 font-semibold">🤖 AI Powered</div>
              </div>
            </div>

            {/* Repo Health Analysis */}
            <div className={`bg-gray-800 rounded-3xl shadow-lg p-8 border-2 border-gray-700 transform hover:scale-105 transition-all duration-300 ${
              featureCardsVisible.has(2) ? 'scroll-pop visible stagger-3' : 'scroll-pop'
            }`}>
              <div className="text-center">
                <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-white">Health Analysis</h3>
                <p className="text-gray-300 mb-4">Analyze repository health and get improvement insights</p>
                <div className="text-sm text-green-400 font-semibold">📊 Analytics</div>
              </div>
            </div>

            {/* GitHub Tools Access */}
            <div className={`bg-gray-800 rounded-3xl shadow-2xl p-8 border-2 border-gray-700 transform hover:scale-105 transition-all duration-300 ${
              featureCardsVisible.has(3) ? 'scroll-pop visible stagger-4' : 'scroll-pop'
            }`}>
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-white">GitHub Tools</h3>
                <p className="text-gray-300 mb-4">Direct access to Copilot, Codespaces, and more</p>
                <div className="text-sm text-gray-400 font-semibold">🛠️ Integrated</div>
              </div>
            </div>
          </div>

          {/* What You Get */}
          <div ref={whatYouGetRef} className={`bg-gray-800 rounded-3xl shadow-2xl p-8 border-2 border-gray-700 ${
            whatYouGetVisible ? 'scroll-scale visible' : 'scroll-scale'
          }`}>
            <h3 className="text-3xl font-bold text-white mb-8 text-center">🎯 What You Get</h3>
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="text-2xl">📊</div>
                  <div>
                    <h4 className="text-lg font-bold text-white">Repository Dashboard</h4>
                    <p className="text-gray-300">View all your repos with stats, activity, and quick actions</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="text-2xl">🤖</div>
                  <div>
                    <h4 className="text-lg font-bold text-white">AI README Generator</h4>
                    <p className="text-gray-300">Create professional documentation with one click</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="text-2xl">💊</div>
                  <div>
                    <h4 className="text-lg font-bold text-white">Health Monitoring</h4>
                    <p className="text-gray-300">Get insights on repo activity, issues, and community engagement</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="text-2xl">🔗</div>
                  <div>
                    <h4 className="text-lg font-bold text-white">Direct Tool Access</h4>
                    <p className="text-gray-300">One-click access to GitHub Copilot, Codespaces, and more</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="text-2xl">🎓</div>
                  <div>
                    <h4 className="text-lg font-bold text-white">Student Benefits</h4>
                    <p className="text-gray-300">Easy access to GitHub Education Pack worth $200k+</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="text-2xl">⚡</div>
                  <div>
                    <h4 className="text-lg font-bold text-white">Instant Setup</h4>
                    <p className="text-gray-300">No configuration needed - just sign in and start using</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-4 bg-gray-700 rounded-2xl border-2 border-gray-600">
              <p className="text-white font-semibold text-center">
                ✨ Perfect for developers, students, and teams who want to streamline their GitHub workflow!
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div 
        ref={ctaRef} 
        className="py-32 bg-gray-900"
      >
        <div className="max-w-5xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className={`text-5xl font-bold text-white mb-8 ${
            ctaVisible ? 'scroll-scale visible' : 'scroll-scale'
          }`}>
            🚀 Ready to Supercharge Your GitHub Experience?
          </h2>
          <p className={`text-2xl text-gray-300 mb-12 font-semibold ${
            ctaVisible ? 'scroll-fade visible stagger-2' : 'scroll-fade'
          }`}>
            Join developers who are using AI to enhance their repositories and streamline their workflow! ✨
          </p>
          {!isAuthenticated && (
            <Link to="/login" className={`btn-cyber-primary text-2xl px-16 py-6 rounded-xl font-bold inline-flex items-center space-x-4 transform hover:scale-110 transition-all duration-300 ${
              ctaVisible ? 'scroll-pop visible stagger-3' : 'scroll-pop'
            }`}>
              <span>🎯 Start Free Today</span>
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;