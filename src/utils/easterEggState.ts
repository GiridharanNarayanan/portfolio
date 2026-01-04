/**
 * Easter Egg State Manager
 * Tracks user behavior to reveal hidden content
 */

interface EasterEggState {
  lsCount: number
  homeVisits: number
  revealed: boolean
  consumed: boolean  // True after user has viewed the easter egg
}

// Session state (resets on page reload for mystery)
let state: EasterEggState = {
  lsCount: 0,
  homeVisits: 0, // Start at 0, first cd ~ will trigger
  revealed: false,
  consumed: false,
}

const REVEAL_THRESHOLD = {
  ls: 2,        // Reveal on 2nd ls
  homeVisits: 1, // Reveal on first cd ~
}

/**
 * Track ls command usage
 */
export function trackLsCommand(): void {
  state.lsCount++
  checkReveal()
}

/**
 * Track home directory visits
 */
export function trackHomeVisit(): void {
  state.homeVisits++
  checkReveal()
}

/**
 * Check if easter egg should be revealed
 */
function checkReveal(): void {
  if (state.revealed) return
  
  if (state.lsCount >= REVEAL_THRESHOLD.ls || state.homeVisits >= REVEAL_THRESHOLD.homeVisits) {
    state.revealed = true
  }
}

/**
 * Check if the hidden file should be visible
 * Only shows if revealed AND not yet consumed
 */
export function isEasterEggRevealed(): boolean {
  return state.revealed && !state.consumed
}

/**
 * Mark the easter egg as consumed (user has viewed it)
 */
export function consumeEasterEgg(): void {
  state.consumed = true
}

/**
 * Get current state (for debugging)
 */
export function getEasterEggState(): Readonly<EasterEggState> {
  return { ...state }
}

/**
 * Reset state (for testing)
 */
export function resetEasterEggState(): void {
  state = {
    lsCount: 0,
    homeVisits: 1,
    revealed: false,
    consumed: false,
  }
}
