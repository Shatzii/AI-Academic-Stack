'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useAuth } from './auth-provider'

interface NeuroDivergentProfile {
  user_id: string
  neurotype: 'adhd' | 'dyslexia' | 'autism' | 'mixed' | 'neurotypical'
  severity_level: 'mild' | 'moderate' | 'severe'
  specific_traits: string[]
  support_needs: {
    sensory: {
      light_sensitivity: boolean
      sound_sensitivity: boolean
      motion_sensitivity: boolean
      texture_preferences: string[]
    }
    cognitive: {
      attention_span_minutes: number
      working_memory_capacity: 'low' | 'medium' | 'high'
      processing_speed: 'slow' | 'average' | 'fast'
      executive_function_level: number // 1-10 scale
    }
    social: {
      social_battery_level: number // 1-10 scale
      communication_preference: 'verbal' | 'written' | 'visual' | 'mixed'
      group_interaction_comfort: number // 1-10 scale
    }
    learning: {
      preferred_modalities: ('visual' | 'auditory' | 'kinesthetic' | 'reading')[]
      optimal_break_frequency: number // minutes
      stress_response_triggers: string[]
    }
  }
  accommodations: {
    ui_modifications: {
      font_adjustments: boolean
      color_contrast: 'normal' | 'high' | 'extreme'
      animation_reduction: boolean
      focus_indicators: boolean
    }
    content_adaptations: {
      simplified_language: boolean
      visual_supports: boolean
      step_by_step_breakdowns: boolean
      multiple_format_options: boolean
    }
    timing_accommodations: {
      extended_time_multiplier: number
      flexible_deadlines: boolean
      custom_break_schedule: boolean
    }
  }
}

interface SensoryBreak {
  id: string
  title: string
  description: string
  duration_minutes: number
  type: 'movement' | 'breathing' | 'visual' | 'auditory' | 'tactile'
  neurotype_focus: string[]
  difficulty_level: 'easy' | 'medium' | 'challenging'
  instructions: string[]
  media_url?: string
  effectiveness_rating: number
}

interface FocusSession {
  id: string
  start_time: string
  planned_duration: number
  actual_duration?: number
  focus_score: number // 1-10
  distractions_encountered: string[]
  break_times: string[]
  completion_status: 'completed' | 'interrupted' | 'extended'
  subject: string
  neurotype_adaptations_used: string[]
}

interface SocialSkillsScenario {
  id: string
  title: string
  description: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  social_context: 'classroom' | 'peer_group' | 'authority_figure' | 'conflict_resolution'
  vr_enabled: boolean
  ai_guided: boolean
  learning_objectives: string[]
  practice_rounds: number
  success_criteria: string[]
}

interface NeuroSupportContextType {
  profile: NeuroDivergentProfile | null
  currentFocusSession: FocusSession | null
  availableSensoryBreaks: SensoryBreak[]
  socialSkillsScenarios: SocialSkillsScenario[]
  aiAssistant: {
    mood_detector: (text: string) => Promise<{
      mood: string
      stress_level: number
      recommended_actions: string[]
    }>
    focus_coach: (activity: string) => Promise<{
      break_recommendations: string[]
      focus_strategies: string[]
      environmental_adjustments: string[]
    }>
    social_coach: (scenario: string) => Promise<{
      conversation_starters: string[]
      body_language_tips: string[]
      exit_strategies: string[]
    }>
  }
  updateProfile: (updates: Partial<NeuroDivergentProfile>) => Promise<void>
  startFocusSession: (subject: string, plannedDuration: number) => Promise<void>
  endFocusSession: (completionData: Partial<FocusSession>) => Promise<void>
  requestSensoryBreak: (type?: string) => Promise<SensoryBreak>
  practiceSkillsScenario: (scenarioId: string) => Promise<void>
  emergencySupport: () => Promise<void>
  realTimeAdaptations: {
    adjustUIForStress: (stressLevel: number) => void
    modifyContentDifficulty: (cognitiveLoad: number) => void
    suggestBreak: (focusScore: number) => boolean
  }
}

const NeuroSupportContext = createContext<NeuroSupportContextType | null>(null)

