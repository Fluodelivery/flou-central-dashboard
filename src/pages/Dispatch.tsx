import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Clock, User, Navigation, Package, AlertTriangle, Flame } from "lucide-react";
import { pendingOrders, riders, heatmapZones, type PendingOrder } from "@/data/mock-data";

const STALLED_THRESHOLD = 10; // minutes

export default function Dispatch() {
  const [orders, setOrders] = useState(pendingOrders);
  const [draggedOrder, setDraggedOrder] = useState<PendingOrder | null>(null);
  const [assignedOrders, setAssignedOrders] = useState<Record<string, string>>({});
  const [mapView, setMapView] = useState<"live" | "heatmap">("live");

  const handleDragStart = (order: PendingOrder) => {
    setDraggedOrder(order);
  };

  const handleDrop = (riderId: string) => {
    if (draggedOrder) {
      setAssignedOrders((prev) => ({ ...prev, [draggedOrder.id]: riderId }));
      setOrders((prev) => prev.filter((o) => o.id !== draggedOrder.id));
      setDraggedOrder(null);
    }
  };

  const statusColor = {
    available: "bg-success",
    on_route: "bg-warning",
    paused: "bg-muted-foreground",
    offline: "bg-border",
  };

  const statusLabel = {
    available: "Disponible",
    on_route: "En ruta",
    paused: "En pausa",
    offline: "Desconectado",
  };

  const stalledOrders = orders.filter((o) => o.minutesWaiting >= STALLED_THRESHOLD);
  const idleRiders = riders.filter((r) => r.idleMinutes && r.idleMinutes >= 10);

  const intensityColor = {
    low: "bg-primary/20 text-primary",
    medium: "bg-primary/40 text-primary",
    high: "bg-warning/60 text-warning-foreground",
    critical: "bg-destructive/70 text-destructive-foreground",
  };

  return (
    <div className="h-[calc(100vh-7rem)] grid grid-cols-[280px_1fr_300px] gap-3">
      {/* LEFT: Pending Orders */}
      <Card className="flex flex-col overflow-hidden">
        <CardHeader className="py-3 px-4 border-b">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-semibold">📥 Bandeja de Pedidos</CardTitle>
            <Badge variant="secondary" className="text-xs">{orders.length}</Badge>
          </div>
        </CardHeader>

        {/* Stalled orders alert banner */}
        {stalledOrders.length > 0 && (
          <div className="px-3 py-2 bg-destructive/10 border-b border-destructive/20">
            <div className="flex items-center gap-1.5 text-destructive">
              <AlertTriangle className="h-3.5 w-3.5" />
              <span className="text-[11px] font-semibold">{stalledOrders.length} pedido(s) estancado(s) (&gt;{STALLED_THRESHOLD} min)</span>
            </div>
          </div>
        )}

        <ScrollArea className="flex-1">
          <div className="p-2 space-y-2">
            {orders.map((order) => {
              const isStalled = order.minutesWaiting >= STALLED_THRESHOLD;
              return (
                <div
                  key={order.id}
                  draggable
                  onDragStart={() => handleDragStart(order)}
                  className={`p-3 rounded-lg border cursor-grab active:cursor-grabbing transition-colors ${
                    isStalled
                      ? "border-destructive/50 bg-destructive/5 animate-pulse"
                      : "border-border bg-card hover:border-primary/50"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono font-semibold text-foreground">{order.id}</span>
                    <div className="flex items-center gap-1">
                      {isStalled && (
                        <Badge className="text-[10px] bg-destructive text-destructive-foreground gap-0.5">
                          <AlertTriangle className="h-2.5 w-2.5" />
                          ESTANCADO
                        </Badge>
                      )}
                      {order.priority === "urgent" && !isStalled && (
                        <Badge className="text-[10px] bg-destructive text-destructive-foreground">URGENTE</Badge>
                      )}
                      <div className="flex items-center gap-0.5 text-[10px] text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {order.timeAgo}
                      </div>
                    </div>
                  </div>
                  <div className="space-y-1 text-xs">
                    <div className="flex items-start gap-1.5">
                      <div className="h-3.5 w-3.5 rounded-full border-2 border-success mt-0.5 shrink-0" />
                      <span className="text-foreground">{order.origin}</span>
                    </div>
                    <div className="flex items-start gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-destructive mt-0.5 shrink-0" />
                      <span className="text-foreground">{order.destination}</span>
                    </div>
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-[10px] text-muted-foreground">{order.packageType}</span>
                    <span className="text-[10px] text-muted-foreground">{order.clientName}</span>
                  </div>
                </div>
              );
            })}
            {orders.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                <Package className="h-8 w-8 mb-2 opacity-40" />
                <p className="text-xs">Sin pedidos pendientes</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </Card>

      {/* CENTER: Map / Heatmap */}
      <Card className="flex flex-col overflow-hidden">
        <CardHeader className="py-3 px-4 border-b">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-semibold">📡 Panel Central</CardTitle>
            <div className="flex items-center gap-2">
              <Tabs value={mapView} onValueChange={(v) => setMapView(v as "live" | "heatmap")}>
                <TabsList className="h-7">
                  <TabsTrigger value="live" className="text-[11px] h-5 px-2">En vivo</TabsTrigger>
                  <TabsTrigger value="heatmap" className="text-[11px] h-5 px-2">Heatmap</TabsTrigger>
                </TabsList>
              </Tabs>
              {mapView === "live" && (
                <Badge variant="outline" className="text-xs gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse-dot" />
                  En vivo
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex-1 flex items-center justify-center p-0 relative">
          {mapView === "live" ? (
            <div className="absolute inset-0 bg-muted/30 flex flex-col items-center justify-center">
              <div className="relative mb-4">
                <div className="h-32 w-32 rounded-full border-2 border-dashed border-primary/30 flex items-center justify-center">
                  <div className="h-20 w-20 rounded-full border border-primary/20 flex items-center justify-center">
                    <Navigation className="h-8 w-8 text-primary/60" />
                  </div>
                </div>
                <div className="absolute top-2 right-4 h-3 w-3 rounded-full bg-success animate-pulse-dot" />
                <div className="absolute bottom-6 left-2 h-3 w-3 rounded-full bg-warning animate-pulse-dot" />
                <div className="absolute top-12 left-0 h-3 w-3 rounded-full bg-primary animate-pulse-dot" />
              </div>
              {/* Idle rider alert in map */}
              {idleRiders.length > 0 && (
                <div className="mb-3 px-3 py-2 rounded-lg bg-warning/10 border border-warning/30 max-w-xs">
                  <div className="flex items-center gap-1.5 text-warning text-xs font-medium mb-1">
                    <AlertTriangle className="h-3.5 w-3.5" />
                    Repartidor(es) detenido(s)
                  </div>
                  {idleRiders.map((r) => (
                    <p key={r.id} className="text-[11px] text-muted-foreground">
                      {r.name} — {r.idleMinutes} min en {r.lastKnownLocation}
                    </p>
                  ))}
                </div>
              )}
              <p className="text-sm font-medium text-muted-foreground">Xalapa, Veracruz</p>
              <p className="text-xs text-muted-foreground/70 mt-1">Integración con Traccar pendiente</p>
              <Button variant="outline" size="sm" className="mt-3 text-xs">Conectar Mapa</Button>
            </div>
          ) : (
            /* Heatmap View */
            <div className="absolute inset-0 bg-muted/20 p-4 flex flex-col">
              <div className="flex items-center gap-2 mb-3">
                <Flame className="h-4 w-4 text-destructive" />
                <span className="text-sm font-medium text-foreground">Mapa de Calor — Demanda en tiempo real</span>
              </div>
              <div className="flex-1 grid grid-cols-3 gap-2">
                {heatmapZones.map((zone) => (
                  <div
                    key={zone.id}
                    className={`rounded-lg p-3 flex flex-col justify-between ${intensityColor[zone.intensity]}`}
                  >
                    <div>
                      <p className="text-sm font-semibold">{zone.name}</p>
                      <p className="text-[11px] opacity-80">{zone.orders} pedidos activos</p>
                    </div>
                    <Badge
                      className={`text-[9px] mt-2 w-fit ${
                        zone.intensity === "critical" ? "bg-destructive text-destructive-foreground" :
                        zone.intensity === "high" ? "bg-warning text-warning-foreground" :
                        "bg-primary/20 text-primary"
                      }`}
                    >
                      {zone.intensity === "critical" ? "🔴 Crítico" :
                       zone.intensity === "high" ? "🟠 Alto" :
                       zone.intensity === "medium" ? "🟡 Medio" : "🟢 Bajo"}
                    </Badge>
                  </div>
                ))}
              </div>
              <p className="text-[11px] text-muted-foreground mt-2 text-center">
                Avisa a los repartidores disponibles que se muevan hacia las zonas críticas
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* RIGHT: Fleet Status */}
      <Card className="flex flex-col overflow-hidden">
        <CardHeader className="py-3 px-4 border-b">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-semibold">🛵 Flota Activa</CardTitle>
            <Badge variant="secondary" className="text-xs">
              {riders.filter((r) => r.status !== "offline").length}
            </Badge>
          </div>
        </CardHeader>
        <ScrollArea className="flex-1">
          <div className="p-2 space-y-1.5">
            {riders
              .filter((r) => r.status !== "offline")
              .map((rider) => {
                const isIdle = rider.idleMinutes && rider.idleMinutes >= 10;
                return (
                  <div
                    key={rider.id}
                    onDragOver={(e) => {
                      e.preventDefault();
                      e.currentTarget.classList.add("ring-2", "ring-primary");
                    }}
                    onDragLeave={(e) => {
                      e.currentTarget.classList.remove("ring-2", "ring-primary");
                    }}
                    onDrop={(e) => {
                      e.preventDefault();
                      e.currentTarget.classList.remove("ring-2", "ring-primary");
                      handleDrop(rider.id);
                    }}
                    className={`p-3 rounded-lg border transition-all ${
                      isIdle ? "border-warning/50 bg-warning/5" : "border-border bg-card hover:bg-muted/50"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center shrink-0">
                        <span className="text-xs font-semibold text-foreground">{rider.avatar}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-foreground truncate">{rider.name}</p>
                        <div className="flex items-center gap-1.5">
                          <span className={`h-1.5 w-1.5 rounded-full ${statusColor[rider.status]}`} />
                          <span className="text-[10px] text-muted-foreground">{statusLabel[rider.status]}</span>
                          {rider.currentOrder && (
                            <span className="text-[10px] text-primary font-mono">· {rider.currentOrder}</span>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] text-muted-foreground">⭐ {rider.rating}</p>
                      </div>
                    </div>
                    {/* Idle rider warning */}
                    {isIdle && (
                      <div className="mt-2 px-2 py-1 rounded bg-warning/10 text-[10px] text-warning font-medium flex items-center gap-1">
                        <AlertTriangle className="h-3 w-3" />
                        Detenido {rider.idleMinutes} min — {rider.lastKnownLocation}
                      </div>
                    )}
                    {/* Show recently assigned */}
                    {Object.entries(assignedOrders)
                      .filter(([, rId]) => rId === rider.id)
                      .map(([orderId]) => (
                        <div key={orderId} className="mt-2 px-2 py-1 rounded bg-primary/10 text-[10px] text-primary font-medium">
                          ✓ Asignado: {orderId}
                        </div>
                      ))}
                  </div>
                );
              })}
          </div>
        </ScrollArea>
      </Card>
    </div>
  );
}
