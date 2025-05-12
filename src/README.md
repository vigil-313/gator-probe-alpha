# VALUGATOR Probe Alpha: Source Code

This directory will contain the implementation of the VALUGATOR Probe Alpha. The code is organized to separate different concerns and ensure maintainability.

## Directory Structure

- **api/**: LLM API client and API endpoint handlers
- **prompt/**: Prompt assembly logic and template processing
- **public/**: Client-side code and assets (HTML, CSS, JS)
- **utils/**: Utility functions for configuration, logging, etc.

## Implementation Status

The implementation is currently in the planning phase. The next steps are:

1. Set up the project dependencies (Express, dotenv, etc.)
2. Implement the prompt assembly logic
3. Create the LLM API client
4. Develop the minimal user interface
5. Connect all components and test end-to-end

## Getting Started

Once implementation begins, this directory will be populated with code following the structure outlined in `/Technical/PROJECT_STRUCTURE.md`.

## Environment Setup

The application will require these environment variables:

```
# LLM API keys (at least one is required)
ANTHROPIC_API_KEY=your_claude_api_key
OPENAI_API_KEY=your_openai_api_key

# Server configuration
PORT=3000
NODE_ENV=development
```