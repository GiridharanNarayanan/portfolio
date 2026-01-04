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
  className,
}: TappableFileItemProps) {
  const { isMobile, executeCommand } = useMobileCommand()
  const lastTapRef = useRef<number>(0)

  const handleTap = useCallback(() => {
    // Debounce to prevent double-firing from touch + click
    const now = Date.now()
    if (now - lastTapRef.current < 300) {
      return
    }
    lastTapRef.current = now
    executeCommand(command)
  }, [command, executeCommand])

  // On desktop, just render the name
  if (!isMobile) {
    return <span className={className}>{name}</span>
  }

  // On mobile, make it tappable
  return (
    <button
      type="button"
      onClick={handleTap}
      className={cn(
        'tappable-file-item',
        'inline-flex items-center gap-1',
        'min-h-[44px] px-3 py-2 -mx-2',
        'rounded-md',
        'bg-transparent',
        'hover:bg-terminal-accent/10',
        'active:bg-terminal-accent/20',
        'touch-manipulation',
        'select-none',
        'transition-colors duration-150',
        'text-left',
        'cursor-pointer',
        className
      )}
      style={{ WebkitTapHighlightColor: 'transparent' }}
      aria-label={isDirectory ? `Open folder ${name}` : `View ${name}`}
    >
      <span className="pointer-events-none">{name}</span>
      <span 
        className="text-terminal-muted/60 text-xs ml-1 pointer-events-none"
        aria-hidden="true"
      >
        {isDirectory ? '↵' : '→'}
      </span>
    </button>
  )
}

export default TappableFileItem