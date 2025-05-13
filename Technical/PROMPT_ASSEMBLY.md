# Prompt Assembly Architecture

## Document ID
[DOC-TECH-PROM-1]

## Overview
This document outlines the architecture for the prompt assembly system, which combines gator persona configurations with user input to create effective prompts for the LLM API. The system is designed for minimal initial implementation while maintaining extensibility for future enhancements.

## Prompt Assembly Flow

```
┌───────────────┐     ┌───────────────┐
│ User Input    │     │ Persona Config│
│ (Startup Idea)│     │ (JSON file)   │
└───────┬───────┘     └───────┬───────┘
        │                     │
        └──────────┬──────────┘
                   ▼
          ┌─────────────────┐
          │ Prompt Template │
          │ (Panel-specific)│
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
          │ Assembled Prompt│
          │ (Final Output)  │
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

## Prompt Structure
The LLM prompt for a gator persona response follows this high-level structure:

```
[System Instruction]
You are roleplaying as [Persona Name], [Persona Description].
Your tone is [Tone Description].
Your expertise areas are [Expertise Areas].
Your response style includes [Response Patterns].

When evaluating startup ideas, you focus on [Evaluation Focus].

[Behavioral Guidelines]
- Always stay in character as [Persona Name]
- Use phrases like [Catchphrase Examples]
- Structure your response with a brief introduction, then detailed critique, then conclusion
- Use vocabulary that includes [Preferred Terms] and avoids [Avoided Terms]

[User Input Instruction]
Evaluate the following startup idea in character as [Persona Name]:

