import Link from "next/link";
import { Edit, Plus, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { formatCurrencyFromCents } from "@/lib/format";
import { getAuthenticatedSupabase } from "@/lib/supabase/auth";
import { deleteTenantAction } from "./actions";

const statusLabel = {
  ativa: "Ativa",
  bloqueada: "Bloqueada",
  cancelada: "Cancelada",
  trial: "Teste grátis"
};

export default async function MasterClinicsPage() {
  const supabase = await getAuthenticatedSupabase();
  const { data: tenants } = supabase
    ? await supabase
        .from("tenants")
        .select("id, name, responsible_name, email, phone, city, state, status, monthly_price_cents, created_at")
        .order("created_at", { ascending: false })
    : { data: [] };

  return (
    <DashboardShell scope="master" title="Clínicas" description="Gestão das clínicas cadastradas no SaaS.">
      <div className="mb-4 flex justify-end">
        <Button asChild>
          <Link href="/master/clinicas/nova">
            <Plus className="mr-2 size-4" />
            Nova clínica
          </Link>
        </Button>
      </div>
      <div className="overflow-hidden rounded-lg border bg-white">
        <table className="w-full text-sm">
          <thead className="bg-muted/70 text-left text-muted-foreground">
            <tr>
              <th className="px-4 py-3 font-medium">Clínica</th>
              <th className="px-4 py-3 font-medium">Responsável</th>
              <th className="px-4 py-3 font-medium">Local</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Mensalidade</th>
              <th className="px-4 py-3 text-right font-medium">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {(tenants ?? []).map((tenant) => (
              <tr key={tenant.id}>
                <td className="px-4 py-3">
                  <div className="font-medium">{tenant.name}</div>
                  <div className="text-xs text-muted-foreground">{tenant.email}</div>
                </td>
                <td className="px-4 py-3">
                  <div>{tenant.responsible_name}</div>
                  <div className="text-xs text-muted-foreground">{tenant.phone}</div>
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {[tenant.city, tenant.state].filter(Boolean).join(" / ") || "-"}
                </td>
                <td className="px-4 py-3">
                  <Badge variant="secondary">{statusLabel[tenant.status]}</Badge>
                </td>
                <td className="px-4 py-3">{formatCurrencyFromCents(tenant.monthly_price_cents)}</td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <Button asChild size="icon" variant="ghost" aria-label="Editar clínica">
                      <Link href={`/master/clinicas/${tenant.id}/editar`}>
                        <Edit className="size-4" />
                      </Link>
                    </Button>
                    <form action={deleteTenantAction.bind(null, tenant.id)}>
                      <Button size="icon" variant="ghost" aria-label="Excluir clínica" type="submit">
                        <Trash2 className="size-4" />
                      </Button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
            {!tenants?.length ? (
              <tr>
                <td className="px-4 py-8 text-center text-muted-foreground" colSpan={6}>
                  Nenhuma clínica cadastrada.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </DashboardShell>
  );
}
