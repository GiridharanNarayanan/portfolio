# Feature Specification: Terminal UI Portfolio Website

**Feature Branch**: `001-tui-portfolio`  
**Created**: 2026-01-01  
**Status**: Draft  
**Input**: User description: "Design a personal portfolio website that showcases writings, projects, and travel content, styled as a polished and modern TUI (terminal UI)."

## Overview

A personal portfolio website designed as an immersive terminal user interface (TUI) experience. The site showcases three content types—writings, projects, and travel—through a command-driven interface inspired by Claude Code. The design prioritizes clarity, minimalism, and intentional typography while maintaining full functionality across desktop and mobile platforms.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - First-Time Visitor Experience (Priority: P1)

A visitor lands on the portfolio and is greeted by a striking, visually engaging startup graphic featuring "GiriD" as the prominent display name, with subtext showing the full name and job title. The screen sets the terminal aesthetic tone, feels intentional and polished, and invites curiosity before any interaction begins.

**Why this priority**: First impressions determine whether visitors engage further. The startup screen establishes brand identity and differentiates from typical portfolios.

**Independent Test**: Can be fully tested by loading the site and observing the startup graphic renders correctly, feels visually compelling, and transitions smoothly to the interactive state.

**Acceptance Scenarios**:

1. **Given** a user loads the portfolio URL, **When** the page renders, **Then** a full-screen terminal-styled startup graphic appears displaying "GiriD" prominently with full name and job title as subtext
2. **Given** the startup graphic is displayed, **When** the user presses any key or taps the screen, **Then** the terminal interface becomes interactive with a blinking cursor
3. **Given** the startup graphic is displayed, **When** 3 seconds pass without interaction, **Then** a subtle prompt appears indicating the user can begin

---

### User Story 2 - Desktop Command Navigation (Priority: P1)

A desktop user navigates the portfolio by typing commands into the terminal interface. Commands are intuitive, responses are clear, and the interface clears previous interactions to maintain focus.

**Why this priority**: Core interaction model—without functional commands, the site has no utility.

**Independent Test**: Can be tested by typing commands and verifying correct content displays, previous commands clear, and sticky command reference remains visible.

**Acceptance Scenarios**:

1. **Given** the terminal is active, **When** the user types `help`, **Then** a list of available commands displays with brief descriptions
2. **Given** the terminal is active, **When** the user types `writings`, **Then** the writings list renders and previous terminal output clears
3. **Given** a command has been executed, **When** viewing any subsequent screen, **Then** available commands remain sticky at the top of the viewport
4. **Given** the terminal interface, **When** viewing the window chrome, **Then** no minimize/maximize/close buttons are visible (immersive mode)

---

### User Story 3 - Browse Writings with Rich Content (Priority: P1)

A visitor explores the writings section, views a list of entries, selects one, and reads the full content including a featured image and optional inline images.

**Why this priority**: Writings are primary content; rich media support differentiates from plain-text terminals.

**Independent Test**: Can be tested by navigating to writings, selecting an entry, and verifying image rendering and text formatting.

**Acceptance Scenarios**:

1. **Given** the user executes `writings`, **When** the writings list renders, **Then** each entry shows title, date, and brief excerpt
2. **Given** a writings list is displayed, **When** the user types `read [id]` or `read [title]`, **Then** the full writing content displays with featured image
3. **Given** a writing entry with inline images, **When** the content renders, **Then** images appear inline at appropriate positions within the text
4. **Given** a writing is displayed, **When** the user types `back`, **Then** they return to the writings list

---

### User Story 4 - Browse Projects (Priority: P2)

A visitor explores the projects section to see work samples, technical details, and links to live demos or repositories.

**Why this priority**: Projects showcase technical competence; essential for professional portfolio but secondary to content consumption.

**Independent Test**: Can be tested by navigating to projects, viewing list, and selecting individual project details.

**Acceptance Scenarios**:

1. **Given** the user executes `projects`, **When** the projects list renders, **Then** each project shows name, brief description, and tech stack tags
2. **Given** a projects list is displayed, **When** the user types `view [project-name]`, **Then** full project details display including description, images, and links
3. **Given** project details are displayed, **When** external links are present, **Then** they are clearly indicated and open in new tabs

---

### User Story 5 - Browse Travel Content (Priority: P2)

A visitor explores the travel section to view location-based content, stories, and photography from travels.

**Why this priority**: Adds personal dimension to portfolio; important for personality but not core professional content.

**Independent Test**: Can be tested by navigating to travel, viewing locations/entries, and selecting individual travel stories.

**Acceptance Scenarios**:

1. **Given** the user executes `travel`, **When** the travel content renders, **Then** entries display with location, date, and preview image
2. **Given** a travel list is displayed, **When** the user types `explore [location]`, **Then** full travel entry displays with narrative and images
3. **Given** travel content, **When** images are present, **Then** they render with appropriate sizing and terminal-consistent styling

