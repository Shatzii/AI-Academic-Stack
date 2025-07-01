'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'

type Theme = 'dark' | 'light' | 'system'

type ThemeProviderProps = {
  children: ReactNode
  defaultTheme?: Theme
  storageKey?: string
  attribute?: string
  enableSystem?: boolean
  disableTransitionOnChange?: boolean
}

type ThemeProviderState = {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const initialState: ThemeProviderState = {
  theme: 'system',
  setTheme: () => null,
}

const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

export function ThemeProvider({
  children,
  defaultTheme = 'system',
  storageKey = 'vite-ui-theme',
  attribute = 'class',
  enableSystem = true,
  disableTransitionOnChange = false,
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(defaultTheme)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    try {
      const storedTheme = localStorage.getItem(storageKey) as Theme
      if (storedTheme) {
        setTheme(storedTheme)
      }
    } catch (error) {
      // Handle localStorage access error
      console.warn('Theme provider: localStorage access failed')
    }
  }, [storageKey])

  useEffect(() => {
    if (!mounted) return

    const root = window.document.documentElement
    root.classList.remove('light', 'dark')

    if (theme === 'system' && enableSystem) {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light'
      root.classList.add(systemTheme)
      return
    }

    root.classList.add(theme)

    // Store theme preference
    try {
      localStorage.setItem(storageKey, theme)
    } catch (error) {
      console.warn('Theme provider: failed to save theme preference')
    }
  }, [theme, enableSystem, mounted, storageKey])

  const value = {
    theme,
    setTheme: (newTheme: Theme) => {
      if (disableTransitionOnChange) {
        const css = document.createElement('style')
        css.appendChild(
          document.createTextNode(
            `* {
              -webkit-transition: none !important;
              -moz-transition: none !important;
              -o-transition: none !important;
              transition: none !important;
            }`
          )
        )
        document.head.appendChild(css)

        window.getComputedStyle(document.body)

        setTimeout(() => {
          document.head.removeChild(css)
        }, 1)
      }

      setTheme(newTheme)
    },
  }

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return null
  }

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext)

  if (context === undefined)
    throw new Error('useTheme must be used within a ThemeProvider')

  return context
}