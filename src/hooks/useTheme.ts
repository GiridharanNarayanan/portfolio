/**
 * useTheme Hook
 * Theme context and toggle functionality
 */

import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import type { Theme, ThemeContextValue } from '../types/Theme.types'

const STORAGE_KEY = 'portfolio-theme'

/**
 * Theme context (internal)
 */
export const ThemeContext = createContext<ThemeContextValue | null>(null)

/**
 * Hook to access theme context
 * Must be used within ThemeProvider
 */
export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext)
  
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  
  return context
}

/**
 * Hook to create theme state and handlers
 * Used internally by ThemeProvider
 */
export function useThemeState(
  defaultTheme?: Theme,
  storageKey: string = STORAGE_KEY
): ThemeContextValue {
  const [theme, setThemeState] = useState<Theme>(() => {
    // Check localStorage first
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(storageKey)
      if (stored === 'dark' || stored === 'light') {
        return stored
      }
    }
    
    // Use default if provided
    if (defaultTheme) {
      return defaultTheme
    }
    
    // Fall back to system preference
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light'
    }
    
    return 'dark'
  })

  const [isSystemPreference, setIsSystemPreference] = useState(() => {
    if (typeof window !== 'undefined') {
      return !localStorage.getItem(storageKey)
    }
    return true
  })

  // Apply theme class to document
  useEffect(() => {
    const root = document.documentElement
    
    if (theme === 'light') {
      root.classList.add('light')
    } else {
      root.classList.remove('light')
    }
  }, [theme])

  // Listen for system preference changes
  useEffect(() => {
    if (!isSystemPreference) return

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    
    const handleChange = (e: MediaQueryListEvent) => {
      setThemeState(e.matches ? 'dark' : 'light')
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [isSystemPreference])

  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme)
    setIsSystemPreference(false)
    localStorage.setItem(storageKey, newTheme)
  }, [storageKey])

  const toggleTheme = useCallback(() => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }, [theme, setTheme])

  return {
    theme,
    toggleTheme,
    setTheme,
    isSystemPreference,
  }
}
