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
    li.textContent = appointmentLabel(a);
    listNode.appendChild(li);
  });
};

export function wireAdminCalendar() {
  const menuBtn = document.querySelector('[data-mobile-menu]');
  const sidenav = document.querySelector('.sidenav');
  const detail = document.querySelector('.detail-panel');
  const openers = [...document.querySelectorAll('[data-open-detail]')];
  const closer = document.querySelector('[data-close-detail]');
  const cancelDetail = document.querySelector('[data-cancel-detail]');
  const saveDetail = document.querySelector('[data-save-detail]');
  const detailNotes = document.querySelector('[data-detail-notes]');
  const detailStatus = document.querySelector('[data-detail-status]');
  const selectedTime = document.querySelector('[data-selected-time]');

  const main = document.querySelector('.calendar-main');
  const viewBtns = [...document.querySelectorAll('[data-view]')];
  const viewLabel = document.querySelector('[data-view-label]');

  const focusDateNode = document.querySelector('[data-focus-date]');
  const navButtons = [...document.querySelectorAll('[data-nav]')];
  let focusDate = new Date();

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

  const refreshAdminAppointments = async () => {
    try {
      const rows = await listAppointmentsRequest();
      renderAppointmentList(rows, adminList, adminEmpty);
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
  };

  const closeDetailPanel = () => {
    detail?.classList.remove('open');
    if (detailStatus) detailStatus.textContent = '';
  };

  const openCreateModal = (mode) => {
    if (!createModal || !createDate || !createTitle || !submitCreate) return;
    createDate.value = isoDate(focusDate);
    createStatus.textContent = '';
    const isBlock = mode === 'block';
    createTitle.textContent = isBlock ? 'Block Off Time' : 'Manual Create Appointment';
    submitCreate.textContent = isBlock ? 'Save blocked time' : 'Create appointment';
    if (clientField) clientField.classList.toggle('hidden', isBlock);
    createModal.dataset.mode = mode;
    createModal.classList.add('open');
  };

  menuBtn?.addEventListener('click', () => sidenav?.classList.toggle('open'));

  openers.forEach((btn) => btn.addEventListener('click', () => {
    const time = (btn.querySelector('.time-label')?.textContent || '').trim();
    if (time && selectedTime) selectedTime.textContent = time;
    if (detailStatus) detailStatus.textContent = '';
    detail?.classList.add('open');
  }));

  closer?.addEventListener('click', closeDetailPanel);
  cancelDetail?.addEventListener('click', closeDetailPanel);
  saveDetail?.addEventListener('click', () => {
    if (detailStatus) detailStatus.textContent = `Saved notes for ${selectedTime?.textContent || 'appointment'} on ${formatDisplayDate(focusDate)}.`;
  });

  viewBtns.forEach((btn) => btn.addEventListener('click', () => {
    const nextView = btn.getAttribute('data-view');
    if (!nextView || !main) return;
    main.setAttribute('data-calendar-view', nextView);
    if (viewLabel) viewLabel.textContent = `${nextView[0].toUpperCase()}${nextView.slice(1)} view`;
  }));

  navButtons.forEach((btn) => btn.addEventListener('click', () => {
    const action = btn.getAttribute('data-nav');
    if (action === 'today') focusDate = new Date();
    else if (action === 'prev') focusDate.setDate(focusDate.getDate() - 1);
    else if (action === 'next') focusDate.setDate(focusDate.getDate() + 1);
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
    if (mode === 'block') {
      if (createStatus) createStatus.textContent = `Blocked ${createDate.value} at ${createTime.value}.`;
      return;
    }

    const clientName = createClient?.value?.trim() || 'Unnamed';
    const [firstName, ...rest] = clientName.split(' ');
    const payload = {
      firstName: firstName || 'Guest',
      lastName: rest.join(' ') || 'Client',
      email: 'admin-created@example.test',
      appointmentType: 'Manual Create',
      date: createDate.value,
      time: createTime.value,
      source: 'admin-manual-create'
    };

    try {
      const appointment = await createAppointmentRequest(payload);
      if (createStatus) createStatus.textContent = `Created appointment ${appointment.id} for ${clientName} on ${createDate.value} at ${createTime.value}.`;
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
  const status = document.querySelector('[data-booking-status]');
  const cont = document.querySelector('[data-booking-continue]');
  const back = document.querySelector('[data-booking-back]');
  const confirm = document.querySelector('[data-booking-confirm]');

  cont?.addEventListener('click', () => {
    const fullName = `${first?.value?.trim() || ''} ${last?.value?.trim() || ''}`.trim() || 'Guest';
    const selected = type?.value || 'Initial consultation';
    if (!date.value) date.value = isoDate(new Date());
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
    const payload = {
      firstName: first?.value?.trim() || 'Guest',
      lastName: last?.value?.trim() || 'Customer',
      email: email?.value?.trim() || 'guest@example.test',
      appointmentType: type?.value || 'Initial consultation',
      date: date?.value || isoDate(new Date()),
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
