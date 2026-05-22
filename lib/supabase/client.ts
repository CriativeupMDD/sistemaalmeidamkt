"use client";

import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !anonKey) {
    console.error("[supabase/client] Variaveis publicas do Supabase ausentes", {
      hasAnonKey: Boolean(anonKey),
      hasSupabaseUrl: Boolean(supabaseUrl)
    });
    throw new Error("Supabase client nao configurado.");
  }

  if (!anonKey.startsWith("eyJ")) {
    console.error("[supabase/client] NEXT_PUBLIC_SUPABASE_ANON_KEY parece invalida para uso no browser", {
      anonKeyPrefix: anonKey.slice(0, 8),
      expectedPrefix: "eyJ",
      supabaseUrl
    });
  }

  return createSupabaseClient<Database>(supabaseUrl, anonKey);
}
