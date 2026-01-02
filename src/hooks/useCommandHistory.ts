/**
 * useCommandHistory Hook
 * Arrow key navigation through command history
 */

import { useState, useCallback } from 'react'

export interface UseCommandHistoryReturn {
  /** Command history array */
  history: string[]
  /** Current history index (-1 means not browsing history) */
  historyIndex: number
  /** Add a command to history */
  addToHistory: (command: string) => void
  /** Navigate up in history (older) */
  navigateUp: () => string | null
  /** Navigate down in history (newer) */
  navigateDown: () => string | null
  /** Reset history navigation */
  resetNavigation: () => void
  /** Clear all history */
  clearHistory: () => void
}

/**
 * Hook for managing command history navigation
 */
export function useCommandHistory(maxHistory = 50): UseCommandHistoryReturn {
  const [history, setHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)

  const addToHistory = useCallback(
    (command: string) => {
      if (!command.trim()) return

      setHistory((prev) => {
        // Don't add duplicates of the last command
        if (prev[prev.length - 1] === command) {
          return prev
        }

        const newHistory = [...prev, command]
        // Trim to max history
        if (newHistory.length > maxHistory) {
          return newHistory.slice(-maxHistory)
        }
        return newHistory
      })
      setHistoryIndex(-1)
    },
    [maxHistory]
  )

  const navigateUp = useCallback((): string | null => {
    if (history.length === 0) return null

    const newIndex =
      historyIndex === -1
        ? history.length - 1
        : Math.max(0, historyIndex - 1)

    setHistoryIndex(newIndex)
    return history[newIndex]
  }, [history, historyIndex])

  const navigateDown = useCallback((): string | null => {
    if (historyIndex === -1) return null

    const newIndex = historyIndex + 1

    if (newIndex >= history.length) {
      setHistoryIndex(-1)
      return ''
    }

    setHistoryIndex(newIndex)
    return history[newIndex]
  }, [history, historyIndex])

  const resetNavigation = useCallback(() => {
    setHistoryIndex(-1)
  }, [])

  const clearHistory = useCallback(() => {
    setHistory([])
    setHistoryIndex(-1)
  }, [])

  return {
    history,
    historyIndex,
    addToHistory,
    navigateUp,
    navigateDown,
    resetNavigation,
    clearHistory,
  }
}
