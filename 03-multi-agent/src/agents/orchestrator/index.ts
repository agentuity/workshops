import type { AgentContext, AgentRequest, AgentResponse } from '@agentuity/sdk';
import type { Judgment } from '../../lib/types';

/* HELPER FUNCTION: Format Competition Report */
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
  /* SECTION 1: Get Story Prompt */

  const prompt = await req.data.text();

  ctx.logger.info('Competition started', { prompt });

  /* SECTION 2: Generate Competing Stories */

  // TODO: Get a reference to the writer agent
  // Hint: Use context method to get agent by name
  const writer = null;

  // TODO: Call the writer agent
  // Hint: Pass prompt as JSON data
  // Hint: Agent run method takes a data parameter
  const storiesResponse = null as any;

  const stories = await storiesResponse.data.text();

  ctx.logger.info('Stories generated');

  /* SECTION 3: Judge the Competition */

  // TODO: Get a reference to the judge agent
  // Hint: Use context method to get agent by name
  const judge = null;

  // TODO: Call the judge agent with stories markdown
  // Hint: Pass the stories text and original prompt as JSON
  // Hint: Judge will extract individual stories from the markdown
  const judgmentResponse = null as any;

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
