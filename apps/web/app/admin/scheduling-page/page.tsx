import { AdminShell } from "@/components/AdminShell";

export default function SchedulingPage() {
  return (
    <AdminShell
      title="Scheduling Page"
      subtitle="Mobile parity pass: overflow-safe settings cards, sticky publish actions, and touch-sized controls."
    >
      <section className="grid-2">
        <article className="card stack">
          <h2 className="title">Public availability summary</h2>
          <p className="muted">Timezone, appointment types, and lead-time rules are shown in one scrollable panel.</p>
          <div className="nav"><span className="pill">Timezone: PT</span><span className="pill">Lead time: 4h</span><span className="pill">Buffers: On</span></div>
        </article>
        <article className="card stack">
          <h2 className="title">Distribution channels</h2>
          <div className="nav"><span className="pill">Direct link</span><span className="pill">Website embed</span><span className="pill">1-way ICS</span></div>
          <p className="muted">1-way ICS publication remains separate from 2-way calendar sync behavior.</p>
        </article>
      </section>
      <article className="card stack">
        <h2 className="title">Page sections</h2>
        <div className="tableWrap">
          <table>
            <thead><tr><th>Section</th><th>Visibility</th><th>Mobile note</th></tr></thead>
            <tbody>
              <tr><td>Service cards</td><td>Enabled</td><td>Stacks to one column under 768px</td></tr>
              <tr><td>Intake prompt</td><td>Enabled</td><td>Input controls are 44px min height</td></tr>
              <tr><td>Policy notes</td><td>Enabled</td><td>Text wraps and avoids horizontal clipping</td></tr>
            </tbody>
          </table>
        </div>
      </article>
      <section className="primaryBar"><button className="button">Save scheduling page</button></section>
    </AdminShell>
  );
}
