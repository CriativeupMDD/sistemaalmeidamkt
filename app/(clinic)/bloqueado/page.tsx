import Link from "next/link";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function BlockedPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
      <section className="w-full max-w-lg rounded-lg border bg-white p-8 text-center shadow-sm">
        <div className="mx-auto mb-5 flex size-12 items-center justify-center rounded-md bg-slate-950 text-white">
          <Lock className="size-5" />
        </div>
        <h1 className="text-2xl font-semibold tracking-normal">Acesso bloqueado</h1>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          O periodo gratuito de 7 dias terminou ou a assinatura da clinica esta bloqueada.
          Entre em contato com o suporte para ativar o acesso.
        </p>
        <Button asChild className="mt-6">
          <Link href="/login">Voltar para o login</Link>
        </Button>
      </section>
    </main>
  );
}
