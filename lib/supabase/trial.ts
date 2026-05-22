import type { User } from "@supabase/supabase-js";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Database } from "@/types/database";

type AppRole = Database["public"]["Tables"]["user_profiles"]["Row"]["role"];
type UserProfile = Pick<
  Database["public"]["Tables"]["user_profiles"]["Row"],
  "email" | "full_name" | "id" | "role" | "tenant_id"
>;

function toDateOnly(date: Date) {
  return date.toISOString().slice(0, 10);
}

function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setUTCDate(next.getUTCDate() + days);
  return next;
}

function getDisplayName(user: User) {
  return (
    user.user_metadata?.full_name ??
    user.user_metadata?.name ??
    user.email?.split("@")[0] ??
    "Novo cliente"
  );
}

function getClinicName(user: User) {
  const name = getDisplayName(user);
  return user.user_metadata?.clinic_name ?? `Clinica ${name}`;
}

export async function ensureTrialAccountForUser(user: User) {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY nao configurada para criar trial via Google.");
  }

  const admin = createAdminClient();
  const email = user.email?.toLowerCase();

  if (!email) {
    throw new Error("Usuario OAuth sem e-mail confirmado.");
  }

  const { data: existingProfile, error: profileError } = await admin
    .from("user_profiles")
    .select("id, tenant_id, full_name, email, role")
    .eq("id", user.id)
    .maybeSingle();

  if (profileError) {
    console.error("[trial] Erro ao buscar perfil existente", {
      userId: user.id,
      email,
      error: profileError
    });
    throw profileError;
  }

  if (existingProfile?.tenant_id) {
    return existingProfile as UserProfile;
  }

  const today = new Date();
  const trialStartsAt = toDateOnly(today);
  const trialEndsAt = toDateOnly(addDays(today, 7));
  const fullName = getDisplayName(user);
  const clinicName = getClinicName(user);

  const { data: tenant, error: tenantError } = await admin
    .from("tenants")
    .insert({
      email,
      monthly_price_cents: 0,
      name: clinicName,
      notes: "Cadastro automatico via Google. Trial de 7 dias.",
      responsible_name: fullName,
      status: "trial",
      trial_ends_at: trialEndsAt,
      trial_starts_at: trialStartsAt
    })
    .select("id")
    .single();

  if (tenantError || !tenant) {
    console.error("[trial] Erro ao criar clinica trial", {
      userId: user.id,
      email,
      error: tenantError
    });
    throw tenantError ?? new Error("Nao foi possivel criar clinica trial.");
  }

  await admin.from("tenant_settings").insert({
    tenant_id: tenant.id
  });

  await admin.from("subscriptions").insert({
    monthly_price_cents: 0,
    status: "trial",
    tenant_id: tenant.id,
    trial_ends_at: trialEndsAt,
    trial_starts_at: trialStartsAt
  });

  const role: AppRole = "admin_clinica";
  const { data: profile, error: upsertError } = await admin
    .from("user_profiles")
    .upsert(
      {
        email,
        full_name: fullName,
        id: user.id,
        role,
        tenant_id: tenant.id
      },
      { onConflict: "id" }
    )
    .select("id, tenant_id, full_name, email, role")
    .single();

  if (upsertError || !profile) {
    console.error("[trial] Erro ao vincular perfil ao trial", {
      userId: user.id,
      email,
      tenantId: tenant.id,
      error: upsertError
    });
    throw upsertError ?? new Error("Nao foi possivel vincular perfil ao trial.");
  }

  const { error: leadError } = await admin.from("landing_leads").insert({
    clinic_name: clinicName,
    email,
    message: `Novo cadastro Google em trial de 7 dias. Inicio: ${trialStartsAt}. Fim: ${trialEndsAt}.`,
    phone: "Nao informado",
    responsible_name: fullName,
    status: "trial_7_dias_google"
  });

  if (leadError) {
    console.error("[trial] Trial criado, mas nao foi possivel registrar lead administrativo", {
      userId: user.id,
      email,
      tenantId: tenant.id,
      error: leadError
    });
  }

  return profile as UserProfile;
}
