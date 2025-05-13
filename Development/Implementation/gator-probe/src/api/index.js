/**
 * LLM API Client Module
 * 
 * Responsible for communicating with Large Language Model APIs
 * and generating responses based on prompts.
 */

import llmClient, { LlmClient } from './client.js';
import { ApiError } from './providers/base.js';
import ProviderFactory from './providers/factory.js';

// Export the main client instance
export { llmClient };

// Export the classes for external use
export { LlmClient, ApiError, ProviderFactory };

// Default export for compatibility
export default llmClient;