"use client";

import { AdminShell } from "@/components/AdminShell";
import { useAppointmentStore } from "@/components/useAppointmentStore";

const SLOT_CHOICES = ["09:00", "11:30", "15:00", "16:30"];
const DATE = "2026-03-18";

export default function CalendarPage() {
  const { state, actions } = useAppointmentStore();
  const activeAppointments = state.appointments.filter((item) => item.status !== "cancelled");

  return (
    <AdminShell
      title="Admin Calendar"
      subtitle="Interactive appointment loop restored: confirm, cancel, reschedule, and manage block-off slots."
    >
      <section className="grid-3">
        <article className="card"><h2 className="title">Active appointments</h2><p className="muted">{activeAppointments.length}</p></article>
        <article className="card"><h2 className="title">Blocked slots</h2><p className="muted">{state.blockedSlots.length}</p></article>
        <article className="card"><h2 className="title">Cancelled</h2><p className="muted">{state.appointments.filter((item) => item.status === "cancelled").length}</p></article>
      </section>

      <article className="card stack">
        <h2 className="title">Block-off controls ({DATE})</h2>
        <div className="nav">
          {SLOT_CHOICES.map((time) => {
            const isBlocked = state.blockedSlots.includes(`${DATE}|${time}`);
            return (
              <button key={time} className="pill" onClick={() => actions.toggleBlock(DATE, time)}>
                {time} · {isBlocked ? "Unblock" : "Block"}
              </button>
            );
          })}
        </div>
      </article>

      <section className="tableWrap">
        <table>
          <thead><tr><th>Time</th><th>Client</th><th>Type</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            {state.appointments.map((appointment) => (
              <tr key={appointment.id}>
                <td>{appointment.date} {appointment.time}</td>
                <td>{appointment.clientName}</td>
                <td>{appointment.service}</td>
                <td>{appointment.status}</td>
                <td>
                  <div className="nav" style={{ marginBottom: 0 }}>
                    <button className="pill" onClick={() => actions.setStatus(appointment.id, "confirmed")}>Confirm</button>
                    <button className="pill" onClick={() => actions.setStatus(appointment.id, "cancelled")}>Cancel</button>
                    <button className="pill" onClick={() => actions.reschedule(appointment.id, DATE, "16:30")}>Move 16:30</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </AdminShell>
  );
}
