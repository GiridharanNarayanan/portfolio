/**
 * StartupScreen Component
 * Full-screen terminal-styled hero with ASCII art and activation listener
 */

import { cn } from '../../../utils/cn'
import { GIRID_ASCII } from './asciiArt'
import { useStartupScreen } from './useStartupScreen'

export interface StartupScreenProps {
  /** Callback when user activates (dismisses) the startup screen */
  onActivate?: () => void
  /** Custom class name */
  className?: string
}

/**
 * Startup screen with ASCII "GIRID" art
 * Automatically dismisses on any keypress or tap
 */
export function StartupScreen({ onActivate, className }: StartupScreenProps) {
  const { isActive, showIdlePrompt } = useStartupScreen({
    onActivate,
    idlePromptDelay: 3000,
  })

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
            Giri Dayanandan
          </h1>
          <p
            className="font-mono text-lg md:text-xl"
            style={{ color: 'var(--color-text-muted)' }}
          >
            Software Engineer
          </p>
        </div>

        {/* Idle prompt */}
        <div
          className={cn(
            'text-center mt-12 font-mono transition-opacity duration-500',
            showIdlePrompt ? 'opacity-100' : 'opacity-0'
          )}
          style={{ color: 'var(--color-accent-secondary)' }}
          aria-live="polite"
        >
          <span className="animate-pulse">
            {'>'} Press any key to continue...
          </span>
        </div>

        {/* Decorative cursor */}
        <div
          className="absolute bottom-4 right-8 font-mono"
          style={{ color: 'var(--color-accent)' }}
          aria-hidden="true"
        >
          <span className="inline-block w-3 h-5 animate-pulse" style={{ backgroundColor: 'var(--color-accent)' }} />
        </div>
      </div>
    </div>
  )
}
