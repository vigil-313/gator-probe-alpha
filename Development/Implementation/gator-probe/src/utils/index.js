/**
 * Utility Functions
 * Common helper functions used across the application
 */

/**
 * Safely parses JSON with error handling
 * @param {string} json - The JSON string to parse
 * @param {any} defaultValue - Default value to return if parsing fails
 * @returns {any} The parsed object or defaultValue
 */
export const safeJsonParse = (json, defaultValue = {}) => {
  try {
    return JSON.parse(json);
  } catch (error) {
    console.error('JSON parsing error:', error);
    return defaultValue;
  }
};

/**
 * Creates a formatted error object
 * @param {string} message - Error message
 * @param {number} statusCode - HTTP status code
 * @returns {Object} Formatted error object
 */
export const createError = (message, statusCode = 500) => {
  return {
    error: true,
    message,
    statusCode
  };
};

/**
 * Validates that an object has all required fields
 * @param {Object} obj - Object to validate
 * @param {Array<string>} requiredFields - List of required field names
 * @returns {boolean} True if valid, false otherwise
 */
export const validateRequiredFields = (obj, requiredFields) => {
  if (!obj || typeof obj !== 'object') return false;
  return requiredFields.every(field => Object.prototype.hasOwnProperty.call(obj, field) && obj[field] !== undefined);
};