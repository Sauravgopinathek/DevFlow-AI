import axios from 'axios';

class AnalyticsService {
  constructor() {
    this.sessionId = this.getOrCreateSessionId();
    this.queue = [];
    this.isOnline = navigator.onLine;
    this.isEnabled = true; // Can be disabled if backend fails
    this.failureCount = 0; // Track consecutive failures
    this.maxFailures = 3; // Disable after 3 consecutive failures
    
    // Listen for online/offline events
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.flushQueue();
    });
    
    window.addEventListener('offline', () => {
      this.isOnline = false;
    });
  }

  // Get or create a session ID
  getOrCreateSessionId() {
    try {
      let sessionId = sessionStorage.getItem('analytics_session_id');
      if (!sessionId) {
        sessionId = `session-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
        sessionStorage.setItem('analytics_session_id', sessionId);
      }
      return sessionId;
    } catch (error) {
      // Fallback if sessionStorage is not available
      return `session-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
    }
  }

  // Track a page view
  async trackPageView(pageUrl) {
    // Silently fail if analytics is disabled
    if (!this.isEnabled) {
      return false;
    }
    
    try {
      return await this.trackEvent('page_view', pageUrl, {
        referrer: document.referrer,
        title: document.title
      });
    } catch (error) {
      // Silently fail - analytics should never crash the app
      if (process.env.NODE_ENV !== 'production') {
        console.debug('Analytics trackPageView failed:', error.message);
      }
      return false;
    }
  }

  // Track a custom event
  async trackEvent(eventType, pageUrl = window.location.pathname, eventData = {}) {
    // Return early if analytics is disabled
    if (!this.isEnabled) {
      return false;
    }

    try {
      const event = {
        pageUrl,
        sessionId: this.sessionId,
        eventType,
        eventData: {
          ...eventData,
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent,
          screenResolution: `${window.screen.width}x${window.screen.height}`,
          viewport: `${window.innerWidth}x${window.innerHeight}`
        }
      };

      if (this.isOnline) {
        try {
          await axios.post('/api/analytics/track', event);
          // Reset failure count on success
          this.failureCount = 0;
          return true;
        } catch (error) {
          // Increment failure count
          this.failureCount++;
          
          // Disable analytics if we've had too many consecutive failures
          if (this.failureCount >= this.maxFailures) {
            this.isEnabled = false;
            if (process.env.NODE_ENV !== 'production') {
              console.debug('Analytics disabled after multiple failures');
            }
          }
          
          // Only log in development
          if (process.env.NODE_ENV !== 'production') {
            console.debug('Analytics tracking failed:', error.message);
          }
          
          // Queue for later if network error (not server errors like 404, 500)
          if (error.code === 'ERR_NETWORK' && this.isEnabled) {
            this.queue.push(event);
            this.saveQueue();
          }
          return false;
        }
      } else {
        // Queue the event for later
        this.queue.push(event);
        this.saveQueue();
        return false;
      }
    } catch (error) {
      // Catch any unexpected errors
      if (process.env.NODE_ENV !== 'production') {
        console.debug('Analytics trackEvent error:', error.message);
      }
      return false;
    }
  }

  // Track user action
  async trackAction(actionName, actionData = {}) {
    // Silently fail if analytics is disabled
    if (!this.isEnabled) {
      return false;
    }
    
    try {
      return await this.trackEvent('action', window.location.pathname, {
        action: actionName,
        ...actionData
      });
    } catch (error) {
      // Silently fail - analytics should never crash the app
      if (process.env.NODE_ENV !== 'production') {
        console.debug('Analytics trackAction failed:', error.message);
      }
      return false;
    }
  }

  // Flush queued events
  async flushQueue() {
    if (this.queue.length === 0 || !this.isEnabled) return;

    const eventsToSend = [...this.queue];
    this.queue = [];
    this.saveQueue();

    for (const event of eventsToSend) {
      try {
        await axios.post('/api/analytics/track', event);
      } catch (error) {
        // Only log in development
        if (process.env.NODE_ENV !== 'production') {
          console.debug('Failed to send queued event:', error.message);
        }
        // Re-queue if still failing with network errors
        if (error.code === 'ERR_NETWORK' && this.isEnabled) {
          this.queue.push(event);
        }
      }
    }
  }

  // Save queue to localStorage
  saveQueue() {
    try {
      localStorage.setItem('analytics_queue', JSON.stringify(this.queue));
    } catch (error) {
      // Silently fail - don't log to avoid console spam
    }
  }

  // Load queue from localStorage
  loadQueue() {
    try {
      const saved = localStorage.getItem('analytics_queue');
      if (saved) {
        this.queue = JSON.parse(saved);
      }
    } catch (error) {
      // Silently fail - don't log to avoid console spam
    }
  }

  // Get analytics stats (admin only)
  async getStats() {
    try {
      const response = await axios.get('/api/analytics/stats');
      return response.data;
    } catch (error) {
      if (process.env.NODE_ENV !== 'production') {
        console.debug('Failed to fetch analytics stats:', error.message);
      }
      throw error;
    }
  }

  // Get visitor count (admin only)
  async getVisitorCount(days = 7) {
    try {
      const response = await axios.get(`/api/analytics/visitors?days=${days}`);
      return response.data;
    } catch (error) {
      if (process.env.NODE_ENV !== 'production') {
        console.debug('Failed to fetch visitor count:', error.message);
      }
      throw error;
    }
  }

  // Get user stats (admin only)
  async getUserStats() {
    try {
      const response = await axios.get('/api/analytics/users');
      return response.data;
    } catch (error) {
      if (process.env.NODE_ENV !== 'production') {
        console.debug('Failed to fetch user stats:', error.message);
      }
      throw error;
    }
  }

  // Get activity timeline (admin only)
  async getActivity(page = 1, limit = 50) {
    try {
      const response = await axios.get(`/api/analytics/activity?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      if (process.env.NODE_ENV !== 'production') {
        console.debug('Failed to fetch activity timeline:', error.message);
      }
      throw error;
    }
  }
}

// Create a singleton instance
const analyticsService = new AnalyticsService();

// Load any queued events (wrapped in try-catch)
try {
  analyticsService.loadQueue();
} catch (error) {
  // Silently fail if loading queue fails
}

export default analyticsService;
