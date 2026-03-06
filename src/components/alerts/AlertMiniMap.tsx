import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useRiderLocations } from "@/hooks/useRiderLocations";

const XALAPA_CENTER: [number, number] = [19.5438, -96.9102];

const statusColors: Record<string, string> = {
  available: "#22c55e",
  on_route: "#f59e0b",
  paused: "#94a3b8",
  offline: "#cbd5e1",
  sos: "#ef4444",
};

interface AlertMiniMapProps {
  riderId: string;
}

export default function AlertMiniMap({ riderId }: AlertMiniMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const { locations } = useRiderLocations();

  const riderLocation = locations.find((l) => l.rider_id === riderId);

  useEffect(() => {
    if (!mapRef.current) return;

    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
      markerRef.current = null;
    }

    const center: [number, number] = riderLocation
      ? [riderLocation.lat, riderLocation.lng]
      : XALAPA_CENTER;

    const map = L.map(mapRef.current, {
      zoomControl: false,
      attributionControl: false,
      dragging: true,
      scrollWheelZoom: false,
    }).setView(center, 16);

    L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
      maxZoom: 19,
    }).addTo(map);

    if (riderLocation) {
      const color = statusColors[riderLocation.status] || "#3b82f6";
      const isSos = riderLocation.status === "sos";
      const size = isSos ? 36 : 28;
      const emoji = isSos ? "🚨" : "🛵";

      const icon = L.divIcon({
        className: "rider-marker",
        html: `<div style="
          width: ${size}px; height: ${size}px; border-radius: 50%;
          background: ${color}; border: 3px solid ${isSos ? '#fca5a5' : 'white'};
          box-shadow: 0 0 ${isSos ? '12px 3px rgba(239,68,68,0.5)' : '6px rgba(0,0,0,0.3)'};
          display: flex; align-items: center; justify-content: center;
          font-size: ${isSos ? 16 : 12}px;
          ${isSos ? 'animation: sos-pulse 1s ease-in-out infinite;' : ''}
        ">${emoji}</div>`,
        iconSize: [size, size],
        iconAnchor: [size / 2, size / 2],
      });

      markerRef.current = L.marker([riderLocation.lat, riderLocation.lng], { icon }).addTo(map);
    }

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
      markerRef.current = null;
    };
  }, [riderLocation?.lat, riderLocation?.lng, riderLocation?.status, riderId]);

  return (
    <div ref={mapRef} className="h-40 w-full rounded-md overflow-hidden" />
  );
}
