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
   - Create implementation task prompts [✅ SESSION-005]

3. **Development Phase** 🟡
   - **Day 1-2: Configuration Module**
     - Project scaffolding (directory structure, package.json, etc.) [✅ TASK1_PROJECT_SETUP]
     - Configuration loader implementation with basic validation [✅ TASK2_CONFIG_LOADER]
     - Unit tests for configuration loading [✅ TASK3_CONFIG_LOADER_TESTS]

   - **Day 3-4: Prompt Assembly Module**
     - Template processing system implementation [TASK4_PROMPT_ASSEMBLY]
     - Persona attribute extraction logic [TASK4_PROMPT_ASSEMBLY]
     - Complete prompt assembly with extension points [TASK4_PROMPT_ASSEMBLY]
     - Unit tests for prompt assembly [TASK5_PROMPT_ASSEMBLY_TESTS]

   - **Day 5-6: API Integration & Server**
     - LLM API client with provider pattern [TASK6_LLM_API_CLIENT]
     - Claude provider implementation [TASK6_LLM_API_CLIENT]
     - Basic error handling [TASK6_LLM_API_CLIENT]
     - Unit tests for API client [TASK7_LLM_API_CLIENT_TESTS]
     - Express server setup with API endpoints [TASK8_EXPRESS_SERVER]
     - Server integration testing [TASK9_EXPRESS_SERVER_TESTS]

   - **Day 7: UI & End-to-End Integration**
     - HTML form and response display [TASK10_FRONTEND_UI]
     - CSS styling for readability [TASK10_FRONTEND_UI]
     - JavaScript for form handling and API interaction [TASK10_FRONTEND_UI]
     - End-to-end testing [TASK11_END_TO_END_TESTING]
     - Final QA and bug fixes [TASK11_END_TO_END_TESTING]

4. **Documentation & Handoff** 🔜
   - Update technical documentation with implementation details [TASK12_DOCUMENTATION_DEPLOYMENT]
   - Create usage guide for the probe [TASK12_DOCUMENTATION_DEPLOYMENT]
   - Document lessons learned for future iterations [TASK12_DOCUMENTATION_DEPLOYMENT]

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

| Component | Status | Task Reference | Notes |
|-----------|--------|---------------|-------|
| Persona Schema | ✅ Complete | | Defined in PERSONA_SCHEMA.md |
| Persona Configurations | ✅ Complete | | Created all 29 personas across 3 panels |
| Prompt Templates | ✅ Complete | | Created templates for all panel types |
| Implementation Task Prompts | ✅ Complete | SESSION-005 | Created TASK1-TASK12 implementation prompts |
| Project Setup | ✅ Complete | TASK1 | Node.js project with Express, Jest, and ESLint |
| Configuration Loader | ✅ Complete | TASK2 | Implementation completed with caching and provider pattern |
| Configuration Loader Tests | ✅ Complete | TASK3 | Comprehensive test suite covering all functionality, error handling, and edge cases |
| Prompt Assembler | 🟡 Planned | TASK4, TASK5 | Implementation and tests |
| LLM API Client | 🟡 Planned | TASK6, TASK7 | Implementation and tests |
| Express Server | 🟡 Planned | TASK8, TASK9 | Implementation and tests |
| User Interface | 🟡 Planned | TASK10 | Frontend implementation |
| End-to-End Testing | 🟡 Planned | TASK11 | Integration testing |
| Documentation | 🟡 Planned | TASK12 | Usage guide and deployment docs |

## Last Updated
2025-05-14T13:30:00Z | SESSION-007 | Claude