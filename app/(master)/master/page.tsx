import { Building2, CreditCard, Lock, Sparkles } from "lucide-react";
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

  const rows = tenants ?? [];
  const active = rows.filter((tenant) => tenant.status === "ativa");
  const trial = rows.filter((tenant) => tenant.status === "trial");
  const blocked = rows.filter((tenant) => tenant.status === "bloqueada");
  const monthlyRevenue = active.reduce((total, tenant) => total + tenant.monthly_price_cents, 0);

  return (
    <DashboardShell scope="master" title="Painel master" description="Visão administrativa de todas as clínicas.">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <StatCard title="Total de clínicas" value={String(rows.length)} icon={Building2} />
        <StatCard title="Clínicas ativas" value={String(active.length)} icon={Building2} />
        <StatCard title="Teste grátis" value={String(trial.length)} icon={Sparkles} />
        <StatCard title="Bloqueadas" value={String(blocked.length)} icon={Lock} />
        <StatCard title="Receita mensal prevista" value={formatCurrencyFromCents(monthlyRevenue)} icon={CreditCard} />
      </div>
    </DashboardShell>
  );
}
