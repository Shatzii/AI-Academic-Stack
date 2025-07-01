'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useAuth } from './auth-provider'

interface Campus {
  id: string
  name: string
  location: {
    city: string
    country: string
    timezone: string
    coordinates: { lat: number; lng: number }
  }
  capacity: {
    students: number
    staff: number
    housing: number
    classrooms: number
  }
  enrollment: {
    current_students: number
    current_staff: number
    housing_occupied: number
  }
  languages: string[]
  local_compliance: {
    education_authority: string
    standards: string[]
    required_reporting: string[]
  }
  operating_hours: {
    start: string
    end: string
    timezone: string
  }
}

interface GlobalSession {
  id: string
  title: string
  type: 'live_class' | 'virtual_exchange' | 'collaborative_project' | 'assessment'
  participating_campuses: string[]
  scheduled_time: string
  duration_minutes: number
  subject: string
  instructor: {
    name: string
    campus_id: string
    specialization: string[]
  }
  students_enrolled: number
  max_capacity: number
  recording_available: boolean
  translation_enabled: boolean
}

interface CulturalExchange {
  id: string
  name: string
  description: string
  origin_campus: string
  target_campus: string
  students_participating: number
  duration_weeks: number
  subjects_covered: string[]
  cultural_activities: string[]
  language_requirements: string[]
  start_date: string
  status: 'planning' | 'active' | 'completed'
}

interface GlobalCampusContextType {
  campuses: Campus[]
  currentCampus: Campus | null
  globalSessions: GlobalSession[]
  culturalExchanges: CulturalExchange[]
  timeZoneManager: {
    convertTime: (time: string, fromZone: string, toZone: string) => string
    getOptimalMeetingTime: (campuses: string[]) => string
    getCurrentTimeInCampus: (campusId: string) => string
  }
  switchCampus: (campusId: string) => Promise<void>
  scheduleGlobalSession: (sessionData: Partial<GlobalSession>) => Promise<string>
  joinCulturalExchange: (exchangeId: string) => Promise<void>
  getLocalCompliance: (campusId: string) => Promise<any>
  translateContent: (text: string, targetLanguage: string) => Promise<string>
  emergencyAlert: (message: string, campuses: string[]) => Promise<void>
}

const GlobalCampusContext = createContext<GlobalCampusContextType | null>(null)

