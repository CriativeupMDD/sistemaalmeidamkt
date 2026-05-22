import { redirect } from "next/navigation";

export default async function LegacyMasterPathRedirectPage({
  params
}: {
  params: Promise<{ path: string[] }>;
}) {
  const { path } = await params;
  redirect(`/admin/${path.join("/")}`);
}
