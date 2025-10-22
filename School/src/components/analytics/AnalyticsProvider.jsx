import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { onCLS, onFID, onFCP, onLCP, onTTFB } from 'web-vitals'
import analytics from '../../utils/analytics'

const AnalyticsProvider = ({ children }) => {
  const location = useLocation()

  useEffect(() => {
    analytics.init()
    onCLS((metric) => analytics.trackWebVital(metric))
    onFID((metric) => analytics.trackWebVital(metric))
    onFCP((metric) => analytics.trackWebVital(metric))
    onLCP((metric) => analytics.trackWebVital(metric))
    onTTFB((metric) => analytics.trackWebVital(metric))
  }, [])

  useEffect(() => {
    const path = location.pathname + location.search
    const title = document.title
    analytics.trackPageView(path, title)
  }, [location])

  return children
}

export default AnalyticsProvider