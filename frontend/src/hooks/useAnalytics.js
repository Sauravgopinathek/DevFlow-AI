import { useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import analyticsService from '../services/analyticsService';

/**
 * Hook for tracking analytics events
 * Automatically tracks page views on route changes
 */
const useAnalytics = (autoTrackPageViews = true) => {
  const location = useLocation();

  // Track page views automatically on route change
  useEffect(() => {
    if (autoTrackPageViews) {
      analyticsService.trackPageView(location.pathname + location.search);
    }
  }, [location, autoTrackPageViews]);

  // Track a custom event
  const trackEvent = useCallback((eventType, eventData = {}) => {
    return analyticsService.trackEvent(
      eventType,
      location.pathname + location.search,
      eventData
    );
  }, [location]);

  // Track a user action
  const trackAction = useCallback((actionName, actionData = {}) => {
    return analyticsService.trackAction(actionName, actionData);
  }, []);

  // Track page view manually
  const trackPageView = useCallback((pageUrl) => {
    return analyticsService.trackPageView(pageUrl || location.pathname + location.search);
  }, [location]);

  return {
    trackEvent,
    trackAction,
    trackPageView
  };
};

export default useAnalytics;
