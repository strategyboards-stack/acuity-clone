export const BASE_DATE = '2026-03-18';
export const SLOT_INVENTORY = ['09:00', '10:00', '11:00', '13:00', '14:00', '15:00'];
export const DOMAIN_STORAGE_KEY = 'acuity-clone-domain-store';
export const DOMAIN_SCHEMA_VERSION = 2;
export const JSON_EXPORT_MIME_TYPE = 'application/json';

export const SERVICE_DEFINITIONS = {
  'Discovery Call': {
    slug: 'discovery-call',
    durationMinutes: 30,
    priceCents: 0,
    calendarId: 'virtual',
  },
  'Initial Consultation': {
    slug: 'initial-consultation',
    durationMinutes: 60,
    priceCents: 15000,
    calendarId: 'main',
  },
};

const serviceOptions = Object.keys(SERVICE_DEFINITIONS);
const webhookDefinitions = [
  { event: 'new_appointment', label: 'New appointment' },
  { event: 'rescheduled', label: 'Rescheduled' },
  { event: 'cancelled', label: 'Cancelled' },
  { event: 'updated', label: 'Catch-all updated' },
  { event: 'order_completed', label: 'Order completed' },
];

const calendarSyncDefinitions = [
  {
    id: 'google-calendar',
    name: 'Google Calendar',
    state: 'disconnected',
    instructions: 'Connect Google Calendar to push Acuity appointments and block availability from busy Google events.',
  },
  {
    id: 'icloud',
    name: 'iCloud',
    state: 'action-required',
    instructions: 'Use an iCloud app-specific password before enabling Cronofy-mediated sync.',
  },
  {
    id: 'office-365',
    name: 'Outlook Office 365',
    state: 'disconnected',
    instructions: 'Connect a Microsoft 365 calendar for two-way availability blocking.',
  },
  {
    id: 'exchange',
    name: 'Outlook Exchange',
    state: 'disconnected',
    instructions: 'Connect an Exchange-hosted calendar for two-way sync.',
  },
  {
    id: 'outlook-com',
    name: 'Outlook.com',
    state: 'disconnected',
    instructions: 'Connect a consumer Outlook calendar for two-way sync.',
  },
];

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function isRecord(value) {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function slugifyLabel(value) {
  return String(value)
    .toLowerCase()
    .replaceAll(/[^a-z0-9]+/g, '-')
    .replaceAll(/^-+|-+$/g, '')
    || 'export';
}

function getServiceMeta(serviceName) {
  return SERVICE_DEFINITIONS[serviceName] || SERVICE_DEFINITIONS['Discovery Call'];
}

function createIntakeAnswers(serviceName, source) {
  return {
    'How did you hear about us?': source === 'admin-manual' ? 'Referral' : 'Website',
    'What is your primary scheduling goal?': serviceName === 'Initial Consultation' ? 'Implementation' : 'Discovery',
    'What follow-up format do you prefer?': serviceName === 'Discovery Call' ? 'Email' : 'SMS',
  };
}

function createSeedAppointment(base) {
  const serviceMeta = getServiceMeta(base.service);
  return {
    durationMinutes: serviceMeta.durationMinutes,
    priceCents: serviceMeta.priceCents,
    tipCents: base.tipCents || 0,
    calendarId: serviceMeta.calendarId,
    serviceSlug: serviceMeta.slug,
    intakeAnswers: createIntakeAnswers(base.service, base.source),
    ...base,
  };
}

export function createDefaultSchedulingConfig() {
  return {
    accentColor: '#0f766e',
    surfaceColor: '#ecfeff',
    fontFamily: 'Inter, Arial, sans-serif',
    showBusinessLogo: true,
    showDuration: true,
    showStaffBios: false,
    compactHeader: false,
    buttonStyle: 'pill',
    template: 'classic',
    businessName: 'Acuity Clone',
    headline: 'Book your time',
    generalPath: '/booking/demo',
    buttonLabel: 'Book now',
    showBookingBar: true,
    enabledServiceSlugs: serviceOptions.map((serviceName) => getServiceMeta(serviceName).slug),
  };
}

function createDefaultWebhookConfig() {
  return webhookDefinitions.map((definition, index) => ({
    ...definition,
    url: index === 0 ? 'https://example.com/hooks/new-appointment' : '',
    enabled: index === 0,
  }));
}

function createDefaultIntegrationConfig() {
  return {
    quickbooks: {
      state: 'disconnected',
      statusText: 'Accounting sync remains disconnected until you connect QuickBooks.',
    },
    zoom: {
      state: 'disconnected',
      statusText: 'Zoom meeting generation is currently disconnected.',
      defaultHost: 'Morgan Lee',
    },
    googleAnalytics: {
      measurementId: '',
      secretValue: '',
      anonymizeIp: true,
    },
    zohoFlow: {
      state: 'info',
      statusText: 'Use external Zoho Flow recipes; no native workflow builder exists here.',
    },
    zapier: {
      state: 'info',
      statusText: 'Workflow recipes stay external to this app.',
    },
    customSidebar: {
      enabled: false,
      html: '<div>Sidebar context: {{appointment.id}}</div>',
    },
    customConversionTracking: {
      enabled: false,
      html: '<script>console.log("conversion", "{{appointment.bookingReference}}")</script>',
    },
    apiCredentials: {
      userId: 'user_demo_1001',
      apiKey: 'api_demo_key_1001',
      docsUrl: 'https://developers.example.com/acuity-clone-api',
      helpLabel: 'API docs and help',
    },
    webhooks: createDefaultWebhookConfig(),
    calendarSyncProviders: clone(calendarSyncDefinitions),
    oneWayIcs: {
      enabled: true,
      path: '/calendar-sync/main.ics',
      note: 'This publishes a read-only ICS feed. It does not create two-way sync.',
    },
  };
}

const seedAppointments = [
  createSeedAppointment({
    id: 'apt-1001',
    bookingReference: 'BK-1001',
    service: 'Discovery Call',
    clientName: 'Jamie Rivera',
    clientEmail: 'jamie@example.com',
    staff: 'Morgan Lee',
    date: BASE_DATE,
    time: '09:00',
    status: 'scheduled',
    source: 'booking-demo',
    tipCents: 0,
  }),
  createSeedAppointment({
    id: 'apt-1002',
    bookingReference: 'BK-1002',
    service: 'Initial Consultation',
    clientName: 'Alex Chen',
    clientEmail: 'alex@example.com',
    staff: 'Morgan Lee',
    date: '2026-03-19',
    time: '13:00',
    status: 'scheduled',
    source: 'admin-manual',
    tipCents: 1200,
  }),
];

const seedBlockedSlots = [
  {
    id: 'block-1001',
    date: BASE_DATE,
    time: '11:00',
    reason: 'Team planning hold',
  },
];

export function createSeedDomainState() {
  return {
    schemaVersion: DOMAIN_SCHEMA_VERSION,
    nextAppointmentNumber: 1003,
    nextBlockedSlotNumber: 1002,
    appointments: clone(seedAppointments),
    blockedSlots: clone(seedBlockedSlots),
    schedulingConfig: createDefaultSchedulingConfig(),
    integrationsConfig: createDefaultIntegrationConfig(),
  };
}

function normalizeAppointment(appointment) {
  const serviceMeta = getServiceMeta(appointment.service);
  return {
    durationMinutes: appointment.durationMinutes || serviceMeta.durationMinutes,
    priceCents: Number.isInteger(appointment.priceCents) ? appointment.priceCents : serviceMeta.priceCents,
    tipCents: Number.isInteger(appointment.tipCents) ? appointment.tipCents : 0,
    calendarId: appointment.calendarId || serviceMeta.calendarId,
    serviceSlug: appointment.serviceSlug || serviceMeta.slug,
    intakeAnswers: appointment.intakeAnswers || createIntakeAnswers(appointment.service, appointment.source || 'booking-demo'),
    ...appointment,
  };
}

function migrateDomainState(candidate) {
  if (!candidate || typeof candidate !== 'object') {
    return null;
  }

  if (candidate.schemaVersion === DOMAIN_SCHEMA_VERSION) {
    return candidate;
  }

  if (candidate.schemaVersion === 1 && Array.isArray(candidate.appointments) && Array.isArray(candidate.blockedSlots)) {
    return {
      schemaVersion: DOMAIN_SCHEMA_VERSION,
      nextAppointmentNumber: Number.isInteger(candidate.nextAppointmentNumber) ? candidate.nextAppointmentNumber : 1003,
      nextBlockedSlotNumber: Number.isInteger(candidate.nextBlockedSlotNumber) ? candidate.nextBlockedSlotNumber : 1002,
      appointments: candidate.appointments.map(normalizeAppointment),
      blockedSlots: candidate.blockedSlots,
      schedulingConfig: createDefaultSchedulingConfig(),
      integrationsConfig: createDefaultIntegrationConfig(),
    };
  }

  return null;
}

export function createInitialState(storage) {
  const loadedState = loadDomainStateWithMeta(storage);
  return {
    route: '/admin/calendar',
    viewMode: 'week',
    selectedDate: BASE_DATE,
    selectedReportTab: 'appointments',
    selectedIntakeQuestion: '',
    intakeShown: false,
    reportMessage: '',
    reportPayload: '',
    importPayload: '',
    importMessage: '',
    importSourceLabel: 'Import textarea',
    recoveryMessage: loadedState.recoveryMessage,
    confirmation: null,
    manualForm: {
      service: 'Initial Consultation',
      clientName: 'Taylor Brooks',
      clientEmail: 'taylor@example.com',
      date: '2026-03-20',
      time: '14:00',
    },
    blockForm: {
      date: '2026-03-20',
      time: '10:00',
      reason: 'Focus block',
    },
    bookingForm: {
      service: 'Discovery Call',
      clientName: 'Jordan Kim',
      clientEmail: 'jordan@example.com',
      date: BASE_DATE,
      time: '',
    },
    clientLookup: {
      email: '',
      bookingReference: '',
      submitted: false,
    },
    clientDrafts: {},
    reportFilters: {
      dateRange: 'last-30',
      calendar: 'all',
    },
    domain: loadedState.domainState,
  };
}

function isValidAppointment(appointment) {
  return appointment
    && typeof appointment.id === 'string'
    && typeof appointment.bookingReference === 'string'
    && typeof appointment.clientEmail === 'string'
    && typeof appointment.date === 'string'
    && typeof appointment.time === 'string'
    && typeof appointment.status === 'string'
    && typeof appointment.serviceSlug === 'string'
    && typeof appointment.calendarId === 'string'
    && appointment.intakeAnswers
    && typeof appointment.intakeAnswers === 'object';
}

function isValidBlockedSlot(blockedSlot) {
  return blockedSlot
    && typeof blockedSlot.id === 'string'
    && typeof blockedSlot.date === 'string'
    && typeof blockedSlot.time === 'string'
    && typeof blockedSlot.reason === 'string';
}

function isValidSchedulingConfig(config) {
  return config
    && typeof config.businessName === 'string'
    && typeof config.generalPath === 'string'
    && Array.isArray(config.enabledServiceSlugs);
}

function isValidIntegrationConfig(config) {
  return config
    && config.googleAnalytics
    && config.apiCredentials
    && Array.isArray(config.webhooks)
    && Array.isArray(config.calendarSyncProviders)
    && config.oneWayIcs;
}

export function isValidDomainState(candidate) {
  return candidate
    && candidate.schemaVersion === DOMAIN_SCHEMA_VERSION
    && Number.isInteger(candidate.nextAppointmentNumber)
    && Number.isInteger(candidate.nextBlockedSlotNumber)
    && Array.isArray(candidate.appointments)
    && Array.isArray(candidate.blockedSlots)
    && candidate.appointments.every(isValidAppointment)
    && candidate.blockedSlots.every(isValidBlockedSlot)
    && isValidSchedulingConfig(candidate.schedulingConfig)
    && isValidIntegrationConfig(candidate.integrationsConfig);
}

export function loadDomainState(storage) {
  return loadDomainStateWithMeta(storage).domainState;
}

export function loadDomainStateWithMeta(storage) {
  const seed = createSeedDomainState();

  if (!storage || typeof storage.getItem !== 'function' || typeof storage.setItem !== 'function') {
    return { domainState: seed, recoveryMessage: null };
  }

  try {
    const raw = storage.getItem(DOMAIN_STORAGE_KEY);
    if (!raw) {
      storage.setItem(DOMAIN_STORAGE_KEY, JSON.stringify(seed));
      return { domainState: seed, recoveryMessage: null };
    }

    const parsed = JSON.parse(raw);
    const migrated = migrateDomainState(parsed);
    if (!migrated || !isValidDomainState(migrated)) {
      storage.setItem(DOMAIN_STORAGE_KEY, JSON.stringify(seed));
      return {
        domainState: seed,
        recoveryMessage: 'Persisted demo state was invalid and has been reset to seed defaults.',
      };
    }

    storage.setItem(DOMAIN_STORAGE_KEY, JSON.stringify(migrated));
    return { domainState: migrated, recoveryMessage: null };
  } catch {
    storage.setItem(DOMAIN_STORAGE_KEY, JSON.stringify(seed));
    return {
      domainState: seed,
      recoveryMessage: 'Persisted demo state could not be parsed and has been reset to seed defaults.',
    };
  }
}

export function persistDomainState(storage, domainState) {
  if (storage && typeof storage.setItem === 'function') {
    storage.setItem(DOMAIN_STORAGE_KEY, JSON.stringify(domainState));
  }
  return domainState;
}

export function resetPersistedDomainState(storage) {
  const seed = createSeedDomainState();
  persistDomainState(storage, seed);
  return seed;
}

export function addDays(date, days) {
  const value = new Date(`${date}T00:00:00Z`);
  value.setUTCDate(value.getUTCDate() + days);
  return value.toISOString().slice(0, 10);
}

export function formatLongDate(date) {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(`${date}T00:00:00Z`));
}

