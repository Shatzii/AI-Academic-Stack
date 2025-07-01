'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
// Temporarily removing auth dependency until auth system is properly aligned
// import { useAuth } from '@/hooks/use-auth'

interface VRScene {
  id: string
  title: string
  description: string
  category: 'science' | 'history' | 'language' | 'math' | 'art' | 'social'
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  duration: number // minutes
  school_type: 'superhero' | 'stage-prep' | 'law' | 'language'
  accessibility_features: string[]
  neurotype_adaptations: {
    adhd?: boolean
    dyslexia?: boolean
    autism?: boolean
  }
}

interface VRSession {
  id: string
  scene_id: string
  user_id: string
  start_time: string
  end_time?: string
  performance_metrics: {
    engagement_score: number
    completion_percentage: number
    interaction_count: number
    time_spent: number
  }
  learning_objectives_met: string[]
}

interface VRContextType {
  isVRSupported: boolean
  isVRSessionActive: boolean
  currentScene: VRScene | null
  availableScenes: VRScene[]
  startVRSession: (sceneId: string) => Promise<void>
  endVRSession: () => Promise<void>
  loadScene: (scene: VRScene) => Promise<void>
  getRecommendedScenes: () => VRScene[]
  sessionMetrics: VRSession | null
}

const VRContext = createContext<VRContextType | null>(null)

export function VRProvider({ children }: { children: ReactNode }) {
  // Temporarily using default values while auth is fixed
  const user = null
  const hasFeatureAccess = () => true
  const [isVRSupported, setIsVRSupported] = useState(false)
  const [isVRSessionActive, setIsVRSessionActive] = useState(false)
  const [currentScene, setCurrentScene] = useState<VRScene | null>(null)
  const [availableScenes, setAvailableScenes] = useState<VRScene[]>([])
  const [sessionMetrics, setSessionMetrics] = useState<VRSession | null>(null)

  // Check VR support on mount
  useEffect(() => {
    const checkVRSupport = async () => {
      if (!hasFeatureAccess('vr_classrooms')) {
        setIsVRSupported(false)
        return
      }

      try {
        if ('xr' in navigator) {
          const xr = (navigator as any).xr
          if (xr) {
            const supported = await xr.isSessionSupported('immersive-vr')
            setIsVRSupported(supported)
          }
        } else {
          // Fallback for WebXR polyfill or browser compatibility
          setIsVRSupported(false)
        }
      } catch (error) {
        console.warn('VR support check failed:', error)
        setIsVRSupported(false)
      }
    }

    checkVRSupport()
  }, [hasFeatureAccess])

  // Load available VR scenes based on user's school and neurotype
  useEffect(() => {
    const loadScenes = async () => {
      if (!user || !hasFeatureAccess('vr_classrooms')) return

      try {
        const response = await fetch('/api/vr/scenes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            school_type: user.school || 'superhero',
            neurotype: user.neurotype,
            grade: user.grade
          })
        })

        if (response.ok) {
          const scenes = await response.json()
          setAvailableScenes(scenes)
        }
      } catch (error) {
        console.error('Failed to load VR scenes:', error)
      }
    }

    loadScenes()
  }, [user, hasFeatureAccess])

  const startVRSession = async (sceneId: string) => {
    if (!isVRSupported || !hasFeatureAccess('vr_classrooms')) {
      throw new Error('VR not supported or access denied')
    }

    try {
      const scene = availableScenes.find(s => s.id === sceneId)
      if (!scene) {
        throw new Error('Scene not found')
      }

      // Initialize VR session on server
      const response = await fetch('/api/vr/sessions/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          scene_id: sceneId,
          user_preferences: user?.preferences?.sensory_settings
        })
      })

      if (!response.ok) {
        throw new Error('Failed to start VR session')
      }

      const session = await response.json()
      setSessionMetrics(session)
      setCurrentScene(scene)
      setIsVRSessionActive(true)

      // Initialize WebXR session
      await initializeWebXRSession(scene)

    } catch (error) {
      console.error('Failed to start VR session:', error)
      throw error
    }
  }

  const endVRSession = async () => {
    if (!isVRSessionActive || !sessionMetrics) return

    try {
      // End session on server
      await fetch(`/api/vr/sessions/${sessionMetrics.id}/end`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          performance_metrics: sessionMetrics.performance_metrics
        })
      })

      setIsVRSessionActive(false)
      setCurrentScene(null)
      setSessionMetrics(null)

      // Exit WebXR session
      await exitWebXRSession()

    } catch (error) {
      console.error('Failed to end VR session:', error)
    }
  }

  const loadScene = async (scene: VRScene) => {
    if (!isVRSessionActive) {
      throw new Error('No active VR session')
    }

    try {
      // Load new scene in current session
      const response = await fetch('/api/vr/scenes/load', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          session_id: sessionMetrics?.id,
          scene_id: scene.id
        })
      })

      if (response.ok) {
        setCurrentScene(scene)
        await loadWebXRScene(scene)
      }
    } catch (error) {
      console.error('Failed to load VR scene:', error)
      throw error
    }
  }

  const getRecommendedScenes = (): VRScene[] => {
    if (!user || !availableScenes.length) return []

    // Filter scenes based on user's neurotype and learning preferences
    return availableScenes.filter(scene => {
      // Check neurotype compatibility
      if (user.neurotype === 'adhd' && !scene.neurotype_adaptations.adhd) {
        return false
      }
      if (user.neurotype === 'dyslexia' && !scene.neurotype_adaptations.dyslexia) {
        return false
      }
      if (user.neurotype === 'autism' && !scene.neurotype_adaptations.autism) {
        return false
      }

      // Check school type compatibility
      if (user.school && scene.school_type !== user.school) {
        return false
      }

      return true
    }).sort((a, b) => {
      // Prioritize scenes with better accessibility features
      return b.accessibility_features.length - a.accessibility_features.length
    }).slice(0, 6) // Return top 6 recommendations
  }

  const initializeWebXRSession = async (scene: VRScene) => {
    if (!('xr' in navigator)) return

    try {
      const xr = (navigator as any).xr
      const session = await xr.requestSession('immersive-vr', {
        requiredFeatures: ['local-floor', 'bounded-floor'],
        optionalFeatures: ['hand-tracking', 'eye-tracking']
      })

      // Apply neurotype-specific adaptations
      if (user?.neurotype === 'adhd') {
        // Reduce visual distractions, increase focus cues
        session.updateRenderState({
          baseLayer: new XRWebGLLayer(session, getGLContext(), {
            antialias: false, // Reduce processing load
            alpha: false
          })
        })
      }

      if (user?.neurotype === 'autism') {
        // Provide predictable environments, reduce sudden changes
        await applyAutismAdaptations(session, scene)
      }

      console.log('WebXR session started for scene:', scene.title)
    } catch (error) {
      console.error('WebXR initialization failed:', error)
    }
  }

  const exitWebXRSession = async () => {
    // WebXR session cleanup
    if ('xr' in navigator) {
      try {
        const xr = (navigator as any).xr
        if (xr.activeSession) {
          await xr.activeSession.end()
        }
      } catch (error) {
        console.error('WebXR session end failed:', error)
      }
    }
  }

  const loadWebXRScene = async (scene: VRScene) => {
    // Load 3D scene based on school theme
    const sceneConfig = {
      superhero: {
        environment: 'cyberpunk_city',
        lighting: 'neon_glow',
        ui_theme: 'holographic'
      },
      'stage-prep': {
        environment: 'theater_stage',
        lighting: 'stage_lights',
        ui_theme: 'theatrical'
      },
      law: {
        environment: 'courtroom',
        lighting: 'professional',
        ui_theme: 'formal'
      },
      language: {
        environment: 'cultural_immersion',
        lighting: 'natural',
        ui_theme: 'multilingual'
      }
    }

    const config = sceneConfig[scene.school_type] || sceneConfig.superhero

    // Apply accessibility settings
    if (user?.preferences?.sensory_settings?.reduced_motion) {
      config.lighting = 'static'
    }

    console.log('Loading VR scene with config:', config)
  }

  const applyAutismAdaptations = async (session: any, scene: VRScene) => {
    // Autism-specific VR adaptations
    // - Consistent spatial layout
    // - Predictable interaction patterns
    // - Clear visual boundaries
    // - Reduced sensory overload
    
    console.log('Applying autism adaptations for VR scene')
  }

  const getGLContext = () => {
    const canvas = document.createElement('canvas')
    return canvas.getContext('webgl2') || canvas.getContext('webgl')
  }

  const value = {
    isVRSupported,
    isVRSessionActive,
    currentScene,
    availableScenes,
    startVRSession,
    endVRSession,
    loadScene,
    getRecommendedScenes,
    sessionMetrics
  }

  return (
    <VRContext.Provider value={value}>
      {children}
    </VRContext.Provider>
  )
}

