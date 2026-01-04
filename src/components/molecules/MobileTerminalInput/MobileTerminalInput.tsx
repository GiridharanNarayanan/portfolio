/**
 * MobileTerminalInput Component
 * Expandable input field for mobile terminal
 */

import { useState, useRef, useEffect } from 'react'
import { cn } from '../../../utils/cn'

export interface MobileTerminalInputProps {
  /** Callback when command is submitted */
  onSubmit: (command: string) => void
  /** Placeholder text */
  placeholder?: string
  /** Custom class name */
  className?: string
}

/**
 * Mobile-optimized terminal input with expand/collapse
 */
export function MobileTerminalInput({
  onSubmit,
  placeholder = 'Type a command...',
  className,
}: MobileTerminalInputProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [value, setValue] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  // Focus input when expanded
  useEffect(() => {
    if (isExpanded && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isExpanded])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (value.trim()) {
      onSubmit(value.trim())
      setValue('')
      setIsExpanded(false)
    }
  }

  const handleBlur = () => {
    // Delay collapse to allow submit to fire
    setTimeout(() => {
      if (!value.trim()) {
        setIsExpanded(false)
      }
    }, 150)
  }

  if (!isExpanded) {
    return (
      <button
        type="button"
        onClick={() => setIsExpanded(true)}
        className={cn(
          'mobile-input-collapsed',
          'w-full min-h-[44px]',
          'flex items-center gap-2',
          'px-4 py-3',
          'font-mono text-sm',
          'text-terminal-muted',
          'bg-terminal-bg-secondary',
          'border border-terminal-border rounded-lg',
          'transition-colors',
          'active:bg-terminal-accent/10',
          className
        )}
      >
        <span className="text-terminal-accent">$</span>
        <span>{placeholder}</span>
        <span className="ml-auto text-xs text-terminal-muted/50">tap to type</span>
      </button>
    )
  }

  return (
    <form 
      onSubmit={handleSubmit}
      className={cn('mobile-input-expanded', className)}
    >
      <div className="flex items-center gap-2 bg-terminal-bg-secondary border border-terminal-accent rounded-lg overflow-hidden">
        <span className="pl-4 text-terminal-accent font-mono">$</span>
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onBlur={handleBlur}
          placeholder={placeholder}
          autoComplete="off"
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck={false}
          className={cn(
            'flex-1',
            'min-h-[44px]',
            'py-3 pr-2',
            'font-mono text-base', // 16px prevents iOS auto-zoom on focus
            'text-terminal-text',
            'bg-transparent',
            'outline-none',
            'placeholder:text-terminal-muted/50'
          )}
        />
        <button
          type="submit"
          disabled={!value.trim()}
          className={cn(
            'px-4 py-3',
            'font-mono text-sm font-bold',
            'transition-colors',
            value.trim()
              ? 'text-terminal-accent hover:bg-terminal-accent/10'
              : 'text-terminal-muted/40 cursor-not-allowed'
          )}
        >
          Run
        </button>
      </div>
    </form>
  )
}

export default MobileTerminalInput
