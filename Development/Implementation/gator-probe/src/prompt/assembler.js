/**
 * Prompt Assembly Module
 * 
 * Responsible for:
 * - Processing templates with variable replacement
 * - Accessing persona configurations and templates via config loader
 * - Handling nested object access in templates
 * - Supporting arrays and complex data structures
 * - Incorporating user input into prompts
 * - Providing clean API for prompt generation
 */

import { configLoader } from '../config/index.js';

/**
 * Custom error class for prompt assembly errors
 */
export class PromptError extends Error {
  constructor(message, errorCode, details = {}) {
    super(message);
    this.name = 'PromptError';
    this.errorCode = errorCode;
    this.details = details;
  }
}

/**
 * Prompt Assembler Class
 * Responsible for combining persona configurations, templates, and user input
 * to create complete prompts for the LLM API
 */
export class PromptAssembler {
  /**
   * Creates a new PromptAssembler instance
   * @param {Object} configLoader - Configuration loader instance
   */
  constructor(configLoaderInstance = configLoader) {
    this.configLoader = configLoaderInstance;
  }

  /**
   * Assembles a complete prompt for a given persona and user input
   * @param {string} personaId - ID of the persona to use
   * @param {string} userInput - User's input to incorporate into the prompt
   * @param {string} [panelType] - Optional panel type override
   * @returns {Promise<string>} Assembled prompt
   * @throws {PromptError} If an error occurs during prompt assembly
   */
  async assemblePrompt(personaId, userInput, panelType = null) {
    try {
      if (!personaId) {
        throw new PromptError(
          'Persona ID is required',
          'MISSING_PERSONA_ID'
        );
      }

      if (!userInput) {
        throw new PromptError(
          'User input is required',
          'MISSING_USER_INPUT'
        );
      }

      // Load persona configuration
      const persona = await this.configLoader.loadPersona(personaId);

      // Determine panel type if not provided
      const determinedPanelType = panelType || await this._inferPanelType(personaId);

      // Load appropriate template
      const template = await this.configLoader.loadTemplate(determinedPanelType);

      // Load global settings for defaults
      const settings = await this.configLoader.loadSettings();

      // Process system prompt sections
      const systemPromptSections = template.systemPromptStructure.map(section => {
        return this._processTemplate(section.template, persona);
      }).join('\n\n');

      // Sanitize user input
      const sanitizedUserInput = this._sanitizeUserInput(userInput);

      // Combine user prompt prefix with sanitized user input
      const userPrompt = `${template.userPromptPrefix}${sanitizedUserInput}`;

      // Return the complete prompt (system prompt + user prompt)
      return {
        systemPrompt: systemPromptSections,
        userPrompt: userPrompt
      };
    } catch (error) {
      if (error instanceof PromptError) {
        throw error;
      }
      
      throw new PromptError(
        `Error assembling prompt: ${error.message}`,
        'PROMPT_ASSEMBLY_ERROR',
        { personaId, error: error.toString() }
      );
    }
  }

  /**
   * Process template string by replacing variables with values from the provided persona
   * @param {string} template - Template string with variable placeholders
   * @param {Object} persona - Persona configuration containing values
   * @returns {string} Processed template with variables replaced
   * @throws {PromptError} If template is invalid or contains undefined variables
   */
  _processTemplate(template, persona) {
    try {
      if (!template) {
        throw new PromptError(
          'Template string is required',
          'MISSING_TEMPLATE'
        );
      }

      if (!persona) {
        throw new PromptError(
          'Persona configuration is required',
          'MISSING_PERSONA'
        );
      }

      // Handle {{#array}} iterations
      let processedTemplate = this._processArrayIterations(template, persona);

      // Replace regular variables {{variable}}
      processedTemplate = this._replaceVariables(processedTemplate, persona);

      return processedTemplate;
    } catch (error) {
      if (error instanceof PromptError) {
        throw error;
      }
      
      throw new PromptError(
        `Error processing template: ${error.message}`,
        'TEMPLATE_PROCESSING_ERROR',
        { template: template.substring(0, 50) + '...' }
      );
    }
  }

