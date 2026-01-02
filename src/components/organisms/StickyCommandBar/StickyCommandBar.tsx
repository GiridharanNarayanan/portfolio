/**
 * StickyCommandBar Component
 * Fixed header with terminal prompt branding
 */

import { cn } from '../../../utils/cn'

export interface StickyCommandBarProps {
  /** Custom class name */
  className?: string
}

/**
 * Sticky header bar with terminal prompt
 */
export function StickyCommandBar({ className }: StickyCommandBarProps) {
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
      {/* Terminal prompt */}
      <div className="flex items-center gap-2">
        <span style={{ color: 'var(--color-accent)' }}>portfolio</span>
        <span style={{ color: 'var(--color-text-muted)' }}>@</span>
        <span style={{ color: 'var(--color-accent-secondary)' }}>terminal</span>
        <span style={{ color: 'var(--color-text-muted)' }}>:~$</span>
      </div>
    </header>
  )
}
