import { AdminShell } from "@/components/AdminShell";

export default function ReportsPage() {
  return (
    <AdminShell
      title="Reports"
      subtitle="Mobile-ready report tabs with shared filters and empty-state tolerant data rendering."
    >
      <nav className="nav">
        <span className="pill">Appointments</span>
        <span className="pill">Revenue</span>
        <span className="pill">Users</span>
        <span className="pill">Intake Forms</span>
        <span className="pill">Tips</span>
      </nav>
      <section className="card stack">
        <h2 className="title">Shared filters</h2>
        <div className="grid-2">
          <label className="stack"><span>Date range</span><input className="pill" defaultValue="Last 30 days" /></label>
          <label className="stack"><span>Appointment type</span><input className="pill" defaultValue="All" /></label>
        </div>
      </section>
      <section className="tableWrap">
        <table>
          <thead><tr><th>Metric</th><th>Value</th><th>Trend</th></tr></thead>
          <tbody>
            <tr><td>Booked</td><td>0</td><td>—</td></tr>
            <tr><td>Completed</td><td>0</td><td>—</td></tr>
            <tr><td>Revenue</td><td>$0.00</td><td>—</td></tr>
          </tbody>
        </table>
      </section>
      <section className="primaryBar"><button className="button">Export CSV</button></section>
    </AdminShell>
  );
}
