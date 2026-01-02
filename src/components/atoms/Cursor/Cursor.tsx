/**
 * Cursor Component
 * Blinking terminal cursor animation
 */

import { cn } from '../../../utils/cn'

export interface CursorProps {
  /** Whether cursor is visible */
  visible?: boolean
  /** Custom class name */
  className?: string
}

/**
 * Blinking cursor for terminal input
 */
export function Cursor({ visible = true, className }: CursorProps) {
  if (!visible) return null

  return (
    <span
      className={cn(
        'inline-block w-2 h-5 ml-0.5',
        'animate-pulse',
        className
      )}
      style={{ backgroundColor: 'var(--color-accent)' }}
      aria-hidden="true"
    />
  )
}
