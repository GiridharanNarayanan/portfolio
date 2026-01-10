/**
 * Theme-aware image utilities
 * 
 * Convention: Images are assumed to be dark-mode by default.
 * Light mode variants should be named with '-light' suffix before the extension.
 * 
 * Example:
 *   Dark (default): /images/projects/portfolio.svg
 *   Light variant:  /images/projects/portfolio-light.svg
 */

/**
 * Generate the light-mode variant path for an image
 * 
 * @param imagePath - Original image path (dark mode default)
 * @returns Light mode variant path with '-light' suffix
 * 
 * @example
 * getLightVariantPath('/images/foo.svg') // '/images/foo-light.svg'
 * getLightVariantPath('/images/bar.png') // '/images/bar-light.png'
 */
export function getLightVariantPath(imagePath: string): string {
  const lastDotIndex = imagePath.lastIndexOf('.')
  if (lastDotIndex === -1) {
    // No extension, just append -light
    return `${imagePath}-light`
  }
  
  const basePath = imagePath.slice(0, lastDotIndex)
  const extension = imagePath.slice(lastDotIndex)
  
  return `${basePath}-light${extension}`
}

/**
 * Get the appropriate image path based on current theme
 * 
 * @param imagePath - Original image path (dark mode default)
 * @param theme - Current theme ('dark' | 'light')
 * @returns The appropriate image path for the theme
 */
export function getThemedImagePath(imagePath: string, theme: 'dark' | 'light'): string {
  if (theme === 'dark') {
    return imagePath
  }
  return getLightVariantPath(imagePath)
}
