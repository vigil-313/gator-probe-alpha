# VISTA: Comprehensive Documentation System Template

## SYSTEM OVERVIEW
This template establishes a robust documentation system for complex projects requiring iterative planning, research, and design across multiple sessions. It maintains context continuity, supports various audience technical levels, ensures optimal productivity through structured knowledge management, and provides a framework for implementation with Claude Code.

## VERSION INFORMATION
- Current Version: v1.0.0
- Last Updated: 2025-05-09 18:30:00 PDT

## SESSION CONTINUITY PROTOCOL

### Initialization Command
Save this command in your conversation:
```
# DOCPROTOCOL: Claude will (1)Load system context from SESSION_STATE.md (2)Process new information (3)Update all affected documents (4)Maintain cross-references via unique IDs (5)Version all changes (6)Generate comprehensive session summary (7)Update knowledge graph (8)Prepare handoff state for next session
```

### Project Creation
1. Use the included initialization script:
   ```
   ./initialize.sh /path/to/new/project "Project Name"
   ```
2. This script creates the core documentation structure

### Session Start Procedure
1. Begin each session with: "Resume project using DOCPROTOCOL. Last session ID: [ID]"
2. Claude will automatically load SESSION_STATE.md and resume context
3. Provide any new information or direction for the current session

### Session End Procedure
1. End with: "Conclude session and prepare handoff"
2. Claude will update SESSION_STATE.md and provide a session summary
3. Note the session ID for your next interaction

## DOCUMENT STRUCTURE

### Core Documents
Each level contains these mandatory documents:

1. **README.md**
   ```
   # [Level Name]
   
   ## Purpose
   [Clear statement of this level's purpose]
   
   ## Audience
   [Target audience technical level]
   
   ## Document Inventory
   - [Document-ID-1]: [Brief description with link]
   - [Document-ID-2]: [Brief description with link]
   
   ## Sublevel Navigation
   - [Sublevel-ID-1]: [Brief description with link]
   
   ## Last Updated
   [Full timestamp with date and time] | [Session-ID] | [Author]
   ```

2. **SESSION_STATE.md**
   ```
   # Current Session State
   
   ## Session Information
   - Session ID: [Unique-Session-ID]
   - Previous Session: [Previous-Session-ID]
   - Timestamp: [ISO-8601 timestamp]
   - Template Version: [Version]
   
   ## Knowledge State
   [Comprehensive current understanding summary]
   
   ## Decision Record
   - [Decision-ID-1]: [Decision description, rationale, status]
   
   ## Open Questions
   - [Question-ID-1]: [Question description, status]
   
   ## Action Items
   - [Action-ID-1]: [Description, owner, status, deadline]
   
   ## Progress Snapshot
   [Visual progress representation]
   ```

3. **KNOWLEDGE_GRAPH.md**
   ```
   # Knowledge Graph
   
   ## Core Concepts
   - [Concept-ID-1]
     - Definition: [Concise definition]
     - Related: [Concept-ID-2], [Concept-ID-4]
     - Documents: [Document-ID-3], [Document-ID-7]
   
   ## Relationships
   1. [Concept-ID-1] → [Relationship] → [Concept-ID-2]
   
   ## Visual Representation
   [Markdown representation of knowledge graph]
   ```

4. **METADATA.json**
   ```json
   {
     "project": "[Project Name]",
     "version": "[Semantic Version]",
     "last_updated": "[ISO-8601 timestamp]",
     "last_session_id": "[Session-ID]",
     "document_versions": {
       "[Document-ID-1]": {
         "version": "[Version]",
         "last_updated": "[Timestamp]",
         "change_type": "[Addition|Modification|Deletion]"
       }
     },
     "audience_levels": [
       {
         "id": "[Level-ID]",
         "name": "[Level Name]",
         "technical_depth": "[1-5 scale]"
       }
     ],
     "cross_references": [
       {
         "source": "[Document-ID-1]:[Section-ID]",
         "target": "[Document-ID-2]:[Section-ID]",
         "relationship": "[Explains|Depends on|References]"
       }
     ]
   }
   ```

