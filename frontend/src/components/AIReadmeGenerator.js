import React, { useState } from 'react';
import axios from 'axios';
import { useSettings } from '../contexts/SettingsContext';

const AIReadmeGenerator = ({ repo, onClose }) => {
  const { isDarkMode } = useSettings();
  const [generating, setGenerating] = useState(false);
  const [generatedReadme, setGeneratedReadme] = useState('');
  const [error, setError] = useState(null);
  const [committing, setCommitting] = useState(false);

  const generateReadme = async () => {
    try {
      setGenerating(true);
      setError(null);
      
      console.log('Generating README for:', repo.name);
      const response = await axios.post('/api/github/generate-readme', {
        repoName: repo.name,
        repoDescription: repo.description,
        language: repo.language,
        owner: repo.owner?.login || repo.owner,
        hasExistingReadme: repo.hasReadme
      });
      
      console.log('README generated successfully');
      setGeneratedReadme(response.data.readme);
    } catch (error) {
      console.error('Error generating README:', error);
      setError(error.response?.data?.error || 'Failed to generate README');
    } finally {
      setGenerating(false);
    }
  };

  const downloadReadme = () => {
    const blob = new Blob([generatedReadme], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'README.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const commitReadme = async () => {
    try {
      setCommitting(true);
      setError(null);
      
      console.log('Committing README to repository:', repo.name);
      await axios.post('/api/github/commit-readme', {
        owner: repo.owner?.login || repo.owner,
        repo: repo.name,
        content: generatedReadme,
        message: repo.hasReadme ? 'Update README.md with AI improvements' : 'Add AI-generated README.md'
      });
      
      alert('README successfully committed to repository!');
      onClose();
    } catch (error) {
      console.error('Error committing README:', error);
      setError(error.response?.data?.error || 'Failed to commit README to repository');
    } finally {
      setCommitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="card-enhanced max-w-5xl w-full max-h-[90vh] overflow-hidden border-2 border-gray-600">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 text-white p-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 via-blue-600/20 to-cyan-600/20 animate-pulse"></div>
          <div className="relative flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold flex items-center space-x-3">
                <span className="text-4xl animate-bounce">🤖</span>
                <span>AI README Generator</span>
              </h2>
              <p className="text-blue-100 mt-2 text-lg">
                {repo.hasReadme ? '✨ Enhance existing README for' : '🚀 Generate professional README for'} 
                <span className="font-semibold text-white"> {repo.name}</span>
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-3 bg-white/20 hover:bg-white/30 rounded-full transition-all duration-300 hover:scale-110"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 overflow-y-auto max-h-[calc(90vh-200px)]">
          {!generatedReadme && !generating && (
            <div className="text-center py-12">
              <div className="text-8xl mb-8 animate-pulse">📝</div>
              <h3 className="text-3xl font-bold gradient-text mb-6">
                {repo.hasReadme ? '✨ Enhance Your README' : '🚀 Generate Professional README'}
              </h3>
              <p className="text-gray-300 text-lg mb-8 max-w-3xl mx-auto leading-relaxed">
                {repo.hasReadme 
                  ? 'Our advanced AI will analyze your existing README and suggest comprehensive improvements with better structure, detailed examples, and professional documentation standards.'
                  : 'Our intelligent AI will analyze your repository structure, dependencies, and codebase to create a comprehensive README with installation guides, usage examples, API documentation, and contribution guidelines.'
                }
              </p>
              
              <div className="card-enhanced max-w-3xl mx-auto mb-8">
                <h4 className="text-xl font-bold gradient-text mb-6 flex items-center space-x-2">
                  <span>📊</span>
                  <span>Repository Analysis</span>
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold">📁</span>
                      </div>
                      <div>
                        <div className="text-sm text-gray-400">Repository Name</div>
                        <div className="text-white font-semibold">{repo.name}</div>
                      </div>
                    </div>
                    {repo.language && (
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                          <span className="text-white font-bold">💻</span>
                        </div>
                        <div>
                          <div className="text-sm text-gray-400">Primary Language</div>
                          <div className="text-white font-semibold">{repo.language}</div>
                        </div>
                      </div>
                    )}
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold">📄</span>
                      </div>
                      <div>
                        <div className="text-sm text-gray-400">README Status</div>
                        <div className={`font-semibold ${repo.hasReadme ? 'text-green-400' : 'text-yellow-400'}`}>
                          {repo.hasReadme ? '✅ Has existing README' : '📝 No README found'}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    {repo.description && (
                      <div className="flex items-start space-x-3">
                        <div className="w-10 h-10 bg-cyan-600 rounded-lg flex items-center justify-center">
                          <span className="text-white font-bold">📝</span>
                        </div>
                        <div>
                          <div className="text-sm text-gray-400">Description</div>
                          <div className="text-white font-semibold">{repo.description}</div>
                        </div>
                      </div>
                    )}
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-yellow-600 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold">⭐</span>
                      </div>
                      <div>
                        <div className="text-sm text-gray-400">Stars</div>
                        <div className="text-white font-semibold">{repo.stargazers_count || 0}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-orange-600 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold">🍴</span>
                      </div>
                      <div>
                        <div className="text-sm text-gray-400">Forks</div>
                        <div className="text-white font-semibold">{repo.forks_count || 0}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card-enhanced max-w-4xl mx-auto mb-8 border-blue-500/30">
                <h4 className="text-xl font-bold gradient-text-success mb-6 flex items-center space-x-2">
                  <span>🚀</span>
                  <span>AI-Generated Content Preview</span>
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { icon: '📋', title: 'Project Overview', desc: 'Comprehensive description with badges' },
                    { icon: '⚙️', title: 'Installation', desc: 'Step-by-step setup guide' },
                    { icon: '💡', title: 'Usage Examples', desc: 'Code snippets and demos' },
                    { icon: '📚', title: 'API Docs', desc: 'Detailed API reference' },
                    { icon: '🤝', title: 'Contributing', desc: 'Guidelines for contributors' },
                    { icon: '📄', title: 'License', desc: 'License information' },
                    { icon: '📞', title: 'Contact', desc: 'Support and contact details' },
                    { icon: '🚀', title: 'Deployment', desc: 'Deployment instructions' }
                  ].map((item, index) => (
                    <div key={index} className="bg-gray-800/50 rounded-lg p-4 text-center border border-gray-700 hover:border-gray-600 transition-colors">
                      <div className="text-2xl mb-2">{item.icon}</div>
                      <div className="text-sm font-semibold text-white mb-1">{item.title}</div>
                      <div className="text-xs text-gray-400">{item.desc}</div>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={generateReadme}
                className="btn-modern text-xl px-12 py-4 bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 hover:from-purple-700 hover:via-blue-700 hover:to-cyan-700"
              >
                <span className="flex items-center space-x-3">
                  <span className="text-2xl">🚀</span>
                  <span>{repo.hasReadme ? 'Enhance README with AI' : 'Generate Professional README'}</span>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </button>
            </div>
          )}

          {generating && (
            <div className="text-center py-16">
              <div className="relative mb-8">
                <div className="animate-spin rounded-full h-20 w-20 border-4 border-gray-600 border-t-purple-500 mx-auto"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-3xl animate-pulse">🤖</div>
                </div>
              </div>
              <h3 className="text-2xl font-bold gradient-text mb-4">AI is Crafting Your README...</h3>
              <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
                Our advanced AI is analyzing your repository structure, dependencies, code patterns, and creating comprehensive professional documentation
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
                {[
                  { icon: '📊', text: 'Analyzing Repository Structure', delay: '0s' },
                  { icon: '📝', text: 'Writing Professional Content', delay: '0.5s' },
                  { icon: '✨', text: 'Adding Examples & Polish', delay: '1s' }
                ].map((step, index) => (
                  <div key={index} className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
                    <div className="text-3xl mb-2 animate-bounce" style={{animationDelay: step.delay}}>
                      {step.icon}
                    </div>
                    <div className="text-sm text-gray-300">{step.text}</div>
                  </div>
                ))}
              </div>
              <div className="mt-8 flex justify-center space-x-2">
                <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce"></div>
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                <div className="w-3 h-3 bg-cyan-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
              </div>
            </div>
          )}

          {error && (
            <div className="card-enhanced border-red-500/30 mb-8">
              <div className="text-center py-8">
                <div className="text-6xl mb-4 animate-pulse">⚠️</div>
                <h4 className="text-xl font-bold gradient-text-warning mb-4">Generation Error</h4>
                <div className="bg-red-900/20 border border-red-500/30 rounded-xl p-4 max-w-md mx-auto">
                  <p className="text-red-300">{error}</p>
                </div>
                <button
                  onClick={generateReadme}
                  className="btn-warning mt-6"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Try Again
                </button>
              </div>
            </div>
          )}

          {generatedReadme && (
            <div>
              <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8 space-y-4 lg:space-y-0">
                <div>
                  <h3 className="text-2xl font-bold gradient-text-success flex items-center space-x-2">
                    <span>✅</span>
                    <span>Generated README.md</span>
                  </h3>
                  <p className="text-gray-300 mt-1">Your professional README is ready!</p>
                </div>
                <div className="flex space-x-4">
                  <button
                    onClick={downloadReadme}
                    className="btn-modern bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Download
                  </button>
                  <button
                    onClick={commitReadme}
                    disabled={committing}
                    className="btn-success disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {committing ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        <span>Committing...</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>Commit to Repository</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div className="card-enhanced border-green-500/30 max-h-96 overflow-y-auto mb-6">
                <pre className="whitespace-pre-wrap text-sm text-gray-200 font-mono overflow-x-auto leading-relaxed">
                  {generatedReadme}
                </pre>
              </div>

              <div className="card-enhanced border-blue-500/30">
                <h4 className="text-lg font-bold gradient-text-success mb-4 flex items-center space-x-2">
                  <span>💡</span>
                  <span>What's Included in Your README</span>
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {[
                    { icon: '📋', text: 'Professional project description' },
                    { icon: '⚙️', text: 'Installation and setup instructions' },
                    { icon: '💡', text: 'Usage examples and code snippets' },
                    { icon: '🤝', text: 'Contribution guidelines' },
                    { icon: '📄', text: 'License information' },
                    { icon: '📞', text: 'Contact and support details' }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center space-x-3 text-sm text-blue-300">
                      <span className="text-lg">{item.icon}</span>
                      <span>{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {generatedReadme && (
          <div className="bg-gray-800/50 px-8 py-6 border-t border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 text-sm text-gray-300">
                  <span className="text-lg">✨</span>
                  <span>Generated by AI</span>
                </div>
                <div className="w-1 h-4 bg-gray-600 rounded-full"></div>
                <div className="text-sm text-yellow-400 flex items-center space-x-1">
                  <span>⚠️</span>
                  <span>Review before committing</span>
                </div>
              </div>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIReadmeGenerator;