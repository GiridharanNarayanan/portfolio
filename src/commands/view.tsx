import { registerCommand } from './registry';
import type { Command } from '../types/Command.types';
import { WritingDetail } from '../components/organisms/WritingDetail';
import { ProjectDetail } from '../components/organisms/ProjectDetail';
import { TravelDetail } from '../components/organisms/TravelDetail';

/**
 * Unified view command - Display any content by slug
 * Automatically detects content type and shows appropriate detail view
 */
export const viewCommand: Command = {
  name: 'view',
  description: 'View any content by slug (usage: view <slug>)',
  aliases: ['read', 'open', 'explore', 'show'],
  usage: 'view <slug>',
  handler: (args) => {
    const slug = args[0];
    
    if (!slug) {
      return {
        success: false,
        output: (
          <div className="text-terminal-error font-mono">
            <p>Usage: view &lt;slug&gt;</p>
            <p className="text-terminal-muted mt-2">
              Example: <code className="text-terminal-accent">view sample-post</code>
            </p>
            <p className="text-terminal-muted mt-1">
              Tip: Type <code className="text-terminal-accent">writings</code>, <code className="text-terminal-accent">projects</code>, or <code className="text-terminal-accent">travel</code> to see available content.
            </p>
          </div>
        ),
      };
    }
    
    // Return a unified content viewer that will try all content types
    return {
      success: true,
      output: <UnifiedContentView slug={slug} />,
      clearOutput: true,
      newContext: { currentView: 'detail', contentId: slug },
    };
  },
};

/**
 * Unified content view component
 * Tries to render content from writings, projects, or travel based on slug
 */
function UnifiedContentView({ slug }: { slug: string }) {
  // Import content modules to check what exists
  const writingsModules = import.meta.glob('../content/writings/*.md', { eager: true, query: '?raw', import: 'default' }) as Record<string, string>;
  const projectsModules = import.meta.glob('../content/projects/*.md', { eager: true, query: '?raw', import: 'default' }) as Record<string, string>;
  const travelModules = import.meta.glob('../content/travel/*.md', { eager: true, query: '?raw', import: 'default' }) as Record<string, string>;
  
  // Check which content type has this slug
  const writingPath = Object.keys(writingsModules).find(path => path.includes(`/${slug}.md`));
  const projectPath = Object.keys(projectsModules).find(path => path.includes(`/${slug}.md`));
  const travelPath = Object.keys(travelModules).find(path => path.includes(`/${slug}.md`));
  
  if (writingPath) {
    return <WritingDetail slug={slug} />;
  }
  
  if (projectPath) {
    return <ProjectDetail slug={slug} />;
  }
  
  if (travelPath) {
    return <TravelDetail slug={slug} />;
  }
  
  // Content not found
  return (
    <div className="font-mono" style={{ color: 'var(--color-error)' }}>
      <p>Content not found: "{slug}"</p>
      <p className="mt-2" style={{ color: 'var(--color-text-muted)' }}>
        Available commands to browse content:
      </p>
      <ul className="mt-1 ml-4" style={{ color: 'var(--color-text-muted)' }}>
        <li><code style={{ color: 'var(--color-accent)' }}>writings</code> - View blog posts</li>
        <li><code style={{ color: 'var(--color-accent)' }}>projects</code> - View projects</li>
        <li><code style={{ color: 'var(--color-accent)' }}>travel</code> - View travel stories</li>
      </ul>
    </div>
  );
}

// Register command
registerCommand(viewCommand);

export { viewCommand as default };
