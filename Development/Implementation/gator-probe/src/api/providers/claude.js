/**
 * Claude Provider Implementation
 * 
 * Implements the BaseProvider interface for the Claude API.
 * Handles authentication, request formatting, and response parsing.
 */

import { BaseProvider, ApiError } from './base.js';

/**
 * Claude Provider Class
 * Implements the BaseProvider interface for the Claude API
 */
export class ClaudeProvider extends BaseProvider {
  /**
   * Creates a new ClaudeProvider instance
   * @param {Object} config - Configuration for the provider
   * @param {string} config.apiKey - Claude API key
   * @param {string} config.apiVersion - Claude API version
   * @param {string} config.model - Claude model to use
   * @param {number} config.temperature - Temperature parameter
   * @param {number} config.maxTokens - Maximum tokens to generate
   */
  constructor(config) {
    super(config);
    this.validateConfig();
  }

  /**
   * Validate the configuration for the Claude provider
   * @returns {boolean} True if the configuration is valid
   * @throws {ApiError} If the configuration is invalid
   */
  validateConfig() {
    super.validateConfig();
    
    if (!this.config.apiKey) {
      throw new ApiError(
        'Claude API key is required',
        'MISSING_API_KEY'
      );
    }
    
    if (!this.config.model) {
      throw new ApiError(
        'Claude model is required',
        'MISSING_MODEL'
      );
    }
    
    return true;
  }

  /**
   * Generate a response from the Claude API
   * @param {Object} params - Parameters for the request
   * @param {string} params.systemPrompt - System prompt to send to Claude
   * @param {string} params.userPrompt - User prompt to send to Claude
   * @param {Object} [params.options] - Additional options for the request
   * @returns {Promise<Object>} The response from Claude
   * @throws {ApiError} If an error occurs during the request
   */
  async generateResponse({ systemPrompt, userPrompt, options = {} }) {
    try {
      // Validate input
      if (!systemPrompt) {
        throw new ApiError(
          'System prompt is required',
          'MISSING_SYSTEM_PROMPT'
        );
      }
      
      if (!userPrompt) {
        throw new ApiError(
          'User prompt is required',
          'MISSING_USER_PROMPT'
        );
      }
      
      // Prepare request payload according to Claude API format
      const payload = {
        model: this.config.model,
        temperature: options.temperature || this.config.temperature || 0.7,
        max_tokens: options.maxTokens || this.config.maxTokens || 1500,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ]
      };
      
      // Prepare request headers
      const headers = {
        'Content-Type': 'application/json',
        'x-api-key': this.config.apiKey,
        'anthropic-version': this.config.apiVersion || '2023-06-01'
      };
      
      // Prepare request options
      const requestOptions = {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(payload)
      };
      
      // Determine API endpoint
      const apiUrl = 'https://api.anthropic.com/v1/messages';
      
      // Make the request
      const response = await fetch(apiUrl, requestOptions);
      
      // Check for HTTP errors
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw this._handleApiError(response.status, errorData);
      }
      
      // Parse the response
      const data = await response.json();
      
      // Extract and return the relevant parts of the response
      return {
        content: data.content && data.content[0] ? data.content[0].text : '',
        model: data.model,
        id: data.id,
        usage: data.usage,
        metadata: {
          finishReason: data.stop_reason,
          rawResponse: options.includeRawResponse ? data : undefined
        }
      };
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      
      // Convert generic errors to ApiError
      throw new ApiError(
        `Claude API error: ${error.message}`,
        'CLAUDE_API_ERROR',
        { originalError: error.toString() }
      );
    }
  }

  /**
   * Handle API error responses
   * @param {number} statusCode - HTTP status code
   * @param {Object} errorData - Error data from the API
   * @returns {ApiError} Structured API error
   */
  _handleApiError(statusCode, errorData) {
    // Map status codes to meaningful error codes
    const errorMessages = {
      400: 'Bad request: The request was malformed or contained invalid parameters',
      401: 'Authentication error: Invalid API key',
      403: 'Authorization error: Insufficient permissions',
      404: 'Not found: The requested resource does not exist',
      429: 'Rate limit exceeded: Too many requests',
      500: 'Server error: Something went wrong on the API server',
      502: 'Bad gateway: Invalid response from the API server',
      503: 'Service unavailable: The API server is currently unavailable',
      504: 'Gateway timeout: The API server took too long to respond'
    };
    
    const errorCodes = {
      400: 'INVALID_REQUEST',
      401: 'AUTHENTICATION_ERROR',
      403: 'AUTHORIZATION_ERROR',
      404: 'RESOURCE_NOT_FOUND',
      429: 'RATE_LIMIT_EXCEEDED',
      500: 'SERVER_ERROR',
      502: 'BAD_GATEWAY',
      503: 'SERVICE_UNAVAILABLE',
      504: 'GATEWAY_TIMEOUT'
    };
    
    // Get error message and code based on status code
    const message = errorMessages[statusCode] || `Unknown error: ${statusCode}`;
    const errorCode = errorCodes[statusCode] || 'UNKNOWN_ERROR';
    
    // Create and return ApiError with details
    return new ApiError(
      message,
      errorCode,
      {
        statusCode,
        errorData,
        timestamp: new Date().toISOString()
      }
    );
  }
}

export default ClaudeProvider;