'use client';

import { motion } from 'framer-motion';
import { BellSimpleRinging, ArrowsDownUp, Calendar, Star } from '@phosphor-icons/react';
import type { ProfileNotification } from '@/types/profile';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

interface NotificationsPanelProps {
  notifications: ProfileNotification[];
}

const iconMap: Record<ProfileNotification['type'], React.ReactNode> = {
  new_property: <Star size={16} weight="fill" />,
  price_change: <ArrowsDownUp size={16} weight="bold" />,
  appointment: <Calendar size={16} weight="bold" />,
  review: <Star size={16} weight="regular" />,
  system: <BellSimpleRinging size={16} weight="bold" />,
};

const copy = {
  title: { ka: 'კლიენტის აქტივობა', en: 'Client activity', ru: 'Активность клиентов' },
  subtitle: {
    ka: 'ახალი მესიჯები და სტატუსის ცვლილებები',
    en: 'Latest messages and status changes',
    ru: 'Сообщения и обновления статуса',
  },
  empty: {
    ka: 'ახლა აქტივობა არ არის',
    en: 'No activity at the moment',
    ru: 'Активности пока нет',
  },
};

export function NotificationsPanel({ notifications }: NotificationsPanelProps) {
  const { language } = useLanguage();
  const safeLanguage = language === 'ru' ? 'ru' : language === 'en' ? 'en' : 'ka';
  const localize = (key: keyof typeof copy) => copy[key][safeLanguage] ?? copy[key].en;

  return (
    <section
      id="client-activity"
      className="rounded-3xl border border-slate-100 bg-white p-6 shadow-[0_12px_45px_rgба(15,23,42,0.07)] dark:border-slate-800/60 dark:bg-slate-900/70"
    >
      <header className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">{localize('title')}</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">{localize('subtitle')}</p>
        </div>
        <div className="rounded-full border border-slate-100 bg-slate-50 p-2 shadow-sm dark:border-slate-700 dark:bg-slate-800/70">
          <BellSimpleRinging size={18} weight="bold" className="text-amber-500" />
        </div>
      </header>

      {notifications.length === 0 ? (
        <div className="flex h-32 items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 text-sm text-slate-400 dark:border-slate-700 dark:bg-slate-900/50 dark:text-slate-500">
          {localize('empty')}
        </div>
      ) : (
        <ul className="space-y-3">
          {notifications.slice(0, 5).map((notification) => (
            <motion.li
              key={notification.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className={cn(
                'flex gap-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-[0_12px_35px_rgба(15,23,42,0.07)] dark:border-slate-800/60 dark:bg-slate-900/70',
                !notification.isRead && 'ring-amber-200/40 ring-offset-2'
              )}
            >
              <div className="mt-1 flex h-9 w-9 items-center justify-center rounded-xl bg-amber-100 text-amber-500">
                {iconMap[notification.type]}
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-white">{notification.title}</h3>
                  <time className="text-xs text-slate-400 dark:text-slate-500" dateTime={notification.createdAt}>
                    {new Date(notification.createdAt).toLocaleString(language)}
                  </time>
                </div>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{notification.message}</p>
                {notification.actionUrl && (
                  <a
                    href={notification.actionUrl}
                    className="mt-3 inline-flex items-center text-xs font-medium text-amber-600 transition hover:text-amber-500 dark:text-amber-200"
                  >
                    {safeLanguage === 'ru' ? 'Перейти' : safeLanguage === 'en' ? 'View details' : 'იხილე დეტალები'}
                  </a>
                )}
              </div>
            </motion.li>
          ))}
        </ul>
      )}
    </section>
  );
}


