# Implementation Plan

## Document ID
[DOC-DEV-IMPL-1]

## Overall Architecture

The VALUGATOR Probe Alpha follows a modular architecture that separates persona configurations, prompt assembly, and API integration:

```
┌───────────────┐     ┌───────────────┐
│ User Input    │     │ Gator Config  │
│ (Startup Idea)│     │ (JSON files)  │
└───────┬───────┘     └───────┬───────┘
        │                     │
        └──────────┬──────────┘
                   ▼
          ┌─────────────────┐
          │ Prompt Template │
          │ (Panel-specific)│
          └────────┬────────┘
                   │
                   ▼
          ┌─────────────────┐
          │Prompt Assembler │
          │                 │
          └────────┬────────┘
                   │
                   ▼
          ┌─────────────────┐
          │   LLM API       │
          │ (Claude/GPT-4o) │
          └────────┬────────┘
                   │
                   ▼
          ┌─────────────────┐
          │ User Interface  │
          │                 │
          └─────────────────┘
```

## Implementation Sequence

The implementation will follow this streamlined MVP sequence:

1. **Configuration Setup** ✅
   - Create JSON schema for gator personas
   - Implement persona configurations for all panels
   - Define prompt templates for different panel types

2. **Implementation Planning Phase** ✅
   - Refine implementation approach for MVP
   - Create detailed designs with extension points
   - Establish 7-day implementation timeline
   - Document component interfaces and relationships

3. **Development Phase** 🔜
   - **Day 1-2: Configuration Module**
     - Project scaffolding (directory structure, package.json, etc.)
     - Configuration loader implementation with basic validation
     - Unit tests for configuration loading

   - **Day 3-4: Prompt Assembly Module**
     - Template processing system implementation
     - Persona attribute extraction logic
     - Complete prompt assembly with extension points
     - Unit tests for prompt assembly

   - **Day 5-6: API Integration & Server**
     - LLM API client with provider pattern
     - Claude provider implementation
     - Basic error handling
     - Express server setup with API endpoints
     - Integration testing

   - **Day 7: UI & End-to-End Integration**
     - HTML form and response display
     - CSS styling for readability
     - JavaScript for form handling and API interaction
     - End-to-end testing
     - Final QA and bug fixes

4. **Documentation & Handoff** 🔜
   - Update technical documentation with implementation details
   - Create usage guide for the probe
   - Document lessons learned for future iterations

## Component Breakdown

### 1. Configuration Module
- **Persona Configurations**: JSON files defining gator characteristics
  - Evaluation Chamber: 13 personas (Rex, Vanessa, Finley, etc.)
  - Pathfinder Council: 9 personas (Zane, Luma, Bram, etc.)
  - Legal Panel: 7 personas (Lex, Clara, etc.)
- **Prompt Templates**: Panel-specific templates for system prompts
  - evaluation.json: For critique-focused responses
  - pathfinder.json: For guidance-oriented responses
  - legal.json: For legal risk assessment responses
- **Settings**: Global configuration for API and UI settings

### 2. Prompt Assembly Module
- **Configuration Loader**: Loads and validates JSON files
- **Template Processor**: Replaces placeholders with persona attributes
- **Prompt Assembler**: Combines template, persona, and user input

### 3. API Integration Module
- **API Client**: Communicates with LLM API
- **Request Builder**: Formats requests for the specific LLM
- **Response Processor**: Extracts and validates responses

### 4. User Interface
- **Input Form**: Captures startup pitch and gator selection
- **Response Display**: Shows gator response with styling
- **Minimal Controls**: Submit button and reset option

## Dependencies

- **External Dependencies**:
  - Node.js and Express for backend
  - Claude API or GPT-4o API for LLM integration
  - Basic HTML/CSS/JS for frontend (no framework)

- **Internal Dependencies**:
  ```
  User Interface → API Module → Prompt Assembly → Configuration
                            ↑
                      LLM Service
  ```

## Progress Tracking

| Component | Status | Notes |
|-----------|--------|-------|
| Persona Schema | ✅ Complete | Defined in PERSONA_SCHEMA.md |
| Persona Configurations | ✅ Complete | Created all 29 personas across 3 panels |
| Prompt Templates | ✅ Complete | Created templates for all panel types |
| Configuration Loader | 🔜 Not Started | |
| Template Processor | 🔜 Not Started | |
| Prompt Assembler | 🔜 Not Started | |
| API Client | 🔜 Not Started | |
| User Interface | 🔜 Not Started | |

## Last Updated
2025-05-12 18:30:00 PDT | SESSION-002 | Claude
