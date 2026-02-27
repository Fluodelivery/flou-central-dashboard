import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { dynamicRates, type DynamicRate } from "@/data/mock-data";
import { Settings as SettingsIcon, Zap } from "lucide-react";

export default function Settings() {
  const [rates, setRates] = useState(dynamicRates);
  const [stalledThreshold, setStalledThreshold] = useState(10);
  const [idleThreshold, setIdleThreshold] = useState(10);

  const toggleRate = (id: string) => {
    setRates((prev) => prev.map((r) => (r.id === id ? { ...r, active: !r.active } : r)));
  };

  const updateMultiplier = (id: string, val: number) => {
    setRates((prev) => prev.map((r) => (r.id === id ? { ...r, multiplier: val } : r)));
  };

  const activeCount = rates.filter((r) => r.active).length;

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-bold text-foreground">⚙️ Configuración de Tarifas</h2>
        <p className="text-sm text-muted-foreground">Tarifas dinámicas y umbrales de alertas</p>
      </div>

      {/* Alert Thresholds */}
      <Card>
        <CardHeader className="py-3 px-4 border-b">
          <CardTitle className="text-sm font-semibold">🔔 Umbrales de Alertas Automáticas</CardTitle>
        </CardHeader>
        <CardContent className="p-4 space-y-5">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-sm">Pedido estancado (sin aceptar)</Label>
              <span className="text-sm font-mono font-semibold text-primary">{stalledThreshold} min</span>
            </div>
            <Slider value={[stalledThreshold]} onValueChange={([v]) => setStalledThreshold(v)} min={3} max={30} step={1} />
            <p className="text-[11px] text-muted-foreground">Alerta si un pedido lleva más de {stalledThreshold} minutos sin repartidor asignado</p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-sm">Repartidor detenido (punto no registrado)</Label>
              <span className="text-sm font-mono font-semibold text-primary">{idleThreshold} min</span>
            </div>
            <Slider value={[idleThreshold]} onValueChange={([v]) => setIdleThreshold(v)} min={3} max={30} step={1} />
            <p className="text-[11px] text-muted-foreground">Alerta si un repartidor lleva {idleThreshold}+ min detenido fuera de zona de entrega/recogida</p>
          </div>
        </CardContent>
      </Card>

      {/* Dynamic Rates */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
          <Zap className="h-4 w-4 text-primary" /> Multiplicadores Dinámicos
        </h3>
        <Badge variant="secondary" className="text-xs">{activeCount} activos</Badge>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {rates.map((rate) => (
          <Card key={rate.id} className={`transition-all ${rate.active ? "border-primary/40 bg-primary/5" : ""}`}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{rate.icon}</span>
                  <div>
                    <p className="text-sm font-medium text-foreground">{rate.name}</p>
                    <p className="text-[11px] text-muted-foreground">{rate.description}</p>
                  </div>
                </div>
                <Switch checked={rate.active} onCheckedChange={() => toggleRate(rate.id)} />
              </div>
              <div className="flex items-center gap-3">
                <Label className="text-xs text-muted-foreground shrink-0">Multiplicador</Label>
                <Input
                  type="number"
                  step="0.1"
                  min="1"
                  max="3"
                  value={rate.multiplier}
                  onChange={(e) => updateMultiplier(rate.id, parseFloat(e.target.value) || 1)}
                  className="h-8 w-20 text-center font-mono text-sm"
                />
                <span className="text-xs text-muted-foreground">×</span>
                {rate.active && (
                  <Badge className="text-[10px] bg-primary text-primary-foreground ml-auto">ACTIVO</Badge>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
