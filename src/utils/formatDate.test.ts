import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { 
  formatDate, 
  formatRelativeTime, 
  formatDateRange, 
  parseDate, 
  isPastDate 
} from './formatDate'

describe('formatDate', () => {
  it('formats a date string with default options', () => {
    // Use UTC noon to avoid timezone issues
    const result = formatDate('2024-01-15T12:00:00')
    expect(result).toContain('January')
    expect(result).toContain('15')
    expect(result).toContain('2024')
  })

  it('formats a Date object', () => {
    const date = new Date(2024, 5, 20) // June 20, 2024 in local time
    const result = formatDate(date)
    expect(result).toContain('June')
    expect(result).toContain('20')
    expect(result).toContain('2024')
  })

  it('accepts custom options', () => {
    const result = formatDate('2024-01-15T12:00:00', { month: 'short' })
    expect(result).toContain('Jan')
  })

  it('accepts full custom options', () => {
    const result = formatDate('2024-01-15T12:00:00', { 
      year: '2-digit', 
      month: 'numeric', 
      day: 'numeric' 
    })
    expect(result).toMatch(/1\/15\/24|15\/1\/24|24\/1\/15/)
  })
})

describe('formatRelativeTime', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2024-01-15T12:00:00Z'))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('returns "just now" for very recent dates', () => {
    const result = formatRelativeTime('2024-01-15T11:59:30Z')
    expect(result).toBe('just now')
  })

  it('returns minutes ago for recent dates', () => {
    const result = formatRelativeTime('2024-01-15T11:55:00Z')
    expect(result).toBe('5 minutes ago')
  })

  it('returns singular minute', () => {
    const result = formatRelativeTime('2024-01-15T11:59:00Z')
    expect(result).toBe('1 minute ago')
  })

  it('returns hours ago', () => {
    const result = formatRelativeTime('2024-01-15T10:00:00Z')
    expect(result).toBe('2 hours ago')
  })

  it('returns singular hour', () => {
    const result = formatRelativeTime('2024-01-15T11:00:00Z')
    expect(result).toBe('1 hour ago')
  })

  it('returns "yesterday" for one day ago', () => {
    const result = formatRelativeTime('2024-01-14T12:00:00Z')
    expect(result).toBe('yesterday')
  })

  it('returns days ago for recent days', () => {
    const result = formatRelativeTime('2024-01-12T12:00:00Z')
    expect(result).toBe('3 days ago')
  })

  it('returns weeks ago', () => {
    const result = formatRelativeTime('2024-01-01T12:00:00Z')
    expect(result).toBe('2 weeks ago')
  })

  it('returns singular week', () => {
    const result = formatRelativeTime('2024-01-08T12:00:00Z')
    expect(result).toBe('1 week ago')
  })

  it('returns months ago', () => {
    const result = formatRelativeTime('2023-11-15T12:00:00Z')
    expect(result).toBe('2 months ago')
  })

  it('returns years ago', () => {
    const result = formatRelativeTime('2022-01-15T12:00:00Z')
    expect(result).toBe('2 years ago')
  })

  it('returns singular year', () => {
    const result = formatRelativeTime('2023-01-15T12:00:00Z')
    expect(result).toBe('1 year ago')
  })
})

describe('formatDateRange', () => {
  it('formats a range in the same month', () => {
    // Use Date objects with explicit local dates to avoid timezone issues
    const start = new Date(2024, 0, 10) // Jan 10, 2024
    const end = new Date(2024, 0, 15) // Jan 15, 2024
    const result = formatDateRange(start, end)
    expect(result).toBe('Jan 10 - 15, 2024')
  })

  it('formats a range across months in same year', () => {
    const start = new Date(2024, 0, 25) // Jan 25, 2024
    const end = new Date(2024, 1, 5) // Feb 5, 2024
    const result = formatDateRange(start, end)
    expect(result).toBe('Jan 25 - Feb 5, 2024')
  })

  it('formats a range across years', () => {
    const start = new Date(2023, 11, 25) // Dec 25, 2023
    const end = new Date(2024, 0, 5) // Jan 5, 2024
    const result = formatDateRange(start, end)
    expect(result).toBe('Dec 25, 2023 - Jan 5, 2024')
  })

  it('handles open-ended range (no end date)', () => {
    const start = new Date(2024, 0, 10) // Jan 10, 2024
    const result = formatDateRange(start)
    expect(result).toBe('Jan 10, 2024 - Present')
  })

  it('handles Date objects', () => {
    const start = new Date(2024, 2, 1) // Mar 1, 2024
    const end = new Date(2024, 2, 15) // Mar 15, 2024
    const result = formatDateRange(start, end)
    expect(result).toBe('Mar 1 - 15, 2024')
  })
})

describe('parseDate', () => {
  it('parses a valid ISO date string', () => {
    // Use explicit local date constructor to avoid timezone issues
    const result = parseDate('2024-01-15T12:00:00')
    expect(result).toBeInstanceOf(Date)
    expect(result?.getFullYear()).toBe(2024)
    expect(result?.getMonth()).toBe(0) // January
    expect(result?.getDate()).toBe(15)
  })

  it('parses a full ISO datetime string', () => {
    const result = parseDate('2024-01-15T10:30:00Z')
    expect(result).toBeInstanceOf(Date)
  })

  it('returns null for invalid date string', () => {
    expect(parseDate('not-a-date')).toBeNull()
    expect(parseDate('')).toBeNull()
    expect(parseDate('invalid')).toBeNull()
  })
})

describe('isPastDate', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2024-01-15T12:00:00Z'))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('returns true for past dates', () => {
    expect(isPastDate('2024-01-14')).toBe(true)
    expect(isPastDate('2023-01-15')).toBe(true)
  })

  it('returns false for future dates', () => {
    expect(isPastDate('2024-01-16')).toBe(false)
    expect(isPastDate('2025-01-15')).toBe(false)
  })

  it('handles Date objects', () => {
    expect(isPastDate(new Date('2024-01-14'))).toBe(true)
    expect(isPastDate(new Date('2024-01-16'))).toBe(false)
  })
})
