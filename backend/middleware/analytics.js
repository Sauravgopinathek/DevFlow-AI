const Analytics = require('../models/Analytics');

// Middleware to automatically track page views and API calls
const trackAnalytics = (options = {}) => {
  const { 
    trackPageViews = true, 
    trackApiCalls = false,
    ignorePaths = ['/health', '/favicon.ico']
  } = options;

  return async (req, res, next) => {
    try {
      // Skip tracking for certain paths
      if (ignorePaths.some(path => req.path.includes(path))) {
        return next();
      }

      // Skip tracking for OPTIONS requests
      if (req.method === 'OPTIONS') {
        return next();
      }

      // Determine if we should track this request
      const shouldTrack = (
        (trackPageViews && req.method === 'GET') ||
        (trackApiCalls && req.path.startsWith('/api/'))
      );

      if (!shouldTrack) {
        return next();
      }

      // Get session ID from session or generate one
      const sessionId = req.session?.id || 
                       req.headers['x-session-id'] || 
                       `anon-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      // Get IP address
      const ipAddress = req.headers['x-forwarded-for'] || 
                       req.connection.remoteAddress || 
                       req.ip || 
                       'unknown';

      // Get user agent
      const userAgent = req.headers['user-agent'] || 'unknown';

      // Get userId if authenticated
      const userId = req.isAuthenticated() ? req.user._id : null;

      // Determine event type
      let eventType = 'page_view';
      if (req.path.startsWith('/api/')) {
        eventType = 'api_call';
      }

      // Create analytics record asynchronously (don't block the request)
      setImmediate(() => {
        Analytics.create({
          pageUrl: req.originalUrl || req.path,
          userId,
          sessionId,
          ipAddress,
          userAgent,
          eventType,
          eventData: {
            method: req.method,
            referrer: req.headers.referer || req.headers.referrer,
            query: req.query
          },
          timestamp: new Date()
        }).catch(err => {
          // Silently fail - don't log in production to avoid noise
          if (process.env.NODE_ENV !== 'production') {
            console.error('Analytics tracking failed:', err.message);
          }
        });
      });
    } catch (error) {
      // Never let analytics errors affect the actual request
      if (process.env.NODE_ENV !== 'production') {
        console.error('Analytics middleware error:', error);
      }
    }

    next();
  };
};

// Track specific events (login, logout, registration, etc.)
const trackEvent = async (req, eventType, eventData = {}) => {
  try {
    // Get session ID
    const sessionId = req.session?.id || 
                     req.headers['x-session-id'] || 
                     `anon-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Get IP address
    const ipAddress = req.headers['x-forwarded-for'] || 
                     req.connection.remoteAddress || 
                     req.ip || 
                     'unknown';

    // Get user agent
    const userAgent = req.headers['user-agent'] || 'unknown';

    // Get userId if authenticated
    const userId = req.isAuthenticated() ? req.user._id : null;

    // Create analytics record
    await Analytics.create({
      pageUrl: req.originalUrl || req.path,
      userId,
      sessionId,
      ipAddress,
      userAgent,
      eventType,
      eventData,
      timestamp: new Date()
    });

    return true;
  } catch (error) {
    console.error('Event tracking failed:', error);
    return false;
  }
};

module.exports = {
  trackAnalytics,
  trackEvent
};
