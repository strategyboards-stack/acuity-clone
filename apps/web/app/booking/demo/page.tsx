"use client";

import { useMemo, useState } from "react";
import { AdminShell } from "@/components/AdminShell";
import { useAppointmentStore } from "@/components/useAppointmentStore";
import { canBookSlot } from "@/lib/appointmentStore";

const DATE_OPTIONS = ["2026-03-18", "2026-03-19"];
const TIME_OPTIONS = ["09:00", "11:30", "15:00", "16:30"];

export default function BookingDemoPage() {
  const { state, actions } = useAppointmentStore();
  const [name, setName] = useState("Jamie Rivera");
  const [email, setEmail] = useState("jamie@example.com");
  const [service, setService] = useState("Consult");
  const [date, setDate] = useState(DATE_OPTIONS[0]);
  const [time, setTime] = useState(TIME_OPTIONS[0]);

  const canBook = useMemo(() => canBookSlot(state, date, time), [state, date, time]);

  return (
    <AdminShell title="Public Booking Demo" subtitle="Working public booking flow with live slot availability from shared calendar state.">
      <section className="card stack">
        <label className="stack"><span>Name</span><input className="pill" value={name} onChange={(event) => setName(event.target.value)} /></label>
        <label className="stack"><span>Email</span><input className="pill" value={email} onChange={(event) => setEmail(event.target.value)} /></label>
        <label className="stack"><span>Appointment type</span><select className="pill" value={service} onChange={(event) => setService(event.target.value)}><option>Consult</option><option>Follow-up</option></select></label>
        <label className="stack"><span>Date</span><select className="pill" value={date} onChange={(event) => setDate(event.target.value)}>{DATE_OPTIONS.map((value) => <option key={value}>{value}</option>)}</select></label>
        <label className="stack"><span>Time</span><select className="pill" value={time} onChange={(event) => setTime(event.target.value)}>{TIME_OPTIONS.map((value) => <option key={value}>{value}</option>)}</select></label>
        <p className="muted">{canBook ? "Slot available" : "Unavailable because blocked or already booked."}</p>
      </section>
      <section className="primaryBar">
        <button
          className="button"
          disabled={!canBook}
          onClick={() => actions.book({ clientName: name, email, service, date, time })}
          style={{ opacity: canBook ? 1 : 0.5 }}
        >
          Continue booking
        </button>
      </section>
    </AdminShell>
  );
}
