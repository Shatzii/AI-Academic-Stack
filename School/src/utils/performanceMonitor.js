// Performance monitoring utility
export const performanceMonitor = {
  // Measure page load time
  measurePageLoad: () => {
    if (window.performance && window.performance.timing) {
      const timing = window.performance.timing
      const pageLoadTime = timing.loadEventEnd - timing.navigationStart
      console.log(`Page load time: ${pageLoadTime}ms`)
      return pageLoadTime
    }
    return null
  },

  // Measure first contentful paint
  measureFCP: () => {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.name === 'first-contentful-paint') {
            console.log(`First Contentful Paint: ${entry.startTime}ms`)
          }
        }
      })
      observer.observe({ entryTypes: ['paint'] })
    }
  },

  // Measure largest contentful paint
  measureLCP: () => {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          console.log(`Largest Contentful Paint: ${entry.startTime}ms`)
        }
      })
      observer.observe({ entryTypes: ['largest-contentful-paint'] })
    }
  },

  // Monitor network requests
  monitorNetworkRequests: () => {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.initiatorType === 'fetch' || entry.initiatorType === 'xmlhttprequest') {
            console.log(`Network request: ${entry.name} - ${entry.duration}ms`)
          }
        }
      })
      observer.observe({ entryTypes: ['resource'] })
    }
  },

  // Initialize all performance monitoring
  init: () => {
    // Measure page load on load event
    window.addEventListener('load', () => {
      setTimeout(() => {
        performanceMonitor.measurePageLoad()
      }, 0)
    })

    // Start monitoring
    performanceMonitor.measureFCP()
    performanceMonitor.measureLCP()
    performanceMonitor.monitorNetworkRequests()

    console.log('Performance monitoring initialized')
  }
}

// Initialize performance monitoring in development
if (process.env.NODE_ENV === 'development') {
  performanceMonitor.init()
}

export default performanceMonitor
