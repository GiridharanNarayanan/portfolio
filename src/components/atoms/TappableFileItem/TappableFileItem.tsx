/**
 * TappableFileItem Component
 * Makes file/folder items tappable on mobile
 */

import { useCallback, useRef } from 'react'
import { useMobileCommand } from '../../../context/MobileCommandContext'
import { cn } from '../../../utils/cn'

export interface TappableFileItemProps {
  /** File or folder name */
  name: string
  /** Whether this is a directory */
  isDirectory?: boolean
  /** Command to execute when tapped */
  command: string
  /** Generation number when this item was rendered (for staleness detection) */
  generation?: number
  /** Custom class name */
  className?: string
}

/**
 * Touch-friendly file/folder item for ls output
 */
export function TappableFileItem({
  name,
  isDirectory = false,
  command,
  generation,
  className,
}: TappableFileItemProps) {
  const { isMobile, executeCommand, generation: currentGeneration } = useMobileCommand()
  const lastTapRef = useRef<number>(0)

  // Check if this item is stale (rendered in a previous generation before directory changes)
  // Items are stale if they were rendered before any directory change
  const isStale = generation !== undefined && generation < currentGeneration

  const handleTap = useCallback(() => {
    // Don't execute if stale
    if (isStale) return
    
    // Debounce to prevent double-firing from touch + click
    const now = Date.now()
    if (now - lastTapRef.current < 300) {
      return
    }
    lastTapRef.current = now
    executeCommand(command)
  }, [command, executeCommand, isStale])

  // On desktop, render with stale styling if applicable
  if (!isMobile) {
    return (
      <span 
        className={cn(
          isStale && 'opacity-50',
          className
        )}
      >
        {name}
      </span>
    )
  }

  // On mobile, make it tappable (or show as stale/disabled)
  return (
    <button
      type="button"
      onClick={handleTap}
      disabled={isStale}
      className={cn(
        'tappable-file-item',
        'inline-flex items-center gap-1',
        'min-h-[44px] px-3 py-2 -mx-2',
        'rounded-md',
        'bg-transparent',
        'touch-manipulation',
        'select-none',
        'transition-colors duration-150',
        'text-left',
        // Stale items: faded and not interactive
        isStale ? [
          'opacity-50',
          'cursor-default',
        ] : [
          'hover:bg-terminal-accent/10',
          'active:bg-terminal-accent/20',
          'cursor-pointer',
        ],
        className
      )}
      style={{ WebkitTapHighlightColor: 'transparent' }}
      aria-label={isStale 
        ? `${name} (historical)` 
        : isDirectory 
          ? `Open folder ${name}` 
          : `View ${name}`
      }
      aria-disabled={isStale}
    >
      <span className="pointer-events-none">{name}</span>
      {/* Hide tap indicator for stale items */}
      {!isStale && (
        <span 
          className="text-terminal-muted/60 text-xs ml-1 pointer-events-none font-mono"
          aria-hidden="true"
        >
          {isDirectory ? '[>]' : '[+]'}
        </span>
      )}
    </button>
  )
}

export default TappableFileItem