export function isSlotAvailable(date, time, appointments, blockedSlots, options = {}) {
  const appointmentTaken = appointments.some((appointment) => {
    if (appointment.id === options.ignoreAppointmentId) {
      return false;
    }

    return appointment.date === date && appointment.time === time && appointment.status !== 'cancelled';
  });

  const blocked = blockedSlots.some((slot) => slot.date === date && slot.time === time);
  return !appointmentTaken && !blocked;
}

export function getAvailableSlots(date, appointments, blockedSlots, options = {}) {
  return SLOT_INVENTORY.filter((time) => isSlotAvailable(date, time, appointments, blockedSlots, options));
}

export function getEnabledServices(schedulingConfig) {
  const safeConfig = getSafeSchedulingConfig(schedulingConfig);
  return serviceOptions.filter((serviceName) => safeConfig.enabledServiceSlugs.includes(getServiceMeta(serviceName).slug));
}

export function createAppointment(domainState, appointment) {
  const nextNumber = domainState.nextAppointmentNumber;
  const serviceMeta = getServiceMeta(appointment.service);
  const createdAppointment = {
    durationMinutes: serviceMeta.durationMinutes,
    priceCents: serviceMeta.priceCents,
    tipCents: Number.isInteger(appointment.tipCents) ? appointment.tipCents : 0,
    calendarId: serviceMeta.calendarId,
    serviceSlug: serviceMeta.slug,
    intakeAnswers: appointment.intakeAnswers || createIntakeAnswers(appointment.service, appointment.source),
    ...appointment,
    id: `apt-${nextNumber}`,
    bookingReference: `BK-${nextNumber}`,
  };

  domainState.appointments.push(createdAppointment);
  domainState.nextAppointmentNumber += 1;
  return createdAppointment;
}

