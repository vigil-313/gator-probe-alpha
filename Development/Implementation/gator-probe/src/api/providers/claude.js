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
    
    // Allow missing API key in simulation mode
    if (!this.config.useSimulationMode && !this.config.apiKey) {
      throw new ApiError(
        'Claude API key is required when not in simulation mode',
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
      
      // Log simulation mode status for debugging
      console.log(`[ClaudeProvider] Simulation Mode: ${this.config.useSimulationMode ? 'ENABLED' : 'DISABLED'}`);
      console.log(`[ClaudeProvider] API Key: ${this.config.apiKey ? 'Configured' : 'Missing'}`);
      
      // Force real API mode for testing
      console.log('[ClaudeProvider] Config values:', JSON.stringify(this.config, null, 2));
      
      // Check if we're in simulation mode - force to false for testing
      const forcedSimMode = false; // Set to false to force real API mode
      if (forcedSimMode) {
        console.log('[ClaudeProvider] Using simulation mode - generating simulated response');
        return this._generateSimulatedResponse(systemPrompt, userPrompt);
      }
      
      console.log('[ClaudeProvider] Using real API mode - sending request to Claude API');
      
      // Proceed with real API call
      // Prepare request payload according to Claude API format
      // The current Claude API expects system prompt as a top-level parameter
      const payload = {
        model: this.config.model,
        temperature: options.temperature || this.config.temperature || 0.7,
        max_tokens: options.maxTokens || this.config.maxTokens || 1500,
        system: systemPrompt,  // System prompt as top-level parameter
        messages: [
          { role: 'user', content: userPrompt }
        ]
      };
      
      // Prepare request headers
      const headers = {
        'Content-Type': 'application/json',
        'x-api-key': this.config.apiKey,
        'anthropic-version': '2023-06-01'  // Current official version as of 2024
      };
      
      // Prepare request options
      const requestOptions = {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(payload)
      };
      
      // Determine API endpoint
      const apiUrl = `${this.config.baseUrl || 'https://api.anthropic.com/v1'}/messages`;
      
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
   * Generate a simulated response (for development/testing without API costs)
   * @param {string} systemPrompt - System prompt
   * @param {string} userPrompt - User prompt 
   * @returns {Object} Simulated response object
   * @private
   */
  _generateSimulatedResponse(systemPrompt, userPrompt) {
    // Extract persona name or use a generic name
    const personaMatch = systemPrompt.match(/My name is ([^,.]+)/);
    const personaName = personaMatch ? personaMatch[1] : 'The Gator';
    
    // Extract the user input (usually a startup idea)
    const idea = userPrompt.replace('Startup Idea:', '').trim();
    
    // Create a simulated response based on the persona and input
    const responses = [
      `As ${personaName}, I find this idea "${idea}" quite intriguing. The market potential seems promising, though I'd suggest focusing more on the unique value proposition. Consider how you'll differentiate from existing solutions.`,
      `${personaName} here! I've analyzed your startup idea: "${idea}". The concept has merit, but I'm concerned about the execution challenges. Have you considered the regulatory hurdles and initial capital requirements?`,
      `*adjusts glasses* Interesting proposal! "${idea}" targets a growing market, but your revenue model needs refinement. I recommend conducting thorough customer validation before proceeding further.`,
      `From my perspective as ${personaName}, your idea "${idea}" shows promise. However, the competitive landscape is quite dense. You'll need a strong go-to-market strategy and clear differentiation to succeed.`,
      `${personaName} analysis: "${idea}" - This concept addresses a real problem, which is excellent. I'd recommend focusing on building a minimum viable product quickly to test key assumptions before seeking funding.`
    ];
    
    // Select a random response
    const responseIndex = Math.floor(Math.random() * responses.length);
    const content = responses[responseIndex];
    
    // Return a response object that mimics the real API response
    return {
      content: content,
      model: 'claude-3-sonnet-20240229-simulation',
      id: `sim_${Date.now().toString(36)}`,
      usage: {
        input_tokens: systemPrompt.length + userPrompt.length,
        output_tokens: content.length
      },
      metadata: {
        finishReason: 'end_turn',
        simulatedResponse: true
      }
    };
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