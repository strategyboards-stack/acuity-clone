'use client';

import { useMemo, useState } from 'react';

type CalendarView = 'day' | 'week' | 'month';

type Appointment = {
  id: string;
  title: string;
  clientName: string;
  startsAt: string;
  endsAt: string;
  status: 'confirmed' | 'pending' | 'blocked';
  notes?: string;
};

const seededAppointments: Appointment[] = [
  {
    id: 'apt-1',
    title: '60m Coaching Session',
    clientName: 'Ada Lovelace',
    startsAt: '2026-03-18T09:00:00.000Z',
    endsAt: '2026-03-18T10:00:00.000Z',
    status: 'confirmed',
    notes: 'First strategy session.'
  },
  {
    id: 'apt-2',
    title: '30m Intro Call',
    clientName: 'Grace Hopper',
    startsAt: '2026-03-18T11:00:00.000Z',
    endsAt: '2026-03-18T11:30:00.000Z',
    status: 'pending',
    notes: 'Requested follow-up materials.'
  },
  {
    id: 'apt-3',
    title: 'Blocked Off Time',
    clientName: 'Internal',
    startsAt: '2026-03-19T14:00:00.000Z',
    endsAt: '2026-03-19T15:30:00.000Z',
    status: 'blocked',
    notes: 'Team operations window.'
  }
];

const dayLabelFormatter = new Intl.DateTimeFormat('en-US', {
  weekday: 'short',
  month: 'short',
  day: 'numeric',
  timeZone: 'UTC'
});

const timeLabelFormatter = new Intl.DateTimeFormat('en-US', {
  hour: '2-digit',
  minute: '2-digit',
  hour12: true,
  timeZone: 'UTC'
});

const dateTimeLabelFormatter = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  hour12: true,
  timeZone: 'UTC'
});

function startOfWeek(date: Date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day;
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function startOfMonth(date: Date) {
  const d = new Date(date.getFullYear(), date.getMonth(), 1);
  d.setHours(0, 0, 0, 0);
  return d;
}

function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

export default function AdminCalendarSlice() {
  const [appointments, setAppointments] = useState<Appointment[]>(seededAppointments);
  const [selectedId, setSelectedId] = useState<string>(seededAppointments[0].id);
  const [view, setView] = useState<CalendarView>('week');
  const [anchorDate, setAnchorDate] = useState(new Date('2026-03-18T00:00:00.000Z'));
  const [createOpen, setCreateOpen] = useState(false);
  const [blockOpen, setBlockOpen] = useState(false);

  const selected = appointments.find((item) => item.id === selectedId) ?? appointments[0];

  const visibleDays = useMemo(() => {
    if (view === 'day') {
      return [new Date(anchorDate)];
    }

    if (view === 'week') {
      const first = startOfWeek(anchorDate);
      return Array.from({ length: 7 }).map((_, idx) => {
        const d = new Date(first);
        d.setDate(first.getDate() + idx);
        return d;
      });
    }

    const first = startOfMonth(anchorDate);
    const month = first.getMonth();
    const cursor = new Date(first);
    const days: Date[] = [];
    while (cursor.getMonth() === month) {
      days.push(new Date(cursor));
      cursor.setDate(cursor.getDate() + 1);
    }
    return days;
  }, [view, anchorDate]);

  const grouped = useMemo(() => {
    return visibleDays.map((day) => {
      const items = appointments.filter((item) => isSameDay(new Date(item.startsAt), day));
      return { day, items };
    });
  }, [appointments, visibleDays]);

  function moveRange(direction: 'prev' | 'next') {
    const d = new Date(anchorDate);
    const delta = direction === 'prev' ? -1 : 1;
    if (view === 'day') d.setDate(d.getDate() + delta);
    if (view === 'week') d.setDate(d.getDate() + delta * 7);
    if (view === 'month') d.setMonth(d.getMonth() + delta);
    setAnchorDate(d);
  }

  function addAppointment(blocked: boolean) {
    const baseDate = new Date(anchorDate);
    baseDate.setHours(blocked ? 14 : 10, 0, 0, 0);
    const endDate = new Date(baseDate);
    endDate.setMinutes(endDate.getMinutes() + (blocked ? 90 : 60));

    const newItem: Appointment = {
      id: `apt-${Math.random().toString(36).slice(2, 8)}`,
      title: blocked ? 'Blocked Off Time' : 'Manual Appointment',
      clientName: blocked ? 'Internal' : 'Walk-in Client',
      startsAt: baseDate.toISOString(),
      endsAt: endDate.toISOString(),
      status: blocked ? 'blocked' : 'confirmed',
      notes: blocked ? 'Created from Block Off Time entry point.' : 'Created from Manual Appointment entry point.'
    };

    setAppointments((prev) => [newItem, ...prev]);
    setSelectedId(newItem.id);
    setCreateOpen(false);
    setBlockOpen(false);
  }

  return (
    <div className="calendar-shell">
      <section className="card">
        <div className="toolbar">
          <h2>Admin Calendar</h2>
          <div className="toolbar-actions">
            <button onClick={() => moveRange('prev')}>←</button>
            <button onClick={() => moveRange('next')}>→</button>
            <button className={view === 'day' ? 'active' : ''} onClick={() => setView('day')}>Day</button>
            <button className={view === 'week' ? 'active' : ''} onClick={() => setView('week')}>Week</button>
            <button className={view === 'month' ? 'active' : ''} onClick={() => setView('month')}>Month</button>
          </div>
        </div>

        <div className="entry-actions">
          <button onClick={() => setCreateOpen((v) => !v)}>+ Manual Create Appointment</button>
          <button onClick={() => setBlockOpen((v) => !v)}>+ Block Off Time</button>
        </div>

        {createOpen && (
          <div className="inline-form">
            <p>Manual appointment form (demo): creates an appointment on the current anchor date.</p>
            <button onClick={() => addAppointment(false)}>Create appointment</button>
          </div>
        )}

        {blockOpen && (
          <div className="inline-form">
            <p>Block-off form (demo): creates a blocked time item on the current anchor date.</p>
            <button onClick={() => addAppointment(true)}>Save block-off time</button>
          </div>
        )}
      </section>

      <div className="calendar-layout">
        <section className="card">
          <h3>{view.toUpperCase()} view</h3>
          <div className={view === 'month' ? 'calendar-grid month' : 'calendar-grid'}>
            {grouped.map(({ day, items }) => (
              <article key={day.toISOString()} className="day-cell">
                <header>
                  <strong>{dayLabelFormatter.format(day)}</strong>
                </header>
                {items.length === 0 ? <p className="muted">No appointments</p> : null}
                {items.map((item) => (
                  <button key={item.id} className={`appt ${item.status}`} onClick={() => setSelectedId(item.id)}>
                    <span>{item.title}</span>
                    <small>{timeLabelFormatter.format(new Date(item.startsAt))}</small>
                  </button>
                ))}
              </article>
            ))}
          </div>
        </section>

        <aside className="card detail-panel">
          <h3>Appointment Detail</h3>
          {selected ? (
            <>
              <p><strong>{selected.title}</strong></p>
              <p>Client: {selected.clientName}</p>
              <p>Status: {selected.status}</p>
              <p>Start: {dateTimeLabelFormatter.format(new Date(selected.startsAt))}</p>
              <p>End: {dateTimeLabelFormatter.format(new Date(selected.endsAt))}</p>
              <p>Notes: {selected.notes ?? '—'}</p>
            </>
          ) : (
            <p>Select an appointment from the calendar.</p>
          )}
        </aside>
      </div>
    </div>
  );
}
