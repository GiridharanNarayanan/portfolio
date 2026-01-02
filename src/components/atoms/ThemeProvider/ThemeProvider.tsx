/**
 * ThemeProvider Component
 * Provides theme context to the application with class-based switching
 */

import { ThemeContext, useThemeState } from '../../../hooks/useTheme'
import type { ThemeProviderProps } from '../../../types/Theme.types'

/**
 * Theme provider component
 * Wraps application to provide theme context
 * 
 * @example
 * <ThemeProvider defaultTheme="dark">
 *   <App />
 * </ThemeProvider>
 */
export function ThemeProvider({
  children,
  defaultTheme,
  storageKey,
}: ThemeProviderProps) {
  const themeState = useThemeState(defaultTheme, storageKey)

  return (
    <ThemeContext.Provider value={themeState}>
      {children}
    </ThemeContext.Provider>
  )
}