export function NeuroSupportProvider({ children }: { children: ReactNode }) {
  const { user, hasFeatureAccess } = useAuth()
  const [profile, setProfile] = useState<NeuroDivergentProfile | null>(null)
  const [currentFocusSession, setCurrentFocusSession] = useState<FocusSession | null>(null)
  const [availableSensoryBreaks, setAvailableSensoryBreaks] = useState<SensoryBreak[]>([])
  const [socialSkillsScenarios, setSocialSkillsScenarios] = useState<SocialSkillsScenario[]>([])

  // Initialize neurodivergent support system
  useEffect(() => {
    const initializeNeuroSupport = async () => {
      if (!user || !hasFeatureAccess('neurodivergent_support')) return

      try {
        // Load user's neurodivergent profile
        const profileResponse = await fetch('/api/neuro-support/profile', {
          credentials: 'include'
        })

        if (profileResponse.ok) {
          const profileData = await profileResponse.json()
          setProfile(profileData)
        } else {
          // Create initial profile if none exists
          const initialProfile = await createInitialProfile()
          setProfile(initialProfile)
        }

        // Load sensory breaks based on user's neurotype
        const breaksResponse = await fetch('/api/neuro-support/sensory-breaks', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            neurotype: user.neurotype,
            severity: profile?.severity_level || 'moderate'
          })
        })

        if (breaksResponse.ok) {
          const breaks = await breaksResponse.json()
          setAvailableSensoryBreaks(breaks)
        }

        // Load social skills scenarios
        const scenariosResponse = await fetch('/api/neuro-support/social-scenarios', {
          credentials: 'include'
        })

        if (scenariosResponse.ok) {
          const scenarios = await scenariosResponse.json()
          setSocialSkillsScenarios(scenarios)
        }

      } catch (error) {
        console.error('Neurodivergent support initialization failed:', error)
      }
    }

    initializeNeuroSupport()
  }, [user, hasFeatureAccess])

  const createInitialProfile = async (): Promise<NeuroDivergentProfile> => {
    const response = await fetch('/api/neuro-support/profile/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        neurotype: user?.neurotype || 'neurotypical',
        initial_assessment: true
      })
    })

    if (!response.ok) {
      throw new Error('Failed to create neurodivergent profile')
    }

    return await response.json()
  }

  const aiAssistant = {
    mood_detector: async (text: string) => {
      try {
        const response = await fetch('/api/neuro-support/ai/mood-analysis', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            text,
            user_profile: profile,
            context: 'learning_environment'
          })
        })

        if (!response.ok) {
          throw new Error('Mood analysis failed')
        }

        return await response.json()
      } catch (error) {
        console.error('AI mood detection failed:', error)
        return {
          mood: 'neutral',
          stress_level: 5,
          recommended_actions: ['Take a short break', 'Practice deep breathing']
        }
      }
    },

    focus_coach: async (activity: string) => {
      try {
        const response = await fetch('/api/neuro-support/ai/focus-coach', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            activity,
            user_profile: profile,
            current_session: currentFocusSession
          })
        })

        if (!response.ok) {
          throw new Error('Focus coaching failed')
        }

        return await response.json()
      } catch (error) {
        console.error('AI focus coaching failed:', error)
        return {
          break_recommendations: ['5-minute movement break', 'Deep breathing'],
          focus_strategies: ['Pomodoro technique', 'Break task into smaller steps'],
          environmental_adjustments: ['Reduce visual distractions', 'Use noise-canceling headphones']
        }
      }
    },

    social_coach: async (scenario: string) => {
      try {
        const response = await fetch('/api/neuro-support/ai/social-coach', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            scenario,
            user_profile: profile,
            difficulty_level: 'appropriate'
          })
        })

        if (!response.ok) {
          throw new Error('Social coaching failed')
        }

        return await response.json()
      } catch (error) {
        console.error('AI social coaching failed:', error)
        return {
          conversation_starters: ['Hi, how are you?', 'What are you working on?'],
          body_language_tips: ['Make eye contact', 'Use open posture'],
          exit_strategies: ['I need to go to my next class', 'Thanks for chatting!']
        }
      }
    }
  }

  const updateProfile = async (updates: Partial<NeuroDivergentProfile>) => {
    try {
      const response = await fetch('/api/neuro-support/profile/update', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(updates)
      })

      if (!response.ok) {
        throw new Error('Profile update failed')
      }

      const updatedProfile = await response.json()
      setProfile(updatedProfile)

    } catch (error) {
      console.error('Profile update failed:', error)
      throw error
    }
  }

  const startFocusSession = async (subject: string, plannedDuration: number) => {
    try {
      const session: FocusSession = {
        id: `session_${Date.now()}`,
        start_time: new Date().toISOString(),
        planned_duration: plannedDuration,
        focus_score: 8, // Initial assumption
        distractions_encountered: [],
        break_times: [],
        completion_status: 'completed',
        subject,
        neurotype_adaptations_used: []
      }

      setCurrentFocusSession(session)

      // Apply neurotype-specific adaptations
      if (profile) {
        realTimeAdaptations.adjustUIForStress(3) // Start with low stress
        
        // Schedule automatic break reminders
        const breakInterval = profile.support_needs.learning.optimal_break_frequency * 60000
        setTimeout(() => {
          if (realTimeAdaptations.suggestBreak(6)) {
            // Suggest break if focus is declining
          }
        }, breakInterval)
      }

    } catch (error) {
      console.error('Focus session start failed:', error)
      throw error
    }
  }

  const endFocusSession = async (completionData: Partial<FocusSession>) => {
    if (!currentFocusSession) return

    try {
      const updatedSession = {
        ...currentFocusSession,
        ...completionData,
        actual_duration: Date.now() - new Date(currentFocusSession.start_time).getTime()
      }

      const response = await fetch('/api/neuro-support/focus-sessions/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(updatedSession)
      })

      if (response.ok) {
        setCurrentFocusSession(null)
      }

    } catch (error) {
      console.error('Focus session end failed:', error)
    }
  }

  const requestSensoryBreak = async (type?: string): Promise<SensoryBreak> => {
    try {
      const response = await fetch('/api/neuro-support/sensory-breaks/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          preferred_type: type,
          current_stress_level: 5, // Would be dynamically detected
          available_time: 5 // minutes
        })
      })

      if (!response.ok) {
        throw new Error('Sensory break recommendation failed')
      }

      return await response.json()

    } catch (error) {
      console.error('Sensory break request failed:', error)
      // Return default break
      return availableSensoryBreaks[0] || {
        id: 'default',
        title: 'Deep Breathing',
        description: 'Simple breathing exercise',
        duration_minutes: 3,
        type: 'breathing',
        neurotype_focus: ['adhd', 'anxiety'],
        difficulty_level: 'easy',
        instructions: ['Breathe in for 4 counts', 'Hold for 4 counts', 'Breathe out for 6 counts'],
        effectiveness_rating: 8
      }
    }
  }

  const practiceSkillsScenario = async (scenarioId: string) => {
    try {
      const response = await fetch('/api/neuro-support/social-skills/practice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          scenario_id: scenarioId,
          vr_mode: hasFeatureAccess('vr_classrooms')
        })
      })

      if (!response.ok) {
        throw new Error('Skills practice failed')
      }

      const result = await response.json()
      console.log('Skills practice session started:', result)

    } catch (error) {
      console.error('Skills practice failed:', error)
      throw error
    }
  }

  const emergencySupport = async () => {
    try {
      await fetch('/api/neuro-support/emergency', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          timestamp: new Date().toISOString(),
          user_profile: profile,
          current_activity: currentFocusSession?.subject
        })
      })

      // Immediate UI adjustments for crisis support
      realTimeAdaptations.adjustUIForStress(10)

    } catch (error) {
      console.error('Emergency support request failed:', error)
    }
  }

  const realTimeAdaptations = {
    adjustUIForStress: (stressLevel: number) => {
      const body = document.body
      
      if (stressLevel > 7) {
        // High stress - maximum calming
        body.style.filter = 'brightness(0.7) contrast(0.8)'
        body.style.animation = 'none'
        body.classList.add('high-stress-mode')
      } else if (stressLevel > 4) {
        // Moderate stress - some adjustments
        body.style.filter = 'brightness(0.9)'
        body.classList.add('moderate-stress-mode')
      } else {
        // Low stress - normal operation
        body.style.filter = ''
        body.classList.remove('high-stress-mode', 'moderate-stress-mode')
      }
    },

    modifyContentDifficulty: (cognitiveLoad: number) => {
      // Dynamically adjust content complexity based on cognitive load
      const contentElements = document.querySelectorAll('[data-adaptive-content]')
      contentElements.forEach(element => {
        if (cognitiveLoad > 7) {
          element.classList.add('simplified-content')
        } else {
          element.classList.remove('simplified-content')
        }
      })
    },

    suggestBreak: (focusScore: number): boolean => {
      return focusScore < 6 || (currentFocusSession && 
        Date.now() - new Date(currentFocusSession.start_time).getTime() > 
        (profile?.support_needs.learning.optimal_break_frequency || 25) * 60000
      )
    }
  }

  const value = {
    profile,
    currentFocusSession,
    availableSensoryBreaks,
    socialSkillsScenarios,
    aiAssistant,
    updateProfile,
    startFocusSession,
    endFocusSession,
    requestSensoryBreak,
    practiceSkillsScenario,
    emergencySupport,
    realTimeAdaptations
  }

  return (
    <NeuroSupportContext.Provider value={value}>
      {children}
    </NeuroSupportContext.Provider>
  )
}

