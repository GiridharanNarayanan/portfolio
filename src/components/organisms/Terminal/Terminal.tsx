/**
 * Terminal Component
 * Main application shell with command input and output
 */

import { useCallback, useEffect, useRef, useState } from 'react'
import { cn } from '../../../utils/cn'
import { CommandInput } from '../../molecules/CommandInput'
import { StickyCommandBar } from '../StickyCommandBar'
import { MobileNavigation } from '../MobileNavigation'
import { ErrorBoundary } from '../../atoms/ErrorBoundary'
import { MobileCommandProvider } from '../../../context/MobileCommandContext'
import { useTerminal } from './useTerminal'
import { useCommandHistory } from '../../../hooks/useCommandHistory'
import { useCommands } from '../../../hooks/useCommands'
import { useMobileDetect } from '../../../hooks/useMobileDetect'
import { useFilesystem } from '../../../hooks/useFilesystem'
import { setGlobalFilesystem } from '../../../context/FilesystemContext'
import { updateUrlFromCommand, getCommandFromPath } from '../../../hooks/useDeepLink'
import { 
  registerCommand,
  helpCommand,
  clearCommand,
  themeCommand,
  setThemeToggle,
  lsCommand,
  cdCommand,
  pwdCommand,
  treeCommand,
  catCommand,
} from '../../../commands'
import { useTheme } from '../../../hooks/useTheme'

export interface TerminalProps {
  /** Custom class name */
  className?: string
  /** Initial command to execute with typing animation (for deep links) */
  initialCommand?: string | null
  /** Callback to restart terminal (show startup screen) */
  onRestart?: () => void
}

/** Typing animation state */
interface TypingState {
  isTyping: boolean
  displayedText: string
  fullCommand: string
}

/**
 * Main terminal component
 */
