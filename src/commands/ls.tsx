/**
 * ls command - List directory contents
 */

import type { Command } from '../types/Command.types'
import { getGlobalFilesystem } from '../context/FilesystemContext'
import { CorruptedFile } from '../components/atoms/CorruptedFile'

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

    const result = fs.ls(args[0])
    
    if (!result.success) {
      return { success: false, error: result.error }
    }

    const items = result.items || []
    
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
        <pre className="font-mono whitespace-pre">
          {items.map((item, i) => {
            const isLast = i === items.length - 1
            const connector = isLast ? '└── ' : '├── '
            const isDir = item.endsWith('/')
            const isCorrupted = item.startsWith('.')
            
            return (
              <div key={i} className={isDir ? 'text-terminal-accent' : 'text-terminal-text'}>
                {connector}
                {isCorrupted ? <CorruptedFile name={item} /> : item}
              </div>
            )
          })}
        </pre>
      ),
    }
  },
}
