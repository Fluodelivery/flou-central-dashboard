import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { riderFinances, clientBalances } from "@/data/mock-data";
import { DollarSign, TrendingUp, CheckCircle, AlertCircle, Wallet, Receipt, Users, Bike, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

export default function Finance() {
  const [expandedRider, setExpandedRider] = useState<string | null>(null);
  const [expandedClient, setExpandedClient] = useState<string | null>(null);

  // KPI calculations
  const totalCash = riderFinances.reduce((s, r) => s + r.cashAmount, 0);
  const totalOwed = riderFinances.filter(r => r.cashoutStatus === "pending").reduce((s, r) => s + r.owedToCompany, 0);
  const totalCommissions = riderFinances.reduce((s, r) => s + r.commissionAmount, 0);
  const totalIvaRiders = riderFinances.reduce((s, r) => s + r.ivaWithheld, 0);
  const totalIsrRiders = riderFinances.reduce((s, r) => s + r.isrWithheld, 0);
  const totalBilled = clientBalances.reduce((s, c) => s + c.totalAmount, 0);
  const totalPending = clientBalances.reduce((s, c) => s + c.balance, 0);
  const totalIvaClients = clientBalances.reduce((s, c) => s + c.iva, 0);
  const totalRevenue = clientBalances.reduce((s, c) => s + c.subtotal, 0);

  const fmt = (n: number) => `$${n.toLocaleString("es-MX", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-bold text-foreground">💵 Centro Financiero</h2>
        <p className="text-sm text-muted-foreground">Control total de ingresos, comisiones, impuestos y cobranza</p>
      </div>

      {/* KPIs Row 1: Resumen General */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Ingresos brutos", value: fmt(totalRevenue), icon: TrendingUp, desc: "Subtotal antes de IVA" },
          { label: "IVA por cobrar", value: fmt(totalIvaClients), icon: Receipt, desc: "16% sobre facturación" },
          { label: "Cobranza pendiente", value: fmt(totalPending), icon: AlertCircle, desc: "Saldos por cobrar B2B" },
          { label: "Facturación total", value: fmt(totalBilled), icon: DollarSign, desc: "Con IVA incluido" },
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

      {/* KPIs Row 2: Repartidores */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {[
          { label: "Efectivo cobrado", value: fmt(totalCash), icon: DollarSign, desc: "Por repartidores hoy" },
          { label: "Por liquidar", value: fmt(totalOwed), icon: AlertCircle, desc: "Pendiente de entrega" },
          { label: "Comisiones pagadas", value: fmt(totalCommissions), icon: Bike, desc: "Total del día" },
          { label: "IVA retenido (riders)", value: fmt(totalIvaRiders), icon: Receipt, desc: "16% sobre comisiones" },
          { label: "ISR retenido (riders)", value: fmt(totalIsrRiders), icon: Receipt, desc: "Retención provisional" },
        ].map((kpi) => (
          <Card key={kpi.label}>
            <CardContent className="p-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] text-muted-foreground">{kpi.label}</span>
                <kpi.icon className="h-3.5 w-3.5 text-muted-foreground" />
              </div>
              <p className="text-lg font-bold text-foreground">{kpi.value}</p>
              <p className="text-[9px] text-muted-foreground mt-0.5">{kpi.desc}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="riders">
        <TabsList>
          <TabsTrigger value="riders" className="gap-1"><Bike className="h-3.5 w-3.5" /> Repartidores</TabsTrigger>
          <TabsTrigger value="clients" className="gap-1"><Users className="h-3.5 w-3.5" /> Locales B2B</TabsTrigger>
          <TabsTrigger value="taxes" className="gap-1"><Receipt className="h-3.5 w-3.5" /> Impuestos</TabsTrigger>
        </TabsList>

        {/* ===== TAB: REPARTIDORES ===== */}
        <TabsContent value="riders">
          <Card>
            <CardHeader className="py-3 px-4 border-b">
              <CardTitle className="text-sm font-semibold">Desglose Financiero por Repartidor — Hoy</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-8"></TableHead>
                    <TableHead>Repartidor</TableHead>
                    <TableHead>Turno</TableHead>
                    <TableHead className="text-center">Entregas</TableHead>
                    <TableHead className="text-right">Cobrado total</TableHead>
                    <TableHead className="text-right">Efectivo</TableHead>
                    <TableHead className="text-right">Wallet</TableHead>
                    <TableHead className="text-right">Comisión</TableHead>
                    <TableHead className="text-right">Neto a pagar</TableHead>
                    <TableHead className="text-right">Debe a empresa</TableHead>
                    <TableHead>Corte</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {riderFinances.map((r) => (
                    <>
                      <TableRow
                        key={r.riderId}
                        className="cursor-pointer"
                        onClick={() => setExpandedRider(expandedRider === r.riderId ? null : r.riderId)}
                      >
                        <TableCell className="px-2">
                          {expandedRider === r.riderId ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
                        </TableCell>
                        <TableCell className="text-sm font-medium">{r.riderName}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">{r.shift}</TableCell>
                        <TableCell className="text-center text-sm">{r.totalDeliveries}</TableCell>
                        <TableCell className="text-right text-sm">{fmt(r.totalCollected)}</TableCell>
                        <TableCell className="text-right text-sm">{fmt(r.cashAmount)}</TableCell>
                        <TableCell className="text-right text-sm">{fmt(r.walletBalance)}</TableCell>
                        <TableCell className="text-right text-sm">{fmt(r.commissionAmount)}</TableCell>
                        <TableCell className="text-right text-sm font-semibold text-primary">{fmt(r.netPayout)}</TableCell>
                        <TableCell className="text-right text-sm font-medium">{fmt(r.owedToCompany)}</TableCell>
                        <TableCell>
                          {r.cashoutStatus === "settled" ? (
                            <Badge className="text-[10px] bg-success text-success-foreground gap-1">
                              <CheckCircle className="h-3 w-3" /> Liquidado
                            </Badge>
                          ) : (
                            <Badge className="text-[10px] bg-warning text-warning-foreground">Pendiente</Badge>
                          )}
                        </TableCell>
                      </TableRow>
                      {expandedRider === r.riderId && (
                        <TableRow key={`${r.riderId}-detail`}>
                          <TableCell colSpan={11} className="bg-muted/30 px-6 py-4">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                              <div>
                                <p className="text-xs font-semibold text-muted-foreground mb-2">Desglose de cobros</p>
                                <div className="space-y-1">
                                  <div className="flex justify-between"><span className="text-muted-foreground">Efectivo ({r.cashOrders} pedidos)</span><span>{fmt(r.cashAmount)}</span></div>
                                  <div className="flex justify-between"><span className="text-muted-foreground">Tarjeta ({r.cardOrders} pedidos)</span><span>{fmt(r.cardAmount)}</span></div>
                                  <div className="flex justify-between"><span className="text-muted-foreground">Transferencia ({r.transferOrders} pedidos)</span><span>{fmt(r.transferAmount)}</span></div>
                                  <div className="flex justify-between font-semibold border-t border-border pt-1 mt-1"><span>Total cobrado</span><span>{fmt(r.totalCollected)}</span></div>
                                </div>
                              </div>
                              <div>
                                <p className="text-xs font-semibold text-muted-foreground mb-2">Ganancias del repartidor</p>
                                <div className="space-y-1">
                                  <div className="flex justify-between"><span className="text-muted-foreground">Comisión ({(r.commissionRate * 100).toFixed(0)}%)</span><span>{fmt(r.commissionAmount)}</span></div>
                                  <div className="flex justify-between"><span className="text-muted-foreground">Bonos</span><span>{fmt(r.bonuses)}</span></div>
                                  <div className="flex justify-between font-semibold border-t border-border pt-1 mt-1"><span>Ganancia bruta</span><span>{fmt(r.grossEarnings)}</span></div>
                                </div>
                              </div>
                              <div>
                                <p className="text-xs font-semibold text-muted-foreground mb-2">Retenciones fiscales</p>
                                <div className="space-y-1">
                                  <div className="flex justify-between"><span className="text-muted-foreground">IVA retenido (16%)</span><span className="text-destructive">-{fmt(r.ivaWithheld)}</span></div>
                                  <div className="flex justify-between"><span className="text-muted-foreground">ISR retenido</span><span className="text-destructive">-{fmt(r.isrWithheld)}</span></div>
                                  <div className="flex justify-between font-semibold border-t border-border pt-1 mt-1"><span>Neto a pagar</span><span className="text-primary">{fmt(r.netPayout)}</span></div>
                                </div>
                              </div>
                              <div>
                                <p className="text-xs font-semibold text-muted-foreground mb-2">Corte de caja</p>
                                <div className="space-y-1">
                                  <div className="flex justify-between"><span className="text-muted-foreground">Efectivo en mano</span><span>{fmt(r.cashAmount)}</span></div>
                                  <div className="flex justify-between"><span className="text-muted-foreground">Debe a empresa</span><span className="text-destructive">{fmt(r.owedToCompany)}</span></div>
                                  <div className="flex justify-between"><span className="text-muted-foreground">Saldo en wallet</span><span>{fmt(r.walletBalance)}</span></div>
                                </div>
                              </div>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ===== TAB: LOCALES B2B ===== */}
        <TabsContent value="clients">
          <Card>
            <CardHeader className="py-3 px-4 border-b">
              <CardTitle className="text-sm font-semibold">Facturación y Cobranza B2B — Febrero 2026</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-8"></TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Plan</TableHead>
                    <TableHead className="text-center">Pedidos</TableHead>
                    <TableHead className="text-right">Subtotal</TableHead>
                    <TableHead className="text-right">IVA</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                    <TableHead className="text-right">Pagado</TableHead>
                    <TableHead className="text-right">Saldo</TableHead>
                    <TableHead>Método</TableHead>
                    <TableHead>Estado</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {clientBalances.map((c) => (
                    <>
                      <TableRow
                        key={c.clientId}
                        className="cursor-pointer"
                        onClick={() => setExpandedClient(expandedClient === c.clientId ? null : c.clientId)}
                      >
                        <TableCell className="px-2">
                          {expandedClient === c.clientId ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
                        </TableCell>
                        <TableCell className="text-sm font-medium">{c.clientName}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-[10px]">{c.subscriptionPlan}</Badge>
                        </TableCell>
                        <TableCell className="text-center text-sm">{c.totalOrders}</TableCell>
                        <TableCell className="text-right text-sm">{fmt(c.subtotal)}</TableCell>
                        <TableCell className="text-right text-sm text-muted-foreground">{fmt(c.iva)}</TableCell>
                        <TableCell className="text-right text-sm font-medium">{fmt(c.totalAmount)}</TableCell>
                        <TableCell className="text-right text-sm">{fmt(c.paid)}</TableCell>
                        <TableCell className="text-right text-sm font-medium">
                          {c.balance > 0 ? <span className="text-destructive">{fmt(c.balance)}</span> : "-"}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">{c.paymentMethod}</TableCell>
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
                      {expandedClient === c.clientId && (
                        <TableRow key={`${c.clientId}-detail`}>
                          <TableCell colSpan={11} className="bg-muted/30 px-6 py-4">
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                              <div>
                                <p className="text-xs font-semibold text-muted-foreground mb-2">Desglose de facturación</p>
                                <div className="space-y-1">
                                  <div className="flex justify-between"><span className="text-muted-foreground">Entregas ({c.totalOrders})</span><span>{fmt(c.deliveryTotal)}</span></div>
                                  <div className="flex justify-between"><span className="text-muted-foreground">Suscripción ({c.subscriptionPlan})</span><span>{fmt(c.subscriptionFee)}</span></div>
                                  {c.extraTools.map((t) => (
                                    <div key={t.name} className="flex justify-between"><span className="text-muted-foreground">{t.name}</span><span>{fmt(t.amount)}</span></div>
                                  ))}
                                  <div className="flex justify-between font-semibold border-t border-border pt-1 mt-1"><span>Subtotal</span><span>{fmt(c.subtotal)}</span></div>
                                </div>
                              </div>
                              <div>
                                <p className="text-xs font-semibold text-muted-foreground mb-2">Impuestos y total</p>
                                <div className="space-y-1">
                                  <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>{fmt(c.subtotal)}</span></div>
                                  <div className="flex justify-between"><span className="text-muted-foreground">IVA (16%)</span><span>{fmt(c.iva)}</span></div>
                                  <div className="flex justify-between font-semibold border-t border-border pt-1 mt-1"><span>Total con IVA</span><span>{fmt(c.totalAmount)}</span></div>
                                </div>
                              </div>
                              <div>
                                <p className="text-xs font-semibold text-muted-foreground mb-2">Estado de pago</p>
                                <div className="space-y-1">
                                  <div className="flex justify-between"><span className="text-muted-foreground">Pagado</span><span className="text-success">{fmt(c.paid)}</span></div>
                                  <div className="flex justify-between"><span className="text-muted-foreground">Saldo pendiente</span><span className={c.balance > 0 ? "text-destructive" : ""}>{fmt(c.balance)}</span></div>
                                  <div className="flex justify-between"><span className="text-muted-foreground">Vencimiento</span><span>{new Date(c.dueDate).toLocaleDateString("es-MX", { day: "numeric", month: "short" })}</span></div>
                                  <div className="flex justify-between"><span className="text-muted-foreground">Último pago</span><span>{c.lastPaymentDate ? new Date(c.lastPaymentDate).toLocaleDateString("es-MX", { day: "numeric", month: "short" }) : "—"}</span></div>
                                </div>
                              </div>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ===== TAB: IMPUESTOS ===== */}
        <TabsContent value="taxes">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* IVA Summary */}
            <Card>
              <CardHeader className="py-3 px-4 border-b">
                <CardTitle className="text-sm font-semibold">📋 IVA — Resumen Mensual</CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-3">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-muted-foreground">IVA cobrado (facturación B2B)</span><span className="font-medium">{fmt(totalIvaClients)}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">IVA retenido a repartidores</span><span className="font-medium">{fmt(totalIvaRiders)}</span></div>
                  <div className="flex justify-between border-t border-border pt-2 mt-2">
                    <span className="font-semibold">IVA neto por enterar</span>
                    <span className="font-bold text-primary">{fmt(totalIvaClients - totalIvaRiders)}</span>
                  </div>
                </div>
                <p className="text-[10px] text-muted-foreground">IVA trasladado menos IVA acreditable. Declaración mensual ante SAT.</p>
              </CardContent>
            </Card>

            {/* ISR Summary */}
            <Card>
              <CardHeader className="py-3 px-4 border-b">
                <CardTitle className="text-sm font-semibold">📋 ISR — Retenciones</CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-3">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-muted-foreground">ISR retenido a repartidores</span><span className="font-medium">{fmt(totalIsrRiders)}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Ingresos brutos del período</span><span className="font-medium">{fmt(totalRevenue)}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Comisiones pagadas (deducible)</span><span className="font-medium">{fmt(totalCommissions)}</span></div>
                  <div className="flex justify-between border-t border-border pt-2 mt-2">
                    <span className="font-semibold">Base gravable estimada</span>
                    <span className="font-bold text-primary">{fmt(totalRevenue - totalCommissions)}</span>
                  </div>
                </div>
                <p className="text-[10px] text-muted-foreground">Retención provisional de ISR. Consulta con tu contador para el cálculo definitivo.</p>
              </CardContent>
            </Card>

            {/* Detailed rider tax table */}
            <Card className="md:col-span-2">
              <CardHeader className="py-3 px-4 border-b">
                <CardTitle className="text-sm font-semibold">Retenciones por Repartidor — Hoy</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Repartidor</TableHead>
                      <TableHead className="text-right">Ganancia bruta</TableHead>
                      <TableHead className="text-right">IVA retenido</TableHead>
                      <TableHead className="text-right">ISR retenido</TableHead>
                      <TableHead className="text-right">Total retenciones</TableHead>
                      <TableHead className="text-right">Neto</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {riderFinances.map((r) => (
                      <TableRow key={r.riderId}>
                        <TableCell className="text-sm font-medium">{r.riderName}</TableCell>
                        <TableCell className="text-right text-sm">{fmt(r.grossEarnings)}</TableCell>
                        <TableCell className="text-right text-sm text-destructive">-{fmt(r.ivaWithheld)}</TableCell>
                        <TableCell className="text-right text-sm text-destructive">-{fmt(r.isrWithheld)}</TableCell>
                        <TableCell className="text-right text-sm font-medium text-destructive">-{fmt(r.ivaWithheld + r.isrWithheld)}</TableCell>
                        <TableCell className="text-right text-sm font-bold text-primary">{fmt(r.netPayout)}</TableCell>
                      </TableRow>
                    ))}
                    <TableRow className="bg-muted/50 font-semibold">
                      <TableCell className="text-sm">Totales</TableCell>
                      <TableCell className="text-right text-sm">{fmt(riderFinances.reduce((s, r) => s + r.grossEarnings, 0))}</TableCell>
                      <TableCell className="text-right text-sm text-destructive">-{fmt(totalIvaRiders)}</TableCell>
                      <TableCell className="text-right text-sm text-destructive">-{fmt(totalIsrRiders)}</TableCell>
                      <TableCell className="text-right text-sm text-destructive">-{fmt(totalIvaRiders + totalIsrRiders)}</TableCell>
                      <TableCell className="text-right text-sm text-primary">{fmt(riderFinances.reduce((s, r) => s + r.netPayout, 0))}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
