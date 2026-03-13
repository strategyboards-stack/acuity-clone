import { ModuleCard, ShellFrame } from "@acuity/ui";

export default function BillingPage() {
  return (
    <ShellFrame title="Account Billing Shell">
      <ModuleCard title="Payment Information" description="Host-level billing surface separated from scheduling routes." />
    </ShellFrame>
  );
}
