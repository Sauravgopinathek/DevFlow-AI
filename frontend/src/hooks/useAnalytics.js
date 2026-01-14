import { useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import analyticsService from '../services/analyticsService';

/**
 * Hook for tracking analytics events
 * Automatically tracks page views on route changes
 * All analytics operations are wrapped in try-catch to prevent crashes
 */
const useAnalytics = (autoTrackPageViews = true) => {
  const location = useLocation();

  // Track page views automatically on route change
  useEffect(() => {
    if (autoTrackPageViews) {
      try {
        analyticsService.trackPageView(location.pathname + location.search);
      } catch (error) {
        // Silently fail - analytics should never crash the app
        if (process.env.NODE_ENV !== 'production') {
          console.debug('useAnalytics: trackPageView error:', error.message);
        }
      }
    }
  }, [location, autoTrackPageViews]);

  // Track a custom event
  const trackEvent = useCallback((eventType, eventData = {}) => {
    try {
      return analyticsService.trackEvent(
        eventType,
        location.pathname + location.search,
        eventData
      );
    } catch (error) {
      // Silently fail - analytics should never crash the app
      if (process.env.NODE_ENV !== 'production') {
        console.debug('useAnalytics: trackEvent error:', error.message);
      }
      return Promise.resolve(false);
    }
  }, [location]);

  // Track a user action
  const trackAction = useCallback((actionName, actionData = {}) => {
    try {
      return analyticsService.trackAction(actionName, actionData);
    } catch (error) {
      // Silently fail - analytics should never crash the app
      if (process.env.NODE_ENV !== 'production') {
        console.debug('useAnalytics: trackAction error:', error.message);
      }
      return Promise.resolve(false);
    }
  }, []);

  // Track page view manually
  const trackPageView = useCallback((pageUrl) => {
    try {
      return analyticsService.trackPageView(pageUrl || location.pathname + location.search);
    } catch (error) {
      // Silently fail - analytics should never crash the app
      if (process.env.NODE_ENV !== 'production') {
        console.debug('useAnalytics: manual trackPageView error:', error.message);
      }
      return Promise.resolve(false);
    }
  }, [location]);

  return {
    trackEvent,
    trackAction,
    trackPageView
  };
};

export default useAnalytics;
