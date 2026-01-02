import { useState } from 'react'
import { ThemeProvider } from './components/atoms/ThemeProvider'
import { StartupScreen } from './components/organisms/StartupScreen'
import { Terminal } from './components/organisms/Terminal'

function App() {
  const [isStarted, setIsStarted] = useState(false)

  return (
    <ThemeProvider defaultTheme="dark">
      {!isStarted && (
        <StartupScreen onActivate={() => setIsStarted(true)} />
      )}
      {isStarted && <Terminal />}
    </ThemeProvider>
  )
}

export default App