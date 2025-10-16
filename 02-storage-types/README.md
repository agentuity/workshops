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

## Workshop Flow

1. **Fetch Documentation** - Retrieve content from external sources
2. **Object Storage** - Store raw file with public URL
3. **Vector Storage** - Index document sections for search
4. **Vector Search** - Find relevant content based on queries
5. **KV Storage** - Track query history
6. **AI Generation** - Stream contextual answers

## Testing

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

## Resources

- [Key-Value Storage Guide](https://agentuity.dev/Guides/key-value)
- [Vector Storage Guide](https://agentuity.dev/Guides/vector-db)
- [Object Storage Guide](https://agentuity.dev/Guides/object-storage)
- [JavaScript API Reference](https://agentuity.dev/SDKs/javascript/api-reference)
- [Vercel AI SDK Documentation](https://sdk.vercel.ai/docs)
- [Agentuity Examples](https://agentuity.dev/Examples)
