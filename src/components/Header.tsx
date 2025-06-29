'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { getLocalImagePath } from '@/lib/imageUrls';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
// Phosphor Icons
import { 
  List, X, House, Buildings, Users, UserCircle, Phone, User,
  MagnifyingGlass, Heart, Moon, Sun, SignIn, Globe, Gear
} from '@phosphor-icons/react';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();

  // Check if we're on the agents page
  const isAgentsPage = pathname.startsWith('/agents');

  // Base navigation items
  const baseNavItems = [
    { name: t('home'), href: '/', icon: House },
    { name: t('properties'), href: '/properties', icon: Buildings },
    { name: t('investors'), href: '/investors', icon: Users },
    { name: t('agents'), href: '/agents', icon: UserCircle },
  ];

  // Navigation items that come after agent tabs
  const endNavItems = [
    { name: t('about'), href: '/about', icon: User },
    { name: t('contact'), href: '/contact', icon: Phone },
  ];

  // Agent-specific tabs 
  const agentTabs = [
    { name: 'Dashboard', href: '/agents?tab=dashboard', icon: House },
    { name: 'Clients', href: '/agents?tab=clients', icon: Users },
    { name: 'Analytics', href: '/agents?tab=analytics', icon: UserCircle },
  ];

  // Settings tab (only for mobile menu)
  const settingsTab = { name: 'Settings', href: '/agents?tab=settings', icon: Gear };

  // Desktop navigation items (includes main agent tabs but not Settings)
  const navItems = isAgentsPage 
    ? [...baseNavItems, ...agentTabs, ...endNavItems] 
    : [...baseNavItems, ...endNavItems];

  // Mobile navigation items (includes all agent tabs including Settings)
  const mobileNavItems = isAgentsPage 
    ? [...baseNavItems, ...agentTabs, settingsTab, ...endNavItems] 
    : [...baseNavItems, ...endNavItems];

  const menuItems = [
    {
      id: 'main',
      items: [
        { name: t('login'), icon: SignIn, action: 'login' },
        { name: t('quickSearch'), icon: MagnifyingGlass, action: 'search' },
        { name: t('favorites'), icon: Heart, action: 'favorites' },
        { 
          name: theme === 'dark' ? t('lightMode') : t('darkMode'), 
          icon: theme === 'dark' ? Sun : Moon, 
          action: 'theme' 
        },
        { name: t('settings'), icon: Gear, action: 'settings' },
        { name: t('language'), icon: Globe, action: 'language' }
      ]
    }
  ];

  const languages = [
    { code: 'ka', name: t('georgian'), flag: '🇬🇪' },
    { code: 'en', name: t('english'), flag: '🇺🇸' },
    { code: 'ru', name: t('russian'), flag: '🇷🇺' }
  ];

  const handleMenuAction = (action: string) => {
    switch (action) {
      case 'login':
        // TODO: Implement login functionality
        break;
      case 'signup':
        // TODO: Implement signup functionality
        break;
      case 'search':
        // TODO: Implement search functionality
        break;
      case 'favorites':
        // TODO: Implement favorites functionality
        break;
      case 'theme':
        toggleTheme();
        break;
      case 'notifications':
        // TODO: Implement notifications functionality
        break;
      case 'privacy':
        // TODO: Implement privacy functionality
        break;
      case 'accountSettings':
        // TODO: Implement account settings functionality
        break;
      case 'settings':
        router.push('/settings');
        break;
      case 'language':
        // Language switcher is handled separately
        break;
    }
    setIsMobileMenuOpen(false);
  };

  const handleLanguageChange = (langCode: 'ka' | 'en' | 'ru') => {
    setLanguage(langCode);
    setIsMobileMenuOpen(false);
  };

  // Close menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Close menu on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (isMobileMenuOpen && !target.closest('.mobile-menu-container')) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMobileMenuOpen]);

  return (
    <header className="bg-white/95 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16 relative">
          {/* Logo - Conditional based on page */}
          <div className="flex-shrink-0">
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
              // Default Lumina Estate Logo for all other pages
              <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
                <div className="w-8 h-8 bg-[#F08336] rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">L</span>
                </div>
                <span className="text-xl font-bold text-gray-900">Lumina Estate</span>
              </Link>
            )}
          </div>

          {/* Desktop Navigation - Center */}
          <nav className="hidden lg:flex items-center gap-x-4 absolute left-1/2 transform -translate-x-1/2 z-20 top-1/2 -translate-y-1/2">
            {navItems.map((item) => {
              // Special logic for agents page tabs
              let isActive = false;
              if (item.href.includes('/agents?tab=')) {
                const currentTab = searchParams.get('tab') || 'dashboard';
                const itemTab = new URL(item.href, 'http://localhost').searchParams.get('tab');
                isActive = currentTab === itemTab;
              } else if (item.href === '/agents') {
                // Agents tab is active only when on dashboard or no tab specified
                const currentTab = searchParams.get('tab') || 'dashboard';
                isActive = pathname === '/agents' && currentTab === 'dashboard';
              } else {
                isActive = pathname === item.href;
              }
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-sm font-medium transition-colors duration-200 hover:text-[#F08336] whitespace-nowrap ${
                    isActive
                      ? 'text-[#F08336] border-b-2 border-[#F08336] pb-1'
                      : 'text-gray-700'
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Mobile Menu Button - Absolute Right */}
          <div className="mobile-menu-container absolute right-0">
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
              <div className="absolute right-0 top-full mt-1 w-64 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden z-50">
                {/* Navigation Links - Mobile Only */}
                <div className="p-3 border-b border-gray-100 lg:hidden">
                  <div className="space-y-1">
                    {mobileNavItems.map((item) => {
                      const Icon = item.icon;
                      
                      // Special logic for agents page tabs
                      let isActive = false;
                      if (item.href.includes('/agents?tab=')) {
                        const currentTab = searchParams.get('tab') || 'dashboard';
                        const itemTab = new URL(item.href, 'http://localhost').searchParams.get('tab');
                        isActive = currentTab === itemTab;
                      } else if (item.href === '/agents') {
                        // Agents tab is active only when on dashboard or no tab specified
                        const currentTab = searchParams.get('tab') || 'dashboard';
                        isActive = pathname === '/agents' && currentTab === 'dashboard';
                      } else {
                        isActive = pathname === item.href;
                      }
                      
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          className={`flex items-center space-x-2 p-2 rounded-lg transition-colors text-sm ${
                            isActive
                              ? 'bg-[#F08336]/10 text-[#F08336]'
                              : 'text-gray-700 hover:bg-gray-50 hover:text-[#F08336]'
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
                              <div className="flex items-center space-x-2 p-2 text-gray-700 text-sm">
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
                                        : 'text-gray-600 hover:bg-gray-50 hover:text-[#F08336]'
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
                            className="flex items-center space-x-2 w-full p-2 rounded-lg text-left transition-colors text-gray-700 hover:bg-gray-50 hover:text-[#F08336] text-sm"
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