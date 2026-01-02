/**
 * cat command - Display file contents
 */

import type { Command } from '../types/Command.types'
import { getGlobalFilesystem } from '../context/FilesystemContext'
import { WritingDetail } from '../components/organisms/WritingDetail'
import { ProjectDetail } from '../components/organisms/ProjectDetail'
import { AboutView } from '../components/organisms/AboutView'
import aboutContent from '../content/static/about.json'
import type { AboutContent } from '../types/About.types'

export const catCommand: Command = {
  name: 'cat',
  description: 'Display file contents',
  aliases: ['read', 'open', 'view'],
  usage: 'cat <filename>',
  handler: (args) => {
    const fs = getGlobalFilesystem()
    if (!fs) {
      return { success: false, error: 'Filesystem not initialized' }
    }

    if (!args[0]) {
      return {
        success: false,
        error: 'Usage: cat <filename>',
      }
    }

    const path = args[0]
    const node = fs.getNode(path)

    if (!node) {
      return {
        success: false,
        error: `cat: ${path}: No such file or directory`,
      }
    }

    if (node.type === 'directory') {
      return {
        success: false,
        error: `cat: ${path}: Is a directory`,
      }
    }

    // Render appropriate content based on type
    switch (node.contentType) {
      case 'about':
        return {
          success: true,
          output: <AboutView content={aboutContent as AboutContent} />,
        }

      case 'writing':
        return {
          success: true,
          output: <WritingDetail slug={node.content!} />,
        }

      case 'project':
        return {
          success: true,
          output: <ProjectDetail slug={node.content!} />,
        }

      case 'contact':
        // Contact is now part of whoami, redirect there
        return {
          success: true,
          output: (
            <div className="font-mono text-terminal-muted">
              Contact information is available in whoami.md
              <br />
              <span className="text-terminal-accent">Tip:</span> cat whoami.md
            </div>
          ),
        }

      default:
        return {
          success: false,
          error: `cat: ${path}: Unknown file type`,
        }
    }
  },
}
