/**
 * StartupScreen Component
 * Full-screen terminal-styled hero with ASCII art and activation listener
 */

import { cn } from '../../../utils/cn'
import { GIRID_ASCII } from './asciiArt'
import { useStartupScreen } from './useStartupScreen'
import { useMobileDetect } from '../../../hooks/useMobileDetect'

export interface StartupScreenProps {
  /** Callback when user activates (dismisses) the startup screen */
  onActivate?: () => void
  /** Custom class name */
  className?: string
}

/** Commands to display on startup */
const STARTUP_COMMANDS = [
  { cmd: 'ls', desc: 'List directory contents' },
  { cmd: 'cd <path>', desc: 'Change directory' },
  { cmd: 'cat <file>', desc: 'Read file contents' },
  { cmd: 'tree', desc: 'Show directory tree' },
  { cmd: 'theme', desc: 'Toggle dark/light mode' },
]

/**
 * Startup screen with ASCII "GIRID" art
 * Automatically dismisses on any keypress or tap
 */
export function StartupScreen({ onActivate, className }: StartupScreenProps) {
  const { isActive, showIdlePrompt } = useStartupScreen({
    onActivate,
    idlePromptDelay: 500,
  })
  const { isMobile } = useMobileDetect()

  if (!isActive) {
    return null
  }

  return (
    <div
      className={cn(
        'fixed inset-0 z-50 flex flex-col items-center justify-center',
        'transition-opacity duration-500',
        !isActive && 'opacity-0 pointer-events-none',
        className
      )}
      style={{ backgroundColor: 'var(--color-bg)' }}
      role="banner"
      aria-label="Welcome screen"
    >
      {/* Terminal frame container */}
      <div className="relative max-w-4xl w-full mx-4 p-8">
        {/* Top border */}
        <div
          className="text-center font-mono text-sm mb-2"
          style={{ color: 'var(--color-border)' }}
          aria-hidden="true"
        >
          ╔{'═'.repeat(50)}╗
        </div>

        {/* ASCII Art */}
        <pre
          className="font-mono text-center whitespace-pre select-none"
          style={{ 
            color: 'var(--color-accent)',
            fontSize: 'clamp(0.5rem, 2.5vw, 1rem)',
            lineHeight: 1.2,
          }}
          aria-label="GIRID"
        >
          {GIRID_ASCII}
        </pre>

        {/* Bottom border */}
        <div
          className="text-center font-mono text-sm mt-2"
          style={{ color: 'var(--color-border)' }}
          aria-hidden="true"
        >
          ╚{'═'.repeat(50)}╝
        </div>

        {/* Name and title */}
        <div className="text-center mt-8 space-y-2">
          <h1
            className="font-mono text-2xl md:text-3xl font-bold"
            style={{ color: 'var(--color-text)' }}
          >
            Giridharan Narayanan
          </h1>
          <p
            className="font-mono text-lg md:text-xl"
            style={{ color: 'var(--color-text-muted)' }}
          >
            I build software and teams
          </p>
        </div>

        {/* Idle prompt */}
        <div
          className={cn(
            'text-center mt-12 font-mono transition-opacity duration-500',
            showIdlePrompt ? 'opacity-100' : 'opacity-0'
          )}
          aria-live="polite"
        >
          {/* Command hints */}
          <div 
            className="mb-10 text-left max-w-md mx-auto"
            style={{ color: 'var(--color-text-muted)' }}
          >
            <p 
              className="mb-3 text-sm"
              style={{ color: 'var(--color-accent)' }}
            >
              Available Commands:
            </p>
            <div className="space-y-1 text-sm">
              {STARTUP_COMMANDS.map(({ cmd, desc }) => (
                <div key={cmd} className="flex gap-3">
                  <span 
                    className="min-w-[100px]"
                    style={{ color: 'var(--color-accent-secondary)' }}
                  >
                    {cmd}
                  </span>
                  <span style={{ color: 'var(--color-text-muted)' }}>
                    {desc}
                  </span>
                </div>
              ))}
            </div>
            <p className="mt-3 text-xs" style={{ color: 'var(--color-text-muted)' }}>
              {isMobile ? (
                <>Tip: <span style={{ color: 'var(--color-accent)' }}>Tap</span> on folders and files to navigate</>
              ) : (
                <>Tip: Use <span style={{ color: 'var(--color-accent)' }}>Tab</span> to autocomplete commands and paths</>
              )}
            </p>
          </div>

          {/* Press any key prompt */}
          <span 
            className="animate-pulse"
            style={{ color: 'var(--color-accent-secondary)' }}
          >
            {isMobile ? '> Tap anywhere to continue...' : '> Press any key to continue...'}
          </span>
        </div>
      </div>
    </div>
  )
}
