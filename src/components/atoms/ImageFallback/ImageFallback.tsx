import { useState } from 'react'

export interface ImageFallbackProps {
  /** Image source URL */
  src: string
  /** Alt text for the image */
  alt: string
  /** Additional CSS classes */
  className?: string
  /** Loading strategy */
  loading?: 'lazy' | 'eager'
}

/**
 * ImageFallback
 * Image component with loading state and error fallback
 */
export function ImageFallback({ 
  src, 
  alt, 
  className = '',
  loading = 'lazy'
}: ImageFallbackProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  const handleLoad = () => {
    setIsLoading(false)
  }

  const handleError = () => {
    setIsLoading(false)
    setHasError(true)
  }

  if (hasError) {
    return (
      <div 
        className={`flex items-center justify-center bg-terminal-bg-secondary border border-terminal-border rounded ${className}`}
        role="img"
        aria-label={`Image failed to load: ${alt}`}
      >
        <div className="text-center p-4">
          <div className="text-2xl mb-2">🖼️</div>
          <p className="text-xs text-terminal-muted">Image unavailable</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`relative ${className}`}>
      {isLoading && (
        <div 
          className="absolute inset-0 flex items-center justify-center bg-terminal-bg-secondary border border-terminal-border rounded animate-pulse"
          aria-hidden="true"
        >
          <div className="text-terminal-muted text-sm">Loading...</div>
        </div>
      )}
      <img
        src={src}
        alt={alt}
        className={`${className} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        loading={loading}
        onLoad={handleLoad}
        onError={handleError}
      />
    </div>
  )
}
