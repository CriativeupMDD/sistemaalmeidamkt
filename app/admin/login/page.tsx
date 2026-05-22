import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { LoginForm } from "@/components/auth/login-form";

export default function AdminLoginPage() {
  return (
    <main className="grid min-h-screen bg-slate-950 text-white lg:grid-cols-[1fr_0.9fr]">
      <section className="relative flex min-h-[42vh] flex-col justify-between overflow-hidden border-b border-cyan-400/20 p-6 lg:min-h-screen lg:border-b-0 lg:border-r lg:p-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_20%,rgba(34,211,238,0.22),transparent_32%),linear-gradient(135deg,rgba(15,23,42,0),rgba(8,47,73,0.58))]" />
        <div className="relative">
          <div className="mb-8 flex size-12 items-center justify-center rounded-md bg-cyan-400 text-slate-950">
            <ShieldCheck className="size-6" />
          </div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-200">
            Administracao geral
          </p>
          <h1 className="mt-5 max-w-2xl text-4xl font-semibold tracking-normal lg:text-5xl">
            Painel para criar e gerenciar clinicas do SaaS.
          </h1>
        </div>
        <div className="relative grid gap-3 text-sm text-slate-300">
          <p>Use este acesso apenas para leads, assinaturas e cadastro de novas clinicas.</p>
          <Link className="font-medium text-cyan-200 hover:text-white" href="/login">
            Ir para login da clinica
          </Link>
        </div>
      </section>
      <section className="flex items-center justify-center bg-slate-900 p-6">
        <LoginForm mode="admin" />
      </section>
    </main>
  );
}
