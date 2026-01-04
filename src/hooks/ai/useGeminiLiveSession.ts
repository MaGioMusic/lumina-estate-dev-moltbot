'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { PropertyFunctionCallResult } from './usePropertySearch';

type ConnectionState = 'idle' | 'connecting' | 'connected' | 'stopped' | 'error';

export interface UseGeminiLiveSessionOptions {
  enabled: boolean;
  isFunctionCallingEnabled?: boolean;
  handleFunctionCall?: (
    fnName: string,
    argsText: string,
    context?: { transport?: 'realtime' | 'websocket' },
  ) => PropertyFunctionCallResult;
  onTranscript?: (text: string) => void;
  onResponseText?: (text: string) => void;
  onError?: (message: string) => void;
}

export interface UseGeminiLiveSessionResult {
  isListening: boolean;
  isMuted: boolean;
  connectionState: ConnectionState;
  startVoice: () => Promise<void>;
  stopVoice: () => Promise<void>;
  toggleMute: () => void;
  audioRef: React.RefObject<HTMLAudioElement>;
}

interface VertexToken {
  accessToken: string;
  projectId: string;
  region: string;
  model: string;
}

const toBase64 = (bytes: Uint8Array) =>
  typeof btoa !== 'undefined'
    ? btoa(String.fromCharCode(...bytes))
    : Buffer.from(bytes).toString('base64');

const pcm16ToFloat32 = (pcm: Int16Array) => {
  const float32 = new Float32Array(pcm.length);
  for (let i = 0; i < pcm.length; i++) {
    float32[i] = Math.max(-1, Math.min(1, pcm[i] / 32768));
  }
  return float32;
};

type LuminaLanguage = 'ka' | 'en' | 'ru';

const getCookieValue = (name: string): string | null => {
  if (typeof document === 'undefined') return null;
  const m = document.cookie.match(new RegExp(`(?:^|; )${name.replace(/[-[\]/{}()*+?.\\\\^$|]/g, '\\\\$&')}=([^;]*)`));
  return m ? decodeURIComponent(m[1]) : null;
};

const ensureCid = (): string => {
  if (typeof window === 'undefined') return 'cid';
  const sp = new URLSearchParams(window.location.search);
  let cid = sp.get('cid') || window.sessionStorage.getItem('lumina_cid') || '';
  if (!cid) {
    cid = typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : String(Date.now());
  }
  try { window.sessionStorage.setItem('lumina_cid', cid); } catch {}
  // Keep cid in URL so snapshot emitters can find it
  try {
    if (!sp.get('cid')) {
      sp.set('cid', cid);
      const next = `${window.location.pathname}?${sp.toString()}${window.location.hash || ''}`;
      window.history.replaceState({}, '', next);
    }
  } catch {}
  return cid;
};

