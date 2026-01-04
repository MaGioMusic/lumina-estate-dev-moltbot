'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import Leaflet components to avoid SSR issues
const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then(mod => mod.Popup), { ssr: false });

interface SinglePropertyMapProps {
  coordinates: {
    lat: number;
    lng: number;
  };
  propertyTitle: string;
  propertyPrice: string;
  propertyAddress: string;
  propertyImage?: string;
}

export default function SinglePropertyMap({ 
  coordinates, 
  propertyTitle, 
  propertyPrice, 
  propertyAddress,
  propertyImage 
}: SinglePropertyMapProps) {
  const [isClient, setIsClient] = useState(false);
  const [leafletLoaded, setLeafletLoaded] = useState(false);
  const [layer, setLayer] = useState<'osm' | 'sat'>('osm');

  useEffect(() => {
    setIsClient(true);
    // Dynamically import Leaflet only on client side
    import('leaflet').then((L) => {
      setLeafletLoaded(true);
      
      // Fix for default markers
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
      });
    });
  }, []);

  if (!isClient || !leafletLoaded) {
    return (
      <div className="h-full bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-400 mx-auto mb-4"></div>
          <p className="text-gray-600 text-sm">რუკა იტვირთება...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <style jsx global>{`
        .single-property-map .leaflet-container {
          height: 100% !important;
          width: 100% !important;
          z-index: 1;
        }
        
        .single-property-map .leaflet-popup-content-wrapper {
          background: rgba(255, 255, 255, 0.98) !important;
          border: 1px solid #F08336 !important;
          border-radius: 12px !important;
          box-shadow: 0 8px 24px rgba(0,0,0,0.15) !important;
        }
        
        .single-property-map .leaflet-popup-tip {
          background: #F08336 !important;
          border: 1px solid #F08336 !important;
        }
        
        .property-popup {
          min-width: 200px;
          text-align: left;
        }
        
        .property-popup-title {
          font-weight: 600;
          color: #1F2937;
          margin-bottom: 8px;
          font-size: 14px;
          line-height: 1.3;
        }
        
        .property-popup-price {
          color: #F08336;
          font-weight: 700;
          font-size: 16px;
          margin-bottom: 8px;
        }
        
        .property-popup-address {
          color: #6B7280;
          font-size: 12px;
          margin-bottom: 8px;
          display: flex;
          align-items: center;
          gap: 4px;
        }
        
        .property-popup-image {
          width: 100%;
          height: 80px;
          object-fit: cover;
          border-radius: 8px;
          margin-bottom: 8px;
        }
      `}</style>
      
      <div className="single-property-map h-full">
        <MapContainer
          center={[coordinates.lat, coordinates.lng]}
          zoom={15}
          style={{ height: '100%', width: '100%' }}
          className="z-0"
        >
          {layer === 'osm' ? (
            <TileLayer
              key="osm"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
          ) : (
            <TileLayer
              key="sat"
              attribution='&copy; <a href="https://www.esri.com/">Esri</a>, DigitalGlobe, GeoEye, Earthstar Geographics, CNES/Airbus DS, USDA, USGS, AeroGRID, IGN, and the GIS User Community'
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            />
          )}
          <Marker position={[coordinates.lat, coordinates.lng]}>
            <Popup>
              <div className="property-popup">
                {propertyImage && (
                  <img 
                    src={propertyImage} 
                    alt={propertyTitle}
                    className="property-popup-image"
                  />
                )}
                <div className="property-popup-title">{propertyTitle}</div>
                <div className="property-popup-price">{propertyPrice}</div>
                <div className="property-popup-address">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  <span>{propertyAddress}</span>
                </div>
                <div className="mt-3">
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${coordinates.lat},${coordinates.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block bg-primary-400 text-white px-3 py-1 rounded text-sm hover:bg-primary-500 transition-colors"
                  >
                    Open in Google Maps
                  </a>
                </div>
              </div>
            </Popup>
          </Marker>

          {/* Layer Toggle */}
          <div className="leaflet-top leaflet-right">
            <div className="leaflet-control leaflet-bar">
              <button
                onClick={() => setLayer((l) => (l === 'osm' ? 'sat' : 'osm'))}
                title={layer === 'osm' ? 'სატელიტი' : 'რუკა'}
                className="px-2 py-1 text-xs bg-white hover:bg-gray-50"
                style={{ cursor: 'pointer' }}
              >
                {layer === 'osm' ? '🛰️' : '🗺️'}
              </button>
            </div>
          </div>
        </MapContainer>
      </div>
    </>
  );
} 