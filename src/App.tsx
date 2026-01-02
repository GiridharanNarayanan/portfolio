import { useState } from 'react'
import { ThemeProvider } from './components/atoms/ThemeProvider'
import { ErrorBoundary } from './components/atoms/ErrorBoundary'
import { StartupScreen } from './components/organisms/StartupScreen'
import { Terminal } from './components/organisms/Terminal'

function App() {
  const [isStarted, setIsStarted] = useState(false)

  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        {!isStarted && (
          <StartupScreen onActivate={() => setIsStarted(true)} />
        )}
        {isStarted && <Terminal />}
      </ThemeProvider>
    </ErrorBoundary>
  )
}

export default App