import type { AgentContext, AgentRequest, AgentResponse } from '@agentuity/sdk';
import { openai } from '@ai-sdk/openai';
import { google } from '@ai-sdk/google';
import { generateText } from 'ai';

// TODO: Import WriterRequestSchema from types file
// Hint: Import from ../../lib/types

export default async function Agent(
  req: AgentRequest,
  resp: AgentResponse,
  ctx: AgentContext
) {
  // TODO: Parse and validate incoming JSON data using Zod
  // Hint: Use WriterRequestSchema.parse() with the request data
  // Hint: This validates data crossing agent boundaries and catches errors early
  // Hint: Destructure to get: prompt
  const prompt = '';

  ctx.logger.info('Writer agent called');

  /* SECTION: Generate Competing Stories */

  // TODO: Call OpenAI model to generate first story
  // Hint: Use generateText function with model, system prompt, and user prompt
  // Hint: System prompt should describe storyteller role (100 words or less)
  // Hint: OpenAI model name: 'gpt-5-nano'
  const resultOpenAI: unknown = null;

  // TODO: Call Google model to generate second story
  // Hint: Use same pattern as OpenAI call above
  // Hint: Use the same system prompt for fair comparison
  // Hint: Google model name: 'gemini-2.0-flash-001'
  const resultGoogle: unknown = null;

  ctx.logger.info('Both stories generated');

  /* TODO: Return both stories as markdown with headers
   * Hint: Format with clear section headers for each model
   * - Use '### OpenAI (GPT-5 Nano)' and '### Google (Gemini 2.0 Flash)' as headers
   * - Separate sections with '---'
   * - Use the markdown response method
   * - Access the .text property from each result
   */

  return resp.text('Not implemented');
}

export const welcome = () => ({
  welcome: 'Writer agent - Generates competing stories using AI Gateway',
  prompts: [
    {
      data: JSON.stringify({
        prompt: 'A detective who solves mysteries using AI',
      }),
      contentType: 'application/json',
    },
  ],
});
