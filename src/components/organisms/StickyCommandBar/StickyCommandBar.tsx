/**
 * StickyCommandBar Component
 * Fixed header with available commands and terminal prompt
 */

import { cn } from '../../../utils/cn'
import type { Command } from '../../../types/Command.types'

export interface StickyCommandBarProps {
  /** Available commands to display */
  commands: Command[]
  /** Custom class name */
  className?: string
}

/**
 * Sticky header bar showing available commands
 */
export function StickyCommandBar({ commands, className }: StickyCommandBarProps) {
  return (
    <header
      className={cn(
        'sticky top-0 z-40',
        'border-b py-3 px-4',
        'font-mono text-sm',
        className
      )}
      style={{
        backgroundColor: 'var(--color-bg)',
        borderColor: 'var(--color-border)',
      }}
    >
      <div className="flex items-center justify-between gap-4 flex-wrap">
        {/* Terminal prompt */}
        <div className="flex items-center gap-2">
          <span style={{ color: 'var(--color-accent)' }}>portfolio</span>
          <span style={{ color: 'var(--color-text-muted)' }}>@</span>
          <span style={{ color: 'var(--color-accent-secondary)' }}>terminal</span>
          <span style={{ color: 'var(--color-text-muted)' }}>:~$</span>
        </div>

        {/* Available commands */}
        <nav
          className="flex items-center gap-3 flex-wrap"
          aria-label="Available commands"
        >
          {commands.slice(0, 6).map((cmd) => (
            <span
              key={cmd.name}
              className="opacity-70 hover:opacity-100 transition-opacity"
              style={{ color: 'var(--color-text-muted)' }}
              title={cmd.description}
            >
              {cmd.name}
            </span>
          ))}
          {commands.length > 6 && (
            <span style={{ color: 'var(--color-text-muted)' }}>
              +{commands.length - 6} more
            </span>
          )}
        </nav>
      </div>
    </header>
  )
}
