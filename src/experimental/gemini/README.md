# Experimental Gemini Voice Integration

This directory contains experimental code for Gemini voice integration. **This code is not production-ready** and should be used for testing purposes only.

## Known Issues

### TypeScript
- Uses `any` types in several places due to:
  - Web Speech API types not being fully available
  - Window object extensions (webkitAudioContext, etc.)
  - Dynamic property access on environment variables

### Security
- Prompts for API key in browser (temporary workaround)
- Stores API key in sessionStorage (not secure for production)

### TODO Before Production
1. Replace all `any` types with proper TypeScript interfaces
2. Move API key handling to server-side proxy
3. Add proper error boundaries
4. Add loading states and retry logic
5. Test across all supported browsers
6. Add feature detection for Web Speech API

## Usage

This code is NOT loaded by default. To enable:

1. Set `NEXT_PUBLIC_ENABLE_GEMINI=1` in your environment
2. Ensure you have a valid GCP project with Vertex AI enabled
3. Configure proper authentication (see docs/ai/gemini-toggle-notes.md)

## Files

- `useGeminiVoice.ts` - Hook for Gemini voice functionality
- `GeminiVoiceButton.tsx` - UI component for voice input
- `index.ts` - Module exports
