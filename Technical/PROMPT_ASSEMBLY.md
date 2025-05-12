# Prompt Assembly Architecture

## Document ID
[DOC-TECH-PROM-1]

## Overview
This document outlines the architecture for dynamically assembling LLM prompts from gator persona configurations. The prompt assembly system is responsible for creating effective prompts that produce character-consistent responses based on the selected gator's personality, expertise, and response patterns.

## Prompt Assembly Flow

```
┌───────────────┐     ┌───────────────┐
│ User Input    │     │ Gator Config  │
│ (Startup Idea)│     │ (rex.json)    │
└───────┬───────┘     └───────┬───────┘
        │                     │
        └──────────┬──────────┘
                   ▼
          ┌─────────────────┐
          │ Prompt Template │
          │ (evaluation.json)│
          └────────┬────────┘
                   │
                   ▼
          ┌─────────────────┐
          │Prompt Assembler │
          │                 │
          └────────┬────────┘
                   │
                   ▼
          ┌─────────────────┐
          │   Final Prompt  │
          │                 │
          └────────┬────────┘
                   │
                   ▼
          ┌─────────────────┐
          │     LLM API     │
          │                 │
          └────────┬────────┘
                   │
                   ▼
          ┌─────────────────┐
          │ Gator Response  │
          │                 │
          └─────────────────┘
```

## Components

### 1. Configuration Loader
Responsible for loading and parsing:
- Gator persona configuration (e.g., `/config/personas/evaluation-chamber/rex.json`)
- Prompt template (e.g., `/config/prompt-templates/evaluation.json`)
- Global settings (`/config/settings.json`)

### 2. Template Processor
Responsible for:
- Merging the persona configuration with the prompt template
- Replacing placeholders with actual values (e.g., `{{name}}` → "Rex Revenue")
- Creating a structured system prompt that guides LLM behavior

### 3. Prompt Assembler
Responsible for:
- Combining the processed template with user input
- Applying any additional formatting or context
- Structuring the final request for the LLM API

### 4. API Client
Responsible for:
- Managing API credentials and endpoint configuration
- Sending the assembled prompt to the LLM service
- Receiving and processing the response

## Prompt Structure

The final prompt sent to the LLM will have this structure:

```
System Instructions:
- Role definition (based on gator's archetype and expertise)
- Tone and style guidance (based on gator's tone and critique style)
- Response structure guidance (based on response patterns)
- Vocabulary preferences (based on favored/avoided terms)
- Focus areas for evaluation (based on evaluation focus)

User Input:
"Evaluate this startup idea: [user's startup pitch]"
```

## Template Variable Replacement

The prompt template uses a mustache-style syntax (`{{variable}}`) to insert values from the persona configuration. For example:

Template: `You are {{name}}, also known as "{{nickname}}".`
Result: `You are Rex Revenue, also known as "The Roaster".`

More complex replacements use iteration:

Template: 
```
Your expertise includes:
{{#expertiseAreas}}
- {{.}}
{{/expertiseAreas}}
```

Result:
```
Your expertise includes:
- Business model evaluation
- Revenue strategy
- Founder assessment
- Deal structuring and valuation
```

## API Integration

The system will integrate with Claude (or optionally GPT-4o) API using a standardized approach:

1. **Authentication**: API keys stored in environment variables (not hardcoded)
2. **Request Format**:
   ```json
   {
     "model": "claude-3-sonnet-20240229",
     "temperature": 0.7,
     "max_tokens": 1500,
     "messages": [
       {
         "role": "system",
         "content": "[Assembled system prompt]"
       },
       {
         "role": "user",
         "content": "Evaluate this startup idea: [user input]"
       }
     ]
   }
   ```
3. **Response Handling**:
   - Extract the LLM's response text
   - Optionally log for validation and improvement
   - Return to the UI for display

## Error Handling

The system will handle common error scenarios:

1. **Configuration Errors**: Invalid or missing persona configuration
2. **API Errors**: Network issues, authentication failures, rate limits
3. **Content Moderation**: Handling potential rejections from content filters
4. **Response Validation**: Ensuring the response maintains the expected character voice

## Extensibility

The prompt assembly architecture is designed to support future extensions:

1. **Multiple Gator Types**: Different templates for evaluation, pathfinder, and legal gators
2. **Conversation Context**: Adding previous exchanges for multi-turn interactions
3. **Dynamic Adjustments**: Modifying prompt parameters based on response quality

## Implementation Considerations

- Use a template engine for variable replacement (e.g., Handlebars, Mustache)
- Implement a caching layer for frequently used configurations
- Consider prompt compression techniques for large configurations
- Use request/response logging for debugging and improvement

## Last Updated
2025-05-11 23:50:00 PDT | SESSION-INIT-001 | Claude