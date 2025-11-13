'use client';

import { useMemo } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import type { ProfileAppointment, ProfileInquiry } from '@/types/profile';
import { cn } from '@/lib/utils';

interface PerformanceOverviewSectionProps {
  favoritesCount: number;
  appointments: ProfileAppointment[];
  inquiries: ProfileInquiry[];
}

const copy = {
  title: { ka: 'ეფექტიანობის მიმოხილვა', en: 'Performance overview', ru: 'Обзор эффективности' },
  subtitle: { ka: 'ჩვენებები vs მოთხოვნები ბოლო 30 დღეში', en: 'Views vs inquiries in the last 30 days', ru: 'Просмотры и запросы за 30 дней' },
  offers: { ka: 'პროფოცირებული შეთავაზებები', en: 'Offers promoted', ru: 'Продвинутые предложения' },
  listings: { ka: 'დასანიშნი ქონებები', en: 'Listings assigned', ru: 'Назначенные объекты' },
  viewsLabel: { ka: 'ჩვენებები', en: 'Views', ru: 'Просмотры' },
  inquiriesLabel: { ka: 'მოთხოვნები', en: 'Inquiries', ru: 'Запросы' },
};

export function PerformanceOverviewSection({
  favoritesCount,
  appointments,
  inquiries,
}: PerformanceOverviewSectionProps) {
  const { language } = useLanguage();
  const safeLanguage = language === 'ru' ? 'ru' : language === 'en' ? 'en' : 'ka';

  const confirmedAppointments = appointments.filter((appointment) =>
    ['confirmed', 'scheduled'].includes(appointment.status)
  ).length;
  const respondedInquiries = inquiries.filter((inquiry) =>
    ['responded', 'closed'].includes(inquiry.status)
  ).length;

  const offersPercent = appointments.length
    ? Math.min(100, Math.round((confirmedAppointments / appointments.length) * 100))
    : 0;
  const listingsPercent = inquiries.length
    ? Math.min(100, Math.round((respondedInquiries / inquiries.length) * 100))
    : 0;

  const data = useMemo(() => {
    const points = 6;
    return Array.from({ length: points }).map((_, index) => {
      const date = new Date(Date.now() - (points - index - 1) * 5 * 24 * 3600 * 1000);
      const label = new Intl.DateTimeFormat(language, { month: 'short', day: 'numeric' }).format(date);
      const viewsSeed = favoritesCount * (index + 2);
      const inquiriesSeed = inquiries.length * (index + 3);
      return {
        label,
        views: 140 + (viewsSeed % 70) + index * 8,
        inquiries: 25 + (inquiriesSeed % 30) + index * 5,
      };
    });
  }, [favoritesCount, inquiries.length, language]);

  const maxValue = Math.max(...data.map((d) => Math.max(d.views, d.inquiries)), 1);

  const buildPath = (key: 'views' | 'inquiries') => {
    return data
      .map((point, index) => {
        const x = (index / (data.length - 1)) * 100;
        const y = 100 - (point[key] / maxValue) * 100;
        return `${index === 0 ? 'M' : 'L'} ${x},${y}`;
      })
      .join(' ');
  };

  const viewsPath = buildPath('views');
  const inquiriesPath = buildPath('inquiries');

  return (
    <section
      id="performance-overview"
      className="rounded-[32px] border border-slate-100 bg-white p-6 shadow-[0_12px_45px_rgba(15,23,42,0.06)] dark:border-slate-800/60 dark:bg-slate-900/70 sm:p-8"
    >
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">{copy.title[safeLanguage]}</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">{copy.subtitle[safeLanguage]}</p>
        </div>
        <div className="flex items-center gap-3 text-xs font-medium uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">
          <span className="inline-flex items-center gap-1 text-sky-500">
            <span className="h-2.5 w-2.5 rounded-full bg-sky-500" />
            {copy.viewsLabel[safeLanguage]}
          </span>
          <span className="inline-flex items-center gap-1 text-amber-500">
            <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
            {copy.inquiriesLabel[safeLanguage]}
          </span>
        </div>
      </header>

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,0.8fr)]">
        <div className="relative overflow-hidden rounded-[28px] border border-slate-100 bg-gradient-to-br from-white via-white to-slate-50 p-6 shadow-[0_10px_35px_rgba(15,23,42,0.06)] dark:border-slate-800/60 dark:bg-slate-900/70">
          <svg viewBox="0 0 100 100" className="h-48 w-full" preserveAspectRatio="none">
            <defs>
              <linearGradient id="viewsGradient" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="rgba(59,130,246,0.32)" />
                <stop offset="100%" stopColor="rgba(59,130,246,0)" />
              </linearGradient>
            </defs>
            <path
              d={`${viewsPath} L 100,100 L 0,100 Z`}
              fill="url(#viewsGradient)"
              stroke="none"
              opacity={0.5}
            />
            <path d={viewsPath} fill="none" stroke="#3B82F6" strokeWidth={2} strokeLinecap="round" />
            <path d={inquiriesPath} fill="none" stroke="#F97316" strokeWidth={2} strokeLinecap="round" strokeDasharray="6 4" />
          </svg>
          <div className="mt-4 grid grid-cols-3 gap-3 text-xs font-medium uppercase tracking-[0.16em] text-slate-400 dark:text-slate-500">
            {data.map((point) => (
              <span key={point.label} className="text-center">{point.label}</span>
            ))}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
          <ProgressPill label={copy.offers[safeLanguage]} value={offersPercent} tone="sky" />
          <ProgressPill label={copy.listings[safeLanguage]} value={listingsPercent} tone="amber" />
        </div>
      </div>
    </section>
  );
}

function ProgressPill({ label, value, tone }: { label: string; value: number; tone: 'sky' | 'amber' }) {
  const circleStyle =
    tone === 'sky'
      ? { backgroundImage: `conic-gradient(#3B82F6 ${value}%, rgba(59,130,246,0.12) ${value}% 100%)`, color: '#3B82F6' }
      : { backgroundImage: `conic-gradient(#F97316 ${value}%, rgba(249,115,22,0.12) ${value}% 100%)`, color: '#F97316' };

  return (
    <div className="flex items-center justify-between gap-4 rounded-[28px] border border-slate-100 bg-white p-5 shadow-[0_10px_35px_rgba(15,23,42,0.06)] dark:border-slate-800/60 dark:bg-slate-900/70">
      <div>
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">{label}</p>
        <p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">{value}%</p>
      </div>
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-50 shadow-inner dark:bg-slate-800/70">
        <div
          className={cn('flex h-14 w-14 items-center justify-center rounded-full text-sm font-semibold')}
          style={circleStyle}
        >
          {value}%
        </div>
      </div>
    </div>
  );
}


