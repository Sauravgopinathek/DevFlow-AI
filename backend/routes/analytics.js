const express = require('express');
const router = express.Router();
const Analytics = require('../models/Analytics');
const User = require('../models/User');
const { requireAdmin } = require('../middleware/adminAuth');

// Track an analytics event (public endpoint with rate limiting in production)
router.post('/track', async (req, res) => {
  try {
    const {
      pageUrl,
      sessionId,
      eventType = 'page_view',
      eventData = {}
    } = req.body;

    // Validate required fields
    if (!pageUrl || !sessionId) {
      return res.status(400).json({ 
        error: 'pageUrl and sessionId are required' 
      });
    }

    // Get IP address (handle proxy scenarios)
    const ipAddress = req.headers['x-forwarded-for'] || 
                     req.connection.remoteAddress || 
                     req.ip || 
                     'unknown';

    // Get user agent
    const userAgent = req.headers['user-agent'] || 'unknown';

    // Get userId if authenticated
    const userId = req.isAuthenticated() ? req.user._id : null;

    // Create analytics record
    const analyticsRecord = new Analytics({
      pageUrl,
      userId,
      sessionId,
      ipAddress,
      userAgent,
      eventType,
      eventData,
      timestamp: new Date()
    });

    await analyticsRecord.save();

    res.json({ 
      success: true,
      message: 'Event tracked successfully' 
    });
  } catch (error) {
    console.error('Analytics tracking error:', error);
    // Don't fail the request if analytics fails
    res.json({ 
      success: false,
      message: 'Analytics tracking failed (non-critical)' 
    });
  }
});

// Get analytics summary (admin only)
router.get('/stats', requireAdmin, async (req, res) => {
  try {
    const now = new Date();
    const oneDayAgo = new Date(now - 24 * 60 * 60 * 1000);
    const sevenDaysAgo = new Date(now - 7 * 24 * 60 * 60 * 1000);
    const thirtyDaysAgo = new Date(now - 30 * 24 * 60 * 60 * 1000);

    // Total registered users
    const totalUsers = await User.countDocuments({ isRegistered: true });
    
    // Approved users
    const approvedUsers = await User.countDocuments({ 
      registrationStatus: 'approved' 
    });

    // Total page views
    const totalPageViews = await Analytics.countDocuments({ 
      eventType: 'page_view' 
    });

    // Unique visitors (unique session IDs)
    const uniqueVisitors24h = await Analytics.distinct('sessionId', {
      timestamp: { $gte: oneDayAgo }
    });
    
    const uniqueVisitors7d = await Analytics.distinct('sessionId', {
      timestamp: { $gte: sevenDaysAgo }
    });
    
    const uniqueVisitors30d = await Analytics.distinct('sessionId', {
      timestamp: { $gte: thirtyDaysAgo }
    });

    // Active users (logged in users with activity)
    const activeUsers24h = await Analytics.distinct('userId', {
      userId: { $ne: null },
      timestamp: { $gte: oneDayAgo }
    });

    const activeUsers7d = await Analytics.distinct('userId', {
      userId: { $ne: null },
      timestamp: { $gte: sevenDaysAgo }
    });

    const activeUsers30d = await Analytics.distinct('userId', {
      userId: { $ne: null },
      timestamp: { $gte: thirtyDaysAgo }
    });

    // New registrations over time (last 30 days)
    const registrationsOverTime = await User.aggregate([
      {
        $match: {
          registeredAt: { $gte: thirtyDaysAgo }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$registeredAt' }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    // Popular pages (top 10)
    const popularPages = await Analytics.aggregate([
      {
        $match: {
          eventType: 'page_view',
          timestamp: { $gte: sevenDaysAgo }
        }
      },
      {
        $group: {
          _id: '$pageUrl',
          views: { $sum: 1 }
        }
      },
      {
        $sort: { views: -1 }
      },
      {
        $limit: 10
      }
    ]);

    res.json({
      users: {
        total: totalUsers,
        approved: approvedUsers,
        active24h: activeUsers24h.length,
        active7d: activeUsers7d.length,
        active30d: activeUsers30d.length
      },
      visitors: {
        unique24h: uniqueVisitors24h.length,
        unique7d: uniqueVisitors7d.length,
        unique30d: uniqueVisitors30d.length
      },
      pageViews: {
        total: totalPageViews
      },
      charts: {
        registrationsOverTime,
        popularPages
      }
    });
  } catch (error) {
    console.error('Analytics stats error:', error);
    res.status(500).json({ error: 'Failed to fetch analytics stats' });
  }
});

// Get unique visitor count (admin only)
router.get('/visitors', requireAdmin, async (req, res) => {
  try {
    const { days = 7 } = req.query;
    const daysAgo = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    const uniqueVisitors = await Analytics.distinct('sessionId', {
      timestamp: { $gte: daysAgo }
    });

    res.json({
      count: uniqueVisitors.length,
      period: `${days} days`,
      startDate: daysAgo
    });
  } catch (error) {
    console.error('Visitor count error:', error);
    res.status(500).json({ error: 'Failed to fetch visitor count' });
  }
});

// Get registered user stats (admin only)
router.get('/users', requireAdmin, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ isRegistered: true });
    const approvedUsers = await User.countDocuments({ 
      registrationStatus: 'approved' 
    });
    const pendingUsers = await User.countDocuments({ 
      registrationStatus: 'pending' 
    });

    // Recent registrations
    const recentUsers = await User.find({ isRegistered: true })
      .sort({ registeredAt: -1 })
      .limit(10)
      .select('username displayName email registeredAt registrationStatus');

    res.json({
      total: totalUsers,
      approved: approvedUsers,
      pending: pendingUsers,
      recent: recentUsers
    });
  } catch (error) {
    console.error('User stats error:', error);
    res.status(500).json({ error: 'Failed to fetch user stats' });
  }
});

// Get user activity timeline (admin only)
router.get('/activity', requireAdmin, async (req, res) => {
  try {
    const { limit = 50, page = 1 } = req.query;
    const skip = (page - 1) * limit;

    const activities = await Analytics.find()
      .sort({ timestamp: -1 })
      .limit(parseInt(limit))
      .skip(skip)
      .populate('userId', 'username displayName email')
      .lean();

    const total = await Analytics.countDocuments();

    res.json({
      activities,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Activity timeline error:', error);
    res.status(500).json({ error: 'Failed to fetch activity timeline' });
  }
});

module.exports = router;
