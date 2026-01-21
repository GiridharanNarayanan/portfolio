/**
 * ASCII Art for StartupScreen
 * "GIRID" in large block letters with terminal aesthetic
 */

export const GIRID_ASCII = `
 ██████╗  ██╗ ██████╗  ██╗ ██████╗ 
██╔════╝  ██║ ██╔══██╗ ██║ ██╔══██╗
██║  ███╗ ██║ ██████╔╝ ██║ ██║  ██║
██║   ██║ ██║ ██╔══██╗ ██║ ██║  ██║
╚██████╔╝ ██║ ██║  ██║ ██║ ██████╔╝
 ╚═════╝  ╚═╝ ╚═╝  ╚═╝ ╚═╝ ╚═════╝ 
`.trim()

export const TERMINAL_BORDER = {
  topLeft: '╔',
  topRight: '╗',
  bottomLeft: '╚',
  bottomRight: '╝',
  horizontal: '═',
  vertical: '║',
}

/**
 * Simple ASCII border frame
 */
export function createBorderFrame(width: number): {
  top: string
  bottom: string
  side: string
} {
  const inner = TERMINAL_BORDER.horizontal.repeat(width - 2)
  return {
    top: `${TERMINAL_BORDER.topLeft}${inner}${TERMINAL_BORDER.topRight}`,
    bottom: `${TERMINAL_BORDER.bottomLeft}${inner}${TERMINAL_BORDER.bottomRight}`,
    side: TERMINAL_BORDER.vertical,
  }
}
