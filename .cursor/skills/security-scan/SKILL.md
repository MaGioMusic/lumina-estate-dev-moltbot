---
name: security-scan
description: Identify security risks (auth, input validation, data exposure, XSS/CSRF). Use before merge and for auth/DB changes.
license: Complete terms in LICENSE.txt
---

This skill performs a manual security review.

## Security Thinking

- **Auth**: Are routes protected?
- **Input**: Is validation and sanitization present?
- **Data**: Any leakage of private data?
- **Client**: Any secrets in client bundle?

## Review Steps

1) Review auth guards for protected routes.
2) Check input validation for API.
3) Confirm no secrets in client code.
4) Identify XSS/CSRF risks.
5) Summarize with severity.

## Output Format
- Blockers
- High/Medium/Low risks
- Mitigations

## Guardrails
- Do not modify code.
- Ask before auth/permissions change.