---
title: "Conjure Viz MCP"
date: "2026-04-08"
excerpt: "An MCP App that renders interactive charts and diagrams inline in any MCP client that supports app rendering."
featuredImage: "/images/projects/conjure-viz-mcp/conjure-viz-mcp.svg"
published: true
readTime: "6 min read"
techStack:
  - TypeScript
  - Model Context Protocol (MCP)
  - React
  - Chart.js
  - Mermaid
  - Vite
tags:
  - mcp
  - visualization
  - tooling
links:
  demo: ""
  repo: "https://github.com/GiridharanNarayanan/conjure-viz-mcp"
---

Claude Desktop has spoiled me.

Not with code. With pictures. Ask it something about data and it reaches for an illustration before you finish reading the response. A chart, a diagram, a flow. Sometimes a little trigger happy about it, but that is not a bad instinct. A chart I can scan in a second often replaces three scrolls of explanation.

I started wanting that everywhere.

---

## The premise

At Microsoft, the tool you reach for is shaped by the data it touches. I use Claude Code for building and design thinking. It is excellent at both. But production telemetry is out of bounds — that path runs through customer and service data that compliance boundaries define clearly. For live site investigation, on-call work, and anything touching operational data, GitHub Copilot is the right surface. Its agent integration is adequate and catching up.

So the split is natural. Claude Code for building. GitHub Copilot for engineering operations: on-call, diagnostics, maintenance, BI. And it is the operations side where I wanted visuals.

---

## The gap

The need was not really about coding or general questions. It was about the two areas where I spend the most time beyond code: on-call management and business intelligence. Incident timelines, adoption trends, funnel breakdowns, service dependency maps. The kind of work where a chart is not decoration. It is the fastest way to understand what is happening.

But GitHub Copilot Chat does not have built-in visualization the way Claude's apps do. Other options I found were either too clunky or produced poor output. Nothing felt like it belonged in the workflow.

---

## Custom personal software

There is a shift happening in how people relate to software. For a long time, the default was to find an existing product that came close enough to what you needed. You adapted to its opinions. You lived with the gaps. Now, if you know what you want to build, AI makes it far easier to just build it. The barrier between having an idea and having the tool is lower than it has ever been.

This is where MCP Apps come in. GitHub Copilot supports app rendering: an MCP server can ship a self-contained HTML resource and the host renders it inline in the conversation. That means you can build a visualization layer that lives inside your editor, shaped entirely around your own workflows.

So I built one. An MCP server that exposes 14 chart tools, for now. The LLM calls a tool, passes structured data, and a chart appears inline in the conversation. Trendlines, funnels, pie charts, bar charts, KPIs, heatmaps, scatter plots, histograms, sankey diagrams, sparklines, threshold lines, sequence diagrams, dependency graphs, and Gantt charts.

No business logic. No telemetry querying. No opinions about the data. It is a pure renderer. It receives structured data from whatever calls it and draws. The value is in what it does not do.

I tuned it for my primary use cases with minimum interactions. More will come later. For distribution, I use npm as a personal pipeline. `npx conjure-viz-mcp --stdio` and it is running. No cloning, no build step. That simplicity matters when you want to use it across machines without thinking about it.

There is something satisfying about building software this way. You stop searching for a product that does what you want and start assembling the pieces yourself. A tool shaped to your hand, distributed through infrastructure that already exists, wired into the environment you already use.

---

## Architecture

The project is a Node.js MCP server written in TypeScript. On the server side, `main.ts` handles transport (stdio for production, HTTP for development) and `server.ts` registers every tool and resource. On the client side, a React app bundled by Vite renders the charts inside a sandboxed iframe that the host manages.

### One tool per chart type

A single `render-chart` tool with a `viewType` parameter would be cleaner API design. I started there, in fact. But 14 separate tools turned out to be better LLM ergonomics.

Each tool carries its own description with the exact columns required. `render-trendline` says: data must have columns date, group, value. `render-funnel` says: data must have columns stage, value. The LLM reads these descriptions and knows exactly what to pass without needing to consult a capabilities resource first.

That tradeoff, more tools for less ambiguity, is worth it. The LLM picks the right chart type more reliably when the contract is explicit in each tool description rather than buried in a shared schema.