const buildSystemPrompt = (lang: LuminaLanguage, pageContext: { path: string; title: string }) => {
  const langLine =
    lang === 'en'
      ? 'Site language is English → reply in English.'
      : lang === 'ru'
        ? 'Язык сайта — русский → отвечай по-русски.'
        : 'საიტის ენა არის ქართული → უპასუხე ქართულად.';

  return [
    'შენ ხარ Lumina Estate-ის ხმოვანი ასისტენტი Realtime Audio/Text რეჟიმში.',
    'შენი ამოცანაა ბუნებრივი დიალოგის წარმართვა ხმოვან და ტექსტურ ფორმატში, ka/ru/en ენების გაგება და პასუხის გაცემა იმ ენაზე, რომელზეც ამჟამად არის საიტი.',
    '',
    langLine,
    '',
    'ვებსაიტზე ნებისმიერი ქმედება უნდა შესრულდეს მხოლოდ ხელმისაწვდომი ინსტრუმენტების (tools) მეშვეობით.',
    'არ გამოიგონო ბინები/კლიენტები/მონაცემები. თუ რამე არ იცი, თქვი და შესთავაზე სწორი შემდეგი ქმედება tool-ებით.',
    '',
    'Off-topic პოლიტიკა:',
    '- თუ კითხვა/ფრაზა უძრავ ქონებას/საიტის ფუნქციებს არ ეხება (მაგ: საჭმელი, ხუმრობა, ზოგადი კითხვა, რანდომ სიტყვა) → დაიწყე „ჰაჰა,“-თი და თქვი 1 მოკლე უსაფრთხო/ნეიტრალური ხუმრობა, შემდეგ დაუბრუნდი მთავარ ამოცანას 1 მოკლე შეკითხვით (მაგ: რაიონი ან ბიუჯეტი, იყიდება/ქირავდება).',
    '- არ გააგრძელო off-topic დიალოგი. ყოველთვის დააბრუნე საუბარი ქონების ძებნაზე/ფილტრებზე/შედარებაზე.',
    '- თუ მომხმარებელი გეუბნება მხოლოდ ერთ სიტყვას (მაგ: „პერაშკი“) → ეს ჩათვალე off-topic-ად და იმოქმედე ზემოთ მოცემული შაბლონით.',
    '- თუ search_properties-ზე user query აშკარად off-topic არის და total_count=0 → ასევე იმოქმედე off-topic შაბლონით და სთხოვე 1-2 უძრავი ქონების კრიტერიუმი.',
    '',
    'Off-topic პასუხის შაბლონი:',
    '- „ჰაჰა, <ხუმრობა 1 წინადადება>. მოდი უძრავ ქონებაზე დავბრუნდეთ: რომელი რაიონი გაინტერესებს და რა ბიუჯეტით?“',
    '',
    'Off-topic მაგალითები:',
    '- User: „პერაშკი“ → Assistant: „ჰაჰა, პერაშკი ყოველთვის გულს აჩქარებს, მაგრამ ფასს ვერ აგვიწევს. მოდი უძრავ ქონებაზე დავბრუნდეთ: რომელი რაიონი გაინტერესებს და რა ბიუჯეტით?“',
    '- User: „რა არის შენი საყვარელი საჭმელი?“ → Assistant: „ჰაჰა, მე ყველაფერს ვჭამ — მთავარია ქირა დროზე შემოვიდეს. მოდი უძრავ ქონებაზე დავბრუნდეთ: იყიდება გინდა თუ ქირავდება და რომელ რაიონში?“',
    '',
    'კონტექსტი:',
    `- Page: ${pageContext.title}`,
    `- Path: ${pageContext.path}`,
    '',
    'ქმედებების წესები:',
    '- თუ მომხმარებელი ამბობს “იპოვე/აჩვენე/გაფილტრე” → ჯერ გამოიძახე search_properties ან set_filters. მიღებული toolResponse-იდან მოკლედ უთხარი რამდენია სულ (total_count) და ჩამოთვალე მხოლოდ results_preview (Top N).',
    '- თუ მომხმარებელი ამბობს “კიდევ მაჩვენე/შემდეგი” → გამოიძახე list_results offset/limit-ით და ისევ ჩამოთვალე results_preview.',
    '- თუ ამბობს “გახსენი პირველი/მეორე/…” → open_first_property / open_nth_result და მერე დაელოდე property_snapshot-ს.',
    '- თუ ამბობს “გადადით id …” → navigate_to_property.',
    '',
    'Snapshot პოლიტიკა:',
    '- ნავიგაციის შემდეგ დაელოდე page_snapshot/property_snapshot შეტყობინებას და აღწერე მხოლოდ იქიდან მიღებული ველებით.',
    '- property_snapshot-ის აღწერა იყოს მოკლე (1–3 წინადადება) და მხოლოდ: title, price, address, bedrooms, bathrooms, area, features.',
  ].join('\n');
};

