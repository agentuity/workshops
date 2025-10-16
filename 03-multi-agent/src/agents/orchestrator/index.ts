import type { AgentContext, AgentRequest, AgentResponse } from '@agentuity/sdk';
// TODO: Once you've completed types.ts, uncomment the line below and replace 'any' with 'Judgment' throughout this file
// import type { Judgment } from '../../lib/types';

/* HELPER FUNCTION: Format Competition Report */
function formatReport(judgment: any, storiesMarkdown: string): string {
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
  /* SECTION 1: Get Story Prompt */

  // TODO: Extract the story prompt from the incoming request
  // Hint: Parse the request data as text content
  const prompt = '';

  ctx.logger.info('Competition started', { prompt });

  /* SECTION 2: Generate Competing Stories */

  // TODO: Get a reference to the writer agent
  // Hint: Use context method to get agent by name
  const writer = null;

  // TODO: Call the writer agent
  // Hint: Pass prompt as JSON data
  // Hint: Agent run method takes a data parameter
  const storiesResponse = null;

  // TODO: Parse the response to get stories markdown
  // Hint: Writer returns markdown text with both stories and headers
  // Hint: Use the text parsing method on the response data
  const stories = '';

  ctx.logger.info('Stories generated');

  /* SECTION 3: Judge the Competition */

  // TODO: Get a reference to the judge agent
  // Hint: Use context method to get agent by name
  const judge = null;

  // TODO: Call the judge agent with stories markdown
  // Hint: Pass the stories text and original prompt as JSON
  // Hint: Judge will extract individual stories from the markdown
  const judgmentResponse = null;

  // TODO: Parse the judgment response
  // Hint: Judge returns Zod-validated JSON with winner, reasoning, and improvements
  // Hint: Use the JSON parsing method on the response data
  // Hint: Cast the result as Judgment type for TypeScript (uncomment import at top first)
  const judgment: any = null;

  /* SECTION 4: Return Final Report */

  // TODO: Use the formatReport helper to create markdown
  // Hint: Pass the judgment object and stories markdown
  // TODO: Return the formatted report as markdown
  // Hint: Use the markdown response method

  return resp.text('Not implemented');
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
