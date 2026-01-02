import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ContentViewer } from './ContentViewer';
import type { ContentItem } from '../../../types/Content.types';

// Mock react-markdown
vi.mock('react-markdown', () => ({
  default: ({ children }: { children: string }) => <div data-testid="markdown-content">{children}</div>,
}));

// Mock remark-gfm
vi.mock('remark-gfm', () => ({
  default: () => {},
}));

describe('ContentViewer', () => {
  const baseContent: ContentItem = {
    slug: 'test-post',
    type: 'writings',
    title: 'Test Post Title',
    date: '2024-01-15',
    excerpt: 'This is a test excerpt',
    content: '# Hello World\n\nThis is test content.',
    published: true,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the title', () => {
    render(<ContentViewer content={baseContent} />);
    expect(screen.getByText('Test Post Title')).toBeInTheDocument();
  });

  it('renders the formatted date', () => {
    render(<ContentViewer content={baseContent} />);
    // Check for the time element with the correct datetime attribute
    const timeElement = screen.getByRole('time');
    expect(timeElement).toHaveAttribute('datetime', '2024-01-15');
    // The displayed text may vary by timezone, but should contain "2024"
    expect(timeElement.textContent).toContain('2024');
  });

  it('renders markdown content', () => {
    render(<ContentViewer content={baseContent} />);
    expect(screen.getByTestId('markdown-content')).toBeInTheDocument();
  });

  it('renders featured image when provided', () => {
    const contentWithImage: ContentItem = {
      ...baseContent,
      featuredImage: '/images/featured.jpg',
    };
    render(<ContentViewer content={contentWithImage} />);
    const img = screen.getByRole('img', { name: 'Test Post Title' });
    expect(img).toHaveAttribute('src', '/images/featured.jpg');
  });

  it('does not render featured image when not provided', () => {
    render(<ContentViewer content={baseContent} />);
    const images = screen.queryAllByRole('img');
    expect(images.length).toBe(0);
  });

  it('renders tags when provided', () => {
    const contentWithTags: ContentItem = {
      ...baseContent,
      tags: ['react', 'typescript', 'testing'],
    };
    render(<ContentViewer content={contentWithTags} />);
    expect(screen.getByText('#react')).toBeInTheDocument();
    expect(screen.getByText('#typescript')).toBeInTheDocument();
    expect(screen.getByText('#testing')).toBeInTheDocument();
  });

  it('renders tech stack when provided', () => {
    const contentWithTech: ContentItem = {
      ...baseContent,
      type: 'projects',
      techStack: ['React', 'Node.js', 'PostgreSQL'],
    };
    render(<ContentViewer content={contentWithTech} />);
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('Node.js')).toBeInTheDocument();
    expect(screen.getByText('PostgreSQL')).toBeInTheDocument();
  });

  it('renders location when provided', () => {
    const contentWithLocation: ContentItem = {
      ...baseContent,
      type: 'projects',
      location: 'Tokyo, Japan',
    };
    render(<ContentViewer content={contentWithLocation} />);
    expect(screen.getByText('Tokyo, Japan')).toBeInTheDocument();
  });

  it('renders external links when provided', () => {
    const contentWithLinks: ContentItem = {
      ...baseContent,
      type: 'projects',
      links: {
        demo: 'https://demo.example.com',
        repo: 'https://github.com/example/repo',
      },
    };
    render(<ContentViewer content={contentWithLinks} />);
    
    const demoLink = screen.getByRole('link', { name: /live demo/i });
    expect(demoLink).toHaveAttribute('href', 'https://demo.example.com');
    expect(demoLink).toHaveAttribute('target', '_blank');
    
    const repoLink = screen.getByRole('link', { name: /repository/i });
    expect(repoLink).toHaveAttribute('href', 'https://github.com/example/repo');
    expect(repoLink).toHaveAttribute('target', '_blank');
  });

  it('renders gallery when provided', () => {
    const contentWithGallery: ContentItem = {
      ...baseContent,
      gallery: ['/images/1.jpg', '/images/2.jpg', '/images/3.jpg'],
    };
    render(<ContentViewer content={contentWithGallery} />);
    
    const galleryImages = screen.getAllByAltText(/Gallery image/);
    expect(galleryImages).toHaveLength(3);
  });

  it('renders back navigation hint', () => {
    render(<ContentViewer content={baseContent} />);
    expect(screen.getByText('back')).toBeInTheDocument();
    expect(screen.getByText(/return to the list/)).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(<ContentViewer content={baseContent} className="custom-class" />);
    expect(container.firstChild).toHaveClass('custom-class');
  });
});
