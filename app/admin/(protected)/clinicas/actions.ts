"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireMaster } from "@/lib/supabase/auth";
import { parseCurrencyToCents, toNullableString } from "@/lib/format";

function getTenantPayload(formData: FormData) {
  return {
    name: String(formData.get("name") ?? "").trim(),
    responsible_name: String(formData.get("responsible_name") ?? "").trim(),
    email: String(formData.get("email") ?? "").trim().toLowerCase(),
    phone: toNullableString(formData.get("phone")),
    document: toNullableString(formData.get("document")),
    address: toNullableString(formData.get("address")),
    city: toNullableString(formData.get("city")),
    state: toNullableString(formData.get("state")),
    logo_url: toNullableString(formData.get("logo_url")),
    primary_color: String(formData.get("primary_color") ?? "#0f766e"),
    secondary_color: String(formData.get("secondary_color") ?? "#f59e0b"),
    status: String(formData.get("status") ?? "trial") as "trial" | "ativa" | "bloqueada" | "cancelada",
    trial_starts_at: toNullableString(formData.get("trial_starts_at")),
    trial_ends_at: toNullableString(formData.get("trial_ends_at")),
    monthly_price_cents: parseCurrencyToCents(formData.get("monthly_price")),
    notes: toNullableString(formData.get("notes"))
  };
}

export async function createTenantAction(formData: FormData) {
  await requireMaster();
  const supabase = createAdminClient();
  const tenantPayload = getTenantPayload(formData);

  if (!tenantPayload.name || !tenantPayload.responsible_name || !tenantPayload.email) {
    throw new Error("Nome, responsável e e-mail da clínica são obrigatórios.");
  }

  const { data: tenant, error: tenantError } = await supabase
    .from("tenants")
    .insert(tenantPayload)
    .select("id")
    .single();

  if (tenantError || !tenant) {
    throw new Error(tenantError?.message ?? "Não foi possível cadastrar a clínica.");
  }

  const subscriptionPayload = {
    tenant_id: tenant.id,
    status: tenantPayload.status,
    monthly_price_cents: tenantPayload.monthly_price_cents,
    trial_starts_at: tenantPayload.trial_starts_at,
    trial_ends_at: tenantPayload.trial_ends_at
  };

  await supabase.from("tenant_settings").insert({
    tenant_id: tenant.id,
    logo_url: tenantPayload.logo_url,
    primary_color: tenantPayload.primary_color,
    secondary_color: tenantPayload.secondary_color
  });
  await supabase.from("subscriptions").insert(subscriptionPayload);

  const adminName = String(formData.get("admin_name") ?? "").trim();
  const adminEmail = String(formData.get("admin_email") ?? "").trim().toLowerCase();
  const adminPassword = String(formData.get("admin_password") ?? "");

  if (adminName && adminEmail && adminPassword) {
    const { data: createdUser, error: createUserError } = await supabase.auth.admin.createUser({
      email: adminEmail,
      email_confirm: true,
      password: adminPassword,
      user_metadata: {
        full_name: adminName,
        role: "admin_clinica",
        tenant_id: tenant.id
      }
    });

    if (createUserError || !createdUser.user) {
      throw new Error(createUserError?.message ?? "Clínica criada, mas o usuário admin não foi criado.");
    }

    await supabase.from("user_profiles").upsert({
      email: adminEmail,
      full_name: adminName,
      id: createdUser.user.id,
      role: "admin_clinica",
      tenant_id: tenant.id
    });
  }

  revalidatePath("/admin");
  revalidatePath("/admin/clinicas");
  redirect("/admin/clinicas");
}

export async function updateTenantAction(tenantId: string, formData: FormData) {
  await requireMaster();
  const supabase = createAdminClient();
  const tenantPayload = getTenantPayload(formData);

  const { error } = await supabase.from("tenants").update(tenantPayload).eq("id", tenantId);

  if (error) {
    throw new Error(error.message);
  }

  await supabase.from("tenant_settings").upsert({
    logo_url: tenantPayload.logo_url,
    primary_color: tenantPayload.primary_color,
    secondary_color: tenantPayload.secondary_color,
    tenant_id: tenantId
  });

  await supabase.from("subscriptions").upsert({
    monthly_price_cents: tenantPayload.monthly_price_cents,
    status: tenantPayload.status,
    tenant_id: tenantId,
    trial_ends_at: tenantPayload.trial_ends_at,
    trial_starts_at: tenantPayload.trial_starts_at
  });

  revalidatePath("/admin");
  revalidatePath("/admin/clinicas");
  redirect("/admin/clinicas");
}

export async function deleteTenantAction(tenantId: string) {
  await requireMaster();
  const supabase = createAdminClient();
  const { error } = await supabase.from("tenants").delete().eq("id", tenantId);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin");
  revalidatePath("/admin/clinicas");
}
