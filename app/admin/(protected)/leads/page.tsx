import { Mail, Phone } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { getAuthenticatedSupabase } from "@/lib/supabase/auth";

export default async function MasterLeadsPage() {
  const supabase = await getAuthenticatedSupabase();
  const { data: leads } = supabase
    ? await supabase
        .from("landing_leads")
        .select("id, clinic_name, responsible_name, email, phone, city, state, message, status, created_at")
        .order("created_at", { ascending: false })
    : { data: [] };

  return (
    <DashboardShell scope="master" title="Leads" description="Cadastros enviados pela landing page.">
      <div className="grid gap-4">
        {(leads ?? []).map((lead) => (
          <div className="rounded-lg border bg-white p-5" key={lead.id}>
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <h2 className="text-lg font-semibold">{lead.clinic_name}</h2>
                  <Badge variant="secondary">{lead.status}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {lead.responsible_name}
                  {[lead.city, lead.state].filter(Boolean).length
                    ? ` · ${[lead.city, lead.state].filter(Boolean).join(" / ")}`
                    : ""}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button asChild variant="outline">
                  <a href={`mailto:${lead.email}`}>
                    <Mail className="mr-2 size-4" />
                    E-mail
                  </a>
                </Button>
                <Button asChild>
                  <a href={`https://wa.me/${lead.phone.replace(/\D/g, "")}`} target="_blank" rel="noreferrer">
                    <Phone className="mr-2 size-4" />
                    Contatar
                  </a>
                </Button>
              </div>
            </div>
            <div className="mt-4 grid gap-2 text-sm text-slate-700 md:grid-cols-2">
              <p>
                <span className="font-medium">E-mail:</span> {lead.email}
              </p>
              <p>
                <span className="font-medium">Telefone:</span> {lead.phone}
              </p>
            </div>
            {lead.message ? (
              <p className="mt-4 rounded-md bg-slate-50 p-3 text-sm leading-6 text-slate-600">{lead.message}</p>
            ) : null}
          </div>
        ))}
        {!leads?.length ? (
          <div className="rounded-lg border bg-white p-8 text-center text-sm text-muted-foreground">
            Nenhum cadastro recebido ainda.
          </div>
        ) : null}
      </div>
    </DashboardShell>
  );
}
