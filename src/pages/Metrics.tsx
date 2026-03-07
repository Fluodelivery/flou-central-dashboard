import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { riders, historicalOrders, riderFinances, clientBalances, corporateClients } from "@/data/mock-data";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, AreaChart, Area, ComposedChart,
} from "recharts";
import {
  Bike, Package, TrendingUp, TrendingDown, Users, Clock, DollarSign,
  Target, AlertTriangle, Zap, ArrowUpRight, ArrowDownRight, Minus,
} from "lucide-react";

// ===== SIMULATED HISTORICAL DATA (30 days) =====
const dailyData = Array.from({ length: 30 }, (_, i) => {
  const day = 30 - i;
  const date = new Date(2026, 1, day); // Feb 2026
  const base = 38 + Math.round(Math.sin(i * 0.5) * 12 + Math.random() * 8);
  const completed = Math.max(20, base);
  const cancelled = Math.round(completed * (0.03 + Math.random() * 0.04));
  const returned = Math.round(completed * (0.01 + Math.random() * 0.02));
  const revenue = completed * (42 + Math.round(Math.random() * 10));
  const avgTime = 22 + Math.round(Math.random() * 12);
  const slaCompliance = 85 + Math.round(Math.random() * 12);
  return {
    date: `${date.getDate()}/${date.getMonth() + 1}`,
    day: date.getDate(),
    completed,
    cancelled,
    returned,
    total: completed + cancelled + returned,
    revenue,
    avgTime,
    slaCompliance,
    costPerDelivery: +(8.5 + Math.random() * 3).toFixed(2),
    riderUtilization: 55 + Math.round(Math.random() * 30),
  };
});

// Weekly aggregation
const weeklyData = [
  { week: "Sem 1", orders: 245, revenue: 11760, avgTime: 26, sla: 89, cost: 9.8, riders: 6 },
  { week: "Sem 2", orders: 278, revenue: 13344, avgTime: 24, sla: 91, cost: 9.2, riders: 7 },
  { week: "Sem 3", orders: 312, revenue: 15288, avgTime: 23, sla: 93, cost: 8.7, riders: 7 },
  { week: "Sem 4", orders: 342, revenue: 17100, avgTime: 21, sla: 95, cost: 8.3, riders: 7 },
];

// Monthly projections
const monthlyProjection = [
  { month: "Nov 25", orders: 890, revenue: 42720, clients: 3, riders: 5, costPerOrder: 11.2 },
  { month: "Dic 25", orders: 1020, revenue: 50980, clients: 4, riders: 6, costPerOrder: 10.5 },
  { month: "Ene 26", orders: 1085, revenue: 54250, clients: 4, riders: 6, costPerOrder: 10.1 },
  { month: "Feb 26", orders: 1177, revenue: 57492, clients: 5, riders: 7, costPerOrder: 9.5 },
  { month: "Mar 26*", orders: 1290, revenue: 64500, clients: 6, riders: 8, costPerOrder: 9.0 },
  { month: "Abr 26*", orders: 1420, revenue: 72420, clients: 7, riders: 8, costPerOrder: 8.6 },
];

// Rider performance rankings
const riderPerformance = riderFinances.map((r) => {
  const avgDeliveryTime = 18 + Math.round(Math.random() * 14);
  const sla = Math.min(100, 82 + Math.round(Math.random() * 18));
  const cancelRate = +(Math.random() * 5).toFixed(1);
  const avgRating = +(4.1 + Math.random() * 0.8).toFixed(1);
  const deliveriesPerHour = +(r.totalDeliveries / 8).toFixed(1);
  const revenuePerHour = +(r.totalCollected / 8).toFixed(0);
  return {
    ...r,
    avgDeliveryTime,
    sla,
    cancelRate,
    avgRating: Math.min(5, avgRating),
    deliveriesPerHour,
    revenuePerHour: +revenuePerHour,
    efficiency: Math.round((sla * 0.4) + (avgRating / 5 * 100 * 0.3) + ((1 - cancelRate / 10) * 100 * 0.3)),
  };
}).sort((a, b) => b.efficiency - a.efficiency);

