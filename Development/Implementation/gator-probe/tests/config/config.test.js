/**
 * Configuration Loader Tests
 * 
 * Tests for the configuration loader module that is responsible for loading:
 * - Persona configurations
 * - Prompt templates
 * - Global settings
 * 
 * These tests verify correct loading, validation and error handling.
 */

import { jest } from '@jest/globals';
import path from 'path';
import fs from 'fs/promises';

// Manual mock for fs/promises
const mockFs = {
  readFile: jest.fn(),
  access: jest.fn(),
  readdir: jest.fn()
};

// Manually mock the fs/promises module
jest.mock('fs/promises', () => mockFs, { virtual: true });

// Import the module to test
import { ConfigLoader, ConfigError } from '../../src/config/loader.js';

describe('ConfigLoader', () => {
  let configLoader;
  const testBasePath = '/test/path';
  const configPath = path.join(testBasePath, 'config');

  // Test data
  const validPersona = {
    id: 'rex',
    name: 'Rex Revenue',
    nickname: 'The Roaster',
    archetype: 'Seasoned Angel Investor/Shark',
    expertiseAreas: ['Business model evaluation'],
    critiqueStyle: 'No-nonsense',
    tone: 'Short, punchy sentences',
    visualAppearance: {
      physicalDescription: 'Test',
      attire: 'Test',
      expressions: 'Test'
    },
    strengths: ['Test'],
    weaknesses: ['Test'],
    catchphrase: 'Test',
    responsePatterns: {
      introFormats: ['Test1', 'Test2'],
      critiqueTechniques: ['Test'],
      conclusionFormats: ['Test'],
      vocabularyPreferences: {
        favoredTerms: ['Test'],
        avoidedTerms: ['Test']
      },
      sentenceStructure: 'Test'
    },
    evaluationFocus: {
      primaryConcerns: ['Test1', 'Test2'],
      typicalQuestions: ['Test'],
      redFlags: ['Test'],
      positiveIndicators: ['Test']
    }
  };

  const validTemplate = {
    systemPromptStructure: [
      {
        section: 'roleDefinition',
        template: 'You are {{name}}'
      },
      {
        section: 'responseGuidelines',
        template: 'Respond with {{tone}}'
      }
    ],
    userPromptPrefix: 'Evaluate this:',
    contextVariables: {
      pitchType: 'startup idea'
    }
  };

  const validSettings = {
    defaultGator: 'rex',
    apiSettings: {
      provider: 'claude',
      model: 'claude-3-sonnet-20240229'
    },
    userInterface: {
      includeGatorSelection: true
    },
    promptSettings: {
      includeVisualDescription: true
    },
    validationSettings: {
      logResponses: true
    }
  };

  // Set up the test environment
  beforeEach(() => {
    // Clear all mocks
    jest.clearAllMocks();
    
    // Create a new ConfigLoader instance
    configLoader = new ConfigLoader(testBasePath);
    
    // Mock mockFs.readFile for different files
    mockFs.readFile.mockImplementation((filePath, encoding) => {
      if (filePath.includes('rex.json')) {
        return Promise.resolve(JSON.stringify(validPersona));
      }
      if (filePath.includes('evaluation.json')) {
        return Promise.resolve(JSON.stringify(validTemplate));
      }
      if (filePath.includes('settings.json')) {
        return Promise.resolve(JSON.stringify(validSettings));
      }
      return Promise.reject(new Error(`File not found: ${filePath}`));
    });
    
    // Mock mockFs.access
    mockFs.access.mockImplementation((filePath) => {
      if (filePath.includes('evaluation-chamber/rex.json')) {
        return Promise.resolve();
      }
      return Promise.reject({ code: 'ENOENT' });
    });
    
    // Mock mockFs.readdir
    mockFs.readdir.mockImplementation((dirPath) => {
      if (dirPath.includes('evaluation-chamber')) {
        return Promise.resolve(['rex.json', 'vanessa.json']);
      }
      if (dirPath.includes('pathfinder-council')) {
        return Promise.resolve(['zane.json', 'luma.json']);
      }
      if (dirPath.includes('legal-panel')) {
        return Promise.resolve(['lex.json', 'clara.json']);
      }
      return Promise.reject({ code: 'ENOENT' });
    });
  });

  // Tests for constructor
  describe('constructor', () => {
    test('should create a ConfigLoader instance with default path', () => {
      const defaultLoader = new ConfigLoader();
      expect(defaultLoader.basePath).toBe(process.cwd());
      expect(defaultLoader.configPath).toBe(path.join(process.cwd(), 'config'));
    });

    test('should create a ConfigLoader instance with custom path', () => {
      expect(configLoader.basePath).toBe(testBasePath);
      expect(configLoader.configPath).toBe(configPath);
    });
  });

  // Tests for _loadJsonFile (private method)
  describe('_loadJsonFile', () => {
    test('should load and parse a JSON file', async () => {
      const result = await configLoader._loadJsonFile('personas/evaluation-chamber/rex.json');
      expect(result).toEqual(validPersona);
      expect(mockFs.readFile).toHaveBeenCalledWith(
        path.join(configPath, 'personas/evaluation-chamber/rex.json'),
        'utf8'
      );
    });

    test('should throw ConfigError if file not found', async () => {
      mockFs.readFile.mockRejectedValueOnce({ code: 'ENOENT' });
      
      await expect(configLoader._loadJsonFile('missing.json'))
        .rejects
        .toThrow(ConfigError);
      
      await expect(configLoader._loadJsonFile('missing.json'))
        .rejects
        .toHaveProperty('errorCode', 'FILE_NOT_FOUND');
    });

    test('should throw ConfigError if JSON parsing fails', async () => {
      mockFs.readFile.mockResolvedValueOnce('invalid-json');
      
      await expect(configLoader._loadJsonFile('invalid.json'))
        .rejects
        .toThrow(ConfigError);
      
      await expect(configLoader._loadJsonFile('invalid.json'))
        .rejects
        .toHaveProperty('errorCode', 'INVALID_JSON');
    });
  });

  // Tests for loadPersona
  describe('loadPersona', () => {
    test('should load a persona configuration', async () => {
      const persona = await configLoader.loadPersona('rex');
      expect(persona).toEqual(validPersona);
    });

    test('should cache persona configuration', async () => {
      // First call - loads from file
      await configLoader.loadPersona('rex');
      
      // Second call - should use cache
      await configLoader.loadPersona('rex');
      
      // mockFs.readFile should be called only once
      expect(mockFs.readFile).toHaveBeenCalledTimes(1);
    });

    test('should throw ConfigError if persona not found', async () => {
      mockFs.access.mockRejectedValue({ code: 'ENOENT' });
      
      await expect(configLoader.loadPersona('nonexistent'))
        .rejects
        .toThrow(ConfigError);
      
      await expect(configLoader.loadPersona('nonexistent'))
        .rejects
        .toHaveProperty('errorCode', 'PERSONA_NOT_FOUND');
    });

    test('should validate persona configuration', async () => {
      // Mock an invalid persona (missing required fields)
      const invalidPersona = { id: 'invalid', name: 'Invalid' };
      mockFs.readFile.mockResolvedValueOnce(JSON.stringify(invalidPersona));
      mockFs.access.mockResolvedValueOnce();
      
      await expect(configLoader.loadPersona('invalid'))
        .rejects
        .toThrow(ConfigError);
      
      await expect(configLoader.loadPersona('invalid'))
        .rejects
        .toHaveProperty('errorCode', 'INVALID_PERSONA_CONFIG');
    });
  });

  // Tests for loadTemplate
  describe('loadTemplate', () => {
    test('should load a template configuration', async () => {
      const template = await configLoader.loadTemplate('evaluation');
      expect(template).toEqual(validTemplate);
    });

    test('should cache template configuration', async () => {
      // First call - loads from file
      await configLoader.loadTemplate('evaluation');
      
      // Second call - should use cache
      await configLoader.loadTemplate('evaluation');
      
      // mockFs.readFile should be called only once
      expect(mockFs.readFile).toHaveBeenCalledTimes(1);
    });

    test('should throw ConfigError if template not found', async () => {
      mockFs.readFile.mockRejectedValueOnce({ code: 'ENOENT' });
      
      await expect(configLoader.loadTemplate('nonexistent'))
        .rejects
        .toThrow(ConfigError);
      
      await expect(configLoader.loadTemplate('nonexistent'))
        .rejects
        .toHaveProperty('errorCode', 'INVALID_PANEL_TYPE');
    });

    test('should validate template configuration', async () => {
      // Mock an invalid template (missing required fields)
      const invalidTemplate = { userPromptPrefix: 'Test' };
      mockFs.readFile.mockResolvedValueOnce(JSON.stringify(invalidTemplate));
      
      await expect(configLoader.loadTemplate('evaluation'))
        .rejects
        .toThrow(ConfigError);
      
      await expect(configLoader.loadTemplate('evaluation'))
        .rejects
        .toHaveProperty('errorCode', 'INVALID_TEMPLATE_CONFIG');
    });
  });

  // Tests for loadSettings
  describe('loadSettings', () => {
    test('should load settings configuration', async () => {
      const settings = await configLoader.loadSettings();
      expect(settings).toEqual(validSettings);
    });

    test('should cache settings configuration', async () => {
      // First call - loads from file
      await configLoader.loadSettings();
      
      // Second call - should use cache
      await configLoader.loadSettings();
      
      // mockFs.readFile should be called only once
      expect(mockFs.readFile).toHaveBeenCalledTimes(1);
    });

    test('should provide default settings if file not found', async () => {
      mockFs.readFile.mockRejectedValueOnce({ code: 'ENOENT' });
      
      const settings = await configLoader.loadSettings();
      expect(settings).toBeDefined();
      expect(settings.apiSettings).toBeDefined();
      expect(settings.userInterface).toBeDefined();
    });

    test('should validate settings configuration', async () => {
      // Mock an invalid settings (missing required sections)
      const invalidSettings = { defaultGator: 'rex' };
      mockFs.readFile.mockResolvedValueOnce(JSON.stringify(invalidSettings));
      
      await expect(configLoader.loadSettings())
        .rejects
        .toThrow(ConfigError);
      
      await expect(configLoader.loadSettings())
        .rejects
        .toHaveProperty('errorCode', 'INVALID_SETTINGS_CONFIG');
    });
  });

  // Tests for getAllPersonaIds
  describe('getAllPersonaIds', () => {
    test('should return all persona IDs by panel type', async () => {
      const personaIds = await configLoader.getAllPersonaIds();
      
      expect(personaIds).toHaveProperty('evaluation');
      expect(personaIds).toHaveProperty('pathfinder');
      expect(personaIds).toHaveProperty('legal');
      
      expect(personaIds.evaluation).toContain('rex');
      expect(personaIds.evaluation).toContain('vanessa');
      expect(personaIds.pathfinder).toContain('zane');
      expect(personaIds.legal).toContain('lex');
    });

    test('should handle missing directories gracefully', async () => {
      // Mock one directory as missing
      mockFs.readdir.mockImplementation((dirPath) => {
        if (dirPath.includes('evaluation-chamber')) {
          return Promise.resolve(['rex.json', 'vanessa.json']);
        }
        return Promise.reject({ code: 'ENOENT' });
      });
      
      const personaIds = await configLoader.getAllPersonaIds();
      
      expect(personaIds).toHaveProperty('evaluation');
      expect(personaIds).toHaveProperty('pathfinder');
      expect(personaIds).toHaveProperty('legal');
      
      expect(personaIds.evaluation).toHaveLength(2);
      expect(personaIds.pathfinder).toHaveLength(0);
      expect(personaIds.legal).toHaveLength(0);
    });
  });

  // Tests for clearCache
  describe('clearCache', () => {
    test('should clear all caches when no parameter provided', async () => {
      // Fill the cache
      await configLoader.loadPersona('rex');
      await configLoader.loadTemplate('evaluation');
      await configLoader.loadSettings();
      
      // Clear the mockFs.readFile mock to track new calls
      jest.clearAllMocks();
      
      // Clear all caches
      configLoader.clearCache();
      
      // Load everything again - should call mockFs.readFile for each
      await configLoader.loadPersona('rex');
      await configLoader.loadTemplate('evaluation');
      await configLoader.loadSettings();
      
      // Should have 3 mockFs.readFile calls
      expect(mockFs.readFile).toHaveBeenCalledTimes(3);
    });

    test('should clear specific cache when parameter provided', async () => {
      // Fill the cache
      await configLoader.loadPersona('rex');
      await configLoader.loadTemplate('evaluation');
      await configLoader.loadSettings();
      
      // Clear the mockFs.readFile mock to track new calls
      jest.clearAllMocks();
      
      // Clear only personas cache
      configLoader.clearCache('personas');
      
      // Load everything again
      await configLoader.loadPersona('rex');
      await configLoader.loadTemplate('evaluation');
      await configLoader.loadSettings();
      
      // Should have only 1 mockFs.readFile call for persona
      expect(mockFs.readFile).toHaveBeenCalledTimes(1);
      expect(mockFs.readFile).toHaveBeenCalledWith(
        expect.stringContaining('rex.json'),
        'utf8'
      );
    });
  });
});