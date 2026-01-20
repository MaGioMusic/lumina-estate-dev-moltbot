---
name: design-review
description: Reviews UI implementation for design system, accessibility, and responsiveness. Use when the user asks for a design review, UI audit, or visual QA.
---

# Design Review

## Scope
- Pages under `src/app/`
- Shared UI components in `src/components/` and `src/components/ui/`

## Checklist
1. Mobile-first responsiveness
2. ARIA labels and keyboard accessibility
3. WCAG 2.1 AA color contrast
4. Tailwind-only styling consistency
5. Next.js `Image` usage for images
6. Motion consistency with Framer Motion

## Report format
- Findings ordered by severity
- Each finding includes file path and component name
- Note any missing accessibility attributes or contrast risks
