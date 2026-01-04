/**
 * cd command - Change directory
 */

import type { Command } from '../types/Command.types'
import { getGlobalFilesystem } from '../context/FilesystemContext'
import { CorruptedFile } from '../components/atoms/CorruptedFile'
import { TappableFileItem } from '../components/atoms/TappableFileItem'
import { isEasterEggRevealed } from '../utils/easterEggState'

export const cdCommand: Command = {
  name: 'cd',
  description: 'Change directory',
  aliases: [],
  usage: 'cd <path>',
  handler: (args) => {
    const fs = getGlobalFilesystem()
    if (!fs) {
      return { success: false, error: 'Filesystem not initialized' }
    }

    const path = args[0] || '~'
    const result = fs.cd(path)
    
    if (!result.success) {
      return { success: false, error: result.error }
    }

    // After cd, show ls output of the NEW directory (pass the new path explicitly)
    const lsResult = fs.ls(result.newPath)
    let items = lsResult.items || []
    
    // If we just revealed the easter egg and we're at home, add the corrupted file
    const justRevealed = isEasterEggRevealed() && result.newPath === '~' && !items.some(i => i.startsWith('.'))
    if (justRevealed) {
      items = [...items, '.c0rrupt3d']
    }

    return {
      success: true,
      output: (
        <div className="font-mono">
          {items.length === 0 ? (
            <div className="text-terminal-muted">(empty directory)</div>
          ) : (
            <>
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
                    className={`flex items-center ${isDir ? 'text-terminal-accent' : 'text-terminal-text'}`}
                  >
                    <span className="text-terminal-muted whitespace-pre">{connector}</span>
                    {isCorrupted ? (
                      <CorruptedFile name={item} />
                    ) : (
                      <TappableFileItem 
                        name={item} 
                        isDirectory={isDir}
                        command={command}
                      />
                    )}
                  </div>
                )
              })}
            </>
          )}
        </div>
      ),
      newContext: { currentPath: result.newPath },
    }
  },
}
