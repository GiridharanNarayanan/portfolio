import { useState, useMemo } from 'react'
import { ThemeProvider } from './components/atoms/ThemeProvider'
import { ErrorBoundary } from './components/atoms/ErrorBoundary'
import { StartupScreen } from './components/organisms/StartupScreen'
import { Terminal } from './components/organisms/Terminal'
import { parseDeepLink } from './hooks/useDeepLink'

function App() {
  // Check for deep link on initial load
  const deepLink = useMemo(() => parseDeepLink(window.location.pathname), [])
  
  // Skip startup screen if we have a deep link
  const [isStarted, setIsStarted] = useState(deepLink.hasDeepLink)

  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        {!isStarted && (
          <StartupScreen onActivate={() => setIsStarted(true)} />
        )}
        {isStarted && (
          <Terminal 
            initialCommand={deepLink.hasDeepLink ? deepLink.command : null} 
            onRestart={() => {
              // Reset URL to root when restarting
              window.history.pushState({}, '', '/')
              setIsStarted(false)
            }}
          />
        )}
      </ThemeProvider>
    </ErrorBoundary>
  )
}

export default App