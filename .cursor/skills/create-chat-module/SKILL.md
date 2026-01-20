---
name: create-chat-module
description: Creates a new chat module using existing chat UI and API patterns. Use when the user asks to add chat features, AI chat, or messaging flows.
---

# Create Chat Module

## Location map
- Chat UI components exist under `src/app/(marketing)/properties/components/`
- Chat API routes exist under `src/app/api/chat/`
- Shared utilities live under `src/lib/`

## Steps
1. Define the new chat route under `src/app/` (App Router).
2. Reuse or extend existing chat UI components where possible.
3. Add or update API handlers under `src/app/api/chat/`.
4. Add typing in `src/types/` as needed.
5. Ensure sanitization for user input and add loading/error states.

## Output expectations
- Page route and layout for chat surface
- API route handlers for chat message/history
- Reusable UI components and hooks
