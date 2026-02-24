import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { historicalOrders, type HistoricalOrder } from "@/data/mock-data";
import { Search, Image, KeyRound, MapPin, Clock } from "lucide-react";

export default function Orders() {
  const [orders] = useState(historicalOrders);
  const [selectedOrder, setSelectedOrder] = useState<HistoricalOrder | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filtered = orders.filter((o) => {
    const matchSearch =
      o.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.rider.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === "all" || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const statusBadge = (status: HistoricalOrder["status"]) => {
    const map = {
      completed: { label: "Completado", className: "bg-success text-success-foreground" },
      cancelled: { label: "Cancelado", className: "bg-destructive text-destructive-foreground" },
      returned: { label: "Devuelto", className: "bg-warning text-warning-foreground" },
    };
    const c = map[status];
    return <Badge className={`text-[10px] ${c.className}`}>{c.label}</Badge>;
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-bold text-foreground">📦 Historial de Pedidos</h2>
        <p className="text-sm text-muted-foreground">Trazabilidad completa y auditoría</p>
      </div>

      {/* Filters */}
      <div className="flex gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Buscar por ID, cliente o repartidor..." className="pl-8" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="completed">Completados</SelectItem>
            <SelectItem value="cancelled">Cancelados</SelectItem>
            <SelectItem value="returned">Devueltos</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Repartidor</TableHead>
                <TableHead>Origen → Destino</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Pago</TableHead>
                <TableHead className="text-center">PoD</TableHead>
                <TableHead className="text-right">Monto</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((o) => (
                <TableRow key={o.id} className="cursor-pointer hover:bg-muted/50" onClick={() => setSelectedOrder(o)}>
                  <TableCell className="font-mono text-sm font-medium">{o.id}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{o.date}</TableCell>
                  <TableCell className="text-sm">{o.client}</TableCell>
                  <TableCell className="text-sm">{o.rider}</TableCell>
                  <TableCell>
                    <p className="text-xs text-muted-foreground truncate max-w-[200px]">{o.origin} → {o.destination}</p>
                  </TableCell>
                  <TableCell>{statusBadge(o.status)}</TableCell>
                  <TableCell className="text-xs text-muted-foreground capitalize">{o.paymentMethod === "cash" ? "Efectivo" : o.paymentMethod === "credit" ? "Crédito" : "Transferencia"}</TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-1">
                      {o.hasPhoto && <Image className="h-3.5 w-3.5 text-primary" />}
                      {o.hasPin && <KeyRound className="h-3.5 w-3.5 text-primary" />}
                    </div>
                  </TableCell>
                  <TableCell className="text-right text-sm font-medium">{o.amount > 0 ? `$${o.amount}` : "-"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Order Detail Dialog */}
      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Ficha del Pedido — {selectedOrder?.id}</DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between">
                {statusBadge(selectedOrder.status)}
                <span className="text-sm text-muted-foreground">{selectedOrder.date}</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-lg border border-border">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Cliente</p>
                  <p className="text-sm font-medium">{selectedOrder.client}</p>
                </div>
                <div className="p-3 rounded-lg border border-border">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Repartidor</p>
                  <p className="text-sm font-medium">{selectedOrder.rider}</p>
                </div>
              </div>

              <div className="p-3 rounded-lg border border-border space-y-2">
                <div className="flex items-start gap-2">
                  <div className="h-4 w-4 rounded-full border-2 border-success mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground">Recolección</p>
                    <p className="text-sm">{selectedOrder.origin}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" />{selectedOrder.pickupTime}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-destructive mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground">Entrega</p>
                    <p className="text-sm">{selectedOrder.destination}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" />{selectedOrder.deliveryTime}</p>
                  </div>
                </div>
              </div>

              {/* PoD */}
              <div className="p-3 rounded-lg border border-border">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-2">Prueba de Entrega (PoD)</p>
                <div className="flex gap-3">
                  {selectedOrder.hasPhoto && (
                    <div className="flex-1 h-24 rounded-md bg-muted flex items-center justify-center">
                      <div className="text-center">
                        <Image className="h-5 w-5 mx-auto text-muted-foreground mb-1" />
                        <p className="text-[10px] text-muted-foreground">Foto de evidencia</p>
                      </div>
                    </div>
                  )}
                  {selectedOrder.hasPin && (
                    <div className="flex-1 h-24 rounded-md bg-muted flex items-center justify-center">
                      <div className="text-center">
                        <KeyRound className="h-5 w-5 mx-auto text-muted-foreground mb-1" />
                        <p className="text-[10px] text-muted-foreground">PIN verificado ✓</p>
                      </div>
                    </div>
                  )}
                  {!selectedOrder.hasPhoto && !selectedOrder.hasPin && (
                    <p className="text-xs text-muted-foreground">Sin evidencia de entrega</p>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-muted">
                <span className="text-sm text-muted-foreground">Total cobrado</span>
                <span className="text-lg font-bold">{selectedOrder.amount > 0 ? `$${selectedOrder.amount}` : "N/A"}</span>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
