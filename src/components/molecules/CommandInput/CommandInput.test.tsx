/**
 * CommandInput Component Tests
 */

import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CommandInput } from './CommandInput'

describe('CommandInput', () => {
  it('renders with placeholder', () => {
    render(<CommandInput onSubmit={vi.fn()} placeholder="Type here..." />)
    expect(screen.getByPlaceholderText('Type here...')).toBeInTheDocument()
  })

  it('calls onSubmit when Enter is pressed', async () => {
    const onSubmit = vi.fn()
    const user = userEvent.setup()
    
    render(<CommandInput onSubmit={onSubmit} />)
    
    const input = screen.getByRole('textbox')
    await user.type(input, 'help')
    await user.keyboard('{Enter}')
    
    expect(onSubmit).toHaveBeenCalledWith('help')
  })

  it('clears input after submit', async () => {
    const user = userEvent.setup()
    
    render(<CommandInput onSubmit={vi.fn()} />)
    
    const input = screen.getByRole('textbox')
    await user.type(input, 'test')
    await user.keyboard('{Enter}')
    
    expect(input).toHaveValue('')
  })

  it('does not submit empty input', async () => {
    const onSubmit = vi.fn()
    const user = userEvent.setup()
    
    render(<CommandInput onSubmit={onSubmit} />)
    
    await user.keyboard('{Enter}')
    
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('navigates history with arrow up', async () => {
    const onHistoryUp = vi.fn().mockReturnValue('previous-command')
    const user = userEvent.setup()
    
    render(<CommandInput onSubmit={vi.fn()} onHistoryUp={onHistoryUp} />)
    
    const input = screen.getByRole('textbox')
    await user.click(input)
    await user.keyboard('{ArrowUp}')
    
    expect(onHistoryUp).toHaveBeenCalled()
    expect(input).toHaveValue('previous-command')
  })

  it('navigates history with arrow down', async () => {
    const onHistoryDown = vi.fn().mockReturnValue('next-command')
    const user = userEvent.setup()
    
    render(<CommandInput onSubmit={vi.fn()} onHistoryDown={onHistoryDown} />)
    
    const input = screen.getByRole('textbox')
    await user.click(input)
    await user.keyboard('{ArrowDown}')
    
    expect(onHistoryDown).toHaveBeenCalled()
    expect(input).toHaveValue('next-command')
  })

  it('clears input on Escape', async () => {
    const user = userEvent.setup()
    
    render(<CommandInput onSubmit={vi.fn()} />)
    
    const input = screen.getByRole('textbox')
    await user.type(input, 'some text')
    await user.keyboard('{Escape}')
    
    expect(input).toHaveValue('')
  })

  it('auto-focuses when autoFocus is true', () => {
    render(<CommandInput onSubmit={vi.fn()} autoFocus={true} />)
    expect(screen.getByRole('textbox')).toHaveFocus()
  })

  it('renders prompt and cursor', () => {
    const { container } = render(<CommandInput onSubmit={vi.fn()} />)
    
    // Check for prompt (includes path prefix)
    expect(screen.getByText(/\$ >/)).toBeInTheDocument()
    
    // Cursor should be visible when focused
    const input = screen.getByRole('textbox')
    fireEvent.focus(input)
    expect(container.querySelector('[aria-hidden="true"]')).toBeInTheDocument()
  })

  it('is disabled when disabled prop is true', () => {
    render(<CommandInput onSubmit={vi.fn()} disabled={true} />)
    expect(screen.getByRole('textbox')).toBeDisabled()
  })
})
