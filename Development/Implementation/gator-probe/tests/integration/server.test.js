/**
 * Integration tests for the Express server
 * 
 * These tests verify that the Express server functions correctly,
 * including API endpoints, middleware, error handling, and
 * integration with other components.
 */

import request from 'supertest';
import app from '../../src/server.js';
import { jest } from '@jest/globals';

// Import the actual dependencies to spy on them
import { configLoader } from '../../src/config/index.js';
import { promptAssembler } from '../../src/prompt/index.js';
import { llmClient } from '../../src/api/index.js';

// Create error classes for testing
class PromptError extends Error {
  constructor(message, errorCode, details = {}) {
    super(message);
    this.name = 'PromptError';
    this.errorCode = errorCode;
    this.details = details;
  }
}

class ApiError extends Error {
  constructor(message, errorCode, details = {}) {
    super(message);
    this.name = 'ApiError';
    this.errorCode = errorCode;
    this.details = details;
  }
}

// Set up spies before tests
let promptAssemblerSpy;
let configLoaderPersonaSpy;
let configLoaderTemplateSpy;
let configLoaderSettingsSpy;
let configLoaderGetAllPersonaIdsSpy;
let llmClientGenerateResponseSpy;

beforeEach(() => {
  // Create spies for the dependencies
  promptAssemblerSpy = jest.spyOn(promptAssembler, 'assemblePrompt');
  configLoaderPersonaSpy = jest.spyOn(configLoader, 'loadPersona');
  configLoaderTemplateSpy = jest.spyOn(configLoader, 'loadTemplate');
  configLoaderSettingsSpy = jest.spyOn(configLoader, 'loadSettings');
  configLoaderGetAllPersonaIdsSpy = jest.spyOn(configLoader, 'getAllPersonaIds');
  llmClientGenerateResponseSpy = jest.spyOn(llmClient, 'generateResponse');
  
  // Reset all mocks
  jest.clearAllMocks();
});

describe('Express Server - Basic Routes', () => {
  test('GET / returns HTML', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toMatch(/text\/html/);
  });

  test('GET /health returns status information', async () => {
    const response = await request(app).get('/health');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('status', 'healthy');
    expect(response.body).toHaveProperty('version', '0.1.0');
    expect(response.body.components).toMatchObject({
      configLoader: 'ok',
      promptAssembler: 'ok',
      llmClient: 'ok'
    });
  });

  test('GET /nonexistent API route returns 404 with JSON error', async () => {
    const response = await request(app).get('/api/nonexistent');
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('status', 'error');
    expect(response.body).toHaveProperty('code', 'ENDPOINT_NOT_FOUND');
  });

  test('GET /nonexistent non-API route serves index.html (SPA support)', async () => {
    const response = await request(app).get('/nonexistent-page');
    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toMatch(/text\/html/);
  });
});

