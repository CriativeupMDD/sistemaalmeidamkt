import Link from "next/link";
import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage() {
  return (
    <main className="grid min-h-screen bg-white lg:grid-cols-[0.9fr_1.1fr]">
      <section className="hidden border-r bg-emerald-950 p-10 text-white lg:flex lg:flex-col lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-300">
            Sistema Clinica
          </p>
          <h1 className="mt-6 text-4xl font-semibold tracking-normal">
            Area operacional da clinica
          </h1>
        </div>
        <div className="grid gap-3">
          <p className="max-w-md text-sm leading-6 text-emerald-100">
            Acesso para equipes acompanharem agenda, clientes, procedimentos e financeiro da unidade.
          </p>
          <Link className="text-sm font-medium text-emerald-200 hover:text-white" href="/admin/login">
            Entrar como administrador geral
          </Link>
        </div>
      </section>
      <section className="flex items-center justify-center p-6">
        <LoginForm />
      </section>
    </main>
  );
}
