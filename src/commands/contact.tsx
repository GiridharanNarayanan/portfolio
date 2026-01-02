import type { Command } from '../types/Command.types'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

// Import raw markdown content using Vite's ?raw query
import contactMarkdown from '../content/static/contact.md?raw'

/**
 * ContactView - Renders contact page with terminal-styled links
 */
function ContactView() {
  return (
    <div className="max-w-3xl mx-auto py-6 px-4" data-testid="contact-view">
      <div className="prose prose-invert max-w-none">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            h1: ({ children }) => (
              <h1 className="text-3xl font-bold text-terminal-accent mb-4">
                {children}
              </h1>
            ),
            h2: ({ children }) => (
              <h2 className="text-xl font-bold text-terminal-text mt-8 mb-4 flex items-center gap-2">
                <span className="text-terminal-accent">$</span>
                {children}
              </h2>
            ),
            p: ({ children }) => (
              <p className="text-terminal-text-secondary mb-4 leading-relaxed">
                {children}
              </p>
            ),
            ul: ({ children }) => (
              <ul className="space-y-3 my-4 list-none">
                {children}
              </ul>
            ),
            li: ({ children }) => (
              <li className="flex items-start gap-2 text-terminal-text-secondary">
                <span className="text-terminal-accent">▸</span>
                <span>{children}</span>
              </li>
            ),
            strong: ({ children }) => (
              <strong className="text-terminal-text font-semibold">
                {children}
              </strong>
            ),
            a: ({ href, children }) => (
              <a
                href={href}
                target={href?.startsWith('mailto:') ? undefined : '_blank'}
                rel={href?.startsWith('mailto:') ? undefined : 'noopener noreferrer'}
                className="text-terminal-accent hover:underline inline-flex items-center gap-1"
                data-testid="contact-link"
              >
                {children}
                {!href?.startsWith('mailto:') && (
                  <svg
                    className="w-3 h-3"
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
            ),
            blockquote: ({ children }) => (
              <blockquote className="border-l-4 border-terminal-accent pl-4 italic text-terminal-muted my-6">
                {children}
              </blockquote>
            ),
          }}
        >
          {contactMarkdown}
        </ReactMarkdown>
      </div>
    </div>
  )
}

/**
 * contact command - Display contact information with clickable links
 */
export const contactCommand: Command = {
  name: 'contact',
  description: 'View my contact information and social links',
  aliases: ['connect', 'social', 'email'],
  handler: () => ({
    success: true,
    output: <ContactView />,
    clearOutput: true,
  }),
}
