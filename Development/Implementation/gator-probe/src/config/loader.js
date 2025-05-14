/**
 * Configuration Loader Module
 * 
 * Responsible for loading and validating:
 * - Gator persona configurations
 * - Prompt templates
 * - Global settings
 * 
 * This module follows the provider pattern to allow for future extensibility
 * and provides a clean API for accessing configurations with proper validation
 * and error handling.
 */

import fs from 'fs/promises';
import path from 'path';

/**
 * Custom error class for configuration errors
 */
export class ConfigError extends Error {
  constructor(message, errorCode, fileName) {
    super(message);
    this.name = 'ConfigError';
    this.errorCode = errorCode;
    this.fileName = fileName;
  }
}

/**
 * Configuration Loader Class
 */
export class ConfigLoader {
  /**
   * Creates a new ConfigLoader instance
   * @param {string} basePath - Base path to configuration directory
   */
  constructor(basePath) {
    this.basePath = basePath || process.cwd();
    this.configPath = path.join(this.basePath, 'config');
    
    // Panel types and directories mapping
    this.panelTypes = {
      'evaluation': 'evaluation-chamber',
      'pathfinder': 'pathfinder-council',
      'legal': 'legal-panel'
    };

    // Cache for loaded configurations
    this.cache = {
      personas: {},
      templates: {},
      settings: null
    };
  }

  /**
   * Load a JSON file
   * @param {string} relativePath - Path relative to the config directory
   * @returns {Promise<Object>} Parsed JSON object
   * @throws {ConfigError} If file cannot be loaded or is invalid JSON
   */
  async _loadJsonFile(relativePath) {
    try {
      const fullPath = path.join(this.configPath, relativePath);
      const data = await fs.readFile(fullPath, 'utf8');
      
      try {
        return JSON.parse(data);
      } catch (parseError) {
        throw new ConfigError(
          `Invalid JSON in ${relativePath}: ${parseError.message}`,
          'INVALID_JSON',
          relativePath
        );
      }
    } catch (error) {
      if (error instanceof ConfigError) {
        throw error;
      }
      
      if (error.code === 'ENOENT') {
        throw new ConfigError(
          `Configuration file not found: ${relativePath}`,
          'FILE_NOT_FOUND',
          relativePath
        );
      }
      
      throw new ConfigError(
        `Error loading configuration file ${relativePath}: ${error.message}`,
        'FILE_READ_ERROR',
        relativePath
      );
    }
  }

  /**
   * Validate persona configuration
   * @param {Object} persona - Persona configuration to validate
   * @returns {boolean} True if valid
   * @throws {ConfigError} If configuration is invalid
   */
  _validatePersona(persona) {
    // Required fields for persona configuration
    const requiredFields = [
      'id', 'name', 'nickname', 'archetype', 'expertiseAreas', 
      'critiqueStyle', 'tone', 'visualAppearance', 'strengths', 
      'weaknesses', 'catchphrase', 'responsePatterns', 'evaluationFocus'
    ];
    
    // Check for missing required fields
    const missingFields = requiredFields.filter(field => !persona[field]);
    if (missingFields.length > 0) {
      throw new ConfigError(
        `Invalid persona configuration: missing required fields: ${missingFields.join(', ')}`,
        'INVALID_PERSONA_CONFIG',
        `personas/${persona.id}.json`
      );
    }
    
    // Validate nested fields
    if (!persona.responsePatterns.introFormats || !Array.isArray(persona.responsePatterns.introFormats)) {
      throw new ConfigError(
        'Invalid persona configuration: responsePatterns.introFormats must be an array',
        'INVALID_PERSONA_CONFIG', 
        `personas/${persona.id}.json`
      );
    }
    
    if (!persona.evaluationFocus.primaryConcerns || !Array.isArray(persona.evaluationFocus.primaryConcerns)) {
      throw new ConfigError(
        'Invalid persona configuration: evaluationFocus.primaryConcerns must be an array',
        'INVALID_PERSONA_CONFIG',
        `personas/${persona.id}.json`
      );
    }
    
    return true;
  }

