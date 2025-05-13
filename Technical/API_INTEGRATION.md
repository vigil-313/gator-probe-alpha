# LLM API Integration Specification

## Document ID
[DOC-TECH-API-1]

## Overview
This document specifies how the VALUGATOR Probe Alpha integrates with external LLM APIs to generate gator persona responses. The API integration module follows a provider pattern to support different LLM services while maintaining a minimal, extensible implementation for the initial probe.

## Provider Architecture

The API integration uses a provider pattern with these key components:

```
┌────────────────┐     ┌────────────────┐
│  Prompt        │     │  Configuration │
│  Assembler     │     │  Loader        │
└────────┬───────┘     └────────┬───────┘
         │                      │
         └──────────┬───────────┘
                    ▼
           ┌──────────────────┐
           │                  │
           │   LLM Client     │
           │                  │
           └────────┬─────────┘
                    │
                    ▼
         ┌───────────────────────┐
         │                       │
         │   Provider Factory    │
         │                       │
         └───────────┬───────────┘
                     │
                     ▼
         ┌───────────────────────┐
         │                       │
         │   Claude Provider     │
         │                       │
         └───────────┬───────────┘
                     │
                     ▼
         ┌───────────────────────┐
         │                       │
         │     Claude API        │
         │                       │
         └───────────────────────┘
```

## MVP Implementation Components

### 1. Base Provider Interface

```javascript
// src/api/providers/base.js
class BaseLlmProvider {
  constructor(config) {
    this.config = config;
  }

  async generateResponse(prompt) {
    throw new Error('Method must be implemented by subclass');
  }
}

module.exports = BaseLlmProvider;
```

### 2. Claude Provider Implementation

```javascript
// src/api/providers/claude.js
const BaseLlmProvider = require('./base');

class ClaudeProvider extends BaseLlmProvider {
  constructor(config) {
    super(config);
    this.apiKey = config.apiKey;
    this.baseUrl = config.baseUrl || 'https://api.anthropic.com/v1/messages';
    this.model = config.model || 'claude-3-sonnet-20240229';
  }

  async generateResponse(prompt) {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.apiKey,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: this.model,
          temperature: this.config.temperature || 0.7,
          max_tokens: this.config.maxTokens || 1500,
          messages: [
            { role: 'system', content: prompt },
            { role: 'user', content: 'Provide feedback on this startup idea' }
          ]
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Claude API error: ${errorData.error?.message || response.statusText}`);
      }

      const data = await response.json();
      return data.content[0].text;
    } catch (error) {
      console.error('Error calling Claude API:', error);
      throw error;
    }
  }
}

module.exports = ClaudeProvider;
```

### 3. Provider Factory

```javascript
// src/api/providers/factory.js
const ClaudeProvider = require('./claude');

class LlmProviderFactory {
  static getProvider(type, config) {
    switch(type.toLowerCase()) {
      case 'claude':
        return new ClaudeProvider(config);
      // Future providers would be added here
      default:
        throw new Error(`Unsupported provider type: ${type}`);
    }
  }
}

module.exports = LlmProviderFactory;
```

### 4. LLM Client

```javascript
// src/api/client.js
const LlmProviderFactory = require('./providers/factory');

class LlmClient {
  constructor(providerType, config) {
    this.provider = LlmProviderFactory.getProvider(providerType, config);
  }

  async generateResponse(prompt) {
    try {
      return await this.provider.generateResponse(prompt);
    } catch (error) {
      // Basic error handling for MVP
      console.error('Error generating response:', error);
      throw new Error('Failed to generate response from LLM service');
    }
  }
}

module.exports = LlmClient;
```

## Authentication

API keys are managed securely through environment variables:

1. **Environment File**
   - Create a `.env` file with API keys (gitignored)
   - Load using the dotenv package

```
CLAUDE_API_KEY=your_api_key_here
```

2. **Loading Environment Variables**

```javascript
// server.js
require('dotenv').config();

