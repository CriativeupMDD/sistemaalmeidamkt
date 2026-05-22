"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

type SessionResponse = {
  error?: string;
  redirectTo?: string;
};

function sleep(ms: number) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

export default function AuthCallbackPage() {
  const router = useRouter();
  const hasStarted = useRef(false);
  const [hasError, setHasError] = useState(false);
  const [message, setMessage] = useState("Finalizando login com Google...");

  useEffect(() => {
    let mounted = true;

    if (hasStarted.current) {
      return () => {
        mounted = false;
      };
    }

    hasStarted.current = true;

    async function finishOAuth() {
      const supabase = createClient();

      try {
        const url = new URL(window.location.href);
        const oauthError = url.searchParams.get("error_description") ?? url.searchParams.get("error");

        if (oauthError) {
          console.error("[auth/callback] Erro retornado pelo OAuth", {
            oauthError,
            search: window.location.search
          });
          setHasError(true);
          setMessage("Nao foi possivel concluir o login com Google.");
          return;
        }

        const code = url.searchParams.get("code");

        if (!code) {
          console.error("[auth/callback] Callback OAuth sem parametro code", {
            hashPresent: Boolean(window.location.hash),
            search: window.location.search,
            url: window.location.href
          });
          setHasError(true);
          setMessage("Nao foi possivel validar o retorno do Google.");
          return;
        }

        const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

        if (exchangeError) {
          console.error("[auth/callback] Falha ao trocar code OAuth por sessao", {
            codeLength: code.length,
            error: exchangeError,
            search: window.location.search
          });
          setHasError(true);
          setMessage("Nao foi possivel validar sua conta Google.");
          return;
        }

        let { data: sessionData, error: sessionError } = await supabase.auth.getSession();

        for (let attempt = 1; !sessionData.session && attempt <= 8; attempt += 1) {
          await sleep(250);
          ({ data: sessionData, error: sessionError } = await supabase.auth.getSession());
        }

        if (sessionError || !sessionData.session) {
          console.error("[auth/callback] Sessao OAuth ausente apos callback", {
            codePresent: Boolean(code),
            error: sessionError,
            hashPresent: Boolean(window.location.hash),
            search: window.location.search
          });
          setHasError(true);
          setMessage("Nao foi possivel iniciar a sessao com Google.");
          return;
        }

        const { data: userData, error: userError } = await supabase.auth.getUser();

        if (userError || !userData.user) {
          console.error("[auth/callback] Sessao criada, mas usuario nao foi identificado", {
            error: userError,
            sessionUserId: sessionData.session.user?.id
          });
          setHasError(true);
          setMessage("Nao foi possivel identificar seu usuario Google.");
          return;
        }

        const userEmail = userData.user.email?.toLowerCase() ?? "";
        const requestedScope = userEmail === "matheus@almeidamkt.com.br" ? "clinic" : "clinic_signup";

        const sessionResponse = await fetch("/api/auth/session", {
          body: JSON.stringify({
            access_token: sessionData.session.access_token,
            refresh_token: sessionData.session.refresh_token,
            requested_scope: requestedScope
          }),
          headers: {
            "Content-Type": "application/json"
          },
          method: "POST"
        });

        const sessionPayload = (await sessionResponse.json().catch(() => null)) as SessionResponse | null;

        if (!sessionResponse.ok || !sessionPayload?.redirectTo) {
          console.error("[auth/callback] Falha ao preparar sessao/cadastro Google", {
            email: userEmail,
            requestedScope,
            status: sessionResponse.status,
            payload: sessionPayload
          });
          await supabase.auth.signOut();
          setHasError(true);
          setMessage(sessionPayload?.error ?? "Nao foi possivel finalizar o login com Google.");
          return;
        }

        if (mounted) {
          router.replace(sessionPayload.redirectTo);
        }
      } catch (error) {
        console.error("[auth/callback] Erro inesperado no callback OAuth", { error });
        setHasError(true);
        setMessage("Nao foi possivel finalizar o cadastro.");
      }
    }

    finishOAuth();

    return () => {
      mounted = false;
    };
  }, [router]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
      <section className="flex w-full max-w-sm flex-col items-center gap-4 rounded-lg border bg-white p-8 text-center shadow-sm">
        {!hasError ? <Loader2 className="size-6 animate-spin text-primary" /> : null}
        <p className="text-sm text-muted-foreground">{message}</p>
        {hasError ? (
          <Button asChild>
            <Link href="/login">Voltar ao login</Link>
          </Button>
        ) : null}
      </section>
    </main>
  );
}
