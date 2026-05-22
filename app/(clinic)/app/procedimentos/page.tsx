import { Scissors } from "lucide-react";
import { ModulePage } from "@/components/dashboard/module-page";

export default function ProceduresPage() {
  return (
    <ModulePage
      title="Procedimentos"
      description="Catálogo de serviços, duração, preço e preparo."
      icon={Scissors}
      actionLabel="Novo procedimento"
      rows={[
        { name: "Limpeza de pele", detail: "60 minutos", status: "Publicado" },
        { name: "Avaliação", detail: "30 minutos", status: "Publicado" },
        { name: "Sessão terapêutica", detail: "50 minutos", status: "Rascunho" }
      ]}
    />
  );
}
