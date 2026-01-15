const express = require('express');
const router = express.Router();
const axios = require('axios');

// Middleware to ensure user is authenticated
const requireAuth = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  next();
};

// Get user's GitHub repositories
router.get('/repositories', requireAuth, async (req, res) => {
  try {
    console.log('Fetching repositories for user:', req.user.username);
    
    if (!req.user.githubAccessToken) {
      return res.status(400).json({ error: 'GitHub access token not found' });
    }
    
    const response = await axios.get('https://api.github.com/user/repos', {
      headers: {
        'Authorization': `token ${req.user.githubAccessToken}`,
        'Accept': 'application/vnd.github.v3+json'
      },
      params: {
        sort: 'updated',
        per_page: 100
      }
    });

    // Check for README in each repository
    const reposWithReadmeStatus = await Promise.all(
      response.data.map(async (repo) => {
        try {
          await axios.get(`https://api.github.com/repos/${repo.owner.login}/${repo.name}/readme`, {
            headers: {
              'Authorization': `token ${req.user.githubAccessToken}`,
              'Accept': 'application/vnd.github.v3+json'
            }
          });
          return { ...repo, hasReadme: true };
        } catch (error) {
          return { ...repo, hasReadme: false };
        }
      })
    );

    const repos = reposWithReadmeStatus.map(repo => ({
      id: repo.id,
      name: repo.name,
      fullName: repo.full_name,
      description: repo.description,
      url: repo.html_url,
      html_url: repo.html_url,
      language: repo.language,
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      stargazers_count: repo.stargazers_count,
      forks_count: repo.forks_count,
      openIssues: repo.open_issues_count,
      updatedAt: repo.updated_at,
      updated_at: repo.updated_at,
      createdAt: repo.created_at,
      private: repo.private,
      hasReadme: repo.hasReadme,
      owner: repo.owner
    }));

    console.log(`Successfully fetched ${repos.length} repositories`);
    res.json({ repositories: repos });
  } catch (error) {
    console.error('Error fetching GitHub repositories:', error.response?.data || error.message);
    res.status(500).json({ error: error.response?.data?.message || 'Failed to fetch repositories' });
  }
});

