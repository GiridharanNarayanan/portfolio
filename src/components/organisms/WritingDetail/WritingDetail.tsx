import { useMarkdownItem } from '../../../hooks/useMarkdownContent';
import { ContentViewer } from '../ContentViewer';

interface WritingDetailProps {
  slug: string;
}

/**
 * WritingDetail - Display a single writing/article
 * 
 * Features:
 * - Loads specific writing by slug
 * - Uses ContentViewer for markdown rendering
 * - Featured image display
 * - Back command hint
 */
export function WritingDetail({ slug }: WritingDetailProps) {
  const { item, loading, error, found } = useMarkdownItem('writings', slug);

  if (loading) {
    return (
      <div className="writing-detail animate-pulse">
        <div className="text-terminal-muted">Loading article...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="writing-detail">
        <div className="text-terminal-error">Error loading article: {error}</div>
        <p className="text-terminal-muted mt-2">
          Type <code className="text-terminal-accent">writings</code> to see available articles.
        </p>
      </div>
    );
  }

  if (!found || !item) {
    return (
      <div className="writing-detail">
        <div className="text-terminal-error">
          Article not found: <span className="text-terminal-accent">{slug}</span>
        </div>
        <p className="text-terminal-muted mt-2">
          Type <code className="text-terminal-accent">writings</code> to see available articles.
        </p>
      </div>
    );
  }

  return (
    <div className="writing-detail">
      <ContentViewer content={item} />
    </div>
  );
}

export default WritingDetail;
