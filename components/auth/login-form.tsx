"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";

type SessionResponse = {
  error?: string;
  redirectTo?: string;
};

type LoginFormProps = {
  mode?: "admin" | "clinic";
};

export function LoginForm({ mode = "clinic" }: LoginFormProps) {
  const router = useRouter();
  const isAdminMode = mode === "admin";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isLoading) {
      return;
    }

    setIsLoading(true);
    setMessage(null);

    const normalizedEmail = email.trim().toLowerCase();

    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signInWithPassword({
        email: normalizedEmail,
        password
      });

      if (error || !data.session || !data.user) {
        console.error("[login] Falha ao autenticar no Supabase Auth", {
          email: normalizedEmail,
          error
        });
        setMessage(error?.message ?? "Nao foi possivel iniciar a sessao.");
        return;
      }

      const controller = new AbortController();
      const timeout = window.setTimeout(() => controller.abort(), 15000);

      const sessionResponse = await fetch("/api/auth/session", {
        body: JSON.stringify({
          access_token: data.session.access_token,
          refresh_token: data.session.refresh_token,
          requested_scope: mode
        }),
        headers: {
          "Content-Type": "application/json"
        },
        method: "POST",
        signal: controller.signal
      }).finally(() => window.clearTimeout(timeout));

      const sessionPayload = (await sessionResponse.json().catch(() => null)) as SessionResponse | null;

      if (!sessionResponse.ok || !sessionPayload?.redirectTo) {
        console.error("[login] Falha ao criar sessao/perfil no servidor", {
          email: normalizedEmail,
          status: sessionResponse.status,
          payload: sessionPayload
        });
        setMessage(sessionPayload?.error ?? "Login realizado, mas nao foi possivel iniciar a sessao do painel.");
        await supabase.auth.signOut();
        return;
      }

      router.replace(sessionPayload.redirectTo);
    } catch (error) {
      console.error("[login] Erro inesperado no fluxo de login", {
        email: normalizedEmail,
        error
      });
      setMessage("Nao foi possivel acessar agora. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className={isAdminMode ? "w-full max-w-md border-slate-800 bg-slate-950 text-white shadow-2xl shadow-cyan-950/30" : "w-full max-w-md"}>
      <CardHeader>
        <CardTitle>{isAdminMode ? "Admin Geral" : "Entrar"}</CardTitle>
        <CardDescription className={isAdminMode ? "text-slate-300" : undefined}>
          {isAdminMode
            ? "Acesso restrito para administrar clinicas, leads e assinaturas."
            : "Acesse o painel operacional da sua clinica."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="grid gap-4" onSubmit={handleSubmit}>
          <div className="grid gap-2">
            <Label className={isAdminMode ? "text-slate-100" : undefined} htmlFor="email">E-mail</Label>
            <Input
              id="email"
              autoComplete="email"
              className={isAdminMode ? "border-slate-700 bg-slate-900 text-white placeholder:text-slate-500" : undefined}
              onChange={(event) => setEmail(event.target.value)}
              placeholder={isAdminMode ? "admin@empresa.com" : "voce@clinica.com"}
              required
              type="email"
              value={email}
            />
          </div>
          <div className="grid gap-2">
            <Label className={isAdminMode ? "text-slate-100" : undefined} htmlFor="password">Senha</Label>
            <Input
              id="password"
              autoComplete="current-password"
              className={isAdminMode ? "border-slate-700 bg-slate-900 text-white" : undefined}
              onChange={(event) => setPassword(event.target.value)}
              required
              type="password"
              value={password}
            />
          </div>
          {message ? <p className={isAdminMode ? "text-sm text-cyan-200" : "text-sm text-destructive"}>{message}</p> : null}
          <Button
            className={isAdminMode ? "bg-cyan-400 text-slate-950 hover:bg-cyan-300" : undefined}
            disabled={isLoading}
            type="submit"
          >
            {isLoading ? <Loader2 className="mr-2 size-4 animate-spin" /> : <LogIn className="mr-2 size-4" />}
            {isAdminMode ? "Acessar admin" : "Acessar"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
