/**
 * StickyCommandBar Component
 * Fixed header with terminal prompt branding
 */

import { cn } from '../../../utils/cn'

export interface StickyCommandBarProps {
  /** Current directory path */
  currentPath?: string
  /** Custom class name */
  className?: string
  /** Callback when header is clicked (for restart) */
  onRestart?: () => void
}

/**
 * Sticky header bar with terminal prompt
 */
export function StickyCommandBar({ currentPath = '~', className, onRestart }: StickyCommandBarProps) {
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
      {/* Terminal prompt - clickable to restart */}
      <div 
        className={cn('flex items-center gap-2', onRestart && 'cursor-pointer hover:opacity-80 transition-opacity')}
        onClick={(e) => {
          if (onRestart) {
            e.stopPropagation()
            onRestart()
          }
        }}
        role={onRestart ? 'button' : undefined}
        tabIndex={onRestart ? 0 : undefined}
        onKeyDown={onRestart ? (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onRestart() } } : undefined}
        aria-label={onRestart ? 'Restart terminal' : undefined}
      >
        <span style={{ color: 'var(--color-accent)' }}>girid</span>
        <span style={{ color: 'var(--color-text-muted)' }}>@</span>
        <span style={{ color: 'var(--color-accent-secondary)' }}>portfolio</span>
        <span style={{ color: 'var(--color-text-muted)' }}>:</span>
        <span style={{ color: 'var(--color-accent)' }}>{currentPath}</span>
        <span style={{ color: 'var(--color-text-muted)' }}>$</span>
      </div>
    </header>
  )
}
