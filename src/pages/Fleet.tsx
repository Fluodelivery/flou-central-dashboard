import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { riders, vehicles, type Rider } from "@/data/mock-data";
import { UserCheck, UserX, Pause, Star, Wrench, Calendar } from "lucide-react";

export default function Fleet() {
  const [riderList, setRiderList] = useState(riders);

  const statusBadge = (status: Rider["status"]) => {
    const map = {
      available: { label: "Disponible", variant: "default" as const, className: "bg-success text-success-foreground" },
      on_route: { label: "En ruta", variant: "default" as const, className: "bg-warning text-warning-foreground" },
      paused: { label: "Pausa", variant: "secondary" as const, className: "" },
      offline: { label: "Desconectado", variant: "outline" as const, className: "" },
    };
    const config = map[status];
    return <Badge variant={config.variant} className={`text-[10px] ${config.className}`}>{config.label}</Badge>;
  };

  const suspendRider = (id: string) => {
    setRiderList((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: r.status === "paused" ? "available" : "paused" as Rider["status"] } : r))
    );
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-bold text-foreground">🛵 Gestión de Flota</h2>
        <p className="text-sm text-muted-foreground">Administra repartidores y vehículos</p>
      </div>

      <Tabs defaultValue="riders">
        <TabsList>
          <TabsTrigger value="riders">Repartidores</TabsTrigger>
          <TabsTrigger value="vehicles">Vehículos</TabsTrigger>
        </TabsList>

        <TabsContent value="riders">
          <Card>
            <CardHeader className="py-3 px-4 border-b">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold">Directorio de Personal</CardTitle>
                <Badge variant="secondary" className="text-xs">{riderList.length} registrados</Badge>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12"></TableHead>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Teléfono</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Vehículo</TableHead>
                    <TableHead className="text-center">Calificación</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {riderList.map((rider) => (
                    <TableRow key={rider.id}>
                      <TableCell>
                        <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                          <span className="text-xs font-semibold">{rider.avatar}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="text-sm font-medium">{rider.name}</p>
                          <p className="text-[10px] text-muted-foreground">{rider.id}</p>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">{rider.phone}</TableCell>
                      <TableCell>{statusBadge(rider.status)}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{rider.vehicleId}</TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Star className="h-3 w-3 text-warning fill-warning" />
                          <span className="text-sm">{rider.rating}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button
                            size="sm"
                            variant={rider.status === "paused" ? "default" : "outline"}
                            className="h-7 text-xs gap-1"
                            onClick={() => suspendRider(rider.id)}
                          >
                            {rider.status === "paused" ? (
                              <><UserCheck className="h-3 w-3" /> Activar</>
                            ) : (
                              <><Pause className="h-3 w-3" /> Suspender</>
                            )}
                          </Button>
                          <Button size="sm" variant="ghost" className="h-7 text-xs text-destructive gap-1">
                            <UserX className="h-3 w-3" /> Baja
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="vehicles">
          <Card>
            <CardHeader className="py-3 px-4 border-b">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold">Inventario de Vehículos</CardTitle>
                <Badge variant="secondary" className="text-xs">{vehicles.length} unidades</Badge>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Placas</TableHead>
                    <TableHead>Modelo</TableHead>
                    <TableHead>Año</TableHead>
                    <TableHead>Kilometraje</TableHead>
                    <TableHead>Próx. Mantenimiento</TableHead>
                    <TableHead>Estado</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {vehicles.map((v) => (
                    <TableRow key={v.id}>
                      <TableCell className="font-mono text-sm font-medium">{v.plates}</TableCell>
                      <TableCell className="text-sm">{v.model}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{v.year}</TableCell>
                      <TableCell className="text-sm">{v.km.toLocaleString()} km</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5 text-sm">
                          <Calendar className="h-3 w-3 text-muted-foreground" />
                          {new Date(v.nextMaintenance).toLocaleDateString("es-MX", { day: "numeric", month: "short", year: "numeric" })}
                        </div>
                      </TableCell>
                      <TableCell>
                        {v.status === "active" ? (
                          <Badge className="text-[10px] bg-success text-success-foreground">Activa</Badge>
                        ) : v.status === "maintenance" ? (
                          <Badge className="text-[10px] bg-warning text-warning-foreground gap-1">
                            <Wrench className="h-3 w-3" /> Mantenimiento
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-[10px]">Inactiva</Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
