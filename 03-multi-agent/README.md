<div align="center">
    <img src="https://raw.githubusercontent.com/agentuity/cli/refs/heads/main/.github/Agentuity.png" alt="Agentuity" width="100"/> <br/>
    <strong>Build Agents, Not Infrastructure</strong> <br/>
    <br/>
        <a target="_blank" href="https://app.agentuity.com/deploy" alt="Agentuity">
            <img src="https://app.agentuity.com/img/deploy.svg" />
        </a>
    <br />
</div>

# Demo 3: Multi-Agent Orchestration and AI Gateway

**Time:** 40-50 minutes

## Overview

This demo teaches multi-agent orchestration, AI Gateway integration, structured output validation, and the "LLM as a judge" pattern through a story competition system. Two AI models compete to write stories, and a judge evaluates them with structured feedback.

## What You'll Build

A multi-agent story competition where an orchestrator coordinates between a writer agent (using AI Gateway to run multiple models) and a judge agent (using Zod validation for structured evaluation).

**Note:** The judge agent will be created during the workshop to demonstrate the complete flow. The orchestrator and writer agents are included as starting points.

## Architecture

```
Orchestrator (you build this)
    |
    +---> Writer Agent: Generate 2 stories (OpenAI + Google via AI Gateway)
    |
    +---> Judge Agent: Pick winner + provide structured feedback (Zod)
    |
    +---> Return competition report with both stories and judge's analysis
```

## Key Concepts

- **Agent Communication** - Coordinate multiple agents with `ctx.getAgent()` and `agent.run()`
- **AI Gateway** - Run multiple AI models (OpenAI, Google) in a single agent
- **Zod Validation** - Ensure structured, type-safe LLM outputs
- **LLM as a Judge** - Use AI to evaluate AI outputs with structured feedback

## Agentuity AI Gateway

The AI Gateway is a key platform feature that simplifies working with multiple AI models:

- No API key management per model
- Easy comparison of model outputs
- Automatic usage and cost tracking

## Zod Validation

Ensures type-safe, structured responses from LLMs:

```typescript
const JudgmentSchema = z.object({
  winner: z.enum(['openai', 'google']),
  winningStory: z.string(),
  reasoning: z.string(),
  improvements: z.string()
});
```

This eliminates manual string parsing and enables reliable programmatic decision-making.

## Prerequisites

Before you begin, ensure you have:

- **Bun**: Version 1.2.4 or higher
- **Agentuity CLI**: Authenticated with `agentuity login`

## Getting Started

### Development Mode

Run your project in development mode:

```bash
agentuity dev
```

This will start your project and open a browser window connecting your agent to the Agentuity Console in DevMode, allowing you to test and debug in real-time.

### Testing

Try different story prompts:

```
"A detective who solves mysteries using AI"
"A space explorer discovers a planet where music is the universal language"
```

Use DevMode to filter logs by agent, see data flow, inspect Zod-validated structures, and view the competition results with judge's analysis.

## Deployment

When you're ready to deploy your agent to the Agentuity Cloud:

```bash
agentuity deploy
```

This command will bundle your agent and deploy it to the cloud, making it accessible via the Agentuity platform.

## Project Structure

```
03-multi-agent/
├── src/
│   └── agents/
│       ├── orchestrator/
│       │   └── index.ts      # Main orchestrator agent
│       ├── writer/
│       │   └── index.ts      # AI Gateway writer agent
│       └── judge/
│           └── index.ts      # Zod-validated judge agent (created during workshop)
├── node_modules/             # Dependencies
├── package.json              # Project dependencies and scripts
├── agentuity.yaml            # Agentuity project configuration
└── tsconfig.json             # TypeScript configuration
```

## Agent Communication Pattern

```typescript
const agent = await ctx.getAgent({ name: 'agent-name' });
const result = await agent.run({ data: 'input or JSON.stringify(object)' });
const output = await result.data.text(); // or .json()
```

## Configuration

Your project configuration is stored in `agentuity.yaml`. This file defines your agents, development settings, and deployment configuration.

## Advanced Usage

### Environment Variables

You can set environment variables for your project:

```bash
agentuity env set KEY VALUE
```

### Secrets Management

For sensitive information, use secrets:

```bash
agentuity env set --secret KEY VALUE
```

## Resources

- [JavaScript API Reference](https://agentuity.dev/SDKs/javascript/api-reference)
- [Agent Communication Guide](https://agentuity.dev/Guides/agent-communication)
- [Zod Documentation](https://zod.dev)
- [Agentuity Examples](https://agentuity.dev/Examples)
- [Agentuity Documentation](https://agentuity.dev/SDKs/javascript)

## Troubleshooting

If you encounter any issues:

1. Check the [documentation](https://agentuity.dev/SDKs/javascript)
2. Join our [Discord community](https://discord.gg/agentuity) for support
3. Contact the Agentuity support team

## License

This project is licensed under the terms specified in the LICENSE file.
