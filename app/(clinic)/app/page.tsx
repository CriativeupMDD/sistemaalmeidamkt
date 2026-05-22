import { CalendarDays, CircleDollarSign, ListChecks, UsersRound } from "lucide-react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { StatCard } from "@/components/dashboard/stat-card";

export default function ClinicDashboardPage() {
  return (
    <DashboardShell scope="clinic" title="Painel da clínica" description="Resumo operacional da unidade selecionada.">
      <div className="grid gap-4 md:grid-cols-4">
        <StatCard title="Clientes" value="248" icon={UsersRound} />
        <StatCard title="Agenda hoje" value="18" icon={CalendarDays} />
        <StatCard title="Tarefas" value="6" icon={ListChecks} />
        <StatCard title="Receita prevista" value="R$ 8.420" icon={CircleDollarSign} />
      </div>
    </DashboardShell>
  );
}
