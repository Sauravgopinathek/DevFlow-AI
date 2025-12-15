const express = require('express');
const router = express.Router();
const User = require('../models/User');
const requireAuth = require('../middleware/requireAuth');

// Admin middleware - only allow specific users
const requireAdmin = (req, res, next) => {
  const adminUsers = ['sauravgopinath']; // Add your GitHub username here
  
  if (!req.user || !adminUsers.includes(req.user.username.toLowerCase())) {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};

// Get all users
router.get('/users', requireAuth, requireAdmin, async (req, res) => {
  try {
    const users = await User.find({})
      .select('username displayName email registrationStatus registeredAt approvedAt avatarUrl')
      .sort({ registeredAt: -1 });
    
    res.json({ users });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Approve user
router.post('/approve/:userId', requireAuth, requireAdmin, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.userId,
      {
        registrationStatus: 'approved',
        approvedAt: new Date()
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ message: 'User approved successfully', user });
  } catch (error) {
    console.error('Error approving user:', error);
    res.status(500).json({ error: 'Failed to approve user' });
  }
});

// Reject user
router.post('/reject/:userId', requireAuth, requireAdmin, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.userId,
      {
        registrationStatus: 'rejected'
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ message: 'User rejected', user });
  } catch (error) {
    console.error('Error rejecting user:', error);
    res.status(500).json({ error: 'Failed to reject user' });
  }
});

// Add user to whitelist (pre-approve)
router.post('/whitelist', requireAuth, requireAdmin, async (req, res) => {
  try {
    const { username } = req.body;
    
    if (!username) {
      return res.status(400).json({ error: 'Username is required' });
    }

    // This would typically update a whitelist in database or config
    // For now, we'll just return success - you'd need to manually add to passport.js
    res.json({ 
      message: `Username ${username} should be added to whitelist in passport.js`,
      note: 'Manual update required in backend/config/passport.js'
    });
  } catch (error) {
    console.error('Error adding to whitelist:', error);
    res.status(500).json({ error: 'Failed to add to whitelist' });
  }
});

// Get pending users
router.get('/pending', requireAuth, requireAdmin, async (req, res) => {
  try {
    const pendingUsers = await User.find({ registrationStatus: 'pending' })
      .select('username displayName email registeredAt avatarUrl')
      .sort({ registeredAt: -1 });
    
    res.json({ pendingUsers });
  } catch (error) {
    console.error('Error fetching pending users:', error);
    res.status(500).json({ error: 'Failed to fetch pending users' });
  }
});

// Delete user account (admin deletion)
router.delete('/users/:userId', requireAuth, requireAdmin, async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Prevent admin from deleting themselves
    if (userId === req.user._id.toString()) {
      return res.status(400).json({ error: 'Cannot delete your own admin account' });
    }
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const username = user.username;
    await User.findByIdAndDelete(userId);
    
    console.log(`🗑️ Admin deleted user account: ${username} (by ${req.user.username})`);
    res.json({ 
      message: 'User account deleted successfully',
      deletedUser: username
    });
  } catch (error) {
    console.error('Error deleting user account:', error);
    res.status(500).json({ error: 'Failed to delete user account' });
  }
});

// Follow user (admin action)
router.post('/follow/:userId', requireAuth, requireAdmin, async (req, res) => {
  try {
    const { userId } = req.params;
    const adminUsername = req.user.username;
    
    const userToFollow = await User.findById(userId);
    if (!userToFollow) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    console.log(`Admin ${adminUsername} is now following user ${userToFollow.username}`);
    
    res.json({ 
      message: 'User followed successfully',
      followedUser: userToFollow.username
    });
  } catch (error) {
    console.error('Error following user:', error);
    res.status(500).json({ error: 'Failed to follow user' });
  }
});

module.exports = router;