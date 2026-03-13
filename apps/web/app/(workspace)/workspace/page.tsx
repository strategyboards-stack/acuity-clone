import Link from "next/link";
import { ModuleCard, ShellFrame } from "@acuity/ui";

export default function WorkspacePage() {
  return (
    <ShellFrame title="Workspace Shell">
      <ModuleCard title="Calendar" description="Admin scheduling operations route shell." />
      <ModuleCard title="Integrations" description="Integration adapter shell (non-booking logic)." />
      <ModuleCard title="Reports" description="Reporting shell entrypoint." />
      <p>
        Host surfaces remain separate: <Link href="/account/manage-users">Manage Users</Link> ·{" "}
        <Link href="/account/billing">Billing</Link>
      </p>
    </ShellFrame>
  );
}
