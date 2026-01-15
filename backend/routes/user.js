const express = require('express');
const User = require('../models/User');
const router = express.Router();

// Middleware to check authentication
const requireAuth = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ error: 'Authentication required' });
};

// Get user profile
router.get('/profile', requireAuth, (req, res) => {
  try {
    // Ensure user object exists
    if (!req.user) {
      return res.status(401).json({ error: 'User not found in session' });
    }

    // Return profile with null-safe access
    res.json({
      id: req.user._id,
      username: req.user.username || '',
      displayName: req.user.displayName || req.user.username || '',
      email: req.user.email || '',
      avatarUrl: req.user.avatarUrl || 'https://via.placeholder.com/150',
      bio: req.user.bio || '',
      location: req.user.location || '',
      website: req.user.website || '',
      preferences: req.user.preferences || {},
      settings: req.user.settings || {},
      githubConnected: !!(req.user.githubAccessToken),
      googleConnected: !!(req.user.googleTokens && req.user.googleTokens.accessToken),
      notionConnected: !!(req.user.notionAccessToken),
      createdAt: req.user.createdAt || new Date()
    });
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ 
      error: 'Failed to fetch profile',
      message: process.env.NODE_ENV !== 'production' ? error.message : undefined
    });
  }
});

// Update user profile
router.put('/profile', requireAuth, async (req, res) => {
  try {
    // Ensure user object exists
    if (!req.user) {
      return res.status(401).json({ error: 'User not found in session' });
    }

    const { displayName, email, bio, location, website } = req.body;
    
    // Update profile fields (with null checks)
    if (displayName !== undefined) req.user.displayName = displayName;
    if (email !== undefined) req.user.email = email;
    if (bio !== undefined) req.user.bio = bio;
    if (location !== undefined) req.user.location = location;
    if (website !== undefined) req.user.website = website;
    
    await req.user.save();
    
    res.json({
      id: req.user._id,
      username: req.user.username || '',
      displayName: req.user.displayName || req.user.username || '',
      email: req.user.email || '',
      avatarUrl: req.user.avatarUrl || 'https://via.placeholder.com/150',
      bio: req.user.bio || '',
      location: req.user.location || '',
      website: req.user.website || '',
      preferences: req.user.preferences || {},
      settings: req.user.settings || {},
      githubConnected: !!(req.user.githubAccessToken),
      googleConnected: !!(req.user.googleTokens && req.user.googleTokens.accessToken),
      notionConnected: !!(req.user.notionAccessToken),
      createdAt: req.user.createdAt || new Date()
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ 
      error: 'Failed to update profile',
      message: process.env.NODE_ENV !== 'production' ? error.message : undefined
    });
  }
});

// Get user settings
router.get('/settings', requireAuth, (req, res) => {
  res.json({
    settings: req.user.settings || {
      notifications: {
        email: true,
        push: false
      }
    }
  });
});

// Update user settings
router.put('/settings', requireAuth, async (req, res) => {
  try {
    const { settings } = req.body;
    
    if (!settings) {
      return res.status(400).json({ error: 'Settings data is required' });
    }

    // Update settings
    req.user.settings = {
      notifications: {
        email: settings.notifications?.email !== undefined ? settings.notifications.email : req.user.settings?.notifications?.email || true,
        push: settings.notifications?.push !== undefined ? settings.notifications.push : req.user.settings?.notifications?.push || false
      }
    };
    
    await req.user.save();
    res.json({ 
      message: 'Settings updated successfully', 
      settings: req.user.settings 
    });
  } catch (error) {
    console.error('Error updating settings:', error);
    res.status(500).json({ error: 'Failed to update settings' });
  }
});

// Update user preferences
router.put('/preferences', requireAuth, async (req, res) => {
  try {
    const { autoSync, syncInterval } = req.body;
    
    req.user.preferences = {
      autoSync: autoSync !== undefined ? autoSync : req.user.preferences.autoSync,
      syncInterval: syncInterval !== undefined ? syncInterval : req.user.preferences.syncInterval
    };
    
    await req.user.save();
    res.json({ message: 'Preferences updated', preferences: req.user.preferences });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update preferences' });
  }
});

// Delete user profile (soft delete - just clear profile data)
router.delete('/profile', requireAuth, async (req, res) => {
  try {
    // Clear profile-specific data but keep the account
    req.user.bio = '';
    req.user.location = '';
    req.user.website = '';
    
    await req.user.save();
    
    res.json({ 
      message: 'Profile data cleared successfully',
      profile: {
        id: req.user._id,
        username: req.user.username,
        displayName: req.user.displayName,
        email: req.user.email,
        avatarUrl: req.user.avatarUrl,
        bio: req.user.bio,
        location: req.user.location,
        website: req.user.website,
        githubConnected: !!req.user.githubAccessToken,
        createdAt: req.user.createdAt
      }
    });
  } catch (error) {
    console.error('Error clearing profile:', error);
    res.status(500).json({ error: 'Failed to clear profile data' });
  }
});

// Delete user account (self-deletion)
router.delete('/account', requireAuth, async (req, res) => {
  try {
    const userId = req.user._id;
    const username = req.user.username;
    

    
    // Delete the user account
    await User.findByIdAndDelete(userId);
    
    // Logout the user
    req.logout((err) => {
      if (err) {
        console.error('Logout error during account deletion:', err);
      }
      
      // Clear session
      req.session.destroy((err) => {
        if (err) {
          console.error('Session destroy error:', err);
        }
        
        res.clearCookie('connect.sid');
        res.json({ 
          message: 'Account deleted successfully',
          deletedUser: username
        });
      });
    });
    
    console.log(`🗑️ User account deleted: ${username}`);
  } catch (error) {
    console.error('Error deleting account:', error);
    res.status(500).json({ error: 'Failed to delete account' });
  }
});

module.exports = router;