import { useMarkdownItem } from '../../../hooks/useMarkdownContent';
import { ContentViewer } from '../ContentViewer';

interface TravelDetailProps {
  slug: string;
}

/**
 * TravelDetail - Display a single travel story
 * 
 * Features:
 * - Loads specific travel entry by slug
 * - Uses ContentViewer for markdown rendering
 * - Location display
 * - Photo gallery
 * - Terminal-consistent styling
 */
export function TravelDetail({ slug }: TravelDetailProps) {
  const { item, loading, error, found } = useMarkdownItem('travel', slug);

  if (loading) {
    return (
      <div className="travel-detail animate-pulse">
        <div className="text-terminal-muted">Loading travel story...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="travel-detail">
        <div className="text-terminal-error">Error loading travel story: {error}</div>
        <p className="text-terminal-muted mt-2">
          Type <code className="text-terminal-accent">travel</code> to see available stories.
        </p>
      </div>
    );
  }

  if (!found || !item) {
    return (
      <div className="travel-detail">
        <div className="text-terminal-error">
          Travel story not found: <span className="text-terminal-accent">{slug}</span>
        </div>
        <p className="text-terminal-muted mt-2">
          Type <code className="text-terminal-accent">travel</code> to see available stories.
        </p>
      </div>
    );
  }

  return (
    <div className="travel-detail">
      <ContentViewer content={item} />
    </div>
  );
}

export default TravelDetail;
