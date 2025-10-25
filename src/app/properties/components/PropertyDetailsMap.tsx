'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { Bed, Bath, Maximize2, MapPin } from 'lucide-react';

// Correct dynamic import approach for Next.js 15
const Map = dynamic(() => import('./LeafletMap'), { 
  ssr: false,
  loading: () => <div className="w-full h-full bg-gray-100 animate-pulse rounded-lg flex items-center justify-center">
    <div className="text-gray-500">Loading map...</div>
  </div>
});

interface Property {
  id: number;
  title: string;
  price: string;
  location: string;
  type: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  image: string;
  coordinates: [number, number];
  district: string;
}

// Extended properties data - more properties across Tbilisi
const allProperties: Property[] = [
  {
    id: 1,
    title: "ლუქს ბინა ვაკეში",
    price: "350,000₾",
    location: "ვაკე, ყაზბეგის ქუჩა",
    type: "ბინა",
    bedrooms: 3,
    bathrooms: 2,
    area: 120,
    image: "/images/properties/property-12.jpg",
    coordinates: [41.7151, 44.7661],
    district: "ვაკე"
  },
  {
    id: 2,
    title: "ოფისი ვაკეში",
    price: "450,000₾",
    location: "ვაკე, ჩავჩავაძის ქუჩა",
    type: "ოფისი",
    bedrooms: 0,
    bathrooms: 2,
    area: 180,
    image: "/images/properties/property-13.jpg",
    coordinates: [41.7089, 44.7701],
    district: "ვაკე"
  },
  {
    id: 3,
    title: "ახალი ბინა ვაკეში",
    price: "280,000₾",
    location: "ვაკე, პეკინის ქუჩა",
    type: "ბინა",
    bedrooms: 2,
    bathrooms: 1,
    area: 85,
    image: "/images/properties/property-14.jpg",
    coordinates: [41.7123, 44.7623],
    district: "ვაკე"
  },
  {
    id: 4,
    title: "სტუდია ვაკეში",
    price: "195,000₾",
    location: "ვაკე, ი. ჭავჭავაძის ქუჩა",
    type: "სტუდია",
    bedrooms: 1,
    bathrooms: 1,
    area: 55,
    image: "/images/properties/property-15.jpg",
    coordinates: [41.7178, 44.7689],
    district: "ვაკე"
  },
  {
    id: 5,
    title: "პენტჰაუსი ვაკეში",
    price: "680,000₾",
    location: "ვაკე, კოსტავას ქუჩა",
    type: "პენტჰაუსი",
    bedrooms: 4,
    bathrooms: 3,
    area: 220,
    image: "/images/properties/property-5.jpg",
    coordinates: [41.7201, 44.7645],
    district: "ვაკე"
  },
  {
    id: 6,
    title: "თანამედროვე სახლი მთაწმინდაზე",
    price: "750,000₾",
    location: "მთაწმინდა, ნუცუბიძის ქუჩა",
    type: "სახლი",
    bedrooms: 5,
    bathrooms: 4,
    area: 280,
    image: "/images/properties/property-6.jpg",
    coordinates: [41.6927, 44.7831],
    district: "მთაწმინდა"
  },
  {
    id: 7,
    title: "ვილა მთაწმინდაზე",
    price: "890,000₾",
    location: "მთაწმინდა, ბაღები",
    type: "ვილა",
    bedrooms: 6,
    bathrooms: 5,
    area: 350,
    image: "/images/properties/property-7.jpg",
    coordinates: [41.6845, 44.7856],
    district: "მთაწმინდა"
  },
  {
    id: 8,
    title: "ბინა მთაწმინდაზე",
    price: "420,000₾",
    location: "მთაწმინდა, მამაცაშვილის ქუჩა",
    type: "ბინა",
    bedrooms: 3,
    bathrooms: 2,
    area: 140,
    image: "/images/properties/property-8.jpg",
    coordinates: [41.6889, 44.7798],
    district: "მთაწმინდა"
  },
  {
    id: 9,
    title: "კოტეჯი მთაწმინდაზე",
    price: "520,000₾",
    location: "მთაწმინდა, ფუნიკულიორი",
    type: "კოტეჯი",
    bedrooms: 4,
    bathrooms: 3,
    area: 190,
    image: "/images/properties/property-9.jpg",
    coordinates: [41.6923, 44.7789],
    district: "მთაწმინდა"
  },
  {
    id: 10,
    title: "ისტორიული ბინა ძველ ქალაქში",
    price: "280,000₾",
    location: "ძველი ქალაქი, ლესელიძის ქუჩა",
    type: "ბინა",
    bedrooms: 2,
    bathrooms: 1,
    area: 85,
    image: "/images/properties/property-10.jpg",
    coordinates: [41.6938, 44.8015],
    district: "ძველი ქალაქი"
  },
  {
    id: 11,
    title: "ლოფტი ძველ ქალაქში",
    price: "320,000₾",
    location: "ძველი ქალაქი, სიონის ქუჩა",
    type: "ლოფტი",
    bedrooms: 2,
    bathrooms: 2,
    area: 95,
    image: "/images/properties/property-11.jpg",
    coordinates: [41.6889, 44.8056],
    district: "ძველი ქალაქი"
  },
  {
    id: 12,
    title: "სტუდია ძველ ქალაქში",
    price: "195,000₾",
    location: "ძველი ქალაქი, ბეთლემის ქუჩა",
    type: "სტუდია",
    bedrooms: 1,
    bathrooms: 1,
    area: 45,
    image: "/images/properties/property-12.jpg",
    coordinates: [41.6967, 44.8089],
    district: "ძველი ქალაქი"
  },
  {
    id: 13,
    title: "ახალი ბინა საბურთალოში",
    price: "220,000₾",
    location: "საბურთალო, ვაზისუბნის ქუჩა",
    type: "ბინა",
    bedrooms: 2,
    bathrooms: 2,
    area: 95,
    image: "/images/properties/property-13.jpg",
    coordinates: [41.7270, 44.7511],
    district: "საბურთალო"
  },
  {
    id: 14,
    title: "კომფორტული ბინა საბურთალოში",
    price: "195,000₾",
    location: "საბურთალო, ღუდუშაურის ქუჩა",
    type: "ბინა",
    bedrooms: 2,
    bathrooms: 1,
    area: 75,
    image: "/images/properties/property-14.jpg",
    coordinates: [41.7356, 44.7445],
    district: "საბურთალო"
  },
  {
    id: 15,
    title: "ბინა ისანში",
    price: "165,000₾",
    location: "ისანი, კახეთის გზატკეცილი",
    type: "ბინა",
    bedrooms: 2,
    bathrooms: 1,
    area: 68,
    image: "/images/properties/property-15.jpg",
    coordinates: [41.7543, 44.8156],
    district: "ისანი"
  }
];

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
  dateAdded: [Date | null, Date | null];
  quality: string[];
}

