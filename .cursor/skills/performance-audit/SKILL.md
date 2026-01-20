---
name: performance-audit
description: Audit performance risks and propose optimizations. Use after large UI or data changes.
license: Complete terms in LICENSE.txt
---

This skill finds rendering, data, and bundle bottlenecks.

## Performance Thinking
- **Rendering**: expensive components, re-renders
- **Data**: over-fetching, blocking requests
- **Bundle**: large client imports, unused code

## Audit Steps
1) Identify heavy components.
2) Review data-fetch patterns.
3) Suggest memoization/lazy loading.
4) Provide optimization list.

## Output Format
- Bottlenecks
- Recommended fixes
- Risk rating

## Guardrails
- No refactors without approval.