### Audience-Specific Documentation

Create dedicated directories for each audience level:

1. **Executive/**
   - High-level summaries
   - Visual dashboards
   - Strategic impact assessments

2. **Management/**
   - Project timelines
   - Resource allocations
   - Risk assessments

3. **Technical/**
   - Design specifications
   - Implementation details
   - Technical requirements

4. **Development/**
   - Implementation plan with discrete tasks
   - Ready-to-use Claude Code prompts
   - Testing strategy and validation criteria
   - Component-specific documentation

## VERSION CONTROL PROCEDURES

1. **Document Versioning**
   - Use semantic versioning (MAJOR.MINOR.PATCH)
   - Major: Breaking changes to document structure
   - Minor: Content additions that don't change existing information
   - Patch: Corrections or clarifications

2. **Change Tracking**
   - Each substantial change receives a unique Change-ID
   - Link changes to Session-IDs
   - Record before/after states for significant changes

3. **Conflict Resolution**
   - Prioritize newer information when conflicts arise
   - Document conflicting viewpoints with attribution
   - Flag unresolved conflicts for human review

## PROGRESS VISUALIZATION

1. **Progress Metrics**
   - Document completeness percentage
   - Open questions ratio
   - Decision completion rate

2. **Visual Representations**
   - Use markdown-compatible progress bars
   - Create hierarchy completion heat maps
   - Generate decision tree visualizations

3. **Status Indicators**
   - 🟢 Complete/Resolved
   - 🟡 In Progress/Partial
   - 🔴 Not Started/Blocked
   - ⚪ Not Applicable

## CROSS-REFERENCING SYSTEM

1. **Unique Identifiers**
   - Documents: DOC-[Level]-[Type]-[Number]
   - Sections: SEC-[DocID]-[Number]
   - Concepts: CON-[Category]-[Number]
   - Decisions: DEC-[Session]-[Number]

2. **Reference Format**
   ```
   [Reference Type] [[ID](path/to/document#section)]
   ```

3. **Automatic Reference Validation**
   - Claude verifies all references at session end
   - Flags broken references for repair
   - Updates references when documents change

## KNOWLEDGE MANAGEMENT

1. **Knowledge Capture**
   - Extract key concepts from discussions
   - Create formal definitions for important terms
   - Map relationships between concepts

2. **Information Classification**
   - Facts: Verified information
   - Assumptions: Working hypotheses
   - Questions: Unresolved inquiries
   - Decisions: Concluded determinations

3. **Context Preservation**
   - Record rationale behind all decisions
   - Document alternatives considered
   - Preserve key discussion points

## IMPLEMENTATION PHASES

1. **Initialization** (Single Session)
   - Create base directory structure
   - Initialize core documents
   - Establish session state tracking

2. **Knowledge Foundation** (2-3 Sessions)
   - Populate initial knowledge graph
   - Define core concepts
   - Establish audience levels

3. **Expansion** (Ongoing)
   - Build out hierarchical documentation
   - Develop audience-specific content
   - Enhance cross-references

4. **Refinement** (Periodic)
   - Review and update documentation
   - Resolve open questions
   - Improve clarity and consistency

5. **Development Planning** (2-3 Sessions)
   - Create implementation tasks breakdown
   - Define component relationships
   - Establish development sequence
   - Craft detailed Claude Code prompts

6. **Implementation** (Task-based Sessions)
   - Execute Claude Code implementation sessions using the enhanced prompt structure
   - Use custom slash commands for efficient workflows
   - Validate each component through verification sessions
   - Update development documentation and track progress
   - Integrate implementation insights back into documentation

7. **Maintenance** (Continuous)
   - Update with new information
   - Archive obsolete content
   - Optimize navigation and references

## GETTING STARTED

1. Use the initialization script to create your project structure:
   ```
   ./initialize.sh /path/to/new/project "Project Name"
   ```

2. Review the INSTRUCTIONS.md file in your new project directory

3. Start your first session with Claude using the DOCPROTOCOL command

4. Follow the session start/end procedures for all interactions

Remember: Consistency in following the protocol is essential for maintaining continuity across sessions.