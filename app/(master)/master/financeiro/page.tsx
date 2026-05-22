import { DashboardShell } from "@/components/layout/dashboard-shell";
import { ModuleTable } from "@/components/dashboard/module-table";

export default function MasterFinancePage() {
  return (
    <DashboardShell scope="master" title="Financeiro master" description="Assinaturas, planos e receitas do SaaS.">
      <ModuleTable
        title="Assinaturas"
        rows={[
          { name: "Clínica Exemplo", detail: "Plano Pro", status: "Em dia" },
          { name: "Saúde Prime", detail: "Plano Basic", status: "Em dia" },
          { name: "Nova Unidade", detail: "Trial", status: "Implantação" }
        ]}
      />
    </DashboardShell>
  );
}
