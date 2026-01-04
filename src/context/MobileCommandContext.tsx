/**
 * Mobile Command Context
 * Provides command execution capability to nested components
 */

import { createContext, useContext, type ReactNode } from 'react'

interface MobileCommandContextValue {
  /** Whether we're in mobile mode */
  isMobile: boolean
  /** Execute a command */
  executeCommand: (command: string) => void
}

const MobileCommandContext = createContext<MobileCommandContextValue | null>(null)

export interface MobileCommandProviderProps {
  children: ReactNode
  isMobile: boolean
  onCommandExecute: (command: string) => void
}

/**
 * Provider for mobile command execution
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
    }
  }
  return context
}
