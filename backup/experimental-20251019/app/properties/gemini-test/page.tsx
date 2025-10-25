'use client';
import { useState } from 'react';

export default function GeminiTestPage() {
  const [text, setText] = useState('Explain how AI works in a few words');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onAsk = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch('/api/gemini/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.detail?.error?.message || data?.error || 'Request failed');
        return;
      }
      // Gemini REST shape: candidates[0].content.parts[0].text
      const txt = data?.candidates?.[0]?.content?.parts?.[0]?.text || JSON.stringify(data);
      setResult(txt);
    } catch (e: any) {
      setError(String(e?.message || e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-white flex items-center justify-center p-6">
      <div className="w-full max-w-xl space-y-4">
        <h1 className="text-2xl font-semibold">Gemini GenerateContent ტესტი</h1>
        <textarea
          className="w-full h-32 rounded-md bg-[#1e293b] p-3 outline-none"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button
          onClick={onAsk}
          disabled={loading}
          className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-500 disabled:opacity-50"
        >
          {loading ? 'იგზავნება...' : 'კითხვა'}
        </button>
        {error && (
          <div className="rounded-md bg-red-600/20 border border-red-500 p-3 text-red-200">
            {error}
          </div>
        )}
        {result && (
          <div className="rounded-md bg-[#111827] p-4 whitespace-pre-wrap">
            {result}
          </div>
        )}
        <div className="text-xs opacity-70">Route: /properties/gemini-test</div>
      </div>
    </div>
  );
}


