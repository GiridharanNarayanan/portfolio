import { getAllCommands } from '../../../commands/registry';
import { cn } from '../../../utils/cn';
import type { Command } from '../../../types/Command.types';

interface MobileCommandItemProps {
  command: Command;
  onSelect: (command: string, args?: string[]) => void;
  className?: string;
}

/**
 * MobileCommandItem - Touch-friendly command button
 * 
 * Features:
 * - 44px minimum touch target
 * - Visual feedback on tap
 * - Sub-selection for parameterized commands
 */
export function MobileCommandItem({ command, onSelect, className }: MobileCommandItemProps) {
  const handleTap = () => {
    onSelect(command.name);
  };

  return (
    <button
      type="button"
      onClick={handleTap}
      className={cn(
        'mobile-command-item',
        'w-full min-h-[44px] px-4 py-3',
        'flex items-center justify-between gap-3',
        'text-left',
        'bg-terminal-bg hover:bg-terminal-muted/20',
        'active:bg-terminal-accent/20',
        'border-b border-terminal-border last:border-b-0',
        'transition-colors duration-150',
        className
      )}
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-mono text-terminal-accent font-bold">
            {command.name}
          </span>
          {command.aliases && command.aliases.length > 0 && (
            <span className="text-xs text-terminal-muted">
              ({command.aliases.slice(0, 2).join(', ')})
            </span>
          )}
        </div>
        <p className="text-sm text-terminal-muted truncate mt-0.5">
          {command.description}
        </p>
      </div>
      <span className="text-terminal-secondary text-lg shrink-0 font-mono">{'[>]'}</span>
    </button>
  );
}

interface MobileCommandDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onCommandSelect: (command: string) => void;
}

/**
 * MobileCommandDrawer - Bottom sheet for command selection
 * 
 * Features:
 * - Scrollable command list
 * - 44px minimum touch targets
 * - Backdrop tap to close
 * - Smooth animations
 */
export function MobileCommandDrawer({ isOpen, onClose, onCommandSelect }: MobileCommandDrawerProps) {
  const commands = getAllCommands();

  const handleCommandSelect = (commandName: string) => {
    onCommandSelect(commandName);
    onClose();
  };

  const handleBackdropClick = () => {
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="mobile-command-drawer fixed inset-0 z-50">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={handleBackdropClick}
        aria-hidden="true"
      />
      
      {/* Drawer */}
      <div
        className={cn(
          'absolute bottom-0 left-0 right-0',
          'max-h-[70vh]',
          'bg-terminal-bg border-t border-terminal-border',
          'rounded-t-lg',
          'flex flex-col',
          'animate-in slide-in-from-bottom duration-200'
        )}
        role="dialog"
        aria-modal="true"
        aria-label="Command menu"
      >
        {/* Handle */}
        <div className="flex justify-center py-2">
          <div className="w-10 h-1 bg-terminal-border rounded-full" />
        </div>

        {/* Header */}
        <div className="px-4 pb-3 border-b border-terminal-border">
          <h2 className="text-terminal-accent font-bold">Available Commands</h2>
          <p className="text-xs text-terminal-muted mt-1">
            Tap a command to execute
          </p>
        </div>

        {/* Command List */}
        <div className="flex-1 overflow-y-auto overscroll-contain">
          {commands.map((command: Command) => (
            <MobileCommandItem
              key={command.name}
              command={command}
              onSelect={handleCommandSelect}
            />
          ))}
        </div>

        {/* Close button */}
        <div className="p-3 border-t border-terminal-border">
          <button
            type="button"
            onClick={onClose}
            className={cn(
              'w-full min-h-[44px] px-4 py-3',
              'font-mono text-terminal-muted',
              'bg-terminal-muted/10 hover:bg-terminal-muted/20',
              'rounded border border-terminal-border',
              'transition-colors'
            )}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default MobileCommandDrawer;
