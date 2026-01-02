/**
 * useStartupScreen Hook
 * Handles keyboard and touch detection for startup screen activation
 */

import { useState, useEffect, useCallback } from 'react'

export interface UseStartupScreenOptions {
  /** Delay before showing idle prompt (ms) */
  idlePromptDelay?: number
  /** Callback when activated */
  onActivate?: () => void
}

export interface UseStartupScreenReturn {
  /** Whether the startup screen is active (not yet dismissed) */
  isActive: boolean
  /** Whether to show the idle prompt */
  showIdlePrompt: boolean
  /** Manually activate/dismiss the startup screen */
  activate: () => void
}

/**
 * Hook for managing startup screen state and interactions
 */
export function useStartupScreen(
  options: UseStartupScreenOptions = {}
): UseStartupScreenReturn {
  const { idlePromptDelay = 3000, onActivate } = options
  
  const [isActive, setIsActive] = useState(true)
  const [showIdlePrompt, setShowIdlePrompt] = useState(false)

  const activate = useCallback(() => {
    setIsActive(false)
    onActivate?.()
  }, [onActivate])

  // Handle keyboard events
  useEffect(() => {
    if (!isActive) return

    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore modifier keys alone
      if (['Shift', 'Control', 'Alt', 'Meta'].includes(e.key)) {
        return
      }
      activate()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isActive, activate])

  // Handle touch/click events
  useEffect(() => {
    if (!isActive) return

    const handleInteraction = () => {
      activate()
    }

    // Use touchstart for mobile, click for desktop
    window.addEventListener('touchstart', handleInteraction, { passive: true })
    window.addEventListener('click', handleInteraction)

    return () => {
      window.removeEventListener('touchstart', handleInteraction)
      window.removeEventListener('click', handleInteraction)
    }
  }, [isActive, activate])

  // Show idle prompt after delay
  useEffect(() => {
    if (!isActive) return

    const timer = setTimeout(() => {
      setShowIdlePrompt(true)
    }, idlePromptDelay)

    return () => clearTimeout(timer)
  }, [isActive, idlePromptDelay])

  return {
    isActive,
    showIdlePrompt,
    activate,
  }
}
