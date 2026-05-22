import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { MASTER_EMAIL } from "@/lib/supabase/auth";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as {
    access_token?: string;
    refresh_token?: string;
  } | null;

  if (!body?.access_token || !body.refresh_token) {
    return NextResponse.json({ error: "Sessão inválida." }, { status: 400 });
  }

  const supabase = createClient();
  const { data, error } = await supabase.auth.setSession({
    access_token: body.access_token,
    refresh_token: body.refresh_token
  });

  if (error || !data.session || !data.user) {
    return NextResponse.json({ error: "Não foi possível validar a sessão." }, { status: 401 });
  }

  const user = data.user;

  if (user.email?.toLowerCase() === MASTER_EMAIL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
    const admin = createAdminClient();
    await admin.from("user_profiles").upsert({
      email: MASTER_EMAIL,
      full_name: "Matheus Almeida",
      id: user.id,
      role: "master",
      tenant_id: null
    });
  }

  const cookieStore = await cookies();
  const secure = process.env.NODE_ENV === "production";
  const maxAge = data.session.expires_in ?? 60 * 60;

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

  return NextResponse.json({ ok: true });
}

export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.delete("sb-access-token");
  cookieStore.delete("sb-refresh-token");

  return NextResponse.json({ ok: true });
}
