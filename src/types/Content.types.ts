/**
 * Content Types
 * Defines frontmatter structures for markdown content files
 */

/**
 * Base frontmatter fields shared by all content types
 */
export interface BaseContentMeta {
  /** Content title */
  title: string
  /** Publication/creation date (ISO string) */
  date: string
  /** Short excerpt/summary */
  excerpt: string
  /** URL-friendly identifier */
  slug: string
  /** Whether content is published */
  published?: boolean
  /** Featured image URL */
  featuredImage?: string
  /** Tags for categorization */
  tags?: string[]
}

/**
 * Writing/blog post frontmatter
 */
export interface WritingMeta extends BaseContentMeta {
  /** Reading time in minutes */
  readingTime?: number
  /** Category (tech, personal, etc.) */
  category?: string
}

/**
 * Project frontmatter
 */
export interface ProjectMeta extends BaseContentMeta {
  /** Technologies/stack used */
  techStack: string[]
  /** Live demo URL */
  demoUrl?: string
  /** Source repository URL */
  repoUrl?: string
  /** Project status */
  status: 'completed' | 'in-progress' | 'archived'
  /** Role in the project */
  role?: string
}

/**
 * Status frontmatter for SpyOnHim easter egg
 */
export interface StatusMeta {
  /** Current activity */
  currentActivity: string
  /** Current location (general) */
  location: string
  /** Current mood/state */
  mood: string
  /** What I'm working on */
  workingOn: string
  /** What I'm reading/watching/playing */
  consuming?: string
  /** Last updated timestamp */
  lastUpdated: string
}

/**
 * Parsed content with frontmatter and body
 */
export interface ParsedContent<T extends BaseContentMeta> {
  /** Parsed frontmatter data */
  meta: T
  /** Raw markdown body */
  content: string
  /** File path for reference */
  filePath: string
}

/**
 * Content collection (all items of a type)
 */
export interface ContentCollection<T extends BaseContentMeta> {
  /** All content items */
  items: ParsedContent<T>[]
  /** Total count */
  count: number
}

/**
 * Content type categories
 */
export type ContentType = 'writings' | 'projects'

/**
 * Unified content frontmatter for parsing
 */
export interface ContentFrontmatter {
  title?: string
  date?: string
  excerpt?: string
  slug?: string
  published?: boolean
  featuredImage?: string
  readTime?: string
  tags?: string[]
  techStack?: string[]
  location?: string
  links?: {
    demo?: string
    repo?: string
  }
  gallery?: string[]
}

/**
 * Unified content item used by hooks and components
 */
export interface ContentItem {
  slug: string
  type: ContentType
  title: string
  date: string
  excerpt: string
  content: string
  featuredImage?: string
  readTime?: string
  tags?: string[]
  techStack?: string[]
  links?: {
    demo?: string
    repo?: string
  }
  location?: string
  gallery?: string[]
  published: boolean
}
