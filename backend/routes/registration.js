const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const emailService = require('../services/emailService');

// Register a new user with email/password
router.post('/register', async (req, res) => {
  try {
    const { username, displayName, email, password } = req.body;

    // Validate required fields
    if (!username || !displayName || !email || !password) {
      return res.status(400).json({ 
        error: 'Username, display name, email, and password are required' 
      });
    }

    // Validate password strength
    if (password.length < 6) {
      return res.status(400).json({ 
        error: 'Password must be at least 6 characters long' 
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ 
      $or: [{ email }, { username }] 
    });
    if (existingUser) {
      return res.status(400).json({ 
        error: existingUser.email === email ? 
          'User with this email already exists' : 
          'Username already taken' 
      });
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Generate email verification token
    const emailVerificationToken = crypto.randomBytes(32).toString('hex');

    // Create new user - requires email verification
    const user = new User({
      username,
      displayName,
      email,
      password: hashedPassword,
      emailVerificationToken,
      emailVerified: false, // Must be verified via email
      isRegistered: true,
      registrationStatus: 'pending', // Pending until email verified
      registeredAt: new Date(),
      authProvider: 'email'
    });

    await user.save();

    // Send verification email
    const emailResult = await emailService.sendVerificationEmail(email, emailVerificationToken, username);
    
    if (emailResult.success) {
      res.json({
        message: 'Registration successful! Please check your email to verify your account before logging in.',
        user: {
          id: user._id,
          username: user.username,
          displayName: user.displayName,
          email: user.email,
          registrationStatus: user.registrationStatus,
          emailVerified: user.emailVerified
        },
        verificationUrl: emailResult.verificationUrl // For development/testing
      });
    } else {
      // If email sending fails, still create account but inform user
      res.json({
        message: 'Registration successful! However, we could not send the verification email. Please contact support.',
        user: {
          id: user._id,
          username: user.username,
          displayName: user.displayName,
          email: user.email,
          registrationStatus: user.registrationStatus,
          emailVerified: user.emailVerified
        }
      });
    }
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Verify email with token
router.get('/verify-email/:token', async (req, res) => {
  try {
    const { token } = req.params;

    // Find user with this verification token
    const user = await User.findOne({ emailVerificationToken: token });
    
    if (!user) {
      return res.status(400).json({ 
        error: 'Invalid or expired verification token' 
      });
    }

    // Verify the user
    user.emailVerified = true;
    user.emailVerificationToken = undefined;
    user.registrationStatus = 'approved'; // Approve after email verification
    user.approvedAt = new Date();
    
    await user.save();

    // Send welcome email
    await emailService.sendWelcomeEmail(user.email, user.username);

    res.json({
      message: 'Email verified successfully! You can now login to your account.',
      user: {
        id: user._id,
        username: user.username,
        displayName: user.displayName,
        email: user.email,
        emailVerified: user.emailVerified,
        registrationStatus: user.registrationStatus
      }
    });
  } catch (error) {
    console.error('Email verification error:', error);
    res.status(500).json({ error: 'Email verification failed' });
  }
});

// Resend verification email
router.post('/resend-verification', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.emailVerified) {
      return res.status(400).json({ error: 'Email is already verified' });
    }

    // Generate new verification token
    const newToken = crypto.randomBytes(32).toString('hex');
    user.emailVerificationToken = newToken;
    await user.save();

    // Send new verification email
    const emailResult = await emailService.sendVerificationEmail(email, newToken, user.username);
    
    if (emailResult.success) {
      res.json({
        message: 'Verification email sent! Please check your inbox.',
        verificationUrl: emailResult.verificationUrl // For development/testing
      });
    } else {
      res.status(500).json({ error: 'Failed to send verification email' });
    }
  } catch (error) {
    console.error('Resend verification error:', error);
    res.status(500).json({ error: 'Failed to resend verification email' });
  }
});

// Login with email/password
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({ 
        error: 'Email and password are required' 
      });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user || !user.password) {
      return res.status(401).json({ 
        error: 'Invalid email or password' 
      });
    }

    // Check if email is verified
    if (!user.emailVerified) {
      return res.status(401).json({ 
        error: 'Please verify your email address before logging in. Check your inbox for the verification email.',
        needsVerification: true,
        email: user.email
      });
    }

    // Check if user is approved
    if (user.registrationStatus !== 'approved') {
      return res.status(401).json({ 
        error: 'Account not approved yet' 
      });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ 
        error: 'Invalid email or password' 
      });
    }

    // Login user (create session)
    req.login(user, (err) => {
      if (err) {
        console.error('Login error:', err);
        return res.status(500).json({ error: 'Login failed' });
      }

      res.json({
        message: 'Login successful',
        user: {
          id: user._id,
          username: user.username,
          displayName: user.displayName,
          email: user.email,
          avatarUrl: user.avatarUrl,
          emailVerified: user.emailVerified
        }
      });
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Check registration status
router.get('/status/:email', async (req, res) => {
  try {
    const { email } = req.params;
    const user = await User.findOne({ email }, 'registrationStatus isRegistered approvedAt');
    
    if (!user) {
      return res.json({ 
        registered: false, 
        status: 'not_registered' 
      });
    }

    res.json({
      registered: user.isRegistered,
      status: user.registrationStatus,
      approvedAt: user.approvedAt
    });
  } catch (error) {
    console.error('Status check error:', error);
    res.status(500).json({ error: 'Failed to check status' });
  }
});

const { requireAdmin } = require('../middleware/adminAuth');

// Admin routes - protected with admin middleware
router.get('/pending', requireAdmin, async (req, res) => {
  try {
    const pendingUsers = await User.find(
      { registrationStatus: 'pending' },
      'username displayName email registeredAt'
    ).sort({ registeredAt: -1 });

    res.json({ pendingUsers });
  } catch (error) {
    console.error('Error fetching pending users:', error);
    res.status(500).json({ error: 'Failed to fetch pending users' });
  }
});

router.post('/approve/:userId', requireAdmin, async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.registrationStatus = 'approved';
    user.approvedAt = new Date();
    await user.save();

    res.json({ 
      message: 'User approved successfully',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        status: user.registrationStatus
      }
    });
  } catch (error) {
    console.error('Approval error:', error);
    res.status(500).json({ error: 'Failed to approve user' });
  }
});

router.post('/reject/:userId', requireAdmin, async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.registrationStatus = 'rejected';
    await user.save();

    res.json({ 
      message: 'User rejected',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        status: user.registrationStatus
      }
    });
  } catch (error) {
    console.error('Rejection error:', error);
    res.status(500).json({ error: 'Failed to reject user' });
  }
});

module.exports = router;