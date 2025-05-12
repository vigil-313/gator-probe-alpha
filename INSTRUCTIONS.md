# VISTA: VALUGATOR Probe Alpha Documentation System

## Getting Started

1. Begin your first session with Claude using the following command:
   
   ```
   # DOCPROTOCOL: Claude will (1)Load system context from SESSION_STATE.md (2)Process new information (3)Update all affected documents (4)Maintain cross-references via unique IDs (5)Version all changes (6)Generate comprehensive session summary (7)Update knowledge graph (8)Prepare handoff state for next session
   ```

2. Start by explaining your project's objectives to Claude

3. End each session with: "Conclude session and prepare handoff"

4. Begin subsequent sessions with: 
   "Resume project using DOCPROTOCOL. Last session ID: [SESSION-ID]"
   (Use the session ID provided at the end of the previous session)

## Context Recovery

If you experience a context loss or session interruption:

1. First, check PROTOCOL.md for core protocol instructions
2. Read SESSION_STATE.md and SESSION_METADATA.json for current status
3. Review the SESSION_PROTOCOL/SESSION_RECOVERY.md file
4. Resume using: "Resume project after context loss. Last session ID: [SESSION-ID]"

## Helper Scripts

The project includes helper scripts to assist with session management:

- **conclude_session.sh**: Prepares metadata for session conclusion
   ```
   ./conclude_session.sh
   ```

- **recover_session.sh**: Prepares metadata for context recovery
   ```
   ./recover_session.sh
   ```

- **generate_dev_session.sh**: Creates Claude Code implementation prompts
   ```
   ./generate_dev_session.sh <task_number>
   ```

- **update_documentation.sh**: Updates documentation after implementation
   ```
   ./update_documentation.sh <task_number> "Summary"
   ```

## Project Workflow

This system supports a complete project lifecycle:

1. **Documentation Phase**
   - Create comprehensive project documentation
   - Define requirements and architecture
   - Establish knowledge base and technical specifications

2. **Development Planning**
   - Break down implementation into discrete tasks
   - Create detailed task descriptions for Claude Code
   - Establish implementation sequence

3. **Planning to Implementation Transition**
   - For each task in Implementation Plan:
     - Create a specific prompt file in Development/Prompts/ directory
     - Create test specifications in Development/Tests/ directory
     - Set up implementation structure in Development/Implementation/

4. **Implementation Phase**
   - Use `generate_dev_session.sh` to create Claude Code prompts
   - Execute implementation tasks in Claude Code
   - Save all code in Development/Implementation/ directory
   - Update documentation with implementation results

## Directory Structure

- **README.md**: Main project overview
- **SESSION_STATE.md**: Current state of knowledge and decisions
- **KNOWLEDGE_GRAPH.md**: Concept relationships and definitions
- **METADATA.json**: Version tracking and cross-references
- **PROTOCOL.md**: Core session protocol documentation
- **SESSION_METADATA.json**: Session status tracking
- **Executive/**: High-level documentation for executives
- **Management/**: Project management documentation
- **Technical/**: Technical specifications and design
- **Development/**: Detailed implementation documentation
   - **IMPLEMENTATION_PLAN.md**: Task breakdown and implementation sequence
   - **TEST_STRATEGY.md**: Overall testing approach and validation criteria
   - **PROMPT_SEQUENCES.md**: Master template for Claude Code prompt structure
   - **Implementation/**: All actual code implementation files
   - **Tests/**: Specification files for what should be tested
   - **Prompts/**: Individual Claude Code prompt files (one per task)
- **SESSION_PROTOCOL/**: Protocol templates and recovery procedures
- **CLAUDE_MUST_READ_THIS_FIRST/**: Reference materials for Claude
- **.claude/commands/**: Custom slash commands for Claude Code

## Session Status Indicators

- 🟢 **Active**: Session currently in progress
- 🟡 **Concluding**: Session in the process of concluding
- 🔵 **Concluded**: Session properly concluded with handoff
- 🔴 **Interrupted**: Session ended unexpectedly without proper conclusion

## Best Practices

1. **Documentation Sessions**
   - Always follow the session start and end protocols
   - Review SESSION_STATE.md at the beginning of each session
   - Update all relevant documentation with new information
   - Use conclude_session.sh before ending a session

2. **Context Recovery**
   - Use recover_session.sh to prepare for context recovery
   - Follow the procedures in SESSION_PROTOCOL directory
   - Check SESSION_METADATA.json for current status
   - Use the correct recovery command with Claude

3. **Implementation Sessions**
   - Use structured prompts for Claude Code implementation tasks
   - Keep all implementation files in the correct directories
   - Tell Claude to "think hard" for complex problems
   - Verify implementations against requirements

4. **Multi-Session Projects**
   - Maintain clear documentation of current state
   - Cross-reference between documentation and implementation
   - Update SESSION_STATE.md after each implementation session
   - Always properly conclude sessions with the conclusion command