export function createBlockedSlot(domainState, blockedSlot) {
  const nextNumber = domainState.nextBlockedSlotNumber;
  const createdBlockedSlot = {
    ...blockedSlot,
    id: `block-${nextNumber}`,
  };

  domainState.blockedSlots.push(createdBlockedSlot);
  domainState.nextBlockedSlotNumber += 1;
  return createdBlockedSlot;
}

export function cancelAppointment(domainState, appointmentId) {
  const appointment = domainState.appointments.find((entry) => entry.id === appointmentId);
  if (!appointment) {
    return null;
  }

  appointment.status = 'cancelled';
  return appointment;
}

export function rescheduleAppointment(domainState, appointmentId, update) {
  const appointment = domainState.appointments.find((entry) => entry.id === appointmentId);
  if (!appointment) {
    return { appointment: null, error: 'Appointment not found.' };
  }

  if (!update.date || !update.time) {
    return { appointment: null, error: 'Select a date and time before saving.' };
  }

  const isAvailable = isSlotAvailable(update.date, update.time, domainState.appointments, domainState.blockedSlots, {
    ignoreAppointmentId: appointmentId,
  });

  if (!isAvailable) {
    return { appointment: null, error: 'Selected slot is no longer available.' };
  }

  appointment.date = update.date;
  appointment.time = update.time;
  appointment.status = 'rescheduled';
  return { appointment, error: null };
}

