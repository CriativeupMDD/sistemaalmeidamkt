import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { MASTER_EMAIL } from "@/lib/supabase/constants";
import { createClient } from "@/lib/supabase/server";

export type AppRole = "master" | "admin_clinica" | "secretaria" | "profissional";

export async function getCurrentSession() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("sb-access-token")?.value;
  const refreshToken = cookieStore.get("sb-refresh-token")?.value;

  if (!accessToken || !refreshToken) {
    return null;
  }

  const supabase = createClient();
  const { data: sessionData, error: sessionError } = await supabase.auth.setSession({
    access_token: accessToken,
    refresh_token: refreshToken
  });

  if (sessionError || !sessionData.session) {
    return null;
  }

  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) {
    return null;
  }

  return {
    session: sessionData.session,
    user: data.user
  };
}

export async function getAuthenticatedSupabase() {
  const current = await getCurrentSession();

  if (!current) {
    return null;
  }

  const supabase = createClient();
  const { error } = await supabase.auth.setSession({
    access_token: current.session.access_token,
    refresh_token: current.session.refresh_token
  });

  if (error) {
    return null;
  }

  return supabase;
}

export async function getCurrentUserProfile() {
  const current = await getCurrentSession();

  if (!current) {
    return null;
  }

  const supabase = createClient();
  const { data: profile } = await supabase
    .from("user_profiles")
    .select("id, tenant_id, full_name, role, email")
    .eq("id", current.user.id)
    .maybeSingle();

  const isMasterEmail = current.user.email?.toLowerCase() === MASTER_EMAIL;

  return {
    user: current.user,
    profile: profile
      ? {
          ...profile,
          role: (isMasterEmail ? "master" : profile.role) as AppRole
        }
      : {
          id: current.user.id,
          tenant_id: null,
          full_name: current.user.email ?? "Usuário",
          email: current.user.email ?? "",
          role: (isMasterEmail ? "master" : "admin_clinica") as AppRole
        }
  };
}

export async function requireMaster() {
  const current = await getCurrentUserProfile();

  if (!current) {
    redirect("/admin/login");
  }

  if (current.profile.role !== "master") {
    redirect("/dashboard");
  }

  return current;
}
