import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AIReadmeGenerator from './AIReadmeGenerator';

const RepositoryList = ({ user }) => {
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRepo, setSelectedRepo] = useState(null);
  const [showReadmeGenerator, setShowReadmeGenerator] = useState(false);

  useEffect(() => {
    if (user) {
      fetchRepositories();
    }
  }, [user]);

  const fetchRepositories = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching repositories...');
      const response = await axios.get('/api/github/repositories');
      console.log('Repositories response:', response.data);
      setRepos(response.data.repositories || []);
    } catch (error) {
      console.error('Error fetching repositories:', error);
      setError(error.response?.data?.error || 'Failed to fetch repositories');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateReadme = (repo) => {
    setSelectedRepo(repo);
    setShowReadmeGenerator(true);
  };

  const closeReadmeGenerator = () => {
    setShowReadmeGenerator(false);
    setSelectedRepo(null);
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
      <div className="card-colorful">
        <div className="text-center py-8">
          <div className="text-4xl mb-4">🔗</div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Connect GitHub Account</h3>
          <p className="text-gray-600">Sign in with GitHub to view and manage your repositories</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="card-colorful">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mr-3"></div>
          <span className="text-gray-600">Loading repositories...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card-colorful">
        <div className="text-center py-8">
          <div className="text-4xl mb-4">⚠️</div>
          <h3 className="text-xl font-bold text-red-800 mb-2">Error Loading Repositories</h3>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchRepositories}
            className="bg-gray-600 dark:bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-700 dark:hover:bg-gray-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="card-colorful">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold gradient-text flex items-center">
            📁 Your Repositories
          </h3>
          <button
            onClick={fetchRepositories}
            className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-bold px-6 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative flex items-center justify-center space-x-2">
              <div className="bg-gray-600 dark:bg-gray-400 rounded-md p-1 flex items-center justify-center">
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

        {repos.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-4xl mb-4">📁</div>
            <h4 className="text-lg font-semibold text-gray-800 mb-2">No Repositories Found</h4>
            <p className="text-gray-600">Create some repositories on GitHub to see them here!</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {repos.map((repo) => (
              <div
                key={repo.id}
                className="card-enhanced hover:scale-[1.02] transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <h4 className="text-xl font-bold text-white truncate">{repo.name}</h4>
                      {repo.private && (
                        <span className="px-3 py-1 bg-gray-700 text-gray-300 text-xs rounded-full flex items-center space-x-1">
                          <span>🔒</span>
                          <span>Private</span>
                        </span>
                      )}
                    </div>
                    {repo.description && (
                      <p className="text-gray-300 text-sm mb-4 line-clamp-2 leading-relaxed">{repo.description}</p>
                    )}
                  </div>
                  <a
                    href={repo.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors group ml-4"
                    title="View on GitHub"
                  >
                    <svg className="w-5 h-5 text-gray-300 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-400 mb-6">
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
                    <span>Updated {formatDate(repo.updated_at)}</span>
                  </span>
                </div>

                {/* Repository Stats Boxes */}
                <div className="grid grid-cols-4 gap-3 mb-6">
                  <div className="stats-card text-center">
                    <div className="text-lg font-bold text-blue-400 mb-1">{repo.stargazers_count || 0}</div>
                    <div className="text-xs text-blue-300 flex items-center justify-center space-x-1">
                      <span>⭐</span>
                      <span>Stars</span>
                    </div>
                  </div>
                  <div className="stats-card text-center">
                    <div className="text-lg font-bold text-green-400 mb-1">{repo.forks_count || 0}</div>
                    <div className="text-xs text-green-300 flex items-center justify-center space-x-1">
                      <span>🍴</span>
                      <span>Forks</span>
                    </div>
                  </div>
                  <div className="stats-card text-center">
                    <div className="text-lg font-bold text-yellow-400 mb-1">{repo.open_issues_count || 0}</div>
                    <div className="text-xs text-yellow-300 flex items-center justify-center space-x-1">
                      <span>📋</span>
                      <span>Issues</span>
                    </div>
                  </div>
                  <div className="stats-card text-center">
                    <div className="text-lg font-bold text-gray-400 mb-1">{repo.closed_issues_count || 0}</div>
                    <div className="text-xs text-gray-300 flex items-center justify-center space-x-1">
                      <span>✅</span>
                      <span>Closed</span>
                    </div>
                  </div>
                </div>

                {repo.hasReadme && (
                  <div className="mb-6 text-center">
                    <span className="text-green-300 text-sm font-semibold bg-green-900/30 border border-green-500/30 px-3 py-2 rounded-full flex items-center justify-center space-x-2 max-w-fit mx-auto">
                      <span>📄</span>
                      <span>Has README</span>
                    </span>
                  </div>
                )}

                <button
                  onClick={() => handleGenerateReadme(repo)}
                  className={`w-full font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl ${
                    repo.hasReadme 
                      ? 'btn-success' 
                      : 'btn-modern bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
                  } relative overflow-hidden group`}
                >
                  <div className="relative flex items-center justify-center space-x-3">
                    <span className="text-xl">
                      {repo.hasReadme ? '✨' : '🤖'}
                    </span>
                    <span className="font-semibold text-lg">
                      {repo.hasReadme ? 'Enhance README' : 'Generate README'}
                    </span>
                    <svg 
                      className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </div>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {showReadmeGenerator && selectedRepo && (
        <AIReadmeGenerator
          repo={selectedRepo}
          onClose={closeReadmeGenerator}
        />
      )}
    </>
  );
};

export default RepositoryList;