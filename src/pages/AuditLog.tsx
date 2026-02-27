import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { auditLogs } from "@/data/mock-data";
import { Search, FileText, Package, Building2, Bike, DollarSign, Settings } from "lucide-react";

const categoryConfig = {
  order: { label: "Pedido", icon: Package, className: "bg-primary/10 text-primary" },
  client: { label: "Cliente", icon: Building2, className: "bg-accent/10 text-accent" },
  rider: { label: "Repartidor", icon: Bike, className: "bg-warning/10 text-warning" },
  finance: { label: "Finanzas", icon: DollarSign, className: "bg-success/10 text-success" },
  system: { label: "Sistema", icon: Settings, className: "bg-muted text-muted-foreground" },
};

export default function AuditLog() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  const filtered = auditLogs.filter((log) => {
    const matchSearch =
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.entityId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.user.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategory = categoryFilter === "all" || log.category === categoryFilter;
    return matchSearch && matchCategory;
  });

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-bold text-foreground">📋 Logs de Auditoría</h2>
        <p className="text-sm text-muted-foreground">Historial detallado de cambios en el sistema</p>
      </div>

      <div className="flex gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Buscar por acción, usuario o ID..." className="pl-8" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-44">
            <SelectValue placeholder="Categoría" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas</SelectItem>
            <SelectItem value="order">Pedidos</SelectItem>
            <SelectItem value="client">Clientes</SelectItem>
            <SelectItem value="rider">Repartidores</SelectItem>
            <SelectItem value="finance">Finanzas</SelectItem>
            <SelectItem value="system">Sistema</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardHeader className="py-3 px-4 border-b">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-semibold">Registro de Actividades</CardTitle>
            <Badge variant="secondary" className="text-xs">{filtered.length} registros</Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[160px]">Fecha / Hora</TableHead>
                <TableHead>Usuario</TableHead>
                <TableHead>Acción</TableHead>
                <TableHead>Categoría</TableHead>
                <TableHead>Entidad</TableHead>
                <TableHead>Detalles</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((log) => {
                const config = categoryConfig[log.category];
                return (
                  <TableRow key={log.id}>
                    <TableCell className="font-mono text-xs text-muted-foreground">{log.timestamp}</TableCell>
                    <TableCell className="text-sm">{log.user}</TableCell>
                    <TableCell className="text-sm font-medium">{log.action}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className={`text-[10px] gap-1 ${config.className}`}>
                        <config.icon className="h-3 w-3" />
                        {config.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-mono text-xs">{log.entityId}</TableCell>
                    <TableCell className="text-xs text-muted-foreground max-w-[280px] truncate">{log.details}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
