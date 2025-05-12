# VALUGATOR Probe Alpha

## Purpose
VALUGATOR Probe Alpha is a focused technical prototype to validate AI-powered "gator" characters responding to user-submitted pitches. This probe tests whether different gator personas can be convincingly simulated using external LLM APIs (Claude or GPT-4o).

The end-to-end user flow is purposefully minimal:
1. User submits a startup idea via a simple form
2. System loads the selected gator's configuration
3. Backend assembles a prompt and sends it to the LLM API
4. Character-consistent response is displayed to the user

The probe will deliver:
- Simple HTML/JS interface for idea submission
- Complete gator persona configurations (29 personas across 3 panels)
- Panel-specific prompt templates
- Prompt assembly backend
- API integration with LLM service
- Basic response rendering

## Current Status
- ✅ Created JSON schema for gator personas
- ✅ Implemented all 29 gator personas across 3 panels:
  - Evaluation Chamber (13 personas): Rex, Vanessa, Finley, Tessa, Huxley, Maya, Lucius, Ada, Jax, Dr. Cass, Nyx, Kip, Serena
  - Pathfinder Council (9 personas): Zane, Luma, Bram, Ori, Echo, Vex, Nell, Sol, Dr. Vire
  - Legal Panel (7 personas): Lex, Clara, Rana, Gavin, Delphi, Isla, Morven
- ✅ Created panel-specific prompt templates
- ✅ Defined technical architecture and implementation plan
- 🔄 Backend implementation in progress
- 🔄 Frontend development in progress

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

## Project Structure
```
gator-probe-alpha/
├── config/                     # Configuration files
│   ├── personas/               # Gator persona configurations
│   │   ├── evaluation-chamber/ # Evaluation gator personas (13)
│   │   ├── pathfinder-council/ # Pathfinder gator personas (9)
│   │   └── legal-panel/        # Legal gator personas (7)
│   ├── prompt-templates/       # Templates for prompt assembly
│   │   ├── evaluation.json     # Template for evaluation prompts
│   │   ├── pathfinder.json     # Template for guidance prompts
│   │   └── legal.json          # Template for legal analysis prompts
│   └── settings.json           # Global application settings
│
├── src/                        # Application source code (implementation pending)
└── Technical/                  # Technical documentation
    ├── PERSONA_SCHEMA.md       # Schema for gator personas
    ├── PROMPT_ASSEMBLY.md      # Prompt assembly architecture
    ├── API_INTEGRATION.md      # LLM API integration specification
    ├── USER_INTERFACE.md       # User interface design
    └── PROJECT_STRUCTURE.md    # Project file organization
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

## Last Updated
2025-05-12 18:30:00 PDT | SESSION-002 | Claude
