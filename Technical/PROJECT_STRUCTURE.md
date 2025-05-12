# VALUGATOR Probe Alpha: Project Structure

## Document ID
[DOC-TECH-STRUCT-1]

## Overview
This document outlines the organization and structure of the VALUGATOR Probe Alpha project, which aims to validate a single gator persona's interaction with users through an external LLM API.

## Directory Structure

```
gator-probe-alpha/              # Project root
├── config/                     # Configuration files
│   ├── personas/               # Gator persona configurations
│   │   ├── README.md           # Documentation for persona configurations
│   │   ├── evaluation-chamber/ # Evaluation gator personas
│   │   │   └── rex.json        # Rex Revenue configuration
│   │   ├── pathfinder-council/ # Pathfinder gator personas
│   │   └── legal-panel/        # Legal gator personas
│   │
│   ├── prompt-templates/       # Templates for prompt assembly
│   │   └── evaluation.json     # Template for evaluation prompts
│   │
│   └── settings.json           # Global application settings
│
├── src/                        # Application source code
│   ├── index.js                # Entry point for the application
│   ├── api/                    # API-related code
│   │   ├── client.js           # LLM API client
│   │   └── routes.js           # API endpoints
│   │
│   ├── prompt/                 # Prompt assembly code
│   │   ├── assembler.js        # Combines persona config with templates
│   │   ├── loader.js           # Loads configuration files
│   │   └── templates.js        # Template processing utilities
│   │
│   ├── public/                 # Static assets and client-side code
│   │   ├── index.html          # Main HTML file
│   │   ├── css/                # CSS stylesheets
│   │   │   └── styles.css      # Main stylesheet
│   │   └── js/                 # Client-side JavaScript
│   │       └── app.js          # Main client application code
│   │
│   └── utils/                  # Utility functions
│       ├── config.js           # Configuration loading utilities
│       ├── logger.js           # Logging utilities
│       └── validation.js       # Validation functions
│
├── server.js                   # Express server setup
├── .env.example                # Example environment variables file
│
├── Technical/                  # Technical documentation
│   ├── README.md               # Main technical documentation
│   ├── PERSONA_SCHEMA.md       # Schema for gator personas
│   ├── PROMPT_ASSEMBLY.md      # Prompt assembly architecture
│   ├── API_INTEGRATION.md      # LLM API integration specification
│   ├── USER_INTERFACE.md       # User interface design
│   └── PROJECT_STRUCTURE.md    # This file
│
├── Development/                # Development documentation
├── Executive/                  # Executive documentation
├── Management/                 # Management documentation
├── README.md                   # Project overview
├── SESSION_STATE.md            # Current state of the project
├── KNOWLEDGE_GRAPH.md          # Concept relationships
│
└── package.json                # Project dependencies and scripts
```

## Key Files and Their Purposes

### Configuration Files

- **config/personas/evaluation-chamber/rex.json**: Contains the complete personality configuration for Rex Revenue, capturing tone, expertise, response patterns, and evaluation focus.

- **config/prompt-templates/evaluation.json**: Defines how persona attributes should be assembled into an effective LLM prompt to produce character-consistent responses.

- **config/settings.json**: Contains global application settings, including default gator, API provider selection, and UI configuration options.

### Technical Documentation

- **Technical/PERSONA_SCHEMA.md**: Defines the JSON schema for gator persona configurations, ensuring consistency across all character definitions.

- **Technical/PROMPT_ASSEMBLY.md**: Outlines the architecture for assembling LLM prompts from gator persona configurations.

- **Technical/API_INTEGRATION.md**: Specifies how the application integrates with external LLM APIs (Claude or GPT-4o).

- **Technical/USER_INTERFACE.md**: Documents the design of the minimal user interface for the probe.

### Application Code (to be implemented)

- **src/index.js**: Entry point for the Node.js application, initializes the Express server and middleware.

- **src/api/client.js**: Client for communicating with the LLM API, handling authentication, requests, and responses.

- **src/prompt/assembler.js**: Core logic for assembling prompts from persona configurations and templates.

- **src/public/index.html**: Main HTML file for the UI, containing the form and response display elements.

## Implementation Progression

The recommended implementation sequence is:

1. **Core Configuration**: Set up the configuration files and schema
2. **Prompt Assembly**: Implement the prompt assembly logic
3. **API Integration**: Connect to the LLM API
4. **Basic UI**: Create a minimal HTML form and response display
5. **Server Setup**: Implement the Express server and endpoints
6. **Integration**: Connect all components into a functional flow
7. **Testing & Validation**: Test with various startup ideas and validate persona consistency

## Configuration Structure Rationale

The configuration is organized to:

1. **Separate Concerns**: Keep persona definitions separate from prompt templates and application settings
2. **Support Multiple Panels**: Allow for easy addition of personas from different panels
3. **Enable Template Swapping**: Use different prompt templates depending on the context
4. **Centralize Settings**: Manage global settings in a single location

## Last Updated
2025-05-11 23:50:00 PDT | SESSION-INIT-001 | Claude