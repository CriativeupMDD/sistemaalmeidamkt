export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
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
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
