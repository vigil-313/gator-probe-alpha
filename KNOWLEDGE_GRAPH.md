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
  - Related: [CON-PROBE-001], [CON-PROBE-004], [CON-PROBE-009], [CON-PROBE-016], [CON-PROBE-017]
  - Documents: [DOC-TECH-PROM-1]

- [CON-PROBE-003]: Persona Configuration Format
  - Definition: JSON schema defining gator personality attributes, tone characteristics, and expertise areas
  - Related: [CON-PROBE-001], [CON-PROBE-002], [CON-PROBE-006], [CON-PROBE-007], [CON-PROBE-008]
  - Documents: [DOC-TECH-PERS-1]

- [CON-PROBE-004]: LLM API Integration
  - Definition: System for communicating with external AI service using provider pattern (Claude initially)
  - Related: [CON-PROBE-002], [CON-PROBE-005], [CON-PROBE-011], [CON-PROBE-020], [CON-PROBE-021]
  - Documents: [DOC-TECH-API-1], [DOC-TECH-EXT-1]

- [CON-PROBE-005]: Enhanced User Interface
  - Definition: Responsive design with panel-based navigation, themed UI elements, and simulation mode
  - Related: [CON-PROBE-004], [CON-PROBE-028], [CON-PROBE-029], [CON-PROBE-030]
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
  - Related: [CON-PROBE-002], [CON-PROBE-004], [CON-PROBE-005], [CON-PROBE-020]
  - Documents: [DOC-TECH-EXT-1], [DOC-DEV-IMPL-EXT-1]

- [CON-PROBE-012]: Project Structure
  - Definition: Node.js-based implementation architecture with modular components and clear separation of concerns
  - Related: [CON-PROBE-011], [CON-PROBE-013]
  - Documents: [DOC-DEV-IMPL-1]

- [CON-PROBE-013]: ES Modules Pattern
  - Definition: Modern JavaScript module system used for better maintainability and future compatibility
  - Related: [CON-PROBE-012], [CON-PROBE-014]
  - Documents: [DOC-DEV-IMPL-1]

- [CON-PROBE-014]: Test Mocking Strategy
  - Definition: Approach for isolating components during testing by replacing dependencies with controlled implementations
  - Related: [CON-PROBE-013], [CON-PROBE-015]
  - Documents: [DOC-DEV-TEST-1]

- [CON-PROBE-015]: Jest Testing Framework
  - Definition: JavaScript testing system used for unit and integration tests with support for mocking and assertions
  - Related: [CON-PROBE-014]
  - Documents: [DOC-DEV-TEST-1]

- [CON-PROBE-016]: Template Processing System
  - Definition: Subsystem of the prompt assembly module that handles variable replacement, nested property access, and array iterations
  - Related: [CON-PROBE-002], [CON-PROBE-017], [CON-PROBE-009]
  - Documents: [DOC-TECH-PROM-1]

- [CON-PROBE-017]: PromptError Handling System
  - Definition: Structured error handling approach with specific error codes, detailed messages, and error propagation
  - Related: [CON-PROBE-002], [CON-PROBE-016], [CON-PROBE-018], [CON-PROBE-022]
  - Documents: [DOC-TECH-PROM-1]

- [CON-PROBE-018]: Test Isolation Pattern
  - Definition: Approach for testing components by replacing dependencies with controlled mock implementations
  - Related: [CON-PROBE-014], [CON-PROBE-017], [CON-PROBE-019]
  - Documents: [DOC-DEV-TEST-1]

- [CON-PROBE-019]: Error Code Validation System
  - Definition: Testing strategy for verifying error types, codes and propagation in component interactions
  - Related: [CON-PROBE-017], [CON-PROBE-018], [CON-PROBE-022]
  - Documents: [DOC-DEV-TEST-1]

- [CON-PROBE-020]: Provider Pattern Implementation
  - Definition: Design pattern that abstracts LLM API interactions through a common interface with provider-specific implementations
  - Related: [CON-PROBE-004], [CON-PROBE-011], [CON-PROBE-021]
  - Documents: [DOC-TECH-API-1], [DOC-DEV-IMPL-EXT-1]

