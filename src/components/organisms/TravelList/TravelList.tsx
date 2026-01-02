import { useMarkdownContent } from '../../../hooks/useMarkdownContent';
import { ContentCard } from '../../molecules/ContentCard';
import type { ContentItem } from '../../../types/Content.types';

/**
 * TravelList - Display list of all travel stories
 * 
 * Features:
 * - Loads all travel entries from markdown files
 * - Displays each as a ContentCard with location
 * - Terminal-styled formatting
 * - Shows command hints for exploring stories
 */
export function TravelList() {
  const { items, loading, error } = useMarkdownContent('travel');

  if (loading) {
    return (
      <div className="travel-list animate-pulse">
        <div className="text-terminal-muted">Loading travel stories...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="travel-list">
        <div className="text-terminal-error">Error loading travel stories: {error}</div>
        <p className="text-terminal-muted mt-2">
          Try refreshing or type <code className="text-terminal-accent">help</code> for other commands.
        </p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="travel-list">
        <div className="text-terminal-muted">No travel stories found yet.</div>
        <p className="text-terminal-muted mt-2">
          Adventures coming soon!
        </p>
      </div>
    );
  }

  return (
    <div className="travel-list">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-terminal-accent mb-2">
          ~/travel
        </h2>
        <p className="text-terminal-muted text-sm">
          {items.length} {items.length !== 1 ? 'adventures' : 'adventure'} found
        </p>
      </div>

      {/* Travel Grid */}
      <div className="space-y-4">
        {items.map((item: ContentItem) => (
          <ContentCard
            key={item.slug}
            item={item}
            commandHint={`explore ${item.slug}`}
          />
        ))}
      </div>

      {/* Help hint */}
      <div className="mt-6 pt-4 border-t border-terminal-border text-sm text-terminal-muted">
        <span className="text-terminal-secondary">Tip:</span> Type{' '}
        <code className="px-1 bg-terminal-muted/30 rounded">explore &lt;slug&gt;</code>{' '}
        to read a travel story
      </div>
    </div>
  );
}

export default TravelList;
