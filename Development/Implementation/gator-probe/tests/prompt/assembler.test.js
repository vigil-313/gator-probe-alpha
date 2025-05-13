/**
 * Prompt Assembly Module Tests
 * 
 * Tests for the prompt assembly module that is responsible for:
 * - Processing templates with variable replacement
 * - Combining persona configurations and user input
 * - Handling nested object access in templates
 * - Supporting arrays and complex data structures
 */

import { jest } from '@jest/globals';
import path from 'path';

// Create mock configuration loader
const mockConfigLoader = {
  loadPersona: jest.fn(),
  loadTemplate: jest.fn(),
  loadSettings: jest.fn(),
  getAllPersonaIds: jest.fn(),
  _determinePanelType: jest.fn()
};

// Mock the ConfigLoader module
jest.mock('../../src/config/index.js', () => {
  // Create a mock class
  class MockConfigLoader {
    constructor() {
      this.test = 'test';
    }
  }
  
  // Create a singleton instance
  const mockDefaultConfigLoader = new MockConfigLoader();
  
  return {
    configLoader: mockDefaultConfigLoader,
    ConfigLoader: MockConfigLoader,
    ConfigError: jest.fn()
  };
});

// Import the module to test
import { PromptAssembler, PromptError } from '../../src/prompt/assembler.js';
// Import the mocked config module
import { configLoader as mockDefaultConfigLoader } from '../../src/config/index.js';

