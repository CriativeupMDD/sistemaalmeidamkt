import { notFound } from "next/navigation";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { TenantForm } from "@/components/master/tenant-form";
import { getAuthenticatedSupabase } from "@/lib/supabase/auth";
import { updateTenantAction } from "../../actions";

type EditTenantPageProps = {
  params: Promise<{
    tenantId: string;
  }>;
};

export default async function EditTenantPage({ params }: EditTenantPageProps) {
  const { tenantId } = await params;
  const supabase = await getAuthenticatedSupabase();
  const { data: tenant } = supabase
    ? await supabase.from("tenants").select("*").eq("id", tenantId).maybeSingle()
    : { data: null };

  if (!tenant) {
    notFound();
  }

  return (
    <DashboardShell scope="master" title="Editar clínica" description="Atualize os dados cadastrais e comerciais da clínica.">
      <TenantForm action={updateTenantAction.bind(null, tenant.id)} mode="edit" tenant={tenant} />
    </DashboardShell>
  );
}
