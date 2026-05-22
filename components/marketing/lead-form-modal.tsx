"use client";

import { useActionState, useState } from "react";
import { Building2, CheckCircle2, Send, X } from "lucide-react";
import { createLandingLeadAction } from "@/app/actions/landing-leads";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const initialState = {
  ok: false,
  message: ""
};

export function LeadFormModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [state, formAction, isPending] = useActionState(createLandingLeadAction, initialState);

  return (
    <>
      <Button size="lg" onClick={() => setIsOpen(true)}>
        Cadastrar
        <Send className="ml-2 size-4" />
      </Button>

      {isOpen ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/70 p-4">
          <div className="w-full max-w-2xl overflow-hidden rounded-lg bg-white shadow-2xl">
            <div className="flex items-start justify-between border-b p-5">
              <div className="flex gap-3">
                <div className="flex size-10 items-center justify-center rounded-md bg-primary/10 text-primary">
                  <Building2 className="size-5" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold">Cadastrar clínica</h2>
                  <p className="text-sm text-muted-foreground">
                    Envie seus dados para receber uma apresentação do sistema.
                  </p>
                </div>
              </div>
              <Button aria-label="Fechar" size="icon" type="button" variant="ghost" onClick={() => setIsOpen(false)}>
                <X className="size-4" />
              </Button>
            </div>

            <form action={formAction} className="grid gap-4 p-5">
              <div className="grid gap-4 md:grid-cols-2">
                <Field id="clinic_name" label="Nome da clínica" required />
                <Field id="responsible_name" label="Responsável" required />
                <Field id="email" label="E-mail" required type="email" />
                <Field id="phone" label="Telefone / WhatsApp" required />
                <Field id="city" label="Cidade" />
                <Field id="state" label="Estado" />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="message">Observações</Label>
                <textarea
                  className="min-h-28 rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  id="message"
                  name="message"
                  placeholder="Conte rapidamente sobre sua clínica e o que você precisa organizar."
                />
              </div>

              {state.message ? (
                <div className={state.ok ? "flex items-center gap-2 text-sm text-primary" : "text-sm text-destructive"}>
                  {state.ok ? <CheckCircle2 className="size-4" /> : null}
                  {state.message}
                </div>
              ) : null}

              <div className="flex flex-wrap justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                  Fechar
                </Button>
                <Button disabled={isPending} type="submit">
                  {isPending ? "Enviando..." : "Enviar cadastro"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}

type FieldProps = React.InputHTMLAttributes<HTMLInputElement> & {
  id: string;
  label: string;
};

function Field({ id, label, ...props }: FieldProps) {
  return (
    <div className="grid gap-2">
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} name={id} {...props} />
    </div>
  );
}
