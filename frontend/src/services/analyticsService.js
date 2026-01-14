import axios from 'axios';

class AnalyticsService {
  constructor() {
    this.sessionId = this.getOrCreateSessionId();
    this.queue = [];
    this.isOnline = navigator.onLine;
    
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
    let sessionId = sessionStorage.getItem('analytics_session_id');
    if (!sessionId) {
      sessionId = `session-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
      sessionStorage.setItem('analytics_session_id', sessionId);
    }
    return sessionId;
  }

  // Track a page view
  async trackPageView(pageUrl) {
    return this.trackEvent('page_view', pageUrl, {
      referrer: document.referrer,
      title: document.title
    });
  }

  // Track a custom event
  async trackEvent(eventType, pageUrl = window.location.pathname, eventData = {}) {
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
        return true;
      } catch (error) {
        console.error('Analytics tracking failed:', error);
        // Queue for later if network error
        if (error.code === 'ERR_NETWORK') {
          this.queue.push(event);
        }
        return false;
      }
    } else {
      // Queue the event for later
      this.queue.push(event);
      this.saveQueue();
      return false;
    }
  }

  // Track user action
  async trackAction(actionName, actionData = {}) {
    return this.trackEvent('action', window.location.pathname, {
      action: actionName,
      ...actionData
    });
  }

  // Flush queued events
  async flushQueue() {
    if (this.queue.length === 0) return;

    const eventsToSend = [...this.queue];
    this.queue = [];
    this.saveQueue();

    for (const event of eventsToSend) {
      try {
        await axios.post('/api/analytics/track', event);
      } catch (error) {
        console.error('Failed to send queued event:', error);
        // Re-queue if still failing
        if (error.code === 'ERR_NETWORK') {
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
      console.error('Failed to save analytics queue:', error);
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
      console.error('Failed to load analytics queue:', error);
    }
  }

  // Get analytics stats (admin only)
  async getStats() {
    try {
      const response = await axios.get('/api/analytics/stats');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch analytics stats:', error);
      throw error;
    }
  }

  // Get visitor count (admin only)
  async getVisitorCount(days = 7) {
    try {
      const response = await axios.get(`/api/analytics/visitors?days=${days}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch visitor count:', error);
      throw error;
    }
  }

  // Get user stats (admin only)
  async getUserStats() {
    try {
      const response = await axios.get('/api/analytics/users');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch user stats:', error);
      throw error;
    }
  }

  // Get activity timeline (admin only)
  async getActivity(page = 1, limit = 50) {
    try {
      const response = await axios.get(`/api/analytics/activity?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch activity timeline:', error);
      throw error;
    }
  }
}

// Create a singleton instance
const analyticsService = new AnalyticsService();

// Load any queued events
analyticsService.loadQueue();

export default analyticsService;