export function Terminal({ className, initialCommand, onRestart }: TerminalProps) {
  const { theme, toggleTheme } = useTheme()
  const terminalState = useTerminal()
  const commandHistory = useCommandHistory()
  const { isMobile } = useMobileDetect()
  const filesystem = useFilesystem()
  const mainContentRef = useRef<HTMLElement>(null)
  const liveRegionRef = useRef<HTMLDivElement>(null)
  const latestOutputRef = useRef<HTMLDivElement>(null)
  const [commandsReady, setCommandsReady] = useState(false)
  
  // Typing animation state for deep links
  const [typingState, setTypingState] = useState<TypingState>({
    isTyping: false,
    displayedText: '',
    fullCommand: '',
  })
  const [initialCommandExecuted, setInitialCommandExecuted] = useState(false)

  // Set global filesystem for commands to access
  useEffect(() => {
    if (!filesystem.loading) {
      setGlobalFilesystem(filesystem)
    }
    return () => setGlobalFilesystem(null)
  }, [filesystem, filesystem.loading])

  // Initialize commands on mount
  useEffect(() => {
    // Core commands
    registerCommand(helpCommand)
    registerCommand(clearCommand)
    registerCommand(themeCommand)
    setThemeToggle(toggleTheme)
    
    // Filesystem commands
    registerCommand(lsCommand)
    registerCommand(cdCommand)
    registerCommand(pwdCommand)
    registerCommand(treeCommand)
    registerCommand(catCommand)
    
    setCommandsReady(true)
  }, [toggleTheme])

  // Sync filesystem path with context
  useEffect(() => {
    terminalState.updateContext({ currentPath: filesystem.currentPath })
  }, [filesystem.currentPath, terminalState.updateContext])

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

      // Update URL for shareable links
      // Merge current context with any updates from the command result
      const effectiveContext = {
        ...terminalState.context,
        ...result.newContext,
      }
      updateUrlFromCommand(input, result, effectiveContext)

      // Announce command execution for screen readers
      if (liveRegionRef.current) {
        liveRegionRef.current.textContent = `Command ${input} executed`
      }

      // Clear previous output if requested
      if (result.clearOutput) {
        terminalState.clearOutput()
        // For clearOutput commands, still add to history to show the command entry
        if (result.success) {
          terminalState.setError(null)
          terminalState.addOutput({
            input,
            timestamp: Date.now(),
            result,
          })
        }
      } else {
        // For regular commands, add to history
        terminalState.setOutput(null)
        terminalState.setError(null)
        
        // Announce error for screen readers
        if (!result.success && liveRegionRef.current) {
          liveRegionRef.current.textContent = `Error: ${result.error || 'Unknown error'}`
        }
        
        terminalState.addOutput({
          input,
          timestamp: Date.now(),
          result,
        })
      }

      // Scroll to the latest command entry
      setTimeout(() => {
        latestOutputRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        })
      }, 150)
    },
    [execute, commandHistory, terminalState]
  )

  // Auto-execute ls on first load to show home directory
  // OR execute initial command from deep link with typing animation
  useEffect(() => {
    if (commandsReady && !filesystem.loading && !initialCommandExecuted) {
      if (initialCommand) {
        // Start typing animation for deep link command
        setTypingState({
          isTyping: true,
          displayedText: '',
          fullCommand: initialCommand,
        })
        setInitialCommandExecuted(true)
      } else {
        // Normal startup - just run ls
        handleCommand('ls')
        setInitialCommandExecuted(true)
      }
    }
  }, [commandsReady, filesystem.loading, initialCommand, initialCommandExecuted]) // eslint-disable-line react-hooks/exhaustive-deps

  // Typing animation effect
  useEffect(() => {
    if (!typingState.isTyping || !typingState.fullCommand) return

    const { displayedText, fullCommand } = typingState
    
    if (displayedText.length < fullCommand.length) {
      // Continue typing - random delay for realistic effect
      const delay = 15 + Math.random() * 25
      const timer = setTimeout(() => {
        setTypingState(prev => ({
          ...prev,
          displayedText: fullCommand.slice(0, prev.displayedText.length + 1),
        }))
      }, delay)
      return () => clearTimeout(timer)
    } else {
      // Typing complete - execute command after brief pause
      const timer = setTimeout(() => {
        setTypingState({ isTyping: false, displayedText: '', fullCommand: '' })
        handleCommand(fullCommand)
        // URL is now managed by updateUrlFromCommand in handleCommand
      }, 200)
      return () => clearTimeout(timer)
    }
  }, [typingState]) // eslint-disable-line react-hooks/exhaustive-deps

  // Handle browser back/forward navigation
  useEffect(() => {
    const handlePopState = () => {
      const command = getCommandFromPath(window.location.pathname)
      if (command) {
        handleCommand(command)
      } else {
        // Back to home - show directory listing
        handleCommand('ls')
      }
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [handleCommand])

  return (
    <div
      className={cn('flex flex-col min-h-screen', className)}
      style={{ backgroundColor: 'var(--color-bg)' }}
      role="application"
      aria-label="Terminal Portfolio"
    >
      {/* Skip link for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:bg-terminal-accent focus:text-terminal-bg focus:px-4 focus:py-2 focus:rounded"
      >
        Skip to main content
      </a>

      {/* ARIA live region for command output announcements */}
      <div
        ref={liveRegionRef}
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      />

      {/* Sticky header */}
      <StickyCommandBar currentPath={filesystem.currentPath} onRestart={onRestart} />

      {/* Main content area - wrapped with MobileCommandProvider for tappable items */}
      <MobileCommandProvider isMobile={isMobile} onCommandExecute={handleCommand}>
      <main 
        id="main-content"
        ref={mainContentRef}
        className="flex-1 p-4 overflow-auto"
        tabIndex={-1}
        aria-label="Terminal output"
      >
        <ErrorBoundary>
        {/* Output history */}
        <div className="space-y-4 mb-4">
          {terminalState.outputHistory.map((entry, index) => (
            <div 
              key={index} 
              className="space-y-2 scroll-mt-16"
              ref={index === terminalState.outputHistory.length - 1 ? latestOutputRef : null}
            >
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

        {/* Typing animation for deep links */}
        {typingState.isTyping && (
          <div className="mb-4 font-mono flex items-center gap-2">
            <span style={{ color: 'var(--color-accent-secondary)' }}>
              $ &gt;
            </span>
            <span style={{ color: 'var(--color-text)' }}>
              {typingState.displayedText}
            </span>
            <span 
              className="animate-pulse"
              style={{ color: 'var(--color-accent)' }}
            >
              █
            </span>
          </div>
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
        </ErrorBoundary>
      </main>
      </MobileCommandProvider>

      {/* Command input - desktop vs mobile */}
      {isMobile ? (
        <MobileNavigation 
          onCommandExecute={handleCommand} 
          currentPath={filesystem.currentPath}
        />
      ) : (
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
            currentPath={filesystem.currentPath}
            autoFocus
          />
        </div>
      )}
    </div>
  )
}
