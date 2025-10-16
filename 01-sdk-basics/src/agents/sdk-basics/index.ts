import type { AgentRequest, AgentResponse, AgentContext } from '@agentuity/sdk';

export default async function Agent(
  request: AgentRequest,
  response: AgentResponse,
  context: AgentContext
) {
  /* SECTION 1: Understanding Agent Request */
  // TODO: Parse JSON data with request.data.json()
  const receivedData = null;

  // TODO: Get trigger type from request.trigger
  const triggerType = '';

  // TODO: Get request metadata from request.metadata
  const metadata = null;

  // TODO: Log agent invocation with trigger and data

  // TODO: Log request metadata at debug level

  /* Demonstrate structured logging levels */
  // TODO: Add a warning log

  // TODO: Add an error log

  /* SECTION 2: Understanding Agent Response */
  // NOTE: We could use response.text() for plain text, but markdown provides richer formatting
  // return response.text('Plain text response here');

  // TODO: Build markdown string with received data, trigger, metadata, and agent info
  // Tip: Use template literals and JSON.stringify() for objects
  const markdown = `# Agent Response

## Received Data

TODO: Add received data in a code block

## Request Info

TODO: Add trigger type

## Agent Info

TODO: Add context.agent.name, context.sdkVersion, and context.devmode

## Request Metadata

TODO: Add metadata in a code block
`;

  // TODO: Log that we're returning the response

  // TODO: Return the markdown response
}

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
