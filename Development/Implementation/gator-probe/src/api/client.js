/**
 * LLM API Client
 * 
 * Main client class for interacting with LLM APIs.
 * Uses the provider pattern to support multiple LLM providers.
 * Provides error handling and retry logic.
 */

import { configLoader } from '../config/index.js';
import { ApiError } from './providers/base.js';
import ProviderFactory from './providers/factory.js';

/**
 * LLM Client Class
 * Main client for interacting with LLM APIs
 */
export class LlmClient {
  /**
   * Creates a new LlmClient instance
   * @param {Object} options - Client options
   * @param {string} [options.providerType] - Provider type to use (defaults to provider from settings)
   * @param {Object} [options.config] - Provider configuration (defaults to configuration from settings)
   * @param {number} [options.maxRetries] - Maximum number of retries for failed requests
   * @param {number} [options.retryDelay] - Delay between retries in milliseconds
   * @param {Function} [options.configLoader] - Config loader instance
   */
  constructor(options = {}) {
    this.configLoader = options.configLoader || configLoader;
    this.maxRetries = options.maxRetries || 3;
    this.retryDelay = options.retryDelay || 1000;
    this.provider = null;
    
    // Initialize provider if configuration is provided
    if (options.providerType && options.config) {
      this.initializeProvider(options.providerType, options.config);
    }
  }

  /**
   * Initialize the provider from configuration
   * @param {string} providerType - Provider type to use
   * @param {Object} config - Provider configuration
   * @returns {Promise<void>}
   * @throws {ApiError} If provider initialization fails
   */
  initializeProvider(providerType, config) {
    try {
      this.provider = ProviderFactory.getProvider(providerType, config);
      return this.provider;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      
      throw new ApiError(
        `Failed to initialize provider: ${error.message}`,
        'PROVIDER_INIT_ERROR',
        { originalError: error.toString() }
      );
    }
  }

  /**
   * Get or initialize the provider
   * @returns {Promise<BaseProvider>} The provider instance
   * @throws {ApiError} If provider initialization fails
   */
  async getProvider() {
    // If provider is already initialized, return it
    if (this.provider) {
      return this.provider;
    }
    
    // Otherwise, initialize from settings
    try {
      const settings = await this.configLoader.loadSettings();
      const apiSettings = settings.apiSettings || {};
      
      return this.initializeProvider(
        apiSettings.provider,
        {
          apiKey: process.env.LLM_API_KEY || apiSettings.apiKey,
          apiVersion: apiSettings.apiVersion,
          model: apiSettings.model,
          temperature: apiSettings.temperature,
          maxTokens: apiSettings.maxTokens
        }
      );
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      
      throw new ApiError(
        `Failed to load provider settings: ${error.message}`,
        'SETTINGS_LOAD_ERROR',
        { originalError: error.toString() }
      );
    }
  }

  /**
   * Generate a response from the LLM
   * @param {Object} params - Parameters for the request
   * @param {string} params.systemPrompt - System prompt to send to the LLM
   * @param {string} params.userPrompt - User prompt to send to the LLM
   * @param {Object} [params.options] - Additional options for the request
   * @returns {Promise<Object>} The response from the LLM
   * @throws {ApiError} If an error occurs during the request
   */
  async generateResponse(params) {
    try {
      // Get the provider
      const provider = await this.getProvider();
      
      // Try to generate the response with retries
      return await this._retryOperation(() => 
        provider.generateResponse(params)
      );
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      
      throw new ApiError(
        `Error generating response: ${error.message}`,
        'GENERATE_RESPONSE_ERROR',
        { originalError: error.toString() }
      );
    }
  }

  /**
   * Retry an operation with exponential backoff
   * @param {Function} operation - Operation to retry
   * @param {number} [attempt=1] - Current attempt number
   * @returns {Promise<any>} Result of the operation
   * @throws {ApiError} If all retry attempts fail
   * @private
   */
  async _retryOperation(operation, attempt = 1) {
    try {
      return await operation();
    } catch (error) {
      // Check if the error is retryable
      if (!this._isRetryableError(error) || attempt >= this.maxRetries) {
        throw error;
      }
      
      // Calculate delay with exponential backoff
      const delay = this.retryDelay * Math.pow(2, attempt - 1);
      
      // Wait for the delay
      await new Promise(resolve => setTimeout(resolve, delay));
      
      // Retry the operation
      return this._retryOperation(operation, attempt + 1);
    }
  }

  /**
   * Check if an error is retryable
   * @param {Error} error - Error to check
   * @returns {boolean} True if the error is retryable
   * @private
   */
  _isRetryableError(error) {
    // Only retry server errors, timeouts, and rate limit errors
    if (error instanceof ApiError) {
      const retryableCodes = [
        'SERVER_ERROR',
        'SERVICE_UNAVAILABLE',
        'GATEWAY_TIMEOUT',
        'RATE_LIMIT_EXCEEDED'
      ];
      
      return retryableCodes.includes(error.errorCode);
    }
    
    // Network errors are also retryable
    return error.name === 'TypeError' && 
           error.message.includes('network');
  }
}

/**
 * Create a default instance of the LLM client
 */
export const llmClient = new LlmClient();

/**
 * Default export for the LLM client
 */
export default llmClient;