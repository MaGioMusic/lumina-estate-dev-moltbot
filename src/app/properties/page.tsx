'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import FiltersSidebar from './components/FiltersSidebar';
import PropertiesGrid from './components/PropertiesGrid';
import MapView from './components/MapView';
import AIChatComponent from './components/AIChatComponent';

interface FiltersState {
  priceRange: [number, number];
  bedrooms: string[];
  bathrooms: string[];
  propertyTypes: string[];
  transactionType: string;
  constructionStatus: string;
  floor: string;
  furniture: string;
  area: [number, number];
  amenities: string[];
}

export default function PropertiesPage() {
  const { t } = useLanguage();
  const [currentView, setCurrentView] = useState<'grid' | 'map'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<FiltersState>({
    priceRange: [0, 1000000],
    propertyTypes: [],
    bedrooms: [],
    bathrooms: [],
    transactionType: '',
    constructionStatus: '',
    floor: '',
    furniture: '',
    area: [0, 500],
    amenities: []
  });

  // Listen for view changes from header
  useEffect(() => {
    const handleViewChange = (event: CustomEvent) => {
      setCurrentView(event.detail);
    };

    window.addEventListener('viewChange', handleViewChange as EventListener);
    return () => {
      window.removeEventListener('viewChange', handleViewChange as EventListener);
    };
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // Handle search logic here
    console.log('Searching for:', query);
  };

  const handleFiltersChange = (newFilters: FiltersState) => {
    console.log('Properties page received filters:', newFilters);
    setFilters(newFilters);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Main Content - Increased padding to account for sticky header */}
      <div className="w-full px-8 lg:px-12 pt-20">
        <div className="flex gap-6">
          {/* Filters Sidebar */}
          <div className="w-64 flex-shrink-0 animate-slide-right">
            <FiltersSidebar 
              onFiltersChange={handleFiltersChange}
            />
          </div>

          {/* Properties Grid or Map View */}
          <div className="flex-1 animate-fade-in">
            {currentView === 'grid' ? (
              <PropertiesGrid 
                searchQuery={searchQuery}
                filters={filters}
              />
            ) : (
              <MapView />
            )}
          </div>
        </div>
      </div>

      {/* AI Chat Component */}
      <AIChatComponent />
    </div>
  );
} 