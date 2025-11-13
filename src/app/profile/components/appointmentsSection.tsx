'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import { MapPin, Clock } from '@phosphor-icons/react';
import type { ProfileAppointment } from '@/types/profile';
import { cn } from '@/lib/utils';

interface AppointmentsSectionProps {
  appointments: ProfileAppointment[];
}

const copy = {
  title: { ka: 'დაგეგმილი ვიზიტები', en: 'Upcoming tours', ru: 'Предстоящие показы' },
  subtitle: {
    ka: 'შეხვედრების გრაფიკი და დეტალები',
    en: 'Your viewing schedule at a glance',
    ru: 'График просмотров и деталей',
  },
  noAppointments: {
    ka: 'ჯერ არ გაქვს დაგეგმილი ვიზიტები.',
    en: 'No appointments scheduled yet.',
    ru: 'Показы пока не запланированы.',
  },
  agent: { ka: 'აგენტა', en: 'Agent', ru: 'Агент' },
};

const statusClass = (status: ProfileAppointment['status']) =>
  cn(
    'rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]',
    status === 'confirmed'
      ? 'border border-emerald-200 bg-emerald-50 text-emerald-600 dark:border-emerald-500/30 dark:bg-emerald-500/20 dark:text-emerald-200'
      : status === 'scheduled'
      ? 'border border-sky-200 bg-sky-50 text-sky-600 dark:border-sky-500/30 dark:bg-sky-500/20 dark:text-sky-200'
      : status === 'completed'
      ? 'border border-slate-200 bg-slate-100 text-slate-600 dark:border-slate-700 dark:bg-slate-800/70 dark:text-slate-200'
      : 'border border-rose-200 bg-rose-50 text-rose-500 dark:border-rose-500/30 dark:bg-rose-500/20 dark:text-rose-200'
  );

export function AppointmentsSection({ appointments }: AppointmentsSectionProps) {
  const { language, t } = useLanguage();
  const safeLanguage = language === 'ru' ? 'ru' : language === 'en' ? 'en' : 'ka';

  return (
    <section
      id="appointments"
      className="space-y-4 rounded-[32px] border border-slate-100 bg-white p-6 shadow-[0_12px_45px_rgba(15,23,42,0.07)] dark:border-slate-800/60 dark:bg-slate-900/75 sm:p-7"
    >
      <header className="space-y-1">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">{copy.title[safeLanguage]}</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">{copy.subtitle[safeLanguage]}</p>
      </header>

      {appointments.length === 0 ? (
        <div className="flex h-36 items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-slate-50 text-sm text-slate-400 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-500">
          {copy.noAppointments[safeLanguage]}
        </div>
      ) : (
        <div className="space-y-4">
          {appointments.map((appointment) => (
            <motion.article
              key={appointment.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="rounded-[28px] border border-slate-100 bg-white p-5 shadow-[0_12px_40px_rgba(15,23,42,0.08)] dark:border-slate-800/60 dark:bg-slate-900/70"
            >
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                    {appointment.property.title}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    <MapPin size={16} weight="bold" className="mr-1 inline-block text-slate-400" />
                    {appointment.property.addressLine ?? appointment.property.city}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={statusClass(appointment.status)}>
                    {t(appointment.status) ?? appointment.status}
                  </span>
                  <span className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-600 dark:border-slate-700 dark:bg-slate-800/70 dark:text-slate-200">
                    {t(appointment.type) ?? appointment.type}
                  </span>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                <span>
                  <Clock size={14} weight="bold" className="mr-1 inline-block text-slate-400" />
                  {new Date(appointment.scheduledAt).toLocaleString(language)}
                </span>
                {appointment.meetingLocation && <span>{appointment.meetingLocation}</span>}
                {appointment.agent && (
                  <span>
                    {copy.agent[safeLanguage]}: {appointment.agent.name}
                  </span>
                )}
              </div>
              {appointment.notes && (
                <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">{appointment.notes}</p>
              )}
            </motion.article>
          ))}
        </div>
      )}
    </section>
  );
}


