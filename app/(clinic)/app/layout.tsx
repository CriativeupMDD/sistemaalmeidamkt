import { requireActiveClinicAccess } from "@/lib/supabase/auth";

export const dynamic = "force-dynamic";

export default async function ClinicAppLayout({ children }: { children: React.ReactNode }) {
  await requireActiveClinicAccess();

  return children;
}
