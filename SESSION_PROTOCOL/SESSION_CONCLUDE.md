# Session Conclusion Protocol

## Document ID
[DOC-PROTO-CONCL-1]

## Purpose
This document provides a structured approach to properly concluding a session with the VISTA documentation system.

## Standard Conclusion Protocol

1. **End the session** with this exact command:
   ```
   Conclude session and prepare handoff
   ```

2. **Verify session state updates** have been completed:
   - SESSION_STATE.md has been updated with:
     - Comprehensive session summary
     - Updated knowledge state
     - New decisions, if any
     - Resolved questions, if any
     - Completed action items, if any
     - Progress snapshot updates
     - Next session focus areas
   - SESSION_METADATA.json updated with:
     - Session status changed to "concluded"
     - Actual end timestamp
     - Next session ID defined

3. **Confirm document updates** are complete:
   - All relevant documents have been updated
   - Cross-references maintained
   - Knowledge graph updated
   - Version information updated

4. **Note next steps** for future reference:
   - Next session focus areas are clearly defined
   - Any pending action items are documented
   - Required preparation for next session is listed

## Checklist
- [ ] Used correct session conclusion command
- [ ] Verified SESSION_STATE.md updates
- [ ] Confirmed SESSION_METADATA.json updates
- [ ] Validated all document changes
- [ ] Documented next session focus areas

## Last Updated
2025-05-11 23:12:42 PDT | SESSION-INIT-001 | Claude
