/**
 * Parse Markdown Utility
 * Wrapper for gray-matter frontmatter parsing
 */

import matter from 'gray-matter'
import type { BaseContentMeta, ParsedContent } from '../types/Content.types'

/**
 * Parse a markdown file with frontmatter
 * 
 * @param content - Raw markdown content with frontmatter
 * @param filePath - Path to the file (for reference)
 * @returns Parsed content with typed frontmatter and body
 * 
 * @example
 * const result = parseMarkdown<WritingMeta>(fileContent, 'writings/my-post.md')
 * // { meta: { title: '...', date: '...' }, content: '...', filePath: '...' }
 */
export function parseMarkdown<T extends BaseContentMeta>(
  content: string,
  filePath: string
): ParsedContent<T> {
  const { data, content: body } = matter(content)
  
  return {
    meta: data as T,
    content: body,
    filePath,
  }
}

/**
 * Extract frontmatter only (without parsing body)
 * Useful for listing/previewing content
 * 
 * @param content - Raw markdown content with frontmatter
 * @returns Parsed frontmatter data
 */
export function extractFrontmatter<T extends BaseContentMeta>(
  content: string
): T {
  const { data } = matter(content)
  return data as T
}

/**
 * Check if content has valid frontmatter
 * 
 * @param content - Raw markdown content
 * @returns Whether content has frontmatter section
 */
export function hasFrontmatter(content: string): boolean {
  return content.trimStart().startsWith('---')
}

/**
 * Validate required frontmatter fields
 * 
 * @param meta - Parsed frontmatter data
 * @param requiredFields - List of required field names
 * @returns Object with isValid flag and missing fields
 */
export function validateFrontmatter<T extends BaseContentMeta>(
  meta: T,
  requiredFields: (keyof T)[] = ['title', 'date', 'slug'] as (keyof T)[]
): { isValid: boolean; missingFields: string[] } {
  const missingFields: string[] = []
  
  for (const field of requiredFields) {
    if (meta[field] === undefined || meta[field] === null || meta[field] === '') {
      missingFields.push(String(field))
    }
  }

  return {
    isValid: missingFields.length === 0,
    missingFields,
  }
}
