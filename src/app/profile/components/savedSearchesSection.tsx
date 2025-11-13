'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import type { ProfileSavedSearch } from '@/types/profile';

interface SavedSearchesSectionProps {
  savedSearches: ProfileSavedSearch[];
}

const copy = {
  title: { ka: 'შენახული ძიებები', en: 'Saved searches', ru: 'Сохранённые поиски' },
  subtitle: {
    ka: 'სწრაფი წვდომა შენახულ ფილტრებსა და ალერტებზე',
    en: 'Quick access to your filters and alerts',
    ru: 'Быстрый доступ к фильтрам и оповещениям',
  },
  created: { ka: 'შექმნილი', en: 'Created', ru: 'Создано' },
  lastRun: { ka: 'ბოლო გაშვება', en: 'Last run', ru: 'Последний запуск' },
  empty: {
    ka: 'ჯერ არ გაქვს შენახული ძიებები. შექმენი შენი პირველი ფილტრი Lumina-ში!',
    en: 'No saved searches yet. Create your first Lumina filter!',
    ru: 'Нет сохранённых поисков. Создайте первый фильтр Lumina!',
  },
};

export function SavedSearchesSection({ savedSearches }: SavedSearchesSectionProps) {
  const { language } = useLanguage();
  const safeLanguage = language === 'ru' ? 'ru' : language === 'en' ? 'en' : 'ka';

  return (
    <section id="saved-searches" className="space-y-5 rounded-[32px] border border-slate-100 bg-white p-6 shadow-[0_12px_45px_rgba(15,23,42,0.07)] dark:border-slate-800/60 dark:bg-slate-900/75 sm:p-7">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">{copy.title[safeLanguage]}</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">{copy.subtitle[safeLanguage]}</p>
        </div>
        {savedSearches.length > 0 && (
          <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-600 dark:border-slate-700 dark:bg-slate-800/70 dark:text-slate-200">
            {savedSearches.length} {copy.title[safeLanguage]}
          </span>
        )}
      </header>

      {savedSearches.length === 0 ? (
        <div className="flex h-40 flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-slate-50 text-center text-sm text-slate-400 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-500">
          {copy.empty[safeLanguage]}
        </div>
      ) : (
        <div className="space-y-4">
          {savedSearches.map((search) => (
            <article
              key={search.id}
              className="rounded-[28px] border border-slate-100 bg-white p-5 shadow-[0_10px_35px_rgba(15,23,42,0.07)] dark:border-slate-800/60 dark:bg-slate-900/70"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="text-base font-semibold text-slate-900 dark:text-white">{search.name}</h3>
                  <p className="text-xs uppercase tracking-[0.26em] text-slate-400 dark:text-slate-500">
                    {Object.entries(search.filters ?? {})
                      .slice(0, 2)
                      .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(', ') : value}`)
                      .join(' · ')}
                  </p>
                </div>
                {typeof search.totalMatches === 'number' && (
                  <span className="rounded-full bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-600 dark:bg-amber-500/15 dark:text-amber-200">
                    {search.totalMatches}
                  </span>
                )}
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-2">
                {Object.entries(search.filters ?? {}).map(([key, value]) => (
                  <span
                    key={`${search.id}-${key}`}
                    className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-500 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-300"
                  >
                    {key}: {Array.isArray(value) ? value.join(', ') : String(value)}
                  </span>
                ))}
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-slate-400 dark:text-slate-500">
                <span>
                  {copy.created[safeLanguage]} · {new Date(search.createdAt).toLocaleDateString(language)}
                </span>
                {search.lastRunAt && (
                  <span>
                    {copy.lastRun[safeLanguage]} · {new Date(search.lastRunAt).toLocaleDateString(language)}
                  </span>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}


