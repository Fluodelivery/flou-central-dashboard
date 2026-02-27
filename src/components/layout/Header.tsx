import { Bell, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { riders, alerts, pendingOrders } from "@/data/mock-data";

export function Header() {
  const activeRiders = riders.filter((r) => r.status !== "offline").length;
  const activeAlerts = alerts.filter((a) => !a.resolved).length;
  const stalledOrders = pendingOrders.filter((o) => o.minutesWaiting >= 10).length;

  return (
    <header className="h-14 border-b border-border bg-card flex items-center justify-between px-4 shrink-0">
      <div className="flex items-center gap-3">
        <SidebarTrigger>
          <Menu className="h-5 w-5" />
        </SidebarTrigger>

        <div className="hidden sm:flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-success animate-pulse-dot" />
            <span className="text-muted-foreground">
              <span className="font-semibold text-foreground">{activeRiders}</span> Repartidores Activos
            </span>
          </div>
          <div className="h-4 w-px bg-border" />
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-destructive animate-pulse-dot" />
            <span className="text-muted-foreground">
              <span className="font-semibold text-foreground">{activeAlerts}</span> Alertas SOS
            </span>
          </div>
          <div className="h-4 w-px bg-border" />
          <div className="flex items-center gap-1.5">
            <span className={`h-2 w-2 rounded-full ${stalledOrders > 0 ? "bg-destructive animate-pulse-dot" : "bg-warning"}`} />
            <span className="text-muted-foreground">
              <span className="font-semibold text-foreground">{pendingOrders.length}</span> Pendientes
              {stalledOrders > 0 && (
                <span className="text-destructive font-semibold ml-1">({stalledOrders} estancados)</span>
              )}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-4 w-4" />
          {activeAlerts > 0 && (
            <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-[10px] bg-destructive text-destructive-foreground">
              {activeAlerts}
            </Badge>
          )}
        </Button>
        <div className="text-xs text-muted-foreground">
          {new Date().toLocaleDateString("es-MX", { weekday: "short", day: "numeric", month: "short" })}
          {" · "}
          {new Date().toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" })}
        </div>
      </div>
    </header>
  );
}