describe('PromptAssembler', () => {
  let promptAssembler;
  
  // Mock test data
  const mockPersona = {
    id: 'rex',
    name: 'Rex Revenue',
    nickname: 'The Roaster',
    archetype: 'Seasoned Angel Investor/Shark',
    expertiseAreas: [
      'Business model evaluation',
      'Revenue strategy',
      'Founder assessment'
    ],
    critiqueStyle: 'No-nonsense, rapid-fire challenges',
    tone: 'Short, punchy sentences.',
    visualAppearance: {
      physicalDescription: 'Muscular crocodile with dark green scales',
      attire: 'Half-unbuttoned tropical business shirt, gold watch',
      expressions: 'Animated expressions that shift quickly'
    },
    strengths: [
      'Cut-through-the-hype mentality',
      'Quick identification of fundamental flaws'
    ],
    weaknesses: [
      'Can be too dismissive of early-stage ideas'
    ],
    catchphrase: "That will never work because...",
    responsePatterns: {
      introFormats: [
        'Look, I will be blunt.',
        'Here is the problem with this.',
        'Let me cut to the chase.'
      ],
      vocabularyPreferences: {
        favoredTerms: ['revenue', 'margins', 'bottom line'],
        avoidedTerms: ['hopefully', 'potentially', 'might']
      },
      sentenceStructure: 'Short, direct statements.'
    },
    evaluationFocus: {
      primaryConcerns: [
        'Revenue model',
        'Market readiness',
        'Founder capability'
      ],
      redFlags: [
        'No clear revenue model',
        'Unrealistic market size claims'
      ]
    }
  };

  const mockTemplate = {
    systemPromptStructure: [
      {
        section: 'roleDefinition',
        template: 'You are {{name}}, also known as "{{nickname}}", {{archetype}}.'
      },
      {
        section: 'expertiseIntroduction',
        template: 'Your expertise includes: {{#expertiseAreas}}\n- {{.}}{{/expertiseAreas}}'
      },
      {
        section: 'responseGuidelines',
        template: 'Respond with the following characteristics:\n- Critique Style: {{critiqueStyle}}\n- Tone: {{tone}}\n- Use your catchphrase: "{{catchphrase}}"'
      },
      {
        section: 'evaluationInstructions',
        template: 'When analyzing the pitch, focus primarily on: {{#evaluationFocus.primaryConcerns}}\n- {{.}}{{/evaluationFocus.primaryConcerns}}'
      }
    ],
    userPromptPrefix: 'Evaluate this startup idea: ',
    contextVariables: {
      pitchType: 'startup idea',
      evaluationContext: 'initial pitch'
    }
  };

  const mockSettings = {
    defaultGator: 'rex',
    apiSettings: {
      provider: 'claude',
      model: 'claude-3-sonnet-20240229'
    },
    promptSettings: {
      includeVisualDescription: true,
      systemPromptTemplate: 'config/prompt-templates/evaluation.json'
    }
  };

  const mockAllPersonaIds = {
    evaluation: ['rex', 'vanessa', 'finley'],
    pathfinder: ['zane', 'luma', 'bram'],
    legal: ['lex', 'clara', 'rana']
  };

  // Set up the test environment
  beforeEach(() => {
    // Clear all mocks
    jest.clearAllMocks();
    
    // Create a new PromptAssembler instance with the mock config loader
    promptAssembler = new PromptAssembler(mockConfigLoader);
    
    // Configure the mock config loader
    mockConfigLoader.loadPersona.mockResolvedValue(mockPersona);
    mockConfigLoader.loadTemplate.mockResolvedValue(mockTemplate);
    mockConfigLoader.loadSettings.mockResolvedValue(mockSettings);
    mockConfigLoader.getAllPersonaIds.mockResolvedValue(mockAllPersonaIds);
  });

  // Tests for constructor
  describe('constructor', () => {
    test('should create a PromptAssembler instance with the provided config loader', () => {
      expect(promptAssembler.configLoader).toBe(mockConfigLoader);
    });

    test('should use the default config loader if none is provided', () => {
      // Create a new PromptAssembler without passing a config loader
      const defaultPromptAssembler = new PromptAssembler();
      
      // It should use the default config loader imported from the mocked module
      expect(defaultPromptAssembler.configLoader).toBe(mockDefaultConfigLoader);
    });
  });

  // Tests for assemblePrompt
  describe('assemblePrompt', () => {
    test('should assemble a complete prompt with persona details and user input', async () => {
      const userInput = 'A subscription service for plant care';
      const result = await promptAssembler.assemblePrompt('rex', userInput);
      
      // Verify the config loader was called with the right parameters
      expect(mockConfigLoader.loadPersona).toHaveBeenCalledWith('rex');
      expect(mockConfigLoader.loadTemplate).toHaveBeenCalled();
      
      // Check result structure and content
      expect(result).toHaveProperty('systemPrompt');
      expect(result).toHaveProperty('userPrompt');
      expect(result.userPrompt).toBe('Evaluate this startup idea: A subscription service for plant care');
      expect(result.systemPrompt).toContain('Rex Revenue');
      expect(result.systemPrompt).toContain('The Roaster');
    });

    test('should use the provided panel type if specified', async () => {
      await promptAssembler.assemblePrompt('rex', 'Test input', 'pathfinder');
      
      // Should load the template for the specified panel type
      expect(mockConfigLoader.loadTemplate).toHaveBeenCalledWith('pathfinder');
    });

    test('should throw PromptError if personaId is missing', async () => {
      await expect(promptAssembler.assemblePrompt(null, 'Test input'))
        .rejects
        .toThrow(PromptError);
      
      await expect(promptAssembler.assemblePrompt(null, 'Test input'))
        .rejects
        .toHaveProperty('errorCode', 'MISSING_PERSONA_ID');
    });

    test('should throw PromptError if userInput is missing', async () => {
      await expect(promptAssembler.assemblePrompt('rex', null))
        .rejects
        .toThrow(PromptError);
      
      await expect(promptAssembler.assemblePrompt('rex', null))
        .rejects
        .toHaveProperty('errorCode', 'MISSING_USER_INPUT');
    });

    test('should properly sanitize user input', async () => {
      const userInput = 'A service with {{template}} markers';
      const result = await promptAssembler.assemblePrompt('rex', userInput);
      
      // The user input should be sanitized to prevent template injection
      expect(result.userPrompt).toBe('Evaluate this startup idea: A service with { {template} } markers');
    });

    test('should handle errors from the config loader', async () => {
      // Mock a failure in loadPersona that rejects with the expected error
      mockConfigLoader.loadPersona.mockRejectedValueOnce(new Error('Persona not found'));
      
      await expect(promptAssembler.assemblePrompt('nonexistent', 'Test input'))
        .rejects
        .toThrow(PromptError);
    });
  });

  // Tests for _processTemplate (private method)
  describe('_processTemplate', () => {
    test('should replace simple variables in the template', () => {
      const template = 'Hello {{name}}!';
      const result = promptAssembler._processTemplate(template, mockPersona);
      
      expect(result).toBe('Hello Rex Revenue!');
    });

    test('should handle missing template', () => {
      expect(() => promptAssembler._processTemplate(null, mockPersona))
        .toThrow(PromptError);
      
      expect(() => promptAssembler._processTemplate(null, mockPersona))
        .toThrow('Template string is required');
    });

    test('should handle missing persona', () => {
      expect(() => promptAssembler._processTemplate('Hello {{name}}!', null))
        .toThrow(PromptError);
      
      expect(() => promptAssembler._processTemplate('Hello {{name}}!', null))
        .toThrow('Persona configuration is required');
    });

    test('should throw PromptError if variable not found', () => {
      const template = 'Value: {{nonexistent}}';
      
      expect(() => promptAssembler._processTemplate(template, mockPersona))
        .toThrow(PromptError);
    });
  });

  // Tests for template variable replacement
  describe('_replaceVariables', () => {
    test('should replace simple variables', () => {
      const template = 'Name: {{name}}, Catchphrase: {{catchphrase}}';
      const result = promptAssembler._replaceVariables(template, mockPersona);
      
      expect(result).toBe('Name: Rex Revenue, Catchphrase: That will never work because...');
    });

    test('should access nested object properties', () => {
      const template = 'Description: {{visualAppearance.physicalDescription}}';
      const result = promptAssembler._replaceVariables(template, mockPersona);
      
      expect(result).toBe('Description: Muscular crocodile with dark green scales');
    });

    test('should handle string formatting for arrays', () => {
      const template = 'Strengths: {{strengths}}';
      const result = promptAssembler._replaceVariables(template, mockPersona);
      
      expect(result).toContain('Cut-through-the-hype mentality');
      expect(result).toContain('Quick identification of fundamental flaws');
    });

    test('should handle undefined or null values', () => {
      const persona = { ...mockPersona, description: null };
      const template = 'Description: {{description}}';
      
      const result = promptAssembler._replaceVariables(template, persona);
      expect(result).toBe('Description: ');
    });
  });

  // Tests for array iteration
  describe('_processArrayIterations', () => {
    test('should process array iterations with {{#array}} syntax', () => {
      const template = 'Areas: {{#expertiseAreas}}\n- {{.}}{{/expertiseAreas}}';
      const result = promptAssembler._processArrayIterations(template, mockPersona);
      
      expect(result).toContain('- Business model evaluation');
      expect(result).toContain('- Revenue strategy');
      expect(result).toContain('- Founder assessment');
    });

    test('should throw error for non-existent arrays', () => {
      const template = '{{#nonExistentArray}}\n- {{.}}{{/nonExistentArray}}';
      
      // Customize how promptAssembler._processArrayIterations behaves for this test
      // by creating a version of PromptError that can be more easily tested
      const originalMethod = promptAssembler._getNestedProperty;
      promptAssembler._getNestedProperty = jest.fn().mockImplementation((obj, path) => {
        if (path === 'nonExistentArray') {
          return undefined;
        }
        return originalMethod.call(promptAssembler, obj, path);
      });
      
      expect(() => promptAssembler._processArrayIterations(template, mockPersona))
        .toThrow(PromptError);
      
      // Restore the original method
      promptAssembler._getNestedProperty = originalMethod;
    });

    test('should throw error for non-array properties', () => {
      const template = '{{#name}}\n- {{.}}{{/name}}';
      
      expect(() => promptAssembler._processArrayIterations(template, mockPersona))
        .toThrow(PromptError);
    });

    test('should handle nested properties in array iterations', () => {
      const template = '{{#evaluationFocus.primaryConcerns}}\n- Focus: {{.}}{{/evaluationFocus.primaryConcerns}}';
      const result = promptAssembler._processArrayIterations(template, mockPersona);
      
      expect(result).toContain('- Focus: Revenue model');
      expect(result).toContain('- Focus: Market readiness');
      expect(result).toContain('- Focus: Founder capability');
    });
  });

  // Tests for _getNestedProperty
  describe('_getNestedProperty', () => {
    test('should access top-level properties', () => {
      const result = promptAssembler._getNestedProperty(mockPersona, 'name');
      expect(result).toBe('Rex Revenue');
    });

    test('should access nested properties using dot notation', () => {
      const result = promptAssembler._getNestedProperty(mockPersona, 'visualAppearance.attire');
      expect(result).toBe('Half-unbuttoned tropical business shirt, gold watch');
    });

    test('should handle deep nesting', () => {
      const result = promptAssembler._getNestedProperty(mockPersona, 'responsePatterns.vocabularyPreferences.favoredTerms');
      expect(result).toEqual(['revenue', 'margins', 'bottom line']);
    });

    test('should return undefined for non-existent properties', () => {
      const result = promptAssembler._getNestedProperty(mockPersona, 'nonexistent.property');
      expect(result).toBeUndefined();
    });

    test('should handle the special "." path', () => {
      const result = promptAssembler._getNestedProperty('test value', '.');
      expect(result).toBe('test value');
    });
  });

  // Tests for _formatValue
  describe('_formatValue', () => {
    test('should convert arrays to comma-separated strings', () => {
      const result = promptAssembler._formatValue(['one', 'two', 'three']);
      expect(result).toBe('one, two, three');
    });

    test('should convert objects to JSON strings', () => {
      const obj = { key: 'value', nested: { prop: 'test' } };
      const result = promptAssembler._formatValue(obj);
      expect(result).toBe(JSON.stringify(obj));
    });

    test('should convert primitive values to strings', () => {
      expect(promptAssembler._formatValue(123)).toBe('123');
      expect(promptAssembler._formatValue(true)).toBe('true');
      expect(promptAssembler._formatValue('string')).toBe('string');
    });

    test('should handle null and undefined values', () => {
      expect(promptAssembler._formatValue(null)).toBe('');
      expect(promptAssembler._formatValue(undefined)).toBe('');
    });
  });

  // Tests for _inferPanelType
  describe('_inferPanelType', () => {
    test('should infer panel type based on persona ID', async () => {
      const result = await promptAssembler._inferPanelType('rex');
      expect(result).toBe('evaluation');
    });

    test('should infer different panel types based on persona ID', async () => {
      let result = await promptAssembler._inferPanelType('zane');
      expect(result).toBe('pathfinder');

      result = await promptAssembler._inferPanelType('lex');
      expect(result).toBe('legal');
    });

    test('should default to "evaluation" if panel type cannot be determined', async () => {
      // Mock getAllPersonaIds to return empty arrays
      mockConfigLoader.getAllPersonaIds.mockResolvedValueOnce({
        evaluation: [],
        pathfinder: [],
        legal: []
      });
      
      const result = await promptAssembler._inferPanelType('unknown');
      expect(result).toBe('evaluation');
    });

    test('should use settings to determine default panel type if available', async () => {
      // Mock settings with a template path containing "pathfinder"
      mockConfigLoader.loadSettings.mockResolvedValueOnce({
        promptSettings: {
          systemPromptTemplate: 'config/prompt-templates/pathfinder.json'
        }
      });
      
      // Mock getAllPersonaIds to return empty arrays
      mockConfigLoader.getAllPersonaIds.mockResolvedValueOnce({
        evaluation: [],
        pathfinder: [],
        legal: []
      });
      
      const result = await promptAssembler._inferPanelType('unknown');
      expect(result).toBe('pathfinder');
    });

    test('should handle errors during panel type inference', async () => {
      // Set up the mock to reject for the first call, which is the one we'll test
      mockConfigLoader.getAllPersonaIds.mockRejectedValueOnce(new Error('Failed to get personas'));
      
      try {
        await promptAssembler._inferPanelType('unknown');
        // If we reached this point, the function did not throw as expected
        fail('Expected _inferPanelType to throw an error but it did not');
      } catch (error) {
        expect(error).toBeInstanceOf(PromptError);
        expect(error.errorCode).toBe('PANEL_TYPE_INFERENCE_ERROR');
      }
    });
  });

  // Tests for _sanitizeUserInput
  describe('_sanitizeUserInput', () => {
    test('should sanitize template markers', () => {
      const result = promptAssembler._sanitizeUserInput('Input with {{template}} markers');
      expect(result).toBe('Input with { {template} } markers');
    });

    test('should handle null or undefined input', () => {
      expect(promptAssembler._sanitizeUserInput(null)).toBe('');
      expect(promptAssembler._sanitizeUserInput(undefined)).toBe('');
    });

    test('should convert non-string input to string', () => {
      expect(promptAssembler._sanitizeUserInput(123)).toBe('123');
      expect(promptAssembler._formatValue(true)).toBe('true');
    });

    test('should trim input', () => {
      expect(promptAssembler._sanitizeUserInput('  trimmed  ')).toBe('trimmed');
    });
  });

  // Edge cases
  describe('Edge cases', () => {
    test('should handle minimal valid input', async () => {
      // Create minimal persona and template
      const minimalPersona = { id: 'min', name: 'Minimal' };
      const minimalTemplate = { 
        systemPromptStructure: [{ section: 'basic', template: 'Name: {{name}}' }],
        userPromptPrefix: 'Input: '
      };
      
      // Reset the mock to return our minimal test data
      mockConfigLoader.loadPersona.mockReset();
      mockConfigLoader.loadTemplate.mockReset();
      
      mockConfigLoader.loadPersona.mockResolvedValue(minimalPersona);
      mockConfigLoader.loadTemplate.mockResolvedValue(minimalTemplate);
      
      const result = await promptAssembler.assemblePrompt('min', 'test');
      
      expect(result.systemPrompt).toBe('Name: Minimal');
      expect(result.userPrompt).toBe('Input: test');
    });

    test('should handle templates with special characters', () => {
      const template = 'Special {{name}} with $!@#%^&*()_+';
      const result = promptAssembler._processTemplate(template, mockPersona);
      
      expect(result).toBe('Special Rex Revenue with $!@#%^&*()_+');
    });

    test('should handle complex nested structures', () => {
      const complexPersona = {
        deep: {
          nested: {
            structure: {
              value: 'found it!'
            }
          }
        }
      };
      
      const template = 'Deep value: {{deep.nested.structure.value}}';
      const result = promptAssembler._replaceVariables(template, complexPersona);
      
      expect(result).toBe('Deep value: found it!');
    });
  });
});