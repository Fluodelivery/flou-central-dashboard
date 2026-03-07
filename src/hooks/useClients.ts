import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface CorporateClient {
  id: string;
  name: string;
  contact_name: string;
  contact_phone: string;
  contact_email: string;
  address: string;
  lat: number;
  lng: number;
  monthly_volume: number;
  status: string;
  since: string;
  notes: string;
  created_at: string;
}

export interface ClientDocument {
  id: string;
  client_id: string;
  doc_type: string;
  file_url: string;
  file_name: string;
  uploaded_at: string;
}

export function useClients() {
  const [clients, setClients] = useState<CorporateClient[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchClients = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("corporate_clients")
      .select("*")
      .order("name");
    if (error) {
      toast.error("Error al cargar clientes");
    } else {
      setClients(data || []);
    }
    setLoading(false);
  };

  useEffect(() => { fetchClients(); }, []);

  const updateClient = async (id: string, updates: Partial<CorporateClient>) => {
    const { error } = await supabase
      .from("corporate_clients")
      .update(updates)
      .eq("id", id);
    if (error) {
      toast.error("Error al actualizar cliente");
    } else {
      toast.success("Cliente actualizado");
      fetchClients();
    }
  };

  return { clients, loading, refetch: fetchClients, updateClient };
}

export function useClientDocuments(clientId: string | null) {
  const [documents, setDocuments] = useState<ClientDocument[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchDocuments = async () => {
    if (!clientId) return;
    setLoading(true);
    const { data, error } = await supabase
      .from("client_documents")
      .select("*")
      .eq("client_id", clientId)
      .order("uploaded_at", { ascending: false });
    if (error) {
      toast.error("Error al cargar documentos");
    } else {
      setDocuments(data || []);
    }
    setLoading(false);
  };

  useEffect(() => { fetchDocuments(); }, [clientId]);

  const uploadDocument = async (clientId: string, docType: string, file: File) => {
    const filePath = `${clientId}/${docType}/${Date.now()}_${file.name}`;
    const { error: uploadError } = await supabase.storage
      .from("client-media")
      .upload(filePath, file);

    if (uploadError) {
      toast.error("Error al subir archivo");
      return;
    }

    const { data: urlData } = supabase.storage
      .from("client-media")
      .getPublicUrl(filePath);

    const { error: dbError } = await supabase
      .from("client_documents")
      .insert({
        client_id: clientId,
        doc_type: docType,
        file_url: urlData.publicUrl,
        file_name: file.name,
      });

    if (dbError) {
      toast.error("Error al registrar documento");
    } else {
      toast.success("Archivo subido correctamente");
      fetchDocuments();
    }
  };

  const deleteDocument = async (doc: ClientDocument) => {
    // Extract path from URL
    const urlParts = doc.file_url.split("/client-media/");
    if (urlParts[1]) {
      await supabase.storage.from("client-media").remove([decodeURIComponent(urlParts[1])]);
    }
    await supabase.from("client_documents").delete().eq("id", doc.id);
    toast.success("Archivo eliminado");
    fetchDocuments();
  };

  return { documents, loading, uploadDocument, deleteDocument, refetch: fetchDocuments };
}
