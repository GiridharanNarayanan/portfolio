/**
 * Back Command
 * Navigate back in history stack
 */

import type { Command, CommandContext } from './types'

export const backCommand: Command = {
  name: 'back',
  aliases: ['b', '..'],
  description: 'Go back to previous view',
  handler: (_args, context) => {
    if (context.history.length <= 1) {
      return {
        success: false,
        error: 'Already at home. No previous view to return to.',
      }
    }

    // Pop current view from history
    const newHistory = [...context.history]
    newHistory.pop()
    
    // Get the previous view
    const previousView = newHistory[newHistory.length - 1] || 'home'

    return {
      success: true,
      newContext: {
        currentView: previousView as CommandContext['currentView'],
        history: newHistory,
        contentId: undefined,
      },
    }
  },
  isAvailable: (context) => {
    // Only available when not at home
    return context.history.length > 1
  },
}
