import type { AgentContext, AgentRequest, AgentResponse } from '@agentuity/sdk';
import { openai } from '@ai-sdk/openai';
import { google } from '@ai-sdk/google';
import { generateText } from 'ai';
import { WriterRequestSchema } from '../../lib/types';

export default async function Agent(
  req: AgentRequest,
  resp: AgentResponse,
  ctx: AgentContext
) {
  // Validate incoming data from the orchestrator
  const { prompt } = WriterRequestSchema.parse(await req.data.json());

  ctx.logger.info('Writer agent called');

  /* SECTION: Generate Competing Stories */

  const resultOpenAI = await generateText({
    model: openai('gpt-5-nano'),
    system:
      'You are a fantastic storyteller. Write a creative short story in 100 words or less.',
    prompt,
  });

  // TODO: Call Google model to generate second story
  // Hint: Use same pattern as OpenAI call above
  // Hint: Use the same system prompt for fair comparison
  // Hint: Google model name: 'gemini-2.0-flash-001'

  ctx.logger.info('Story generated');

  // TODO: Update return to include both stories with '---' separator
  // Hint: Add Google story below with '### Google (Gemini 2.0 Flash)' header
  return resp.markdown('### OpenAI (GPT-5 Nano)\n\n' + resultOpenAI.text);
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
