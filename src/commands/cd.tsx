/**
 * cd command - Change directory
 */

import type { Command } from '../types/Command.types'
import { getGlobalFilesystem } from '../context/FilesystemContext'

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
    const items = lsResult.items || []

    return {
      success: true,
      output: (
        <pre className="font-mono whitespace-pre">
          {items.length === 0 ? (
            <div className="text-terminal-muted">(empty directory)</div>
          ) : (
            <>
              {items.map((item, i) => {
                const isLast = i === items.length - 1
                const connector = isLast ? '└── ' : '├── '
                const isDir = item.endsWith('/')
                return (
                  <div key={i} className={isDir ? 'text-terminal-accent' : 'text-terminal-text'}>
                    {connector}{item}
                  </div>
                )
              })}
            </>
          )}
        </pre>
      ),
      newContext: { currentPath: result.newPath },
    }
  },
}