---

### Two HTML bundles

The client-side app ships as two separate self-contained HTML files, not one.

The first bundle handles Chart.js-based views: trendlines, bars, pies, funnels, KPIs, heatmaps, sparklines, thresholds, scatter plots, histograms, and sankey diagrams. The second handles Mermaid-based views: sequence diagrams, dependency graphs, and Gantt charts.

The split is deliberate. Mermaid's SVG rendering engine is large. Bundling it alongside Chart.js would mean every trendline carries the weight of a diagramming library it never uses. By separating them, chart renders stay fast and lightweight. The server registers each tool with a `_meta.ui.resourceUri` pointing to the correct bundle, so the host only loads what the tool actually needs.

---

### Self-contained by spec

MCP Apps require the HTML resource to be fully self-contained. Everything, React, Chart.js or Mermaid, CSS, all 14 view components, gets inlined into a single file per bundle using `vite-plugin-singlefile`. No external network requests at render time.

---

### A lighter protocol client

The official `@modelcontextprotocol/ext-apps` React SDK pulls in zod and the full MCP SDK, adding roughly 280KB to the browser bundle. For a client-side app that only needs to receive structured data and render it, that felt heavy. So I wrote `mcp-lite`, a minimal protocol client that handles the iframe messaging, host context, and theme sync in under 200 lines. Same behavior, smaller footprint.

---

### Working inside the sandbox

MCP Apps render inside a sandboxed iframe that the host manages. This introduces constraints you would not hit building a normal web app.

- **Off-screen rAF throttling.** Browsers throttle `requestAnimationFrame` to zero in off-screen iframes. Chart.js relies on rAF for its initial draw, which means charts simply never render if the iframe is scrolled below the viewport. The fix is blunt but effective: replace `requestAnimationFrame` with `setTimeout` at the document level and disable Chart.js animations globally. Charts render regardless of scroll position.
- **Message buffering race.** The host can send tool data before React has mounted. An early inline script in the HTML shell buffers incoming JSON-RPC messages while the module JavaScript loads. The React app replays that buffer on connect. Without it, tool data arrives and vanishes.
- **Mermaid paint stall.** Mermaid's SVG rendering engine can stall in an off-screen iframe because the browser skips paints. A CSS animation hack (`translateZ(0)` with a perpetual opacity keyframe) forces a compositing layer so the browser keeps painting even when the iframe is not visible.

These are not complex problems individually. But getting an interactive React app to render reliably inside someone else's iframe, off-screen, with data arriving before the app loads, required more care than the charting code itself.

---

### Theme awareness

Charts adapt to the VS Code theme automatically. The host injects `--vscode-*` CSS variables into the iframe, and a bridge function maps them to the app's own `--color-*` tokens. But canvas elements cannot use CSS `var()` directly, so Chart.js colors are resolved from computed styles before being passed in as options. Mermaid picks up theme variables through its own configuration. Light, dark, and high contrast all work without the user doing anything.

---

## How it fits in

Right now, conjure-viz-mcp is wired into the MCP servers and custom agents I use for internal work. The on-call agent can render an incident timeline as a Gantt chart or a service dependency as a graph diagram. The analytics workflows can show adoption trendlines or funnel breakdowns inline, instead of describing them in text.

The instruction baked into the server says: prefer visualizing data over presenting raw tables or bullet-point lists. When data has a natural visual shape, draw it.

---

## What is next

The current version covers the chart types I reach for most. What comes next is about making the output more useful after it renders.

Annotations first — a way to mark a data point during an incident review so the chart carries context, not just shape. Then export: PNG or SVG for pasting into postmortems and reports. Further out, composability — a single prompt producing multiple charts side by side, closer to a dashboard than a single visual.

Further out, the interesting question is whether the rendering layer can close the loop with the diagnostic layer. Right now, the on-call agent queries telemetry, reasons about it, and then calls conjure-viz-mcp to draw the result. Those are still separate steps. The vision is a single pass: the agent investigates, decides what matters, and renders the answer in the same motion.

The current version does what I needed: pictures in the conversation, shaped to the work I actually do. Everything after that is just making the pictures smarter.