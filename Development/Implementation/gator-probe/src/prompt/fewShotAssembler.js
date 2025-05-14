/**
 * Few-Shot Prompt Assembly Module
 * 
 * This assembler uses examples of good responses to create more natural-sounding outputs.
 * It avoids the formulaic approach by showing concrete examples of desired responses.
 */

import { configLoader } from '../config/index.js';
import { PromptError } from './assembler.js';
import fs from 'fs/promises';
import path from 'path';

/**
 * Few-Shot Prompt Assembler Class
 * Uses examples to create more natural-sounding prompts
 */
export class FewShotPromptAssembler {
  /**
   * Creates a new FewShotPromptAssembler instance
   * @param {Object} configLoader - Configuration loader instance
   */
  constructor(configLoaderInstance = configLoader) {
    this.configLoader = configLoaderInstance;
    this.fewShotExamples = null;
    this.loadExamples();
  }

  /**
   * Load few-shot examples
   */
  async loadExamples() {
    try {
      // The path should be relative to the current working directory
      const examplesPath = path.join(process.cwd(), 'config', 'prompt-templates', 'few_shot_prompts.json');
      console.log('Looking for few-shot examples at:', examplesPath);
      const examplesData = await fs.readFile(examplesPath, 'utf8');
      this.fewShotExamples = JSON.parse(examplesData);
      console.log('Few-shot examples loaded successfully');
    } catch (error) {
      console.error('Error loading few-shot examples:', error);
      // Fallback to empty examples
      this.fewShotExamples = {};
    }
  }

  /**
   * Assembles a prompt using few-shot examples
   * @param {string} personaId - ID of the persona to use
   * @param {string} userInput - User's input to incorporate into the prompt
   * @param {string} [panelType] - Optional panel type override (not used in this assembler)
   * @returns {Promise<Object>} Assembled prompt with system and user messages
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

      // Ensure examples are loaded
      if (!this.fewShotExamples) {
        await this.loadExamples();
      }

      // Load persona configuration
      const persona = await this.configLoader.loadPersona(personaId);

      // Get examples for this persona or fallback to a similar persona
      let examples = this._getExamplesForPersona(personaId);
      
      if (!examples) {
        console.log(`No specific examples for ${personaId}, using fallback examples`);
        examples = this._getFallbackExamples(persona.panelType);
      }

      if (!examples) {
        throw new PromptError(
          `No examples available for persona: ${personaId}`,
          'MISSING_EXAMPLES'
        );
      }

      // Create system message with persona information
      const systemMessage = examples.system || this._createGenericSystemMessage(persona);

      // Create messages array with examples
      const messages = [
        { role: "system", content: systemMessage }
      ];

      // Add few-shot examples
      if (examples.examples && examples.examples.length > 0) {
        examples.examples.forEach(example => {
          messages.push({ role: "user", content: example.user });
          messages.push({ role: "assistant", content: example.assistant });
        });
      }

      // Add current user input
      messages.push({ role: "user", content: userInput });

      // Get user prompt prefix from standard templates (for logging)
      let standardTemplate;
      try {
        standardTemplate = await this.configLoader.loadTemplate(persona.panelType.replace('-panel', '').replace('-chamber', '').replace('-council', ''));
      } catch (e) {
        standardTemplate = { userPromptPrefix: "" };
      }
      const userPromptPrefix = standardTemplate.userPromptPrefix || '';

      // Return the complete prompt in Anthropic's format
      return {
        messages: messages,
        // These are just for compatibility with the original assembler
        systemPrompt: systemMessage,
        userPrompt: `${userPromptPrefix}${userInput}`
      };
    } catch (error) {
      if (error instanceof PromptError) {
        throw error;
      }
      
      throw new PromptError(
        `Error assembling few-shot prompt: ${error.message}`,
        'FEW_SHOT_PROMPT_ASSEMBLY_ERROR',
        { personaId, error: error.toString() }
      );
    }
  }

  /**
   * Get examples for a specific persona
   * @param {string} personaId - ID of the persona
   * @returns {Object|null} Examples object or null if not found
   */
  _getExamplesForPersona(personaId) {
    // Try with exact ID match
    if (this.fewShotExamples[personaId]) {
      return this.fewShotExamples[personaId];
    }

    // Try with simplified ID (without hyphens)
    const simplifiedId = personaId.replace(/-/g, '');
    
    for (const [id, examples] of Object.entries(this.fewShotExamples)) {
      if (id.replace(/-/g, '') === simplifiedId) {
        return examples;
      }
    }

    return null;
  }

  /**
   * Get fallback examples based on panel type
   * @param {string} panelType - Panel type
   * @returns {Object|null} Examples object or null if no suitable fallback found
   */
  _getFallbackExamples(panelType) {
    // Map of fallback personas for each panel type
    const fallbacks = {
      'evaluation-chamber': 'rex',
      'legal-panel': 'rex', // Not ideal but better than nothing
      'pathfinder-council': 'ada-bloom'
    };

    const fallbackId = fallbacks[panelType];
    return fallbackId ? this.fewShotExamples[fallbackId] : null;
  }

  /**
   * Create a generic system message based on persona information
   * @param {Object} persona - Persona configuration
   * @returns {string} Generic system message
   */
  _createGenericSystemMessage(persona) {
    const stayInCharacter = "Respond directly as this character to the user's request. Don't introduce yourself or explain your role - just give the evaluation or guidance as this character naturally would. Maintain the character's personality, tone, and perspective throughout.";
    
    let message = `You are roleplaying as ${persona.name} (${persona.nickname}), ${persona.archetype}.\n\n`;
    message += `Key traits: ${persona.critiqueStyle} Your tone is ${persona.tone}.\n\n`;
    
    if (persona.catchphrase) {
      message += `Your catchphrase is "${persona.catchphrase}" though you don't force it into every conversation.\n\n`;
    }
    
    message += `Expertise areas: ${persona.expertiseAreas.join(', ')}.\n\n`;
    
    message += `When evaluating ideas, you focus on: ${persona.evaluationFocus.primaryConcerns.join(', ')}.\n\n`;
    
    message += `You notice red flags like: ${persona.evaluationFocus.redFlags.slice(0, 3).join(', ')}.\n\n`;
    
    message += stayInCharacter;
    
    return message;
  }
}

/**
 * Default export for the FewShotPromptAssembler class
 */
export default FewShotPromptAssembler;