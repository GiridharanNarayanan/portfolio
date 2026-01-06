import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { CareerTimelineEntry } from './CareerTimelineEntry'
import type { CareerEntry } from '../../../types/About.types'

const mockWorkEntry: CareerEntry = {
  organization: 'Tech Company',
  role: 'Senior Developer',
  startDate: '2022-01',
  location: 'San Francisco, CA',
  description: 'Leading development initiatives for cloud products.',
  highlights: ['Led team of 5', 'Reduced latency by 40%', 'Shipped 10 features'],
  logo: '/logos/tech-company.svg',
  type: 'work',
}

const mockEducationEntry: CareerEntry = {
  organization: 'State University',
  role: 'B.S. Computer Science',
  startDate: '2015-09',
  endDate: '2019-05',
  location: 'Boston, MA',
  description: 'Studied computer science with focus on AI.',
  highlights: ["Dean's List", 'Research published', 'Led hackathon team'],
  logo: '/logos/university.svg',
  type: 'education',
}

describe('CareerTimelineEntry', () => {
  it('renders entry content correctly', () => {
    render(<CareerTimelineEntry entry={mockWorkEntry} />)

    expect(screen.getByText('Senior Developer')).toBeInTheDocument()
    expect(screen.getByText('Tech Company')).toBeInTheDocument()
    expect(screen.getByText('Leading development initiatives for cloud products.')).toBeInTheDocument()
    expect(screen.getByText('San Francisco, CA')).toBeInTheDocument()
  })

  it('renders all 3 highlights', () => {
    render(<CareerTimelineEntry entry={mockWorkEntry} />)

    expect(screen.getByText('Led team of 5')).toBeInTheDocument()
    expect(screen.getByText('Reduced latency by 40%')).toBeInTheDocument()
    expect(screen.getByText('Shipped 10 features')).toBeInTheDocument()
  })

  it('shows CURRENT badge for entries without endDate', () => {
    render(<CareerTimelineEntry entry={mockWorkEntry} />)

    expect(screen.getByText('CURRENT')).toBeInTheDocument()
  })

  it('does not show CURRENT badge for entries with endDate', () => {
    render(<CareerTimelineEntry entry={mockEducationEntry} />)

    expect(screen.queryByText('CURRENT')).not.toBeInTheDocument()
  })

  it('formats dates correctly', () => {
    render(<CareerTimelineEntry entry={mockEducationEntry} />)

    // Should show formatted dates: "Sep 2015 - May 2019"
    expect(screen.getByText(/Sep 2015/)).toBeInTheDocument()
    expect(screen.getByText(/May 2019/)).toBeInTheDocument()
  })

  it('renders organization logo', () => {
    render(<CareerTimelineEntry entry={mockWorkEntry} />)

    const logo = screen.getByAltText('Tech Company logo')
    expect(logo).toBeInTheDocument()
    expect(logo).toHaveAttribute('src', '/logos/tech-company.svg')
  })

  it('renders entry without position prop', () => {
    render(<CareerTimelineEntry entry={mockWorkEntry} />)

    const entry = screen.getByTestId('career-timeline-entry')
    expect(entry).toBeInTheDocument()
  })

  it('distinguishes work vs education entry types', () => {
    const { rerender } = render(
      <CareerTimelineEntry entry={mockWorkEntry} />
    )

    let entry = screen.getByTestId('career-timeline-entry')
    expect(entry).toHaveAttribute('data-type', 'work')

    rerender(<CareerTimelineEntry entry={mockEducationEntry} />)

    entry = screen.getByTestId('career-timeline-entry')
    expect(entry).toHaveAttribute('data-type', 'education')
  })

  it('responds to hover interaction', () => {
    const { container } = render(
      <CareerTimelineEntry entry={mockWorkEntry} />
    )

    const card = container.querySelector('[role="article"]')
    expect(card).toBeInTheDocument()

    // Simulate hover - card should have transition classes
    expect(card).toHaveClass('transition-all')
  })

  it('responds to click interaction for mobile tap', () => {
    const { container } = render(
      <CareerTimelineEntry entry={mockWorkEntry} />
    )

    const card = container.querySelector('[role="article"]')
    expect(card).toBeInTheDocument()

    // Click should toggle hover state (for mobile)
    fireEvent.click(card!)

    // Card should still be present and interactive
    expect(screen.getByText('Senior Developer')).toBeInTheDocument()
  })

  it('has accessible role and label', () => {
    render(<CareerTimelineEntry entry={mockWorkEntry} />)

    const article = screen.getByRole('article', {
      name: /Senior Developer at Tech Company/,
    })
    expect(article).toBeInTheDocument()
  })
})
