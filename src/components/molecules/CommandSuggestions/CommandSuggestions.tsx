/**
 * CommandSuggestions Component
 * Autocomplete dropdown for command suggestions
 */

import { cn } from '../../../utils/cn'

export interface CommandSuggestionsProps {
  /** List of suggestions */
  suggestions: string[]
  /** Currently selected index */
  selectedIndex?: number
  /** Callback when suggestion is selected */
  onSelect: (suggestion: string) => void
  /** Whether suggestions are visible */
  visible?: boolean
  /** Custom class name */
  className?: string
}

/**
 * Command autocomplete suggestions dropdown
 */
export function CommandSuggestions({
  suggestions,
  selectedIndex = -1,
  onSelect,
  visible = true,
  className,
}: CommandSuggestionsProps) {
  if (!visible || suggestions.length === 0) {
    return null
  }

  return (
    <div
      className={cn(
        'absolute bottom-full left-0 mb-1 w-full max-w-xs',
        'rounded border font-mono text-sm',
        'shadow-lg',
        className
      )}
      style={{
        backgroundColor: 'var(--color-bg-secondary)',
        borderColor: 'var(--color-border)',
      }}
      role="listbox"
      aria-label="Command suggestions"
    >
      {suggestions.map((suggestion, index) => (
        <button
          key={suggestion}
          onClick={() => onSelect(suggestion)}
          className={cn(
            'w-full px-3 py-2 text-left',
            'transition-colors',
            'hover:bg-opacity-80',
            index === selectedIndex && 'bg-opacity-90'
          )}
          style={{
            backgroundColor:
              index === selectedIndex
                ? 'var(--color-bg-card)'
                : 'transparent',
            color: 'var(--color-text)',
          }}
          role="option"
          aria-selected={index === selectedIndex}
        >
          <span style={{ color: 'var(--color-accent)' }}>{suggestion}</span>
        </button>
      ))}
    </div>
  )
}