---

### User Story 6 - Mobile Touch Navigation (Priority: P1)

A mobile user navigates the portfolio through touch-friendly interactions that maintain the terminal aesthetic without requiring typing.

**Why this priority**: Mobile users represent significant traffic; unusable mobile experience loses visitors.

**Independent Test**: Can be tested on mobile device by tapping command line, viewing expandable command list, and selecting commands via touch.

**Acceptance Scenarios**:

1. **Given** a mobile user views the terminal, **When** they tap the command line area, **Then** it expands to reveal a scrollable list of contextual commands
2. **Given** the command list is expanded, **When** the user scrolls, **Then** additional commands become visible within the compact container
3. **Given** the command list is expanded, **When** the user taps a command, **Then** that command executes and the list collapses
4. **Given** mobile view, **When** viewing the interface, **Then** no large standalone buttons appear—all interactions remain compact and terminal-like
5. **Given** mobile view, **When** a command with parameters is needed (e.g., `read [id]`), **Then** tapping it reveals sub-options or a secondary selection

---

### User Story 7 - About Page (Priority: P2)

A visitor accesses a rich "About" page that tells the story of the portfolio owner through a personal blurb, downloadable resume, and an interactive career timeline showing education and work experience.

**Why this priority**: Essential for professional networking and establishing credibility; the career timeline differentiates from typical portfolios.

**Independent Test**: Can be tested by executing `about` command and verifying all three sections render: bio blurb, resume download, and career timeline.

**Acceptance Scenarios**:

1. **Given** the user executes `about`, **When** the content renders, **Then** a personal blurb/introduction displays at the top in terminal-styled format
2. **Given** the about page is displayed, **When** viewing the resume section, **Then** a clearly visible download button/link allows downloading the resume as PDF
3. **Given** the about page is displayed, **When** viewing the career timeline, **Then** an interactive history graph displays showing both education and work experience
4. **Given** the career timeline is displayed, **When** viewing entries, **Then** each entry shows: organization name, role/degree, date range, location, and brief description
5. **Given** the career timeline is displayed, **When** entries are arranged, **Then** they appear in reverse chronological order with clear visual distinction between education and work
6. **Given** the career timeline on desktop, **When** hovering over an entry, **Then** additional details or highlights appear
7. **Given** the career timeline on mobile, **When** tapping an entry, **Then** it expands to show full details

---

### User Story 8 - Contact Information (Priority: P2)

A visitor accesses contact methods to reach the portfolio owner.

**Why this priority**: Essential for professional networking but secondary to the About page content.

**Independent Test**: Can be tested by executing `contact` command and verifying contact links display.

**Acceptance Scenarios**:

1. **Given** the user executes `contact`, **When** the content renders, **Then** contact methods display (email, social links) with clear interaction cues
2. **Given** the contact page is displayed, **When** clicking a contact link, **Then** it opens in appropriate manner (email client, new tab for social)

---

### Edge Cases

- What happens when user types an unrecognized command? → Display helpful error message with `help` suggestion
- What happens when user types partial command? → Show autocomplete suggestions or closest matches
- How does system handle very long writing content? → Implement scrollable content area with clear scroll indicators
- What happens on viewport resize during content view? → Content reflows appropriately; sticky commands remain visible
- How does mobile handle landscape orientation? → Maintain touch-based navigation with adjusted layout
- What happens when images fail to load? → Display terminal-styled placeholder with alt text

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST render a full-screen startup graphic on initial page load featuring "GiriD" as the prominent name with subtext displaying full name and job title
- **FR-002**: System MUST provide a command input interface with blinking cursor on desktop
- **FR-003**: System MUST clear previous command output when a new command executes
- **FR-004**: System MUST display available commands in a sticky header after first interaction
- **FR-005**: System MUST NOT display browser-style window controls (minimize, maximize, close)
- **FR-006**: System MUST support the following core commands: `help`, `writings`, `projects`, `travel`, `about`, `contact`, `back`, `clear`, `theme`
- **FR-007**: System MUST support parameterized commands: `read [id]`, `view [name]`, `explore [location]`
- **FR-015**: System MUST support both dark and light themes with a `theme` command to toggle
- **FR-016**: System MUST include an easter egg command `spyonhim` that reads from a `status.md` file and uses an LLM to generate a quirky, personalized summary of Giri's current status/location/activities
- **FR-017**: Content MUST be stored as Markdown files with frontmatter for metadata
- **FR-018**: Command history within a session MUST be navigable via arrow keys but MUST NOT persist across browser sessions
- **FR-008**: Writings MUST display one featured image by default
- **FR-009**: Writings MUST support inline images within content body
- **FR-010**: System MUST detect mobile viewport and switch to touch-based interaction model
- **FR-011**: Mobile command line MUST expand on tap to reveal scrollable command options
- **FR-012**: Mobile command list MUST be contextual to current application state
- **FR-013**: System MUST support keyboard navigation on desktop (arrow keys for history, tab for autocomplete)
- **FR-014**: System MUST maintain terminal aesthetic across all content types and interactions
- **FR-019**: About page MUST display a personal blurb/introduction section at the top
- **FR-020**: About page MUST provide a resume download option in PDF format
- **FR-021**: About page MUST display an interactive career timeline showing education and work experience
- **FR-022**: Career timeline entries MUST include: organization, role/degree, date range, location, and description
- **FR-023**: Career timeline MUST visually distinguish between education and work experience entries
- **FR-024**: Career timeline MUST support hover (desktop) and tap (mobile) interactions for expanded details