export function getVisibleDayItems(domainState, selectedDate) {
  return [
    ...domainState.appointments.map((appointment) => ({
      id: appointment.id,
      date: appointment.date,
      title: `${appointment.time} · ${appointment.service}`,
      subtitle: `${appointment.clientName} · ${appointment.status}`,
      type: 'appointment',
    })),
    ...domainState.blockedSlots.map((slot) => ({
      id: slot.id,
      date: slot.date,
      title: `${slot.time} · Blocked off`,
      subtitle: slot.reason,
      type: 'blocked',
    })),
  ].filter((item) => item.date === selectedDate);
}

export function findClientAppointments(domainState, lookup) {
  const email = lookup.email.trim().toLowerCase();
  const bookingReference = lookup.bookingReference.trim().toUpperCase();

  if (!email && !bookingReference) {
    return [];
  }

  return domainState.appointments.filter((appointment) => {
    const emailMatches = email ? appointment.clientEmail.toLowerCase() === email : true;
    const referenceMatches = bookingReference ? appointment.bookingReference.toUpperCase() === bookingReference : true;
    return emailMatches && referenceMatches;
  });
}

export function getPublicBasePath(schedulingConfig) {
  return getSafeSchedulingConfig(schedulingConfig).generalPath;
}

export function getGeneralLink(schedulingConfig, origin = 'https://acuity-clone.local') {
  return `${origin}${getPublicBasePath(schedulingConfig)}`;
}

