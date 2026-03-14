/** @typedef {"scheduled"|"checked_in"|"completed"|"cancelled"} AppointmentStatus */

/**
 * @typedef {Object} AppointmentAggregate
 * @property {string} id
 * @property {string} serviceName
 * @property {string} clientName
 * @property {string} clientEmail
 * @property {string} staffMemberName
 * @property {string} timezone
 * @property {string} startsAt
 * @property {string} endsAt
 * @property {AppointmentStatus} status
 * @property {string=} notes
 */

/**
 * @param {AppointmentAggregate[]} appointments
 * @param {{search?: string, staff?: string, status?: AppointmentStatus|"all", from: string, to: string}} query
 */
export function filterAppointments(appointments, query) {
  return appointments.filter((apt) => {
    if (apt.startsAt < query.from || apt.startsAt > query.to) return false;
    if (query.staff && query.staff !== 'all' && apt.staffMemberName !== query.staff) return false;
    if (query.status && query.status !== 'all' && apt.status !== query.status) return false;
    if (query.search) {
      const needle = query.search.toLowerCase();
      const haystack = `${apt.clientName} ${apt.clientEmail} ${apt.serviceName}`.toLowerCase();
      if (!haystack.includes(needle)) return false;
    }
    return true;
  });
}
