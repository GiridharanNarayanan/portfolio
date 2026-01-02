import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import { CareerTimeline } from './CareerTimeline'
import type { CareerEntry } from '../../../types/About.types'

const mockEntries: CareerEntry[] = [
  {
    organization: 'Company A',
    role: 'Senior Developer',
    startDate: '2022-01',
    location: 'San Francisco, CA',
    description: 'Leading development initiatives',
    highlights: ['Highlight A1', 'Highlight A2', 'Highlight A3'],
    logo: '/logos/company-a.svg',
    type: 'work',
  },
  {
    organization: 'University B',
    role: 'B.S. Computer Science',
    startDate: '2015-09',
    endDate: '2019-05',
    location: 'Boston, MA',
    description: 'Studied computer science',
    highlights: ['Highlight B1', 'Highlight B2', 'Highlight B3'],
    logo: '/logos/university-b.svg',
    type: 'education',
  },
  {
    organization: 'Company C',
    role: 'Junior Developer',
    startDate: '2019-06',
    endDate: '2021-12',
    location: 'Seattle, WA',
    description: 'Started my career',
    highlights: ['Highlight C1', 'Highlight C2', 'Highlight C3'],
    logo: '/logos/company-c.svg',
    type: 'work',
  },
]

describe('CareerTimeline', () => {
  it('renders all entries', () => {
    render(<CareerTimeline entries={mockEntries} />)

    expect(screen.getByTestId('career-timeline')).toBeInTheDocument()

    const entries = screen.getAllByTestId('career-timeline-entry')
    expect(entries).toHaveLength(3)
  })

  it('renders entries in reverse chronological order', () => {
    render(<CareerTimeline entries={mockEntries} />)

    const entries = screen.getAllByTestId('career-timeline-entry')

    // First entry should be the most recent (2022-01)
    expect(within(entries[0]).getByText('Senior Developer')).toBeInTheDocument()
    
    // Second entry should be 2019-06
    expect(within(entries[1]).getByText('Junior Developer')).toBeInTheDocument()
    
    // Third entry should be the oldest (2015-09)
    expect(within(entries[2]).getByText('B.S. Computer Science')).toBeInTheDocument()
  })

  it('applies different styling for education vs work entries', () => {
    render(<CareerTimeline entries={mockEntries} />)

    const entries = screen.getAllByTestId('career-timeline-entry')

    // Work entries should have type="work"
    const workEntries = entries.filter(e => e.getAttribute('data-type') === 'work')
    expect(workEntries).toHaveLength(2)

    // Education entry should have type="education"
    const educationEntries = entries.filter(e => e.getAttribute('data-type') === 'education')
    expect(educationEntries).toHaveLength(1)
  })

  it('alternates entry positions (left/right)', () => {
    render(<CareerTimeline entries={mockEntries} />)

    const entries = screen.getAllByTestId('career-timeline-entry')

    expect(entries[0]).toHaveAttribute('data-position', 'left')
    expect(entries[1]).toHaveAttribute('data-position', 'right')
    expect(entries[2]).toHaveAttribute('data-position', 'left')
  })

  it('renders empty state message when no entries', () => {
    render(<CareerTimeline entries={[]} />)

    expect(screen.getByText('No career entries available.')).toBeInTheDocument()
    expect(screen.queryByTestId('career-timeline')).not.toBeInTheDocument()
  })

  it('renders center timeline line', () => {
    render(<CareerTimeline entries={mockEntries} />)

    const timeline = screen.getByTestId('career-timeline')
    // Check for vertical line (div with specific classes)
    const verticalLine = timeline.querySelector('.w-0\\.5')
    expect(verticalLine).toBeInTheDocument()
  })
})
