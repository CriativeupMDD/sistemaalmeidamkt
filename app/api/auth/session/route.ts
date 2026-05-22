import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { MASTER_EMAIL } from "@/lib/supabase/constants";
import { createClient } from "@/lib/supabase/server";

type UserProfile = {
  email: string;
  full_name: string;
  id: string;
  role: "master" | "admin_clinica" | "secretaria" | "profissional";
  tenant_id: string | null;
};

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as {
    access_token?: string;
    requested_scope?: "admin" | "clinic";
    refresh_token?: string;
  } | null;

  if (!body?.access_token || !body.refresh_token) {
    console.error("[auth/session] Tokens ausentes no POST de sessao");
    return NextResponse.json({ error: "Sessao invalida." }, { status: 400 });
  }

  const supabase = createClient();
  const { data, error } = await supabase.auth.setSession({
    access_token: body.access_token,
    refresh_token: body.refresh_token
  });

  if (error || !data.session || !data.user) {
    console.error("[auth/session] Nao foi possivel validar a sessao no Supabase Auth", {
      error,
      hasSession: Boolean(data.session),
      hasUser: Boolean(data.user)
    });
    return NextResponse.json({ error: "Nao foi possivel validar a sessao." }, { status: 401 });
  }

  const user = data.user;
  const userEmail = user.email?.toLowerCase() ?? "";
  const isMasterEmail = userEmail === MASTER_EMAIL;
  let profile: UserProfile | null = null;

  try {
    const usesServiceRole = Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY);
    const profileClient = usesServiceRole ? createAdminClient() : supabase;
    const { data: existingProfile, error: profileError } = await profileClient
      .from("user_profiles")
      .select("id, tenant_id, full_name, email, role")
      .eq("id", user.id)
      .maybeSingle();

    if (profileError) {
      console.error("[auth/session] Erro ao buscar user_profile", {
        userId: user.id,
        email: userEmail,
        error: profileError
      });
      return NextResponse.json({ error: "Nao foi possivel buscar o perfil do usuario." }, { status: 500 });
    }

    const nextProfile: UserProfile = {
      email: userEmail,
      full_name: existingProfile?.full_name ?? user.user_metadata?.full_name ?? user.email ?? "Usuario",
      id: user.id,
      role: isMasterEmail ? "master" : existingProfile?.role ?? "admin_clinica",
      tenant_id: isMasterEmail ? null : existingProfile?.tenant_id ?? null
    };

    const profileChanged =
      existingProfile?.role !== nextProfile.role ||
      existingProfile?.email !== nextProfile.email ||
      existingProfile?.tenant_id !== nextProfile.tenant_id;
    const canUpdateExistingProfile = usesServiceRole || isMasterEmail;

    if (!existingProfile) {
      const { data: savedProfile, error: upsertError } = await profileClient
        .from("user_profiles")
        .insert(nextProfile)
        .select("id, tenant_id, full_name, email, role")
        .single();

      if (upsertError) {
        console.error("[auth/session] Erro ao criar user_profile", {
          userId: user.id,
          email: userEmail,
          profile: nextProfile,
          error: upsertError
        });
        return NextResponse.json({ error: "Nao foi possivel preparar o perfil do usuario." }, { status: 500 });
      }

      profile = savedProfile;
    } else if (profileChanged && canUpdateExistingProfile) {
      const { data: savedProfile, error: updateError } = await profileClient
        .from("user_profiles")
        .update(nextProfile)
        .eq("id", user.id)
        .select("id, tenant_id, full_name, email, role")
        .single();

      if (updateError) {
        console.error("[auth/session] Erro ao atualizar user_profile", {
          userId: user.id,
          email: userEmail,
          profile: nextProfile,
          error: updateError
        });
        return NextResponse.json({ error: "Nao foi possivel preparar o perfil do usuario." }, { status: 500 });
      }

      profile = savedProfile;
    } else {
      profile = existingProfile;
    }
  } catch (profileError) {
    console.error("[auth/session] Erro inesperado ao preparar user_profile", {
      userId: user.id,
      email: userEmail,
      error: profileError
    });
    return NextResponse.json({ error: "Nao foi possivel preparar o perfil do usuario." }, { status: 500 });
  }

  const cookieStore = await cookies();
  const secure = process.env.NODE_ENV === "production";
  const maxAge = data.session.expires_in ?? 60 * 60;
  const redirectTo = isMasterEmail || profile?.role === "master" ? "/admin" : "/dashboard";

  if (body.requested_scope === "admin" && redirectTo !== "/admin") {
    console.error("[auth/session] Usuario sem permissao tentou acessar login administrativo", {
      userId: user.id,
      email: userEmail,
      role: profile?.role
    });
    return NextResponse.json({ error: "Este acesso e exclusivo para administradores gerais." }, { status: 403 });
  }

  cookieStore.set("sb-access-token", data.session.access_token, {
    httpOnly: true,
    maxAge,
    path: "/",
    sameSite: "lax",
    secure
  });
  cookieStore.set("sb-refresh-token", data.session.refresh_token, {
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 30,
    path: "/",
    sameSite: "lax",
    secure
  });

  return NextResponse.json({
    ok: true,
    profile,
    redirectTo
  });
}

export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.delete("sb-access-token");
  cookieStore.delete("sb-refresh-token");

  return NextResponse.json({ ok: true });
}
