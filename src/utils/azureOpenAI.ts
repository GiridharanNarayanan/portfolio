/**
 * Azure OpenAI API Wrapper
 * For generating quirky spy reports from status data
 */

interface StatusData {
  lastUpdated: string
  location: string
  activity: string
  mood: string
  currentProject: string
  funFact?: string
  additionalContext?: string
}

interface SpyReportResponse {
  report: string
  cached: boolean
  error?: string
}

// Cache for API responses
let cachedReport: { report: string; timestamp: number } | null = null
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes in ms

/**
 * Generate a spy report prompt for the LLM
 */
function generateSpyPrompt(status: StatusData): string {
  return `You are a quirky secret agent delivering a status report about a developer. 
Your report should be:
- Written in a playful spy/secret agent style
- Include some spy terminology and dramatic flair
- Be concise (3-4 sentences max)
- Maintain a friendly, humorous tone
- Reference the actual status data provided

Current Status:
- Location: ${status.location}
- Activity: ${status.activity}
- Mood: ${status.mood}
- Current Project: ${status.currentProject}
${status.funFact ? `- Fun Fact: ${status.funFact}` : ''}
${status.additionalContext ? `- Additional Intel: ${status.additionalContext}` : ''}

Generate a spy report now:`
}

/**
 * Call Azure OpenAI API to generate spy report
 */
export async function generateSpyReport(status: StatusData): Promise<SpyReportResponse> {
  // Check cache first
  if (cachedReport && Date.now() - cachedReport.timestamp < CACHE_DURATION) {
    return { report: cachedReport.report, cached: true }
  }

  const endpoint = import.meta.env.VITE_AZURE_OPENAI_ENDPOINT
  const apiKey = import.meta.env.VITE_AZURE_OPENAI_KEY
  const deployment = import.meta.env.VITE_AZURE_OPENAI_DEPLOYMENT || 'gpt-4o'

  // If no API configuration, return fallback
  if (!endpoint || !apiKey) {
    return generateFallbackReport(status)
  }

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
              content: 'You are a witty secret agent delivering status reports.',
            },
            {
              role: 'user',
              content: generateSpyPrompt(status),
            },
          ],
          max_tokens: 200,
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
  }
}

/**
 * Generate a fallback spy report without LLM
 */
function generateFallbackReport(status: StatusData): SpyReportResponse {
  const templates = [
    `🕵️ CLASSIFIED INTEL: Target spotted at ${status.location}. Current status: ${status.mood}. They appear to be ${status.activity.toLowerCase()}. ${status.funFact ? `Side note: ${status.funFact}` : ''} Over and out.`,
    `📡 TRANSMISSION RECEIVED: Our operative is currently ${status.activity.toLowerCase()} from ${status.location}. Mood assessment: ${status.mood}. ${status.funFact ? `Bonus intel: ${status.funFact}` : ''} Mission ongoing.`,
    `🔍 SURVEILLANCE REPORT: Subject located in ${status.location}. Engaging in ${status.activity.toLowerCase()}. Psychological profile: ${status.mood}. ${status.funFact ? `Fun observation: ${status.funFact}` : ''} Awaiting further orders.`,
  ]

  const report = templates[Math.floor(Math.random() * templates.length)]
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
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/)
  const bodyMatch = content.match(/^---\n[\s\S]*?\n---\n([\s\S]*)$/)

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
    lastUpdated: frontmatter.lastUpdated || new Date().toISOString(),
    location: frontmatter.location || 'Unknown Location',
    activity: frontmatter.activity || 'Status unknown',
    mood: frontmatter.mood || 'Mysterious',
    currentProject: frontmatter.currentProject || 'Classified',
    funFact: frontmatter.funFact,
    additionalContext: bodyMatch?.[1]?.trim(),
  }
}
