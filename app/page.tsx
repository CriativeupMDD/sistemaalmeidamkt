import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  Building2,
  CalendarDays,
  CheckCircle2,
  MessageSquare,
  ShieldCheck,
  UsersRound
} from "lucide-react";
import { LeadFormModal } from "@/components/marketing/lead-form-modal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const features = [
  { title: "Multi-clínicas", icon: Building2, text: "Controle várias unidades com dados separados por tenant." },
  { title: "Agenda completa", icon: CalendarDays, text: "Organize consultas, procedimentos, profissionais e retornos." },
  { title: "Clientes e equipe", icon: UsersRound, text: "Centralize histórico, responsáveis e relacionamento da clínica." },
  { title: "Financeiro", icon: BarChart3, text: "Acompanhe mensalidades, previsões, entradas e despesas." },
  { title: "Chat interno", icon: MessageSquare, text: "Equipe alinhada hoje e estrutura pronta para WhatsApp no futuro." },
  { title: "Permissões", icon: ShieldCheck, text: "Master, administrador da clínica, secretária e profissional." }
];

const highlights = [
  "Landing individual para cada clínica",
  "Painel admin para gerenciar clientes SaaS",
  "Cadastro de clínicas e usuários administradores",
  "Base preparada para crescer com Supabase e Vercel"
];

export default function HomePage() {
  return (
    <main className="bg-white">
      <header className="sticky top-0 z-30 border-b bg-white/90 backdrop-blur">
        <div className="container flex h-16 items-center justify-between gap-4">
          <Link href="/" className="font-semibold text-slate-950">
            Sistema Clínica
          </Link>
          <nav className="hidden items-center gap-6 text-sm text-slate-600 md:flex">
            <a href="#recursos">Recursos</a>
            <a href="#operacao">Operação</a>
            <Link href="/login">Login</Link>
          </nav>
          <LeadFormModal />
        </div>
      </header>

      <section className="border-b bg-slate-50">
        <div className="container grid min-h-[calc(100vh-4rem)] gap-10 py-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div className="max-w-3xl">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-primary">
              SaaS profissional para clínicas
            </p>
            <h1 className="text-4xl font-semibold tracking-normal text-slate-950 md:text-6xl">
              Gestão moderna para clínicas que querem crescer com organização.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
              Controle agenda, clientes, profissionais, financeiro, tarefas e comunicação em uma plataforma
              multi-clínicas preparada para operação real.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <LeadFormModal />
              <Button asChild size="lg" variant="outline">
                <Link href="/login">
                  Acessar painel
                  <ArrowRight className="ml-2 size-4" />
                </Link>
              </Button>
            </div>
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {highlights.map((item) => (
                <div className="flex items-center gap-2 text-sm text-slate-700" key={item}>
                  <CheckCircle2 className="size-4 text-primary" />
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-lg border bg-slate-950 p-4 text-white shadow-xl">
            <div className="rounded-md bg-white/10 p-5">
              <div className="mb-6 flex items-center justify-between">
                <span className="text-sm text-slate-300">Painel operacional</span>
                <span className="rounded-full bg-emerald-400 px-3 py-1 text-xs font-medium text-slate-950">
                  Online
                </span>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {["Agenda por profissional", "Clientes por clínica", "Financeiro recorrente", "Leads no admin"].map(
                  (item) => (
                    <div key={item} className="rounded-md bg-white p-4 text-sm font-medium text-slate-900">
                      {item}
                    </div>
                  )
                )}
              </div>
              <div className="mt-4 rounded-md border border-white/10 bg-white/5 p-4">
                <p className="text-sm font-medium">Fluxo comercial</p>
                <p className="mt-2 text-sm leading-6 text-slate-300">
                  O visitante preenche o cadastro e o contato aparece no Painel admin para acompanhamento.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container py-12" id="recursos">
        <div className="mb-6 max-w-2xl">
          <h2 className="text-2xl font-semibold text-slate-950">Recursos essenciais para operar melhor</h2>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Uma base limpa, responsiva e pronta para conectar cada clínica ao seu próprio ambiente.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {features.map((feature) => (
            <Card key={feature.title}>
              <CardHeader>
                <feature.icon className="size-5 text-primary" />
                <CardTitle className="text-base">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm leading-6 text-muted-foreground">{feature.text}</CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="border-t bg-slate-950 text-white" id="operacao">
        <div className="container grid gap-8 py-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
          <div>
            <h2 className="text-3xl font-semibold">Pronto para transformar interesse em cliente.</h2>
            <p className="mt-4 text-sm leading-6 text-slate-300">
              O formulário da landing alimenta o Painel admin, permitindo que você entre em contato com clínicas
              interessadas e converta o cadastro em tenant ativo.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {["Cadastrar lead", "Contato no admin", "Criar clínica"].map((step, index) => (
              <div className="rounded-md bg-white p-4 text-slate-950" key={step}>
                <div className="mb-3 flex size-8 items-center justify-center rounded-full bg-primary text-sm font-semibold text-white">
                  {index + 1}
                </div>
                <p className="text-sm font-medium">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
