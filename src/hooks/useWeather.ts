import { useState, useEffect } from "react";

interface WeatherData {
  isRaining: boolean;
  temperature: number;
  weatherCode: number;
  weatherLabel: string;
  surcharge: number;
  lastUpdated: string;
}

const RAIN_CODES = new Set([
  51, 53, 55, // Drizzle
  56, 57,     // Freezing drizzle
  61, 63, 65, // Rain
  66, 67,     // Freezing rain
  71, 73, 75, // Snow
  77,         // Snow grains
  80, 81, 82, // Rain showers
  85, 86,     // Snow showers
  95, 96, 99, // Thunderstorm
]);

const WEATHER_LABELS: Record<number, string> = {
  0: "Despejado",
  1: "Mayormente despejado",
  2: "Parcialmente nublado",
  3: "Nublado",
  45: "Neblina",
  48: "Neblina con escarcha",
  51: "Llovizna ligera",
  53: "Llovizna moderada",
  55: "Llovizna intensa",
  56: "Llovizna helada ligera",
  57: "Llovizna helada intensa",
  61: "Lluvia ligera",
  63: "Lluvia moderada",
  65: "Lluvia intensa",
  66: "Lluvia helada ligera",
  67: "Lluvia helada intensa",
  71: "Nevada ligera",
  73: "Nevada moderada",
  75: "Nevada intensa",
  77: "Granizo",
  80: "Chubascos ligeros",
  81: "Chubascos moderados",
  82: "Chubascos intensos",
  85: "Nevada ligera",
  86: "Nevada intensa",
  95: "Tormenta eléctrica",
  96: "Tormenta con granizo ligero",
  99: "Tormenta con granizo intenso",
};

const SURCHARGE_AMOUNT = 10;
// Xalapa, Veracruz coordinates
const LAT = 19.5438;
const LNG = -96.9102;
const POLL_INTERVAL = 10 * 60 * 1000; // 10 minutes

export function useWeather() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWeather = async () => {
    try {
      const res = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${LAT}&longitude=${LNG}&current=temperature_2m,weather_code&timezone=America%2FMexico_City`
      );
      if (!res.ok) throw new Error("Error al obtener clima");
      const data = await res.json();

      const code = data.current.weather_code as number;
      const isRaining = RAIN_CODES.has(code);

      setWeather({
        isRaining,
        temperature: Math.round(data.current.temperature_2m),
        weatherCode: code,
        weatherLabel: WEATHER_LABELS[code] || "Desconocido",
        surcharge: isRaining ? SURCHARGE_AMOUNT : 0,
        lastUpdated: new Date().toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" }),
      });
      setError(null);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather();
    const interval = setInterval(fetchWeather, POLL_INTERVAL);
    return () => clearInterval(interval);
  }, []);

  return { weather, loading, error, refetch: fetchWeather };
}
