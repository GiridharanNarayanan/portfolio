/**
 * CommandPrompt Component
 * Terminal-styled command prompt prefix
 */

import { cn } from '../../../utils/cn'

export interface CommandPromptProps {
  /** Prompt text (default: '$ >') */
  prompt?: string
  /** Whether this is the active/current prompt */
  isActive?: boolean
  /** Custom class name */
  className?: string
}

/**
 * Command prompt prefix (e.g., "$ >")
 */
export function CommandPrompt({
  prompt = '$ >',
  isActive = true,
  className,
}: CommandPromptProps) {
  return (
    <span
      className={cn(
        'font-mono select-none',
        isActive ? 'opacity-100' : 'opacity-50',
        className
      )}
      style={{ color: 'var(--color-accent-secondary)' }}
      aria-hidden="true"
    >
      {prompt}
    </span>
  )
}
