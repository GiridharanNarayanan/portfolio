import { registerCommand } from './registry';
import type { Command } from '../types/Command.types';
import { TravelList } from '../components/organisms/TravelList';
import { TravelDetail } from '../components/organisms/TravelDetail';

/**
 * travel command - Display list of all travel entries
 */
export const travelCommand: Command = {
  name: 'travel',
  description: 'View travel stories and adventures',
  aliases: ['trips', 'adventures', 'journeys'],
  handler: () => ({
    success: true,
    output: <TravelList />,
    clearOutput: true,
  }),
};

/**
 * explore command - Display a specific travel entry by slug
 */
export const exploreCommand: Command = {
  name: 'explore',
  description: 'Explore a travel story (usage: explore <slug>)',
  usage: 'explore <slug>',
  handler: (args) => {
    const slug = args[0];
    
    if (!slug) {
      return {
        success: false,
        output: (
          <div className="text-terminal-error">
            <p>Usage: explore &lt;slug&gt;</p>
            <p className="text-terminal-muted mt-2">
              Example: <code className="text-terminal-accent">explore sample-trip</code>
            </p>
            <p className="text-terminal-muted mt-1">
              Tip: Type <code className="text-terminal-accent">travel</code> to see available stories.
            </p>
          </div>
        ),
      };
    }
    
    return {
      success: true,
      output: <TravelDetail slug={slug} />,
      clearOutput: true,
      newContext: { currentView: 'detail', contentId: slug },
    };
  },
};

// Register commands
registerCommand(travelCommand);
registerCommand(exploreCommand);

export { travelCommand as default };
