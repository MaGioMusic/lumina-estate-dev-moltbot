'use client';

import { useState } from 'react';
import { Moon, SunDim, GlobeHemisphereEast, CurrencyCircleDollar, BellRinging } from '@phosphor-icons/react';
import type { ProfilePreferences } from '@/types/profile';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

interface PreferencesPanelProps {
  preferences: ProfilePreferences;
}

const languageOptions = [
  { id: 'ka', label: 'ქართული' },
  { id: 'en', label: 'English' },
  { id: 'ru', label: 'Русский' },
];

const currencyOptions = [
  { id: 'GEL', label: 'GEL · ₾' },
  { id: 'USD', label: 'USD · $' },
  { id: 'EUR', label: 'EUR · €' },
];

const copy = {
  preferences: { ka: 'პირადი პრეფერენციები', en: 'Preferences', ru: 'Предпочтения' },
  personalizeProfile: {
    ka: 'მიირგე ენა, ვალუტა და შეტყობინებები',
    en: 'Customize language, currency and notifications',
    ru: 'Настройте язык, валюту и уведомления',
  },
  appearance: { ka: 'ვიზუალი', en: 'Appearance', ru: 'Внешний вид' },
  chooseTheme: {
    ka: 'აირჩიე სასურველი რეჟიმი',
    en: 'Pick your preferred theme mode',
    ru: 'Выберите предпочитаемый режим темы',
  },
  instantThemeSwitch: {
    ka: 'მყისიერად გადართავს ღია და მუქ UI-ს შორის',
    en: 'Instantly switches between light and dark UI',
    ru: 'Мгновенно переключает светлый и тёмный интерфейс',
  },
  language: { ka: 'ენა', en: 'Language', ru: 'Язык' },
  chooseLanguage: {
    ka: 'აირჩიე ინტერფეისის მთავარი ენა',
    en: 'Select your primary interface language',
    ru: 'Выберите основной язык интерфейса',
  },
  currency: { ka: 'ვალუტა', en: 'Currency', ru: 'Валюта' },
  selectCurrency: {
    ka: 'გაჩვენეთ ფასები სასურველ ვალუტაში',
    en: 'Display property prices in your preferred currency',
    ru: 'Показывать цены в выбранной валюте',
  },
  notifications: { ka: 'შეტყობინებები', en: 'Notifications', ru: 'Уведомления' },
  manageNotifications: {
    ka: 'აირჩიე რომელი შეტყობინებები მოგივიდეს',
    en: 'Choose which alerts you would like to receive',
    ru: 'Выберите, какие уведомления получать',
  },
  priceDropAlerts: {
    ka: 'ფასის ცვლილების შეტყობინებები',
    en: 'Price drop alerts',
    ru: 'Оповещения о снижении цены',
  },
  priceDropDescription: {
    ka: 'რჩეული განცხადებების ფასის შემცირების მყისი შეტყობინებები.',
    en: 'Instant updates when saved properties drop in price.',
    ru: 'Мгновенные уведомления о снижении цены избранных объектов.',
  },
  newMatches: {
    ka: 'ახალი შეთავსებები',
    en: 'New matches',
    ru: 'Новые совпадения',
  },
  newMatchesDescription: {
    ka: 'ყოველდღიური დიჯესი შენახული ძიებების ახალი შედეგებით.',
    en: 'Daily digest of new listings that match your filters.',
    ru: 'Ежедневный дайджест новых объектов по вашим фильтрам.',
  },
  appointmentReminders: {
    ka: 'ვიზიტის შეხსენებები',
    en: 'Appointment reminders',
    ru: 'Напоминания о визитах',
  },
  appointmentRemindersDescription: {
    ka: 'ჭკვიანი შეტყობინებები ტურის წინ 24 სთ და 1 სთ-ით ადრე.',
    en: 'Smart reminders 24h and 1h before scheduled tours.',
    ru: 'Умные напоминания за 24 и 1 час до тура.',
  },
  newsletter: { ka: 'სიახლეების ბიულეტენი', en: 'Newsletter', ru: 'Новостная рассылка' },
  newsletterDescription: {
    ka: 'ყოველთვიური ბაზრის ანალიზი და ინვესტიციის შესაძლებლობები.',
    en: 'Monthly market insights and investment opportunities.',
    ru: 'Ежемесячная аналитика рынка и инвестиционные возможности.',
  },
};

