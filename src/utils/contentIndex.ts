/**
 * Content Index Utilities
 * Maps numeric indexes to content slugs for easy command access
 */

import matter from 'gray-matter';
import type { ContentType } from '../types/Content.types';
import { isPreviewMode } from './previewMode';

// Eagerly load all content modules
const writingsModules = import.meta.glob('../content/writings/*.md', { eager: true, query: '?raw', import: 'default' }) as Record<string, string>;
const projectsModules = import.meta.glob('../content/projects/*.md', { eager: true, query: '?raw', import: 'default' }) as Record<string, string>;

interface ContentIndexItem {
  slug: string;
  title: string;
  date: string;
  type: ContentType;
}

/**
 * Extract slug from file path
 */
function extractSlug(path: string): string {
  const filename = path.split('/').pop() || '';
  return filename.replace(/\.md$/, '');
}

/**
 * Parse content for index
 */
function parseForIndex(rawContent: string, path: string, type: ContentType, preview: boolean): ContentIndexItem | null {
  try {
    const { data } = matter(rawContent);
    if (data.published === false && !preview) return null;
    
    return {
      slug: extractSlug(path),
      title: data.title || extractSlug(path),
      date: data.date || new Date().toISOString(),
      type,
    };
  } catch {
    return null;
  }
}

/**
 * Get sorted content index for a type
 * Returns items sorted by date descending with 1-based index
 */
export function getContentIndex(type: ContentType): ContentIndexItem[] {
  const modules = type === 'writings' ? writingsModules : projectsModules;
  const preview = isPreviewMode();
  
  const items = Object.entries(modules)
    .map(([path, content]) => parseForIndex(content, path, type, preview))
    .filter((item): item is ContentIndexItem => item !== null)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  return items;
}

/**
 * Get slug by numeric index (1-based)
 * Returns null if index is out of range
 */
export function getSlugByIndex(type: ContentType, index: number): string | null {
  const items = getContentIndex(type);
  const idx = index - 1; // Convert to 0-based
  
  if (idx < 0 || idx >= items.length) {
    return null;
  }
  
  return items[idx].slug;
}

/**
 * Check if a string is a numeric index (positive integer)
 */
export function isNumericIndex(str: string): boolean {
  return /^\d+$/.test(str) && parseInt(str, 10) > 0;
}

/**
 * Resolve an identifier to a slug
 * If numeric, looks up by index; otherwise returns as-is (slug)
 */
export function resolveToSlug(identifier: string): { slug: string; type: ContentType } | null {
  if (isNumericIndex(identifier)) {
    const index = parseInt(identifier, 10);
    
    // Try writings first
    const writingsSlug = getSlugByIndex('writings', index);
    if (writingsSlug) {
      return { slug: writingsSlug, type: 'writings' };
    }
    
    // Try projects
    const projectsSlug = getSlugByIndex('projects', index);
    if (projectsSlug) {
      return { slug: projectsSlug, type: 'projects' };
    }
    
    return null;
  }
  
  // Not a number - it's a slug, need to determine type
  const writingsIndex = getContentIndex('writings');
  if (writingsIndex.some(item => item.slug === identifier)) {
    return { slug: identifier, type: 'writings' };
  }
  
  const projectsIndex = getContentIndex('projects');
  if (projectsIndex.some(item => item.slug === identifier)) {
    return { slug: identifier, type: 'projects' };
  }
  
  return null;
}
