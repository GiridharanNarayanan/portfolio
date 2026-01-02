import { cn } from '../../../utils/cn';

interface TagProps {
  /** Tag text content */
  children: string;
  /** Visual variant */
  variant?: 'default' | 'accent' | 'muted';
  /** Additional CSS classes */
  className?: string;
}

/**
 * Tag - Terminal-styled tag component for tech stack and categories
 * 
 * Features:
 * - Monospace font styling
 * - Multiple color variants
 * - Compact sizing
 */
export function Tag({ children, variant = 'default', className }: TagProps) {
  const variantStyles = {
    default: 'bg-terminal-muted/30 text-terminal-text',
    accent: 'bg-terminal-accent/20 text-terminal-accent',
    muted: 'bg-terminal-muted/20 text-terminal-muted',
  };

  return (
    <span
      className={cn(
        'tag',
        'inline-flex items-center',
        'px-2 py-0.5',
        'text-xs font-mono',
        'rounded',
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  );
}

export default Tag;
