'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useAuth } from './auth-provider'

interface PerformanceMetrics {
  page_load_time: number
  ai_response_time: number
  vr_load_time?: number
  bundle_size: number
  lighthouse_score: {
    performance: number
    accessibility: number
    best_practices: number
    seo: number
  }
  user_engagement: {
    session_duration: number
    bounce_rate: number
    pages_per_session: number
    feature_usage: Record<string, number>
  }
}

interface OptimizationRule {
  id: string
  name: string
  condition: string
  action: 'prefetch' | 'lazy_load' | 'cache' | 'compress' | 'priority_load'
  target: string
  performance_impact: number
  active: boolean
}

interface SmartCaching {
  ai_responses: Map<string, { content: string; timestamp: number; usage_count: number }>
  user_preferences: Map<string, any>
  curriculum_content: Map<string, any>
  vr_assets: Map<string, any>
  performance_data: Map<string, PerformanceMetrics>
}

interface PerformanceContextType {
  metrics: PerformanceMetrics
  optimizationRules: OptimizationRule[]
  smartCaching: SmartCaching
  adaptiveLoading: {
    predictivePreload: (route: string, probability: number) => void
    intelligentBundleSplitting: (userBehavior: any) => void
    dynamicResourcePrioritization: (currentActivity: string) => void
  }
  realTimeOptimization: {
    adjustQualityBasedOnConnection: (connectionSpeed: string) => void
    optimizeForDevice: (deviceCapabilities: any) => void
    balanceServerLoad: (currentLoad: number) => void
  }
  updateMetrics: (newMetrics: Partial<PerformanceMetrics>) => void
  enableOptimization: (ruleId: string) => void
  getPerformanceReport: () => Promise<any>
}

const PerformanceContext = createContext<PerformanceContextType | null>(null)

export function PerformanceOptimizationProvider({ children }: { children: ReactNode }) {
  const { user, hasFeatureAccess } = useAuth()
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    page_load_time: 0,
    ai_response_time: 0,
    bundle_size: 0,
    lighthouse_score: {
      performance: 0,
      accessibility: 0,
      best_practices: 0,
      seo: 0
    },
    user_engagement: {
      session_duration: 0,
      bounce_rate: 0,
      pages_per_session: 0,
      feature_usage: {}
    }
  })

  const [optimizationRules, setOptimizationRules] = useState<OptimizationRule[]>([
    {
      id: 'ai_response_cache',
      name: 'AI Response Intelligent Caching',
      condition: 'similar_queries_detected',
      action: 'cache',
      target: 'ai_responses',
      performance_impact: 68,
      active: true
    },
    {
      id: 'vr_asset_preload',
      name: 'VR Asset Predictive Loading',
      condition: 'vr_session_likely',
      action: 'prefetch',
      target: 'vr_environments',
      performance_impact: 45,
      active: true
    },
    {
      id: 'neurodivergent_priority',
      name: 'Accessibility Feature Priority',
      condition: 'neurodivergent_user',
      action: 'priority_load',
      target: 'accessibility_tools',
      performance_impact: 32,
      active: true
    }
  ])

  const [smartCaching] = useState<SmartCaching>({
    ai_responses: new Map(),
    user_preferences: new Map(),
    curriculum_content: new Map(),
    vr_assets: new Map(),
    performance_data: new Map()
  })

  const adaptiveLoading = {
    predictivePreload: (route: string, probability: number) => {
      if (probability > 0.8) {
        const link = document.createElement('link')
        link.rel = 'prefetch'
        link.href = route
        document.head.appendChild(link)
      }
    },

    intelligentBundleSplitting: (userBehavior: any) => {
      if (userBehavior.frequently_uses_vr) {
        import('./vr-provider')
      }
      if (userBehavior.frequently_uses_blockchain) {
        import('./blockchain-provider')
      }
      if (userBehavior.needs_neurodivergent_support) {
        import('./neuro-support-provider')
      }
    },

    dynamicResourcePrioritization: (currentActivity: string) => {
      const priorityMap = {
        'ai_tutoring': ['ai-engine', 'chat-interface'],
        'vr_learning': ['vr-assets', 'three-js', 'webxr'],
        'achievement_viewing': ['blockchain', 'nft-display'],
        'global_collaboration': ['campus-data', 'translation']
      }

      const priorities = priorityMap[currentActivity] || []
      priorities.forEach((resource, index) => {
        console.log(`Setting priority ${priorities.length - index} for resource: ${resource}`)
      })
    }
  }

  const realTimeOptimization = {
    adjustQualityBasedOnConnection: (connectionSpeed: string) => {
      switch (connectionSpeed) {
        case 'slow-2g':
        case '2g':
          document.body.setAttribute('data-quality', 'minimal')
          document.body.classList.add('reduced-motion', 'text-only-mode')
          break
        case '3g':
          document.body.setAttribute('data-quality', 'reduced')
          break
        case '4g':
        case '5g':
          document.body.setAttribute('data-quality', 'full')
          document.body.classList.remove('reduced-motion', 'text-only-mode')
          break
      }
    },

    optimizeForDevice: (deviceCapabilities: any) => {
      if (deviceCapabilities.memory < 4) {
        document.body.classList.add('low-memory-mode')
      }
      
      if (deviceCapabilities.gpu_performance < 0.5) {
        document.body.setAttribute('data-vr-disabled', 'true')
      }

      if (deviceCapabilities.is_mobile) {
        document.body.classList.add('mobile-optimized')
      }
    },

    balanceServerLoad: (currentLoad: number) => {
      if (currentLoad > 0.8) {
        document.body.setAttribute('data-server-load', 'high')
      } else if (currentLoad < 0.3) {
        document.body.setAttribute('data-server-load', 'low')
      }
    }
  }

  const updateMetrics = (newMetrics: Partial<PerformanceMetrics>) => {
    setMetrics(prev => ({ ...prev, ...newMetrics }))
  }

  const enableOptimization = (ruleId: string) => {
    setOptimizationRules(prev => 
      prev.map(rule => 
        rule.id === ruleId ? { ...rule, active: true } : rule
      )
    )
  }

  const getPerformanceReport = async () => {
    try {
      const response = await fetch('/api/performance/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          metrics,
          optimization_rules: optimizationRules,
          user_profile: user
        })
      })

      if (response.ok) {
        return await response.json()
      }
    } catch (error) {
      console.error('Performance report generation failed:', error)
    }
    
    return null
  }

  const value = {
    metrics,
    optimizationRules,
    smartCaching,
    adaptiveLoading,
    realTimeOptimization,
    updateMetrics,
    enableOptimization,
    getPerformanceReport
  }

  return (
    <PerformanceContext.Provider value={value}>
      {children}
    </PerformanceContext.Provider>
  )
}

export function usePerformanceOptimization() {
  const context = useContext(PerformanceContext)
  if (!context) {
    throw new Error('usePerformanceOptimization must be used within a PerformanceOptimizationProvider')
  }
  return context
}