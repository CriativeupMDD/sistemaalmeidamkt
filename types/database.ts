export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      tenants: {
        Row: {
          id: string;
          name: string;
          responsible_name: string;
          email: string;
          phone: string | null;
          document: string | null;
          address: string | null;
          city: string | null;
          state: string | null;
          logo_url: string | null;
          primary_color: string;
          secondary_color: string;
          status: "trial" | "ativa" | "bloqueada" | "cancelada";
          trial_starts_at: string | null;
          trial_ends_at: string | null;
          monthly_price_cents: number;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          responsible_name: string;
          email: string;
          phone?: string | null;
          document?: string | null;
          address?: string | null;
          city?: string | null;
          state?: string | null;
          logo_url?: string | null;
          primary_color?: string;
          secondary_color?: string;
          status?: "trial" | "ativa" | "bloqueada" | "cancelada";
          trial_starts_at?: string | null;
          trial_ends_at?: string | null;
          monthly_price_cents?: number;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["tenants"]["Insert"]>;
        Relationships: [];
      };
      user_profiles: {
        Row: {
          id: string;
          tenant_id: string | null;
          full_name: string;
          email: string;
          role: "master" | "admin_clinica" | "secretaria" | "profissional";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          tenant_id?: string | null;
          full_name: string;
          email: string;
          role?: "master" | "admin_clinica" | "secretaria" | "profissional";
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["user_profiles"]["Insert"]>;
        Relationships: [];
      };
      tenant_settings: {
        Row: {
          id: string;
          tenant_id: string;
          logo_url: string | null;
          primary_color: string;
          secondary_color: string;
          whatsapp_settings: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          tenant_id: string;
          logo_url?: string | null;
          primary_color?: string;
          secondary_color?: string;
          whatsapp_settings?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["tenant_settings"]["Insert"]>;
        Relationships: [];
      };
      subscriptions: {
        Row: {
          id: string;
          tenant_id: string;
          status: "trial" | "ativa" | "bloqueada" | "cancelada";
          monthly_price_cents: number;
          trial_starts_at: string | null;
          trial_ends_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          tenant_id: string;
          status?: "trial" | "ativa" | "bloqueada" | "cancelada";
          monthly_price_cents?: number;
          trial_starts_at?: string | null;
          trial_ends_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["subscriptions"]["Insert"]>;
        Relationships: [];
      };
      landing_leads: {
        Row: {
          id: string;
          clinic_name: string;
          responsible_name: string;
          email: string;
          phone: string;
          city: string | null;
          state: string | null;
          message: string | null;
          status: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          clinic_name: string;
          responsible_name: string;
          email: string;
          phone: string;
          city?: string | null;
          state?: string | null;
          message?: string | null;
          status?: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["landing_leads"]["Insert"]>;
        Relationships: [];
      };
      clinics: {
        Row: {
          id: string;
          name: string;
          slug: string;
          status: "active" | "inactive";
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          status?: "active" | "inactive";
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["clinics"]["Insert"]>;
        Relationships: [];
      };
      profiles: {
        Row: {
          id: string;
          clinic_id: string | null;
          full_name: string;
          role: "master" | "owner" | "professional" | "staff";
          created_at: string;
        };
        Insert: {
          id: string;
          clinic_id?: string | null;
          full_name: string;
          role?: "master" | "owner" | "professional" | "staff";
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
