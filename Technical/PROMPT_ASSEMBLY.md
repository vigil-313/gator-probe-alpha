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

## Implementation Components (MVP)

### 1. Configuration Loader
Simple module for loading and validating JSON configuration files:

```javascript
class ConfigLoader {
  constructor(basePath) {
    this.basePath = basePath;
  }

  async loadPersona(id) {
    try {
      const panelDirectories = ['evaluation-chamber', 'pathfinder-council', 'legal-panel'];

      // For MVP, we do a simple search through all panel directories
      for (const dir of panelDirectories) {
        try {
          return await this._loadJsonFile(`personas/${dir}/${id}.json`);
        } catch (error) {
          // File not found in this directory, continue to next
          if (error.code !== 'ENOENT') throw error;
        }
      }

      throw new Error(`Persona not found: ${id}`);
    } catch (error) {
      console.error(`Error loading persona ${id}:`, error);
      throw new Error(`Failed to load persona ${id}`);
    }
  }

  async loadTemplate(panelType) {
    try {
      return await this._loadJsonFile(`prompt-templates/${panelType}.json`);
    } catch (error) {
      console.error(`Error loading template for ${panelType}:`, error);
      throw new Error(`Failed to load template for ${panelType}`);
    }
  }

  // Private helper method
  async _loadJsonFile(relativePath) {
    const fs = require('fs').promises;
    const path = require('path');
    const fullPath = path.join(this.basePath, relativePath);

    const data = await fs.readFile(fullPath, 'utf8');
    return JSON.parse(data);
  }
}
```

### 2. Prompt Assembler
Core class combining template processing and prompt assembly:

```javascript
class PromptAssembler {
  constructor(configLoader) {
    this.configLoader = configLoader;
  }

  async assemblePrompt(personaId, userInput) {
    // Load persona configuration
    const persona = await this.configLoader.loadPersona(personaId);

    // Determine panel type from persona
    const panelType = persona.panelType || this._inferPanelType(personaId);

    // Load appropriate template
    const template = await this.configLoader.loadTemplate(panelType);

    // Process the template with persona attributes and user input
    return this._processTemplate(template, persona, userInput);
  }

  // Helper method to process template variables
  _processTemplate(template, persona, userInput) {
    let prompt = template.basePrompt;

    // Replace persona-specific variables
    Object.entries(persona).forEach(([key, value]) => {
      // Handle nested objects by flattening
      if (typeof value === 'object' && value !== null) {
        Object.entries(this._flattenObject(value, key)).forEach(([nestedKey, nestedValue]) => {
          prompt = prompt.replace(new RegExp(`\\{\\{${nestedKey}\\}\\}`, 'g'), nestedValue);
        });
      } else if (typeof value === 'string') {
        prompt = prompt.replace(new RegExp(`\\{\\{${key}\\}\\}`, 'g'), value);
      }
    });

    // Replace user input variable
    prompt = prompt.replace(/\{\{userInput\}\}/g, userInput);

    return prompt;
  }

  // Helper method to flatten nested objects for template processing
  _flattenObject(obj, prefix = '') {
    const result = {};

    Object.entries(obj).forEach(([key, value]) => {
      const newKey = prefix ? `${prefix}.${key}` : key;

      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        Object.assign(result, this._flattenObject(value, newKey));
      } else if (Array.isArray(value)) {
        // Join array values with commas for simple MVP implementation
        result[newKey] = value.join(', ');
      } else if (typeof value === 'string') {
        result[newKey] = value;
      }
    });

    return result;
  }

  // Helper method to infer panel type from persona ID
  _inferPanelType(personaId) {
    // Simple inference logic for MVP
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

## API Integration

The system will integrate with the LLM API (initially Claude) using this approach:

```javascript
// Simple request format for Claude API (MVP implementation)
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
      "content": "Evaluate this startup idea: [user input]"
    }
  ]
}
```

## Extension Points

The prompt assembly system is designed with several extension points for future development:

1. **Processing Pipeline**
   - Add pre-processing steps for user input sanitization
   - Implement post-processing for persona-specific formatting
   - Support for conditional template sections

2. **Template Enhancements**
   - Advanced variable formatting options
   - Dynamic template selection based on input content
   - Template versioning support

3. **Multi-turn Support**
   - Context preservation between interactions
   - History-aware template adjustments
   - Progressive persona responses

These extension points are documented in more detail in `/Technical/EXTENSION_POINTS.md`.

## Last Updated
2025-05-12T17:45:00-07:00 | SESSION-004 | Claude