// frontend/src/utils/performanceMonitor.js
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';
import api from '../api.js';

export const initPerformanceMonitoring = () => {
  // Track Core Web Vitals
  if (typeof window !== 'undefined') {
    getCLS((metric) => {
      console.log('CLS:', metric);
      sendMetricToAnalytics('cls', metric.value, metric.id);
    });

    getFID((metric) => {
      console.log('FID:', metric);
      sendMetricToAnalytics('fid', metric.value, metric.id);
    });

    getFCP((metric) => {
      console.log('FCP:', metric);
      sendMetricToAnalytics('fcp', metric.value, metric.id);
    });

    getLCP((metric) => {
      console.log('LCP:', metric);
      sendMetricToAnalytics('lcp', metric.value, metric.id);
    });

    getTTFB((metric) => {
      console.log('TTFB:', metric);
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
    console.warn('Failed to send performance metric:', error);
  }
};

// Track component render times in development
export const withPerformance = (Component, componentName) => {
  return (props) => {
    const start = performance.now();
    const result = React.createElement(Component, props);
    const end = performance.now();

    if (process.env.NODE_ENV === 'development') {
      console.log(`${componentName} render time: ${(end - start).toFixed(2)}ms`);
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
      console.log(`Page load time: ${pageLoadTime}ms`);
      return pageLoadTime;
    }
    return null;
  },

  measureFCP: () => {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.name === 'first-contentful-paint') {
            console.log(`First Contentful Paint: ${entry.startTime}ms`);
          }
        }
      });
      observer.observe({ entryTypes: ['paint'] });
    }
  },

  measureLCP: () => {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          console.log(`Largest Contentful Paint: ${entry.startTime}ms`);
        }
      });
      observer.observe({ entryTypes: ['largest-contentful-paint'] });
    }
  },

  monitorNetworkRequests: () => {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.initiatorType === 'fetch' || entry.initiatorType === 'xmlhttprequest') {
            console.log(`Network request: ${entry.name} - ${entry.duration}ms`);
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

    console.log('Legacy performance monitoring initialized');
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
