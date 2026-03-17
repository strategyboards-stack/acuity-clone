"use client";

import { useMemo } from "react";
import { AdminShell } from "@/components/AdminShell";
import { useAppointmentStore } from "@/components/useAppointmentStore";

export default function ClientPage() {
  const { state, actions } = useAppointmentStore();
  const upcoming = useMemo(() => state.appointments.filter((item) => item.status !== "cancelled"), [state.appointments]);
  const mostRecent = upcoming[0];

  return (
    <AdminShell title="Client Self-Service" subtitle="Working self-service actions restored on shared appointment records.">
      <section className="grid-2">
        <article className="card"><h2 className="title">Upcoming</h2><p className="muted">{upcoming.length} active appointment(s)</p></article>
        <article className="card"><h2 className="title">Past/Cancelled</h2><p className="muted">{state.appointments.filter((item) => item.status === "cancelled").length} cancelled</p></article>
      </section>

      <section className="card stack">
        <h2 className="title">My appointments</h2>
        {state.appointments.map((item) => (
          <article key={item.id} className="modalDemo">
            <strong>{item.service}</strong> · {item.date} {item.time} · {item.status}
            <div className="nav" style={{ marginTop: 8, marginBottom: 0 }}>
              <button className="pill" onClick={() => actions.reschedule(item.id, item.date, "16:30")}>Reschedule</button>
              <button className="pill" onClick={() => actions.setStatus(item.id, "cancelled")}>Cancel</button>
              <button className="pill" onClick={() => actions.updateNotes(item.id, "Client updated contact preferences")}>Edit info</button>
            </div>
          </article>
        ))}
      </section>

      <section className="primaryBar">
        <button className="button" onClick={() => mostRecent && actions.setStatus(mostRecent.id, "confirmed")}>Confirm latest appointment</button>
      </section>
    </AdminShell>
  );
}
