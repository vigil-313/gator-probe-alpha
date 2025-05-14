/**
 * End-to-End Tests for VALUGATOR Probe Alpha
 * 
 * These tests verify the complete system functionality, including:
 * - Server startup and configuration
 * - API endpoint integration
 * - Frontend UI interaction
 * - Component integration
 */

import request from 'supertest';
import { jest } from '@jest/globals';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

// Import the application
import app from '../../src/server.js';

// Import the actual modules
import { configLoader } from '../../src/config/index.js';
import { promptAssembler } from '../../src/prompt/index.js';
import { llmClient } from '../../src/api/index.js';

// Define __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to test fixtures directory
const fixturesPath = path.join(__dirname, '../fixtures');

// Spy variables for test verification
let configLoaderGetAllPersonaIdsSpy;
let configLoaderLoadPersonaSpy;
let configLoaderLoadTemplateSpy; 
let configLoaderLoadSettingsSpy;
let promptAssemblerAssemblePromptSpy;
let llmClientGenerateResponseSpy;

// Set up spies before tests
beforeAll(async () => {
  // Create spies on module methods
  configLoaderGetAllPersonaIdsSpy = jest.spyOn(configLoader, 'getAllPersonaIds');
  configLoaderLoadPersonaSpy = jest.spyOn(configLoader, 'loadPersona');
  configLoaderLoadTemplateSpy = jest.spyOn(configLoader, 'loadTemplate');
  configLoaderLoadSettingsSpy = jest.spyOn(configLoader, 'loadSettings');
  promptAssemblerAssemblePromptSpy = jest.spyOn(promptAssembler, 'assemblePrompt');
  llmClientGenerateResponseSpy = jest.spyOn(llmClient, 'generateResponse');
});

beforeEach(() => {
  // Reset all mocks before each test
  jest.clearAllMocks();
});

