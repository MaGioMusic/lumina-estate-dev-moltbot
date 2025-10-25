'use client';

import { useEffect } from 'react';

type PageSnapshotEmitterProps = {
  page: string;
  title?: string;
  summary?: string;
  data?: Record<string, any>;
  auto?: boolean;
};

export default function PageSnapshotEmitter({ page, title, summary, data, auto }: PageSnapshotEmitterProps) {
  useEffect(() => {
    if (!auto) return;
    try {
      const sp = new URLSearchParams(window.location.search);
      const cid = sp.get('cid') || window.sessionStorage.getItem('lumina_cid');
      if (!cid) return;
      const payload = {
        type: 'page_snapshot',
        page,
        path: window.location.pathname,
        title: title ?? document.title,
        summary: summary ?? '',
        ...(data && typeof data === 'object' ? { data } : {}),
      };
      const ch = new BroadcastChannel(`lumina-ai-${cid}`);
      ch.postMessage(payload);
      ch.close();

      const key = `lumina_snapshots_${cid}`;
      const arr = JSON.parse(window.sessionStorage.getItem(key) || '[]');
      arr.push({ ...payload, ts: Date.now() });
      window.sessionStorage.setItem(key, JSON.stringify(arr));
    } catch {}
  }, [auto, page, title, summary, data]);

  return null;
}

export function emitPageSnapshotNow(input: { page: string; title?: string; summary?: string; data?: Record<string, any> }) {
  try {
    const sp = new URLSearchParams(window.location.search);
    const cid = sp.get('cid') || window.sessionStorage.getItem('lumina_cid');
    if (!cid) return;
    const payload = {
      type: 'page_snapshot',
      page: input.page,
      path: window.location.pathname,
      title: input.title ?? document.title,
      summary: input.summary ?? '',
      ...(input.data && typeof input.data === 'object' ? { data: input.data } : {}),
    };
    const ch = new BroadcastChannel(`lumina-ai-${cid}`);
    ch.postMessage(payload);
    ch.close();

    const key = `lumina_snapshots_${cid}`;
    const arr = JSON.parse(window.sessionStorage.getItem(key) || '[]');
    arr.push({ ...payload, ts: Date.now() });
    window.sessionStorage.setItem(key, JSON.stringify(arr));
  } catch {}
}


