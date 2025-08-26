import React, { useState, useEffect } from 'react';
import axios from 'axios';

const RepoHealthDashboard = ({ user }) => {
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRepo, setSelectedRepo] = useState(null);

  useEffect(() => {
    if (user) {
      fetchRepoHealth();
    }
  }, [user]);

  const fetchRepoHealth = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching repo health data...');
      const response = await axios.get('/api/github/repo-health');
      console.log('Repo health response:', response.data);
      setRepos(response.data.repos || []);
    } catch (error) {
      console.error('Error fetching repo health:', error);
      setError(error.response?.data?.error || 'Failed to fetch repository health data');
    } finally {
      setLoading(false);
    }
  };

  const getHealthScore = (repo) => {
    let score = 0;
    const now = new Date();
    const lastCommit = new Date(repo.lastCommitDate);
    const daysSinceCommit = (now - lastCommit) / (1000 * 60 * 60 * 24);

    // Recent activity (35 points max)
    if (daysSinceCommit <= 7) score += 35;
    else if (daysSinceCommit <= 30) score += 25;
    else if (daysSinceCommit <= 90) score += 15;
    else if (daysSinceCommit <= 365) score += 5;
    else score += 0;

    // Documentation (25 points max)
    if (repo.hasReadme) score += 25;
    else score += 0;

    // Issue management (25 points max)
    const totalIssues = repo.openIssues + repo.closedIssues;
    if (totalIssues > 0) {
      const closedRatio = repo.closedIssues / totalIssues;
      score += Math.round(closedRatio * 25);
    } else {
      score += 12; // No issues is neutral
    }

    // Community engagement (15 points max)
    const starScore = Math.min(repo.stars, 50) / 50 * 8;
    const forkScore = Math.min(repo.forks, 25) / 25 * 7;
    score += Math.round(starScore + forkScore);

    return Math.min(score, 100);
  };

  const getHealthRecommendations = (repo) => {
    const recommendations = [];
    const now = new Date();
    const lastCommit = new Date(repo.lastCommitDate);
    const daysSinceCommit = (now - lastCommit) / (1000 * 60 * 60 * 24);

    if (!repo.hasReadme) {
      recommendations.push({ type: 'critical', text: 'Add a README.md file', icon: '📝' });
    }
    if (daysSinceCommit > 90) {
      recommendations.push({ type: 'warning', text: 'Repository needs recent commits', icon: '🔄' });
    }
    if (repo.openIssues > 10) {
      recommendations.push({ type: 'info', text: 'Consider addressing open issues', icon: '🐛' });
    }
    if (repo.stars === 0 && !repo.private) {
      recommendations.push({ type: 'info', text: 'Promote your repository for visibility', icon: '⭐' });
    }
    if (repo.contributors.length === 0) {
      recommendations.push({ type: 'info', text: 'Encourage community contributions', icon: '👥' });
    }

    return recommendations;
  };

  const getHealthColor = (score) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    if (score >= 40) return 'text-orange-600 bg-orange-100';
    return 'text-red-600 bg-red-100';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 30) return `${diffDays} days ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
  };

  if (!user) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-8 shadow-lg">
        <div className="text-center py-8">
          <div className="text-4xl mb-4">🔗</div>
          <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2">Connect GitHub Account</h3>
          <p className="text-gray-600 dark:text-gray-400">Sign in with GitHub to view your repository health dashboard</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-8 shadow-lg">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 dark:border-blue-400 mr-3"></div>
          <span className="text-gray-600 dark:text-gray-400">Loading repository health data...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-8 shadow-lg">
        <div className="text-center py-8">
          <div className="text-4xl mb-4">⚠️</div>
          <h3 className="text-xl font-bold text-red-800 dark:text-red-400 mb-2">Error Loading Data</h3>
          <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
          <button
            onClick={fetchRepoHealth}
            className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-8 shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200 flex items-center">
          📊 Repository Health Dashboard
        </h3>
        <button
          onClick={fetchRepoHealth}
          className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-bold px-6 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="relative flex items-center justify-center space-x-2">
            <svg 
              className="w-4 h-4 text-white transform group-hover:rotate-180 transition-transform duration-500" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span className="font-semibold">Refresh Health Data</span>
          </div>
        </button>
      </div>

      {repos.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-4xl mb-4">📁</div>
          <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">No Repositories Found</h4>
          <p className="text-gray-600 dark:text-gray-400">Create some repositories on GitHub to see health metrics here!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {repos.map((repo) => {
            const healthScore = getHealthScore(repo);
            const healthColor = getHealthColor(healthScore);
            const recommendations = getHealthRecommendations(repo);
            
            return (
              <div
                key={repo.id}
                className="bg-white dark:bg-gray-800 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-500 transition-all duration-300 p-6 shadow-lg hover:shadow-xl"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h4 className="text-xl font-bold text-gray-800 dark:text-gray-200">{repo.name}</h4>
                      <span className={`px-3 py-1 rounded-full text-sm font-bold ${healthColor}`}>
                        {healthScore}% Health
                      </span>
                      {repo.private && (
                        <span className="px-2 py-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-full">
                          🔒 Private
                        </span>
                      )}
                      {!repo.hasReadme && (
                        <span className="px-2 py-1 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300 text-xs rounded-full">
                          📝 No README
                        </span>
                      )}
                    </div>
                    {repo.description && (
                      <p className="text-gray-600 dark:text-gray-400 mb-3">{repo.description}</p>
                    )}
                    <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                      {repo.language && (
                        <span className="flex items-center">
                          <div className="w-3 h-3 bg-blue-500 rounded-full mr-1"></div>
                          {repo.language}
                        </span>
                      )}
                      <span>Updated {formatDate(repo.lastCommitDate)}</span>
                      {repo.hasReadme && (
                        <span className="text-green-600 dark:text-green-400">📄 README</span>
                      )}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <a
                      href={repo.htmlUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300 transition-colors"
                      title="View on GitHub"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                    {!repo.hasReadme && (
                      <button
                        onClick={() => setSelectedRepo(repo)}
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
                        title="Generate README"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{repo.stars}</div>
                    <div className="text-sm text-blue-800 dark:text-blue-300">⭐ Stars</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">{repo.forks}</div>
                    <div className="text-sm text-green-800 dark:text-green-300">🍴 Forks</div>
                  </div>
                  <div className="text-center p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{repo.openIssues}</div>
                    <div className="text-sm text-yellow-800 dark:text-yellow-300">🐛 Open Issues</div>
                  </div>
                  <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{repo.closedIssues}</div>
                    <div className="text-sm text-purple-800 dark:text-purple-300">✅ Closed Issues</div>
                  </div>
                </div>

                {/* Health Recommendations */}
                {recommendations.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                    <h5 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">💡 Recommendations</h5>
                    <div className="space-y-2">
                      {recommendations.slice(0, 3).map((rec, index) => (
                        <div key={index} className={`flex items-center space-x-2 text-xs p-2 rounded-lg ${
                          rec.type === 'critical' ? 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300' :
                          rec.type === 'warning' ? 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300' :
                          'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                        }`}>
                          <span>{rec.icon}</span>
                          <span>{rec.text}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Contributors */}
                {repo.contributors && repo.contributors.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                        👥 Active Contributors ({repo.contributors.length})
                      </span>
                      <div className="flex -space-x-2">
                        {repo.contributors.slice(0, 5).map((contributor, index) => (
                          <img
                            key={contributor.id}
                            src={contributor.avatar_url}
                            alt={contributor.login}
                            className="w-8 h-8 rounded-full border-2 border-white dark:border-gray-800 shadow-sm"
                            title={contributor.login}
                          />
                        ))}
                        {repo.contributors.length > 5 && (
                          <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-600 border-2 border-white dark:border-gray-800 flex items-center justify-center text-xs font-bold text-gray-600 dark:text-gray-300">
                            +{repo.contributors.length - 5}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default RepoHealthDashboard;