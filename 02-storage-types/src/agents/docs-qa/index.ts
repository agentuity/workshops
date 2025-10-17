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
    // TODO: Get user input from request
    // Hint: Use req.data.text() to get the query
    const userInput = '';

    // TODO: Check if docs have been indexed yet
    // Hint: Use ctx.kv.get() to check for 'docs-indexed' key
    const hasIndexedDocs = { exists: false, data: {} as any };

    if (!hasIndexedDocs || !hasIndexedDocs.exists) {
      /* SECTION 1: Fetch Documentation */
      ctx.logger.info(
        'First run detected - fetching and indexing documentation'
      );

      // TODO: Fetch the llms.txt file
      // Hint: Use fetch() with the URL 'https://agentuity.com/llms.txt'
      const response = { text: async () => '' } as any;

      // TODO: Get text content from the response
      // Hint: Use .text() method on the fetch response
      const textContent = '';

      /* SECTION 2: Object Storage - Store Raw File */

      // TODO: Generate a unique key for the file
      // Hint: Include timestamp to prevent collisions
      const key = '';

      // TODO: Store the file in object storage
      // Hint: Use ctx.objectstore.put() with bucket, key, and text content

      ctx.logger.info(`Stored file in Object Storage: ${key}`);

      // TODO: Create a public URL for the stored file
      // Hint: Use ctx.objectstore.createPublicURL() with bucket and key
      const publicUrl = '';

      // TODO: Log the public URL
      // Hint: Include expiry information in the log message
      ctx.logger.info(`Public URL: ${publicUrl}`);

      /* SECTION 3: Vector Storage - Index for Search */

      // TODO: Use chunkDocument helper to split the text
      // Hint: Returns { sections, sectionTitles }
      const sections: string[] = [];
      const sectionTitles: string[] = [];

      const vectorIds: string[] = [];

      ctx.logger.info(`Indexing ${sections.length} sections in vector storage`);

      // TODO: Loop through each section
      for (let i = 0; i < sections.length; i++) {
        const sectionContent = sections[i];
        const sectionTitle = sectionTitles[i];

        if (!sectionContent || !sectionTitle) {
          ctx.logger.error(`Missing data for section ${i}`);
          continue;
        }

        // TODO: Prepare vector upsert parameters
        // Hint: Need { key, document, metadata } structure
        // Hint: Store full content in metadata.content for AI context later
        const vectorParams = {
          key: '',
          document: '',
          metadata: {
            source: '',
            sectionIndex: 0,
            sectionTitle: '',
            content: '',
          },
        };

        ctx.logger.info(
          `Indexing section ${i}: ${sectionTitle} (${sectionContent.length} chars)`
        );

        // TODO: Upsert to vector storage
        // Hint: Use ctx.vector.upsert() and collect returned IDs
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
    const searchResults = await ctx.vector.search(VECTOR_STORAGE_NAME, {
      query: userInput,
      limit: 3,
      similarity: 0.5,
    });

    ctx.logger.info(`Found ${searchResults.length} results`);

    /* SECTION 5: KV Storage - Track Query History */

    // TODO: Get existing query history from KV storage
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
    .slice(0, 2)
    .map((result) => result.metadata?.content || '')
    .filter((content) => content)
    .join('\n\n');

    // TODO: Stream AI answer using the context
    // Hint: Use streamText() with model and prompt
    // Hint: Include the context and user's question in the prompt
    // Hint: const result = await streamText({...})
    const result = { textStream: '' as any };

    ctx.logger.info('Streaming AI answer');

    // TODO: Return the streaming response
    // Hint: Use resp.stream() with result.textStream and content type 'text/plain'
    return resp.text('TODO: Replace with streaming response');
  } catch (error) {
    ctx.logger.error('Error running agent:', error);
    return resp.json({
      message: 'Error processing request',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
