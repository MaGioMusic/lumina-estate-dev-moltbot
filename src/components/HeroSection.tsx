'use client';

import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { useLanguage } from '@/contexts/LanguageContext';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';

const locationOptionsKeys = [
  'tbilisi', 'batumi', 'kutaisi', 'rustavi', 'zugdidi', 'telavi', 'gori', 'poti', 'samtredia', 'kobuleti'
];

const propertyTypesRaw = [
  { key: 'apartment', labelKey: 'apartment' },
  { key: 'house', labelKey: 'house' },
  { key: 'villa', labelKey: 'villa' },
  { key: 'commercial', labelKey: 'commercial' }
];

const priceRangesRaw = [
  '$100K - $300K', '$300K - $500K', '$500K - $750K', 
  '$750K - $1M', '$1M - $2M', '$2M+'
];

const searchSchema = z.object({
  location: z.string().optional(),
  propertyType: z.string().optional(),
  priceRange: z.string().optional(),
});

type SearchForm = z.infer<typeof searchSchema>;

export default function HeroSection() {
  const { t } = useLanguage();
  const router = useRouter();
  
  // Dropdown states
  const [isPropertyTypeOpen, setIsPropertyTypeOpen] = useState(false);
  const [isPriceRangeOpen, setIsPriceRangeOpen] = useState(false);
  const [locationSuggestions, setLocationSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  // Form values states
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedPropertyType, setSelectedPropertyType] = useState('');
  const [selectedPriceRange, setSelectedPriceRange] = useState('');

  const {
    control,
    handleSubmit,
    setValue,
    watch,
  } = useForm<SearchForm>({
    resolver: zodResolver(searchSchema),
    defaultValues: {
      location: '',
      propertyType: '',
      priceRange: '',
    },
  });

  // Watch location for autocomplete
  const locationValue = watch('location') || '';

  // Memoize location options to prevent infinite re-renders
  const locationOptions = useMemo(() => {
    return locationOptionsKeys.map(key => t(key));
  }, [t]);

  useEffect(() => {
    if (locationValue.length > 0) {
      setLocationSuggestions(
        locationOptions.filter(loc =>
          loc.toLowerCase().includes(locationValue.toLowerCase())
        )
      );
      setShowSuggestions(true);
    } else {
      setLocationSuggestions([]);
      setShowSuggestions(false);
    }
    setSelectedLocation(locationValue);
  }, [locationValue, locationOptions]);

  const onSubmit = (data: SearchForm) => {
    console.log('Form submitted with data:', data);
    console.log('States:', { selectedLocation, selectedPropertyType, selectedPriceRange });
    
    // Build query params
    const params = new URLSearchParams();
    if (selectedLocation) params.append('location', selectedLocation);
    if (selectedPropertyType) params.append('type', selectedPropertyType);
    if (selectedPriceRange) params.append('price', selectedPriceRange);
    router.push(`/properties?${params.toString()}`);
  };

  const handlePropertyTypeSelect = (typeKey: string) => {
    console.log('Property type selected:', typeKey);
    setSelectedPropertyType(typeKey);
    setValue('propertyType', typeKey);
    setIsPropertyTypeOpen(false);
  };

  const handlePriceRangeSelect = (range: string) => {
    console.log('Price range selected:', range);
    setSelectedPriceRange(range);
    setValue('priceRange', range);
    setIsPriceRangeOpen(false);
  };

  const handleLocationSelect = (location: string) => {
    console.log('Location selected:', location);
    setSelectedLocation(location);
    setValue('location', location);
    setShowSuggestions(false);
  };

  const propertyTypes = propertyTypesRaw.map((item) => ({ ...item, label: t(item.labelKey) }));
  const priceRanges = priceRangesRaw;

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
        <source src="/videos/hero-background-new.mp4" type="video/mp4" />
        {/* Fallback for browsers that don't support video */}
        <div 
          className="w-full h-full bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `linear-gradient(0deg, rgba(0, 0, 0, 0.00) 0%, rgba(0, 0, 0, 0.00) 100%), url('/images/photos/hero-background.jpg')`
          }}
        />
      </video>

      {/* Theme-responsive overlay for better text readability */}
      <div className="absolute top-0 left-0 w-full h-full bg-black/20 dark:bg-black/50 z-10"></div>

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
            onSubmit={handleSubmit(onSubmit)}
            className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-[35px] shadow-[0px_8px_25px_-5px_rgba(0,0,0,0.25)] dark:shadow-[0px_8px_25px_-5px_rgba(255,255,255,0.1)] flex items-stretch gap-3 w-[750px] h-[70px] p-3"
            autoComplete="off"
          >
            {/* Location Input with Suggestions */}
            <div className="bg-white dark:bg-gray-800 border border-[#E5E7EB] dark:border-gray-700 rounded-xl p-2.5 flex items-center w-[250px] relative">
              <svg 
                className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <Controller
                name="location"
                control={control}
                render={({ field }) => (
                  <>
                    <input
                      {...field}
                      type="text"
                      placeholder={t('searchPlaceholder')}
                      className="w-full text-gray-700 dark:text-gray-100 placeholder:text-[#9CA3AF] dark:placeholder:text-gray-500 font-inter text-sm leading-5 outline-none bg-transparent"
                      onFocus={() => setShowSuggestions(true)}
                      onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                    />
                    {showSuggestions && locationSuggestions.length > 0 && (
                      <div className="absolute top-[50px] left-0 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl z-30 max-h-48 overflow-y-auto">
                        {locationSuggestions.map((loc, index) => (
                          <div
                            key={loc}
                            className={`w-full text-left px-4 py-3 hover:bg-blue-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 font-inter text-sm cursor-pointer transition-colors duration-200 flex items-center ${
                              index === 0 ? 'rounded-t-xl' : ''
                            } ${
                              index === locationSuggestions.length - 1 ? 'rounded-b-xl' : 'border-b border-gray-100 dark:border-gray-700'
                            }`}
                            onClick={() => handleLocationSelect(loc)}
                          >
                            <svg className="w-3 h-3 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            {loc}
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}
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
                className="bg-[#EFEFEF] dark:bg-gray-700 border border-[#E5E7EB] dark:border-gray-600 rounded-xl p-2.5 flex items-center justify-between w-[170px] h-[42px] text-left hover:bg-[#E5E5E5] dark:hover:bg-gray-600 transition-colors relative"
              >
                <span className="text-gray-700 dark:text-gray-200 font-inter text-sm leading-[17px] truncate">
                  {selectedPropertyType ? propertyTypes.find(p => p.key === selectedPropertyType)?.label : t('anyPropertyType')}
                </span>
                <div className={`absolute right-2 top-[15px] w-3 h-3 transition-transform duration-200 ${isPropertyTypeOpen ? 'rotate-180' : ''}`}>
                  <Image
                    src="/images/icons/dropdown-arrow.svg"
                    alt="Dropdown arrow"
                    width={12}
                    height={12}
                    className="object-cover"
                  />
                </div>
              </button>
              {isPropertyTypeOpen && (
                <div className="absolute top-[50px] left-0 right-0 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl z-20 mt-1 max-h-48 overflow-y-auto">
                  {propertyTypes.map((type, index) => (
                    <div
                      key={type.key}
                      className={`w-full text-left p-3 hover:bg-blue-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 font-inter text-sm cursor-pointer transition-colors duration-200 ${
                        selectedPropertyType === type.key ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300' : ''
                      } ${
                        index === 0 ? 'rounded-t-xl' : ''
                      } ${
                        index === propertyTypes.length - 1 ? 'rounded-b-xl' : 'border-b border-gray-100 dark:border-gray-700'
                      }`}
                      onClick={() => handlePropertyTypeSelect(type.key)}
                    >
                      {type.label}
                    </div>
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
                className="bg-[#EFEFEF] dark:bg-gray-700 border border-[#E5E7EB] dark:border-gray-600 rounded-xl p-2.5 flex items-center justify-between w-[170px] h-[42px] text-left hover:bg-[#E5E5E5] dark:hover:bg-gray-600 transition-colors relative"
              >
                <span className="text-gray-700 dark:text-gray-200 font-inter text-sm leading-[17px] truncate">
                  {selectedPriceRange || t('anyPriceRange')}
                </span>
                <div className={`absolute right-2 top-[15px] w-3 h-3 transition-transform duration-200 ${isPriceRangeOpen ? 'rotate-180' : ''}`}>
                  <Image
                    src="/images/icons/dropdown-arrow.svg"
                    alt="Dropdown arrow"
                    width={12}
                    height={12}
                    className="object-cover"
                  />
                </div>
              </button>
              {isPriceRangeOpen && (
                <div className="absolute top-[50px] left-0 right-0 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl z-20 mt-1 max-h-48 overflow-y-auto">
                  {priceRanges.map((range, index) => (
                    <div
                      key={range}
                      className={`w-full text-left p-3 hover:bg-blue-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 font-inter text-sm cursor-pointer transition-colors duration-200 ${
                        selectedPriceRange === range ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300' : ''
                      } ${
                        index === 0 ? 'rounded-t-xl' : ''
                      } ${
                        index === priceRanges.length - 1 ? 'rounded-b-xl' : 'border-b border-gray-100 dark:border-gray-700'
                      }`}
                      onClick={() => handlePriceRangeSelect(range)}
                    >
                      {range}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Search Button */}
            <button 
              type="submit"
              className="bg-[#F08336] text-white font-inter text-sm leading-5 px-[25px] py-[12px] rounded-[35px] hover:bg-[#e0743a] transition-colors w-[100px] flex items-center justify-center shadow-lg hover:shadow-xl"
            >
              {t('searchButton')}
            </button>
          </form>
        </div>

        {/* Scroll Down Arrow */}
        <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 animate-bounce">
          <button 
            onClick={() => {
              const featuresSection = document.getElementById('features-section');
              if (featuresSection) {
                featuresSection.scrollIntoView({ behavior: 'smooth' });
              } else {
                window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
              }
            }}
            className="bg-white/10 dark:bg-white/5 backdrop-blur-sm rounded-full p-3 hover:bg-white/20 dark:hover:bg-white/10 transition-all duration-300 hover:scale-110"
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