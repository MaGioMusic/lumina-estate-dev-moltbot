// Lightweight WS proxy: ws://localhost:3001 -> wss://generativelanguage.googleapis.com/...:live
// Adds x-goog-api-key header and pipes binary audio in both directions
// Load env from .env.local first (Next.js style), then .env as fallback
try { require('dotenv').config({ path: '.env.local' }); } catch {}
try { require('dotenv').config(); } catch {}
const http = require('http');
const WebSocket = require('ws');
const url = require('url');

const PORT = process.env.GEMINI_LIVE_PROXY_PORT ? Number(process.env.GEMINI_LIVE_PROXY_PORT) : 3001;
const DEFAULT_MODEL = process.env.GEMINI_LIVE_MODEL || process.env.GEMINI_MODEL || 'gemini-2.5-flash';
const SERVER_KEY = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY || null;

const server = http.createServer();
const wss = new WebSocket.Server({ server });

wss.on('connection', (client, req) => {
  // Connect upstream
  const parsed = url.parse(req.url || '', true);
  const qp = parsed.query || {};
  const model = (qp.model && String(qp.model)) || DEFAULT_MODEL;
  const apiKey = (qp.key && String(qp.key)) || SERVER_KEY;
  if (!apiKey) {
    try { client.close(1011, 'missing api key'); } catch {}
    return;
  }
  const headers = { 'x-goog-api-key': apiKey };
  console.log(`[proxy] ⇄ client connected → model=${model}`);

  let upstream = null;

  const closeBoth = (code, reason) => {
    try { client.close(code || 1000, reason); } catch {}
    try { upstream && upstream.close(code || 1000, reason); } catch {}
  };

  const bindPipes = (onFail, opts) => {
    if (!upstream) return;
    const isBidi = !!(opts && opts.isBidi);
    upstream.on('open', () => {
      console.log('[proxy] upstream open');
      if (isBidi) {
        // Translate our client JSON into Bidi JSON
        client.on('message', (raw) => {
          try {
            let text = null;
            if (typeof raw === 'string') text = raw;
            else if (Buffer.isBuffer(raw)) text = raw.toString('utf8');
            if (text) {
              let msg;
              try { msg = JSON.parse(text); } catch { msg = null; }
                if (msg && typeof msg === 'object') {
                const mapKeysDeep = (val) => {
                  if (!val || typeof val !== 'object') return val;
                  if (Array.isArray(val)) return val.map(mapKeysDeep);
                  const out = {};
                  Object.keys(val).forEach((k) => {
                    const v = mapKeysDeep(val[k]);
                    let nk = k;
                    if (k === 'client_content') nk = 'clientContent';
                    if (k === 'inline_data') nk = 'inlineData';
                    if (k === 'mime_type') nk = 'mimeType';
                    if (k === 'generation_config') nk = 'generationConfig';
                    if (k === 'response_modalities') nk = 'responseModalities';
                    if (k === 'response_mime_type') nk = 'responseMimeType';
                    if (k === 'language_code') nk = 'languageCode';
                    // Drop unsupported role fields
                    if (nk === 'role') return;
                    out[nk] = v;
                  });
                  return out;
                };
                msg = mapKeysDeep(msg);
                if (msg.type === 'session.start') {
                  const sys = (msg.config && msg.config.systemInstruction) || '';
                  const setup = {
                    setup: {
                      model: `models/${(opts && opts.model) || 'gemini-2.0-flash'}`,
                      generationConfig: {
                        responseModalities: ['AUDIO'],
                        responseMimeType: 'audio/pcm;rate=16000',
                        languageCode: 'ka-GE',
                      },
                      systemInstruction: sys ? { parts: [{ text: String(sys) }] } : undefined,
                    },
                  };
                  upstream.send(JSON.stringify(setup));
                  return;
                }
                if (msg.type === 'input_audio_buffer.commit' || msg.type === 'response.create') {
                  const evt = { clientEvent: 'GENERATION_START' };
                  upstream.send(JSON.stringify(evt));
                  return;
                }
                if (msg.type === 'input_audio_buffer.append' && msg.audio && msg.audio.data) {
                  const inline = {
                    clientContent: {
                      parts: [{ inlineData: { mimeType: 'audio/pcm;rate=16000', data: String(msg.audio.data) } }],
                    },
                  };
                  upstream.send(JSON.stringify(inline));
                  return;
                }
                // If message already uses client_content from other sources, normalize and forward
                if (msg.client_content || msg.clientContent) {
                  const normalized = mapKeysDeep(msg);
                  try { upstream.send(JSON.stringify(normalized)); } catch {}
                  return;
                }
              }
            }
            // pass-through as last resort
            upstream.send(raw);
          } catch {}
        });
      } else {
        client.on('message', (data) => { try { upstream.send(data); } catch {} });
      }
      upstream.on('message', (data) => { try { client.send(data); } catch {} });
    });
    upstream.on('error', (e) => {
      const msg = e?.message || String(e || 'error');
      console.warn('[proxy] upstream error', msg);
      onFail && onFail('error', { message: msg });
    });
    upstream.on('close', (code, reason) => {
      const r = reason?.toString();
      console.warn('[proxy] upstream close', code, r);
      onFail && onFail('close', { code, reason: r });
    });
    client.on('error', () => closeBoth(1011, 'client error'));
    client.on('close', (code, reason) => { console.log('[proxy] client close', code, reason?.toString()); closeBoth(code, reason); });
  };

  // Candidate endpoints: Bidi first, then model connect/live on v1beta→v1alpha
  const urls = [
    `wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1beta.GenerativeService.BidiGenerateContent?key=${encodeURIComponent(apiKey)}`,
    `wss://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:connect?key=${encodeURIComponent(apiKey)}`,
    `wss://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:live?key=${encodeURIComponent(apiKey)}`,
    `wss://generativelanguage.googleapis.com/v1alpha/models/${encodeURIComponent(model)}:connect?key=${encodeURIComponent(apiKey)}`,
    `wss://generativelanguage.googleapis.com/v1alpha/models/${encodeURIComponent(model)}:live?key=${encodeURIComponent(apiKey)}`,
  ];

  let idx = 0;
  const connectNext = () => {
    if (idx >= urls.length) { closeBoth(1011, 'no upstream available'); return; }
    const upstreamUrl = urls[idx++];
    console.log('[proxy] connecting upstream →', upstreamUrl);
    try {
      upstream = new WebSocket(upstreamUrl, { headers });
      const isBidi = /\/ws\/google\.ai\.generativelanguage\./.test(upstreamUrl);
      bindPipes((_type, info) => {
        const msg = (info && (info.reason || info.message)) || '';
        if (/1011|404|closed|before the connection/i.test(msg) || _type === 'close' || _type === 'error') {
          // try next candidate
          connectNext();
        } else {
          closeBoth(1011, 'upstream error');
        }
      }, { isBidi, model });
    } catch (err) {
      console.warn('[proxy] upstream construct error', err?.message || err);
      connectNext();
    }
  };

  connectNext();
});

server.listen(PORT, () => {
  console.log(`Gemini Live proxy listening ws://localhost:${PORT}`);
});


