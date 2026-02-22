/**
 * ThemedImage Component
 *
 * Displays theme-aware images that swap between dark/light variants.
 *
 * Convention:
 * - Dark mode (default): Uses the original image path
 * - Light mode: Uses the image path with '-light' suffix before extension
 *
 * Example:
 *   src="/images/hero.svg"
 *   Dark mode renders: /images/hero.svg
 *   Light mode renders: /images/hero-light.svg
 *
 * If a light variant doesn't exist, the component will fall back to the
 * original (dark) image.
 *
 * Note: SVG files have JetBrains Mono embedded via scripts/embed-font-in-svgs.mjs
 * so they render correctly when sandboxed inside <img> tags.
 */

import { useState, useEffect } from 'react'
import { useTheme } from '../../../hooks/useTheme'
import { getThemedImagePath, getLightVariantPath } from '../../../utils/themedImage'

export interface ThemedImageProps {
  /** Image source path (dark mode / default version) */
  src: string
  /** Alt text for accessibility */
  alt: string
  /** Optional CSS class name */
  className?: string
  /** Optional loading strategy */
  loading?: 'lazy' | 'eager'
  /** Optional callback when image loads */
  onLoad?: () => void
  /** Optional callback when image fails to load */
  onError?: () => void
}

/**
 * Image component that automatically swaps between dark/light theme variants
 */
export function ThemedImage({
  src,
  alt,
  className,
  loading = 'lazy',
  onLoad,
  onError,
}: ThemedImageProps) {
  const { theme } = useTheme()
  const [currentSrc, setCurrentSrc] = useState(src)
  const [lightVariantExists, setLightVariantExists] = useState<boolean | null>(null)

  // Check if light variant exists (only once per src)
  useEffect(() => {
    if (theme === 'light' && lightVariantExists === null) {
      const lightSrc = getLightVariantPath(src)

      // Preload to check if light variant exists
      const img = new Image()
      img.onload = () => setLightVariantExists(true)
      img.onerror = () => setLightVariantExists(false)
      img.src = lightSrc
    }
  }, [src, theme, lightVariantExists])

  // Update current src based on theme and variant availability
  useEffect(() => {
    if (theme === 'dark') {
      setCurrentSrc(src)
    } else if (theme === 'light') {
      // Use light variant if it exists, otherwise fall back to dark
      if (lightVariantExists === true) {
        setCurrentSrc(getThemedImagePath(src, 'light'))
      } else {
        setCurrentSrc(src)
      }
    }
  }, [src, theme, lightVariantExists])

  return (
    <img
      src={currentSrc}
      alt={alt}
      className={className}
      loading={loading}
      onLoad={onLoad}
      onError={onError}
    />
  )
}

export default ThemedImage
