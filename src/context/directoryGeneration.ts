/**
 * Directory Generation Tracker
 * 
 * Tracks a generation counter that increments whenever the user changes directory.
 * Used to mark historical command outputs as "stale" - once you navigate away,
 * all previous outputs become non-interactive.
 */

let currentGeneration = 0

/**
 * Get the current directory generation number
 */
export function getDirectoryGeneration(): number {
  return currentGeneration
}

/**
 * Increment the generation counter (called on directory change)
 * Returns the new generation number
 */
export function incrementDirectoryGeneration(): number {
  currentGeneration++
  return currentGeneration
}

/**
 * Reset generation to 0 (for testing or app reset)
 */
export function resetDirectoryGeneration(): void {
  currentGeneration = 0
}
