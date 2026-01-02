# Implementation Plan: Terminal UI Portfolio Website

**Branch**: `001-tui-portfolio` | **Date**: 2026-01-01 | **Spec**: [spec.md](spec.md)  
**Input**: Feature specification from `.specify/memory/spec.md`

## Summary

Build an immersive terminal-styled portfolio website showcasing writings, projects, and travel content. The site features a command-driven interface on desktop (inspired by Claude Code) and touch-friendly navigation on mobile. Key elements include a "GiriD" branded startup screen, dark/light theme toggle, markdown-based content management, and an easter egg command (`spyonhim`).

## Technical Context

| Aspect | Choice |
|--------|--------|
| **Runtime** | Bun (latest stable) |
| **Build Tool** | Vite 5.x+ (via rolldown-vite) |
| **Framework** | React 19.x |
| **Language** | TypeScript 5.9+ (strict mode) |
| **Styling** | Tailwind CSS 3.x+ |
| **E2E Testing** | Playwright |
| **Unit Testing** | Vitest + React Testing Library |
| **Content** | Markdown files with YAML frontmatter |
| **Target Platform** | Modern browsers (Chrome, Firefox, Safari, Edge) |
| **Performance Goals** | Lighthouse 90+, <2s initial load, <200ms command response |
| **Constraints** | WCAG AA accessibility, keyboard navigable, mobile responsive |

## Constitution Check

| Principle | Status | Notes |
|-----------|--------|-------|
| Component-First Architecture | ✅ | Atomic design with colocated files |
| TypeScript Strict Mode | ✅ | Already configured in project |
| Tailwind-First Styling | ✅ | Will add Tailwind, no CSS modules |
| Test-Driven Development | ✅ | Vitest + Playwright setup planned |
| Performance by Default | ✅ | Lazy loading, optimized images |
| Accessibility Non-Negotiable | ✅ | WCAG AA, keyboard nav, semantic HTML |
| Simplicity & YAGNI | ✅ | No state library initially, minimal deps |

## Project Structure

### Source Code Layout

```text
src/
├── components/
│   ├── atoms/
│   │   ├── Cursor/
│   │   │   ├── Cursor.tsx
│   │   │   ├── Cursor.test.tsx
│   │   │   └── index.ts
│   │   ├── CommandPrompt/
│   │   ├── Tag/
│   │   └── Link/
│   ├── molecules/
│   │   ├── CommandInput/
│   │   │   ├── CommandInput.tsx
│   │   │   ├── CommandInput.test.tsx
│   │   │   ├── useCommandInput.ts
│   │   │   └── index.ts
│   │   ├── CommandSuggestions/
│   │   ├── ContentCard/
│   │   └── MobileCommandDrawer/
│   ├── organisms/
│   │   ├── Terminal/
│   │   │   ├── Terminal.tsx
│   │   │   ├── Terminal.test.tsx
│   │   │   ├── useTerminal.ts
│   │   │   └── index.ts
│   │   ├── StartupScreen/
│   │   ├── StickyCommandBar/
│   │   ├── ContentViewer/
│   │   └── MobileNavigation/
│   └── templates/
│       ├── TerminalLayout/
│       └── ContentLayout/
├── hooks/
│   ├── useCommands.ts
│   ├── useCommandHistory.ts
│   ├── useTheme.ts
│   ├── useMarkdownContent.ts
│   └── useMobileDetect.ts
├── commands/
│   ├── registry.ts           # Command registration and lookup
│   ├── types.ts              # Command type definitions
│   ├── help.ts
│   ├── writings.ts
│   ├── projects.ts
│   ├── travel.ts
│   ├── about.ts
│   ├── contact.ts
│   ├── theme.ts
│   ├── clear.ts
│   ├── back.ts
│   └── spyonhim.ts           # Easter egg
├── content/
│   ├── writings/
│   │   ├── sample-post.md
│   │   └── ...
│   ├── projects/
│   │   ├── project-one.md
│   │   └── ...
│   ├── travel/
│   │   ├── tokyo-2025.md
│   │   └── ...
│   ├── static/
│   │   ├── about.md
│   │   └── contact.md
│   └── status.md              # User-updated status for spyonhim command
├── utils/
│   ├── parseCommand.ts
│   ├── parseMarkdown.ts
│   ├── matchCommand.ts
│   └── formatDate.ts
├── types/
│   ├── Command.types.ts
│   ├── Content.types.ts
│   └── Theme.types.ts
├── styles/
│   └── index.css             # Tailwind directives + custom properties
├── assets/
│   └── images/
├── App.tsx
├── main.tsx
└── vite-env.d.ts

e2e/
├── fixtures/
│   └── test-utils.ts
└── specs/
    ├── startup.spec.ts
    ├── desktop-navigation.spec.ts
    ├── mobile-navigation.spec.ts
    ├── writings.spec.ts
    ├── projects.spec.ts
    ├── travel.spec.ts
    └── theme.spec.ts

public/
├── fonts/
│   └── [monospace font files]
└── images/
    └── og-image.png
```

