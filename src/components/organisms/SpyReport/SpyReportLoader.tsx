/**
 * SpyReportLoader
 * Async wrapper that fetches and displays spy report
 */

import { useState, useEffect } from 'react'
import { SpyReport } from './SpyReport'
import { generateSpyReport, parseStatusMarkdown } from '../../../utils/azureOpenAI'

// Import raw status markdown
import statusMarkdown from '../../../content/static/status.md?raw'

export function SpyReportLoader() {
  const [report, setReport] = useState('')
  const [cached, setCached] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | undefined>()

  useEffect(() => {
    async function fetchReport() {
      try {
        const statusData = parseStatusMarkdown(statusMarkdown)
        const result = await generateSpyReport(statusData)
        
        setReport(result.report)
        setCached(result.cached)
        setError(result.error)
      } catch {
        setError('Failed to retrieve intel. Try again later.')
        setReport('🕵️ TRANSMISSION FAILED: Unable to reach headquarters. Status remains classified.')
      } finally {
        setLoading(false)
      }
    }

    fetchReport()
  }, [])

  return (
    <div>
      {/* Glitchy intro text */}
      <div className="font-mono text-sm mb-4" style={{ color: 'var(--color-error)' }}>
        <span className="opacity-60">cat: warning: attempting to read corrupted file...</span>
        <br />
        <span className="opacity-80">cat: decrypting contents...</span>
      </div>
      
      <SpyReport
        report={report}
        cached={cached}
        loading={loading}
        error={error}
      />
    </div>
  )
}
