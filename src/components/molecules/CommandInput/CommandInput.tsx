/**
 * CommandInput Component
 * Terminal-styled input with history navigation, cursor, and autocomplete
 */

import { useState, useCallback, useRef, useEffect, type KeyboardEvent, type ChangeEvent } from 'react'
import { cn } from '../../../utils/cn'
import { CommandPrompt } from '../../atoms/CommandPrompt'
import { Cursor } from '../../atoms/Cursor'
import { getAutocompleteSuggestions } from '../../../utils/autocomplete'

export interface CommandInputProps {
  /** Callback when command is submitted */
  onSubmit: (command: string) => void
  /** Navigate up in history */
  onHistoryUp?: () => string | null
  /** Navigate down in history */
  onHistoryDown?: () => string | null
  /** Current directory path */
  currentPath?: string
  /** Whether input is disabled */
  disabled?: boolean
  /** Placeholder text */
  placeholder?: string
  /** Auto-focus on mount */
  autoFocus?: boolean
  /** Custom class name */
  className?: string
}

/**
 * Terminal command input with history navigation
 */
export function CommandInput({
  onSubmit,
  onHistoryUp,
  onHistoryDown,
  currentPath = '~',
  disabled = false,
  placeholder = 'Type "ls" to explore or "help" for commands...',
  autoFocus = true,
  className,
}: CommandInputProps) {
  const [value, setValue] = useState('')
  const [isFocused, setIsFocused] = useState(false)
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [ghostText, setGhostText] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  // Auto-focus on mount
  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus()
    }
  }, [autoFocus])

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      switch (e.key) {
        case 'Tab':
          e.preventDefault()
          if (value.trim()) {
            const result = getAutocompleteSuggestions(value)
            if (result.value !== value) {
              setValue(result.value)
              setGhostText('')
            }
            // Show suggestions if multiple matches
            if (result.suggestions.length > 1) {
              setSuggestions(result.suggestions)
            } else {
              setSuggestions([])
            }
          }
          break

        case 'Enter':
          if (value.trim()) {
            onSubmit(value.trim())
            setValue('')
            setSuggestions([])
            setGhostText('')
          }
          break

        case 'ArrowUp':
          e.preventDefault()
          if (onHistoryUp) {
            const historyValue = onHistoryUp()
            if (historyValue !== null) {
              setValue(historyValue)
              setSuggestions([])
            }
          }
          break

        case 'ArrowDown':
          e.preventDefault()
          if (onHistoryDown) {
            const historyValue = onHistoryDown()
            if (historyValue !== null) {
              setValue(historyValue)
              setSuggestions([])
            }
          }
          break

        case 'Escape':
          setValue('')
          setSuggestions([])
          setGhostText('')
          break
          
        default:
          // Clear suggestions on any other key
          if (suggestions.length > 0) {
            setSuggestions([])
          }
      }
    },
    [value, onSubmit, onHistoryUp, onHistoryDown, suggestions.length]
  )

  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setValue(newValue)
    
    // Update ghost text with autocomplete suggestion
    if (newValue.trim()) {
      const result = getAutocompleteSuggestions(newValue)
      
      // Use the ghost text directly from autocomplete result
      setGhostText(result.ghostText || '')
      
      // Clear suggestions dropdown (only show on Tab press)
      setSuggestions([])
    } else {
      setGhostText('')
      setSuggestions([])
    }
  }, [])

  return (
    <div className={cn('font-mono', className)}>
      {/* Autocomplete suggestions */}
      {suggestions.length > 0 && (
        <div 
          className="px-4 py-2 text-sm border-b"
          style={{ 
            backgroundColor: 'var(--color-bg-secondary)',
            borderColor: 'var(--color-border)',
            color: 'var(--color-text-muted)'
          }}
        >
          <span className="text-terminal-accent mr-2">Matches:</span>
          {suggestions.map((s, i) => (
            <span key={s}>
              <span className={s.endsWith('/') ? 'text-terminal-accent' : 'text-terminal-text'}>
                {s}
              </span>
              {i < suggestions.length - 1 && <span className="mx-2">|</span>}
            </span>
          ))}
        </div>
      )}
      
      {/* Input row */}
      <div
        className={cn(
          'flex items-center gap-2',
          'py-2 px-4',
          'transition-colors',
        )}
        style={{ backgroundColor: 'var(--color-bg-secondary)' }}
      >
        <CommandPrompt prompt={`${currentPath} $ >`} isActive={isFocused} />
        
        <div className="flex-1 flex items-center relative">
          {/* Ghost text overlay */}
          <div 
            className="absolute inset-0 flex items-center pointer-events-none font-mono whitespace-pre"
            aria-hidden="true"
          >
            <span style={{ color: 'transparent' }}>{value}</span>
            {ghostText && (
              <span 
                style={{ color: 'var(--color-text-muted)', opacity: 0.5 }}
              >
                {ghostText}
                <span className="text-xs ml-1" style={{ opacity: 0.7 }}>[Tab]</span>
              </span>
            )}
          </div>
          
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            disabled={disabled}
            placeholder={placeholder}
            className={cn(
              'flex-1 bg-transparent outline-none font-mono relative z-10',
              'placeholder:opacity-50'
            )}
            style={{ color: 'var(--color-text)' }}
            aria-label="Command input"
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck={false}
          />
          <Cursor visible={isFocused && !disabled} />
        </div>
      </div>
    </div>
  )
}
