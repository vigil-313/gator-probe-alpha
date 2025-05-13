# Extensibility Design Patterns

## Document ID
[DOC-DEV-IMPL-EXT-1]

## Overview
This document provides implementation guidelines for ensuring the VALUGATOR Probe Alpha codebase remains extensible while maintaining a minimal viable implementation for the initial probe. These patterns should be applied consistently throughout the implementation to create a foundation that can be built upon in future iterations.

## Key Design Patterns

### 1. Provider Pattern for API Clients

The provider pattern allows for seamless integration of multiple LLM services while keeping the core application logic unchanged.

#### Implementation Guidelines

```javascript
// src/api/client.js
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

// src/api/providers/base.js
class BaseLlmProvider {
  constructor(config) {
    this.config = config;
  }
  
  async generateResponse(prompt) {
    throw new Error('Method must be implemented by subclass');
  }
}

// src/api/providers/claude.js
class ClaudeProvider extends BaseLlmProvider {
  constructor(config) {
    super(config);
    this.apiKey = config.apiKey;
    this.baseUrl = config.baseUrl || 'https://api.anthropic.com/v1';
  }
  
  async generateResponse(prompt) {
    // Implementation for Claude API
    const response = await fetch(`${this.baseUrl}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': this.apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: this.config.model || 'claude-3-opus-20240229',
        max_tokens: this.config.maxTokens || 1000,
        messages: [
          { role: 'user', content: prompt }
        ]
      })
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(`Claude API error: ${data.error?.message || 'Unknown error'}`);
    }
    
    return data.content[0].text;
  }
}

// src/api/providers/factory.js
class LlmProviderFactory {
  static getProvider(type, config) {
    switch(type) {
      case 'claude':
        return new ClaudeProvider(config);
      default:
        throw new Error(`Unknown provider type: ${type}`);
    }
  }
}
```

### 2. Modular Configuration Loading

This pattern allows for flexible configuration management with clean separation of concerns.

#### Implementation Guidelines

```javascript
// src/config/loader.js
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
  
  async loadSettings() {
    try {
      return await this._loadJsonFile('settings.json');
    } catch (error) {
      console.error('Error loading settings:', error);
      // Return defaults for MVP
      return {
        defaultProvider: 'claude',
        defaultPersona: 'rex',
        apiConfig: {}
      };
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

### 3. Template-Based Prompt Assembly

This pattern provides a flexible system for constructing prompts that can be extended in the future.

#### Implementation Guidelines

```javascript
// src/prompt/assembler.js
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
    
    // For MVP, we're keeping it simple
    return prompt;
  }
  
  // Helper method to flatten nested objects for template processing
  _flattenObject(obj, prefix = '') {
    const result = {};
    
    Object.entries(obj).forEach(([key, value]) => {
      const newKey = prefix ? `${prefix}.${key}` : key;
      
      if (typeof value === 'object' && value !== null) {
        Object.assign(result, this._flattenObject(value, newKey));
      } else if (typeof value === 'string') {
        result[newKey] = value;
      }
    });
    
    return result;
  }
  
  // Helper method to infer panel type from persona ID
  _inferPanelType(personaId) {
    // Simple inference logic for MVP
    // In future, this would be more robust or stored in the config
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

### 4. Basic Error Handling Framework

A consistent approach to error handling that can be extended in the future.

#### Implementation Guidelines

```javascript
// src/utils/errors.js

// Custom error classes that can be extended in the future
class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

class ConfigurationError extends AppError {
  constructor(message) {
    super(message, 500);
  }
}

class LlmApiError extends AppError {
  constructor(message, apiDetails = {}) {
    super(message, 502);
    this.apiDetails = apiDetails;
  }
}

class ValidationError extends AppError {
  constructor(message, validationErrors = []) {
    super(message, 400);
    this.validationErrors = validationErrors;
  }
}

// Error handler function for Express
function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || 500;
  
  // Log error (for MVP, just console.log)
  console.error('Error:', err);
  
  // For MVP, we keep the API simple
  res.status(statusCode).json({
    success: false,
    message: err.message || 'An unexpected error occurred',
    // Only include stack trace in development
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
}

module.exports = {
  AppError,
  ConfigurationError,
  LlmApiError,
  ValidationError,
  errorHandler
};
```

### 5. Basic Input Validation

Simple validation system that can be extended with more sophisticated rules.

#### Implementation Guidelines

```javascript
// src/utils/validation.js
function validateUserInput(input) {
  // Basic validation for MVP
  if (!input || typeof input !== 'string') {
    throw new Error('User input must be a non-empty string');
  }
  
  if (input.trim().length === 0) {
    throw new Error('User input cannot be empty');
  }
  
  if (input.trim().length > 1000) {
    throw new Error('User input exceeds maximum length of 1000 characters');
  }
  
  return input.trim();
}

function validatePersonaId(id) {
  // Basic validation for MVP
  if (!id || typeof id !== 'string') {
    throw new Error('Persona ID must be a non-empty string');
  }
  
  // Simple format validation
  if (!id.match(/^[a-z0-9-]+$/)) {
    throw new Error('Persona ID contains invalid characters');
  }
  
  return id.trim();
}

module.exports = {
  validateUserInput,
  validatePersonaId
};
```

## Express API Implementation

Basic server setup with extensibility in mind:

```javascript
// server.js
const express = require('express');
const path = require('path');
const { errorHandler } = require('./src/utils/errors');
const ConfigLoader = require('./src/config/loader');
const PromptAssembler = require('./src/prompt/assembler');
const LlmClient = require('./src/api/client');
const { validateUserInput, validatePersonaId } = require('./src/utils/validation');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'src/public')));

