import { useState, useEffect, useCallback } from 'react';
import matter from 'gray-matter';
import type { ContentItem, ContentType, ContentFrontmatter } from '../types/Content.types';

// Vite's import.meta.glob for markdown files by category
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const contentModules: Record<ContentType, Record<string, () => Promise<any>>> = {
  writings: import.meta.glob('/src/content/writings/*.md', { query: '?raw', import: 'default' }),
  projects: import.meta.glob('/src/content/projects/*.md', { query: '?raw', import: 'default' }),
  travel: import.meta.glob('/src/content/travel/*.md', { query: '?raw', import: 'default' }),
};

/**
 * Extract slug from file path
 * e.g., '/src/content/writings/my-post.md' -> 'my-post'
 */
function extractSlug(path: string): string {
  const filename = path.split('/').pop() || '';
  return filename.replace(/\.md$/, '');
}

/**
 * Parse markdown file content with frontmatter
 */
function parseMarkdownFile(rawContent: string, slug: string, type: ContentType): ContentItem {
  const { data, content } = matter(rawContent);
  const frontmatter = data as ContentFrontmatter;

  return {
    slug,
    type,
    title: frontmatter.title || slug,
    date: frontmatter.date || new Date().toISOString(),
    excerpt: frontmatter.excerpt || content.slice(0, 150) + '...',
    content,
    featuredImage: frontmatter.featuredImage,
    tags: frontmatter.tags || [],
    techStack: frontmatter.techStack || [],
    links: frontmatter.links,
    location: frontmatter.location,
    gallery: frontmatter.gallery || [],
    published: frontmatter.published !== false, // Default to true
  };
}

interface UseMarkdownContentResult {
  items: ContentItem[];
  loading: boolean;
  error: string | null;
  getBySlug: (slug: string) => ContentItem | undefined;
  refresh: () => void;
}

/**
 * Hook for loading markdown content by category
 */
export function useMarkdownContent(type: ContentType): UseMarkdownContentResult {
  const [items, setItems] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadContent = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const modules = contentModules[type];
      const entries = Object.entries(modules);

      if (entries.length === 0) {
        setItems([]);
        setLoading(false);
        return;
      }

      const loadedItems = await Promise.all(
        entries.map(async ([path, loader]) => {
          try {
            const rawContent = await loader();
            const slug = extractSlug(path);
            return parseMarkdownFile(rawContent, slug, type);
          } catch (err) {
            console.error(`Failed to load ${path}:`, err);
            return null;
          }
        })
      );

      // Filter out failed loads and unpublished items, sort by date descending
      const validItems = loadedItems
        .filter((item): item is ContentItem => item !== null && item.published)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

      setItems(validItems);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load content';
      setError(message);
      console.error(`Error loading ${type} content:`, err);
    } finally {
      setLoading(false);
    }
  }, [type]);

  useEffect(() => {
    loadContent();
  }, [loadContent]);

  const getBySlug = useCallback(
    (slug: string): ContentItem | undefined => {
      return items.find((item) => item.slug === slug);
    },
    [items]
  );

  return {
    items,
    loading,
    error,
    getBySlug,
    refresh: loadContent,
  };
}

/**
 * Hook for loading a single content item by slug
 */
export function useMarkdownItem(type: ContentType, slug: string | null) {
  const { loading, error, getBySlug } = useMarkdownContent(type);
  const item = slug ? getBySlug(slug) : undefined;

  return {
    item,
    loading,
    error,
    found: !!item,
  };
}

export default useMarkdownContent;
