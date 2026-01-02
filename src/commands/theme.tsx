/**
 * Theme Command
 * Toggle between dark and light themes
 */

import type { Command } from './types'

// Theme toggle function will be injected via context
let toggleThemeFn: (() => void) | null = null

/**
 * Set the theme toggle function (called by app initialization)
 */
export function setThemeToggle(fn: () => void): void {
  toggleThemeFn = fn
}

export const themeCommand: Command = {
  name: 'theme',
  aliases: ['t', 'dark', 'light'],
  description: 'Toggle dark/light theme',
  handler: (_args, context) => {
    if (toggleThemeFn) {
      toggleThemeFn()
    }

    const newTheme = context.theme === 'dark' ? 'light' : 'dark'

    return {
      success: true,
      output: (
        <p style={{ color: 'var(--color-accent-secondary)' }}>
          Theme switched to {newTheme} mode.
        </p>
      ),
      newContext: {
        theme: newTheme,
      },
    }
  },
}
