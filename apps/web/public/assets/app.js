export const permissions = {
  admin: ['calendar:view', 'appointments:edit'],
  client: ['appointments:view-self'],
  public: ['booking:create']
};

export function can(role, perm) {
  return (permissions[role] || []).includes(perm);
}

const isoDate = (d) => d.toISOString().slice(0, 10);
const formatDisplayDate = (d) => d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
const TIMES = ['09:00', '10:00', '11:00', '14:00'];

const createAppointmentRequest = async (payload) => {
  const response = await fetch('/api/appointments', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(payload)
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Unable to create appointment');
  return data.appointment;
};

const listAppointmentsRequest = async () => {
  const response = await fetch('/api/appointments');
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Unable to load appointments');
  return data.appointments || [];
};

const appointmentLabel = (a) => `${a.date} ${a.time} — ${a.firstName} ${a.lastName} (${a.appointmentType})`;
const isBlocked = (a) => a.source === 'admin-block-off';

const renderAppointmentList = (items, listNode, emptyNode) => {
  if (!listNode || !emptyNode) return;
  listNode.innerHTML = '';
  if (!items.length) {
    emptyNode.classList.remove('hidden');
    return;
  }
  emptyNode.classList.add('hidden');
  items.forEach((a) => {
    const li = document.createElement('li');
    li.className = 'appointment-item';
    li.textContent = `${appointmentLabel(a)}${isBlocked(a) ? ' [Blocked]' : ''}`;
    listNode.appendChild(li);
  });
};

const dayKey = (d) => isoDate(new Date(d));
const startOfWeek = (d) => {
  const n = new Date(d);
  n.setHours(0, 0, 0, 0);
  n.setDate(n.getDate() - n.getDay());
  return n;
};

export function wireAdminCalendar() {
  const menuBtn = document.querySelector('[data-mobile-menu]');
  const sidenav = document.querySelector('.sidenav');
  const detail = document.querySelector('.detail-panel');
  const closer = document.querySelector('[data-close-detail]');
  const cancelDetail = document.querySelector('[data-cancel-detail]');
  const saveDetail = document.querySelector('[data-save-detail]');
  const detailNotes = document.querySelector('[data-detail-notes]');
  const detailStatus = document.querySelector('[data-detail-status]');
  const selectedTime = document.querySelector('[data-selected-time]');
  const selectedType = document.querySelector('[data-selected-type]');

  const main = document.querySelector('.calendar-main');
  const viewBtns = [...document.querySelectorAll('[data-view]')];
  const viewLabel = document.querySelector('[data-view-label]');
  const grid = document.querySelector('[data-calendar-grid]');

  const focusDateNode = document.querySelector('[data-focus-date]');
  const navButtons = [...document.querySelectorAll('[data-nav]')];
  let focusDate = new Date();
  let currentView = 'week';
  let appointmentCache = [];

  const createModal = document.querySelector('[data-create-modal]');
  const createTitle = document.querySelector('[data-create-title]');
  const openCreate = [...document.querySelectorAll('[data-open-create]')];
  const openBlock = [...document.querySelectorAll('[data-open-block]')];
  const closeCreate = [...document.querySelectorAll('[data-close-create]')];
  const createDate = document.querySelector('[data-create-date]');
  const createTime = document.querySelector('[data-create-time]');
  const createClient = document.querySelector('[data-create-client]');
  const clientField = document.querySelector('[data-client-field]');
  const submitCreate = document.querySelector('[data-submit-create]');
  const createStatus = document.querySelector('[data-create-status]');

  const adminList = document.querySelector('[data-admin-appointments-list]');
  const adminEmpty = document.querySelector('[data-admin-appointments-empty]');
  const refreshAppointments = document.querySelector('[data-refresh-appointments]');

  const openDetail = (appt) => {
    if (selectedTime) selectedTime.textContent = `${appt.date} ${appt.time}`;
    if (selectedType) selectedType.textContent = appt.appointmentType;
    if (detailStatus) detailStatus.textContent = '';
    detail?.classList.add('open');
  };

  const renderCalendarProjection = () => {
    if (!grid) return;
    grid.innerHTML = '';

    if (currentView === 'day') {
      grid.style.gridTemplateColumns = '1fr';
      const key = dayKey(focusDate);
      TIMES.forEach((t) => {
        const entries = appointmentCache.filter((a) => a.date === key && a.time === t);
        const slot = document.createElement('div');
        slot.className = 'slot';
        slot.innerHTML = `<strong>${t}</strong>`;
        if (!entries.length) {
          const p = document.createElement('p');
          p.className = 'muted';
          p.textContent = 'Available';
          slot.appendChild(p);
        } else {
          entries.forEach((a) => {
            const btn = document.createElement('button');
            btn.className = 'time-entry';
            btn.dataset.openDetail = '1';
            btn.dataset.appointmentId = a.id;
            btn.innerHTML = `<span class='time-label'>${a.time}</span><span>${a.firstName} ${a.lastName}${isBlocked(a) ? ' [Blocked]' : ''}</span>`;
            slot.appendChild(btn);
          });
        }
        grid.appendChild(slot);
      });
      return;
    }

    if (currentView === 'week') {
      grid.style.gridTemplateColumns = 'repeat(7,minmax(80px,1fr))';
      const start = startOfWeek(focusDate);
      for (let i = 0; i < 7; i += 1) {
        const d = new Date(start);
        d.setDate(start.getDate() + i);
        const key = dayKey(d);
        const entries = appointmentCache.filter((a) => a.date === key);
        const slot = document.createElement('div');
        slot.className = 'slot';
        slot.innerHTML = `<strong>${d.toLocaleDateString('en-US', { weekday: 'short', month: 'numeric', day: 'numeric' })}</strong>`;
        if (!entries.length) {
          const p = document.createElement('p');
          p.className = 'muted';
          p.textContent = 'No bookings';
          slot.appendChild(p);
        } else {
          entries.slice(0, 3).forEach((a) => {
            const btn = document.createElement('button');
            btn.className = 'time-entry';
            btn.dataset.openDetail = '1';
            btn.dataset.appointmentId = a.id;
            btn.innerHTML = `<span class='time-label'>${a.time}</span><span>${a.firstName}${isBlocked(a) ? ' [Blocked]' : ''}</span>`;
            slot.appendChild(btn);
          });
        }
        grid.appendChild(slot);
      }
      return;
    }

    // month
    grid.style.gridTemplateColumns = 'repeat(7,minmax(72px,1fr))';
    const start = new Date(focusDate.getFullYear(), focusDate.getMonth(), 1);
    const from = startOfWeek(start);
    for (let i = 0; i < 35; i += 1) {
      const d = new Date(from);
      d.setDate(from.getDate() + i);
      const key = dayKey(d);
      const entries = appointmentCache.filter((a) => a.date === key);
      const blockedCount = entries.filter(isBlocked).length;
      const bookedCount = entries.length - blockedCount;
      const slot = document.createElement('div');
      slot.className = 'slot';
      slot.innerHTML = `<strong>${d.getDate()}</strong><p class='muted'>${bookedCount} booked${blockedCount ? ` · ${blockedCount} blocked` : ''}</p>`;
      grid.appendChild(slot);
    }
  };

  const refreshAdminAppointments = async () => {
    try {
      appointmentCache = await listAppointmentsRequest();
      renderAppointmentList(appointmentCache, adminList, adminEmpty);
      renderCalendarProjection();
    } catch (error) {
      if (adminEmpty) {
        adminEmpty.textContent = `Unable to load appointments: ${error.message}`;
        adminEmpty.classList.remove('hidden');
      }
    }
  };

  const setFocusDate = () => {
    if (focusDateNode) focusDateNode.textContent = formatDisplayDate(focusDate);
    if (createDate) createDate.value = isoDate(focusDate);
    renderCalendarProjection();
  };

  const closeDetailPanel = () => {
    detail?.classList.remove('open');
    if (detailStatus) detailStatus.textContent = '';
  };

  const openCreateModal = (mode) => {
    if (!createModal || !createDate || !createTitle || !submitCreate) return;
    createDate.value = isoDate(focusDate);
    if (createStatus) createStatus.textContent = '';
    const isBlockMode = mode === 'block';
    createTitle.textContent = isBlockMode ? 'Block Off Time' : 'Manual Create Appointment';
    submitCreate.textContent = isBlockMode ? 'Save blocked time' : 'Create appointment';
    if (clientField) clientField.classList.toggle('hidden', isBlockMode);
    createModal.dataset.mode = mode;
    createModal.classList.add('open');
  };

  menuBtn?.addEventListener('click', () => sidenav?.classList.toggle('open'));
  grid?.addEventListener('click', (evt) => {
    const button = evt.target.closest('[data-open-detail]');
    if (!button) return;
    const appt = appointmentCache.find((a) => a.id === button.dataset.appointmentId);
    if (appt) openDetail(appt);
  });

  closer?.addEventListener('click', closeDetailPanel);
  cancelDetail?.addEventListener('click', closeDetailPanel);
  saveDetail?.addEventListener('click', () => {
    if (detailStatus) detailStatus.textContent = `Saved notes for ${selectedTime?.textContent || 'appointment'} on ${formatDisplayDate(focusDate)}.`;
  });

  viewBtns.forEach((btn) => btn.addEventListener('click', () => {
    const nextView = btn.getAttribute('data-view');
    if (!nextView || !main) return;
    currentView = nextView;
    main.setAttribute('data-calendar-view', nextView);
    if (viewLabel) viewLabel.textContent = `${nextView[0].toUpperCase()}${nextView.slice(1)} view`;
    renderCalendarProjection();
  }));

  navButtons.forEach((btn) => btn.addEventListener('click', () => {
    const action = btn.getAttribute('data-nav');
    if (action === 'today') focusDate = new Date();
    else if (action === 'prev') {
      if (currentView === 'month') focusDate.setMonth(focusDate.getMonth() - 1);
      else if (currentView === 'week') focusDate.setDate(focusDate.getDate() - 7);
      else focusDate.setDate(focusDate.getDate() - 1);
    } else if (action === 'next') {
      if (currentView === 'month') focusDate.setMonth(focusDate.getMonth() + 1);
      else if (currentView === 'week') focusDate.setDate(focusDate.getDate() + 7);
      else focusDate.setDate(focusDate.getDate() + 1);
    }
    setFocusDate();
  }));

  openCreate.forEach((btn) => btn.addEventListener('click', () => openCreateModal('create')));
  openBlock.forEach((btn) => btn.addEventListener('click', () => openCreateModal('block')));

  closeCreate.forEach((btn) => btn.addEventListener('click', () => {
    createModal?.classList.remove('open');
    if (createStatus) createStatus.textContent = '';
  }));

  submitCreate?.addEventListener('click', async () => {
    const mode = createModal?.dataset.mode || 'create';
    const payload = mode === 'block'
      ? {
          firstName: 'Blocked',
          lastName: 'Time',
          email: 'blocked@availability.local',
          appointmentType: 'Block Off Time',
          date: createDate.value,
          time: createTime.value,
          source: 'admin-block-off'
        }
      : (() => {
          const clientName = createClient?.value?.trim() || 'Unnamed Client';
          const [firstName, ...rest] = clientName.split(' ');
          return {
            firstName: firstName || 'Guest',
            lastName: rest.join(' ') || 'Client',
            email: 'admin-created@example.test',
            appointmentType: 'Manual Create',
            date: createDate.value,
            time: createTime.value,
            source: 'admin-manual-create'
          };
        })();

    try {
      const appointment = await createAppointmentRequest(payload);
      if (createStatus) createStatus.textContent = `${mode === 'block' ? 'Blocked' : 'Created'} appointment ${appointment.id} for ${appointment.date} ${appointment.time}.`;
      await refreshAdminAppointments();
    } catch (error) {
      if (createStatus) createStatus.textContent = error.message;
    }
  });

  detailNotes?.addEventListener('input', () => {
    if (detailStatus) detailStatus.textContent = '';
  });

  refreshAppointments?.addEventListener('click', refreshAdminAppointments);

  setFocusDate();
  refreshAdminAppointments();
}

export function wireBookingDemo() {
  const step1 = document.querySelector("[data-booking-step='1']");
  const step2 = document.querySelector("[data-booking-step='2']");
  const first = document.querySelector('[data-booking-first]');
  const last = document.querySelector('[data-booking-last]');
  const email = document.querySelector('[data-booking-email]');
  const type = document.querySelector('[data-booking-type]');
  const summary = document.querySelector('[data-booking-summary]');
  const date = document.querySelector('[data-booking-date]');
  const time = document.querySelector('[data-booking-time]');
  const note = document.querySelector('[data-booking-availability-note]');
  const status = document.querySelector('[data-booking-status]');
  const cont = document.querySelector('[data-booking-continue]');
  const back = document.querySelector('[data-booking-back]');
  const confirm = document.querySelector('[data-booking-confirm]');
  let blockedByDate = {};

  const refreshAvailability = async () => {
    const selectedDate = date?.value || isoDate(new Date());
    if (!date.value) date.value = selectedDate;
    const rows = await listAppointmentsRequest();
    const blocked = rows.filter((a) => isBlocked(a) && a.date === selectedDate).map((a) => a.time);
    blockedByDate[selectedDate] = blocked;

    [...time.options].forEach((opt) => {
      const unavailable = blocked.includes(opt.value);
      opt.disabled = unavailable;
      if (unavailable) opt.textContent = `${opt.value} (unavailable)`;
      else opt.textContent = opt.value;
    });

    if (time.value && blocked.includes(time.value)) {
      const firstAvailable = [...time.options].find((o) => !o.disabled);
      if (firstAvailable) time.value = firstAvailable.value;
    }

    if (note) note.textContent = blocked.length ? `Unavailable on ${selectedDate}: ${blocked.join(', ')}.` : 'All listed slots are currently available.';
  };

  date?.addEventListener('change', refreshAvailability);

  cont?.addEventListener('click', async () => {
    await refreshAvailability();
    const selectedDate = date.value;
    const blocked = blockedByDate[selectedDate] || [];
    if (blocked.includes(time.value)) {
      if (status) status.textContent = `Selected time ${time.value} is unavailable due to a blocked slot.`;
      return;
    }
    const fullName = `${first?.value?.trim() || ''} ${last?.value?.trim() || ''}`.trim() || 'Guest';
    const selected = type?.value || 'Initial consultation';
    if (summary) summary.textContent = `${fullName} (${email?.value || 'no email'}) — ${selected} on ${date?.value} at ${time?.value}.`;
    step1?.classList.add('hidden');
    step2?.classList.remove('hidden');
  });

  back?.addEventListener('click', () => {
    step2?.classList.add('hidden');
    step1?.classList.remove('hidden');
    if (status) status.textContent = '';
  });

  confirm?.addEventListener('click', async () => {
    const selectedDate = date.value || isoDate(new Date());
    await refreshAvailability();
    const blocked = blockedByDate[selectedDate] || [];
    if (blocked.includes(time.value)) {
      if (status) status.textContent = `Booking failed: ${time.value} is unavailable (blocked).`;
      return;
    }

    const payload = {
      firstName: first?.value?.trim() || 'Guest',
      lastName: last?.value?.trim() || 'Customer',
      email: email?.value?.trim() || 'guest@example.test',
      appointmentType: type?.value || 'Initial consultation',
      date: selectedDate,
      time: time?.value || '09:00',
      source: 'public-booking'
    };

    try {
      const appointment = await createAppointmentRequest(payload);
      if (status) status.textContent = `Booking confirmed and saved as ${appointment.id}.`;
    } catch (error) {
      if (status) status.textContent = `Booking failed: ${error.message}`;
    }
  });

  refreshAvailability();
}

export function wireClientSelfService() {
  const trigger = document.querySelector('[data-open-modal]');
  const modal = document.querySelector('.modal');
  const close = document.querySelector('[data-close-modal]');
  const save = document.querySelector('[data-client-save]');
  const status = document.querySelector('[data-client-status]');
  const date = document.querySelector('[data-client-date]');
  const time = document.querySelector('[data-client-time]');
  const refreshBtn = document.querySelector('[data-client-refresh]');
  const listNode = document.querySelector('[data-client-appointments-list]');
  const emptyNode = document.querySelector('[data-client-appointments-empty]');

  const refreshClientAppointments = async () => {
    try {
      const rows = await listAppointmentsRequest();
      renderAppointmentList(rows, listNode, emptyNode);
    } catch (error) {
      if (emptyNode) {
        emptyNode.textContent = `Unable to load appointments: ${error.message}`;
        emptyNode.classList.remove('hidden');
      }
    }
  };

  trigger?.addEventListener('click', () => {
    if (status) status.textContent = '';
    if (!date.value) date.value = isoDate(new Date());
    modal?.classList.add('open');
  });

  close?.addEventListener('click', () => {
    modal?.classList.remove('open');
    if (status) status.textContent = '';
  });

  save?.addEventListener('click', () => {
    if (status) status.textContent = `Rescheduled to ${date.value} at ${time.value}.`;
    setTimeout(() => modal?.classList.remove('open'), 500);
  });

  refreshBtn?.addEventListener('click', refreshClientAppointments);

  refreshClientAppointments();
}
