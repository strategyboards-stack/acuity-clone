import type { ClientAppointment } from '@acuity/contracts';
import { Link } from 'react-router-dom';
import { buildActionEntry } from '../lib/sessionService';

interface AppointmentListProps {
  appointments: ClientAppointment[];
  nowIso?: string;
}

export function AppointmentList({ appointments, nowIso = new Date().toISOString() }: AppointmentListProps) {
  const now = new Date(nowIso);
  const upcoming = appointments.filter((appointment) => new Date(appointment.startsAtIso) >= now);
  const past = appointments.filter((appointment) => new Date(appointment.startsAtIso) < now);

  return (
    <section className="grid">
      <article className="panel">
        <h2>Upcoming appointments</h2>
        {upcoming.length === 0 ? <p>You have no upcoming appointments.</p> : <ul>{upcoming.map(renderAppointmentRow)}</ul>}
      </article>

      <article className="panel">
        <h2>Past appointments</h2>
        {past.length === 0 ? <p>You have no past appointments.</p> : <ul>{past.map(renderAppointmentRow)}</ul>}
      </article>
    </section>
  );
}

function renderAppointmentRow(appointment: ClientAppointment) {
  const editEntry = buildActionEntry(appointment, 'edit-info');
  const rescheduleEntry = buildActionEntry(appointment, 'reschedule');
  const cancelEntry = buildActionEntry(appointment, 'cancel');

  return (
    <li key={appointment.appointmentId} className="appointment-row">
      <div>
        <p className="service-name">{appointment.serviceName}</p>
        <p>
          {new Date(appointment.startsAtIso).toLocaleString()} ({appointment.timezone})
        </p>
      </div>
      <div className="actions">
        <Link to={`/client/appointments/${editEntry.identity.publicCode}/edit-info`}>Edit info</Link>
        <Link to={`/client/appointments/${rescheduleEntry.identity.publicCode}/reschedule`}>Reschedule</Link>
        <Link to={`/client/appointments/${cancelEntry.identity.publicCode}/cancel`}>Cancel</Link>
      </div>
    </li>
  );
}
