/**
 * Virtual Filesystem for Terminal Portfolio
 * Simulates a Unix-like filesystem structure
 */

export interface FileNode {
  name: string
  type: 'file' | 'directory'
  content?: string // For files: the slug or content identifier
  contentType?: 'writing' | 'project' | 'about' | 'contact' | 'easter-egg' // Type of content
  hidden?: boolean // Hidden/corrupt file styling
  children?: FileNode[]
}

/**
 * The virtual filesystem structure
 * Dynamically built from content
 */
export function buildFilesystem(
  writings: { slug: string; title: string }[],
  projects: { slug: string; title: string }[],
  showHiddenEasterEgg: boolean = false
): FileNode {
  const children: FileNode[] = [
    {
      name: 'whoami.md',
      type: 'file',
      content: 'about',
      contentType: 'about',
    },
    {
      name: 'writings',
      type: 'directory',
      children: writings.map((w) => ({
        name: `${w.slug}.md`,
        type: 'file' as const,
        content: w.slug,
        contentType: 'writing' as const,
      })),
    },
    {
      name: 'projects',
      type: 'directory',
      children: projects.map((p) => ({
        name: `${p.slug}.md`,
        type: 'file' as const,
        content: p.slug,
        contentType: 'project' as const,
      })),
    },
  ]

  // Add hidden easter egg file when revealed
  if (showHiddenEasterEgg) {
    children.push({
      name: '.c0rrupt3d',
      type: 'file',
      content: 'spyonhim',
      contentType: 'easter-egg',
      hidden: true,
    })
  }

  return {
    name: '~',
    type: 'directory',
    children,
  }
}

/**
 * Resolve a path relative to current directory
 * Handles: ~, .., ., absolute paths, relative paths
 */
export function resolvePath(currentPath: string, targetPath: string): string {
  // Handle empty path
  if (!targetPath || targetPath === '.') {
    return currentPath
  }

  // Handle home directory
  if (targetPath === '~' || targetPath === '/') {
    return '~'
  }

  // Handle absolute path from home
  if (targetPath.startsWith('~/')) {
    return normalizePath('~/' + targetPath.slice(2))
  }

  // Handle going up
  if (targetPath === '..') {
    const parts = currentPath.split('/').filter(Boolean)
    if (parts.length <= 1) return '~'
    return parts.slice(0, -1).join('/') || '~'
  }

  // Handle paths starting with ..
  if (targetPath.startsWith('../')) {
    const upPath = resolvePath(currentPath, '..')
    return resolvePath(upPath, targetPath.slice(3))
  }

  // Handle relative path
  if (currentPath === '~') {
    return `~/${targetPath}`
  }
  return normalizePath(`${currentPath}/${targetPath}`)
}

/**
 * Normalize a path (remove double slashes, trailing slashes)
 */
function normalizePath(path: string): string {
  return path
    .replace(/\/+/g, '/')
    .replace(/\/$/, '')
    || '~'
}

/**
 * Get a node from the filesystem by path
 */
export function getNodeAtPath(root: FileNode, path: string): FileNode | null {
  if (path === '~' || path === '') {
    return root
  }

  const parts = path.replace(/^~\/?/, '').split('/').filter(Boolean)
  let current: FileNode | undefined = root

  for (const part of parts) {
    if (current?.type !== 'directory' || !current.children) {
      return null
    }
    current = current.children.find((c) => c.name === part || c.name === `${part}.md`)
  }

  return current || null
}

/**
 * Check if a path exists and is a directory
 */
export function isDirectory(root: FileNode, path: string): boolean {
  const node = getNodeAtPath(root, path)
  return node?.type === 'directory'
}

/**
 * Check if a path exists and is a file
 */
export function isFile(root: FileNode, path: string): boolean {
  const node = getNodeAtPath(root, path)
  return node?.type === 'file'
}

/**
 * List contents of a directory
 */
export function listDirectory(root: FileNode, path: string): FileNode[] | null {
  const node = getNodeAtPath(root, path)
  if (node?.type !== 'directory') {
    return null
  }
  return node.children || []
}

/**
 * Format a file listing for display (like ls -la)
 */
export function formatListing(nodes: FileNode[]): string[] {
  return nodes.map((node) => {
    if (node.type === 'directory') {
      return `${node.name}/`
    }
    return node.name
  })
}

/**
 * Generate tree output
 */
export function generateTree(node: FileNode, prefix: string = '', isLast: boolean = true): string[] {
  const lines: string[] = []
  const connector = isLast ? '└── ' : '├── '
  const display = node.type === 'directory' ? `${node.name}/` : node.name
  
  if (node.name !== '~') {
    lines.push(prefix + connector + display)
  } else {
    lines.push('~/')
  }

  if (node.type === 'directory' && node.children) {
    const newPrefix = node.name === '~' ? '' : prefix + (isLast ? '    ' : '│   ')
    node.children.forEach((child, index) => {
      const isLastChild = index === node.children!.length - 1
      lines.push(...generateTree(child, newPrefix, isLastChild))
    })
  }

  return lines
}
