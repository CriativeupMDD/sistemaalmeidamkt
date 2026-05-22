import { ListChecks } from "lucide-react";
import { ModulePage } from "@/components/dashboard/module-page";

export default function TasksPage() {
  return (
    <ModulePage
      title="Tarefas"
      description="Pendências internas, responsáveis e prazos da equipe."
      icon={ListChecks}
      actionLabel="Nova tarefa"
      rows={[
        { name: "Confirmar agenda", detail: "Recepção", status: "Hoje" },
        { name: "Revisar orçamento", detail: "Financeiro", status: "Pendente" },
        { name: "Enviar pós-atendimento", detail: "Atendimento", status: "Automatizar" }
      ]}
    />
  );
}
