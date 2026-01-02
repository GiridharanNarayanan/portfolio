# Tasks: Terminal UI Portfolio Website

**Input**: Design documents from `.specify/memory/`  
**Prerequisites**: plan.md ✅, spec.md ✅, constitution.md ✅  
**Feature Branch**: `001-tui-portfolio`

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1-US7, INFRA, POLISH)
- Exact file paths included in descriptions

---

## Phase 1: Setup & Infrastructure (INFRA)

**Purpose**: Project initialization, dependencies, and tooling setup

**⚠️ CRITICAL**: All subsequent phases depend on this phase completing first

- [X] T001 [INFRA] Install Tailwind CSS and dependencies: `bun add -d tailwindcss postcss autoprefixer @tailwindcss/typography`
- [X] T002 [INFRA] Create `tailwind.config.js` with terminal theme colors from Figma design
- [X] T003 [INFRA] Create `postcss.config.js` for Tailwind processing
- [X] T004 [INFRA] Update `src/index.css` with Tailwind directives and CSS custom properties (dark/light theme)
- [X] T005 [P] [INFRA] Install production dependencies: `bun add react-markdown remark-gfm gray-matter class-variance-authority clsx openai`
- [X] T006 [P] [INFRA] Install testing dependencies: `bun add -d vitest @testing-library/react @testing-library/user-event jsdom @playwright/test`
- [X] T007 [INFRA] Create `vitest.config.ts` for unit/component testing
- [X] T008 [INFRA] Create `playwright.config.ts` for E2E testing
- [X] T009 [INFRA] Update `package.json` with test scripts: `test`, `test:e2e`, `test:coverage`
- [X] T010 [INFRA] Create project directory structure per plan.md:
  - `src/components/{atoms,molecules,organisms,templates}/`
  - `src/hooks/`
  - `src/commands/`
  - `src/content/{writings,projects,travel,static}/`
  - `src/utils/`
  - `src/types/`
  - `e2e/{fixtures,specs}/`
- [X] T011 [P] [INFRA] Add monospace font (JetBrains Mono) to `public/fonts/` and configure in CSS
- [X] T012 [P] [INFRA] Create `.env.example` with `VITE_AZURE_OPENAI_ENDPOINT` and `VITE_AZURE_OPENAI_KEY` placeholders
- [X] T013 [P] [INFRA] Add Microsoft Clarity tracking script to `index.html` with project ID placeholder
- [X] T014 [P] [INFRA] Create `src/utils/clarity.ts` with Clarity initialization and custom event helpers

**Checkpoint**: ✅ Tailwind working, test runners configured, analytics ready, directory structure ready

---

## Phase 2: Core Types & Utilities (INFRA)

**Purpose**: Shared types and utility functions used across all features

- [X] T015 [P] [INFRA] Create `src/types/Command.types.ts` with Command, CommandContext, CommandResult interfaces
- [X] T016 [P] [INFRA] Create `src/types/Content.types.ts` with Writing, Project, Travel, Status frontmatter interfaces
- [X] T017 [P] [INFRA] Create `src/types/Theme.types.ts` with Theme type and context interface
- [X] T018 [INFRA] Create `src/utils/parseCommand.ts` - parse user input into command + args
- [X] T019 [INFRA] Create `src/utils/matchCommand.ts` - fuzzy match commands with suggestions
- [X] T020 [P] [INFRA] Create `src/utils/parseMarkdown.ts` - wrapper for gray-matter frontmatter parsing
- [X] T021 [P] [INFRA] Create `src/utils/formatDate.ts` - date formatting utilities
- [X] T022 [P] [INFRA] Create `src/utils/cn.ts` - clsx + tailwind-merge utility

**Checkpoint**: ✅ Type-safe foundation ready for feature development

---

## Phase 3: Theme System (US1, US2)

**Purpose**: Dark/light theme infrastructure required by all UI components

- [X] T023 [INFRA] Create `src/hooks/useTheme.ts` - theme context and toggle hook
- [X] T024 [INFRA] Create `src/components/atoms/ThemeProvider/ThemeProvider.tsx` - context provider with class-based switching
- [X] T025 [INFRA] Create `src/components/atoms/ThemeProvider/index.ts` - barrel export

