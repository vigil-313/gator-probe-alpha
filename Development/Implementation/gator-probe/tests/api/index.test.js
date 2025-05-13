/**
 * API Module Exports Tests
 * 
 * Tests for the API module exports to ensure:
 * - Public API components are properly exported
 * - Default exports work as expected
 */

import { jest } from '@jest/globals';

// Since mocking is not working reliably, we'll test the raw exports
import * as apiModule from '../../src/api/index.js';
import apiDefaultExport from '../../src/api/index.js';
import { LlmClient } from '../../src/api/client.js';
import { ApiError } from '../../src/api/providers/base.js';
import { ProviderFactory } from '../../src/api/providers/factory.js';

describe('API Module Exports', () => {
  test('should export the correct exports', () => {
    // Check for expected exports
    expect(apiModule).toHaveProperty('llmClient');
    expect(apiModule).toHaveProperty('LlmClient');
    expect(apiModule).toHaveProperty('ApiError');
    expect(apiModule).toHaveProperty('ProviderFactory');
  });
  
  test('should export llmClient as the default export', () => {
    expect(apiDefaultExport).toBe(apiModule.llmClient);
  });
  
  test('should export LlmClient class correctly', () => {
    expect(apiModule.LlmClient).toBe(LlmClient);
    expect(typeof LlmClient).toBe('function');
  });
  
  test('should export ApiError class correctly', () => {
    expect(apiModule.ApiError).toBe(ApiError);
    expect(typeof ApiError).toBe('function');
  });
  
  test('should export ProviderFactory correctly', () => {
    expect(apiModule.ProviderFactory).toBe(ProviderFactory);
  });
});