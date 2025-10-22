// Analytics tracking utilities
class Analytics {
  constructor() {
    this.initialized = false
  }

  init() {
    if (this.initialized) return
    if (window.gtag) {
      this.initialized = true
      console.log('Analytics initialized')
    }
  }

  trackPageView(path, title) {
    if (window.gtag) {
      // Replace with your actual Google Analytics Measurement ID
      // Get it from https://analytics.google.com/
      const GA_ID = import.meta.env.VITE_GA_MEASUREMENT_ID || 'G-XXXXXXXXXX'
      window.gtag('config', GA_ID, {
        page_path: path,
        page_title: title
      })
    }
    if (process.env.NODE_ENV === 'development') {
      console.log('Page view tracked:', { path, title })
    }
  }

  trackEvent(category, action, label = null, value = null) {
    if (window.gtag) {
      window.gtag('event', action, {
        event_category: category,
        event_label: label,
        value: value
      })
    }
    if (process.env.NODE_ENV === 'development') {
      console.log('Event tracked:', { category, action, label, value })
    }
  }

  trackUserAction(action, data = {}) {
    this.trackEvent('User Action', action, JSON.stringify(data))
  }

  trackConversion(conversionType, value = 0) {
    this.trackEvent('Conversion', conversionType, null, value)
  }

  trackError(error, fatal = false) {
    if (window.gtag) {
      window.gtag('event', 'exception', {
        description: error.message || error.toString(),
        fatal: fatal
      })
    }
    console.error('Error tracked:', error)
  }

  trackWebVital(metric) {
    if (window.gtag) {
      window.gtag('event', metric.name, {
        value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
        event_category: 'Web Vitals',
        event_label: metric.id,
        non_interaction: true
      })
    }
    if (process.env.NODE_ENV === 'development') {
      console.log('Web Vital tracked:', metric)
    }
  }

  trackCourseEnrollment(courseId, courseName, price = 0) {
    this.trackEvent('Course', 'Enrollment', courseName, price)
    if (window.gtag) {
      window.gtag('event', 'purchase', {
        transaction_id: `enrollment_${courseId}_${Date.now()}`,
        value: price,
        currency: 'USD',
        items: [{
          item_id: courseId,
          item_name: courseName,
          item_category: 'Course',
          price: price,
          quantity: 1
        }]
      })
    }
  }

  trackSearch(searchTerm, resultsCount = 0) {
    this.trackEvent('Search', 'Query', searchTerm, resultsCount)
    if (window.gtag) {
      window.gtag('event', 'search', {
        search_term: searchTerm,
        results_count: resultsCount
      })
    }
  }

  trackAuth(action, method = 'email') {
    this.trackEvent('Authentication', action, method)
    if (window.gtag && action === 'Sign Up') {
      window.gtag('event', 'sign_up', {
        method: method
      })
    }
  }

  trackVideoPlay(videoTitle, videoId) {
    this.trackEvent('Video', 'Play', videoTitle, null)
    if (window.gtag) {
      window.gtag('event', 'video_start', {
        video_title: videoTitle,
        video_id: videoId
      })
    }
  }

  setUserProperties(userId, properties = {}) {
    if (window.gtag) {
      window.gtag('set', 'user_properties', {
        user_id: userId,
        ...properties
      })
    }
  }
}

const analytics = new Analytics()
export default analytics