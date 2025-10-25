'use client';

import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { ShieldCheck, FileText, Handshake, Scales, EnvelopeSimple } from '@phosphor-icons/react';

export default function LegalPage() {
  const { t } = useLanguage();
  const { theme } = useTheme();

  const services = [
    { icon: Scales, title: 'Property Due Diligence', desc: 'Title verification, encumbrance checks, and compliance review before purchase.' },
    { icon: FileText, title: 'Contract Drafting', desc: 'Sale, rent, and management agreements tailored to Georgian regulations.' },
    { icon: ShieldCheck, title: 'Risk & Compliance', desc: 'Anti‑money laundering, KYC, and regulatory guidance for investors.' },
    { icon: Handshake, title: 'Deal Structuring', desc: 'Tax‑aware structures for SPVs, co‑ownership, and cross‑border transactions.' },
  ];

  const faqs = [
    { q: 'Do I need a Georgian company to buy property?', a: 'No. Foreigners can own real estate in Georgia. Our team advises on optimal structures.' },
    { q: 'How long does due diligence take?', a: 'Typically 2–5 business days depending on document availability and property history.' },
    { q: 'Can you represent me remotely?', a: 'Yes. We can act via notarized power of attorney and coordinate all parties securely.' },
  ];

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'} pt-20`}> 
      {/* Hero */}
      <section className="px-6 md:px-10 lg:px-16 xl:px-24">
        <div className={`rounded-3xl overflow-hidden border ${theme === 'dark' ? 'border-gray-800' : 'border-gray-200'} bg-gradient-to-br from-orange-50 to-amber-50 dark:from-[#1a1a1a] dark:to-[#111111] p-8 md:p-12 relative`}> 
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4">
            {t('legal')} & Compliance Advisory
          </h1>
          <p className={`max-w-3xl ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} text-base md:text-lg`}>
            End‑to‑end legal support for acquisitions, rentals, and investments in Georgia. We combine real estate expertise with streamlined documentation and risk control.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href="#consultation" className="px-5 py-2.5 rounded-full bg-[#F08336] hover:bg-[#E07428] text-white text-sm font-semibold transition-colors">Book Free Consultation</a>
            <a href="#services" className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-colors ${theme === 'dark' ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-50 border border-gray-200'}`}>Explore Services</a>
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="px-6 md:px-10 lg:px-16 xl:px-24 mt-10 md:mt-14">
        <h2 className="text-2xl md:text-3xl font-bold mb-6">Our Legal Services</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {services.map((s) => (
            <div key={s.title} className={`rounded-2xl p-5 border ${theme === 'dark' ? 'border-gray-800 bg-[#141414]' : 'border-gray-200 bg-white'} hover:shadow-md transition-shadow`}>
              <div className="w-10 h-10 rounded-lg bg-orange-100 text-[#F08336] flex items-center justify-center mb-4">
                <s.icon className="w-5 h-5" />
              </div>
              <h3 className="font-semibold mb-2">{s.title}</h3>
              <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} text-sm`}>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Consultation CTA */}
      <section id="consultation" className="px-6 md:px-10 lg:px-16 xl:px-24 mt-12">
        <div className={`rounded-2xl border ${theme === 'dark' ? 'border-gray-800 bg-[#141414]' : 'border-gray-100 bg-gray-50'} p-6 md:p-8 flex flex-col md:flex-row gap-6 items-center`}>
          <div className="flex-1">
            <h3 className="text-xl md:text-2xl font-bold mb-2">Free 20‑minute Legal Consultation</h3>
            <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} text-sm md:text-base`}>Discuss your case with our legal partner. We review documents, outline risks, and propose next steps.</p>
          </div>
          <a href="mailto:legal@lumina-estate.ge" className="px-5 py-2.5 rounded-full bg-[#F08336] hover:bg-[#E07428] text-white text-sm font-semibold inline-flex items-center gap-2">
            <EnvelopeSimple className="w-5 h-5" /> legal@lumina-estate.ge
          </a>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-6 md:px-10 lg:px-16 xl:px-24 mt-12 mb-16">
        <h2 className="text-2xl md:text-3xl font-bold mb-6">FAQ</h2>
        <div className="divide-y divide-gray-200 dark:divide-gray-800 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
          {faqs.map((f, i) => (
            <details key={i} className={`group ${theme === 'dark' ? 'bg-[#121212]' : 'bg-white'} open:bg-orange-50/40 dark:open:bg-[#171717]`}>
              <summary className="cursor-pointer list-none p-5 flex items-center justify-between">
                <span className="font-medium">{f.q}</span>
                <span className="ml-4 w-6 h-6 rounded-full grid place-items-center text-gray-500 group-open:text-[#F08336]">+</span>
              </summary>
              <div className={`px-5 pb-5 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} text-sm`}>{f.a}</div>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}


