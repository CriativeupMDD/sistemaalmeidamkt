"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { toNullableString } from "@/lib/format";

type LeadState = {
  ok: boolean;
  message: string;
};

export async function createLandingLeadAction(_: LeadState, formData: FormData): Promise<LeadState> {
  const clinicName = String(formData.get("clinic_name") ?? "").trim();
  const responsibleName = String(formData.get("responsible_name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const phone = String(formData.get("phone") ?? "").trim();

  if (!clinicName || !responsibleName || !email || !phone) {
    return {
      ok: false,
      message: "Preencha nome da clínica, responsável, e-mail e telefone."
    };
  }

  try {
    const supabase = createAdminClient();
    const { error } = await supabase.from("landing_leads").insert({
      city: toNullableString(formData.get("city")),
      clinic_name: clinicName,
      email,
      message: toNullableString(formData.get("message")),
      phone,
      responsible_name: responsibleName,
      state: toNullableString(formData.get("state")),
      status: "novo"
    });

    if (error) {
      return {
        ok: false,
        message: error.message
      };
    }

    return {
      ok: true,
      message: "Cadastro enviado. Vou entrar em contato com você em breve."
    };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Não foi possível enviar o cadastro."
    };
  }
}
