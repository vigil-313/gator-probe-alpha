/**
 * VALUGATOR Probe Alpha Server
 * Main entry point for the application
 * 
 * This server provides API endpoints for the gator-probe frontend,
 * integrating the configuration loader, prompt assembly, and LLM API client.
 */

import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Define __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import core components
import { configLoader } from './config/index.js';
import { promptAssembler } from './prompt/index.js';
import { llmClient } from './api/index.js';
import { PromptError } from './prompt/index.js';
import { ApiError } from './api/index.js';

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Request validation middleware
const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error } = schema(req.body);
    if (error) {
      return res.status(400).json({
        status: 'error',
        code: 'VALIDATION_ERROR',
        message: error.message
      });
    }
    next();
  };
};

// Input validation schemas
const validateGenerateRequest = (data) => {
  const errors = [];
  
  if (!data.personaId) {
    errors.push('personaId is required');
  }
  
  if (!data.userInput) {
    errors.push('userInput is required');
  } else if (typeof data.userInput === 'string' && data.userInput.length > 7000) {
    errors.push('userInput exceeds maximum length of 7000 characters');
  }
  
  if (errors.length > 0) {
    return { error: { message: errors.join(', ') } };
  }
  
  return { error: null };
};

// Serve static files with caching headers
app.use(express.static(path.join(__dirname, 'public'), {
  maxAge: '1h',
  setHeaders: (res, path) => {
    if (path.endsWith('.html')) {
      // Don't cache HTML files
      res.setHeader('Cache-Control', 'no-cache');
    }
  }
}));

// Default route - simple UI for submitting ideas
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API route for generating gator responses
app.post('/api/generate', validateRequest(validateGenerateRequest), async (req, res, next) => {
  try {
    const { personaId, userInput } = req.body;
    
    // Use prompt assembler to create a prompt
    const prompt = await promptAssembler.assemblePrompt(personaId, userInput);
    
    // Use LLM client to generate a response
    const response = await llmClient.generateResponse({
      systemPrompt: prompt.systemPrompt,
      userPrompt: prompt.userPrompt
    });
    
    // Log for debugging
    console.log('[API] Response from LLM client:', {
      content: response.content,
      model: response.model,
      usage: response.usage
    });
    
    // Return the response
    res.status(200).json({
      status: 'success',
      data: {
        personaId,
        content: response.content,
        metadata: {
          model: response.model,
          usage: response.usage
        }
      }
    });
  } catch (error) {
    next(error);
  }
});