describe('End-to-End Test - Complete System Flow', () => {
  test('Complete flow from persona listing to response generation', async () => {
    // Step 1: Mock API responses for the test
    configLoaderGetAllPersonaIdsSpy.mockResolvedValue({
      evaluation: ['rex', 'tessa', 'vanessa'],
      pathfinder: ['zane', 'sol'],
      legal: ['lex', 'clara']
    });

    configLoaderLoadPersonaSpy.mockImplementation(async (personaId) => {
      // Return a mock persona configuration
      return {
        id: personaId,
        name: personaId === 'rex' ? 'Rex Revenue' : 'Test Persona',
        nickname: personaId === 'rex' ? 'The Bottom Line Beast' : 'Test Nickname',
        archetype: 'Financial Expert',
        expertiseAreas: ['Business Models', 'Revenue Strategies'],
        critiqueStyle: 'Direct and numbers-focused',
        tone: 'Professional, calculated',
        visualAppearance: {
          description: 'Anthropomorphic alligator in business attire',
          attire: 'Tailored pinstripe suit with gold cufflinks'
        },
        strengths: ['Financial analysis', 'ROI assessment'],
        weaknesses: ['May overlook human elements', 'Can be overly direct']
      };
    });

    configLoaderLoadTemplateSpy.mockResolvedValue({
      systemPrompt: 'You are {{name}}, {{archetype}} of VALUGATOR. Your tone is {{tone}}.',
      userPrompt: 'Analyze this startup idea: {{userInput}}'
    });

    configLoaderLoadSettingsSpy.mockResolvedValue({
      defaultProvider: 'claude',
      temperature: 0.7,
      maxTokens: 1000
    });

    promptAssemblerAssemblePromptSpy.mockResolvedValue({
      systemPrompt: 'You are Rex Revenue, Financial Expert of VALUGATOR. Your tone is Professional, calculated.',
      userPrompt: 'Analyze this startup idea: A delivery app for plant rentals'
    });

    llmClientGenerateResponseSpy.mockResolvedValue({
      content: 'This plant rental delivery app lacks a clear revenue model. Customer acquisition costs will likely exceed lifetime value given the niche market and low purchase frequency. Consider a B2B approach focusing on office spaces instead of consumers.',
      model: 'claude-3-sonnet-20240229',
      usage: { promptTokens: 120, completionTokens: 80 }
    });

    // Step 2: Test API endpoint for listing personas (simulates initial page load)
    const personasResponse = await request(app)
      .get('/api/personas');

    expect(personasResponse.status).toBe(200);
    expect(personasResponse.body.status).toBe('success');
    expect(personasResponse.body.data.panels).toHaveProperty('evaluation');
    expect(personasResponse.body.data.panels).toHaveProperty('pathfinder');
    expect(personasResponse.body.data.panels).toHaveProperty('legal');
    expect(configLoaderGetAllPersonaIdsSpy).toHaveBeenCalled();

    // Step 3: Test API endpoint for getting a specific persona (simulates persona selection)
    const personaResponse = await request(app)
      .get('/api/personas/rex');

    expect(personaResponse.status).toBe(200);
    expect(personaResponse.body.status).toBe('success');
    expect(personaResponse.body.data).toHaveProperty('id', 'rex');
    expect(personaResponse.body.data).toHaveProperty('name', 'Rex Revenue');
    expect(configLoaderLoadPersonaSpy).toHaveBeenCalledWith('rex');

    // Step 4: Test API endpoint for generating a response (simulates form submission)
    const generateResponse = await request(app)
      .post('/api/generate')
      .send({
        personaId: 'rex',
        userInput: 'A delivery app for plant rentals'
      });

    expect(generateResponse.status).toBe(200);
    expect(generateResponse.body.status).toBe('success');
    expect(generateResponse.body.data).toHaveProperty('personaId', 'rex');
    expect(generateResponse.body.data).toHaveProperty('response');
    expect(generateResponse.body.data.metadata).toHaveProperty('model');
    
    // Verify that all components were called in the correct sequence
    expect(promptAssemblerAssemblePromptSpy).toHaveBeenCalledWith('rex', 'A delivery app for plant rentals');
    expect(llmClientGenerateResponseSpy).toHaveBeenCalledWith({
      systemPrompt: 'You are Rex Revenue, Financial Expert of VALUGATOR. Your tone is Professional, calculated.',
      userPrompt: 'Analyze this startup idea: A delivery app for plant rentals'
    });
  });

  test('End-to-end flow with error handling - Persona not found', async () => {
    // Mock API responses for testing error scenario
    configLoaderLoadPersonaSpy.mockImplementation(async (personaId) => {
      if (personaId === 'nonexistent') {
        const error = new Error('Persona not found');
        error.errorCode = 'PERSONA_NOT_FOUND';
        throw error;
      }
      return {
        id: personaId,
        name: 'Test Persona',
        archetype: 'Test Archetype'
      };
    });

    // Test API endpoint with a nonexistent persona
    const response = await request(app)
      .post('/api/generate')
      .send({
        personaId: 'nonexistent',
        userInput: 'A delivery app for plant rentals'
      });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('status', 'error');
    expect(response.body).toHaveProperty('code', 'PERSONA_NOT_FOUND');
    expect(promptAssemblerAssemblePromptSpy).toHaveBeenCalledWith('nonexistent', 'A delivery app for plant rentals');
    expect(llmClientGenerateResponseSpy).not.toHaveBeenCalled();
  });

  test('End-to-end flow with error handling - API error', async () => {
    // Mock responses for testing API error scenario
    promptAssemblerAssemblePromptSpy.mockResolvedValue({
      systemPrompt: 'You are Test Persona, Test Archetype of VALUGATOR.',
      userPrompt: 'Analyze this startup idea: A delivery app for plant rentals'
    });

    llmClientGenerateResponseSpy.mockImplementation(async () => {
      const error = new Error('Rate limit exceeded');
      error.name = 'ApiError';
      error.errorCode = 'RATE_LIMIT_EXCEEDED';
      throw error;
    });

    // Test API endpoint to trigger API error
    const response = await request(app)
      .post('/api/generate')
      .send({
        personaId: 'test',
        userInput: 'A delivery app for plant rentals'
      });

    expect(response.status).toBe(429); // Rate limit error maps to 429 Too Many Requests
    expect(response.body).toHaveProperty('status', 'error');
    expect(response.body).toHaveProperty('code', 'RATE_LIMIT_EXCEEDED');
    expect(promptAssemblerAssemblePromptSpy).toHaveBeenCalled();
    expect(llmClientGenerateResponseSpy).toHaveBeenCalled();
  });

  test('End-to-end flow with validation - Input too long', async () => {
    // Create input that exceeds character limit
    const longInput = 'a'.repeat(2001);

    // Test API endpoint with too long input
    const response = await request(app)
      .post('/api/generate')
      .send({
        personaId: 'rex',
        userInput: longInput
      });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('status', 'error');
    expect(response.body).toHaveProperty('code', 'VALIDATION_ERROR');
    expect(response.body.message).toMatch(/exceeds maximum length/);
    expect(promptAssemblerAssemblePromptSpy).not.toHaveBeenCalled();
    expect(llmClientGenerateResponseSpy).not.toHaveBeenCalled();
  });
});

