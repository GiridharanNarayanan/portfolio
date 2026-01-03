import { useState, useEffect, useRef } from 'react'

export interface SpyReportProps {
  /** The terminal status text to display */
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
 * Displays a terminal-style status report with typing animation
 */
export function SpyReport({ report, cached, loading, error }: SpyReportProps) {
  const [displayedLines, setDisplayedLines] = useState<string[]>([])
  const [currentLineIndex, setCurrentLineIndex] = useState(0)
  const [currentCharIndex, setCurrentCharIndex] = useState(0)
  const [isTyping, setIsTyping] = useState(true)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Filter out empty lines and dedupe
  const lines = report.split('\n').filter(line => line.trim() !== '')

  useEffect(() => {
    if (loading) {
      setDisplayedLines([])
      setCurrentLineIndex(0)
      setCurrentCharIndex(0)
      setIsTyping(true)
      return
    }

    // Reset when report changes
    setDisplayedLines([])
    setCurrentLineIndex(0)
    setCurrentCharIndex(0)
    setIsTyping(true)

    let lineIdx = 0
    let charIdx = 0

    const typingSpeed = 20 // ms per character

    intervalRef.current = setInterval(() => {
      if (lineIdx >= lines.length) {
        setIsTyping(false)
        if (intervalRef.current) {
          clearInterval(intervalRef.current)
        }
        return
      }

      const currentLine = lines[lineIdx]
      
      if (charIdx >= currentLine.length) {
        // Line complete, add to displayed and move to next
        setDisplayedLines(prev => [...prev, currentLine])
        lineIdx++
        charIdx = 0
        setCurrentLineIndex(lineIdx)
        setCurrentCharIndex(0)
      } else {
        charIdx++
        setCurrentCharIndex(charIdx)
      }
    }, typingSpeed)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [report, loading])

  // Get the currently typing line
  const currentTypingLine = currentLineIndex < lines.length 
    ? lines[currentLineIndex].slice(0, currentCharIndex)
    : ''

  return (
    <div 
      className="max-w-2xl mx-auto py-6 px-4" 
      data-testid="spy-report"
      role="region"
      aria-label="System Status"
      aria-live="polite"
    >
      {/* Header */}
      <header className="mb-4">
        <div className="flex items-center gap-2 text-terminal-accent font-mono text-sm">
          <span className="opacity-60">$</span>
          <span>./status --verbose</span>
        </div>
        <div className="text-xs text-terminal-muted mt-1">
          {loading ? (
            <span className="animate-pulse">Fetching system status...</span>
          ) : cached ? (
            <span>📦 Cached response</span>
          ) : (
            <span>🔄 Live status</span>
          )}
        </div>
      </header>

      {/* Terminal Output */}
      <div 
        className="bg-black/40 border border-terminal-border rounded-lg p-4 font-mono text-sm"
        style={{ minHeight: '200px' }}
      >
        {loading ? (
          <div className="flex items-center gap-2 text-terminal-muted">
            <span className="animate-pulse">▋</span>
            <span>Connecting to status feed...</span>
          </div>
        ) : (
          <pre className="whitespace-pre-wrap leading-relaxed">
            {/* Already displayed lines */}
            {displayedLines.map((line, i) => (
              <div key={i} className={getLineStyle(line)}>
                {line}
              </div>
            ))}
            {/* Currently typing line */}
            {isTyping && currentLineIndex < lines.length && (
              <div className={getLineStyle(lines[currentLineIndex])}>
                {currentTypingLine}
                <span 
                  className="inline-block w-2 h-4 bg-terminal-accent ml-0.5 animate-pulse"
                  aria-hidden="true"
                />
              </div>
            )}
          </pre>
        )}
      </div>

      {/* Footer */}
      <footer className="mt-4 text-center text-xs text-terminal-muted">
        <p className="opacity-60">
          Last sync: {new Date().toLocaleTimeString()}
          {error && <span className="ml-2">• {error}</span>}
        </p>
      </footer>
    </div>
  )
}

/**
 * Get styling class based on line content
 */
function getLineStyle(line: string): string {
  if (line.startsWith('$')) {
    return 'text-terminal-accent'
  }
  if (line.includes('████') || line.includes('██')) {
    return 'text-terminal-success'
  }
  if (line.includes('░░')) {
    return 'text-terminal-muted'
  }
  if (line.startsWith('  ') && line.includes('PID')) {
    return 'text-terminal-secondary font-semibold'
  }
  return 'text-terminal-text'
}
