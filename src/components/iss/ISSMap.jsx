import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import { useEffect, useMemo } from 'react';
import L from 'leaflet';

// Fix for Leaflet default icon issues in React
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerIconRetina from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: markerIcon,
    iconRetinaUrl: markerIconRetina,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    tooltipAnchor: [16, -28],
    shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Custom ISS Icon
const issIcon = new L.Icon({
  iconUrl: 'https://upload.wikimedia.org/wikipedia/commons/d/d0/International_Space_Station.svg',
  iconSize: [45, 45],
  iconAnchor: [22, 22],
  popupAnchor: [0, -20],
  className: 'iss-marker-icon'
});

// Component to handle map movement without recreating MapContainer
function ChangeView({ center, autoCenter }) {
  const map = useMap();
  useEffect(() => {
    if (autoCenter && center) {
      map.setView(center, map.getZoom(), { animate: true });
    }
  }, [center, autoCenter, map]);
  return null;
}

export default function ISSMap({ issData, history, autoCenter }) {
  // Mandatory loading fallback
  if (!issData) {
    return (
      <div className="h-[450px] w-full glass-panel flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-muted-foreground font-bold uppercase tracking-widest text-xs">Loading ISS...</p>
        </div>
      </div>
    );
  }

  const position = [issData.latitude, issData.longitude];
  
  // Memoize static map parts to prevent rerenders
  const mapContent = useMemo(() => (
    <TileLayer
      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    />
  ), []);

  return (
    <div className="h-[450px] w-full rounded-2xl overflow-hidden glass-panel border border-border relative z-0">
      <MapContainer 
        center={position} 
        zoom={3} 
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%' }}
      >
        {mapContent}
        
        {/* Trajectory Polyline */}
        {history.length > 1 && (
          <Polyline 
            positions={history.map(h => [h.lat, h.lng])} 
            pathOptions={{ color: '#3b82f6', weight: 3, opacity: 0.6, dashArray: '5, 10' }} 
          />
        )}

        {/* ISS Marker */}
        <Marker position={position} icon={issIcon}>
          <Popup>
            <div className="text-xs font-bold uppercase tracking-tight text-primary">ISS Current Node</div>
            <div className="text-[10px] text-muted-foreground">Lat: {issData.latitude.toFixed(4)}</div>
            <div className="text-[10px] text-muted-foreground">Lon: {issData.longitude.toFixed(4)}</div>
          </Popup>
        </Marker>

        <ChangeView center={position} autoCenter={autoCenter} />
      </MapContainer>
    </div>
  );
}
