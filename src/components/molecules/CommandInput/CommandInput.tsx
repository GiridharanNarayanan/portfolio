/**
 * CommandInput Component
 * Terminal-styled input with history navigation and cursor
 */

import { useState, useCallback, useRef, useEffect, type KeyboardEvent, type ChangeEvent } from 'react'
import { cn } from '../../../utils/cn'
import { CommandPrompt } from '../../atoms/CommandPrompt'
import { Cursor } from '../../atoms/Cursor'

export interface CommandInputProps {
  /** Callback when command is submitted */
  onSubmit: (command: string) => void
  /** Navigate up in history */
  onHistoryUp?: () => string | null
  /** Navigate down in history */
  onHistoryDown?: () => string | null
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
  disabled = false,
  placeholder = 'Type a command...',
  autoFocus = true,
  className,
}: CommandInputProps) {
  const [value, setValue] = useState('')
  const [isFocused, setIsFocused] = useState(false)
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
        case 'Enter':
          if (value.trim()) {
            onSubmit(value.trim())
            setValue('')
          }
          break

        case 'ArrowUp':
          e.preventDefault()
          if (onHistoryUp) {
            const historyValue = onHistoryUp()
            if (historyValue !== null) {
              setValue(historyValue)
            }
          }
          break

        case 'ArrowDown':
          e.preventDefault()
          if (onHistoryDown) {
            const historyValue = onHistoryDown()
            if (historyValue !== null) {
              setValue(historyValue)
            }
          }
          break

        case 'Escape':
          setValue('')
          break
      }
    },
    [value, onSubmit, onHistoryUp, onHistoryDown]
  )

  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value)
  }, [])

  return (
    <div
      className={cn(
        'flex items-center gap-2 font-mono',
        'py-2 px-4',
        'transition-colors',
        className
      )}
      style={{ backgroundColor: 'var(--color-bg-secondary)' }}
    >
      <CommandPrompt isActive={isFocused} />
      
      <div className="flex-1 flex items-center">
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
            'flex-1 bg-transparent outline-none font-mono',
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
  )
}
