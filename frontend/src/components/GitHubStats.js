import React, { useState, useEffect } from 'react';
import axios from 'axios';

const GitHubStats = () => {
  const [stats, setStats] = useState(null);
  const [repositories, setRepositories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchGitHubData();
    // Set up auto-refresh every 5 minutes
    const interval = setInterval(fetchGitHubData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const fetchGitHubData = async () => {
    try {
      const [statsResponse, reposResponse] = await Promise.all([
        axios.get('/api/github/stats'),
        axios.get('/api/github/repositories')
      ]);
      
      setStats(statsResponse.data.stats);
      setRepositories(reposResponse.data.repositories.slice(0, 5));
      setError(null);
    } catch (error) {
      console.error('Failed to fetch GitHub data:', error);
      setError('Failed to load GitHub data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="card-colorful animate-slide-up">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
          <span className="ml-3 text-gray-600">Loading GitHub stats...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card-colorful animate-slide-up">
        <div className="text-center py-8">
          <div className="text-red-500 mb-4">⚠️ {error}</div>
          <button
            onClick={fetchGitHubData}
            className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold px-4 py-2 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            🔄 Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="card-colorful animate-slide-up">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold gradient-text flex items-center">
          🐙 GitHub Overview
        </h3>
        <button
          onClick={fetchGitHubData}
          className="bg-gradient-to-r from-indigo-500 via-blue-500 to-cyan-500 hover:from-indigo-600 hover:via-blue-600 hover:to-cyan-600 text-white font-bold px-6 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="relative flex items-center justify-center space-x-2">
            <div className="bg-blue-500 rounded-md p-1 flex items-center justify-center">
              <svg 
                className="w-4 h-4 text-white transform group-hover:rotate-180 transition-transform duration-500" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
            <span className="font-semibold">Refresh</span>
            <svg 
              className="w-4 h-4 transform group-hover:rotate-180 transition-transform duration-500" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </div>
        </button>
      </div>

      {/* GitHub Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border border-blue-200">
          <div className="text-2xl font-bold text-blue-600">{stats?.repositories || 0}</div>
          <div className="text-sm text-gray-600">Repositories</div>
        </div>
        <div className="text-center p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
          <div className="text-2xl font-bold text-orange-600">{stats?.totalStars || 0}</div>
          <div className="text-sm text-gray-600">Total Stars</div>
        </div>
        <div className="text-center p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
          <div className="text-2xl font-bold text-green-600">{stats?.totalForks || 0}</div>
          <div className="text-sm text-gray-600">Total Forks</div>
        </div>
        <div className="text-center p-4 bg-gradient-to-r from-red-50 to-pink-50 rounded-lg border border-red-200">
          <div className="text-2xl font-bold text-red-600">{stats?.openIssues || 0}</div>
          <div className="text-sm text-gray-600">Open Issues</div>
        </div>
      </div>

      {/* Top Repositories */}
      <div>
        <h4 className="text-lg font-semibold text-gray-800 mb-4">🏆 Top Repositories</h4>
        {repositories.length > 0 ? (
          <div className="space-y-3">
            {repositories.map((repo) => (
              <div
                key={repo.id}
                className="p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg border border-gray-200 hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <a
                        href={repo.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-semibold text-gray-900 hover:text-blue-600 transition-colors"
                      >
                        {repo.name}
                      </a>
                      {repo.private && (
                        <span className="ml-2 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                          Private
                        </span>
                      )}
                    </div>
                    {repo.description && (
                      <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                        {repo.description}
                      </p>
                    )}
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      {repo.language && (
                        <span className="flex items-center">
                          <div className="w-3 h-3 bg-blue-500 rounded-full mr-1"></div>
                          {repo.language}
                        </span>
                      )}
                      <span className="flex items-center">
                        ⭐ {repo.stars}
                      </span>
                      <span className="flex items-center">
                        🍴 {repo.forks}
                      </span>
                      {repo.openIssues > 0 && (
                        <span className="flex items-center">
                          🐛 {repo.openIssues}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6">
            <div className="text-gray-500 mb-2">📁</div>
            <p className="text-gray-600">No repositories found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GitHubStats;