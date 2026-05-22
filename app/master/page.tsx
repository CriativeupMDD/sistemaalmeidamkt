import MasterDashboardPage from "@/app/admin/(protected)/page";
import { requireMaster } from "@/lib/supabase/auth";

export const dynamic = "force-dynamic";

export default async function MasterPage() {
  await requireMaster();

  return <MasterDashboardPage />;
}
