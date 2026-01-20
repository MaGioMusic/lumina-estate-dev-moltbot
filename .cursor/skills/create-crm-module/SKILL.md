---
name: create-crm-module
description: Creates a new CRM module or section using the existing dashboard architecture. Use when the user asks to add CRM features, dashboards, or agent workflows.
---

# Create CRM Module

## Location map
- Dashboard routes live under `src/app/(dashboard)/`
- Agent CRM UI lives under `src/app/(dashboard)/agents/components/`
- Data helpers and repositories live under `src/lib/repo/` and `src/lib/`
- Types live under `src/types/`

## Steps
1. Add a new route under `src/app/(dashboard)/` (or extend existing CRM pages).
2. Build UI with shared components from `src/components/` and `src/components/ui/`.
3. Add data access in `src/lib/repo/` with typed interfaces in `src/types/`.
4. Ensure auth/role checks align with `src/lib/auth/`.
5. Add loading states and error boundaries.

## Output expectations
- New page component in App Router
- Reusable CRM components placed under `src/app/(dashboard)/agents/components/` or `src/components/`
- Clear data flow via repo helpers and typed models
