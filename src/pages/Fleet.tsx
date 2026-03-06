import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { vehicles } from "@/data/mock-data";
import { useRiders, useRiderDocuments, type RiderRow } from "@/hooks/useRiders";
import {
  UserCheck, UserX, Pause, Star, Wrench, Calendar,
  Eye, Upload, FileText, Trash2, Mail, Phone, Car, CreditCard, Loader2
} from "lucide-react";
import { toast } from "sonner";

const DOC_TYPES = [
  { key: "ine_front", label: "INE (Frente)" },
  { key: "ine_back", label: "INE (Reverso)" },
  { key: "license_front", label: "Licencia (Frente)" },
  { key: "license_back", label: "Licencia (Reverso)" },
  { key: "circulation_card", label: "Tarjeta de Circulación" },
];

export default function Fleet() {
  const { riders: riderList, loading, updateRider } = useRiders();
  const [selectedRider, setSelectedRider] = useState<RiderRow | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const statusBadge = (status: string) => {
    const map: Record<string, { label: string; variant: "default" | "secondary" | "outline"; className: string }> = {
      available: { label: "Disponible", variant: "default", className: "bg-success text-success-foreground" },
      on_route: { label: "En ruta", variant: "default", className: "bg-warning text-warning-foreground" },
      paused: { label: "Pausa", variant: "secondary", className: "" },
      offline: { label: "Desconectado", variant: "outline", className: "" },
    };
    const config = map[status] || map.offline;
    return <Badge variant={config.variant} className={`text-[10px] ${config.className}`}>{config.label}</Badge>;
  };

  const suspendRider = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === "paused" ? "available" : "paused";
    const ok = await updateRider(id, { status: newStatus });
    if (ok) toast.success(newStatus === "paused" ? "Repartidor suspendido" : "Repartidor activado");
  };

  const openDetail = (rider: RiderRow) => {
    setSelectedRider(rider);
    setDetailOpen(true);
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
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : (
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
                      <TableRow key={rider.id} className="cursor-pointer hover:bg-muted/50" onClick={() => openDetail(rider)}>
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
                        <TableCell className="text-sm text-muted-foreground">{rider.vehicle_plates}</TableCell>
                        <TableCell className="text-center">
                          <div className="flex items-center justify-center gap-1">
                            <Star className="h-3 w-3 text-warning fill-warning" />
                            <span className="text-sm">{rider.rating}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                          <div className="flex justify-end gap-1">
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-7 text-xs gap-1"
                              onClick={() => openDetail(rider)}
                            >
                              <Eye className="h-3 w-3" /> Ver
                            </Button>
                            <Button
                              size="sm"
                              variant={rider.status === "paused" ? "default" : "outline"}
                              className="h-7 text-xs gap-1"
                              onClick={() => suspendRider(rider.id, rider.status)}
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
              )}
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

      {/* Rider Detail Dialog */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          {selectedRider && (
            <RiderDetailPanel
              rider={selectedRider}
              statusBadge={statusBadge}
              onSuspend={() => suspendRider(selectedRider.id, selectedRider.status)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function RiderDetailPanel({
  rider,
  statusBadge,
  onSuspend,
}: {
  rider: RiderRow;
  statusBadge: (status: string) => JSX.Element;
  onSuspend: () => void;
}) {
  const { documents, loading: docsLoading, uploadDocument, deleteDocument } = useRiderDocuments(rider.id);
  const [uploading, setUploading] = useState<string | null>(null);
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const handleFileChange = async (docType: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(docType);
    const ok = await uploadDocument(rider.id, docType, file);
    if (ok) toast.success("Documento cargado");
    else toast.error("Error al cargar documento");
    setUploading(null);
    if (fileInputRefs.current[docType]) fileInputRefs.current[docType]!.value = "";
  };

  const handleDelete = async (docId: string) => {
    const ok = await deleteDocument(docId);
    if (ok) toast.success("Documento eliminado");
  };

  const getDocForType = (docType: string) => documents.find((d) => d.doc_type === docType);

  return (
    <>
      <DialogHeader>
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
            <span className="text-lg font-bold">{rider.avatar}</span>
          </div>
          <div>
            <DialogTitle className="text-base">{rider.name}</DialogTitle>
            <p className="text-xs text-muted-foreground">{rider.id}</p>
          </div>
          <div className="ml-auto flex items-center gap-2">
            {statusBadge(rider.status)}
            <div className="flex items-center gap-1">
              <Star className="h-3.5 w-3.5 text-warning fill-warning" />
              <span className="text-sm font-medium">{rider.rating}</span>
            </div>
          </div>
        </div>
      </DialogHeader>

      {/* Datos personales */}
      <div className="space-y-4 mt-2">
        <div>
          <h4 className="text-sm font-semibold text-foreground mb-2">Datos del Repartidor</h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="flex items-center gap-2 rounded-md border p-2.5">
              <UserCheck className="h-4 w-4 text-muted-foreground shrink-0" />
              <div>
                <p className="text-[10px] text-muted-foreground">Nombre</p>
                <p className="text-sm font-medium">{rider.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 rounded-md border p-2.5">
              <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
              <div>
                <p className="text-[10px] text-muted-foreground">Correo electrónico</p>
                <p className="text-sm font-medium truncate">{rider.email || "—"}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 rounded-md border p-2.5">
              <Phone className="h-4 w-4 text-muted-foreground shrink-0" />
              <div>
                <p className="text-[10px] text-muted-foreground">Teléfono</p>
                <p className="text-sm font-medium">{rider.phone}</p>
              </div>
            </div>
          </div>
        </div>

        <Separator />

        {/* Datos del vehículo */}
        <div>
          <h4 className="text-sm font-semibold text-foreground mb-2">Datos del Vehículo</h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="flex items-center gap-2 rounded-md border p-2.5">
              <Car className="h-4 w-4 text-muted-foreground shrink-0" />
              <div>
                <p className="text-[10px] text-muted-foreground">Modelo</p>
                <p className="text-sm font-medium">{rider.vehicle_model}</p>
              </div>
            </div>
            <div className="rounded-md border p-2.5">
              <p className="text-[10px] text-muted-foreground">Placas</p>
              <p className="text-sm font-mono font-medium">{rider.vehicle_plates}</p>
            </div>
            <div className="rounded-md border p-2.5">
              <p className="text-[10px] text-muted-foreground">Año</p>
              <p className="text-sm font-medium">{rider.vehicle_year}</p>
            </div>
            <div className="flex items-center gap-2 rounded-md border p-2.5">
              <CreditCard className="h-4 w-4 text-muted-foreground shrink-0" />
              <div>
                <p className="text-[10px] text-muted-foreground">Tarjeta Circ.</p>
                <p className="text-sm font-mono font-medium">{rider.circulation_card}</p>
              </div>
            </div>
          </div>
        </div>

        <Separator />

        {/* Documentos */}
        <div>
          <h4 className="text-sm font-semibold text-foreground mb-2">Documentos</h4>
          {docsLoading ? (
            <div className="flex items-center justify-center py-6">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {DOC_TYPES.map(({ key, label }) => {
                const doc = getDocForType(key);
                return (
                  <div
                    key={key}
                    className="flex items-center justify-between rounded-md border p-2.5 gap-2"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs font-medium">{label}</p>
                        {doc ? (
                          <p className="text-[10px] text-success truncate">{doc.file_name}</p>
                        ) : (
                          <p className="text-[10px] text-muted-foreground">Sin cargar</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      {doc ? (
                        <>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 w-7 p-0"
                            onClick={() => window.open(doc.file_url, "_blank")}
                          >
                            <Eye className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 w-7 p-0 text-destructive"
                            onClick={() => handleDelete(doc.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </>
                      ) : (
                        <>
                          <input
                            type="file"
                            accept="image/*,.pdf"
                            className="hidden"
                            ref={(el) => { fileInputRefs.current[key] = el; }}
                            onChange={(e) => handleFileChange(key, e)}
                          />
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7 text-xs gap-1"
                            disabled={uploading === key}
                            onClick={() => fileInputRefs.current[key]?.click()}
                          >
                            {uploading === key ? (
                              <Loader2 className="h-3 w-3 animate-spin" />
                            ) : (
                              <><Upload className="h-3 w-3" /> Cargar</>
                            )}
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <Separator />

        {/* Acciones */}
        <div className="flex gap-2 justify-end">
          <Button
            size="sm"
            variant={rider.status === "paused" ? "default" : "outline"}
            className="gap-1"
            onClick={onSuspend}
          >
            {rider.status === "paused" ? (
              <><UserCheck className="h-3.5 w-3.5" /> Activar</>
            ) : (
              <><Pause className="h-3.5 w-3.5" /> Suspender</>
            )}
          </Button>
          <Button size="sm" variant="destructive" className="gap-1">
            <UserX className="h-3.5 w-3.5" /> Dar de Baja
          </Button>
        </div>
      </div>
    </>
  );
}
