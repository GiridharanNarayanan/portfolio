import { registerCommand } from './registry';
import type { Command } from '../types/Command.types';
import { TravelList } from '../components/organisms/TravelList';

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

// Register command
registerCommand(travelCommand);

export { travelCommand as default };
