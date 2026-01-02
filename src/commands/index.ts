/**
 * Commands barrel export
 */

export { registerCommand, getCommand, getAllCommands, getAvailableCommands, hasCommand, clearRegistry, initializeCommands } from './registry'
export { helpCommand } from './help'
export { clearCommand } from './clear'
export { themeCommand, setThemeToggle } from './theme'
export { writingsCommand } from './writings'
export { projectsCommand } from './projects'
export { viewCommand } from './view'
export { aboutCommand } from './about'
export { spyonhimCommand } from './spyonhim'

// Filesystem commands
export { lsCommand } from './ls'
export { cdCommand } from './cd'
export { pwdCommand } from './pwd'
export { treeCommand } from './tree'
export { catCommand } from './cat'

export type * from './types'
