/**
 * tree command - Display directory tree
 */

import type { Command } from '../types/Command.types'
import { getGlobalFilesystem } from '../context/FilesystemContext'
import { markEasterEggSeen } from '../utils/easterEggState'

export const treeCommand: Command = {
  name: 'tree',
  description: 'Display directory tree',
  aliases: [],
  usage: 'tree',
  handler: () => {
    const fs = getGlobalFilesystem()
    if (!fs) {
      return { success: false, error: 'Filesystem not initialized' }
    }

    const lines = fs.tree()
    
    // Mark easter egg as seen if .c0rrupt3d is in the tree output
    if (lines.some(line => line.includes('.c0rrupt3d'))) {
      markEasterEggSeen()
    }

    return {
      success: true,
      output: (
        <pre className="font-mono text-terminal-text whitespace-pre">
          {lines.map((line, i) => {
            // Highlight directories
            const isDir = line.endsWith('/')
            return (
              <div key={i} className={isDir ? 'text-terminal-accent' : ''}>
                {line}
              </div>
            )
          })}
        </pre>
      ),
    }
  },
}
