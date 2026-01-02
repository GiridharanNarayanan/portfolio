/**
 * Microsoft Clarity Analytics Utilities
 * @see https://learn.microsoft.com/en-us/clarity/setup-and-installation/clarity-api
 */

declare global {
  interface Window {
    clarity: ((...args: unknown[]) => void) & {
      q?: unknown[][]
    }
  }
}

/**
 * Initialize Clarity with project ID from environment
 * Note: Main initialization is done in index.html, this is for dynamic control
 */
export function initClarity(): void {
  const projectId = import.meta.env.VITE_CLARITY_PROJECT_ID
  if (!projectId || projectId === 'CLARITY_PROJECT_ID') {
    console.warn('Clarity: Project ID not configured')
    return
  }
}

/**
 * Track a custom event in Clarity
 * @param eventName - Name of the custom event
 */
export function trackEvent(eventName: string): void {
  if (typeof window.clarity === 'function') {
    window.clarity('event', eventName)
  }
}

/**
 * Set a custom tag for the current session
 * @param key - Tag key
 * @param value - Tag value
 */
export function setTag(key: string, value: string): void {
  if (typeof window.clarity === 'function') {
    window.clarity('set', key, value)
  }
}

/**
 * Identify the current user
 * @param userId - Unique user identifier
 * @param sessionId - Optional session identifier
 * @param pageId - Optional page identifier
 */
export function identifyUser(
  userId: string,
  sessionId?: string,
  pageId?: string
): void {
  if (typeof window.clarity === 'function') {
    window.clarity('identify', userId, sessionId, pageId)
  }
}

/**
 * Track command execution for analytics
 * @param command - The command that was executed
 */
export function trackCommand(command: string): void {
  trackEvent(`command_${command}`)
  setTag('last_command', command)
}

/**
 * Track theme changes
 * @param theme - The theme that was selected (dark/light)
 */
export function trackThemeChange(theme: 'dark' | 'light'): void {
  trackEvent(`theme_${theme}`)
  setTag('theme', theme)
}

/**
 * Track content views
 * @param contentType - Type of content (writings, projects, travel)
 * @param contentId - Identifier of the content
 */
export function trackContentView(
  contentType: 'writings' | 'projects' | 'travel' | 'about' | 'contact',
  contentId?: string
): void {
  trackEvent(`view_${contentType}`)
  if (contentId) {
    setTag('content_id', contentId)
  }
}
