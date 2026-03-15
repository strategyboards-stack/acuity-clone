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

function parseDateTime(value) {
  const timestamp = Date.parse(value);
  return Number.isFinite(timestamp) ? timestamp : Number.NaN;
}

/**
 * @param {AppointmentAggregate[]} appointments
 * @param {{search?: string, staff?: string, status?: AppointmentStatus|"all", from: string, to: string}} query
 */
export function filterAppointments(appointments, query) {
  const fromTs = parseDateTime(query.from);
  const toTs = parseDateTime(query.to);
  if (!Number.isFinite(fromTs) || !Number.isFinite(toTs) || fromTs > toTs) {
    return [];
  }

  const normalizedSearch = query.search?.trim().toLowerCase();

  return appointments.filter((apt) => {
    const startTs = parseDateTime(apt.startsAt);
    const endTs = parseDateTime(apt.endsAt);
    if (!Number.isFinite(startTs) || !Number.isFinite(endTs) || endTs < startTs) return false;
    if (startTs < fromTs || startTs > toTs) return false;
    if (query.staff && query.staff !== 'all' && apt.staffMemberName !== query.staff) return false;
    if (query.status && query.status !== 'all' && apt.status !== query.status) return false;
    if (normalizedSearch) {
      const haystack = `${apt.clientName} ${apt.clientEmail} ${apt.serviceName}`.toLowerCase();
      if (!haystack.includes(normalizedSearch)) return false;
    }
    return true;
  });
}
