# Agentuity Workshop

## Overview

This workshop teaches you how to build AI agents using the Agentuity platform through three progressive, hands-on demos. You'll start with SDK fundamentals, move through storage and data persistence, and finish with multi-agent orchestration patterns.

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

Master multi-agent orchestration, AI Gateway integration, and structured output validation through a story competition system where multiple AI models compete and iteratively improve.

**What you'll build:** A multi-agent story competition with evaluation and refinement

**Key topics:** Agent communication, AI Gateway, Zod validation, LLM-as-a-judge pattern, orchestration and refinement loops

[View Demo 3 Details →](./03-multi-agent/README.md)

## Prerequisites

Before the workshop, ensure you have:

- **[Bun](https://bun.sh/docs/installation)**: Version 1.2.4 or higher
- **Agentuity CLI and account**: See our [getting started guide](https://agentuity.dev/Introduction/getting-started) for more info.

**Note**: This workshop uses TypeScript with Bun as the runtime.

## Getting Started

### Before the Workshop

1. Clone this repository:
   ```bash
   git clone https://github.com/agentuity/workshops.git
   cd workshops
   ```

2. Each demo is a standalone project. Navigate to any demo and install dependencies:
   ```bash
   cd 01-sdk-basics
   bun install
   ```

During the workshop, we'll work through each demo together, filling in TODOs and testing as we go. Complete solution code will be added to this repository after the workshop.

## Resources

- **Documentation**: [agentuity.dev](https://agentuity.dev)
- **JavaScript SDK Reference**: [JavaScript SDK](https://agentuity.dev/SDKs/javascript)
- **Discord Community**: [Join our Discord](https://discord.gg/agentuity)

## Next Steps

Want to explore more Agentuity features interactively? Check out the **[Kitchen Sink project](https://github.com/agentuity/kitchen-sink-ts)** — an interactive playground where you can try out every SDK feature through live, working agents. It's a great way to experiment and see additional patterns in action.

**Watch the [Kitchen Sink walkthrough video](https://youtu.be/gcxqdMWY-x4)** for a guided tour of key features.
