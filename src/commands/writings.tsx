import type { Command } from '../types/Command.types';
import { WritingsList } from '../components/organisms/WritingsList';

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
  }),
};

export { writingsCommand as default };
