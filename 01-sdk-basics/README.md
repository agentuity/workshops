<div align="center">
    <img src="https://raw.githubusercontent.com/agentuity/cli/refs/heads/main/.github/Agentuity.png" alt="Agentuity" width="100"/> <br/>
    <strong>Build Agents, Not Infrastructure</strong> <br/>
    <br/>
        <a target="_blank" href="https://app.agentuity.com/deploy" alt="Agentuity">
            <img src="https://app.agentuity.com/img/deploy.svg" />
        </a>
    <br />
</div>

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

Send JSON payloads to test:

```json
{
  "message": "Hello from the SDK!",
  "timestamp": 1234567890
}
```

Use DevMode to observe parsed data, structured logs, agent metadata, and markdown formatting.

## Deployment

When you're ready to deploy your agent to the Agentuity Cloud:

```bash
agentuity deploy
```

This command will bundle your agent and deploy it to the cloud, making it accessible via the Agentuity platform.

## Project Structure

```
01-sdk-basics/
├── agents/             # Agent implementations
├── node_modules/       # Dependencies
├── package.json        # Project dependencies and scripts
└── agentuity.yaml      # Agentuity project configuration
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

- [Core Concepts Guide](https://agentuity.dev/SDKs/javascript/core-concepts)
- [JavaScript API Reference](https://agentuity.dev/SDKs/javascript/api-reference)
- [Agentuity Examples](https://agentuity.dev/Examples)
- [Agentuity Documentation](https://agentuity.dev/SDKs/javascript)

## Troubleshooting

If you encounter any issues:

1. Check the [documentation](https://agentuity.dev/SDKs/javascript)
2. Join our [Discord community](https://discord.gg/agentuity) for support
3. Contact the Agentuity support team

## License

This project is licensed under the terms specified in the LICENSE file.
