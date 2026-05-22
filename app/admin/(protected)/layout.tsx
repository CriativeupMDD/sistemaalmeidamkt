import { requireMaster } from "@/lib/supabase/auth";

export const dynamic = "force-dynamic";

export default async function MasterLayout({ children }: { children: React.ReactNode }) {
  await requireMaster();

  return children;
}
