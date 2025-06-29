'use client';

import { useState } from 'react';
import SearchHeader from './components/SearchHeader';
import FiltersSidebar from './components/FiltersSidebar';
import PropertiesGrid from './components/PropertiesGrid';
import MapView from './components/MapView';
import AIChatComponent from './components/AIChatComponent';

interface FiltersState {
  priceRange: [number, number];
  bedrooms: string;
  bathrooms: string;
  propertyType: string;
  area: [number, number];
}

export default function PropertiesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentView, setCurrentView] = useState<'grid' | 'map'>('grid');
  const [filters, setFilters] = useState<FiltersState>({
    priceRange: [0, 1000000],
    bedrooms: '',
    bathrooms: '',
    propertyType: '',
    area: [0, 500]
  });

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // Implement search logic here
    console.log('Searching for:', query);
  };

  const handleViewChange = (view: 'grid' | 'map') => {
    setCurrentView(view);
  };

  const handleFiltersChange = (newFilters: FiltersState) => {
    setFilters(newFilters);
    // Implement filter logic here
    console.log('Filters changed:', newFilters);
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] dark:bg-dark-bg transition-colors duration-300">
      {/* Search Header */}
      <div className="pt-16 pb-5 px-6 animate-fade-in">
        <SearchHeader
          onSearch={handleSearch}
          onViewChange={handleViewChange}
          currentView={currentView}
        />
      </div>

      {/* Main Content */}
      <div className="flex gap-5 px-6 pb-16 animate-slide-up">
        {/* Left Sidebar */}
        <div className="flex-shrink-0">
          <FiltersSidebar onFiltersChange={handleFiltersChange} />
        </div>

        {/* Right Content */}
        <div className="flex-1">
          {currentView === 'grid' ? (
            <PropertiesGrid searchQuery={searchQuery} filters={filters} />
          ) : (
            <div className="h-[600px] bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
              <MapView />
            </div>
          )}
        </div>
      </div>

      {/* AI Chat Component */}
      <AIChatComponent />
    </div>
  );
} 