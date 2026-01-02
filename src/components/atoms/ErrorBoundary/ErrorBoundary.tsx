import { Component, type ErrorInfo, type ReactNode } from 'react'

interface ErrorBoundaryProps {
  /** Child components to render */
  children: ReactNode
  /** Optional fallback UI */
  fallback?: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

/**
 * ErrorBoundary
 * Catches JavaScript errors in child components and displays a fallback UI
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  handleReset = (): void => {
    this.setState({ hasError: false, error: null })
  }

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div 
          className="flex flex-col items-center justify-center p-8 text-center"
          role="alert"
          aria-live="assertive"
        >
          <div className="text-4xl mb-4">💥</div>
          <h2 className="text-xl font-bold text-terminal-error mb-2">
            Something went wrong
          </h2>
          <p className="text-terminal-muted mb-4 max-w-md">
            An unexpected error occurred. Don't worry, the terminal is still running.
          </p>
          <pre className="text-xs text-terminal-muted bg-terminal-bg-secondary p-4 rounded mb-4 max-w-md overflow-auto">
            {this.state.error?.message || 'Unknown error'}
          </pre>
          <button
            onClick={this.handleReset}
            className="px-4 py-2 bg-terminal-accent/20 hover:bg-terminal-accent/30 text-terminal-accent border border-terminal-accent rounded transition-colors"
          >
            Try Again
          </button>
        </div>
      )
    }

    return this.props.children
  }
}
