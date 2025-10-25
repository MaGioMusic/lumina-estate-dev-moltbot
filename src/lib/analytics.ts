'use client';

export function gtag(...args: any[]) {
  try {
    // @ts-ignore
    window.dataLayer = window.dataLayer || [];
    // @ts-ignore
    window.dataLayer.push(arguments);
  } catch {}
}

export function trackEvent(eventName: string, params?: Record<string, any>) {
  try {
    // @ts-ignore
    window.gtag && window.gtag('event', eventName, params || {});
  } catch {}
}


