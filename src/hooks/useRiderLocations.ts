import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export type RiderLocation = Tables<"rider_locations">;

export function useRiderLocations() {
  const [locations, setLocations] = useState<RiderLocation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initial fetch
    const fetchLocations = async () => {
      const { data, error } = await supabase
        .from("rider_locations")
        .select("*")
        .order("updated_at", { ascending: false });

      if (!error && data) {
        setLocations(data);
      }
      setLoading(false);
    };

    fetchLocations();

    // Realtime subscription
    const channel = supabase
      .channel("rider-locations-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "rider_locations" },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setLocations((prev) => {
              const filtered = prev.filter((l) => l.rider_id !== (payload.new as RiderLocation).rider_id);
              return [payload.new as RiderLocation, ...filtered];
            });
          } else if (payload.eventType === "UPDATE") {
            setLocations((prev) =>
              prev.map((l) =>
                l.rider_id === (payload.new as RiderLocation).rider_id
                  ? (payload.new as RiderLocation)
                  : l
              )
            );
          } else if (payload.eventType === "DELETE") {
            setLocations((prev) =>
              prev.filter((l) => l.id !== (payload.old as { id: string }).id)
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { locations, loading };
}