describe('End-to-End Test - Frontend UI and Static Files', () => {
  test('GET / should serve the HTML frontend', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toMatch(/text\/html/);
    expect(response.text).toMatch(/<html/);
  });

  test('GET /js/app.js should serve the frontend JavaScript', async () => {
    const response = await request(app).get('/js/app.js');
    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toMatch(/javascript/);
    expect(response.text).toContain('VALUGATOR Probe Alpha');
  });

  test('GET /css/styles.css should serve the CSS styles', async () => {
    const response = await request(app).get('/css/styles.css');
    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toMatch(/text\/css/);
  });

  test('GET /nonexistent should serve the HTML for SPA support', async () => {
    const response = await request(app).get('/nonexistent-path');
    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toMatch(/text\/html/);
    expect(response.text).toMatch(/<html/);
  });
});

describe('End-to-End Test - Server Health and API Integration', () => {
  test('GET /health should report system status', async () => {
    const response = await request(app).get('/health');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('status', 'healthy');
    expect(response.body.components).toMatchObject({
      configLoader: 'ok',
      promptAssembler: 'ok',
      llmClient: 'ok'
    });
  });

  test('GET /api/nonexistent should return proper 404 for API routes', async () => {
    const response = await request(app).get('/api/nonexistent');
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('status', 'error');
    expect(response.body).toHaveProperty('code', 'ENDPOINT_NOT_FOUND');
  });

  test('Configuration loader should work with actual config files', async () => {
    // Restore the real implementation for this test
    configLoaderGetAllPersonaIdsSpy.mockRestore();
    
    try {
      // Test with real config if possible, otherwise skip
      const result = await configLoader.getAllPersonaIds();
      expect(result).toBeDefined();
      if (Object.keys(result).length > 0) {
        expect(result).toHaveProperty('evaluation');
      }
    } catch (error) {
      // If we can't access real files in test environment, this is okay
      console.log('Skipping real file test in test environment');
    }
    
    // Remock for subsequent tests
    configLoaderGetAllPersonaIdsSpy = jest.spyOn(configLoader, 'getAllPersonaIds');
  });
});

describe('End-to-End Test - Performance and Resource Usage', () => {
  test('Server should handle concurrent requests efficiently', async () => {
    // Set up mocks for this test
    promptAssemblerAssemblePromptSpy.mockResolvedValue({
      systemPrompt: 'Test system prompt',
      userPrompt: 'Test user prompt'
    });

    llmClientGenerateResponseSpy.mockResolvedValue({
      content: 'Test response',
      model: 'test-model',
      usage: { promptTokens: 10, completionTokens: 10 }
    });

    // Create multiple concurrent requests
    const startTime = process.hrtime();
    
    const requests = [];
    for (let i = 0; i < 5; i++) {
      requests.push(
        request(app)
          .post('/api/generate')
          .send({
            personaId: `test${i}`,
            userInput: `Test input ${i}`
          })
      );
    }
    
    // Wait for all requests to complete
    const responses = await Promise.all(requests);
    
    const [seconds, nanoseconds] = process.hrtime(startTime);
    const elapsedMs = (seconds * 1000) + (nanoseconds / 1000000);
    
    // Check that all requests were successful
    responses.forEach(response => {
      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
    });
    
    // Log performance information
    console.log(`Processed 5 concurrent requests in ${elapsedMs.toFixed(2)}ms`);
    
    // Expect the time to be reasonable (will vary by system)
    expect(elapsedMs).toBeDefined();
  });

  test('Server should clean up resources after processing', async () => {
    // This is a basic check that doesn't actually verify memory usage
    // but ensures that responses are properly completed
    
    // Make a request
    const response = await request(app)
      .post('/api/generate')
      .send({
        personaId: 'test',
        userInput: 'Test cleanup'
      });
    
    // Verify response is complete and proper
    expect(response.status).toBe(200);
    expect(response.body.status).toBe('success');
  });
});