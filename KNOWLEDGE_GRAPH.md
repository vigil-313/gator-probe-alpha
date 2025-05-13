# Knowledge Graph

## Documentation System Concepts
- [CON-SYS-001]: Documentation System
  - Definition: Structured approach to creating and maintaining project documentation
  - Related: [CON-SYS-002], [CON-SYS-003], [CON-SYS-004]
  - Documents: [DOC-ROOT-README-1], [DOC-ROOT-PROTO-1]

- [CON-SYS-002]: Session Continuity
  - Definition: Maintaining context and progress across multiple interaction sessions
  - Related: [CON-SYS-001], [CON-SYS-004]
  - Documents: [DOC-ROOT-STATE-1]

- [CON-SYS-003]: Audience Levels
  - Definition: Different documentation detail levels tailored to specific reader expertise
  - Related: [CON-SYS-001]
  - Documents: [DOC-ROOT-README-1]

- [CON-SYS-004]: Context Recovery
  - Definition: Process and protocols for restoring session context after interruption or memory loss
  - Related: [CON-SYS-001], [CON-SYS-002]
  - Documents: [DOC-ROOT-PROTO-1], [DOC-PROTO-RECOV-1]

## VALUGATOR Probe Concepts

- [CON-PROBE-001]: Gator Persona
  - Definition: Configuration that defines a specific AI character's expertise, tone, and response patterns
  - Related: [CON-PROBE-002], [CON-PROBE-003], [CON-PROBE-006], [CON-PROBE-007], [CON-PROBE-008]
  - Documents: [DOC-TECH-PERS-1]

- [CON-PROBE-002]: Prompt Assembly
  - Definition: System for combining persona configuration with user input to create effective prompts
  - Related: [CON-PROBE-001], [CON-PROBE-004], [CON-PROBE-009]
  - Documents: [DOC-TECH-PROM-1]

- [CON-PROBE-003]: Persona Configuration Format
  - Definition: JSON schema defining gator personality attributes, tone characteristics, and expertise areas
  - Related: [CON-PROBE-001], [CON-PROBE-002], [CON-PROBE-006], [CON-PROBE-007], [CON-PROBE-008]
  - Documents: [DOC-TECH-PERS-1]

- [CON-PROBE-004]: LLM API Integration
  - Definition: System for communicating with external AI service using provider pattern (Claude initially)
  - Related: [CON-PROBE-002], [CON-PROBE-005], [CON-PROBE-011]
  - Documents: [DOC-TECH-API-1], [DOC-TECH-EXT-1]

- [CON-PROBE-005]: Minimal User Interface
  - Definition: Simple HTML form for pitch submission and response display
  - Related: [CON-PROBE-004]
  - Documents: [DOC-TECH-UI-1]

- [CON-PROBE-006]: Evaluation Chamber
  - Definition: Panel of gator personas focused on startup evaluation and critique
  - Related: [CON-PROBE-001], [CON-PROBE-003], [CON-PROBE-009]
  - Documents: [DOC-TECH-PERS-1]

- [CON-PROBE-007]: Pathfinder Council
  - Definition: Panel of gator personas focused on guidance and direction
  - Related: [CON-PROBE-001], [CON-PROBE-003], [CON-PROBE-009]
  - Documents: [DOC-TECH-PERS-1]

- [CON-PROBE-008]: Legal Panel
  - Definition: Panel of gator personas focused on legal risk assessment
  - Related: [CON-PROBE-001], [CON-PROBE-003], [CON-PROBE-009], [CON-PROBE-010]
  - Documents: [DOC-TECH-PERS-1]

- [CON-PROBE-009]: Panel-Specific Prompt Templates
  - Definition: Structured templates tailored to different panel types
  - Related: [CON-PROBE-002], [CON-PROBE-006], [CON-PROBE-007], [CON-PROBE-008]
  - Documents: [DOC-TECH-PROM-1]

- [CON-PROBE-010]: Legal Gator Limits
  - Definition: Capabilities, limitations, and appropriate usage guidelines for legal AI personas
  - Related: [CON-PROBE-008], [CON-PROBE-009]
  - Documents: [DOC-GATOR-LAW-TRUTH-001]

- [CON-PROBE-011]: Extensibility Design Pattern
  - Definition: Architectural approach enabling future enhancements while maintaining minimal MVP implementation
  - Related: [CON-PROBE-002], [CON-PROBE-004], [CON-PROBE-005]
  - Documents: [DOC-TECH-EXT-1], [DOC-DEV-IMPL-EXT-1]

