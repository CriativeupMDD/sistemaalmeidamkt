import Link from "next/link";
import { ArrowRight, Building2, CalendarDays, MessageSquare, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const features = [
  { title: "Multi-clínicas", icon: Building2, text: "Cada clínica opera com dados, equipe, agenda e landing page próprios." },
  { title: "Agenda clínica", icon: CalendarDays, text: "Fluxo preparado para consultas, procedimentos e profissionais." },
  { title: "Chat interno", icon: MessageSquare, text: "Estrutura para conversas da equipe e futura integração com WhatsApp." },
  { title: "Acesso seguro", icon: ShieldCheck, text: "Autenticação Supabase e papéis separados para master e clínica." }
];

export default function HomePage() {
  return (
    <main>
      <section className="border-b bg-white">
        <div className="container grid min-h-[78vh] gap-10 py-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="max-w-3xl">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-primary">
              SaaS de gestão clínica
            </p>
            <h1 className="text-4xl font-semibold tracking-normal text-slate-950 md:text-6xl">
              Sistema Clínica
            </h1>
            <p className="mt-6 text-lg leading-8 text-slate-600">
              Uma base nova em Next.js para operar múltiplas clínicas com landing pages, login, painéis,
              agenda, clientes, financeiro, tarefas e comunicação interna.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link href="/login">
                  Entrar
                  <ArrowRight className="ml-2 size-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/clinica-exemplo">Ver landing de clínica</Link>
              </Button>
            </div>
          </div>

          <div className="rounded-lg border bg-slate-950 p-4 text-white shadow-xl">
            <div className="rounded-md bg-white/10 p-4">
              <div className="mb-6 flex items-center justify-between">
                <span className="text-sm text-slate-300">Operação de hoje</span>
                <span className="rounded-full bg-emerald-400 px-3 py-1 text-xs font-medium text-slate-950">
                  Online
                </span>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {["18 agendamentos", "R$ 8.420 previstos", "6 tarefas abertas", "3 conversas ativas"].map((item) => (
                  <div key={item} className="rounded-md bg-white p-4 text-sm font-medium text-slate-900">
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container grid gap-4 py-10 md:grid-cols-4">
        {features.map((feature) => (
          <Card key={feature.title}>
            <CardHeader>
              <feature.icon className="size-5 text-primary" />
              <CardTitle className="text-base">{feature.title}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">{feature.text}</CardContent>
          </Card>
        ))}
      </section>
    </main>
  );
}
