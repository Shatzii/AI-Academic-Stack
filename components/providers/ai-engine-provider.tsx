'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
// Temporarily removing auth dependency until auth system is properly aligned
// import { useAuth } from '@/hooks/use-auth'

interface AIModel {
  id: string
  name: string
  type: 'general' | 'math' | 'science' | 'language' | 'social' | 'creative'
  parameters: string
  specialization: string[]
  neurotype_optimized: boolean
  local_model_path: string
}

interface AITeacher {
  id: string
  name: string
  personality: 'encouraging' | 'analytical' | 'creative' | 'structured'
  voice_profile: string
  teaching_style: string[]
  specializations: string[]
  school_type: 'superhero' | 'stage-prep' | 'law' | 'language'
  emotional_intelligence: {
    empathy_level: number
    patience_level: number
    motivation_style: string
  }
}

interface LearningAnalytics {
  student_id: string
  predicted_performance: {
    next_30_days: number
    difficulty_areas: string[]
    recommended_interventions: string[]
  }
  engagement_patterns: {
    peak_hours: string[]
    attention_span: number
    preferred_content_types: string[]
  }
  learning_velocity: {
    current_pace: number
    optimal_pace: number
    acceleration_potential: number
  }
}

interface AIEngineContextType {
  availableModels: AIModel[]
  availableTeachers: AITeacher[]
  currentTeacher: AITeacher | null
  learningAnalytics: LearningAnalytics | null
  switchModel: (modelId: string) => Promise<void>
  switchTeacher: (teacherId: string) => Promise<void>
  generateContent: (prompt: string, type: string) => Promise<string>
  getPredictiveAnalytics: () => Promise<LearningAnalytics>
  createAssessment: (subject: string, difficulty: string) => Promise<any>
  generateCurriculum: (subject: string, grade: string) => Promise<any>
  isLocalEngineActive: boolean
  engineMetrics: {
    response_time: number
    accuracy_score: number
    availability: number
  }
}

const AIEngineContext = createContext<AIEngineContextType | null>(null)

