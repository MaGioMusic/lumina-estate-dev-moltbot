import { NextRequest } from 'next/server';

// Server-side proxy for SDP exchange to avoid browser CORS/network blocks
export async function POST(req: NextRequest) {
  try {
    const model = req.headers.get('x-model') || 'gpt-realtime';
    const ephemeral = req.headers.get('x-ephemeral-token');
    if (!ephemeral) {
      return new Response(JSON.stringify({ error: 'Missing x-ephemeral-token header' }), {
        status: 400,
        headers: { 'content-type': 'application/json' },
      });
    }

    const sdp = await req.text();
    if (!sdp || sdp.trim().length < 10) {
      return new Response(JSON.stringify({ error: 'Missing or invalid SDP' }), {
        status: 400,
        headers: { 'content-type': 'application/json' },
      });
    }

    // Retry with small exponential backoff on transient errors (timeouts/gateway)
    const attempt = async (_n: number): Promise<Response | null> => {
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), 15000);
      try {
        const res = await fetch(`https://api.openai.com/v1/realtime?model=${encodeURIComponent(model)}`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${ephemeral}`,
            'Content-Type': 'application/sdp',
            'OpenAI-Beta': 'realtime=v1',
          },
          body: sdp,
          signal: ctrl.signal,
        });
        if (res.ok) return res;
        if ([408, 429, 500, 502, 503, 504].includes(res.status)) return null;
        // Non-retryable
        return res;
      } finally {
        clearTimeout(timer);
      }
    };

    let res: Response | null = null;
    for (let i = 1; i <= 3; i++) {
      res = await attempt(i);
      if (res && res.ok) break;
      if (i < 3) await new Promise(r => setTimeout(r, 500 * Math.pow(2, i - 1)));
    }
    if (!res) {
      return new Response(
        JSON.stringify({ error: 'SDP exchange failed', detail: 'Upstream timeout or gateway error' }),
        { status: 504, headers: { 'content-type': 'application/json' } }
      );
    }

    if (!res.ok) {
      const text = await res.text();
      return new Response(
        JSON.stringify({ error: 'SDP exchange failed', detail: text }),
        { status: 502, headers: { 'content-type': 'application/json' } }
      );
    }

    const answer = await res.text();
    return new Response(answer, {
      status: 200,
      headers: { 'content-type': 'application/sdp' },
    });
  } catch (err: unknown) {
    return new Response(
      JSON.stringify({ error: 'Unexpected error during SDP proxy', detail: String(err) }),
      { status: 500, headers: { 'content-type': 'application/json' } }
    );
  }
}


