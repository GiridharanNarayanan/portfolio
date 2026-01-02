export interface LoadingSkeletonProps {
  /** Number of lines to show */
  lines?: number
  /** Whether to show an image placeholder */
  showImage?: boolean
  /** Additional CSS classes */
  className?: string
}

/**
 * LoadingSkeleton
 * Animated loading placeholder for content
 */
export function LoadingSkeleton({ 
  lines = 3, 
  showImage = false,
  className = '' 
}: LoadingSkeletonProps) {
  return (
    <div 
      className={`animate-pulse space-y-4 ${className}`}
      role="status"
      aria-label="Loading content"
    >
      {showImage && (
        <div className="h-48 bg-terminal-bg-secondary rounded" />
      )}
      
      {/* Title placeholder */}
      <div className="h-6 bg-terminal-bg-secondary rounded w-3/4" />
      
      {/* Text lines */}
      <div className="space-y-2">
        {Array.from({ length: lines }).map((_, i) => (
          <div 
            key={i}
            className="h-4 bg-terminal-bg-secondary rounded"
            style={{ width: `${Math.max(60, 100 - i * 10)}%` }}
          />
        ))}
      </div>

      <span className="sr-only">Loading...</span>
    </div>
  )
}
