'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

interface User {
  id: string
  username: string
  email?: string
  firstName?: string
  lastName?: string
  role?: string
  neurotype?: string
  enrollmentType?: 'vr-premium' | 'ai-enhanced' | 'standard-plus' | 'basic'
  school?: string
  grade?: string
  preferences?: {
    theme?: 'dark' | 'light' | 'high-contrast' | 'dyslexia-friendly'
    vr_enabled?: boolean
    ai_personality?: string
    sensory_settings?: {
      reduced_motion?: boolean
      high_contrast?: boolean
      large_text?: boolean
    }
  }
  achievements?: Achievement[]
  lastActive?: string
}

interface Achievement {
  id: string
  title: string
  description: string
  category: 'academic' | 'social' | 'creative' | 'leadership'
  earned_date: string
  nft_token?: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (username: string, password: string) => Promise<void>
  loginWithGoogle: () => Promise<void>
  loginWithMicrosoft: () => Promise<void>
  register: (userData: RegisterData) => Promise<void>
  logout: () => Promise<void>
  updatePreferences: (preferences: Partial<User['preferences']>) => Promise<void>
  isAuthenticated: boolean
  hasFeatureAccess: (feature: string) => boolean
}

interface RegisterData {
  username: string
  password: string
  email?: string
  firstName?: string
  lastName?: string
  role?: string
  neurotype?: string
  school?: string
  grade?: string
  enrollmentType?: User['enrollmentType']
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [mounted, setMounted] = useState(false)
  const queryClient = useQueryClient()

  // Prevent hydration mismatch - 3.0 ENHANCEMENT
  useEffect(() => {
    setMounted(true)
  }, [])

