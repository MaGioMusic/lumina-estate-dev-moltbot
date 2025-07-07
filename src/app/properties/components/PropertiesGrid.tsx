'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import PropertyCard from './PropertyCard';
import { useLanguage } from '@/contexts/LanguageContext';

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
  floor?: number;
  image: string;
  type: string;
}

// Mock properties data - in real app this would come from API  
const mockProperties = Array.from({ length: 100 }, (_, i) => {
  // Use deterministic values based on index to avoid hydration issues
  const basePrice = 100000 + (i * 4567) % 400000;
  const bedroomCount = (i % 4) + 1;
  const bathroomCount = (i % 3) + 1;
  const sqftValue = 50 + (i * 13) % 150;
  const floorValue = (i % 20) + 1;
  
  // District keys for translation
  const districtKeys = ['vake', 'mtatsminda', 'saburtalo', 'isani', 'gldani'];
  const districtKey = districtKeys[i % 5];
  
  // More realistic property type distribution
  const propertyTypes = ['apartment', 'house', 'villa', 'studio', 'penthouse'];
  const propertyType = propertyTypes[i % propertyTypes.length];
  
  // Status based on property type - more realistic
  let status = 'for-sale';
  if (propertyType === 'apartment' || propertyType === 'studio') {
    status = i % 3 === 0 ? 'for-rent' : 'for-sale';
  } else if (propertyType === 'house' || propertyType === 'villa') {
    status = i % 4 === 0 ? 'for-rent' : 'for-sale';
  }
  
  return {
    id: i + 1,
    image: `/images/properties/property-${(i % 15) + 1}.jpg`,
    price: basePrice,
    address: districtKey, // Store just the key, we'll translate in component
    bedrooms: bedroomCount,
    bathrooms: bathroomCount,
    sqft: sqftValue,
    floor: floorValue,
    isFavorite: i % 5 === 0,
    type: propertyType,
    status: status,
    isNew: i % 7 === 0,
    amenities: [
      i % 2 === 0 ? 'parking' : null,
      i % 4 === 0 ? 'swimming_pool' : null,
      i % 3 === 0 ? 'gym' : null,
      i % 2 === 1 ? 'garden' : null,
      i % 3 === 1 ? 'balcony' : null,
      i % 5 === 0 ? 'air_conditioning' : null,
    ].filter(Boolean) as string[]
  };
});

const PROPERTIES_PER_PAGE = 25;

