import { DashboardShell } from "@/components/layout/dashboard-shell";
import { ModuleTable } from "@/components/dashboard/module-table";

export default function MasterClinicsPage() {
  return (
    <DashboardShell scope="master" title="Clínicas" description="Gestão das clínicas cadastradas no SaaS.">
      <ModuleTable
        title="Clínicas"
        rows={[
          { name: "Clínica Exemplo", detail: "clinica-exemplo", status: "Ativa" },
          { name: "Saúde Prime", detail: "saude-prime", status: "Ativa" },
          { name: "Nova Unidade", detail: "nova-unidade", status: "Implantação" }
        ]}
      />
    </DashboardShell>
  );
}
