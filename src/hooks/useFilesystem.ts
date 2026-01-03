/**
 * useFilesystem Hook
 * Manages virtual filesystem state and operations
 */

import { useState, useCallback, useMemo } from 'react'
import {
  buildFilesystem,
  resolvePath,
  getNodeAtPath,
  isDirectory,
  listDirectory,
  formatListing,
  generateTree,
  type FileNode,
} from '../utils/filesystem'
import { useMarkdownContent } from './useMarkdownContent'
import { 
  isEasterEggRevealed, 
  trackLsCommand, 
  trackHomeVisit 
} from '../utils/easterEggState'

export interface FilesystemState {
  currentPath: string
  filesystem: FileNode | null
  loading: boolean
}

export function useFilesystem() {
  const [currentPath, setCurrentPath] = useState('~')
  const [easterEggRevealed, setEasterEggRevealed] = useState(isEasterEggRevealed())
  
  // Load content to build filesystem
  const { items: writings, loading: writingsLoading } = useMarkdownContent('writings')
  const { items: projects, loading: projectsLoading } = useMarkdownContent('projects')

  const loading = writingsLoading || projectsLoading

  // Build filesystem from content (includes easter egg when revealed)
  const filesystem = useMemo(() => {
    if (loading) return null
    return buildFilesystem(
      writings.map((w) => ({ slug: w.slug, title: w.title })),
      projects.map((p) => ({ slug: p.slug, title: p.title })),
      easterEggRevealed
    )
  }, [writings, projects, loading, easterEggRevealed])

  // Change directory
  const cd = useCallback(
    (path: string): { success: boolean; error?: string; newPath?: string } => {
      if (!filesystem) {
        return { success: false, error: 'Filesystem not ready' }
      }

      const resolvedPath = resolvePath(currentPath, path)
      
      if (!isDirectory(filesystem, resolvedPath)) {
        const node = getNodeAtPath(filesystem, resolvedPath)
        if (node?.type === 'file') {
          return { success: false, error: `cd: not a directory: ${path}` }
        }
        return { success: false, error: `cd: no such file or directory: ${path}` }
      }

      // Track home visits for easter egg
      if (resolvedPath === '~') {
        trackHomeVisit()
        setEasterEggRevealed(isEasterEggRevealed())
      }

      setCurrentPath(resolvedPath)
      return { success: true, newPath: resolvedPath }
    },
    [filesystem, currentPath]
  )

  // List directory contents
  const ls = useCallback(
    (path?: string): { success: boolean; items?: string[]; error?: string; hasHiddenFile?: boolean } => {
      if (!filesystem) {
        return { success: false, error: 'Filesystem not ready' }
      }

      // Track ls usage for easter egg
      trackLsCommand()
      const wasRevealed = easterEggRevealed
      setEasterEggRevealed(isEasterEggRevealed())

      // If path starts with ~, treat it as absolute, otherwise resolve relative to currentPath
      const targetPath = path 
        ? (path.startsWith('~') ? path : resolvePath(currentPath, path))
        : currentPath
      const contents = listDirectory(filesystem, targetPath)

      if (!contents) {
        return { success: false, error: `ls: cannot access '${path || '.'}': No such file or directory` }
      }

      // Check if we just revealed the easter egg
      const justRevealed = !wasRevealed && isEasterEggRevealed()

      return { 
        success: true, 
        items: formatListing(contents),
        hasHiddenFile: justRevealed && targetPath === '~',
      }
    },
    [filesystem, currentPath, easterEggRevealed]
  )

  // Get current directory
  const pwd = useCallback(() => currentPath, [currentPath])

  // Get file/node at path
  const getNode = useCallback(
    (path: string): FileNode | null => {
      if (!filesystem) return null
      const resolvedPath = resolvePath(currentPath, path)
      return getNodeAtPath(filesystem, resolvedPath)
    },
    [filesystem, currentPath]
  )

  // Generate tree view
  const tree = useCallback((): string[] => {
    if (!filesystem) return ['Filesystem not ready']
    return generateTree(filesystem)
  }, [filesystem])

  // Resolve a path from current directory
  const resolve = useCallback(
    (path: string): string => resolvePath(currentPath, path),
    [currentPath]
  )

  return {
    currentPath,
    filesystem,
    loading,
    cd,
    ls,
    pwd,
    getNode,
    tree,
    resolve,
    setCurrentPath,
  }
}