// Client analytics
const clientAnalytics = clientBalances.map((c) => {
  const avgOrderValue = +(c.deliveryTotal / c.totalOrders).toFixed(1);
  const growthRate = +(-5 + Math.random() * 25).toFixed(1);
  const churnRisk = c.status === "pending" ? "Alto" : c.status === "partial" ? "Medio" : "Bajo";
  const ltv = +(c.totalAmount * 12 * (1 + growthRate / 100)).toFixed(0);
  const ordersPerDay = +(c.totalOrders / 28).toFixed(1);
  return { ...c, avgOrderValue, growthRate, churnRisk, ltv, ordersPerDay };
}).sort((a, b) => b.ltv - a.ltv);

// Hourly distribution
const hourlyDist = [
  { hour: "7-8", orders: 12 }, { hour: "8-9", orders: 28 }, { hour: "9-10", orders: 42 },
  { hour: "10-11", orders: 38 }, { hour: "11-12", orders: 35 }, { hour: "12-13", orders: 48 },
  { hour: "13-14", orders: 52 }, { hour: "14-15", orders: 44 }, { hour: "15-16", orders: 30 },
  { hour: "16-17", orders: 25 }, { hour: "17-18", orders: 32 }, { hour: "18-19", orders: 45 },
  { hour: "19-20", orders: 50 }, { hour: "20-21", orders: 38 }, { hour: "21-22", orders: 18 },
];

// Statistical helpers
const mean = (arr: number[]) => arr.reduce((a, b) => a + b, 0) / arr.length;
const stdDev = (arr: number[]) => {
  const m = mean(arr);
  return Math.sqrt(arr.reduce((s, v) => s + (v - m) ** 2, 0) / arr.length);
};

const completedArr = dailyData.map(d => d.completed);
const revenueArr = dailyData.map(d => d.revenue);
const avgTimeArr = dailyData.map(d => d.avgTime);
const stats = {
  avgOrders: mean(completedArr),
  stdOrders: stdDev(completedArr),
  avgRevenue: mean(revenueArr),
  stdRevenue: stdDev(revenueArr),
  avgTime: mean(avgTimeArr),
  stdTime: stdDev(avgTimeArr),
  totalOrders30d: completedArr.reduce((a, b) => a + b, 0),
  totalRevenue30d: revenueArr.reduce((a, b) => a + b, 0),
  peakDay: Math.max(...completedArr),
  lowDay: Math.min(...completedArr),
};

