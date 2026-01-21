/**
 * useDeepLink Hook
 * Parses URL paths to enable shareable links to specific content
 * 
 * Supported URL patterns:
 * - /writings/heads-up → cat writings/heads-up
 * - /projects/my-project → cat projects/my-project
 * - /about → about page
 */

import { useMemo } from 'react'
import type { CommandResult, CommandContext } from '../types/Command.types'

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
 * Also checks for ?deeplink= query param (used by OG static pages)
 */
export function parseDeepLink(pathname: string): DeepLinkResult {
  // Check for deeplink query parameter first (from OG static page redirects)
  const urlParams = new URLSearchParams(window.location.search)
  const deeplinkParam = urlParams.get('deeplink')
  if (deeplinkParam) {
    // Clean the URL by removing the query param
    window.history.replaceState({}, '', deeplinkParam)
    return parseDeepLink(deeplinkParam)
  }

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

/**
 * Update the URL based on command result and context
 * This enables shareable URLs as users navigate
 * 
 * @param input - The command that was executed
 * @param result - The result of the command execution
 * @param context - The terminal context AFTER command execution (includes updated currentPath)
 */
export function updateUrlFromCommand(
  input: string, 
  result: CommandResult, 
  context: CommandContext
): void {
  // Don't update URL for failed commands
  if (!result.success) {
    return
  }

  const trimmedInput = input.trim().toLowerCase()
  let newPath = '/'

  // Normalize current path (remove leading/trailing slashes, handle ~)
  const currentDir = context.currentPath
    .replace(/^[~/]+|\/+$/g, '')
    .replace(/^\/+/, '')

  // Handle 'cat' commands for content viewing
  const catMatch = trimmedInput.match(/^cat\s+(.+?)(\.md)?$/i)
  if (catMatch) {
    const filePath = catMatch[1]
    
    // Check if it's an absolute path (contains directory)
    if (filePath.includes('/')) {
      // Absolute path like "writings/heads-up"
      const parts = filePath.split('/')
      if (parts[0] === 'writings' || parts[0] === 'projects') {
        newPath = `/${parts[0]}/${parts.slice(1).join('/')}`
      } else {
        newPath = `/${filePath}`
      }
    } else if (filePath === 'whoami') {
      // Special case for whoami
      newPath = '/whoami'
    } else if (currentDir === 'writings' || currentDir === 'projects') {
      // Relative path within a directory - combine with current dir
      newPath = `/${currentDir}/${filePath}`
    } else {
      // File in root directory
      newPath = `/${filePath}`
    }
  }
  // Handle direct navigation commands (whoami, about)
  else if (trimmedInput === 'about' || trimmedInput === 'whoami') {
    newPath = '/whoami'
  }
  // Handle directory listing commands
  else if (trimmedInput === 'writings' || trimmedInput === 'ls writings') {
    newPath = '/writings'
  }
  else if (trimmedInput === 'projects' || trimmedInput === 'ls projects') {
    newPath = '/projects'
  }
  // Handle ls command - use current directory from context
  else if (trimmedInput === 'ls' || trimmedInput === 'ls .') {
    if (currentDir === 'writings' || currentDir === 'projects') {
      newPath = `/${currentDir}`
    } else {
      newPath = '/'
    }
  }
  // Handle navigation to home
  else if (trimmedInput === 'cd ~' || trimmedInput === 'cd' || trimmedInput === 'home' || trimmedInput === 'clear') {
    newPath = '/'
  }
  // Handle cd commands - derive from updated context
  else if (trimmedInput.startsWith('cd ')) {
    if (currentDir === 'writings' || currentDir === 'projects') {
      newPath = `/${currentDir}`
    } else {
      newPath = '/'
    }
  }

  // Only update if path changed
  if (window.location.pathname !== newPath) {
    window.history.pushState({}, '', newPath)
  }
}

/**
 * Get command from URL path for browser back/forward navigation
 */
export function getCommandFromPath(pathname: string): string | null {
  const result = parseDeepLink(pathname)
  return result.hasDeepLink ? result.command : null
}
