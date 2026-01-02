/**
 * StartupScreen Component Tests
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, act } from '@testing-library/react'
import { StartupScreen } from './StartupScreen'

describe('StartupScreen', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('renders ASCII art on initial load', () => {
    render(<StartupScreen />)
    
    // Check for GIRID text in the ASCII art
    expect(screen.getByLabelText('GIRID')).toBeInTheDocument()
  })

  it('displays name and job title', () => {
    render(<StartupScreen />)
    
    expect(screen.getByText('Giri Dayanandan')).toBeInTheDocument()
    expect(screen.getByText('Software Engineer')).toBeInTheDocument()
  })

  it('shows idle prompt after 3 seconds', async () => {
    render(<StartupScreen />)
    
    // Initially hidden (opacity-0)
    const promptContainer = screen.getByText(/Press any key to continue/i).parentElement
    expect(promptContainer).toHaveClass('opacity-0')
    
    // After 3 seconds, should be visible
    await act(async () => {
      vi.advanceTimersByTime(3000)
    })
    expect(promptContainer).toHaveClass('opacity-100')
  })

  it('calls onActivate when key is pressed', () => {
    const onActivate = vi.fn()
    render(<StartupScreen onActivate={onActivate} />)
    
    fireEvent.keyDown(window, { key: 'Enter' })
    
    expect(onActivate).toHaveBeenCalledTimes(1)
  })

  it('calls onActivate when clicked', () => {
    const onActivate = vi.fn()
    render(<StartupScreen onActivate={onActivate} />)
    
    fireEvent.click(window)
    
    expect(onActivate).toHaveBeenCalledTimes(1)
  })

  it('does not trigger on modifier keys alone', () => {
    const onActivate = vi.fn()
    render(<StartupScreen onActivate={onActivate} />)
    
    fireEvent.keyDown(window, { key: 'Shift' })
    fireEvent.keyDown(window, { key: 'Control' })
    fireEvent.keyDown(window, { key: 'Alt' })
    fireEvent.keyDown(window, { key: 'Meta' })
    
    expect(onActivate).not.toHaveBeenCalled()
  })

  it('disappears after activation', () => {
    const onActivate = vi.fn()
    const { container } = render(<StartupScreen onActivate={onActivate} />)
    
    // Initially visible
    expect(container.firstChild).toBeInTheDocument()
    
    // After activation
    fireEvent.keyDown(window, { key: 'Enter' })
    
    // Component should return null
    expect(container.firstChild).toBeNull()
  })

  it('has proper accessibility attributes', () => {
    render(<StartupScreen />)
    
    expect(screen.getByRole('banner')).toHaveAttribute('aria-label', 'Welcome screen')
  })
})