describe('Express Server - /api/generate Endpoint', () => {
  test('POST /api/generate with valid data returns successful response', async () => {
    // Mock the dependencies
    promptAssemblerSpy.mockResolvedValue({
      systemPrompt: 'System prompt for rex',
      userPrompt: 'User prompt: Test idea'
    });
    
    llmClientGenerateResponseSpy.mockResolvedValue({
      content: 'This is a response from Rex Revenue',
      model: 'claude-3-sonnet-20240229',
      usage: { promptTokens: 100, completionTokens: 50 }
    });
    
    const response = await request(app)
      .post('/api/generate')
      .send({
        personaId: 'rex',
        userInput: 'Test idea'
      });
    
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('status', 'success');
    expect(response.body.data).toHaveProperty('personaId', 'rex');
    expect(response.body.data).toHaveProperty('response', 'This is a response from Rex Revenue');
    expect(response.body.data.metadata).toHaveProperty('model', 'claude-3-sonnet-20240229');
    
    // Verify dependencies were called correctly
    expect(promptAssemblerSpy).toHaveBeenCalledWith('rex', 'Test idea');
    expect(llmClientGenerateResponseSpy).toHaveBeenCalledWith({
      systemPrompt: 'System prompt for rex',
      userPrompt: 'User prompt: Test idea'
    });
  });
  
  test('POST /api/generate with missing personaId fails validation', async () => {
    const response = await request(app)
      .post('/api/generate')
      .send({
        userInput: 'Test idea without personaId'
      });
    
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('status', 'error');
    expect(response.body).toHaveProperty('code', 'VALIDATION_ERROR');
    expect(response.body.message).toMatch(/personaId is required/);
    
    // Verify dependencies were not called
    expect(promptAssemblerSpy).not.toHaveBeenCalled();
    expect(llmClientGenerateResponseSpy).not.toHaveBeenCalled();
  });
  
  test('POST /api/generate with missing userInput fails validation', async () => {
    const response = await request(app)
      .post('/api/generate')
      .send({
        personaId: 'rex'
      });
    
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('status', 'error');
    expect(response.body).toHaveProperty('code', 'VALIDATION_ERROR');
    expect(response.body.message).toMatch(/userInput is required/);
    
    // Verify dependencies were not called
    expect(promptAssemblerSpy).not.toHaveBeenCalled();
    expect(llmClientGenerateResponseSpy).not.toHaveBeenCalled();
  });
  
  test('POST /api/generate with too long userInput fails validation', async () => {
    // Create a string longer than 2000 characters
    const longUserInput = 'a'.repeat(2001);
    
    const response = await request(app)
      .post('/api/generate')
      .send({
        personaId: 'rex',
        userInput: longUserInput
      });
    
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('status', 'error');
    expect(response.body).toHaveProperty('code', 'VALIDATION_ERROR');
    expect(response.body.message).toMatch(/exceeds maximum length/);
    
    // Verify dependencies were not called
    expect(promptAssemblerSpy).not.toHaveBeenCalled();
    expect(llmClientGenerateResponseSpy).not.toHaveBeenCalled();
  });
  
  test('POST /api/generate handles prompt assembly errors', async () => {
    // Mock the dependencies to throw an error
    promptAssemblerSpy.mockRejectedValue(
      new PromptError('Persona not found', 'PERSONA_NOT_FOUND')
    );
    
    const response = await request(app)
      .post('/api/generate')
      .send({
        personaId: 'nonexistent',
        userInput: 'Test idea'
      });
    
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('status', 'error');
    expect(response.body).toHaveProperty('code', 'PERSONA_NOT_FOUND');
    expect(response.body.message).toMatch(/Persona not found/);
    
    // Verify dependencies were called correctly
    expect(promptAssemblerSpy).toHaveBeenCalledWith('nonexistent', 'Test idea');
    expect(llmClientGenerateResponseSpy).not.toHaveBeenCalled();
  });
  
  test('POST /api/generate handles LLM API errors', async () => {
    // Mock the dependencies
    promptAssemblerSpy.mockResolvedValue({
      systemPrompt: 'System prompt for rex',
      userPrompt: 'User prompt: Test idea'
    });
    
    llmClientGenerateResponseSpy.mockRejectedValue(
      new ApiError('Rate limit exceeded', 'RATE_LIMIT_EXCEEDED')
    );
    
    const response = await request(app)
      .post('/api/generate')
      .send({
        personaId: 'rex',
        userInput: 'Test idea'
      });
    
    expect(response.status).toBe(429); // Rate limit error should map to 429 Too Many Requests
    expect(response.body).toHaveProperty('status', 'error');
    expect(response.body).toHaveProperty('code', 'RATE_LIMIT_EXCEEDED');
    expect(response.body.message).toMatch(/Rate limit exceeded/);
    
    // Verify dependencies were called correctly
    expect(promptAssemblerSpy).toHaveBeenCalledWith('rex', 'Test idea');
    expect(llmClientGenerateResponseSpy).toHaveBeenCalled();
  });
});

