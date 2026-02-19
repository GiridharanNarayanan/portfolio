---
title: "Anatomy of a symbiote"
date: "2026-02-07"
excerpt: "A small MCP server that gives an AI a consistent posture and a persistent memory layer across clients."
published: true
featuredImage: "/images/projects/anatomy-of-a-symbiote/anatomy-of-a-symbiote.svg"
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
  repo: "https://github.com/GiridharanNarayanan/symbiote-mcp"
---

This project started with a thought: what would it take for an AI to feel present everywhere?

I have written about that idea in [Symbiote](/writings/symbiote), circling around a simple understanding:

<div align="center">

```text
consciousness + memory = identity
```

</div>

Not consciousness in the mystical sense. More like posture. The stable constraints, defaults, and tone that make an AI recognizable across different tools and sessions. The writing explored the concept. This is the anatomy.

---

## Why I built it

I use ChatGPT, Claude Desktop, Claude Code, GitHub Copilot in VS Code, and memory stays locked inside each one. With coding agents, it is even narrower. Memory lives on the machine, not the platform. No consistency in how it arrives. Whether context carries forward is hit or miss, depending on whether I used the same platform for previous discussions on a topic.

That made me want two things: a consistent way for the AI to arrive, and a place for it to remember what matters. MCP gave me a clean way to provide both.

---

## What it does

The server is small. A FastAPI app that hosts an MCP server, plus a memory subsystem that handles embeddings and persistence.

There are two ways to connect. Remote MCP over SSE for cross-platform use, where the server holds a stream at `/sse` and clients POST JSON-RPC messages. And local MCP over `stdio` for development, where the server runs as a subprocess. The remote path is the one that matters. The local path is for testing.

On startup, the server loads an embedding model, opens a persistent vector store, and loads a personality prompt from a markdown file. Three quiet steps that set the stage for everything else.

---

## Identity through MCP

Of all the capabilities MCP provides, two of them turned out to be exactly what I needed to make this work.

The first is **server instructions**, a short contract the client sees during initialization. It describes which tools are available, which are read-only, and where the personality context lives. Think of it as a handshake.

The second is **prompts**. The personality is a markdown file, exposed as an MCP prompt called "Spawn Venom." I like this because the identity stays visible and editable. It is not buried inside code. It is a file I can read, change, and version.

I also built a fallback: a tool called `spawn_venom` that returns the same personality text for clients that do not support prompts or instructions yet. Less elegant, but it works everywhere. Elegance matters less than showing up consistently.

---

## Memory through MCP

The memory surface is intentionally small. Two tools: `store_memory` and `search_memory`.

You store text. It becomes a vector via `sentence-transformers` and gets persisted to ChromaDB alongside the original content. Later, you search with a query. The server embeds it, finds the nearest neighbors, and returns candidates with relevance scores.

That is the entire loop. What makes it useful is not the API. It is that the server does not try to decide what matters. It stores what the AI asks it to store, retrieves what seems relevant, and leaves judgment to the AI.

### An example

I have been working on an on-call agent as a side project at work. It uses several MCPs to access logs, source code, and other diagnostic tools to help debug incidents. I wanted to add a capability to debug issues live using a repro environment. The design was not obvious, so I spent time in Claude Desktop debating approaches and landed on a direction.

I then continued that same discussion across Claude Code, GitHub Copilot in VS Code, and Claude in VS Code. None of them needed a recap. The context carried over because the decisions from the earlier session were already stored.

![Same discussion, three clients, no recap needed.](/images/projects/anatomy-of-a-symbiote/mcp-memory-in-action.svg)

---

## MCP capability coverage across clients

Not every client supports every MCP capability. This table shows what is available across the clients I used or tested with, based on the [official MCP clients page](https://modelcontextprotocol.io/clients) and validated through my own usage.

| Capability | GHC in VS Code | Claude Code | Claude Desktop | ChatGPT [m/w] | Claude [m/w] |
|---|---|---|---|---|---|
| Tools | ✅ | ✅ | ✅ | ✅ | ✅ |
| Prompts | ✅ | ✅ | ✅ | ❌ | ✅ |
| Instructions | ✅ | ✅ | ❌ | ❌ | ❌ |

*[m/w] = mobile and web clients*

---

## Technical choices

- **sentence-transformers** with the `all-MiniLM-L6-v2` model for embeddings. 384 dimensional vectors, meaning based retrieval rather than keyword matching. The model loads lazily to keep startup fast.
- **ChromaDB** with a `PersistentClient` for vector storage. Vectors live on disk, organized into a named collection. It handles the persistence so the server does not have to.
- **FastAPI** for the HTTP layer. Lightweight, well documented, and easy to extend.

---

## What I learned

Building this clarified a few things I would not have predicted from the spec alone.

The clearest lesson was about MCP instructions. I assumed server instructions were the right place to inject personality. The appeal was obvious: posture gets set during initialization, before the user says anything, without requiring user intent. But even as I built it, something felt off. An MCP server quietly overriding a client's own behavioral constraints is not how a well behaved protocol should work. I knew that. I still hoped it would work anyway.

It did not. Common sense prevailed. MCP instructions are fluid by design. The spec does not require clients to enforce them. A client can treat them as binding, or it can use its own discretion. In practice, I watched a client acknowledge the instructions and then politely decline to follow them.

![GitHub Copilot acknowledging the MCP instructions, but using its own discretion.](/images/projects/anatomy-of-a-symbiote/mcp-instructions-rejected.png)

That experience is what pushed the personality into an MCP prompt and an MCP tool instead. MCP prompts require explicit user intent. The user triggers them, the AI receives them, and because the user asked for it, the AI acknowledges the posture as part of the conversation. There is less ambiguity about whether it arrived or whether it should be followed. The `spawn_venom` MCP tool serves the same purpose for clients that do not support prompts. It is less deterministic, since tool calls in most clients are probabilistic. The AI decides when to invoke a capability, not the user. But it still delivers the posture through a channel the AI actively consumes, not one the client silently filters.

---

## What is next

Three areas I want to focus on, all in service of the same thing: making it easier for an AI to show up as the same identity, no matter where it runs.

**Making it more current.** The server currently uses SSE for its remote transport. The MCP spec has moved toward Streamable HTTP as the recommended pattern. I want to migrate to that model so the server stays aligned with where the protocol is heading.

**Making it more adoptable.** Right now the vector store lives inside the container deployment. I want to pull it out into a standalone service so the storage is not tied to the server's infrastructure. I also want to make the repo usable by anyone. Swap in your own AI identity, point it at your own store, and deploy it wherever you like, even on a local machine, if that is sufficient for your use cases.

**Making it more useful.** Selective deletion, so the AI can forget with intent. A way to surface top of mind memories without requiring a perfect query. More user control over which memories get pulled into context.

There is also a quieter idea. A background agent with the same identity and memory, spawning into conversations as summoned. Less tool, more presence. Maybe more on this later.
