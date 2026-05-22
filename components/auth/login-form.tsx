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

export function LoginForm() {
  const router = useRouter();
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
          refresh_token: data.session.refresh_token
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
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Entrar</CardTitle>
        <CardDescription>Acesse o painel da clinica ou a administracao master.</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="grid gap-4" onSubmit={handleSubmit}>
          <div className="grid gap-2">
            <Label htmlFor="email">E-mail</Label>
            <Input
              id="email"
              autoComplete="email"
              onChange={(event) => setEmail(event.target.value)}
              placeholder="voce@clinica.com"
              required
              type="email"
              value={email}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Senha</Label>
            <Input
              id="password"
              autoComplete="current-password"
              onChange={(event) => setPassword(event.target.value)}
              required
              type="password"
              value={password}
            />
          </div>
          {message ? <p className="text-sm text-destructive">{message}</p> : null}
          <Button disabled={isLoading} type="submit">
            {isLoading ? <Loader2 className="mr-2 size-4 animate-spin" /> : <LogIn className="mr-2 size-4" />}
            Acessar
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
