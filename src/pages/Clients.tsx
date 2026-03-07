import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useClients, useClientDocuments } from "@/hooks/useClients";
import { Plus, Building2, Mail, Phone, MapPin, Camera, Image, Upload, Trash2, User, FileText, X } from "lucide-react";
import L from "leaflet";

// ===== Mini map component for client location =====
function ClientLocationMap({ lat, lng }: { lat: number; lng: number }) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;
    if (mapInstance.current) {
      mapInstance.current.remove();
    }
    const map = L.map(mapRef.current, { zoomControl: false, attributionControl: false }).setView([lat, lng], 16);
    L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png").addTo(map);
    L.marker([lat, lng], {
      icon: L.divIcon({
        className: "custom-pin",
        html: `<div style="background:#22c55e;width:18px;height:18px;border-radius:50%;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,.4)"></div>`,
        iconSize: [18, 18],
        iconAnchor: [9, 9],
      }),
    }).addTo(map);
    mapInstance.current = map;
    return () => { map.remove(); };
  }, [lat, lng]);

  return <div ref={mapRef} className="w-full h-48 rounded-lg overflow-hidden border border-border" />;
}

// ===== Document upload section =====
function DocUploadSection({
  label, docType, clientId, documents, onUpload, onDelete
}: {
  label: string;
  docType: string;
  clientId: string;
  documents: { id: string; file_url: string; file_name: string; doc_type: string }[];
  onUpload: (clientId: string, docType: string, file: File) => void;
  onDelete: (doc: any) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const filtered = documents.filter(d => d.doc_type === docType);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label className="text-xs font-medium text-muted-foreground">{label}</Label>
        <Button variant="ghost" size="sm" className="h-7 text-xs gap-1" onClick={() => inputRef.current?.click()}>
          <Upload className="h-3 w-3" /> Subir
        </Button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) onUpload(clientId, docType, file);
            e.target.value = "";
          }}
        />
      </div>
      {filtered.length === 0 ? (
        <div className="flex items-center justify-center h-20 rounded-lg border border-dashed border-border bg-muted/30">
          <p className="text-[10px] text-muted-foreground">Sin archivos</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-2">
          {filtered.map((doc) => (
            <div key={doc.id} className="relative group rounded-lg overflow-hidden border border-border">
              <img src={doc.file_url} alt={doc.file_name} className="w-full h-24 object-cover" />
              <button
                onClick={() => onDelete(doc)}
                className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Clients() {
  const { clients, loading, refetch } = useClients();
  const [open, setOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<string | null>(null);
  const { documents, uploadDocument, deleteDocument } = useClientDocuments(selectedClient);

  const selected = clients.find(c => c.id === selectedClient);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-foreground">🏢 Clientes Corporativos</h2>
          <p className="text-sm text-muted-foreground">CRM de negocios afiliados</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-1.5">
              <Plus className="h-4 w-4" />
              Nuevo Cliente
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Alta de Nuevo Cliente B2B</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-2">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs">Nombre de empresa</Label>
                  <Input placeholder="Ej. Cafetería Don Justo" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Contacto principal</Label>
                  <Input placeholder="Nombre completo" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs">Teléfono</Label>
                  <Input placeholder="228-000-0000" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Email</Label>
                  <Input type="email" placeholder="correo@empresa.mx" />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Dirección</Label>
                <Input placeholder="Calle, número, colonia, ciudad" />
              </div>
              <Button className="w-full" onClick={() => setOpen(false)}>
                Registrar Cliente
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader className="py-3 px-4 border-b">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-semibold">Negocios Afiliados</CardTitle>
            <Badge variant="secondary" className="text-xs">{clients.length} clientes</Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center py-12 text-sm text-muted-foreground">Cargando...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Empresa</TableHead>
                  <TableHead>Contacto</TableHead>
                  <TableHead>Teléfono</TableHead>
                  <TableHead className="text-center">Vol. Mensual</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Desde</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clients.map((c) => (
                  <TableRow key={c.id} className="cursor-pointer" onClick={() => setSelectedClient(c.id)}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center">
                          <Building2 className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">{c.name}</p>
                          <p className="text-[10px] text-muted-foreground">{c.id}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm">
                        <Mail className="h-3 w-3 text-muted-foreground" />
                        {c.contact_name}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm">
                        <Phone className="h-3 w-3 text-muted-foreground" />
                        {c.contact_phone}
                      </div>
                    </TableCell>
                    <TableCell className="text-center text-sm font-medium">{c.monthly_volume}</TableCell>
                    <TableCell>
                      {c.status === "active" ? (
                        <Badge className="text-[10px] bg-success text-success-foreground">Activo</Badge>
                      ) : c.status === "pending" ? (
                        <Badge className="text-[10px] bg-warning text-warning-foreground">Pendiente</Badge>
                      ) : (
                        <Badge variant="outline" className="text-[10px]">Suspendido</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(c.since).toLocaleDateString("es-MX", { month: "short", year: "numeric" })}
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" className="text-xs" onClick={(e) => { e.stopPropagation(); setSelectedClient(c.id); }}>
                        Ver detalle
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* ===== Detail Panel ===== */}
      <Dialog open={!!selectedClient} onOpenChange={(v) => { if (!v) setSelectedClient(null); }}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  {selected.name}
                </DialogTitle>
              </DialogHeader>

              <Tabs defaultValue="info" className="mt-2">
                <TabsList className="w-full grid grid-cols-3">
                  <TabsTrigger value="info" className="text-xs gap-1"><User className="h-3 w-3" /> Datos</TabsTrigger>
                  <TabsTrigger value="location" className="text-xs gap-1"><MapPin className="h-3 w-3" /> Ubicación</TabsTrigger>
                  <TabsTrigger value="media" className="text-xs gap-1"><Image className="h-3 w-3" /> Media</TabsTrigger>
                </TabsList>

                {/* TAB: Datos */}
                <TabsContent value="info" className="space-y-4 mt-4">
                  <Card>
                    <CardHeader className="py-2 px-4">
                      <CardTitle className="text-xs text-muted-foreground">Persona a Cargo</CardTitle>
                    </CardHeader>
                    <CardContent className="px-4 pb-3 space-y-2">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <Label className="text-[10px] text-muted-foreground">Nombre</Label>
                          <p className="text-sm font-medium">{selected.contact_name}</p>
                        </div>
                        <div className="space-y-1">
                          <Label className="text-[10px] text-muted-foreground">Email</Label>
                          <p className="text-sm">{selected.contact_email}</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <Label className="text-[10px] text-muted-foreground">Teléfono</Label>
                          <p className="text-sm">{selected.contact_phone}</p>
                        </div>
                        <div className="space-y-1">
                          <Label className="text-[10px] text-muted-foreground">Volumen Mensual</Label>
                          <p className="text-sm font-medium">{selected.monthly_volume} envíos</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="py-2 px-4">
                      <CardTitle className="text-xs text-muted-foreground">Datos del Negocio</CardTitle>
                    </CardHeader>
                    <CardContent className="px-4 pb-3 space-y-2">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <Label className="text-[10px] text-muted-foreground">ID</Label>
                          <p className="text-sm font-mono">{selected.id}</p>
                        </div>
                        <div className="space-y-1">
                          <Label className="text-[10px] text-muted-foreground">Estado</Label>
                          {selected.status === "active" ? (
                            <Badge className="text-[10px] bg-success text-success-foreground">Activo</Badge>
                          ) : selected.status === "pending" ? (
                            <Badge className="text-[10px] bg-warning text-warning-foreground">Pendiente</Badge>
                          ) : (
                            <Badge variant="outline" className="text-[10px]">Suspendido</Badge>
                          )}
                        </div>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-[10px] text-muted-foreground">Afiliado desde</Label>
                        <p className="text-sm">{new Date(selected.since).toLocaleDateString("es-MX", { day: "numeric", month: "long", year: "numeric" })}</p>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-[10px] text-muted-foreground">Dirección</Label>
                        <p className="text-sm">{selected.address || "Sin dirección registrada"}</p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* TAB: Ubicación */}
                <TabsContent value="location" className="space-y-4 mt-4">
                  <Card>
                    <CardHeader className="py-2 px-4">
                      <CardTitle className="text-xs text-muted-foreground">Pin en Mapa</CardTitle>
                    </CardHeader>
                    <CardContent className="px-4 pb-3">
                      <ClientLocationMap lat={selected.lat} lng={selected.lng} />
                      <p className="text-[10px] text-muted-foreground mt-2 flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {selected.address} — ({selected.lat.toFixed(4)}, {selected.lng.toFixed(4)})
                      </p>
                    </CardContent>
                  </Card>

                  <DocUploadSection
                    label="📸 Fotos de Fachada"
                    docType="facade"
                    clientId={selected.id}
                    documents={documents}
                    onUpload={uploadDocument}
                    onDelete={deleteDocument}
                  />
                </TabsContent>

                {/* TAB: Media */}
                <TabsContent value="media" className="space-y-4 mt-4">
                  <DocUploadSection
                    label="🏷️ Logo del Negocio"
                    docType="logo"
                    clientId={selected.id}
                    documents={documents}
                    onUpload={uploadDocument}
                    onDelete={deleteDocument}
                  />
                  <DocUploadSection
                    label="🎨 Material Publicitario (Banners)"
                    docType="promo"
                    clientId={selected.id}
                    documents={documents}
                    onUpload={uploadDocument}
                    onDelete={deleteDocument}
                  />
                </TabsContent>
              </Tabs>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
