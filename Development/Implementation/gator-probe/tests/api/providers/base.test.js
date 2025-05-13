/**
 * Base Provider and ApiError Tests
 * 
 * Tests for the base provider abstract class and ApiError class that:
 * - Verify ApiError functionality
 * - Ensure BaseProvider behaves as expected
 * - Validate the provider interface
 */

import { jest } from '@jest/globals';
import { BaseProvider, ApiError } from '../../../src/api/providers/base.js';

describe('ApiError', () => {
  test('should create an ApiError with the provided parameters', () => {
    const message = 'Test error message';
    const errorCode = 'TEST_ERROR';
    const details = { foo: 'bar' };
    
    const error = new ApiError(message, errorCode, details);
    
    expect(error).toBeInstanceOf(Error);
    expect(error.name).toBe('ApiError');
    expect(error.message).toBe(message);
    expect(error.errorCode).toBe(errorCode);
    expect(error.details).toEqual(details);
  });
  
  test('should create an ApiError with default empty details if not provided', () => {
    const error = new ApiError('Message', 'CODE');
    
    expect(error.details).toEqual({});
  });
});

describe('BaseProvider', () => {
  // Create a concrete subclass for testing
  class ConcreteProvider extends BaseProvider {
    async generateResponse(params) {
      return { result: 'Test response' };
    }
  }
  
  test('should not allow direct instantiation of BaseProvider', () => {
    expect(() => {
      new BaseProvider();
    }).toThrow(/BaseProvider is an abstract class/);
  });
  
  test('should allow instantiation of a concrete subclass', () => {
    const provider = new ConcreteProvider({ model: 'test-model' });
    expect(provider).toBeInstanceOf(BaseProvider);
  });
  
  test('should store config in the instance', () => {
    const config = { apiKey: 'test-key', model: 'test-model' };
    const provider = new ConcreteProvider(config);
    
    expect(provider.config).toBe(config);
  });
  
  test('should initialize with empty config if none provided', () => {
    const provider = new ConcreteProvider();
    
    expect(provider.config).toEqual({});
  });
  
  test('should require subclasses to implement generateResponse', () => {
    // Mock an implementation that just calls the parent method
    class MockBaseProvider extends BaseProvider {
      async generateResponse(params) {
        // Call the parent method to trigger the error
        return super.generateResponse(params);
      }
    }
    
    const provider = new MockBaseProvider({ model: 'test-model' });
    
    return expect(provider.generateResponse()).rejects.toThrow(/must be implemented by subclass/);
  });
  
  test('should allow subclasses to override generateResponse', async () => {
    const provider = new ConcreteProvider({ model: 'test-model' });
    const result = await provider.generateResponse();
    
    expect(result).toEqual({ result: 'Test response' });
  });
  
  describe('validateConfig', () => {
    test('should validate a non-empty config', () => {
      const provider = new ConcreteProvider({ apiKey: 'test-key', model: 'test-model' });
      expect(provider.validateConfig()).toBe(true);
    });
    
    test('should throw ApiError if config is missing', () => {
      const provider = new ConcreteProvider();
      provider.config = null;
      
      expect(() => {
        provider.validateConfig();
      }).toThrow(ApiError);
      
      expect(() => {
        provider.validateConfig();
      }).toThrow(/Provider configuration is required/);
      
      expect(() => {
        provider.validateConfig();
      }).toThrow(expect.objectContaining({ 
        errorCode: 'MISSING_CONFIG' 
      }));
    });
  });
});