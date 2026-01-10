/**
 * ls command - List directory contents
 */

import type { Command } from '../types/Command.types'
import { getGlobalFilesystem } from '../context/FilesystemContext'
import { getDirectoryGeneration } from '../context/directoryGeneration'
import { CorruptedFile } from '../components/atoms/CorruptedFile'
import { TappableFileItem } from '../components/atoms/TappableFileItem'
import { markEasterEggSeen } from '../utils/easterEggState'

export const lsCommand: Command = {
  name: 'ls',
  description: 'List directory contents',
  aliases: ['dir', 'list'],
  usage: 'ls [path]',
  handler: (args) => {
    const fs = getGlobalFilesystem()
    if (!fs) {
      return { success: false, error: 'Filesystem not initialized' }
    }

    // Capture the current generation for staleness detection on mobile
    const generation = getDirectoryGeneration()

    const result = fs.ls(args[0])
    
    if (!result.success) {
      return { success: false, error: result.error }
    }

    const items = result.items || []
    
    // Mark easter egg as seen if .c0rrupt3d is in the listing
    if (items.some(item => item === '.c0rrupt3d')) {
      markEasterEggSeen()
    }
    
    if (items.length === 0) {
      return {
        success: true,
        output: (
          <div className="font-mono text-terminal-muted">
            (empty directory)
          </div>
        ),
      }
    }

    return {
      success: true,
      output: (
        <div className="font-mono">
          {items.map((item, i) => {
            const isLast = i === items.length - 1
            const connector = isLast ? '└── ' : '├── '
            const isDir = item.endsWith('/')
            const isCorrupted = item.startsWith('.')
            const isParentDir = item === '../'
            const itemName = isDir ? item.slice(0, -1) : item
            
            // Determine the command to run
            let command: string
            if (isParentDir) {
              command = 'cd ..'
            } else if (isDir) {
              command = `cd ${itemName}`
            } else {
              command = `cat ${itemName}`
            }
            
            return (
              <div 
                key={i} 
                className={cn(
                  'flex items-center',
                  isDir ? 'text-terminal-accent' : 'text-terminal-text'
                )}
              >
                <span className="text-terminal-muted whitespace-pre">{connector}</span>
                {isCorrupted ? (
                  <CorruptedFile name={item} />
                ) : (
                  <TappableFileItem 
                    name={item} 
                    isDirectory={isDir}
                    command={command}
                    generation={generation}
                  />
                )}
              </div>
            )
          })}
        </div>
      ),
    }
  },
}

// Helper for className joining
function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ')
}
