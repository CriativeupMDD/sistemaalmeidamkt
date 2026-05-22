import { Building2, CreditCard, UsersRound } from "lucide-react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { StatCard } from "@/components/dashboard/stat-card";

export default function MasterDashboardPage() {
  return (
    <DashboardShell scope="master" title="Painel master" description="Visão administrativa de todas as clínicas.">
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard title="Clínicas ativas" value="12" icon={Building2} />
        <StatCard title="Usuários" value="86" icon={UsersRound} />
        <StatCard title="MRR previsto" value="R$ 18.900" icon={CreditCard} />
      </div>
    </DashboardShell>
  );
}
