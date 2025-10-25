'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import FancySwitch from '@/components/FancySwitch';

export default function SettingsPage() {
  const { t } = useLanguage();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Header */}
      <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4">
        <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">{t('settings')}</h1>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div className="w-80 border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
          {/* Account Section */}
          <div className="bg-gray-50 dark:bg-gray-800 px-4 py-3 flex items-center gap-3">
            <div className="w-5 h-5">
              <svg viewBox="0 0 20 20" fill="currentColor" className="text-gray-900 dark:text-gray-100">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
            </div>
            <span className="text-gray-900 dark:text-gray-100 font-medium">{t('account')}</span>
          </div>

          {/* Navigation Items */}
          <div className="px-4 py-6 space-y-7">
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-gray-500 dark:text-gray-400">
                <div className="w-5 h-5">
                  <svg viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm0 2h12v8H4V6z" clipRule="evenodd" />
                  </svg>
                </div>
                <span>{t('appearance')}</span>
              </div>
              
              <div className="flex items-center gap-3 text-gray-500 dark:text-gray-400">
                <div className="w-5 h-5">
                  <svg viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10 2L3 7v11h4v-6h6v6h4V7l-7-5z" />
                  </svg>
                </div>
                <span>{t('notifications')}</span>
              </div>

              <div className="flex items-center gap-3 text-gray-500 dark:text-gray-400">
                <div className="w-5 h-5">
                  <svg viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7.001c0-.682.057-1.35.166-2.002zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <span>{t('privacySecurity')}</span>
              </div>

              <div className="flex items-center gap-3 text-gray-500 dark:text-gray-400">
                <div className="w-5 h-5">
                  <svg viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <span>{t('applications')}</span>
              </div>

              <div className="flex items-center gap-3 text-gray-500 dark:text-gray-400">
                <div className="w-5 h-5">
                  <svg viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                  </svg>
                </div>
                <span>{t('integrations')}</span>
              </div>

              <div className="flex items-center gap-3 text-gray-500 dark:text-gray-400">
                <div className="w-5 h-5">
                  <svg viewBox="0 0 20 20" fill="currentColor">
                    <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4zM18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" />
                  </svg>
                </div>
                <span>{t('billingSubscription')}</span>
              </div>

              <div className="flex items-center gap-3 text-gray-500 dark:text-gray-400">
                <div className="w-5 h-5">
                  <svg viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                  </svg>
                </div>
                <span>{t('helpSupport')}</span>
              </div>
            </div>
          </div>

          {/* Theme Preferences */}
          <div className="px-5 py-4 border-t border-gray-100 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-black dark:text-white mb-4">{t('themePreferences')}</h3>
            
            <div className="mb-4">
              <label className="text-black dark:text-white text-sm mb-2 block">{t('theme')}</label>
              <FancySwitch
                checked={theme === 'dark'}
                onChange={toggleTheme}
                leftLabel={t('lightMode')}
                rightLabel={t('darkMode')}
                leftIcon={
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                }
                rightIcon={
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                }
                ariaLabel={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              />
            </div>

            <div className="mb-4">
              <label className="text-black dark:text-white text-sm mb-1 block">{t('highContrastMode')}</label>
              <p className="text-gray-500 dark:text-gray-400 text-xs mb-3">{t('increaseContrast')}</p>
            </div>

            <div>
              <label className="text-black dark:text-white text-sm mb-1 block">{t('fontSize')}</label>
              <p className="text-gray-500 dark:text-gray-400 text-xs">{t('small')}</p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          <h2 className="text-2xl font-bold text-black dark:text-white mb-6">{t('accountSettings')}</h2>

          {/* Profile Section */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-primary-400 to-sage-400 flex items-center justify-center text-white text-xl font-bold">
                JD
              </div>
              <div>
                <h3 className="text-lg font-semibold text-black dark:text-white">John Doe</h3>
                <p className="text-gray-500 dark:text-gray-400">john.doe@example.com</p>
              </div>
            </div>
            <button className="bg-primary-400 text-white px-4 py-2 rounded-md hover:bg-primary-500 transition-colors">
              {t('editProfile')}
            </button>
          </div>

          <hr className="mb-6 border-gray-200 dark:border-gray-700" />

          {/* Settings Cards */}
          <div className="space-y-6">
            {/* Personal Information */}
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-black dark:text-white mb-2">{t('personalInformation')}</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6">{t('updatePersonalDetails')}</p>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="text-black dark:text-white text-sm mb-2 block">{t('fullName')}</label>
                  <input 
                    type="text" 
                    defaultValue="John Doe"
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-black dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-black dark:text-white text-sm mb-2 block">{t('emailAddress')}</label>
                  <input 
                    type="email" 
                    defaultValue="john.doe@example.com"
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-black dark:text-white"
                  />
                </div>
              </div>
              
              <div className="mb-6">
                <label className="text-black dark:text-white text-sm mb-2 block">{t('phoneNumber')}</label>
                <input 
                  type="tel" 
                  defaultValue="+1 (555) 123-4567"
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-black dark:text-white"
                />
              </div>
              
              <button className="bg-primary-400 text-white px-6 py-2 rounded-md hover:bg-primary-500 transition-colors">
                {t('saveChanges')}
              </button>
            </div>

            {/* Password */}
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-black dark:text-white mb-2">{t('password')}</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6">{t('updatePassword')}</p>
              
              <div className="mb-4">
                <label className="text-black dark:text-white text-sm mb-2 block">{t('currentPassword')}</label>
                <input 
                  type="password" 
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-black dark:text-white"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="text-black dark:text-white text-sm mb-2 block">{t('newPassword')}</label>
                  <input 
                    type="password" 
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-black dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-black dark:text-white text-sm mb-2 block">{t('confirmPassword')}</label>
                  <input 
                    type="password" 
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-black dark:text-white"
                  />
                </div>
              </div>
              
              <button className="bg-primary-400 text-white px-6 py-2 rounded-md hover:bg-primary-500 transition-colors">
                {t('updatePassword')}
              </button>
            </div>

            {/* Notifications */}
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-black dark:text-white mb-2">{t('notifications')}</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6">{t('manageNotifications')}</p>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-black dark:text-white font-medium">{t('emailNotifications')}</h4>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">{t('receiveEmailUpdates')}</p>
                  </div>
                  <FancySwitch
                    checked={true}
                    onChange={() => {}}
                    leftLabel={t('off')}
                    rightLabel={t('on')}
                    ariaLabel="Toggle email notifications"
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-black dark:text-white font-medium">{t('pushNotifications')}</h4>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">{t('receivePushUpdates')}</p>
                  </div>
                  <FancySwitch
                    checked={false}
                    onChange={() => {}}
                    leftLabel={t('off')}
                    rightLabel={t('on')}
                    ariaLabel="Toggle push notifications"
                  />
                </div>
              </div>
            </div>

            {/* Danger Zone */}
            <div className="bg-white dark:bg-gray-800 border border-red-200 dark:border-red-700 rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-red-600 dark:text-red-400 mb-2">{t('dangerZone')}</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6">{t('irreversibleActions')}</p>
              
              <div className="space-y-4">
                <button className="bg-red-500 text-white px-6 py-2 rounded-md hover:bg-red-600 transition-colors">
                  {t('deleteAccount')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-gray-200 dark:border-gray-700 px-6 py-4 bg-gray-50 dark:bg-gray-800">
        <p className="text-gray-500 dark:text-gray-400 text-xs">© 2023 Lumina Estate</p>
      </div>
    </div>
  );
}