// Initialize components
const configLoader = new ConfigLoader(path.join(__dirname, 'config'));
const promptAssembler = new PromptAssembler(configLoader);

// Main API endpoint
app.post('/api/generate', async (req, res, next) => {
  try {
    const { personaId, userInput } = req.body;
    
    // Validate inputs
    const validatedPersonaId = validatePersonaId(personaId);
    const validatedUserInput = validateUserInput(userInput);
    
    // Load settings
    const settings = await configLoader.loadSettings();
    
    // Create LLM client
    const llmClient = new LlmClient(
      settings.defaultProvider,
      settings.apiConfig[settings.defaultProvider]
    );
    
    // Assemble prompt
    const prompt = await promptAssembler.assemblePrompt(validatedPersonaId, validatedUserInput);
    
    // Generate response
    const response = await llmClient.generateResponse(prompt);
    
    // Return response
    res.json({
      success: true,
      personaId: validatedPersonaId,
      response
    });
  } catch (error) {
    next(error);
  }
});

// Simple API to get available personas
app.get('/api/personas', async (req, res, next) => {
  try {
    // For MVP, we'll use a simplified implementation
    // In future versions, this would be more sophisticated
    const personas = [
      { id: 'rex', name: 'Rex Revenue', panel: 'evaluation-chamber' },
      { id: 'vanessa', name: 'Vanessa Venture', panel: 'evaluation-chamber' },
      { id: 'zane', name: 'Zane Cutter', panel: 'pathfinder-council' },
      { id: 'lex', name: 'Lex Talionis', panel: 'legal-panel' }
      // More would be added dynamically in future versions
    ];
    
    res.json({
      success: true,
      personas
    });
  } catch (error) {
    next(error);
  }
});

// Error handling middleware
app.use(errorHandler);

// Start server
app.listen(port, () => {
  console.log(`VALUGATOR Probe Alpha server running on port ${port}`);
});
```

## Minimal Frontend Implementation

Simple but extensible frontend:

```html
<!-- src/public/index.html -->
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>VALUGATOR Probe Alpha</title>
  <link rel="stylesheet" href="css/styles.css">
</head>
<body>
  <div class="container">
    <header>
      <h1>VALUGATOR Probe Alpha</h1>
    </header>
    
    <main>
      <form id="gator-form">
        <div class="form-group">
          <label for="persona-select">Choose a Gator:</label>
          <select id="persona-select" required>
            <option value="" disabled selected>Select a gator...</option>
            <!-- Will be populated dynamically -->
          </select>
        </div>
        
        <div class="form-group">
          <label for="user-input">Enter your startup idea:</label>
          <textarea id="user-input" rows="5" placeholder="Describe your startup idea here..." required></textarea>
        </div>
        
        <button type="submit">Get Feedback</button>
      </form>
      
      <div id="response-container" class="hidden">
        <h2 id="response-header"></h2>
        <div id="response-content"></div>
        <button id="reset-button">Submit Another Idea</button>
      </div>
      
      <div id="loading-indicator" class="hidden">
        <p>Getting feedback from your chosen gator...</p>
      </div>
      
      <div id="error-container" class="hidden">
        <p id="error-message"></p>
        <button id="error-reset-button">Try Again</button>
      </div>
    </main>
    
    <footer>
      <p>VALUGATOR Probe Alpha | 2025</p>
    </footer>
  </div>
  
  <script src="js/app.js"></script>