export function useVR() {
  const context = useContext(VRContext)
  if (!context) {
    throw new Error('useVR must be used within a VRProvider')
  }
  return context
}

// VR Scene Component for rendering
export function VRSceneViewer({ sceneId }: { sceneId: string }) {
  const { currentScene, isVRSessionActive } = useVR()
  
  if (!isVRSessionActive || !currentScene || currentScene.id !== sceneId) {
    return null
  }

  return (
    <div className="vr-scene-container">
      <canvas 
        id="vr-canvas" 
        className="w-full h-full"
        style={{ 
          position: 'fixed', 
          top: 0, 
          left: 0, 
          zIndex: 1000,
          backgroundColor: '#000'
        }}
      />
    </div>
  )
}

// VR Learning Objectives Tracker
export function VRLearningTracker() {
  const { sessionMetrics, currentScene } = useVR()
  
  if (!sessionMetrics || !currentScene) return null

  return (
    <div className="fixed bottom-4 right-4 bg-black/80 text-green-400 p-4 rounded-lg border border-green-500">
      <h3 className="text-sm font-semibold mb-2">{currentScene.title}</h3>
      <div className="space-y-1 text-xs">
        <div>Engagement: {Math.round(sessionMetrics.performance_metrics.engagement_score)}%</div>
        <div>Progress: {Math.round(sessionMetrics.performance_metrics.completion_percentage)}%</div>
        <div>Interactions: {sessionMetrics.performance_metrics.interaction_count}</div>
      </div>
    </div>
  )
}