// Get user's GitHub statistics
router.get('/stats', requireAuth, async (req, res) => {
  try {
    const [reposResponse, userResponse] = await Promise.all([
      axios.get('https://api.github.com/user/repos', {
        headers: {
          'Authorization': `token ${req.user.githubAccessToken}`,
          'Accept': 'application/vnd.github.v3+json'
        },
        params: { per_page: 100 }
      }),
      axios.get('https://api.github.com/user', {
        headers: {
          'Authorization': `token ${req.user.githubAccessToken}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      })
    ]);

    const repos = reposResponse.data;
    const totalStars = repos.reduce((sum, repo) => sum + repo.stargazers_count, 0);
    const totalForks = repos.reduce((sum, repo) => sum + repo.forks_count, 0);
    const totalIssues = repos.reduce((sum, repo) => sum + repo.open_issues_count, 0);

    // Get pull requests for the user
    const pullRequestsResponse = await axios.get('https://api.github.com/search/issues', {
      headers: {
        'Authorization': `token ${req.user.githubAccessToken}`,
        'Accept': 'application/vnd.github.v3+json'
      },
      params: {
        q: `author:${req.user.username} type:pr`,
        per_page: 100
      }
    });

    const stats = {
      repositories: repos.length,
      totalStars,
      totalForks,
      openIssues: totalIssues,
      pullRequests: pullRequestsResponse.data.total_count,
      followers: userResponse.data.followers,
      following: userResponse.data.following,
      publicRepos: userResponse.data.public_repos
    };

    res.json({ stats });
  } catch (error) {
    console.error('Error fetching GitHub stats:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to fetch GitHub statistics' });
  }
});

// Get issues from user's repositories
router.get('/issues', requireAuth, async (req, res) => {
  try {
    const response = await axios.get('https://api.github.com/search/issues', {
      headers: {
        'Authorization': `token ${req.user.githubAccessToken}`,
        'Accept': 'application/vnd.github.v3+json'
      },
      params: {
        q: `author:${req.user.username} type:issue state:open`,
        sort: 'updated',
        per_page: 20
      }
    });

    const issues = response.data.items.map(issue => ({
      id: issue.id,
      number: issue.number,
      title: issue.title,
      body: issue.body,
      url: issue.html_url,
      state: issue.state,
      createdAt: issue.created_at,
      updatedAt: issue.updated_at,
      repository: {
        name: issue.repository_url.split('/').pop(),
        fullName: issue.repository_url.split('/').slice(-2).join('/')
      },
      labels: issue.labels.map(label => ({
        name: label.name,
        color: label.color
      }))
    }));

    res.json({ issues });
  } catch (error) {
    console.error('Error fetching GitHub issues:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to fetch issues' });
  }
});

// Get pull requests from user's repositories
router.get('/pull-requests', requireAuth, async (req, res) => {
  try {
    const response = await axios.get('https://api.github.com/search/issues', {
      headers: {
        'Authorization': `token ${req.user.githubAccessToken}`,
        'Accept': 'application/vnd.github.v3+json'
      },
      params: {
        q: `author:${req.user.username} type:pr`,
        sort: 'updated',
        per_page: 20
      }
    });

    const pullRequests = response.data.items.map(pr => ({
      id: pr.id,
      number: pr.number,
      title: pr.title,
      body: pr.body,
      url: pr.html_url,
      state: pr.state,
      createdAt: pr.created_at,
      updatedAt: pr.updated_at,
      repository: {
        name: pr.repository_url.split('/').pop(),
        fullName: pr.repository_url.split('/').slice(-2).join('/')
      },
      labels: pr.labels.map(label => ({
        name: label.name,
        color: label.color
      }))
    }));

    res.json({ pullRequests });
  } catch (error) {
    console.error('Error fetching GitHub pull requests:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to fetch pull requests' });
  }
});

// Sync GitHub issues with calendar (placeholder for workflow automation)
router.post('/sync-issues', requireAuth, async (req, res) => {
  try {
    // Get user's open issues
    const issuesResponse = await axios.get('https://api.github.com/search/issues', {
      headers: {
        'Authorization': `token ${req.user.githubAccessToken}`,
        'Accept': 'application/vnd.github.v3+json'
      },
      params: {
        q: `assignee:${req.user.username} type:issue state:open`,
        sort: 'updated',
        per_page: 10
      }
    });

    const issues = issuesResponse.data.items;
    
    // Here you would integrate with Google Calendar API to create events
    // For now, we'll simulate the sync process
    
    const syncedIssues = issues.map(issue => ({
      issueId: issue.id,
      title: issue.title,
      repository: issue.repository_url.split('/').pop(),
      url: issue.html_url,
      synced: true
    }));

    res.json({ 
      message: 'Issues synced successfully',
      syncedCount: syncedIssues.length,
      issues: syncedIssues
    });
  } catch (error) {
    console.error('Error syncing GitHub issues:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to sync issues' });
  }
});

// Get user's followers
router.get('/followers', requireAuth, async (req, res) => {
  try {
    const response = await axios.get('https://api.github.com/user/followers', {
      headers: {
        'Authorization': `token ${req.user.githubAccessToken}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    });

    const followers = response.data.map(follower => ({
      id: follower.id,
      username: follower.login,
      avatarUrl: follower.avatar_url,
      profileUrl: follower.html_url,
      type: follower.type
    }));

    res.json({ 
      followers,
      count: followers.length
    });
  } catch (error) {
    console.error('Error fetching followers:', error);
    res.status(500).json({ error: 'Failed to fetch followers' });
  }
});

// Get user's following
router.get('/following', requireAuth, async (req, res) => {
  try {
    const response = await axios.get('https://api.github.com/user/following', {
      headers: {
        'Authorization': `token ${req.user.githubAccessToken}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    });

    const following = response.data.map(user => ({
      id: user.id,
      username: user.login,
      avatarUrl: user.avatar_url,
      profileUrl: user.html_url,
      type: user.type
    }));

    res.json({ 
      following,
      count: following.length
    });
  } catch (error) {
    console.error('Error fetching following:', error);
    res.status(500).json({ error: 'Failed to fetch following' });
  }
});

// Delete a repository
router.delete('/repositories/:owner/:repo', requireAuth, async (req, res) => {
  try {
    const { owner, repo } = req.params;
    
    // Verify the user owns this repository
    const repoResponse = await axios.get(`https://api.github.com/repos/${owner}/${repo}`, {
      headers: {
        'Authorization': `token ${req.user.githubAccessToken}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    });

    if (repoResponse.data.owner.login !== req.user.username) {
      return res.status(403).json({ error: 'You can only delete your own repositories' });
    }

    // Delete the repository
    await axios.delete(`https://api.github.com/repos/${owner}/${repo}`, {
      headers: {
        'Authorization': `token ${req.user.githubAccessToken}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    });

    res.json({ 
      message: `Repository ${owner}/${repo} deleted successfully`,
      deletedRepo: `${owner}/${repo}`
    });
  } catch (error) {
    console.error('Error deleting repository:', error);
    if (error.response?.status === 404) {
      res.status(404).json({ error: 'Repository not found' });
    } else if (error.response?.status === 403) {
      res.status(403).json({ error: 'Insufficient permissions to delete this repository' });
    } else {
      res.status(500).json({ error: 'Failed to delete repository' });
    }
  }
});

// Create a workflow automation
router.post('/create-workflow', requireAuth, async (req, res) => {
  try {
    const { workflowType, settings } = req.body;
    
    // Simulate workflow creation
    const workflow = {
      id: Date.now(),
      type: workflowType || 'github-calendar-sync',
      name: 'GitHub to Calendar Sync',
      description: 'Automatically sync GitHub issues and PRs with Google Calendar',
      settings: settings || {
        syncIssues: true,
        syncPullRequests: true,
        createDeadlines: true
      },
      active: true,
      createdAt: new Date().toISOString()
    };

    // Here you would save the workflow to the database
    // For now, we'll just return the created workflow
    
    res.json({ 
      message: 'Workflow created successfully',
      workflow
    });
  } catch (error) {
    console.error('Error creating workflow:', error);
    res.status(500).json({ error: 'Failed to create workflow' });
  }
});

// Get repository health data
router.get('/repo-health', requireAuth, async (req, res) => {
  try {
    console.log('Fetching repo health for user:', req.user.username);
    
    if (!req.user.githubAccessToken) {
      return res.status(400).json({ error: 'GitHub access token not found' });
    }
    
    // Get user repositories
    const reposResponse = await axios.get('https://api.github.com/user/repos', {
      headers: {
        'Authorization': `token ${req.user.githubAccessToken}`,
        'Accept': 'application/vnd.github.v3+json'
      },
      params: {
        sort: 'updated',
        per_page: 50
      }
    });

    const repos = reposResponse.data;
    const repoHealthData = [];

    // Get detailed health data for each repository
    for (const repo of repos) {
      try {
        // Get issues data
        const [openIssuesResponse, closedIssuesResponse, contributorsResponse, commitsResponse] = await Promise.all([
          axios.get(`https://api.github.com/repos/${repo.owner.login}/${repo.name}/issues`, {
            headers: { 'Authorization': `token ${req.user.githubAccessToken}` },
            params: { state: 'open', per_page: 100 }
          }).catch(() => ({ data: [] })),
          
          axios.get(`https://api.github.com/repos/${repo.owner.login}/${repo.name}/issues`, {
            headers: { 'Authorization': `token ${req.user.githubAccessToken}` },
            params: { state: 'closed', per_page: 100 }
          }).catch(() => ({ data: [] })),
          
          axios.get(`https://api.github.com/repos/${repo.owner.login}/${repo.name}/contributors`, {
            headers: { 'Authorization': `token ${req.user.githubAccessToken}` },
            params: { per_page: 100 }
          }).catch(() => ({ data: [] })),
          
          axios.get(`https://api.github.com/repos/${repo.owner.login}/${repo.name}/commits`, {
            headers: { 'Authorization': `token ${req.user.githubAccessToken}` },
            params: { per_page: 1 }
          }).catch(() => ({ data: [] }))
        ]);

        // Check for README
        let hasReadme = false;
        try {
          await axios.get(`https://api.github.com/repos/${repo.owner.login}/${repo.name}/readme`, {
            headers: { 'Authorization': `token ${req.user.githubAccessToken}` }
          });
          hasReadme = true;
        } catch (error) {
          hasReadme = false;
        }

        const healthData = {
          id: repo.id,
          name: repo.name,
          description: repo.description,
          language: repo.language,
          private: repo.private,
          htmlUrl: repo.html_url,
          stars: repo.stargazers_count,
          forks: repo.forks_count,
          openIssues: openIssuesResponse.data.filter(issue => !issue.pull_request).length,
          closedIssues: closedIssuesResponse.data.filter(issue => !issue.pull_request).length,
          contributors: contributorsResponse.data.slice(0, 10), // Top 10 contributors
          lastCommitDate: commitsResponse.data.length > 0 ? commitsResponse.data[0].commit.committer.date : repo.updated_at,
          hasReadme,
          owner: repo.owner
        };

        repoHealthData.push(healthData);
      } catch (error) {
        console.error(`Error fetching health data for ${repo.name}:`, error.message);
        // Add basic data even if detailed fetch fails
        repoHealthData.push({
          id: repo.id,
          name: repo.name,
          description: repo.description,
          language: repo.language,
          private: repo.private,
          htmlUrl: repo.html_url,
          stars: repo.stargazers_count,
          forks: repo.forks_count,
          openIssues: 0,
          closedIssues: 0,
          contributors: [],
          lastCommitDate: repo.updated_at,
          hasReadme: false,
          owner: repo.owner
        });
      }
    }

    console.log(`Successfully fetched health data for ${repoHealthData.length} repositories`);
    res.json({ repos: repoHealthData });
  } catch (error) {
    console.error('Error fetching repository health data:', error);
    res.status(500).json({ error: error.response?.data?.message || 'Failed to fetch repository health data' });
  }
});

// Generate README using AI
router.post('/generate-readme', requireAuth, async (req, res) => {
  try {
    const { repoName, repoDescription, language, owner, hasExistingReadme } = req.body;

    // Fetch repository contents to analyze structure
    let projectAnalysis = {
      files: [],
      hasPackageJson: false,
      hasDockerfile: false,
      hasTests: false,
      hasSrc: false,
      dependencies: {},
      devDependencies: {},
      scripts: {},
      hasRequirements: false,
      hasPomXml: false,
      hasGoMod: false
    };

    try {
      // Get repository contents
      const contentsResponse = await axios.get(
        `https://api.github.com/repos/${owner}/${repoName}/contents`,
        { headers: { 'Authorization': `token ${req.user.githubAccessToken}` }}
      );

      const files = contentsResponse.data;
      projectAnalysis.files = files.map(f => f.name);
      projectAnalysis.hasPackageJson = files.some(f => f.name === 'package.json');
      projectAnalysis.hasDockerfile = files.some(f => f.name === 'Dockerfile');
      projectAnalysis.hasTests = files.some(f => 
        f.name === 'test' || f.name === 'tests' || 
        f.name.includes('.test.') || f.name.includes('.spec.')
      );
      projectAnalysis.hasSrc = files.some(f => f.name === 'src');
      projectAnalysis.hasRequirements = files.some(f => f.name === 'requirements.txt');
      projectAnalysis.hasPomXml = files.some(f => f.name === 'pom.xml');
      projectAnalysis.hasGoMod = files.some(f => f.name === 'go.mod');

      // Fetch package.json if exists (for Node.js/TypeScript projects)
      if (projectAnalysis.hasPackageJson) {
        try {
          const pkgResponse = await axios.get(
            `https://api.github.com/repos/${owner}/${repoName}/contents/package.json`,
            { headers: { 'Authorization': `token ${req.user.githubAccessToken}` }}
          );
          const packageData = JSON.parse(
            Buffer.from(pkgResponse.data.content, 'base64').toString()
          );
          projectAnalysis.dependencies = packageData.dependencies || {};
          projectAnalysis.devDependencies = packageData.devDependencies || {};
          projectAnalysis.scripts = packageData.scripts || {};
        } catch (pkgError) {
          console.log('Could not fetch package.json details');
        }
      }
    } catch (error) {
      console.log('Could not fetch detailed repo info, using basic template');
    }

    // Generate README based on actual project analysis
    const readme = generateProjectSpecificReadme({
      repoName,
      repoDescription: repoDescription || 'A great project built with passion',
      language: language || 'JavaScript',
      owner,
      hasExistingReadme,
      projectAnalysis
    });

    res.json({ readme });
  } catch (error) {
    console.error('Error generating README:', error);
    res.status(500).json({ error: 'Failed to generate README' });
  }
});

// Commit README to repository
router.post('/commit-readme', requireAuth, async (req, res) => {
  try {
    const { owner, repo, content, message } = req.body;

    // Check if README already exists
    let sha = null;
    try {
      const existingFile = await axios.get(`https://api.github.com/repos/${owner}/${repo}/contents/README.md`, {
        headers: { 'Authorization': `token ${req.user.githubAccessToken}` }
      });
      sha = existingFile.data.sha;
    } catch (error) {
      // README doesn't exist, which is fine
    }

    // Commit the README
    const commitData = {
      message,
      content: Buffer.from(content).toString('base64'),
      ...(sha && { sha }) // Include SHA if updating existing file
    };

    await axios.put(`https://api.github.com/repos/${owner}/${repo}/contents/README.md`, commitData, {
      headers: {
        'Authorization': `token ${req.user.githubAccessToken}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    });

    res.json({ success: true, message: 'README committed successfully' });
  } catch (error) {
    console.error('Error committing README:', error);
    res.status(500).json({ error: 'Failed to commit README to repository' });
  }
});

// Get profile stats for enhanced dropdown
router.get('/profile-stats', requireAuth, async (req, res) => {
  try {
    if (!req.user.githubAccessToken) {
      return res.status(400).json({ error: 'GitHub access token not found' });
    }

    // Fetch user data and repos in parallel
    const [userResponse, reposResponse] = await Promise.all([
      axios.get('https://api.github.com/user', {
        headers: {
          'Authorization': `token ${req.user.githubAccessToken}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      }),
      axios.get('https://api.github.com/user/repos', {
        headers: {
          'Authorization': `token ${req.user.githubAccessToken}`,
          'Accept': 'application/vnd.github.v3+json'
        },
        params: { sort: 'updated', per_page: 100 }
      })
    ]);

    // Calculate total stars
    const totalStars = reposResponse.data.reduce((sum, repo) => sum + (repo.stargazers_count || 0), 0);

    res.json({
      repos: userResponse.data.public_repos,
      stars: totalStars,
      followers: userResponse.data.followers,
      following: userResponse.data.following
    });
  } catch (error) {
    console.error('Error fetching profile stats:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to fetch profile stats' });
  }
});

