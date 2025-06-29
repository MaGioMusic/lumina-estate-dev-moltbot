'use client';

import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
// Phosphor Icons imports - using correct icon names
import { 
  House, Buildings, Rows, BuildingOffice,
  Car, SwimmingPool, Barbell, Plant, TreePalm, Snowflake
} from '@phosphor-icons/react';
// Temporarily removed GSAP animations to fix the error
// import { AnimatedIcon, StaggeredIcons } from '@/components/animations/IconAnimations';

interface FiltersState {
  priceRange: [number, number];
  bedrooms: string;
  bathrooms: string;
  propertyType: string;
  area: [number, number];
}

interface FiltersSidebarProps {
  onFiltersChange: (filters: FiltersState) => void;
}

export default function FiltersSidebar({ onFiltersChange }: FiltersSidebarProps) {
  const { t } = useLanguage();
  const [filters, setFilters] = useState<FiltersState>({
    priceRange: [0, 1000000],
    bedrooms: '',
    bathrooms: '',
    propertyType: '',
    area: [0, 500]
  });
  const [selectedPropertyTypes, setSelectedPropertyTypes] = useState<string[]>([]);
  const [selectedBedrooms, setSelectedBedrooms] = useState<string | null>(null);
  const [selectedBathrooms, setSelectedBathrooms] = useState<string | null>(null);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [areaSize, setAreaSize] = useState('');
  const [areaUnit, setAreaUnit] = useState('sqft');

  const handleFilterChange = (key: keyof FiltersState, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const propertyTypes = [
    { value: 'apartment', label: 'Apartment' },
    { value: 'house', label: 'House' },
    { value: 'villa', label: 'Villa' },
    { value: 'commercial', label: 'Commercial' }
  ];

  const bedroomOptions = ['1', '2', '3', '4', '5+'];
  const bathroomOptions = ['1', '2', '3', '4+'];

  const amenities = [
    { id: 'parking', label: 'Parking', icon: <Car size={20} weight="regular" /> },
    { id: 'swimming_pool', label: 'Swimming Pool', icon: <SwimmingPool size={20} weight="regular" /> },
    { id: 'gym', label: 'Gym', icon: <Barbell size={20} weight="regular" /> },
    { id: 'garden', label: 'Garden', icon: <Plant size={20} weight="regular" /> },
    { id: 'balcony', label: 'Balcony', icon: <TreePalm size={20} weight="regular" /> },
    { id: 'air_conditioning', label: 'Air Conditioning', icon: <Snowflake size={20} weight="regular" /> }
  ];

  const togglePropertyType = (type: string) => {
    setSelectedPropertyTypes(prev => 
      prev.includes(type) 
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities(prev => 
      prev.includes(amenity) 
        ? prev.filter(a => a !== amenity)
        : [...prev, amenity]
    );
  };

  return (
    <div className="w-64 bg-white dark:bg-dark-bg-secondary rounded-lg p-6 h-fit border border-gray-100 dark:border-dark-border transition-all duration-300 animate-fade-in">
      <h2 className="text-lg font-medium text-[#1A365D] dark:text-dark-text mb-6 transition-colors duration-300">
        {t('filters')}
      </h2>
      
      {/* Price Range */}
      <div className="mb-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
        <h3 className="text-sm font-medium text-[#4B5563] dark:text-dark-text-secondary mb-3 transition-colors duration-300">
          {t('priceRange')}
        </h3>
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <input
              type="range"
              min="0"
              max="1000000"
              step="10000"
              value={filters.priceRange[0]}
              onChange={(e) => handleFilterChange('priceRange', [parseInt(e.target.value), filters.priceRange[1]])}
              className="flex-1"
            />
          </div>
          <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
            <span>${filters.priceRange[0].toLocaleString()}</span>
            <span>${filters.priceRange[1].toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Property Type */}
      <div className="mb-6 animate-slide-up" style={{ animationDelay: '0.2s' }}>
        <h3 className="text-sm font-medium text-[#4B5563] dark:text-dark-text-secondary mb-3 transition-colors duration-300">
          {t('propertyType')}
        </h3>
        <select
          value={filters.propertyType}
          onChange={(e) => handleFilterChange('propertyType', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
        >
          <option value="">{t('propertyType')}</option>
          {propertyTypes.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
      </div>

      {/* Bedrooms */}
      <div className="mb-6 animate-slide-up" style={{ animationDelay: '0.3s' }}>
        <h3 className="text-sm font-medium text-[#4B5563] dark:text-dark-text-secondary mb-3 transition-colors duration-300">
          {t('bedrooms')}
        </h3>
        <div className="grid grid-cols-3 gap-2">
          {bedroomOptions.map((option) => (
            <button
              key={option}
              onClick={() => handleFilterChange('bedrooms', filters.bedrooms === option ? '' : option)}
              className={`px-3 py-2 text-sm rounded-lg border transition-all duration-200 ${
                filters.bedrooms === option
                  ? 'bg-orange-500 text-white border-orange-500'
                  : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:border-orange-500'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      {/* Bathrooms */}
      <div className="mb-6 animate-slide-up" style={{ animationDelay: '0.4s' }}>
        <h3 className="text-sm font-medium text-[#4B5563] dark:text-dark-text-secondary mb-3 transition-colors duration-300">
          {t('bathrooms')}
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {bathroomOptions.map((option) => (
            <button
              key={option}
              onClick={() => handleFilterChange('bathrooms', filters.bathrooms === option ? '' : option)}
              className={`px-3 py-2 text-sm rounded-lg border transition-all duration-200 ${
                filters.bathrooms === option
                  ? 'bg-orange-500 text-white border-orange-500'
                  : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:border-orange-500'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      {/* Amenities */}
      <div className="mb-6 animate-slide-up" style={{ animationDelay: '0.5s' }}>
        <h3 className="text-sm font-medium text-[#4B5563] dark:text-dark-text-secondary mb-3 transition-colors duration-300">
          {t('amenities')}
        </h3>
        <div className="space-y-3">
          {amenities.map((amenity, index) => (
            <label
              key={amenity.id}
              className={`flex items-center justify-between p-3 rounded-lg cursor-pointer 
                transition-all duration-300 ease-out transform group
                hover:bg-orange-50/50 dark:hover:bg-orange-900/10 hover:shadow-md hover:scale-[1.02]
                active:scale-[0.98]
                ${selectedAmenities.includes(amenity.id) 
                  ? 'bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800' 
                  : 'hover:bg-gray-50 dark:hover:bg-dark-bg-tertiary border border-transparent'
                }`}
              style={{ animationDelay: `${0.5 + index * 0.05}s` }}
            >
              <div className="flex items-center gap-3">
                <span className="text-gray-600 dark:text-gray-400 transition-transform duration-300 hover:scale-110 hover:rotate-6">
                  {amenity.icon}
                </span>
                <span className={`text-sm font-medium transition-all duration-300 ${
                  selectedAmenities.includes(amenity.id)
                    ? 'text-orange-700 dark:text-orange-300'
                    : 'text-gray-700 dark:text-dark-text-secondary group-hover:text-gray-900 dark:group-hover:text-dark-text'
                }`}>
                  {amenity.label}
                </span>
              </div>
              
              <div className="relative group/toggle">
                <input
                  type="checkbox"
                  checked={selectedAmenities.includes(amenity.id)}
                  onChange={() => toggleAmenity(amenity.id)}
                  className="sr-only"
                />
                
                {/* Toggle Switch Background */}
                <div 
                  className={`w-12 h-6 rounded-full p-0.5 cursor-pointer relative overflow-hidden
                    transition-all duration-200 ease-out transform
                    ${selectedAmenities.includes(amenity.id) 
                      ? 'bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 shadow-lg shadow-orange-500/40 scale-105 ring-2 ring-orange-300/50' 
                      : 'bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-600 dark:to-gray-700 shadow-inner hover:from-gray-300 hover:to-gray-400 dark:hover:from-gray-500 dark:hover:to-gray-600'
                    } 
                    hover:scale-110 active:scale-95 group-hover/toggle:shadow-2xl
                  `}
                  onClick={() => toggleAmenity(amenity.id)}
                >
                  {/* Animated gradient overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent 
                    transform -skew-x-12 transition-transform duration-300 ease-out
                    ${selectedAmenities.includes(amenity.id) ? 'translate-x-12' : '-translate-x-12'}
                  `} />
                  
                  {/* Toggle Circle */}
                  <div className={`w-5 h-5 rounded-full shadow-lg relative z-10
                    transition-all duration-200 ease-out transform
                    ${selectedAmenities.includes(amenity.id) 
                      ? 'translate-x-6 bg-white scale-110 rotate-180' 
                      : 'translate-x-0 bg-white scale-100 rotate-0'
                    }
                    group-hover/toggle:scale-125 group-active/toggle:scale-95
                  `} 
                  style={{
                    background: 'linear-gradient(145deg, #ffffff, #f8f9fa)',
                    boxShadow: selectedAmenities.includes(amenity.id) 
                      ? '0 6px 12px rgba(0,0,0,0.2), inset 0 2px 4px rgba(255,255,255,0.9)' 
                      : '0 3px 6px rgba(0,0,0,0.15), inset 0 1px 2px rgba(255,255,255,0.8)'
                  }}>
                    {/* Inner glow effect */}
                    <div className={`absolute inset-0.5 rounded-full transition-all duration-200
                      ${selectedAmenities.includes(amenity.id) 
                        ? 'bg-gradient-to-br from-orange-100/50 to-orange-200/30' 
                        : 'bg-gradient-to-br from-gray-50/50 to-gray-100/30'
                      }
                    `} />
                  </div>
                </div>
                
                {/* Success Checkmark Animation */}
                {selectedAmenities.includes(amenity.id) && (
                  <div className="absolute -top-2 -right-2 text-orange-500 animate-bounce z-20">
                    <div className="relative">
                      <svg className="w-5 h-5 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      
                      {/* Pulsing ring effect */}
                      <div className="absolute inset-0 rounded-full border-2 border-orange-400 animate-ping opacity-20" />
                    </div>
                  </div>
                )}
                
                {/* Ripple effect on click */}
                <div className={`absolute inset-0 rounded-full pointer-events-none
                  ${selectedAmenities.includes(amenity.id) 
                    ? 'bg-orange-500/20 animate-ping' 
                    : 'bg-gray-400/10'
                  }
                  transition-all duration-300
                `} />
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Area Size - Fixed layout */}
      <div className="mb-6 animate-slide-up" style={{ animationDelay: '0.6s' }}>
        <h3 className="text-sm font-medium text-[#4B5563] dark:text-dark-text-secondary mb-3 transition-colors duration-300">
          {t('area')} ({t('sqm')})
        </h3>
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <input
              type="range"
              min="0"
              max="500"
              step="10"
              value={filters.area[0]}
              onChange={(e) => handleFilterChange('area', [parseInt(e.target.value), filters.area[1]])}
              className="flex-1"
            />
          </div>
          <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
            <span>{filters.area[0]} {t('sqm')}</span>
            <span>{filters.area[1]} {t('sqm')}</span>
          </div>
        </div>
      </div>

      {/* Apply Filters Button */}
      <button className={`w-full bg-gradient-to-r from-[#F08336] to-[#e6753d] hover:from-[#e6753d] hover:to-[#d66830] 
        text-white py-4 rounded-xl font-bold text-base
        transition-all duration-300 ease-out transform
        hover:scale-105 hover:shadow-xl hover:shadow-orange-500/30 hover:-translate-y-1
        active:scale-95 active:translate-y-0 active:shadow-lg
        focus:outline-none focus:ring-4 focus:ring-orange-300/50
        animate-scale-in relative overflow-hidden group
      `} 
      style={{ animationDelay: '0.7s' }}
      >
        <span className="relative z-10 flex items-center justify-center gap-2">
          {t('applyFilters')}
          <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </span>
        
        {/* Animated background shimmer */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out"></div>
      </button>
    </div>
  );
} 