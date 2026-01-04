// Lightweight WS proxy: ws://localhost:3001 -> Vertex AI Live API (BidiGenerateContent)
// Browsers can't set Authorization headers on WS upgrades, so this proxy mints an
// OAuth token (ADC/service account) and attaches it server-side.
const path = require('path');
try { require('dotenv').config({ path: path.resolve(process.cwd(), '.env.local') }); } catch {}
// Also support monorepo/workspace layouts where secrets live one level up
try { require('dotenv').config({ path: path.resolve(process.cwd(), '..', '.env.local') }); } catch {}
try { require('dotenv').config(); } catch {}
const http = require('http');
const WebSocket = require('ws');
const url = require('url');
const { GoogleAuth } = require('google-auth-library');

const PORT = process.env.GEMINI_LIVE_PROXY_PORT ? Number(process.env.GEMINI_LIVE_PROXY_PORT) : 3001;
const PROJECT_ID = process.env.GCP_PROJECT_ID || process.env.GOOGLE_CLOUD_PROJECT || '';
const REGION = process.env.GCP_REGION || 'us-central1';
const DEFAULT_MODEL_ID = process.env.GEMINI_LIVE_MODEL || 'gemini-live-2.5-flash-native-audio';

const auth = new GoogleAuth({ scopes: ['https://www.googleapis.com/auth/cloud-platform'] });

const server = http.createServer();
const wss = new WebSocket.Server({ server });

wss.on('listening', () => {
  console.log('[proxy] listening', {
    port: PORT,
    region: REGION,
    hasProjectId: Boolean(PROJECT_ID),
    defaultModelId: DEFAULT_MODEL_ID,
  });
});

wss.on('connection', (client, req) => {
  // Connect upstream (Vertex AI Live)
  const parsed = url.parse(req.url || '', true);
  const qp = parsed.query || {};
  const modelIdRaw = (qp.model && String(qp.model)) || DEFAULT_MODEL_ID;
  // Vertex Live expects a full resource name.
  // Format: projects/{PROJECT}/locations/{REGION}/publishers/google/models/{MODEL_ID}
  const modelPath = `projects/${PROJECT_ID}/locations/${REGION}/publishers/google/models/${modelIdRaw}`;
  console.log(`[proxy] ⇄ client connected → modelId=${modelIdRaw}`);

  if (!PROJECT_ID) {
    console.error('[proxy] missing GCP_PROJECT_ID (or GOOGLE_CLOUD_PROJECT)');
    try { client.close(1011, 'missing project id'); } catch {}
    return;
  }

  let upstream = null;
  let upstreamOpen = false;
  const pending = [];

  const closeBoth = (code, reason) => {
    try { client.close(code || 1000, reason); } catch {}
    try { upstream && upstream.close(code || 1000, reason); } catch {}
  };

  const transformClientMessage = (raw) => {
    // Inject model into setup if missing and ensure JSON is sent as TEXT frames.
    try {
      let text = null;
      if (typeof raw === 'string') text = raw;
      else if (Buffer.isBuffer(raw)) text = raw.toString('utf8');
      if (!text) return raw;
      // If it looks like JSON, keep it as a string to send upstream as text.
      const trimmed = text.trimStart();
      const looksJson = trimmed.startsWith('{') || trimmed.startsWith('[');
      if (!looksJson) return raw;
      const msg = JSON.parse(trimmed);
      if (msg && typeof msg === 'object' && msg.setup && !msg.setup.model) {
        msg.setup.model = modelPath;
        console.log('[proxy] injected setup.model', modelPath);
        return JSON.stringify(msg);
      }
      return trimmed;
    } catch {
      return raw;
    }
  };

  const connectUpstream = async () => {
    try {
      const authClient = await auth.getClient();
      const tokenResp = await authClient.getAccessToken();
      const accessToken = typeof tokenResp === 'string' ? tokenResp : tokenResp?.token;
      if (!accessToken) throw new Error('failed to mint access token');

      const upstreamUrl = `wss://${REGION}-aiplatform.googleapis.com/ws/google.cloud.aiplatform.v1.LlmBidiService/BidiGenerateContent`;
      console.log('[proxy] connecting upstream →', upstreamUrl);

      upstream = new WebSocket(upstreamUrl, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      upstream.on('open', () => {
        console.log('[proxy] upstream open');
        upstreamOpen = true;
        // flush buffered messages
        while (pending.length) {
          const msg = pending.shift();
          try { upstream.send(msg); } catch {}
        }
      });

      upstream.on('message', (data) => {
        try {
          // If upstream sends JSON as a Buffer, forward as text to the browser
          // to avoid ArrayBuffer JSON.parse issues.
          if (Buffer.isBuffer(data)) {
            const text = data.toString('utf8');
            if (text.startsWith('{') || text.startsWith('[')) {
              client.send(text);
              return;
            }
          }
          client.send(data);
        } catch {}
      });

      upstream.on('error', (e) => {
        console.warn('[proxy] upstream error', e?.message || String(e || 'error'));
        closeBoth(1011, 'upstream error');
      });
      upstream.on('close', (code, reason) => {
        console.warn('[proxy] upstream close', code, reason?.toString());
        upstreamOpen = false;
        closeBoth(code, reason);
      });
    } catch (err) {
      console.error('[proxy] failed to connect upstream', err?.message || err);
      try { client.close(1011, 'upstream connect failed'); } catch {}
    }
  };

  // IMPORTANT: attach client handlers immediately, so we never miss early setup messages.
  client.on('error', () => closeBoth(1011, 'client error'));
  client.on('message', (raw) => {
    const msg = transformClientMessage(raw);
    if (!upstreamOpen) {
      pending.push(msg);
      return;
    }
    try { upstream && upstream.send(msg); } catch {}
  });
  client.on('close', (code, reason) => {
    console.log('[proxy] client close', code, reason?.toString());
    closeBoth(code, reason);
  });

  void connectUpstream();
});

server.listen(PORT, () => {
  console.log(`Gemini Live proxy listening ws://localhost:${PORT}`);
});


