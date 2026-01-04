// Probe Vertex AI Live API WebSocket setup model formats.
// Usage: node scripts/wsProbe.js
const path = require('path');
try { require('dotenv').config({ path: path.resolve(process.cwd(), '.env.local') }); } catch {}
try { require('dotenv').config({ path: path.resolve(process.cwd(), '..', '.env.local') }); } catch {}

const { GoogleAuth } = require('google-auth-library');
const WebSocket = require('ws');

const PROJECT = process.env.GCP_PROJECT_ID || process.env.GOOGLE_CLOUD_PROJECT || '';
const REGION = process.env.GCP_REGION || 'us-central1';

if (!PROJECT) {
  console.error('Missing GCP_PROJECT_ID / GOOGLE_CLOUD_PROJECT');
  process.exit(1);
}

const endpoint = `wss://${REGION}-aiplatform.googleapis.com/ws/google.cloud.aiplatform.v1.LlmBidiService/BidiGenerateContent`;

const ids = [
  'gemini-live-2.5-flash-native-audio',
  'gemini-live-2-5-flash-native-audio',
  'gemini-live-2.5-flash',
  'gemini-live-2-5-flash',
];

const models = [];
for (const id of ids) {
  models.push(`projects/${PROJECT}/locations/${REGION}/publishers/google/models/${id}`);
  models.push(`publishers/google/models/${id}`);
}

async function main() {
  const auth = new GoogleAuth({ scopes: ['https://www.googleapis.com/auth/cloud-platform'] });
  const client = await auth.getClient();
  const tok = await client.getAccessToken();
  const token = typeof tok === 'string' ? tok : tok?.token;
  if (!token) throw new Error('Failed to mint access token');

  const setupVariants = [
    { name: 'audio_only', setup: { generation_config: { response_modalities: ['audio'] } } },
    {
      name: 'audio_only_with_transcription',
      setup: {
        generation_config: { response_modalities: ['audio'] },
        input_audio_transcription: {},
        output_audio_transcription: {},
      },
    },
    {
      name: 'audio_only_with_output_audio_config_24k',
      setup: {
        generation_config: { response_modalities: ['audio'] },
        output_audio_config: { sample_rate_hertz: 24000 },
      },
    },
  ];

  for (const variant of setupVariants) {
    for (const model of models) {
      await new Promise((resolve) => {
        const ws = new WebSocket(endpoint, { headers: { Authorization: `Bearer ${token}` } });
        let done = false;
        const finish = (label) => {
          if (done) return;
          done = true;
          try { ws.close(); } catch {}
          console.log(`[${variant.name}]`, label, model);
          resolve();
        };
        ws.on('open', () => {
          ws.send(JSON.stringify({
            setup: {
              model,
              ...variant.setup,
            },
          }));
          setTimeout(() => finish('timeout(no close/message)'), 1500);
        });
        ws.on('message', () => finish('message'));
        ws.on('close', (code, reason) => finish(`close ${code} ${String(reason || '')}`));
        ws.on('error', (e) => finish(`error ${e?.message || String(e)}`));
      });
    }
  }
}

main().catch((e) => {
  console.error('TEST_FAIL', e);
  process.exit(1);
});

