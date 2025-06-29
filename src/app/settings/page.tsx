'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';

export default function SettingsPage() {
  const { t } = useLanguage();
  const { theme, setTheme } = useTheme();

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 px-6 py-4">
        <h1 className="text-xl font-semibold text-gray-900">{t('settings')}</h1>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div className="w-80 border-r border-gray-200 bg-white">
          {/* Account Section */}
          <div className="bg-gray-50 px-4 py-3 flex items-center gap-3">
            <div className="w-5 h-5">
              <svg viewBox="0 0 20 20" fill="currentColor" className="text-gray-900">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
            </div>
            <span className="text-gray-900 font-medium">{t('account')}</span>
          </div>

          {/* Navigation Items */}
          <div className="px-4 py-6 space-y-7">
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-gray-500">
                <div className="w-5 h-5">
                  <svg viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm0 2h12v8H4V6z" clipRule="evenodd" />
                  </svg>
                </div>
                <span>{t('appearance')}</span>
              </div>
              
              <div className="flex items-center gap-3 text-gray-500">
                <div className="w-5 h-5">
                  <svg viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10 2L3 7v11h4v-6h6v6h4V7l-7-5z" />
                  </svg>
                </div>
                <span>{t('notifications')}</span>
              </div>

              <div className="flex items-center gap-3 text-gray-500">
                <div className="w-5 h-5">
                  <svg viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7.001c0-.682.057-1.35.166-2.002zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <span>{t('privacySecurity')}</span>
              </div>

              <div className="flex items-center gap-3 text-gray-500">
                <div className="w-5 h-5">
                  <svg viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <span>{t('applications')}</span>
              </div>

              <div className="flex items-center gap-3 text-gray-500">
                <div className="w-5 h-5">
                  <svg viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                  </svg>
                </div>
                <span>{t('integrations')}</span>
              </div>

              <div className="flex items-center gap-3 text-gray-500">
                <div className="w-5 h-5">
                  <svg viewBox="0 0 20 20" fill="currentColor">
                    <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4zM18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" />
                  </svg>
                </div>
                <span>{t('billingSubscription')}</span>
              </div>

              <div className="flex items-center gap-3 text-gray-500">
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
          <div className="px-5 py-4 border-t border-gray-100">
            <h3 className="text-lg font-semibold text-black mb-4">{t('themePreferences')}</h3>
            
            <div className="mb-4">
              <label className="text-black text-sm mb-2 block">{t('theme')}</label>
              <div className="flex gap-2">
                <button 
                  onClick={() => setTheme('light')}
                  className={`px-4 py-2 rounded-md text-sm ${
                    theme === 'light' 
                      ? 'bg-orange-500 text-white' 
                      : 'border border-gray-300 text-black bg-white'
                  }`}
                >
                  {t('light')}
                </button>
                <button 
                  onClick={() => setTheme('dark')}
                  className={`px-4 py-2 rounded-md text-sm ${
                    theme === 'dark' 
                      ? 'bg-orange-500 text-white' 
                      : 'border border-gray-300 text-black bg-white'
                  }`}
                >
                  {t('dark')}
                </button>
                <button 
                  onClick={() => setTheme('system')}
                  className={`px-4 py-2 rounded-md text-sm ${
                    theme === 'system' 
                      ? 'bg-orange-500 text-white' 
                      : 'border border-gray-300 text-black bg-white'
                  }`}
                >
                  {t('system')}
                </button>
              </div>
            </div>

            <div className="mb-4">
              <label className="text-black text-sm mb-1 block">{t('highContrastMode')}</label>
              <p className="text-gray-500 text-xs mb-3">{t('increaseContrast')}</p>
            </div>

            <div>
              <label className="text-black text-sm mb-1 block">{t('fontSize')}</label>
              <p className="text-gray-500 text-xs">{t('small')}</p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          <h2 className="text-2xl font-bold text-black mb-6">{t('accountSettings')}</h2>

          {/* Profile Section */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-orange-400 to-orange-600 flex items-center justify-center text-white text-xl font-bold">
                JD
              </div>
              <div>
                <h3 className="text-lg font-semibold text-black">John Doe</h3>
                <p className="text-gray-500">john.doe@example.com</p>
              </div>
            </div>
            <button className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 transition-colors">
              {t('editProfile')}
            </button>
          </div>

          <hr className="mb-6 border-gray-200" />

          {/* Settings Cards */}
          <div className="space-y-6">
            {/* Personal Information */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-black mb-2">{t('personalInformation')}</h3>
              <p className="text-gray-500 mb-6">{t('updatePersonalDetails')}</p>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="text-black text-sm mb-2 block">{t('fullName')}</label>
                  <input 
                    type="text" 
                    defaultValue="John Doe"
                    className="w-full p-3 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="text-black text-sm mb-2 block">{t('emailAddress')}</label>
                  <input 
                    type="email" 
                    defaultValue="john.doe@example.com"
                    className="w-full p-3 border border-gray-300 rounded-md"
                  />
                </div>
              </div>
              
              <div className="mb-6">
                <label className="text-black text-sm mb-2 block">{t('phoneNumber')}</label>
                <input 
                  type="tel" 
                  defaultValue="+1 (555) 123-4567"
                  className="w-full p-3 border border-gray-300 rounded-md"
                />
              </div>
              
              <button className="bg-orange-500 text-white px-6 py-2 rounded-md hover:bg-orange-600 transition-colors">
                {t('saveChanges')}
              </button>
            </div>

            {/* Password */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-black mb-2">{t('password')}</h3>
              <p className="text-gray-500 mb-6">{t('updatePassword')}</p>
              
              <div className="mb-4">
                <label className="text-black text-sm mb-2 block">{t('currentPassword')}</label>
                <input 
                  type="password" 
                  className="w-full p-3 border border-gray-300 rounded-md"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="text-black text-sm mb-2 block">{t('newPassword')}</label>
                  <input 
                    type="password" 
                    className="w-full p-3 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="text-black text-sm mb-2 block">{t('confirmNewPassword')}</label>
                  <input 
                    type="password" 
                    className="w-full p-3 border border-gray-300 rounded-md"
                  />
                </div>
              </div>
              
              <button className="bg-orange-500 text-white px-6 py-2 rounded-md hover:bg-orange-600 transition-colors">
                {t('updatePasswordBtn')}
              </button>
            </div>

            {/* Two-Factor Authentication */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-black mb-2">{t('twoFactorAuth')}</h3>
              <p className="text-gray-500 mb-6">{t('extraSecurity')}</p>
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-black font-medium">{t('enableTwoFactor')}</h4>
                  <p className="text-gray-500 text-sm">{t('secure2FA')}</p>
                </div>
                <div className="relative">
                  <input type="checkbox" className="sr-only" />
                  <div className="w-11 h-6 bg-gray-300 rounded-full shadow-inner">
                    <div className="w-5 h-5 bg-white rounded-full shadow transform translate-x-0.5 translate-y-0.5"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Connected Accounts */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-black mb-2">{t('connectedAccounts')}</h3>
              <p className="text-gray-500 mb-6">{t('connectAccounts')}</p>
              
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 text-gray-500">
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-black font-medium">{t('google')}</h4>
                      <p className="text-gray-500 text-sm">{t('connected')}</p>
                    </div>
                  </div>
                  <button className="border border-gray-300 text-black px-3 py-2 rounded-md text-sm hover:bg-gray-50 transition-colors">
                    {t('disconnect')}
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 text-gray-500">
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c5.51 0 10-4.48 10-10S17.51 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-black font-medium">{t('apple')}</h4>
                      <p className="text-gray-500 text-sm">{t('notConnected')}</p>
                    </div>
                  </div>
                  <button className="bg-orange-500 text-white px-3 py-2 rounded-md text-sm hover:bg-orange-600 transition-colors">
                    {t('connect')}
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 text-gray-500">
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-black font-medium">{t('facebook')}</h4>
                      <p className="text-gray-500 text-sm">{t('connected')}</p>
                    </div>
                  </div>
                  <button className="border border-gray-300 text-black px-3 py-2 rounded-md text-sm hover:bg-gray-50 transition-colors">
                    {t('disconnect')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-gray-200 px-6 py-4 bg-gray-50">
        <p className="text-gray-500 text-xs">© 2023 Lumina Estate</p>
      </div>
    </div>
  );
}
