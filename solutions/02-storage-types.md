# Solution: Storage Types & Semantic Search

## Concepts Covered

This demo teaches all three Agentuity storage types through a practical documentation Q&A system:

- **Object Storage** - Storing files and generating public URLs
- **Vector Storage** - Semantic search with automatic embeddings
- **KV Storage** - Fast key-value lookups for state tracking
- **Streaming Responses** - Real-time AI answers with `streamText`

## Key SDK Patterns

### Object Storage - Files and Public URLs

```typescript
// Store a file
await ctx.objectstore.put(bucket, key, content);

// Generate public URL (expires in 1 hour by default)
const url = await ctx.objectstore.createPublicURL(bucket, key);
```

Object storage is ideal for documents, images, and large data that needs public access. For a complete guide on when to use object storage vs other types, check out our [Object Storage Guide](https://agentuity.dev/Guides/object-storage).

### Vector Storage - Semantic Search

```typescript
// Index content with automatic embeddings
const ids = await ctx.vector.upsert(bucket, {
  key: 'unique-id',
  document: 'searchable text',
  metadata: { title: 'Section Name', content: 'full text' }
});

// Search by meaning, not exact matches
const results = await ctx.vector.search(bucket, {
  query: 'user question',
  limit: 3,
  similarity: 0.5
});
```

Vector storage automatically generates embeddings, so you don't need to manage embedding models yourself. Learn more in the [Vector Storage Guide](https://agentuity.dev/Guides/vector-db).

### KV Storage - State Tracking

```typescript
// Read with existence check
const result = await ctx.kv.get(bucket, key);
if (result.exists) {
  const data = await result.data.json();
}

// Write with optional TTL
await ctx.kv.set(bucket, key, value, { ttl: 3600 });
```

KV storage is perfect for flags, counters, and frequently-accessed small data. See the full [KV Storage Guide](https://agentuity.dev/Guides/key-value) for advanced features like TTL.

### Streaming Responses

```typescript
const result = await streamText({
  model: openai('gpt-4o-mini'),
  prompt: 'Your prompt here'
});

return resp.stream(result.textStream, 'text/plain');
```

Streaming provides real-time responses for better UX. For best practices and more examples, see our [Streaming Guide](agentuity.dev/Guides/agent-streaming).

## Complete Solution

```typescript
import type { AgentContext, AgentRequest, AgentResponse } from '@agentuity/sdk';
import { streamText } from 'ai';
import { openai } from '@ai-sdk/openai';

// Storage name constants
const OBJECT_STORAGE_BUCKET = 'demo-docs';
const VECTOR_STORAGE_NAME = 'demo-docs-chunks';
const KV_STORAGE_NAME = 'demo-query-history';

type QueryHistoryEntry = {
  query: string;
  timestamp: string;
  results: number;
  topResult: string;
};

export const welcome = () => {
  return {
    welcome:
      'Welcome! I can help you search documentation about Agentuity. Ask me any questions!',
    prompts: [
      { data: 'What is Agentuity?', contentType: 'text/plain' },
      { data: 'What is the AI gateway?', contentType: 'text/plain' },
      {
        data: 'Are there any blogs covering agent to agent communication?',
        contentType: 'text/plain',
      },
    ],
  };
};

// Document chunking helper - Splits llms.txt into 5 logical sections for vector storage
function chunkDocument(textContent: string): {
  sections: string[];
  sectionTitles: string[];
} {
  // Find the exact positions of the main ## headers
  let featuresIndex = textContent.indexOf('## Product Features');
  if (featuresIndex === -1) {
    featuresIndex = textContent.indexOf('## Features');
  }
  const coreBenefitsIndex = textContent.indexOf('## Core Benefits');
  const aboutIndex = textContent.indexOf('## About');
  const blogIndex = textContent.indexOf('## Blog Posts');

  // Create the 5 major sections based on these positions
  const sections: string[] = [
    textContent.substring(0, featuresIndex).trim(),
    textContent.substring(featuresIndex, coreBenefitsIndex).trim(),
    textContent.substring(coreBenefitsIndex, aboutIndex).trim(),
    textContent.substring(aboutIndex, blogIndex).trim(),
    textContent.substring(blogIndex).trim(),
  ];

  const sectionTitles = [
    'Introduction',
    'Product Features',
    'Core Benefits',
    'About',
    'Blog Posts',
  ];

  return { sections, sectionTitles };
}

export default async function Agent(
  req: AgentRequest,
  resp: AgentResponse,
  ctx: AgentContext
) {
  try {
    const userInput = await req.data.text();

    // Check if this is first run (no docs indexed yet)
    const hasIndexedDocs = await ctx.kv.get(KV_STORAGE_NAME, 'docs-indexed');

    if (!hasIndexedDocs.exists) {
      /* SECTION 1: Fetch Documentation */
      ctx.logger.info(
        'First run detected - fetching and indexing documentation'
      );

      const response = await fetch('https://agentuity.com/llms.txt');
      const textContent = await response.text();

      /* SECTION 2: Object Storage - Store Raw File */
      const key = `llms-${Date.now()}.txt`;

      await ctx.objectstore.put(OBJECT_STORAGE_BUCKET, key, textContent);

      ctx.logger.info(`Stored file in Object Storage: ${key}`);

      const publicUrl = await ctx.objectstore.createPublicURL(
        OBJECT_STORAGE_BUCKET,
        key
      );
      ctx.logger.info(`Public URL created (1hr expiry): ${publicUrl}`);

      /* SECTION 3: Vector Storage - Index for Search */
      const { sections, sectionTitles } = chunkDocument(textContent);
      const vectorIds: string[] = [];

      ctx.logger.info(`Indexing ${sections.length} sections in vector storage`);

      for (let i = 0; i < sections.length; i++) {
        const sectionContent = sections[i];
        const sectionTitle = sectionTitles[i];

        if (!sectionContent || !sectionTitle) {
          ctx.logger.error(`Missing data for section ${i}`);
          continue;
        }

        const vectorParams = {
          key: `${key}-section-${i}`,
          document: sectionContent,
          metadata: {
            source: key,
            sectionIndex: i,
            sectionTitle: sectionTitle,
            content: sectionContent, // Store full content for AI context
          },
        };

        ctx.logger.info(
          `Indexing section ${i}: ${sectionTitle} (${sectionContent.length} chars)`
        );

        const ids = await ctx.vector.upsert(VECTOR_STORAGE_NAME, vectorParams);
        vectorIds.push(...ids);
      }

      ctx.logger.info(`Successfully indexed ${vectorIds.length} sections`);

      // Mark that we've indexed docs
      await ctx.kv.set(KV_STORAGE_NAME, 'docs-indexed', 'true');

      // Now process the user's query
      ctx.logger.info(`Processing query: ${userInput}`);
    }

    /* SECTION 4: Vector Search */
    ctx.logger.info(`Searching for: ${userInput}`);

    const searchResults = await ctx.vector.search(VECTOR_STORAGE_NAME, {
      query: userInput,
      limit: 3,
      similarity: 0.5,
    });

    ctx.logger.info(`Found ${searchResults.length} results`);

    /* SECTION 5: KV Storage - Track Query History */
    const existingQueries = await ctx.kv.get(KV_STORAGE_NAME, 'query-history');
    const queryHistory = existingQueries.exists
      ? ((await existingQueries.data.json()) as QueryHistoryEntry[])
      : [];

    queryHistory.push({
      query: userInput,
      timestamp: new Date().toLocaleTimeString(),
      results: searchResults.length,
      topResult: String(searchResults[0]?.metadata?.sectionTitle || 'none'),
    });

    await ctx.kv.set(KV_STORAGE_NAME, 'query-history', queryHistory);

    ctx.logger.info(
      `Query tracked in KV storage (${queryHistory.length} total queries)`
    );

    /* SECTION 6: AI Generation */
    const context = searchResults
      .slice(0, 2)
      .map((result) => result.metadata?.content || '')
      .filter((content) => content)
      .join('\n\n');

    const result = await streamText({
      model: openai('gpt-5-nano'),
      prompt: `Answer this question about Agentuity based on the documentation provided.

Documentation context:
${context || 'No relevant documentation found.'}

Question: ${userInput}

Provide a helpful, concise answer in 2-3 sentences. If no context is available, politely indicate that.`,
    });

    ctx.logger.info('Streaming AI answer');

    return resp.stream(result.textStream, 'text/plain');
  } catch (error) {
    ctx.logger.error('Error running agent:', error);
    return resp.json({
      message: 'Error processing request',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}

```

## Try It Yourself

1. Navigate to `02-storage-types/`
2. Open `src/agents/docs-qa/index.ts`
3. Follow the 6 sections of TODOs to implement:
   - Fetching documentation
   - Storing in object storage
   - Indexing in vector storage
   - Searching vectors semantically
   - Tracking queries in KV storage
   - Streaming AI responses
4. Test with `agentuity dev`
5. Try asking: "What is Agentuity?" or "What is the AI gateway?"
6. Compare with this solution

## Next Steps

- Try different chunk strategies for different document structures
- Add filters to vector search (by section title)
- Implement query history pagination
- Move on to [Demo 3: Multi-Agent Orchestration](./03-multi-agent.md)
