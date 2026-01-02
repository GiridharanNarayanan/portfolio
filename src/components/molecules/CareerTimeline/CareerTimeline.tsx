import type { CareerEntry } from '../../../types/About.types'
import { CareerTimelineEntry } from './CareerTimelineEntry'

export interface CareerTimelineProps {
  /** Career entries to display */
  entries: CareerEntry[]
}

/**
 * Sort entries by start date in reverse chronological order
 */
function sortByDateDescending(entries: CareerEntry[]): CareerEntry[] {
  return [...entries].sort((a, b) => {
    // Compare start dates in reverse order (most recent first)
    return b.startDate.localeCompare(a.startDate)
  })
}

/**
 * CareerTimeline
 * Vertical alternating (zigzag) timeline of career entries
 */
export function CareerTimeline({ entries }: CareerTimelineProps) {
  const sortedEntries = sortByDateDescending(entries)

  if (entries.length === 0) {
    return (
      <div className="text-terminal-muted text-center py-8">
        No career entries available.
      </div>
    )
  }

  return (
    <div className="relative py-8" data-testid="career-timeline">
      {/* Center vertical line */}
      <div
        className="absolute left-1/2 top-0 bottom-0 w-0.5 -translate-x-1/2 bg-terminal-border"
        aria-hidden="true"
      />

      {/* Timeline entries */}
      <div className="space-y-8">
        {sortedEntries.map((entry, index) => (
          <CareerTimelineEntry
            key={`${entry.organization}-${entry.startDate}`}
            entry={entry}
            position={index % 2 === 0 ? 'left' : 'right'}
          />
        ))}
      </div>

      {/* Timeline start indicator */}
      <div
        className="absolute left-1/2 bottom-0 -translate-x-1/2 w-3 h-3 rounded-full bg-terminal-border"
        aria-hidden="true"
      />
    </div>
  )
}
