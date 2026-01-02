/**
 * Command Registry
 * Central registration and lookup for terminal commands
 */

import type { Command, CommandContext } from '../types/Command.types'

/**
 * Map of registered commands
 */
const commandRegistry = new Map<string, Command>()

/**
 * Register a command in the registry
 */
export function registerCommand(command: Command): void {
  commandRegistry.set(command.name, command)
  
  // Also register aliases
  if (command.aliases) {
    for (const alias of command.aliases) {
      commandRegistry.set(alias, command)
    }
  }
}

/**
 * Get a command by name or alias
 */
export function getCommand(name: string): Command | undefined {
  return commandRegistry.get(name.toLowerCase())
}

/**
 * Get all registered commands (unique, no aliases)
 */
export function getAllCommands(): Command[] {
  const seen = new Set<string>()
  const commands: Command[] = []
  
  for (const command of commandRegistry.values()) {
    if (!seen.has(command.name)) {
      seen.add(command.name)
      commands.push(command)
    }
  }
  
  return commands.sort((a, b) => a.name.localeCompare(b.name))
}

/**
 * Get commands available in current context
 */
export function getAvailableCommands(context: CommandContext): Command[] {
  return getAllCommands().filter(
    cmd => !cmd.isAvailable || cmd.isAvailable(context)
  )
}

/**
 * Check if a command exists
 */
export function hasCommand(name: string): boolean {
  return commandRegistry.has(name.toLowerCase())
}

/**
 * Clear all registered commands (useful for testing)
 */
export function clearRegistry(): void {
  commandRegistry.clear()
}

/**
 * Initialize default commands
 * Call this at app startup
 */
export function initializeCommands(): void {
  // Import and register all default commands
  // These will be imported dynamically to avoid circular dependencies
  import('./help').then(({ helpCommand }) => registerCommand(helpCommand))
  import('./clear').then(({ clearCommand }) => registerCommand(clearCommand))
  import('./theme').then(({ themeCommand }) => registerCommand(themeCommand))
}
