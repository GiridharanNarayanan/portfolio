import type { Command } from '../types/Command.types'
import { AboutView } from '../components/organisms/AboutView'
import aboutContent from '../content/static/about.json'
import type { AboutContent } from '../types/About.types'

/**
 * about command - Display the About page with bio, resume, and career timeline
 */
export const aboutCommand: Command = {
  name: 'about',
  description: 'Learn more about me, my resume, and career history',
  aliases: ['me', 'bio', 'whoami'],
  handler: () => ({
    success: true,
    output: <AboutView content={aboutContent as AboutContent} />,
    clearOutput: true,
  }),
}
