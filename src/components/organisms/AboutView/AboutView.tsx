import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import type { AboutContent } from '../../../types/About.types'
import { CareerTimeline } from '../../molecules/CareerTimeline'
import { ResumeDownload } from '../../atoms/ResumeDownload'

export interface AboutViewProps {
  /** About page content */
  content: AboutContent
}

/**
 * AboutView
 * Rich About page with bio, resume download, and career timeline
 */
export function AboutView({ content }: AboutViewProps) {
  return (
    <div className="max-w-4xl mx-auto py-6 px-4" data-testid="about-view">
      {/* Bio Section */}
      <section className="mb-12" aria-labelledby="about-bio">
        <h2 id="about-bio" className="sr-only">About Me</h2>
        <div className="prose prose-invert max-w-none">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              h1: ({ children }) => (
                <h1 className="text-3xl font-bold text-terminal-accent mb-4">
                  {children}
                </h1>
              ),
              p: ({ children }) => (
                <p className="text-terminal-text-secondary mb-4 leading-relaxed">
                  {children}
                </p>
              ),
              blockquote: ({ children }) => (
                <blockquote className="border-l-4 border-terminal-accent pl-4 italic text-terminal-muted my-6">
                  {children}
                </blockquote>
              ),
              strong: ({ children }) => (
                <strong className="text-terminal-accent font-semibold">
                  {children}
                </strong>
              ),
              a: ({ href, children }) => (
                <a
                  href={href}
                  className="text-terminal-accent hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {children}
                </a>
              ),
            }}
          >
            {content.blurb}
          </ReactMarkdown>
        </div>
      </section>

      {/* Resume Download Section */}
      <section className="mb-12" aria-labelledby="resume-section">
        <h2 
          id="resume-section" 
          className="text-xl font-bold text-terminal-text mb-4 flex items-center gap-2"
        >
          <span className="text-terminal-accent">$</span> Resume
        </h2>
        <p className="text-terminal-muted text-sm mb-4">
          Download my full resume to learn more about my experience and skills.
        </p>
        <ResumeDownload url={content.resumeUrl} />
      </section>

      {/* Contact Section */}
      {content.contactLinks && content.contactLinks.length > 0 && (
        <section className="mb-12" aria-labelledby="contact-section">
          <h2 
            id="contact-section" 
            className="text-xl font-bold text-terminal-text mb-4 flex items-center gap-2"
          >
            <span className="text-terminal-accent">$</span> Get in Touch
          </h2>
          <p className="text-terminal-muted text-sm mb-4">
            I'm always open to interesting conversations and collaboration opportunities.
          </p>
          <div className="flex flex-wrap gap-4">
            {content.contactLinks.map((link) => (
              <a
                key={link.label}
                href={link.url}
                target={link.url.startsWith('mailto:') ? undefined : '_blank'}
                rel={link.url.startsWith('mailto:') ? undefined : 'noopener noreferrer'}
                className="flex items-center gap-2 px-4 py-2 border border-terminal-border rounded hover:bg-terminal-muted/20 transition-colors text-terminal-text hover:text-terminal-accent"
              >
                {link.icon && <span>{link.icon}</span>}
                <span>{link.label}</span>
                {!link.url.startsWith('mailto:') && (
                  <svg
                    className="w-3 h-3 text-terminal-muted"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                )}
              </a>
            ))}
          </div>
        </section>
      )}

      {/* Career Timeline Section */}
      <section aria-labelledby="career-section">
        <h2 
          id="career-section" 
          className="text-xl font-bold text-terminal-text mb-4 flex items-center gap-2"
        >
          <span className="text-terminal-accent">$</span> Career Timeline
        </h2>
        <p className="text-terminal-muted text-sm mb-6">
          My professional journey from education to the present.
        </p>
        <CareerTimeline entries={content.careerTimeline} />
      </section>

      {/* Help tip */}
      <div className="mt-8 pt-4 border-t border-terminal-border text-terminal-muted text-sm">
        <span className="text-terminal-accent">Tip:</span> Type{' '}
        <code className="text-terminal-accent">help</code> to see other available commands.
      </div>
    </div>
  )
}
