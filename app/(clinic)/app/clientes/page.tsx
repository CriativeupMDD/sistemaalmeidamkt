import { UsersRound } from "lucide-react";
import { ModulePage } from "@/components/dashboard/module-page";

export default function ClientsPage() {
  return (
    <ModulePage
      title="Clientes"
      description="Cadastro e relacionamento de clientes por clínica."
      icon={UsersRound}
      actionLabel="Novo cliente"
      rows={[
        { name: "Marina Costa", detail: "Retorno em 30 dias", status: "Ativa" },
        { name: "Rafael Almeida", detail: "Lead de avaliação", status: "Novo" },
        { name: "Beatriz Nunes", detail: "Plano em andamento", status: "Ativa" }
      ]}
    />
  );
}
