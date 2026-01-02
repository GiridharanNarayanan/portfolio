/**
 * tree command - Display directory tree
 */

import type { Command } from '../types/Command.types'
import { getGlobalFilesystem } from '../context/FilesystemContext'

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
