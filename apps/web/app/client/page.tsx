import { getSessionClient } from "@/lib/auth/session";
import { getAppointmentsForClient } from "@/lib/data/store";

export default async function ClientAppointmentsPage() {
  const client = await getSessionClient();
  if (!client) return null;
  const appointments = getAppointmentsForClient(client.id);

  return (
    <main className="stack">
      <h1>Appointments</h1>
      <div className="card">
        {appointments.length === 0 ? (
          <p>No appointments yet. Book from the public scheduling page.</p>
        ) : (
          <table className="table" aria-label="Appointments list">
            <thead>
              <tr>
                <th>Type</th>
                <th>Starts</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((appointment) => (
                <tr key={appointment.id}>
                  <td>{appointment.appointmentTypeName}</td>
                  <td>{new Date(appointment.startsAt).toLocaleString()}</td>
                  <td><span className="badge">{appointment.status}</span></td>
                  <td>{appointment.canReschedule ? "Reschedule" : "—"} / {appointment.canCancel ? "Cancel" : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </main>
  );
}
