/**
 * Class Name Utility
 * Combines clsx and tailwind-merge for optimal class handling
 */

import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Merge class names with Tailwind CSS conflict resolution
 * 
 * @param inputs - Class names, arrays, or conditional objects
 * @returns Merged and deduplicated class string
 * 
 * @example
 * cn('px-2 py-1', 'px-4') // 'py-1 px-4' (px-4 overrides px-2)
 * cn('text-red-500', condition && 'text-blue-500')
 * cn(['base-class', 'another'], { 'conditional': isTrue })
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}
