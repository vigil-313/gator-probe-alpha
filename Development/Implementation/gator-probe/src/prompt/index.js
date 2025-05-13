/**
 * Prompt Assembly Module
 * Responsible for assembling prompts based on persona configurations and user input
 */

import { configLoader } from '../config/index.js';
import PromptAssembler, { PromptAssembler as PromptAssemblerClass, PromptError } from './assembler.js';

// Create default instance using the default config loader
const promptAssembler = new PromptAssembler(configLoader);

// Export the default instance
export { promptAssembler };

// Export the classes for external use
export { PromptAssemblerClass, PromptError };

// Default export for compatibility
export default promptAssembler;