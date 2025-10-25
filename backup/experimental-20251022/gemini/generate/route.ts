import { NextResponse } from 'next/server';

const DEFAULT_GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-2.0-flash';

export async function POST(req: Request) {
  try {
    const headers = Object.fromEntries(req.headers.entries());
    const body = await req.json().catch(() => ({} as any));

    const apiKeyFromEnv = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    const apiKeyFromHeader = headers['x-gemini-api-key'] || headers['x-goog-api-key'];
    const apiKeyFromBody = body?.apiKey;
    const apiKey = (apiKeyFromEnv || apiKeyFromHeader || apiKeyFromBody)?.toString();

    if (!apiKey) {
      return NextResponse.json({ error: 'Server missing GEMINI_API_KEY' }, { status: 500 });
    }

    const userText: string | undefined = body?.text ?? body?.message ?? body?.prompt;
    const model: string = body?.model || DEFAULT_GEMINI_MODEL;

    if (!userText || typeof userText !== 'string') {
      return NextResponse.json({ error: "Missing 'text' in request body" }, { status: 400 });
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`;

    const geminiRes = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-goog-api-key': apiKey,
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: userText },
            ],
          },
        ],
      }),
    });

    const data = await geminiRes.json().catch(() => ({}));
    if (!geminiRes.ok) {
      return NextResponse.json({ error: 'Gemini API error', detail: data }, { status: geminiRes.status });
    }

    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: 'Unhandled server error', detail: String(err?.message || err) }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ ok: true, model: DEFAULT_GEMINI_MODEL });
}


