import { filterAppointments } from '../../../packages/contracts/src/index.js';

export const seedAppointments = [
  { id:'apt_100', serviceName:'Initial Consultation', clientName:'Jamie Park', clientEmail:'jamie@example.com', staffMemberName:'Dr. Rivera', timezone:'America/New_York', startsAt:'2026-03-14T13:00:00.000Z', endsAt:'2026-03-14T13:30:00.000Z', status:'scheduled', notes:'First-time client' },
  { id:'apt_101', serviceName:'Follow-Up', clientName:'Ari Gomez', clientEmail:'ari@example.com', staffMemberName:'Dr. Rivera', timezone:'America/New_York', startsAt:'2026-03-14T15:00:00.000Z', endsAt:'2026-03-14T15:30:00.000Z', status:'checked_in' },
  { id:'apt_102', serviceName:'Therapy Session', clientName:'Morgan Lee', clientEmail:'morgan@example.com', staffMemberName:'Dr. Chen', timezone:'America/New_York', startsAt:'2026-03-16T17:00:00.000Z', endsAt:'2026-03-16T18:00:00.000Z', status:'scheduled' }
];

export function deriveCalendarState({ view='week', activeId=seedAppointments[0].id, search='', staff='all', showCreate=false } = {}) {
  const filtered = filterAppointments(seedAppointments, { from:'2026-03-01T00:00:00.000Z', to:'2026-03-31T23:59:59.000Z', search, staff, status:'all' });
  const active = filtered.find((item) => item.id === activeId) ?? null;
  return { view, activeId, search, staff, showCreate, filtered, active };
}
