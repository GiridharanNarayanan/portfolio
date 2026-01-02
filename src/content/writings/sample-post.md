---
title: "Building a Terminal-Style Portfolio"
date: "2024-01-15"
excerpt: "A deep dive into creating a modern portfolio website with retro terminal aesthetics using React and Tailwind CSS."
published: true
featuredImage: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800"
tags:
  - react
  - typescript
  - tailwindcss
  - webdev
---

# Building a Terminal-Style Portfolio

When I set out to redesign my portfolio, I wanted something that would stand out. As a developer who spends most of their day in a terminal, it felt natural to bring that aesthetic to the web.

## The Vision

The goal was simple: create a portfolio that feels like an interactive terminal while maintaining the polish expected of a modern website. This meant:

- **Command-based navigation** - Type commands to explore
- **Familiar aesthetics** - Monospace fonts, dark backgrounds, and that iconic green-on-black look
- **Modern UX** - Despite the retro style, the experience should be smooth and intuitive

## Technical Stack

The project is built with:

- **React 19** for component-based architecture
- **TypeScript** for type safety
- **Tailwind CSS 4** for styling
- **Vite** for lightning-fast builds

## Key Features

### 1. Command System

The heart of the portfolio is its command system. Users can type commands like `help`, `writings`, `projects`, and `travel` to navigate.

```typescript
interface Command {
  name: string;
  description: string;
  handler: (args: string[]) => CommandResult;
}
```

### 2. Markdown Content

All content is stored as Markdown files with frontmatter, making it easy to add new posts without touching the code.

### 3. Theme Support

Both dark and light themes are available, because sometimes you need to work in a well-lit room!

## Lessons Learned

Building this project taught me a lot about:

1. Creating custom command parsers
2. Working with Vite's glob imports
3. Implementing accessible terminal UIs

## What's Next

Future plans include:

- Adding more Easter eggs (hint: try `spyonhim`)
- Implementing a visitor counter
- Adding RSS feed support

Thanks for reading! Feel free to explore the portfolio using the commands available.

---

*Type `back` to return to the writings list.*
