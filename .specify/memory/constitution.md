# GiriD Portfolio Constitution

## Technology Stack

| Layer | Technology | Version |
|-------|------------|---------|
| Runtime | Bun | Latest stable |
| Build Tool | Vite | 5.x+ |
| Framework | React | 18.x+ |
| Language | TypeScript | 5.x+ (strict mode) |
| Styling | Tailwind CSS | 3.x+ |
| E2E Testing | Playwright | Latest stable |
| Unit Testing | Vitest | Latest stable |

## Core Principles

### I. Component-First Architecture

- Every UI element MUST be a reusable, self-contained React component
- Components follow atomic design: atoms → molecules → organisms → templates → pages
- Each component MUST have a single responsibility (SRP)
- Components MUST be colocated with their styles, tests, and types in the same directory
- Prefer composition over inheritance; use hooks for shared logic
- No business logic in components—delegate to custom hooks or utilities

### II. TypeScript Strict Mode (NON-NEGOTIABLE)

- `strict: true` in tsconfig.json at all times
- No `any` types unless explicitly justified with a `// @ts-expect-error` comment explaining why
- All function parameters and return types MUST be explicitly typed
- Use discriminated unions for state management
- Prefer `unknown` over `any` when type is truly unknown
- Interface for object shapes; Type for unions, intersections, and primitives

### III. Tailwind-First Styling

- All styling MUST use Tailwind utility classes—no inline styles or CSS modules
- Custom CSS only permitted in `index.css` for:
  - CSS custom properties (design tokens)
  - Base element resets
  - Keyframe animations not achievable via Tailwind
- Use Tailwind's design system: stick to the default spacing/color scales unless extending in `tailwind.config.js`
- Component variants MUST use `class-variance-authority` (CVA) or similar pattern
- Dark mode MUST use Tailwind's `dark:` variant with class-based toggling

### IV. Test-Driven Development

- **Unit tests (Vitest)**: All utility functions, hooks, and pure logic MUST have unit tests
- **Component tests (Vitest + Testing Library)**: Interactive components MUST have behavior tests
- **E2E tests (Playwright)**: All user journeys defined in specs MUST have corresponding E2E tests
- Test files colocated: `Component.tsx` → `Component.test.tsx`
- E2E tests in `/e2e` directory, organized by feature
- Minimum coverage targets: 80% for utilities, 70% for components
- Tests MUST be written before or alongside implementation, never after

### V. Performance by Default

- Lighthouse performance score MUST remain ≥90
- Bundle size monitored—no dependency added without justification
- Images MUST be optimized (WebP/AVIF with fallbacks) and lazy-loaded
- Use `React.lazy()` and `Suspense` for code splitting on routes
- Avoid unnecessary re-renders: `useMemo`, `useCallback` only when profiler indicates need
- No blocking resources in critical rendering path

### VI. Accessibility (A11y) Non-Negotiable

- WCAG 2.1 AA compliance required
- All interactive elements MUST be keyboard accessible
- Semantic HTML elements preferred over divs with ARIA
- Color contrast MUST meet AA standards (4.5:1 for normal text, 3:1 for large)
- Focus states MUST be visible and styled intentionally
- Screen reader testing with at least one tool (e.g., VoiceOver, NVDA)

### VII. Simplicity & YAGNI

- No premature abstractions—wait until pattern repeats 3+ times
- No state management library unless local state + context proves insufficient
- Prefer native browser APIs over libraries when practical
- Every dependency MUST justify its inclusion (bundle size vs. value)
- Delete dead code immediately—no commented-out code in commits

## Project Structure

```
src/
├── components/          # Reusable UI components (atomic design)
│   ├── atoms/          # Buttons, inputs, icons
│   ├── molecules/      # Command input, card, etc.
│   ├── organisms/      # Terminal, navigation, content viewer
│   └── templates/      # Page layouts
├── hooks/              # Custom React hooks
├── pages/              # Route-level components
├── utils/              # Pure utility functions
├── types/              # Shared TypeScript types/interfaces
├── content/            # Markdown files (writings, projects, travel)
├── assets/             # Static assets (images, fonts)
└── styles/             # Global styles, Tailwind config extensions
e2e/
├── fixtures/           # Test data and utilities
└── specs/              # Playwright test files by feature
```

## File Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Components | PascalCase | `CommandInput.tsx` |
| Hooks | camelCase with `use` prefix | `useTerminal.ts` |
| Utilities | camelCase | `parseCommand.ts` |
| Types | PascalCase | `Command.types.ts` |
| Tests | Same name + `.test` | `CommandInput.test.tsx` |
| E2E Tests | kebab-case + `.spec` | `terminal-navigation.spec.ts` |
| Markdown content | kebab-case | `my-first-post.md` |

## Code Quality Gates

### Pre-Commit (Enforced via Husky + lint-staged)

- ESLint MUST pass with zero errors
- Prettier formatting MUST be applied
- TypeScript MUST compile with no errors
- Affected unit tests MUST pass

### Pre-Push

- Full test suite MUST pass
- No console.log statements (use proper logging or remove)
- Bundle size diff reported

### CI/CD Pipeline

1. Install dependencies (`bun install`)
2. Type check (`bun run typecheck`)
3. Lint (`bun run lint`)
4. Unit & component tests (`bun run test`)
5. Build (`bun run build`)
6. E2E tests against preview build (`bun run test:e2e`)
7. Lighthouse CI audit
8. Deploy (if all gates pass)

## Development Workflow


### Version Control Principles
- Commit granularity: **exactly one Git commit per phase/user story**.
- Commit format: `{type}: [T###] {short summary}`; include references (link to spec section, plan step).

### Branch Strategy

- `main` — production-ready, protected
- `feature/[feature-name]` — new features
- `fix/[issue-description]` — bug fixes
- `refactor/[scope]` — code improvements without behavior change

### Commit Convention (Conventional Commits)

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`, `perf`

Examples:
- `feat(terminal): add command history navigation`
- `fix(mobile): correct touch target sizing`
- `test(e2e): add writings navigation tests`

## Dependency Policy

### Approved Dependencies (Pre-Authorized)

- React, React DOM
- Tailwind CSS, postcss, autoprefixer
- react-markdown, remark-gfm (for markdown rendering)
- class-variance-authority (component variants)
- Playwright, Vitest, @testing-library/react

### Requires Justification

- Any state management library
- Animation libraries (prefer CSS/Tailwind)
- Any package > 50KB gzipped
- Packages with < 1000 weekly downloads

### Prohibited

- jQuery or jQuery-dependent packages
- Moment.js (use native Date or date-fns if needed)
- Lodash full bundle (individual imports only if necessary)
- Any package with known security vulnerabilities

## Governance

- This constitution supersedes all other practices and preferences
- Amendments require documented rationale and explicit approval
- All code reviews MUST verify compliance with these principles
- Exceptions MUST be documented with `// CONSTITUTION EXCEPTION: [reason]`
- Technical debt MUST be tracked as GitHub issues with `tech-debt` label

**Version**: 1.0.0 | **Ratified**: 2026-01-01 | **Last Amended**: 2026-01-01

