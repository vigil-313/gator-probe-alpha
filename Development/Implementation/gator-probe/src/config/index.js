/**
 * Configuration Loader Module
 * Responsible for loading and validating:
 * - Gator persona configurations
 * - Prompt templates
 * - Global settings
 */

import configLoader, { ConfigLoader, ConfigError } from './loader.js';

// Export the main config loader instance
export { configLoader };

// Export the classes for external use
export { ConfigLoader, ConfigError };

// Default export for compatibility
export default configLoader;