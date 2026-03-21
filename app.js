import {
  BASE_DATE,
  addDays,
  cancelAppointment,
  createAppointment,
  createExportArtifact,
  createBlockedSlot,
  createDomainExportPayload,
  createInitialState,
  createReportExportPayload,
  deriveReportRows,
  findClientAppointments,
  formatLongDate,
  getAvailableSlots,
  getBookingBarSnippet,
  getBookingButtonSnippet,
  getDirectLinks,
  getEmbedSnippet,
  getEnabledServices,
  getGeneralLink,
  getIntegrationSurfaceDescriptors,
  getIcsLink,
  getApiDocsEntry,
  getPublicBasePath,
  getSafeIntegrationsConfig,
  getSafeSchedulingConfig,
  getVisibleDayItems,
  importDomainPayload,
  persistDomainState,
  prepareImportPayload,
  resetPersistedDomainState,
  rescheduleAppointment,
  rotateApiKey,
  SERVICE_DEFINITIONS,
} from './logic.js';

function createMemoryStorage() {
  const values = new Map();
  return {
    getItem(key) {
      return values.has(key) ? values.get(key) : null;
    },
    setItem(key, value) {
      values.set(key, String(value));
    },
  };
}

function getStorage() {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      return window.localStorage;
    }
  } catch {
    return createMemoryStorage();
  }

  return createMemoryStorage();
}

const storage = getStorage();
const state = createInitialState(storage);
const root = document.getElementById('app');

const navLinks = [
  ['/admin/calendar', 'Calendar'],
  ['/admin/scheduling-page', 'Scheduling Page'],
  ['/admin/integrations', 'Integrations'],
  ['/admin/reports', 'Reports'],
  ['/booking/demo', 'Booking Demo'],
  ['/client', 'Client'],
];

const intakeQuestions = [
  'How did you hear about us?',
  'What is your primary scheduling goal?',
  'What follow-up format do you prefer?',
];

function persistDomain() {
  persistDomainState(storage, state.domain);
}

