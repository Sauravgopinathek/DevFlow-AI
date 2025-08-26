# DevFlow AI

A modern developer dashboard that integrates with GitHub to provide comprehensive repository management, health monitoring, and AI-powered README generation.

## ✨ Features

### 🐙 GitHub Integration
- **GitHub OAuth Authentication** - Secure login with GitHub account
- **Repository Management** - View and manage all your repositories
- **Real-time Statistics** - Track stars, forks, issues, and pull requests
- **Repository Health Dashboard** - Monitor repository health with scoring and recommendations
- **Followers & Following** - View your GitHub network with profile links

### 🤖 AI-Powered Tools
- **README Generator** - Create professional documentation with AI
- **Repository Analysis** - Automated health scoring and recommendations
- **Smart Insights** - Get actionable suggestions for repository improvements

### 🎯 Quick Actions
- **Direct GitHub Access** - Quick links to create repositories, access Copilot, and more
- **GitHub Student Pack** - Easy access to free developer tools
- **GitHub Codespaces** - Launch cloud development environments
- **Explore GitHub** - Discover trending repositories and topics

### 🎨 Modern UI/UX
- **Dark/Light Theme** - Automatic theme switching with system preference
- **Responsive Design** - Works perfectly on desktop and mobile
- **Real-time Updates** - Live data synchronization with GitHub
- **Professional Interface** - Clean, modern design with smooth animations

## Project Structure

```
devflow-ai/
├── frontend/          # React + TailwindCSS frontend
├── backend/           # Node.js + Express backend
└── README.md         # This file
```

## Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or MongoDB Atlas)
- GitHub OAuth App credentials

## Setup Instructions

### 1. GitHub OAuth App Setup

1. Go to GitHub Settings > Developer settings > OAuth Apps
2. Click "New OAuth App"
3. Fill in:
   - Application name: `DevFlow AI`
   - Homepage URL: `http://localhost:3000`
   - Authorization callback URL: `http://localhost:5000/auth/github/callback`
4. Save the Client ID and Client Secret

### 2. Environment Variables

Create a `backend/.env` file with your credentials:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/devflow-ai

# GitHub OAuth
GITHUB_CLIENT_ID=your_github_client_id_here
GITHUB_CLIENT_SECRET=your_github_client_secret_here

# Session Secret
SESSION_SECRET=your_random_session_secret_here

# Server Configuration
PORT=5000
NODE_ENV=development
```

### 3. Installation & Running

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install

# Start backend (from backend directory)
npm run dev

# Start frontend (from frontend directory, in new terminal)
npm start
```

The app will be available at:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

## Key Features

### ✅ Current Features

- **GitHub OAuth Authentication** - Secure login with GitHub
- **Repository Dashboard** - View and manage all your repositories
- **Repository Health Monitoring** - Health scoring with actionable recommendations
- **AI README Generator** - Create professional documentation automatically
- **GitHub Statistics** - Real-time stats for repositories, issues, and PRs
- **Social Features** - View followers and following with profile links
- **Quick Actions** - Direct access to GitHub tools and services
- **Dark/Light Theme** - Automatic theme switching
- **Responsive Design** - Mobile-friendly interface
- **User Settings** - Customizable preferences and theme options

## Deployment

- Frontend: Ready for Vercel deployment
- Backend: Ready for Render/Heroku deployment

## Tech Stack

- **Frontend**: React, TailwindCSS, Axios
- **Backend**: Node.js, Express, MongoDB, Passport.js
- **Database**: MongoDB with Mongoose
- **Authentication**: GitHub OAuth 2.0
- **APIs**: GitHub REST API
- **Styling**: TailwindCSS with custom animations and dark mode

## API Endpoints

### Authentication
- `GET /auth/github` - GitHub OAuth login
- `GET /auth/github/callback` - GitHub OAuth callback
- `GET /auth/logout` - Logout user

### User Management
- `GET /api/user/profile` - Get user profile
- `GET /api/user/settings` - Get user settings
- `PUT /api/user/settings` - Update user settings

### GitHub Integration
- `GET /api/github/repositories` - Get user repositories
- `GET /api/github/stats` - Get GitHub statistics
- `GET /api/github/followers` - Get user followers
- `GET /api/github/following` - Get users being followed
- `GET /api/github/issues` - Get user issues
- `GET /api/github/pull-requests` - Get user pull requests
- `GET /api/github/repo-health` - Get repository health data
- `POST /api/github/generate-readme` - Generate README for repository
- `POST /api/github/commit-readme` - Commit README to repository
- `DELETE /api/github/repositories/:owner/:repo` - Delete repository

### Admin (Protected)
- `GET /api/admin/users` - Get all users (admin only)
- `GET /api/admin/stats` - Get platform statistics (admin only)