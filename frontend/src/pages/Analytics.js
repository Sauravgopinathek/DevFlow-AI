import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import analyticsService from '../services/analyticsService';
import GlowBackground from '../components/backgrounds/GlowBackground';

const Analytics = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [activities, setActivities] = useState([]);
  const [error, setError] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState(7);
  const [activityPage, setActivityPage] = useState(1);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError('');
      
      const [statsData, activityData] = await Promise.all([
        analyticsService.getStats(),
        analyticsService.getActivity(1, 20)
      ]);

      setStats(statsData);
      setActivities(activityData.activities || []);
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
      if (error.response?.status === 403) {
        setError('You do not have permission to view analytics. Admin access required.');
      } else if (error.response?.status === 401) {
        setError('Please log in to view analytics.');
      } else {
        setError('Failed to load analytics data. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num?.toString() || '0';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getEventIcon = (eventType) => {
    switch (eventType) {
      case 'page_view':
        return '👁️';
      case 'login':
        return '🔐';
      case 'logout':
        return '🚪';
      case 'registration':
        return '✨';
      case 'action':
        return '⚡';
      case 'api_call':
        return '🔌';
      default:
        return '📊';
    }
  };

  if (loading) {
    return (
      <GlowBackground variant="aurora" intensity="medium">
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-500 mx-auto mb-4"></div>
            <p className="text-xl text-purple-300 font-semibold">Loading Analytics...</p>
          </div>
        </div>
      </GlowBackground>
    );
  }

  if (error) {
    return (
      <GlowBackground variant="aurora" intensity="medium">
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-gradient-to-br from-red-100 to-pink-100 rounded-3xl p-8 shadow-2xl">
            <div className="text-center">
              <div className="text-6xl mb-4">🚫</div>
              <h2 className="text-2xl font-bold text-red-800 mb-4">Access Denied</h2>
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        </div>
      </GlowBackground>
    );
  }

  return (
    <GlowBackground variant="cosmic" intensity="medium">
      <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8 text-center animate-fade-in">
            <h1 className="text-5xl font-bold gradient-text-rainbow mb-4">
              📊 Analytics Dashboard
            </h1>
            <p className="text-xl text-purple-300">
              Monitor your platform's performance and user engagement
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Total Users */}
            <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-xl rounded-2xl p-6 border border-purple-300/30 shadow-xl animate-slide-up hover:scale-105 transition-transform duration-300">
              <div className="flex items-center justify-between mb-2">
                <span className="text-purple-300 text-lg">Total Users</span>
                <span className="text-4xl">👥</span>
              </div>
              <div className="text-4xl font-bold text-white mb-1">
                {formatNumber(stats?.users?.total || 0)}
              </div>
              <div className="text-sm text-purple-300">
                {stats?.users?.approved || 0} approved
              </div>
            </div>

            {/* Unique Visitors (7d) */}
            <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-xl rounded-2xl p-6 border border-blue-300/30 shadow-xl animate-slide-up hover:scale-105 transition-transform duration-300" style={{animationDelay: '0.1s'}}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-blue-300 text-lg">Visitors (7d)</span>
                <span className="text-4xl">👋</span>
              </div>
              <div className="text-4xl font-bold text-white mb-1">
                {formatNumber(stats?.visitors?.unique7d || 0)}
              </div>
              <div className="text-sm text-blue-300">
                {stats?.visitors?.unique24h || 0} today
              </div>
            </div>

            {/* Page Views */}
            <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-xl rounded-2xl p-6 border border-green-300/30 shadow-xl animate-slide-up hover:scale-105 transition-transform duration-300" style={{animationDelay: '0.2s'}}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-green-300 text-lg">Page Views</span>
                <span className="text-4xl">📄</span>
              </div>
              <div className="text-4xl font-bold text-white mb-1">
                {formatNumber(stats?.pageViews?.total || 0)}
              </div>
              <div className="text-sm text-green-300">
                All time views
              </div>
            </div>

            {/* Active Users (24h) */}
            <div className="bg-gradient-to-br from-orange-500/20 to-red-500/20 backdrop-blur-xl rounded-2xl p-6 border border-orange-300/30 shadow-xl animate-slide-up hover:scale-105 transition-transform duration-300" style={{animationDelay: '0.3s'}}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-orange-300 text-lg">Active (24h)</span>
                <span className="text-4xl">🔥</span>
              </div>
              <div className="text-4xl font-bold text-white mb-1">
                {formatNumber(stats?.users?.active24h || 0)}
              </div>
              <div className="text-sm text-orange-300">
                {stats?.users?.active7d || 0} this week
              </div>
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Popular Pages */}
            <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 backdrop-blur-xl rounded-2xl p-6 border border-indigo-300/30 shadow-xl animate-slide-up" style={{animationDelay: '0.4s'}}>
              <h3 className="text-2xl font-bold text-white mb-4 flex items-center">
                <span className="mr-3">🔥</span>
                Popular Pages
              </h3>
              <div className="space-y-3">
                {stats?.charts?.popularPages?.slice(0, 8).map((page, index) => (
                  <div key={index} className="flex items-center justify-between bg-white/5 rounded-lg p-3 hover:bg-white/10 transition-colors">
                    <div className="flex-1 truncate">
                      <span className="text-purple-200 font-medium">{page._id}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="bg-purple-500/30 rounded-full px-3 py-1">
                        <span className="text-white font-bold">{page.views}</span>
                      </div>
                    </div>
                  </div>
                )) || <p className="text-purple-300 text-center py-4">No data available</p>}
              </div>
            </div>

            {/* User Registrations Chart */}
            <div className="bg-gradient-to-br from-pink-500/10 to-red-500/10 backdrop-blur-xl rounded-2xl p-6 border border-pink-300/30 shadow-xl animate-slide-up" style={{animationDelay: '0.5s'}}>
              <h3 className="text-2xl font-bold text-white mb-4 flex items-center">
                <span className="mr-3">📈</span>
                User Growth (30d)
              </h3>
              <div className="space-y-3">
                {stats?.charts?.registrationsOverTime?.slice(-7).map((item, index) => (
                  <div key={index} className="flex items-center justify-between bg-white/5 rounded-lg p-3">
                    <div className="flex-1">
                      <span className="text-pink-200 font-medium">{item._id}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-32 bg-pink-900/30 rounded-full h-2 overflow-hidden">
                        <div 
                          className="bg-gradient-to-r from-pink-500 to-red-500 h-full rounded-full"
                          style={{ width: `${Math.min(100, (item.count / 10) * 100)}%` }}
                        ></div>
                      </div>
                      <div className="bg-pink-500/30 rounded-full px-3 py-1 min-w-[3rem] text-center">
                        <span className="text-white font-bold">{item.count}</span>
                      </div>
                    </div>
                  </div>
                )) || <p className="text-pink-300 text-center py-4">No data available</p>}
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 backdrop-blur-xl rounded-2xl p-6 border border-cyan-300/30 shadow-xl animate-slide-up" style={{animationDelay: '0.6s'}}>
            <h3 className="text-2xl font-bold text-white mb-4 flex items-center">
              <span className="mr-3">⚡</span>
              Recent Activity
            </h3>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {activities?.map((activity, index) => (
                <div 
                  key={activity._id || index} 
                  className="flex items-start space-x-4 bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-colors"
                >
                  <div className="text-3xl">
                    {getEventIcon(activity.eventType)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <span className="text-cyan-200 font-semibold capitalize">
                        {activity.eventType.replace('_', ' ')}
                      </span>
                      {activity.userId && (
                        <span className="text-purple-300 text-sm">
                          by {activity.userId.username || 'User'}
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-gray-400 truncate mt-1">
                      {activity.pageUrl}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {formatDate(activity.timestamp)}
                    </div>
                  </div>
                </div>
              )) || <p className="text-cyan-300 text-center py-8">No recent activity</p>}
            </div>
          </div>

          {/* Refresh Button */}
          <div className="mt-8 text-center">
            <button
              onClick={fetchAnalytics}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-3 px-8 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
            >
              🔄 Refresh Analytics
            </button>
          </div>
        </div>
      </div>
    </GlowBackground>
  );
};

export default Analytics;
