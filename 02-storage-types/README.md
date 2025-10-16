<div align="center">
    <img src="https://raw.githubusercontent.com/agentuity/cli/refs/heads/main/.github/Agentuity.png" alt="Agentuity" width="100"/> <br/>
    <strong>Build Agents, Not Infrastructure</strong> <br/>
    <br/>
        <a target="_blank" href="https://app.agentuity.com/deploy" alt="Agentuity">
            <img src="https://app.agentuity.com/img/deploy.svg" />
        </a>
    <br />
</div>

# Demo 2: Storage Types and Data Persistence

**Time:** 40-50 minutes

## Overview

This demo teaches all three Agentuity storage types through a practical documentation Q&A system. Fetch documentation, index it for semantic search, and answer questions using AI-generated responses backed by relevant context.

## What You'll Build

A docs Q&A agent that demonstrates Object Storage, Vector Storage, and KV Storage working together. The agent fetches external documentation on first run, stores it multiple ways, and uses semantic search to answer user questions.

## Storage Types

| Storage Type | Best For | Demo Usage |
|-------------|----------|------------|
| **Object Storage** | Files, images, binary data | Store full documentation file with public URLs |
| **Vector Storage** | Semantic search, embeddings | Index sections for Q&A with auto-embedding |
| **KV Storage** | Fast lookups, state, counters | Track query history across sessions |

## Key Concepts

- **Object Storage** - Store files with public URL generation
- **Vector Storage** - Semantic search with automatic embeddings (store content in metadata for retrieval)
- **KV Storage** - Fast key-value storage with JSON support and TTL
- **AI Streaming** - Stream contextual answers using `streamText`

## Prerequisites

Before you begin, ensure you have:

- **Bun**: Version 1.2.4 or higher
- **Agentuity CLI**: Authenticated with `agentuity login`

## Getting Started

### Development Mode

Run your project in development mode:

```bash
agentuity dev
```

This will start your project and open a browser window connecting your agent to the Agentuity Console in DevMode, allowing you to test and debug in real-time.

### Testing

First run triggers indexing:
```
"What is Agentuity?"
```

Subsequent queries demonstrate semantic search:
```
"What is the AI gateway?"
"Are there any blogs covering agent communication?"
```

Use DevMode to explore logs, storage, and session metrics.

## Deployment

When you're ready to deploy your agent to the Agentuity Cloud:

```bash
agentuity deploy
```

This command will bundle your agent and deploy it to the cloud, making it accessible via the Agentuity platform.

## Project Structure

```
02-storage-types/
├── agents/             # Agent implementations
├── node_modules/       # Dependencies
├── package.json        # Project dependencies and scripts
└── agentuity.yaml      # Agentuity project configuration
```

## Key Patterns

**Vector Storage Best Practice:**
```typescript
await ctx.vector.upsert(bucket, {
  key: 'doc-section-1',
  document: 'Text for embedding generation',
  metadata: {
    content: 'Text for embedding generation', // Store for retrieval
    title: 'Section Title'
  }
});
```

**Object Storage Encoding:**
```typescript
const binaryData = new TextEncoder().encode(textContent);
await ctx.objectstore.put(bucket, key, binaryData);
```

**KV Storage Pattern:**
```typescript
const result = await ctx.kv.get(bucket, key);
if (result.exists) {
  const data = await result.data.json();
}
```

## Configuration

Your project configuration is stored in `agentuity.yaml`. This file defines your agents, development settings, and deployment configuration.

## Advanced Usage

### Environment Variables

You can set environment variables for your project:

```bash
agentuity env set KEY VALUE
```

### Secrets Management

For sensitive information, use secrets:

```bash
agentuity env set --secret KEY VALUE
```

## Resources

- [Key-Value Storage Guide](https://agentuity.dev/Guides/key-value)
- [Vector Storage Guide](https://agentuity.dev/Guides/vector-db)
- [Object Storage Guide](https://agentuity.dev/Guides/object-storage)
- [JavaScript API Reference](https://agentuity.dev/SDKs/javascript/api-reference)
- [Vercel AI SDK Documentation](https://sdk.vercel.ai/docs)
- [Agentuity Examples](https://agentuity.dev/Examples)
- [Agentuity Documentation](https://agentuity.dev/SDKs/javascript)

## Troubleshooting

If you encounter any issues:

1. Check the [documentation](https://agentuity.dev/SDKs/javascript)
2. Join our [Discord community](https://discord.gg/agentuity) for support
3. Contact the Agentuity support team

## License

This project is licensed under the terms specified in the LICENSE file.
