import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import type { ContentItem } from '../../../types/Content.types';
import { cn } from '../../../utils/cn';
import { ThemedImage } from '../../atoms/ThemedImage';

interface ContentViewerProps {
  content: ContentItem;
  className?: string;
}

/**
 * ContentViewer - Renders markdown content with terminal styling
 * 
 * Features:
 * - react-markdown rendering with GFM support
 * - Featured image display at top
 * - Terminal-styled typography
 * - Scrollable content area
 * - Inline image support
 */
export function ContentViewer({ content, className }: ContentViewerProps) {
  return (
    <article
      className={cn(
        'content-viewer',
        'max-w-3xl mx-auto',
        'px-4 py-6',
        className
      )}
    >
      {/* Featured Image */}
      {content.featuredImage && (
        <figure className="mb-6">
          <ThemedImage
            src={content.featuredImage}
            alt={content.title}
            className="w-full h-auto rounded border border-terminal-border"
            loading="lazy"
          />
        </figure>
      )}

      {/* Header */}
      <header className="mb-6 pb-4 border-b border-terminal-border">
        <h1 className="text-2xl font-bold text-terminal-accent mb-2">
          {content.title}
        </h1>
        <div className="flex flex-wrap items-center gap-4 text-sm text-terminal-muted">
          <time dateTime={content.date}>
            {new Date(content.date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </time>
          {content.location && (
            <span className="flex items-center gap-1">
              <span className="text-terminal-secondary">📍</span>
              {content.location}
            </span>
          )}
        </div>

        {/* Tags and Read Time */}
        {(content.tags?.length || content.readTime) && (
          <div className="flex flex-wrap items-center gap-2 mt-3">
            {content.tags?.map((tag: string) => (
              <span
                key={tag}
                className="px-2 py-0.5 text-xs bg-terminal-muted/20 text-terminal-secondary rounded"
              >
                #{tag}
              </span>
            ))}
            {content.readTime && (
              <span className="ml-auto text-xs text-terminal-muted flex items-center gap-1">
                <span>⏱</span>
                {content.readTime}
              </span>
            )}
          </div>
        )}

        {/* Tech Stack (for projects) */}
        {content.techStack && content.techStack.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 mt-3">
            <span className="text-xs text-terminal-muted font-mono">Stack:</span>
            {content.techStack.map((tech: string) => (
              <span
                key={tech}
                className="px-2 py-0.5 text-xs bg-terminal-accent/20 text-terminal-accent rounded font-mono"
              >
                {tech}
              </span>
            ))}
          </div>
        )}
      </header>

      {/* Markdown Content */}
      <div className="prose prose-terminal max-w-none">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeRaw]}
          components={{
            // Headings
            h1: ({ children }) => (
              <h1 className="text-xl font-bold text-terminal-accent mt-8 mb-4">
                {children}
              </h1>
            ),
            h2: ({ children }) => (
              <h2 className="text-lg font-bold text-terminal-accent mt-6 mb-3">
                {children}
              </h2>
            ),
            h3: ({ children }) => (
              <h3 className="text-base font-bold text-terminal-secondary mt-4 mb-2">
                {children}
              </h3>
            ),
            
            // Paragraphs
            p: ({ children }) => (
              <p className="text-terminal-text mb-4 leading-relaxed">
                {children}
              </p>
            ),
            
            // Links
            a: ({ href, children }) => (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-terminal-accent hover:underline"
              >
                {children}
              </a>
            ),
            
            // Code
            code: ({ className, children }) => {
              const isInline = !className;
              if (isInline) {
                return (
                  <code className="px-1.5 py-0.5 bg-terminal-muted/30 text-terminal-secondary rounded font-mono text-sm">
                    {children}
                  </code>
                );
              }
              return (
                <code className={className}>
                  {children}
                </code>
              );
            },
            pre: ({ children }) => (
              <pre className="bg-terminal-muted/20 border border-terminal-border rounded p-4 overflow-x-auto my-4 font-mono text-sm">
                {children}
              </pre>
            ),
            
            // Lists
            ul: ({ children }) => (
              <ul className="list-disc list-inside mb-4 space-y-1 text-terminal-text">
                {children}
              </ul>
            ),
            ol: ({ children }) => (
              <ol className="list-decimal list-inside mb-4 space-y-1 text-terminal-text">
                {children}
              </ol>
            ),
            li: ({ children }) => (
              <li className="text-terminal-text">
                {children}
              </li>
            ),
            
            // Blockquotes
            blockquote: ({ children }) => (
              <blockquote className="border-l-4 border-terminal-accent pl-4 my-4 italic text-terminal-muted">
                {children}
              </blockquote>
            ),
            
            // Inline images rendered in a TUI terminal frame
            img: ({ src, alt }) => {
              const filename = src?.split('/').pop() || 'image';

              return (
                <figure className="my-6 font-mono text-sm">
                  {/* Terminal title bar */}
                  <div className="flex items-center bg-terminal-muted/30 border border-terminal-border border-b-0 rounded-t px-3 py-1.5">
                    <span className="text-terminal-muted mr-2">┌─</span>
                    <span className="text-terminal-secondary">{filename}</span>
                    <span className="text-terminal-muted ml-2">─┐</span>
                    <span className="ml-auto text-terminal-muted text-xs">[IMG]</span>
                  </div>
                  {/* Image content */}
                  <div className="border border-terminal-border border-t-0 rounded-b p-2 bg-terminal-bg/50">
                    <ThemedImage
                      src={src || ''}
                      alt={alt || ''}
                      className="w-full h-auto rounded"
                      loading="lazy"
                    />
                  </div>
                  {/* Caption */}
                  {alt && (
                    <figcaption className="text-terminal-muted mt-1.5 px-1">
                      <span className="text-terminal-secondary">{'>'}</span> {alt}
                    </figcaption>
                  )}
                </figure>
              );
            },
            
            // Tables (GFM)
            table: ({ children }) => (
              <div className="overflow-x-auto my-4">
                <table className="min-w-full border-collapse border border-terminal-border">
                  {children}
                </table>
              </div>
            ),
            thead: ({ children }) => (
              <thead className="bg-terminal-muted/20">
                {children}
              </thead>
            ),
            th: ({ children }) => (
              <th className="border border-terminal-border px-3 py-2 text-left text-terminal-accent font-bold">
                {children}
              </th>
            ),
            td: ({ children }) => (
              <td className="border border-terminal-border px-3 py-2 text-terminal-text">
                {children}
              </td>
            ),
            
            // Horizontal rule
            hr: () => (
              <hr className="border-terminal-border my-8" />
            ),
            
            // Strong and emphasis
            strong: ({ children }) => (
              <strong className="font-bold text-terminal-accent">
                {children}
              </strong>
            ),
            em: ({ children }) => (
              <em className="italic text-terminal-secondary">
                {children}
              </em>
            ),
          }}
        >
          {content.content}
        </ReactMarkdown>
      </div>

      {/* External Links (for projects) */}
      {content.links && (
        <footer className="mt-8 pt-4 border-t border-terminal-border">
          <h3 className="text-sm font-bold text-terminal-muted mb-3">Links</h3>
          <div className="flex flex-wrap gap-4">
            {content.links.demo && (
              <a
                href={content.links.demo}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-terminal-accent text-terminal-bg rounded hover:opacity-90 transition-opacity font-mono text-sm"
              >
                [#] Live Demo
              </a>
            )}
            {content.links.repo && (
              <a
                href={content.links.repo}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 border border-terminal-accent text-terminal-accent rounded hover:bg-terminal-accent hover:text-terminal-bg transition-colors font-mono text-sm"
              >
                {'[>]'} Repository
              </a>
            )}
          </div>
        </footer>
      )}

      {/* Gallery (for travel/projects) */}
      {content.gallery && content.gallery.length > 0 && (
        <section className="mt-8 pt-4 border-t border-terminal-border">
          <h3 className="text-sm font-bold text-terminal-muted mb-3">Gallery</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {content.gallery.map((image: string, index: number) => (
              <ThemedImage
                key={index}
                src={image}
                alt={`Gallery image ${index + 1}`}
                className="w-full h-32 object-cover rounded border border-terminal-border"
                loading="lazy"
              />
            ))}
          </div>
        </section>
      )}

      {/* Navigation hint */}
      <div className="mt-8 text-sm text-terminal-muted">
        <span className="text-terminal-secondary">Tip:</span> Type{' '}
        <code className="px-1 bg-terminal-muted/30 rounded">cd ~</code> to go home, or{' '}
        <code className="px-1 bg-terminal-muted/30 rounded">help</code> to see all commands
      </div>
    </article>
  );
}

export default ContentViewer;
