/**
 * useDeepLink Hook
 * Parses URL paths to enable shareable links to specific content
 * 
 * Supported URL patterns:
 * - /writings/sample-post → cat writings/sample-post
 * - /projects/my-project → cat projects/my-project
 */

import { useMemo } from 'react'

export interface DeepLinkResult {
  /** Whether a deep link was detected */
  hasDeepLink: boolean
  /** The command to execute (e.g., "cat writings/sample-post") */
  command: string | null
  /** The content type (writings or projects) */
  contentType: 'writings' | 'projects' | null
  /** The content slug */
  slug: string | null
}

/**
 * Parse the current URL path for deep links
 */
export function parseDeepLink(pathname: string): DeepLinkResult {
  // Remove leading slash and any trailing slashes
  const path = pathname.replace(/^\/+|\/+$/g, '')
  
  if (!path) {
    return { hasDeepLink: false, command: null, contentType: null, slug: null }
  }

  // Commands that should execute directly (not cat files)
  const directCommands = ['help', 'projects', 'writings']
  if (directCommands.includes(path)) {
    return {
      hasDeepLink: true,
      command: path,
      contentType: null,
      slug: null,
    }
  }

  // Match patterns: writings/slug or projects/slug → cat writings/slug.md
  const contentMatch = path.match(/^(writings|projects)\/(.+)$/)
  if (contentMatch) {
    const [, contentType, slug] = contentMatch
    return {
      hasDeepLink: true,
      command: `cat ${contentType}/${slug}.md`,
      contentType: contentType as 'writings' | 'projects',
      slug,
    }
  }

  // Single file paths like whoami → cat whoami.md
  // This handles any other path as a potential file
  return {
    hasDeepLink: true,
    command: `cat ${path}.md`,
    contentType: null,
    slug: path,
  }
}

/**
 * Hook to get deep link info from current URL
 */
export function useDeepLink(): DeepLinkResult {
  return useMemo(() => {
    return parseDeepLink(window.location.pathname)
  }, [])
}

/**
 * Clear the deep link from URL without reload
 * Called after the command has been executed
 */
export function clearDeepLinkFromUrl(): void {
  if (window.location.pathname !== '/') {
    window.history.replaceState({}, '', '/')
  }
}
