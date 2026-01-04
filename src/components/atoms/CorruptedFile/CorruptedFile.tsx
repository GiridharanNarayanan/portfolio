/**
 * CorruptedFile Component
 * Displays a file with glitchy/corrupted visual effect
 */

import { useState, useEffect, useCallback, useRef } from 'react'
import { useMobileCommand } from '../../../context/MobileCommandContext'
import { cn } from '../../../utils/cn'

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
  const { isMobile, executeCommand } = useMobileCommand()
  const lastTapRef = useRef<number>(0)

  // Get the base filename for the command
  const baseName = name.replace(/\/$/, '')
  const command = `cat ${baseName}`

  const handleTap = useCallback(() => {
    // Debounce to prevent double-firing from touch + click
    const now = Date.now()
    if (now - lastTapRef.current < 300) {
      return
    }
    lastTapRef.current = now
    executeCommand(command)
  }, [command, executeCommand])

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

  const content = (
    <>
      <style>{`
        @keyframes corrupted-flicker {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
      `}</style>
      <span className="pointer-events-none">{displayName}</span>
      {isMobile && (
        <span
          className="text-terminal-muted/60 text-xs ml-1 pointer-events-none font-mono"
          aria-hidden="true"
        >
          [+]
        </span>
      )}
    </>
  )

  // On mobile, make it tappable
  if (isMobile) {
    return (
      <button
        type="button"
        onClick={handleTap}
        className={cn(
          'inline-flex items-center gap-1',
          'min-h-[44px] px-3 py-2 -mx-2',
          'rounded-md',
          'bg-transparent',
          'hover:bg-terminal-error/10',
          'active:bg-terminal-error/20',
          'touch-manipulation',
          'select-none',
          'transition-colors duration-150',
          'text-left',
          'cursor-pointer'
        )}
        style={{
          color: 'var(--color-error)',
          textShadow: '0 0 4px var(--color-error)',
          WebkitTapHighlightColor: 'transparent',
          animation: isGlitching ? 'corrupted-flicker 0.1s infinite' : undefined,
        }}
        aria-label={`View corrupted file ${name}`}
      >
        {content}
      </button>
    )
  }

  // On desktop, just render the span
  return (
    <span
      className="inline-block"
      style={{
        color: 'var(--color-error)',
        textShadow: '0 0 4px var(--color-error)',
        animation: isGlitching ? 'corrupted-flicker 0.1s infinite' : undefined,
      }}
    >
      {content}
    </span>
  )
}
