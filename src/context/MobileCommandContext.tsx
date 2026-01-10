/**
 * Mobile Command Context
 * Provides command execution capability to nested components
 */

import { createContext, useContext, type ReactNode } from 'react'
import { getDirectoryGeneration } from './directoryGeneration'

interface MobileCommandContextValue {
  /** Whether we're in mobile mode */
  isMobile: boolean
  /** Execute a command */
  executeCommand: (command: string) => void
  /** Current generation number (increments on directory change) */
  generation: number
}

const MobileCommandContext = createContext<MobileCommandContextValue | null>(null)

export interface MobileCommandProviderProps {
  children: ReactNode
  isMobile: boolean
  onCommandExecute: (command: string) => void
}

/**
 * Provider for mobile command execution
 * Generation is managed by the cd command via directoryGeneration module
 */
export function MobileCommandProvider({
  children,
  isMobile,
  onCommandExecute,
}: MobileCommandProviderProps) {
  return (
    <MobileCommandContext.Provider
      value={{
        isMobile,
        executeCommand: onCommandExecute,
        generation: getDirectoryGeneration(),
      }}
    >
      {children}
    </MobileCommandContext.Provider>
  )
}

/**
 * Hook to access mobile command context
 */
export function useMobileCommand(): MobileCommandContextValue {
  const context = useContext(MobileCommandContext)
  if (!context) {
    // Return a no-op context if not inside provider (desktop mode)
    return {
      isMobile: false,
      executeCommand: () => {},
      generation: 0,
    }
  }
  return context
}
