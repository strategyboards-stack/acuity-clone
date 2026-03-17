import { AdminShell } from "@/components/AdminShell";

export default function BookingDemoPage() {
  return (
    <AdminShell title="Public Booking Demo" subtitle="Public scheduling route retained with mobile-friendly form ergonomics.">
      <section className="card stack">
        <label className="stack"><span>Name</span><input className="pill" defaultValue="Jamie Rivera" /></label>
        <label className="stack"><span>Email</span><input className="pill" defaultValue="jamie@example.com" /></label>
        <label className="stack"><span>Appointment type</span><select className="pill"><option>Consult</option><option>Follow-up</option></select></label>
      </section>
      <section className="primaryBar"><button className="button">Continue booking</button></section>
    </AdminShell>
  );
}
