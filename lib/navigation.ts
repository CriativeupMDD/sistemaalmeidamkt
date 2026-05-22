import {
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  CircleDollarSign,
  Inbox,
  LayoutDashboard,
  ListChecks,
  MessageSquareText,
  Scissors,
  UsersRound
} from "lucide-react";

export const clinicNavigation = [
  { href: "/app", label: "Painel", icon: LayoutDashboard },
  { href: "/app/clientes", label: "Clientes", icon: UsersRound },
  { href: "/app/agenda", label: "Agenda", icon: CalendarDays },
  { href: "/app/procedimentos", label: "Procedimentos", icon: Scissors },
  { href: "/app/profissionais", label: "Profissionais", icon: BriefcaseBusiness },
  { href: "/app/tarefas", label: "Tarefas", icon: ListChecks },
  { href: "/app/financeiro", label: "Financeiro", icon: CircleDollarSign },
  { href: "/app/chat", label: "Chat", icon: MessageSquareText }
];

export const masterNavigation = [
  { href: "/admin", label: "Painel", icon: LayoutDashboard },
  { href: "/admin/leads", label: "Leads", icon: Inbox },
  { href: "/admin/clinicas", label: "Clínicas", icon: Building2 },
  { href: "/admin/financeiro", label: "Financeiro", icon: CircleDollarSign }
];
