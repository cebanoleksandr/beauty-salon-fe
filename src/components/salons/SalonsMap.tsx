import { useEffect } from 'react';
import L from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import 'leaflet/dist/leaflet.css';
import { MapContainer, Marker, Popup, TileLayer, ZoomControl, useMap } from 'react-leaflet';
import { Link as RouterLink } from 'react-router-dom';
import type { Salon } from '../../types/api';

delete (L.Icon.Default.prototype as { _getIconUrl?: unknown })._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const userIcon = new L.Icon({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
  iconSize: [20, 33],
  iconAnchor: [10, 33],
  className: 'opacity-60',
});

interface RecenterProps {
  latitude: number;
  longitude: number;
}

function RecenterOnChange({ latitude, longitude }: RecenterProps) {
  const map = useMap();

  useEffect(() => {
    map.setView([latitude, longitude], map.getZoom());
  }, [latitude, longitude, map]);

  return null;
}

interface SalonsMapProps {
  latitude: number;
  longitude: number;
  salons: Salon[];
}

export default function SalonsMap({ latitude, longitude, salons }: SalonsMapProps) {
  return (
    <MapContainer
      center={[latitude, longitude]}
      zoom={13}
      scrollWheelZoom
      zoomControl={false}
      style={{ height: '100%', width: '100%' }}
    >
      <RecenterOnChange latitude={latitude} longitude={longitude} />
      <ZoomControl position="bottomright" />

      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <Marker position={[latitude, longitude]} icon={userIcon} />

      {salons.map((salon) => (
        <Marker key={salon.id} position={[salon.latitude, salon.longitude]}>
          <Popup>
            <RouterLink to={`/salons/${salon.id}`} className="font-medium text-sky-600">
              {salon.name}
            </RouterLink>
            <p className="text-xs text-slate-500 mt-1">{salon.address}</p>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
