/**
 * Prompt Assembly Module
 * Responsible for assembling prompts based on persona configurations and user input
 */

import { configLoader } from '../config/index.js';
import PromptAssembler, { PromptAssembler as PromptAssemblerClass, PromptError } from './assembler.js';
import NaturalPromptAssembler, { NaturalPromptAssembler as NaturalPromptAssemblerClass } from './naturalAssembler.js';

// Create instances using the default config loader
const standardAssembler = new PromptAssembler(configLoader);
const naturalAssembler = new NaturalPromptAssembler(configLoader);

// Use the natural assembler as the default
const promptAssembler = naturalAssembler;

// Export the default instance
export { promptAssembler };

// Export the classes and instances for external use
export { 
  PromptAssemblerClass, 
  NaturalPromptAssemblerClass,
  PromptError,
  standardAssembler,
  naturalAssembler
};

// Default export for compatibility
export default promptAssembler;