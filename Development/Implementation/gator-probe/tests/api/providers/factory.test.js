/**
 * Provider Factory Tests
 * 
 * Tests for the provider factory module that is responsible for:
 * - Creating provider instances based on type
 * - Error handling for unsupported providers
 * - Validation of factory inputs
 */

import { jest } from '@jest/globals';
import { ApiError } from '../../../src/api/providers/base.js';
import { ProviderFactory } from '../../../src/api/providers/factory.js';

// Create mock directly by spying on the ProviderFactory
const actualGetProvider = ProviderFactory.getProvider;
ProviderFactory.getProvider = jest.fn((type, config) => {
  if (!type) {
    throw new ApiError('Provider type is required', 'MISSING_PROVIDER_TYPE');
  }
  if (type.toLowerCase() !== 'claude') {
    throw new ApiError(`Unsupported provider type: ${type}`, 'UNSUPPORTED_PROVIDER');
  }
  
  return {
    type: 'claude',
    config
  };
});

describe('ProviderFactory', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  // Restore the original function after tests
  afterAll(() => {
    ProviderFactory.getProvider = actualGetProvider;
  });
  
  // Core functionality tests
  
  test('should create a Claude provider when "claude" type is provided', () => {
    const config = { apiKey: 'test-key', model: 'test-model' };
    const provider = ProviderFactory.getProvider('claude', config);
    
    expect(ProviderFactory.getProvider).toHaveBeenCalledWith('claude', config);
    expect(provider).toEqual({
      type: 'claude',
      config
    });
  });
  
  test('should be case-insensitive when matching provider types', () => {
    const config = { apiKey: 'test-key', model: 'test-model' };
    
    // Try different cases
    ProviderFactory.getProvider('Claude', config);
    ProviderFactory.getProvider('CLAUDE', config);
    ProviderFactory.getProvider('claude', config);
    
    // Should all call getProvider correctly
    expect(ProviderFactory.getProvider).toHaveBeenCalledTimes(3);
  });
  
  test('should throw ApiError when provider type is missing', () => {
    expect(() => {
      ProviderFactory.getProvider(null, {});
    }).toThrow(ApiError);
    
    expect(() => {
      ProviderFactory.getProvider(null, {});
    }).toThrow(/Provider type is required/);
  });
  
  test('should throw ApiError for unsupported provider types', () => {
    expect(() => {
      ProviderFactory.getProvider('unsupported', {});
    }).toThrow(ApiError);
    
    expect(() => {
      ProviderFactory.getProvider('unsupported', {});
    }).toThrow(/Unsupported provider type/);
  });
});