export function AIEngineProvider({ children }: { children: ReactNode }) {
  const { user, hasFeatureAccess } = useAuth()
  const [availableModels, setAvailableModels] = useState<AIModel[]>([])
  const [availableTeachers, setAvailableTeachers] = useState<AITeacher[]>([])
  const [currentTeacher, setCurrentTeacher] = useState<AITeacher | null>(null)
  const [learningAnalytics, setLearningAnalytics] = useState<LearningAnalytics | null>(null)
  const [isLocalEngineActive, setIsLocalEngineActive] = useState(false)
  const [engineMetrics, setEngineMetrics] = useState({
    response_time: 0,
    accuracy_score: 0,
    availability: 0
  })

  // Initialize AI engine and load models
  useEffect(() => {
    const initializeAIEngine = async () => {
      try {
        // Check local AI engine status
        const engineStatus = await fetch('/api/ai/engine/status', {
          credentials: 'include'
        })
        
        if (engineStatus.ok) {
          const status = await engineStatus.json()
          setIsLocalEngineActive(status.local_engine_active)
          setEngineMetrics(status.metrics)
        }

        // Load available AI models
        const modelsResponse = await fetch('/api/ai/models', {
          credentials: 'include'
        })
        
        if (modelsResponse.ok) {
          const models = await modelsResponse.json()
          setAvailableModels(models)
        }

        // Load AI teachers based on user's school
        const teachersResponse = await fetch('/api/ai/teachers', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            school_type: 'superhero', // Temporary default while auth is fixed
            enrollment_type: 'basic'
          })
        })

        if (teachersResponse.ok) {
          const teachers = await teachersResponse.json()
          setAvailableTeachers(teachers)
          
          // Auto-select appropriate teacher
          const defaultTeacher = teachers.find((t: AITeacher) => 
            t.school_type === (user?.school || 'superhero')
          ) || teachers[0]
          
          if (defaultTeacher) {
            setCurrentTeacher(defaultTeacher)
          }
        }

      } catch (error) {
        console.error('AI Engine initialization failed:', error)
      }
    }

    if (user) {
      initializeAIEngine()
    }
  }, [user])

  // Load predictive analytics
  useEffect(() => {
    const loadAnalytics = async () => {
      if (!user || !hasFeatureAccess('predictive_analytics')) return

      try {
        const response = await fetch('/api/ai/analytics/predictive', {
          credentials: 'include'
        })

        if (response.ok) {
          const analytics = await response.json()
          setLearningAnalytics(analytics)
        }
      } catch (error) {
        console.error('Failed to load learning analytics:', error)
      }
    }

    loadAnalytics()
  }, [user, hasFeatureAccess])

  const switchModel = async (modelId: string) => {
    try {
      const response = await fetch('/api/ai/models/switch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ model_id: modelId })
      })

      if (!response.ok) {
        throw new Error('Failed to switch AI model')
      }

      // Update metrics after model switch
      const metrics = await response.json()
      setEngineMetrics(metrics)

    } catch (error) {
      console.error('Model switch failed:', error)
      throw error
    }
  }

  const switchTeacher = async (teacherId: string) => {
    try {
      const teacher = availableTeachers.find(t => t.id === teacherId)
      if (!teacher) {
        throw new Error('Teacher not found')
      }

      const response = await fetch('/api/ai/teachers/switch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ teacher_id: teacherId })
      })

      if (response.ok) {
        setCurrentTeacher(teacher)
      }

    } catch (error) {
      console.error('Teacher switch failed:', error)
      throw error
    }
  }

  const generateContent = async (prompt: string, type: string): Promise<string> => {
    const startTime = Date.now()
    
    try {
      const response = await fetch('/api/ai/generate/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          prompt,
          content_type: type,
          teacher_id: currentTeacher?.id,
          student_profile: {
            neurotype: user?.neurotype,
            grade: user?.grade,
            learning_preferences: user?.preferences
          }
        })
      })

      if (!response.ok) {
        throw new Error('Content generation failed')
      }

      const result = await response.json()
      
      // Update response time metrics
      const responseTime = Date.now() - startTime
      setEngineMetrics(prev => ({
        ...prev,
        response_time: responseTime
      }))

      return result.content

    } catch (error) {
      console.error('Content generation error:', error)
      throw error
    }
  }

  const getPredictiveAnalytics = async (): Promise<LearningAnalytics> => {
    try {
      const response = await fetch('/api/ai/analytics/refresh', {
        method: 'POST',
        credentials: 'include'
      })

      if (!response.ok) {
        throw new Error('Analytics refresh failed')
      }

      const analytics = await response.json()
      setLearningAnalytics(analytics)
      return analytics

    } catch (error) {
      console.error('Predictive analytics error:', error)
      throw error
    }
  }

  const createAssessment = async (subject: string, difficulty: string) => {
    try {
      const response = await fetch('/api/ai/assessment/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          subject,
          difficulty,
          student_profile: {
            neurotype: user?.neurotype,
            grade: user?.grade,
            learning_analytics: learningAnalytics
          },
          adaptive: hasFeatureAccess('adaptive_assessment')
        })
      })

      if (!response.ok) {
        throw new Error('Assessment creation failed')
      }

      return await response.json()

    } catch (error) {
      console.error('Assessment creation error:', error)
      throw error
    }
  }

  const generateCurriculum = async (subject: string, grade: string) => {
    try {
      const response = await fetch('/api/ai/curriculum/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          subject,
          grade,
          school_type: user?.school,
          compliance_standards: ['Texas_TEKS', 'Common_Core'],
          neurotype_adaptations: user?.neurotype,
          learning_analytics: learningAnalytics
        })
      })

      if (!response.ok) {
        throw new Error('Curriculum generation failed')
      }

      return await response.json()

    } catch (error) {
      console.error('Curriculum generation error:', error)
      throw error
    }
  }

  const value = {
    availableModels,
    availableTeachers,
    currentTeacher,
    learningAnalytics,
    switchModel,
    switchTeacher,
    generateContent,
    getPredictiveAnalytics,
    createAssessment,
    generateCurriculum,
    isLocalEngineActive,
    engineMetrics
  }

  return (
    <AIEngineContext.Provider value={value}>
      {children}
    </AIEngineContext.Provider>
  )
}

