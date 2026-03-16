export const permissions = {
  admin: ['calendar:view', 'appointments:edit'],
  client: ['appointments:view-self'],
  public: ['booking:create']
};

export function can(role, perm) {
  return (permissions[role] || []).includes(perm);
}

export function wireAdminCalendar() {
  const menuBtn = document.querySelector('[data-mobile-menu]');
  const sidenav = document.querySelector('.sidenav');
  const detail = document.querySelector('.detail-panel');
  const openers = [...document.querySelectorAll('[data-open-detail]')];
  const closer = document.querySelector('[data-close-detail]');

  menuBtn?.addEventListener('click', () => sidenav?.classList.toggle('open'));
  openers.forEach((btn) => btn.addEventListener('click', () => detail?.classList.add('open')));
  closer?.addEventListener('click', () => detail?.classList.remove('open'));
}

export function wireModal() {
  const trigger = document.querySelector('[data-open-modal]');
  const modal = document.querySelector('.modal');
  const close = document.querySelector('[data-close-modal]');
  trigger?.addEventListener('click', () => modal?.classList.add('open'));
  close?.addEventListener('click', () => modal?.classList.remove('open'));
}
