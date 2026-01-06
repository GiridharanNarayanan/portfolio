/**
 * About Page Types
 * Defines structures for career timeline and about content
 */

/**
 * Contact link item
 */
export interface ContactLink {
  /** Label for the link (e.g., 'Email', 'GitHub') */
  label: string
  /** URL or mailto link */
  url: string
  /** Icon name or emoji */
  icon?: string
}

/**
 * Career entry for the timeline
 * Represents a job or education position
 */
export interface CareerEntry {
  /** Organization/company name */
  organization: string
  /** Job title or degree */
  role: string
  /** Start date in YYYY-MM format */
  startDate: string
  /** End date in YYYY-MM format, undefined for current positions */
  endDate?: string
  /** Location (city, state/country) */
  location: string
  /** Brief description of the role */
  description: string
  /** Exactly 3 key highlights/achievements */
  highlights: [string, string, string]
  /** Tags for categorizing the role (e.g., 'Developer Productivity') */
  tags?: string[]
  /** Path to organization logo image */
  logo: string
  /** Type of entry for styling differentiation */
  type: 'work' | 'education'
}

/**
 * Complete about page content structure
 */
export interface AboutContent {
  /** Markdown-formatted personal introduction/bio */
  blurb: string
  /** Path to resume PDF (relative to /public) */
  resumeUrl: string
  /** Contact links for reaching out */
  contactLinks: ContactLink[]
  /** Career timeline entries (displayed in reverse chronological order) */
  careerTimeline: CareerEntry[]
}
