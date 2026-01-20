---
name: performance-audit
description: Audits performance and bundle health for Next.js apps and reports bottlenecks. Use when the user asks for a performance audit or optimization review.
---

# Performance Audit

## Build checks
- Run `npm run build` and report any warnings.
- If bundle analyzer is configured, run it only when requested.

## Code checks
- Identify large client components and suggest dynamic imports.
- Ensure expensive components use `React.memo` where appropriate.
- Verify images use Next.js `Image` with sizing.
- Look for heavy dependencies on initial routes.

## Report format
- Bottlenecks and their locations
- Suggested optimizations
- Any build-time warnings
