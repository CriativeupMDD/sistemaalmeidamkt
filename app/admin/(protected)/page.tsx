import { Building2, CreditCard, Inbox, Lock, Sparkles } from "lucide-react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { StatCard } from "@/components/dashboard/stat-card";
import { formatCurrencyFromCents } from "@/lib/format";
import { getAuthenticatedSupabase } from "@/lib/supabase/auth";

export default async function MasterDashboardPage() {
  const supabase = await getAuthenticatedSupabase();

  if (!supabase) {
    return null;
  }

  const { data: tenants } = await supabase.from("tenants").select("id, status, monthly_price_cents");
  const { count: leadsCount } = await supabase
    .from("landing_leads")
    .select("id", { count: "exact", head: true });

  const rows = tenants ?? [];
  const active = rows.filter((tenant) => tenant.status === "ativa");
  const trial = rows.filter((tenant) => tenant.status === "trial");
  const blocked = rows.filter((tenant) => tenant.status === "bloqueada");
  const monthlyRevenue = active.reduce((total, tenant) => total + tenant.monthly_price_cents, 0);

  return (
    <DashboardShell scope="master" title="Painel admin" description="Visão administrativa de todas as clínicas.">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
        <StatCard title="Total de clínicas" value={String(rows.length)} icon={Building2} />
        <StatCard title="Clínicas ativas" value={String(active.length)} icon={Building2} />
        <StatCard title="Teste grátis" value={String(trial.length)} icon={Sparkles} />
        <StatCard title="Bloqueadas" value={String(blocked.length)} icon={Lock} />
        <StatCard title="Leads recebidos" value={String(leadsCount ?? 0)} icon={Inbox} />
        <StatCard title="Receita mensal prevista" value={formatCurrencyFromCents(monthlyRevenue)} icon={CreditCard} />
      </div>
    </DashboardShell>
  );
}
