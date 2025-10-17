import { z } from 'zod';

/* Judge Agent Schema */
// Validates the structured output from the judge's LLM evaluation

export const JudgmentSchema = z.object({
  winner: z
    .enum(['openai', 'google'])
    .describe('Which model won the competition'),
  winningStory: z.string().describe('The complete text of the winning story'),
  reasoning: z
    .string()
    .describe(
      'Why this story won - specific strengths that made it better (2-3 sentences)'
    ),
  improvements: z
    .string()
    .describe(
      'Specific, actionable feedback to make the winning story even better (2-3 sentences)'
    ),
});

// Use z.infer<> to automatically derive TypeScript types from Zod schemas
// This means we define the structure once (in Zod) and get both:
// - Runtime validation with .parse()
// - Compile-time TypeScript types
export type Judgment = z.infer<typeof JudgmentSchema>;

/* Writer Agent Schema */
// Validates incoming requests from the orchestrator to the writer agent

export const WriterRequestSchema = z.object({
  prompt: z.string().describe('The story prompt from the user'),
});

export type WriterRequest = z.infer<typeof WriterRequestSchema>;

/* Judge Agent Schema */
// Validates incoming requests from the orchestrator to the judge agent

export const JudgeRequestSchema = z.object({
  stories: z
    .string()
    .describe('Markdown text containing both stories with headers'),
  prompt: z.string().describe('The original story prompt from the user'),
});

export type JudgeRequest = z.infer<typeof JudgeRequestSchema>;