const fmt = (n: number) => `$${n.toLocaleString("es-MX", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
const fmtDec = (n: number) => `$${n.toLocaleString("es-MX", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const TrendBadge = ({ value, suffix = "%" }: { value: number; suffix?: string }) => {
  if (value > 0) return <Badge className="text-[10px] bg-success/15 text-success border-0 gap-0.5"><ArrowUpRight className="h-3 w-3" />+{value.toFixed(1)}{suffix}</Badge>;
  if (value < 0) return <Badge className="text-[10px] bg-destructive/15 text-destructive border-0 gap-0.5"><ArrowDownRight className="h-3 w-3" />{value.toFixed(1)}{suffix}</Badge>;
  return <Badge className="text-[10px] bg-muted text-muted-foreground border-0 gap-0.5"><Minus className="h-3 w-3" />0{suffix}</Badge>;
};

export default function Metrics() {
  const totalRiders = riders.filter((r) => r.status !== "offline").length;
  const onRouteRiders = riders.filter((r) => r.status === "on_route").length;
  const utilizationPct = totalRiders > 0 ? Math.round((onRouteRiders / totalRiders) * 100) : 0;
  const last7 = dailyData.slice(-7);
  const prev7 = dailyData.slice(-14, -7);
  const ordersWoW = ((mean(last7.map(d => d.completed)) - mean(prev7.map(d => d.completed))) / mean(prev7.map(d => d.completed))) * 100;
  const revenueWoW = ((mean(last7.map(d => d.revenue)) - mean(prev7.map(d => d.revenue))) / mean(prev7.map(d => d.revenue))) * 100;
  const timeWoW = ((mean(last7.map(d => d.avgTime)) - mean(prev7.map(d => d.avgTime))) / mean(prev7.map(d => d.avgTime))) * 100;

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-bold text-foreground">📊 Centro de Inteligencia Operativa</h2>
        <p className="text-sm text-muted-foreground">Estadísticas avanzadas para decisiones a corto, mediano y largo plazo</p>
      </div>

      {/* KPIs principales */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
        {[
          { label: "Pedidos/día (μ)", value: stats.avgOrders.toFixed(1), icon: Package, desc: `σ=${stats.stdOrders.toFixed(1)}`, trend: ordersWoW },
          { label: "Tiempo entrega (μ)", value: `${stats.avgTime.toFixed(0)} min`, icon: Clock, desc: `σ=${stats.stdTime.toFixed(1)} min`, trend: timeWoW, invertTrend: true },
          { label: "Revenue diario (μ)", value: fmt(stats.avgRevenue), icon: DollarSign, desc: `σ=${fmt(stats.stdRevenue)}`, trend: revenueWoW },
          { label: "Total 30 días", value: stats.totalOrders30d.toLocaleString(), icon: TrendingUp, desc: fmt(stats.totalRevenue30d), trend: null },
          { label: "Utilización flota", value: `${utilizationPct}%`, icon: Bike, desc: `${onRouteRiders}/${totalRiders} activos`, trend: null },
          { label: "Costo/entrega (μ)", value: fmtDec(mean(dailyData.map(d => d.costPerDelivery))), icon: Target, desc: "Operativo unitario", trend: null },
        ].map((kpi) => (
          <Card key={kpi.label}>
            <CardContent className="p-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] text-muted-foreground">{kpi.label}</span>
                <kpi.icon className="h-3.5 w-3.5 text-muted-foreground" />
              </div>
              <p className="text-lg font-bold text-foreground">{kpi.value}</p>
              <div className="flex items-center gap-1 mt-0.5">
                <p className="text-[9px] text-muted-foreground">{kpi.desc}</p>
                {kpi.trend !== null && <TrendBadge value={kpi.invertTrend ? -kpi.trend : kpi.trend} />}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="operational">
        <TabsList className="flex-wrap">
          <TabsTrigger value="operational" className="gap-1 text-xs"><Zap className="h-3.5 w-3.5" /> Corto Plazo</TabsTrigger>
          <TabsTrigger value="trends" className="gap-1 text-xs"><TrendingUp className="h-3.5 w-3.5" /> Mediano Plazo</TabsTrigger>
          <TabsTrigger value="strategic" className="gap-1 text-xs"><Target className="h-3.5 w-3.5" /> Largo Plazo</TabsTrigger>
          <TabsTrigger value="riders" className="gap-1 text-xs"><Bike className="h-3.5 w-3.5" /> Rendimiento</TabsTrigger>
          <TabsTrigger value="clients" className="gap-1 text-xs"><Users className="h-3.5 w-3.5" /> Clientes</TabsTrigger>
        </TabsList>

        {/* ===== CORTO PLAZO ===== */}
        <TabsContent value="operational">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Distribución horaria */}
            <Card>
              <CardHeader className="py-3 px-4 border-b">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-semibold">Distribución Horaria de Demanda</CardTitle>
                  <Badge variant="outline" className="text-[10px]">Hoy</Badge>
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <div className="h-[240px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={hourlyDist}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="hour" tick={{ fontSize: 10 }} />
                      <YAxis tick={{ fontSize: 10 }} />
                      <Tooltip />
                      <Bar dataKey="orders" fill="hsl(var(--primary))" radius={[3, 3, 0, 0]} name="Pedidos" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-2 grid grid-cols-3 gap-2 text-[10px]">
                  <div className="bg-muted/50 rounded p-2 text-center">
                    <p className="text-muted-foreground">Hora pico</p>
                    <p className="font-bold text-foreground">13:00 - 14:00</p>
                    <p className="text-muted-foreground">52 pedidos</p>
                  </div>
                  <div className="bg-muted/50 rounded p-2 text-center">
                    <p className="text-muted-foreground">Hora valle</p>
                    <p className="font-bold text-foreground">7:00 - 8:00</p>
                    <p className="text-muted-foreground">12 pedidos</p>
                  </div>
                  <div className="bg-muted/50 rounded p-2 text-center">
                    <p className="text-muted-foreground">Ratio pico/valle</p>
                    <p className="font-bold text-foreground">4.3x</p>
                    <p className="text-muted-foreground">Concentración alta</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* SLA y tiempos - últimos 7 días */}
            <Card>
              <CardHeader className="py-3 px-4 border-b">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-semibold">SLA y Tiempos de Entrega</CardTitle>
                  <Badge variant="outline" className="text-[10px]">7 días</Badge>
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <div className="h-[240px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={last7}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                      <YAxis yAxisId="left" tick={{ fontSize: 10 }} domain={[15, 40]} label={{ value: "min", position: "insideLeft", fontSize: 10 }} />
                      <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 10 }} domain={[70, 100]} label={{ value: "%", position: "insideRight", fontSize: 10 }} />
                      <Tooltip />
                      <Bar yAxisId="left" dataKey="avgTime" fill="hsl(var(--primary))" radius={[3, 3, 0, 0]} name="Tiempo prom (min)" />
                      <Line yAxisId="right" type="monotone" dataKey="slaCompliance" stroke="hsl(var(--success))" strokeWidth={2} name="SLA %" dot={{ r: 3 }} />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-2 grid grid-cols-3 gap-2 text-[10px]">
                  <div className="bg-muted/50 rounded p-2 text-center">
                    <p className="text-muted-foreground">SLA promedio</p>
                    <p className="font-bold text-foreground">{mean(last7.map(d => d.slaCompliance)).toFixed(1)}%</p>
                  </div>
                  <div className="bg-muted/50 rounded p-2 text-center">
                    <p className="text-muted-foreground">Mejor día</p>
                    <p className="font-bold text-foreground">{Math.max(...last7.map(d => d.slaCompliance))}%</p>
                  </div>
                  <div className="bg-muted/50 rounded p-2 text-center">
                    <p className="text-muted-foreground">Peor día</p>
                    <p className="font-bold text-foreground">{Math.min(...last7.map(d => d.slaCompliance))}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Estado de pedidos */}
            <Card>
              <CardHeader className="py-3 px-4 border-b">
                <CardTitle className="text-sm font-semibold">Tasa de Éxito vs Incidencias</CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { name: "Completados", value: stats.totalOrders30d, color: "hsl(var(--success))" },
                          { name: "Cancelados", value: dailyData.reduce((s, d) => s + d.cancelled, 0), color: "hsl(var(--destructive))" },
                          { name: "Devueltos", value: dailyData.reduce((s, d) => s + d.returned, 0), color: "hsl(var(--warning))" },
                        ]}
                        cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(1)}%`}
                      >
                        <Cell fill="hsl(160, 60%, 42%)" />
                        <Cell fill="hsl(0, 72%, 51%)" />
                        <Cell fill="hsl(38, 92%, 50%)" />
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="grid grid-cols-3 gap-2 text-[10px] mt-2">
                  <div className="bg-success/10 rounded p-2 text-center">
                    <p className="font-bold text-foreground">{((stats.totalOrders30d / (stats.totalOrders30d + dailyData.reduce((s, d) => s + d.cancelled + d.returned, 0))) * 100).toFixed(1)}%</p>
                    <p className="text-muted-foreground">Tasa de éxito</p>
                  </div>
                  <div className="bg-destructive/10 rounded p-2 text-center">
                    <p className="font-bold text-foreground">{((dailyData.reduce((s, d) => s + d.cancelled, 0) / dailyData.reduce((s, d) => s + d.total, 0)) * 100).toFixed(1)}%</p>
                    <p className="text-muted-foreground">Tasa cancelación</p>
                  </div>
                  <div className="bg-warning/10 rounded p-2 text-center">
                    <p className="font-bold text-foreground">{((dailyData.reduce((s, d) => s + d.returned, 0) / dailyData.reduce((s, d) => s + d.total, 0)) * 100).toFixed(1)}%</p>
                    <p className="text-muted-foreground">Tasa devolución</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Costo por entrega */}
            <Card>
              <CardHeader className="py-3 px-4 border-b">
                <CardTitle className="text-sm font-semibold">Costo Unitario por Entrega</CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={dailyData.slice(-14)}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                      <YAxis tick={{ fontSize: 10 }} domain={[6, 14]} />
                      <Tooltip formatter={(v: number) => [`$${v.toFixed(2)}`, "Costo/entrega"]} />
                      <Area type="monotone" dataKey="costPerDelivery" stroke="hsl(var(--primary))" fill="hsl(var(--primary) / 0.15)" strokeWidth={2} name="Costo" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[10px] mt-2">
                  <div className="bg-muted/50 rounded p-2 text-center">
                    <p className="text-muted-foreground">Promedio 14d</p>
                    <p className="font-bold">{fmtDec(mean(dailyData.slice(-14).map(d => d.costPerDelivery)))}</p>
                  </div>
                  <div className="bg-muted/50 rounded p-2 text-center">
                    <p className="text-muted-foreground">Meta</p>
                    <p className="font-bold text-success">$8.50</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ===== MEDIANO PLAZO ===== */}
        <TabsContent value="trends">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Tendencia semanal */}
            <Card className="md:col-span-2">
              <CardHeader className="py-3 px-4 border-b">
                <CardTitle className="text-sm font-semibold">Evolución Semanal — Febrero 2026</CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="h-[260px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={weeklyData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="week" tick={{ fontSize: 11 }} />
                      <YAxis yAxisId="left" tick={{ fontSize: 10 }} />
                      <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 10 }} domain={[80, 100]} />
                      <Tooltip />
                      <Bar yAxisId="left" dataKey="orders" fill="hsl(var(--primary))" radius={[3, 3, 0, 0]} name="Pedidos" />
                      <Line yAxisId="right" type="monotone" dataKey="sla" stroke="hsl(var(--success))" strokeWidth={2} name="SLA %" dot={{ r: 4 }} />
                      <Line yAxisId="left" type="monotone" dataKey="avgTime" stroke="hsl(var(--warning))" strokeWidth={2} name="Tiempo prom (min)" dot={{ r: 4 }} />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Tabla de KPIs semanales */}
            <Card className="md:col-span-2">
              <CardHeader className="py-3 px-4 border-b">
                <CardTitle className="text-sm font-semibold">Comparativo Semanal Detallado</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Semana</TableHead>
                      <TableHead className="text-center">Pedidos</TableHead>
                      <TableHead className="text-right">Revenue</TableHead>
                      <TableHead className="text-center">Tiempo prom</TableHead>
                      <TableHead className="text-center">SLA</TableHead>
                      <TableHead className="text-right">Costo/entrega</TableHead>
                      <TableHead className="text-center">Riders</TableHead>
                      <TableHead className="text-right">Revenue/rider</TableHead>
                      <TableHead>Δ Pedidos</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {weeklyData.map((w, i) => {
                      const prevOrders = i > 0 ? weeklyData[i - 1].orders : w.orders;
                      const growth = ((w.orders - prevOrders) / prevOrders) * 100;
                      return (
                        <TableRow key={w.week}>
                          <TableCell className="text-sm font-medium">{w.week}</TableCell>
                          <TableCell className="text-center text-sm">{w.orders}</TableCell>
                          <TableCell className="text-right text-sm">{fmt(w.revenue)}</TableCell>
                          <TableCell className="text-center text-sm">{w.avgTime} min</TableCell>
                          <TableCell className="text-center">
                            <Badge className={`text-[10px] ${w.sla >= 93 ? "bg-success/15 text-success" : w.sla >= 90 ? "bg-warning/15 text-warning" : "bg-destructive/15 text-destructive"} border-0`}>
                              {w.sla}%
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right text-sm">{fmtDec(w.cost)}</TableCell>
                          <TableCell className="text-center text-sm">{w.riders}</TableCell>
                          <TableCell className="text-right text-sm">{fmt(Math.round(w.revenue / w.riders))}</TableCell>
                          <TableCell>{i > 0 ? <TrendBadge value={growth} /> : <span className="text-[10px] text-muted-foreground">—</span>}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Revenue trend */}
            <Card className="md:col-span-2">
              <CardHeader className="py-3 px-4 border-b">
                <CardTitle className="text-sm font-semibold">Tendencia de Ingresos Diarios (30 días)</CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="h-[220px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={dailyData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="date" tick={{ fontSize: 9 }} interval={2} />
                      <YAxis tick={{ fontSize: 10 }} />
                      <Tooltip formatter={(v: number) => [fmt(v), "Revenue"]} />
                      <Area type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" fill="hsl(var(--primary) / 0.12)" strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ===== LARGO PLAZO ===== */}
        <TabsContent value="strategic">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Growth projection */}
            <Card className="md:col-span-2">
              <CardHeader className="py-3 px-4 border-b">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-semibold">Proyección de Crecimiento (6 meses)</CardTitle>
                  <Badge variant="outline" className="text-[10px]">* Proyectado</Badge>
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <div className="h-[280px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={monthlyProjection}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                      <YAxis yAxisId="left" tick={{ fontSize: 10 }} />
                      <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 10 }} />
                      <Tooltip />
                      <Bar yAxisId="left" dataKey="orders" fill="hsl(var(--primary))" radius={[3, 3, 0, 0]} name="Pedidos" />
                      <Line yAxisId="right" type="monotone" dataKey="revenue" stroke="hsl(var(--success))" strokeWidth={2} name="Revenue" dot={{ r: 4 }} />
                      <Line yAxisId="left" type="monotone" dataKey="clients" stroke="hsl(var(--warning))" strokeWidth={2} name="Clientes" dot={{ r: 4 }} />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Unit economics */}
            <Card>
              <CardHeader className="py-3 px-4 border-b">
                <CardTitle className="text-sm font-semibold">📐 Unit Economics</CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-3">
                <div className="space-y-2 text-sm">
                  {[
                    { label: "Ingreso promedio por pedido", value: fmtDec(stats.totalRevenue30d / stats.totalOrders30d), trend: 3.2 },
                    { label: "Costo operativo por pedido", value: fmtDec(mean(dailyData.map(d => d.costPerDelivery))), trend: -5.1 },
                    { label: "Margen bruto por pedido", value: fmtDec((stats.totalRevenue30d / stats.totalOrders30d) - mean(dailyData.map(d => d.costPerDelivery))), trend: 8.4 },
                    { label: "Pedidos por rider por día", value: (stats.avgOrders / totalRiders).toFixed(1), trend: 2.1 },
                    { label: "Revenue por rider mensual", value: fmt(Math.round(stats.totalRevenue30d / totalRiders)), trend: 6.3 },
                    { label: "Costo adquisición cliente (CAC)", value: "$2,500", trend: null },
                    { label: "LTV promedio por cliente", value: fmt(Math.round(mean(clientAnalytics.map(c => c.ltv)))), trend: 12.5 },
                    { label: "Ratio LTV/CAC", value: `${(mean(clientAnalytics.map(c => c.ltv)) / 2500).toFixed(1)}x`, trend: null },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center justify-between">
                      <span className="text-muted-foreground">{item.label}</span>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{item.value}</span>
                        {item.trend !== null && <TrendBadge value={item.trend} />}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Cost optimization */}
            <Card>
              <CardHeader className="py-3 px-4 border-b">
                <CardTitle className="text-sm font-semibold">🎯 Metas Estratégicas Q1 2026</CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-3">
                {[
                  { label: "Reducir costo/entrega a $8.00", current: mean(dailyData.map(d => d.costPerDelivery)), target: 8, unit: "$" },
                  { label: "SLA ≥ 95%", current: mean(dailyData.map(d => d.slaCompliance)), target: 95, unit: "%" },
                  { label: "50 pedidos/día promedio", current: stats.avgOrders, target: 50, unit: "" },
                  { label: "8 clientes activos", current: 5, target: 8, unit: "" },
                  { label: "Cancelación < 3%", current: (dailyData.reduce((s, d) => s + d.cancelled, 0) / dailyData.reduce((s, d) => s + d.total, 0)) * 100, target: 3, unit: "%", invert: true },
                ].map((goal) => {
                  const progress = goal.invert
                    ? Math.min(100, (goal.target / goal.current) * 100)
                    : Math.min(100, (goal.current / goal.target) * 100);
                  return (
                    <div key={goal.label} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">{goal.label}</span>
                        <span className="font-medium">{goal.current.toFixed(1)}{goal.unit} / {goal.target}{goal.unit}</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${progress >= 90 ? "bg-success" : progress >= 70 ? "bg-warning" : "bg-destructive"}`}
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            {/* Monthly projection table */}
            <Card className="md:col-span-2">
              <CardHeader className="py-3 px-4 border-b">
                <CardTitle className="text-sm font-semibold">Proyección Mensual Detallada</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Mes</TableHead>
                      <TableHead className="text-center">Pedidos</TableHead>
                      <TableHead className="text-right">Revenue</TableHead>
                      <TableHead className="text-center">Clientes</TableHead>
                      <TableHead className="text-center">Riders</TableHead>
                      <TableHead className="text-right">Costo/pedido</TableHead>
                      <TableHead className="text-right">Margen est.</TableHead>
                      <TableHead>Crecimiento</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {monthlyProjection.map((m, i) => {
                      const margin = m.revenue - (m.orders * m.costPerOrder);
                      const growth = i > 0 ? ((m.orders - monthlyProjection[i - 1].orders) / monthlyProjection[i - 1].orders) * 100 : 0;
                      const isProjected = m.month.includes("*");
                      return (
                        <TableRow key={m.month} className={isProjected ? "bg-muted/20" : ""}>
                          <TableCell className="text-sm font-medium">
                            {m.month} {isProjected && <Badge variant="outline" className="text-[8px] ml-1">Est.</Badge>}
                          </TableCell>
                          <TableCell className="text-center text-sm">{m.orders.toLocaleString()}</TableCell>
                          <TableCell className="text-right text-sm">{fmt(m.revenue)}</TableCell>
                          <TableCell className="text-center text-sm">{m.clients}</TableCell>
                          <TableCell className="text-center text-sm">{m.riders}</TableCell>
                          <TableCell className="text-right text-sm">{fmtDec(m.costPerOrder)}</TableCell>
                          <TableCell className="text-right text-sm font-medium text-success">{fmt(margin)}</TableCell>
                          <TableCell>{i > 0 ? <TrendBadge value={growth} /> : <span className="text-[10px] text-muted-foreground">—</span>}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ===== RENDIMIENTO RIDERS ===== */}
        <TabsContent value="riders">
          <Card>
            <CardHeader className="py-3 px-4 border-b">
              <CardTitle className="text-sm font-semibold">Ranking de Rendimiento por Repartidor — Hoy</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-10">#</TableHead>
                    <TableHead>Repartidor</TableHead>
                    <TableHead className="text-center">Entregas</TableHead>
                    <TableHead className="text-center">Entregas/hr</TableHead>
                    <TableHead className="text-center">Tiempo prom</TableHead>
                    <TableHead className="text-center">SLA</TableHead>
                    <TableHead className="text-center">Cancelación</TableHead>
                    <TableHead className="text-center">Rating</TableHead>
                    <TableHead className="text-right">Revenue/hr</TableHead>
                    <TableHead className="text-center">Eficiencia</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {riderPerformance.map((r, i) => (
                    <TableRow key={r.riderId}>
                      <TableCell className="text-sm font-bold text-muted-foreground">
                        {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `${i + 1}`}
                      </TableCell>
                      <TableCell className="text-sm font-medium">{r.riderName}</TableCell>
                      <TableCell className="text-center text-sm">{r.totalDeliveries}</TableCell>
                      <TableCell className="text-center text-sm">{r.deliveriesPerHour}</TableCell>
                      <TableCell className="text-center text-sm">{r.avgDeliveryTime} min</TableCell>
                      <TableCell className="text-center">
                        <Badge className={`text-[10px] border-0 ${r.sla >= 93 ? "bg-success/15 text-success" : r.sla >= 85 ? "bg-warning/15 text-warning" : "bg-destructive/15 text-destructive"}`}>
                          {r.sla}%
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center text-sm">{r.cancelRate}%</TableCell>
                      <TableCell className="text-center text-sm">⭐ {r.avgRating}</TableCell>
                      <TableCell className="text-right text-sm">{fmt(r.revenuePerHour)}/hr</TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center gap-1 justify-center">
                          <div className="h-2 w-16 bg-muted rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${r.efficiency >= 85 ? "bg-success" : r.efficiency >= 70 ? "bg-warning" : "bg-destructive"}`}
                              style={{ width: `${r.efficiency}%` }}
                            />
                          </div>
                          <span className="text-[10px] font-medium">{r.efficiency}</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ===== CLIENTES ===== */}
        <TabsContent value="clients">
          <Card>
            <CardHeader className="py-3 px-4 border-b">
              <CardTitle className="text-sm font-semibold">Análisis de Clientes B2B — Febrero 2026</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Cliente</TableHead>
                    <TableHead className="text-center">Pedidos/día</TableHead>
                    <TableHead className="text-right">Ticket prom</TableHead>
                    <TableHead className="text-right">Revenue mes</TableHead>
                    <TableHead className="text-center">Crecimiento</TableHead>
                    <TableHead className="text-right">LTV anual est.</TableHead>
                    <TableHead className="text-center">Riesgo churn</TableHead>
                    <TableHead>Pago</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {clientAnalytics.map((c) => (
                    <TableRow key={c.clientId}>
                      <TableCell className="text-sm font-medium">{c.clientName}</TableCell>
                      <TableCell className="text-center text-sm">{c.ordersPerDay}</TableCell>
                      <TableCell className="text-right text-sm">{fmtDec(c.avgOrderValue)}</TableCell>
                      <TableCell className="text-right text-sm">{fmt(c.totalAmount)}</TableCell>
                      <TableCell className="text-center"><TrendBadge value={c.growthRate} /></TableCell>
                      <TableCell className="text-right text-sm font-medium">{fmt(c.ltv)}</TableCell>
                      <TableCell className="text-center">
                        <Badge className={`text-[10px] border-0 ${c.churnRisk === "Bajo" ? "bg-success/15 text-success" : c.churnRisk === "Medio" ? "bg-warning/15 text-warning" : "bg-destructive/15 text-destructive"}`}>
                          {c.churnRisk}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {c.status === "paid" ? (
                          <Badge className="text-[10px] bg-success text-success-foreground">Al día</Badge>
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
