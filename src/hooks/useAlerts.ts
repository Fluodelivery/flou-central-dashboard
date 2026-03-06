import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface AlertRow {
  id: string;
  type: "sos" | "exception" | "delay" | "stalled_order" | "idle_rider";
  rider_id: string;
  rider_name: string;
  rider_phone: string;
  client_phone: string;
  order_id: string;
  message: string;
  location: string;
  created_at: string;
  resolved: boolean;
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Ahora";
  if (mins < 60) return `Hace ${mins} min`;
  const hrs = Math.floor(mins / 60);
  return `Hace ${hrs}h`;
}

export function useAlerts() {
  const [alerts, setAlerts] = useState<AlertRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const { data, error } = await supabase
        .from("alerts")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data) {
        setAlerts(data as AlertRow[]);
      }
      setLoading(false);
    };

    fetch();

    const channel = supabase
      .channel("alerts-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "alerts" },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setAlerts((prev) => [payload.new as AlertRow, ...prev]);
          } else if (payload.eventType === "UPDATE") {
            setAlerts((prev) =>
              prev.map((a) =>
                a.id === (payload.new as AlertRow).id ? (payload.new as AlertRow) : a
              )
            );
          } else if (payload.eventType === "DELETE") {
            setAlerts((prev) =>
              prev.filter((a) => a.id !== (payload.old as { id: string }).id)
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { alerts, loading, timeAgo };
}