// Helper function to generate README template
function generateProjectSpecificReadme({ repoName, repoDescription, language, owner, hasExistingReadme, projectAnalysis }) {
  const languageSetup = getLanguageSetup(language);
  
  // Build features section based on actual project
  let featuresSection = '## 🚀 Features\n\n';
  if (projectAnalysis.dependencies && Object.keys(projectAnalysis.dependencies).length > 0) {
    featuresSection += `- Built with ${language}\n`;
    const majorDeps = Object.keys(projectAnalysis.dependencies).slice(0, 5);
    if (majorDeps.length > 0) {
      featuresSection += `- Uses ${majorDeps.join(', ')}\n`;
    }
  } else {
    featuresSection += `- Modern ${language} development\n`;
  }
  featuresSection += '- Clean and maintainable code\n';
  if (projectAnalysis.hasTests) {
    featuresSection += '- Comprehensive test coverage\n';
  }
  if (projectAnalysis.hasDockerfile) {
    featuresSection += '- Docker support for easy deployment\n';
  }
  
  // Build installation section
  let installSection = '## 🔧 Installation\n\n';
  installSection += '1. Clone the repository:\n```bash\n';
  installSection += `git clone https://github.com/${owner}/${repoName}.git\n`;
  installSection += `cd ${repoName}\n\`\`\`\n\n`;
  installSection += '2. Install dependencies:\n```bash\n';
  installSection += `${languageSetup.install}\n\`\`\`\n\n`;
  
  // Add Docker setup if Dockerfile exists
  if (projectAnalysis.hasDockerfile) {
    installSection += '### 🐳 Docker Setup\n\n';
    installSection += '```bash\n';
    installSection += 'docker build -t ' + repoName.toLowerCase() + ' .\n';
    installSection += 'docker run -p 3000:3000 ' + repoName.toLowerCase() + '\n';
    installSection += '```\n\n';
  }
  
  // Build usage section with actual scripts
  let usageSection = '## 🎯 Usage\n\n';
  if (projectAnalysis.scripts && Object.keys(projectAnalysis.scripts).length > 0) {
    usageSection += 'Available scripts:\n\n';
    Object.entries(projectAnalysis.scripts).forEach(([name, cmd]) => {
      usageSection += `**${name}**\n`;
      usageSection += '```bash\n';
      if (projectAnalysis.hasPackageJson) {
        usageSection += `npm run ${name}\n`;
      } else {
        // For other project types, just show the command as-is
        usageSection += `${cmd}\n`;
      }
      usageSection += '```\n\n';
    });
  } else {
    // Fallback to language-specific usage instructions
    usageSection += languageSetup.usage + '\n\n';
  }
  
  // Build project structure section based on actual files
  let structureSection = '## 🏗️ Project Structure\n\n```\n';
  structureSection += `${repoName}/\n`;
  if (projectAnalysis.hasSrc) {
    structureSection += '├── src/                 # Source files\n';
  }
  if (projectAnalysis.hasTests) {
    structureSection += '├── tests/              # Test files\n';
  }
  if (projectAnalysis.hasPackageJson) {
    structureSection += '├── package.json        # Project dependencies\n';
  }
  if (projectAnalysis.hasRequirements) {
    structureSection += '├── requirements.txt    # Python dependencies\n';
  }
  if (projectAnalysis.hasPomXml) {
    structureSection += '├── pom.xml            # Maven configuration\n';
  }
  if (projectAnalysis.hasGoMod) {
    structureSection += '├── go.mod             # Go module definition\n';
  }
  if (projectAnalysis.hasDockerfile) {
    structureSection += '├── Dockerfile         # Docker configuration\n';
  }
  structureSection += '└── README.md          # This file\n```\n\n';
  
  // Build testing section if tests exist
  let testingSection = '';
  if (projectAnalysis.hasTests) {
    testingSection = '## 🧪 Testing\n\n';
    if (projectAnalysis.scripts && projectAnalysis.scripts.test) {
      testingSection += 'Run tests:\n```bash\nnpm test\n```\n\n';
    } else {
      testingSection += 'Tests are available in the `tests/` directory.\n\n';
    }
  }
  
  return `# ${repoName}

${repoDescription}

${featuresSection}

## 📋 Prerequisites

Before you begin, ensure you have met the following requirements:

${languageSetup.prerequisites}

${installSection}

${usageSection}

${structureSection}

${testingSection}

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. Fork the project
2. Create your feature branch (\`git checkout -b feature/AmazingFeature\`)
3. Commit your changes (\`git commit -m 'Add some AmazingFeature'\`)
4. Push to the branch (\`git push origin feature/AmazingFeature\`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**${owner}**

- GitHub: [@${owner}](https://github.com/${owner})

## 🙏 Acknowledgments

- Thanks to all contributors who have helped this project grow
- Inspired by the amazing ${language} community
- Built with ❤️ and lots of ☕

## 📊 Project Stats

![GitHub stars](https://img.shields.io/github/stars/${owner}/${repoName}?style=social)
![GitHub forks](https://img.shields.io/github/forks/${owner}/${repoName}?style=social)
![GitHub issues](https://img.shields.io/github/issues/${owner}/${repoName})
![GitHub license](https://img.shields.io/github/license/${owner}/${repoName})

---

⭐ Star this repository if you find it helpful!
`;
}