export function getDirectLinks(schedulingConfig, origin = 'https://acuity-clone.local') {
  return getEnabledServices(schedulingConfig).map((serviceName) => {
    const serviceMeta = getServiceMeta(serviceName);
    return {
      label: `${serviceName} direct link`,
      url: `${origin}${getPublicBasePath(schedulingConfig)}?service=${serviceMeta.slug}`,
      serviceName,
    };
  });
}

export function getBookingButtonSnippet(schedulingConfig, origin = 'https://acuity-clone.local') {
  const safeConfig = getSafeSchedulingConfig(schedulingConfig);
  return `<a href="${getGeneralLink(safeConfig, origin)}" class="acuity-button">${safeConfig.buttonLabel}</a>`;
}

export function getBookingBarSnippet(schedulingConfig, origin = 'https://acuity-clone.local') {
  const safeConfig = getSafeSchedulingConfig(schedulingConfig);
  return `<div class="acuity-booking-bar"><span>${safeConfig.businessName}</span><a href="${getGeneralLink(safeConfig, origin)}">${safeConfig.buttonLabel}</a></div>`;
}

export function getEmbedSnippet(schedulingConfig, origin = 'https://acuity-clone.local') {
  const safeConfig = getSafeSchedulingConfig(schedulingConfig);
  return `<iframe src="${getGeneralLink(safeConfig, origin)}" title="Book with ${safeConfig.businessName}" style="width:100%;min-height:680px;border:0;border-radius:24px;"></iframe>`;
}

