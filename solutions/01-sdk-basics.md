# Solution: SDK Basics & Agent Fundamentals

## Concepts Covered

This demo teaches core SDK patterns every agent developer needs to know:

- **Request handling** - Parsing JSON and accessing request metadata
- **Response formatting** - Returning markdown for rich output
- **Context access** - Agent info, SDK version, development mode
- **Structured logging** - Info, debug, warning, error levels

## Key SDK Patterns

### Request Parsing

```typescript
const data = await request.data.json();
const triggerType = request.trigger;
const metadata = request.metadata;
```

For complete details on all request methods and properties, see the [Request API Reference](https://agentuity.dev/SDKs/javascript/api-reference#request-handling).

### Structured Logging

```typescript
context.logger.info('Message', { data });
context.logger.debug('Debug info', { details });
context.logger.warn('Warning');
context.logger.error('Error occurred');
```

Learn more about structured logging best practices in our [Logging Guide](https://agentuity.dev/Guides/agent-logging).

### Response Formatting

```typescript
return response.markdown(content);
```

The response object supports multiple formats (text, JSON, markdown, streams). Check out the [Response API Reference](https://agentuity.dev/SDKs/javascript/api-reference#response-types) to see all available methods.

## Complete Solution

```typescript
import type { AgentRequest, AgentResponse, AgentContext } from '@agentuity/sdk';

export default async function Agent(
  request: AgentRequest,
  response: AgentResponse,
  context: AgentContext
) {
  /* SECTION 1: Understanding Request - Parse incoming (JSON) data */
  const receivedData = await request.data.json();
  const triggerType = request.trigger;
  const metadata = request.metadata;

  context.logger.info('Agent invoked', {
    trigger: triggerType,
    data: receivedData,
  });
  context.logger.debug('Request metadata', { metadata });

  /* Demonstrate structured logging levels */
  context.logger.warn('Warning: This is just a demonstration of log levels');
  context.logger.error(
    'Error: This is an example error log (not a real error)'
  );

  /* SECTION 2: Understanding Response - Return markdown format */
  // NOTE: We could use response.text() for plain text, but markdown provides richer formatting
  // return response.text('Plain text response here');

  const markdown = `# Agent Response

## Received Data

\`\`\`json
${JSON.stringify(receivedData, null, 2)}
\`\`\`

## Request Info

- **Trigger:** ${triggerType}

## Agent Info

- **Name:** ${context.agent.name}
- **SDK Version:** ${context.sdkVersion}
- **DevMode:** ${context.devmode ? 'Yes' : 'No'}

## Request Metadata

\`\`\`json
${JSON.stringify(metadata, null, 2)}
\`\`\`
`;

  context.logger.info('Returning markdown response');

  return response.markdown(markdown);
}

// DevMode: `prompts` are configurable tests
export const welcome = () => ({
  welcome:
    'SDK Basics Demo - Send JSON data to explore request, response, and context!',
  prompts: [
    {
      data: JSON.stringify({ message: 'Hello World!' }),
      contentType: 'application/json',
    },
    {
      data: JSON.stringify({ user: 'demo-user', action: 'test' }),
      contentType: 'application/json',
    },
  ],
});

```

## Try It Yourself

1. Navigate to `01-sdk-basics/`
2. Open `src/agents/sdk-basics/index.ts`
3. Follow the TODOs to implement each section
4. Test with `agentuity dev`
5. Compare with this solution

## Next Steps

- Try modifying the response format (JSON instead of markdown)
- Add custom metadata fields
- Experiment with different logging levels in DevMode
- Move on to [Demo 2: Storage Types](./02-storage-types.md)
