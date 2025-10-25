'use client';

import React, { useState } from 'react';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import ResizableFilterSidebar from './ResizableFilterSidebar';
import SearchHeader from './SearchHeader';
import PropertiesGrid from './PropertiesGrid';
import AIChatComponent from './AIChatComponent';

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

export default function ResizablePropertiesPage() {
  const [filters, setFilters] = useState<FiltersState>({
    priceRange: [0, 1000000],
    bedrooms: [],
    bathrooms: [],
    propertyTypes: [],
    transactionType: '',
    constructionStatus: '',
    floor: '',
    furniture: '',
    area: [0, 500],
    amenities: []
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'map' | 'grid'>('grid');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <SearchHeader 
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          onFiltersToggle={() => {}}
        />
      </div>

      {/* Resizable Layout */}
      <div className="h-[calc(100vh-120px)]">
        <PanelGroup direction="horizontal">
          {/* Resizable Filter Sidebar Panel */}
          <Panel 
            defaultSize={25} 
            minSize={15} 
            maxSize={40}
            className="bg-white"
          >
            <ResizableFilterSidebar onFiltersChange={setFilters} />
          </Panel>

          {/* Resize Handle */}
          <PanelResizeHandle className="w-2 bg-gray-200 hover:bg-orange-300 transition-colors duration-200 cursor-col-resize flex items-center justify-center group">
            <div className="w-1 h-8 bg-gray-400 rounded-full group-hover:bg-primary-400 transition-colors duration-200"></div>
          </PanelResizeHandle>

          {/* Properties Content Panel */}
          <Panel defaultSize={75} minSize={60}>
            <div className="h-full overflow-y-auto bg-gray-50">
              <div className="p-6">
                <div className="mb-6">
                  <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-gray-900">
                      ყველა ქონება
                    </h1>
                    <div className="text-sm text-gray-500">
                      გვერდი 1 4-დან
                    </div>
                  </div>
                  <p className="text-gray-600 mt-1">
                    აღმოაჩინეთ თქვენი სრულყოფილი ქონება
                  </p>
                </div>

                <div className="mb-4 flex items-center justify-between">
                  <p className="text-gray-600">ნაჩვენებია 1-25 100-დან ქონება</p>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500">სორტირება:</span>
                    <select className="border border-gray-300 rounded-lg px-3 py-1 text-sm">
                      <option>ახალი პირველი</option>
                      <option>ფასი: ნაკლები → მეტი</option>
                      <option>ფასი: მეტი → ნაკლები</option>
                      <option>ფართობი: ნაკლები → მეტი</option>
                      <option>ფართობი: მეტი → ნაკლები</option>
                    </select>
                  </div>
                </div>

                <PropertiesGrid 
                  searchQuery={searchQuery}
                  filters={filters}
                />
              </div>
            </div>
          </Panel>
        </PanelGroup>
      </div>

      {/* Active Filters Display */}
      <div className="fixed bottom-4 right-4 z-50">
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-3">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-primary-400 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-gray-700">
              React Resizable Panels Test
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Drag სპეციალისტი გაშალეთ/შეკეცეთ sidebar
          </p>
        </div>
      </div>

      {/* AI Chat Component - Fixed Position */}
      {/* AI Chat mounted globally in layout */}
    </div>
  );
} 