## Architecture Overview

### State Management

```
┌─────────────────────────────────────────────────────────────┐
│                        App.tsx                               │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────┐ │
│  │  ThemeProvider  │  │ CommandProvider │  │ ContentCtx  │ │
│  └────────┬────────┘  └────────┬────────┘  └──────┬──────┘ │
└───────────┼────────────────────┼──────────────────┼─────────┘
            │                    │                  │
            ▼                    ▼                  ▼
     useTheme()           useCommands()      useMarkdownContent()
```

- **Theme**: React Context for dark/light mode (persisted in memory only)
- **Commands**: Central registry with command handlers; no external state library
- **Content**: Markdown files loaded at build time via Vite's import.meta.glob
- **Terminal State**: Local state within Terminal component (history, current output)

### Command Flow

```
User Input → parseCommand() → registry.lookup() → handler() → Output Component
                                    │
                                    ├── help → HelpOutput
                                    ├── writings → WritingsList
                                    ├── read [id] → WritingDetail
                                    ├── projects → ProjectsList
                                    ├── view [name] → ProjectDetail
                                    ├── travel → TravelList
                                    ├── explore [loc] → TravelDetail
                                    ├── about → AboutContent
                                    ├── contact → ContactContent
                                    ├── theme → (toggle + confirmation)
                                    ├── clear → (clear output)
                                    ├── back → (navigation stack pop)
                                    └── spyonhim → EasterEggOutput
```

### Mobile Adaptation

```
Desktop                              Mobile
┌────────────────────┐              ┌────────────────────┐
│ [Sticky Commands]  │              │ [Sticky Commands]  │
├────────────────────┤              ├────────────────────┤
│                    │              │                    │
│   Content Area     │              │   Content Area     │
│                    │              │                    │
│                    │              │                    │
├────────────────────┤              ├────────────────────┤
│ > type command_    │              │ > tap for commands │
└────────────────────┘              └─────────┬──────────┘
                                              │ (on tap)
                                              ▼
                                    ┌────────────────────┐
                                    │ ┌────────────────┐ │
                                    │ │ writings       │ │
                                    │ │ projects       │ │
                                    │ │ travel         │ │
                                    │ │ about          │ │
                                    │ │ contact        │ │
                                    │ │ theme          │ │
                                    │ └────────────────┘ │
                                    └────────────────────┘
```

## Data Models

### Content Frontmatter Schemas

```typescript
// Writing
interface WritingFrontmatter {
  title: string;
  slug: string;
  date: string;           // ISO 8601
  excerpt: string;
  featuredImage: string;  // relative path
  tags: string[];
  draft?: boolean;
}

// Project
interface ProjectFrontmatter {
  name: string;
  slug: string;
  description: string;
  techStack: string[];
  images: string[];
  demoUrl?: string;
  repoUrl?: string;
  date: string;
  featured?: boolean;
}

// Travel
interface TravelFrontmatter {
  title: string;
  slug: string;
  location: string;
  date: string;
  images: string[];
  excerpt: string;
}

// Status (for spyonhim command)
interface StatusData {
  lastUpdated: string;    // ISO 8601
  location: string;       // e.g., "Seattle, WA"
  activity: string;       // e.g., "Building cool stuff"
  mood: string;           // e.g., "Caffeinated and coding"
  currentProject?: string;
  funFact?: string;
}

// Career Entry (for About page timeline)
interface CareerEntry {
  type: 'education' | 'work';
  organization: string;
  role: string;           // Job title or degree name
  startDate: string;      // ISO 8601 or "YYYY-MM"
  endDate?: string;       // Optional, null = "Present"
  location: string;
  description: string;
  highlights: string[];   // Key achievements/courses
  logo?: string;          // Relative path to org logo
}

// About Content
interface AboutContent {
  blurb: string;          // Markdown-formatted bio intro
  resumeUrl: string;      // Path to PDF in /public
  careerTimeline: CareerEntry[];
}
```

