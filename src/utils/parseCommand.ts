/**
 * Parse Command Utility
 * Parses user input into command name and arguments
 */

import type { ParsedCommand } from '../types/Command.types'

/**
 * Parse a raw command string into structured command data
 * 
 * @param input - Raw user input string
 * @returns Parsed command with name, args, and raw input
 * 
 * @example
 * parseCommand('read my-post')
 * // { name: 'read', args: ['my-post'], raw: 'read my-post' }
 * 
 * @example
 * parseCommand('  help  ')
 * // { name: 'help', args: [], raw: 'help' }
 */
export function parseCommand(input: string): ParsedCommand {
  const trimmed = input.trim()
  
  if (!trimmed) {
    return {
      name: '',
      args: [],
      raw: '',
    }
  }

  // Split by whitespace, handling multiple spaces
  const parts = trimmed.split(/\s+/)
  const [name, ...args] = parts

  return {
    name: name.toLowerCase(),
    args,
    raw: trimmed,
  }
}

/**
 * Check if a string looks like a command (starts with valid command character)
 * 
 * @param input - String to check
 * @returns Whether input appears to be a command
 */
export function isValidCommandInput(input: string): boolean {
  const trimmed = input.trim()
  if (!trimmed) return false
  
  // Command must start with a letter
  return /^[a-zA-Z]/.test(trimmed)
}

/**
 * Extract command name from input (without parsing full args)
 * 
 * @param input - Raw user input
 * @returns Command name in lowercase
 */
export function extractCommandName(input: string): string {
  const trimmed = input.trim()
  const firstSpace = trimmed.indexOf(' ')
  
  if (firstSpace === -1) {
    return trimmed.toLowerCase()
  }
  
  return trimmed.slice(0, firstSpace).toLowerCase()
}