// Access in code
const apiKey = process.env.CLAUDE_API_KEY;
```

## Request Format

The Claude API request format for the MVP:

```javascript
// Claude API request format
{
  "model": "claude-3-sonnet-20240229",
  "temperature": 0.7,
  "max_tokens": 1500,
  "messages": [
    {
      "role": "system",
      "content": "[System prompt with gator persona instructions]"
    },
    {
      "role": "user",
      "content": "Provide feedback on this startup idea"
    }
  ]
}
```

## Response Format

The Claude API response and extraction:

```javascript
// Sample Claude API response structure
{
  "id": "msg_0123456789ABCDEF",
  "type": "message",
  "role": "assistant",
  "content": [
    {
      "type": "text",
      "text": "Look, I'll be blunt. Your app for AI-written breakup texts... where's the money? Who pays for this? If it's free, it's a toy, not a business. If it's subscription, good luck getting recurring revenue from something people only need occasionally. Your TAM is limited to cowards, which—fine—is a big market, but retention will be abysmal. Fix your revenue model or don't waste my time."
    }
  ],
  "model": "claude-3-sonnet-20240229",
  "stop_reason": "end_turn",
  "usage": {
    "input_tokens": 213,
    "output_tokens": 89
  }
}

// Response extraction
const responseText = response.content[0].text;
```

## Error Handling (MVP)

The MVP implementation includes basic error handling:

1. **API Request Errors**
   - Network issues
   - Authentication failures
   - Invalid responses

2. **Simple Error Communication**
   - Consistent error format
   - Descriptive messages for debugging
   - User-friendly messages for display

```javascript
// Basic error handling
try {
  const response = await provider.generateResponse(prompt);
  return response;
} catch (error) {
  console.error('Error generating response:', error);
  throw new Error('Failed to generate gator response. Please try again.');
}
```

## Configuration

API configuration using environment variables and settings.json:

```javascript
// Example settings.json structure
{
  "llm": {
    "defaultProvider": "claude",
    "providers": {
      "claude": {
        "model": "claude-3-sonnet-20240229",
        "temperature": 0.7,
        "maxTokens": 1500
      }
    }
  }
}
```

## Extension Points

The architecture supports these future extensions:

### 1. Additional Providers

Future versions can easily add new LLM providers by implementing the BaseLlmProvider interface:

```javascript
// Future implementation example
class Gpt4oProvider extends BaseLlmProvider {
  constructor(config) {
    super(config);
    this.apiKey = config.apiKey;
    this.baseUrl = config.baseUrl || 'https://api.openai.com/v1/chat/completions';
    this.model = config.model || 'gpt-4o';
  }

  async generateResponse(prompt) {
    // Implementation for GPT-4o
  }
}
```

### 2. Enhanced Error Handling

Future versions could implement:
- Retry mechanisms for transient failures
- Fallback providers when primary provider fails
- Detailed error categorization and handling

### 3. Response Processing Pipeline

The architecture allows for future addition of:
- Response validation for character consistency
- Content filtering and moderation
- Response formatting enhancements

### 4. Performance Optimizations

Future optimizations could include:
- Response caching for similar prompts
- Request batching
- Token usage optimization

## Integration with Express Server

The LLM client will be integrated with the server:

```javascript
// server.js
const express = require('express');
const LlmClient = require('./src/api/client');
const ConfigLoader = require('./src/config/loader');
const PromptAssembler = require('./src/prompt/assembler');

// Initialize components
const configLoader = new ConfigLoader('/path/to/config');
const promptAssembler = new PromptAssembler(configLoader);
const settings = await configLoader.loadSettings();
const llmClient = new LlmClient(settings.llm.defaultProvider, {
  apiKey: process.env.CLAUDE_API_KEY,
  ...settings.llm.providers[settings.llm.defaultProvider]
});

// API endpoint
app.post('/api/generate', async (req, res) => {
  try {
    const { personaId, userInput } = req.body;
    const prompt = await promptAssembler.assemblePrompt(personaId, userInput);
    const response = await llmClient.generateResponse(prompt);
    res.json({ success: true, response });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});
```

## Implementation Timeline

For the MVP implementation:

1. **Day 5: Core Provider Architecture**
   - Set up provider base class
   - Implement Claude provider
   - Create provider factory

2. **Day 6: Integration and Error Handling**
   - Connect with prompt assembly
   - Implement basic error handling
   - Test with API

Future enhancements are documented in `/Technical/EXTENSION_POINTS.md`.

## Last Updated
2025-05-12T17:55:00-07:00 | SESSION-004 | Claude