import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { useWeather } from "@/hooks/useWeather";
import { CloudRain, Sun, RefreshCw, Loader2 } from "lucide-react";

export default function Settings() {
  const [stalledThreshold, setStalledThreshold] = useState(10);
  const [idleThreshold, setIdleThreshold] = useState(10);
  const { weather, loading, error, refetch } = useWeather();

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-bold text-foreground">⚙️ Configuración de Tarifas</h2>
        <p className="text-sm text-muted-foreground">Recargo automático por clima y umbrales de alertas</p>
      </div>

      {/* Weather Surcharge */}
      <Card className={weather?.isRaining ? "border-blue-500/50 bg-blue-500/5" : ""}>
        <CardHeader className="py-3 px-4 border-b flex flex-row items-center justify-between">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            {weather?.isRaining ? (
              <CloudRain className="h-4 w-4 text-blue-500" />
            ) : (
              <Sun className="h-4 w-4 text-yellow-500" />
            )}
            Recargo por Clima Adverso
          </CardTitle>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={refetch}
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <RefreshCw className="h-3.5 w-3.5" />
            )}
          </Button>
        </CardHeader>
        <CardContent className="p-4">
          {error ? (
            <p className="text-sm text-destructive">Error: {error}</p>
          ) : loading ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Consultando clima…
            </div>
          ) : weather ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">{weather.weatherLabel}</p>
                  <p className="text-xs text-muted-foreground">
                    {weather.temperature}°C · Xalapa, Ver. · Actualizado {weather.lastUpdated}
                  </p>
                </div>
                {weather.isRaining ? (
                  <Badge className="bg-blue-500 text-white text-xs">+$10 MXN ACTIVO</Badge>
                ) : (
                  <Badge variant="secondary" className="text-xs">Sin recargo</Badge>
                )}
              </div>
              <div className="rounded-lg border p-3 bg-muted/30">
                <p className="text-xs text-muted-foreground">
                  {weather.isRaining
                    ? "🌧️ Se detectó lluvia en la zona. Se aplica un recargo automático de $10 MXN a todas las cotizaciones por condiciones climáticas adversas."
                    : "☀️ No se detecta lluvia en la zona. Las cotizaciones se mantienen sin recargo climático."}
                </p>
              </div>
            </div>
          ) : null}
        </CardContent>
      </Card>

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
    </div>
  );
}
