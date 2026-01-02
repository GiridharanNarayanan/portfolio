import { useState, useEffect, useRef } from 'react'

export interface SpyReportProps {
  /** The spy report text to display */
  report: string
  /** Whether the report was from cache */
  cached: boolean
  /** Whether the report is still loading */
  loading?: boolean
  /** Optional error message */
  error?: string
}

/**
 * SpyReport
 * Displays a spy report with typing animation effect
 */
export function SpyReport({ report, cached, loading, error }: SpyReportProps) {
  const [displayedText, setDisplayedText] = useState('')
  const [isTyping, setIsTyping] = useState(true)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (loading) {
      setDisplayedText('')
      setIsTyping(true)
      return
    }

    // Reset when report changes
    setDisplayedText('')
    setIsTyping(true)

    let currentIndex = 0
    const typingSpeed = 30 // ms per character

    intervalRef.current = setInterval(() => {
      if (currentIndex < report.length) {
        setDisplayedText(report.slice(0, currentIndex + 1))
        currentIndex++
      } else {
        setIsTyping(false)
        if (intervalRef.current) {
          clearInterval(intervalRef.current)
        }
      }
    }, typingSpeed)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [report, loading])

  return (
    <div 
      className="max-w-2xl mx-auto py-6 px-4" 
      data-testid="spy-report"
      role="region"
      aria-label="Spy Report"
      aria-live="polite"
    >
      {/* Header */}
      <header className="mb-6 text-center">
        <h1 className="text-2xl font-bold text-terminal-accent mb-2">
          🕵️ CLASSIFIED TRANSMISSION
        </h1>
        <div className="text-sm text-terminal-muted">
          {loading ? (
            <span className="animate-pulse">Decrypting transmission...</span>
          ) : cached ? (
            <span>📡 Cached intel retrieved</span>
          ) : (
            <span>🔒 Fresh intel acquired</span>
          )}
        </div>
      </header>

      {/* Report Content */}
      <div className="bg-terminal-bg-secondary border border-terminal-border rounded-lg p-6">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="flex space-x-2">
              <div className="w-2 h-2 bg-terminal-accent rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-2 h-2 bg-terminal-accent rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-2 h-2 bg-terminal-accent rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        ) : (
          <div className="font-mono text-terminal-text leading-relaxed">
            <span data-testid="spy-report-text">{displayedText}</span>
            {isTyping && (
              <span 
                className="inline-block w-2 h-4 bg-terminal-accent ml-0.5 animate-pulse"
                aria-hidden="true"
              />
            )}
          </div>
        )}
      </div>

      {/* Error/Debug Info */}
      {error && !loading && (
        <div className="mt-4 text-xs text-terminal-muted text-center">
          <span className="opacity-50">ℹ️ {error}</span>
        </div>
      )}

      {/* Footer */}
      <footer className="mt-6 text-center text-xs text-terminal-muted">
        <p>
          <span className="text-terminal-secondary">SECRET CLEARANCE REQUIRED</span>
          {' • '}
          This message will self-destruct in... just kidding 😄
        </p>
      </footer>
    </div>
  )
}