export function getIcsLink(domainState, origin = 'https://acuity-clone.local') {
  return `${origin}${getSafeIntegrationsConfig(domainState?.integrationsConfig).oneWayIcs.path}`;
}

function getAnchorDate(filters) {
  switch (filters.dateRange) {
    case 'last-7':
      return addDays(BASE_DATE, -6);
    case 'this-month':
      return '2026-03-01';
    case 'last-30':
    default:
      return addDays(BASE_DATE, -29);
  }
}

export function getFilteredAppointments(domainState, filters) {
  const earliestDate = getAnchorDate(filters);
  return domainState.appointments.filter((appointment) => {
    const inDateRange = appointment.date >= earliestDate && appointment.date <= addDays(BASE_DATE, 30);
    const inCalendar = filters.calendar === 'all' ? true : appointment.calendarId === filters.calendar;
    return inDateRange && inCalendar;
  });
}

export function deriveReportRows(tab, domainState, filters, options = {}) {
  const appointments = getFilteredAppointments(domainState, filters);

  switch (tab) {
    case 'appointments':
      return appointments.filter((appointment) => appointment.status !== 'cancelled').map((appointment) => ({
        label: `${appointment.clientName} · ${appointment.service}`,
        value: `${appointment.date} ${appointment.time}`,
        detail: `${appointment.staff} · ${appointment.bookingReference}`,
      }));
    case 'revenue': {
      const totals = appointments.filter((appointment) => appointment.status !== 'cancelled' && appointment.priceCents > 0);
      return totals.map((appointment) => ({
        label: `${appointment.clientName} · ${appointment.service}`,
        value: `$${(appointment.priceCents / 100).toFixed(2)}`,
        detail: `${appointment.date} · ${appointment.calendarId}`,
      }));
    }
    case 'users': {
      const grouped = new Map();
      appointments.filter((appointment) => appointment.status !== 'cancelled').forEach((appointment) => {
        grouped.set(appointment.staff, (grouped.get(appointment.staff) || 0) + 1);
      });
      return [...grouped.entries()].map(([staff, count]) => ({
        label: staff,
        value: `${count} appointments`,
        detail: 'Derived from the filtered appointment set.',
      }));
    }
    case 'intake-forms': {
      const question = options.question || '';
      if (!question) {
        return [];
      }
      const grouped = new Map();
      appointments.forEach((appointment) => {
        const answer = appointment.intakeAnswers?.[question];
        if (answer) {
          grouped.set(answer, (grouped.get(answer) || 0) + 1);
        }
      });
      return [...grouped.entries()].map(([answer, count]) => ({
        label: answer,
        value: String(count),
        detail: `Question: ${question}`,
      }));
    }
    case 'tips':
      return appointments.filter((appointment) => appointment.tipCents > 0 && appointment.status !== 'cancelled').map((appointment) => ({
        label: `${appointment.clientName} · ${appointment.service}`,
        value: `$${(appointment.tipCents / 100).toFixed(2)}`,
        detail: `${appointment.date} · ${appointment.bookingReference}`,
      }));
    case 'import-export':
      return [{
        label: 'Appointments in current snapshot',
        value: `${domainState.appointments.length}`,
        detail: `Blocked slots: ${domainState.blockedSlots.length}`,
      }];
    default:
      return [];
  }
}

