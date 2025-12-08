"use client"
import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icon issue with Webpack
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const MapComponent = ({ coordinates }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);

  useEffect(() => {
    // Only initialize if map doesn't exist
    if (!mapInstanceRef.current && mapRef.current) {
      mapInstanceRef.current = L.map(mapRef.current).setView(
        [coordinates[1], coordinates[0]], 
        13
      );

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(mapInstanceRef.current);

      markerRef.current = L.marker([coordinates[1], coordinates[0]])
        .addTo(mapInstanceRef.current);
    }

    // Update map view and marker when coordinates change
    if (mapInstanceRef.current && coordinates[0] !== 0) {
      mapInstanceRef.current.setView([coordinates[1], coordinates[0]], 13);
      
      if (markerRef.current) {
        markerRef.current.setLatLng([coordinates[1], coordinates[0]]);
      } else {
        markerRef.current = L.marker([coordinates[1], coordinates[0]])
          .addTo(mapInstanceRef.current);
      }
    }

    // Cleanup function
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [coordinates]);

  return (
    <div 
      ref={mapRef} 
      style={{ 
        height: '300px', 
        width: '100%', 
        borderRadius: '8px',
        overflow: 'hidden'
      }} 
    />
  );
};

export default MapComponent;