export function GlobalCampusProvider({ children }: { children: ReactNode }) {
  const { user, hasFeatureAccess } = useAuth()
  const [campuses, setCampuses] = useState<Campus[]>([])
  const [currentCampus, setCurrentCampus] = useState<Campus | null>(null)
  const [globalSessions, setGlobalSessions] = useState<GlobalSession[]>([])
  const [culturalExchanges, setCulturalExchanges] = useState<CulturalExchange[]>([])

  // Initialize global campus system
  useEffect(() => {
    const initializeCampuses = async () => {
      try {
        // Load all global campuses
        const campusResponse = await fetch('/api/global/campuses', {
          credentials: 'include'
        })

        if (campusResponse.ok) {
          const campusData = await campusResponse.json()
          setCampuses(campusData)

          // Set user's home campus
          const userCampus = campusData.find((c: Campus) => 
            c.location.city.toLowerCase().includes(user?.school?.toLowerCase() || 'austin')
          ) || campusData[0]
          
          setCurrentCampus(userCampus)
        }

        // Load global sessions
        const sessionsResponse = await fetch('/api/global/sessions/upcoming', {
          credentials: 'include'
        })

        if (sessionsResponse.ok) {
          const sessions = await sessionsResponse.json()
          setGlobalSessions(sessions)
        }

        // Load cultural exchanges
        const exchangesResponse = await fetch('/api/global/exchanges', {
          credentials: 'include'
        })

        if (exchangesResponse.ok) {
          const exchanges = await exchangesResponse.json()
          setCulturalExchanges(exchanges)
        }

      } catch (error) {
        console.error('Global campus initialization failed:', error)
      }
    }

    if (user && hasFeatureAccess('global_campus')) {
      initializeCampuses()
    }
  }, [user, hasFeatureAccess])

  const timeZoneManager = {
    convertTime: (time: string, fromZone: string, toZone: string): string => {
      try {
        const date = new Date(time)
        return date.toLocaleString('en-US', {
          timeZone: toZone,
          hour12: false,
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit'
        })
      } catch (error) {
        console.error('Time conversion failed:', error)
        return time
      }
    },

    getOptimalMeetingTime: (campusIds: string[]): string => {
      const targetCampuses = campuses.filter(c => campusIds.includes(c.id))
      
      // Find overlap in business hours across time zones
      const businessHours = targetCampuses.map(campus => {
        const start = parseInt(campus.operating_hours.start.split(':')[0])
        const end = parseInt(campus.operating_hours.end.split(':')[0])
        return { campus: campus.id, start, end, timezone: campus.location.timezone }
      })

      // Calculate UTC overlap window
      // This is a simplified version - in production would use proper timezone libraries
      const utcOverlap = businessHours.reduce((overlap, hours) => {
        // Convert to UTC and find intersection
        return overlap // Simplified for demo
      }, { start: 14, end: 16 }) // 2-4 PM UTC as example

      return `${utcOverlap.start}:00 UTC`
    },

    getCurrentTimeInCampus: (campusId: string): string => {
      const campus = campuses.find(c => c.id === campusId)
      if (!campus) return new Date().toISOString()

      return new Date().toLocaleString('en-US', {
        timeZone: campus.location.timezone,
        hour12: false
      })
    }
  }

  const switchCampus = async (campusId: string) => {
    try {
      const campus = campuses.find(c => c.id === campusId)
      if (!campus) {
        throw new Error('Campus not found')
      }

      // Update user's active campus
      const response = await fetch('/api/global/user/switch-campus', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ campus_id: campusId })
      })

      if (response.ok) {
        setCurrentCampus(campus)
      }

    } catch (error) {
      console.error('Campus switch failed:', error)
      throw error
    }
  }

  const scheduleGlobalSession = async (sessionData: Partial<GlobalSession>): Promise<string> => {
    try {
      const response = await fetch('/api/global/sessions/schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          ...sessionData,
          optimal_time: timeZoneManager.getOptimalMeetingTime(sessionData.participating_campuses || [])
        })
      })

      if (!response.ok) {
        throw new Error('Session scheduling failed')
      }

      const result = await response.json()
      
      // Add to local sessions
      setGlobalSessions(prev => [...prev, result.session])
      
      return result.session_id

    } catch (error) {
      console.error('Global session scheduling failed:', error)
      throw error
    }
  }

  const joinCulturalExchange = async (exchangeId: string) => {
    try {
      const response = await fetch('/api/global/exchanges/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ exchange_id: exchangeId })
      })

      if (!response.ok) {
        throw new Error('Failed to join cultural exchange')
      }

      // Update local exchange data
      const updatedExchange = await response.json()
      setCulturalExchanges(prev => 
        prev.map(ex => ex.id === exchangeId ? updatedExchange : ex)
      )

    } catch (error) {
      console.error('Cultural exchange join failed:', error)
      throw error
    }
  }

  const getLocalCompliance = async (campusId: string) => {
    try {
      const response = await fetch(`/api/global/campuses/${campusId}/compliance`, {
        credentials: 'include'
      })

      if (!response.ok) {
        throw new Error('Compliance data fetch failed')
      }

      return await response.json()

    } catch (error) {
      console.error('Compliance fetch failed:', error)
      throw error
    }
  }

  const translateContent = async (text: string, targetLanguage: string): Promise<string> => {
    try {
      const response = await fetch('/api/global/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          text,
          target_language: targetLanguage,
          source_language: 'auto-detect'
        })
      })

      if (!response.ok) {
        throw new Error('Translation failed')
      }

      const result = await response.json()
      return result.translated_text

    } catch (error) {
      console.error('Translation error:', error)
      return text // Return original if translation fails
    }
  }

  const emergencyAlert = async (message: string, campusIds: string[]) => {
    try {
      await fetch('/api/global/emergency/alert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          message,
          target_campuses: campusIds,
          priority: 'high',
          timestamp: new Date().toISOString()
        })
      })

    } catch (error) {
      console.error('Emergency alert failed:', error)
      throw error
    }
  }

  const value = {
    campuses,
    currentCampus,
    globalSessions,
    culturalExchanges,
    timeZoneManager,
    switchCampus,
    scheduleGlobalSession,
    joinCulturalExchange,
    getLocalCompliance,
    translateContent,
    emergencyAlert
  }

  return (
    <GlobalCampusContext.Provider value={value}>
      {children}
    </GlobalCampusContext.Provider>
  )
}