  /**
   * Replace variable placeholders in template string
   * @param {string} template - Template string with variable placeholders
   * @param {Object} persona - Persona configuration containing values
   * @returns {string} Processed template with variables replaced
   * @throws {PromptError} If variables are undefined
   */
  _replaceVariables(template, persona) {
    // Regular expression to match {{variable}} and {{nested.property}}
    const variableRegex = /{{([^#\/][^{}]*)}}/g;
    
    return template.replace(variableRegex, (match, variablePath) => {
      const value = this._getNestedProperty(persona, variablePath.trim());
      
      if (value === undefined) {
        throw new PromptError(
          `Variable "${variablePath}" not found in persona configuration`,
          'UNDEFINED_VARIABLE',
          { variablePath }
        );
      }
      
      // Convert arrays and objects to string appropriately
      return this._formatValue(value);
    });
  }

  /**
   * Process array iterations in template (Mustache-like syntax)
   * @param {string} template - Template string with array iteration blocks
   * @param {Object} persona - Persona configuration containing arrays
   * @returns {string} Processed template with array iterations expanded
   * @throws {PromptError} If array is undefined or block syntax is invalid
   */
  _processArrayIterations(template, persona) {
    // Pattern for array iteration blocks: {{#array}}...{{/array}}
    const arrayBlockPattern = /{{#([^{}]+)}}([\s\S]*?){{\/\1}}/g;
    
    return template.replace(arrayBlockPattern, (match, arrayPath, blockContent) => {
      const array = this._getNestedProperty(persona, arrayPath.trim());
      
      if (!array) {
        throw new PromptError(
          `Array "${arrayPath}" not found in persona configuration`,
          'UNDEFINED_ARRAY',
          { arrayPath }
        );
      }
      
      if (!Array.isArray(array)) {
        throw new PromptError(
          `Property "${arrayPath}" is not an array`,
          'NOT_AN_ARRAY',
          { arrayPath, actualType: typeof array }
        );
      }
      
      // Replace {{.}} with the current array item within the block
      return array.map(item => {
        if (typeof item === 'object') {
          // For objects, recursively process the block
          return this._replaceVariables(blockContent, item);
        } else {
          // For simple values, replace {{.}} with the item
          return blockContent.replace(/{{\.}}/g, item);
        }
      }).join('');
    });
  }

  /**
   * Get a nested property from an object using dot notation
   * @param {Object} obj - Object to extract property from
   * @param {string} path - Property path using dot notation (e.g., "user.address.street")
   * @returns {*} Value of the nested property or undefined if not found
   */
  _getNestedProperty(obj, path) {
    // Handle the special case of "." referring to the current item in iteration
    if (path === '.') {
      return obj;
    }
    
    return path.split('.').reduce((current, part) => {
      return current && current[part] !== undefined ? current[part] : undefined;
    }, obj);
  }

  /**
   * Format a value for template insertion
   * @param {*} value - Value to format
   * @returns {string} Formatted value
   */
  _formatValue(value) {
    if (value === null || value === undefined) {
      return '';
    }
    
    if (typeof value === 'object') {
      if (Array.isArray(value)) {
        return value.join(', ');
      }
      return JSON.stringify(value);
    }
    
    return String(value);
  }

  /**
   * Infer panel type from persona ID
   * @param {string} personaId - Persona ID to infer panel type from
   * @returns {Promise<string>} Inferred panel type
   * @throws {PromptError} If panel type cannot be determined
   */
  async _inferPanelType(personaId) {
    try {
      // Get all persona IDs grouped by panel type
      const allPersonas = await this.configLoader.getAllPersonaIds();
      
      // Check each panel for the persona ID
      for (const [panelType, personaIds] of Object.entries(allPersonas)) {
        if (personaIds.includes(personaId)) {
          return panelType;
        }
      }
      
      // If panel type still not determined, get default from settings
      const settings = await this.configLoader.loadSettings();
      const defaultTemplate = settings?.promptSettings?.systemPromptTemplate || '';
      
      // Extract default panel type from template path
      if (defaultTemplate.includes('evaluation')) {
        return 'evaluation';
      } else if (defaultTemplate.includes('pathfinder')) {
        return 'pathfinder';
      } else if (defaultTemplate.includes('legal')) {
        return 'legal';
      }
      
      // If all else fails, default to evaluation
      return 'evaluation';
    } catch (error) {
      throw new PromptError(
        `Error inferring panel type: ${error.message}`,
        'PANEL_TYPE_INFERENCE_ERROR',
        { personaId }
      );
    }
  }

  /**
   * Sanitize user input to prevent template injection or other issues
   * @param {string} userInput - Raw user input
   * @returns {string} Sanitized user input
   */
  _sanitizeUserInput(userInput) {
    if (!userInput) {
      return '';
    }
    
    // Convert to string if not already
    const inputStr = String(userInput);
    
    // Remove any template-like constructs that could cause issues
    const sanitized = inputStr
      .replace(/{{/g, '{ {') // Break up template markers
      .replace(/}}/g, '} }')
      .trim();
    
    return sanitized;
  }
}

/**
 * Default export for the PromptAssembler class
 */
export default PromptAssembler;