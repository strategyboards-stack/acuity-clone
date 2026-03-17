import { AdminShell } from "@/components/AdminShell";

export default function IntegrationsPage() {
  return (
    <AdminShell
      title="Integrations"
      subtitle="Responsive parity for adapter surfaces while booking logic remains internal to appointments."
    >
      <section className="grid-3">
        <article className="card"><h2 className="title">Calendar Sync</h2><p className="muted">Google/Outlook adapters with mobile-safe connect buttons.</p></article>
        <article className="card"><h2 className="title">Video</h2><p className="muted">Meeting links generated from appointment events.</p></article>
        <article className="card"><h2 className="title">Analytics</h2><p className="muted">Tracking integrations using event subscriptions.</p></article>
      </section>
      <article className="card stack">
        <h2 className="title">Connection states</h2>
        <div className="nav"><span className="pill">Connected</span><span className="pill">Needs re-auth</span><span className="pill">Disconnected shell</span></div>
        <p className="muted">Post-connect flows remain intentionally route-backed shells where provider evidence is incomplete.</p>
      </article>
      <section className="primaryBar"><button className="button">Save integration settings</button></section>
    </AdminShell>
  );
}
