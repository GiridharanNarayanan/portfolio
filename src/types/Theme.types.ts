/**
 * Theme Types
 * Defines theme-related types and context interface
 */

/**
 * Available theme options
 */
export type Theme = 'dark' | 'light'

/**
 * Theme context value
 */
export interface ThemeContextValue {
  /** Current active theme */
  theme: Theme
  /** Toggle between dark and light */
  toggleTheme: () => void
  /** Set specific theme */
  setTheme: (theme: Theme) => void
  /** Whether system preference is being used */
  isSystemPreference: boolean
}

/**
 * Theme provider props
 */
export interface ThemeProviderProps {
  /** Child components */
  children: React.ReactNode
  /** Default theme (overrides system preference) */
  defaultTheme?: Theme
  /** Storage key for persistence */
  storageKey?: string
}
