# Session Metadata Guide

## Document ID
[DOC-PROTO-META-1]

## Purpose
This document explains the structure and usage of the SESSION_METADATA.json file, which tracks session status and context integrity.

## File Purpose
SESSION_METADATA.json provides critical information about:
- Current session status and details
- Session history
- Next session planning
- Context integrity status

## File Structure
The file contains these main sections:

### 1. Current Session
```json
"current_session": {
  "id": "SESSION-XXX",
  "status": "[active|concluding|concluded|interrupted]",
  "start_time": "ISO timestamp",
  "expected_end_time": "ISO timestamp or null",
  "actual_end_time": "ISO timestamp or null"
}
```

### 2. Session History
```json
"session_history": [
  {
    "id": "SESSION-XXX",
    "status": "concluded",
    "start_time": "ISO timestamp",
    "end_time": "ISO timestamp",
    "summary": "Brief session summary"
  }
]
```

### 3. Next Session
```json
"next_session": {
  "id": "SESSION-XXX",
  "focus_areas": [
    "Focus area 1",
    "Focus area 2"
  ]
}
```

### 4. Context Status
```json
"context_status": {
  "integrity": "[complete|restored|partial|compromised]",
  "last_verified": "ISO timestamp",
  "recovery_attempts": 0
}
```

## Status Values

### Session Status
- **active**: Session currently in progress
- **concluding**: Session in process of concluding
- **concluded**: Session properly ended with handoff
- **interrupted**: Session ended unexpectedly

### Context Integrity
- **complete**: All context is intact and verified
- **restored**: Context was lost but has been restored
- **partial**: Some context may be missing
- **compromised**: Significant context loss occurred

## Usage In Protocols
- Session Start: Updates "current_session" fields
- Session Conclusion: Moves current to history, updates next
- Context Recovery: Updates integrity, increments recovery attempts

## Last Updated
2025-05-11 23:12:42 PDT | SESSION-INIT-001 | Claude
