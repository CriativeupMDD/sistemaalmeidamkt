import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ModuleTable } from "@/components/dashboard/module-table";
import { DashboardShell } from "@/components/layout/dashboard-shell";

type ModulePageProps = {
  title: string;
  description: string;
  icon: LucideIcon;
  actionLabel: string;
  rows: Array<{
    name: string;
    detail: string;
    status: string;
  }>;
};

export function ModulePage({ title, description, icon: Icon, actionLabel, rows }: ModulePageProps) {
  return (
    <DashboardShell scope="clinic" title={title} description={description}>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-md bg-primary/10 text-primary">
            <Icon className="size-5" />
          </div>
          <div>
            <h2 className="font-semibold">{title}</h2>
            <p className="text-sm text-muted-foreground">Estrutura inicial pronta para ligar ao Supabase.</p>
          </div>
        </div>
        <Button>{actionLabel}</Button>
      </div>
      <div className="grid gap-4 xl:grid-cols-[1fr_320px]">
        <ModuleTable title={`Lista de ${title.toLowerCase()}`} rows={rows} />
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Próximo passo</CardTitle>
          </CardHeader>
          <CardContent className="text-sm leading-6 text-muted-foreground">
            Conectar formulários, permissões por clínica e políticas RLS para gravar os dados deste módulo.
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  );
}