</body>
</html>
```

```javascript
// src/public/js/app.js
document.addEventListener('DOMContentLoaded', function() {
  // Get DOM elements
  const form = document.getElementById('gator-form');
  const personaSelect = document.getElementById('persona-select');
  const userInput = document.getElementById('user-input');
  const responseContainer = document.getElementById('response-container');
  const responseHeader = document.getElementById('response-header');
  const responseContent = document.getElementById('response-content');
  const resetButton = document.getElementById('reset-button');
  const loadingIndicator = document.getElementById('loading-indicator');
  const errorContainer = document.getElementById('error-container');
  const errorMessage = document.getElementById('error-message');
  const errorResetButton = document.getElementById('error-reset-button');
  
  // Load available personas
  fetchPersonas();
  
  // Event listeners
  form.addEventListener('submit', handleSubmit);
  resetButton.addEventListener('click', resetForm);
  errorResetButton.addEventListener('click', resetForm);
  
  // Functions
  async function fetchPersonas() {
    try {
      const response = await fetch('/api/personas');
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || 'Failed to load personas');
      }
      
      // Populate select dropdown
      data.personas.forEach(persona => {
        const option = document.createElement('option');
        option.value = persona.id;
        option.textContent = `${persona.name} (${formatPanelName(persona.panel)})`;
        personaSelect.appendChild(option);
      });
    } catch (error) {
      showError('Failed to load gator personas. Please refresh the page.');
      console.error('Error fetching personas:', error);
    }
  }
  
  async function handleSubmit(event) {
    event.preventDefault();
    
    // Basic validation
    if (!personaSelect.value) {
      showError('Please select a gator persona');
      return;
    }
    
    if (!userInput.value.trim()) {
      showError('Please enter your startup idea');
      return;
    }
    
    // Show loading indicator
    showLoading();
    
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          personaId: personaSelect.value,
          userInput: userInput.value
        })
      });
      
      const data = await response.json();
      
      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to generate response');
      }
      
      // Display response
      showResponse(data.personaId, data.response);
    } catch (error) {
      showError(error.message || 'An error occurred while getting feedback');
      console.error('Error generating response:', error);
    } finally {
      hideLoading();
    }
  }
  
  function showResponse(personaId, responseText) {
    // Get persona name from select option
    const personaName = Array.from(personaSelect.options)
      .find(option => option.value === personaId)?.textContent || personaId;
    
    // Update response content
    responseHeader.textContent = `Feedback from ${personaName}`;
    responseContent.innerHTML = `<p>${formatResponse(responseText)}</p>`;
    
    // Show response container, hide form
    form.classList.add('hidden');
    responseContainer.classList.remove('hidden');
    errorContainer.classList.add('hidden');
  }
  
  function resetForm() {
    // Reset and show form
    form.reset();
    form.classList.remove('hidden');
    responseContainer.classList.add('hidden');
    errorContainer.classList.add('hidden');
  }
  
  function showError(message) {
    errorMessage.textContent = message;
    errorContainer.classList.remove('hidden');
  }
  
  function showLoading() {
    loadingIndicator.classList.remove('hidden');
    form.classList.add('hidden');
  }
  
  function hideLoading() {
    loadingIndicator.classList.add('hidden');
  }
  
  // Helper functions
  function formatPanelName(panel) {
    const panelNames = {
      'evaluation-chamber': 'Evaluation',
      'pathfinder-council': 'Pathfinder',
      'legal-panel': 'Legal'
    };
    
    return panelNames[panel] || panel;
  }
  
  function formatResponse(text) {
    // Basic formatting for MVP
    // Future versions could add more sophisticated formatting
    return text.replace(/\n/g, '<br>');
  }
});
```

```css
/* src/public/css/styles.css */
/* Basic styling for MVP */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: Arial, sans-serif;
  line-height: 1.6;
  color: #333;
  background-color: #f4f4f4;
}

.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

header {
  margin-bottom: 30px;
  text-align: center;
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

select, textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

button {
  display: inline-block;
  padding: 10px 20px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #45a049;
}

#response-container {
  margin-top: 30px;
  padding: 20px;
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

#response-header {
  margin-bottom: 15px;
  color: #2c3e50;
}

#response-content {
  margin-bottom: 20px;
  white-space: pre-line;
}

#loading-indicator {
  text-align: center;
  margin: 30px 0;
}

#error-container {
  margin-top: 20px;
  padding: 15px;
  background-color: #f8d7da;
  color: #721c24;
  border-radius: 4px;
}

.hidden {
  display: none;
}

footer {
  margin-top: 50px;
  text-align: center;
  color: #777;
}
```

## Last Updated
2025-05-12T17:50:00-07:00 | SESSION-004 | Claude