/**
 * useTerminal Hook
 * Terminal state management
 */

import { useState, useCallback, type ReactNode } from 'react'
import type { CommandContext, HistoryEntry } from '../../../types/Command.types'

export interface TerminalState {
  /** Current command context */
  context: CommandContext
  /** Output history */
  outputHistory: HistoryEntry[]
  /** Current output being displayed */
  currentOutput: ReactNode | null
  /** Whether startup screen has been dismissed */
  isStarted: boolean
  /** Error message if any */
  error: string | null
}

export interface UseTerminalReturn extends TerminalState {
  /** Start the terminal (dismiss startup screen) */
  start: () => void
  /** Update context */
  updateContext: (updates: Partial<CommandContext>) => void
  /** Add output to history */
  addOutput: (entry: HistoryEntry) => void
  /** Set current output */
  setOutput: (output: ReactNode | null) => void
  /** Clear all output */
  clearOutput: () => void
  /** Set error */
  setError: (error: string | null) => void
}

const initialContext: CommandContext = {
  currentView: 'home',
  history: ['home'],
  theme: 'dark',
}

/**
 * Hook for managing terminal state
 */
export function useTerminal(): UseTerminalReturn {
  const [context, setContext] = useState<CommandContext>(initialContext)
  const [outputHistory, setOutputHistory] = useState<HistoryEntry[]>([])
  const [currentOutput, setCurrentOutput] = useState<ReactNode | null>(null)
  const [isStarted, setIsStarted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const start = useCallback(() => {
    setIsStarted(true)
  }, [])

  const updateContext = useCallback((updates: Partial<CommandContext>) => {
    setContext((prev: CommandContext) => ({ ...prev, ...updates }))
  }, [])

  const addOutput = useCallback((entry: HistoryEntry) => {
    setOutputHistory((prev) => [...prev, entry])
  }, [])

  const setOutput = useCallback((output: ReactNode | null) => {
    setCurrentOutput(output)
    setError(null)
  }, [])

  const clearOutput = useCallback(() => {
    setOutputHistory([])
    setCurrentOutput(null)
    setError(null)
  }, [])

  const setErrorState = useCallback((err: string | null) => {
    setError(err)
  }, [])

  return {
    context,
    outputHistory,
    currentOutput,
    isStarted,
    error,
    start,
    updateContext,
    addOutput,
    setOutput,
    clearOutput,
    setError: setErrorState,
  }
}
