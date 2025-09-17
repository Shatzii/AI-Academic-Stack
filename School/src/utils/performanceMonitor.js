// frontend/src/utils/performanceMonitor.js
import React from 'react';
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';
import api from '../api.js';

export const initPerformanceMonitoring = () => {
  // Track Core Web Vitals
  if (typeof window !== 'undefined') {
    getCLS((metric) => {
      sendMetricToAnalytics('cls', metric.value, metric.id);
    });

    getFID((metric) => {
      sendMetricToAnalytics('fid', metric.value, metric.id);
    });

    getFCP((metric) => {
      sendMetricToAnalytics('fcp', metric.value, metric.id);
    });

    getLCP((metric) => {
      sendMetricToAnalytics('lcp', metric.value, metric.id);
    });

    getTTFB((metric) => {
      sendMetricToAnalytics('ttfb', metric.value, metric.id);
    });
  }

  // Track page load times
  if (typeof window !== 'undefined') {
    window.addEventListener('load', () => {
      const navigationTiming = performance.getEntriesByType('navigation')[0];
      if (navigationTiming) {
        const loadTime = navigationTiming.loadEventEnd - navigationTiming.navigationStart;

        // Send to analytics
        sendMetricToAnalytics('page_load_time', loadTime, window.location.pathname);
      }
    });
  }
};

// Send metrics to analytics endpoint
const sendMetricToAnalytics = async (metric, value, id) => {
  try {
    await api.post('/analytics/performance/', {
      metric,
      value,
      id,
      path: window.location.pathname,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent
    });
  } catch (error) {
    // Failed to send performance metric
  }
};

// Track component render times in development
export const withPerformance = (Component) => {
  return (props) => {
    const result = React.createElement(Component, props);

    if (process.env.NODE_ENV === 'development') {
      // Component render time tracking
    }

    return result;
  };
};

// Legacy performance monitor for backward compatibility
export const performanceMonitor = {
  measurePageLoad: () => {
    if (window.performance && window.performance.timing) {
      const timing = window.performance.timing;
      const pageLoadTime = timing.loadEventEnd - timing.navigationStart;
      return pageLoadTime;
    }
    return null;
  },

  measureFCP: () => {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.name === 'first-contentful-paint') {
            // First Contentful Paint measurement
          }
        }
      });
      observer.observe({ entryTypes: ['paint'] });
    }
  },

  measureLCP: () => {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver(() => {
        // Largest Contentful Paint measurement
      });
      observer.observe({ entryTypes: ['largest-contentful-paint'] });
    }
  },

  monitorNetworkRequests: () => {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.initiatorType === 'fetch' || entry.initiatorType === 'xmlhttprequest') {
            // Network request monitoring
          }
        }
      });
      observer.observe({ entryTypes: ['resource'] });
    }
  },

  init: () => {
    window.addEventListener('load', () => {
      setTimeout(() => {
        performanceMonitor.measurePageLoad();
      }, 0);
    });

    performanceMonitor.measureFCP();
    performanceMonitor.measureLCP();
    performanceMonitor.monitorNetworkRequests();

    // Legacy performance monitoring initialized
  }
};

// Auto-initialize performance monitoring
if (typeof window !== 'undefined') {
  // Use new implementation if web-vitals is available
  if (typeof getCLS !== 'undefined') {
    initPerformanceMonitoring();
  } else {
    // Fallback to legacy implementation
    if (process.env.NODE_ENV === 'development') {
      performanceMonitor.init();
    }
  }
}

export default performanceMonitor;
