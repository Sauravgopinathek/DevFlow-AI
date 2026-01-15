const express = require('express');
const passport = require('passport');
const router = express.Router();

// GitHub OAuth login - Force account selection
router.get('/github', (req, res, next) => {
  // Force GitHub to show account selection by adding a random state parameter
  const state = Math.random().toString(36).substring(7);
  const backendURL = process.env.BACKEND_URL || 'http://localhost:5000';
  const authURL = `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}&redirect_uri=${encodeURIComponent(`${backendURL}/auth/github/callback`)}&scope=user:email,repo,read:org&state=${state}&allow_signup=true`;
  res.redirect(authURL);
});

// GitHub OAuth callback
router.get('/github/callback', 
  (req, res, next) => {
    passport.authenticate('github', (err, user, info) => {
      if (err) {
        console.error('GitHub auth error:', err.message);
        return res.redirect(`${process.env.FRONTEND_URL}/login?error=auth_failed&message=${encodeURIComponent(err.message)}`);
      }
      if (!user) {
        return res.redirect(`${process.env.FRONTEND_URL}/login?error=auth_failed`);
      }
      
      // ✅ OPEN SOURCE: All users auto-approved - no status check needed
      
      req.logIn(user, (err) => {
        if (err) {
          return res.redirect(`${process.env.FRONTEND_URL}/login?error=login_failed`);
        }
        return res.redirect(`${process.env.FRONTEND_URL}/dashboard`);
      });
    })(req, res, next);
  }
);



// Logout
router.post('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ error: 'Logout failed' });
    }
    // Clear session
    req.session.destroy((err) => {
      if (err) {
        console.error('Session destroy error:', err);
      }
      res.clearCookie('connect.sid'); // Clear session cookie
      res.json({ message: 'Logged out successfully' });
    });
  });
});

// Complete logout route that also clears GitHub OAuth
router.get('/logout/complete', (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error('Logout error:', err);
    }
    req.session.destroy((err) => {
      if (err) {
        console.error('Session destroy error:', err);
      }
      res.clearCookie('connect.sid');
      // Redirect to GitHub logout to clear OAuth session
      res.redirect('https://github.com/logout');
    });
  });
});

// Switch account route - forces new GitHub login
router.get('/switch-account', (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error('Logout error:', err);
    }
    req.session.destroy((err) => {
      if (err) {
        console.error('Session destroy error:', err);
      }
      res.clearCookie('connect.sid');
      // Force GitHub to show account selection
      const state = Math.random().toString(36).substring(7);
      const authURL = `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}&redirect_uri=${encodeURIComponent('http://localhost:5000/auth/github/callback')}&scope=user:email,repo,read:org&state=${state}&allow_signup=true&prompt=select_account`;
      res.redirect(authURL);
    });
  });
});

// Check authentication status
router.get('/status', (req, res) => {
  if (req.isAuthenticated()) {
    res.json({
      authenticated: true,
      user: {
        id: req.user._id,
        username: req.user.username,
        displayName: req.user.displayName,
        email: req.user.email,
        avatarUrl: req.user.avatarUrl
      }
    });
  } else {
    res.json({ authenticated: false });
  }
});

module.exports = router;