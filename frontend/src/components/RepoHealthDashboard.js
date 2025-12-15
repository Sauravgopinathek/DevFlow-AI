import React, { useState, useEffect } from 'react';
import axios from 'axios';

const RepoHealthDashboard = ({ user }) => {
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRepo, setSelectedRepo] = useState(null);
  const [sortBy, setSortBy] = useState('health');
  const [filterBy, setFilterBy] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

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
    if (score >= 80) return 'health-excellent';
    if (score >= 60) return 'health-good';
    if (score >= 40) return 'health-fair';
    return 'health-poor';
  };

  const getHealthIcon = (score) => {
    if (score >= 80) return '🟢';
    if (score >= 60) return '🟡';
    if (score >= 40) return '🟠';
    return '🔴';
  };

  const filteredAndSortedRepos = repos
    .filter(repo => {
      const matchesSearch = repo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (repo.description && repo.description.toLowerCase().includes(searchTerm.toLowerCase()));
      
      if (filterBy === 'all') return matchesSearch;
      if (filterBy === 'no-readme') return matchesSearch && !repo.hasReadme;
      if (filterBy === 'inactive') {
        const daysSinceCommit = (new Date() - new Date(repo.lastCommitDate)) / (1000 * 60 * 60 * 24);
        return matchesSearch && daysSinceCommit > 90;
      }
      if (filterBy === 'high-issues') return matchesSearch && repo.openIssues > 5;
      return matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === 'health') return getHealthScore(b) - getHealthScore(a);
      if (sortBy === 'stars') return b.stars - a.stars;
      if (sortBy === 'updated') return new Date(b.lastCommitDate) - new Date(a.lastCommitDate);
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return 0;
    });

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
      <div className="card-enhanced">
        <div className="text-center py-12">
          <div className="text-6xl mb-6 animate-bounce">🔗</div>
          <h3 className="text-2xl font-bold gradient-text mb-4">Connect GitHub Account</h3>
          <p className="text-gray-300 text-lg">Sign in with GitHub to view your repository health dashboard</p>
          <div className="mt-8">
            <div className="inline-flex items-center px-6 py-3 bg-gray-700 rounded-full text-gray-300">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
              </svg>
              GitHub Integration Required
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="card-enhanced">
        <div className="flex flex-col items-center justify-center py-12">
          <div className="relative mb-6">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-600 border-t-gray-300"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-2xl">📊</div>
            </div>
          </div>
          <h3 className="text-xl font-bold gradient-text mb-2">Analyzing Repository Health</h3>
          <p className="text-gray-300 text-center">Fetching data from GitHub API...</p>
          <div className="mt-4 flex space-x-2">
            <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
            <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card-enhanced border-red-500/30">
        <div className="text-center py-12">
          <div className="text-6xl mb-6 animate-pulse">⚠️</div>
          <h3 className="text-2xl font-bold gradient-text-warning mb-4">Error Loading Repository Data</h3>
          <div className="bg-red-900/20 border border-red-500/30 rounded-xl p-4 mb-6 max-w-md mx-auto">
            <p className="text-red-300">{error}</p>
          </div>
          <button
            onClick={fetchRepoHealth}
            className="btn-danger"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="card-enhanced">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8 space-y-4 lg:space-y-0">
        <div>
          <h3 className="text-3xl font-bold gradient-text flex items-center mb-2">
            📊 Repository Health Dashboard
          </h3>
          <p className="text-gray-300">Monitor and improve your repository health scores</p>
        </div>
        <button
          onClick={fetchRepoHealth}
          className="btn-modern"
        >
          <svg 
            className="w-5 h-5 mr-2 transform group-hover:rotate-180 transition-transform duration-500" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh Data
        </button>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {/* Search */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search repositories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-input-modern pl-10"
          />
          <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        {/* Sort */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="form-input-modern"
        >
          <option value="health">Sort by Health Score</option>
          <option value="stars">Sort by Stars</option>
          <option value="updated">Sort by Last Updated</option>
          <option value="name">Sort by Name</option>
        </select>

        {/* Filter */}
        <select
          value={filterBy}
          onChange={(e) => setFilterBy(e.target.value)}
          className="form-input-modern"
        >
          <option value="all">All Repositories</option>
          <option value="no-readme">Missing README</option>
          <option value="inactive">Inactive (90+ days)</option>
          <option value="high-issues">High Issues (5+)</option>
        </select>
      </div>

      {/* Summary Stats */}
      {repos.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="stats-card-success">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">
                {repos.filter(repo => getHealthScore(repo) >= 80).length}
              </div>
              <div className="text-sm text-green-300">Excellent Health</div>
            </div>
          </div>
          <div className="stats-card">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">
                {repos.filter(repo => getHealthScore(repo) >= 60 && getHealthScore(repo) < 80).length}
              </div>
              <div className="text-sm text-blue-300">Good Health</div>
            </div>
          </div>
          <div className="stats-card-warning">
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-400">
                {repos.filter(repo => getHealthScore(repo) >= 40 && getHealthScore(repo) < 60).length}
              </div>
              <div className="text-sm text-yellow-300">Needs Attention</div>
            </div>
          </div>
          <div className="stats-card-danger">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-400">
                {repos.filter(repo => getHealthScore(repo) < 40).length}
              </div>
              <div className="text-sm text-red-300">Poor Health</div>
            </div>
          </div>
        </div>
      )}

      {filteredAndSortedRepos.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-6">
            {repos.length === 0 ? '📁' : '🔍'}
          </div>
          <h4 className="text-2xl font-bold gradient-text mb-4">
            {repos.length === 0 ? 'No Repositories Found' : 'No Matching Repositories'}
          </h4>
          <p className="text-gray-300 text-lg">
            {repos.length === 0 
              ? 'Create some repositories on GitHub to see health metrics here!' 
              : 'Try adjusting your search or filter criteria.'
            }
          </p>
          {repos.length === 0 && (
            <div className="mt-8">
              <a
                href="https://github.com/new"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-success"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Create New Repository
              </a>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {filteredAndSortedRepos.map((repo) => {
            const healthScore = getHealthScore(repo);
            const healthColor = getHealthColor(healthScore);
            const recommendations = getHealthRecommendations(repo);
            
            return (
              <div
                key={repo.id}
                className="card-enhanced hover:scale-[1.02] transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <h4 className="text-xl font-bold text-white">{repo.name}</h4>
                      <span className={`px-4 py-2 rounded-full text-sm font-bold flex items-center space-x-2 ${healthColor}`}>
                        <span>{getHealthIcon(healthScore)}</span>
                        <span>{healthScore}%</span>
                      </span>
                      {repo.private && (
                        <span className="px-3 py-1 bg-gray-700 text-gray-300 text-xs rounded-full flex items-center space-x-1">
                          <span>🔒</span>
                          <span>Private</span>
                        </span>
                      )}
                      {!repo.hasReadme && (
                        <span className="px-3 py-1 bg-red-900/30 border border-red-500/30 text-red-300 text-xs rounded-full flex items-center space-x-1">
                          <span>📝</span>
                          <span>No README</span>
                        </span>
                      )}
                    </div>
                    {repo.description && (
                      <p className="text-gray-300 mb-4 leading-relaxed">{repo.description}</p>
                    )}
                    <div className="flex items-center space-x-6 text-sm text-gray-400">
                      {repo.language && (
                        <span className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                          <span>{repo.language}</span>
                        </span>
                      )}
                      <span className="flex items-center space-x-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>Updated {formatDate(repo.lastCommitDate)}</span>
                      </span>
                      {repo.hasReadme && (
                        <span className="flex items-center space-x-1 text-green-400">
                          <span>📄</span>
                          <span>README</span>
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex space-x-3 ml-4">
                    <a
                      href={repo.htmlUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors group"
                      title="View on GitHub"
                    >
                      <svg className="w-5 h-5 text-gray-300 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                    {!repo.hasReadme && (
                      <button
                        onClick={() => setSelectedRepo(repo)}
                        className="p-2 bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors group"
                        title="Generate README"
                      >
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="stats-card text-center">
                    <div className="text-2xl font-bold text-blue-400 mb-1">{repo.stars}</div>
                    <div className="text-sm text-blue-300 flex items-center justify-center space-x-1">
                      <span>⭐</span>
                      <span>Stars</span>
                    </div>
                  </div>
                  <div className="stats-card text-center">
                    <div className="text-2xl font-bold text-green-400 mb-1">{repo.forks}</div>
                    <div className="text-sm text-green-300 flex items-center justify-center space-x-1">
                      <span>🍴</span>
                      <span>Forks</span>
                    </div>
                  </div>
                  <div className="stats-card text-center">
                    <div className="text-2xl font-bold text-yellow-400 mb-1">{repo.openIssues}</div>
                    <div className="text-sm text-yellow-300 flex items-center justify-center space-x-1">
                      <span>🐛</span>
                      <span>Open Issues</span>
                    </div>
                  </div>
                  <div className="stats-card text-center">
                    <div className="text-2xl font-bold text-purple-400 mb-1">{repo.closedIssues}</div>
                    <div className="text-sm text-purple-300 flex items-center justify-center space-x-1">
                      <span>✅</span>
                      <span>Closed Issues</span>
                    </div>
                  </div>
                </div>

                {/* Health Recommendations */}
                {recommendations.length > 0 && (
                  <div className="mt-6 pt-6 border-t border-gray-700">
                    <h5 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                      <span>💡</span>
                      <span>Health Recommendations</span>
                    </h5>
                    <div className="space-y-3">
                      {recommendations.slice(0, 3).map((rec, index) => (
                        <div key={index} className={`flex items-center space-x-3 text-sm p-3 rounded-xl border ${
                          rec.type === 'critical' ? 'bg-red-900/20 border-red-500/30 text-red-300' :
                          rec.type === 'warning' ? 'bg-yellow-900/20 border-yellow-500/30 text-yellow-300' :
                          'bg-blue-900/20 border-blue-500/30 text-blue-300'
                        }`}>
                          <span className="text-lg">{rec.icon}</span>
                          <span className="flex-1">{rec.text}</span>
                          {rec.type === 'critical' && (
                            <span className="px-2 py-1 bg-red-500 text-white text-xs rounded-full">
                              Critical
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Contributors */}
                {repo.contributors && repo.contributors.length > 0 && (
                  <div className="mt-6 pt-6 border-t border-gray-700">
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-semibold text-white flex items-center space-x-2">
                        <span>👥</span>
                        <span>Active Contributors ({repo.contributors.length})</span>
                      </span>
                      <div className="flex -space-x-3">
                        {repo.contributors.slice(0, 5).map((contributor, index) => (
                          <div key={contributor.id} className="relative group">
                            <img
                              src={contributor.avatar_url}
                              alt={contributor.login}
                              className="w-10 h-10 rounded-full border-3 border-gray-700 shadow-lg hover:border-gray-500 transition-all duration-300 hover:scale-110"
                              title={contributor.login}
                            />
                            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                              {contributor.login}
                            </div>
                          </div>
                        ))}
                        {repo.contributors.length > 5 && (
                          <div className="w-10 h-10 rounded-full bg-gray-700 border-3 border-gray-600 flex items-center justify-center text-xs font-bold text-gray-300 hover:bg-gray-600 transition-colors duration-300">
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