### Status.md Format

```markdown
---
lastUpdated: 2026-01-01T10:00:00Z
location: Seattle, WA
activity: Building a terminal-styled portfolio
mood: Excited about spec-driven development
currentProject: GiriD Portfolio
funFact: Currently on my 4th cup of coffee
---

Additional context or notes that the LLM can use to craft a more detailed response.
Currently deep in the zone, listening to lo-fi beats and shipping features.
```
```

### Command Type

```typescript
interface Command {
  name: string;
  aliases: string[];
  description: string;
  usage: string;
  parameters?: CommandParameter[];
  contexts: CommandContext[];  // where command is available
  handler: (args: string[], context: TerminalContext) => CommandResult;
}

type CommandContext = 'global' | 'writings' | 'projects' | 'travel' | 'detail';

interface CommandResult {
  component: React.ComponentType<any>;
  props: Record<string, any>;
  clearPrevious: boolean;
}
```

## Component Specifications

### StartupScreen

**Purpose**: Full-screen branded landing with "GiriD" display  
**Props**: `onStart: () => void`  
**Behavior**:
- Renders ASCII art or stylized "GiriD" text
- Shows full name and job title as subtext
- Listens for any keypress (desktop) or tap (mobile)
- After 3s idle, shows subtle "Press any key to continue" prompt
- Calls `onStart` on interaction, triggering fade transition

### Terminal

**Purpose**: Main application shell managing command I/O  
**State**: `{ history: HistoryEntry[], currentOutput: CommandResult | null, context: CommandContext }`  
**Behavior**:
- Renders StickyCommandBar (after first interaction)
- Renders current output component
- Renders CommandInput (desktop) or MobileNavigation (mobile)
- Clears previous output on new command execution
- Manages navigation stack for `back` command

### CommandInput

**Purpose**: Desktop text input with terminal styling  
**Features**:
- Blinking cursor animation
- Arrow key history navigation (session only)
- Tab autocomplete with suggestions dropdown
- Enter to execute

### MobileCommandDrawer

**Purpose**: Touch-friendly command selection  
**Behavior**:
- Collapsed: Shows prompt "tap for commands"
- Expanded: Scrollable list of contextual commands
- For parameterized commands: Secondary selection for options
- Tap outside to collapse

### ContentViewer

**Purpose**: Render markdown content with images  
**Props**: `content: string, images?: ImageMeta[]`  
**Behavior**:
- Parse markdown via react-markdown + remark-gfm
- Render featured image at top
- Render inline images at specified positions
- Maintain terminal aesthetic (monospace, colors)

### AboutView

**Purpose**: Rich About page with bio, resume download, and career timeline  
**Props**: `content: AboutContent`  
**Sections**:
1. **Bio Blurb**: Markdown-rendered intro at top with avatar/photo
2. **Resume Download**: Styled button to download PDF
3. **Career Timeline**: Interactive timeline component

### CareerTimeline

**Purpose**: Visual timeline of education and work experience  
**Props**: `entries: CareerEntry[]`  
**Behavior**:
- Renders entries in reverse chronological order
- Visual connector line between entries
- Entry cards show: logo, org, role, dates, location
- Distinct styling for `education` vs `work` types (icons/colors)
- Desktop: Hover expands to show description + highlights
- Mobile: Tap toggles expanded state
- Current position (no endDate) shows "Present" badge

### CareerTimelineEntry

**Purpose**: Individual entry in the career timeline  
**Props**: `entry: CareerEntry, isExpanded: boolean, onToggle: () => void`  
**States**: Collapsed (default), Expanded (shows description + highlights)  
**Visual Elements**:
- Type indicator icon (🎓 education / 💼 work)
- Organization logo (fallback to styled initials)
- Date range with duration calculation
- Expandable description with bullet highlights

### ResumeDownload

**Purpose**: Styled download button for resume PDF  
**Props**: `url: string`  
**Behavior**:
- Terminal-styled button with download icon
- Triggers browser download on click
- Shows file size indicator (optional)

## Theme System

### Figma Design Reference

**Source**: https://www.figma.com/make/grEZP3SVYMTgCoE0sdT32n/Portfolio-Website-Design

Key design elements to implement:
- **Header**: `portfolio@terminal:~` prompt at top left
- **ASCII Art Hero**: Large pixelated/ASCII name with yellow/gold color (#c5a93c) inside a retro terminal border
- **Subtext**: Job description in lighter text below the hero
- **Section Cards**: Three horizontal cards for Writings, Projects, Travel with muted taupe/brown backgrounds
- **Quick Start Buttons**: Row of command buttons (help, about, ls writings, ls projects) with subtle borders
- **Terminal Prompt**: `$ > type 'help' for commands` at bottom

### CSS Custom Properties

```css
:root {
  /* Dark theme (default) - Figma inspired */
  --color-bg: #0f1419;
  --color-bg-secondary: #1a1f26;
  --color-bg-card: #2d2a26;
  --color-text: #e6edf3;
  --color-text-muted: #8b949e;
  --color-accent: #c5a93c;          /* Yellow/gold from Figma */
  --color-accent-hover: #d4bc5a;
  --color-accent-secondary: #7c9a5e; /* Green for prompts */
  --color-border: #30363d;
  --color-success: #3fb950;
  --color-error: #f85149;
}

