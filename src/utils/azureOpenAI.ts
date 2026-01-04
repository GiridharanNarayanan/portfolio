/**
 * Azure OpenAI API Wrapper
 * For generating terminal-style status reports from casual status updates
 * Now uses serverless Azure Function as a proxy to keep API keys secure
 */

interface StatusData {
  location: string
  updated: string
  notes: string
}

interface SpyReportResponse {
  report: string
  cached: boolean
  error?: string
}

// Cache for API responses
let cachedReport: { report: string; timestamp: number } | null = null
let pendingRequest: Promise<SpyReportResponse> | null = null
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes in ms

/**
 * Generate a fallback terminal status without API
 */
function generateFallbackReport(status: StatusData): SpyReportResponse {
  const timeString = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })
  const hour = new Date().getHours()
  const coffeeCount = Math.floor(hour / 3) + 1
  const focusMode = hour >= 9 && hour < 17 ? 'deep' : 'idle'
  
  const report = `$ uptime
 ${timeString} up 7 days, focus_mode: ${focusMode}

$ top -projects
  PID  PROJECT              CPU%   STATUS
  001  Portfolio Terminal   ████   active
  002  Side Projects        ██     background
  003  Learning             █      queued

$ free -mental
       total   used   available
Mind:  100%    ${60 + coffeeCount * 5}%    ${40 - coffeeCount * 5}% (${coffeeCount} coffees deep)

$ who
giri @ ${status.location} since 09:00
mood: caffeinated | music: lo-fi beats

$ cat /dev/status
"Shipping code, one commit at a time."`

  return { report, cached: false, error: 'Using fallback report' }
}

/**
 * Call Azure Function API to generate terminal status
 * The function proxies to Azure OpenAI, keeping API keys secure server-side
 */
export async function generateSpyReport(status: StatusData): Promise<SpyReportResponse> {
  // Check cache first
  if (cachedReport && Date.now() - cachedReport.timestamp < CACHE_DURATION) {
    return { report: cachedReport.report, cached: true }
  }

  // Dedupe concurrent requests (React StrictMode fires twice)
  if (pendingRequest) {
    return pendingRequest
  }

  pendingRequest = (async () => {
    try {
      const response = await fetch('/api/generate-report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          location: status.location,
          updated: status.updated,
          notes: status.notes,
        }),
      })

      if (!response.ok) {
        console.error('API error:', response.statusText)
        return generateFallbackReport(status)
      }

      const data = await response.json()
      const report = data.report?.trim() || ''

      if (report) {
        // Cache the response
        cachedReport = { report, timestamp: Date.now() }
        return { report, cached: false, error: data.error }
      }

      return generateFallbackReport(status)
    } catch (error) {
      console.error('API error:', error)
      return generateFallbackReport(status)
    } finally {
      pendingRequest = null
    }
  })()

  return pendingRequest
}

/**
 * Clear the cached report (useful for testing)
 */
export function clearReportCache(): void {
  cachedReport = null
}

/**
 * Parse status frontmatter from markdown
 */
export function parseStatusMarkdown(content: string): StatusData {
  // Normalize line endings to \n
  const normalized = content.replace(/\r\n/g, '\n').replace(/\r/g, '\n')
  
  const frontmatterMatch = normalized.match(/^---\n([\s\S]*?)\n---/)
  const bodyMatch = normalized.match(/^---\n[\s\S]*?\n---\n([\s\S]*)$/)

  const frontmatter: Record<string, string> = {}
  
  if (frontmatterMatch) {
    frontmatterMatch[1].split('\n').forEach(line => {
      const [key, ...valueParts] = line.split(':')
      if (key && valueParts.length) {
        frontmatter[key.trim()] = valueParts.join(':').trim()
      }
    })
  }

  return {
    location: frontmatter.location || 'Unknown Location',
    updated: frontmatter.updated || new Date().toISOString().split('T')[0],
    notes: bodyMatch?.[1]?.trim() || 'Status unknown',
  }
}