- [CON-PROBE-012]: Project Structure
  - Definition: Node.js-based implementation architecture with modular components and clear separation of concerns
  - Related: [CON-PROBE-011], [CON-PROBE-013]
  - Documents: [DOC-DEV-IMPL-1]

- [CON-PROBE-013]: ES Modules Pattern
  - Definition: Modern JavaScript module system used for better maintainability and future compatibility
  - Related: [CON-PROBE-012]
  - Documents: [DOC-DEV-IMPL-1]

## System Relationships
1. [CON-SYS-001] → implements → [CON-SYS-002]
2. [CON-SYS-001] → organizes by → [CON-SYS-003]
3. [CON-SYS-001] → ensures → [CON-SYS-004]
4. [CON-SYS-002] → requires → [CON-SYS-004]

## Probe Relationships
1. [CON-PROBE-001] → defined by → [CON-PROBE-003]
2. [CON-PROBE-001] → categorized into → [CON-PROBE-006], [CON-PROBE-007], [CON-PROBE-008]
3. [CON-PROBE-002] → combines → [CON-PROBE-001] with user input
4. [CON-PROBE-002] → uses → [CON-PROBE-009]
5. [CON-PROBE-002] → sends to → [CON-PROBE-004]
6. [CON-PROBE-004] → returns to → [CON-PROBE-005]
7. [CON-PROBE-005] → displays → gator response
8. [CON-PROBE-006] → uses template → [CON-PROBE-009]
9. [CON-PROBE-007] → uses template → [CON-PROBE-009]
10. [CON-PROBE-008] → uses template → [CON-PROBE-009]
11. [CON-PROBE-008] → constrained by → [CON-PROBE-010]
12. [CON-PROBE-010] → informs → [CON-PROBE-009] for legal panel
13. [CON-PROBE-011] → structures → [CON-PROBE-002], [CON-PROBE-004], [CON-PROBE-005]
14. [CON-PROBE-011] → enables → future enhancements
15. [CON-PROBE-004] → implements → provider pattern
16. [CON-PROBE-012] → implements → [CON-PROBE-013]
17. [CON-PROBE-012] → organizes → all implementation modules
18. [CON-PROBE-013] → enhances → maintainability and compatibility

## Visual Representation
### Documentation System
```
Documentation System
├── implements → Session Continuity
│   └── requires → Context Recovery
├── organizes by → Audience Levels
└── ensures → Context Recovery
```

### VALUGATOR Probe - Execution Flow
```
┌───────────────┐     ┌─────────────────────────┐
│ USER SUBMITS  │     │      GATOR PERSONA      │
│ STARTUP IDEA  │     │     (CON-PROBE-001)     │
└───────┬───────┘     └───────────┬─────────────┘
        │                         │
        │             ┌───────────┴─────────────┐
        │             │                         │
        │    ┌────────▼─────┐ ┌────────▼─────┐ ┌▼───────────┐
        │    │  Evaluation  │ │  Pathfinder  │ │   Legal    │◄─────┐
        │    │   Chamber    │ │   Council    │ │   Panel    │      │
        │    │(CON-PROBE-006)│ │(CON-PROBE-007)│ │(CON-PROBE-008)│      │
        │    └────────┬─────┘ └────────┬─────┘ └┬───────────┘      │
        │             │                │        │                   │
        │             └────────┬───────┴────────┘                   │
        │                      │                                    │
        │             ┌────────▼────────┐              ┌────────────▼─────────┐
        │             │  Panel Template │              │   Legal Gator Limits  │
        │             │(CON-PROBE-009)  │              │   (CON-PROBE-010)    │
        │             └────────┬────────┘              └──────────────────────┘
        │                      │
        └──────────┬───────────┘
                   │                       ┌───────────────────────┐
                   │    ┌──────────────────┤  Extensibility Design │
                   │    │                  │  (CON-PROBE-011)      │
                   ▼    ▼                  └───────────────────────┘
          ┌─────────────────┐
          │ PROMPT ASSEMBLY │
          │(CON-PROBE-002)  │
          └────────┬────────┘
                   │
                   │                       ┌───────────────────────┐
                   │    ┌──────────────────┤  Provider Pattern     │
                   ▼    ▼                  │  (CON-PROBE-011)      │
          ┌─────────────────┐              └───────────────────────┘
          │   LLM API       │
          │(CON-PROBE-004)  │
          └────────┬────────┘
                   │
                   │                       ┌───────────────────────┐
                   │    ┌──────────────────┤  Minimal Implementation│
                   ▼    ▼                  │  (CON-PROBE-011)      │
          ┌─────────────────┐              └───────────────────────┘
          │  USER INTERFACE │
          │ DISPLAYS RESULT │
          │(CON-PROBE-005)  │
          └─────────────────┘
```

