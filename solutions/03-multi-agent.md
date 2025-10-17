# Solution: Multi-Agent Orchestration & AI Gateway

## Concepts Covered

This demo teaches multi-agent orchestration through a story competition system where multiple agents work together:

- **Agent Communication** - Coordinating multiple agents with `ctx.getAgent()` and `agent.run()`
- **AI Gateway** - Running multiple AI models (OpenAI, Google) in a single agent
- **Zod Validation** - Structured, type-safe LLM outputs with `generateObject`
- **LLM as a Judge** - Using AI to evaluate AI outputs with structured feedback
- **Multi-Agent Orchestration** - Building complex workflows with specialized agents

## Architecture

```
User → Orchestrator → Writer (AI Gateway) → Judge (Zod) → Final Report
```

The orchestrator coordinates three steps:
1. Writer generates two competing stories (OpenAI vs Google)
2. Judge evaluates and picks a winner with structured feedback
3. Return formatted report with both stories and analysis

## Key SDK Patterns

### Agent Communication

```typescript
// Get agent reference
const agent = await ctx.getAgent({ name: 'writer' });

// Run agent with data
const result = await agent.run({
  data: JSON.stringify({ prompt: 'story idea' })
});

// Parse response
const stories = await result.data.text();
```

Agent-to-agent communication enables modular, reusable workflows. For complete patterns including handoffs and parallel execution, see our [Agent Communication Guide](https://agentuity.dev/Guides/agent-communication).

### AI Gateway - Multiple Models

```typescript
// OpenAI model
const resultOpenAI = await generateText({
  model: openai('gpt-5-nano'),
  system: 'You are a storyteller',
  prompt: userPrompt
});

// Google model
const resultGoogle = await generateText({
  model: google('gemini-2.0-flash-001'),
  system: 'You are a storyteller',
  prompt: userPrompt
});
```

The AI Gateway handles API keys, routing, and usage tracking automatically. No need to manage multiple API keys or providers manually. Learn more about supported models in the [AI Gateway documentation](https://agentuity.dev/Guides/ai-gateway).

### Zod Validation for Structured Outputs

```typescript
const JudgmentSchema = z.object({
  winner: z.enum(['openai', 'google']),
  winningStory: z.string(),
  reasoning: z.string(),
  improvements: z.string()
});

// Use with generateObject for guaranteed structure
const { object: judgment } = await generateObject({
  model: openai('gpt-5-nano'),
  schema: JudgmentSchema,
  prompt: evaluationPrompt
});
```

Zod schemas eliminate manual string parsing and provide type-safe access to LLM outputs. For more on structured outputs, check out [Zod's documentation](https://zod.dev) and our examples in the [Kitchen Sink SDK Showcase](https://github.com/agentuity/kitchen-sink-ts).

## Complete Solution Files

### types.ts - Centralized Schemas

```typescript
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

```

### writer.ts - AI Gateway Competition

```typescript
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
  // Validate incoming request
  const { prompt } = WriterRequestSchema.parse(await req.data.json());

  ctx.logger.info('Writer agent called');

  /* Generate Competing Stories */
  const resultOpenAI = await generateText({
    model: openai('gpt-5-nano'),
    system:
      'You are a fantastic storyteller. Write a creative short story in 100 words or less.',
    prompt,
  });

  const resultGoogle = await generateText({
    model: google('gemini-2.0-flash-001'),
    system:
      'You are a fantastic storyteller. Write a creative short story in 100 words or less.',
    prompt,
  });

  ctx.logger.info('Both stories generated', {
    openaiLength: resultOpenAI.text.length,
    googleLength: resultGoogle.text.length,
  });

  // Return both stories as markdown with clear headers
  return resp.markdown(
    '### OpenAI (GPT-5 Nano)\\n\\n' +
      resultOpenAI.text +
      '\\n\\n---\\n\\n' +
      '### Google (Gemini 2.0 Flash)\\n\\n' +
      resultGoogle.text
  );
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

```

### judge.ts - Structured Evaluation (Live-Coded in Workshop)

```typescript
import type { AgentContext, AgentRequest, AgentResponse } from '@agentuity/sdk';
import { openai } from '@ai-sdk/openai';
import { generateObject } from 'ai';
import { JudgmentSchema, JudgeRequestSchema } from '../../lib/types';

export default async function Agent(
  req: AgentRequest,
  resp: AgentResponse,
  ctx: AgentContext
) {
  // Validate incoming data at agent boundary
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

```

### orchestrator.ts - Multi-Agent Coordination

```typescript
import type { AgentContext, AgentRequest, AgentResponse } from '@agentuity/sdk';
import type { Judgment } from '../../lib/types';

function formatReport(judgment: Judgment, storiesMarkdown: string): string {
  return `# Story Competition Results

## Competing Stories

${storiesMarkdown}

---

## Judge's Analysis

**Winner:** ${judgment.winner.toUpperCase()}

**Why it won:** ${judgment.reasoning}

**Suggestions for improvement:** ${judgment.improvements}

---

*This demonstrates multi-agent orchestration: Writer generates competing stories, Judge evaluates with structured output using Zod validation.*
`;
}

export default async function Agent(
  req: AgentRequest,
  resp: AgentResponse,
  ctx: AgentContext
) {
  /* SECTION 1: Get Story Prompt from User */
  const prompt = await req.data.text();
  ctx.logger.info('Competition started', { prompt });

  /* SECTION 2: Generate Competing Stories */
  const writer = await ctx.getAgent({ name: 'writer' });

  const storiesResponse = await writer.run({
    data: JSON.stringify({ prompt }),
  });

  const stories = await storiesResponse.data.text();
  ctx.logger.info('Stories generated');

  /* SECTION 3: Judge the Competition */
  const judge = await ctx.getAgent({ name: 'judge' });

  const judgmentResponse = await judge.run({
    data: JSON.stringify({ stories, prompt }),
  });

  const judgment = (await judgmentResponse.data.json()) as Judgment;

  /* SECTION 4: Return Final Report */
  return resp.markdown(formatReport(judgment, stories));
}

export const welcome = () => ({
  welcome:
    'Story Competition - Two AI models compete, judge picks winner with structured evaluation!',
  prompts: [
    {
      data: 'A detective who solves mysteries using AI',
      contentType: 'text/plain',
    },
    {
      data: 'A space explorer discovers a planet where music is the universal language',
      contentType: 'text/plain',
    },
  ],
});

```

## Try It Yourself

1. Navigate to `03-multi-agent/`
2. Review `src/lib/types.ts` - all schemas are complete (reference only)
3. Open `src/agents/writer/index.ts` and fill in TODOs
4. **Live-code `judge.ts` during workshop** (shows `generateObject` pattern)
5. Open `src/agents/orchestrator/index.ts` and fill in TODOs
6. Test with `agentuity dev`
7. Compare with this solution

## Next Steps

- Try adding a third AI model to the competition (i.e., Claude)
- Implement filtering/moderation before judging
- Experiment with user voting ("human-in-the-loop") alongside AI judgment
