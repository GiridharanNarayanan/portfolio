/**
 * Date Formatting Utilities
 * Consistent date formatting across the application
 */

/**
 * Format a date string for display
 * 
 * @param dateString - ISO date string or Date object
 * @param options - Intl.DateTimeFormat options
 * @returns Formatted date string
 * 
 * @example
 * formatDate('2024-01-15') // 'January 15, 2024'
 * formatDate('2024-01-15', { month: 'short' }) // 'Jan 15, 2024'
 */
export function formatDate(
  dateString: string | Date,
  options: Intl.DateTimeFormatOptions = {}
): string {
  const date = typeof dateString === 'string' ? new Date(dateString) : dateString
  
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...options,
  }

  return new Intl.DateTimeFormat('en-US', defaultOptions).format(date)
}

/**
 * Format a date as relative time (e.g., "2 days ago")
 * 
 * @param dateString - ISO date string or Date object
 * @returns Relative time string
 * 
 * @example
 * formatRelativeTime('2024-01-13') // '2 days ago' (if today is Jan 15)
 */
export function formatRelativeTime(dateString: string | Date): string {
  const date = typeof dateString === 'string' ? new Date(dateString) : dateString
  const now = new Date()
  const diffInMs = now.getTime() - date.getTime()
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))

  if (diffInDays === 0) {
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60))
    if (diffInHours === 0) {
      const diffInMinutes = Math.floor(diffInMs / (1000 * 60))
      if (diffInMinutes < 1) return 'just now'
      return `${diffInMinutes} minute${diffInMinutes === 1 ? '' : 's'} ago`
    }
    return `${diffInHours} hour${diffInHours === 1 ? '' : 's'} ago`
  }
  
  if (diffInDays === 1) return 'yesterday'
  if (diffInDays < 7) return `${diffInDays} days ago`
  if (diffInDays < 30) {
    const weeks = Math.floor(diffInDays / 7)
    return `${weeks} week${weeks === 1 ? '' : 's'} ago`
  }
  if (diffInDays < 365) {
    const months = Math.floor(diffInDays / 30)
    return `${months} month${months === 1 ? '' : 's'} ago`
  }
  
  const years = Math.floor(diffInDays / 365)
  return `${years} year${years === 1 ? '' : 's'} ago`
}

/**
 * Format a date range (for travel entries)
 * 
 * @param startDate - Start date ISO string
 * @param endDate - End date ISO string (optional)
 * @returns Formatted date range
 * 
 * @example
 * formatDateRange('2024-01-10', '2024-01-15') // 'Jan 10 - 15, 2024'
 * formatDateRange('2024-01-10') // 'Jan 10, 2024 - Present'
 */
export function formatDateRange(
  startDate: string | Date,
  endDate?: string | Date
): string {
  const start = typeof startDate === 'string' ? new Date(startDate) : startDate
  const end = endDate 
    ? (typeof endDate === 'string' ? new Date(endDate) : endDate)
    : null

  const startYear = start.getFullYear()
  const endYear = end?.getFullYear()

  const monthOptions: Intl.DateTimeFormatOptions = { month: 'short' }
  const startMonth = new Intl.DateTimeFormat('en-US', monthOptions).format(start)
  
  if (!end) {
    return `${startMonth} ${start.getDate()}, ${startYear} - Present`
  }

  const endMonth = new Intl.DateTimeFormat('en-US', monthOptions).format(end)

  // Same month and year
  if (startMonth === endMonth && startYear === endYear) {
    return `${startMonth} ${start.getDate()} - ${end.getDate()}, ${startYear}`
  }

  // Same year
  if (startYear === endYear) {
    return `${startMonth} ${start.getDate()} - ${endMonth} ${end.getDate()}, ${startYear}`
  }

  // Different years
  return `${startMonth} ${start.getDate()}, ${startYear} - ${endMonth} ${end.getDate()}, ${endYear}`
}

/**
 * Parse a date string safely
 * 
 * @param dateString - Date string to parse
 * @returns Date object or null if invalid
 */
export function parseDate(dateString: string): Date | null {
  const date = new Date(dateString)
  return isNaN(date.getTime()) ? null : date
}

/**
 * Check if a date is in the past
 * 
 * @param dateString - Date string to check
 * @returns Whether the date is in the past
 */
export function isPastDate(dateString: string | Date): boolean {
  const date = typeof dateString === 'string' ? new Date(dateString) : dateString
  return date.getTime() < Date.now()
}
