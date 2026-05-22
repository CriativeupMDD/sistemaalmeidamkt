import Link from "next/link";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { clinicNavigation, masterNavigation } from "@/lib/navigation";
import { cn } from "@/lib/utils";

type DashboardShellProps = {
  children: React.ReactNode;
  description: string;
  scope: "clinic" | "master";
  title: string;
};

export function DashboardShell({ children, description, scope, title }: DashboardShellProps) {
  const navigation = scope === "master" ? masterNavigation : clinicNavigation;

  return (
    <div className="min-h-screen bg-background">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r bg-white p-4 lg:block">
        <Link className="mb-8 flex items-center gap-2 text-lg font-semibold" href={scope === "master" ? "/master" : "/app"}>
          Sistema Clínica
        </Link>
        <nav className="grid gap-1">
          {navigation.map((item) => (
            <Link
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-slate-600 hover:bg-muted hover:text-slate-950"
              )}
              href={item.href}
              key={item.href}
            >
              <item.icon className="size-4" />
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-10 border-b bg-white/90 backdrop-blur">
          <div className="flex h-16 items-center justify-between px-4 lg:px-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                {scope === "master" ? "Administração" : "Clínica"}
              </p>
              <h1 className="text-lg font-semibold">{title}</h1>
            </div>
            <Button variant="ghost" size="icon" aria-label="Sair">
              <LogOut className="size-4" />
            </Button>
          </div>
        </header>

        <main className="px-4 py-6 lg:px-8">
          <div className="mb-6">
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
          {children}
        </main>
      </div>
    </div>
  );
}
