export const permissions = {
  admin: ['calendar:view', 'appointments:edit'],
  client: ['appointments:view-self'],
  public: ['booking:create']
};

export function can(role, perm) {
  return (permissions[role] || []).includes(perm);
}

const isoDate = (d) => d.toISOString().slice(0, 10);

export function wireAdminCalendar() {
  const menuBtn = document.querySelector('[data-mobile-menu]');
  const sidenav = document.querySelector('.sidenav');
  const detail = document.querySelector('.detail-panel');
  const openers = [...document.querySelectorAll('[data-open-detail]')];
  const closer = document.querySelector('[data-close-detail]');
  const selectedTime = document.querySelector('[data-selected-time]');
  const main = document.querySelector('.calendar-main');
  const viewBtns = [...document.querySelectorAll('[data-view]')];
  const viewLabel = document.querySelector('[data-view-label]');

  const createModal = document.querySelector('[data-create-modal]');
  const openCreate = [...document.querySelectorAll('[data-open-create]')];
  const closeCreate = [...document.querySelectorAll('[data-close-create]')];
  const createDate = document.querySelector('[data-create-date]');

  menuBtn?.addEventListener('click', () => sidenav?.classList.toggle('open'));

  openers.forEach((btn) => btn.addEventListener('click', () => {
    const time = (btn.querySelector('.time-label')?.textContent || '').trim();
    if (time && selectedTime) selectedTime.textContent = time;
    detail?.classList.add('open');
  }));
  closer?.addEventListener('click', () => detail?.classList.remove('open'));

  viewBtns.forEach((btn) => btn.addEventListener('click', () => {
    const nextView = btn.getAttribute('data-view');
    if (!nextView || !main) return;
    main.setAttribute('data-calendar-view', nextView);
    if (viewLabel) viewLabel.textContent = `${nextView[0].toUpperCase()}${nextView.slice(1)} view`;
  }));

  openCreate.forEach((btn) => btn.addEventListener('click', () => {
    if (createDate) createDate.value = isoDate(new Date());
    createModal?.classList.add('open');
  }));
  closeCreate.forEach((btn) => btn.addEventListener('click', () => createModal?.classList.remove('open')));
}

export function wireModal() {
  const trigger = document.querySelector('[data-open-modal]');
  const modal = document.querySelector('.modal');
  const close = document.querySelector('[data-close-modal]');
  trigger?.addEventListener('click', () => modal?.classList.add('open'));
  close?.addEventListener('click', () => modal?.classList.remove('open'));
}
