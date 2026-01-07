import type { Command } from '../types/Command.types';
import { WritingDetail } from '../components/organisms/WritingDetail';
import { ProjectDetail } from '../components/organisms/ProjectDetail';
import { isNumericIndex, getSlugByIndex, getContentIndex } from '../utils/contentIndex';

/**
 * Unified view command - Display any content by index number or slug
 * Automatically detects content type and shows appropriate detail view
 */
export const viewCommand: Command = {
  name: 'view',
  description: 'View any content by # or slug (usage: view <#> or view <slug>)',
  aliases: ['read', 'open', 'explore', 'show'],
  usage: 'view <#|slug>',
  handler: (args) => {
    const identifier = args[0];
    
    if (!identifier) {
      return {
        success: false,
        output: (
          <div className="text-terminal-error font-mono">
            <p>Usage: view &lt;#&gt; or view &lt;slug&gt;</p>
            <p className="text-terminal-muted mt-2">
              Example: <code className="text-terminal-accent">view 1</code> or <code className="text-terminal-accent">view heads-up</code>
            </p>
            <p className="text-terminal-muted mt-1">
              Tip: Type <code className="text-terminal-accent">cd writings</code> or <code className="text-terminal-accent">cd projects</code> then <code className="text-terminal-accent">ls</code> to browse content.
            </p>
          </div>
        ),
      };
    }
    
    // Return a unified content viewer that will try all content types
    return {
      success: true,
      output: <UnifiedContentView identifier={identifier} />,
      newContext: { currentView: 'detail', contentId: identifier },
    };
  },
};

/**
 * Unified content view component
 * Tries to render content from writings or projects based on identifier (number or slug)
 */
function UnifiedContentView({ identifier }: { identifier: string }) {
  // If numeric, resolve to slug
  if (isNumericIndex(identifier)) {
    const index = parseInt(identifier, 10);
    
    // Try writings first
    const writingsSlug = getSlugByIndex('writings', index);
    if (writingsSlug) {
      return <WritingDetail slug={writingsSlug} />;
    }
    
    // Try projects
    const projectsSlug = getSlugByIndex('projects', index);
    if (projectsSlug) {
      return <ProjectDetail slug={projectsSlug} />;
    }
    
    // Index not found - show helpful error with valid ranges
    const writingsCount = getContentIndex('writings').length;
    const projectsCount = getContentIndex('projects').length;
    
    return (
      <div className="font-mono" style={{ color: 'var(--color-error)' }}>
        <p>No content found at index #{identifier}</p>
        <p className="mt-2" style={{ color: 'var(--color-text-muted)' }}>
          Valid ranges:
        </p>
        <ul className="mt-1 ml-4" style={{ color: 'var(--color-text-muted)' }}>
          {writingsCount > 0 && (
            <li><code style={{ color: 'var(--color-accent)' }}>writings</code>: #1-{writingsCount}</li>
          )}
          {projectsCount > 0 && (
            <li><code style={{ color: 'var(--color-accent)' }}>projects</code>: #1-{projectsCount}</li>
          )}
        </ul>
        <p className="mt-2" style={{ color: 'var(--color-text-muted)' }}>
          Type <code style={{ color: 'var(--color-accent)' }}>writings</code> or <code style={{ color: 'var(--color-accent)' }}>projects</code> to see the list.
        </p>
      </div>
    );
  }
  
  // Not a number - treat as slug
  const slug = identifier;
  
  // Import content modules to check what exists
  const writingsModules = import.meta.glob('../content/writings/*.md', { eager: true, query: '?raw', import: 'default' }) as Record<string, string>;
  const projectsModules = import.meta.glob('../content/projects/*.md', { eager: true, query: '?raw', import: 'default' }) as Record<string, string>;
  
  // Check which content type has this slug
  const writingPath = Object.keys(writingsModules).find(path => path.includes(`/${slug}.md`));
  const projectPath = Object.keys(projectsModules).find(path => path.includes(`/${slug}.md`));
  
  if (writingPath) {
    return <WritingDetail slug={slug} />;
  }
  
  if (projectPath) {
    return <ProjectDetail slug={slug} />;
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
      </ul>
    </div>
  );
}

export { viewCommand as default };
