import { CircleDollarSign } from "lucide-react";
import { ModulePage } from "@/components/dashboard/module-page";

export default function FinancePage() {
  return (
    <ModulePage
      title="Financeiro"
      description="Recebimentos, despesas, previsões e repasses."
      icon={CircleDollarSign}
      actionLabel="Novo lançamento"
      rows={[
        { name: "Procedimento facial", detail: "R$ 420,00", status: "Recebido" },
        { name: "Plano mensal", detail: "R$ 1.200,00", status: "A receber" },
        { name: "Material clínico", detail: "R$ 380,00", status: "Despesa" }
      ]}
    />
  );
}
