import type { AgentContext, AgentRequest, AgentResponse } from '@agentuity/sdk';
import { openai } from '@ai-sdk/openai';
import { generateObject } from 'ai';
import { JudgmentSchema, JudgeRequestSchema } from '../../lib/types';

export default async function Agent(
  req: AgentRequest,
  resp: AgentResponse,
  ctx: AgentContext
) {
  // Validate incoming data from the orchestrator
  const { stories, prompt } = JudgeRequestSchema.parse(await req.data.json());

  ctx.logger.info('Judge agent evaluating stories');

  /* Structured Evaluation with Zod */
  const evaluationPrompt = `You are an expert story critic. Evaluate these two stories and pick the winner.

Original prompt: ${prompt}

${stories}

Pick the winner based on creativity, narrative quality, and adherence to the prompt. Provide specific reasoning and constructive feedback for improvement.`;

  // Use generateObject for guaranteed structured output
  const { object: judgment } = await generateObject({
    model: openai('gpt-5-nano'),
    schema: JudgmentSchema,
    system:
      'You are an expert story critic who provides detailed, constructive evaluations.',
    prompt: evaluationPrompt,
  });

  ctx.logger.info('Winner selected', { winner: judgment.winner });

  return resp.json(judgment);
}

export const welcome = () => ({
  welcome:
    'Judge agent - Evaluates stories with Zod-validated structured outputs',
  prompts: [],
});
