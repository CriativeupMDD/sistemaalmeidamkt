import { CalendarDays } from "lucide-react";
import { ModulePage } from "@/components/dashboard/module-page";

export default function SchedulePage() {
  return (
    <ModulePage
      title="Agenda"
      description="Consultas, procedimentos, encaixes e disponibilidade profissional."
      icon={CalendarDays}
      actionLabel="Novo agendamento"
      rows={[
        { name: "Avaliação inicial", detail: "Hoje, 09:00", status: "Confirmado" },
        { name: "Procedimento facial", detail: "Hoje, 11:30", status: "Aguardando" },
        { name: "Retorno", detail: "Amanhã, 15:00", status: "Confirmado" }
      ]}
    />
  );
}
