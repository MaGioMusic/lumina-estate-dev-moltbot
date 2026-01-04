'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import map components to avoid SSR issues
const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then(mod => mod.Popup), { ssr: false });

export default function ContactMap() {
  const [isClient, setIsClient] = useState(false);
  const [leafletLoaded, setLeafletLoaded] = useState(false);

  // Lumina Estate office coordinates (Rustaveli Avenue 12, Tbilisi)
  const officeLocation = {
    lat: 41.6941,
    lng: 44.8337,
    address: "Rustaveli Avenue 12, Tbilisi"
  };

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
      <div className="bg-gray-200 dark:bg-gray-700 rounded-2xl h-[500px] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-400 mx-auto mb-4"></div>
          <p className="text-gray-500 dark:text-gray-400">Loading Map...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl overflow-hidden h-[500px] border border-gray-200 dark:border-gray-700">
      <MapContainer
        center={[officeLocation.lat, officeLocation.lng]}
        zoom={15}
        style={{ height: '100%', width: '100%' }}
        className="z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[officeLocation.lat, officeLocation.lng]}>
          <Popup>
            <div className="text-center p-2">
              <h3 className="font-bold text-lg text-gray-900 mb-2">Lumina Estate</h3>
              <p className="text-gray-600 mb-2">{officeLocation.address}</p>
              <p className="text-sm text-gray-500">📞 +995 555 123 456</p>
              <p className="text-sm text-gray-500">📧 info@luminaestate.ge</p>
              <div className="mt-3">
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${officeLocation.lat},${officeLocation.lng}`}
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
      </MapContainer>
    </div>
  );
} 