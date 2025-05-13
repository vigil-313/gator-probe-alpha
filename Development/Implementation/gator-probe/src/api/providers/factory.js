/**
 * Provider Factory
 * 
 * Factory class that creates appropriate provider instances
 * based on the provided configuration.
 */

import { ApiError } from './base.js';
import ClaudeProvider from './claude.js';

/**
 * Provider Factory Class
 * Creates and returns the appropriate provider based on configuration
 */
export class ProviderFactory {
  /**
   * Get a provider instance based on the configuration
   * @param {string} providerType - Type of provider to create
   * @param {Object} config - Configuration for the provider
   * @returns {BaseProvider} An instance of the appropriate provider
   * @throws {ApiError} If the provider type is unsupported
   */
  static getProvider(providerType, config) {
    if (!providerType) {
      throw new ApiError(
        'Provider type is required',
        'MISSING_PROVIDER_TYPE'
      );
    }
    
    // Convert provider type to lowercase for case-insensitive matching
    const type = providerType.toLowerCase();
    
    // Map of supported provider types to their constructors
    const providers = {
      'claude': ClaudeProvider,
      
      // Future providers can be added here:
      // 'gpt': GptProvider,
      // 'llama': LlamaProvider,
      // etc.
    };
    
    // Check if the provider type is supported
    if (!providers[type]) {
      throw new ApiError(
        `Unsupported provider type: ${providerType}`,
        'UNSUPPORTED_PROVIDER',
        { supportedProviders: Object.keys(providers) }
      );
    }
    
    // Create and return a new instance of the appropriate provider
    try {
      return new providers[type](config);
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      
      throw new ApiError(
        `Error creating provider: ${error.message}`,
        'PROVIDER_CREATION_ERROR',
        { originalError: error.toString() }
      );
    }
  }
}

export default ProviderFactory;