import { useState } from 'react';
import { MobileCommandDrawer } from '../MobileCommandDrawer';
import { cn } from '../../../utils/cn';

interface MobileNavigationProps {
  onCommandExecute: (command: string) => void;
  className?: string;
}

/**
 * MobileNavigation - Touch-friendly navigation for mobile devices
 * 
 * Features:
 * - Collapsed: "Tap for commands" prompt at bottom
 * - Expanded: Scrollable command drawer
 * - Touch event handling
 */
export function MobileNavigation({ onCommandExecute, className }: MobileNavigationProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleOpenDrawer = () => {
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
  };

  const handleCommandSelect = (command: string) => {
    onCommandExecute(command);
    setIsDrawerOpen(false);
  };

  return (
    <>
      {/* Command Bar (collapsed state) */}
      <div
        className={cn(
          'mobile-navigation',
          'fixed bottom-0 left-0 right-0',
          'bg-terminal-bg border-t border-terminal-border',
          'p-3',
          'safe-area-inset-bottom',
          className
        )}
      >
        <button
          type="button"
          onClick={handleOpenDrawer}
          className={cn(
            'w-full min-h-[44px] px-4 py-3',
            'flex items-center justify-center gap-2',
            'font-mono text-terminal-accent',
            'bg-terminal-muted/10 hover:bg-terminal-muted/20',
            'active:bg-terminal-accent/20',
            'rounded border border-terminal-border',
            'transition-colors'
          )}
        >
          <span className="text-terminal-secondary">$</span>
          <span>Tap for commands</span>
          <span className="text-terminal-muted animate-blink">_</span>
        </button>
      </div>

      {/* Command Drawer (expanded state) */}
      <MobileCommandDrawer
        isOpen={isDrawerOpen}
        onClose={handleCloseDrawer}
        onCommandSelect={handleCommandSelect}
      />
    </>
  );
}

export default MobileNavigation;
