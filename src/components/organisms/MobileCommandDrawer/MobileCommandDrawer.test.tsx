import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MobileCommandDrawer, MobileCommandItem } from './MobileCommandDrawer';
import type { Command } from '../../../types/Command.types';

// Mock the registry
vi.mock('../../../commands/registry', () => ({
  getAllCommands: () => [
    { name: 'help', description: 'Show available commands', handler: () => ({ success: true }) },
    { name: 'writings', description: 'View blog posts', aliases: ['blog', 'posts'], handler: () => ({ success: true }) },
    { name: 'projects', description: 'View projects', handler: () => ({ success: true }) },
  ],
}));

describe('MobileCommandItem', () => {
  const mockCommand: Command = {
    name: 'test',
    description: 'Test command',
    aliases: ['t', 'tst'],
    handler: () => ({ success: true }),
  };

  it('renders command name and description', () => {
    render(<MobileCommandItem command={mockCommand} onSelect={vi.fn()} />);
    
    expect(screen.getByText('test')).toBeInTheDocument();
    expect(screen.getByText('Test command')).toBeInTheDocument();
  });

  it('renders aliases when present', () => {
    render(<MobileCommandItem command={mockCommand} onSelect={vi.fn()} />);
    
    expect(screen.getByText('(t, tst)')).toBeInTheDocument();
  });

  it('calls onSelect when tapped', () => {
    const onSelect = vi.fn();
    render(<MobileCommandItem command={mockCommand} onSelect={onSelect} />);
    
    fireEvent.click(screen.getByRole('button'));
    
    expect(onSelect).toHaveBeenCalledWith('test');
  });

  it('has minimum touch target size', () => {
    render(<MobileCommandItem command={mockCommand} onSelect={vi.fn()} />);
    
    const button = screen.getByRole('button');
    expect(button).toHaveClass('min-h-[44px]');
  });
});

describe('MobileCommandDrawer', () => {
  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    onCommandSelect: vi.fn(),
  };

  it('renders nothing when closed', () => {
    render(<MobileCommandDrawer {...defaultProps} isOpen={false} />);
    
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('renders drawer when open', () => {
    render(<MobileCommandDrawer {...defaultProps} />);
    
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('displays all available commands', () => {
    render(<MobileCommandDrawer {...defaultProps} />);
    
    expect(screen.getByText('help')).toBeInTheDocument();
    expect(screen.getByText('writings')).toBeInTheDocument();
    expect(screen.getByText('projects')).toBeInTheDocument();
  });

  it('calls onCommandSelect and onClose when command is selected', () => {
    const onClose = vi.fn();
    const onCommandSelect = vi.fn();
    render(
      <MobileCommandDrawer
        isOpen={true}
        onClose={onClose}
        onCommandSelect={onCommandSelect}
      />
    );
    
    fireEvent.click(screen.getByText('writings'));
    
    expect(onCommandSelect).toHaveBeenCalledWith('writings');
    expect(onClose).toHaveBeenCalled();
  });

  it('calls onClose when backdrop is clicked', () => {
    const onClose = vi.fn();
    render(<MobileCommandDrawer {...defaultProps} onClose={onClose} />);
    
    // Click the backdrop (first child of the drawer container)
    const backdrop = document.querySelector('.bg-black\\/50');
    if (backdrop) {
      fireEvent.click(backdrop);
    }
    
    expect(onClose).toHaveBeenCalled();
  });

  it('calls onClose when cancel button is clicked', () => {
    const onClose = vi.fn();
    render(<MobileCommandDrawer {...defaultProps} onClose={onClose} />);
    
    fireEvent.click(screen.getByText('Cancel'));
    
    expect(onClose).toHaveBeenCalled();
  });

  it('has proper accessibility attributes', () => {
    render(<MobileCommandDrawer {...defaultProps} />);
    
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog).toHaveAttribute('aria-label', 'Command menu');
  });
});
