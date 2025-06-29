'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import PropertyCard from './PropertyCard';
import { useLanguage } from '@/contexts/LanguageContext';

interface FiltersState {
  priceRange: [number, number];
  bedrooms: string;
  bathrooms: string;
  propertyType: string;
  area: [number, number];
}

interface PropertiesGridProps {
  searchQuery: string;
  filters: FiltersState;
}

interface Property {
  id: number;
  title: string;
  price: string;
  location: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  image: string;
  type: string;
}

// Mock properties data - in real app this would come from API  
const mockProperties = Array.from({ length: 100 }, (_, i) => ({
  id: i + 1,
  image: `/images/properties/property-${(i % 15) + 1}.jpg`,
  price: Math.floor(Math.random() * 500000) + 100000,
  address: `თბილისი, ${['ვაკე', 'მთაწმინდა', 'საბურთალო', 'ისანი', 'ღლდანი'][i % 5]}`,
  bedrooms: Math.floor(Math.random() * 4) + 1,
  bathrooms: Math.floor(Math.random() * 3) + 1,
  sqft: Math.floor(Math.random() * 200) + 50,
  isFavorite: Math.random() > 0.8,
  type: ['apartment', 'house', 'villa', 'studio', 'penthouse'][i % 5],
  status: ['for-sale', 'for-rent'][i % 2],
  isNew: Math.random() > 0.7
}));

const PROPERTIES_PER_PAGE = 25;

export default function PropertiesGrid({ searchQuery, filters }: PropertiesGridProps) {
  const { t } = useLanguage();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  
  // Get current page from URL params
  const currentPage = parseInt(searchParams.get('page') || '1');
  const sortBy = searchParams.get('sort') || 'price';
  const location = searchParams.get('location') || '';
  
  // Filter and sort properties first
  const filteredProperties = mockProperties
    .filter(property => 
      location ? property.address.toLowerCase().includes(location.toLowerCase()) : true
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-asc': return a.price - b.price;
        case 'price-desc': return b.price - a.price;
        case 'size': return b.sqft - a.sqft;
        default: return a.price - b.price;
      }
    });
  
  // Calculate pagination based on filtered results
  const totalProperties = filteredProperties.length;
  const totalPages = Math.ceil(totalProperties / PROPERTIES_PER_PAGE);
  const startIndex = (currentPage - 1) * PROPERTIES_PER_PAGE;
  const endIndex = startIndex + PROPERTIES_PER_PAGE;
  

  
  const currentProperties = filteredProperties.slice(startIndex, endIndex);
  
  // Update URL without page reload
  const updateURL = (newParams: Record<string, string>) => {
    const current = new URLSearchParams(searchParams.toString());
    
    Object.entries(newParams).forEach(([key, value]) => {
      if (value) {
        current.set(key, value);
      } else {
        current.delete(key);
      }
    });
    
    // Use shallow routing - same page, URL update only
    const newURL = `${pathname}?${current.toString()}`;
    window.history.pushState(null, '', newURL);
  };
  
  // Pagination handlers
  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      updateURL({ page: page.toString() });
      // Scroll to top smoothly
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
  
  const goToPrevious = () => {
    if (currentPage > 1) {
      goToPage(currentPage - 1);
    }
  };
  
  const goToNext = () => {
    if (currentPage < totalPages) {
      goToPage(currentPage + 1);
    }
  };
  
  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      const start = Math.max(1, currentPage - 2);
      const end = Math.min(totalPages, start + maxVisible - 1);
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
    }
    
    return pages;
  };

  return (
    <div className="space-y-6">
      {/* Results Summary */}
      <div className="flex justify-between items-center">
        <p className="text-gray-600">
          {t('showing')} {startIndex + 1}-{Math.min(endIndex, filteredProperties.length)} {t('of')} {filteredProperties.length} {t('propertiesCount')}
        </p>
        <p className="text-sm text-gray-500">
          {t('page')} {currentPage} {t('of')} {totalPages}
        </p>
      </div>

      {/* Properties Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {currentProperties.map((property) => (
          <PropertyCard
            key={property.id}
            id={property.id.toString()}
            image={property.image}
            price={`$${property.price.toLocaleString()}`}
            address={property.address}
            bedrooms={property.bedrooms}
            bathrooms={property.bathrooms}
            sqft={property.sqft}
            isFavorite={property.isFavorite}
            type={property.type}
            status={property.status}
            isNew={property.isNew}
          />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2 mt-8">
          {/* Previous Button */}
          <button
            onClick={goToPrevious}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded-lg border transition-colors ${
              currentPage === 1
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-300'
            }`}
          >
            {t('previous')}
          </button>

          {/* Page Numbers */}
          {getPageNumbers().map((pageNum) => (
            <button
              key={pageNum}
              onClick={() => goToPage(pageNum)}
              className={`px-4 py-2 rounded-lg border transition-colors ${
                currentPage === pageNum
                  ? 'bg-orange-500 text-white border-orange-500'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-300'
              }`}
            >
              {pageNum}
            </button>
          ))}

          {/* Show dots if there are more pages */}
          {totalPages > 5 && currentPage < totalPages - 2 && (
            <span className="px-2 text-gray-500">...</span>
          )}

          {/* Last page if not visible */}
          {totalPages > 5 && currentPage < totalPages - 2 && (
            <button
              onClick={() => goToPage(totalPages)}
              className="px-4 py-2 rounded-lg border bg-white text-gray-700 hover:bg-gray-50 border-gray-300"
            >
              {totalPages}
            </button>
          )}

          {/* Next Button */}
          <button
            onClick={goToNext}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 rounded-lg border transition-colors ${
              currentPage === totalPages
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-300'
            }`}
          >
            {t('next')}
          </button>
        </div>
      )}

      {/* Quick Jump */}
      {totalPages > 10 && (
        <div className="flex justify-center items-center space-x-2 mt-4">
          <span className="text-sm text-gray-600">{t('goToPage')}:</span>
          <input
            type="number"
            min="1"
            max={totalPages.toString()}
            value={currentPage.toString()}
            onChange={(e) => {
              const page = parseInt(e.target.value);
              if (page >= 1 && page <= totalPages) {
                goToPage(page);
              }
            }}
            className="w-16 px-2 py-1 border border-gray-300 rounded text-center text-sm"
          />
          <span className="text-sm text-gray-600">/ {totalPages}</span>
        </div>
      )}
    </div>
  );
} 