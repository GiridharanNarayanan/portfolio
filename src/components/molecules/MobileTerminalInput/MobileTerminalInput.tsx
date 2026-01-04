/**
 * MobileTerminalInput Component
 * Expandable input field for mobile terminal
 */

import { useState, useRef, useEffect, useCallback } from 'react'
import { cn } from '../../../utils/cn'
import { getAutocompleteSuggestions } from '../../../utils/autocomplete'

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
  const [ghostText, setGhostText] = useState('')
  const [swipeProgress, setSwipeProgress] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const touchStartX = useRef<number | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

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
      setGhostText('')
      setIsExpanded(false)
    }
  }

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setValue(newValue)
    
    // Update ghost text with autocomplete suggestion
    if (newValue.trim()) {
      const result = getAutocompleteSuggestions(newValue)
      setGhostText(result.ghostText || '')
    } else {
      setGhostText('')
    }
  }, [])

  const handleAcceptGhost = useCallback(() => {
    if (ghostText && value.trim()) {
      const result = getAutocompleteSuggestions(value)
      if (result.value !== value) {
        setValue(result.value)
        setGhostText('')
        setSwipeProgress(0)
      }
    }
  }, [ghostText, value])

  // Swipe gesture handlers
  const SWIPE_THRESHOLD = 60 // pixels needed to trigger accept

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (ghostText) {
      touchStartX.current = e.touches[0].clientX
    }
  }, [ghostText])

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (touchStartX.current !== null && ghostText) {
      const deltaX = e.touches[0].clientX - touchStartX.current
      // Only track right swipes
      if (deltaX > 0) {
        setSwipeProgress(Math.min(deltaX / SWIPE_THRESHOLD, 1))
      } else {
        setSwipeProgress(0)
      }
    }
  }, [ghostText])

  const handleTouchEnd = useCallback(() => {
    if (swipeProgress >= 1) {
      handleAcceptGhost()
    }
    touchStartX.current = null
    setSwipeProgress(0)
  }, [swipeProgress, handleAcceptGhost])

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
      <div 
        ref={containerRef}
        className="flex items-center gap-2 bg-terminal-bg-secondary border border-terminal-accent rounded-lg overflow-hidden relative"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Swipe progress indicator */}
        {swipeProgress > 0 && (
          <div 
            className="absolute inset-0 bg-terminal-accent/20 pointer-events-none transition-none"
            style={{ 
              width: `${swipeProgress * 100}%`,
              opacity: swipeProgress
            }}
          />
        )}
        <span className="pl-4 text-terminal-accent font-mono relative z-10">$</span>
        <div className="flex-1 relative z-10">
          {/* Ghost text overlay */}
          <div 
            className="absolute inset-0 flex items-center pointer-events-none font-mono text-base whitespace-pre py-3 pr-2"
            aria-hidden="true"
          >
            <span style={{ color: 'transparent' }}>{value}</span>
            {ghostText && (
              <span className="text-terminal-muted/50">
                {ghostText}
              </span>
            )}
          </div>
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder={placeholder}
            autoComplete="off"
            autoCapitalize="off"
            autoCorrect="off"
            spellCheck={false}
            className={cn(
              'w-full',
              'min-h-[44px]',
              'py-3 pr-2',
              'font-mono text-base', // 16px prevents iOS auto-zoom on focus
              'text-terminal-text',
              'bg-transparent',
              'outline-none',
              'placeholder:text-terminal-muted/50'
            )}
          />
        </div>
        {/* Swipe hint - shows when there's ghost text */}
        {ghostText && swipeProgress === 0 && (
          <span className="px-2 font-mono text-xs text-terminal-muted/50 animate-pulse relative z-10">
            swipe →
          </span>
        )}
        <button
          type="submit"
          disabled={!value.trim()}
          className={cn(
            'px-4 py-3 relative z-10',
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
