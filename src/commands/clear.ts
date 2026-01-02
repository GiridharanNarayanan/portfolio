/**
 * Clear Command
 * Clears terminal output
 */

import type { Command } from './types'

export const clearCommand: Command = {
  name: 'clear',
  aliases: ['cls'],
  description: 'Clear terminal output',
  handler: () => {
    return {
      success: true,
      clearOutput: true,
    }
  },
}
