export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      alerts: {
        Row: {
          client_phone: string | null
          created_at: string
          id: string
          location: string
          message: string
          order_id: string | null
          resolved: boolean
          rider_id: string
          rider_name: string
          rider_phone: string | null
          type: string
        }
        Insert: {
          client_phone?: string | null
          created_at?: string
          id: string
          location: string
          message: string
          order_id?: string | null
          resolved?: boolean
          rider_id?: string
          rider_name?: string
          rider_phone?: string | null
          type?: string
        }
        Update: {
          client_phone?: string | null
          created_at?: string
          id?: string
          location?: string
          message?: string
          order_id?: string | null
          resolved?: boolean
          rider_id?: string
          rider_name?: string
          rider_phone?: string | null
          type?: string
        }
        Relationships: []
      }
      client_documents: {
        Row: {
          client_id: string
          doc_type: string
          file_name: string | null
          file_url: string
          id: string
          uploaded_at: string
        }
        Insert: {
          client_id: string
          doc_type: string
          file_name?: string | null
          file_url: string
          id?: string
          uploaded_at?: string
        }
        Update: {
          client_id?: string
          doc_type?: string
          file_name?: string | null
          file_url?: string
          id?: string
          uploaded_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "client_documents_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "corporate_clients"
            referencedColumns: ["id"]
          },
        ]
      }
      corporate_clients: {
        Row: {
          address: string | null
          contact_email: string | null
          contact_name: string
          contact_phone: string | null
          created_at: string
          id: string
          lat: number | null
          lng: number | null
          monthly_volume: number | null
          name: string
          notes: string | null
          since: string
          status: string
        }
        Insert: {
          address?: string | null
          contact_email?: string | null
          contact_name?: string
          contact_phone?: string | null
          created_at?: string
          id: string
          lat?: number | null
          lng?: number | null
          monthly_volume?: number | null
          name: string
          notes?: string | null
          since?: string
          status?: string
        }
        Update: {
          address?: string | null
          contact_email?: string | null
          contact_name?: string
          contact_phone?: string | null
          created_at?: string
          id?: string
          lat?: number | null
          lng?: number | null
          monthly_volume?: number | null
          name?: string
          notes?: string | null
          since?: string
          status?: string
        }
        Relationships: []
      }
      rider_documents: {
        Row: {
          doc_type: string
          file_name: string | null
          file_url: string
          id: string
          rider_id: string
          uploaded_at: string
        }
        Insert: {
          doc_type: string
          file_name?: string | null
          file_url: string
          id?: string
          rider_id: string
          uploaded_at?: string
        }
        Update: {
          doc_type?: string
          file_name?: string | null
          file_url?: string
          id?: string
          rider_id?: string
          uploaded_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "rider_documents_rider_id_fkey"
            columns: ["rider_id"]
            isOneToOne: false
            referencedRelation: "riders"
            referencedColumns: ["id"]
          },
        ]
      }
      rider_locations: {
        Row: {
          heading: number | null
          id: string
          lat: number
          lng: number
          rider_id: string
          rider_name: string | null
          speed: number | null
          status: string
          updated_at: string
        }
        Insert: {
          heading?: number | null
          id?: string
          lat: number
          lng: number
          rider_id: string
          rider_name?: string | null
          speed?: number | null
          status?: string
          updated_at?: string
        }
        Update: {
          heading?: number | null
          id?: string
          lat?: number
          lng?: number
          rider_id?: string
          rider_name?: string | null
          speed?: number | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      riders: {
        Row: {
          avatar: string | null
          circulation_card: string | null
          created_at: string
          email: string | null
          id: string
          name: string
          phone: string | null
          rating: number
          status: string
          vehicle_id: string | null
          vehicle_model: string | null
          vehicle_plates: string | null
          vehicle_year: number | null
        }
        Insert: {
          avatar?: string | null
          circulation_card?: string | null
          created_at?: string
          email?: string | null
          id: string
          name: string
          phone?: string | null
          rating?: number
          status?: string
          vehicle_id?: string | null
          vehicle_model?: string | null
          vehicle_plates?: string | null
          vehicle_year?: number | null
        }
        Update: {
          avatar?: string | null
          circulation_card?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name?: string
          phone?: string | null
          rating?: number
          status?: string
          vehicle_id?: string | null
          vehicle_model?: string | null
          vehicle_plates?: string | null
          vehicle_year?: number | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
