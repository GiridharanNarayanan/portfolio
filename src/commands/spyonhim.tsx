import { useState, useEffect } from 'react'
import type { Command } from '../types/Command.types'
import { SpyReport } from '../components/organisms/SpyReport'
import { generateSpyReport, parseStatusMarkdown } from '../utils/azureOpenAI'

// Import raw status markdown
import statusMarkdown from '../content/static/status.md?raw'

/**
 * SpyOnHimView - Async wrapper that fetches and displays spy report
 */
function SpyOnHimView() {
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
      } catch (err) {
        setError('Failed to retrieve intel. Try again later.')
        setReport('🕵️ TRANSMISSION FAILED: Unable to reach headquarters. Status remains classified.')
      } finally {
        setLoading(false)
      }
    }

    fetchReport()
  }, [])

  return (
    <SpyReport
      report={report}
      cached={cached}
      loading={loading}
      error={error}
    />
  )
}

/**
 * spyonhim command - Easter egg that generates a quirky spy report
 */
export const spyonhimCommand: Command = {
  name: 'spyonhim',
  description: '🕵️ Classified intel... shh!',
  aliases: ['spy', 'status', 'whereishim'],
  handler: () => ({
    success: true,
    output: <SpyOnHimView />,
    clearOutput: true,
  }),
}
