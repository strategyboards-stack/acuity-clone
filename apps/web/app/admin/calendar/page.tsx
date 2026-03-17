import { AdminShell } from "@/components/AdminShell";

export default function CalendarPage() {
  return (
    <AdminShell
      title="Admin Calendar"
      subtitle="Existing appointment loop preserved: create, move, and review appointments with shared domain behavior."
    >
      <section className="grid-3">
        <article className="card"><h2 className="title">Today</h2><p className="muted">6 appointments</p></article>
        <article className="card"><h2 className="title">Pending intake</h2><p className="muted">3 clients need follow-up</p></article>
        <article className="card"><h2 className="title">No-show risk</h2><p className="muted">2 upcoming visits</p></article>
      </section>
      <section className="tableWrap">
        <table>
          <thead><tr><th>Time</th><th>Client</th><th>Type</th><th>Status</th></tr></thead>
          <tbody>
            <tr><td>09:00</td><td>Jules Carter</td><td>Discovery</td><td>Confirmed</td></tr>
            <tr><td>11:30</td><td>Mina Patel</td><td>Follow-up</td><td>Rescheduled</td></tr>
            <tr><td>15:00</td><td>Rae Kim</td><td>Consult</td><td>Booked</td></tr>
          </tbody>
        </table>
      </section>
    </AdminShell>
  );
}
