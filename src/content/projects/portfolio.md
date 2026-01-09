---
title: "Portfolio"
date: "2025-01-01"
excerpt: "A portfolio website styled as an interactive terminal, inspired by the efficiency of recent TUI-based tools."
published: true
featuredImage: "/images/projects/portfolio.svg"
readTime: "4 min read"
techStack:
  - React
  - TypeScript
  - Tailwind CSS
  - Vite
  - Bun
  - Azure Static Web Apps
tags:
  - webdev
  - portfolio
  - frontend
  - tui
links:
  demo: "https://girid.me"
  repo: "https://github.com/GiridharanNarayanan/portfolio"
---

A portfolio website that trades the familiar click-and-scroll for something more deliberate: a terminal interface.

---

## Why a terminal?

The terminal has always been part of my workflow. Git commands, build scripts, the usual developer rituals. But it was a tool for known tasks, not the center of how I worked.

Then something shifted.

Over the past year, a wave of TUI-based coding agents emerged. Tools like Claude Code and Codex CLI that turned the terminal into a conversational workspace. What struck me was the efficiency. The interface was sparse, but that sparseness created focus. No sidebars competing for attention. No notifications sliding in from the edges. Just a prompt, a response, and the work in front of me.

It made me curious. Not about abandoning graphical interfaces, but about what a terminal-first design might teach me. This portfolio became the experiment.

---

## What it does

The site functions like a simplified Unix shell. You navigate with `cd`, list contents with `ls`, and read files with `cat`. There is tab completion, command history, and a small set of Easter eggs for those who look for them.

Underneath, it is a React application styled to feel like something older. The monospace fonts, the blinking cursor, the sparse layout, all of it is intentional. The goal was not to simulate a terminal perfectly, but to capture the feeling of one: the directness, the quiet, the sense that every action is deliberate.

---

## Technical choices

- **React 19** with TypeScript for type safety and component architecture
- **Tailwind CSS** for styling that could adapt to the terminal aesthetic
- **Vite** and **Bun** for fast builds and a pleasant development experience. Bun was new to me, and I was curious whether the speed claims held up. They did. Cold starts that used to take seconds now take milliseconds. It changed how often I was willing to restart the dev server, which sounds small but adds up.
- **Azure Static Web Apps** for hosting with automatic deployments from GitHub

The content lives in Markdown files with frontmatter. Adding a new writing or project is as simple as dropping a file into the right folder.

---

## Desktop and mobile

A terminal interface on desktop feels natural. A wide screen, a physical keyboard, the muscle memory of typing commands. But what happens when the same interface appears on a phone?

This question shaped more of the design than I expected.

On desktop, the experience leans into what terminals do well. Tab completion. Command history with arrow keys. A persistent prompt at the bottom of the screen. The layout assumes you will type, and it rewards that assumption with speed.

On mobile, typing is slower and less precise. Tapping is the native interaction. So the interface adapts. Files and folders become tappable elements. A floating command bar provides quick access to common actions. The prompt stays accessible, but the design no longer assumes it is your primary input.

The challenge was making these two experiences feel like the same product. Not a desktop site with a mobile fallback, but a single design that responds to context. The terminal aesthetic remains consistent. The interaction model shifts to meet the device.

Getting this right required more iteration than I anticipated. Early versions felt awkward on one platform or the other. The current balance is not perfect, but it is considered. Every choice has a reason.

---

## What I learned

Building this taught me a few things I did not expect.

First, constraints can be generative. The terminal aesthetic limited what I could do visually, and that limitation forced clearer thinking about information hierarchy. When you cannot rely on color gradients or hero images to carry the design, the content has to do more work.

Second, designing for multiple form factors requires more than responsive layouts. A phone and a laptop are not just different screen sizes. They are different interaction paradigms. Recognizing that distinction early would have saved some rework.

Third, there is real value in building something that feels different. Most portfolios follow similar patterns. This one does not. Whether that is a strength or a weakness depends on who is visiting, but it at least creates a moment of pause. Sometimes, that is enough.

---

## What is next

The site is live. The code is public. There are small improvements I will make over time, things like better mobile interactions, more content, perhaps a few more hidden surprises. But the core of it is done.

If you are reading this on the site, you are already using it. Type `help` if you want to see what else is possible.
