import { useMarkdownContent } from '../../../hooks/useMarkdownContent';
import { ContentCard } from '../../molecules/ContentCard';
import type { ContentItem } from '../../../types/Content.types';

/**
 * WritingsList - Display list of all writings/blog posts
 * 
 * Features:
 * - Loads all writings from markdown files
 * - Displays each as a ContentCard
 * - Terminal-styled formatting
 * - Shows command hints for reading articles
 */
export function WritingsList() {
  const { items, loading, error } = useMarkdownContent('writings');

  if (loading) {
    return (
      <div className="writings-list animate-pulse">
        <div className="text-terminal-muted">Loading writings...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="writings-list">
        <div className="text-terminal-error">Error loading writings: {error}</div>
        <p className="text-terminal-muted mt-2">
          Try refreshing or type <code className="text-terminal-accent">help</code> for other commands.
        </p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="writings-list">
        <div className="text-terminal-muted">No writings found yet.</div>
        <p className="text-terminal-muted mt-2">
          Check back soon for new articles!
        </p>
      </div>
    );
  }

  return (
    <div className="writings-list">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-terminal-accent mb-2">
          ~/writings
        </h2>
        <p className="text-terminal-muted text-sm">
          {items.length} article{items.length !== 1 ? 's' : ''} found
        </p>
      </div>

      {/* Writings Grid */}
      <div className="space-y-4">
        {items.map((item: ContentItem, idx: number) => (
          <ContentCard
            key={item.slug}
            item={item}
            index={idx + 1}
            commandHint={`read ${idx + 1}`}
          />
        ))}
      </div>

      {/* Help hint */}
      <div className="mt-6 pt-4 border-t border-terminal-border text-sm text-terminal-muted">
        <span className="text-terminal-secondary">Tip:</span> Type{' '}
        <code className="px-1 bg-terminal-muted/30 rounded">read &lt;#&gt;</code>{' '}
        to read an article (e.g., <code className="px-1 bg-terminal-muted/30 rounded">read 1</code>)
      </div>
    </div>
  );
}

export default WritingsList;
