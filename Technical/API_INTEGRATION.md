# LLM API Integration Specification

## Document ID
[DOC-TECH-API-1]

## Overview
This document specifies the architecture for integrating with external LLM APIs (Claude or GPT-4o) to generate in-character gator responses. The API integration layer handles authentication, request formatting, error handling, and response processing.

## API Selection
The probe supports integration with two leading LLM providers:

1. **Anthropic Claude**
   - Primary option
   - Models: claude-3-sonnet-20240229, claude-3-opus-20240229, claude-3-haiku-20240307
   - Endpoint: `https://api.anthropic.com/v1/messages`

2. **OpenAI GPT-4o** (alternative)
   - Secondary option
   - Models: gpt-4o-2024-05-13
   - Endpoint: `https://api.openai.com/v1/chat/completions`

The API selection is configured in `/config/settings.json` and can be changed without modifying code.

## Authentication

API keys must be securely managed:

1. **Environment Variables**
   - ANTHROPIC_API_KEY
   - OPENAI_API_KEY

2. **Environment File**
   - Create a `.env` file with API keys (gitignored)
   - Load values using a library like `dotenv`

```
ANTHROPIC_API_KEY=sk-ant-xxxxx
OPENAI_API_KEY=sk-xxxxx
```

⚠️ **Important**: Never hardcode API keys in source files or commit them to version control.

## Request Format

### Anthropic Claude API

```javascript
// Claude request format
const claudeRequest = {
  model: "claude-3-sonnet-20240229",
  temperature: 0.7,
  max_tokens: 1500,
  messages: [
    {
      role: "system",
      content: systemPrompt  // Assembled from persona config
    },
    {
      role: "user",
      content: userInput     // User's startup idea
    }
  ]
};

// Headers
const claudeHeaders = {
  "Content-Type": "application/json",
  "x-api-key": process.env.ANTHROPIC_API_KEY,
  "anthropic-version": "2023-06-01"
};
```

### OpenAI GPT-4o API

```javascript
// OpenAI request format
const openaiRequest = {
  model: "gpt-4o-2024-05-13",
  temperature: 0.7,
  max_tokens: 1500,
  messages: [
    {
      role: "system",
      content: systemPrompt  // Assembled from persona config
    },
    {
      role: "user",
      content: userInput     // User's startup idea
    }
  ]
};

// Headers
const openaiHeaders = {
  "Content-Type": "application/json",
  "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
};
```

## Response Processing

The response from the API will be processed to extract the generated text:

```javascript
// Claude response format
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
```

Extract the response text:

```javascript
// For Claude API
const responseText = response.content[0].text;

// For OpenAI API
const responseText = response.choices[0].message.content;
```

## Error Handling

The API integration layer will handle various types of errors:

1. **Network Errors**
   - Connection failures
   - Timeout issues
   - Retry mechanism for transient failures

2. **Authentication Errors**
   - Invalid API keys
   - Expired credentials
   - Clear error messages for authentication issues

3. **Rate Limit Errors**
   - Respect rate limits from API providers
   - Implement exponential backoff
   - Queue requests when approaching limits

4. **Malformed Responses**
   - Handle unexpected response formats
   - Provide fallback responses for critical failures

## Response Validation

To ensure character consistency, responses should be validated:

1. **Tone Verification**
   - Check response matches expected character voice
   - Flag responses that seem out of character

2. **Length Validation**
   - Ensure responses are within expected length range
   - Trim extremely long responses if necessary

3. **Content Moderation**
   - Handle potential content filter flags
   - Provide fallback for rejected responses

## Implementation Architecture

```
┌───────────────────┐     ┌────────────────────┐
│ Prompt Assembler  │────►│ API Client Factory │
└───────┬───────────┘     └─────────┬──────────┘
        │                           │
        │                           │
┌───────▼───────────┐    ┌──────────▼─────────┐
│ Request Builder   │◄───┤ Credential Manager │
└───────┬───────────┘    └────────────────────┘
        │
        │
┌───────▼───────────┐
│ HTTP Client       │
└───────┬───────────┘
        │
        │
┌───────▼───────────┐
│ Response Parser   │
└───────┬───────────┘
        │
        │
┌───────▼───────────┐
│ Response Validator│
└───────┬───────────┘
        │
        │
┌───────▼───────────┐
│ Result Handler    │
└───────────────────┘
```

## Metrics and Logging

For monitoring and improvement:

1. **Request Logging**
   - Timestamp
   - Selected gator persona
   - User input length
   - Request ID (for tracking)

2. **Response Metrics**
   - Response time
   - Token usage
   - Response length
   - Character consistency score

3. **Error Tracking**
   - Error type and frequency
   - Failed requests
   - Recovery attempts

## Implementation Example (Pseudocode)

```javascript
// API client implementation
class LlmApiClient {
  constructor(settings) {
    this.provider = settings.provider; // 'claude' or 'openai'
    this.model = settings.model;
    this.apiKey = process.env[this.provider === 'claude' ? 'ANTHROPIC_API_KEY' : 'OPENAI_API_KEY'];
    this.temperature = settings.temperature;
    this.maxTokens = settings.maxTokens;
  }

  async generateResponse(systemPrompt, userInput) {
    try {
      const endpoint = this.getEndpoint();
      const headers = this.getHeaders();
      const payload = this.buildPayload(systemPrompt, userInput);
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload)
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const data = await response.json();
      return this.extractResponseText(data);
    } catch (error) {
      console.error('Error generating response:', error);
      return this.getFallbackResponse();
    }
  }

  // Additional helper methods...
}
```

## Security Considerations

1. **API Key Protection**
   - Use environment variables 
   - Avoid client-side exposure
   - Implement key rotation practices

2. **Content Filtering**
   - Sanitize user inputs
   - Implement profanity/harmful content filtering
   - Respect API provider's usage policies

3. **Data Protection**
   - Consider data retention policies
   - Avoid logging sensitive information
   - Be transparent about data usage

## Last Updated
2025-05-11 23:50:00 PDT | SESSION-INIT-001 | Claude