export function useAIEngine() {
  const context = useContext(AIEngineContext)
  if (!context) {
    throw new Error('useAIEngine must be used within an AIEngineProvider')
  }
  return context
}

// AI Engine Status Component
export function AIEngineStatus() {
  const { isLocalEngineActive, engineMetrics, currentTeacher } = useAIEngine()

  return (
    <div className="fixed top-4 right-4 bg-black/90 border border-green-500 rounded-lg p-3 text-green-400 text-xs">
      <div className="flex items-center gap-2 mb-2">
        <div className={`w-2 h-2 rounded-full ${isLocalEngineActive ? 'bg-green-500' : 'bg-red-500'}`} />
        <span>AI Engine: {isLocalEngineActive ? 'Local' : 'Cloud'}</span>
      </div>
      
      {currentTeacher && (
        <div className="mb-2">
          <span className="text-cyan-400">{currentTeacher.name}</span>
        </div>
      )}
      
      <div className="space-y-1">
        <div>Response: {engineMetrics.response_time}ms</div>
        <div>Accuracy: {Math.round(engineMetrics.accuracy_score * 100)}%</div>
        <div>Uptime: {Math.round(engineMetrics.availability * 100)}%</div>
      </div>
    </div>
  )
}

// Predictive Analytics Dashboard
export function PredictiveAnalyticsDashboard() {
  const { learningAnalytics, getPredictiveAnalytics } = useAIEngine()
  const { hasFeatureAccess } = useAuth()

  if (!hasFeatureAccess('predictive_analytics') || !learningAnalytics) {
    return null
  }

  return (
    <div className="bg-gradient-to-br from-purple-900/50 to-blue-900/50 border border-purple-500 rounded-lg p-6">
      <h3 className="text-xl font-bold text-purple-400 mb-4">Learning Predictions</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-black/40 rounded-lg p-4">
          <h4 className="text-cyan-400 font-semibold mb-2">Next 30 Days</h4>
          <div className="text-2xl font-bold text-green-400">
            {Math.round(learningAnalytics.predicted_performance.next_30_days)}%
          </div>
          <p className="text-gray-300 text-sm">Expected Performance</p>
        </div>

        <div className="bg-black/40 rounded-lg p-4">
          <h4 className="text-cyan-400 font-semibold mb-2">Learning Velocity</h4>
          <div className="text-2xl font-bold text-yellow-400">
            {learningAnalytics.learning_velocity.current_pace.toFixed(1)}x
          </div>
          <p className="text-gray-300 text-sm">Current Pace</p>
        </div>

        <div className="bg-black/40 rounded-lg p-4">
          <h4 className="text-cyan-400 font-semibold mb-2">Attention Span</h4>
          <div className="text-2xl font-bold text-pink-400">
            {learningAnalytics.engagement_patterns.attention_span}min
          </div>
          <p className="text-gray-300 text-sm">Optimal Session</p>
        </div>
      </div>

      {learningAnalytics.predicted_performance.difficulty_areas.length > 0 && (
        <div className="mt-6">
          <h4 className="text-red-400 font-semibold mb-2">Areas Needing Attention</h4>
          <div className="flex flex-wrap gap-2">
            {learningAnalytics.predicted_performance.difficulty_areas.map((area, index) => (
              <span key={index} className="bg-red-500/20 text-red-400 px-3 py-1 rounded-full text-sm">
                {area}
              </span>
            ))}
          </div>
        </div>
      )}

      <button 
        onClick={getPredictiveAnalytics}
        className="mt-4 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
      >
        Refresh Predictions
      </button>
    </div>
  )
}