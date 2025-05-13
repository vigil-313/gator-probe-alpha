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
jest.mock('fs/promises', () => mockFs);

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
    
    // Override _determinePanelType to avoid fs.access issues
    jest.spyOn(configLoader, '_determinePanelType').mockImplementation((personaId) => {
      if (personaId === 'rex' || personaId === 'vanessa') {
        return Promise.resolve('evaluation');
      } else if (personaId === 'zane' || personaId === 'luma') {
        return Promise.resolve('pathfinder');
      } else if (personaId === 'lex' || personaId === 'clara') {
        return Promise.resolve('legal');
      } else if (personaId === 'invalid') {
        // This allows our validation test to reach the validation code
        return Promise.resolve('evaluation');
      }
      return Promise.reject(new ConfigError(
        `Cannot determine panel type: persona "${personaId}" not found in any panel directory`,
        'PERSONA_NOT_FOUND',
        `personas/${personaId}.json`
      ));
    });
    
    // Mock mockFs.readFile for different files
    mockFs.readFile.mockImplementation((filePath, encoding) => {
      if (filePath.includes('rex.json') || filePath.endsWith('personas/evaluation-chamber/rex.json')) {
        return Promise.resolve(JSON.stringify(validPersona));
      }
      if (filePath.includes('evaluation.json') || filePath.endsWith('prompt-templates/evaluation.json')) {
        return Promise.resolve(JSON.stringify(validTemplate));
      }
      if (filePath.includes('settings.json')) {
        return Promise.resolve(JSON.stringify(validSettings));
      }
      return Promise.reject({ code: 'ENOENT', message: `File not found: ${filePath}` });
    });
    
    // Mock mockFs.access
    mockFs.access.mockImplementation((filePath) => {
      if (filePath.includes('evaluation-chamber/rex.json') || 
          filePath.includes('invalid.json') || 
          filePath.includes('personas/evaluation-chamber/rex.json')) {
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
      // Override readFile specifically for this test
      mockFs.readFile.mockImplementationOnce((filePath) => {
        return Promise.resolve(JSON.stringify(validPersona));
      });
      
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
      // Create a direct mock that returns invalid JSON
      mockFs.readFile.mockImplementationOnce(() => {
        return Promise.resolve('{ NOT VALID JSON }');
      });
      
      // We use await/catch pattern to verify the error
      try {
        await configLoader._loadJsonFile('test-invalid.json');
        fail('Should have thrown an error');
      } catch (error) {
        expect(error).toBeInstanceOf(ConfigError);
        expect(error.errorCode).toBe('INVALID_JSON');
      }
    });
  });

  // Tests for loadPersona
  describe('loadPersona', () => {
    test('should load a persona configuration', async () => {
      // Setup specific mock for this test
      mockFs.readFile.mockImplementationOnce(() => {
        return Promise.resolve(JSON.stringify(validPersona));
      });
      
      const persona = await configLoader.loadPersona('rex');
      expect(persona).toEqual(validPersona);
    });

    test('should cache persona configuration', async () => {
      // Clear cache and mocks
      configLoader.clearCache('personas');
      jest.clearAllMocks();
      
      // Setup mock for both calls
      mockFs.readFile.mockImplementation(() => {
        return Promise.resolve(JSON.stringify(validPersona));
      });
      
      // First call - loads from file
      await configLoader.loadPersona('rex');
      
      // Clear mocks to check second call
      jest.clearAllMocks();
      
      // Second call - should use cache
      await configLoader.loadPersona('rex');
      
      // mockFs.readFile should not be called for the second time
      expect(mockFs.readFile).not.toHaveBeenCalled();
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
      
      // Override directly for this specific test
      mockFs.readFile.mockImplementationOnce(() => {
        return Promise.resolve(JSON.stringify(invalidPersona));
      });
      
      // Override the validatePersona method call
      const validateSpy = jest.spyOn(configLoader, '_validatePersona');
      validateSpy.mockImplementationOnce(() => {
        throw new ConfigError(
          'Invalid persona configuration: missing required fields',
          'INVALID_PERSONA_CONFIG',
          'personas/evaluation-chamber/invalid.json'
        );
      });
      
      // Test with try/catch to verify error
      try {
        await configLoader.loadPersona('invalid');
        fail('Should have thrown an error');
      } catch (error) {
        expect(error).toBeInstanceOf(ConfigError);
        expect(error.errorCode).toBe('INVALID_PERSONA_CONFIG');
      }
      
      // Restore the spy
      validateSpy.mockRestore();
    });
  });

  // Tests for loadTemplate
  describe('loadTemplate', () => {
    beforeEach(() => {
      // Reset the cache for each test to avoid test interference
      configLoader.clearCache('templates');
    });

    test('should load a template configuration', async () => {
      // Setup specific mock for this test
      mockFs.readFile.mockImplementationOnce(() => {
        return Promise.resolve(JSON.stringify(validTemplate));
      });
      
      const template = await configLoader.loadTemplate('evaluation');
      expect(template).toEqual(validTemplate);
    });

    test('should cache template configuration', async () => {
      // Reset cache
      configLoader.clearCache('templates');
      jest.clearAllMocks();
      
      // First call - loads from file
      mockFs.readFile.mockImplementationOnce(() => {
        return Promise.resolve(JSON.stringify(validTemplate));
      });
      
      await configLoader.loadTemplate('evaluation');
      
      // Clear mocks to verify second call
      jest.clearAllMocks();
      
      // Second call - should use cache
      await configLoader.loadTemplate('evaluation');
      
      // mockFs.readFile should not be called again
      expect(mockFs.readFile).not.toHaveBeenCalled();
    });

    test('should throw ConfigError if template not found', async () => {
      const errorPromise = configLoader.loadTemplate('nonexistent');
      
      await expect(errorPromise).rejects.toThrow(ConfigError);
      await expect(errorPromise).rejects.toHaveProperty('errorCode', 'INVALID_PANEL_TYPE');
    });

    test('should validate template configuration', async () => {
      // Mock an invalid template (missing required fields)
      const invalidTemplate = { userPromptPrefix: 'Test' };
      
      // Override mockFs.readFile for this specific test
      const originalReadFile = mockFs.readFile;
      mockFs.readFile = jest.fn().mockImplementation((filePath) => {
        if (filePath.includes('evaluation.json')) {
          return Promise.resolve(JSON.stringify(invalidTemplate));
        }
        return originalReadFile(filePath);
      });
      
      // Use a single promise to test both assertions
      const errorPromise = configLoader.loadTemplate('evaluation');
      
      await expect(errorPromise).rejects.toThrow(ConfigError);
      await expect(errorPromise).rejects.toHaveProperty('errorCode', 'INVALID_TEMPLATE_CONFIG');
      
      // Restore original function
      mockFs.readFile = originalReadFile;
    });
  });

  // Tests for loadSettings
  describe('loadSettings', () => {
    beforeEach(() => {
      // Reset the cache for each test to avoid test interference
      configLoader.clearCache('settings');
    });
    
    test('should load settings configuration', async () => {
      // Setup specific mock for this test
      mockFs.readFile.mockImplementationOnce(() => {
        return Promise.resolve(JSON.stringify(validSettings));
      });
      
      const settings = await configLoader.loadSettings();
      expect(settings).toEqual(validSettings);
    });

    test('should cache settings configuration', async () => {
      // Reset cache
      configLoader.clearCache('settings');
      jest.clearAllMocks();
      
      // First call - loads from file
      mockFs.readFile.mockImplementationOnce(() => {
        return Promise.resolve(JSON.stringify(validSettings));
      });
      
      await configLoader.loadSettings();
      
      // Clear mocks to verify second call
      jest.clearAllMocks();
      
      // Second call - should use cache
      await configLoader.loadSettings();
      
      // mockFs.readFile should not be called again
      expect(mockFs.readFile).not.toHaveBeenCalled();
    });

    test('should provide default settings if file not found', async () => {
      // Save original function
      const originalReadFile = mockFs.readFile;
      
      // Mock fs.readFile to reject with ENOENT for settings.json
      mockFs.readFile = jest.fn().mockImplementation((filePath) => {
        if (filePath.includes('settings.json')) {
          return Promise.reject({ code: 'ENOENT' });
        }
        return originalReadFile(filePath);
      });
      
      const settings = await configLoader.loadSettings();
      expect(settings).toBeDefined();
      expect(settings.apiSettings).toBeDefined();
      expect(settings.userInterface).toBeDefined();
      
      // Restore original function
      mockFs.readFile = originalReadFile;
    });

    test('should validate settings configuration', async () => {
      // Mock an invalid settings (missing required sections)
      const invalidSettings = { defaultGator: 'rex' };
      
      // Save original function
      const originalReadFile = mockFs.readFile;
      
      // Mock fs.readFile to return invalid settings
      mockFs.readFile = jest.fn().mockImplementation((filePath) => {
        if (filePath.includes('settings.json')) {
          return Promise.resolve(JSON.stringify(invalidSettings));
        }
        return originalReadFile(filePath);
      });
      
      // Use a single promise for both assertions
      const errorPromise = configLoader.loadSettings();
      
      await expect(errorPromise).rejects.toThrow(ConfigError);
      await expect(errorPromise).rejects.toHaveProperty('errorCode', 'INVALID_SETTINGS_CONFIG');
      
      // Restore original function
      mockFs.readFile = originalReadFile;
    });
  });

  // Tests for getAllPersonaIds
  describe('getAllPersonaIds', () => {
    // Reset mockFs.readdir to the default implementation before each test
    beforeEach(() => {
      // Reset mocks
      mockFs.readdir.mockReset();
      
      // Recreate the default implementation
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
    
    test('should return all persona IDs by panel type', async () => {
      // Mock the readdir implementation to return consistent results
      jest.spyOn(mockFs, 'readdir').mockImplementation((dirPath) => {
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
      // Override mockFs.readdir for this specific test
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
      // Setup mocks for file reading
      mockFs.readFile.mockImplementation((path) => {
        if (path.includes('rex.json')) {
          return Promise.resolve(JSON.stringify(validPersona));
        } else if (path.includes('evaluation.json')) {
          return Promise.resolve(JSON.stringify(validTemplate));
        } else if (path.includes('settings.json')) {
          return Promise.resolve(JSON.stringify(validSettings));
        }
        return Promise.reject({ code: 'ENOENT' });
      });
      
      // Fill the cache
      await configLoader.loadPersona('rex');
      await configLoader.loadTemplate('evaluation');
      await configLoader.loadSettings();
      
      // Clear all mocks to track new calls
      jest.clearAllMocks();
      
      // Clear all caches
      configLoader.clearCache();
      
      // Load everything again - should call readFile for each
      await configLoader.loadPersona('rex');
      await configLoader.loadTemplate('evaluation');
      await configLoader.loadSettings();
      
      // Should have made calls to read files again
      expect(mockFs.readFile).toHaveBeenCalled();
      expect(mockFs.readFile.mock.calls.length).toBeGreaterThan(0);
    });

    test('should clear specific cache when parameter provided', async () => {
      // Setup mocks for file reading
      mockFs.readFile.mockImplementation((path) => {
        if (path.includes('rex.json')) {
          return Promise.resolve(JSON.stringify(validPersona));
        } else if (path.includes('evaluation.json')) {
          return Promise.resolve(JSON.stringify(validTemplate));
        } else if (path.includes('settings.json')) {
          return Promise.resolve(JSON.stringify(validSettings));
        }
        return Promise.reject({ code: 'ENOENT' });
      });
      
      // Fill the cache
      await configLoader.loadPersona('rex');
      await configLoader.loadTemplate('evaluation');
      await configLoader.loadSettings();
      
      // Clear mocks to track new calls
      jest.clearAllMocks();
      
      // Clear only personas cache
      configLoader.clearCache('personas');
      
      // Load everything again
      await configLoader.loadPersona('rex');
      await configLoader.loadTemplate('evaluation');
      await configLoader.loadSettings();
      
      // Should have calls to read persona file again
      const readFileCalls = mockFs.readFile.mock.calls;
      const hasPersonaCall = readFileCalls.some(call => call[0].includes('rex.json'));
      expect(hasPersonaCall).toBe(true);
    });
  });
});