import { AdminShell } from "@/components/AdminShell";

export default function ClientPage() {
  return (
    <AdminShell title="Client Self-Service" subtitle="Client route remains active with responsive parity and modal-friendly actions.">
      <section className="grid-2">
        <article className="card"><h2 className="title">Upcoming</h2><p className="muted">Thu 2:30 PM · Consultation</p></article>
        <article className="card"><h2 className="title">Past</h2><p className="muted">2 completed visits</p></article>
      </section>
      <article className="modalDemo">Reschedule / edit information actions stay route-compatible and mobile modal-ready.</article>
      <section className="primaryBar"><button className="button">Manage appointment</button></section>
    </AdminShell>
  );
}
