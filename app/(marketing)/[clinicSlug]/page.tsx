import Link from "next/link";
import { CalendarCheck, MapPin, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

type ClinicLandingPageProps = {
  params: Promise<{ clinicSlug: string }>;
};

export default async function ClinicLandingPage({ params }: ClinicLandingPageProps) {
  const { clinicSlug } = await params;
  const clinicName = clinicSlug
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

  return (
    <main className="bg-white">
      <section className="container grid min-h-[76vh] gap-10 py-10 lg:grid-cols-[1fr_0.85fr] lg:items-center">
        <div>
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-primary">
            Clínica parceira
          </p>
          <h1 className="text-4xl font-semibold tracking-normal text-slate-950 md:text-6xl">
            {clinicName}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
            Atendimento organizado, agenda clara e acompanhamento profissional em um só lugar.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button size="lg">
              <CalendarCheck className="mr-2 size-4" />
              Solicitar agendamento
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/login">Área da clínica</Link>
            </Button>
          </div>
        </div>

        <div className="rounded-lg border bg-slate-50 p-6">
          <div className="grid gap-4">
            <div className="flex gap-3 rounded-md bg-white p-4">
              <MapPin className="mt-1 size-5 text-primary" />
              <div>
                <h2 className="font-medium">Unidade principal</h2>
                <p className="text-sm text-muted-foreground">Endereço configurável no painel da clínica.</p>
              </div>
            </div>
            <div className="flex gap-3 rounded-md bg-white p-4">
              <Phone className="mt-1 size-5 text-primary" />
              <div>
                <h2 className="font-medium">Contato</h2>
                <p className="text-sm text-muted-foreground">Canais próprios e WhatsApp futuro por clínica.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