describe('Express Server - /api/personas Endpoint', () => {
  test('GET /api/personas returns personas grouped by panel', async () => {
    // Mock the getAllPersonaIds response
    configLoaderGetAllPersonaIdsSpy.mockResolvedValue({
      evaluation: ['rex', 'huxley'],
      pathfinder: ['zane', 'ori'],
      legal: ['lex']
    });
    
    // Mock the loadPersona responses
    configLoaderPersonaSpy.mockImplementation(async (personaId) => {
      const personas = {
        rex: {
          id: 'rex',
          name: 'Rex Revenue',
          nickname: 'The Bottom Line Beast',
          archetype: 'Financial Expert',
          expertiseAreas: ['Business Models', 'Revenue Strategies']
        },
        huxley: {
          id: 'huxley',
          name: 'Huxley Helix',
          nickname: 'The Pattern Seeker',
          archetype: 'Systems Thinker',
          expertiseAreas: ['Complex Systems', 'Strategic Patterns']
        },
        zane: {
          id: 'zane',
          name: 'Zane Zoomer',
          nickname: 'The Accelerant',
          archetype: 'Growth Expert',
          expertiseAreas: ['Scaling', 'Market Expansion']
        },
        ori: {
          id: 'ori',
          name: 'Ori Oracle',
          nickname: 'The Future Knower',
          archetype: 'Futurist',
          expertiseAreas: ['Trend Analysis', 'Future Prediction']
        },
        lex: {
          id: 'lex',
          name: 'Lex Legis',
          nickname: 'The Rule Reader',
          archetype: 'Legal Expert',
          expertiseAreas: ['Regulatory Compliance', 'Legal Risk']
        }
      };
      return personas[personaId];
    });
    
    const response = await request(app).get('/api/personas');
    
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('status', 'success');
    expect(response.body.data).toHaveProperty('panels');
    
    // Check panel structure
    expect(response.body.data.panels).toHaveProperty('evaluation');
    expect(response.body.data.panels).toHaveProperty('pathfinder');
    expect(response.body.data.panels).toHaveProperty('legal');
    
    // Check persona data
    expect(response.body.data.panels.evaluation.personas).toHaveLength(2);
    expect(response.body.data.panels.pathfinder.personas).toHaveLength(2);
    expect(response.body.data.panels.legal.personas).toHaveLength(1);
    
    // Check panel metadata
    expect(response.body.data.panels.evaluation.displayName).toBe('Evaluation Chamber');
    expect(response.body.data.panels.pathfinder.displayName).toBe('Pathfinder Council');
    expect(response.body.data.panels.legal.displayName).toBe('Legal Panel');
    
    // Verify dependencies were called correctly
    expect(configLoaderGetAllPersonaIdsSpy).toHaveBeenCalled();
    expect(configLoaderPersonaSpy).toHaveBeenCalledTimes(5);
  });
  
  test('GET /api/personas handles configuration errors', async () => {
    // Mock the getAllPersonaIds to throw an error
    configLoaderGetAllPersonaIdsSpy.mockRejectedValue(
      new Error('Failed to load persona IDs')
    );
    
    const response = await request(app).get('/api/personas');
    
    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty('status', 'error');
    expect(response.body).toHaveProperty('message');
    
    // Verify dependencies were called correctly
    expect(configLoaderGetAllPersonaIdsSpy).toHaveBeenCalled();
    expect(configLoaderPersonaSpy).not.toHaveBeenCalled();
  });
  
  test('GET /api/personas handles persona loading errors gracefully', async () => {
    // Mock the getAllPersonaIds response
    configLoaderGetAllPersonaIdsSpy.mockResolvedValue({
      evaluation: ['rex', 'error-persona']
    });
    
    // Mock the loadPersona to succeed for rex and fail for error-persona
    configLoaderPersonaSpy.mockImplementation(async (personaId) => {
      if (personaId === 'rex') {
        return {
          id: 'rex',
          name: 'Rex Revenue',
          nickname: 'The Bottom Line Beast',
          archetype: 'Financial Expert',
          expertiseAreas: ['Business Models', 'Revenue Strategies']
        };
      } else {
        throw new Error('Failed to load persona');
      }
    });
    
    const response = await request(app).get('/api/personas');
    
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('status', 'success');
    expect(response.body.data.panels.evaluation.personas).toHaveLength(1);
    expect(response.body.data.panels.evaluation.personas[0].id).toBe('rex');
    
    // Verify dependencies were called correctly
    expect(configLoaderGetAllPersonaIdsSpy).toHaveBeenCalled();
    expect(configLoaderPersonaSpy).toHaveBeenCalledTimes(2);
  });
  
  test('GET /api/personas/:id returns specific persona data', async () => {
    // Mock the loadPersona response
    configLoaderPersonaSpy.mockResolvedValue({
      id: 'rex',
      name: 'Rex Revenue',
      nickname: 'The Bottom Line Beast',
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
    });
    
    const response = await request(app).get('/api/personas/rex');
    
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('status', 'success');
    expect(response.body.data).toHaveProperty('id', 'rex');
    expect(response.body.data).toHaveProperty('name', 'Rex Revenue');
    expect(response.body.data.visualAppearance).toMatchObject({
      description: 'Anthropomorphic alligator in business attire',
      attire: 'Tailored pinstripe suit with gold cufflinks'
    });
    
    // Verify dependencies were called correctly
    expect(configLoaderPersonaSpy).toHaveBeenCalledWith('rex');
  });
  
  test('GET /api/personas/:id handles persona not found', async () => {
    // Mock the loadPersona to throw a ConfigError with PERSONA_NOT_FOUND
    const error = new Error('Persona not found');
    error.errorCode = 'PERSONA_NOT_FOUND';
    configLoaderPersonaSpy.mockRejectedValue(error);
    
    const response = await request(app).get('/api/personas/nonexistent');
    
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('status', 'error');
    expect(response.body).toHaveProperty('code', 'PERSONA_NOT_FOUND');
    
    // Verify dependencies were called correctly
    expect(configLoaderPersonaSpy).toHaveBeenCalledWith('nonexistent');
  });
});

