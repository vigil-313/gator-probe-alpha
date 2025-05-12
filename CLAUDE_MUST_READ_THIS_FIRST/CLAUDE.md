# VISTA: CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Core Commands
- To create a new project: `./initialize.sh /path/to/new/project "Project Name"`
- To create examples: `mkdir -p examples/my_example && ./initialize.sh examples/my_example "Example Name"`
- To generate a Claude Code implementation session: `./generate_dev_session.sh <task_number>`
- To create a documentation update after implementation: `./update_documentation.sh <task_number> [summary]`

## Workflow Patterns
- **Explore → Plan → Code → Document → Commit**: First understand the codebase, create a plan, implement code, update documentation, then commit
- **Test-First Development**: Write tests before implementation to provide clear targets
- **Visual Iteration**: Use screenshots/mockups as reference for UI development
- **Multi-Claude Verification**: Use separate Claude sessions for implementation and verification
- **Implementation-Documentation Cycle**: After each implementation task, update documentation to maintain consistency

## Documentation Guidelines
- **Documentation Format**: Use Markdown for all documentation files
- **JSON Structure**: Follow the schema in METADATA.json template
- **Naming**: 
  - Use defined ID formats for all references (DOC-, CON-, DEC- prefixes)
  - Maintain consistent naming patterns across all documents
- **Version Tracking**: Include version information in SESSION_STATE.md
- **Cross-References**: Maintain proper cross-reference format as defined in template
- **Status Indicators**: Use consistent emoji status indicators (🟢🟡🔴⚪)

## Implementation Guidelines
- **Prompt Structure**: Follow the template in Development/PROMPT_SEQUENCES.md
- **Task Breakdown**: Keep implementation tasks small enough for Claude Code context window
- **Planning First**: Always create a plan before coding (use "think hard" for complex problems)
- **Validation**: Include clear validation criteria for each implementation task
- **Cross-References**: Link implementation tasks to relevant documentation
- **Helper Script**: Use `generate_dev_session.sh` to extract prompts for Claude Code
- **Prompt Naming**: Always name task prompt files following the pattern `TASK{N}_{TASK_NAME}.md` where N is the task number

## Task Prompt File Testing
- Before completing a planning session, verify that `generate_dev_session.sh` can find and process all created task prompt files
- Test by running: `./generate_dev_session.sh <task_number>` for each created prompt
- Ensure all file names strictly follow the pattern `TASK{N}_{TASK_NAME}.md`

## Custom Slash Commands
- Use slash commands from the `.claude/commands/` directory for standardized workflows
- Available commands: task-breakdown, implement-task, verify-implementation, plan-feature, analyze-code
- Create additional custom commands by adding files to the `.claude/commands/` directory

Always verify document cross-references when making changes.