export function PreferencesPanel({ preferences }: PreferencesPanelProps) {
  const { t } = useLanguage();
  const [currentPreferences, setCurrentPreferences] = useState(preferences);
  const safeLanguage =
    currentPreferences.language === 'ru'
      ? 'ru'
      : currentPreferences.language === 'en'
      ? 'en'
      : 'ka';
  const localize = (key: keyof typeof copy) => copy[key][safeLanguage] ?? copy[key].en;

  const toggleTheme = () => {
    setCurrentPreferences((prev) => ({
      ...prev,
      theme: prev.theme === 'dark' ? 'light' : 'dark',
    }));
  };

  const updateLanguage = (language: string) => {
    setCurrentPreferences((prev) => ({
      ...prev,
      language,
    }));
  };

  const updateCurrency = (currency: string) => {
    setCurrentPreferences((prev) => ({
      ...prev,
      currency: currency as typeof prev.currency,
    }));
  };

  const toggleNotification = (key: keyof ProfilePreferences['notifications']) => {
    setCurrentPreferences((prev) => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: !prev.notifications[key],
      },
    }));
  };

  return (
    <section className="rounded-3xl border border-white/20 bg-white/65 p-6 shadow-[0_22px_70px_rgba(15,23,42,0.08)] backdrop-blur dark:border-slate-800/60 dark:bg-slate-900/70">
      <header className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
            {localize('preferences')}
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {localize('personalizeProfile')}
          </p>
        </div>
        <div className="rounded-full border border-white/30 bg-white/70 p-2 shadow-sm dark:border-slate-700 dark:bg-slate-800/70">
          <BellRinging size={20} weight="bold" className="text-amber-500" />
        </div>
      </header>

      <div className="grid gap-5 md:grid-cols-2">
        <PreferenceCard
          title={localize('appearance')}
          description={localize('chooseTheme')}
        >
          <div className="flex items-center justify-between rounded-2xl border border-white/30 bg-white/70 p-4 dark:border-slate-700 dark:bg-slate-800/60">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/15 text-amber-500">
                {currentPreferences.theme === 'dark' ? <Moon size={22} /> : <SunDim size={22} />}
              </div>
              <div>
                <p className="text-sm font-medium text-slate-900 dark:text-white">
                  {currentPreferences.theme === 'dark' ? t('darkMode') ?? 'Dark mode' : t('lightMode') ?? 'Light mode'}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {localize('instantThemeSwitch')}
                </p>
              </div>
            </div>
            <ToggleButton active={currentPreferences.theme === 'dark'} onClick={toggleTheme} />
          </div>
        </PreferenceCard>

        <PreferenceCard
          title={localize('language')}
          description={localize('chooseLanguage')}
        >
          <div className="grid gap-3">
            {languageOptions.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => updateLanguage(option.id)}
                className={cn(
                  'flex items-center justify-between rounded-2xl border border-white/30 bg-white/70 px-4 py-3 text-sm transition hover:border-amber-300 hover:text-amber-600 dark:border-slate-700 dark:bg-slate-800/60 dark:hover:border-amber-400 dark:hover:text-amber-200',
                  currentPreferences.language === option.id
                    ? 'border-amber-400 text-amber-600 shadow-[0_14px_40px_rgba(245,158,11,0.12)] dark:border-amber-400 dark:text-amber-200'
                    : 'text-slate-600 dark:text-slate-300'
                )}
              >
                <span className="flex items-center gap-3">
                  <GlobeHemisphereEast size={18} className="text-amber-500" />
                  {option.label}
                </span>
                <div
                  className={cn(
                    'h-2.5 w-2.5 rounded-full transition',
                    currentPreferences.language === option.id
                      ? 'bg-amber-500'
                      : 'border border-slate-300 dark:border-slate-600'
                  )}
                />
              </button>
            ))}
          </div>
        </PreferenceCard>

        <PreferenceCard
          title={localize('currency')}
          description={localize('selectCurrency')}
        >
          <div className="grid gap-3">
            {currencyOptions.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => updateCurrency(option.id)}
                className={cn(
                  'flex items-center justify-between rounded-2xl border border-white/30 bg-white/70 px-4 py-3 text-sm transition hover:border-amber-300 hover:text-amber-600 dark:border-slate-700 dark:bg-slate-800/60 dark:hover:border-amber-400 dark:hover:text-amber-200',
                  currentPreferences.currency === option.id
                    ? 'border-amber-400 text-amber-600 shadow-[0_14px_40px_rgba(245,158,11,0.12)] dark:border-amber-400 dark:text-amber-200'
                    : 'text-slate-600 dark:text-slate-300'
                )}
              >
                <span className="flex items-center gap-3">
                  <CurrencyCircleDollar size={18} className="text-amber-500" />
                  {option.label}
                </span>
                <div
                  className={cn(
                    'h-2.5 w-2.5 rounded-full transition',
                    currentPreferences.currency === option.id
                      ? 'bg-amber-500'
                      : 'border border-slate-300 dark:border-slate-600'
                  )}
                />
              </button>
            ))}
          </div>
        </PreferenceCard>

        <PreferenceCard
          title={localize('notifications')}
          description={localize('manageNotifications')}
        >
          <div className="space-y-3">
            <NotificationToggle
              label={localize('priceDropAlerts')}
              description={localize('priceDropDescription')}
              active={currentPreferences.notifications.priceAlerts}
              onToggle={() => toggleNotification('priceAlerts')}
            />
            <NotificationToggle
              label={localize('newMatches')}
              description={localize('newMatchesDescription')}
              active={currentPreferences.notifications.newMatches}
              onToggle={() => toggleNotification('newMatches')}
            />
            <NotificationToggle
              label={localize('appointmentReminders')}
              description={localize('appointmentRemindersDescription')}
              active={currentPreferences.notifications.appointmentReminders}
              onToggle={() => toggleNotification('appointmentReminders')}
            />
            <NotificationToggle
              label={localize('newsletter')}
              description={localize('newsletterDescription')}
              active={currentPreferences.notifications.newsletter}
              onToggle={() => toggleNotification('newsletter')}
            />
          </div>
        </PreferenceCard>
      </div>
    </section>
  );
}

