import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage() {
  return (
    <main className="grid min-h-screen bg-white lg:grid-cols-[0.9fr_1.1fr]">
      <section className="hidden border-r bg-slate-950 p-10 text-white lg:flex lg:flex-col lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-300">
            Sistema Clínica
          </p>
          <h1 className="mt-6 text-4xl font-semibold tracking-normal">
            Operação clínica com papéis, unidades e dados separados.
          </h1>
        </div>
        <p className="max-w-md text-sm leading-6 text-slate-300">
          Login preparado para Supabase Auth, com roteamento futuro por perfil master, dono,
          profissional e colaborador.
        </p>
      </section>
      <section className="flex items-center justify-center p-6">
        <LoginForm />
      </section>
    </main>
  );
}
