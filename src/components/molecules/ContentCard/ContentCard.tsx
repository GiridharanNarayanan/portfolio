import React from 'react';
import type { ContentItem } from '../../../types/Content.types';
import { cn } from '../../../utils/cn';

interface ContentCardProps {
  item: ContentItem;
  index?: number;
  onClick?: () => void;
  commandHint?: string;
  className?: string;
}

/**
 * ContentCard - Terminal-styled card for displaying content items
 * 
 * Features:
 * - Title, date, excerpt display
 * - Muted background terminal styling
 * - Click/command to view detail
 * - Tech stack tags for projects
 * - Location badge for travel
 */
export function ContentCard({ item, index, onClick, commandHint, className }: ContentCardProps) {
  const handleClick = () => {
    onClick?.();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick?.();
    }
  };

  return (
    <article
      className={cn(
        'content-card',
        'p-4 rounded border border-terminal-border',
        'bg-terminal-muted/10 hover:bg-terminal-muted/20',
        'transition-colors duration-200',
        onClick && 'cursor-pointer focus:outline-none focus:ring-2 focus:ring-terminal-accent',
        className
      )}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={onClick ? 0 : undefined}
      role={onClick ? 'button' : undefined}
    >
      {/* Header row with title and metadata */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-2">
        <h3 className="text-lg font-bold text-terminal-accent">
          {index !== undefined && (
            <span className="text-terminal-secondary font-mono mr-2">#{index}</span>
          )}
          {item.title}
        </h3>
        <div className="flex items-center gap-3 text-sm text-terminal-muted shrink-0">
          <time dateTime={item.date}>
            {new Date(item.date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })}
          </time>
          {item.location && (
            <span className="flex items-center gap-1">
              <span>📍</span>
              {item.location}
            </span>
          )}
        </div>
      </div>

      {/* Excerpt */}
      <p className="text-terminal-text text-sm mb-3 line-clamp-2">
        {item.excerpt}
      </p>

      {/* Tags row */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Tech stack tags (for projects) */}
        {item.techStack && item.techStack.length > 0 && (
          <>
            {item.techStack.slice(0, 5).map((tech: string) => (
              <span
                key={tech}
                className="px-2 py-0.5 text-xs bg-terminal-accent/20 text-terminal-accent rounded font-mono"
              >
                {tech}
              </span>
            ))}
            {item.techStack.length > 5 && (
              <span className="text-xs text-terminal-muted">
                +{item.techStack.length - 5} more
              </span>
            )}
          </>
        )}

        {/* Regular tags (for writings/travel) */}
        {item.tags && item.tags.length > 0 && !item.techStack?.length && (
          <>
            {item.tags.slice(0, 3).map((tag: string) => (
              <span
                key={tag}
                className="px-2 py-0.5 text-xs bg-terminal-muted/30 text-terminal-secondary rounded"
              >
                #{tag}
              </span>
            ))}
            {item.tags.length > 3 && (
              <span className="text-xs text-terminal-muted">
                +{item.tags.length - 3} more
              </span>
            )}
          </>
        )}

        {/* Read time indicator */}
        {item.readTime && (
          <span className="ml-auto text-xs text-terminal-muted flex items-center gap-1">
            <span>⏱</span>
            {item.readTime}
          </span>
        )}

        {/* Command hint */}
        {commandHint && (
          <span className="ml-auto text-xs text-terminal-muted font-mono">
            {'[>]'} {commandHint}
          </span>
        )}
      </div>

      {/* Featured image thumbnail (optional) */}
      {item.featuredImage && (
        <div className="mt-3 pt-3 border-t border-terminal-border">
          <img
            src={item.featuredImage}
            alt=""
            className="w-full h-24 object-cover rounded opacity-80"
            loading="lazy"
          />
        </div>
      )}
    </article>
  );
}

export default ContentCard;
