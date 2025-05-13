/**
 * LLM API Client Tests
 * 
 * Tests for the LLM API client module that is responsible for:
 * - Provider initialization
 * - Response generation
 * - Error handling
 * - Retry mechanism with exponential backoff
 */

import { jest } from '@jest/globals';

// Create mock modules before imports
jest.mock('../../src/config/index.js', () => ({
  configLoader: {
    loadSettings: jest.fn().mockResolvedValue({
      apiSettings: {
        provider: 'claude',
        model: 'test-model',
        apiKey: 'test-api-key',
        apiVersion: '2023-06-01'
      }
    })
  }
}));

jest.mock('../../src/api/providers/factory.js', () => {
  return {
    ProviderFactory: {
      getProvider: jest.fn(() => ({
        generateResponse: jest.fn().mockResolvedValue({
          content: 'Mock response',
          model: 'test-model'
        })
      }))
    },
    __esModule: true
  };
});

jest.mock('../../src/api/providers/base.js', () => {
  const originalModule = jest.requireActual('../../src/api/providers/base.js');
  
  return {
    ...originalModule,
    ApiError: class ApiError extends Error {
      constructor(message, errorCode, details = {}) {
        super(message);
        this.name = 'ApiError';
        this.errorCode = errorCode;
        this.details = details;
      }
    }
  };
});

// Import modules after mocking
import { LlmClient } from '../../src/api/client.js';
import { configLoader } from '../../src/config/index.js';
import { ProviderFactory } from '../../src/api/providers/factory.js';
import { ApiError } from '../../src/api/providers/base.js';

describe('LlmClient', () => {
  let client;
  
  beforeEach(() => {
    jest.clearAllMocks();
    client = new LlmClient();
  });
  
  // Core functionality tests
  
  test('should create a client with default settings', () => {
    expect(client.maxRetries).toBe(3);
    expect(client.retryDelay).toBe(1000);
    expect(client.provider).toBeNull();
  });
  
  test('should generate a response from the provider', async () => {
    // Create a spy for the client's getProvider method to avoid validation issues
    jest.spyOn(client, 'getProvider').mockImplementation(() => ({
      generateResponse: jest.fn().mockResolvedValue({
        content: 'Mock response',
        model: 'test-model'
      })
    }));
    
    const params = {
      systemPrompt: 'You are a helpful assistant',
      userPrompt: 'Hello'
    };
    
    const response = await client.generateResponse(params);
    
    // Verify the expected calls and response
    expect(response).toHaveProperty('content', 'Mock response');
    expect(client.getProvider).toHaveBeenCalled();
  });
  
  // Simplified retry test that doesn't use setTimeout mocking
  test('should retry failed operations', async () => {
    // Create a function that fails once then succeeds
    const operation = jest.fn()
      .mockRejectedValueOnce(new ApiError('Temporary error', 'SERVER_ERROR'))
      .mockResolvedValueOnce('success');
    
    // Override isRetryableError to always return true
    jest.spyOn(client, '_isRetryableError').mockReturnValue(true);
    
    // Use a simple timeout mock
    jest.spyOn(global, 'setTimeout').mockImplementation((callback) => {
      callback();
      return 999;
    });
    
    const result = await client._retryOperation(operation);
    
    expect(operation).toHaveBeenCalledTimes(2);
    expect(result).toBe('success');
  });
  
  // Test error classification
  test('should correctly identify retryable errors', () => {
    const retryableError = new ApiError('Server error', 'SERVER_ERROR');
    expect(client._isRetryableError(retryableError)).toBe(true);
    
    const nonRetryableError = new ApiError('Auth error', 'AUTHENTICATION_ERROR');
    expect(client._isRetryableError(nonRetryableError)).toBe(false);
  });
});