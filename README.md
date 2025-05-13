# VALUGATOR Probe Alpha

## Purpose
VALUGATOR Probe Alpha is a minimal viable prototype to validate AI-powered "gator" characters responding to user-submitted startup ideas. This probe tests whether different gator personas can be convincingly simulated using external LLM APIs while maintaining an extensible architecture for future development.

The end-to-end user flow is purposefully minimal:
1. User submits a startup idea via a simple form
2. User selects a gator persona from the dropdown
3. System loads the selected gator's configuration
4. Backend assembles a prompt using panel-specific templates
5. LLM API client sends the prompt to Claude
6. Character-consistent response is displayed to the user

The probe delivers:
- Simple HTML/JS interface for idea submission
- Complete gator persona configurations (29 personas across 3 panels)
- Panel-specific prompt templates
- Extensible prompt assembly module
- LLM API client with provider pattern
- Minimal but functional UI

## Current Status
- ✅ Created JSON schema for gator personas
- ✅ Implemented all 29 gator personas across 3 panels:
  - Evaluation Chamber (13 personas): Rex, Vanessa, Finley, Tessa, Huxley, Maya, Lucius, Ada, Jax, Dr. Cass, Nyx, Kip, Serena
  - Pathfinder Council (9 personas): Zane, Luma, Bram, Ori, Echo, Vex, Nell, Sol, Dr. Vire
  - Legal Panel (7 personas): Lex, Clara, Rana, Gavin, Delphi, Isla, Morven
- ✅ Created panel-specific prompt templates
- ✅ Defined technical architecture with extensibility patterns
- ✅ Created detailed implementation plan with 7-day timeline
- ✅ Developed module designs with extension points
- 🔜 Implementation phase starting (SESSION-005)

## Session Protocol
This project uses a structured documentation system to maintain context across planning sessions:

1. **Begin each new session** with:
   ```
   Resume project using DOCPROTOCOL. Last session ID: [SESSION-ID]
   ```
   Replace [SESSION-ID] with the ID from your previous session.

2. **End each session** with:
   ```
   Conclude session and prepare handoff
   ```
   This will update the session state and prepare documentation for the next session.

3. **First time starting**? Use:
   ```
   # DOCPROTOCOL: Claude will (1)Load system context from SESSION_STATE.md (2)Process new information (3)Update all affected documents (4)Maintain cross-references via unique IDs (5)Version all changes (6)Generate comprehensive session summary (7)Update knowledge graph (8)Prepare handoff state for next session
   ```

## Context Recovery Protocol
If you experience context loss or need to resume a session after interruption:

1. First, read the PROTOCOL.md file for core protocol instructions
2. Check SESSION_STATE.md for current session status and progress
3. Review the SESSION_PROTOCOL/SESSION_RECOVERY.md file for detailed recovery steps
4. Use this command to restore context:
   ```
   Resume project after context loss. Last session ID: [SESSION-ID]
   ```

> **Note for Claude**: Always check the CLAUDE_MUST_READ_THIS_FIRST directory first for essential protocol instructions.

## Architecture Overview

```
┌────────────────┐     ┌────────────────┐
│  Prompt        │     │  Configuration │
│  Assembler     │     │  Loader        │
└────────┬───────┘     └────────┬───────┘
         │                      │
         └──────────┬───────────┘
                    ▼
           ┌──────────────────┐
           │                  │
           │   LLM Client     │
           │                  │
           └────────┬─────────┘
                    │
                    ▼
         ┌───────────────────────┐
         │                       │
         │   Provider Factory    │
         │                       │
         └───────────┬───────────┘
                     │
                     ▼
         ┌───────────────────────┐
         │                       │
         │   Claude Provider     │
         │                       │
         └───────────┬───────────┘
                     │
                     ▼
         ┌───────────────────────┐
         │                       │
         │     Claude API        │
         │                       │
         └───────────────────────┘
```

