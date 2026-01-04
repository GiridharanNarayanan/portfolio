/**
 * Autocomplete utilities for terminal commands
 */

import { getGlobalFilesystem } from '../context/FilesystemContext'
import { getAllCommands } from '../commands/registry'
import { hasSeenEasterEgg } from './easterEggState'

export interface AutocompleteResult {
  /** The completed value */
  value: string
  /** All matching suggestions */
  suggestions: string[]
  /** Whether there was a unique match */
  isUnique: boolean
  /** Ghost text to display (shows what would be completed) */
  ghostText: string
}

/**
 * Get autocomplete suggestions for the current input
 */
export function getAutocompleteSuggestions(input: string): AutocompleteResult {
  const trimmed = input.trim()
  
  if (!trimmed) {
    return { value: '', suggestions: [], isUnique: false, ghostText: '' }
  }

  const parts = trimmed.split(/\s+/)
  const command = parts[0].toLowerCase()
  const args = parts.slice(1)

  // If we only have a command (no space yet), autocomplete commands
  if (parts.length === 1 && !input.endsWith(' ')) {
    return autocompleteCommand(command)
  }

  // If we have a command and are typing an argument, autocomplete based on command
  if (parts.length >= 1) {
    const currentArg = args.length > 0 ? args[args.length - 1] : ''
    
    // Commands that take file/directory paths
    if (['cd', 'cat', 'read', 'open', 'view', 'ls'].includes(command)) {
      const directoriesOnly = command === 'cd'
      const pathResult = autocompletePath(currentArg, directoriesOnly, command)
      
      // Build the completed command
      const baseCommand = args.length > 1 
        ? `${command} ${args.slice(0, -1).join(' ')} `
        : `${command} `
      
      // If user just typed command + space, show available options
      if (currentArg === '' && input.endsWith(' ')) {
        // If there's a unique match, return the completed value for Tab
        if (pathResult.isUnique && pathResult.suggestions.length === 1) {
          return {
            value: baseCommand + pathResult.value,
            suggestions: pathResult.suggestions,
            isUnique: true,
            ghostText: pathResult.ghostText,
          }
        }
        return {
          value: input,
          suggestions: pathResult.suggestions,
          isUnique: pathResult.isUnique,
          ghostText: pathResult.ghostText,
        }
      }
      
      if (pathResult.suggestions.length > 0) {
        return {
          value: baseCommand + pathResult.value,
          suggestions: pathResult.suggestions,
          isUnique: pathResult.isUnique,
          ghostText: pathResult.ghostText,
        }
      }
    }
  }

  return { value: input, suggestions: [], isUnique: false, ghostText: '' }
}

/**
 * Autocomplete command names
 */
function autocompleteCommand(partial: string): AutocompleteResult {
  const commands = getAllCommands()
  
  // Get all command names and aliases
  const allNames: string[] = []
  commands.forEach(cmd => {
    allNames.push(cmd.name)
    if (cmd.aliases) {
      allNames.push(...cmd.aliases)
    }
  })

  // Filter matching commands
  const matches = allNames.filter(name => 
    name.toLowerCase().startsWith(partial.toLowerCase())
  )

  if (matches.length === 0) {
    return { value: partial, suggestions: [], isUnique: false, ghostText: '' }
  }

  if (matches.length === 1) {
    const ghostText = matches[0].slice(partial.length) + ' '
    return { value: matches[0] + ' ', suggestions: matches, isUnique: true, ghostText }
  }

  // Find common prefix
  const commonPrefix = findCommonPrefix(matches)
  // Ghost text shows the common prefix completion
  const ghostText = commonPrefix.length > partial.length 
    ? commonPrefix.slice(partial.length) 
    : ''
  
  return {
    value: commonPrefix,
    suggestions: matches.sort(),
    isUnique: false,
    ghostText,
  }
}

/**
 * Autocomplete file/directory paths
 * @param partial - The partial path typed by user
 * @param directoriesOnly - Whether to only show directories (for cd)
 * @param command - The command being used (for context-aware suggestions)
 */
function autocompletePath(partial: string, directoriesOnly: boolean, command: string): AutocompleteResult {
  const fs = getGlobalFilesystem()
  if (!fs) {
    return { value: partial, suggestions: [], isUnique: false, ghostText: '' }
  }

  // Split path into directory and filename parts
  const lastSlash = partial.lastIndexOf('/')
  const dirPath = lastSlash >= 0 ? partial.slice(0, lastSlash + 1) : ''
  const filePrefix = lastSlash >= 0 ? partial.slice(lastSlash + 1) : partial

  // Get the directory to search in
  const searchDir = dirPath || '.'
  const lsResult = fs.ls(searchDir)
  
  if (!lsResult.success || !lsResult.items) {
    return { value: partial, suggestions: [], isUnique: false, ghostText: '' }
  }

  // Filter items that match the prefix
  let matches = lsResult.items.filter(item => {
    const itemName = item.replace(/\/$/, '') // Remove trailing slash for comparison
    
    // Handle hidden files (starting with .)
    if (itemName.startsWith('.')) {
      // Special case: .c0rrupt3d shows only after user has seen it in ls/tree/cd output
      if (itemName === '.c0rrupt3d') {
        return hasSeenEasterEgg() && itemName.toLowerCase().startsWith(filePrefix.toLowerCase())
      }
      // Other hidden files: user must type a dot to see them
      if (!filePrefix.startsWith('.')) {
        return false
      }
    }
    
    return itemName.toLowerCase().startsWith(filePrefix.toLowerCase())
  })

  // If directories only (for cd), filter to only directories
  if (directoriesOnly) {
    matches = matches.filter(item => item.endsWith('/'))
  }
  
  // For cat/read commands, filter to only files (not directories)
  if (['cat', 'read'].includes(command)) {
    matches = matches.filter(item => !item.endsWith('/'))
  }

  if (matches.length === 0) {
    return { value: partial, suggestions: [], isUnique: false, ghostText: '' }
  }

  if (matches.length === 1) {
    const match = matches[0]
    const completed = dirPath + match
    // Don't add space after directory (user might want to continue path)
    const suffix = match.endsWith('/') ? '' : ' '
    // Ghost text is the remaining part of the match
    const ghostText = match.slice(filePrefix.length) + suffix
    return { value: completed + suffix, suggestions: matches, isUnique: true, ghostText }
  }

  // Find common prefix among matches
  const matchNames = matches.map(m => m.replace(/\/$/, ''))
  const commonPrefix = findCommonPrefix(matchNames)
  
  // Ghost text shows what would be auto-completed
  const ghostText = commonPrefix.length > filePrefix.length 
    ? commonPrefix.slice(filePrefix.length)
    : ''

  return {
    value: dirPath + commonPrefix,
    suggestions: matches.sort(),
    isUnique: false,
    ghostText,
  }
}

/**
 * Find the longest common prefix among strings
 */
function findCommonPrefix(strings: string[]): string {
  if (strings.length === 0) return ''
  if (strings.length === 1) return strings[0]

  let prefix = strings[0]
  
  for (let i = 1; i < strings.length; i++) {
    while (!strings[i].toLowerCase().startsWith(prefix.toLowerCase())) {
      prefix = prefix.slice(0, -1)
      if (prefix === '') return ''
    }
    // Use the actual case from the first match
    prefix = strings[0].slice(0, prefix.length)
  }

  return prefix
}
