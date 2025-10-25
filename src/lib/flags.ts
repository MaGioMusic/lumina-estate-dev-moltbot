'use client';

export const flags = {
  enableTrustCluster: process.env.NEXT_PUBLIC_FLAG_TRUST_CLUSTER === '1',
  enableGA4: process.env.NEXT_PUBLIC_GA4_ID ? true : false,
  enableCROHero: process.env.NEXT_PUBLIC_FLAG_CRO_HERO === '1',
  enableCRONewsletter: process.env.NEXT_PUBLIC_FLAG_CRO_NEWSLETTER === '1',
};


