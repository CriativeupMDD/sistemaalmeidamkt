import Link from "next/link";
import { Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Database } from "@/types/database";

type Tenant = Database["public"]["Tables"]["tenants"]["Row"];

type TenantFormProps = {
  action: (formData: FormData) => void | Promise<void>;
  tenant?: Tenant;
  mode: "create" | "edit";
};

function moneyDefault(value?: number) {
  if (!value) {
    return "";
  }

  return (value / 100).toLocaleString("pt-BR", {
    minimumFractionDigits: 2
  });
}

function textDefault(value?: string | null) {
  return value ?? "";
}

export function TenantForm({ action, tenant, mode }: TenantFormProps) {
  return (
    <form action={action} className="grid gap-5">
      <Card>
        <CardHeader>
          <CardTitle>Dados da clínica</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <Field id="name" label="Nome da clínica" required defaultValue={tenant?.name} />
          <Field id="responsible_name" label="Responsável" required defaultValue={tenant?.responsible_name} />
          <Field id="email" label="E-mail" required type="email" defaultValue={tenant?.email} />
          <Field id="phone" label="Telefone" defaultValue={textDefault(tenant?.phone)} />
          <Field id="document" label="CNPJ ou CPF" defaultValue={textDefault(tenant?.document)} />
          <Field id="logo_url" label="Logo" defaultValue={textDefault(tenant?.logo_url)} placeholder="https://..." />
          <Field id="address" label="Endereço" defaultValue={textDefault(tenant?.address)} className="md:col-span-2" />
          <Field id="city" label="Cidade" defaultValue={textDefault(tenant?.city)} />
          <Field id="state" label="Estado" defaultValue={textDefault(tenant?.state)} />
          <Field id="primary_color" label="Cor primária" type="color" defaultValue={tenant?.primary_color ?? "#0f766e"} />
          <Field id="secondary_color" label="Cor secundária" type="color" defaultValue={tenant?.secondary_color ?? "#f59e0b"} />
          <div className="grid gap-2">
            <Label htmlFor="status">Status</Label>
            <select
              className="h-10 rounded-md border border-input bg-background px-3 text-sm"
              defaultValue={tenant?.status ?? "trial"}
              id="status"
              name="status"
            >
              <option value="trial">Teste grátis</option>
              <option value="ativa">Ativa</option>
              <option value="bloqueada">Bloqueada</option>
              <option value="cancelada">Cancelada</option>
            </select>
          </div>
          <Field id="monthly_price" label="Valor mensal" defaultValue={moneyDefault(tenant?.monthly_price_cents)} />
          <Field id="trial_starts_at" label="Início do teste grátis" type="date" defaultValue={textDefault(tenant?.trial_starts_at)} />
          <Field id="trial_ends_at" label="Final do teste grátis" type="date" defaultValue={textDefault(tenant?.trial_ends_at)} />
          <div className="grid gap-2 md:col-span-2">
            <Label htmlFor="notes">Observações</Label>
            <textarea
              className="min-h-28 rounded-md border border-input bg-background px-3 py-2 text-sm"
              defaultValue={tenant?.notes ?? ""}
              id="notes"
              name="notes"
            />
          </div>
        </CardContent>
      </Card>

      {mode === "create" ? (
        <Card>
          <CardHeader>
            <CardTitle>Administrador da clínica</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-3">
            <Field id="admin_name" label="Nome" />
            <Field id="admin_email" label="E-mail" type="email" />
            <Field id="admin_password" label="Senha" type="password" />
          </CardContent>
        </Card>
      ) : null}

      <div className="flex flex-wrap justify-end gap-3">
        <Button asChild variant="outline">
          <Link href="/admin/clinicas">Cancelar</Link>
        </Button>
        <Button type="submit">
          <Save className="mr-2 size-4" />
          Salvar clínica
        </Button>
      </div>
    </form>
  );
}

type FieldProps = React.InputHTMLAttributes<HTMLInputElement> & {
  id: string;
  label: string;
};

function Field({ id, label, className, ...props }: FieldProps) {
  return (
    <div className={["grid gap-2", className].filter(Boolean).join(" ")}>
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} name={id} {...props} />
    </div>
  );
}
