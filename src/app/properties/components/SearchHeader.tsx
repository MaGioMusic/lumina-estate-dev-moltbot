'use client';

import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import IOSToggle from './IOSToggle';

interface SearchHeaderProps {
  onSearch: (query: string) => void;
  onViewChange: (view: 'grid' | 'map') => void;
  currentView: 'grid' | 'map';
}

export default function SearchHeader({ onSearch, onViewChange, currentView }: SearchHeaderProps) {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  return (
    <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
      <div className="w-full px-8 lg:px-12 py-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          {/* Page Title - More compact */}
          <div className="flex-shrink-0">
            <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              {t('allProperties')}
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Discover your perfect property
            </p>
          </div>

          {/* Search Form - Cleaner design without shadows */}
          <form onSubmit={handleSubmit} className="flex-1 max-w-md">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('searchPlaceholder')}
                className="w-full pl-12 pr-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-full focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 transition-all duration-200 hover:bg-white dark:hover:bg-gray-700 focus:bg-white dark:focus:bg-gray-700"
              />
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </form>

          {/* View Toggle - iOS Style */}
          <IOSToggle 
            isGrid={currentView === 'grid'} 
            onToggle={onViewChange}
          />
        </div>
      </div>
    </div>
  );
} 