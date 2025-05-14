/**
 * Natural Prompt Assembly Module
 * 
 * This is a more natural-sounding alternative to the standard prompt assembler.
 * It's designed to create less formulaic, more authentic character responses.
 */

import { configLoader } from '../config/index.js';
import { PromptError } from './assembler.js';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Natural Prompt Assembler Class
 * Creates more fluid, less formulaic prompts for authentic character responses
 */
export class NaturalPromptAssembler {
  /**
   * Creates a new NaturalPromptAssembler instance
   * @param {Object} configLoader - Configuration loader instance
   */
  constructor(configLoaderInstance = configLoader) {
    this.configLoader = configLoaderInstance;
    this.naturalPromptTemplates = null;
    this.loadNaturalTemplates();
  }

  /**
   * Load natural prompt templates
   */
  async loadNaturalTemplates() {
    try {
      // The path should be relative to the current working directory
      const templatesPath = path.join(process.cwd(), 'config', 'prompt-templates', 'natural_prompts.json');
      console.log('Looking for templates at:', templatesPath);
      const templatesData = await fs.readFile(templatesPath, 'utf8');
      this.naturalPromptTemplates = JSON.parse(templatesData);
      console.log('Natural templates loaded successfully');
    } catch (error) {
      console.error('Error loading natural templates:', error);
      // Fallback to empty templates - will be filled later if needed
      this.naturalPromptTemplates = {
        evaluation: { template: "" },
        legal: { template: "" },
        pathfinder: { template: "" }
      };
    }
  }

  /**
   * Assembles a natural prompt for a given persona and user input
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

      // Ensure templates are loaded
      if (!this.naturalPromptTemplates) {
        await this.loadNaturalTemplates();
      }

      // Load persona configuration
      const persona = await this.configLoader.loadPersona(personaId);

      // Determine panel type if not provided
      const determinedPanelType = panelType || await this._inferPanelType(personaId, persona);

      // Get the natural template for this panel type
      const naturalTemplate = this.naturalPromptTemplates[determinedPanelType]?.template;
      
      if (!naturalTemplate) {
        throw new PromptError(
          `No natural template found for panel type: ${determinedPanelType}`,
          'MISSING_NATURAL_TEMPLATE'
        );
      }

      // Process the natural template with persona data
      const systemPrompt = this._processNaturalTemplate(naturalTemplate, persona);

      // Sanitize user input
      const sanitizedUserInput = this._sanitizeUserInput(userInput);

      // Get user prompt prefix from standard templates (we still need this)
      const standardTemplate = await this.configLoader.loadTemplate(determinedPanelType);
      const userPromptPrefix = standardTemplate.userPromptPrefix || '';

      // Return the complete prompt
      return {
        systemPrompt: systemPrompt,
        userPrompt: `${userPromptPrefix}${sanitizedUserInput}`
      };
    } catch (error) {
      if (error instanceof PromptError) {
        throw error;
      }
      
      throw new PromptError(
        `Error assembling natural prompt: ${error.message}`,
        'NATURAL_PROMPT_ASSEMBLY_ERROR',
        { personaId, error: error.toString() }
      );
    }
  }

  /**
   * Process a natural template with persona data
   * @param {string} template - Natural template string
   * @param {Object} persona - Persona configuration
   * @returns {string} Processed template
   */
  _processNaturalTemplate(template, persona) {
    // Simple variable replacement using regex with more complex patterns
    let processedTemplate = template;
    
    // Handle nested properties with dot notation (e.g., {{evaluationFocus.primaryConcerns.0}})
    const variableRegex = /{{([^{}]+)}}/g;
    
    processedTemplate = processedTemplate.replace(variableRegex, (match, path) => {
      const value = this._getNestedProperty(persona, path.trim());
      
      if (value === undefined) {
        // Return empty string for undefined values to avoid breaking the prompt
        return '';
      }
      
      // Convert arrays to string as needed
      return this._formatValue(value);
    });

    // Add some natural variations to discourage repetitive patterns
    processedTemplate = this._addVariations(processedTemplate);
    
    return processedTemplate;
  }

  /**
   * Add some natural variations to the template
   * @param {string} template - Processed template
   * @returns {string} Template with variations
   */
  _addVariations(template) {
    // Add some random emphasis against formulaic responses
    const variations = [
      "Remember to vary your responses - don't fall into predictable patterns.",
      "Each response should feel fresh and different from previous ones.",
      "CRITICAL: Avoid repetitive phrases and structures that make you sound robotic.",
      "Imagine this character speaking naturally - they wouldn't repeat the same format every time.",
      "Your responses should be unpredictable in structure but consistent in personality."
    ];
    
    // Add a random variation to the template
    const randomVariation = variations[Math.floor(Math.random() * variations.length)];
    return `${template}\n\nADDITIONAL INSTRUCTION: ${randomVariation}`;
  }

  /**
   * Get a nested property from an object using dot notation with array index support
   * @param {Object} obj - Object to extract property from
   * @param {string} path - Property path using dot notation (e.g., "evaluationFocus.primaryConcerns.0")
   * @returns {*} Value of the nested property or undefined if not found
   */
  _getNestedProperty(obj, path) {
    return path.split('.').reduce((current, part) => {
      if (current === undefined || current === null) {
        return undefined;
      }
      
      // Handle array indices
      if (/^\d+$/.test(part) && Array.isArray(current)) {
        const index = parseInt(part, 10);
        return current[index];
      }
      
      return current[part];
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
   * Infer panel type from persona ID or object
   * @param {string} personaId - Persona ID
   * @param {Object} persona - Optional persona object if already loaded
   * @returns {Promise<string>} Inferred panel type
   */
  async _inferPanelType(personaId, persona = null) {
    // If persona is provided and has panelType, use it
    if (persona && persona.panelType) {
      switch (persona.panelType) {
        case 'legal-panel':
          return 'legal';
        case 'evaluation-chamber':
          return 'evaluation';
        case 'pathfinder-council':
          return 'pathfinder';
      }
    }
    
    try {
      // Otherwise, use the standard method from configLoader
      const allPersonas = await this.configLoader.getAllPersonaIds();
      
      for (const [panelType, personaIds] of Object.entries(allPersonas)) {
        if (personaIds.includes(personaId)) {
          return panelType;
        }
      }
      
      // Default to evaluation if not found
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
 * Default export for the NaturalPromptAssembler class
 */
export default NaturalPromptAssembler;