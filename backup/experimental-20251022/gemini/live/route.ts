export const runtime = 'edge';

// Edge WebSocket proxy to Gemini Live API.
// Requires env: GEMINI_API_KEY, GEMINI_LIVE_WS_URL (full wss URL to Gemini Live session endpoint)
export async function GET(req: Request) {
  const upgrade = req.headers.get('upgrade') || '';
  if (upgrade.toLowerCase() !== 'websocket') {
    return new Response('Expected websocket', { status: 426 });
  }

  const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  const upstreamBase = process.env.GEMINI_LIVE_WS_URL || '';
  if (!apiKey || !upstreamUrl) {
    return new Response('Server missing GEMINI_API_KEY or GEMINI_LIVE_WS_URL', { status: 500 });
  }

  // Ensure key query param present for upstream, some deployments require it on URL
  const url = (() => {
    try {
      const u = new URL(upstreamBase);
      if (!u.searchParams.get('key')) u.searchParams.set('key', apiKey);
      return u.toString();
    } catch {
      // Fallback: assume string and append
      const sep = upstreamBase.includes('?') ? '&' : '?';
      return upstreamBase + sep + 'key=' + encodeURIComponent(apiKey);
    }
  })();

  // Accept client websocket
  const pairClient = (globalThis as any).WebSocketPair ? new (globalThis as any).WebSocketPair() : null;
  if (!pairClient) return new Response('WebSocket not supported in this runtime', { status: 500 });
  const client = pairClient[0];
  const server = pairClient[1];
  (server as any).accept();

  // Connect to Gemini Live upstream via fetch upgrade (Edge style)
  let upstreamSocket: WebSocket | null = null;
  try {
    const upstreamResp: any = await fetch(url, {
      headers: {
        'x-goog-api-key': apiKey,
      },
      // Some edge runtimes infer upgrade from destination; no explicit option needed
    } as any);

    if (!upstreamResp || typeof upstreamResp.webSocket === 'undefined') {
      (server as any).close(1011, 'Failed to upgrade upstream');
      return new Response(null, { status: 101, webSocket: server } as any);
    }
    upstreamSocket = upstreamResp.webSocket as WebSocket;
    (upstreamSocket as any).accept();

    // Pipe messages client -> upstream
    (server as any).addEventListener('message', (ev: MessageEvent) => {
      try {
        if (!upstreamSocket) return;
        if (ev.data instanceof ArrayBuffer) upstreamSocket.send(ev.data);
        else if (typeof ev.data === 'string') upstreamSocket.send(ev.data);
        else if (ev.data && 'byteLength' in ev.data) upstreamSocket.send(ev.data as any);
      } catch (_) {}
    });

    // Pipe messages upstream -> client
    (upstreamSocket as any).addEventListener('message', (ev: MessageEvent) => {
      try {
        if (ev.data instanceof ArrayBuffer) (server as any).send(ev.data);
        else if (typeof ev.data === 'string') (server as any).send(ev.data);
        else if (ev.data && 'byteLength' in ev.data) (server as any).send(ev.data as any);
      } catch (_) {}
    });

    const closeBoth = (code?: number, reason?: string) => {
      try { (server as any).close(code || 1000, reason); } catch {}
      try { (upstreamSocket as any)?.close(code || 1000, reason); } catch {}
    };

    (server as any).addEventListener('close', (ev: any) => closeBoth(ev.code, ev.reason));
    (upstreamSocket as any).addEventListener('close', (ev: any) => closeBoth(ev.code, ev.reason));
    (server as any).addEventListener('error', () => closeBoth(1011, 'client error'));
    (upstreamSocket as any).addEventListener('error', () => closeBoth(1011, 'upstream error'));

    return new Response(null, { status: 101, webSocket: server } as any);
  } catch (e) {
    try { (server as any).close(1011, 'Proxy error'); } catch {}
    try { (upstreamSocket as any)?.close(1011, 'Proxy error'); } catch {}
    return new Response('Proxy error', { status: 502 });
  }
}