// API route for retrieving available personas
app.get('/api/personas', async (req, res, next) => {
  try {
    // Get all persona IDs grouped by panel
    const personaIds = await configLoader.getAllPersonaIds();
    
    // Initialize results object
    const result = {
      status: 'success',
      data: {
        panels: {}
      }
    };
    
    // For each panel, get detailed information about each persona
    for (const [panelType, ids] of Object.entries(personaIds)) {
      // Skip empty panels
      if (ids.length === 0) continue;
      
      // Initialize panel in results
      result.data.panels[panelType] = {
        displayName: getPanelDisplayName(panelType),
        description: getPanelDescription(panelType),
        personas: []
      };
      
      // Get basic info for each persona without loading full config
      for (const id of ids) {
        try {
          const persona = await configLoader.loadPersona(id);
          result.data.panels[panelType].personas.push({
            id: persona.id,
            name: persona.name,
            nickname: persona.nickname,
            archetype: persona.archetype,
            briefDescription: persona.briefDescription || '',
            expertise: Array.isArray(persona.expertiseAreas) ? 
              persona.expertiseAreas.join(', ') : persona.expertiseAreas
          });
        } catch (error) {
          console.error(`Error loading persona ${id}:`, error);
          // Continue with next persona if one fails
        }
      }
    }
    
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

// API route for retrieving a specific persona
app.get('/api/personas/:id', async (req, res, next) => {
  try {
    const personaId = req.params.id;
    
    // Load the persona configuration
    const persona = await configLoader.loadPersona(personaId);
    
    // Return limited information (don't expose full configuration)
    res.status(200).json({
      status: 'success',
      data: {
        id: persona.id,
        name: persona.name,
        nickname: persona.nickname,
        archetype: persona.archetype,
        expertiseAreas: persona.expertiseAreas,
        critiqueStyle: persona.critiqueStyle,
        tone: persona.tone,
        visualAppearance: {
          description: persona.visualAppearance.description,
          attire: persona.visualAppearance.attire
        },
        strengths: persona.strengths,
        weaknesses: persona.weaknesses
      }
    });
  } catch (error) {
    if (error.errorCode === 'PERSONA_NOT_FOUND' || error.errorCode === 'FILE_NOT_FOUND') {
      return res.status(404).json({
        status: 'error',
        code: 'PERSONA_NOT_FOUND',
        message: `Persona with ID "${req.params.id}" not found`
      });
    }
    next(error);
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'healthy', 
    version: '0.1.0',
    components: {
      configLoader: 'ok',
      promptAssembler: 'ok',
      llmClient: 'ok'
    }
  });
});

// Catch-all route for SPA
app.get('*', (req, res) => {
  // For API routes that don't exist, return 404
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({
      status: 'error',
      code: 'ENDPOINT_NOT_FOUND',
      message: `Endpoint ${req.path} not found`
    });
  }
  
  // For all other routes, serve the index.html file (SPA support)
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(`[ERROR] ${err.message}`);
  
  // Handle specific error types
  if (err.name === 'PromptError' || err instanceof PromptError) {
    return res.status(400).json({
      status: 'error',
      code: err.errorCode || 'PROMPT_ERROR',
      message: err.message,
      details: err.details || {}
    });
  }
  
  if (err.name === 'ApiError' || err instanceof ApiError) {
    // Map API error codes to HTTP status codes
    const statusCode = getHttpStatusForApiError(err.errorCode);
    return res.status(statusCode).json({
      status: 'error',
      code: err.errorCode || 'API_ERROR',
      message: err.message,
      details: err.details || {}
    });
  }
  
  // Generic error handler
  res.status(500).json({
    status: 'error',
    code: 'SERVER_ERROR',
    message: 'An unexpected error occurred'
  });
});

// Helper function to get display name for panel type
function getPanelDisplayName(panelType) {
  const displayNames = {
    'evaluation': 'Evaluation Chamber',
    'pathfinder': 'Pathfinder Council',
    'legal': 'Legal Panel'
  };
  
  return displayNames[panelType] || panelType;
}

// Helper function to get description for panel type
function getPanelDescription(panelType) {
  const descriptions = {
    'evaluation': 'Critical feedback and evaluation for startup ideas',
    'pathfinder': 'Guidance and direction for decision-making',
    'legal': 'Legal risk assessment and considerations'
  };
  
  return descriptions[panelType] || '';
}

// Helper function to map API error codes to HTTP status codes
function getHttpStatusForApiError(errorCode) {
  const errorMap = {
    'PROVIDER_INIT_ERROR': 500,
    'SETTINGS_LOAD_ERROR': 500,
    'GENERATE_RESPONSE_ERROR': 500,
    'PROVIDER_NOT_FOUND': 500,
    'INVALID_CONFIGURATION': 400,
    'INVALID_REQUEST': 400,
    'AUTHENTICATION_ERROR': 401,
    'PERMISSION_DENIED': 403,
    'RATE_LIMIT_EXCEEDED': 429,
    'SERVER_ERROR': 500,
    'SERVICE_UNAVAILABLE': 503,
    'GATEWAY_TIMEOUT': 504
  };
  
  return errorMap[errorCode] || 500;
}

// Start server
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`VALUGATOR Probe Alpha server running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV}`);
    console.log(`Simulation Mode: ${process.env.USE_SIMULATION_MODE === 'true' ? 'ENABLED' : 'DISABLED'}`);
    console.log(`API Base URL: ${process.env.CLAUDE_API_BASE_URL}`);
    console.log(`API Key configured: ${process.env.CLAUDE_API_KEY ? 'YES' : 'NO'}`);
  });
}

export default app; // Export for testing