export function createReportExportPayload(tab, domainState, filters, options = {}) {
  const rows = deriveReportRows(tab, domainState, filters, options);
  if (tab !== 'import-export' && rows.length === 0) {
    return null;
  }

  return JSON.stringify({
    schemaVersion: DOMAIN_SCHEMA_VERSION,
    exportedAt: '2026-03-18T00:00:00.000Z',
    tab,
    filters,
    rows,
  }, null, 2);
}

export function createDomainExportPayload(domainState) {
  return JSON.stringify(domainState, null, 2);
}

export function createExportArtifact(kind, payload, options = {}) {
  if (typeof payload !== 'string' || !payload.trim()) {
    return { artifact: null, error: 'No export payload is available for this action.' };
  }

  const filename = kind === 'report'
    ? `${slugifyLabel(options.tab || 'report')}-report-export.json`
    : 'acuity-clone-domain-export.json';

  return {
    artifact: {
      filename,
      mimeType: JSON_EXPORT_MIME_TYPE,
      payload,
    },
    error: null,
  };
}

export function prepareImportPayload(raw, sourceLabel = 'Import source') {
  if (typeof raw !== 'string') {
    return { payload: '', error: `${sourceLabel} could not be read as text.` };
  }

  const payload = raw.trim();
  if (!payload) {
    return { payload: '', error: `${sourceLabel} is empty.` };
  }

  return { payload, error: null };
}

export function getSafeSchedulingConfig(config) {
  const defaults = createDefaultSchedulingConfig();
  const candidate = isRecord(config) ? config : {};
  const enabledServiceSlugs = Array.isArray(candidate.enabledServiceSlugs)
    ? candidate.enabledServiceSlugs.filter((slug) => serviceOptions.some((serviceName) => getServiceMeta(serviceName).slug === slug))
    : defaults.enabledServiceSlugs;

  return {
    ...defaults,
    accentColor: typeof candidate.accentColor === 'string' ? candidate.accentColor : defaults.accentColor,
    surfaceColor: typeof candidate.surfaceColor === 'string' ? candidate.surfaceColor : defaults.surfaceColor,
    fontFamily: typeof candidate.fontFamily === 'string' ? candidate.fontFamily : defaults.fontFamily,
    showBusinessLogo: typeof candidate.showBusinessLogo === 'boolean' ? candidate.showBusinessLogo : defaults.showBusinessLogo,
    showDuration: typeof candidate.showDuration === 'boolean' ? candidate.showDuration : defaults.showDuration,
    showStaffBios: typeof candidate.showStaffBios === 'boolean' ? candidate.showStaffBios : defaults.showStaffBios,
    compactHeader: typeof candidate.compactHeader === 'boolean' ? candidate.compactHeader : defaults.compactHeader,
    buttonStyle: typeof candidate.buttonStyle === 'string' ? candidate.buttonStyle : defaults.buttonStyle,
    template: typeof candidate.template === 'string' ? candidate.template : defaults.template,
    businessName: typeof candidate.businessName === 'string' ? candidate.businessName : defaults.businessName,
    headline: typeof candidate.headline === 'string' ? candidate.headline : defaults.headline,
    generalPath: typeof candidate.generalPath === 'string' && candidate.generalPath ? candidate.generalPath : defaults.generalPath,
    buttonLabel: typeof candidate.buttonLabel === 'string' ? candidate.buttonLabel : defaults.buttonLabel,
    showBookingBar: typeof candidate.showBookingBar === 'boolean' ? candidate.showBookingBar : defaults.showBookingBar,
    enabledServiceSlugs: enabledServiceSlugs.length ? enabledServiceSlugs : defaults.enabledServiceSlugs,
  };
}

