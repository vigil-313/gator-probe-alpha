# VALUGATOR Probe Alpha

A minimal implementation of the VALUGATOR persona-based AI feedback system for evaluating startup ideas.

## Project Overview

The VALUGATOR Probe Alpha is a lightweight implementation designed to demonstrate the core concepts of the VALUGATOR system. It allows users to submit startup ideas and receive feedback from AI-powered "gator personas" with different expertise areas.

The system includes three primary panel types:
- **Evaluation Chamber** - Provides critical feedback on startup ideas
- **Pathfinder Council** - Offers guidance and direction
- **Legal Panel** - Assesses legal risks and considerations

This implementation serves as a proof of concept for the larger VALUGATOR system.

## Core Components

The system consists of three main modules:

1. **Configuration Loader** - Loads and validates gator persona configurations from JSON files
2. **Prompt Assembly** - Combines persona configurations with user input to create effective prompts
3. **LLM API Client** - Communicates with external AI services to generate persona responses

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm 8 or higher

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/gator-probe-alpha.git

# Navigate to the implementation directory
cd gator-probe-alpha/Development/Implementation/gator-probe

# Install dependencies
npm install
```

### Environment Setup

Create a `.env` file in the root directory with the following variables:

```
PORT=3000
NODE_ENV=development
LLM_API_KEY=your_api_key_here
LLM_API_ENDPOINT=https://api.anthropic.com/v1/messages
```

## Development Workflow

### Starting the Server

```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

### Running Tests

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode (re-run on file changes)
npm run test:watch
```

### Linting

```bash
# Check for linting issues
npm run lint

# Fix linting issues automatically
npm run lint:fix
```

## Project Structure

```
/src
  /config      - Configuration loader module
  /prompt      - Prompt assembly module 
  /api         - API integration module
  /utils       - Utility functions
  /public      - Static files for UI
    /css
    /js
  server.js    - Main server entry point
/tests
  /config      - Tests for configuration module
  /prompt      - Tests for prompt assembly module
  /api         - Tests for API integration module
  /utils       - Tests for utility functions
  /integration - End-to-end tests
```

## Implementation Tasks

The project will be implemented in the following sequence:

1. ✅ Project Setup - Basic structure and dependencies
2. 🔄 Configuration Loader - Loading and validating persona configurations
3. 🔄 Configuration Loader Tests - Test suite for the config module
4. 🔲 Prompt Assembly - Creating effective prompts from personas and user input
5. 🔲 Prompt Assembly Tests - Test suite for the prompt module
6. 🔲 LLM API Client - Communication with AI service
7. 🔲 LLM API Client Tests - Test suite for the API client
8. 🔲 Express Server - Complete server implementation
9. 🔲 Express Server Tests - Test suite for the server
10. 🔲 Frontend UI - Complete UI implementation
11. 🔲 End-to-End Testing - Integration tests for the full system
12. 🔲 Documentation & Deployment - Final documentation and deployment

## License

See LICENSE.txt for details on the licensing of this project.