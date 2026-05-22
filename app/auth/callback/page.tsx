"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type SessionResponse = {
  error?: string;
  redirectTo?: string;
};

export default function AuthCallbackPage() {
  const router = useRouter();
  const [message, setMessage] = useState("Finalizando login com Google...");

  useEffect(() => {
    let mounted = true;

    async function finishOAuth() {
      const supabase = createClient();

      try {
        const url = new URL(window.location.href);
        const oauthError = url.searchParams.get("error_description") ?? url.searchParams.get("error");

        if (oauthError) {
          console.error("[auth/callback] Erro retornado pelo OAuth", { oauthError });
          setMessage("Nao foi possivel concluir o login com Google.");
          return;
        }

        const code = url.searchParams.get("code");

        if (code) {
          const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

          if (exchangeError) {
            console.error("[auth/callback] Falha ao trocar code por sessao", { error: exchangeError });
            setMessage("Nao foi possivel validar sua conta Google.");
            return;
          }
        }

        const { data, error } = await supabase.auth.getSession();

        if (error || !data.session) {
          console.error("[auth/callback] Sessao OAuth ausente apos callback", { error });
          setMessage("Nao foi possivel iniciar a sessao com Google.");
          return;
        }

        const sessionResponse = await fetch("/api/auth/session", {
          body: JSON.stringify({
            access_token: data.session.access_token,
            refresh_token: data.session.refresh_token,
            requested_scope: "clinic"
          }),
          headers: {
            "Content-Type": "application/json"
          },
          method: "POST"
        });

        const sessionPayload = (await sessionResponse.json().catch(() => null)) as SessionResponse | null;

        if (!sessionResponse.ok || !sessionPayload?.redirectTo) {
          console.error("[auth/callback] Falha ao preparar cadastro trial", {
            status: sessionResponse.status,
            payload: sessionPayload
          });
          await supabase.auth.signOut();
          setMessage(sessionPayload?.error ?? "Nao foi possivel finalizar o login com Google.");
          return;
        }

        if (mounted) {
          router.replace(sessionPayload.redirectTo);
        }
      } catch (error) {
        console.error("[auth/callback] Erro inesperado no callback OAuth", { error });
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
        <Loader2 className="size-6 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">{message}</p>
      </section>
    </main>
  );
}
