import { useMarkdownItem } from '../../../hooks/useMarkdownContent';
import { ContentViewer } from '../ContentViewer';

interface ProjectDetailProps {
  slug: string;
}

/**
 * ProjectDetail - Display a single project
 * 
 * Features:
 * - Loads specific project by slug
 * - Uses ContentViewer for markdown rendering
 * - Tech stack display
 * - External links (demo, repo)
 * - Image gallery
 */
export function ProjectDetail({ slug }: ProjectDetailProps) {
  const { item, loading, error, found } = useMarkdownItem('projects', slug);

  if (loading) {
    return (
      <div className="project-detail animate-pulse">
        <div className="text-terminal-muted">Loading project...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="project-detail">
        <div className="text-terminal-error">Error loading project: {error}</div>
        <p className="text-terminal-muted mt-2">
          Type <code className="text-terminal-accent">projects</code> to see available projects.
        </p>
      </div>
    );
  }

  if (!found || !item) {
    return (
      <div className="project-detail">
        <div className="text-terminal-error">
          Project not found: <span className="text-terminal-accent">{slug}</span>
        </div>
        <p className="text-terminal-muted mt-2">
          Type <code className="text-terminal-accent">projects</code> to see available projects.
        </p>
      </div>
    );
  }

  return (
    <div className="project-detail">
      <ContentViewer content={item} />
    </div>
  );
}

export default ProjectDetail;
