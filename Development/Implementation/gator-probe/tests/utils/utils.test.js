/**
 * Tests for utility functions
 */

import { safeJsonParse, createError, validateRequiredFields } from '../../src/utils/index.js';

describe('Utility Functions', () => {
  describe('safeJsonParse', () => {
    test('parses valid JSON correctly', () => {
      const jsonString = '{"key": "value"}';
      const result = safeJsonParse(jsonString);
      expect(result).toEqual({ key: 'value' });
    });

    test('returns default value for invalid JSON', () => {
      const invalidJson = '{key: value}';
      const result = safeJsonParse(invalidJson, { default: true });
      expect(result).toEqual({ default: true });
    });

    test('returns empty object as default if no default provided', () => {
      const invalidJson = 'not json';
      const result = safeJsonParse(invalidJson);
      expect(result).toEqual({});
    });
  });

  describe('createError', () => {
    test('creates error object with default status code', () => {
      const errorObj = createError('Something went wrong');
      expect(errorObj).toEqual({
        error: true,
        message: 'Something went wrong',
        statusCode: 500
      });
    });

    test('creates error object with custom status code', () => {
      const errorObj = createError('Not found', 404);
      expect(errorObj).toEqual({
        error: true,
        message: 'Not found',
        statusCode: 404
      });
    });
  });

  describe('validateRequiredFields', () => {
    test('returns true when all required fields exist', () => {
      const obj = { name: 'Test', id: 123, type: 'example' };
      const requiredFields = ['name', 'id'];
      expect(validateRequiredFields(obj, requiredFields)).toBe(true);
    });

    test('returns false when a required field is missing', () => {
      const obj = { name: 'Test', type: 'example' };
      const requiredFields = ['name', 'id'];
      expect(validateRequiredFields(obj, requiredFields)).toBe(false);
    });

    test('returns false when required field is undefined', () => {
      const obj = { name: 'Test', id: undefined };
      const requiredFields = ['name', 'id'];
      expect(validateRequiredFields(obj, requiredFields)).toBe(false);
    });

    test('returns false when input is not an object', () => {
      const obj = null;
      const requiredFields = ['name', 'id'];
      expect(validateRequiredFields(obj, requiredFields)).toBe(false);
    });
  });
});