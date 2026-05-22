import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
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

function todayDateOnly() {
  return new Date().toISOString().slice(0, 10);
}

export async function requireActiveClinicAccess() {
  const current = await getCurrentUserProfile();

  if (!current) {
    redirect("/login");
  }

  if (current.profile.role === "master") {
    redirect("/admin");
  }

  if (!current.profile.tenant_id) {
    redirect("/bloqueado");
  }

  const supabase = await getAuthenticatedSupabase();

  if (!supabase) {
    redirect("/login");
  }

  const { data: tenant, error } = await supabase
    .from("tenants")
    .select("id, status, trial_ends_at")
    .eq("id", current.profile.tenant_id)
    .maybeSingle();

  if (error || !tenant) {
    console.error("[auth/clinic] Erro ao validar clinica do usuario", {
      tenantId: current.profile.tenant_id,
      userId: current.user.id,
      error
    });
    redirect("/bloqueado");
  }

  const trialExpired = tenant.status === "trial" && Boolean(tenant.trial_ends_at) && tenant.trial_ends_at! < todayDateOnly();
  const blocked = tenant.status === "bloqueada" || tenant.status === "cancelada" || trialExpired;

  if (trialExpired && process.env.SUPABASE_SERVICE_ROLE_KEY) {
    try {
      const admin = createAdminClient();
      await admin.from("tenants").update({ status: "bloqueada" }).eq("id", tenant.id);
      await admin.from("subscriptions").update({ status: "bloqueada" }).eq("tenant_id", tenant.id);
    } catch (blockError) {
      console.error("[auth/clinic] Trial expirado, mas status nao foi atualizado", {
        tenantId: tenant.id,
        error: blockError
      });
    }
  }

  if (blocked) {
    redirect("/bloqueado");
  }

  return current;
}