interface PropertyDetailsMapProps {
  selectedPropertyId?: string;
  filters?: FiltersState;
  searchQuery?: string;
}

interface MapBounds {
  north: number;
  south: number;
  east: number;
  west: number;
}

export default function PropertyDetailsMap({ selectedPropertyId, filters, searchQuery }: PropertyDetailsMapProps) {
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [hoveredProperty, setHoveredProperty] = useState<number | null>(null);
  const [mapBounds, setMapBounds] = useState<MapBounds | null>(null);
  const [visibleProperties, setVisibleProperties] = useState<Property[]>(allProperties);

  // Pre-filter by global controls (search/filter). Keep logic simple and fast.
  const baseFiltered = useMemo(() => {
    let list = allProperties.slice();
    if (filters) {
      list = list.filter((p) => {
        if (p.area < filters.area[0] || p.area > filters.area[1]) return false;
        const min = filters.priceRange?.[0] ?? 0;
        const max = filters.priceRange?.[1] ?? Number.MAX_SAFE_INTEGER;
        // convert price string like "350,000₾" to number if possible
        const numeric = Number(String(p.price).replace(/[^0-9]/g, '')) || 0;
        if (numeric < min || numeric > max) return false;
        if (filters.bedrooms.length) {
          const ok = filters.bedrooms.some((b) => (b === '5+' ? p.bedrooms >= 5 : p.bedrooms === parseInt(b)));
          if (!ok) return false;
        }
        if (filters.bathrooms.length) {
          const ok = filters.bathrooms.some((b) => (b === '4+' ? p.bathrooms >= 4 : p.bathrooms === parseInt(b)));
          if (!ok) return false;
        }
        return true;
      });
    }
    if (searchQuery && searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter((p) => `${p.title} ${p.location} ${p.district}`.toLowerCase().includes(q));
    }
    return list;
  }, [filters, searchQuery]);

  useEffect(() => {
    if (selectedPropertyId) {
      const property = allProperties.find(p => p.id === parseInt(selectedPropertyId));
      if (property) {
        setSelectedProperty(property);
      }
    }
  }, [selectedPropertyId]);

  useEffect(() => {
    if (mapBounds) {
      const filtered = baseFiltered.filter(property => {
        const [lat, lng] = property.coordinates;
        return (
          lat >= mapBounds.south &&
          lat <= mapBounds.north &&
          lng >= mapBounds.west &&
          lng <= mapBounds.east
        );
      });
      console.log('Filtered properties:', filtered.length, 'out of', baseFiltered.length);
      setVisibleProperties(filtered);
    }
  }, [mapBounds, baseFiltered]);

  const handleMapBoundsChange = useCallback((bounds: MapBounds) => {
    console.log('Map bounds changed:', bounds);
    setMapBounds(bounds);
  }, []);

  const handlePropertyHover = (propertyId: number | null) => {
    setHoveredProperty(propertyId);
  };

  const handlePropertySelect = (property: Property) => {
    setSelectedProperty(property);
  };

  return (
    <>
      <style jsx>{`
        .property-details-map {
          height: 100vh;
          width: 100%;
        }
        
        .property-card {
          transition: all 0.2s ease;
          cursor: pointer;
        }
        
        .property-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0,0,0,0.1);
        }
        
        .property-card.hovered {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0,0,0,0.15);
          border-color: #F08336;
        }
        
        .property-card.selected {
          border-color: #F08336;
          box-shadow: 0 8px 25px rgba(240, 131, 54, 0.2);
        }
        
        .properties-counter {
          background: rgba(255, 255, 255, 0.95);
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          padding: 8px 12px;
          font-size: 14px;
          font-weight: 500;
          color: #374151;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
      `}</style>
      
      <div className="flex h-full">
        {/* Left Panel - Properties List (compact 2-column) */}
        <div className="w-[576px] flex-shrink-0 overflow-y-auto">
          {/* Search Bar */}
          <div className="p-6 border-b border-gray-200">
            <div className="relative">
              <input
                type="text"
                placeholder="Search properties..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-400 outline-none"
              />
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
            
            {/* Properties Counter */}
            <div className="mt-4 flex justify-between items-center">
              <div className="properties-counter">
                {visibleProperties.length} properties in this area
              </div>
            </div>
          </div>

          {/* Properties List - compact grid */}
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            {visibleProperties.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No properties in this area</h3>
                <p className="text-gray-600">Try zooming out or moving the map to see more properties</p>
              </div>
            ) : (
              visibleProperties.map((property) => (
                <div
                  key={property.id}
                  className={`property-card bg-white rounded-xl border border-gray-200 overflow-hidden ${
                    hoveredProperty === property.id ? 'hovered' : ''
                  } ${selectedProperty?.id === property.id ? 'selected' : ''}`}
                  onMouseEnter={() => handlePropertyHover(property.id)}
                  onMouseLeave={() => handlePropertyHover(null)}
                  onClick={() => handlePropertySelect(property)}
                >
                  {/* Property Image */}
                  <div className="relative h-32">
                    <img
                      src={property.image}
                      alt={property.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 left-2">
                      <span className="bg-green-500 text-white px-2 py-0.5 rounded-full text-[10px] font-medium">
                        For Sale
                      </span>
                    </div>
                    <div className="absolute top-2 right-2">
                      <span className="bg-white/90 text-gray-800 px-2 py-0.5 rounded-full text-[10px] font-medium">
                        {property.type}
                      </span>
                    </div>
                  </div>

                  {/* Property Info */}
                  <div className="p-3">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="text-[13px] font-semibold text-gray-900 leading-snug line-clamp-2">{property.title}</h3>
                        <div className="flex items-center gap-1 text-gray-600 mt-1">
                          <MapPin className="w-3.5 h-3.5" />
                          <span className="text-xs truncate max-w-[150px]">{property.location}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-[15px] font-bold text-[#F08336]">{property.price}</div>
                      </div>
                    </div>

                    {/* Property Stats */}
                    <div className="flex items-center gap-3 text-[11px] text-gray-600">
                      <div className="flex items-center gap-1">
                        <Bed className="w-3.5 h-3.5" />
                        <span>{property.bedrooms}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Bath className="w-3.5 h-3.5" />
                        <span>{property.bathrooms}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Maximize2 className="w-3.5 h-3.5" />
                        <span>{property.area} m²</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Panel - Map */}
        <div className="flex-1 property-details-map">
          <Map
            properties={visibleProperties}
            selectedPropertyId={selectedPropertyId}
            hoveredPropertyId={hoveredProperty}
            onPropertyHover={handlePropertyHover}
            onPropertySelect={handlePropertySelect}
            onBoundsChange={handleMapBoundsChange}
          />
        </div>
      </div>
    </>
  );
} 