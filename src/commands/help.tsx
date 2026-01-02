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
  
  return (
    <div className="font-mono space-y-4">
      <p style={{ color: 'var(--color-accent)' }}>
        Available Commands:
      </p>
      <div className="space-y-2">
        {commands.map((cmd) => (
          <div key={cmd.name} className="flex gap-4">
            <span 
              className="min-w-[120px]"
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
        Type a command and press Enter to execute.
      </p>
    </div>
  )
}

export const helpCommand: Command = {
  name: 'help',
  aliases: ['h', '?'],
  description: 'List all available commands',
  handler: (_args, context) => {
    return {
      success: true,
      output: renderHelpOutput(context),
    }
  },
}