export default function PropertiesGrid({ searchQuery, filters }: PropertiesGridProps) {
  const { t } = useLanguage();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  
  console.log('PropertiesGrid received filters:', filters);
  
  // Get current page from URL params
  const currentPage = parseInt(searchParams.get('page') || '1');
  const sortBy = searchParams.get('sort') || 'price';
  const location = searchParams.get('location') || '';
  
  // Filter and sort properties first
  console.log('Starting filter with:', filters);
  console.log('Total properties before filter:', mockProperties.length);
  
  const filteredProperties = mockProperties
    .filter(property => {
      // Location filter
      if (location && !property.address.toLowerCase().includes(location.toLowerCase())) {
        return false;
      }
      
      // Price filter
      if (property.price < filters.priceRange[0] || property.price > filters.priceRange[1]) {
        if (property.id <= 5) {
          console.log(`Property ${property.id}: price=${property.price}, range=[${filters.priceRange[0]}, ${filters.priceRange[1]}]`);
        }
        return false;
      }
      
      // Property type filter - now checks if property type is in the selected types array
      if (filters.propertyTypes.length > 0 && !filters.propertyTypes.includes(property.type)) {
        return false;
      }
      
      // Bedrooms filter - now handles array of selected bedroom counts
      if (filters.bedrooms.length > 0) {
        const propertyMatches = filters.bedrooms.some(bedroomFilter => {
          const bedroomCount = bedroomFilter === '5+' ? 5 : parseInt(bedroomFilter);
          if (bedroomFilter === '5+') {
            return property.bedrooms >= 5;
          } else {
            return property.bedrooms === bedroomCount;
          }
        });
        if (!propertyMatches) return false;
      }
      
      // Bathrooms filter - now handles array of selected bathroom counts
      if (filters.bathrooms.length > 0) {
        const propertyMatches = filters.bathrooms.some(bathroomFilter => {
          const bathroomCount = bathroomFilter === '4+' ? 4 : parseInt(bathroomFilter);
          if (bathroomFilter === '4+') {
            return property.bathrooms >= 4;
          } else {
            return property.bathrooms === bathroomCount;
          }
        });
        if (!propertyMatches) return false;
      }
      
      // Area filter
      if (property.sqft < filters.area[0] || property.sqft > filters.area[1]) {
        return false;
      }
      
      // Amenities filter - property must have ALL selected amenities
      if (filters.amenities.length > 0) {
        const hasAllAmenities = filters.amenities.every(amenity => 
          property.amenities.includes(amenity)
        );
        if (!hasAllAmenities) return false;
      }
      
      // Floor filter
      if (filters.floor) {
        const propertyFloor = property.floor || 0;
        
        // Debug log for first few properties
        if (property.id <= 5) {
          console.log(`Property ${property.id}: floor=${propertyFloor}, filter=${filters.floor}`);
        }
        
        switch(filters.floor) {
          case 'first': 
            if (propertyFloor !== 1) return false;
            break;
          case 'last': 
            if (propertyFloor < 10) return false; // Assuming 10+ is last floor
            break;
          case 'middle': 
            if (propertyFloor <= 1 || propertyFloor >= 10) return false;
            break;
          case '1-5': 
            if (propertyFloor < 1 || propertyFloor > 5) return false;
            break;
          case '6-10': 
            if (propertyFloor < 6 || propertyFloor > 10) return false;
            break;
          case '11-15': 
            if (propertyFloor < 11 || propertyFloor > 15) return false;
            break;
          case '16+': 
            if (propertyFloor < 16) return false;
            break;
        }
      }
      
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-asc': return a.price - b.price;
        case 'price-desc': return b.price - a.price;
        case 'size': return b.sqft - a.sqft;
        default: return a.price - b.price;
      }
    });
  
  console.log('Total properties after filter:', filteredProperties.length);
  console.log('Floor filter value:', filters.floor);
  
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
        <p className="text-gray-600 dark:text-gray-300">
          {t('showing')} {startIndex + 1}-{Math.min(endIndex, filteredProperties.length)} {t('of')} {filteredProperties.length} {t('propertiesCount')}
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400">
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
            address={`${t('tbilisi')}, ${t(property.address)}`}
            bedrooms={property.bedrooms}
            bathrooms={property.bathrooms}
            sqft={property.sqft}
            floor={property.floor}
            isFavorite={property.isFavorite}
            type={property.type}
            status={property.status}
            isNew={property.isNew}
          />
        ))}
      </div>

      {/* Pagination - Compact Version */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-1 mt-6">
          {/* Previous Button */}
          <button
            onClick={goToPrevious}
            disabled={currentPage === 1}
            className={`px-3 py-1.5 text-sm rounded-md border transition-colors ${
              currentPage === 1
                ? 'bg-gray-50 dark:bg-gray-800 text-gray-300 dark:text-gray-600 cursor-not-allowed border-gray-200 dark:border-gray-700'
                : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
            }`}
          >
            {t('previous')}
          </button>

          {/* Page Numbers */}
          {getPageNumbers().map((pageNum) => (
            <button
              key={pageNum}
              onClick={() => goToPage(pageNum)}
              className={`w-8 h-8 text-sm rounded-md border transition-all ${
                currentPage === pageNum
                  ? 'bg-orange-500 text-white border-orange-500 font-medium'
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
              }`}
            >
              {pageNum}
            </button>
          ))}

          {/* Show dots if there are more pages */}
          {totalPages > 5 && currentPage < totalPages - 2 && (
            <span className="px-1 text-gray-400 dark:text-gray-500 text-sm">...</span>
          )}

          {/* Last page if not visible */}
          {totalPages > 5 && currentPage < totalPages - 2 && (
            <button
              onClick={() => goToPage(totalPages)}
              className="w-8 h-8 text-sm rounded-md border bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
            >
              {totalPages}
            </button>
          )}

          {/* Next Button */}
          <button
            onClick={goToNext}
            disabled={currentPage === totalPages}
            className={`px-3 py-1.5 text-sm rounded-md border transition-colors ${
              currentPage === totalPages
                ? 'bg-gray-50 dark:bg-gray-800 text-gray-300 dark:text-gray-600 cursor-not-allowed border-gray-200 dark:border-gray-700'
                : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
            }`}
          >
            {t('next')}
          </button>
        </div>
      )}

      {/* Quick Jump */}
      {totalPages > 10 && (
        <div className="flex justify-center items-center space-x-2 mt-4">
          <span className="text-sm text-gray-600 dark:text-gray-300">{t('goToPage')}:</span>
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
            className="w-16 px-2 py-1 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded text-center text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          />
          <span className="text-sm text-gray-600 dark:text-gray-300">/ {totalPages}</span>
        </div>
      )}
    </div>
  );
} 