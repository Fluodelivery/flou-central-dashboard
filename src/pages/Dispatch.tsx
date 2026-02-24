import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MapPin, Clock, GripVertical, User, Navigation, Package } from "lucide-react";
import { pendingOrders, riders, type PendingOrder } from "@/data/mock-data";

export default function Dispatch() {
  const [orders, setOrders] = useState(pendingOrders);
  const [draggedOrder, setDraggedOrder] = useState<PendingOrder | null>(null);
  const [assignedOrders, setAssignedOrders] = useState<Record<string, string>>({});

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
        <ScrollArea className="flex-1">
          <div className="p-2 space-y-2">
            {orders.map((order) => (
              <div
                key={order.id}
                draggable
                onDragStart={() => handleDragStart(order)}
                className="p-3 rounded-lg border border-border bg-card hover:border-primary/50 cursor-grab active:cursor-grabbing transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono font-semibold text-foreground">{order.id}</span>
                  <div className="flex items-center gap-1">
                    {order.priority === "urgent" && (
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
            ))}
            {orders.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                <Package className="h-8 w-8 mb-2 opacity-40" />
                <p className="text-xs">Sin pedidos pendientes</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </Card>

      {/* CENTER: Map placeholder */}
      <Card className="flex flex-col overflow-hidden">
        <CardHeader className="py-3 px-4 border-b">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-semibold">📡 Mapa en Tiempo Real</CardTitle>
            <Badge variant="outline" className="text-xs gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse-dot" />
              En vivo
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="flex-1 flex items-center justify-center p-0 relative">
          <div className="absolute inset-0 bg-muted/30 flex flex-col items-center justify-center">
            <div className="relative mb-4">
              <div className="h-32 w-32 rounded-full border-2 border-dashed border-primary/30 flex items-center justify-center">
                <div className="h-20 w-20 rounded-full border border-primary/20 flex items-center justify-center">
                  <Navigation className="h-8 w-8 text-primary/60" />
                </div>
              </div>
              {/* Simulated rider dots */}
              <div className="absolute top-2 right-4 h-3 w-3 rounded-full bg-success animate-pulse-dot" />
              <div className="absolute bottom-6 left-2 h-3 w-3 rounded-full bg-warning animate-pulse-dot" />
              <div className="absolute top-12 left-0 h-3 w-3 rounded-full bg-primary animate-pulse-dot" />
            </div>
            <p className="text-sm font-medium text-muted-foreground">Xalapa, Veracruz</p>
            <p className="text-xs text-muted-foreground/70 mt-1">Integración con Traccar pendiente</p>
            <Button variant="outline" size="sm" className="mt-3 text-xs">
              Conectar Mapa
            </Button>
          </div>
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
              .map((rider) => (
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
                  className="p-3 rounded-lg border border-border bg-card hover:bg-muted/50 transition-all"
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
                  {/* Show recently assigned */}
                  {Object.entries(assignedOrders)
                    .filter(([, rId]) => rId === rider.id)
                    .map(([orderId]) => (
                      <div key={orderId} className="mt-2 px-2 py-1 rounded bg-primary/10 text-[10px] text-primary font-medium">
                        ✓ Asignado: {orderId}
                      </div>
                    ))}
                </div>
              ))}
          </div>
        </ScrollArea>
      </Card>
    </div>
  );
}