**Checkpoint**: ✅ Theme toggle working, CSS variables switch correctly

---

## Phase 4: User Story 1 - First-Time Visitor Experience (Priority: P1) 🎯 MVP

**Goal**: Striking startup screen with "GiriD" ASCII art and job title

**Independent Test**: Load site → see ASCII hero → press key → terminal activates

### Implementation for User Story 1

- [X] T026 [US1] Create `src/components/organisms/StartupScreen/StartupScreen.tsx`:
  - Full-screen terminal-styled container
  - ASCII art "GIRID" with yellow/gold color (#c5a93c)
  - Retro terminal border (box-drawing characters)
  - Full name and job title subtext
  - Keypress/tap listener for activation
  - 3-second idle prompt "Press any key to continue..."
  - Fade transition on activation
- [X] T027 [P] [US1] Create `src/components/organisms/StartupScreen/StartupScreen.test.tsx` - render and interaction tests
- [X] T028 [P] [US1] Create `src/components/organisms/StartupScreen/useStartupScreen.ts` - keyboard/touch detection hook
- [X] T029 [US1] Create `src/components/organisms/StartupScreen/index.ts` - barrel export
- [X] T030 [US1] Create ASCII art constant in `src/components/organisms/StartupScreen/asciiArt.ts`

### E2E Test for User Story 1

- [X] T031 [US1] Create `e2e/specs/startup.spec.ts`:
  - Verify ASCII art renders on load
  - Verify subtext displays
  - Verify keypress triggers transition
  - Verify tap triggers transition (mobile viewport)
  - Verify idle prompt appears after 3s

**Checkpoint**: ✅ US1 Complete - Startup screen working independently

---

## Phase 5: User Story 2 - Desktop Command Navigation (Priority: P1) 🎯 MVP

**Goal**: Functional terminal with command input, history, and output

**Independent Test**: Type `help` → see command list → type `clear` → output clears

### Command System Implementation

- [X] T030 [US2] Create `src/commands/registry.ts` - command registration and lookup
- [X] T031 [US2] Create `src/commands/types.ts` - re-export from types for convenience
- [X] T032 [P] [US2] Create `src/commands/help.ts` - list all available commands
- [X] T033 [P] [US2] Create `src/commands/clear.ts` - clear terminal output
- [X] T034 [P] [US2] Create `src/commands/back.ts` - navigation stack pop
- [X] T035 [P] [US2] Create `src/commands/theme.ts` - toggle dark/light theme
- [X] T036 [US2] Create `src/hooks/useCommands.ts` - command execution hook

### Terminal UI Implementation

- [X] T037 [US2] Create `src/components/atoms/Cursor/Cursor.tsx` - blinking cursor animation
- [X] T038 [P] [US2] Create `src/components/atoms/Cursor/Cursor.test.tsx`
- [X] T039 [US2] Create `src/components/atoms/CommandPrompt/CommandPrompt.tsx` - `$ >` prompt styling
- [X] T040 [US2] Create `src/hooks/useCommandHistory.ts` - arrow key history navigation (session only)
- [X] T041 [US2] Create `src/components/molecules/CommandInput/CommandInput.tsx`:
  - Text input with terminal styling
  - Blinking cursor integration
  - Arrow key history navigation
  - Enter to execute
- [X] T042 [P] [US2] Create `src/components/molecules/CommandInput/CommandInput.test.tsx`
- [X] T043 [US2] Create `src/components/molecules/CommandSuggestions/CommandSuggestions.tsx` - autocomplete dropdown
- [X] T044 [US2] Create `src/components/organisms/StickyCommandBar/StickyCommandBar.tsx`:
  - Fixed header position
  - Available commands display
  - `portfolio@terminal:~` header prompt
- [X] T045 [US2] Create `src/components/organisms/Terminal/Terminal.tsx`:
  - Main application shell
  - State: history, currentOutput, context
  - Clear previous output on new command
  - Manage navigation stack
- [ ] T046 [P] [US2] Create `src/components/organisms/Terminal/Terminal.test.tsx`
- [X] T047 [US2] Create `src/components/organisms/Terminal/useTerminal.ts` - terminal state management hook

### Integration

- [X] T048 [US2] Update `src/App.tsx`:
  - Integrate ThemeProvider
  - Integrate StartupScreen → Terminal flow
  - Wire up command system

### E2E Test for User Story 2

- [X] T049 [US2] Create `e2e/specs/desktop-navigation.spec.ts`:
  - Type `help` → verify command list
  - Type `clear` → verify output clears
  - Type `theme` → verify theme toggles
  - Arrow up → verify history navigation
  - Type invalid command → verify error message
  - Verify sticky header visible after first command

**Checkpoint**: ✅ US2 Complete - Desktop terminal navigation working

---

## Phase 6: Content Infrastructure (US3, US4, US5)

**Purpose**: Markdown loading system used by writings, projects, and travel

- [X] T050 [INFRA] Create `src/hooks/useMarkdownContent.ts`:
  - Vite `import.meta.glob` for markdown files
  - Frontmatter parsing with gray-matter
  - Type-safe content loading by category
- [X] T051 [INFRA] Create `src/components/organisms/ContentViewer/ContentViewer.tsx`:
  - react-markdown rendering
  - remark-gfm for GitHub Flavored Markdown
  - Featured image at top
  - Inline image support
  - Terminal-styled typography
  - Scrollable content area
- [X] T052 [P] [INFRA] Create `src/components/organisms/ContentViewer/ContentViewer.test.tsx`
- [X] T053 [INFRA] Create `src/components/molecules/ContentCard/ContentCard.tsx`:
  - Title, date, excerpt display
  - Terminal-styled card (muted background from Figma)
  - Click/command to view detail

**Checkpoint**: ✅ Markdown system ready for content features

---

## Phase 7: User Story 3 - Browse Writings (Priority: P1) 🎯 MVP

**Goal**: View writings list and read individual entries with images

**Independent Test**: `writings` → see list → `read [slug]` → see content with image

### Sample Content

- [X] T054 [US3] Create `src/content/writings/sample-post.md` with frontmatter and inline image example

### Implementation

- [X] T055 [US3] Create `src/commands/writings.ts`:
  - `writings` command → WritingsList component
  - `read [id/slug]` command → WritingDetail component
- [X] T056 [US3] Create `src/components/organisms/WritingsList/WritingsList.tsx`:
  - List of writing entries
  - Each shows: title, date, excerpt
  - Terminal-styled formatting
- [X] T057 [US3] Create `src/components/organisms/WritingDetail/WritingDetail.tsx`:
  - ContentViewer integration
  - Featured image display
  - Back command hint

### E2E Test for User Story 3

- [X] T058 [US3] Create `e2e/specs/writings.spec.ts`:
  - `writings` → verify list renders
  - `read sample-post` → verify content displays
  - Verify featured image loads
  - `back` → return to list

**Checkpoint**: ✅ US3 Complete - Writings feature working

---

## Phase 8: User Story 4 - Browse Projects (Priority: P2)

**Goal**: View projects with tech stack tags and external links

**Independent Test**: `projects` → see list → `view [name]` → see details with links

### Sample Content

- [X] T059 [US4] Create `src/content/projects/sample-project.md` with tech stack and links

### Implementation

- [X] T060 [US4] Create `src/commands/projects.ts`:
  - `projects` command → ProjectsList component
  - `view [name]` command → ProjectDetail component
- [X] T061 [US4] Create `src/components/atoms/Tag/Tag.tsx` - tech stack tag styling
- [X] T062 [US4] Create `src/components/organisms/ProjectsList/ProjectsList.tsx`:
  - Project cards with name, description, tech stack tags
- [X] T063 [US4] Create `src/components/organisms/ProjectDetail/ProjectDetail.tsx`:
  - Full project info
  - External links (demo, repo) opening in new tabs
  - Images gallery

### E2E Test for User Story 4

- [X] T064 [US4] Create `e2e/specs/projects.spec.ts`:
  - `projects` → verify list renders
  - `view sample-project` → verify details
  - Verify external links have target="_blank"

**Checkpoint**: ✅ US4 Complete - Projects feature working

---

## Phase 9: User Story 5 - Browse Travel (Priority: P2)

**Goal**: View travel entries with location-based content and photos

**Independent Test**: `travel` → see list → `explore [location]` → see story with images

### Sample Content

- [X] T065 [US5] Create `src/content/travel/sample-trip.md` with location and images

### Implementation

- [X] T066 [US5] Create `src/commands/travel.ts`:
  - `travel` command → TravelList component
  - `explore [location]` command → TravelDetail component
- [X] T067 [US5] Create `src/components/organisms/TravelList/TravelList.tsx`:
  - Travel entries with location, date, preview image
- [X] T068 [US5] Create `src/components/organisms/TravelDetail/TravelDetail.tsx`:
  - Narrative content with images
  - Terminal-consistent image styling

### E2E Test for User Story 5

- [X] T069 [US5] Create `e2e/specs/travel.spec.ts`:
  - `travel` → verify list renders
  - `explore sample-trip` → verify content
  - Verify images render

**Checkpoint**: ✅ US5 Complete - Travel feature working

---

## Phase 10: User Story 6 - Mobile Touch Navigation (Priority: P1) 🎯 MVP

**Goal**: Touch-friendly command selection maintaining terminal aesthetic

**Independent Test**: On mobile → tap command line → drawer expands → tap command → executes

### Implementation

- [ ] T070 [US6] Create `src/hooks/useMobileDetect.ts` - viewport-based mobile detection
- [ ] T071 [US6] Create `src/components/organisms/MobileCommandDrawer/MobileCommandDrawer.tsx`:
  - Collapsed: "tap for commands" prompt at bottom
  - Expanded: scrollable command list sheet from bottom
  - Contextual commands based on current state
  - 44px minimum touch targets
  - Tap outside to collapse
- [ ] T072 [P] [US6] Create `src/components/organisms/MobileCommandDrawer/MobileCommandDrawer.test.tsx`
- [ ] T073 [US6] Create `src/components/molecules/MobileCommandItem/MobileCommandItem.tsx`:
  - Touch-friendly command button
  - Sub-selection for parameterized commands
- [ ] T074 [US6] Create `src/components/organisms/MobileNavigation/MobileNavigation.tsx`:
  - Integrate drawer with terminal
  - Touch event handling
- [ ] T075 [US6] Update `src/components/organisms/Terminal/Terminal.tsx`:
  - Conditional render: CommandInput (desktop) vs MobileNavigation (mobile)
  - Responsive layout adjustments

### E2E Test for User Story 6

- [ ] T076 [US6] Create `e2e/specs/mobile-navigation.spec.ts`:
  - Mobile viewport: tap command area → drawer opens
  - Tap `writings` → command executes, drawer closes
  - Tap parameterized command → sub-options appear
  - Tap outside → drawer closes
  - No large buttons visible

**Checkpoint**: ✅ US6 Complete - Mobile navigation working

---

## Phase 11: User Story 7 - About Page (Priority: P2)

**Goal**: Display rich About page with bio blurb, resume download, and interactive career timeline

**Independent Test**: `about` → see bio blurb → click resume download → browse career timeline with interactions

### Content & Data

- [ ] T077 [US7] Create `src/content/static/about.json` with AboutContent structure:
  - `blurb`: Markdown-formatted personal introduction
  - `resumeUrl`: Path to PDF (e.g., `/resume.pdf`)
  - `careerTimeline`: Array of CareerEntry objects
- [ ] T078 [US7] Add resume PDF to `public/resume.pdf`
- [ ] T079 [US7] Define `src/types/about.ts` with CareerEntry and AboutContent interfaces

### Components

- [ ] T080 [US7] Create `src/components/organisms/AboutView/AboutView.tsx`:
  - Bio blurb section at top
  - Resume download section
  - Career timeline section
- [ ] T081 [US7] Create `src/components/molecules/CareerTimeline/CareerTimeline.tsx`:
  - Renders entries in reverse chronological order
  - Visual connector line between entries
  - Distinct styling for education vs work (icons/colors)
- [ ] T082 [US7] Create `src/components/molecules/CareerTimeline/CareerTimelineEntry.tsx`:
  - Collapsed/expanded states
  - Logo + org + role + dates display
  - Expandable description with highlights
  - Desktop hover / mobile tap interactions
- [ ] T083 [US7] Create `src/components/atoms/ResumeDownload/ResumeDownload.tsx`:
  - Terminal-styled download button
  - Triggers browser PDF download

### Command

- [ ] T084 [US7] Create `src/commands/about.ts` - render AboutView with loaded content

### Tests

- [ ] T085 [US7] Create `src/components/molecules/CareerTimeline/CareerTimeline.test.tsx`:
  - Renders all entries
  - Education vs work styling differs
  - Entries sorted reverse chronologically
- [ ] T086 [US7] Create `src/components/molecules/CareerTimeline/CareerTimelineEntry.test.tsx`:
  - Collapsed by default
  - Expands on interaction
  - Shows highlights when expanded
- [ ] T087 [US7] Create `e2e/specs/about.spec.ts`:
  - `about` → verify bio blurb displays
  - Verify resume download button works
  - Verify career timeline renders
  - Verify timeline entry expands on interaction

**Checkpoint**: ✅ US7 Complete - Rich About page working

---

## Phase 11b: User Story 8 - Contact Page (Priority: P2)

**Goal**: Display contact methods with clickable links

**Independent Test**: `contact` → see contact links → verify links work

### Content

- [ ] T088 [US8] Create `src/content/static/contact.md` with contact methods

### Implementation

- [ ] T089 [US8] Create `src/commands/contact.ts` - render contact with clickable links
- [ ] T090 [US8] Create `src/components/atoms/Link/Link.tsx` - terminal-styled external link

### E2E Test for User Story 8

- [ ] T091 [US8] Create `e2e/specs/contact.spec.ts`:
  - `contact` → verify links are clickable

**Checkpoint**: ✅ US8 Complete - Contact page working

---

## Phase 12: Easter Egg - SpyOnHim (POLISH)

**Goal**: LLM-powered quirky status summary

### Content

- [ ] T092 [POLISH] Create `src/content/status.md` with initial status frontmatter template

### Implementation

- [ ] T093 [POLISH] Create `src/commands/spyonhim.ts`:
  - Read `status.md` content
  - Call Azure OpenAI API with spy-report prompt
  - 5-minute cache to reduce API calls
  - Fallback to raw status if API unavailable
- [ ] T094 [POLISH] Create `src/components/organisms/SpyReport/SpyReport.tsx`:
  - Typing animation effect for dramatic reveal
  - Spy-report styled output
  - Terminal aesthetic maintained
- [ ] T095 [POLISH] Create `src/utils/azureOpenAI.ts` - Azure OpenAI API wrapper with error handling

### E2E Test for Easter Egg

- [ ] T096 [POLISH] Create `e2e/specs/easter-egg.spec.ts`:
  - `spyonhim` → verify response renders
  - Verify typing animation plays

**Checkpoint**: ✅ Easter egg working

---

## Phase 13: Polish & Accessibility (POLISH)

**Purpose**: Final quality improvements

### Accessibility

- [ ] T097 [POLISH] Add ARIA labels to all interactive components
- [ ] T098 [POLISH] Add ARIA live region for command output announcements
- [ ] T099 [POLISH] Verify keyboard navigation through all commands
- [ ] T100 [POLISH] Add focus management for command input
- [ ] T101 [POLISH] Test with screen reader (manual)

### Performance

- [ ] T102 [P] [POLISH] Optimize images: convert to WebP, add lazy loading
- [ ] T103 [P] [POLISH] Verify code splitting for routes/content
- [ ] T104 [POLISH] Run Lighthouse audit, fix any issues below 90
- [ ] T105 [POLISH] Run bundle analyzer, remove unused dependencies

### Error Handling

- [ ] T106 [POLISH] Add error boundary component
- [ ] T107 [POLISH] Add image fallback placeholders
- [ ] T108 [POLISH] Add loading states for content

**Checkpoint**: ✅ Lighthouse Performance ≥90, Accessibility ≥90

---

## Phase 14: Comprehensive Testing (TEST)

**Purpose**: Ensure all features work correctly

### Unit Tests

- [ ] T109 [P] [TEST] Unit tests for `parseCommand.ts`
- [ ] T110 [P] [TEST] Unit tests for `matchCommand.ts`
- [ ] T111 [P] [TEST] Unit tests for `formatDate.ts`
- [ ] T112 [P] [TEST] Unit tests for all command handlers

### Component Tests

- [ ] T113 [P] [TEST] Component tests for ThemeProvider
- [ ] T114 [P] [TEST] Component tests for ContentViewer
- [ ] T115 [TEST] Component tests for Terminal state management

### E2E Full Flow

- [ ] T116 [TEST] Create `e2e/specs/full-flow.spec.ts`:
  - Complete user journey from startup to content browsing
  - Theme toggle persistence within session
  - Cross-browser testing (Chrome, Firefox, Safari)

**Checkpoint**: ✅ All tests passing, ≥80% utility coverage

---

## Dependencies & Execution Order

### Phase Dependencies

```
Phase 1 (Setup) ─────────────────────────────────────────────┐
       │                                                      │
       ▼                                                      │
Phase 2 (Types/Utils) ───────────────────────────────────────┤
       │                                                      │
       ▼                                                      │
Phase 3 (Theme) ─────────────────────────────────────────────┤
       │                                                      │
       ├─────────────┬─────────────┬─────────────┐           │
       ▼             ▼             ▼             ▼           │
   Phase 4       Phase 5       Phase 6      Phase 10         │
   (US1:Startup) (US2:Desktop) (Content)   (US6:Mobile)      │
       │             │             │             │           │
       └─────────────┴──────┬──────┴─────────────┘           │
                            │                                │
                            ▼                                │
              ┌─────────────┼─────────────┐                  │
              ▼             ▼             ▼                  │
          Phase 7       Phase 8       Phase 9                │
          (US3:Write)   (US4:Proj)    (US5:Travel)           │
              │             │             │                  │
              └─────────────┴──────┬──────┘                  │
                                   │                         │
                                   ▼                         │
                              Phase 11                       │
                              (US7:About)                    │
                                   │                         │
                                   ▼                         │
                              Phase 11b                      │
                              (US8:Contact)                  │
                                   │                         │
                                   ▼                         │
                              Phase 12                       │
                              (Easter Egg)                   │
                                   │                         │
                                   ▼                         │
                              Phase 13                       │
                              (Polish)                       │
                                   │                         │
                                   ▼                         │
                              Phase 14                       │
                              (Testing)                      │
```

### Parallel Opportunities

| Phase | Parallel Tasks |
|-------|----------------|
| Phase 1 | T005 + T006 + T011 + T012 |
| Phase 2 | T013 + T014 + T015, then T016-T020 all parallel |
| Phase 4 | T025 + T026 (tests + hook) |
| Phase 5 | T032-T035 (all commands), T038 + T042 + T046 (tests) |
| Phase 7-9 | Can run in parallel after Phase 6 |
| Phase 11 | T080-T083 (components), T085 + T086 (tests) |
| Phase 11b | T088 + T089 |
| Phase 13 | T093 + T094 |
| Phase 14 | T100-T105 all parallel |

### MVP Path (Minimum Viable Portfolio)

For fastest time-to-demo, complete in order:
1. Phase 1-3 (Setup + Theme)
2. Phase 4 (US1: Startup)
3. Phase 5 (US2: Desktop Navigation)
4. Phase 6 (Content Infrastructure)
5. Phase 7 (US3: Writings)
6. Phase 10 (US6: Mobile)

**MVP Complete**: ~50 tasks, fully functional portfolio with writings

---

## Task Summary

| Phase | Tasks | Priority |
|-------|-------|----------|
| Setup & Infrastructure | T001-T014 | P0 (Blocking) |
| Types & Utilities | T015-T022 | P0 (Blocking) |
| Theme System | T023-T025 | P0 (Blocking) |
| US1: Startup | T026-T031 | P1 |
| US2: Desktop Nav | T032-T051 | P1 |
| Content Infrastructure | T052-T055 | P1 |
| US3: Writings | T056-T060 | P1 |
| US4: Projects | T061-T066 | P2 |
| US5: Travel | T067-T071 | P2 |
| US6: Mobile | T072-T078 | P1 |
| US7: About | T079-T089 | P2 |
| US8: Contact | T090-T091 | P2 |
| Easter Egg | T092-T096 | P3 |
| Polish | T097-T108 | P2 |
| Testing | T109-T116 | P1 |

**Total**: 116 tasks
