/**
 * Match Command Utility
 * Fuzzy matching for commands with suggestions
 */

import type { Command, CommandContext } from '../types/Command.types'

/**
 * Result of command matching
 */
export interface MatchResult {
  /** Exact match found */
  exactMatch: Command | null
  /** Suggested commands (fuzzy matches) */
  suggestions: Command[]
  /** Whether the input matches any command or alias */
  isMatch: boolean
}

/**
 * Calculate Levenshtein distance between two strings
 * Used for fuzzy matching
 */
function levenshteinDistance(a: string, b: string): number {
  const matrix: number[][] = []

  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i]
  }

  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j
  }

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1]
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j] + 1      // deletion
        )
      }
    }
  }

  return matrix[b.length][a.length]
}

/**
 * Match a command input against registered commands
 * 
 * @param input - Command name to match
 * @param commands - Available commands
 * @param context - Current command context (for availability filtering)
 * @param maxSuggestions - Maximum number of suggestions to return
 * @returns Match result with exact match and suggestions
 */
export function matchCommand(
  input: string,
  commands: Command[],
  context?: CommandContext,
  maxSuggestions = 3
): MatchResult {
  const normalizedInput = input.toLowerCase().trim()
  
  if (!normalizedInput) {
    return {
      exactMatch: null,
      suggestions: [],
      isMatch: false,
    }
  }

  // Filter available commands based on context
  const availableCommands = context
    ? commands.filter(cmd => !cmd.isAvailable || cmd.isAvailable(context))
    : commands

  // Check for exact match (name or alias)
  const exactMatch = availableCommands.find(
    cmd =>
      cmd.name === normalizedInput ||
      cmd.aliases?.includes(normalizedInput)
  )

  if (exactMatch) {
    return {
      exactMatch,
      suggestions: [],
      isMatch: true,
    }
  }

  // Find fuzzy matches
  const scored = availableCommands
    .map(cmd => {
      // Check distance against name and all aliases
      const distances = [
        levenshteinDistance(normalizedInput, cmd.name),
        ...(cmd.aliases?.map(alias => levenshteinDistance(normalizedInput, alias)) || []),
      ]
      const minDistance = Math.min(...distances)
      
      // Also check if input is a prefix
      const isPrefix = cmd.name.startsWith(normalizedInput) ||
        cmd.aliases?.some(alias => alias.startsWith(normalizedInput))
      
      return {
        command: cmd,
        distance: minDistance,
        isPrefix,
      }
    })
    .filter(({ distance, isPrefix }) => {
      // Accept if distance is small enough or is a prefix match
      const maxDistance = Math.max(2, Math.floor(normalizedInput.length / 2))
      return distance <= maxDistance || isPrefix
    })
    .sort((a, b) => {
      // Prioritize prefix matches
      if (a.isPrefix && !b.isPrefix) return -1
      if (!a.isPrefix && b.isPrefix) return 1
      return a.distance - b.distance
    })
    .slice(0, maxSuggestions)
    .map(({ command }) => command)

  return {
    exactMatch: null,
    suggestions: scored,
    isMatch: false,
  }
}

/**
 * Get autocomplete suggestions for partial input
 * 
 * @param input - Partial command input
 * @param commands - Available commands
 * @param context - Current command context
 * @returns Array of command names that match the prefix
 */
export function getAutocompleteSuggestions(
  input: string,
  commands: Command[],
  context?: CommandContext
): string[] {
  const normalizedInput = input.toLowerCase().trim()
  
  if (!normalizedInput) {
    return commands
      .filter(cmd => !cmd.isAvailable || !context || cmd.isAvailable(context))
      .map(cmd => cmd.name)
  }

  const availableCommands = context
    ? commands.filter(cmd => !cmd.isAvailable || cmd.isAvailable(context))
    : commands

  const matches: string[] = []

  for (const cmd of availableCommands) {
    if (cmd.name.startsWith(normalizedInput)) {
      matches.push(cmd.name)
    }
    for (const alias of cmd.aliases || []) {
      if (alias.startsWith(normalizedInput) && !matches.includes(cmd.name)) {
        matches.push(cmd.name)
      }
    }
  }

  return matches.sort()
}