export function getSafeIntegrationsConfig(config) {
  const defaults = createDefaultIntegrationConfig();
  const candidate = isRecord(config) ? config : {};
  const pickRecord = (value, fallback) => ({ ...fallback, ...(isRecord(value) ? value : {}) });

  return {
    quickbooks: pickRecord(candidate.quickbooks, defaults.quickbooks),
    zoom: pickRecord(candidate.zoom, defaults.zoom),
    googleAnalytics: pickRecord(candidate.googleAnalytics, defaults.googleAnalytics),
    zohoFlow: pickRecord(candidate.zohoFlow, defaults.zohoFlow),
    zapier: pickRecord(candidate.zapier, defaults.zapier),
    customSidebar: pickRecord(candidate.customSidebar, defaults.customSidebar),
    customConversionTracking: pickRecord(candidate.customConversionTracking, defaults.customConversionTracking),
    apiCredentials: pickRecord(candidate.apiCredentials, defaults.apiCredentials),
    webhooks: Array.isArray(candidate.webhooks)
      ? defaults.webhooks.map((fallback, index) => pickRecord(candidate.webhooks[index], fallback))
      : defaults.webhooks,
    calendarSyncProviders: defaults.calendarSyncProviders.map((fallback, index) => {
      const configuredProviders = Array.isArray(candidate.calendarSyncProviders) ? candidate.calendarSyncProviders : [];
      const matchingProvider = configuredProviders.find((provider) => isRecord(provider) && provider.id === fallback.id) || configuredProviders[index];
      return pickRecord(matchingProvider, fallback);
    }),
    oneWayIcs: pickRecord(candidate.oneWayIcs, defaults.oneWayIcs),
  };
}

export function importDomainPayload(raw) {
  try {
    const parsed = JSON.parse(raw);
    const migrated = migrateDomainState(parsed);
    if (!migrated || !isValidDomainState(migrated)) {
      return { domainState: null, error: 'Import payload is invalid for this app.' };
    }
    return { domainState: migrated, error: null };
  } catch {
    return { domainState: null, error: 'Import payload is not valid JSON.' };
  }
}

export function rotateApiKey(domainState) {
  const nextKey = `api_demo_key_${domainState.nextAppointmentNumber}_${domainState.nextBlockedSlotNumber}`;
  domainState.integrationsConfig.apiCredentials.apiKey = nextKey;
  return nextKey;
}

export function getApiDocsEntry(integrationsConfig) {
  const safeConfig = getSafeIntegrationsConfig(integrationsConfig);
  const url = safeConfig.apiCredentials.docsUrl || '';
  const isUsable = /^https?:\/\//.test(url);
  return {
    label: safeConfig.apiCredentials.helpLabel || 'API docs',
    url,
    isUsable,
    access: 'read-only',
  };
}

export function getIntegrationSurfaceDescriptors(integrationsConfig) {
  const safeConfig = getSafeIntegrationsConfig(integrationsConfig);
  return {
    quickbooks: {
      access: 'disconnected',
      mode: 'adapter',
      state: safeConfig.quickbooks.state,
    },
    zoom: {
      access: 'disconnected',
      mode: 'adapter',
      state: safeConfig.zoom.state,
    },
    zohoFlow: {
      access: 'info-only',
      mode: 'external-automation',
      state: safeConfig.zohoFlow.state,
    },
    zapier: {
      access: 'info-only',
      mode: 'external-automation',
      state: safeConfig.zapier.state,
    },
    apiDocs: getApiDocsEntry(safeConfig),
    customSidebar: {
      access: safeConfig.customSidebar.enabled ? 'editable-code' : 'gated',
      mode: 'custom-code-surface',
    },
    customConversionTracking: {
      access: safeConfig.customConversionTracking.enabled ? 'editable-code' : 'gated',
      mode: 'custom-code-surface',
    },
    calendarProviders: safeConfig.calendarSyncProviders.map((provider) => ({
      name: provider.name,
      state: provider.state,
      syncMode: 'two-way',
    })),
    oneWayIcs: {
      access: safeConfig.oneWayIcs.enabled ? 'read-only-feed' : 'disabled',
      syncMode: 'one-way-publication',
      enabled: safeConfig.oneWayIcs.enabled,
    },
  };
}
