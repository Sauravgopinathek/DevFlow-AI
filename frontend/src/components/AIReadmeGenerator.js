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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">🤖 AI README Generator</h2>
              <p className="text-blue-100 mt-1">
                {repo.hasReadme ? 'Improve existing README for' : 'Generate professional README for'} {repo.name}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-blue-200 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {!generatedReadme && !generating && (
            <div className="text-center py-8">
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4">
                {repo.hasReadme ? 'Improve Your README' : 'Generate Professional README'}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-2xl mx-auto">
                {repo.hasReadme 
                  ? 'Our AI will analyze your existing README and suggest improvements with better structure, examples, and comprehensive documentation.'
                  : 'Our AI will analyze your repository structure and create a comprehensive README with installation instructions, usage examples, API documentation, and contribution guidelines.'
                }
              </p>
              
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-6 text-left max-w-2xl mx-auto">
                <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Repository Details:</h4>
                <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <div><strong>Name:</strong> {repo.name}</div>
                  {repo.description && <div><strong>Description:</strong> {repo.description}</div>}
                  {repo.language && <div><strong>Primary Language:</strong> {repo.language}</div>}
                  <div><strong>Stars:</strong> {repo.stargazers_count || 0} ⭐</div>
                  <div><strong>Forks:</strong> {repo.forks_count || 0} 🍴</div>
                  <div><strong>Status:</strong> {repo.hasReadme ? '📄 Has existing README' : '📝 No README found'}</div>
                </div>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mb-6 text-left max-w-2xl mx-auto">
                <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">🚀 What will be generated:</h4>
                <div className="grid grid-cols-2 gap-2 text-sm text-blue-700 dark:text-blue-300">
                  <div>• Project overview & badges</div>
                  <div>• Installation instructions</div>
                  <div>• Usage examples</div>
                  <div>• API documentation</div>
                  <div>• Contributing guidelines</div>
                  <div>• License information</div>
                  <div>• Contact details</div>
                  <div>• Deployment guide</div>
                </div>
              </div>

              <button
                onClick={generateReadme}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold px-8 py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                🚀 {repo.hasReadme ? 'Improve README' : 'Generate README'}
              </button>
            </div>
          )}

          {generating && (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600 mx-auto mb-6"></div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2">Generating README...</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Our AI is analyzing your repository structure, dependencies, and creating professional documentation
              </p>
              <div className="mt-4 text-sm text-gray-500 dark:text-gray-500">
                <div className="flex items-center justify-center space-x-4">
                  <span>📊 Analyzing structure</span>
                  <span>📝 Writing content</span>
                  <span>✨ Adding examples</span>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 mb-6">
              <div className="flex items-center">
                <div className="text-red-500 mr-3">⚠️</div>
                <div>
                  <h4 className="font-semibold text-red-800">Error</h4>
                  <p className="text-red-600">{error}</p>
                </div>
              </div>
            </div>
          )}

          {generatedReadme && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200">Generated README.md</h3>
                <div className="flex space-x-3">
                  <button
                    onClick={downloadReadme}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span>Download</span>
                  </button>
                  <button
                    onClick={commitReadme}
                    disabled={committing}
                    className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {committing ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Committing...</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>Commit to Repo</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border-2 border-gray-200 dark:border-gray-600 max-h-96 overflow-y-auto">
                <pre className="whitespace-pre-wrap text-sm text-gray-800 dark:text-gray-200 font-mono overflow-x-auto">
                  {generatedReadme}
                </pre>
              </div>

              <div className="mt-4 p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
                <h4 className="font-semibold text-blue-800 mb-2">💡 What's Included:</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Professional project description</li>
                  <li>• Installation and setup instructions</li>
                  <li>• Usage examples and code snippets</li>
                  <li>• Contribution guidelines</li>
                  <li>• License information</li>
                  <li>• Contact and support details</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {generatedReadme && (
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">
                ✨ Generated by AI • Review before committing
              </p>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 transition-colors"
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