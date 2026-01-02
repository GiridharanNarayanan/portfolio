import { registerCommand } from './registry';
import type { Command } from '../types/Command.types';
import { ProjectsList } from '../components/organisms/ProjectsList';
import { ProjectDetail } from '../components/organisms/ProjectDetail';

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
    clearOutput: true,
  }),
};

/**
 * view command - Display a specific project by slug
 */
export const viewCommand: Command = {
  name: 'view',
  description: 'View a specific project (usage: view <slug>)',
  usage: 'view <slug>',
  handler: (args) => {
    const slug = args[0];
    
    if (!slug) {
      return {
        success: false,
        output: (
          <div className="text-terminal-error">
            <p>Usage: view &lt;slug&gt;</p>
            <p className="text-terminal-muted mt-2">
              Example: <code className="text-terminal-accent">view sample-project</code>
            </p>
            <p className="text-terminal-muted mt-1">
              Tip: Type <code className="text-terminal-accent">projects</code> to see available projects.
            </p>
          </div>
        ),
      };
    }
    
    return {
      success: true,
      output: <ProjectDetail slug={slug} />,
      clearOutput: true,
      newContext: { currentView: 'detail', contentId: slug },
    };
  },
};

// Register commands
registerCommand(projectsCommand);
registerCommand(viewCommand);

export { projectsCommand as default };
