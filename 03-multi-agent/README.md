# Demo 3: Multi-Agent Orchestration and AI Gateway

**Time:** 40-50 minutes

## Overview

This demo teaches multi-agent orchestration, AI Gateway integration, structured output validation, and the "LLM as a judge" pattern through a story competition system. Two AI models compete to write stories, a judge evaluates them, and the winning story is refined to excellence.

## What You'll Build

A multi-agent story competition where an orchestrator coordinates between a writer agent (using AI Gateway to run multiple models) and a judge agent (using Zod validation for structured evaluation).

## Architecture

```
Orchestrator (you build this)
    |
    +---> Writer Agent: Generate 2 stories (OpenAI + Google via AI Gateway)
    |
    +---> Judge Agent: Pick winner + provide structured feedback (Zod)
    |
    +---> Writer Agent: Refine winner based on feedback
    |
    +---> Return final refined story with competition report
```

## Key Concepts

- **Agent Communication** - Coordinate multiple agents with `ctx.getAgent()` and `agent.run()`
- **AI Gateway** - Run multiple AI models (OpenAI, Google) in a single agent
- **Zod Validation** - Ensure structured, type-safe LLM outputs
- **LLM as a Judge** - Use AI to evaluate AI outputs with structured feedback
- **Iterative Refinement** - Build improvement loops with targeted feedback

## Workshop Flow

1. **Review Supporting Agents** - Understand Writer and Judge implementations
2. **Get User Prompt** - Parse incoming story topic
3. **Generate Stories** - Call Writer agent for competing stories
4. **Judge Competition** - Call Judge agent to pick winner with feedback
5. **Refine Winner** - Call Writer agent again to improve
6. **Return Report** - Format complete competition results

## Why AI Gateway?

- No API key management per model
- Easy comparison of model outputs
- Automatic usage and cost tracking
- Performance optimization with `Promise.all`

## Why Zod Validation?

Guarantees type-safe, structured responses:

```typescript
const JudgmentSchema = z.object({
  winner: z.enum(['openai', 'google']),
  winningStory: z.string(),
  reasoning: z.string(),
  improvements: z.string()
});
```

No string parsing needed—programmatic decision-making with confidence.

## Testing

Try different story prompts:

```
"A detective who solves mysteries using AI"
"A space explorer discovers a planet where music is the universal language"
"Time"
```

Use DevMode to filter logs by agent, see data flow, inspect Zod-validated structures, and compare original vs refined stories.

## Real-World Applications

- **Content Creation** - Draft generation, evaluation, refinement
- **Code Review** - Multiple solutions, best practices evaluation, optimization
- **Document Processing** - Data extraction, validation, error correction
- **Quality Assurance** - Test case generation, coverage evaluation
- **Design Systems** - Mockup generation, structured evaluation, refinement

## Agent Communication Pattern

```typescript
const agent = await ctx.getAgent({ name: 'agent-name' });
const result = await agent.run({ data: 'input or JSON.stringify(object)' });
const output = await result.data.text(); // or .json()
```

## Resources

- [JavaScript API Reference](https://agentuity.dev/SDKs/javascript/api-reference)
- [Agent Communication Guide](https://agentuity.dev/Guides/agent-communication)
- [Zod Documentation](https://zod.dev)
- [Agentuity Examples](https://agentuity.dev/Examples)
