/**
 * TappableItem Component
 * Makes terminal output items tappable on mobile
 */

import { cn } from '../../../utils/cn'

export interface TappableItemProps {
  /** Display content */
  children: React.ReactNode
  /** Command to execute when tapped */
  command: string
  /** Callback when item is tapped */
  onTap: (command: string) => void
  /** Whether this is a directory */
  isDirectory?: boolean
  /** Whether tapping is enabled */
  enabled?: boolean
  /** Custom class name */
  className?: string
}

/**
 * Touch-friendly wrapper for terminal output items
 */
export function TappableItem({
  children,
  command,
  onTap,
  isDirectory = false,
  enabled = true,
  className,
}: TappableItemProps) {
  if (!enabled) {
    return <span className={className}>{children}</span>
  }

  return (
    <button
      type="button"
      onClick={() => onTap(command)}
      className={cn(
        'tappable-item',
        'inline-flex items-center',
        'px-2 py-1 -mx-2 -my-0.5',
        'rounded',
        'hover:bg-terminal-accent/10',
        'active:bg-terminal-accent/20',
        'touch-manipulation',
        'transition-colors duration-150',
        'text-left',
        isDirectory && 'font-bold',
        className
      )}
      aria-label={isDirectory ? `Open folder ${command}` : `View ${command}`}
    >
      {children}
      <span 
        className="ml-2 text-terminal-muted text-xs opacity-0 group-hover:opacity-100 sm:hidden"
        aria-hidden="true"
      >
        tap
      </span>
    </button>
  )
}

export default TappableItem
