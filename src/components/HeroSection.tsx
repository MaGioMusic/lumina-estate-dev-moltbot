'use client';

import { useState } from 'react';
import Image from 'next/image';
import { getLocalImagePath } from '@/lib/imageUrls';
import { useLanguage } from '@/contexts/LanguageContext';

export default function HeroSection() {
  const { t } = useLanguage();
  const [location, setLocation] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [priceRange, setPriceRange] = useState('');
  const [isPropertyTypeOpen, setIsPropertyTypeOpen] = useState(false);
  const [isPriceRangeOpen, setIsPriceRangeOpen] = useState(false);

  const propertyTypes = [
    { key: 'apartment', label: t('apartment') },
    { key: 'house', label: t('house') },
    { key: 'villa', label: t('villa') },
    { key: 'commercial', label: t('commercial') }
  ];

  const priceRanges = [
    '$100K - $300K', '$300K - $500K', '$500K - $750K', 
    '$750K - $1M', '$1M - $2M', '$2M+'
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Searching...', { location, propertyType, priceRange });
    const selectedPropertyType = propertyType ? propertyTypes.find(p => p.key === propertyType)?.label : t('anyPropertyType');
    alert(`${t('searchProperties')}: ${selectedPropertyType} in ${location || t('searchPlaceholder')} with budget ${priceRange || t('anyPriceRange')}`);
  };

  return (
    <section className="relative w-full h-[100vh] flex flex-col items-center overflow-hidden">
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
      >
        <source src="/videos/hero-background.mp4" type="video/mp4" />
        {/* Fallback for browsers that don't support video */}
        <div 
          className="w-full h-full bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `linear-gradient(0deg, rgba(0, 0, 0, 0.00) 0%, rgba(0, 0, 0, 0.00) 100%), url('${getLocalImagePath('/images/photos/hero-background.jpg')}')`
          }}
        />
      </video>

      {/* Dark overlay for better text readability */}
      <div className="absolute top-0 left-0 w-full h-full bg-black/30 z-10"></div>

      {/* Content on top of video */}
      <div className="relative z-20 w-full h-full flex flex-col items-center justify-center">
        {/* Main Title */}
        <div className="flex items-center justify-center w-full mb-12">
          <h1 className="font-archivo-black text-[100px] leading-[105px] text-center tracking-wide text-white drop-shadow-2xl animate-slow-shimmer">
            LUMINA<br/>
            ESTATE
          </h1>
        </div>

        {/* Search Form */}
        <div className="flex items-center justify-center w-full">
          <form 
            onSubmit={handleSearch}
            className="bg-white/95 backdrop-blur-sm rounded-[35px] shadow-[0px_8px_25px_-5px_rgba(0,0,0,0.25)] flex items-stretch gap-3 w-[750px] h-[70px] p-3"
          >
            {/* Location Input */}
            <div className="bg-white border border-[#E5E7EB] rounded-xl p-2.5 flex items-center w-[250px]">
              <input
                type="text"
                placeholder={t('searchPlaceholder')}
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full text-[#9CA3AF] placeholder:text-[#9CA3AF] font-inter text-sm leading-5 outline-none bg-transparent"
              />
            </div>

            {/* Property Type Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setIsPropertyTypeOpen(!isPropertyTypeOpen);
                  setIsPriceRangeOpen(false);
                }}
                className="bg-[#EFEFEF] border border-[#E5E7EB] rounded-lg p-2.5 flex items-center justify-between w-[170px] h-[42px] text-left hover:bg-[#E5E5E5] transition-colors relative"
              >
                <span className="text-black font-inter text-sm leading-[17px]">
                  {propertyType ? propertyTypes.find(p => p.key === propertyType)?.label : t('anyPropertyType')}
                </span>
                <div className={`absolute right-1 top-[15px] w-3 h-3 transition-transform ${isPropertyTypeOpen ? 'rotate-180' : ''}`}>
                  <Image
                    src={getLocalImagePath("/images/icons/dropdown-arrow.svg")}
                    alt="Dropdown arrow"
                    width={12}
                    height={12}
                    className="object-cover"
                  />
                </div>
              </button>
              
              {isPropertyTypeOpen && (
                <div className="absolute top-full left-0 right-0 bg-white border border-[#E5E7EB] rounded-lg shadow-lg z-10 mt-1 max-h-48 overflow-y-auto">
                  {propertyTypes.map((type) => (
                    <button
                      key={type.key}
                      type="button"
                      onClick={() => {
                        setPropertyType(type.key);
                        setIsPropertyTypeOpen(false);
                      }}
                      className="w-full text-left p-2.5 hover:bg-[#F9FAFB] text-black font-inter text-sm leading-4 border-b border-[#F3F4F6] last:border-b-0"
                    >
                      {type.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Price Range Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setIsPriceRangeOpen(!isPriceRangeOpen);
                  setIsPropertyTypeOpen(false);
                }}
                className="bg-[#EFEFEF] border border-[#E5E7EB] rounded-lg p-2.5 flex items-center justify-between w-[170px] h-[42px] text-left hover:bg-[#E5E5E5] transition-colors relative"
              >
                <span className="text-black font-inter text-sm leading-[17px]">
                  {priceRange || t('anyPriceRange')}
                </span>
                <div className={`absolute right-1 top-[15px] w-3 h-3 transition-transform ${isPriceRangeOpen ? 'rotate-180' : ''}`}>
                  <Image
                    src={getLocalImagePath("/images/icons/dropdown-arrow.svg")}
                    alt="Dropdown arrow"
                    width={12}
                    height={12}
                    className="object-cover"
                  />
                </div>
              </button>
              
              {isPriceRangeOpen && (
                <div className="absolute top-full left-0 right-0 bg-white border border-[#E5E7EB] rounded-lg shadow-lg z-10 mt-1 max-h-48 overflow-y-auto">
                  {priceRanges.map((range) => (
                    <button
                      key={range}
                      type="button"
                      onClick={() => {
                        setPriceRange(range);
                        setIsPriceRangeOpen(false);
                      }}
                      className="w-full text-left p-2.5 hover:bg-[#F9FAFB] text-black font-inter text-sm leading-4 border-b border-[#F3F4F6] last:border-b-0"
                    >
                      {range}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Search Button */}
            <button 
              type="submit"
              className="bg-[#F08336] text-white font-inter text-sm leading-5 px-[25px] py-[12px] rounded-[35px] hover:bg-[#e0743a] transition-colors w-[100px] flex items-center justify-center"
            >
              {t('searchButton')}
            </button>
          </form>
        </div>

        {/* Scroll Down Arrow */}
        <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 animate-bounce">
          <button 
            onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
            className="bg-white/10 backdrop-blur-sm rounded-full p-3 hover:bg-white/20 transition-all duration-300 hover:scale-110"
          >
            <svg 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="white" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              className="animate-pulse"
            >
              <path d="M7 13l5 5 5-5"/>
              <path d="M7 6l5 5 5-5"/>
            </svg>
          </button>
        </div>

        {/* Close dropdowns when clicking outside */}
        {(isPropertyTypeOpen || isPriceRangeOpen) && (
          <div 
            className="fixed inset-0 z-0"
            onClick={() => {
              setIsPropertyTypeOpen(false);
              setIsPriceRangeOpen(false);
            }}
          />
        )}
      </div>
    </section>
  );
} 