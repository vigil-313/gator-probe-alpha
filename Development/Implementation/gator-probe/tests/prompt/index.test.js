/**
 * Prompt Assembly Module Index Tests
 * 
 * Tests that the prompt module exports the expected objects and functions
 */

import { jest } from '@jest/globals';

// Mock the config loader
jest.mock('../../src/config/index.js', () => {
  return {
    configLoader: {},
    ConfigLoader: jest.fn()
  };
});

// Mock the assembler module
jest.mock('../../src/prompt/assembler.js', () => {
  class MockPromptAssembler {
    constructor(configLoader) {
      this.configLoader = configLoader;
    }
  }
  
  class MockPromptError extends Error {
    constructor(message, errorCode, details) {
      super(message);
      this.errorCode = errorCode;
      this.details = details;
    }
  }
  
  return {
    __esModule: true,
    default: MockPromptAssembler,
    PromptAssembler: MockPromptAssembler,
    PromptError: MockPromptError
  };
});

describe('Prompt Module Index', () => {
  test('should export a default promptAssembler instance', async () => {
    const promptModule = await import('../../src/prompt/index.js');
    
    expect(promptModule.default).toBeDefined();
    expect(typeof promptModule.default).toBe('object');
  });
  
  test('should export the PromptAssembler class', async () => {
    const promptModule = await import('../../src/prompt/index.js');
    
    expect(promptModule.PromptAssemblerClass).toBeDefined();
    expect(typeof promptModule.PromptAssemblerClass).toBe('function');
  });
  
  test('should export the PromptError class', async () => {
    const promptModule = await import('../../src/prompt/index.js');
    
    expect(promptModule.PromptError).toBeDefined();
    expect(typeof promptModule.PromptError).toBe('function');
  });
  
  test('should export the promptAssembler singleton', async () => {
    const promptModule = await import('../../src/prompt/index.js');
    
    expect(promptModule.promptAssembler).toBeDefined();
    expect(typeof promptModule.promptAssembler).toBe('object');
    expect(promptModule.promptAssembler).toBe(promptModule.default);
  });
});