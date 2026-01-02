import { registerCommand } from './registry';
import type { Command } from '../types/Command.types';
import { WritingsList } from '../components/organisms/WritingsList';
import { WritingDetail } from '../components/organisms/WritingDetail';

/**
 * writings command - Display list of all writings
 */
export const writingsCommand: Command = {
  name: 'writings',
  description: 'View all blog posts and articles',
  aliases: ['blog', 'posts', 'articles'],
  handler: () => ({
    success: true,
    output: <WritingsList />,
    clearOutput: true,
  }),
};

/**
 * read command - Display a specific writing by slug
 */
export const readCommand: Command = {
  name: 'read',
  description: 'Read a specific article (usage: read <slug>)',
  aliases: ['view', 'open'],
  usage: 'read <slug>',
  handler: (args) => {
    const slug = args[0];
    
    if (!slug) {
      return {
        success: false,
        output: (
          <div className="text-terminal-error">
            <p>Usage: read &lt;slug&gt;</p>
            <p className="text-terminal-muted mt-2">
              Example: <code className="text-terminal-accent">read sample-post</code>
            </p>
            <p className="text-terminal-muted mt-1">
              Tip: Type <code className="text-terminal-accent">writings</code> to see available posts.
            </p>
          </div>
        ),
      };
    }
    
    return {
      success: true,
      output: <WritingDetail slug={slug} />,
      clearOutput: true,
      newContext: { currentView: 'detail', contentId: slug },
    };
  },
};

// Register commands
registerCommand(writingsCommand);
registerCommand(readCommand);

export { writingsCommand as default };