:root.light {
  --color-bg: #f8f9fa;
  --color-bg-secondary: #ffffff;
  --color-bg-card: #e8e5e0;
  --color-text: #1f2328;
  --color-text-muted: #656d76;
  --color-accent: #8b7320;
  --color-accent-hover: #6d5a19;
  --color-accent-secondary: #4a6b3a;
  --color-border: #d0d7de;
  --color-success: #1a7f37;
  --color-error: #cf222e;
}
```

### Tailwind Config Extension

```javascript
// tailwind.config.js
module.exports = {
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        terminal: {
          bg: 'var(--color-bg)',
          'bg-secondary': 'var(--color-bg-secondary)',
          'bg-card': 'var(--color-bg-card)',
          text: 'var(--color-text)',
          muted: 'var(--color-text-muted)',
          accent: 'var(--color-accent)',
          'accent-secondary': 'var(--color-accent-secondary)',
          border: 'var(--color-border)',
        }
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      animation: {
        blink: 'blink 1s step-end infinite',
      },
      keyframes: {
        blink: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0 },
        },
      },
    },
  },
}
```

## Dependencies to Add

### Production Dependencies

| Package | Purpose | Size (gzip) |
|---------|---------|-------------|
| `react-markdown` | Markdown rendering | ~12KB |
| `remark-gfm` | GitHub Flavored Markdown | ~3KB |
| `gray-matter` | Frontmatter parsing | ~5KB |
| `class-variance-authority` | Component variants | ~2KB |
| `clsx` | Conditional classnames | <1KB |
| `openai` | LLM API for spyonhim command | ~20KB |

### Development Dependencies

| Package | Purpose |
|---------|---------|
| `tailwindcss` | Utility CSS |
| `postcss` | CSS processing |
| `autoprefixer` | CSS prefixes |
| `@tailwindcss/typography` | Prose styling |
| `vitest` | Unit testing |
| `@testing-library/react` | Component testing |
| `@testing-library/user-event` | User interaction simulation |

### Environment Variables

```env
# Required for spyonhim easter egg (optional - falls back to raw status)
VITE_OPENAI_API_KEY=sk-...
# Or use Anthropic
VITE_ANTHROPIC_API_KEY=sk-ant-...
```
| `@playwright/test` | E2E testing |
| `jsdom` | DOM simulation for tests |

## Implementation Phases

### Phase 1: Foundation (P1 - Critical)

**Goal**: Core infrastructure and startup experience

1. **Setup Tailwind CSS**
   - Install dependencies
   - Configure tailwind.config.js
   - Add CSS custom properties for theme
   - Configure PostCSS

2. **Create Theme System**
   - ThemeContext and useTheme hook
   - CSS variable switching
   - theme command handler

3. **Build StartupScreen**
   - "GiriD" ASCII/styled display
   - Full name and job title subtext
   - Keypress/tap detection
   - Fade transition to terminal

4. **Build Terminal Shell**
   - Basic layout structure
   - Context management
   - Output rendering area

### Phase 2: Desktop Interaction (P1 - Critical)

**Goal**: Functional command-driven interface on desktop

5. **Command System Core**
   - Command registry with types
   - parseCommand utility
   - matchCommand with fuzzy matching
   - Basic error handling

6. **CommandInput Component**
   - Text input with styling
   - Blinking cursor
   - History navigation (arrow keys)
   - Tab autocomplete

7. **Implement Core Commands**
   - help (command list)
   - clear (clear output)
   - back (navigation)
   - theme (toggle)

8. **StickyCommandBar**
   - Fixed position header
   - Available commands display
   - Context-aware visibility

### Phase 3: Content System (P1/P2)

**Goal**: Markdown content loading and display

9. **Markdown Infrastructure**
   - Vite glob import setup
   - Frontmatter parsing
   - Content type definitions
   - useMarkdownContent hook

10. **ContentViewer Component**
    - Markdown rendering
    - Image handling (featured + inline)
    - Terminal-styled typography
    - Scroll behavior

11. **Writings Feature**
    - writings command → list view
    - read [id] command → detail view
    - Content cards with excerpts

12. **Projects Feature**
    - projects command → list view
    - view [name] command → detail view
    - Tech stack tags
    - External link handling

13. **Travel Feature**
    - travel command → list view
    - explore [location] command → detail view
    - Image gallery handling

14. **About & Contact**
    - about command → static content
    - contact command → links/info

### Phase 4: Mobile Experience (P1 - Critical)

**Goal**: Touch-friendly navigation maintaining terminal aesthetic

15. **Mobile Detection**
    - useMobileDetect hook
    - Viewport-based switching
    - Touch event handling

16. **MobileCommandDrawer**
    - Expandable command list
    - Contextual command filtering
    - Parameter sub-selection
    - Swipe gestures

17. **Responsive Layout**
    - Bottom command bar positioning
    - Touch target sizing (44px min)
    - Content area adjustments

### Phase 5: Polish & Easter Eggs

**Goal**: Final touches and personality

18. **Easter Egg: spyonhim**
    - Read `content/status.md` file (user-updated periodically)
    - Call LLM API (e.g., OpenAI, Anthropic) to generate quirky summary
    - Prompt: "Based on this status, generate a fun spy-report style summary of what Giri is up to"
    - Fallback: Display raw status if LLM unavailable
    - Typing animation effect for dramatic reveal
    - Cache LLM response for 5 minutes to reduce API calls

19. **Accessibility Audit**
    - Keyboard navigation verification
    - Screen reader testing
    - Focus management
    - ARIA labels

20. **Performance Optimization**
    - Image optimization (WebP)
    - Code splitting verification
    - Lighthouse audit
    - Bundle analysis

### Phase 6: Testing

**Goal**: Comprehensive test coverage

21. **Unit Tests**
    - parseCommand utility
    - Command handlers
    - Custom hooks
    - Utility functions

22. **Component Tests**
    - CommandInput interactions
    - Terminal state management
    - Theme switching
    - Content rendering

23. **E2E Tests (Playwright)**
    - Startup flow
    - Desktop command navigation
    - Mobile touch navigation
    - All content sections
    - Theme persistence (session)

## Risk Mitigation

| Risk | Mitigation |
|------|------------|
| Markdown parsing edge cases | Use battle-tested react-markdown; comprehensive test fixtures |
| Mobile keyboard popup issues | Avoid native input on mobile; use drawer pattern |
| Performance with many content files | Static generation at build time; lazy load images |
| Accessibility with custom inputs | Extensive screen reader testing; ARIA live regions |
| Browser inconsistencies | Playwright cross-browser testing; CSS feature detection |

## Definition of Done

A feature is complete when:

- [ ] All acceptance scenarios from spec pass manually
- [ ] Unit tests written and passing (≥80% coverage for utilities)
- [ ] Component tests written and passing
- [ ] E2E tests written and passing
- [ ] Lighthouse scores: Performance ≥90, Accessibility ≥90
- [ ] Works on Chrome, Firefox, Safari (latest)
- [ ] Works on iOS Safari and Android Chrome
- [ ] Code reviewed and approved
- [ ] No TypeScript errors (strict mode)
- [ ] No ESLint warnings
- [ ] Documentation updated if needed