[User's Startup Idea]
```

## Prompt Template Format

Prompt templates are stored as JSON files with variable placeholders that are replaced with persona-specific attributes:

```json
{
  "basePrompt": "You are roleplaying as {{name}}, {{archetype}}. Your tone is {{tone}}. Your expertise areas are {{expertiseAreas}}.\n\nWhen evaluating startup ideas, you focus on {{evaluationFocus.primaryConcerns}}.\n\nAlways stay in character as {{nickname}}. Use phrases like {{catchphrase}}. Structure your response with a brief introduction, then detailed critique, then conclusion.\n\nEvaluate the following startup idea in character as {{name}}:\n\n{{userInput}}"
}
```

## Implemented PromptAssembler Class

The PromptAssembler provides a robust implementation for combining persona configurations, templates, and user input:

```javascript
/**
 * Custom error class for prompt-related errors
 */
class PromptError extends Error {
  constructor(message, code, details = {}) {
    super(message);
    this.name = 'PromptError';
    this.code = code;
    this.details = details;
  }
}

/**
 * The PromptAssembler class responsible for combining persona configurations, 
 * templates, and user input to generate effective prompts for LLM API calls.
 */
class PromptAssembler {
  /**
   * Create a new PromptAssembler instance
   * @param {Object} configLoader - Configuration loader instance
   */
  constructor(configLoader) {
    if (!configLoader) {
      throw new PromptError(
        'Configuration loader is required',
        'PROMPT_CONFIG_MISSING'
      );
    }
    this.configLoader = configLoader;
    this.ERROR_CODES = {
      PERSONA_NOT_FOUND: 'PROMPT_PERSONA_NOT_FOUND',
      TEMPLATE_NOT_FOUND: 'PROMPT_TEMPLATE_NOT_FOUND',
      TEMPLATE_PROCESSING: 'PROMPT_TEMPLATE_PROCESSING',
      USER_INPUT_INVALID: 'PROMPT_USER_INPUT_INVALID',
      CONFIG_MISSING: 'PROMPT_CONFIG_MISSING'
    };
  }

  /**
   * Assembles a complete prompt by combining persona configuration with a template and user input
   * @param {string} personaId - The ID of the gator persona
   * @param {string} userInput - The user's startup idea input
   * @param {Object} options - Additional options for prompt assembly (optional)
   * @returns {Promise<Object>} - The assembled prompt with system and user components
   */
  async assemblePrompt(personaId, userInput, options = {}) {
    try {
      // Validate inputs
      if (!personaId) {
        throw new PromptError(
          'Persona ID is required', 
          this.ERROR_CODES.PERSONA_NOT_FOUND
        );
      }
      
      if (!userInput || typeof userInput !== 'string') {
        throw new PromptError(
          'User input must be a non-empty string', 
          this.ERROR_CODES.USER_INPUT_INVALID
        );
      }

      // Sanitize user input to prevent template injection
      const sanitizedInput = this._sanitizeInput(userInput);
      
      // Load persona configuration
      const persona = await this.configLoader.loadPersona(personaId);
      
      // Determine panel type from persona or options
      const panelType = 
        options.panelType || 
        persona.panelType || 
        this._inferPanelType(personaId);
      
      // Load appropriate template
      const template = await this.configLoader.loadTemplate(panelType);
      
      // Process the template with persona attributes and user input
      const systemPrompt = this._processTemplate(template.basePrompt, persona, sanitizedInput);
      
      // Return structured prompt with separate system and user components
      return {
        system: systemPrompt,
        user: sanitizedInput,
        metadata: {
          personaId,
          panelType,
          timestamp: new Date().toISOString()
        }
      };
    } catch (error) {
      // If it's already a PromptError, rethrow it
      if (error instanceof PromptError) {
        throw error;
      }
      
      // Otherwise, wrap it in a PromptError with appropriate error code
      if (error.message.includes('not found')) {
        throw new PromptError(
          `Failed to find persona: ${personaId}`,
          this.ERROR_CODES.PERSONA_NOT_FOUND,
          { personaId, originalError: error.message }
        );
      }
      
      throw new PromptError(
        `Error assembling prompt: ${error.message}`,
        this.ERROR_CODES.TEMPLATE_PROCESSING,
        { personaId, originalError: error.message }
      );
    }
  }

  /**
   * Process template string with persona attributes and user input.
   * Supports variable replacement, array iterations, and nested properties.
   * @param {string} templateString - The template string containing variables
   * @param {Object} persona - The persona configuration object
   * @param {string} userInput - The sanitized user input
   * @returns {string} - The processed template with all variables replaced
   * @private
   */
  _processTemplate(templateString, persona, userInput) {
    try {
      let result = templateString;
      
      // Process array iterations first (e.g., {{#array}}...{{/array}})
      result = this._processArrayBlocks(result, persona);
      
      // Replace all variables with their values
      result = this._replaceVariables(result, persona);
      
      // Replace user input last to ensure it doesn't interfere with template processing
      result = result.replace(/\{\{userInput\}\}/g, userInput);
      
      return result;
    } catch (error) {
      throw new PromptError(
        `Template processing error: ${error.message}`,
        this.ERROR_CODES.TEMPLATE_PROCESSING,
        { originalError: error.message }
      );
    }
  }

  /**
   * Process template blocks for array iterations
   * @param {string} template - The template string
   * @param {Object} data - The data object (persona)
   * @returns {string} - Processed template with array blocks expanded
   * @private
   */
  _processArrayBlocks(template, data) {
    // Regular expression to match array iteration blocks: {{#array}}...{{/array}}
    const arrayBlockRegex = /\{\{#([\w\.]+)\}\}([\s\S]*?)\{\{\/\1\}\}/g;
    
    return template.replace(arrayBlockRegex, (match, arrayPath, blockContent) => {
      const arrayValue = this._getPropertyValue(data, arrayPath);
      
      // If not an array or empty, return empty string
      if (!Array.isArray(arrayValue) || arrayValue.length === 0) {
        return '';
      }
      
      // Process each array item
      return arrayValue.map(item => {
        let content = blockContent;
        
        // If item is an object, replace variables in the block
        if (typeof item === 'object' && item !== null) {
          // Replace {{.property}} with the item's property value
          content = content.replace(/\{\{\.([\w]+)\}\}/g, (_, prop) => 
            item[prop] || '');
        } else {
          // Replace {{.}} with the item itself
          content = content.replace(/\{\{\.\}\}/g, item);
        }
        
        return content;
      }).join('\n');
    });
  }

  /**
   * Replace all variables in a template with their values
   * @param {string} template - The template string
   * @param {Object} data - The data object (persona)
   * @returns {string} - Template with all variables replaced
   * @private
   */
  _replaceVariables(template, data) {
    return template.replace(/\{\{([\w\.]+)\}\}/g, (match, path) => {
      // Skip userInput as it's handled separately
      if (path === 'userInput') return match;
      
      const value = this._getPropertyValue(data, path);
      
      // Handle different value types
      if (Array.isArray(value)) {
        return value.join(', ');
      } else if (value === null || value === undefined) {
        return '';
      } else if (typeof value === 'object') {
        // Convert object to string representation
        return JSON.stringify(value);
      }
      
      return String(value);
    });
  }

  /**
   * Get a property value from an object using dot notation path
   * @param {Object} obj - The object to extract from
   * @param {string} path - The property path (e.g., 'user.profile.name')
   * @returns {*} - The property value or undefined if not found
   * @private
   */
  _getPropertyValue(obj, path) {
    return path.split('.').reduce((current, key) => {
      return current !== undefined && current !== null ? current[key] : undefined;
    }, obj);
  }

  /**
   * Sanitize user input to prevent template injection
   * @param {string} input - User input to sanitize
   * @returns {string} - Sanitized input
   * @private
   */
  _sanitizeInput(input) {
    // Replace any template-like patterns that could cause issues
    return input
      .replace(/\{\{/g, '{ {')
      .replace(/\}\}/g, '} }')
      // Additional sanitization as needed
      .trim();
  }

  /**
   * Infer panel type from persona ID based on known persona lists
   * @param {string} personaId - The persona ID
   * @returns {string} - The inferred panel type
   * @private
   */
  _inferPanelType(personaId) {
    // Comprehensive lists of all personas by panel type
    const evaluationPersonas = ['rex', 'vanessa', 'finley', 'tessa', 'huxley', 'maya', 'lucius', 'ada-bloom', 'jax-morrow', 'dr-cass-nova', 'nyx', 'kip-snapjaw', 'serena-vale'];
    const pathfinderPersonas = ['zane', 'luma', 'bram', 'ori', 'echo', 'vex', 'nell', 'sol', 'dr-vire-glint'];
    const legalPersonas = ['lex', 'clara', 'rana-regulus', 'gavin-graymark', 'delphi-docket', 'isla-proxy', 'morven-sealight'];

    if (evaluationPersonas.includes(personaId)) return 'evaluation';
    if (pathfinderPersonas.includes(personaId)) return 'pathfinder';
    if (legalPersonas.includes(personaId)) return 'legal';

    // Default to evaluation if unknown
    return 'evaluation';
  }
}
```

## Panel-Specific Templates

The system supports three distinct panel types, each with a tailored template structure:

### 1. Evaluation Chamber Template
```json
{
  "basePrompt": "You are roleplaying as {{name}}, {{nickname}}, a {{archetype}}.\n\nYour expertise areas are: {{expertiseAreas}}.\n\nYour tone is: {{tone}}\n\nWhen evaluating startup ideas, you focus on: {{evaluationFocus.primaryConcerns}}\n\nYou often ask questions like: {{evaluationFocus.typicalQuestions}}\n\nYou look for positive indicators such as: {{evaluationFocus.positiveIndicators}}\n\nYou watch for red flags including: {{evaluationFocus.redFlags}}\n\nUse vocabulary like: {{responsePatterns.vocabularyPreferences.favoredTerms}}\n\nAvoid terms like: {{responsePatterns.vocabularyPreferences.avoidedTerms}}\n\nYour catchphrase is: {{catchphrase}}\n\nEvaluate the following startup idea from your unique perspective, staying fully in character as {{name}}. Give specific, detailed feedback about the business concept with your characteristic tone and focus areas:\n\n{{userInput}}"
}
```

### 2. Pathfinder Council Template
```json
{
  "basePrompt": "You are roleplaying as {{name}}, {{nickname}}, a {{archetype}} on the Pathfinder Council.\n\nYour expertise areas are: {{expertiseAreas}}.\n\nYour tone is: {{tone}}\n\nYou guide founders by focusing on: {{evaluationFocus.primaryConcerns}}\n\nYou typically ask guiding questions like: {{evaluationFocus.typicalQuestions}}\n\nYou respond with techniques including: {{responsePatterns.critiqueTechniques}}\n\nUse vocabulary like: {{responsePatterns.vocabularyPreferences.favoredTerms}}\n\nAvoid terms like: {{responsePatterns.vocabularyPreferences.avoidedTerms}}\n\nYour catchphrase is: {{catchphrase}}\n\nProvide guidance and direction for the following startup idea from your unique perspective, staying fully in character as {{name}}. Offer reflective insights, navigational questions, and thoughtful advice with your characteristic tone:\n\n{{userInput}}"
}
```

### 3. Legal Panel Template
```json
{
  "basePrompt": "You are roleplaying as {{name}}, {{nickname}}, a {{archetype}} on the Legal Panel.\n\nYour expertise areas are: {{expertiseAreas}}.\n\nYour tone is: {{tone}}\n\nWhen examining legal aspects of startups, you focus on: {{evaluationFocus.primaryConcerns}}\n\nYou typically ask questions like: {{evaluationFocus.typicalQuestions}}\n\nYou examine potential issues using: {{responsePatterns.critiqueTechniques}}\n\nUse vocabulary like: {{responsePatterns.vocabularyPreferences.favoredTerms}}\n\nAvoid terms like: {{responsePatterns.vocabularyPreferences.avoidedTerms}}\n\nYour catchphrase is: {{catchphrase}}\n\nASSESSMENT REQUIREMENTS:\n- You must include the following legal disclaimer in your response: \"I am an AI character, not a licensed attorney. This analysis is for educational purposes only and does not constitute legal advice. Consult qualified legal professionals before making any legal decisions.\"\n- Clearly state what aspects you CAN assess and what you CANNOT assess\n- Focus on identifying potential legal issues rather than providing definitive legal conclusions\n\nAssess the following startup idea from your unique legal perspective, staying fully in character as {{name}}. Identify potential legal considerations and risks while adhering to the assessment requirements:\n\n{{userInput}}"
}
```

## Template Syntax Features

The implemented prompt assembly system supports the following template syntax features:

### 1. Simple Variable Replacement
```
{{variable}}
```
Replaces the placeholder with the value of the specified variable.

### 2. Nested Property Access
```
{{object.property.subproperty}}
```
Accesses nested properties using dot notation paths.

### 3. Array Iteration
```
{{#array}}
  This item is {{.}}
{{/array}}
```
Iterates through array items, replacing `{{.}}` with each item value.

### 4. Object Array Iteration
```
{{#arrayOfObjects}}
  Name: {{.name}}, Value: {{.value}}
{{/arrayOfObjects}}
```
Iterates through arrays of objects, allowing access to properties of each object.

### 5. Default Formatting
- Arrays are joined with commas when used directly: `{{array}}` → `item1, item2, item3`
- Objects are converted to their JSON string representation
- `null` and `undefined` values are replaced with empty strings

## Usage Examples

### Basic Template Example
```javascript
const personaId = 'rex';
const userInput = 'An AI app that helps people write breakup texts';

const promptAssembler = new PromptAssembler(configLoader);
const prompt = await promptAssembler.assemblePrompt(personaId, userInput);

console.log(prompt.system); // The system prompt with all variables replaced
console.log(prompt.user);  // The sanitized user input
```

### Complete Integration Example
```javascript
// Import dependencies
import { PromptAssembler } from './prompt/index.js';
import { ConfigLoader } from './config/index.js';

// Setup configuration
const configPath = './config';
const configLoader = new ConfigLoader(configPath);

// Create prompt assembler
const promptAssembler = new PromptAssembler(configLoader);

// Assemble prompt
async function generatePrompt(personaId, userInput) {
  try {
    const prompt = await promptAssembler.assemblePrompt(personaId, userInput);
    return prompt;
  } catch (error) {
    console.error(`Error generating prompt: ${error.message}`);
    if (error.code === 'PROMPT_PERSONA_NOT_FOUND') {
      // Handle missing persona error
    }
    throw error;
  }
}
```

## API Integration

The system integrates with the LLM API (initially Claude) using the PromptAssembler output:

```javascript
// Assembled prompt structure
{
  system: "You are roleplaying as Rex Revenue...",
  user: "An AI app that helps people write breakup texts",
  metadata: {
    personaId: "rex",
    panelType: "evaluation",
    timestamp: "2025-05-15T10:42:15.123Z"
  }
}

// Simple request format for Claude API
{
  "model": "claude-3-sonnet-20240229",
  "temperature": 0.7,
  "max_tokens": 1500,
  "messages": [
    {
      "role": "system",
      "content": "You are roleplaying as Rex Revenue..."
    },
    {
      "role": "user",
      "content": "An AI app that helps people write breakup texts"
    }
  ]
}
```

## Extension Points

The prompt assembly system is designed with several extension points for future development:

1. **Processing Pipeline**
   - ✅ User input sanitization is implemented
   - Add post-processing for persona-specific formatting
   - ✅ Support for array iteration blocks is implemented
   - Add conditional template sections (if/else blocks)

2. **Template Enhancements**
   - Add format specifiers (e.g., `{{variable:uppercase}}`, `{{date:YYYY-MM-DD}}`)
   - Add dynamic template selection based on input content
   - Implement template inheritance and composition

3. **Multi-turn Support**
   - Add conversation context preservation between interactions
   - Implement history-aware template adjustments
   - Support for progressive persona responses

4. **Error Handling and Validation**
   - ✅ Custom PromptError class with error codes is implemented
   - ✅ Input validation and sanitization is implemented
   - Add template validation to verify all variables exist

These extension points are documented in more detail in `/Technical/EXTENSION_POINTS.md`.

## Last Updated
2025-05-15T10:45:00Z | SESSION-008 | Claude