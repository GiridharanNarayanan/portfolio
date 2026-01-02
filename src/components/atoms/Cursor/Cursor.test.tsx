/**
 * Cursor Component Tests
 */

import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { Cursor } from './Cursor'

describe('Cursor', () => {
  it('renders when visible is true', () => {
    const { container } = render(<Cursor visible={true} />)
    expect(container.querySelector('span')).toBeInTheDocument()
  })

  it('does not render when visible is false', () => {
    const { container } = render(<Cursor visible={false} />)
    expect(container.querySelector('span')).not.toBeInTheDocument()
  })

  it('has animation class', () => {
    const { container } = render(<Cursor />)
    expect(container.querySelector('span')).toHaveClass('animate-pulse')
  })

  it('is hidden from screen readers', () => {
    const { container } = render(<Cursor />)
    expect(container.querySelector('span')).toHaveAttribute('aria-hidden', 'true')
  })

  it('applies custom className', () => {
    const { container } = render(<Cursor className="custom-class" />)
    expect(container.querySelector('span')).toHaveClass('custom-class')
  })
})
