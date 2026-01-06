import { useState } from 'react'
import type { CareerEntry } from '../../../types/About.types'

export interface CareerTimelineEntryProps {
  /** Career entry data */
  entry: CareerEntry
}

/**
 * Format date string from YYYY-MM to "Month YYYY"
 */
function formatDate(dateStr: string): string {
  const [year, month] = dateStr.split('-')
  const date = new Date(parseInt(year), parseInt(month) - 1)
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
}

/**
 * CareerTimelineEntry
 * Individual entry in the career timeline with hover/tap emphasis effect
 */
export function CareerTimelineEntry({ entry }: CareerTimelineEntryProps) {
  const [isHovered, setIsHovered] = useState(false)

  const isEducation = entry.type === 'education'
  const isCurrent = !entry.endDate
  const dateRange = isCurrent
    ? `${formatDate(entry.startDate)} - Current`
    : `${formatDate(entry.startDate)} - ${formatDate(entry.endDate!)}`

  return (
    <div
      className="relative flex items-center"
      data-testid="career-timeline-entry"
      data-type={entry.type}
    >
      {/* Timeline Connector Dot */}
      <div
        className={`
          absolute left-4 -translate-x-1/2
          w-4 h-4 rounded-full border-2
          ${isEducation ? 'bg-terminal-secondary border-terminal-secondary' : 'bg-terminal-accent border-terminal-accent'}
          ${isHovered ? 'scale-125' : ''}
          transition-transform duration-300
        `}
        aria-hidden="true"
      />

      {/* Entry Card */}
      <div
        className={`
          w-full p-4 ml-10
          bg-terminal-bg-secondary border rounded-lg
          transition-all duration-300 ease-in-out
          ${isHovered ? 'border-terminal-accent scale-[1.01] shadow-lg shadow-terminal-accent/20' : 'border-terminal-border'}
        `}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => setIsHovered(!isHovered)}
        role="article"
        aria-label={`${entry.role} at ${entry.organization}`}
      >
        {/* Header with Logo */}
        <div className="flex items-center gap-3 mb-3">
          <img
            src={entry.logo}
            alt={`${entry.organization} logo`}
            className="w-10 h-10 rounded object-contain bg-white p-1"
            loading="lazy"
          />
          <div>
            <h3 className="font-bold text-terminal-text text-lg leading-tight">
              {entry.role}
            </h3>
            <p className={`text-sm ${isEducation ? 'text-terminal-secondary' : 'text-terminal-accent'}`}>
              {entry.organization}
            </p>
          </div>
        </div>

        {/* Date and Location */}
        <div className="flex flex-wrap items-center gap-2 text-xs text-terminal-muted mb-2">
          <span>{dateRange}</span>
          {isCurrent && (
            <span className="px-1.5 py-0.5 bg-terminal-accent/20 text-terminal-accent rounded text-[10px] font-semibold">
              CURRENT
            </span>
          )}
          <span>•</span>
          <span>{entry.location}</span>
        </div>

        {/* Description */}
        <p className="text-sm text-terminal-text-secondary mb-3">
          {entry.description}
        </p>

        {/* Highlights */}
        <ul className="space-y-1">
          {entry.highlights.map((highlight, idx) => (
            <li
              key={idx}
              className="text-xs text-terminal-muted flex items-start gap-2"
            >
              <span className={isEducation ? 'text-terminal-secondary' : 'text-terminal-accent'}>
                {isEducation ? '◆' : '▸'}
              </span>
              <span>{highlight}</span>
            </li>
          ))}
        </ul>

        {/* Tags */}
        {entry.tags && entry.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-terminal-border">
            {entry.tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 text-xs bg-terminal-accent/10 text-terminal-accent rounded-full font-medium"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
