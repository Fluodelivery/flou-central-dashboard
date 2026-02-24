import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { riderCashouts, clientBalances } from "@/data/mock-data";
import { DollarSign, TrendingUp, CheckCircle, AlertCircle } from "lucide-react";

export default function Finance() {
  const totalCash = riderCashouts.reduce((sum, r) => sum + r.cashAmount, 0);
  const totalOwed = riderCashouts.filter((r) => r.status === "pending").reduce((sum, r) => sum + r.owedToCompany, 0);
  const totalBilled = clientBalances.reduce((sum, c) => sum + c.totalAmount, 0);
  const totalPending = clientBalances.reduce((sum, c) => sum + c.balance, 0);

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-bold text-foreground">💵 Finanzas y Liquidaciones</h2>
        <p className="text-sm text-muted-foreground">Control de efectivo y cobranza B2B</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: "Efectivo del día", value: `$${totalCash.toLocaleString()}`, icon: DollarSign, desc: "Cobrado por repartidores" },
          { label: "Por liquidar", value: `$${totalOwed.toLocaleString()}`, icon: AlertCircle, desc: "Pendiente de entrega" },
          { label: "Facturación mensual", value: `$${totalBilled.toLocaleString()}`, icon: TrendingUp, desc: "Total Feb 2026" },
          { label: "Cobranza pendiente", value: `$${totalPending.toLocaleString()}`, icon: AlertCircle, desc: "Por cobrar a clientes" },
        ].map((kpi) => (
          <Card key={kpi.label}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-muted-foreground">{kpi.label}</span>
                <kpi.icon className="h-4 w-4 text-muted-foreground" />
              </div>
              <p className="text-xl font-bold text-foreground">{kpi.value}</p>
              <p className="text-[10px] text-muted-foreground mt-1">{kpi.desc}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="cashouts">
        <TabsList>
          <TabsTrigger value="cashouts">Cortes de Caja</TabsTrigger>
          <TabsTrigger value="billing">Saldos de Locales</TabsTrigger>
        </TabsList>

        <TabsContent value="cashouts">
          <Card>
            <CardHeader className="py-3 px-4 border-b">
              <CardTitle className="text-sm font-semibold">Liquidación de Repartidores — Hoy</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Repartidor</TableHead>
                    <TableHead>Turno</TableHead>
                    <TableHead className="text-center">Entregas</TableHead>
                    <TableHead className="text-center">En efectivo</TableHead>
                    <TableHead className="text-right">Monto efectivo</TableHead>
                    <TableHead className="text-right">Debe a empresa</TableHead>
                    <TableHead>Estado</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {riderCashouts.map((r) => (
                    <TableRow key={r.riderId}>
                      <TableCell className="text-sm font-medium">{r.riderName}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{r.shift}</TableCell>
                      <TableCell className="text-center text-sm">{r.totalDeliveries}</TableCell>
                      <TableCell className="text-center text-sm">{r.cashOrders}</TableCell>
                      <TableCell className="text-right text-sm">${r.cashAmount}</TableCell>
                      <TableCell className="text-right text-sm font-medium">${r.owedToCompany}</TableCell>
                      <TableCell>
                        {r.status === "settled" ? (
                          <Badge className="text-[10px] bg-success text-success-foreground gap-1">
                            <CheckCircle className="h-3 w-3" /> Liquidado
                          </Badge>
                        ) : (
                          <Badge className="text-[10px] bg-warning text-warning-foreground">Pendiente</Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="billing">
          <Card>
            <CardHeader className="py-3 px-4 border-b">
              <CardTitle className="text-sm font-semibold">Cobranza a Clientes B2B — Febrero 2026</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Período</TableHead>
                    <TableHead className="text-center">Pedidos</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                    <TableHead className="text-right">Pagado</TableHead>
                    <TableHead className="text-right">Saldo</TableHead>
                    <TableHead>Vencimiento</TableHead>
                    <TableHead>Estado</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {clientBalances.map((c) => (
                    <TableRow key={c.clientId}>
                      <TableCell className="text-sm font-medium">{c.clientName}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{c.period}</TableCell>
                      <TableCell className="text-center text-sm">{c.totalOrders}</TableCell>
                      <TableCell className="text-right text-sm">${c.totalAmount.toLocaleString()}</TableCell>
                      <TableCell className="text-right text-sm">${c.paid.toLocaleString()}</TableCell>
                      <TableCell className="text-right text-sm font-medium">
                        {c.balance > 0 ? `$${c.balance.toLocaleString()}` : "-"}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(c.dueDate).toLocaleDateString("es-MX", { day: "numeric", month: "short" })}
                      </TableCell>
                      <TableCell>
                        {c.status === "paid" ? (
                          <Badge className="text-[10px] bg-success text-success-foreground">Pagado</Badge>
                        ) : c.status === "partial" ? (
                          <Badge className="text-[10px] bg-warning text-warning-foreground">Parcial</Badge>
                        ) : (
                          <Badge className="text-[10px] bg-destructive text-destructive-foreground">Pendiente</Badge>
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