- [CON-PROBE-021]: API Client Retry Mechanism
  - Definition: System for handling transient API failures with exponential backoff and categorized error retries
  - Related: [CON-PROBE-004], [CON-PROBE-020], [CON-PROBE-022]
  - Documents: [DOC-TECH-API-1]

- [CON-PROBE-022]: ApiError Handling System
  - Definition: Structured API error handling approach with specific error codes, status mapping, and error propagation
  - Related: [CON-PROBE-017], [CON-PROBE-019], [CON-PROBE-021]
  - Documents: [DOC-TECH-API-1]

- [CON-PROBE-023]: LLM API Client Test Strategy
  - Definition: Comprehensive test suite for API client with component isolation, retry verification, and error handling validation
  - Related: [CON-PROBE-014], [CON-PROBE-018], [CON-PROBE-020], [CON-PROBE-021]
  - Documents: [DOC-DEV-TEST-1]

- [CON-PROBE-024]: Express Server API Architecture
  - Definition: RESTful API design for the Express server with validation, error handling, and proper resource organization
  - Related: [CON-PROBE-002], [CON-PROBE-004], [CON-PROBE-025], [CON-PROBE-026]
  - Documents: [DOC-TECH-API-1]

- [CON-PROBE-025]: API Request Validation System
  - Definition: Middleware-based validation system for ensuring API request data meets format and content requirements
  - Related: [CON-PROBE-024], [CON-PROBE-026], [CON-PROBE-017]
  - Documents: [DOC-TECH-API-1]

- [CON-PROBE-026]: Unified Error Handling Middleware
  - Definition: Express middleware that provides consistent error responses, proper HTTP status codes, and error type mapping
  - Related: [CON-PROBE-024], [CON-PROBE-025], [CON-PROBE-022], [CON-PROBE-017]
  - Documents: [DOC-TECH-API-1]

- [CON-PROBE-027]: Server Test Spy Strategy
  - Definition: Testing approach using Jest's spyOn functionality for more flexible and less intrusive dependency mocking
  - Related: [CON-PROBE-014], [CON-PROBE-018], [CON-PROBE-023]
  - Documents: [DOC-DEV-TEST-1]

- [CON-PROBE-028]: Panel-Based Navigation System
  - Definition: UI organization approach that groups personas by panel type with visual differentiation and themed elements
  - Related: [CON-PROBE-005], [CON-PROBE-029], [CON-PROBE-006], [CON-PROBE-007], [CON-PROBE-008]
  - Documents: [DOC-TECH-UI-1]

- [CON-PROBE-029]: Dynamic UI Theming
  - Definition: System that changes UI colors and styling based on selected panel type using CSS variables
  - Related: [CON-PROBE-005], [CON-PROBE-028], [CON-PROBE-030]
  - Documents: [DOC-TECH-UI-1]

- [CON-PROBE-030]: Simulation Mode
  - Definition: Frontend feature that simulates API responses for demonstration without requiring backend connection
  - Related: [CON-PROBE-005], [CON-PROBE-031]
  - Documents: [DOC-TECH-UI-1]

- [CON-PROBE-031]: Frontend Error Handling Strategy
  - Definition: Comprehensive approach to handling UI errors with element existence checks and graceful degradation
  - Related: [CON-PROBE-005], [CON-PROBE-030]
  - Documents: [DOC-TECH-UI-1]

- [CON-PROBE-032]: Real API Integration
  - Definition: System for connecting to actual Claude API with proper authentication and response handling
  - Related: [CON-PROBE-004], [CON-PROBE-020], [CON-PROBE-033]
  - Documents: [DOC-TECH-API-1]

- [CON-PROBE-033]: Environment-based Configuration
  - Definition: System for managing sensitive configuration values like API keys via environment variables
  - Related: [CON-PROBE-032], [CON-PROBE-034]
  - Documents: [DOC-TECH-API-1]

- [CON-PROBE-034]: Operation Mode Toggle
  - Definition: Configuration system that allows switching between simulation and real API modes
  - Related: [CON-PROBE-030], [CON-PROBE-032], [CON-PROBE-033]
  - Documents: [DOC-TECH-API-1]

