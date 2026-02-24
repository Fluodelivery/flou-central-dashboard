import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { corporateClients } from "@/data/mock-data";
import { Plus, Building2, Mail, Phone } from "lucide-react";

export default function Clients() {
  const [clients] = useState(corporateClients);
  const [open, setOpen] = useState(false);

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
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs">Tarifa por envío ($)</Label>
                  <Input type="number" placeholder="45" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Contraseña de acceso</Label>
                  <Input type="password" placeholder="Credencial para fluo-delivery" />
                </div>
              </div>
              <Button className="w-full" onClick={() => setOpen(false)}>
                Registrar Cliente y Generar Credenciales
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
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Empresa</TableHead>
                <TableHead>Contacto</TableHead>
                <TableHead>Teléfono</TableHead>
                <TableHead className="text-center">Vol. Mensual</TableHead>
                <TableHead className="text-center">Tarifa</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Desde</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clients.map((c) => (
                <TableRow key={c.id}>
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
                      {c.contact}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm">
                      <Phone className="h-3 w-3 text-muted-foreground" />
                      {c.contactPhone}
                    </div>
                  </TableCell>
                  <TableCell className="text-center text-sm font-medium">{c.monthlyVolume}</TableCell>
                  <TableCell className="text-center text-sm">${c.rate}</TableCell>
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
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
