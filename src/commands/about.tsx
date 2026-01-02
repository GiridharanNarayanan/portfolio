import type { Command } from '../types/Command.types'
import { AboutView } from '../components/organisms/AboutView'
import aboutContent from '../content/static/about.json'
import type { AboutContent } from '../types/About.types'

/**
 * whoami command - Display the About page with bio, resume, and career timeline
 */
export const aboutCommand: Command = {
  name: 'whoami',
  description: 'Learn more about me, my resume, and career history',
  aliases: ['about', 'me', 'bio'],
  handler: () => ({
    success: true,
    output: <AboutView content={aboutContent as AboutContent} />,
  }),
}