### Project Structure
```
┌─ Node.js Project Structure ────────────────────────┐
│ (CON-PROBE-012)                                    │
│                                                    │
│ ┌────────────────┐      ┌────────────────┐         │
│ │  Configuration │      │ Express Server │         │
│ │   - package.json     │   - server.js   │         │
│ │   - .eslintrc.js     │   - middleware  │         │
│ │   - jest.config.js   │   - routes      │         │
│ └────────┬───────┘      └────────────────┘         │
│          │                                         │
│          ▼                                         │
│ ┌─────────────────────────────────────────────┐    │
│ │           Module Organization               │    │
│ │                                             │    │
│ │  ┌──────────┐ ┌──────────┐ ┌──────────┐     │    │
│ │  │  Config  │ │  Prompt  │ │   API    │     │    │
│ │  │  Module  │ │  Module  │ │  Client  │     │    │
│ │  └──────────┘ └──────────┘ └──────────┘     │    │
│ │                                             │    │
│ │  ┌──────────┐ ┌──────────┐ ┌──────────┐     │    │
│ │  │  Utils   │ │  Public  │ │  Tests   │     │    │
│ │  │          │ │   UI     │ │          │     │    │
│ │  └──────────┘ └──────────┘ └──────────┘     │    │
│ └─────────────────────────────────────────────┘    │
│                      │                             │
│                      ▼                             │
│ ┌─────────────────────────────────────────────┐    │
│ │           ES Modules Pattern                │    │
│ │           (CON-PROBE-013)                   │    │
│ │  - type: "module" in package.json          │    │
│ │  - import/export syntax                     │    │
│ │  - Modern JavaScript practices              │    │
│ └─────────────────────────────────────────────┘    │
│                                                    │
└────────────────────────────────────────────────────┘
```

### Persona Configuration Structure
```
┌─ Gator Persona ────────────────────────────┐
│                                            │
│ ┌────────────────┐      ┌────────────────┐ │
│ │  Core Identity │      │Visual          │ │
│ │  - ID          │      │Appearance      │ │
│ │  - Name        │      │- Description   │ │
│ │  - Nickname    │◄────►│- Attire        │ │
│ │  - Archetype   │      │- Expressions   │ │
│ └────────┬───────┘      └────────────────┘ │
│          │                                 │
│ ┌────────▼───────┐      ┌────────────────┐ │
│ │  Expertise     │      │Character       │ │
│ │  - Areas       │◄────►│Dynamics        │ │
│ │  - Style       │      │- Interactions  │ │
│ │  - Tone        │      │- Relationships │ │
│ └────────┬───────┘      └────────────────┘ │
│          │                                 │
│ ┌────────▼───────┐      ┌────────────────┐ │
│ │  Response      │      │Evaluation      │ │
│ │  Patterns      │◄────►│Focus           │ │
│ │  - Intro Forms │      │- Concerns      │ │
│ │  - Techniques  │      │- Questions     │ │
│ │  - Conclusions │      │- Red Flags     │ │
│ │  - Vocabulary  │      │- Indicators    │ │
│ └────────────────┘      └────────────────┘ │
│                                            │
└────────────────────────────────────────────┘
```

### Legal Persona Trust Framework
```
┌─ Legal Gator Trust Framework ──────────────────────┐
│                                                    │
│ ┌─────────────────┐       ┌──────────────────────┐ │
│ │ CAN DO (✅)      │       │ CANNOT DO (❌)        │ │
│ │ - Explain terms │       │ - Interpret laws     │ │
│ │ - Identify risks│       │ - Determine validity │ │
│ │ - Ask questions │       │ - Provide clearance  │ │
│ │ - Educate users │       │ - Replace lawyers    │ │
│ └─────────────────┘       └──────────────────────┘ │
│                                                    │
│ ┌──────────────────────────────────────────────┐   │
│ │ MANDATORY DISCLAIMER                          │   │
│ │ "I am an AI character, not a licensed        │   │
│ │ attorney. This analysis is for educational    │   │
│ │ purposes only and does not constitute legal   │   │
│ │ advice. Consult qualified legal professionals │   │
│ │ before making any legal decisions."           │   │
│ └──────────────────────────────────────────────┘   │
│                                                    │
└────────────────────────────────────────────────────┘
```

## Last Updated
2025-05-13T22:41:05Z | SESSION-006 | Claude