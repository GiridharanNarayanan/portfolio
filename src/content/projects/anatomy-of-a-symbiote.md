---
title: "Anatomy of a symbiote"
date: "2026-02-07"
excerpt: "A small MCP server that gives an agent a consistent posture and a persistent memory layer across clients."
published: true
featuredImage: "/images/projects/anatomy-of-a-symbiote.svg"
readTime: "6 min read"
techStack:
  - Python
  - FastAPI
  - Model Context Protocol (MCP)
  - Server-Sent Events (SSE)
  - ChromaDB
  - sentence-transformers
tags:
  - mcp
  - agents
  - memory
  - python
links:
  demo: ""
  repo: ""
---

This is the implementation layer behind the ideas in [Symbiote](/writings/symbiote).

In that piece, I kept returning to a small equation:

```text
consciousness + memory = identity
```

Not consciousness in the mystical sense. More like posture: the stable constraints, defaults, and tone that make an agent feel like the same presence each time it shows up.

Symbiote MCP is the practical version of that equation. It does not try to build a mind. It gives a client two things that are easy to lose when you move between tools: a consistent way to arrive, and a consistent place to remember.

---

## The shape of the server

The implementation is deliberately boring (said with affection): a small FastAPI app that hosts an MCP server, plus a memory subsystem that handles embeddings and persistence.

There are two ways in:

- **Remote MCP over SSE** for cross-platform continuity. The server holds an SSE stream at `/sse`, and clients POST JSON-RPC messages to `/messages/`.
- **Local MCP over stdio** via `python -m src.server --stdio`. Some clients prefer subprocess transports; here it mostly functions as a development and testing lane.

On startup, the server does three quiet pieces of setup: it loads the embedding model, opens the Chroma collection, and loads the personality prompt from a markdown file.

![Symbiote architecture](/images/projects/anatomy-of-a-symbiote.svg)

---

## MCP features used (and why they matter)

MCP can be described with a lot of nouns. The version that matters here is simpler: it gives you a clean place to put posture and capability.

### Posture: how identity gets injected

The server offers two forms of arrival context, and they complement each other.

- **Server instructions**: a short contract the client sees during initialization. In plain terms: which tools are safe, which ones are read-only, and where the personality context lives.
- **Prompts**: the personality comes from a markdown file, exposed as an MCP prompt named **“Spawn Venom.”** I like this because the posture stays visible and editable; it is not buried inside Python.

There is also a pragmatic fallback: a tool named `spawn_venom` that returns the same personality text for clients that do not support MCP prompts. It is less elegant than prompts, but elegance is not the point. Continuity is.

---

## Memory: how continuity becomes retrievable

The memory surface area is intentionally small: `store_memory` and `search_memory`.

What makes those tools useful is not the API. It is the pairing of embeddings with persistence.

You store text, it becomes a vector, and both are persisted. Later you embed a query, ask for nearest neighbors, and get back a handful of candidates with scores.

That is the whole loop. Small enough to trust. Concrete enough to extend.

---

## Under the hood

### Embeddings (sentence-transformers)

The server wraps `sentence-transformers` behind a lazy-loading embedding service.

The default model is `all-MiniLM-L6-v2`, which yields 384-dimensional vectors. That detail is not poetry, but it matters: it tells you this is meaning-based retrieval, not keyword matching.

One operational choice I like, mostly because it prevents the kind of bug that shows up at midnight: it suppresses progress bars and noisy logs. MCP stdio uses stdout for protocol messages. Keeping stdout clean keeps the transport calm.

### Persistence and search (ChromaDB)

For persistence, it uses ChromaDB via a `PersistentClient`.

Chroma does the unromantic work: keeping vectors on disk (default `./data`), organizing them into a named collection (default `venom_memories`), and answering nearest-neighbor queries.

There is a quiet advantage to this approach: the server does not try to decide what matters. It returns candidates with a relevance score and leaves judgment to the agent.

---

## Why this architecture holds up

What I like about this design is that it stays honest about boundaries.

- The **server** is responsible for persistence, retrieval, and clear contracts.
- The **client/agent** is responsible for deciding what to store, when to search, and how to interpret results.
- The **personality prompt** is a real artifact, not an implicit vibe in code.

It is not a big system. But it is a complete one: remote transport, a local dev lane, a prompt-based identity handshake, and a memory loop that stays understandable end-to-end.

---

## What I would add next

If this stays useful, the next improvements will not be about making it louder. They will be about making it more precise.

- **Selective deletion**: a `forget_memory` tool for explicit removal, with clear user intent.
- **Top-of-mind retrieval**: a `top_of_mind` tool that returns a small, curated set of currently relevant memories without requiring a perfect query.
- **Better result shaping**: summaries, deduping, and compact formats so continuity does not come with constant context bloat.
- **Scoped spaces**: separate memory compartments (work vs personal vs projects) so the wrong context does not leak into the wrong conversation.

The goal is the same: keep the boundary sharp, keep the system calm, and make it easier for an agent to feel like itself no matter where it shows up.
