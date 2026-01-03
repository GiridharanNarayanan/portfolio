/**
 * CorruptedFile Component
 * Displays a file with glitchy/corrupted visual effect
 */

import { useState, useEffect } from 'react'

interface CorruptedFileProps {
  name: string
}

// Zalgo-style characters for corruption effect
const glitchChars = '̸̷̶̵̴̨̧̢̡̛̳̲̱̰̯̮̭̬̫̪̩̦̥̤̣̠̟̞̝̜̙̘̗̖̔̓̒̑̐̏̎̍̌̋̊̉̈̇̆̅̄̃̂́̚̕'

function addGlitch(char: string, intensity: number = 1): string {
  let result = char
  for (let i = 0; i < intensity; i++) {
    result += glitchChars[Math.floor(Math.random() * glitchChars.length)]
  }
  return result
}

function corruptText(text: string): string {
  return text.split('').map((char, i) => {
    // More corruption at the end
    const intensity = Math.floor(i / 3)
    if (Math.random() > 0.5) {
      return addGlitch(char, Math.min(intensity, 2))
    }
    return char
  }).join('')
}

export function CorruptedFile({ name }: CorruptedFileProps) {
  const [displayName, setDisplayName] = useState(name)
  const [isGlitching, setIsGlitching] = useState(true)
  
  useEffect(() => {
    if (!isGlitching) return
    
    // Initial corruption animation
    let frame = 0
    const maxFrames = 15
    
    const interval = setInterval(() => {
      frame++
      if (frame >= maxFrames) {
        // Settle on final corrupted look
        setDisplayName(corruptText(name))
        setIsGlitching(false)
        clearInterval(interval)
        return
      }
      
      // Random corruption while glitching
      setDisplayName(corruptText(name))
    }, 80)
    
    return () => clearInterval(interval)
  }, [name, isGlitching])

  // Random flicker effect after initial animation
  useEffect(() => {
    if (isGlitching) return
    
    const flickerInterval = setInterval(() => {
      if (Math.random() > 0.92) {
        setDisplayName(corruptText(name))
      }
    }, 500)
    
    return () => clearInterval(flickerInterval)
  }, [name, isGlitching])

  return (
    <span 
      className="inline-block"
      style={{
        color: 'var(--color-error)',
        textShadow: '0 0 4px var(--color-error)',
        animation: isGlitching ? 'corrupted-flicker 0.1s infinite' : undefined,
      }}
    >
      <style>{`
        @keyframes corrupted-flicker {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
      `}</style>
      {displayName}
    </span>
  )
}
