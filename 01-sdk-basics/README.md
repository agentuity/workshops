# Demo 1: SDK Basics and Agent Fundamentals

**Time:** 20-30 minutes

## Overview

This demo introduces the core concepts of building agents with the Agentuity SDK. You'll build a single agent from the ground up, learning how to handle requests, return responses, access context, and implement structured logging.

## What You'll Build

A foundational agent that demonstrates the request-response-context lifecycle. Parse incoming data, log operations at multiple levels, access runtime metadata, and return formatted responses.

## Key Concepts

- **Request Handling** - Parse data formats (JSON, text), access metadata and trigger information
- **Response Formatting** - Return clean markdown responses
- **Context and Logging** - Implement structured logging (info, debug, warn, error)
- **Agent Metadata** - Access agent name, SDK version, and execution mode

## Workshop Flow

1. **Understanding Request** - Parse data, inspect triggers and metadata
2. **Understanding Response** - Format and return structured output
3. **Adding Logging** - Implement info, debug, warn, and error level logs
4. **Context and Agent Info** - Access runtime metadata and environment details

## Testing

Send JSON payloads to test:

```json
{
  "message": "Hello from the SDK!",
  "timestamp": 1234567890
}
```

Use DevMode to observe parsed data, structured logs, agent metadata, and markdown formatting.

## Resources

- [Core Concepts Guide](https://agentuity.dev/SDKs/javascript/core-concepts)
- [JavaScript API Reference](https://agentuity.dev/SDKs/javascript/api-reference)
- [Agentuity Examples](https://agentuity.dev/Examples)
