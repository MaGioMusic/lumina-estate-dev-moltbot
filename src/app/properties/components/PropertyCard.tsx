'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Bed, Bath, Maximize2, Heart } from 'lucide-react';

interface PropertyCardProps {
  id: string;
  image: string;
  price: string;
  address: string;
  bedrooms: number;
  bathrooms: number;
  sqft?: number;
  floor?: number;
  isFavorite: boolean;
  type?: string;
  status?: string;
  isNew?: boolean;
  onToggleFavorite?: () => void;
}

export default function PropertyCard({
  id,
  image,
  price,
  address,
  bedrooms,
  bathrooms,
  sqft,
  floor,
  isFavorite,
  type,
  status,
  isNew,
  onToggleFavorite
}: PropertyCardProps) {
  const { t } = useLanguage();
  const { isHydrated } = useTheme();
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);
  const [heartClick, setHeartClick] = useState(false);
  const [detailsClick, setDetailsClick] = useState(false);
  const [localIsFavorite, setLocalIsFavorite] = useState(isFavorite);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setHeartClick(true);
    setTimeout(() => setHeartClick(false), 300);
    
    // Toggle local favorite state
    setLocalIsFavorite(!localIsFavorite);
    
    if (onToggleFavorite) {
      onToggleFavorite();
    }
    
    // Show feedback message
    const message = !localIsFavorite ? 'დამატებულია ფავორიტებში!' : 'წაშლილია ფავორიტებიდან!';
    console.log(`Property ${id}: ${message}`);
  };

  const handleViewDetails = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDetailsClick(true);
    setTimeout(() => setDetailsClick(false), 200);
    console.log(`View details for property ${id}`);
  };

  const handleCardClick = () => {
    console.log(`Card clicked for property ${id}`);
    router.push(`/properties/${id}/dashboard`);
  };

  // Prevent hydration mismatch by not applying dynamic classes until hydrated
  const shouldApplyHoverEffects = isHydrated && isHovered;
  const shouldApplyClickEffects = isHydrated;

  return (
    <div 
      className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden cursor-pointer
        transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/10 animate-fade-in
        transform hover:scale-[1.02] hover:-translate-y-0.5 active:scale-[0.98] active:translate-y-0
        border border-gray-200 dark:border-gray-700 hover:border-orange-200 dark:hover:border-orange-800
        ${shouldApplyHoverEffects ? 'ring-1 ring-orange-300/30' : ''}
      `}
      onClick={handleCardClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Property Image */}
      <div className="relative h-40 group overflow-hidden">
        <img
          src={image}
          alt="Property"
          className={`w-full h-full object-cover transition-all duration-700 ease-out
            ${shouldApplyHoverEffects ? 'scale-110 brightness-105' : 'scale-100 brightness-100'}
          `}
          onLoad={() => setImageLoaded(true)}
          loading="lazy"
        />
        
        {/* Gradient Overlay on Hover */}
        <div className={`absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent
          transition-opacity duration-300 ${shouldApplyHoverEffects ? 'opacity-100' : 'opacity-0'}
        `} />
        
        {/* Property Type and Status Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
          {/* Status Badge - Only show one */}
          {status && (
            <span className={`px-2 py-1 rounded-full text-xs font-medium shadow-sm border
              ${status === 'for-sale' 
                ? 'bg-green-500 dark:bg-green-600 text-white border-green-600 dark:border-green-500' 
                : 'bg-blue-500 dark:bg-blue-600 text-white border-blue-600 dark:border-blue-500'
              }
            `}>
              {status === 'for-sale' ? t('forSale') : t('forRent')}
            </span>
          )}
          
          {/* Property Type Badge - Show for all types */}
          {type && (
            <span className="px-2 py-1 rounded-full text-xs font-medium bg-white/90 dark:bg-gray-800/90 text-gray-800 dark:text-gray-200 shadow-sm border border-gray-200/50 dark:border-gray-600/50">
              {type === 'apartment' && t('apartment')}
              {type === 'house' && t('house')}
              {type === 'villa' && t('villa')}
              {type === 'studio' && t('studio')}
              {type === 'penthouse' && t('penthouse')}
              {type === 'commercial' && t('commercial')}
            </span>
          )}
          
          {/* New Property Badge */}
          {isNew && (
            <span className="px-2 py-1 rounded-full text-xs font-medium bg-orange-500 dark:bg-orange-600 text-white shadow-sm animate-pulse border border-orange-600 dark:border-orange-500">
              {t('newProperty') || 'New'}
            </span>
          )}
        </div>
        
        {/* Favorite Heart - Clean Animation */}
        <div 
          className={`absolute top-2 right-2 cursor-pointer z-10
            transition-transform duration-300 ease-out
            ${shouldApplyClickEffects && heartClick ? 'scale-125 rotate-12' : 'scale-100'}
            active:scale-90
          `}
          onClick={handleFavoriteClick}
        >
          <div className={`bg-white/95 dark:bg-gray-700/95 shadow-lg rounded-full p-1.5
            transition-colors duration-300 
            ${localIsFavorite ? 'bg-red-50 border border-red-200' : 'border border-gray-200'}
            ${shouldApplyClickEffects && heartClick ? 'animate-pulse' : ''}
          `}>
            {localIsFavorite ? (
              <svg width="14" height="14" viewBox="0 0 24 24" className={`${shouldApplyClickEffects && heartClick ? 'animate-bounce' : ''}`}>
                <path fill="#ef4444" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 24 24">
                <path fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" 
                      d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
            )}
          </div>
        </div>

        {/* View Details Button - Compact */}
        <div className={`absolute bottom-2 left-2 right-2 flex justify-center
          transition-all duration-300 ease-out
          ${shouldApplyHoverEffects ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}
        `}>
          <button 
            onClick={handleViewDetails}
            className={`bg-white dark:bg-gray-700 text-[#1A365D] dark:text-gray-100 
              px-3 py-1.5 rounded-full text-xs font-medium shadow-md
              transition-all duration-200 ease-out border border-gray-200/50
              ${shouldApplyClickEffects && detailsClick ? 'scale-95 !bg-orange-500 !text-white !border-orange-500' : 'hover:!bg-orange-500 hover:!text-white hover:scale-105 hover:!border-orange-500 hover:shadow-lg'}
              active:scale-95
            `}
          >
            <span className="flex items-center gap-1">
              <span>{t('viewDetails')}</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 18l6-6-6-6"/>
              </svg>
            </span>
          </button>
        </div>
      </div>

      {/* Property Details */}
      <div className="p-3 space-y-2">
        {/* Price */}
        <div className={`text-[#1A365D] dark:text-gray-100 text-sm font-semibold 
          transition-all duration-300 ease-out
          ${shouldApplyHoverEffects ? 'text-orange-600 dark:text-orange-400 transform translate-x-1' : ''}
        `}>
          {price}
        </div>

        {/* Address */}
        <div className={`text-[#4B5563] dark:text-gray-300 text-xs leading-4 
          transition-all duration-300 ease-out line-clamp-2
          ${shouldApplyHoverEffects ? 'text-gray-700 dark:text-gray-200 transform translate-x-0.5' : ''}
        `}>
          {address}
        </div>

        {/* Specifications */}
        <div className={`flex items-center justify-between text-[#6B7280] dark:text-gray-400 text-xs 
          transition-all duration-300 ease-out
          ${shouldApplyHoverEffects ? 'transform translate-x-0.5' : ''}
        `}>
          <div className="flex items-center gap-0.5 hover:scale-105 transition-transform duration-200">
            <Bed 
              className={`w-3 h-3 transition-all duration-300 text-gray-600 dark:text-gray-400
                ${shouldApplyHoverEffects ? 'opacity-100 scale-110 text-orange-500' : 'opacity-80 dark:opacity-60'}
              `}
            />
            <span className="font-medium">{bedrooms || 0}</span>
          </div>
          
          <div className="flex items-center gap-0.5 hover:scale-105 transition-transform duration-200">
            <Bath 
              className={`w-3 h-3 transition-all duration-300 text-gray-600 dark:text-gray-400
                ${shouldApplyHoverEffects ? 'opacity-100 scale-110 text-orange-500' : 'opacity-80 dark:opacity-60'}
              `}
            />
            <span className="font-medium">{bathrooms || 0}</span>
          </div>
          
          <div className="flex items-center gap-0.5 hover:scale-105 transition-transform duration-200">
            <Maximize2 
              className={`w-3 h-3 transition-all duration-300 text-gray-600 dark:text-gray-400
                ${shouldApplyHoverEffects ? 'opacity-100 scale-110 text-orange-500' : 'opacity-80 dark:opacity-60'}
              `}
            />
            <span className="font-medium">{(sqft || 0).toLocaleString()}</span>
          </div>
        </div>
        
        {/* Floor info - temporary for debugging */}
        {floor && (
          <div className="text-xs text-gray-500 text-center">
            {t('floor')}: {floor}
          </div>
        )}
      </div>
    </div>
  );
} 