/**
 * Preview Mode Utility
 * 
 * When ?preview=true is present in the URL, unpublished content becomes visible.
 * This allows deploying draft content and testing it across devices before publishing.
 * 
 * Once detected, the flag is latched in sessionStorage so it survives URL changes
 * (deeplink replaceState, SPA navigation) for the duration of the browser tab.
 */

const PREVIEW_KEY = 'preview-mode'

/**
 * Check if preview mode is active.
 * Checks the URL first, then falls back to sessionStorage.
 */
export function isPreviewMode(): boolean {
  if (typeof window === 'undefined') return false

  const params = new URLSearchParams(window.location.search)
  if (params.get('preview') === 'true') {
    sessionStorage.setItem(PREVIEW_KEY, 'true')
    return true
  }

  return sessionStorage.getItem(PREVIEW_KEY) === 'true'
}
