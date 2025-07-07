'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

interface Property {
  id: number;
  title: string;
  price: number;
  address: string;
  type: string;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  image: string;
}

const MapView: React.FC = () => {
  const { t } = useLanguage();
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);

  // Sample properties for Tbilisi
  const tbilisiProperties: Property[] = [
    {
      id: 1,
      title: t('properties.luxury_apartment_vake'),
      price: 250000,
      address: t('properties.vake_district'),
      type: 'apartment',
      bedrooms: 3,
      bathrooms: 2,
      sqft: 120,
      image: '/images/properties/property-1.jpg'
    },
    {
      id: 2,
      title: t('properties.modern_house_mtatsminda'),
      price: 450000,
      address: t('properties.mtatsminda_district'),
      type: 'house',
      bedrooms: 4,
      bathrooms: 3,
      sqft: 200,
      image: '/images/properties/property-2.jpg'
    },
    {
      id: 3,
      title: t('properties.studio_old_town'),
      price: 120000,
      address: t('properties.old_town_district'),
      type: 'studio',
      bedrooms: 1,
      bathrooms: 1,
      sqft: 45,
      image: '/images/properties/property-3.jpg'
    },
    {
      id: 4,
      title: t('properties.penthouse_saburtalo'),
      price: 380000,
      address: t('properties.saburtalo_district'),
      type: 'penthouse',
      bedrooms: 3,
      bathrooms: 2,
      sqft: 150,
      image: '/images/properties/property-4.jpg'
    },
    {
      id: 5,
      title: t('properties.villa_vera'),
      price: 650000,
      address: t('properties.vera_district'),
      type: 'villa',
      bedrooms: 5,
      bathrooms: 4,
      sqft: 300,
      image: '/images/properties/property-5.jpg'
    },
    {
      id: 6,
      title: t('properties.loft_isani'),
      price: 180000,
      address: t('properties.isani_district'),
      type: 'loft',
      bedrooms: 2,
      bathrooms: 1,
      sqft: 85,
      image: '/images/properties/property-6.jpg'
    },
    {
      id: 7,
      title: t('properties.condo_rike'),
      price: 320000,
      address: t('properties.rike_district'),
      type: 'condo',
      bedrooms: 2,
      bathrooms: 2,
      sqft: 95,
      image: '/images/properties/property-7.jpg'
    }
  ];

  const getMarkerColor = (type: string) => {
    const colors = {
      apartment: '#3B82F6',
      house: '#EF4444',
      studio: '#10B981',
      penthouse: '#F59E0B',
      villa: '#8B5CF6',
      loft: '#EC4899',
      condo: '#06B6D4'
    };
    return colors[type as keyof typeof colors] || '#6B7280';
  };

  const handleMarkerClick = (property: Property) => {
    setSelectedProperty(property);
  };

  return (
    <div className="w-full h-full bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Map Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">{t('map.tbilisi_properties')}</h3>
            <p className="text-sm opacity-90">{tbilisiProperties.length} {t('map.properties_available')}</p>
          </div>
          <div className="text-right">
            <div className="text-xs opacity-90 bg-green-200 text-green-800 px-2 py-1 rounded">
              📍 Static Map View
            </div>
          </div>
        </div>
      </div>

      {/* Static Map Container with Background Image */}
      <div className="relative h-96 bg-gray-200 overflow-hidden">
        {/* Beautiful CSS Map Background - Tbilisi Style */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-100 via-green-50 to-yellow-50 dark:from-blue-900 dark:via-green-900 dark:to-yellow-900">
          {/* Map Districts as colored areas */}
          
          {/* Vake District - Green */}
          <div 
            className="absolute bg-gradient-to-br from-green-200 to-green-300 rounded-2xl opacity-80 flex items-center justify-center shadow-lg border border-green-400"
            style={{
              top: '15%',
              left: '8%',
              width: '22%',
              height: '25%'
            }}
          >
            <span className="text-xs font-bold text-green-800">{t('vake')}</span>
          </div>

          {/* Mtatsminda District - Blue */}
          <div 
            className="absolute bg-gradient-to-br from-blue-200 to-blue-300 rounded-2xl opacity-80 flex items-center justify-center shadow-lg border border-blue-400"
            style={{
              top: '10%',
              right: '20%',
              width: '25%',
              height: '20%'
            }}
          >
            <span className="text-xs font-bold text-blue-800">{t('mtatsminda')}</span>
          </div>

          {/* Old Town District - Amber */}
          <div 
            className="absolute bg-gradient-to-br from-amber-200 to-amber-300 rounded-2xl opacity-80 flex items-center justify-center shadow-lg border border-amber-400"
            style={{
              top: '45%',
              left: '35%',
              width: '20%',
              height: '18%'
            }}
          >
            <span className="text-xs font-bold text-amber-800">{t('oldTown')}</span>
          </div>

          {/* Saburtalo District - Purple */}
          <div 
            className="absolute bg-gradient-to-br from-purple-200 to-purple-300 rounded-2xl opacity-80 flex items-center justify-center shadow-lg border border-purple-400"
            style={{
              top: '8%',
              left: '45%',
              width: '30%',
              height: '25%'
            }}
          >
            <span className="text-xs font-bold text-purple-800">{t('saburtalo')}</span>
          </div>

          {/* Vera District - Pink */}
          <div 
            className="absolute bg-gradient-to-br from-pink-200 to-pink-300 rounded-2xl opacity-80 flex items-center justify-center shadow-lg border border-pink-400"
            style={{
              top: '55%',
              right: '25%',
              width: '18%',
              height: '20%'
            }}
          >
            <span className="text-xs font-bold text-pink-800">{t('vera')}</span>
          </div>

          {/* Isani District - Cyan */}
          <div 
            className="absolute bg-gradient-to-br from-cyan-200 to-cyan-300 rounded-2xl opacity-80 flex items-center justify-center shadow-lg border border-cyan-400"
            style={{
              top: '70%',
              left: '12%',
              width: '25%',
              height: '22%'
            }}
          >
            <span className="text-xs font-bold text-cyan-800">{t('isani')}</span>
          </div>

          {/* Rike District - Teal */}
          <div 
            className="absolute bg-gradient-to-br from-teal-200 to-teal-300 rounded-2xl opacity-80 flex items-center justify-center shadow-lg border border-teal-400"
            style={{
              top: '75%',
              right: '30%',
              width: '22%',
              height: '18%'
            }}
          >
            <span className="text-xs font-bold text-teal-800">{t('rike')}</span>
          </div>

          {/* Mtkvari River - Blue curved line */}
          <div 
            className="absolute bg-gradient-to-r from-blue-400 to-blue-500 opacity-70 rounded-full shadow-md"
            style={{
              top: '40%',
              left: '15%',
              width: '65%',
              height: '6%',
              transform: 'rotate(-12deg)'
            }}
          >
            <div className="flex items-center justify-center h-full">
              <span className="text-xs font-semibold text-white">{t('mtkvariRiver')}</span>
            </div>
          </div>

          {/* Roads/Streets as lines */}
          <div 
            className="absolute bg-gray-400 opacity-60"
            style={{
              top: '30%',
              left: '0%',
              width: '100%',
              height: '2px'
            }}
          />
          <div 
            className="absolute bg-gray-400 opacity-60"
            style={{
              top: '0%',
              left: '60%',
              width: '2px',
              height: '100%'
            }}
          />
          <div 
            className="absolute bg-gray-400 opacity-60"
            style={{
              top: '0%',
              left: '25%',
              width: '2px',
              height: '100%'
            }}
          />

          {/* Map Grid overlay for realism */}
          <div className="absolute inset-0 opacity-20">
            <div className="grid grid-cols-10 grid-rows-8 h-full w-full">
              {Array.from({ length: 80 }).map((_, i) => (
                <div key={i} className="border border-gray-300 border-opacity-30"></div>
              ))}
            </div>
          </div>
        </div>

        {/* Property Pins */}
        <div className="absolute inset-0">
          {tbilisiProperties.map((property, index) => (
            <button
              key={property.id}
              onClick={() => handleMarkerClick(property)}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 hover:scale-125 transition-all duration-300 group z-10"
              style={{
                left: `${[25, 62, 50, 75, 38, 69, 45][index]}%`,
                top: `${[38, 25, 62, 45, 75, 80, 55][index]}%`
              }}
            >
              {/* Pin Circle */}
              <div 
                className="w-8 h-8 rounded-full border-3 border-white shadow-xl cursor-pointer flex items-center justify-center animate-pulse hover:animate-bounce"
                style={{ backgroundColor: getMarkerColor(property.type) }}
              >
                <div className="w-3 h-3 bg-white rounded-full"></div>
              </div>
              
              {/* Price Tag on Hover */}
              <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-white px-3 py-1 rounded-full shadow-lg text-xs font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-20">
                ${property.price.toLocaleString()}
              </div>
              
              {/* Property Type Badge */}
              <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-2 py-1 rounded text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity z-20">
                {t(`properties.types.${property.type}`)}
              </div>
            </button>
          ))}
        </div>

        {/* Map Legend Badge */}
        <div className="absolute top-4 left-4 bg-white bg-opacity-90 rounded-lg px-3 py-2 shadow-lg z-20">
          <div className="text-xs font-semibold text-gray-700">🗺️ {t('tbilisiMap')}</div>
          <div className="text-xs text-gray-600">{tbilisiProperties.length} {t('items')}</div>
        </div>

        {/* Property Details Popup */}
        {selectedProperty && (
          <div className="absolute bottom-4 left-4 right-4 bg-white rounded-xl shadow-2xl p-4 z-30 border border-gray-200 max-h-40 overflow-y-auto">
            <div className="flex items-start space-x-4">
              <img 
                src={selectedProperty.image} 
                alt={selectedProperty.title}
                className="w-16 h-16 rounded-lg object-cover shadow-md flex-shrink-0"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/images/placeholder.jpg';
                }}
              />
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-gray-900 text-sm truncate">{selectedProperty.title}</h4>
                <p className="text-xs text-gray-600 mb-2">📍 {selectedProperty.address}</p>
                <div className="flex items-center space-x-3 mb-2 text-xs text-gray-500">
                  <span>🛏️ {selectedProperty.bedrooms}</span>
                  <span>🚿 {selectedProperty.bathrooms}</span>
                  <span>📐 {selectedProperty.sqft}m²</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-blue-600">
                    ${selectedProperty.price.toLocaleString()}
                  </span>
                  <div className="flex space-x-2">
                    <button className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs font-medium transition-colors">
                      {t('properties.view_details')}
                    </button>
                    <button
                      onClick={() => setSelectedProperty(null)}
                      className="text-gray-400 hover:text-gray-600 text-lg leading-none"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Property Types Legend */}
      <div className="p-4 bg-gradient-to-r from-gray-50 to-gray-100">
        <h4 className="text-sm font-semibold text-gray-700 mb-3">{t('map.property_types')}</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2">
          {Object.entries({
            apartment: t('properties.types.apartment'),
            house: t('properties.types.house'),
            studio: t('properties.types.studio'),
            penthouse: t('properties.types.penthouse'),
            villa: t('properties.types.villa'),
            loft: t('properties.types.loft'),
            condo: t('properties.types.condo')
          }).map(([type, label]) => (
            <div key={type} className="flex items-center space-x-2 bg-white px-2 py-1 rounded shadow-sm">
              <div 
                className="w-3 h-3 rounded-full border border-white shadow-sm"
                style={{ backgroundColor: getMarkerColor(type) }}
              />
              <span className="text-xs text-gray-700 font-medium">{label}</span>
            </div>
          ))}
        </div>
        
        <div className="mt-3 text-center">
          <span className="text-xs text-blue-600 font-medium">
            📍 {t('staticMapWithInteractivePins')}
          </span>
        </div>
      </div>
    </div>
  );
};

export default MapView; 