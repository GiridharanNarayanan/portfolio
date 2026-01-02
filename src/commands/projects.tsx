import type { Command } from '../types/Command.types';
import { ProjectsList } from '../components/organisms/ProjectsList';

/**
 * projects command - Display list of all projects
 */
export const projectsCommand: Command = {
  name: 'projects',
  description: 'View all projects and portfolio work',
  aliases: ['work', 'portfolio'],
  handler: () => ({
    success: true,
    output: <ProjectsList />,
  }),
};

export { projectsCommand as default };
