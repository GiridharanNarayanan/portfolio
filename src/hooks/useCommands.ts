/**
 * useCommands Hook
 * Command execution and management
 */

import { useCallback } from 'react'
import type { CommandContext, CommandResult, ParsedCommand } from '../types/Command.types'
import { parseCommand } from '../utils/parseCommand'
import { matchCommand } from '../utils/matchCommand'
import { getCommand, getAllCommands } from '../commands/registry'

export interface UseCommandsOptions {
  /** Current command context */
  context: CommandContext
  /** Callback when context changes */
  onContextChange: (newContext: Partial<CommandContext>) => void
}

export interface UseCommandsReturn {
  /** Execute a command string */
  execute: (input: string) => Promise<CommandResult>
  /** Parse input without executing */
  parse: (input: string) => ParsedCommand
  /** Get suggestions for partial input */
  getSuggestions: (input: string) => string[]
}

/**
 * Hook for executing terminal commands
 */
export function useCommands({
  context,
  onContextChange,
}: UseCommandsOptions): UseCommandsReturn {
  const execute = useCallback(
    async (input: string): Promise<CommandResult> => {
      const parsed = parseCommand(input)

      if (!parsed.name) {
        return {
          success: false,
          error: 'No command entered.',
        }
      }

      // Try to find the command
      const command = getCommand(parsed.name)

      if (!command) {
        // Try fuzzy matching for suggestions
        const allCommands = getAllCommands()
        const match = matchCommand(parsed.name, allCommands, context)

        if (match.suggestions.length > 0) {
          const suggestionText = match.suggestions
            .map((s) => s.name)
            .join(', ')
          return {
            success: false,
            error: `Command not found: "${parsed.name}". Did you mean: ${suggestionText}?`,
          }
        }

        return {
          success: false,
          error: `Command not found: "${parsed.name}". Type "help" for available commands.`,
        }
      }

      // Check if command is available in current context
      if (command.isAvailable && !command.isAvailable(context)) {
        return {
          success: false,
          error: `Command "${parsed.name}" is not available in current context.`,
        }
      }

      // Check if command requires arguments
      if (command.requiresArgs && parsed.args.length === 0) {
        return {
          success: false,
          error: `Command "${parsed.name}" requires arguments. Usage: ${command.usage || parsed.name}`,
        }
      }

      try {
        // Execute the command
        const result = await command.handler(parsed.args, context)

        // Update context if needed
        if (result.newContext) {
          onContextChange(result.newContext)
        }

        return result
      } catch (error) {
        return {
          success: false,
          error: `Error executing command: ${error instanceof Error ? error.message : 'Unknown error'}`,
        }
      }
    },
    [context, onContextChange]
  )

  const parse = useCallback((input: string): ParsedCommand => {
    return parseCommand(input)
  }, [])

  const getSuggestions = useCallback(
    (input: string): string[] => {
      const allCommands = getAllCommands()
      const match = matchCommand(input, allCommands, context)

      if (match.exactMatch) {
        return []
      }

      return match.suggestions.map((s) => s.name)
    },
    [context]
  )

  return {
    execute,
    parse,
    getSuggestions,
  }
}