  /**
   * Validate prompt template configuration
   * @param {Object} template - Template configuration to validate
   * @param {string} panelType - Panel type
   * @returns {boolean} True if valid
   * @throws {ConfigError} If configuration is invalid
   */
  _validateTemplate(template, panelType) {
    // Check for required structure
    if (!template.systemPromptStructure || !Array.isArray(template.systemPromptStructure)) {
      throw new ConfigError(
        'Invalid template configuration: systemPromptStructure must be an array',
        'INVALID_TEMPLATE_CONFIG',
        `prompt-templates/${panelType}.json`
      );
    }
    
    // Validate each section has required fields
    for (const section of template.systemPromptStructure) {
      if (!section.section || !section.template) {
        throw new ConfigError(
          'Invalid template configuration: each section must have section and template fields',
          'INVALID_TEMPLATE_CONFIG',
          `prompt-templates/${panelType}.json`
        );
      }
    }
    
    // Check for user prompt prefix
    if (!template.userPromptPrefix) {
      throw new ConfigError(
        'Invalid template configuration: missing userPromptPrefix',
        'INVALID_TEMPLATE_CONFIG',
        `prompt-templates/${panelType}.json`
      );
    }
    
    return true;
  }

  /**
   * Validate settings configuration
   * @param {Object} settings - Settings configuration to validate
   * @returns {boolean} True if valid
   * @throws {ConfigError} If configuration is invalid
   */
  _validateSettings(settings) {
    // Check for required sections
    const requiredSections = ['apiSettings', 'userInterface', 'promptSettings', 'validationSettings'];
    const missingSections = requiredSections.filter(section => !settings[section]);
    
    if (missingSections.length > 0) {
      throw new ConfigError(
        `Invalid settings configuration: missing required sections: ${missingSections.join(', ')}`,
        'INVALID_SETTINGS_CONFIG',
        'settings.json'
      );
    }
    
    // Validate API settings
    if (!settings.apiSettings.provider || !settings.apiSettings.model) {
      throw new ConfigError(
        'Invalid settings configuration: apiSettings must include provider and model',
        'INVALID_SETTINGS_CONFIG',
        'settings.json'
      );
    }
    
    return true;
  }

  /**
   * Determine panel type for a persona ID
   * @param {string} personaId - Persona ID to check
   * @returns {Promise<string>} Panel type
   */
  async _determinePanelType(personaId) {
    // First check all panel directories for the persona
    for (const [panelType, dirName] of Object.entries(this.panelTypes)) {
      try {
        const filePath = path.join('personas', dirName, `${personaId}.json`);
        await fs.access(path.join(this.configPath, filePath));
        return panelType;
      } catch (error) {
        // File not found in this directory, continue to next
        if (error.code === 'ENOENT') continue;
        throw error;
      }
    }
    
    // Persona not found in any panel directory
    throw new ConfigError(
      `Cannot determine panel type: persona "${personaId}" not found in any panel directory`,
      'PERSONA_NOT_FOUND',
      `personas/${personaId}.json`
    );
  }

  /**
   * Load a persona configuration by ID
   * @param {string} personaId - ID of the persona to load
   * @returns {Promise<Object>} Persona configuration
   * @throws {ConfigError} If persona cannot be loaded or is invalid
   */
  async loadPersona(personaId) {
    // Check cache first
    if (this.cache.personas[personaId]) {
      return this.cache.personas[personaId];
    }
    
    // Determine panel type for this persona
    const panelType = await this._determinePanelType(personaId);
    const dirName = this.panelTypes[panelType];
    
    // Load and validate the persona
    const persona = await this._loadJsonFile(path.join('personas', dirName, `${personaId}.json`));
    this._validatePersona(persona);
    
    // Cache the result
    this.cache.personas[personaId] = persona;
    return persona;
  }