### Non-Functional Requirements

- **NFR-001**: Initial page load (startup graphic) MUST render within 2 seconds on 3G connection
- **NFR-002**: Command response MUST render within 200ms of execution
- **NFR-003**: Typography MUST be legible at standard viewing distances on both desktop and mobile
- **NFR-004**: System MUST be accessible via keyboard-only navigation on desktop
- **NFR-005**: Color contrast MUST meet WCAG AA standards
- **NFR-006**: System MUST work on latest versions of Chrome, Firefox, Safari, and Edge

### Key Entities

- **Writing**: Title, slug, date, excerpt, featured image, body content (with optional inline images), tags
- **Project**: Name, slug, description, tech stack (array), images, external links (demo, repo), date
- **Travel Entry**: Location, date, title, narrative content, images (array)
- **Command**: Name, aliases, description, parameters (optional), handler function, contexts (where available)
- **Career Entry**: Type (education|work), organization, role/degree, startDate, endDate, location, description, highlights (array), logo (optional)
- **About Content**: Blurb (markdown), resumeUrl, careerTimeline (array of Career Entries)

## Visual Design Requirements

### Figma Design Reference

**Source**: https://www.figma.com/make/grEZP3SVYMTgCoE0sdT32n/Portfolio-Website-Design

The design features:
- **Header**: `portfolio@terminal:~` prompt style
- **Hero Section**: Large ASCII art name ("GIRID") with retro terminal border (yellow/green)
- **Subtext**: Job title/description below the ASCII art
- **Content Cards**: Three section cards (Writings, Projects, Travel) with muted backgrounds
- **Quick Start Commands**: Button row with commands: `help`, `about`, `ls writings`, `ls projects`
- **Prompt**: Bottom terminal prompt `$ > type 'help' for commands`
- **Color Palette**: 
  - Background: Dark navy (#0f1419 or similar)
  - Primary accent: Yellow/gold (#c5a93c) for ASCII art and highlights
  - Secondary accent: Muted brown/taupe for cards
  - Text: Light gray/white for readability
  - Prompt symbol: Green for `$` and `>`

### Terminal Aesthetic

- Monospace or semi-monospace typography as primary typeface
- Dark background with light text (classic terminal colors) or inverted theme option
- ASCII art border around the name graphic (retro terminal box drawing characters)
- Cursor blink animation on active input
- Typing animation for command output (optional, can be disabled)
- Consistent spacing using character-width units where appropriate

### Claude Code Inspiration

- Clean, minimal chrome—content is the focus
- Clear visual hierarchy through typography weight and spacing
- Subtle transitions and micro-interactions
- Muted color palette with intentional accent colors for links/actions
- Professional, polished feel—not "retro gimmick"

### Mobile Adaptations

- Command line remains at bottom of viewport (thumb-friendly)
- Expanded command list uses sheet/drawer pattern from bottom
- Touch targets minimum 44px for accessibility
- Swipe gestures for navigation where intuitive (e.g., swipe to go back)

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can navigate to any content section within 3 commands from startup
- **SC-002**: 90% of desktop users successfully execute their first command without external help
- **SC-003**: 90% of mobile users successfully navigate to content within 2 taps from startup
- **SC-004**: Page achieves Lighthouse performance score of 90+ on desktop
- **SC-005**: Page achieves Lighthouse accessibility score of 90+
- **SC-006**: Average session duration exceeds 60 seconds (indicates engagement)
- **SC-007**: Bounce rate below 50% (indicates the experience captures interest)

## Resolved Decisions

1. **Theme toggle**: Yes — support both dark and light themes via `theme` command
2. **Command history persistence**: No — history available within session only, not persisted to localStorage
3. **Easter egg command**: Yes — `spyonhim` reads from `status.md` and uses LLM to summarize what Giri is currently doing
4. **Content management**: Markdown files with YAML frontmatter for metadata
5. **Sound effects**: No — not implementing sound effects at this time
