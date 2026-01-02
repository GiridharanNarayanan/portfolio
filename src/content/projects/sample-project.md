---
title: "Terminal Portfolio Website"
date: "2024-01-01"
excerpt: "A retro-styled portfolio website built with React and styled as an interactive terminal interface."
published: true
featuredImage: "https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=800"
techStack:
  - React
  - TypeScript
  - Tailwind CSS
  - Vite
  - Vitest
  - Playwright
tags:
  - webdev
  - portfolio
  - frontend
links:
  demo: "https://example.com/portfolio"
  repo: "https://github.com/example/portfolio"
gallery:
  - "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400"
  - "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400"
  - "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400"
---

# Terminal Portfolio Website

A modern portfolio website that brings back the nostalgic feel of terminal interfaces while maintaining a clean, professional look.

## Overview

This project showcases how to build a unique portfolio experience using React and modern web technologies. The terminal-style interface allows visitors to interact with your portfolio through typed commands.

## Key Features

### Command-Based Navigation

Navigate through the portfolio by typing commands like:
- `help` - View available commands
- `writings` - Browse blog posts
- `projects` - View projects
- `about` - Learn more about me and get in touch

### Dark/Light Theme Support

Switch between dark and light themes with the `theme` command to match your preference.

### Responsive Design

Works seamlessly on both desktop and mobile devices, with touch-friendly interactions on smaller screens.

## Technical Highlights

- **Type-Safe Command System**: Built with TypeScript for reliable command parsing and execution
- **Markdown Content**: All content is stored as Markdown files with frontmatter
- **Zero CLS**: Carefully optimized to prevent layout shifts during loading
- **Performance First**: Lazy loading, code splitting, and optimized bundle sizes

## What I Learned

Building this project taught me valuable lessons about:

1. Creating custom CLI-like interfaces in the browser
2. Working with Vite's module system for dynamic content loading
3. Implementing accessible terminal UIs
4. Managing complex state with React hooks

## Future Improvements

- Add more Easter eggs
- Implement command history persistence
- Add RSS feed for blog posts
- Create a visitor counter

---

*Type `back` to return to the projects list.*
