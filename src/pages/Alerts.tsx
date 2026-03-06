import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertTriangle, Phone, MapPin, CheckCircle, Clock, Shield, StopCircle, Timer, Loader2 } from "lucide-react";
import AlertMiniMap from "@/components/alerts/AlertMiniMap";
import { useAlerts, type AlertRow } from "@/hooks/useAlerts";
import { supabase } from "@/integrations/supabase/client";

export default function Alerts() {
  const { alerts: alertList, loading, timeAgo } = useAlerts();
  const [selectedAlert, setSelectedAlert] = useState<AlertRow | null>(null);

  // Auto-select first unresolved alert
  useEffect(() => {
    if (!selectedAlert && alertList.length > 0) {
      setSelectedAlert(alertList.find((a) => !a.resolved) || alertList[0]);
    }
  }, [alertList, selectedAlert]);

  // Keep selectedAlert in sync with realtime updates
  useEffect(() => {
    if (selectedAlert) {
      const updated = alertList.find((a) => a.id === selectedAlert.id);
      if (updated && updated !== selectedAlert) {
        setSelectedAlert(updated);
      }
    }
  }, [alertList, selectedAlert]);

  const resolveAlert = async (id: string) => {
    await supabase.from("alerts").update({ resolved: true }).eq("id", id);
  };

  const typeConfig = {
    sos: { label: "SOS", color: "bg-destructive text-destructive-foreground", icon: Shield },
    exception: { label: "Excepción", color: "bg-warning text-warning-foreground", icon: AlertTriangle },
    delay: { label: "Retraso", color: "bg-muted text-muted-foreground", icon: Clock },
    stalled_order: { label: "Estancado", color: "bg-destructive text-destructive-foreground", icon: Timer },
    idle_rider: { label: "Detenido", color: "bg-warning text-warning-foreground", icon: StopCircle },
  };

  const unresolvedCount = alertList.filter((a) => !a.resolved).length;

  const sortedAlerts = [...alertList].sort((a, b) => {
    if (a.resolved !== b.resolved) return a.resolved ? 1 : -1;
    const priority: Record<string, number> = { sos: 0, stalled_order: 1, idle_rider: 2, exception: 3, delay: 4 };
    return (priority[a.type] ?? 5) - (priority[b.type] ?? 5);
  });

  if (loading) {
    return (
      <div className="h-[calc(100vh-7rem)] flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-7rem)] grid grid-cols-[360px_1fr] gap-3">
      {/* LEFT: Alert Queue */}
      <Card className="flex flex-col overflow-hidden">
        <CardHeader className="py-3 px-4 border-b">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-semibold">🚨 Cola de Alertas</CardTitle>
            <Badge variant="destructive" className="text-xs">{unresolvedCount} activas</Badge>
          </div>
        </CardHeader>
        <ScrollArea className="flex-1">
          <div className="p-2 space-y-2">
            {sortedAlerts.map((alert) => {
                const config = typeConfig[alert.type as keyof typeof typeConfig];
                if (!config) return null;
                return (
                  <div
                    key={alert.id}
                    onClick={() => setSelectedAlert(alert)}
                    className={`p-3 rounded-lg border cursor-pointer transition-all ${
                      selectedAlert?.id === alert.id
                        ? "border-primary bg-primary/5"
                        : alert.resolved
                        ? "border-border bg-muted/30 opacity-60"
                        : alert.type === "sos" || alert.type === "stalled_order"
                        ? "border-destructive/50 bg-destructive/5"
                        : alert.type === "idle_rider"
                        ? "border-warning/50 bg-warning/5"
                        : "border-border bg-card"
                    } hover:border-primary/50`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <Badge className={`text-[10px] ${config.color}`}>
                        <config.icon className="h-3 w-3 mr-1" />
                        {config.label}
                      </Badge>
                      <div className="flex items-center gap-1.5">
                        {alert.resolved && <CheckCircle className="h-3.5 w-3.5 text-success" />}
                        <span className="text-[10px] text-muted-foreground">{timeAgo(alert.created_at)}</span>
                      </div>
                    </div>
                    <p className="text-xs font-medium text-foreground mb-1">{alert.rider_name}</p>
                    <p className="text-[11px] text-muted-foreground line-clamp-2">{alert.message}</p>
                    <div className="mt-2 flex items-center gap-1 text-[10px] text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      {alert.location}
                    </div>
                  </div>
                );
              })}
          </div>
        </ScrollArea>
      </Card>

      {/* RIGHT: Alert Detail */}
      <Card className="flex flex-col overflow-hidden">
        {selectedAlert ? (
          <>
            <CardHeader className="py-3 px-4 border-b">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold">Detalle de Alerta — {selectedAlert.id}</CardTitle>
                {selectedAlert.resolved ? (
                  <Badge variant="outline" className="text-xs text-success border-success">Resuelta</Badge>
                ) : (
                  <Badge variant="destructive" className="text-xs">Activa</Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="p-4 flex-1">
              <div className="space-y-6">
                <div className={`p-4 rounded-lg border ${
                  selectedAlert.type === "sos" || selectedAlert.type === "stalled_order" ? "border-destructive/30 bg-destructive/5" :
                  selectedAlert.type === "idle_rider" ? "border-warning/30 bg-warning/5" :
                  "border-warning/30 bg-warning/5"
                }`}>
                  <p className="text-sm text-foreground">{selectedAlert.message}</p>
                  <p className="text-xs text-muted-foreground mt-2">{timeAgo(selectedAlert.created_at)} · Pedido {selectedAlert.order_id}</p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-lg border border-border">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Repartidor</p>
                    <p className="text-sm font-medium text-foreground">{selectedAlert.rider_name}</p>
                    <p className="text-xs text-muted-foreground">{selectedAlert.rider_phone || "N/A"}</p>
                  </div>
                  <div className="p-3 rounded-lg border border-border">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Cliente / Local</p>
                    <p className="text-sm font-medium text-foreground">Local destino</p>
                    <p className="text-xs text-muted-foreground">{selectedAlert.client_phone || "N/A"}</p>
                  </div>
                </div>

                <div className="p-4 rounded-lg border border-border bg-muted/30">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="h-4 w-4 text-primary" />
                    <p className="text-sm font-medium text-foreground">{selectedAlert.location}</p>
                  </div>
                  <AlertMiniMap riderId={selectedAlert.rider_id} />
                </div>

                {!selectedAlert.resolved && (
                  <div className="flex gap-2">
                    {selectedAlert.rider_phone && (
                      <Button size="sm" variant="outline" className="flex-1 gap-1.5">
                        <Phone className="h-3.5 w-3.5" />
                        Llamar a repartidor
                      </Button>
                    )}
                    {selectedAlert.client_phone && (
                      <Button size="sm" variant="outline" className="flex-1 gap-1.5">
                        <Phone className="h-3.5 w-3.5" />
                        Notificar al cliente
                      </Button>
                    )}
                    <Button
                      size="sm"
                      className="flex-1 gap-1.5"
                      onClick={() => resolveAlert(selectedAlert.id)}
                    >
                      <CheckCircle className="h-3.5 w-3.5" />
                      Marcar resuelto
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <AlertTriangle className="h-10 w-10 mx-auto mb-2 opacity-30" />
              <p className="text-sm">Selecciona una alerta para ver su detalle</p>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
