'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { 
  List, X, House, Buildings, Users, AddressBook, Info,
  MagnifyingGlass, Heart, Moon, Sun, SignIn, Globe, Gear,
  Bell, EnvelopeSimple
} from '@phosphor-icons/react';
import IOSToggle from '@/app/properties/components/IOSToggle';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [currentView, setCurrentView] = useState<'grid' | 'map'>('grid');
  const pathname = usePathname();
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage: updateLanguage, t } = useLanguage();

  // Check if we're on properties page
  const isPropertiesPage = pathname === '/properties';
  
  // Debug log
  console.log('Current pathname:', pathname);
  console.log('Is Properties Page:', isPropertiesPage);
  
  // Check if we're on a dashboard page
  const isDashboardPage = pathname.includes('/dashboard');

  // Check if we're on agents page
  const isAgentsPage = pathname === '/agents' || pathname === '/agents/chat';

  // Base navigation items
  const navItems = [
    { name: t('home'), href: '/', icon: House },
    { name: t('properties'), href: '/properties', icon: Buildings },
    { name: t('investors'), href: '/investors', icon: Buildings },
    { name: t('agents'), href: '/agents', icon: Users },
    { name: t('about'), href: '/about', icon: Info },
    { name: t('contact'), href: '/contact', icon: AddressBook }
  ];

  // Mobile navigation items
  const mobileNavItems = navItems;

  // Menu sections
  const menuItems = [
    {
      id: 'account',
      items: [
        { name: t('search'), icon: MagnifyingGlass, action: 'search' },
        { name: t('favorites'), icon: Heart, action: 'favorites' },
        { name: t('settings'), icon: Gear, action: 'settings' },
        { name: t('language'), icon: Globe, action: 'language' },
        { name: theme === 'dark' ? t('lightMode') : t('darkMode'), icon: theme === 'dark' ? Sun : Moon, action: 'theme' },
        { name: t('login'), icon: SignIn, action: 'login' }
      ]
    }
  ];

  const languages = [
    { code: 'ka', name: t('georgian'), flag: '🇬🇪' },
    { code: 'en', name: t('english'), flag: '🇬🇧' },
    { code: 'ru', name: t('russian'), flag: '🇷🇺' }
  ];

  const handleLanguageChange = (lang: 'ka' | 'en' | 'ru') => {
    updateLanguage(lang);
    setIsMobileMenuOpen(false);
  };

  const handleMenuAction = (action: string) => {
    switch (action) {
      case 'search':
        // Handle search
        break;
      case 'favorites':
        // Handle favorites
        break;
      case 'settings':
        router.push('/settings');
        break;
      case 'theme':
        toggleTheme();
        break;
      case 'login':
        // Handle login
        break;
    }
    setIsMobileMenuOpen(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Searching for:', searchQuery);
  };

  const handleViewChange = (view: 'grid' | 'map') => {
    setCurrentView(view);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('viewChange', { detail: view }));
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.header-menu-container')) {
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMobileMenuOpen]);

  return (
    <header className="bg-white dark:bg-gray-900 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50 shadow-sm">
      <div className="w-full px-8 lg:px-12">
        <div className="flex items-center justify-between h-16">
          {/* Left side - Logo and Properties Title */}
          <div className="flex items-center gap-4">
            {isAgentsPage ? (
              // Sarah Wilson Profile for Agents Page
              <div className="flex items-center space-x-3">
                <Image
                  src="/images/photos/sarah-wilson.jpg"
                  alt="Sarah Wilson"
                  width={40}
                  height={40}
                  className="rounded-full object-cover w-10 h-10"
                />
                <div>
                  <div className="text-lg font-bold text-gray-900">Sarah Wilson</div>
                  <div className="text-xs text-gray-600">Real Estate Agent</div>
                </div>
              </div>
            ) : (
              // Default Lumina Estate Logo
              <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
                <div className="w-8 h-8 bg-[#F08336] rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">L</span>
                </div>
                <span className="text-xl font-bold text-gray-900 dark:text-gray-100">Lumina Estate</span>
              </Link>
            )}

            {/* Properties Page Title */}
            {isPropertiesPage && (
              <div className="ml-6 border-l border-gray-200 pl-6">
                <h1 className="text-sm font-medium text-gray-900 dark:text-gray-100 animate-slow-shimmer">{t('allProperties')}</h1>
                <p className="text-xs text-gray-400 dark:text-gray-500">Discover your perfect property</p>
              </div>
            )}
          </div>

          {/* Center - Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-x-6 flex-1 justify-center">
            {navItems.map((item) => {
              const isActive = pathname === item.href || 
                (isAgentsPage && item.href === '/agents');

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-sm font-medium transition-colors duration-200 hover:text-[#F08336] whitespace-nowrap ${
                    isActive
                      ? 'text-[#F08336] border-b-2 border-[#F08336] pb-1'
                      : 'text-gray-700 dark:text-gray-300'
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Right side controls */}
          <div className="flex items-center gap-3 header-menu-container">
            {/* Properties page specific controls */}
            {isPropertiesPage && (
              <>
                {/* Compact Search Bar */}
                <div className={`relative transition-all duration-300 ${
                  isSearchFocused ? 'w-64' : 'w-48'
                }`}>
                  <form onSubmit={handleSearch}>
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onFocus={() => setIsSearchFocused(true)}
                      onBlur={() => setIsSearchFocused(false)}
                      placeholder={t('searchPlaceholder')}
                      className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full text-sm dark:text-gray-100 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300"
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <MagnifyingGlass size={16} className="text-gray-400" />
                    </div>
                  </form>
                </div>

                {/* iOS Toggle */}
                <IOSToggle 
                  isGrid={currentView === 'grid'} 
                  onToggle={handleViewChange}
                />
              </>
            )}

            {/* User Profile - Only show on dashboard pages */}
            {isDashboardPage && (
              <>
                <div className="hidden lg:flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-cover bg-center border-2 border-gray-200" 
                       style={{backgroundImage: "url('https://static.motiffcontent.com/private/resource/image/1968daba13331c3-7417598c-7a87-4402-a019-272363db3103.jpeg')"}}></div>
                  <span className="text-sm font-medium text-gray-700">John Cooper</span>
                </div>
                
                {/* Notification Bell */}
                <button className="p-2 rounded-lg text-gray-700 hover:text-[#F08336] hover:bg-gray-50 transition-all duration-200">
                  <Bell size={20} weight="regular" />
                </button>
                
                {/* Mail Envelope */}
                <button className="p-2 rounded-lg text-gray-700 hover:text-[#F08336] hover:bg-gray-50 transition-all duration-200">
                  <EnvelopeSimple size={20} weight="regular" />
                </button>
              </>
            )}

            {/* Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg text-gray-700 hover:text-[#F08336] hover:bg-gray-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#F08336]/20"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X size={20} weight="regular" />
              ) : (
                <List size={20} weight="regular" />
              )}
            </button>

            {/* Mobile Menu Dropdown */}
            {isMobileMenuOpen && (
                              <div className="absolute right-0 top-full mt-1 w-64 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50">
                {/* Navigation Links - Mobile Only */}
                                  <div className="p-3 border-b border-gray-100 dark:border-gray-700 lg:hidden">
                  <div className="space-y-1">
                    {mobileNavItems.map((item) => {
                      const Icon = item.icon;
                      const isActive = pathname === item.href || 
                        (isAgentsPage && item.href === '/agents');

                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          className={`flex items-center space-x-2 p-2 rounded-lg transition-colors text-sm ${
                            isActive
                              ? 'bg-[#F08336]/10 text-[#F08336]'
                              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-[#F08336]'
                          }`}
                        >
                          <Icon size={16} weight="regular" />
                          <span className="font-medium">{item.name}</span>
                        </Link>
                      );
                    })}
                  </div>
                </div>

                {/* Menu Items */}
                {menuItems.map((section) => (
                  <div key={section.id} className="p-3">
                    <div className="space-y-1">
                      {section.items.map((item) => {
                        const Icon = item.icon;
                        
                        if (item.action === 'language') {
                          return (
                            <div key={item.action} className="space-y-1">
                                                              <div className="flex items-center space-x-2 p-2 text-gray-700 dark:text-gray-300 text-sm">
                                <Icon size={16} weight="regular" />
                                <span className="font-medium">{item.name}</span>
                              </div>
                              <div className="pl-6 space-y-1">
                                {languages.map((lang) => (
                                  <button
                                    key={lang.code}
                                    onClick={() => handleLanguageChange(lang.code as 'ka' | 'en' | 'ru')}
                                    className={`flex items-center space-x-2 w-full p-1.5 rounded-md text-left transition-colors text-sm ${
                                      language === lang.code
                                        ? 'bg-[#F08336]/10 text-[#F08336]'
                                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-[#F08336]'
                                    }`}
                                  >
                                    <span className="text-sm">{lang.flag}</span>
                                    <span className="font-medium">{lang.name}</span>
                                    {language === lang.code && (
                                      <span className="ml-auto w-1.5 h-1.5 bg-[#F08336] rounded-full"></span>
                                    )}
                                  </button>
                                ))}
                              </div>
                            </div>
                          );
                        }

                        return (
                          <button
                            key={item.action}
                            onClick={() => handleMenuAction(item.action)}
                            className="flex items-center space-x-2 w-full p-2 rounded-lg text-left transition-colors text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-[#F08336] text-sm"
                          >
                            <Icon size={16} weight="regular" />
                            <span className="font-medium">{item.name}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
} 