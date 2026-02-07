# Experimental Code Documentation

This document outlines experimental features and code sections that are under development or testing.

## ⚠️ AI Voice Session (Realtime WebRTC)

**Location:** `src/hooks/ai/useRealtimeVoiceSession.ts`

**Status:** Experimental - Development Only

**Description:**
Real-time voice interaction using WebRTC and OpenAI's Realtime API. This feature enables voice-based property search and natural language interactions.

**Known Limitations:**
- Requires WebRTC support (not available in all browsers)
- High bandwidth consumption
- Connection stability depends on network conditions
- API costs can be significant with extended sessions
- Not optimized for mobile devices
- Timeout handling needs refinement
- Error recovery is basic

**Production Readiness:**
❌ **NOT PRODUCTION READY**

Before using in production:
1. Implement robust error handling and retry logic
2. Add rate limiting and session management
3. Optimize for mobile network conditions
4. Add comprehensive monitoring and alerting
5. Test across different network conditions
6. Implement fallback to text-based chat
7. Add cost controls and usage limits

**Console Logging:**
This module contains intentional console logging for debugging purposes. These logs help track:
- WebRTC connection state
- Data channel health
- Audio level monitoring
- Function call execution
- Error conditions

---

## 🧪 Gemini Live Session

**Location:** `src/hooks/ai/useGeminiLiveSession.ts`

**Status:** Experimental - Development Only

**Description:**
Integration with Google's Gemini Live API for conversational AI interactions.

**Known Limitations:**
- API rate limits may apply
- Response times can vary
- Error handling is basic
- Not fully integrated with property search

**Production Readiness:**
❌ **NOT PRODUCTION READY**

---

## 📦 Backup/Experimental Components

**Location:** `backup/experimental-20251022/`, `backup/experimental-20251019/`

**Description:**
Archived experimental components and backup code for reference.

**Important:**
- These files are NOT used in production
- Kept for reference and potential future improvements
- May contain outdated dependencies or broken code
- Do not import from these directories

---

## 🔄 Property Snapshot Emitter

**Location:** `src/app/(marketing)/properties/components/PropertySnapshotEmitter.tsx`

**Status:** Experimental - Limited Production Use

**Description:**
Uses BroadcastChannel API to share property data between tabs for AI chat context.

**Known Limitations:**
- BroadcastChannel not supported in all browsers (Safari < 15.4)
- Falls back to sessionStorage
- Only works within same-origin
- Data persists only during session

**Justification for eslint-disable:**
```javascript
// eslint-disable-next-line react-hooks/exhaustive-deps
```
The dependency array is intentionally limited to `[cid]` because we only want to emit the snapshot once per chat session ID. Including all props would cause unnecessary re-emissions when property data updates.

---

## 🗺️ Google Maps Integration

**Location:** `src/app/(marketing)/properties/components/SinglePropertyGoogleMap.tsx`

**Status:** Production - Conditional

**Description:**
Interactive map with nearby places and property markers.

**Production Considerations:**
- Requires valid Google Maps API key
- API costs based on usage
- Rate limiting required for production
- Consider caching nearby places data
- Monitor API quota usage

---

## 📝 Best Practices for Experimental Code

1. **Always add comments** explaining why code is experimental
2. **Use feature flags** to enable/disable experimental features
3. **Log appropriately** - detailed logs in dev, minimal in production
4. **Document limitations** in code comments and this file
5. **Plan migration path** - how to move from experimental to stable
6. **Monitor usage** - track errors and performance
7. **Have fallbacks** - always provide non-experimental alternatives

---

## 🚀 Moving Code to Production

Before marking experimental code as production-ready:

- [ ] All known bugs fixed
- [ ] Comprehensive error handling added
- [ ] Performance tested under load
- [ ] Security audit completed
- [ ] Monitoring and alerting configured
- [ ] Documentation updated
- [ ] User feedback collected
- [ ] Fallback mechanisms in place
- [ ] Rate limiting implemented
- [ ] Cost analysis completed

---

Last Updated: 2026-02-07