- [CON-PROBE-035]: User Testing Framework
  - Definition: Structured approach to conducting end-to-end user testing with real users
  - Related: [CON-PROBE-032], [CON-PROBE-036]
  - Documents: [DOC-DEV-TEST-1]

- [CON-PROBE-036]: Feedback Capture System
  - Definition: Mechanisms for collecting and analyzing user feedback during testing
  - Related: [CON-PROBE-035], [CON-PROBE-037]
  - Documents: [DOC-DEV-TEST-1]

- [CON-PROBE-037]: User Experience Optimization
  - Definition: Process for making adjustments based on user testing feedback
  - Related: [CON-PROBE-035], [CON-PROBE-036]
  - Documents: [DOC-TECH-UI-1]

- [CON-PROBE-038]: End-to-End Testing Framework
  - Definition: Comprehensive testing approach that verifies full system functionality and component integration
  - Related: [CON-PROBE-014], [CON-PROBE-018], [CON-PROBE-023], [CON-PROBE-027], [CON-PROBE-039]
  - Documents: [DOC-DEV-TEST-1]

- [CON-PROBE-039]: Manual Testing Protocol
  - Definition: Structured checklist-based approach for human verification of system functionality beyond automated tests
  - Related: [CON-PROBE-038], [CON-PROBE-035]
  - Documents: [DOC-DEV-TEST-1]

- [CON-PROBE-040]: System Performance Validation
  - Definition: Testing methodology for verifying system performance under concurrent load and resource usage
  - Related: [CON-PROBE-038], [CON-PROBE-021], [CON-PROBE-041]
  - Documents: [DOC-DEV-TEST-1]

- [CON-PROBE-041]: Complete Flow Verification
  - Definition: Testing approach that validates the entire user journey from initial load to response display
  - Related: [CON-PROBE-038], [CON-PROBE-039], [CON-PROBE-005]
  - Documents: [DOC-DEV-TEST-1]

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
15. [CON-PROBE-004] → implements → [CON-PROBE-020]
16. [CON-PROBE-012] → implements → [CON-PROBE-013]
17. [CON-PROBE-012] → organizes → all implementation modules
18. [CON-PROBE-013] → enhances → maintainability and compatibility
19. [CON-PROBE-014] → supports → unit testing isolation
20. [CON-PROBE-015] → implements → [CON-PROBE-014]
21. [CON-PROBE-015] → ensures → code reliability
22. [CON-PROBE-016] → powers → [CON-PROBE-002]
23. [CON-PROBE-016] → processes → [CON-PROBE-009] templates
24. [CON-PROBE-017] → provides → structured error handling
25. [CON-PROBE-018] → enables → thorough unit testing
26. [CON-PROBE-019] → validates → error handling systems
27. [CON-PROBE-020] → abstracts → LLM provider differences
28. [CON-PROBE-020] → enables → multi-provider support
29. [CON-PROBE-021] → improves → API interaction reliability
30. [CON-PROBE-021] → implements → exponential backoff
31. [CON-PROBE-022] → categorizes → API errors by type
32. [CON-PROBE-022] → extends → [CON-PROBE-017] approach for APIs
33. [CON-PROBE-023] → verifies → [CON-PROBE-020], [CON-PROBE-021], [CON-PROBE-022]
34. [CON-PROBE-023] → applies → [CON-PROBE-014], [CON-PROBE-018] for API testing
35. [CON-PROBE-024] → exposes → RESTful API endpoints
36. [CON-PROBE-024] → integrates with → [CON-PROBE-002], [CON-PROBE-004]
37. [CON-PROBE-024] → uses → [CON-PROBE-025], [CON-PROBE-026] for request handling
38. [CON-PROBE-025] → ensures → valid API requests
39. [CON-PROBE-025] → prevents → malformed data processing
40. [CON-PROBE-026] → converts → component errors to HTTP responses
41. [CON-PROBE-026] → handles → [CON-PROBE-017], [CON-PROBE-022] error types
42. [CON-PROBE-027] → enhances → server testing isolation
43. [CON-PROBE-027] → improves upon → [CON-PROBE-014], [CON-PROBE-018]
44. [CON-PROBE-028] → organizes → UI by panel type
45. [CON-PROBE-028] → enhances → user experience with visual distinctions
46. [CON-PROBE-028] → enables → [CON-PROBE-029] theme switching
47. [CON-PROBE-029] → applies → dynamic styling based on selected panel
48. [CON-PROBE-029] → uses → CSS variables for consistent theming
49. [CON-PROBE-030] → enables → demonstration without backend dependency
50. [CON-PROBE-030] → simulates → API response generation
51. [CON-PROBE-031] → prevents → null reference errors
52. [CON-PROBE-031] → improves → user experience with graceful degradation
53. [CON-PROBE-031] → handles → missing DOM elements
54. [CON-PROBE-032] → replaces → [CON-PROBE-030] simulation mode
55. [CON-PROBE-032] → connects to → real Claude API service
56. [CON-PROBE-032] → requires → [CON-PROBE-033] for API keys
57. [CON-PROBE-033] → secures → sensitive configuration data
58. [CON-PROBE-033] → implements → environment variable pattern
59. [CON-PROBE-034] → enables → switching between real and simulated modes
60. [CON-PROBE-034] → facilitates → testing without API costs
61. [CON-PROBE-035] → validates → system with real users
62. [CON-PROBE-035] → utilizes → [CON-PROBE-036] for feedback
63. [CON-PROBE-036] → captures → user experience issues
64. [CON-PROBE-036] → informs → [CON-PROBE-037] adjustments
65. [CON-PROBE-037] → improves → system based on user feedback
66. [CON-PROBE-037] → finalizes → system for production
67. [CON-PROBE-038] → verifies → complete system functionality
68. [CON-PROBE-038] → validates → component integration
69. [CON-PROBE-038] → implements → [CON-PROBE-041]
70. [CON-PROBE-039] → supplements → [CON-PROBE-038]
71. [CON-PROBE-039] → captures → UI/UX issues not detected by automated tests
72. [CON-PROBE-040] → measures → system performance under load
73. [CON-PROBE-040] → verifies → resource usage and cleanup
74. [CON-PROBE-041] → tests → complete user journey
75. [CON-PROBE-041] → validates → all integration points

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
                   ▼    ▼                  │  (CON-PROBE-020)      │
          ┌─────────────────┐              └───────────────────────┘
          │   LLM API       │
          │(CON-PROBE-004)  │◄─────┐
          └────────┬────────┘      │       ┌───────────────────────┐
                   │               └───────┤  Retry Mechanism      │
                   │                       │  (CON-PROBE-021)      │
                   │                       └───────────────────────┘
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