describe('Express Server - Error Handling', () => {
  test('handles PromptError appropriately', async () => {
    // Mock the dependencies to throw a PromptError
    promptAssemblerSpy.mockRejectedValue(
      new PromptError('Template variable not found', 'UNDEFINED_VARIABLE', { variablePath: 'nonexistent' })
    );
    
    const response = await request(app)
      .post('/api/generate')
      .send({
        personaId: 'rex',
        userInput: 'Test idea'
      });
    
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('status', 'error');
    expect(response.body).toHaveProperty('code', 'UNDEFINED_VARIABLE');
    expect(response.body).toHaveProperty('details');
    expect(response.body.details).toHaveProperty('variablePath', 'nonexistent');
  });
  
  test('handles ApiError appropriately', async () => {
    // Mock the dependencies
    promptAssemblerSpy.mockResolvedValue({
      systemPrompt: 'System prompt for rex',
      userPrompt: 'User prompt: Test idea'
    });
    
    llmClientGenerateResponseSpy.mockRejectedValue(
      new ApiError('Service unavailable', 'SERVICE_UNAVAILABLE', { retryAfter: '30s' })
    );
    
    const response = await request(app)
      .post('/api/generate')
      .send({
        personaId: 'rex',
        userInput: 'Test idea'
      });
    
    expect(response.status).toBe(503);
    expect(response.body).toHaveProperty('status', 'error');
    expect(response.body).toHaveProperty('code', 'SERVICE_UNAVAILABLE');
    expect(response.body).toHaveProperty('details');
    expect(response.body.details).toHaveProperty('retryAfter', '30s');
  });
  
  test('handles unknown errors appropriately', async () => {
    // Mock the dependencies to throw a generic Error
    promptAssemblerSpy.mockRejectedValue(
      new Error('Something unexpected happened')
    );
    
    const response = await request(app)
      .post('/api/generate')
      .send({
        personaId: 'rex',
        userInput: 'Test idea'
      });
    
    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty('status', 'error');
    expect(response.body).toHaveProperty('code', 'SERVER_ERROR');
  });
});