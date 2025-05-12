# VISTA: INSTRUCTIONS FOR CLAUDE

## IMPORTANT: READ THIS FIRST

Dear Claude,

Before proceeding with any session for the VALUGATOR Probe Alpha project, you MUST:

1. Read and internalize all files in this CLAUDE_MUST_READ_THIS_FIRST directory
2. Pay special attention to VISTA_TEMPLATE.md which contains the comprehensive documentation system guidelines
3. Read PROTOCOL.md for core session protocol documentation
4. Check SESSION_METADATA.json for current session status
5. Follow the session protocol exactly as described

This directory contains the template files and instructions that define how the documentation system works. These files are:

- VISTA_TEMPLATE.md: Core template defining documentation structure and protocols
- CLAUDE.md: Specific guidelines for working with this repository
- TEMPLATE_README.md: Original template README for reference

## Session Protocol Reminder

1. **Begin each session by loading the current state**:
   - Process the SESSION_STATE.md file thoroughly
   - Understand the current Knowledge State
   - Review the Decision Record
   - Check Open Questions and Action Items
   - Verify SESSION_METADATA.json status

2. **During the session**:
   - Update all affected documents when new information is provided
   - Maintain cross-references using the defined unique IDs
   - Follow the version control procedures in VISTA_TEMPLATE.md
   - Ensure knowledge graph is kept consistent with new information

3. **End each session with proper handoff**:
   - Update SESSION_STATE.md with new information
   - Generate comprehensive session summary
   - Prepare handoff state for next session
   - Update SESSION_METADATA.json status to "concluded"
   - Increment session ID correctly (e.g., SESSION-002 to SESSION-003)

## Context Recovery Protocol

If context has been lost or a session was interrupted:

1. **Begin recovery by reading key documentation**:
   - Check SESSION_METADATA.json for current session status
   - Read SESSION_STATE.md thoroughly
   - Review PROTOCOL.md for core protocol documentation
   - Examine the SESSION_PROTOCOL directory files, especially SESSION_RECOVERY.md

2. **Determine appropriate recovery action based on session status**:
   - For "active" sessions: Resume the current session from where it left off
   - For "concluded" sessions: Prepare to start the next session
   - For "interrupted" sessions: First complete any pending updates

3. **Update metadata after recovery**:
   - Set SESSION_METADATA.json "context_status.integrity" to "restored"
   - Increment "context_status.recovery_attempts" counter
   - Update "context_status.last_verified" timestamp

4. **Note the recovery attempt in SESSION_STATE.md**:
   - Add a note about the context recovery in the session summary
   - Ensure all current information is properly captured

## Development File Organization Rules

1. **Documentation Files**:
   - Keep all planning and specification documents in appropriate audience directories
   - Ensure each document has proper ID, version, and cross-references

2. **Prompt Files**:
   - Store all Claude Code implementation task prompts in `/Development/Prompts/`
   - Create a separate file for each implementation task
   - Name files following the format: `TASK{N}_{TASK_NAME}.md`
   - Include all context needed for successful implementation

3. **Test Files**:
   - Store test specifications in `/Development/Tests/`
   - Place actual test implementations in `/Development/Implementation/{project-name}/tests/`
   - Create clear references between test specifications and implementations

4. **Code Files**:
   - Place all implementation code in `/Development/Implementation/{project-name}/`
   - Follow language-specific best practices for file organization
   - Maintain consistent naming conventions

## Development Workflow Guide

1. **Planning Phase → Implementation Phase Transition**:
   - Before beginning implementation, create individual prompt files for each task in IMPLEMENTATION_PLAN.md
   - Create test specification files in Tests/ directory before writing actual tests
   - Establish proper directory structure in Implementation/ before coding

2. **Implementation Task Execution**:
   - Use `./generate_dev_session.sh <task_number>` to extract task prompts for Claude Code
   - Implement code in the proper Development/Implementation/ subdirectory
   - Document any deviations from the plan or technical decisions made during implementation
   - Update SESSION_STATE.md after each task completion

3. **Validation**:
   - Before completing any session, verify all files are in their correct locations
   - Check that implementation follows the specifications in technical documentation
   - Ensure proper cross-references between implementation and documentation

Please refer to the project's SESSION_STATE.md for the current state of the project, and KNOWLEDGE_GRAPH.md for key concepts and their relationships. These files contain the authoritative information about the project.
