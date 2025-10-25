'use client';
import { useEffect, useRef, useState } from 'react';

export default function GeminiLivePage() {
  const [status, setStatus] = useState<'idle'|'connecting'|'connected'|'error'>('idle');
  const wsRef = useRef<WebSocket | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const processorNodeRef = useRef<AudioWorkletNode | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const sampleRateRef = useRef<number>(16000);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      try { wsRef.current?.close(); } catch {}
      try { audioCtxRef.current?.close(); } catch {}
    };
  }, []);

  async function start() {
    setError(null);
    setStatus('connecting');
    try {
      // Prepare AudioContext + downsampler worklet
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioCtxRef.current = audioCtx;
      sampleRateRef.current = 16000;
      const code = `
        class PCMDownsamplerProcessor extends AudioWorkletProcessor {
          constructor() { super(); this._ratio = sampleRate / 16000; }
          process(inputs) {
            const input = inputs[0];
            if (!input || !input[0]) return true;
            const ch = input[0];
            const step = Math.max(1, Math.floor(this._ratio));
            const out = new Int16Array(Math.floor(ch.length / step));
            let oi = 0;
            for (let i = 0; i < ch.length; i += step) {
              let s = ch[i]; s = Math.max(-1, Math.min(1, s));
              out[oi++] = s < 0 ? s * 0x8000 : s * 0x7FFF;
            }
            this.port.postMessage(out.buffer, [out.buffer]);
            return true;
          }
        }
        registerProcessor('pcm-downsampler', PCMDownsamplerProcessor);
      `;
      const blob = new Blob([code], { type: 'application/javascript' });
      const urlMod = URL.createObjectURL(blob);
      await audioCtx.audioWorklet.addModule(urlMod);

      // Connect WS to our proxy (server will bridge to Gemini Live)
      const ws = new WebSocket((location.protocol === 'https:' ? 'wss://' : 'ws://') + location.host + '/api/gemini/live');
      ws.binaryType = 'arraybuffer';
      wsRef.current = ws;

      ws.onopen = () => {
        setStatus('connected');
        // Basic session init
        const init = {
          type: 'session.start',
          model: (process as any)?.env?.NEXT_PUBLIC_GEMINI_LIVE_MODEL || 'gemini-2.5-flash',
          config: {
            systemInstruction: 'ქართულენოვანი უძრავი ქონების ასისტენტი Lumina Estate-ზე. ილაპარაკე მოკლედ, თბილად და პროფესიონალურად.',
            audio: { encoding: 'LINEAR16', sampleRate: 16000, language: 'ka-GE' },
            response: { audio: { encoding: 'LINEAR16', sampleRate: 16000 } },
          },
        };
        try { ws.send(JSON.stringify(init)); } catch {}
      };

      ws.onerror = () => {
        setStatus('error');
        setError('WebSocket error');
      };

      ws.onclose = () => {
        if (status !== 'error') setStatus('idle');
      };

      ws.onmessage = (ev) => {
        if (ev.data instanceof ArrayBuffer) {
          try {
            const pcm = new Int16Array(ev.data);
            const float = new Float32Array(pcm.length);
            for (let i = 0; i < pcm.length; i++) float[i] = Math.max(-1, Math.min(1, pcm[i] / 0x8000));
            const ctx = audioCtxRef.current;
            if (ctx) {
              const buf = ctx.createBuffer(1, float.length, sampleRateRef.current);
              buf.copyToChannel(float, 0, 0);
              const src = ctx.createBufferSource();
              src.buffer = buf; src.connect(ctx.destination); src.start();
            }
          } catch {}
          return;
        }
        // JSON control messages (optional)
      };
    } catch (e: any) {
      setStatus('error');
      setError(String(e?.message || e));
    }
  }

  async function startMic() {
    try {
      if (!audioCtxRef.current) return;
      const stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true } });
      mediaStreamRef.current = stream;
      const source = audioCtxRef.current.createMediaStreamSource(stream);
      const node = new AudioWorkletNode(audioCtxRef.current, 'pcm-downsampler');
      node.port.onmessage = (e) => {
        const buf = e.data as ArrayBuffer;
        try { wsRef.current?.send(buf); } catch {}
      };
      source.connect(node);
      processorNodeRef.current = node;
    } catch (e: any) {
      setError('მიკროფონის შეცდომა');
    }
  }

  return (
    <div className="min-h-screen bg-[#0f172a] text-white flex items-center justify-center p-6">
      <div className="w-full max-w-xl space-y-4">
        <h1 className="text-2xl font-semibold">Gemini Live (Preview) — ცალკე ვერსია</h1>
        <p className="opacity-80 text-sm">ეს გვერდი ამზადებს WebSocket კავშირს პროქსთან. OpenAI კოდი უცვლელია.</p>
        <div className="flex gap-2">
          <button
            onClick={start}
            disabled={status === 'connecting' || status === 'connected'}
            className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-500 disabled:opacity-50"
          >{status === 'connecting' ? 'კავშირი...' : status === 'connected' ? 'დაკავშირებულია' : 'დაწყება'}</button>
          <button
            onClick={startMic}
            disabled={status !== 'connected'}
            className="px-4 py-2 rounded-md bg-emerალდ-600 hover:bg-emerალდ-500 disabled:opacity-50"
          >მიკროფონი</button>
        </div>
        {error && <div className="rounded-md bg-red-600/20 border border-red-500 p-3 text-red-200">{error}</div>}
        <div className="text-xs opacity-70">Route: /properties/gemini-live</div>
      </div>
    </div>
  );
}
