/**
 * Help Command
 * Lists all available commands
 */

import type { Command, CommandContext } from './types'
import { getAvailableCommands } from './registry'

/**
 * Render help output as formatted text
 */
function renderHelpOutput(context: CommandContext): React.ReactNode {
  const commands = getAvailableCommands(context)
  // Filter out help, clear, and easter eggs
  const filteredCommands = commands.filter(cmd => !['help', 'clear', 'spyonhim'].includes(cmd.name))
  
  // Sort in specific order - filesystem commands first, then utilities
  const commandOrder = ['ls', 'cd', 'cat', 'pwd', 'tree', 'theme']
  const displayCommands = filteredCommands.sort((a, b) => {
    const aIndex = commandOrder.indexOf(a.name)
    const bIndex = commandOrder.indexOf(b.name)
    // If not in order list, put at end
    const aOrder = aIndex === -1 ? 999 : aIndex
    const bOrder = bIndex === -1 ? 999 : bIndex
    return aOrder - bOrder
  })
  
  return (
    <div className="font-mono space-y-4">
      <p style={{ color: 'var(--color-accent)' }}>
        Available Commands:
      </p>
      <div className="space-y-2">
        {displayCommands.map((cmd) => (
          <div key={cmd.name} className="flex gap-4">
            <span 
              className="min-w-[140px]"
              style={{ color: 'var(--color-accent-secondary)' }}
            >
              {cmd.usage || cmd.name}
            </span>
            <span style={{ color: 'var(--color-text-muted)' }}>
              {cmd.description}
            </span>
          </div>
        ))}
      </div>
      <p className="mt-4" style={{ color: 'var(--color-text-muted)' }}>
        Tip: Navigate with <span className="text-terminal-accent">cd</span>, 
        read files with <span className="text-terminal-accent">cat</span>
      </p>
    </div>
  )
}

export const helpCommand: Command = {
  name: 'help',
  aliases: ['h', '?'],
  description: 'Show available commands',
  handler: (_args, context) => {
    return {
      success: true,
      output: renderHelpOutput(context),
    }
  },
}
