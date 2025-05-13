/**
 * Base Provider Interface
 * 
 * Defines the interface that all LLM providers must implement.
 * Acts as an abstract class that specific providers will extend.
 */

/**
 * Custom error class for API errors
 */
export class ApiError extends Error {
  constructor(message, errorCode, details = {}) {
    super(message);
    this.name = 'ApiError';
    this.errorCode = errorCode;
    this.details = details;
  }
}

/**
 * Base Provider Class
 * Abstract class that all LLM providers must extend
 */
export class BaseProvider {
  /**
   * Creates a new BaseProvider instance
   * @param {Object} config - Configuration for the provider
   */
  constructor(config) {
    if (this.constructor === BaseProvider) {
      throw new Error('BaseProvider is an abstract class and cannot be instantiated directly');
    }
    
    this.config = config || {};
  }

  /**
   * Generate a response from the LLM
   * This method must be implemented by all provider classes
   * @param {Object} params - Parameters for the request
   * @param {string} params.systemPrompt - System prompt to send to the LLM
   * @param {string} params.userPrompt - User prompt to send to the LLM
   * @param {Object} [params.options] - Additional options for the request
   * @returns {Promise<Object>} The response from the LLM
   * @throws {ApiError} If an error occurs during the request
   */
  async generateResponse(params) {
    throw new Error('Method generateResponse() must be implemented by subclass');
  }

  /**
   * Validate the configuration for the provider
   * @returns {boolean} True if the configuration is valid
   * @throws {ApiError} If the configuration is invalid
   */
  validateConfig() {
    // Base validation that applies to all providers
    if (!this.config) {
      throw new ApiError(
        'Provider configuration is required',
        'MISSING_CONFIG'
      );
    }
    
    return true;
  }
}

export default BaseProvider;