export function useNeuroSupport() {
  const context = useContext(NeuroSupportContext)
  if (!context) {
    throw new Error('useNeuroSupport must be used within a NeuroSupportProvider')
  }
  return context
}

// Neurodivergent Support Dashboard
export function NeuroSupportDashboard() {
  const { profile, currentFocusSession, requestSensoryBreak, startFocusSession, emergencySupport } = useNeuroSupport()
  const { hasFeatureAccess } = useAuth()
  const [recommendedBreak, setRecommendedBreak] = useState<SensoryBreak | null>(null)

  const handleBreakRequest = async () => {
    try {
      const breakRec = await requestSensoryBreak()
      setRecommendedBreak(breakRec)
    } catch (error) {
      console.error('Break request failed:', error)
    }
  }

  if (!hasFeatureAccess('neurodivergent_support')) {
    return (
      <div className="bg-purple-900/20 border border-purple-500 rounded-lg p-6 text-center">
        <h3 className="text-purple-400 font-bold mb-2">Neurodivergent Support Available</h3>
        <p className="text-gray-300">Upgrade to access specialized learning accommodations and AI coaching</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Profile Summary */}
      {profile && (
        <div className="bg-gradient-to-br from-green-900/20 to-blue-900/20 border border-green-500 rounded-lg p-6">
          <h3 className="text-green-400 font-bold mb-4">Your Learning Profile</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="text-cyan-400 font-semibold mb-2">Neurotype</h4>
              <span className="bg-cyan-500/20 text-cyan-400 px-3 py-1 rounded-full text-sm">
                {profile.neurotype.toUpperCase()}
              </span>
            </div>
            
            <div>
              <h4 className="text-cyan-400 font-semibold mb-2">Attention Span</h4>
              <span className="text-yellow-400">
                {profile.support_needs.cognitive.attention_span_minutes} minutes
              </span>
            </div>
            
            <div>
              <h4 className="text-cyan-400 font-semibold mb-2">Learning Modalities</h4>
              <div className="flex flex-wrap gap-1">
                {profile.support_needs.learning.preferred_modalities.map((modality, index) => (
                  <span key={index} className="bg-purple-500/20 text-purple-400 px-2 py-1 rounded text-xs">
                    {modality}
                  </span>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="text-cyan-400 font-semibold mb-2">Executive Function</h4>
              <div className="flex items-center">
                <div className="bg-gray-700 rounded-full h-2 w-20 mr-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full"
                    style={{ width: `${profile.support_needs.cognitive.executive_function_level * 10}%` }}
                  />
                </div>
                <span className="text-green-400 text-sm">
                  {profile.support_needs.cognitive.executive_function_level}/10
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Focus Session Control */}
      <div className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 border border-blue-500 rounded-lg p-6">
        <h3 className="text-blue-400 font-bold mb-4">Focus Session Manager</h3>
        
        {currentFocusSession ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-green-400 font-semibold">Active Session: {currentFocusSession.subject}</span>
              <span className="text-yellow-400">
                {Math.round((Date.now() - new Date(currentFocusSession.start_time).getTime()) / 60000)} min
              </span>
            </div>
            
            <div className="flex gap-4">
              <button
                onClick={handleBreakRequest}
                className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Request Break
              </button>
              <button
                onClick={emergencySupport}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Emergency Support
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-gray-300">Start a focus session with personalized accommodations</p>
            <button
              onClick={() => startFocusSession('Study Session', 25)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Start Focus Session
            </button>
          </div>
        )}
      </div>

      {/* Recommended Break */}
      {recommendedBreak && (
        <div className="bg-gradient-to-br from-orange-900/20 to-yellow-900/20 border border-orange-500 rounded-lg p-6">
          <h3 className="text-orange-400 font-bold mb-4">Recommended Sensory Break</h3>
          
          <div className="space-y-3">
            <h4 className="text-yellow-400 font-semibold">{recommendedBreak.title}</h4>
            <p className="text-gray-300 text-sm">{recommendedBreak.description}</p>
            <p className="text-cyan-400">Duration: {recommendedBreak.duration_minutes} minutes</p>
            
            <div className="space-y-2">
              {recommendedBreak.instructions.map((instruction, index) => (
                <div key={index} className="flex items-start gap-2">
                  <span className="text-orange-400 font-bold">{index + 1}.</span>
                  <span className="text-gray-300">{instruction}</span>
                </div>
              ))}
            </div>
            
            <button
              onClick={() => setRecommendedBreak(null)}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Break Complete
            </button>
          </div>
        </div>
      )}
    </div>
  )
}