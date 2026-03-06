import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface RiderRow {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  status: string;
  rating: number;
  vehicle_id: string;
  vehicle_model: string;
  vehicle_plates: string;
  vehicle_year: number;
  circulation_card: string;
  created_at: string;
}

export interface RiderDocument {
  id: string;
  rider_id: string;
  doc_type: string;
  file_url: string;
  file_name: string;
  uploaded_at: string;
}

export function useRiders() {
  const [riders, setRiders] = useState<RiderRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRiders = async () => {
      const { data, error } = await supabase
        .from("riders")
        .select("*")
        .order("name");

      if (!error && data) {
        setRiders(data as RiderRow[]);
      }
      setLoading(false);
    };
    fetchRiders();
  }, []);

  const updateRider = async (id: string, updates: Partial<RiderRow>) => {
    const { error } = await supabase.from("riders").update(updates).eq("id", id);
    if (!error) {
      setRiders((prev) => prev.map((r) => (r.id === id ? { ...r, ...updates } : r)));
    }
    return !error;
  };

  return { riders, loading, updateRider };
}

export function useRiderDocuments(riderId: string | null) {
  const [documents, setDocuments] = useState<RiderDocument[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!riderId) {
      setDocuments([]);
      return;
    }

    const fetch = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("rider_documents")
        .select("*")
        .eq("rider_id", riderId)
        .order("uploaded_at", { ascending: false });

      if (!error && data) {
        setDocuments(data as RiderDocument[]);
      }
      setLoading(false);
    };
    fetch();
  }, [riderId]);

  const uploadDocument = async (riderId: string, docType: string, file: File) => {
    const filePath = `${riderId}/${docType}_${Date.now()}.${file.name.split(".").pop()}`;
    const { error: uploadError } = await supabase.storage
      .from("rider-documents")
      .upload(filePath, file);

    if (uploadError) return false;

    const { data: urlData } = supabase.storage
      .from("rider-documents")
      .getPublicUrl(filePath);

    const { data, error } = await supabase
      .from("rider_documents")
      .insert({
        rider_id: riderId,
        doc_type: docType,
        file_url: urlData.publicUrl,
        file_name: file.name,
      })
      .select()
      .single();

    if (!error && data) {
      setDocuments((prev) => [data as RiderDocument, ...prev]);
    }
    return !error;
  };

  const deleteDocument = async (docId: string) => {
    const { error } = await supabase.from("rider_documents").delete().eq("id", docId);
    if (!error) {
      setDocuments((prev) => prev.filter((d) => d.id !== docId));
    }
    return !error;
  };

  return { documents, loading, uploadDocument, deleteDocument };
}