### LLM API Client Architecture
```
┌─ LLM API Client Architecture ──────────────────────┐
│                                                    │
│ ┌────────────────┐      ┌────────────────────────┐ │
│ │ LLM Client     │      │ Provider Factory       │ │
│ │ - Config mgmt  │◄────►│ - Provider creation    │ │
│ │ - Retry logic  │      │ - Provider selection   │ │
│ │ - Error handling      │ - Factory pattern      │ │
│ └────────┬───────┘      └────────────┬───────────┘ │
│          │                           │             │
│          │          ┌────────────────▼───────────┐ │
│          │          │ BaseProvider Interface     │ │
│          │          │ - generateResponse()       │ │
│          │          │ - validateConfig()         │ │
│          │          └────────────────┬───────────┘ │
│          │                           │             │
│          │                           │             │
│          │         ┌────────────┬────┴─────┐       │
│          │         │            │          │       │
│          │   ┌─────▼──────┐ ┌───▼────┐  ┌──▼────┐  │
│          │   │  Claude    │ │  GPT   │  │ Future│  │
│          │   │  Provider  │ │Provider│  │Provide│  │
│          │   └─────┬──────┘ └────────┘  └───────┘  │
│          │         │                               │
│          │         │                               │
│          └─────────┘                               │
│                                                    │
│ ┌──────────────────────────────────────────────┐   │
│ │          ApiError System                      │   │
│ │ - Error codes for different failure types     │   │
│ │ - Structured error information                │   │
│ │ - HTTP status code mapping                    │   │
│ │ - Error categorization for retry decisions    │   │
│ └──────────────────────────────────────────────┘   │
│                                                    │
└────────────────────────────────────────────────────┘
```

## Last Updated
2025-05-13T22:00:00Z | SESSION-014 | Claude