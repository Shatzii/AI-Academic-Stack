'use client'

import { useState, useEffect, ReactNode } from 'react'

// Universal hydration fix for Universal One School 3.0
export function HydrationFix({ children }: { children: ReactNode }) {
  const [hasMounted, setHasMounted] = useState(false)

  useEffect(() => {
    setHasMounted(true)
  }, [])

  if (!hasMounted) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full mx-auto mb-4" />
          <div className="text-green-400 font-orbitron">Universal One School 3.0</div>
          <div className="text-gray-400 text-sm">Loading Advanced AI Learning Platform...</div>
        </div>
      </div>
    )
  }

  return <>{children}</>
}

// Client-only wrapper for components that require browser APIs
export function ClientOnly({ children, fallback }: { children: ReactNode; fallback?: ReactNode }) {
  const [hasMounted, setHasMounted] = useState(false)

  useEffect(() => {
    setHasMounted(true)
  }, [])

  if (!hasMounted) {
    return fallback ? <>{fallback}</> : null
  }

  return <>{children}</>
}

// Safe localStorage hook that prevents hydration mismatches
export function useClientStorage(key: string, defaultValue: any) {
  const [value, setValue] = useState(defaultValue)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    try {
      const item = localStorage.getItem(key)
      if (item) {
        setValue(JSON.parse(item))
      }
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error)
    }
    setIsLoaded(true)
  }, [key])

  const setStoredValue = (newValue: any) => {
    setValue(newValue)
    try {
      localStorage.setItem(key, JSON.stringify(newValue))
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error)
    }
  }

  return [value, setStoredValue, isLoaded] as const
}

// Theme-aware component wrapper
export function ThemeAwareComponent({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    // Return a theme-neutral loading state
    return (
      <div className="bg-gray-900 text-gray-100 min-h-screen">
        {children}
      </div>
    )
  }

  return <>{children}</>
}