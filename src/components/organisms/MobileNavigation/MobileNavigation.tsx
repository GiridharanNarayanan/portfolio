import { QuickCommandBar } from '../../molecules/QuickCommandBar';
import { MobileTerminalInput } from '../../molecules/MobileTerminalInput';
import { cn } from '../../../utils/cn';

interface MobileNavigationProps {
  onCommandExecute: (command: string) => void;
  currentPath?: string;
  className?: string;
}

/**
 * MobileNavigation - Touch-friendly navigation for mobile devices
 * 
 * Features:
 * - Quick command bar with common actions
 * - Expandable input field for custom commands
 */
export function MobileNavigation({ 
  onCommandExecute, 
  currentPath = '~',
  className 
}: MobileNavigationProps) {
  const handleCommandSelect = (command: string) => {
    onCommandExecute(command);
  };

  return (
    <>
      {/* Fixed bottom navigation */}
      <div
        className={cn(
          'mobile-navigation',
          'fixed bottom-0 left-0 right-0',
          'bg-terminal-bg border-t border-terminal-border',
          'safe-area-inset-bottom',
          'z-40',
          className
        )}
      >
        {/* Quick command bar */}
        <QuickCommandBar 
          onCommandSelect={handleCommandSelect}
          currentPath={currentPath}
        />
        
        {/* Input row */}
        <div className="px-3 pb-3">
          <MobileTerminalInput 
            onSubmit={handleCommandSelect}
            placeholder="Type command..."
          />
        </div>
      </div>

      {/* Spacer to prevent content from being hidden behind fixed nav */}
      <div className="h-32" aria-hidden="true" />
    </>
  );
}

export default MobileNavigation;
