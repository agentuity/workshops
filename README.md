# Agentuity Workshop

## Overview

Build AI agents using the Agentuity platform through three progressive demos. Start with SDK fundamentals, work through storage and data persistence, and finish with multi-agent orchestration.

## Workshop vs Self-Paced

**During the workshop**: Follow along with the live coding demo, ask questions, and see patterns in action.

**Self-paced**: Clone the repo, work through the TODOs in each demo, and reference the [`solutions/`](./solutions/) folder when needed.

## Workshop Structure

### 01-sdk-basics (20-30 minutes)

Learn the fundamentals of agent development including request handling, response formatting, structured logging, and accessing agent context.

**What you'll build:** A foundational agent demonstrating the request-response-context lifecycle

**Key topics:** Request parsing, response formats, logging, agent metadata, DevMode debugging

[View Demo 1 Details →](./01-sdk-basics/README.md)

### 02-storage-types (40-50 minutes)

Explore all three Agentuity storage types through a practical documentation Q&A system that fetches content, indexes it for search, and generates contextual answers.

**What you'll build:** A docs Q&A agent using Object, Vector, and KV storage

**Key topics:** Object storage with public URLs, vector semantic search, KV state tracking, streaming responses

[View Demo 2 Details →](./02-storage-types/README.md)

### 03-multi-agent (40-50 minutes)

Master multi-agent orchestration, AI Gateway integration, and structured output validation through a story competition system where multiple AI models compete and receive structured evaluation.

**What you'll build:** A multi-agent story competition with structured evaluation

**Key topics:** Agent communication, AI Gateway, Zod validation, LLM-as-a-judge pattern, structured output orchestration

[View Demo 3 Details →](./03-multi-agent/README.md)

## Prerequisites

- **[Bun](https://bun.sh/docs/installation)** 1.2.4 or higher
- **Agentuity CLI and account** - See the [getting started guide](https://agentuity.dev/Introduction/getting-started)

This workshop uses TypeScript with Bun as the runtime.

## Getting Started

**Workshop attendees**: No setup required - just follow along and ask questions.

**Self-paced**:

```bash
git clone https://github.com/agentuity/workshops.git
cd workshops/01-sdk-basics
bun install
agentuity dev
```

Open the agent file and follow the TODOs. Check [`solutions/`](./solutions/) when needed.

## Resources

- **Documentation**: [agentuity.dev](https://agentuity.dev)
- **JavaScript SDK Reference**: [JavaScript SDK](https://agentuity.dev/SDKs/javascript)
- **Discord Community**: [Join our Discord](https://discord.gg/agentuity)

## Next Steps

Check out the **[Kitchen Sink project](https://github.com/agentuity/kitchen-sink-ts)** for an interactive playground covering every SDK feature. Watch the [walkthrough video](https://youtu.be/gcxqdMWY-x4) for a guided tour.
