import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { type NextRequest, NextResponse } from "next/server";
import type { Database } from "@/types/database";
import { MASTER_EMAIL } from "@/lib/supabase/constants";

const protectedPrefixes = ["/app", "/dashboard", "/admin"];

function isProtectedPath(pathname: string) {
  if (pathname === "/admin/login") {
    return false;
  }

  return protectedPrefixes.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

function redirectToLogin(request: NextRequest, reason: string) {
  console.error("[middleware/auth] Redirecionando para login", {
    pathname: request.nextUrl.pathname,
    reason
  });

  const loginPath = request.nextUrl.pathname.startsWith("/admin") ? "/admin/login" : "/login";
  const response = NextResponse.redirect(new URL(loginPath, request.url));
  response.cookies.delete("sb-access-token");
  response.cookies.delete("sb-refresh-token");
  return response;
}

function persistSessionCookies(response: NextResponse, session: { access_token: string; expires_in?: number; refresh_token: string }) {
  const secure = process.env.NODE_ENV === "production";

  response.cookies.set("sb-access-token", session.access_token, {
    httpOnly: true,
    maxAge: session.expires_in ?? 60 * 60,
    path: "/",
    sameSite: "lax",
    secure
  });
  response.cookies.set("sb-refresh-token", session.refresh_token, {
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 30,
    path: "/",
    sameSite: "lax",
    secure
  });
}

export async function updateSession(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isLoginPath = pathname === "/login" || pathname === "/admin/login";

  if (!isProtectedPath(pathname) && !isLoginPath) {
    return NextResponse.next({
      request
    });
  }

  const accessToken = request.cookies.get("sb-access-token")?.value;
  const refreshToken = request.cookies.get("sb-refresh-token")?.value;

  if (!accessToken || !refreshToken) {
    return isLoginPath
      ? NextResponse.next({ request })
      : redirectToLogin(request, "cookies de sessao ausentes");
  }

  const supabase = createSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  );

  const { data: sessionData, error: sessionError } = await supabase.auth.setSession({
    access_token: accessToken,
    refresh_token: refreshToken
  });

  if (sessionError || !sessionData.session) {
    console.error("[middleware/auth] Falha ao validar/renovar sessao", {
      pathname,
      error: sessionError
    });
    return isLoginPath
      ? NextResponse.next({ request })
      : redirectToLogin(request, "sessao invalida");
  }

  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError || !userData.user) {
    console.error("[middleware/auth] Falha ao obter usuario autenticado", {
      pathname,
      error: userError
    });
    return isLoginPath
      ? NextResponse.next({ request })
      : redirectToLogin(request, "usuario ausente");
  }

  const userEmail = userData.user.email?.toLowerCase() ?? "";
  let isMaster = userEmail === MASTER_EMAIL;

  if (!isMaster) {
    const { data: profile, error: profileError } = await supabase
      .from("user_profiles")
      .select("role")
      .eq("id", userData.user.id)
      .maybeSingle();

    if (profileError) {
      console.error("[middleware/auth] Erro ao buscar user_profile", {
        pathname,
        userId: userData.user.id,
        email: userEmail,
        error: profileError
      });
    }

    isMaster = profile?.role === "master";
  }

  if (isLoginPath) {
    const response = NextResponse.redirect(new URL(isMaster ? "/admin" : "/dashboard", request.url));
    persistSessionCookies(response, sessionData.session);
    return response;
  }

  if (pathname === "/dashboard" && isMaster) {
    const response = NextResponse.redirect(new URL("/admin", request.url));
    persistSessionCookies(response, sessionData.session);
    return response;
  }

  if (pathname.startsWith("/admin") && !isMaster) {
    const response = NextResponse.redirect(new URL("/dashboard", request.url));
    persistSessionCookies(response, sessionData.session);
    return response;
  }

  const response = NextResponse.next({
    request
  });
  persistSessionCookies(response, sessionData.session);
  return response;
}
