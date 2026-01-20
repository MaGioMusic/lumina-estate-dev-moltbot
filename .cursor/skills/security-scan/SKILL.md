---
name: security-scan
description: Performs security checks on dependencies and code and reports vulnerabilities. Use when the user asks for a security scan, audit, or hardening review.
---

# Security Scan

## Dependency audit
- Run: `npm audit --audit-level=high`
- Summarize high/critical issues with package names and fixes.

## Code review checks
- Look for unsafe user input handling, missing sanitization, and auth gaps.
- Confirm DOMPurify usage where user input is rendered.

## Optional tools
- If a Semgrep MCP tool is configured, run it and include the report.
- If unavailable, state the limitation explicitly.

## Report format
- Vulnerabilities by severity
- Recommended fixes or upgrades
- Any blocked items or missing tooling
