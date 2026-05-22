import { BriefcaseBusiness } from "lucide-react";
import { ModulePage } from "@/components/dashboard/module-page";

export default function ProfessionalsPage() {
  return (
    <ModulePage
      title="Profissionais"
      description="Equipe, especialidades, agenda e vínculo com procedimentos."
      icon={BriefcaseBusiness}
      actionLabel="Novo profissional"
      rows={[
        { name: "Dra. Clara Mendes", detail: "Dermatologia", status: "Ativa" },
        { name: "Ana Pereira", detail: "Estética", status: "Ativa" },
        { name: "Lucas Rocha", detail: "Fisioterapia", status: "Indisponível" }
      ]}
    />
  );
}
