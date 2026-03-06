import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useRiderLocations, type RiderLocation } from "@/hooks/useRiderLocations";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";

const XALAPA_CENTER: [number, number] = [19.5438, -96.9102];

const statusColors: Record<string, string> = {
  available: "#22c55e",
  on_route: "#f59e0b",
  paused: "#94a3b8",
  offline: "#cbd5e1",
};

const statusLabels: Record<string, string> = {
  available: "Disponible",
  on_route: "En ruta",
  paused: "En pausa",
  offline: "Desconectado",
};

function createRiderIcon(status: string) {
  const color = statusColors[status] || "#3b82f6";
  return L.divIcon({
    className: "rider-marker",
    html: `<div style="
      width: 32px; height: 32px; border-radius: 50%;
      background: ${color}; border: 3px solid white;
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      display: flex; align-items: center; justify-content: center;
      font-size: 14px;
    ">🛵</div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });
}

export default function LiveMap() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<Record<string, L.Marker>>({});
  const { locations, loading } = useRiderLocations();

  // Initialize map
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const map = L.map(mapRef.current, {
      zoomControl: false,
    }).setView(XALAPA_CENTER, 14);

    L.control.zoom({ position: "bottomright" }).addTo(map);

    L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
      attribution: '&copy; <a href="https://carto.com/">CARTO</a>',
      maxZoom: 19,
    }).addTo(map);

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
      markersRef.current = {};
    };
  }, []);

  // Update markers when locations change
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    const currentIds = new Set(locations.map((l) => l.rider_id));

    // Remove markers for riders no longer present
    Object.keys(markersRef.current).forEach((id) => {
      if (!currentIds.has(id)) {
        markersRef.current[id].remove();
        delete markersRef.current[id];
      }
    });

    // Add or update markers
    locations.forEach((loc) => {
      const existing = markersRef.current[loc.rider_id];
      if (existing) {
        existing.setLatLng([loc.lat, loc.lng]);
        existing.setIcon(createRiderIcon(loc.status));
        existing.setPopupContent(popupContent(loc));
      } else {
        const marker = L.marker([loc.lat, loc.lng], {
          icon: createRiderIcon(loc.status),
        })
          .bindPopup(popupContent(loc))
          .addTo(map);
        markersRef.current[loc.rider_id] = marker;
      }
    });
  }, [locations]);

  return (
    <div className="absolute inset-0 flex flex-col">
      {/* Legend bar */}
      <div className="absolute top-2 left-2 z-[1000] flex items-center gap-2 bg-card/90 backdrop-blur-sm rounded-lg px-3 py-1.5 border border-border shadow-sm">
        <span className="text-[10px] font-semibold text-foreground">Estado:</span>
        {Object.entries(statusLabels).filter(([k]) => k !== "offline").map(([key, label]) => (
          <div key={key} className="flex items-center gap-1">
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ background: statusColors[key] }}
            />
            <span className="text-[10px] text-muted-foreground">{label}</span>
          </div>
        ))}
      </div>

      {/* Rider count */}
      <div className="absolute top-2 right-2 z-[1000]">
        <Badge variant="secondary" className="text-xs gap-1 bg-card/90 backdrop-blur-sm border border-border">
          <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
          {locations.length} repartidor{locations.length !== 1 ? "es" : ""}
        </Badge>
      </div>

      {loading && (
        <div className="absolute inset-0 z-[1000] flex items-center justify-center bg-background/60">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      )}

      {!loading && locations.length === 0 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-[1000] bg-card/90 backdrop-blur-sm rounded-lg px-4 py-2 border border-border">
          <p className="text-xs text-muted-foreground">Sin repartidores activos — esperando señal GPS…</p>
        </div>
      )}

      <div ref={mapRef} className="flex-1 w-full" />
    </div>
  );
}

function popupContent(loc: RiderLocation): string {
  const status = statusLabels[loc.status] || loc.status;
  const speed = loc.speed ? `${loc.speed.toFixed(1)} km/h` : "Detenido";
  const time = new Date(loc.updated_at).toLocaleTimeString("es-MX", {
    hour: "2-digit",
    minute: "2-digit",
  });
  return `
    <div style="font-family: Inter, sans-serif; min-width: 140px;">
      <strong style="font-size: 13px;">${loc.rider_name || loc.rider_id}</strong>
      <div style="font-size: 11px; color: #666; margin-top: 4px;">
        <div>📍 ${status}</div>
        <div>🏎️ ${speed}</div>
        <div>🕐 ${time}</div>
      </div>
    </div>
  `;
}
