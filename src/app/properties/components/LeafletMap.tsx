'use client';

import { MapContainer, TileLayer, Marker, Tooltip } from 'react-leaflet';
import { useEffect, useRef, useState } from 'react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
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

interface MapBounds {
  north: number;
  south: number;
  east: number;
  west: number;
}

interface LeafletMapProps {
  properties: Property[];
  selectedPropertyId?: string;
  hoveredPropertyId: number | null;
  onPropertyHover: (propertyId: number | null) => void;
  onPropertySelect: (property: Property) => void;
  onBoundsChange: (bounds: MapBounds) => void;
}

export default function LeafletMap({ 
  properties, 
  selectedPropertyId, 
  hoveredPropertyId, 
  onPropertyHover, 
  onPropertySelect, 
  onBoundsChange 
}: LeafletMapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const [layer, setLayer] = useState<'osm' | 'sat'>('osm');

  const PropertyPin = ({ property }: { property: Property }) => {
    const isHovered = hoveredPropertyId === property.id;
    const isSelected = selectedPropertyId === property.id.toString();
    
    const createCustomIcon = (isHovered: boolean, isSelected: boolean) => {
      const size = isHovered || isSelected ? 36 : 26;
      const gradientStart = '#F08336'; // Lumina orange
      const gradientEnd = '#e0743a';   // deeper orange

      const svgIcon = `
        <svg width="${size}" height="${size}" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="pinGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stop-color="${gradientStart}"/>
              <stop offset="100%" stop-color="${gradientEnd}"/>
            </linearGradient>
            <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="rgba(0,0,0,0.25)"/>
            </filter>
            <style>
              @keyframes pinPulse { 0%{ transform: scale(1); opacity: .35 } 70%{ transform: scale(1.8); opacity: 0 } 100%{ opacity: 0 } }
              .pulse { transform-origin: 12px 12px; animation: pinPulse 2s ease-out infinite; fill: ${gradientStart}; opacity: .25; }
            </style>
          </defs>
          <!-- pulsing ring -->
          <circle class="pulse" cx="12" cy="12" r="10" />
          <g filter="url(#shadow)">
            <circle cx="12" cy="12" r="10" fill="url(#pinGrad)" stroke="white" stroke-width="2"/>
            <!-- glossy highlight -->
            <circle cx="7.5" cy="7.5" r="2" fill="rgba(255,255,255,0.75)"/>
            <!-- house icon -->
            <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" fill="#ffffff"/>
          </g>
        </svg>
      `;

      return L.divIcon({
        html: svgIcon,
        className: 'custom-marker',
        iconSize: [size, size],
        iconAnchor: [size / 2, size / 2],
      });
    };

    return (
      <Marker
        position={property.coordinates}
        icon={createCustomIcon(isHovered, isSelected)}
        eventHandlers={{
          mouseover: () => onPropertyHover(property.id),
          mouseout: () => onPropertyHover(null),
          click: () => onPropertySelect(property),
        }}
      >
        <Tooltip direction="top" offset={[0, -14]} opacity={1}>
          <div className="flex items-center gap-3">
            <img
              src={property.image}
              alt={property.title}
              className="w-16 h-12 object-cover rounded-md flex-shrink-0"
            />
            <div className="text-sm font-medium text-gray-900">
              <div className="font-semibold">{property.title}</div>
              <div className="text-primary-600 font-bold">{property.price}</div>
              <div className="text-gray-600">{property.location}</div>
            </div>
          </div>
        </Tooltip>
      </Marker>
    );
  };

  return (
    <MapContainer
      center={[41.7151, 44.7661]}
      zoom={12}
      className="w-full h-full rounded-lg"
      style={{ height: '100%', width: '100%' }}
      ref={mapRef}
      whenReady={() => {
        console.log('Map is ready, setting up event listeners...');
        
        // Add a small delay to ensure map is fully loaded
        setTimeout(() => {
          if (mapRef.current) {
            const mapInstance = mapRef.current;
            
            const updateBounds = () => {
              const bounds = mapInstance.getBounds();
              console.log('Map bounds changed:', {
                north: bounds.getNorth(),
                south: bounds.getSouth(),
                east: bounds.getEast(),
                west: bounds.getWest()
              });
              
              onBoundsChange({
                north: bounds.getNorth(),
                south: bounds.getSouth(),
                east: bounds.getEast(),
                west: bounds.getWest()
              });
            };
            
            // Add event listeners for map movement
            mapInstance.on('moveend', updateBounds);
            mapInstance.on('zoomend', updateBounds);
            
            // Initial bounds update
            updateBounds();
            
            console.log('Event listeners added successfully');
          }
        }, 500);
      }}
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
      
      {properties.map((property) => (
        <PropertyPin key={property.id} property={property} />
      ))}

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
  );
} 