function getLanguageSetup(language) {
  const setups = {
    'JavaScript': {
      prerequisites: '- Node.js (version 14 or higher)\n- npm or yarn package manager',
      install: 'npm install',
      usage: 'Run the application:\n```bash\nnpm start\n```\n\nFor development:\n```bash\nnpm run dev\n```',
      configFile: 'package.json'
    },
    'Python': {
      prerequisites: '- Python 3.7 or higher\n- pip package manager',
      install: 'pip install -r requirements.txt',
      usage: 'Run the application:\n```bash\npython main.py\n```\n\nFor development:\n```bash\npython -m flask run\n```',
      configFile: 'requirements.txt'
    },
    'Java': {
      prerequisites: '- Java 11 or higher\n- Maven or Gradle',
      install: 'mvn install',
      usage: 'Run the application:\n```bash\nmvn spring-boot:run\n```\n\nBuild the project:\n```bash\nmvn clean package\n```',
      configFile: 'pom.xml'
    },
    'TypeScript': {
      prerequisites: '- Node.js (version 14 or higher)\n- npm or yarn package manager',
      install: 'npm install',
      usage: 'Run the application:\n```bash\nnpm start\n```\n\nFor development:\n```bash\nnpm run dev\n```\n\nBuild for production:\n```bash\nnpm run build\n```',
      configFile: 'package.json'
    }
  };

  return setups[language] || setups['JavaScript'];
}

module.exports = router;