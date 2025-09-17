import { useState, useEffect, useCallback } from 'react'

const PerformanceMonitor = () => {
  const [metrics, setMetrics] = useState({
    fcp: null, // First Contentful Paint
    lcp: null, // Largest Contentful Paint
    fid: null, // First Input Delay
    cls: null, // Cumulative Layout Shift
    ttfb: null, // Time to First Byte
    loadTime: null,
    domContentLoaded: null,
    firstPaint: null,
    memoryUsage: null,
    networkRequests: 0,
    cacheHitRate: 0
  })

  const [isSlowConnection, setIsSlowConnection] = useState(false)
  const [connectionType, setConnectionType] = useState('unknown')

  // Monitor Core Web Vitals
  useEffect(() => {
    // First Contentful Paint
    const observeFCP = () => {
      if ('PerformanceObserver' in window) {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries()
          const lastEntry = entries[entries.length - 1]
          setMetrics(prev => ({ ...prev, fcp: lastEntry.startTime }))
        })
        observer.observe({ entryTypes: ['paint'] })
      }
    }

    // Largest Contentful Paint
    const observeLCP = () => {
      if ('PerformanceObserver' in window) {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries()
          const lastEntry = entries[entries.length - 1]
          setMetrics(prev => ({ ...prev, lcp: lastEntry.startTime }))
        })
        observer.observe({ entryTypes: ['largest-contentful-paint'] })
      }
    }

    // First Input Delay
    const observeFID = () => {
      if ('PerformanceObserver' in window) {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries()
          entries.forEach((entry) => {
            setMetrics(prev => ({ ...prev, fid: entry.processingStart - entry.startTime }))
          })
        })
        observer.observe({ entryTypes: ['first-input'] })
      }
    }

    // Cumulative Layout Shift
    const observeCLS = () => {
      if ('PerformanceObserver' in window) {
        let clsValue = 0
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries()
          entries.forEach((entry) => {
            if (!entry.hadRecentInput) {
              clsValue += entry.value
            }
          })
          setMetrics(prev => ({ ...prev, cls: clsValue }))
        })
        observer.observe({ entryTypes: ['layout-shift'] })
      }
    }

    observeFCP()
    observeLCP()
    observeFID()
    observeCLS()
  }, [])

  // Monitor page load metrics
  useEffect(() => {
    const handleLoad = () => {
      const navigation = performance.getEntriesByType('navigation')[0]
      if (navigation) {
        setMetrics(prev => ({
          ...prev,
          loadTime: navigation.loadEventEnd - navigation.loadEventStart,
          domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
          ttfb: navigation.responseStart - navigation.requestStart
        }))
      }
    }

    const handleDOMContentLoaded = () => {
      const navigation = performance.getEntriesByType('navigation')[0]
      if (navigation) {
        setMetrics(prev => ({
          ...prev,
          domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart
        }))
      }
    }

    if (document.readyState === 'complete') {
      handleLoad()
    } else {
      window.addEventListener('load', handleLoad)
      document.addEventListener('DOMContentLoaded', handleDOMContentLoaded)
    }

    return () => {
      window.removeEventListener('load', handleLoad)
      document.removeEventListener('DOMContentLoaded', handleDOMContentLoaded)
    }
  }, [])

  // Monitor network requests
  useEffect(() => {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        setMetrics(prev => ({
          ...prev,
          networkRequests: prev.networkRequests + entries.length
        }))
      })
      observer.observe({ entryTypes: ['resource'] })
    }
  }, [])

  // Monitor memory usage
  const monitorMemory = useCallback(() => {
    if ('memory' in performance) {
      const memory = performance.memory
      setMetrics(prev => ({
        ...prev,
        memoryUsage: {
          used: memory.usedJSHeapSize,
          total: memory.totalJSHeapSize,
          limit: memory.jsHeapSizeLimit
        }
      }))
    }
  }, [])

  useEffect(() => {
    const interval = setInterval(monitorMemory, 5000) // Check every 5 seconds
    return () => clearInterval(interval)
  }, [monitorMemory])

  // Monitor connection quality
  useEffect(() => {
    const updateConnectionStatus = () => {
      if ('connection' in navigator) {
        const connection = navigator.connection
        setConnectionType(connection.effectiveType || 'unknown')
        setIsSlowConnection(connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g')
      }
    }

    updateConnectionStatus()

    if ('connection' in navigator) {
      const connection = navigator.connection
      connection.addEventListener('change', updateConnectionStatus)

      return () => {
        connection.removeEventListener('change', updateConnectionStatus)
      }
    }
  }, [])

  // Performance optimization suggestions
  const getOptimizationSuggestions = () => {
    const suggestions = []

    if (metrics.fcp && metrics.fcp > 2000) {
      suggestions.push('Optimize images and reduce render-blocking resources')
    }

    if (metrics.lcp && metrics.lcp > 2500) {
      suggestions.push('Improve Largest Contentful Paint by optimizing large elements')
    }

    if (metrics.cls && metrics.cls > 0.1) {
      suggestions.push('Fix layout shifts by reserving space for dynamic content')
    }

    if (metrics.fid && metrics.fid > 100) {
      suggestions.push('Reduce JavaScript execution time and improve interactivity')
    }

    if (isSlowConnection) {
      suggestions.push('Enable compression and optimize for slow connections')
    }

    if (metrics.memoryUsage && metrics.memoryUsage.used > metrics.memoryUsage.limit * 0.8) {
      suggestions.push('Optimize memory usage and implement lazy loading')
    }

    return suggestions
  }

  // Send performance data to analytics
  const reportPerformance = useCallback(() => {
    const performanceData = {
      ...metrics,
      timestamp: Date.now(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      connectionType,
      suggestions: getOptimizationSuggestions()
    }

    // Send to analytics service
    if (window.gtag) {
      window.gtag('event', 'performance_metrics', performanceData)
    }

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      // console.log('Performance Metrics:', performanceData)
    }
  }, [metrics, connectionType])

  useEffect(() => {
    // Report performance after page load
    const timer = setTimeout(reportPerformance, 5000)
    return () => clearTimeout(timer)
  }, [reportPerformance])

  return {
    metrics,
    isSlowConnection,
    connectionType,
    suggestions: getOptimizationSuggestions(),
    reportPerformance
  }
}

export default PerformanceMonitor
