/**
 * Terminal Component
 * Main application shell with command input and output
 */

import { useCallback, useEffect } from 'react'
import { cn } from '../../../utils/cn'
import { CommandInput } from '../../molecules/CommandInput'
import { StickyCommandBar } from '../StickyCommandBar'
import { useTerminal } from './useTerminal'
import { useCommandHistory } from '../../../hooks/useCommandHistory'
import { useCommands } from '../../../hooks/useCommands'
import { 
  getAvailableCommands,
  registerCommand,
  helpCommand,
  clearCommand,
  backCommand,
  themeCommand,
  setThemeToggle,
} from '../../../commands'
import { useTheme } from '../../../hooks/useTheme'

export interface TerminalProps {
  /** Custom class name */
  className?: string
}

/**
 * Main terminal component
 */
export function Terminal({ className }: TerminalProps) {
  const { theme, toggleTheme } = useTheme()
  const terminalState = useTerminal()
  const commandHistory = useCommandHistory()

  // Initialize commands on mount
  useEffect(() => {
    registerCommand(helpCommand)
    registerCommand(clearCommand)
    registerCommand(backCommand)
    registerCommand(themeCommand)
    setThemeToggle(toggleTheme)
  }, [toggleTheme])

  // Update context theme when theme changes
  useEffect(() => {
    terminalState.updateContext({ theme })
  }, [theme, terminalState.updateContext])

  const { execute } = useCommands({
    context: terminalState.context,
    onContextChange: terminalState.updateContext,
  })

  const handleCommand = useCallback(
    async (input: string) => {
      commandHistory.addToHistory(input)
      commandHistory.resetNavigation()

      const result = await execute(input)

      if (result.clearOutput) {
        terminalState.clearOutput()
        return
      }

      if (result.success) {
        terminalState.setOutput(result.output || null)
        terminalState.setError(null)
      } else {
        terminalState.setError(result.error || 'Unknown error')
        terminalState.setOutput(null)
      }

      // Add to output history
      terminalState.addOutput({
        input,
        timestamp: Date.now(),
        result,
      })
    },
    [execute, commandHistory, terminalState]
  )

  const availableCommands = getAvailableCommands(terminalState.context)

  return (
    <div
      className={cn('flex flex-col min-h-screen', className)}
      style={{ backgroundColor: 'var(--color-bg)' }}
    >
      {/* Sticky header */}
      <StickyCommandBar commands={availableCommands} />

      {/* Main content area */}
      <main className="flex-1 p-4 overflow-auto">
        {/* Output history */}
        <div className="space-y-4 mb-4">
          {terminalState.outputHistory.map((entry, index) => (
            <div key={index} className="space-y-2">
              {/* Command line */}
              <div className="font-mono flex items-center gap-2">
                <span style={{ color: 'var(--color-accent-secondary)' }}>
                  $ &gt;
                </span>
                <span style={{ color: 'var(--color-text)' }}>{entry.input}</span>
              </div>
              {/* Output */}
              {entry.result.output && (
                <div className="pl-6">{entry.result.output}</div>
              )}
              {entry.result.error && (
                <div
                  className="pl-6 font-mono"
                  style={{ color: 'var(--color-error)' }}
                >
                  Error: {entry.result.error}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Current output */}
        {terminalState.currentOutput && (
          <div className="mb-4">{terminalState.currentOutput}</div>
        )}

        {/* Error message */}
        {terminalState.error && (
          <div
            className="mb-4 font-mono"
            style={{ color: 'var(--color-error)' }}
            role="alert"
          >
            Error: {terminalState.error}
          </div>
        )}
      </main>

      {/* Command input (fixed at bottom) */}
      <div
        className="sticky bottom-0 border-t"
        style={{
          backgroundColor: 'var(--color-bg)',
          borderColor: 'var(--color-border)',
        }}
      >
        <CommandInput
          onSubmit={handleCommand}
          onHistoryUp={commandHistory.navigateUp}
          onHistoryDown={commandHistory.navigateDown}
          autoFocus
        />
      </div>
    </div>
  )
}
