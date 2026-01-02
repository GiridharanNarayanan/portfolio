import type { ReactNode } from 'react'

export interface LinkProps {
  /** URL to link to */
  href: string
  /** Link content */
  children: ReactNode
  /** Whether the link opens in a new tab (default: true for external links) */
  external?: boolean
  /** Additional CSS classes */
  className?: string
}

/**
 * Link
 * Terminal-styled external link component
 */
export function Link({ href, children, external = true, className = '' }: LinkProps) {
  const isExternal = external || href.startsWith('http') || href.startsWith('mailto:')

  return (
    <a
      href={href}
      {...(isExternal && {
        target: '_blank',
        rel: 'noopener noreferrer',
      })}
      className={`
        text-terminal-accent hover:text-terminal-accent-hover
        underline underline-offset-2 decoration-terminal-accent/50
        hover:decoration-terminal-accent
        transition-colors duration-200
        inline-flex items-center gap-1
        ${className}
      `}
      data-testid="terminal-link"
    >
      {children}
      {isExternal && (
        <svg
          className="w-3 h-3 inline-block"
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
  )
}
