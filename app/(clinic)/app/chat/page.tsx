import { MessageSquareText } from "lucide-react";
import { ModulePage } from "@/components/dashboard/module-page";

export default function ChatPage() {
  return (
    <ModulePage
      title="Chat"
      description="Conversas internas e estrutura preparada para canais externos."
      icon={MessageSquareText}
      actionLabel="Nova conversa"
      rows={[
        { name: "Recepção", detail: "Confirmações de agenda", status: "Interno" },
        { name: "Financeiro", detail: "Cobranças e contratos", status: "Interno" },
        { name: "WhatsApp", detail: "Canal futuro por clínica", status: "Planejado" }
      ]}
    />
  );
}