## Project Structure
```
gator-probe-alpha/
├── config/                     # Configuration files
│   ├── personas/               # Gator persona configurations (29 personas)
│   │   ├── evaluation-chamber/ # Evaluation gator personas (13)
│   │   ├── pathfinder-council/ # Pathfinder gator personas (9)
│   │   └── legal-panel/        # Legal gator personas (7)
│   ├── prompt-templates/       # Templates for prompt assembly
│   │   ├── evaluation.json     # Template for evaluation prompts
│   │   ├── pathfinder.json     # Template for guidance prompts
│   │   └── legal.json          # Template for legal analysis prompts
│   └── settings.json           # Global application settings
│
├── src/                        # Application source code
│   ├── config/                 # Configuration management
│   │   ├── loader.js           # Configuration loader with extension points
│   │   └── validator.js        # Basic schema validation
│   ├── prompt/                 # Prompt assembly code
│   │   ├── assembler.js        # Combines persona config with templates
│   │   └── templates.js        # Template processing utilities
│   ├── api/                    # API-related code
│   │   ├── client.js           # LLM API client with provider abstraction
│   │   ├── providers/          # Provider-specific implementations
│   │   │   └── claude.js       # Claude provider implementation
│   │   └── routes.js           # API endpoints
│   └── public/                 # Static assets and client-side code
│       ├── index.html          # Main HTML file with minimal interface
│       ├── css/                # CSS stylesheets
│       └── js/                 # Client-side JavaScript
│
├── Technical/                  # Technical documentation
│   ├── PERSONA_SCHEMA.md       # Schema for gator personas
│   ├── PROMPT_ASSEMBLY.md      # Prompt assembly architecture
│   ├── API_INTEGRATION.md      # LLM API integration specification
│   ├── USER_INTERFACE.md       # User interface design
│   ├── PROJECT_STRUCTURE.md    # Project file organization
│   └── EXTENSION_POINTS.md     # Documentation of future extension capabilities
│
└── Development/                # Development documentation
    ├── IMPLEMENTATION_PLAN.md  # Implementation timeline and tasks
    └── Implementation/         # Implementation details
        └── EXTENSIBILITY.md    # Extensibility design patterns
```

## Audience
Multiple audience levels from executive overview to technical implementation.

## Document Inventory
- [DOC-ROOT-README-1]: This overview document
- [DOC-ROOT-STATE-1]: Current session state and progress tracking
- [DOC-ROOT-KNOW-1]: Knowledge graph of project concepts
- [DOC-ROOT-META-1]: Metadata and cross-reference information
- [DOC-ROOT-PROTO-1]: Core protocol documentation for continuity
- [DOC-TECH-PERS-1]: Persona configuration schema
- [DOC-TECH-PROM-1]: Prompt assembly architecture
- [DOC-TECH-API-1]: API integration specification
- [DOC-TECH-UI-1]: User interface design
- [DOC-TECH-STRUCT-1]: Project structure documentation
- [DOC-DEV-IMPL-1]: Implementation plan

## Sublevel Navigation
- [LVL-EXEC-1]: [Executive documentation](Executive/)
- [LVL-MGMT-1]: [Management documentation](Management/)
- [LVL-TECH-1]: [Technical documentation](Technical/)
- [LVL-DEV-1]: [Development documentation](Development/)
- [LVL-PROTO-1]: [Session protocol documentation](SESSION_PROTOCOL/)

## Implementation Timeline

The implementation follows a 7-day timeline:

1. **Day 1-2: Configuration Module**
   - Project scaffolding
   - Configuration loader implementation
   - Unit tests for configuration loading

2. **Day 3-4: Prompt Assembly Module**
   - Template processing implementation
   - Persona attribute extraction
   - Prompt assembly with extension points

3. **Day 5-6: API Integration & Server**
   - LLM API client with provider pattern
   - Claude provider implementation
   - Express server with API endpoints

4. **Day 7: UI & End-to-End Integration**
   - HTML form and response display
   - CSS styling for readability
   - End-to-end testing

## Last Updated
2025-05-12T19:30:00-07:00 | SESSION-004 | Claude
