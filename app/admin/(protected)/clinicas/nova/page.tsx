import { DashboardShell } from "@/components/layout/dashboard-shell";
import { TenantForm } from "@/components/admin/tenant-form";
import { createTenantAction } from "../actions";

export default function NewTenantPage() {
  return (
    <DashboardShell scope="master" title="Nova clínica" description="Cadastre a clínica, assinatura e usuário administrador.">
      <TenantForm action={createTenantAction} mode="create" />
    </DashboardShell>
  );
}
