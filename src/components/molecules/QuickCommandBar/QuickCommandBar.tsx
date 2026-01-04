/**
 * QuickCommandBar Component
 * Bottom toolbar with frequently used commands for mobile
 */

import { cn } from '../../../utils/cn'

export interface QuickCommand {
  /** Display label */
  label: string
  /** Command to execute */
  command: string
  /** Icon or symbol */
  icon?: string
}

export interface QuickCommandBarProps {
  /** Callback when command is selected */
  onCommandSelect: (command: string) => void
  /** Current directory path */
  currentPath?: string
  /** Custom class name */
  className?: string
}

const DEFAULT_QUICK_COMMANDS: QuickCommand[] = [
  { label: 'ls', command: 'ls', icon: '[>]' },
  { label: '..', command: 'cd ..', icon: '[^]' },
  { label: '~', command: 'cd ~', icon: '[~]' },
  { label: 'help', command: 'help', icon: '[?]' },
  { label: 'theme', command: 'theme', icon: '[*]' },
]

/**
 * Quick access command bar for mobile navigation
 */
export function QuickCommandBar({
  onCommandSelect,
  currentPath = '~',
  className,
}: QuickCommandBarProps) {
  // Determine if we're at home directory
  const isAtHome = currentPath === '~' || currentPath === '/home/girid'

  return (
    <div
      className={cn(
        'quick-command-bar',
        'flex items-center justify-around gap-1',
        'px-2 py-2',
        'bg-terminal-bg border-t border-terminal-border',
        className
      )}
    >
      {DEFAULT_QUICK_COMMANDS.map((cmd) => {
        // Disable "cd .." at home, and "cd ~" when already at home
        const isDisabled = 
          (cmd.command === 'cd ..' && isAtHome) ||
          (cmd.command === 'cd ~' && isAtHome)

        return (
          <button
            key={cmd.command}
            type="button"
            onClick={() => onCommandSelect(cmd.command)}
            disabled={isDisabled}
            className={cn(
              'quick-command-btn',
              'flex flex-col items-center justify-center',
              'min-w-[56px] min-h-[48px]',
              'px-3 py-2',
              'font-mono text-xs',
              'rounded-lg',
              'transition-all duration-150',
              isDisabled
                ? 'text-terminal-muted/40 cursor-not-allowed'
                : [
                    'text-terminal-text',
                    'hover:bg-terminal-accent/10',
                    'active:bg-terminal-accent/20 active:scale-95',
                  ]
            )}
            aria-label={`Run ${cmd.command}`}
          >
            <span className="text-sm text-terminal-accent-secondary font-mono" aria-hidden="true">
              {cmd.icon}
            </span>
            <span className="text-terminal-accent font-bold">{cmd.label}</span>
          </button>
        )
      })}
    </div>
  )
}

export default QuickCommandBar
