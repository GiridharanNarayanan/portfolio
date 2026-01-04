/**
 * Azure Function: generate-report
 * Proxies requests to Azure OpenAI to keep API keys secure
 */

/**
 * Get current time of day for context
 */
function getTimeOfDay() {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 9) return 'early morning';
  if (hour >= 9 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 14) return 'midday';
  if (hour >= 14 && hour < 17) return 'afternoon';
  if (hour >= 17 && hour < 21) return 'evening';
  return 'late night';
}

/**
 * Generate the terminal status prompt for the LLM
 */
function generateTerminalPrompt(status) {
  const timeOfDay = getTimeOfDay();
  const dayOfWeek = new Date().toLocaleDateString('en-US', { weekday: 'long' });
  const timeString = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
  
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
- No markdown, no extra explanation`;
}

/**
 * Generate fallback report when API is unavailable
 */
function generateFallbackReport(status) {
  const timeString = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
  const hour = new Date().getHours();
  const coffeeCount = Math.floor(hour / 3) + 1;
  const focusMode = hour >= 9 && hour < 17 ? 'deep' : 'idle';
  
  return `$ uptime
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
"Shipping code, one commit at a time."`;
}

module.exports = async function (context, req) {
  context.log('Generate report function triggered');

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    context.res = {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    };
    return;
  }

  try {
    const body = req.body || {};
    
    const status = {
      location: body.location || 'Unknown Location',
      updated: body.updated || new Date().toISOString().split('T')[0],
      notes: body.notes || 'Status unknown'
    };

    const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
    const apiKey = process.env.AZURE_OPENAI_KEY;
    const deployment = process.env.AZURE_OPENAI_DEPLOYMENT || 'gpt-4o';

    // If no API configuration, return fallback
    if (!endpoint || !apiKey) {
      context.log('No API configuration, returning fallback');
      context.res = {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
        body: {
          report: generateFallbackReport(status),
          cached: false,
          error: 'Using fallback report (no API configured)'
        }
      };
      return;
    }

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
    );

    if (!response.ok) {
      context.log(`Azure OpenAI API error: ${response.statusText}`);
      context.res = {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
        body: {
          report: generateFallbackReport(status),
          cached: false,
          error: `API error: ${response.statusText}`
        }
      };
      return;
    }

    const data = await response.json();
    const report = data.choices?.[0]?.message?.content?.trim() || '';

    if (report) {
      context.res = {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
        body: { report, cached: false }
      };
      return;
    }

    context.res = {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
      body: {
        report: generateFallbackReport(status),
        cached: false,
        error: 'Empty response from API'
      }
    };

  } catch (error) {
    context.log(`Error generating report: ${error}`);
    context.res = {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
      body: { error: 'Internal server error' }
    };
  }
};
