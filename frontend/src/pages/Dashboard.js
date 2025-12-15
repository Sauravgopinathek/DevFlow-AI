import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useSettings } from '../contexts/SettingsContext';
import axios from 'axios';
import RepoHealthDashboard from '../components/RepoHealthDashboard';
import RepositoryList from '../components/RepositoryList';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const { settings } = useSettings();
  
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    repositories: 0,
    openIssues: 0,
    pullRequests: 0,
    totalStars: 0,
    totalForks: 0
  });
  const [actionLoading, setActionLoading] = useState(null);
  const [message, setMessage] = useState(null);
  const [repositories, setRepositories] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [showFollowers, setShowFollowers] = useState(false);
  const [showFollowing, setShowFollowing] = useState(false);
  const [showDeleteRepo, setShowDeleteRepo] = useState(false);
  const [repoToDelete, setRepoToDelete] = useState('');

  useEffect(() => {
    fetchProfile();
    fetchGitHubStats();
    fetchRecentActivity();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await axios.get('/api/user/profile');
      console.log('Profile loaded:', response.data);
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchGitHubStats = async () => {
    try {
      const response = await axios.get('/api/github/stats');
      setStats(response.data.stats);
    } catch (error) {
      console.error('Failed to fetch GitHub stats:', error);
      setStats({
        repositories: 0,
        openIssues: 0,
        pullRequests: 0,
        totalStars: 0,
        totalForks: 0
      });
    }
  };

  const fetchRepositories = async () => {
    try {
      const response = await axios.get('/api/github/repositories');
      setRepositories(response.data.repositories.slice(0, 5));
    } catch (error) {
      console.error('Failed to fetch repositories:', error);
    }
  };

  const fetchFollowers = async () => {
    setActionLoading('followers');
    try {
      const response = await axios.get('/api/github/followers');
      setFollowers(response.data.followers);
      setShowFollowers(true);
    } catch (error) {
      console.error('Failed to fetch followers:', error);
      setMessage({ type: 'error', text: 'Failed to fetch followers' });
    } finally {
      setActionLoading(null);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const fetchFollowing = async () => {
    setActionLoading('following');
    try {
      const response = await axios.get('/api/github/following');
      setFollowing(response.data.following);
      setShowFollowing(true);
    } catch (error) {
      console.error('Failed to fetch following:', error);
      setMessage({ type: 'error', text: 'Failed to fetch following' });
    } finally {
      setActionLoading(null);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handleDeleteRepository = async () => {
    if (!repoToDelete.trim()) {
      setMessage({ type: 'error', text: 'Please enter a repository name' });
      setTimeout(() => setMessage(null), 3000);
      return;
    }

    // Enhanced confirmation with repository name
    const confirmMessage = `Are you sure you want to delete the repository "${repoToDelete}"?\n\nThis action cannot be undone and will permanently delete:\n• All code and files\n• All issues and pull requests\n• All commit history\n• All releases and tags\n\nType "DELETE" to confirm:`;
    
    const confirmation = window.prompt(confirmMessage);
    if (confirmation !== 'DELETE') {
      setMessage({ type: 'info', text: 'Repository deletion cancelled' });
      setTimeout(() => setMessage(null), 3000);
      return;
    }

    setActionLoading('deleteRepo');
    try {
      const [owner, repo] = repoToDelete.includes('/') 
        ? repoToDelete.split('/') 
        : [user.username, repoToDelete];

      await axios.delete(`/api/github/repositories/${owner}/${repo}`);
      
      setMessage({ 
        type: 'success', 
        text: `✅ Repository ${owner}/${repo} deleted successfully! Refreshing data...` 
      });
      
      setRepoToDelete('');
      setShowDeleteRepo(false);
      
      // Refresh data after successful deletion
      await Promise.all([
        fetchRepositories(),
        fetchGitHubStats()
      ]);
      
    } catch (error) {
      console.error('Failed to delete repository:', error);
      
      let errorMessage = 'Failed to delete repository';
      if (error.response?.status === 404) {
        errorMessage = `Repository "${repoToDelete}" not found. Please check the name and try again.`;
      } else if (error.response?.status === 403) {
        errorMessage = `You don't have permission to delete "${repoToDelete}". You can only delete repositories you own.`;
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      }
      
      setMessage({ type: 'error', text: `❌ ${errorMessage}` });
    } finally {
      setActionLoading(null);
      setTimeout(() => setMessage(null), 8000);
    }
  };

  const fetchRecentActivity = async () => {
    try {
      const [issuesResponse, prsResponse] = await Promise.all([
        axios.get('/api/github/issues'),
        axios.get('/api/github/pull-requests')
      ]);

      const recentIssues = issuesResponse.data.issues.slice(0, 2).map(issue => ({
        type: 'issue',
        title: `Opened issue: ${issue.title}`,
        time: new Date(issue.createdAt).toLocaleDateString(),
        url: issue.url,
        repository: issue.repository.name
      }));

      const recentPRs = prsResponse.data.pullRequests.slice(0, 2).map(pr => ({
        type: 'pr',
        title: `${pr.state === 'open' ? 'Opened' : 'Updated'} PR: ${pr.title}`,
        time: new Date(pr.updatedAt).toLocaleDateString(),
        url: pr.url,
        repository: pr.repository.name
      }));

      setRecentActivity([...recentIssues, ...recentPRs].slice(0, 3));
    } catch (error) {
      console.error('Failed to fetch recent activity:', error);
      setRecentActivity([
        {
          type: 'github',
          title: 'Connected GitHub account',
          time: 'Just now',
          url: null
        }
      ]);
    }
  };

  const handleSyncGitHubIssues = async () => {
    setActionLoading('sync');
    setMessage(null);
    
    try {
      const response = await axios.post('/api/github/sync-issues');
      setMessage({ 
        type: 'success', 
        text: `Synced ${response.data.syncedCount} GitHub issues with calendar!` 
      });
      
      await fetchGitHubStats();
      await fetchRecentActivity();
    } catch (error) {
      console.error('Sync error:', error);
      setMessage({ 
        type: 'error', 
        text: 'Failed to sync GitHub issues. Please check your GitHub connection.' 
      });
    } finally {
      setActionLoading(null);
      setTimeout(() => setMessage(null), 5000);
    }
  };

  const handleCreateWorkflow = async () => {
    setActionLoading('workflow');
    setMessage(null);
    
    try {
      const response = await axios.post('/api/github/create-workflow', {
        workflowType: 'github-calendar-sync',
        settings: {
          syncIssues: true,
          syncPullRequests: true,
          createDeadlines: true
        }
      });
      
      setMessage({ 
        type: 'success', 
        text: `Created workflow: ${response.data.workflow.name}` 
      });
    } catch (error) {
      console.error('Workflow error:', error);
      setMessage({ 
        type: 'error', 
        text: 'Failed to create workflow. Please try again.' 
      });
    } finally {
      setActionLoading(null);
      setTimeout(() => setMessage(null), 5000);
    }
  };

  const handleViewAnalytics = async () => {
    setActionLoading('analytics');
    setMessage(null);
    
    try {
      await fetchGitHubStats();
      await fetchRepositories();
      
      setMessage({ 
        type: 'info', 
        text: `Analytics: ${stats.repositories} repos, ${stats.totalStars} stars, ${stats.openIssues} open issues` 
      });
    } catch (error) {
      console.error('Analytics error:', error);
      setMessage({ 
        type: 'error', 
        text: 'Failed to load analytics. Please try again.' 
      });
    } finally {
      setActionLoading(null);
      setTimeout(() => setMessage(null), 5000);
    }
  };

  const handleViewGitHub = () => {
    window.open(`https://github.com/${user.username}`, '_blank');
    setMessage({ type: 'info', text: 'Opening your GitHub profile...' });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleRepositoriesClick = async () => {
    setActionLoading('repositories');
    try {
      await fetchRepositories();
      window.open(`https://github.com/${user.username}?tab=repositories`, '_blank');
      setMessage({ type: 'info', text: `Viewing your ${stats.repositories} repositories...` });
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to load repositories' });
    } finally {
      setActionLoading(null);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handleIssuesClick = async () => {
    setActionLoading('issues');
    try {
      const response = await axios.get('/api/github/issues');
      const issues = response.data.issues;
      window.open(`https://github.com/issues?q=is%3Aopen+is%3Aissue+author%3A${user.username}`, '_blank');
      setMessage({ 
        type: 'info', 
        text: `Found ${issues.length} open issues across your repositories` 
      });
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to load issues' });
    } finally {
      setActionLoading(null);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handlePullRequestsClick = async () => {
    setActionLoading('pullRequests');
    try {
      const response = await axios.get('/api/github/pull-requests');
      const prs = response.data.pullRequests;
      window.open(`https://github.com/pulls?q=is%3Apr+author%3A${user.username}`, '_blank');
      setMessage({ 
        type: 'info', 
        text: `Found ${prs.length} pull requests you've created` 
      });
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to load pull requests' });
    } finally {
      setActionLoading(null);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-20 w-20 border-b-4 border-purple-600 mx-auto mb-6"></div>
          <p className="text-xl font-bold text-white">Loading your dashboard</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        

        
        {/* Message Display */}
        {message && (
          <div className={`mb-6 px-6 py-4 rounded-xl shadow-lg ${
            message.type === 'success' 
              ? 'bg-green-100 border-2 border-green-300 text-green-800' 
              : message.type === 'error'
              ? 'bg-red-100 border-2 border-red-300 text-red-800'
              : 'bg-gray-700 border-2 border-gray-600 text-gray-200'
          }`}>
            <div className="flex items-center">
              <div className="flex-1 font-semibold text-lg">
                {message.text}
              </div>
              <button 
                onClick={() => setMessage(null)}
                className="ml-4 text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="mb-16">
          <div className="flex items-center space-x-6 mb-6">
            <img 
              src={user.avatarUrl} 
              alt={user.username}
              className="w-20 h-20 rounded-full ring-4 ring-purple-300 shadow-lg"
            />
            <div>
              <h1 className="text-4xl font-bold text-white">
                Welcome back, {user.displayName}!
              </h1>
              <p className="mt-3 text-lg text-gray-300">
                Logged in as <span className="font-semibold text-white">@{user.username}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Refresh Button */}
        <div className="flex justify-end mb-6">
          <button
            onClick={() => {
              fetchGitHubStats();
              fetchRecentActivity();
              setMessage({ type: 'info', text: 'Refreshing GitHub data...' });
              setTimeout(() => setMessage(null), 2000);
            }}
            className="bg-gray-600 hover:bg-gray-500 text-white font-bold px-6 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            <div className="flex items-center justify-center space-x-2">
              <svg 
                className="w-4 h-4 text-white" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span className="font-semibold">Refresh Data</span>
            </div>
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <button 
            onClick={handleRepositoriesClick}
            disabled={actionLoading === 'repositories'}
            className="p-6 hover:shadow-lg transition-all duration-300 cursor-pointer disabled:opacity-50 rounded-2xl border bg-gray-800 border-gray-700"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-lg font-semibold text-gray-300">Repositories</p>
                <p className="text-3xl font-bold text-white">{stats.repositories}</p>
              </div>
              <div className="w-12 h-12 bg-gray-600 rounded-lg flex items-center justify-center">
                {actionLoading === 'repositories' ? (
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                ) : (
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                )}
              </div>
            </div>
          </button>

          <button 
            onClick={handleIssuesClick}
            disabled={actionLoading === 'issues'}
            className="p-6 hover:shadow-lg transition-all duration-300 cursor-pointer disabled:opacity-50 rounded-2xl border bg-gray-800 border-gray-700"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-lg font-semibold text-gray-300">Open Issues</p>
                <p className="text-3xl font-bold text-white">{stats.openIssues}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-500 rounded-lg flex items-center justify-center">
                {actionLoading === 'issues' ? (
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                ) : (
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                )}
              </div>
            </div>
          </button>

          <button 
            onClick={handlePullRequestsClick}
            disabled={actionLoading === 'pullRequests'}
            className="p-6 hover:shadow-lg transition-all duration-300 cursor-pointer disabled:opacity-50 rounded-2xl border bg-gray-800 border-gray-700"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-lg font-semibold text-gray-300">Pull Requests</p>
                <p className="text-3xl font-bold text-white">{stats.pullRequests}</p>
              </div>
              <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                {actionLoading === 'pullRequests' ? (
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                ) : (
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                  </svg>
                )}
              </div>
            </div>
          </button>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mb-16">
          {/* Profile Card */}
          <div className="p-8 rounded-2xl border bg-gray-800 border-gray-700">
            <div className="text-center mb-8">
              <img 
                src={user.avatarUrl} 
                alt={user.username}
                className="w-24 h-24 rounded-full mx-auto mb-6 ring-4 ring-purple-300 shadow-lg"
              />
              <h3 className="text-2xl font-bold text-white">{user.displayName}</h3>
              <p className="font-semibold text-lg text-gray-300">@{user.username}</p>
              {user.email && (
                <p className="mt-2 text-gray-400">{user.email}</p>
              )}
            </div>
            
            <div className="space-y-4">
              <button 
                onClick={handleViewGitHub}
                className="w-full flex justify-between items-center p-4 rounded-lg border hover:shadow-lg transition-all duration-300 bg-gray-700 border-gray-600"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-gray-600 text-white rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-lg font-semibold text-white">GitHub</span>
                </div>
                <div className="px-3 py-1 bg-green-500 text-white text-sm rounded-full font-medium">
                  Connected
                </div>
              </button>

              <button 
                onClick={() => window.open(`https://github.com/${user.username}?tab=repositories`, '_blank')}
                className="w-full flex justify-between items-center p-4 rounded-lg border hover:shadow-lg transition-all duration-300 bg-gray-700 border-gray-600"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-gray-600 text-white rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                  <span className="text-lg font-semibold text-white">My Repositories</span>
                </div>
                <div className="px-3 py-1 bg-gray-600 text-white text-sm rounded-full font-medium">
                  {stats.repositories} repos
                </div>
              </button>

              <button 
                onClick={() => window.open(`https://github.com/issues?q=is%3Aopen+is%3Aissue+author%3A${user.username}`, '_blank')}
                className="w-full flex justify-between items-center p-4 rounded-lg border hover:shadow-lg transition-all duration-300 bg-gray-700 border-gray-600"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-yellow-500 text-white rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                  </div>
                  <span className="text-lg font-semibold text-white">My Issues</span>
                </div>
                <div className="px-3 py-1 bg-yellow-500 text-white text-sm rounded-full font-medium">
                  {stats.openIssues} open
                </div>
              </button>

              <button 
                onClick={fetchFollowers}
                disabled={actionLoading === 'followers'}
                className="w-full flex justify-between items-center p-4 rounded-lg border hover:shadow-lg transition-all duration-300 disabled:opacity-50 bg-gray-700 border-gray-600"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-gray-600 text-white rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <span className="text-lg font-semibold text-white">Followers</span>
                </div>
                {actionLoading === 'followers' ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-purple-500"></div>
                ) : (
                  <div className="px-3 py-1 bg-gray-600 text-white text-sm rounded-full font-medium">
                    View
                  </div>
                )}
              </button>

              <button 
                onClick={fetchFollowing}
                disabled={actionLoading === 'following'}
                className="w-full flex justify-between items-center p-4 rounded-lg border hover:shadow-lg transition-all duration-300 disabled:opacity-50 bg-gray-700 border-gray-600"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-gray-600 text-white rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </div>
                  <span className="text-lg font-semibold text-white">Following</span>
                </div>
                {actionLoading === 'following' ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-pink-500"></div>
                ) : (
                  <div className="px-3 py-1 bg-gray-600 text-white text-sm rounded-full font-medium">
                    View
                  </div>
                )}
              </button>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="p-8 rounded-2xl border bg-gray-800 border-gray-700">
            <h3 className="text-2xl font-bold mb-8 text-center text-white">Quick Actions</h3>
            <div className="space-y-4">
              <button 
                onClick={() => window.open(`https://github.com/new`, '_blank')}
                className="w-full text-left p-4 rounded-lg border border-gray-600 bg-gray-700 hover:bg-gray-600 transition-all duration-300 hover:shadow-lg"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-gray-600 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-bold text-white">Create New Repository</div>
                    <div className="text-gray-300 text-sm">Start a new project on GitHub</div>
                  </div>
                </div>
              </button>

              <button 
                onClick={() => window.open(`https://github.com/copilot`, '_blank')}
                className="w-full text-left p-4 rounded-lg border border-gray-600 bg-gray-700 hover:bg-gray-600 transition-all duration-300 hover:shadow-lg"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-gray-600 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-bold text-white">GitHub Copilot</div>
                    <div className="text-gray-300 text-sm">AI-powered code completion</div>
                  </div>
                </div>
              </button>

              <button 
                onClick={() => window.open(`https://education.github.com/pack`, '_blank')}
                className="w-full text-left p-4 rounded-lg border border-gray-600 bg-gray-700 hover:bg-gray-600 transition-all duration-300 hover:shadow-lg"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-bold text-white">GitHub Student Pack</div>
                    <div className="text-gray-300 text-sm">Free developer tools worth $200k+</div>
                  </div>
                </div>
              </button>

              <button 
                onClick={() => window.open(`https://github.com/codespaces`, '_blank')}
                className="w-full text-left p-4 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-all duration-300 hover:shadow-lg"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-indigo-500 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-bold text-gray-900 dark:text-white">GitHub Codespaces</div>
                    <div className="text-gray-600 dark:text-gray-300 text-sm">Cloud development environment</div>
                  </div>
                </div>
              </button>

              <button 
                onClick={() => window.open(`https://github.com/explore`, '_blank')}
                className="w-full text-left p-4 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-all duration-300 hover:shadow-lg"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-bold text-gray-900 dark:text-white">Explore</div>
                    <div className="text-gray-600 dark:text-gray-300 text-sm">Discover trending repositories and topics</div>
                  </div>
                </div>
              </button>

              <button 
                onClick={() => window.open(`https://github.com/pulls?q=is%3Apr+author%3A${user.username}`, '_blank')}
                className="w-full text-left p-4 rounded-lg border border-themed bg-themed-secondary hover:bg-themed-tertiary transition-all duration-300 hover:shadow-lg"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-bold text-themed-primary">My Pull Requests</div>
                    <div className="text-themed-secondary text-sm">View your pull requests</div>
                  </div>
                </div>
              </button>

              <button 
                onClick={() => setShowDeleteRepo(true)}
                className="w-full text-left p-4 rounded-lg border border-gray-600 bg-gray-700 hover:bg-gray-600 transition-all duration-300 hover:shadow-lg"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-bold text-white">Delete Repository</div>
                    <div className="text-gray-300 text-sm">Permanently delete a repository</div>
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="p-8 rounded-2xl border bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <h3 className="text-2xl font-bold mb-8 text-center text-gray-900 dark:text-white">Recent Activity</h3>
            <div className="space-y-4">
              {recentActivity.length > 0 ? (
                recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 bg-themed-secondary rounded-lg">
                    <div className="w-8 h-8 bg-gray-600 dark:bg-gray-400 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="text-themed-primary font-medium text-sm">{activity.title}</p>
                      <p className="text-themed-tertiary text-xs">{activity.time}</p>
                      {activity.repository && (
                        <p className="text-themed-secondary text-xs">in {activity.repository}</p>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <div className="text-4xl mb-4">📊</div>
                  <p className="text-themed-secondary">No recent activity</p>
                  <p className="text-themed-tertiary text-sm">Start creating repositories and issues to see activity here</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Followers Modal */}
        {showFollowers && (
          <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-96 overflow-hidden">
              <div className="p-6 border-b border-gray-200 dark:border-gray-600">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">Followers</h3>
                  <button 
                    onClick={() => setShowFollowers(false)}
                    className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                  >
                    ✕
                  </button>
                </div>
              </div>
              <div className="p-6 overflow-y-auto max-h-80">
                {followers.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {followers.map((follower, index) => (
                      <div key={index} className="flex items-center space-x-3 p-3 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                        <img 
                          src={follower.avatarUrl} 
                          alt={follower.username}
                          className="w-12 h-12 rounded-full ring-2 ring-gray-300 dark:ring-gray-500"
                        />
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900 dark:text-white">{follower.username}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{follower.type}</p>
                          <a 
                            href={follower.profileUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-gray-600 dark:text-gray-400 text-sm hover:underline"
                          >
                            View Profile
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-gray-600 dark:text-gray-300">No followers found</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Following Modal */}
        {showFollowing && (
          <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-96 overflow-hidden">
              <div className="p-6 border-b border-gray-200 dark:border-gray-600">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">Following</h3>
                  <button 
                    onClick={() => setShowFollowing(false)}
                    className="text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white"
                  >
                    ✕
                  </button>
                </div>
              </div>
              <div className="p-6 overflow-y-auto max-h-80">
                {following.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {following.map((user, index) => (
                      <div key={index} className="flex items-center space-x-3 p-3 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                        <img 
                          src={user.avatarUrl} 
                          alt={user.username}
                          className="w-12 h-12 rounded-full ring-2 ring-gray-300 dark:ring-gray-500"
                        />
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900 dark:text-white">{user.username}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{user.type}</p>
                          <a 
                            href={user.profileUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-gray-600 dark:text-gray-400 text-sm hover:underline"
                          >
                            View Profile
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-gray-600 dark:text-gray-300">Not following anyone</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Delete Repository Modal */}
        {showDeleteRepo && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full border border-gray-700">
              <div className="p-6 border-b border-gray-700">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-bold text-white flex items-center">
                    <svg className="w-6 h-6 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Delete Repository
                  </h3>
                  <button 
                    onClick={() => setShowDeleteRepo(false)}
                    className="text-gray-400 hover:text-white transition-colors p-1"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="p-6">
                <div className="mb-6">
                  <label className="block text-white font-semibold mb-3">
                    Repository Name:
                  </label>
                  <input
                    type="text"
                    value={repoToDelete}
                    onChange={(e) => setRepoToDelete(e.target.value)}
                    placeholder="e.g., my-repo or username/my-repo"
                    className="w-full p-3 border border-gray-600 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:border-red-500 focus:outline-none transition-colors"
                  />
                  <p className="text-gray-400 text-sm mt-2">
                    💡 Tip: You can enter just the repository name (e.g., "my-repo") or the full name (e.g., "username/my-repo")
                  </p>
                  {repositories.length > 0 && (
                    <div className="mt-3">
                      <p className="text-gray-400 text-sm mb-2">Quick select from your recent repositories:</p>
                      <div className="flex flex-wrap gap-2">
                        {repositories.slice(0, 3).map((repo) => (
                          <button
                            key={repo.id}
                            onClick={() => setRepoToDelete(repo.name)}
                            className="px-3 py-1 bg-gray-600 text-white text-sm rounded-md hover:bg-gray-500 transition-colors"
                          >
                            {repo.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <div className="bg-red-900/20 border-2 border-red-500/30 rounded-lg p-4 mb-6">
                  <div className="flex items-center mb-2">
                    <svg className="w-5 h-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                    <p className="text-red-300 font-semibold">Warning</p>
                  </div>
                  <p className="text-red-200 text-sm">This action cannot be undone. This will permanently delete the repository and all its contents.</p>
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={handleDeleteRepository}
                    disabled={actionLoading === 'deleteRepo' || !repoToDelete}
                    className="flex-1 bg-red-600 text-white px-4 py-3 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
                  >
                    {actionLoading === 'deleteRepo' ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Deleting...
                      </div>
                    ) : (
                      'Delete Repository'
                    )}
                  </button>
                  <button
                    onClick={() => setShowDeleteRepo(false)}
                    className="flex-1 bg-gray-600 text-white px-4 py-3 rounded-lg hover:bg-gray-500 transition-colors font-semibold"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Repo Health Section */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-themed-primary mb-4">
              Repository Health
            </h2>
            <p className="text-lg text-themed-secondary max-w-3xl mx-auto">
              Monitor your repository health with comprehensive metrics and insights
            </p>
          </div>
          <RepoHealthDashboard user={user} />
        </div>

        {/* README Generation Section */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-themed-primary mb-4">
              README Generation
            </h2>
            <p className="text-lg text-themed-secondary max-w-3xl mx-auto">
              Generate professional documentation for your repositories with AI
            </p>
          </div>
          <RepositoryList user={user} />
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