interface PreferenceCardProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

function PreferenceCard({ title, description, children }: PreferenceCardProps) {
  return (
    <div className="space-y-4 rounded-2xl border border-white/20 bg-white/70 p-5 shadow-[0_18px_50px_rgba(15,23,42,0.08)] backdrop-blur dark:border-slate-800/60 dark:bg-slate-900/65">
      <div>
        <h3 className="text-sm font-semibold text-slate-900 dark:text-white">{title}</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">{description}</p>
      </div>
      {children}
    </div>
  );
}

interface NotificationToggleProps {
  label: string;
  description: string;
  active: boolean;
  onToggle: () => void;
}

function NotificationToggle({ label, description, active, onToggle }: NotificationToggleProps) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-2xl border border-white/30 bg-white/60 px-4 py-3 dark:border-slate-700 dark:bg-slate-800/60">
      <div>
        <p className="text-sm font-medium text-slate-900 dark:text-white">{label}</p>
        <p className="text-xs text-slate-500 dark:text-slate-400">{description}</p>
      </div>
      <ToggleButton active={active} onClick={onToggle} />
    </div>
  );
}

interface ToggleButtonProps {
  active: boolean;
  onClick: () => void;
}

function ToggleButton({ active, onClick }: ToggleButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'relative h-7 w-12 rounded-full border border-transparent transition',
        active ? 'bg-emerald-500/90' : 'bg-slate-300/80 dark:bg-slate-600/60'
      )}
      aria-pressed={active}
    >
      <span
        className={cn(
          'absolute top-1/2 h-5 w-5 -translate-y-1/2 rounded-full bg-white shadow-sm transition',
          active ? 'translate-x-6' : 'translate-x-1'
        )}
      />
    </button>
  );
}