function routeTo(path) {
  state.route = path;
  history.pushState({}, '', path);
  applyRouteQueryToBookingForm();
  render();
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function getOrigin() {
  try {
    return window.location.origin;
  } catch {
    return 'https://acuity-clone.local';
  }
}

function getQueryParam(name) {
  try {
    return new URLSearchParams(window.location.search).get(name) || '';
  } catch {
    return '';
  }
}

function downloadArtifact(artifact) {
  if (!artifact) {
    return { ok: false, error: 'No export payload is available for this action.' };
  }

  let objectUrl = '';
  let anchor = null;
  try {
    if (typeof window === 'undefined' || typeof Blob === 'undefined' || !window.URL?.createObjectURL) {
      return { ok: false, error: 'Browser download is unavailable in this environment.' };
    }

    const blob = new Blob([artifact.payload], { type: artifact.mimeType });
    objectUrl = window.URL.createObjectURL(blob);
    anchor = document.createElement('a');
    anchor.href = objectUrl;
    anchor.download = artifact.filename;
    anchor.rel = 'noreferrer';
    anchor.style.display = 'none';
    document.body.append(anchor);
    anchor.click();
    return { ok: true, error: null };
  } catch {
    return { ok: false, error: 'Browser download is unavailable in this environment.' };
  } finally {
    if (anchor) {
      anchor.remove();
    }
    if (objectUrl) {
      window.URL.revokeObjectURL(objectUrl);
    }
  }
}

function applyRecoveredDomain(domainState, message) {
  state.domain = domainState;
  state.clientDrafts = {};
  state.confirmation = null;
  state.reportPayload = '';
  state.importPayload = '';
  state.reportMessage = '';
  state.importMessage = message;
  state.importSourceLabel = 'Import textarea';
  state.recoveryMessage = '';
}

function applyRouteQueryToBookingForm() {
  if (state.route !== '/booking/demo') {
    return;
  }

  const requestedSlug = getQueryParam('service');
  if (!requestedSlug) {
    return;
  }

  const matchedService = Object.entries(SERVICE_DEFINITIONS).find(([, meta]) => meta.slug === requestedSlug)?.[0];
  if (matchedService) {
    state.bookingForm.service = matchedService;
  }
}

function renderNav() {
  return navLinks
    .map(([href, label]) => `<button class="nav-link${state.route === href ? ' active' : ''}" data-route="${href}">${label}</button>`)
    .join('');
}

function getEnabledServiceOptions() {
  return getEnabledServices(getSafeSchedulingConfig(state.domain?.schedulingConfig));
}

function renderServiceOptions(selectedService) {
  return getEnabledServiceOptions()
    .map((serviceName) => `<option${selectedService === serviceName ? ' selected' : ''}>${serviceName}</option>`)
    .join('');
}

function daySummary(date) {
  const appointmentCount = state.domain.appointments.filter((appointment) => appointment.date === date && appointment.status !== 'cancelled').length;
  const blockedCount = state.domain.blockedSlots.filter((slot) => slot.date === date).length;
  return `<button class="calendar-cell${state.selectedDate === date ? ' active' : ''}" data-select-date="${date}">
      <strong>${escapeHtml(formatLongDate(date))}</strong>
      <span>${appointmentCount} appointments</span>
      <span>${blockedCount} blocked slots</span>
    </button>`;
}

function renderCalendar() {
  const visibleItems = getVisibleDayItems(state.domain, state.selectedDate);
  return `<section class="panel-grid two-column">
      <div class="panel stack-gap">
        <div class="toolbar wrap">
          ${['day', 'week', 'month'].map((mode) => `<button class="pill-button${state.viewMode === mode ? ' active' : ''}" data-view-mode="${mode}">${mode[0].toUpperCase() + mode.slice(1)}</button>`).join('')}
        </div>
        <div class="toolbar wrap spread">
          <div class="toolbar wrap">
            <button class="secondary-button" data-nav-date="prev">Prev</button>
            <button class="secondary-button" data-nav-date="today">Today</button>
            <button class="secondary-button" data-nav-date="next">Next</button>
          </div>
          <div class="status-chip">${state.viewMode.toUpperCase()} · ${escapeHtml(formatLongDate(state.selectedDate))}</div>
        </div>
        <div class="calendar-grid">
          ${['2026-03-18', '2026-03-19', '2026-03-20', '2026-03-21'].map(daySummary).join('')}
        </div>
        <div class="panel muted-panel">
          <h3>Saved appointments</h3>
          <div class="list-stack">
            ${state.domain.appointments.map((appointment) => `<article class="list-item"><div><strong>${escapeHtml(appointment.service)}</strong><p>${escapeHtml(appointment.clientName)} · ${escapeHtml(appointment.date)} ${escapeHtml(appointment.time)} · ${escapeHtml(appointment.bookingReference)}</p></div><span class="status-chip">${appointment.source === 'admin-manual' ? 'Manual' : 'Booked'}</span></article>`).join('')}
          </div>
        </div>
      </div>
      <div class="stack-gap">
        <section class="panel stack-gap">
          <div><p class="eyebrow">Detail pane</p><h3>Selected day details</h3><p>Appointments and blocked slots for ${escapeHtml(formatLongDate(state.selectedDate))}.</p></div>
          <div class="list-stack">
            ${visibleItems.length ? visibleItems.map((item) => `<article class="list-item"><div><strong>${escapeHtml(item.title)}</strong><p>${escapeHtml(item.subtitle)}</p></div><span class="status-chip${item.type === 'blocked' ? ' warning' : ''}">${escapeHtml(item.type)}</span></article>`).join('') : '<p class="empty-state">No appointments or blocks for this day yet.</p>'}
          </div>
        </section>
        <section class="panel stack-gap">
          <div><p class="eyebrow">Manual Create Appointment</p><h3>Manual Create Appointment</h3></div>
          <div class="form-grid">
            <label>Service<select name="manual-service">${renderServiceOptions(state.manualForm.service)}</select></label>
            <label>Client name<input name="manual-clientName" value="${escapeHtml(state.manualForm.clientName)}"></label>
            <label>Client email<input name="manual-clientEmail" value="${escapeHtml(state.manualForm.clientEmail)}"></label>
            <label>Date<input type="date" name="manual-date" value="${escapeHtml(state.manualForm.date)}"></label>
            <label>Time<input type="time" name="manual-time" value="${escapeHtml(state.manualForm.time)}"></label>
          </div>
          <button class="primary-button" data-action="save-manual">Save appointment</button>
        </section>
        <section class="panel stack-gap">
          <div><p class="eyebrow">Block Off Time</p><h3>Block Off Time</h3></div>
          <div class="form-grid">
            <label>Date<input type="date" name="block-date" value="${escapeHtml(state.blockForm.date)}"></label>
            <label>Time<input type="time" name="block-time" value="${escapeHtml(state.blockForm.time)}"></label>
            <label>Reason<input name="block-reason" value="${escapeHtml(state.blockForm.reason)}"></label>
          </div>
          <button class="secondary-button" data-action="save-block">Save blocked time</button>
        </section>
      </div>
    </section>`;
}

function renderBooking() {
  const config = state.domain.schedulingConfig;
  const availableSlots = getAvailableSlots(state.bookingForm.date, state.domain.appointments, state.domain.blockedSlots);
  return `<section class="panel-grid two-column">
      <div class="panel stack-gap" style="border-color:${config.accentColor};background:${config.surfaceColor};font-family:${config.fontFamily};">
        <div>
          <p class="eyebrow">Public Booking</p>
          <h3>${escapeHtml(config.businessName)}</h3>
          <p>${escapeHtml(config.headline)}</p>
          ${config.showBookingBar ? `<div class="status-chip">Booking bar enabled</div>` : ''}
        </div>
        <div class="form-grid">
          <label>Service<select name="booking-service">${renderServiceOptions(state.bookingForm.service)}</select></label>
          <label>Client name<input name="booking-clientName" value="${escapeHtml(state.bookingForm.clientName)}"></label>
          <label>Client email<input type="email" name="booking-clientEmail" value="${escapeHtml(state.bookingForm.clientEmail)}"></label>
          <label>Date<input type="date" name="booking-date" value="${escapeHtml(state.bookingForm.date)}"></label>
        </div>
        <div><p class="section-label">Available times ${config.showDuration ? `(duration shown on booking page)` : `(duration hidden on booking page)`}</p><div class="toolbar wrap">${availableSlots.length ? availableSlots.map((slot) => `<button class="pill-button${state.bookingForm.time === slot ? ' active' : ''}" data-book-slot="${slot}">${slot}</button>`).join('') : '<p class="empty-state">No remaining slots for this date.</p>'}</div></div>
        <button class="primary-button ${config.buttonStyle}" style="background:${config.accentColor};" data-action="confirm-booking" ${state.bookingForm.time && state.bookingForm.clientEmail.trim() ? '' : 'disabled'}>${escapeHtml(config.buttonLabel)}</button>
      </div>
      <div class="stack-gap">
        <section class="panel stack-gap"><h3>Booking availability integrity</h3><ul class="bullet-list"><li>Existing appointment at 09:00 on 2026-03-18 is hidden from public availability.</li><li>Blocked slot at 11:00 on 2026-03-18 is hidden from public availability.</li><li>Availability is derived from the same persisted appointment aggregate used by admin and client flows.</li></ul></section>
        <section class="panel stack-gap"><h3>Confirmation</h3>${state.confirmation ? `<div class="confirmation-card"><p class="eyebrow">Booking confirmed</p><strong>${escapeHtml(state.confirmation.service)}</strong><p>Reference ${escapeHtml(state.confirmation.bookingReference)} · ${escapeHtml(state.confirmation.date)} at ${escapeHtml(state.confirmation.time)}</p><p>${escapeHtml(state.confirmation.clientEmail)}</p></div>` : '<p class="empty-state">Choose a slot and confirm to render the accepted 11A confirmation state.</p>'}</section>
      </div>
    </section>`;
}

function getClientDraft(appointment) {
  if (!appointment) {
    return { date: '', time: '', message: 'Appointment not found.' };
  }

  if (!state.clientDrafts[appointment.id]) {
    state.clientDrafts[appointment.id] = {
      date: appointment.date,
      time: appointment.time,
      message: '',
    };
  }

  return state.clientDrafts[appointment.id];
}

function renderClient() {
  const appointments = findClientAppointments(state.domain, state.clientLookup);
  const hasLookup = state.clientLookup.submitted;

  return `<section class="panel-grid two-column">
      <section class="panel stack-gap">
        <div><p class="eyebrow">Client Self-Service</p><h3>Find your appointments</h3><p>Use the same client email or booking reference that exists on the persisted appointment record.</p></div>
        <div class="form-grid">
          <label>Email<input type="email" name="client-lookup-email" value="${escapeHtml(state.clientLookup.email)}" placeholder="jamie@example.com"></label>
          <label>Booking reference<input name="client-lookup-reference" value="${escapeHtml(state.clientLookup.bookingReference)}" placeholder="BK-1001"></label>
        </div>
        <div class="toolbar wrap">
          <button class="primary-button" data-action="search-client">Find appointments</button>
          <button class="secondary-button" data-action="clear-client-search">Clear</button>
        </div>
        ${hasLookup ? (appointments.length ? `<div class="list-stack">${appointments.map((appointment) => {
            const draft = getClientDraft(appointment);
            const slotOptions = getAvailableSlots(draft.date, state.domain.appointments, state.domain.blockedSlots, { ignoreAppointmentId: appointment.id });
            return `<article class="panel stack-gap"><div class="spread wrap"><div><strong>${escapeHtml(appointment.service)}</strong><p>${escapeHtml(appointment.clientName)} · ${escapeHtml(appointment.clientEmail)} · ${escapeHtml(appointment.bookingReference)}</p><p>${escapeHtml(appointment.date)} · ${escapeHtml(appointment.time)} · ${escapeHtml(appointment.status)}</p></div><span class="status-chip">Shared record</span></div><div class="form-grid"><label>Reschedule date<input type="date" name="client-draft-date-${appointment.id}" value="${escapeHtml(draft.date)}"></label><label>Reschedule time<select name="client-draft-time-${appointment.id}">${slotOptions.map((slot) => `<option value="${slot}"${draft.time === slot ? ' selected' : ''}>${slot}</option>`).join('')}</select></label></div><div class="toolbar wrap"><button class="secondary-button" data-action="reschedule-client" data-appointment-id="${appointment.id}">Save reschedule</button><button class="secondary-button" data-action="cancel-client" data-appointment-id="${appointment.id}">Cancel appointment</button></div>${draft.message ? `<p class="muted-text">${escapeHtml(draft.message)}</p>` : ''}</article>`;
          }).join('')}</div>` : '<p class="empty-state">No appointments matched that email / booking reference combination.</p>') : '<p class="empty-state">Enter an email or booking reference to access the same persisted appointment model used elsewhere.</p>'}
      </section>
      <section class="panel stack-gap"><h3>Self-service rules</h3><ul class="bullet-list"><li>No auth system is introduced; lookup is by client email and/or booking reference.</li><li>Reschedule and cancel mutate the same persisted record used by calendar and booking.</li><li>Visual validation remains unverified because external preview is unavailable.</li></ul></section>
    </section>`;
}

function renderSchedulingPage() {
  const config = getSafeSchedulingConfig(state.domain?.schedulingConfig);
  const origin = getOrigin();
  const generalLink = getGeneralLink(config, origin);
  const directLinks = getDirectLinks(config, origin);
  const embedSnippet = getEmbedSnippet(config, origin);
  const buttonSnippet = getBookingButtonSnippet(config, origin);
  const bookingBarSnippet = getBookingBarSnippet(config, origin);

  return `<section class="panel-grid two-column">
      <div class="stack-gap">
        <section class="panel stack-gap">
          <div><p class="eyebrow">Preview surface</p><h3>Live scheduling page preview</h3></div>
          <div class="preview-card" style="background:${config.surfaceColor};color:${config.accentColor};font-family:${config.fontFamily};">
            <div class="preview-header"><div><p class="preview-tag">${escapeHtml(config.template)} template</p><h4>${escapeHtml(config.businessName)}</h4></div>${config.showBusinessLogo ? '<span class="status-chip">Logo on</span>' : ''}</div>
            <p>${escapeHtml(config.headline)}</p>
            <div class="preview-service"><strong>${escapeHtml(getEnabledServiceOptions()[0] || 'No enabled services')}</strong><span>${config.showDuration ? 'Duration visible on booking page' : 'Duration hidden on booking page'}</span></div>
            <button class="preview-button ${config.buttonStyle}" style="background:${config.accentColor};" type="button">${escapeHtml(config.buttonLabel)}</button>
            <p>${config.showBookingBar ? 'Booking bar snippet is enabled.' : 'Booking bar snippet is hidden.'}</p>
          </div>
        </section>
        <section class="panel stack-gap">
          <div><p class="eyebrow">Distribution</p><h3>General link, direct links, iframe/embed, booking button, booking bar</h3></div>
          <article class="list-item"><div><strong>General link</strong><p>${escapeHtml(generalLink)}</p></div></article>
          <div class="list-stack">${directLinks.map((link) => `<article class="list-item"><div><strong>${escapeHtml(link.label)}</strong><p>${escapeHtml(link.url)}</p></div></article>`).join('')}</div>
          <label>Iframe / embed<textarea rows="4" readonly>${escapeHtml(embedSnippet)}</textarea></label>
          <label>Booking button snippet<textarea rows="4" readonly>${escapeHtml(buttonSnippet)}</textarea></label>
          <label>Booking bar snippet<textarea rows="4" readonly>${escapeHtml(bookingBarSnippet)}</textarea></label>
        </section>
      </div>
      <div class="stack-gap">
        <section class="panel stack-gap">
          <div><p class="eyebrow">Styles & settings</p><h3>Persisted config</h3></div>
          <div class="form-grid">
            <label>Business name<input name="cfg-businessName" value="${escapeHtml(config.businessName)}"></label>
            <label>Headline<input name="cfg-headline" value="${escapeHtml(config.headline)}"></label>
            <label>Button label<input name="cfg-buttonLabel" value="${escapeHtml(config.buttonLabel)}"></label>
            <label>General path<input name="cfg-generalPath" value="${escapeHtml(config.generalPath)}"></label>
            <label>Accent color<input type="color" name="cfg-accentColor" value="${config.accentColor}"></label>
            <label>Surface color<input type="color" name="cfg-surfaceColor" value="${config.surfaceColor}"></label>
            <label>Font family<select name="cfg-fontFamily">${['Inter, Arial, sans-serif', 'DM Sans, Arial, sans-serif', 'Merriweather, Georgia, serif'].map((font) => `<option value="${font}"${config.fontFamily === font ? ' selected' : ''}>${font.split(',')[0]}</option>`).join('')}</select></label>
            <label>Template<select name="cfg-template">${['classic', 'editorial', 'minimal'].map((value) => `<option value="${value}"${config.template === value ? ' selected' : ''}>${value}</option>`).join('')}</select></label>
            <label>Button style<select name="cfg-buttonStyle">${['pill', 'rounded', 'square'].map((value) => `<option value="${value}"${config.buttonStyle === value ? ' selected' : ''}>${value}</option>`).join('')}</select></label>
          </div>
          <div class="toggle-grid">
            ${[
              ['showBusinessLogo', 'Show logo'],
              ['showDuration', 'Show duration'],
              ['showStaffBios', 'Show staff bios'],
              ['compactHeader', 'Compact header'],
              ['showBookingBar', 'Show booking bar'],
            ].map(([key, label]) => `<label class="toggle-card"><input type="checkbox" name="cfg-${key}"${config[key] ? ' checked' : ''}><span>${label}</span></label>`).join('')}
          </div>
          <label>Enabled services<select multiple name="cfg-enabledServices">${Object.entries(SERVICE_DEFINITIONS).map(([serviceName, meta]) => `<option value="${meta.slug}"${config.enabledServiceSlugs.includes(meta.slug) ? ' selected' : ''}>${serviceName}</option>`).join('')}</select></label>
        </section>
        <section class="panel stack-gap"><div><p class="eyebrow">Advanced CSS</p><h3>Gated entrypoint</h3><p>Advanced CSS remains locked in this sandbox-only validation mode.</p></div><div class="gated-card"><strong>Premium feature</strong><p>Custom CSS is explicitly unavailable here; the entrypoint is visible but locked.</p><button class="secondary-button" type="button">Upgrade context</button></div></section>
      </div>
    </section>`;
}

function renderIntegrationInfoSections() {
  const config = getSafeIntegrationsConfig(state.domain?.integrationsConfig);
  const descriptors = getIntegrationSurfaceDescriptors(config);
  return `
    <section class="panel stack-gap">
      <div><p class="eyebrow">Provider-specific setup</p><h3>QuickBooks, Zoom, Zoho Flow, Zapier</h3></div>
      <div class="card-grid two-column">
        <article class="panel subtle"><div class="toolbar wrap"><strong>QuickBooks</strong><span class="status-chip">${escapeHtml(config.quickbooks.state)}</span><span class="status-chip subtle-chip">${escapeHtml(descriptors.quickbooks.access)}</span></div><p>${escapeHtml(config.quickbooks.statusText)}</p></article>
        <article class="panel subtle"><div class="toolbar wrap"><strong>Zoom</strong><span class="status-chip">${escapeHtml(config.zoom.state)}</span><span class="status-chip subtle-chip">${escapeHtml(descriptors.zoom.access)}</span></div><p>${escapeHtml(config.zoom.statusText)}</p><p>Default host: ${escapeHtml(config.zoom.defaultHost)}</p></article>
        <article class="panel subtle"><div class="toolbar wrap"><strong>Zoho Flow</strong><span class="status-chip">${escapeHtml(config.zohoFlow.state)}</span><span class="status-chip subtle-chip">${escapeHtml(descriptors.zohoFlow.access)}</span></div><p>${escapeHtml(config.zohoFlow.statusText)}</p></article>
        <article class="panel subtle"><div class="toolbar wrap"><strong>Zapier</strong><span class="status-chip">${escapeHtml(config.zapier.state)}</span><span class="status-chip subtle-chip">${escapeHtml(descriptors.zapier.access)}</span></div><p>${escapeHtml(config.zapier.statusText)}</p></article>
      </div>
    </section>`;
}

function renderIntegrations() {
  const config = getSafeIntegrationsConfig(state.domain?.integrationsConfig);
  const descriptors = getIntegrationSurfaceDescriptors(config);
  const docsEntry = getApiDocsEntry(config);
  return `<section class="stack-gap">
      ${renderIntegrationInfoSections()}
      <section class="panel-grid two-column">
        <section class="panel stack-gap">
          <div><p class="eyebrow">Google Analytics</p><h3>Measurement and secret setup</h3><div class="toolbar wrap"><span class="status-chip">Editable config</span><span class="status-chip subtle-chip">No live verification</span></div></div>
          <div class="form-grid">
            <label>Measurement ID<input name="ga-measurementId" value="${escapeHtml(config.googleAnalytics.measurementId)}" placeholder="G-XXXXXXXX"></label>
            <label>Secret Value<input name="ga-secretValue" value="${escapeHtml(config.googleAnalytics.secretValue)}" placeholder="secret_value"></label>
            <label class="toggle-card"><input type="checkbox" name="ga-anonymizeIp"${config.googleAnalytics.anonymizeIp ? ' checked' : ''}><span>Anonymize IP</span></label>
          </div>
        </section>
        <section class="panel stack-gap">
          <div><p class="eyebrow">API credentials</p><h3>User ID, API Key, reset and docs entrypoint</h3><div class="toolbar wrap"><span class="status-chip">${escapeHtml(descriptors.apiDocs.access)}</span><span class="status-chip subtle-chip">${docsEntry.isUsable ? 'Docs link ready' : 'Docs link unavailable'}</span></div></div>
          <div class="form-grid">
            <label>User ID<input readonly value="${escapeHtml(config.apiCredentials.userId)}"></label>
            <label>API Key<input readonly value="${escapeHtml(config.apiCredentials.apiKey)}"></label>
            <label>Docs URL<input readonly value="${escapeHtml(config.apiCredentials.docsUrl)}"></label>
          </div>
          <div class="toolbar wrap"><button class="secondary-button" data-action="reset-api-key">Reset API key</button>${docsEntry.isUsable ? `<a class="secondary-button link-button" href="${escapeHtml(docsEntry.url)}" target="_blank" rel="noreferrer">${escapeHtml(docsEntry.label)}</a>` : `<span class="muted-text">Docs URL is not currently usable.</span>`}</div>
        </section>
      </section>
      <section class="panel-grid two-column">
        <section class="panel stack-gap">
          <div><p class="eyebrow">Custom Sidebar Integration</p><h3>Editor / config surface</h3><div class="toolbar wrap"><span class="status-chip">${escapeHtml(descriptors.customSidebar.access)}</span><span class="status-chip subtle-chip">${escapeHtml(descriptors.customSidebar.mode)}</span></div></div>
          <label class="toggle-card"><input type="checkbox" name="sidebar-enabled"${config.customSidebar.enabled ? ' checked' : ''}><span>Enable sidebar HTML</span></label>
          <label>Sidebar HTML<textarea rows="6" name="sidebar-html">${escapeHtml(config.customSidebar.html)}</textarea></label>
        </section>
        <section class="panel stack-gap">
          <div><p class="eyebrow">Custom Conversion Tracking</p><h3>Editor / config surface</h3><div class="toolbar wrap"><span class="status-chip">${escapeHtml(descriptors.customConversionTracking.access)}</span><span class="status-chip subtle-chip">${escapeHtml(descriptors.customConversionTracking.mode)}</span></div></div>
          <label class="toggle-card"><input type="checkbox" name="conversion-enabled"${config.customConversionTracking.enabled ? ' checked' : ''}><span>Enable conversion tracking HTML</span></label>
          <label>Confirmation page HTML<textarea rows="6" name="conversion-html">${escapeHtml(config.customConversionTracking.html)}</textarea></label>
        </section>
      </section>
      <section class="panel-grid two-column">
        <section class="panel stack-gap">
          <div><p class="eyebrow">Webhooks</p><h3>Per-event configuration surface</h3><div class="toolbar wrap"><span class="status-chip">Adapter surface</span><span class="status-chip subtle-chip">No delivery simulation</span></div></div>
          <div class="list-stack">${config.webhooks.map((hook, index) => `<article class="list-item column-start"><div class="spread wrap full-width"><strong>${escapeHtml(hook.label)}</strong><label class="inline-toggle"><input type="checkbox" name="hook-enabled-${index}"${hook.enabled ? ' checked' : ''}>Enabled</label></div><input name="hook-url-${index}" value="${escapeHtml(hook.url)}" placeholder="https://example.com/webhook"></article>`).join('')}</div>
        </section>
        <section class="panel stack-gap">
          <div><p class="eyebrow">Calendar sync providers</p><h3>Provider-specific setup/info surfaces</h3><div class="toolbar wrap"><span class="status-chip">Two-way providers</span><span class="status-chip subtle-chip">${escapeHtml(descriptors.oneWayIcs.syncMode)}</span></div></div>
          <div class="list-stack">${config.calendarSyncProviders.map((provider, index) => `<article class="panel subtle"><div class="spread wrap"><strong>${escapeHtml(provider.name)}</strong><div class="toolbar wrap"><span class="status-chip">${escapeHtml(provider.state)}</span><span class="status-chip subtle-chip">two-way</span></div></div><p>${escapeHtml(provider.instructions)}</p><label>Status<select name="provider-state-${index}">${['disconnected', 'action-required', 'connected'].map((stateValue) => `<option value="${stateValue}"${provider.state === stateValue ? ' selected' : ''}>${stateValue}</option>`).join('')}</select></label></article>`).join('')}</div>
          <div class="gated-card info-card"><div class="toolbar wrap"><strong>One-way ICS publication</strong><span class="status-chip">${escapeHtml(descriptors.oneWayIcs.access)}</span><span class="status-chip subtle-chip">one-way</span></div><p>${escapeHtml(config.oneWayIcs.note)}</p><code>${escapeHtml(getIcsLink(state.domain, getOrigin()))}</code></div>
        </section>
      </section>
    </section>`;
}

function renderReportRows(rows) {
  return rows.length ? `<div class="list-stack">${rows.map((row) => `<article class="list-item"><div><strong>${escapeHtml(row.label)}</strong><p>${escapeHtml(row.detail || '')}</p></div><span class="status-chip">${escapeHtml(row.value)}</span></article>`).join('')}</div>` : '<p class="empty-state">No data for this tab under the active filters.</p>';
}

function renderReports() {
  const rows = deriveReportRows(state.selectedReportTab, state.domain, state.reportFilters, {
    question: state.selectedIntakeQuestion,
  });
  const currentPayload = state.reportPayload ? `<label>Generated payload<textarea rows="10" readonly>${escapeHtml(state.reportPayload)}</textarea></label>` : '';
  const recoveryNotice = state.recoveryMessage ? `<div class="gated-card"><strong>State recovery notice</strong><p>${escapeHtml(state.recoveryMessage)}</p><button class="secondary-button" data-action="reset-domain-state">Reset persisted demo state</button></div>` : '';

  return `<section class="stack-gap">
      <section class="panel stack-gap">
        <div class="toolbar wrap spread">
          <div class="toolbar wrap">${[
            ['appointments', 'Appointments'],
            ['revenue', 'Revenue'],
            ['users', 'Users'],
            ['intake-forms', 'Intake Forms'],
            ['tips', 'Tips'],
            ['import-export', 'Import-Export'],
          ].map(([id, label]) => `<button class="pill-button${state.selectedReportTab === id ? ' active' : ''}" data-report-tab="${id}">${label}</button>`).join('')}</div>
          <button class="secondary-button" data-action="export-report">Export current tab payload</button>
        </div>
        <div class="filter-grid">
          <label>Date range<select name="filter-dateRange">${[['last-7', 'Last 7 days'], ['last-30', 'Last 30 days'], ['this-month', 'This month']].map(([value, label]) => `<option value="${value}"${state.reportFilters.dateRange === value ? ' selected' : ''}>${label}</option>`).join('')}</select></label>
          <label>Calendar<select name="filter-calendar">${[['all', 'All calendars'], ['main', 'Main calendar'], ['virtual', 'Virtual calendar']].map(([value, label]) => `<option value="${value}"${state.reportFilters.calendar === value ? ' selected' : ''}>${label}</option>`).join('')}</select></label>
          <div class="filter-summary"><span class="status-chip">Applied filters</span><p>${escapeHtml(state.reportFilters.dateRange)} · ${escapeHtml(state.reportFilters.calendar)}</p></div>
        </div>
        ${state.reportMessage ? `<p class="muted-text">${escapeHtml(state.reportMessage)}</p>` : ''}
        ${currentPayload}
      </section>
      ${state.selectedReportTab === 'intake-forms' ? `<section class="panel stack-gap"><div><p class="eyebrow">Intake Forms</p><h3>Question-gated derived rows</h3></div><div class="toolbar wrap end"><label class="grow-field">Question<select name="intake-question"><option value="">Select a question</option>${intakeQuestions.map((question) => `<option value="${escapeHtml(question)}"${state.selectedIntakeQuestion === question ? ' selected' : ''}>${escapeHtml(question)}</option>`).join('')}</select></label><button class="primary-button" data-action="show-intake">Show</button></div>${!state.intakeShown || !state.selectedIntakeQuestion ? '<p class="empty-state">Select a question and click Show to see derived intake rows.</p>' : renderReportRows(rows)}</section>` : state.selectedReportTab === 'import-export' ? `<section class="panel stack-gap"><div><p class="eyebrow">Import-Export</p><h3>Honest utility surface</h3><p>Exports generate real JSON payloads. Browser download is attempted when available; the textarea remains the fallback and review path. Recovery resets persisted demo state to seed defaults.</p></div>${renderReportRows(rows)}${recoveryNotice}<div class="toolbar wrap"><button class="secondary-button" data-action="export-domain">Export full domain JSON</button><button class="secondary-button" data-action="import-domain">Import JSON payload</button><button class="secondary-button" data-action="reset-domain-state">Reset persisted demo state</button></div><label>Load JSON file<input type="file" name="import-file" accept=".json,application/json"></label><label>Import / export payload<textarea rows="10" name="import-payload">${escapeHtml(state.importPayload)}</textarea></label>${state.importMessage ? `<p class="muted-text">${escapeHtml(state.importMessage)}</p>` : ''}</section>` : `<section class="panel stack-gap"><div><p class="eyebrow">${escapeHtml(state.selectedReportTab)}</p><h3>Data-driven rows under shared filters</h3><p>Export generates a real JSON payload and attempts a browser download when available.</p></div>${renderReportRows(rows)}</section>`}
    </section>`;
}

function renderPageBody() {
  switch (state.route) {
    case '/booking/demo':
      return renderBooking();
    case '/client':
      return renderClient();
    case '/admin/scheduling-page':
      return renderSchedulingPage();
    case '/admin/integrations':
      return renderIntegrations();
    case '/admin/reports':
      return renderReports();
    case '/admin/calendar':
    default:
      return renderCalendar();
  }
}

function render() {
  root.innerHTML = `<div class="app-shell">
      <aside class="sidebar">
        <div><p class="eyebrow">Acuity Clone</p><h1 class="sidebar-title">Sandbox-only validation workspace</h1></div>
        <nav><p class="nav-heading">Routes</p><div class="nav-list">${renderNav()}</div></nav>
      </aside>
      <main class="content"><header class="page-header"><div><p class="eyebrow">Sandbox route</p><h2>${escapeHtml(state.route)}</h2></div><div class="header-note">Visual validation remains unverified without external preview</div></header>${renderPageBody()}</main>
    </div>`;
}

window.addEventListener('popstate', () => {
  state.route = location.pathname;
  applyRouteQueryToBookingForm();
  render();
});

document.addEventListener('click', (event) => {
  const target = event.target;
  if (!(target instanceof HTMLElement)) {
    return;
  }

  const route = target.dataset.route;
  if (route) {
    routeTo(route);
    return;
  }

  const viewMode = target.dataset.viewMode;
  if (viewMode) {
    state.viewMode = viewMode;
    render();
    return;
  }

  const navDate = target.dataset.navDate;
  if (navDate) {
    state.selectedDate = navDate === 'today' ? BASE_DATE : addDays(state.selectedDate, navDate === 'prev' ? -1 : 1);
    render();
    return;
  }

  const selectDate = target.dataset.selectDate;
  if (selectDate) {
    state.selectedDate = selectDate;
    render();
    return;
  }

  const slot = target.dataset.bookSlot;
  if (slot) {
    state.bookingForm.time = slot;
    render();
    return;
  }

  const appointmentId = target.dataset.appointmentId;
  const action = target.dataset.action;

  if (action === 'save-manual') {
    const createdAppointment = createAppointment(state.domain, {
      ...state.manualForm,
      status: 'scheduled',
      staff: 'Morgan Lee',
      source: 'admin-manual',
    });
    persistDomain();
    state.clientDrafts[createdAppointment.id] = {
      date: createdAppointment.date,
      time: createdAppointment.time,
      message: '',
    };
    render();
    return;
  }

  if (action === 'save-block') {
    createBlockedSlot(state.domain, { ...state.blockForm });
    persistDomain();
    render();
    return;
  }

  if (action === 'confirm-booking' && state.bookingForm.time && state.bookingForm.clientEmail.trim()) {
    const createdAppointment = createAppointment(state.domain, {
      service: state.bookingForm.service,
      clientName: state.bookingForm.clientName.trim() || 'Guest Client',
      clientEmail: state.bookingForm.clientEmail.trim().toLowerCase(),
      date: state.bookingForm.date,
      time: state.bookingForm.time,
      status: 'scheduled',
      staff: 'Morgan Lee',
      source: 'booking-demo',
    });
    persistDomain();
    state.confirmation = createdAppointment;
    state.clientLookup.email = createdAppointment.clientEmail;
    state.clientLookup.bookingReference = createdAppointment.bookingReference;
    render();
    return;
  }

  if (action === 'search-client') {
    state.clientLookup.submitted = true;
    render();
    return;
  }

  if (action === 'clear-client-search') {
    state.clientLookup = { email: '', bookingReference: '', submitted: false };
    state.clientDrafts = {};
    render();
    return;
  }

  if (action === 'reschedule-client' && appointmentId) {
    const draft = getClientDraft(state.domain.appointments.find((entry) => entry.id === appointmentId));
    const result = rescheduleAppointment(state.domain, appointmentId, { date: draft.date, time: draft.time });
    draft.message = result.error || 'Appointment updated.';
    if (!result.error) {
      persistDomain();
    }
    render();
    return;
  }

  if (action === 'cancel-client' && appointmentId) {
    const appointment = cancelAppointment(state.domain, appointmentId);
    const draft = state.clientDrafts[appointmentId] || { date: '', time: '', message: '' };
    draft.message = appointment ? 'Appointment cancelled.' : 'Appointment not found.';
    state.clientDrafts[appointmentId] = draft;
    if (appointment) {
      persistDomain();
    }
    render();
    return;
  }

  if (action === 'show-intake') {
    state.intakeShown = Boolean(state.selectedIntakeQuestion);
    render();
    return;
  }

  if (action === 'export-report') {
    const payload = createReportExportPayload(state.selectedReportTab, state.domain, state.reportFilters, {
      question: state.selectedIntakeQuestion,
    });
    const exportResult = createExportArtifact('report', payload || '', { tab: state.selectedReportTab });
    state.reportPayload = payload || '';
    if (exportResult.error) {
      state.reportMessage = exportResult.error;
      render();
      return;
    }

    const downloadResult = downloadArtifact(exportResult.artifact);
    state.reportMessage = downloadResult.ok
      ? `Exported ${exportResult.artifact.filename}.`
      : `${downloadResult.error} Payload remains available below as ${exportResult.artifact.filename}.`;
    render();
    return;
  }

  if (action === 'export-domain') {
    const payload = createDomainExportPayload(state.domain);
    const exportResult = createExportArtifact('domain', payload);
    state.importPayload = payload;
    state.importSourceLabel = 'Exported domain payload';
    if (exportResult.error) {
      state.importMessage = exportResult.error;
      render();
      return;
    }

    const downloadResult = downloadArtifact(exportResult.artifact);
    state.importMessage = downloadResult.ok
      ? `Exported ${exportResult.artifact.filename}.`
      : `${downloadResult.error} Payload remains available below as ${exportResult.artifact.filename}.`;
    render();
    return;
  }

  if (action === 'import-domain') {
    const preparedImport = prepareImportPayload(state.importPayload, state.importSourceLabel);
    if (preparedImport.error) {
      state.importMessage = preparedImport.error;
      render();
      return;
    }

    const result = importDomainPayload(preparedImport.payload);
    state.importMessage = result.error || `${state.importSourceLabel} imported successfully.`;
    if (result.domainState) {
      state.domain = result.domainState;
      persistDomain();
      state.recoveryMessage = '';
    }
    render();
    return;
  }

  if (action === 'reset-domain-state') {
    const resetDomain = resetPersistedDomainState(storage);
    applyRecoveredDomain(resetDomain, 'Persisted demo state was reset to seed defaults.');
    render();
    return;
  }

  if (action === 'reset-api-key') {
    rotateApiKey(state.domain);
    persistDomain();
    render();
    return;
  }

  const reportTab = target.dataset.reportTab;
  if (reportTab) {
    state.selectedReportTab = reportTab;
    state.reportMessage = '';
    state.reportPayload = '';
    if (reportTab !== 'intake-forms') {
      state.intakeShown = false;
    }
    render();
  }
});

document.addEventListener('change', (event) => {
  const target = event.target;
  if (!(target instanceof HTMLInputElement) || target.name !== 'import-file') {
    return;
  }

  const [file] = target.files || [];
  if (!file) {
    state.importMessage = 'No import file selected.';
    render();
    return;
  }

  const reader = new FileReader();
  reader.addEventListener('load', () => {
    const sourceLabel = `File ${file.name}`;
    const preparedImport = prepareImportPayload(typeof reader.result === 'string' ? reader.result : '', sourceLabel);
    state.importPayload = preparedImport.payload;
    state.importSourceLabel = sourceLabel;
    state.importMessage = preparedImport.error || `Loaded ${file.name}. Review the payload or import it now.`;
    render();
  });
  reader.addEventListener('error', () => {
    state.importMessage = `File ${file.name} could not be read as text.`;
    render();
  });
  reader.readAsText(file);
});

document.addEventListener('input', (event) => {
  const target = event.target;
  if (!(target instanceof HTMLInputElement || target instanceof HTMLSelectElement || target instanceof HTMLTextAreaElement)) {
    return;
  }

  const { name, value } = target;
  if (name.startsWith('manual-')) {
    state.manualForm[name.replace('manual-', '')] = value;
  } else if (name.startsWith('block-')) {
    state.blockForm[name.replace('block-', '')] = value;
  } else if (name === 'booking-service') {
    state.bookingForm.service = value;
  } else if (name === 'booking-clientName') {
    state.bookingForm.clientName = value;
  } else if (name === 'booking-clientEmail') {
    state.bookingForm.clientEmail = value;
  } else if (name === 'booking-date') {
    state.bookingForm.date = value;
    state.bookingForm.time = '';
  } else if (name === 'client-lookup-email') {
    state.clientLookup.email = value;
  } else if (name === 'client-lookup-reference') {
    state.clientLookup.bookingReference = value.toUpperCase();
  } else if (name.startsWith('client-draft-date-')) {
    const appointmentId = name.replace('client-draft-date-', '');
    const draft = state.clientDrafts[appointmentId] || { date: value, time: '', message: '' };
    draft.date = value;
    draft.message = '';
    const appointment = state.domain.appointments.find((entry) => entry.id === appointmentId);
    const nextSlots = getAvailableSlots(value, state.domain.appointments, state.domain.blockedSlots, { ignoreAppointmentId: appointmentId });
    draft.time = nextSlots.includes(draft.time) ? draft.time : (appointment && appointment.date === value ? appointment.time : nextSlots[0] || '');
    state.clientDrafts[appointmentId] = draft;
  } else if (name.startsWith('client-draft-time-')) {
    const appointmentId = name.replace('client-draft-time-', '');
    const draft = state.clientDrafts[appointmentId] || { date: '', time: value, message: '' };
    draft.time = value;
    draft.message = '';
    state.clientDrafts[appointmentId] = draft;
  } else if (name.startsWith('cfg-')) {
    const key = name.replace('cfg-', '');
    if (target instanceof HTMLSelectElement && target.multiple) {
      state.domain.schedulingConfig.enabledServiceSlugs = [...target.selectedOptions].map((option) => option.value);
    } else {
      state.domain.schedulingConfig[key] = target instanceof HTMLInputElement && target.type === 'checkbox' ? target.checked : value;
    }
    persistDomain();
  } else if (name === 'ga-measurementId') {
    state.domain.integrationsConfig.googleAnalytics.measurementId = value;
    persistDomain();
  } else if (name === 'ga-secretValue') {
    state.domain.integrationsConfig.googleAnalytics.secretValue = value;
    persistDomain();
  } else if (name === 'ga-anonymizeIp') {
    state.domain.integrationsConfig.googleAnalytics.anonymizeIp = target.checked;
    persistDomain();
  } else if (name === 'sidebar-enabled') {
    state.domain.integrationsConfig.customSidebar.enabled = target.checked;
    persistDomain();
  } else if (name === 'sidebar-html') {
    state.domain.integrationsConfig.customSidebar.html = value;
    persistDomain();
  } else if (name === 'conversion-enabled') {
    state.domain.integrationsConfig.customConversionTracking.enabled = target.checked;
    persistDomain();
  } else if (name === 'conversion-html') {
    state.domain.integrationsConfig.customConversionTracking.html = value;
    persistDomain();
  } else if (name.startsWith('hook-url-')) {
    const index = Number(name.replace('hook-url-', ''));
    state.domain.integrationsConfig.webhooks[index].url = value;
    persistDomain();
  } else if (name.startsWith('hook-enabled-')) {
    const index = Number(name.replace('hook-enabled-', ''));
    state.domain.integrationsConfig.webhooks[index].enabled = target.checked;
    persistDomain();
  } else if (name.startsWith('provider-state-')) {
    const index = Number(name.replace('provider-state-', ''));
    state.domain.integrationsConfig.calendarSyncProviders[index].state = value;
    persistDomain();
  } else if (name === 'filter-dateRange') {
    state.reportFilters.dateRange = value;
  } else if (name === 'filter-calendar') {
    state.reportFilters.calendar = value;
  } else if (name === 'intake-question') {
    state.selectedIntakeQuestion = value;
  } else if (name === 'import-payload') {
    state.importPayload = value;
    state.importSourceLabel = 'Import textarea';
  }
  render();
});

state.route = location.pathname;
applyRouteQueryToBookingForm();
render();
