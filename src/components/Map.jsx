import React, { useEffect, useRef } from 'react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
// Fix for default marker icons in Leaflet with React
import 'leaflet/dist/images/marker-icon.png';
import 'leaflet/dist/images/marker-shadow.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Override the default icon to fix marker issues in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
 iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const Map = ({ center, markers, route }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  // Helper function to escape HTML characters
  const escapeHtml = (text) => {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
 };


  // Initialize map when Leaflet is loaded
  useEffect(() => {
    if (!mapRef.current) return;

    // Clean up existing map instance if any before creating a new one
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
    }

    // Initialize map
    const map = L.map(mapRef.current).setView(center || [9.03, 38.74], 13);

    // Add OpenStreetMap tiles (no API key required)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Add markers
    if (markers && markers.length > 0) {
      markers.forEach(markerData => {
        // Create custom icon based on whether the pharmacy has the requested medication
        let customIcon;
        if (markerData.hasMedication) {
          // Blue icon for pharmacies with the requested medication
          customIcon = L.divIcon({
            className: 'custom-pharmacy-marker',
            html: `
              <div style="
                background-color: #3b82f6;
                border: 2px solid white;
                border-radius: 50%;
                width: 24px;
                height: 24px;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-weight: bold;
                font-size: 12px;
                box-shadow: 0 2px 4px rgba(0,0,0.3);
                cursor: pointer;
              ">
                ✓
              </div>
            `,
            iconSize: [24, 24],
            iconAnchor: [12, 12]
          });
        } else if (markerData.hasMedication === false) {
          // Gray icon for pharmacies without the requested medication
          customIcon = L.divIcon({
            className: 'custom-pharmacy-marker',
            html: `
              <div style="
                background-color: #9ca3af;
                border: 2px solid white;
                border-radius: 50%;
                width: 20px;
                height: 20px;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-weight: bold;
                font-size: 10px;
                box-shadow: 0 2px 4px rgba(0,0,0.3);
                cursor: pointer;
              ">
                ✕
              </div>
            `,
            iconSize: [20, 20],
            iconAnchor: [10, 10]
          });
        } else {
          // Default icon for pharmacies when not filtering by medication
          customIcon = L.divIcon({
            className: 'custom-pharmacy-marker',
            html: `
              <div style="
                background-color: #ef4444;
                border: 2px solid white;
                border-radius: 50%;
                width: 24px;
                height: 24px;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-weight: bold;
                font-size: 12px;
                box-shadow: 0 2px 4px rgba(0,0,0.3);
                cursor: pointer;
              ">
                🏥
              </div>
            `,
            iconSize: [24, 24],
            iconAnchor: [12, 12]
          });
        }

        const marker = L.marker(markerData.position, { icon: customIcon }).addTo(map);
        if (markerData.popup) {
          // If popup is a string, use it directly
          if (typeof markerData.popup === 'string') {
            marker.bindPopup(markerData.popup);
          }
          // If popup is an object, create a formatted popup
          else if (typeof markerData.popup === 'object') {
            const popupContent = `
              <div class="p-2">
                <h3 class="font-bold text-lg">${escapeHtml(markerData.popup.title || 'Pharmacy')}</h3>
                ${markerData.popup.address ? `<p class="text-gray-600">${escapeHtml(markerData.popup.address)}</p>` : ''}
                ${markerData.popup.rating ? `<p class="text-primary font-medium">★ ${escapeHtml(markerData.popup.rating)}</p>` : ''}
                ${markerData.popup.phone ? `<p class="text-gray-600">📞 ${escapeHtml(markerData.popup.phone)}</p>` : ''}
                ${markerData.popup.distance ? `<p class="text-gray-600">📍 ${escapeHtml(markerData.popup.distance)}</p>` : ''}
                ${markerData.hasMedication !== undefined ? `<p class="mt-2 text-sm ${markerData.hasMedication ? 'text-green-600' : 'text-red-600'} font-medium">Status: ${markerData.hasMedication ? 'Has Medication' : 'No Medication'}</p>` : ''}
              </div>
            `;
            marker.bindPopup(popupContent);
          }
        }
      });
    }

    // Add route if provided
    if (route && route.length > 0) {
      const polyline = L.polyline(route, { color: '#3b82f6' }).addTo(map);
      map.fitBounds(polyline.getBounds());
    }

    // Store map instance
    mapInstanceRef.current = map;

    // Clean up on unmount
    return () => {
      if (mapInstanceRef.current) {
        try {
          mapInstanceRef.current.remove();
        } catch (e) {
          // Ignore errors during cleanup
          console.warn('Error removing map:', e);
        }
        mapInstanceRef.current = null;
      }
    };
  }, [center, markers, route]); // Only re-run when these props change

  return (
    <div className="w-full h-96 rounded-lg overflow-hidden">
      <div ref={mapRef} className="w-full h-full"></div>
    </div>
  );
};

export default Map;