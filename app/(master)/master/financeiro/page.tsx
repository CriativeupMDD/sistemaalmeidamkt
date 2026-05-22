import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Badge } from "@/components/ui/badge";
import { formatCurrencyFromCents } from "@/lib/format";
import { getAuthenticatedSupabase } from "@/lib/supabase/auth";

const statusLabel = {
  ativa: "Ativa",
  bloqueada: "Bloqueada",
  cancelada: "Cancelada",
  trial: "Teste grátis"
};

export default async function MasterFinancePage() {
  const supabase = await getAuthenticatedSupabase();
  const { data: subscriptions } = supabase
    ? await supabase
        .from("subscriptions")
        .select("id, tenant_id, status, monthly_price_cents, trial_starts_at, trial_ends_at, created_at")
        .order("created_at", { ascending: false })
    : { data: [] };
  const tenantIds = [...new Set((subscriptions ?? []).map((subscription) => subscription.tenant_id))];
  const { data: tenants } =
    supabase && tenantIds.length
      ? await supabase.from("tenants").select("id, name, email").in("id", tenantIds)
      : { data: [] };
  const tenantsById = new Map((tenants ?? []).map((tenant) => [tenant.id, tenant]));

  return (
    <DashboardShell scope="master" title="Financeiro master" description="Assinaturas, trials e receita prevista do SaaS.">
      <div className="overflow-hidden rounded-lg border bg-white">
        <table className="w-full text-sm">
          <thead className="bg-muted/70 text-left text-muted-foreground">
            <tr>
              <th className="px-4 py-3 font-medium">Clínica</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Trial</th>
              <th className="px-4 py-3 font-medium">Mensalidade</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {(subscriptions ?? []).map((subscription) => {
              const tenant = tenantsById.get(subscription.tenant_id);

              return (
                <tr key={subscription.id}>
                  <td className="px-4 py-3">
                    <div className="font-medium">{tenant?.name ?? "Clínica removida"}</div>
                    <div className="text-xs text-muted-foreground">{tenant?.email}</div>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant="secondary">{statusLabel[subscription.status]}</Badge>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {[subscription.trial_starts_at, subscription.trial_ends_at].filter(Boolean).join(" até ") || "-"}
                  </td>
                  <td className="px-4 py-3">{formatCurrencyFromCents(subscription.monthly_price_cents)}</td>
                </tr>
              );
            })}
            {!subscriptions?.length ? (
              <tr>
                <td className="px-4 py-8 text-center text-muted-foreground" colSpan={4}>
                  Nenhuma assinatura cadastrada.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </DashboardShell>
  );
}
