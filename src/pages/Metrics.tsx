import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { riders, historicalOrders } from "@/data/mock-data";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { Bike, Package, TrendingUp, Users } from "lucide-react";

export default function Metrics() {
  const totalRiders = riders.filter((r) => r.status !== "offline").length;
  const onRouteRiders = riders.filter((r) => r.status === "on_route").length;
  const availableRiders = riders.filter((r) => r.status === "available").length;
  const pausedRiders = riders.filter((r) => r.status === "paused").length;

  // Fleet utilization
  const clientOrders = onRouteRiders; // riders moving client orders
  const internalLogistics = pausedRiders; // example: internal tasks
  const utilizationPct = totalRiders > 0 ? Math.round((onRouteRiders / totalRiders) * 100) : 0;

  const fleetPieData = [
    { name: "Pedidos clientes", value: clientOrders, color: "hsl(220, 80%, 50%)" },
    { name: "Disponibles", value: availableRiders, color: "hsl(160, 60%, 42%)" },
    { name: "En pausa / Interno", value: internalLogistics, color: "hsl(38, 92%, 50%)" },
  ];

  // Orders by client
  const ordersByClient: Record<string, number> = {};
  historicalOrders.forEach((o) => {
    ordersByClient[o.client] = (ordersByClient[o.client] || 0) + 1;
  });
  const clientChartData = Object.entries(ordersByClient).map(([name, count]) => ({ name, pedidos: count }));

  // Orders by status
  const statusCounts = {
    completed: historicalOrders.filter((o) => o.status === "completed").length,
    cancelled: historicalOrders.filter((o) => o.status === "cancelled").length,
    returned: historicalOrders.filter((o) => o.status === "returned").length,
  };

  const statusPieData = [
    { name: "Completados", value: statusCounts.completed, color: "hsl(160, 60%, 42%)" },
    { name: "Cancelados", value: statusCounts.cancelled, color: "hsl(0, 72%, 51%)" },
    { name: "Devueltos", value: statusCounts.returned, color: "hsl(38, 92%, 50%)" },
  ];

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-bold text-foreground">📊 Métricas de Flota</h2>
        <p className="text-sm text-muted-foreground">Utilización de flota y distribución de demanda</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: "Flota activa", value: totalRiders, icon: Bike, desc: "Repartidores conectados" },
          { label: "En ruta (clientes)", value: onRouteRiders, icon: Package, desc: `${utilizationPct}% utilización` },
          { label: "Disponibles", value: availableRiders, icon: Users, desc: "Listos para asignación" },
          { label: "Entregas hoy (hist.)", value: historicalOrders.length, icon: TrendingUp, desc: "Últimos 3 días" },
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

      <div className="grid grid-cols-2 gap-3">
        {/* Fleet Utilization Pie */}
        <Card>
          <CardHeader className="py-3 px-4 border-b">
            <CardTitle className="text-sm font-semibold">Distribución de Flota</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={fleetPieData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={4} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                    {fleetPieData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Orders by Status Pie */}
        <Card>
          <CardHeader className="py-3 px-4 border-b">
            <CardTitle className="text-sm font-semibold">Estado de Pedidos (Historial)</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={statusPieData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={4} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                    {statusPieData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Orders by Client Bar */}
        <Card className="col-span-2">
          <CardHeader className="py-3 px-4 border-b">
            <CardTitle className="text-sm font-semibold">Pedidos por Cliente (Histórico)</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="h-[240px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={clientChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 90%)" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="pedidos" fill="hsl(220, 80%, 50%)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
