import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Sidebar } from "@/components/layout/sidebar";
import { getCurrentUser, getUserTags } from "@/lib/dal";

export default async function WorkspaceLayout({ children }) {
  const user = await getCurrentUser();
  const tags = await getUserTags();

  return (
    <DashboardShell sidebar={<Sidebar user={user} tags={tags} />}>
      {children}
    </DashboardShell>
  );
}
