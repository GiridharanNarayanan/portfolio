/**
 * Command System Types
 * Defines the structure for terminal commands and their execution context
 */

import type { ReactNode } from 'react'

/**
 * Represents a parsed command from user input
 */
export interface ParsedCommand {
  /** The command name (e.g., 'help', 'writings', 'read') */
  name: string
  /** Arguments passed to the command */
  args: string[]
  /** Raw input string */
  raw: string
}

/**
 * Current navigation/execution context for commands
 */
export interface CommandContext {
  /** Current content type being viewed */
  currentView: 'home' | 'writings' | 'projects' | 'about' | 'detail'
  /** ID of content being viewed (for detail views) */
  contentId?: string
  /** Navigation history stack */
  history: string[]
  /** Current theme */
  theme: 'dark' | 'light'
}

/**
 * Result of command execution
 */
export interface CommandResult {
  /** Whether the command executed successfully */
  success: boolean
  /** React component to render as output */
  output?: ReactNode
  /** Error message if command failed */
  error?: string
  /** Updated context after command execution */
  newContext?: Partial<CommandContext>
  /** Whether to clear previous output */
  clearOutput?: boolean
}

/**
 * Command handler function signature
 */
export type CommandHandler = (
  args: string[],
  context: CommandContext
) => CommandResult | Promise<CommandResult>

/**
 * Command definition with metadata
 */
export interface Command {
  /** Command name (what user types) */
  name: string
  /** Aliases for the command */
  aliases?: string[]
  /** Short description shown in help */
  description: string
  /** Usage pattern (e.g., 'read <slug>') */
  usage?: string
  /** Command handler function */
  handler: CommandHandler
  /** Whether command is available in current context */
  isAvailable?: (context: CommandContext) => boolean
  /** Whether command requires arguments */
  requiresArgs?: boolean
}

/**
 * Command history entry
 */
export interface HistoryEntry {
  /** The raw command input */
  input: string
  /** Timestamp of execution */
  timestamp: number
  /** Result of execution */
  result: CommandResult
}
