import type { AgentContext, AgentRequest, AgentResponse } from '@agentuity/sdk';
import { streamText } from 'ai';
import { openai } from '@ai-sdk/openai';

// Storage name constants
const OBJECT_STORAGE_BUCKET = 'demo-docs';
const VECTOR_STORAGE_NAME = 'demo-docs-chunks';
const KV_STORAGE_NAME = 'demo-query-history';

// Type for query history entries
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
      {
        data: 'What is Agentuity?',
        contentType: 'text/plain',
      },
      {
        data: 'What is the AI gateway?',
        contentType: 'text/plain',
      },
      {
        data: 'Are there any blogs covering agent to agent communication?',
        contentType: 'text/plain',
      },
    ],
  };
};

// Document chunking helper - Splits llms.txt into 5 logical sections for vector storage
// Why chunk? Smaller sections = better semantic search accuracy
// Each section gets its own embeddings, making it easier to find specific topics
function chunkDocument(textContent: string): {
  sections: string[];
  sectionTitles: string[];
} {
  // Find the section boundaries by looking for markdown headers
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

      // TODO: Store the file in object storage
      // Hint: Use ctx.objectstore.put() with bucket, key, and text content

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
          key: `${key}-section-${i}`, // Unique ID for this vector
          document: sectionContent, // Text gets converted to embeddings for semantic search
          metadata: {
            // Extra data stored with the vector
            source: key,
            sectionIndex: i,
            sectionTitle: sectionTitle,
            // IMPORTANT: Must store the full text here!
            // When we search later, results only return: id, key, metadata, similarity.
            // The original 'document' text is NOT included in search results.
            // So we store it in metadata to use as context for the LLM.
            content: sectionContent,
          },
        };

        ctx.logger.info(
          `Indexing section ${i}: ${sectionTitle} (${sectionContent.length} chars)`
        );

        // TODO: Upsert to vector storage
        // Hint: Use ctx.vector.upsert() with VECTOR_STORAGE_NAME and vectorParams
        // Hint: Returns array of IDs - push them to vectorIds
        const ids: string[] = [];
        vectorIds.push(...ids);
      }

      ctx.logger.info(`Successfully indexed ${vectorIds.length} sections`);

      // TODO: Mark that we've indexed docs
      // Hint: Use ctx.kv.set() to store a flag

      ctx.logger.info(`Processing query: ${userInput}`);
    }

    /* SECTION 4: Vector Search */
    ctx.logger.info(`Searching for: ${userInput}`);

    // Search vector storage with the user's query
    // Parameters:
    //  - query: what to search for (as text)
    //  - limit: max results to return
    //  - similarity: threshold (0.0-1.0, where 1.0 is exact match)
    // Returns array of results with metadata and similarity scores
    const searchResults = await ctx.vector.search(VECTOR_STORAGE_NAME, {
      query: userInput,
      limit: 3,
      similarity: 0.5,
    });

    ctx.logger.info(`Found ${searchResults.length} results`);

    /* SECTION 5: KV Storage - Track Query History */

    // TODO: Get existing query history from KV storage
    // Hint: Use ctx.kv.get() with KV_STORAGE_NAME and 'query-history' key
    const existingQueries = { exists: false, data: {} as any };

    const queryHistory = existingQueries.exists
      ? ((await existingQueries.data.json()) as QueryHistoryEntry[]) // Parse existing history
      : []; // Start with empty array (if no query history exists)

    // Add the new query to the history
    queryHistory.push({
      query: userInput,
      timestamp: new Date().toLocaleTimeString(),
      results: searchResults.length,
      topResult: String(searchResults[0]?.metadata?.sectionTitle || 'none'),
    });

    // TODO: Save updated history back to KV storage
    // Hint: Use ctx.kv.set() with the array

    ctx.logger.info(
      `Query tracked in KV storage (${queryHistory.length} total queries)`
    );

    /* SECTION 6: AI Generation */

    // Build context from top search results
    const context = searchResults
      .slice(0, 2) // Take top 2 most relevant results (out of 3 returned)
      .map((result) => result.metadata?.content || '') // Extract the full text from metadata
      .filter((content) => content) // Remove any empty results
      .join('\n\n'); // Combine into a single context string

    const result = await streamText({
      model: openai('gpt-5-nano'),
      prompt: `Answer this question about Agentuity based on the documentation provided.

Documentation context:
${context || 'No relevant documentation found.'}

Question: ${userInput}

Provide a helpful, concise answer in 2-3 sentences. If no context is available, politely indicate that.`,
    });

    ctx.logger.info('Streaming AI answer');

    // Stream the response back to the user as it's generated (instead of waiting for the full response)
    return resp.stream(result.textStream, 'text/plain');
  } catch (error) {
    ctx.logger.error('Error running agent:', error);
    return resp.json({
      message: 'Error processing request',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
