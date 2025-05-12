# Context Recovery Protocol

## Document ID
[DOC-PROTO-RECOV-1]

## Purpose
This document provides a structured approach to recovering from context loss or session interruption in the VISTA documentation system.

## Context Loss Recovery Protocol

If a session is interrupted or context is lost, follow these steps to restore context:

1. **Begin recovery** with this exact command:
   ```
   Resume project after context loss. Last session ID: [SESSION-ID]
   ```
   Replace [SESSION-ID] with the ID from SESSION_METADATA.json.

2. **Read and internalize critical context**:
   - Review PROTOCOL.md for core session protocols
   - Read SESSION_STATE.md thoroughly to understand current state
   - Check SESSION_METADATA.json for session status
   - Review KNOWLEDGE_GRAPH.md for key concept relationships
   - Examine README.md for project overview

3. **Verify session status** in SESSION_METADATA.json:
   - If status is "active" - resume the interrupted session
   - If status is "concluded" - prepare to start the next session
   - If status is "interrupted" - resume from last stable state

4. **Restore session continuity**:
   - Update SESSION_METADATA.json "context_status.integrity" to "restored"
   - Increment "context_status.recovery_attempts" by 1
   - Update "context_status.last_verified" timestamp

5. **Continue session** according to the appropriate protocol:
   - For active sessions: Continue with current objectives
   - For concluded sessions: Begin new session with next ID
   - For interrupted sessions: First resolve any incomplete updates

## Potential Context Loss Scenarios

### Scenario 1: Session Still Active
If SESSION_METADATA.json shows "status": "active" but context was lost:
- The session was interrupted unexpectedly
- Continue the active session from current state
- Follow the remaining action items in SESSION_STATE.md

### Scenario 2: Session Properly Concluded
If SESSION_METADATA.json shows "status": "concluded":
- The previous session ended properly
- Start a new session with the next session ID
- Focus on the areas defined in "next_session.focus_areas"

### Scenario 3: Session Improperly Terminated
If SESSION_METADATA.json shows "status": "interrupted":
- The session ended without proper conclusion
- Resume from last stable state
- First complete any pending updates from the interrupted session

## Checklist
- [ ] Used correct context recovery command
- [ ] Read and internalized all critical context
- [ ] Verified current session status
- [ ] Updated SESSION_METADATA.json appropriately
- [ ] Continued session with proper protocol

## Last Updated
2025-05-11 23:12:42 PDT | SESSION-INIT-001 | Claude
