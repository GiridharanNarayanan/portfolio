/**
 * pwd command - Print working directory
 */

import type { Command } from '../types/Command.types'
import { getGlobalFilesystem } from '../context/FilesystemContext'

export const pwdCommand: Command = {
  name: 'pwd',
  description: 'Print current directory',
  aliases: [],
  usage: 'pwd',
  handler: () => {
    const fs = getGlobalFilesystem()
    if (!fs) {
      return { success: false, error: 'Filesystem not initialized' }
    }

    return {
      success: true,
      output: (
        <div className="font-mono text-terminal-text">
          {fs.pwd()}
        </div>
      ),
    }
  },
}
