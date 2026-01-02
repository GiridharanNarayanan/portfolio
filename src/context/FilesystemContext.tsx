/**
 * Filesystem Context
 * Provides filesystem operations to commands
 */

import { createContext, useContext } from 'react'
import type { FileNode } from '../utils/filesystem'

export interface FilesystemOperations {
  currentPath: string
  cd: (path: string) => { success: boolean; error?: string; newPath?: string }
  ls: (path?: string) => { success: boolean; items?: string[]; error?: string }
  pwd: () => string
  getNode: (path: string) => FileNode | null
  tree: () => string[]
  resolve: (path: string) => string
}

export const FilesystemContext = createContext<FilesystemOperations | null>(null)

export function useFilesystemContext(): FilesystemOperations {
  const context = useContext(FilesystemContext)
  if (!context) {
    throw new Error('useFilesystemContext must be used within FilesystemProvider')
  }
  return context
}

// Global reference for commands (set by Terminal)
let globalFilesystem: FilesystemOperations | null = null

export function setGlobalFilesystem(fs: FilesystemOperations | null) {
  globalFilesystem = fs
}

export function getGlobalFilesystem(): FilesystemOperations | null {
  return globalFilesystem
}