  // Check for existing session with enhanced security - 3.0 ENHANCEMENT
  useEffect(() => {
    if (!mounted) return
    
    const checkSession = async () => {
      try {
        // Check for both localStorage and secure HTTP-only cookies
        const savedUser = localStorage.getItem('auth_user')
        const response = await fetch('/api/auth/verify-session', {
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          }
        })

        if (response.ok) {
          const sessionUser = await response.json()
          setUser(sessionUser)
          localStorage.setItem('auth_user', JSON.stringify(sessionUser))
        } else if (savedUser) {
          // Fallback to localStorage if session expired
          try {
            const parsedUser = JSON.parse(savedUser)
            // Verify the stored user is still valid
            const verifyResponse = await fetch('/api/auth/verify-user', {
              method: 'POST',
              credentials: 'include',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ userId: parsedUser.id })
            })
            
            if (verifyResponse.ok) {
              setUser(parsedUser)
            } else {
              localStorage.removeItem('auth_user')
            }
          } catch (error) {
            console.warn('Invalid stored user data, clearing:', error)
            localStorage.removeItem('auth_user')
          }
        }
      } catch (error) {
        console.warn('Session verification failed:', error)
        localStorage.removeItem('auth_user')
      }
    }

    checkSession()
  }, [mounted])

  // Enhanced login with multi-factor support - 3.0 ENHANCEMENT
  const loginMutation = useMutation({
    mutationFn: async ({ username, password, mfaCode }: { username: string; password: string; mfaCode?: string }) => {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ username, password, mfaCode }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || error.error || 'Login failed')
      }

      return response.json()
    },
    onSuccess: (userData) => {
      setUser(userData)
      localStorage.setItem('auth_user', JSON.stringify(userData))
      queryClient.invalidateQueries({ queryKey: ['user'] })
      
      // Track login for analytics - 3.0 ENHANCEMENT
      if (typeof gtag !== 'undefined') {
        gtag('event', 'login', {
          method: 'email',
          user_type: userData.enrollmentType
        })
      }
    },
    onError: (error) => {
      console.error('Login error:', error)
      localStorage.removeItem('auth_user')
    }
  })

  // Social login integrations - 3.0 NEW FEATURE
  const socialLoginMutation = useMutation({
    mutationFn: async (provider: 'google' | 'microsoft' | 'apple') => {
      // Redirect to OAuth provider
      window.location.href = `/api/auth/${provider}`
    }
  })

  // Enhanced registration with enrollment type selection - 3.0 ENHANCEMENT
  const registerMutation = useMutation({
    mutationFn: async (userData: RegisterData) => {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(userData),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || error.error || 'Registration failed')
      }

      return response.json()
    },
    onSuccess: (userData) => {
      setUser(userData)
      localStorage.setItem('auth_user', JSON.stringify(userData))
      queryClient.invalidateQueries({ queryKey: ['user'] })
      
      // Track registration for analytics - 3.0 ENHANCEMENT
      if (typeof gtag !== 'undefined') {
        gtag('event', 'sign_up', {
          method: 'email',
          enrollment_type: userData.enrollmentType
        })
      }
    },
    onError: (error) => {
      console.error('Registration error:', error)
      localStorage.removeItem('auth_user')
    }
  })

  // Enhanced logout with secure cleanup - 3.0 ENHANCEMENT
  const logoutMutation = useMutation({
    mutationFn: async () => {
      try {
        // Notify server to invalidate session
        await fetch('/api/auth/logout', {
          method: 'POST',
          credentials: 'include',
        })
      } catch (error) {
        console.warn('Logout API error:', error)
      }
      
      // Always clear local state regardless of API response
      setUser(null)
      localStorage.removeItem('auth_user')
      
      // Clear all cached data
      queryClient.clear()
      
      // Clear any VR session data - 3.0 ENHANCEMENT
      if ('xr' in navigator) {
        localStorage.removeItem('vr_session_data')
      }
    },
  })

  // Update user preferences - 3.0 NEW FEATURE
  const updatePreferencesMutation = useMutation({
    mutationFn: async (preferences: Partial<User['preferences']>) => {
      const response = await fetch('/api/auth/preferences', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(preferences),
      })

      if (!response.ok) {
        throw new Error('Failed to update preferences')
      }

      return response.json()
    },
    onSuccess: (updatedUser) => {
      setUser(updatedUser)
      localStorage.setItem('auth_user', JSON.stringify(updatedUser))
    }
  })

  // Feature access control based on enrollment type - 3.0 NEW FEATURE
  const hasFeatureAccess = (feature: string): boolean => {
    if (!user) return false

    const featureMap = {
      'vr-premium': ['vr_classrooms', 'advanced_ai', 'predictive_analytics', 'ai_tutor', 'social_login', 'achievements_nft'],
      'ai-enhanced': ['advanced_ai', 'predictive_analytics', 'ai_tutor', 'social_login', 'achievements_digital'],
      'standard-plus': ['basic_ai', 'progress_tracking', 'social_login', 'achievements_digital'],
      'basic': ['basic_ai', 'progress_tracking']
    }

    const userFeatures = featureMap[user.enrollmentType || 'basic'] || []
    return userFeatures.includes(feature)
  }

  const login = async (username: string, password: string) => {
    await loginMutation.mutateAsync({ username, password })
  }

  const loginWithGoogle = async () => {
    await socialLoginMutation.mutateAsync('google')
  }

  const loginWithMicrosoft = async () => {
    await socialLoginMutation.mutateAsync('microsoft')
  }

  const register = async (userData: RegisterData) => {
    await registerMutation.mutateAsync(userData)
  }

  const logout = async () => {
    await logoutMutation.mutateAsync()
  }

  const updatePreferences = async (preferences: Partial<User['preferences']>) => {
    await updatePreferencesMutation.mutateAsync(preferences)
  }

  // Prevent rendering during hydration to avoid mismatch
  if (!mounted) {
    return null
  }

  const value = {
    user,
    isLoading: loginMutation.isPending || registerMutation.isPending,
    login,
    loginWithGoogle,
    loginWithMicrosoft,
    register,
    logout,
    updatePreferences,
    isAuthenticated: !!user,
    hasFeatureAccess,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// Higher-order component for protected routes - 3.0 ENHANCEMENT
export function withAuth<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  requiredFeature?: string
) {
  return function AuthProtectedComponent(props: P) {
    const { isAuthenticated, hasFeatureAccess, isLoading } = useAuth()

    if (isLoading) {
      return <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    }

    if (!isAuthenticated) {
      return <div>Please log in to access this feature.</div>
    }

    if (requiredFeature && !hasFeatureAccess(requiredFeature)) {
      return <div>Your enrollment plan doesn't include access to this feature. Please upgrade to continue.</div>
    }

    return <WrappedComponent {...props} />
  }
}