export function useGlobalCampus() {
  const context = useContext(GlobalCampusContext)
  if (!context) {
    throw new Error('useGlobalCampus must be used within a GlobalCampusProvider')
  }
  return context
}

// Global Campus Dashboard
export function GlobalCampusDashboard() {
  const { campuses, currentCampus, globalSessions, switchCampus, timeZoneManager } = useGlobalCampus()
  const { hasFeatureAccess } = useAuth()

  if (!hasFeatureAccess('global_campus')) {
    return (
      <div className="bg-blue-900/20 border border-blue-500 rounded-lg p-6 text-center">
        <h3 className="text-blue-400 font-bold mb-2">Global Campus Access</h3>
        <p className="text-gray-300">Upgrade to access multi-campus features and international programs</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Campus Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {campuses.map((campus) => (
          <div 
            key={campus.id} 
            className={`border rounded-lg p-6 cursor-pointer transition-all ${
              currentCampus?.id === campus.id 
                ? 'bg-green-900/20 border-green-500' 
                : 'bg-gray-800/20 border-gray-600 hover:border-gray-400'
            }`}
            onClick={() => switchCampus(campus.id)}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white">{campus.name}</h3>
              <span className="text-xs text-gray-400">
                {timeZoneManager.getCurrentTimeInCampus(campus.id)}
              </span>
            </div>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Students:</span>
                <span className="text-green-400">{campus.enrollment.current_students}/{campus.capacity.students}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Staff:</span>
                <span className="text-cyan-400">{campus.enrollment.current_staff}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Housing:</span>
                <span className="text-purple-400">{campus.enrollment.housing_occupied}/{campus.capacity.housing}</span>
              </div>
            </div>

            <div className="mt-4">
              <div className="flex flex-wrap gap-1">
                {campus.languages.slice(0, 3).map((lang, index) => (
                  <span key={index} className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded text-xs">
                    {lang}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Global Sessions */}
      <div className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 border border-purple-500 rounded-lg p-6">
        <h3 className="text-xl font-bold text-purple-400 mb-4">Upcoming Global Sessions</h3>
        
        <div className="space-y-4">
          {globalSessions.slice(0, 5).map((session) => (
            <div key={session.id} className="bg-black/40 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-cyan-400 font-semibold">{session.title}</h4>
                <span className="text-xs text-gray-400">{session.type.replace('_', ' ').toUpperCase()}</span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-gray-400">Instructor: </span>
                  <span className="text-green-400">{session.instructor.name}</span>
                </div>
                <div>
                  <span className="text-gray-400">Time: </span>
                  <span className="text-yellow-400">{new Date(session.scheduled_time).toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-gray-400">Enrolled: </span>
                  <span className="text-pink-400">{session.students_enrolled}/{session.max_capacity}</span>
                </div>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                {session.participating_campuses.map((campusId, index) => {
                  const campus = campuses.find(c => c.id === campusId)
                  return (
                    <span key={index} className="bg-purple-500/20 text-purple-400 px-2 py-1 rounded text-xs">
                      {campus?.location.city || campusId}
                    </span>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Time Zone Coordinator
export function TimeZoneCoordinator() {
  const { campuses, timeZoneManager } = useGlobalCampus()
  
  return (
    <div className="bg-black/90 border border-cyan-500 rounded-lg p-4">
      <h3 className="text-cyan-400 font-bold mb-3">Global Time Zones</h3>
      
      <div className="space-y-2 text-sm">
        {campuses.map((campus) => (
          <div key={campus.id} className="flex justify-between">
            <span className="text-gray-300">{campus.location.city}:</span>
            <span className="text-cyan-400 font-mono">
              {timeZoneManager.getCurrentTimeInCampus(campus.id)}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}