export function useGeminiLiveSession({
  enabled,
  isFunctionCallingEnabled = false,
  handleFunctionCall,
  onTranscript,
  onResponseText,
  onError,
}: UseGeminiLiveSessionOptions): UseGeminiLiveSessionResult {
  const [isListening, setIsListening] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [connectionState, setConnectionState] = useState<ConnectionState>('idle');

  const wsRef = useRef<WebSocket | null>(null);
  // IMPORTANT: use separate AudioContexts for capture vs playback.
  // Mixing them causes sample-rate/timebase issues and "chipmunk/fast" playback.
  const captureAudioCtxRef = useRef<AudioContext | null>(null);
  const playbackAudioCtxRef = useRef<AudioContext | null>(null);
  const playbackNextTimeRef = useRef(0);
  const audioOutDebugOnceRef = useRef(false);
  const playbackSourcesRef = useRef<AudioBufferSourceNode[]>([]);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const sessionReadyRef = useRef(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const cidRef = useRef<string>('');
  const bcRef = useRef<BroadcastChannel | null>(null);
  const toolDebugOnceRef = useRef(false);

  const stopPlaybackNow = useCallback(() => {
    // Stop any already-scheduled audio chunks immediately (barge-in).
    const sources = playbackSourcesRef.current;
    playbackSourcesRef.current = [];
    for (const s of sources) {
      try { s.onended = null; } catch {}
      try { s.stop(0); } catch {}
      try { s.disconnect(); } catch {}
    }
    const ctx = playbackAudioCtxRef.current;
    playbackNextTimeRef.current = ctx ? ctx.currentTime : 0;
  }, []);

  const toolHandler = useMemo(() => {
    if (!isFunctionCallingEnabled) return null;
    if (!handleFunctionCall) return null;
    return handleFunctionCall;
  }, [handleFunctionCall, isFunctionCallingEnabled]);

  const closeAll = useCallback(async () => {
    setIsListening(false);
    setConnectionState('stopped');
    try { wsRef.current?.close(); } catch {}
    wsRef.current = null;
    try { mediaStreamRef.current?.getTracks()?.forEach((t) => t.stop()); } catch {}
    mediaStreamRef.current = null;
    try { processorRef.current?.disconnect(); } catch {}
    processorRef.current = null;
    try { captureAudioCtxRef.current?.close(); } catch {}
    captureAudioCtxRef.current = null;
    stopPlaybackNow();
    try { playbackAudioCtxRef.current?.close(); } catch {}
    playbackAudioCtxRef.current = null;
    playbackNextTimeRef.current = 0;
    try { bcRef.current?.close(); } catch {}
    bcRef.current = null;
  }, [stopPlaybackNow]);

  useEffect(() => {
    return () => { void closeAll(); };
  }, [closeAll]);

  const stopVoice = useCallback(async () => {
    await closeAll();
  }, [closeAll]);

  const toggleMute = useCallback(() => {
    const track = mediaStreamRef.current?.getAudioTracks?.()[0];
    if (track) {
      track.enabled = !track.enabled;
      setIsMuted(!track.enabled);
    }
  }, []);

  const handleAudioOut = useCallback(async (base64Audio: string, sampleRate: number) => {
    try {
      const bytes = Uint8Array.from(atob(base64Audio), (c) => c.charCodeAt(0));
      const pcm = new Int16Array(bytes.buffer);
      const float32 = pcm16ToFloat32(pcm);
      const ctx = playbackAudioCtxRef.current ?? new AudioContext();
      playbackAudioCtxRef.current = ctx;
      if (ctx.state === 'suspended') {
        await ctx.resume();
      }
      const buffer = ctx.createBuffer(1, float32.length, sampleRate);
      buffer.copyToChannel(float32, 0);
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.connect(ctx.destination);
      playbackSourcesRef.current.push(source);
      source.onended = () => {
        const arr = playbackSourcesRef.current;
        const idx = arr.indexOf(source);
        if (idx >= 0) arr.splice(idx, 1);
      };
      // Queue chunks to avoid overlap (overlap sounds "fast/garbled")
      const now = ctx.currentTime;
      const startAt = Math.max(playbackNextTimeRef.current, now + 0.01);
      source.start(startAt);
      playbackNextTimeRef.current = startAt + buffer.duration;
    } catch (error) {
      console.error('[Gemini] audio playback failed', error);
    }
  }, []);

  const startVoice = useCallback(async () => {
    if (!enabled) return;
    if (wsRef.current) return;
    setConnectionState('connecting');
    setIsListening(false);
    setIsMuted(false);
    sessionReadyRef.current = false;

    try {
      cidRef.current = ensureCid();
      // Prefer local proxy in development because browsers can't attach
      // Authorization headers to WebSocket upgrades.
      const proxyBaseEnv = (process.env.NEXT_PUBLIC_GEMINI_LIVE_PROXY_URL || '').trim();
      const proxyModel = (process.env.NEXT_PUBLIC_GEMINI_LIVE_PROXY_MODEL || '').trim();

      let wsUrl: string;
      let token: VertexToken | null = null;

      const proxyBase =
        proxyBaseEnv ||
        (process.env.NODE_ENV === 'development' ? 'ws://localhost:3001' : '');

      if (proxyBase) {
        const model = proxyModel || 'gemini-live-2.5-flash-native-audio';
        const sep = proxyBase.includes('?') ? '&' : '?';
        wsUrl = `${proxyBase}${sep}model=${encodeURIComponent(model)}`;
        console.log('[Gemini] connecting via local proxy', { proxyBase, model });
      } else {
        const tokenRes = await fetch('/api/vertex-token');
        if (!tokenRes.ok) throw new Error(`token failed: ${tokenRes.status}`);
        token = await tokenRes.json();
        // Direct browser WebSocket may fail in some environments; proxy is recommended.
        wsUrl = `wss://${token.region}-aiplatform.googleapis.com/ws/google.cloud.aiplatform.v1.LlmBidiService/BidiGenerateContent?access_token=${encodeURIComponent(token.accessToken)}`;
        console.log('[Gemini] connecting via Vertex AI', {
          region: token.region,
          projectId: token.projectId,
          model: token.model,
        });
      }
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;
      ws.binaryType = 'arraybuffer';

      ws.onopen = async () => {
        setConnectionState('connected');
        const langCookie = (getCookieValue('lumina_language') || '').toLowerCase();
        const lang: LuminaLanguage = (langCookie === 'en' || langCookie === 'ru' ? (langCookie as LuminaLanguage) : 'ka');
        const pageContext = {
          path: typeof window !== 'undefined' ? window.location.pathname : '/',
          title: typeof document !== 'undefined' ? document.title : 'Lumina Estate',
        };
        const systemPrompt = buildSystemPrompt(lang, pageContext);

        // Setup message
        // Note: Vertex Live API WebSocket examples use snake_case fields and
        // lowercase modalities ("audio", "text").
        const setupPayload = {
          setup: {
            // When connected via proxy, the proxy will inject the server-side model
            // if model is omitted.
            model: token
              ? `projects/${token.projectId}/locations/${token.region}/publishers/google/models/${token.model}`
              : undefined,
            generation_config: {
              // Live API allows only ONE response modality in setup.
              // Use AUDIO and enable transcriptions if you want text alongside audio.
              response_modalities: ['audio'],
            },
            // Enable transcriptions so we can show text while response modality is AUDIO.
            input_audio_transcription: {},
            output_audio_transcription: {},
            // System prompt (language + site context)
            system_instruction: {
              parts: [{ text: systemPrompt }],
            },
            // Realtime input behavior (VAD + barge-in)
            realtime_input_config: {
              // Ensure speaking interrupts the model (OpenAI-like barge-in).
              activity_handling: 'START_OF_ACTIVITY_INTERRUPTS',
            },
            // Tools (function calling)
            ...(toolHandler
              ? {
                  tools: [
                    {
                      function_declarations: [
                        {
                          name: 'search_properties',
                          description:
                            'Search properties with filters; navigate to /properties with the filters applied.',
                          parameters: {
                            type: 'object',
                            properties: {
                              query: { type: 'string' },
                              district: { type: 'string' },
                              min_price: { type: 'number' },
                              max_price: { type: 'number' },
                              bedrooms: { type: 'number' },
                              bathrooms: { type: 'number' },
                              status: { type: 'string', enum: ['for-sale', 'for-rent'] },
                              property_type: {
                                type: 'string',
                                enum: ['apartment', 'house', 'villa', 'studio', 'penthouse'],
                              },
                              min_sqft: { type: 'number' },
                              max_sqft: { type: 'number' },
                              is_new: { type: 'boolean' },
                              limit: { type: 'number' },
                              sort_by: { type: 'string', enum: ['price_asc', 'price_desc', 'newest'] },
                            },
                            additionalProperties: false,
                          },
                        },
                        {
                          name: 'set_filters',
                          description: 'Update property list filters and navigate to listing page.',
                          parameters: {
                            type: 'object',
                            properties: {
                              q: { type: 'string' },
                              district: { type: 'string' },
                              priceMin: { type: 'number' },
                              priceMax: { type: 'number' },
                              rooms: { type: 'number' },
                              status: { type: 'string', enum: ['for-sale', 'for-rent'] },
                            },
                            additionalProperties: false,
                          },
                        },
                        {
                          name: 'open_first_property',
                          description: 'Open the first property from last search results.',
                          parameters: {
                            type: 'object',
                            properties: {
                              new_tab: { type: 'boolean', default: false },
                            },
                            additionalProperties: false,
                          },
                        },
                        {
                          name: 'open_nth_result',
                          description: 'Open the Nth property from the last search results. Index is 1-based.',
                          parameters: {
                            type: 'object',
                            properties: {
                              index: { type: 'number' },
                              new_tab: { type: 'boolean', default: false },
                            },
                            required: ['index'],
                            additionalProperties: false,
                          },
                        },
                        {
                          name: 'navigate_to_property',
                          description: 'Navigate to a specific property details page by id.',
                          parameters: {
                            type: 'object',
                            properties: {
                              id: { type: 'string' },
                              new_tab: { type: 'boolean', default: false },
                            },
                            required: ['id'],
                            additionalProperties: false,
                          },
                        },
                        {
                          name: 'open_page',
                          description: 'Open an arbitrary page path in this app (e.g. /properties).',
                          parameters: {
                            type: 'object',
                            properties: {
                              path: { type: 'string' },
                              new_tab: { type: 'boolean', default: false },
                            },
                            required: ['path'],
                            additionalProperties: false,
                          },
                        },
                        {
                          name: 'list_results',
                          description:
                            'List more properties from the last search results (pagination). Returns a preview slice only.',
                          parameters: {
                            type: 'object',
                            properties: {
                              offset: { type: 'number' },
                              limit: { type: 'number' },
                            },
                            additionalProperties: false,
                          },
                        },
                      ],
                    },
                  ],
                }
              : {}),
          },
        };
        console.log('[Gemini] setup payload', JSON.stringify(setupPayload));
        ws.send(JSON.stringify(setupPayload));

        // Listen for page/property snapshots and stream them into the session
        try {
          const cid = cidRef.current;
          if (cid && typeof BroadcastChannel !== 'undefined') {
            const ch = new BroadcastChannel(`lumina-ai-${cid}`);
            bcRef.current = ch;
            ch.onmessage = (ev) => {
              try {
                const payload = ev.data;
                if (!payload || typeof payload !== 'object') return;
                // Provide snapshot context as client content
                if (ws.readyState !== WebSocket.OPEN) return;
                ws.send(
                  JSON.stringify({
                    clientContent: {
                      turns: [
                        {
                          role: 'user',
                          parts: [{ text: JSON.stringify(payload) }],
                        },
                      ],
                      turnComplete: true,
                    },
                  }),
                );
              } catch {}
            };
          }
        } catch {}

        // Audio capture
        let stream: MediaStream;
        try {
          const strictConstraints = {
            audio: {
              channelCount: 1,
              sampleRate: 16000,
              echoCancellation: true,
              noiseSuppression: true,
              autoGainControl: true,
            } as MediaTrackConstraints,
          };
          try {
            stream = await navigator.mediaDevices.getUserMedia(strictConstraints);
          } catch (err: any) {
            const name = String(err?.name || '');
            // Windows/Chrome can throw NotFoundError when no default mic exists
            // or when constraints can't be satisfied. Retry with relaxed constraints.
            if (name === 'NotFoundError' || name === 'OverconstrainedError' || name === 'NotReadableError') {
              let audioInputCount = 0;
              try {
                const devices = await navigator.mediaDevices.enumerateDevices().catch(() => []);
                const audioInputs = Array.isArray(devices)
                  ? devices.filter((d) => d?.kind === 'audioinput')
                  : [];
                audioInputCount = audioInputs.length;
                console.warn('[Gemini] mic strict constraints failed, retrying with audio:true', {
                  name,
                  audioInputCount,
                });
              } catch {}
              stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            } else {
              throw err;
            }
          }
        } catch (err) {
          console.error('[Gemini] microphone permission denied or unavailable', err);
          try {
            const name = String((err as any)?.name || '');
            if (name === 'NotFoundError') {
              onError?.(
                'No microphone detected (0 input devices). Check Windows Sound → Input and Windows Privacy → Microphone access, then reload.',
              );
            } else if (name === 'NotAllowedError' || name === 'SecurityError') {
              onError?.('Microphone permission is blocked. Allow mic access in the browser/site settings and retry.');
            } else {
              onError?.('Microphone is unavailable. Check your input device and permissions, then retry.');
            }
          } catch {}
          setConnectionState('error');
          try { ws.close(1000, 'mic unavailable'); } catch {}
          return;
        }
        mediaStreamRef.current = stream;
        const ctx = new AudioContext({ sampleRate: 16000 });
        captureAudioCtxRef.current = ctx;
        const source = ctx.createMediaStreamSource(stream);
        const processor = ctx.createScriptProcessor(4096, 1, 1);
        processorRef.current = processor;
        processor.onaudioprocess = (event) => {
          if (ws.readyState !== WebSocket.OPEN) return;
          // Don't stream audio until the server acknowledges setup.
          if (!sessionReadyRef.current) return;
          const input = event.inputBuffer.getChannelData(0);
          const pcm16 = new Int16Array(input.length);
          for (let i = 0; i < input.length; i++) {
            const s = Math.max(-1, Math.min(1, input[i]));
            pcm16[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
          }
          const b64 = toBase64(new Uint8Array(pcm16.buffer));
          try {
            ws.send(JSON.stringify({
              realtime_input: {
                media_chunks: [
                  {
                    mime_type: 'audio/pcm',
                    data: b64,
                  },
                ],
              },
            }));
          } catch {
            // ignore send errors
          }
        };
        source.connect(processor);
        // Avoid playing mic audio back to speakers (echo), but keep node alive.
        const zeroGain = ctx.createGain();
        zeroGain.gain.value = 0;
        processor.connect(zeroGain);
        zeroGain.connect(ctx.destination);
        setIsListening(true);
      };

      ws.onmessage = (event) => {
        try {
          // Some servers/proxies may deliver JSON frames as ArrayBuffer/Blob.
          const raw = event.data;
          let text: string | null = null;
          if (typeof raw === 'string') {
            text = raw;
          } else if (raw instanceof ArrayBuffer) {
            text = new TextDecoder('utf-8').decode(new Uint8Array(raw));
          } else if (raw instanceof Blob) {
            // Blob -> async, so punt to a separate async parse
            void raw.text().then((t) => {
              try {
                const data = JSON.parse(t);
                // Any valid server message indicates the session is ready
                sessionReadyRef.current = true;
                // If the server signals interruption, stop any queued playback immediately.
                const interrupted =
                  Boolean((data as any)?.serverContent?.interrupted) ||
                  Boolean((data as any)?.server_content?.interrupted);
                if (interrupted) stopPlaybackNow();
                const parts = data?.serverContent?.modelTurn?.parts || [];
                for (const part of parts) {
                  if (part?.inlineData?.mimeType?.includes('audio/pcm')) {
                    const mt = String(part.inlineData.mimeType || '');
                    const m = /rate=(\d+)/.exec(mt);
                    const rate = m ? Number(m[1]) : 24000;
                    void handleAudioOut(part.inlineData.data, rate);
                  }
                  if (part?.text) onResponseText?.(part.text);
                }
                const inTr = data?.inputTranscription?.text;
                if (inTr) onTranscript?.(inTr);
              } catch (e) {
                console.error('[Gemini] message parse error', e);
              }
            });
            return;
          } else {
            text = String(raw);
          }

          if (!text) return;
          const data = JSON.parse(text);
          // Any valid server message indicates the session is ready
          sessionReadyRef.current = true;

          // If the server signals interruption, stop any queued playback immediately.
          const interrupted =
            Boolean((data as any)?.serverContent?.interrupted) ||
            Boolean((data as any)?.server_content?.interrupted);
          if (interrupted) stopPlaybackNow();

          // Tool calling (if enabled)
          if (toolHandler) {
            // Different transports/SDKs may wrap tool calls differently.
            const toolCall =
              (data?.toolCall ||
                data?.tool_call ||
                data?.toolCalls ||
                data?.tool_calls ||
                data?.serverContent?.toolCall ||
                data?.serverContent?.tool_call ||
                data?.server_content?.tool_call ||
                data?.server_content?.toolCall) as any;
            const fnCalls =
              toolCall?.functionCalls ||
              toolCall?.function_calls ||
              toolCall?.functionCalls?.calls ||
              toolCall?.function_calls?.calls ||
              toolCall?.calls;
            if (Array.isArray(fnCalls) && fnCalls.length) {
              if (!toolDebugOnceRef.current) {
                toolDebugOnceRef.current = true;
                try {
                  console.log('[Gemini] tool call received', {
                    calls: fnCalls.map((c: any) => ({
                      id: c?.id || c?.callId || c?.call_id,
                      name: c?.name || c?.functionName || c?.function_name,
                    })),
                  });
                } catch {}
              }
              for (const call of fnCalls) {
                const id = String(call?.id || call?.callId || call?.call_id || '');
                const name = String(call?.name || call?.functionName || call?.function_name || '');
                const args = call?.args ?? call?.arguments ?? call?.argsText ?? call?.args_text ?? '{}';
                const argsText = typeof args === 'string' ? args : JSON.stringify(args);
                if (!name) continue;
                const res = toolHandler(name, argsText, { transport: 'realtime' });
                if (!res?.handled) continue;
                try {
                  // Vertex/Gemini Live API prefers snake_case message fields.
                  // If we send camelCase here, the server may ignore tool outputs.
                  const toolResponseSnake = {
                    tool_response: {
                      function_responses: [
                        {
                          ...(id ? { id } : {}),
                          name,
                          response: res.payload || { ok: true },
                        },
                      ],
                    },
                  };
                  if (!toolDebugOnceRef.current) {
                    // If somehow first log didn't run, ensure at least one response log.
                    toolDebugOnceRef.current = true;
                  }
                  try {
                    console.log('[Gemini] tool response sent', {
                      id: id || undefined,
                      name,
                      // Avoid logging huge payloads; just keys.
                      responseKeys: res.payload ? Object.keys(res.payload) : ['ok'],
                    });
                  } catch {}
                  ws.send(
                    JSON.stringify({
                      ...toolResponseSnake,
                      // Compatibility fallback (some proxies/examples use camelCase).
                      toolResponse: toolResponseSnake.tool_response,
                    }),
                  );
                } catch {}
              }
              return;
            }
          }

          const parts = data?.serverContent?.modelTurn?.parts || [];
          for (const part of parts) {
            if (part?.inlineData?.mimeType?.includes('audio/pcm')) {
              const mt = String(part.inlineData.mimeType || '');
              const m = /rate=(\d+)/.exec(mt);
              const rate = m ? Number(m[1]) : 24000;
              if (!audioOutDebugOnceRef.current) {
                audioOutDebugOnceRef.current = true;
                console.log('[Gemini] audio out format', { mimeType: mt, parsedRate: rate });
              }
              void handleAudioOut(part.inlineData.data, rate);
            }
            if (part?.text) {
              onResponseText?.(part.text);
            }
          }
          const inTr = data?.inputTranscription?.text;
          if (inTr) onTranscript?.(inTr);
          const done = data?.serverContent?.generationComplete || data?.serverContent?.turnComplete;
          if (done) {
            // keep session alive; optional
          }
        } catch (error) {
          console.error('[Gemini] message parse error', error);
        }
      };

      ws.onerror = (err) => {
        console.error('[Gemini] websocket error', err, { readyState: ws.readyState });
        try { onError?.('Voice connection error. Please retry.'); } catch {}
        setConnectionState('error');
      };
      ws.onclose = (evt) => {
        console.warn('[Gemini] websocket closed', {
          code: evt.code,
          reason: evt.reason,
          wasClean: evt.wasClean,
          readyState: ws.readyState,
        });
        // Allow re-connecting after a close (without requiring page refresh)
        if (wsRef.current === ws) wsRef.current = null;
        sessionReadyRef.current = false;
        stopPlaybackNow();
        try { bcRef.current?.close(); } catch {}
        bcRef.current = null;
        // Stop mic processing when socket closes
        try { processorRef.current?.disconnect(); } catch {}
        processorRef.current = null;
        try { mediaStreamRef.current?.getTracks()?.forEach((t) => t.stop()); } catch {}
        mediaStreamRef.current = null;
        setIsListening(false);
        setConnectionState('stopped');
      };
    } catch (error) {
      console.error('[Gemini] start failed', error);
      await closeAll();
      setConnectionState('error');
    }
  }, [closeAll, enabled, handleAudioOut, onResponseText, onTranscript]);

  return {
    isListening,
    isMuted,
    connectionState,
    startVoice,
    stopVoice,
    toggleMute,
    audioRef,
  };
}
