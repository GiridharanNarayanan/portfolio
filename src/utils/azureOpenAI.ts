/**
 * Azure OpenAI API Wrapper
 * For generating terminal-style status reports from casual status updates
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
 * Get current time of day for context
 */
function getTimeOfDay(): string {
  const hour = new Date().getHours()
  if (hour >= 5 && hour < 9) return 'early morning'
  if (hour >= 9 && hour < 12) return 'morning'
  if (hour >= 12 && hour < 14) return 'midday'
  if (hour >= 14 && hour < 17) return 'afternoon'
  if (hour >= 17 && hour < 21) return 'evening'
  return 'late night'
}

/**
 * Generate the terminal status prompt for the LLM
 */
function generateTerminalPrompt(status: StatusData): string {
  const timeOfDay = getTimeOfDay()
  const dayOfWeek = new Date().toLocaleDateString('en-US', { weekday: 'long' })
  const timeString = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })
  
  return `Generate a terminal-style status report. You MUST use the real data provided below.

=== DEVELOPER'S ACTUAL STATUS ===
Location: ${status.location}
Updated: ${status.updated}
Current time: ${timeString} on ${dayOfWeek} (${timeOfDay})

Their notes:
${status.notes}
=== END STATUS ===

Generate output in THIS EXACT FORMAT (fill in with real data above):

$ uptime
 ${timeString} up X days, focus_mode: [mode based on their notes]

$ top -projects
  PID  PROJECT              CPU%   STATUS
  001  [main project]       ████   active
  002  [secondary focus]    ██     background
  003  [learning/reading]   █      paused

$ free -mental
       total   used   available
Mind:  100%    XX%    XX% ([witty note about coffee/energy from their notes])

$ who
[name] @ ${status.location} since [time]
mood: [from notes] | music: [from notes]

$ cat /dev/status
"[one witty summary line from their notes]"

Rules:
- Use ████ ███ ██ █ for progress bars (more bars = more focus)
- Extract REAL projects/activities from their notes
- Keep the exact format above
- No markdown, no extra explanation`
}

/**
 * Call Azure OpenAI API to generate terminal status
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

  const endpoint = import.meta.env.VITE_AZURE_OPENAI_ENDPOINT
  const apiKey = import.meta.env.VITE_AZURE_OPENAI_KEY
  const deployment = import.meta.env.VITE_AZURE_OPENAI_DEPLOYMENT || 'gpt-4o'

  // If no API configuration, return fallback
  if (!endpoint || !apiKey) {
    return generateFallbackReport(status)
  }

  pendingRequest = (async () => {
    try {
      const response = await fetch(
        `${endpoint}/openai/deployments/${deployment}/chat/completions?api-version=2024-02-15-preview`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'api-key': apiKey,
          },
          body: JSON.stringify({
            messages: [
              {
                role: 'system',
                content: 'You are a terminal system generating creative status outputs. Be witty and concise.',
              },
              {
                role: 'user',
                content: generateTerminalPrompt(status),
              },
            ],
            max_tokens: 300,
            temperature: 0.8,
          }),
        }
      )

      if (!response.ok) {
        console.error('Azure OpenAI API error:', response.statusText)
        return generateFallbackReport(status)
      }

      const data = await response.json()
      const report = data.choices?.[0]?.message?.content?.trim() || ''

      if (report) {
        // Cache the response
        cachedReport = { report, timestamp: Date.now() }
        return { report, cached: false }
      }

      return generateFallbackReport(status)
    } catch (error) {
      console.error('Azure OpenAI API error:', error)
      return generateFallbackReport(status)
    } finally {
      pendingRequest = null
    }
  })()

  return pendingRequest
}

/**
 * Generate a fallback terminal status without LLM
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

  return { report, cached: false, error: 'Using fallback report (no API configured)' }
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