  /**
   * Load a prompt template for a specific panel type
   * @param {string} panelType - Type of panel (evaluation, pathfinder, legal)
   * @returns {Promise<Object>} Template configuration
   * @throws {ConfigError} If template cannot be loaded or is invalid
   */
  async loadTemplate(panelType) {
    // Check cache first
    if (this.cache.templates[panelType]) {
      return this.cache.templates[panelType];
    }
    
    // Check if valid panel type
    if (!this.panelTypes[panelType]) {
      throw new ConfigError(
        `Invalid panel type: ${panelType}. Must be one of: ${Object.keys(this.panelTypes).join(', ')}`,
        'INVALID_PANEL_TYPE',
        `prompt-templates/${panelType}.json`
      );
    }
    
    // Load and validate the template
    const template = await this._loadJsonFile(path.join('prompt-templates', `${panelType}.json`));
    this._validateTemplate(template, panelType);
    
    // Cache the result
    this.cache.templates[panelType] = template;
    return template;
  }

  /**
   * Load global settings
   * @returns {Promise<Object>} Settings configuration
   * @throws {ConfigError} If settings cannot be loaded or are invalid
   */
  async loadSettings() {
    // Check cache first
    if (this.cache.settings) {
      return this.cache.settings;
    }
    
    try {
      // Load and validate the settings
      const settings = await this._loadJsonFile('settings.json');
      this._validateSettings(settings);
      
      // Cache the result
      this.cache.settings = settings;
      return settings;
    } catch (error) {
      // For settings, we'll provide default values if the file is missing
      if (error instanceof ConfigError && error.errorCode === 'FILE_NOT_FOUND') {
        const defaultSettings = this._getDefaultSettings();
        this.cache.settings = defaultSettings;
        return defaultSettings;
      }
      
      throw error;
    }
  }

  /**
   * Get default settings if settings.json is missing
   * @returns {Object} Default settings
   */
  _getDefaultSettings() {
    // Get values from environment variables or use defaults
    const useSimulationMode = process.env.USE_SIMULATION_MODE === 'true';
    
    return {
      defaultGator: "rex",
      apiSettings: {
        provider: "claude",
        apiVersion: process.env.CLAUDE_API_VERSION || "2023-08-31",
        model: process.env.CLAUDE_MODEL || "claude-3-sonnet-20240229",
        temperature: parseFloat(process.env.CLAUDE_TEMPERATURE) || 0.7,
        maxTokens: parseInt(process.env.CLAUDE_MAX_TOKENS) || 1500,
        useSimulationMode: useSimulationMode,
        baseUrl: process.env.CLAUDE_API_BASE_URL || "https://api.anthropic.com/v1"
      },
      userInterface: {
        includeGatorSelection: true,
        displayGatorAttributes: false,
        showResponseMetadata: false
      },
      promptSettings: {
        includeVisualDescription: true,
        maxInputLength: 2000,
        systemPromptTemplate: "config/prompt-templates/evaluation.json"
      },
      validationSettings: {
        logResponses: true,
        trackToneConsistency: true,
        validatePersonaAdherence: true
      }
    };
  }

  /**
   * Get all available persona IDs across all panel types
   * @returns {Promise<Object>} Object with panel types as keys and arrays of persona IDs as values
   */
  async getAllPersonaIds() {
    const result = {};
    
    // Scan each panel directory
    for (const [panelType, dirName] of Object.entries(this.panelTypes)) {
      try {
        const dirPath = path.join(this.configPath, 'personas', dirName);
        const files = await fs.readdir(dirPath);
        
        // Filter for JSON files and extract IDs
        result[panelType] = files
          .filter(file => file.endsWith('.json'))
          .map(file => file.replace('.json', ''));
      } catch (error) {
        // Skip if directory doesn't exist
        if (error.code === 'ENOENT') {
          result[panelType] = [];
        } else {
          throw error;
        }
      }
    }
    
    return result;
  }

  /**
   * Clear the configuration cache
   * @param {string} [cacheType] - Specific cache to clear (personas, templates, settings)
   */
  clearCache(cacheType) {
    if (!cacheType) {
      // Clear all caches
      this.cache = {
        personas: {},
        templates: {},
        settings: null
      };
    } else if (this.cache[cacheType]) {
      // Clear specific cache
      this.cache[cacheType] = cacheType === 'settings' ? null : {};
    }
  }
}

/**
 * Default config loader instance using current working directory
 */
export const configLoader = new ConfigLoader(process.cwd());

/**
 * Default export for easy importing
 */
export default configLoader;